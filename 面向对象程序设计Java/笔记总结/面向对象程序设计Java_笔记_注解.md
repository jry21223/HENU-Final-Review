注解本身没有任何逻辑，真正运行的是底层的框架
## 如何自己写一个注解

在代码中要引入官方的注解:
- `@Target(ElementType.METHOD`)表示只能贴在方法上
- **（`ElementType.ANNOTATION_TYPE`）只能修饰其他注解**
- `@Target(elemenType.TYPE)`可以贴在类上
- `ElementType.FIELD` 明确指定了一个注解**只能贴在类的“字段（Field）”上**。（在日常开发交流中，我们通常把 Field 叫作**属性**或**成员变量**。）
- `@Retention(RetentionPolicy.RUNTIME)`表示一直保持在运行时



## @data注解
当你给一个类（比如用来封装前端请求参数的 DTO，或者映射数据库的实体类）加上 `@Data` 注解后，Lombok 会在**代码编译阶段**自动帮你生成以下内容：

- 所有属性的 `get()` 和 `set()` 方法
    
- `toString()` 方法（非常方便你在控制台打印对象日志，看里面存了什么数据）
    
- `equals()` 和 `hashCode()` 方法（用于对象比较和放入集合）
    
- 一个包含所有 `final` 字段和带有 `@NonNull` 注解字段的构造函数。

## @NoArgsConstructor与@AllArgsConstructor

这两个注解和我们之前讲过的 `@Data` 是同一个家族的，都来自 **Lombok** 库。它们的作用是帮你自动生成类的**构造方法（Constructor）**。

在解释这两个注解之前，我们先快速复习一下什么是“构造方法”：它就是你在 `new` 一个对象时，最先执行的那段代码，用来对对象进行初始化。

下面我们把这两个注解拆开来看：

### 1. `@NoArgsConstructor`（无参构造）

- **字面意思**：No Arguments Constructor（没有参数的构造方法）。
    
- **它的作用**：自动帮你生成一个里面什么都不写、也不接收任何参数的空构造方法。
    

**代码对比：**

```java
// 使用注解
@NoArgsConstructor
public class Device {
    private String id;
    private int status;
}

// 等同于你手写了下面这段代码：
public class Device {
    private String id;
    private int status;
    
    // 这就是无参构造
    public Device() {
    }
}
```

- **为什么要用它？（极其重要）**
    
    这是一个**刚需**！在 Spring Boot 开发中，像 Jackson（负责把 JSON 转换成 Java 对象）或者 MyBatis-Plus（负责把数据库的一行数据转换成 Java 对象），它们在底层工作时，第一步都是**先通过无参构造方法 `new` 一个空对象出来**，然后再通过反射把数据一点点塞（set）进去。
    
    如果你没有无参构造方法，前端传来的 JSON 数据就无法转换成你的 DTO，程序直接报错（通常是 `Cannot construct instance of...`）。
    

---

### 2. `@AllArgsConstructor`（全参构造）

- **字面意思**：All Arguments Constructor（所有参数的构造方法）。
    
- **它的作用**：自动帮你生成一个包含类里面**所有属性**的构造方法。
    

**代码对比：**

```java
// 使用注解
@AllArgsConstructor
public class Device {
    private String id;
    private int status;
}

// 等同于你手写了下面这段代码：
public class Device {
    private String id;
    private int status;
    
    // 这就是全参构造
    public Device(String id, int status) {
        this.id = id;
        this.status = status;
    }
}
```

- **为什么要用它？**
    
    纯粹是为了**开发爽**。当你在写业务逻辑，需要快速创建一个对象并塞满数据时，如果没有全参构造，你得这么写：
    
```java
Device device = new Device();
device.setId("DEV-001");
device.setStatus(1);
```

有了全参构造，你只需要一行代码就搞定了：

```java
Device device = new Device("DEV-001", 1);
```

---

### ⚠️ 新手极易踩坑的“致命陷阱”

这两个注解在项目中，**通常是成对出现的**（或者配合 `@Data` 一起用）。为什么呢？这里涉及到一个 Java 基础语法的硬性规定：

1. **默认赠送规则**：如果你写了一个类，里面**一个构造方法都没写**，Java 编译器会大发慈悲，默认送你一个隐藏的无参构造方法。所以你直接 `new Device()` 是可以的。
    
2. **收回赠送规则**：但是，只要你自己手动写了**任何一个**有参数的构造方法（或者你用了 `@AllArgsConstructor` 生成了一个全参构造），Java 就会认为：“哦，你已经自己管构造方法了，那我就不送你无参构造了。”
    

**连环车祸现场：**

如果你在一个 DTO 类上，只加了 `@AllArgsConstructor` 贪图自己 `new` 对象方便，却没有加 `@NoArgsConstructor`。

结果就是：Java 收回了默认的无参构造方法。紧接着，Spring 框架在接收前端 JSON 时，找不到无参构造，直接原地崩溃。

**终极标准写法：**

所以在实际开发中，为了既能自己写代码爽，又照顾到框架底层的需求，最稳妥的写法就是把它们全贴上：
```java
@Data                 // 帮你搞定 Get/Set 和 toString
@NoArgsConstructor    // 满足 Spring 和 MyBatis 的底层反射需求
@AllArgsConstructor   // 满足你自己一行代码 new 对象的爽快感
public class DeviceDTO {
    private String id;
    private int status;
}
```
---

---

## @Documented 元注解

> [!info] 一句话总结
> `@Documented` 是 Java 中的一个**元注解**（专门贴在其他注解上的注解）。它的唯一作用是：**决定你自定义的注解，配不配出现在最终生成的 API 网页文档（JavaDoc）里。**

### 1. 核心概念

在 Java 中，定义注解本身使用的是 `@interface` 关键字。而 `@Documented` 是官方提供的一种“印章”。

- 它是一个**标记注解（Marker Annotation）**，即内部没有任何参数（没有 `name`，没有 `value`）。
- 它的源码极其简单：
  ```java
  public @interface Documented {
  }
  
  ```
### 2. 核心作用对比  

当你用 `javadoc` 工具导出项目的网页版 API 说明书时，`@Documented` 决定了注解的可见性：

| **状态**               | **表现**                                             |
| -------------------- | -------------------------------------------------- |
| **未贴** `@Documented` | 生成的文档中会**彻底隐藏**该注解，看文档的人根本不知道方法/类上加了这个标记。          |
| **贴了** `@Documented` | 生成的文档中会**完整展示**该注解及其填写的参数（如 `@Author(name="张三")`）。 |
### 3. 代码示例与效果对比

### 定义阶段

```java
import java.lang.annotation.*;

// ❌ 没贴 @Documented (普通注解)
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NormalAuthor {
    String name();
}

// ✅ 贴了 @Documented (官方认证注解)
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented // 👈 关键印章
public @interface DocumentedAuthor {
    String name();
}
```

### 使用阶段

```java
public class DeviceService {

    @NormalAuthor(name = "张三")
    public void startDevice() {
        System.out.println("设备启动");
    }

    @DocumentedAuthor(name = "李四")
    public void stopDevice() {
        System.out.println("设备停止");
    }
}
```

### 最终文档效果

> [!bug] startDevice() 的文档展现： `public void startDevice()` _(张三的普通注解被隐藏了)_

> [!success] stopDevice() 的文档展现： `@DocumentedAuthor(name = "李四")` `public void stopDevice()` _(李四的注解被原封不动地展示出来了)_

### 4. 真实应用场景 Spring Boot

在实际开发中，几乎所有大名鼎鼎的框架注解（如 Spring 的 `@RestController`, `@GetMapping`, `@Service` 等）的底层源码里，全都贴着 `@Documented`。

**原因：** 框架的设计者希望，当我们生成项目官方文档时，其他开发者能清晰地通过文档看到哪些类是 Controller，哪些接口是 GET 请求。

---

### 🔗 关联知识点

- [[Java 注解底层原理 (@interface)]]
    
- [[Java 元注解 (Meta-Annotations)]]
    
- [[AOP 面向切面编程]]
    
- [[JavaDoc 文档生成工具]]

## @TableName

它的作用是：**给 Java 实体类和 MySQL 数据库表之间，牵一根“红线”，告诉框架这个类对应着数据库里的哪张表。**

### 1. 理想情况：默认的“潜规则”（不需要注解）

MyBatis-Plus 有一个非常聪明的默认规则：**驼峰命名法转下划线**。

假设你在数据库里建了一张表叫 `device_info`。

然后在 Java 里写了一个实体类叫 `DeviceInfo`：

Java

```
@Data
public class DeviceInfo {
    private String id;
    private int status;
}
```

在这种完美对应的情况下，你**根本不需要**加 `@TableName` 注解。当你调用框架的查询方法时，MyBatis-Plus 会自动把类名 `DeviceInfo` 变成小写并加上下划线 `device_info`，然后帮你生成 SQL 语句：`SELECT * FROM device_info`。

### 2. 现实情况：名字对不上（必须用注解）

但在实际的企业级开发，或者你的“Magichine”这类稍微正规一点的项目中，数据库表的命名往往是有规范前缀的。

比如，为了区分业务模块，你们团队的数据库表可能叫 **`t_device_info`**（`t_` 代表 table）或者 **`iot_device_info`**（`iot_` 代表物联网模块）。

但是，在写 Java 代码时，为了保持代码清爽，你肯定不想把类名写成 `TDeviceInfo` 这种怪异的名字，你还是想叫它 `Device` 或 `DeviceInfo`。

**这个时候，类名和表名对不上了，框架就懵了！** 它会去数据库里找 `device_info` 表，结果报错：_Table 'xxx.device_info' doesn't exist_。

为了解决这个矛盾，**`@TableName`** 就出场了：

Java

```
import com.baomidou.mybatisplus.annotation.TableName;

@Data
@TableName("iot_device_info") // 👈 明确告诉框架：我这个类，对应数据库里的 iot_device_info 表
public class DeviceInfo {
    private String id;
    private int status;
}
```

### 3. 底层是怎么工作的？

结合我们之前聊过的注解底层原理，`@TableName` 的工作机制非常清晰：

1. **印制便利贴**：MyBatis-Plus 的开发者定义了这个 `@interface TableName`，里面有一个 `value` 属性用来接收表名。
    
2. **贴上便利贴**：你把它贴在了 `DeviceInfo` 类上，并填上了 `"iot_device_info"`。
    
3. **安检员读取**：当你的程序运行，你调用 `deviceMapper.selectById(1)` 时，MyBatis-Plus 底层的代码会利用**反射**机制，悄悄看一眼你的 `DeviceInfo` 类头上有没有贴 `@TableName`。
    
    - 如果**有**，它就把注解里填的名字拿出来，拼装 SQL：`SELECT * FROM iot_device_info WHERE id = 1`。
        
    - 如果**没有**，它就按默认规则自己猜。

## `@TableId`


就像 `@TableName` 是用来标记表名的一样，`@TableId` 是专门贴在实体类的某个属性（通常是 `id`）上的。

它的作用是向框架宣告：**“我是这张表的老大（主键），以后你要是按 ID 查数据、更新数据，就得认准我。”**

### `type = IdType.AUTO`（生成策略）

知道了谁是主键之后，下一个问题就是：**当你往数据库里插入一条新数据时，这个 ID 从哪来？**

- `IdType` 是 MyBatis-Plus 内部定义的一个枚举类（专门用来列举所有可能的 ID 生成方式）。
    
- `AUTO` 代表的就是**数据库底层的自增机制**。
    

**形象比喻：银行取号机**

你去银行办业务，不需要自己编一个号码大喊“我是 8 号”。你只需要去取号机按一下，机器会自动吐出一张“9 号”给你。

在做一些小项目或者单体架构时，用 `AUTO`（1, 2, 3...）非常舒服。但如果在未来，你要处理的是海量物联网设备的并发请求，数据库分了库分了表，`AUTO` 就不好使了（因为两个库可能都会生成 ID=1 的数据，导致冲突）。

这时候，你会看到另一种极其常见的写法：

**`@TableId(type = IdType.ASSIGN_ID)`**

这叫做**雪花算法（Snowflake）**。用了它，当你不传 ID 插入数据时，MyBatis-Plus 会在 Java 代码这一层，利用时间戳和机器码，瞬间算出一个全球唯一的、长达 19 位的超长数字（比如 `1654897451234856971`），然后再把这个数字存进数据库。这在大型分布式系统里是标配。

`@TableId(type = IdType.AUTO)

这句话的意思非常明确：**它是在告诉 MyBatis-Plus 框架，“当前这个字段是数据库表的主键（Primary Key），并且它的值不需要我手动填，交由 MySQL 数据库自己去自动递增（Auto Increment）生成。”**

```Java
@Data
@TableName("iot_device")
public class Device {
    
    // 明确主键，且由数据库自增
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String deviceName;
}
```

当你想要把一台新设备存进数据库时，你不需要（也不应该）去设置 ID：

```java
Device newDevice = new Device();
newDevice.setDeviceName("云端智联机械臂");
// 注意：我没有写 newDevice.setId(...)

deviceMapper.insert(newDevice); 
```

此时，MyBatis-Plus 生成的 SQL 会是这样：

`INSERT INTO iot_device (device_name) VALUES ('云端智联机械臂')`

MySQL 收到这条 SQL 后，一看没有传 ID，就会根据自己表里的最后一条记录（比如上次是 10），自动把这条新数据设为 11。

---

### 新手必看的“致命踩坑点”

很多新手写了 `@TableId(type = IdType.AUTO)`，一运行程序却直接报错。这是因为他们忽略了一个硬性前提：

**你的代码只是“呼叫”了自动递增，但真正干活的是 MySQL 数据库！**

所以，你在设计 MySQL 数据库表的时候，**必须**把主键字段勾选上 `AUTO_INCREMENT`（在 Navicat 软件里通常叫 `自动递增` 或 `A I`）。

如果你的数据库表本身没有设置自增，而代码里又写了 `IdType.AUTO`，插入数据时就会因为拿不到 ID 而当场崩溃。

---


如果说 `@TableName` 是建立类与表的连接，那么 `@TableField` 就是负责**类中的普通属性**与**表中列**之间的映射。

---
## @TableField

### 为什么需要 `@TableField`？

在 MyBatis-Plus 中，默认遵循“驼峰转下划线”的规则（例如 Java 属性 `userName` 自动对应数据库列 `user_name`）。但在以下四种现实场景中，你必须使用 `@TableField`：

没问题！理论听再多，都不如直接看两行真实业务里的代码来得痛快。

假设你正在为你的云端智联项目写后端接口，下面是四种在企业级开发中**必定会遇到**的 `@TableField` 真实使用场景。

### 1. 场景一：数据库字段名“不讲武德”

有时候你接手的是一个老项目，或者数据库表是别人设计的，字段名叫得非常随便。但你有代码洁癖，希望 Java 实体类保持优雅。

**业务背景**：机械臂设备表里有一个字段记录 MAC 地址，数据库里叫 `device_mac_address_str`，又长又臭。

```Java
@Data
@TableName("iot_device")
public class Device {
    @TableId(type = IdType.AUTO)
    private Long id;

    // 数据库里名字很长，但我在 Java 里只想叫它 mac
    @TableField("device_mac_address_str")
    private String mac;
}
```

**效果**：你在代码里只需要写 `device.getMac()`，非常舒服。但 MyBatis-Plus 查数据库时，会自动翻译成 `SELECT device_mac_address_str FROM iot_device`。

---

### 2. 场景二：专为 Vue 前端准备的“假字段” (`exist = false`)

这是全栈开发中最经典的操作。后端的实体类除了映射数据库，经常还要顺便客串一下 DTO（数据传输对象），把额外的数据带给前端。

**业务背景**：前端在调用登录接口时，后端查出用户信息后，还需要顺便把 JWT Token 生成好，一并塞在 User 对象里丢给前端（uni-app / Vue）。

```Java
@Data
@TableName("sys_user")
public class User {
    private Long id;
    private String username;
    
    // 数据库 user 表里绝对没有 token 这一列！
    // 加上 exist = false，告诉框架：执行 SQL 时无视它，这只是我用来传数据的临时变量。
    @TableField(exist = false)
    private String token;
}
```

**效果**：如果你不加 `exist = false`，执行 `userMapper.insert(user)` 时直接报错：_Unknown column 'token' in 'field list'_。加上之后，它就只是一个纯粹的 Java 变量了。

---

### 3. 场景三：打死也不能查出来的“敏感数据” (`select = false`)

有些数据存在数据库里，但你希望在写 `select *` 的时候，框架能刻意漏掉它，防止不小心把敏感数据返回给前端。

**业务背景**：查询用户信息列表，绝不能把密码的 Hash 值也查出来。

```Java
@Data
@TableName("sys_user")
public class User {
    private Long id;
    private String username;

    // 告诉框架：执行任何 Select 查询时，生成的 SQL 都不要包含 password 这一列
    @TableField(select = false)
    private String password;
}
```

**效果**：当你调用 `userMapper.selectById(1)` 时，生成的 SQL 就不再是 `SELECT id, username, password`，而是变成了 `SELECT id, username`。密码字段在 Java 对象里会永远是 `null`，绝对安全。

---

### 4. 场景四：解放双手的“自动打卡机” (`fill` 自动填充)

几乎所有的规范表里，都会有 `create_time`（创建时间）和 `update_time`（更新时间）这两个字段。如果每次新增或修改数据都要手动去 `set` 时间，那太痛苦了。

**业务背景**：设备状态发生变更时，自动记录变更时间。
```Java
@Data
@TableName("device_status_log")
public class DeviceStatusLog {
    private Long id;
    private String statusMsg;

    // 只有在执行 Insert (新增) 语句时，自动填入当前时间
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    // 不管是执行 Insert (新增) 还是 Update (修改) 语句时，都自动填入当前时间
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
```

**效果**：你写业务代码时，只需要 `log.setStatusMsg("设备离线")`，然后直接 `insert` 或 `update`。底层的 AOP 拦截器（你需要写一个简单的配置类来实现 `MetaObjectHandler`）会在执行 SQL 的前一毫秒，悄悄把当前的时间塞进去。

---
## @Component

### 1. 为什么需要 `@Component`？

在传统的 Java 开发中，如果你需要用一个对象，你必须自己手动去 `new` 它。 比如，你的 Controller 里需要用到处理硬件指令的 `DeviceUtil` 工具类：

```Java
// 传统写法：自己 new 对象，自己管理
DeviceUtil util = new DeviceUtil();
util.sendCmd("开灯");
```

这看起来没啥大毛病，但如果你的项目里有 1000 个类互相依赖呢？如果 `DeviceUtil` 本身又需要用到数据库连接池呢？你得像套娃一样，一层一层去 `new`，一旦其中一个环节出问题，整个系统就崩溃了。这就是所谓的 **“高耦合”**。

Spring 框架的核心卖点 **IoC（控制反转）** 就是为了消灭手动 `new` 对象。 只要你在 `DeviceUtil` 这个类的头上贴上 `@Component`：

```Java
@Component // 👈 贴上入库登记表
public class DeviceUtil {
    public void sendCmd(String cmd) { ... }
}
```

**奇迹就发生了：** 当 Spring Boot 启动时，它会像一个不知疲倦的仓库管理员，地毯式地扫描你项目里的每一个文件夹。 只要它看到哪个类头上贴了 `@Component`，它就会说：“哦，这是一个需要我来管理的组件！”然后它会自动帮你 `new` 出这个对象，并把它妥善存放在自己的**“Spring IoC 容器（仓库）”**里。

以后当你想用这个工具类时，只需要用 `@Autowired` 伸手找 Spring 要就行了，你再也不用自己去 `new` 了！

### 2. `@Component` 的“家族体系”

其实，你早就见过 `@Component` 的“子子孙孙”了。

在 Spring 的设计理念中，为了让代码的结构更清晰，开发者基于 `@Component` 这个老祖宗，衍生出了三个带有“职业色彩”的子注解。它们在底层的核心功能**完全一模一样**（都是把类交给 Spring 管理），只是用来区分这个类在系统里扮演什么角色：

1. **`@RestController` / `@Controller`**：专门贴在用来和前端打交道（接收 HTTP 请求）的类上。
    
2. **`@Service`**：专门贴在处理核心业务逻辑（比如“处理用户下单逻辑”、“计算机械臂抓取坐标”）的类上。
    
3. **`@Repository` / `@Mapper`**：专门贴在和数据库打交道（执行 SQL）的类上。
    

如果你的一个类既不是 Controller，也不是 Service，也不是 Mapper，它仅仅是一个普通的工具类（比如发送邮件的类、解析特定协议的类），那你就贴上最基础的 **`@Component`** 即可。
只要加了 `@Component`，Spring 默认情况下只会为这个类在内存里创建一个**单例（Singleton）**，不管你在多少个地方 `@Autowired` 注入它，大家用的其实都是同一个对象。

### component的适用场景

在 Spring Boot 开发中，判断一个类要不要加 `@Component`（或它的衍生注解 `@Service`、`@RestController` 等），核心判断标准只有一个：**这个类需不需要 Spring 帮你管理？它需不需要用到 Spring 里的其他资源？**

为了让你在以后写代码时能做到“肌肉记忆”，我们把日常开发中遇到类的分为 **三大适用场景** 和 **一个绝对禁区**。

---

#### 一、 经典适用场景 1：各种“实现类”（Implementation）

这是最常见的场景。在正规的 Java 开发中，我们通常提倡“面向接口编程”（就像前面提到的 `Camera` 接口和 `DjiCamera` 实现类）。

- **业务逻辑实现类**：比如你写了一个 `DeviceServiceImpl` 去实现 `DeviceService` 接口。这个实现类里充满了核心的业务运算、数据库调用。你**必须**给它贴上 `@Service`（`@Component` 的子类），否则 Controller 根本无法注入它。
    
- **策略模式实现类**：就像前面的多个摄像头品牌，你需要把大疆、索尼的实现类全都加上 `@Component`，交由 Spring 统一调遣。
    

#### 二、 经典适用场景 2：工具类（Utility）—— 这里有分水岭！

很多新手喜欢给所有的工具类都加上 `@Component`，这其实是错的。工具类分两种情况：

**情况 A：需要 Spring 帮忙的工具类（必须加 `@Component`）**

假设你写了一个 `JwtTokenUtil`（用于生成和解析登录 Token）。

这个工具类在生成 Token 时，需要读取 `application.yml` 里的密钥，或者需要去 Redis 里查一下 Token 是否过期。也就是说，**它需要注入别人的能力**（用到 `@Value` 或 `@Autowired`）。

👉 **结论**：必须加 `@Component`，否则里面的注入全都会失效，报 NullPointerException。

**情况 B：纯粹的静态工具类（绝对不要加 `@Component`）**

假设你写了一个 `StringUtil`，里面只有一个方法：`public static boolean isBlank(String str)`（判断字符串是否为空）。

这个方法只要传个参数进去，它就能算出结果，它根本不需要连数据库，也不需要读配置文件。

👉 **结论**：千万别加 `@Component`。直接用 `static` 修饰方法，哪里需要就直接 `StringUtil.isBlank()` 调用，不要给 Spring 容器增加无谓的负担。

#### 三、 经典适用场景 3：幕后的“特种部队”（还有什么？）

除了上面两个，系统里还有很多默默干活的类，它们也**必须**贴上 `@Component` 让 Spring 来管理：

1. **AOP 切面类（Aspect）**：
    
    还记得咱们之前手写的那个拦截 `@DeviceOperation` 注解，用来算耗时、打日志的“安检员”类吗？切面类必须贴 `@Component`，否则 Spring 根本不知道有个安检员存在，拦截也就无从谈起。
    
2. **定时任务类（Scheduled Tasks）**：
    
    比如你想让系统“每天凌晨 2 点自动清理失效的设备日志”。你会写一个类，里面写个方法贴上 `@Scheduled(cron = "0 0 2 * * ?")`。这个类必须是 `@Component`，Spring 的定时任务引擎才能扫描到它并按时触发。
    
3. **拦截器与过滤器（Interceptor / Filter）**：
    
    如果你写了一个全局拦截器，用来拦截所有未登录的 HTTP 请求。这个拦截器也必须是一个 Bean。
    
4. **消息队列监听器（MQ Listener）**：
    
    如果你的战车系统接入了 RabbitMQ 或 MQTT，专门写了一个类用来随时接收边缘设备发来的心跳数据。这个监听类必须交给 Spring。
    

---

#### 🚫 绝对禁区：千万不能加 `@Component` 的地方

在使用 `@Component` 时，有一个极其重要的底层规则：**Spring 默认创建的对象都是“单例模式（Singleton）”的。**

意思是，整个系统从启动到关闭，Spring 仓库里永远只有一个 `DjiCamera` 对象，全公司的请求都在共用这一个对象。

正因为如此，**任何用来“承载数据”的类，绝对不能加 `@Component`！**

- **实体类（Entity / POJO）**：比如贴了 `@TableName("iot_device")` 的 `Device` 类。每一台设备都是独立的数据，你每次查数据库都会 `new` 出成百上千个不同的 Device 对象，绝不能让 Spring 把它弄成唯一的单例。
    
- **数据传输对象（DTO / VO）**：比如接收前端登录账号密码的 `LoginDTO`。张三和李四同时登录，那是两份完全不同的数据，必须独立 `new` 出来。
    

**总结一个口诀帮你记牢：**

干活的类（Controller、Service、切面、需要注入的工具），贴上 `@Component` 进仓库；

装数据的类（DTO、实体类），贴上 `@Data` 自己 `new`。

### “当 Spring 容器里有多个同一个接口的实现类时，它怎么处理冲突？”

如果我们有两个类，`DjiCamera`（大疆）和 `SonyCamera`（索尼），它们都实现了 `Camera` 接口，并且头上都贴了 `@Component`。

此时，如果你的战车里这么写：
```java
@RequiredArgsConstructor
public class Magichine {
    private final Camera camera; // Spring 懵了：你要哪个？
}
```

**Spring 启动时会直接崩溃报错！**

控制台会抛出一个极其著名的异常：`NoUniqueBeanDefinitionException`（没有找到唯一的 Bean 定义异常）。Spring 会委屈地告诉你：“你需要 1 个 Camera，但我找到了 2 个，我不知道该给谁，我罢工了。”

为了解决这个问题，Spring 给我们提供了**三大锦囊**。

---

#### 锦囊一：贴上 `@Primary`（立太子）

这是最简单、最常用的方案。你作为架构师，可以在这多个摄像头中，指定一个**默认的首选方案**。

给大疆摄像头多贴一个 `@Primary` 注解：
```java
@Component
@Primary  // 👈 告诉 Spring：如果有冲突，优先选我！
public class DjiCamera implements Camera { ... }

@Component
public class SonyCamera implements Camera { ... }
```

**结果**：现在 Spring 看到 `private final Camera camera;` 时，虽然有两个选项，但它看到大疆头上贴着 `@Primary`，就会毫不犹豫地把大疆注入给战车。索尼就成了备胎，默默待在容器里。

#### 锦囊二：使用 `@Qualifier`（指名道姓）

如果你不想立太子，或者你在不同的地方需要用不同的摄像头（比如战车前置用大疆，后置用索尼），你可以在注入的时候**精确点名**。

每一个被 Spring 管理的组件，都有一个名字（Bean Name）。默认情况下，名字就是**类名首字母小写**（比如 `DjiCamera` 的名字就是 `djiCamera`）。

```java
@Component
public class Magichine {
    
    // 👈 告诉 Spring：别的我不要，我就要名字叫 sonyCamera 的那个！
    @Autowired
    @Qualifier("sonyCamera") 
    private Camera camera; 

    // 注意：如果是 @RequiredArgsConstructor 模式，写在参数上
    // public Magichine(@Qualifier("sonyCamera") Camera camera) { ... }
}
```

**结果**：Spring 会无视接口类型的冲突，直接去仓库里找名字叫 `sonyCamera` 的那个对象送过来。

#### 锦囊三：修改变量名（Spring 的隐藏彩蛋）

如果你觉得写 `@Qualifier` 太麻烦了，Spring 还有一个非常聪明的“潜规则”（按名称自动装配）：**如果你不指定名字，Spring 会偷偷把你的“变量名”当成“Bean 名字”去仓库里搜。**

```java
@RequiredArgsConstructor
public class Magichine {
    // 👈 注意看变量名！我不叫 camera 了，我叫 djiCamera
    private final Camera djiCamera; 
}
```

**结果**：Spring 看到这里有两个 Camera，不知道该选谁。但是它突然发现，你的变量名正好叫 `djiCamera`！于是它去仓库里一看，哎？正好有个组件的名字也叫 `djiCamera`。对上了！自动注入成功。

---

为了让你彻底看透 Spring 遇到冲突时的决策逻辑（面试的时候如果能说出这套流程，面试官绝对眼前一亮），我做了一个“Spring 冲突决策模拟器”。

你可以随意调整左边两个相机的状态（加不加 `@Primary`），然后调整右边战车的注入方式，点击“启动”看看连线结果。

#### 💡 进阶终极玩法：我全都要！

在真实的复杂业务里，如果真的有多个摄像头，我们有时候不是要选“哪一个”，而是“我全都要”。

比如，你做了一个战车自检程序，想把插在车上的所有摄像头都测试一遍。

你可以让 Spring 把它们全部打包成一个列表（List）**或**字典（Map）送给你：
```java
@RequiredArgsConstructor
public class Magichine {
    // 👈 见证奇迹！我用一个 List 来接收
    private final List<Camera> allCameras; 

    public void testAll() {
        for (Camera cam : allCameras) {
            cam.capture(); // 大疆和索尼都会被执行一遍！
        }
    }
}
```

这种“全都要”的注入方式，在企业级开发中极其强大，通常用来实现“策略模式”（比如根据前端传来的不同参数，自动去 Map 里找到对应的处理器去执行）。

## @RequireArgsConstructor
如果你在看最新的 Spring Boot 开源项目，或者公司里的大佬写的代码，你会发现满屏幕都是 **`@RequiredArgsConstructor`**，而曾经风光无限的 `@Autowired` 几乎绝迹了。

如果说 `@AllArgsConstructor` 是“全员无差别对待”，那么 `@RequiredArgsConstructor` 就是**“只为 VIP 客户服务”**。

### 1. 字面意思：为“必须”的字段生成构造方法

什么叫“必须（Required）”的字段？在 Java 里，只有两种字段被认为是必须在创建对象时就赋值的：

1. **被 `final` 修饰的变量。**
    
2. **头上贴了 `@NonNull` 注解的变量。**
    

**代码对比：**

```java
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class Device {
    // VIP 1：加了 final，必须被初始化
    private final String deviceId; 
    
    // VIP 2：加了 @NonNull，也不能为空
    @NonNull
    private String type;
    
    // 普通平民：没加 final，会被这个注解无视
    private int status; 
}
```

上面加了注解，等同于你手写了下面这段代码：

```java
public class Device {
    private final String deviceId;
    @NonNull
    private String type;
    private int status;

    // lombok 只为这两个 VIP 字段生成了构造方法！status 被忽略了。
    public Device(String deviceId, @NonNull String type) {
        this.deviceId = deviceId;
        this.type = type;
    }
}
```

---

### 2. 它的“杀手级”应用场景：Spring Boot 依赖注入

在单纯的 Java 实体类里，这个注解用得并不多。**它真正称王称霸的地方，是在 Spring Boot 的 Controller 和 Service 层！**

假设你的 `DeviceService` 需要用到三个 Mapper 来查数据库。

**以前的旧写法（字段注入，疯狂写 `@Autowired`）：**
```java
@Service
public class DeviceService {
    @Autowired
    private DeviceMapper deviceMapper;
    
    @Autowired
    private LogMapper logMapper;
    
    @Autowired
    private UserMapper userMapper;
}
```

_痛点：代码很臃肿，而且 Spring 官方其实早就**非常不推荐**这种 `@Autowired` 字段注入的方式了（容易导致循环依赖、写单元测试很麻烦）。_

**现在的神级写法（构造器注入 + Lombok）：**

```java
@Service
@RequiredArgsConstructor // 👈 灵魂注解
public class DeviceService {
    // 只需要加 final，其他什么都不用管！
    private final DeviceMapper deviceMapper;
    private final LogMapper logMapper;
    private final UserMapper userMapper;
}
```

### 3. 底层到底发生了什么魔法？

为什么加个 `final` 和 `@RequiredArgsConstructor`，Spring 就能自动把 Mapper 注入进来呢？这里有两个机制在完美配合：

1. **Lombok 的功劳**：`@RequiredArgsConstructor` 看到你写了三个 `final` 变量，于是自动在底层帮你生成了一个包含这三个参数的构造方法。
    
2. **Spring 的潜规则**：Spring 4.3 版本之后出了一个新规定——**如果一个类只有一个构造方法，那么 Spring 会自动为这个构造方法的参数进行注入（相当于隐式地加了 `@Autowired`）。**
    

**总结：**

`@RequiredArgsConstructor` + `final` 属性，是目前 Spring Boot 后端开发中**最优雅、最规范的依赖注入（DI）方式**。它不仅让代码极其清爽，而且因为使用了 `final`，保证了这些组件一旦注入进来就绝不会被意外篡改，极其安全。



## `@Value` 
@value可以被称为 Spring Boot 里的“超级吸管”。

它的核心作用非常专一：**专门负责把配置文件（比如 `application.yml` 或 `application.properties`）里的数据，吸出来，然后赋值给 Java 代码里的变量。**

还记得我们最开始跑项目时，聊到过要在 `application.yml` 里配置微信 AppSecret 和腾讯云密钥吗？配置好之后，Java 代码怎么拿到这些密钥呢？靠的就是 `@Value`。

### 1. 为什么不直接写在代码里？（解决什么痛点）

如果你不使用 `@Value`，你可能会直接把密钥写死在代码里（硬编码）：

```
public class WeChatUtil {
    // ❌ 极其糟糕的写法
    private String appSecret = "wx1234567890abcdef"; 
}
```

这种写法的灾难性在于：如果哪天微信的密钥换了，或者你想把代码开源到 GitHub 上，你得满地找这行代码去修改，而且还得**重新编译整个项目**。如果一不小心把带真实密钥的代码传上云端，甚至会引发重大的安全事故。

所以，规范的做法是：**把会变动的数据、敏感的配置，统统写在外部的 `application.yml` 里，然后用 `@Value` 注入到代码中。**

### 2. 标准使用场景与语法

假设你的 `application.yml` 里是这么写的：

```YAML
tencent:
  cloud:
    secret-id: AKID_YOUR_REAL_ID
    # 假设还有一个配置控制是否开启调试模式
    debug-mode: true
```

那么在你的 Java 代码里，你就可以用 `@Value` 配合 `${}` 语法把它吸出来：

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component // 👈 极其重要！必须是 Spring 管理的类
public class TencentCloudUtil {

    // 用 ${} 把 yml 里的层级路径包裹起来
    @Value("${tencent.cloud.secret-id}")
    private String secretId;

    // 它不仅能读取字符串，还能自动帮你转换成 boolean 或 int
    @Value("${tencent.cloud.debug-mode}")
    private boolean isDebug;

    public void printConfig() {
        System.out.println("拿到的密钥是：" + secretId);
        System.out.println("调试模式是否开启：" + isDebug);
    }
}
```

### 3. 给吸管加个“备胎”（默认值机制）

在团队开发中，你可能会遇到这种情况：你代码里写了 `@Value` 去读取某个配置，但是负责写 yml 配置文件的同事忘记加这个配置了。此时 Spring 启动会直接报错崩溃（`Could not resolve placeholder...`）。

为了防止程序轻易崩溃，你可以给 `@Value` 设置一个**兜底的默认值**。

语法很简单，在花括号里面加个冒号 `:`。
```java
// 如果 yml 里没配置 timeout，就默认使用 5000（毫秒）
@Value("${tencent.cloud.timeout:5000}")
private int timeout;

// 如果 yml 里没配置 prefix，就默认使用一个空字符串
@Value("${tencent.cloud.prefix:}")
private String prefix;
```

### 4. ⚠️ 新手必踩的三个“死亡陷阱”

很多人刚学 `@Value` 时，死活读不到数据（读出来全是 `null`）。你一定要检查以下三点：

1. **类没有交由 Spring 管理**：
    
    这是翻车率最高的！`@Value` 是 Spring 提供的功能，如果你所在类的头上没有 `@Component`（或 `@Service`、`@RestController`），或者你是在别的地方自己手动 `new` 出来的这个对象，那么 `@Value` 就完全失效，取到的永远是 `null`。
    
2. **把 `@Value` 用在了 `static` 变量上**：
    
    Spring 的依赖注入是基于“对象”的。静态变量（`static`）属于类本身，Spring 在初始化时默认是不会给 `static` 变量注入值的。如果强行贴上去，结果也是 `null`。
    
3. **拼写错误或层级错误**：
    
    yml 文件对缩进要求极高。如果 yml 里是 `tencent.cloud.secret-id`，你的代码里写成了 `@Value("${tencent.secret-id}")`，中间少了一层，也是绝对读不到的。
    

**总结一下：**

`@Value` 就是前后端/软硬件开发中配置管理的灵魂。它把**代码逻辑**和**环境配置**彻底拆分开了。你在线下自己电脑测试时，yml 里写测试数据库的密码；等项目打包发布到服务器上时，只需要给服务器换一个线上的 yml 文件即可，Java 代码一行都不用改。
