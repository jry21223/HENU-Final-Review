
在现代前后端分离项目（比如你的 Spring Boot + Vue/小程序 架构）中，**JWT（JSON Web Token）** 是目前最流行、也是最核心的身份认证（登录）解决方案。

你可以把它通俗地理解为一张“数字游乐园的 VIP 通行手环”。

### 1. 传统 Session 登录 vs JWT 登录

为了明白 JWT 有多好用，我们先看看以前是怎么做的：

- **以前的 Session 模式（记账模式）**：
    
    你输入账号密码登录，服务器验证通过后，在自己的“小本本”（内存或 Redis）里记下：“用户 A 已登录，发给他一个牌号 SessionId=123”。然后把 123 存到你的浏览器 Cookie 里。
    
    之后你每次发请求，服务器都要翻开小本本查一下：“123 是谁？哦，是用户 A。”
    
    _痛点_：如果你的后端部署了多台服务器（集群），第一台机器记了小本本，第二台没记，你请求发到第二台就得重新登录。
    
- **现在的 JWT 模式（自证清白模式）**：
    
    你输入账号密码登录，服务器验证通过后，直接给你颁发一张**防伪证书（JWT）**，上面写着：“此人是用户 A，权限是管理员，证书有效期到明天”。然后服务器就把你忘了（**无状态**）。
    
    之后你每次发请求，只要在请求头（Header）里带着这张证书，服务器拿过来看一眼，验证一下防伪印章没有被伪造，就直接放行。服务器再也不需要拿个小本本记你的状态了。
    

### 2. JWT 的“三段式”结构

一个真实的 JWT 字符串长这样（通过两个英文句号 `.` 分隔成三部分）：

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` **.** `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hZ2ljaGluZSBBZG1pbiJ9` **.** `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

这三段分别代表：**头部（Header） . 载荷（Payload） . 签名（Signature）**

#### 第一部分：Header（头部）

记录了这个令牌的元数据，通常包含两部分信息：令牌的类型（JWT）和使用的签名算法（比如 HMAC SHA256，简称 HS256）。

它会被转换成 Base64 编码，构成 JWT 的第一段。

#### 第二部分：Payload（载荷）

这是 JWT 的**核心业务数据区**。你通常会把用户的 ID、角色权限、签发时间、过期时间存放在这里。

它也会被转换成 Base64 编码，构成 JWT 的第二段。

#### 第三部分：Signature（防伪签名）

这是 JWT 绝对不能被伪造的秘密武器。

它的生成公式是：`HMACSHA256(Base64(Header) + "." + Base64(Payload), 你的服务器私钥Secret)`。

也就是说，服务器用自己偷偷藏在 `application.yml` 里的那个只有自己知道的密钥，对前两部分的数据算了一个哈希值出来，贴在最后面。

---

### 3. ⚠️ 必须要懂的核心安全常识（极其重要）

很多刚学开发的同学会犯一个致命错误：**把用户的密码存进 JWT 的 Payload 里。**

请一定要记住：**JWT 的 Header 和 Payload 只是经过了 Base64 编码，并没有加密！并没有加密！并没有加密！**

Base64 是一种公开的编码方式，任何人只要拿到你的 JWT 字符串，丢到一个解码网站上，就能一秒钟看光你 Payload 里存的所有明文数据。

**既然能被看光，为什么还说它安全？**

因为第三部分（Signature）的存在。黑客可以把 Payload 里的 `{"role": "user"}` 改成 `{"role": "admin"}`，重新 Base64 编码发给服务器。

但是，当服务器接到请求时，会用自己的**私钥 Secret** 对被篡改过的前两部分重新计算一次签名。由于黑客不知道服务器的 Secret，他算出来的签名，和被篡改数据的签名绝对对不上！服务器一看防伪印章破裂，直接报错拦截（401 Unauthorized）。

**总结：JWT 防止的是“数据被篡改”，而不是防止“数据被看见”。** 所以 Payload 里只能放不敏感的信息（比如 UserID）。

---

为了让你直观地感受这三部分是如何动态组合并防止篡改的，我为你生成了一个 **JWT 可视化解码/生成模拟器**。你可以尝试修改里面的 Payload 数据，看看右侧生成的最终 Token 会发生什么变化。

在你的实际项目中，你一般是用哪个库来生成 JWT 的？是 `jjwt` 还是 `auth0` 的库？遇到过跨域（CORS）时拿不到请求头里 Token 的坑吗？

## 生成密钥代码

将yaml中的secretkey转化为32字节长度的字符数组
```java

// 获取密钥的方法
private SecretKey getKey() {
    
    // 步骤 1：将字符串转换成字节数组
    // 假设你的 secret 是 "123456"
    byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
    
    // 步骤 2：检查长度是否达标（小于 32 字节）
    // 字母/数字在 UTF-8 下一个字符占 1 个字节。"123456" 只有 6 个字节，满足 < 32 的条件。
    if (keyBytes.length < 32) {
        
        // 步骤 3：创建一个固定长度为 32 的新数组
        // 在 Java 中，new byte[32] 出来的数组，里面默认全都是 0（补零）。
        byte[] padded = new byte[32];
        
        // 步骤 4：数组拷贝（核心补救动作）
        // 它的意思是：把原来那 6 个字节的 "123456"，原封不动地抄到新数组 padded 的最前面。
        // 剩下的 26 个位置，依然保持为 0。
        System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
        
        // 步骤 5：狸猫换太子
        // 将原本只有 6 个字节的变量，替换成了强行拉长到 32 个字节的新变量。
        keyBytes = padded;
    }
    
    // 步骤 6：生成最终的 HMAC 密钥对象
    // 交给 jjwt 框架，将这个 32 字节的数组转换为一个可以用于 HS256 算法的 SecretKey 对象。
    return Keys.hmacShaKeyFor(keyBytes);
}
```

### 生成jwt

```java
public String generateToken(Long userId, String openid) {  
    Date now = new Date();  //获取服务器当前的系统时间
    return Jwts.builder()  
            .subject(String.valueOf(userId))  
            .claim("openid", openid)  
            .issuedAt(now)  
            .expiration(new Date(now.getTime() + expiration))  
            .signWith(getKey())  
            .compact();  
}
```
#### .subject
- **含义**：设置 `sub` (Subject，主题/主体)。
    
- **通俗解释**：这是国际 JWT 规范里专门预留用来放“用户唯一标识”的字段。这里把你们数据库里的 `userId`（比如 1001）转成字符串塞了进去。服务器以后解析出这个 Token，第一反应就是去看 `subject`，就知道是哪个用户来了。
#### .claim
- **含义**：添加自定义字段（Claim）。
    
- **通俗解释**：除了官方规定的字段，你还可以随便往里面加自己的业务数据。这里把你从小程序端获取到的微信 `openid` 塞了进去。
- 这样方便直接从token里面拿取openid 的数据了，省的每次都要查询

##### 大小受什么制约?

JWT 最终会拼进 HTTP 请求头：

而浏览器/服务器对请求头大小有限制：

- **Nginx 默认**：8KB
- **Tomcat/Spring Boot 默认**：8KB
- **一般建议**：整个 JWT 控制在 **4KB 以内**

你当前项目里只存了 `userId` 和 `openid`，大概两三百字节，属于正常用法。

---

##### 什么该放、什么不该放

|该放 claim|不该放 claim|
|---|---|
|`userId`|头像 URL（太长，一次调用就变了）|
|`openid`|个人简介文本|
|角色标签 `"member"`|整个 User 对象的 JSON|
|一个权限枚举值|列表数据|

原则：**只放那种"每次请求都要用、且不经常变"的小数据**，省掉查数据库的 IO。
#### .issuedAt(now)

- **含义**：设置 `iat` (Issued At，签发时间)。
    
- **通俗解释**：在通行证上盖一个时间戳，记录这张证是**在什么时间点发放的**。
#### .signWith(getKey())  
- **含义**：使用指定的密钥和算法进行签名。
    
- **通俗解释**：这是整个 JWT 最核心的安全防线！这里调用了咱们刚刚拆解过的 `getKey()` 方法，拿到了那个 32 字节的 `SecretKey`。`jjwt` 框架会自动使用这个密钥，把前面的 Header 和 Payload 揉在一起算出一个防伪哈希值，作为 JWT 的第三段贴在最后面。
#### .compact();
- **含义**：压缩并生成最终的字符串。
    
- **通俗解释**：所有信息都填完了，印章也盖了。`compact()` 会把前面的所有对象信息，统统转换成 Base64Url 编码，然后用 `.` 拼接起来，最终吐出那个类似 `eyJhb...` 的长字符串返回给前端。
