# 第5章 Java API 笔记

> 来源：第5章 Java API.pptx (135页)  
> 涵盖：String/StringBuffer/StringBuilder、System/Runtime、Math/Random、日期时间、包装类、正则表达式

---

## 目录

- [5.1 字符串类](#51-字符串类)
- [5.2 System 类 & Runtime 类](#52-system-类--runtime-类)
- [5.3 Math 类 & Random 类](#53-math-类--random-类)
- [5.4 日期时间类](#54-日期时间类)
- [5.5 包装类](#55-包装类)
- [5.6 正则表达式](#56-正则表达式)

---

## 5.1 字符串类

Java 提供三个字符串类，都在 `java.lang` 包（无需导包）：

| 类 | 特点 | 适用场景 |
|---|------|---------|
| `String` | 不可变常量 | 少量字符串操作 |
| `StringBuffer` | 可变，线程安全 | 多线程大量拼接 |
| `StringBuilder` | 可变，非线程安全但最快 | 单线程大量拼接 |

### 5.1.1 String 类

**创建方式：**

```java
String s1 = "abc";                          // 直接赋值
String s2 = new String("abc");             // 构造方法
char[] ch = {'a', 'b', 'c'};
String s3 = new String(ch);                // 从字符数组
```

**常用方法五大类：**

#### ① 获取功能

| 方法 | 说明 |
|------|------|
| `length()` | 获取字符串长度 |
| `charAt(int index)` | 获取指定位置的字符 |
| `indexOf(String str)` | 获取子串第一次出现的位置 |
| `lastIndexOf(String str)` | 获取子串最后一次出现的位置 |
| `substring(int begin, int end)` | 截取子串，左闭右开 `[begin, end)` |

>[!warning]- StringIndexOutOfBoundsException
>访问字符串中不存在的索引时会抛出此异常。
>```java
>String s = "abc";
>s.charAt(5);   // ❌ 索引越界！
>s.substring(0, 10);  // ❌ 超出长度！
>```

#### ② 转换操作

```java
"hello".toCharArray()        // 转字符数组 → ['h','e','l','l','o']
"hello".toUpperCase()        // 转大写 → "HELLO"
"HELLO".toLowerCase()        // 转小写 → "hello"
String.valueOf(123)          // 任意类型 → "123"
```

#### ③ 替换和去空格

```java
"hello".replace('l', 'x')    // → "hexxo"（替换字符或字符串）
" hello ".trim()             // → "hello"（⚠️ 只去两端空格！）
```

>[!warning]- trim() 去不掉中间空格
>`trim()` 只能去除字符串两端的空白字符，中间的空格不会受影响。
>```java
>" a b c ".trim()    // → "a b c"  （中间空格还在！）
>```
>要去掉中间空格，用 `replace(" ", "")`。

#### ④ 判断操作

| 方法 | 说明 |
|------|------|
| `equals(Object obj)` | 比较内容是否相等 |
| `equalsIgnoreCase(str)` | 忽略大小写比较 |
| `startsWith(str)` | 是否以指定字符串开头 |
| `endsWith(str)` | 是否以指定字符串结尾 |
| `contains(str)` | 是否包含指定字符串 |
| `isEmpty()` | 是否为空字符串 |

>[!danger]- 大坑：`==` vs `equals()`
>`==` 比较的是**内存地址**，`equals()` 比较的是**字符串内容**。
>```java
>String s1 = new String("abc");
>String s2 = new String("abc");
>
>s1 == s2          // false —— 两个不同对象，地址不同
>s1.equals(s2)     // true  —— 内容相同
>```
>**记忆口诀：`==` 看是不是同一个对象，`equals` 看内容一不一样。**

>[!note]- String 常量池
>用双引号直接创建的字符串会放入常量池，相同内容的字符串会复用同一个对象。
>```java
>String s1 = "abc";
>String s2 = "abc";
>s1 == s2   // true！常量池中只有一个 "abc"
>```

#### ⑤ 截取和分割

```java
"hello".substring(1, 4)          // → "ell"（索引 1~3）
"a,b,c".split(",")               // → ["a", "b", "c"]
```

---

### 5.1.2 StringBuffer 类（线程安全的可变字符串）

> String 是**常量**，创建后内容和长度都不能改。需要修改时，用 StringBuffer。

```java
StringBuffer sb = new StringBuffer("hello");

sb.append(" world");          // 追加 → "hello world"
sb.insert(5, " Java");        // 插入 → "hello Java world"
sb.delete(0, 5);              // 删除 → "Java world"
sb.replace(0, 4, "Hello");    // 替换 → "Hello world"
sb.reverse();                 // 反转 → "dlrow olleH"
sb.toString();                // 转回 String
```

> StringBuffer 直接在原对象上修改，**不产生新对象**，拼接效率远高于 String 用 `+`。

>[!note]- String 用 `+` 拼接为什么慢？
>因为 String 是不可变的，每次 `+` 都会创建一个新的 String 对象：
>```java
>String s = "a";
>s = s + "b";   // 创建了新对象，原来的 "a" 变成垃圾
>s = s + "c";   // 又创建了新对象
>// 拼接 1000 次 = 创建 1000 个垃圾对象 → 内存浪费 + GC 压力
>```
>StringBuffer 内部是一个可扩容的 char 数组，追加直接往数组里塞，不产生垃圾。

**String 和 StringBuffer 的关键区别：**

| | String | StringBuffer |
|---|--------|-------------|
| 可变性 | ❌ 不可变 | ✅ 可变 |
| `+` 拼接 | ✅ 可以 | ❌ 不可以 |
| `equals()` | ✅ 比较内容 | ❌ 比较地址（未重写） |

---

### 5.1.3 StringBuilder 类（非线程安全但最快）

三兄弟终极对比：

| | String | StringBuffer | StringBuilder |
|---|--------|-------------|---------------|
| 可变性 | ❌ | ✅ | ✅ |
| 线程安全 | ✅ | ✅（方法加 `synchronized`） | ❌ |
| 速度 | 最慢 | 中等 | **最快** |
| 使用场景 | 少量操作 | 多线程 | **单线程大量拼接** |

>[!note]- 为什么 StringBuilder 比 StringBuffer 快？
>StringBuffer 的每个方法都加了 `synchronized` 锁。加锁/释放锁本身有开销。  
>StringBuilder 去掉了所有锁，单线程场景下没有额外开销，所以更快。
>
>**选择口诀：**
>- 字符串不怎么变 → `String`
>- 大量拼接 + 多线程 → `StringBuffer`
>- 大量拼接 + 单线程 → `StringBuilder`

---

## 5.2 System 类 & Runtime 类

### 5.2.1 System 类

> 全静态方法，直接用类名调用，不需要 new。

| 方法 | 说明 |
|------|------|
| `System.out.println()` | 标准输出（每天都在用） |
| `System.currentTimeMillis()` | 当前时间戳（1970-01-01 至今的毫秒数） |
| `System.arraycopy(src, srcPos, dest, destPos, length)` | 数组拷贝 |
| `System.gc()` | 建议 JVM 立即进行垃圾回收 |
| `System.getProperties()` | 获取所有系统属性 |
| `System.getProperty("os.name")` | 获取指定系统属性 |
| `System.exit(0)` | 终止 JVM |

#### arraycopy —— 5 个参数

```java
// 参数：(源数组, 源起始位置, 目标数组, 目标起始位置, 拷贝个数)
System.arraycopy(src, 0, dest, 0, 3);
// 把 src 的前 3 个元素拷贝到 dest 的开头
```

> **记忆法**：「从哪拷，从哪开始，拷到哪，从哪放，拷几个」

#### gc() —— 垃圾回收

```java
System.gc();  // 建议 JVM 立即回收垃圾（只是建议，不保证立刻执行）
```

>[!note]- 垃圾回收机制原理
>当一个对象不再被任何引用指向时，它就成了"垃圾"。
>JVM 的垃圾回收器会自动回收垃圾对象占用的内存。
>`System.gc()` 只是**建议**JVM 立刻回收，JVM 不一定马上执行。
>
>对象被回收前，它的 `finalize()` 方法会被调用（JDK 9 已废弃，不推荐使用）。

---

### 5.2.2 Runtime 类

> **单例模式**：每个 Java 程序只有一个 Runtime 实例，不能直接 `new`。

```java
Runtime rt = Runtime.getRuntime();     // 获取唯一实例

rt.availableProcessors();              // CPU 核心数量
rt.freeMemory() / 1024 / 1024;        // 空闲内存（MB）
rt.maxMemory();                        // JVM 最大可用内存
rt.totalMemory();                      // JVM 已分配内存

// 执行 DOS 命令
Process p = rt.exec("notepad.exe");    // 打开记事本
Thread.sleep(3000);                    // 等 3 秒
p.destroy();                           // 杀掉进程
```

>[!note]- 为什么 Runtime 是单例？
>每个 Java 程序就是**一个 JVM 进程**，Runtime 封装的就是这个进程的状态。  
>一个进程只有一个 Runtime，所以用单例模式保证全局唯一。

---

## 5.3 Math 类 & Random 类

### 5.3.1 Math 类

> 全静态方法，直接 `Math.xxx()` 调用。

```java
Math.abs(-5)          // 5                    绝对值
Math.max(3, 8)        // 8                    最大值
Math.min(3, 8)        // 3                    最小值
Math.sqrt(16)         // 4.0                  平方根
Math.pow(2, 3)        // 8.0                  2的3次方
Math.random()         // [0.0, 1.0)           随机数
Math.round(3.5)       // 4                    四舍五入
Math.ceil(3.1)        // 4.0                  向上取整
Math.floor(3.9)       // 3.0                  向下取整
Math.PI               // 3.14159...           圆周率
```

---

### 5.3.2 Random 类

> 比 `Math.random()` 更强大，需要 import `java.util.Random`。

```java
Random r1 = new Random();           // 无参：随机种子，每次结果不同
Random r2 = new Random(42);         // 有参：固定种子 → 序列可复现

r.nextInt(100)       // [0, 100) 的随机整数
r.nextDouble()       // [0.0, 1.0) 的 double
r.nextFloat()        // [0.0, 1.0) 的 float
r.nextBoolean()      // 随机 true/false
```

>[!note]- 什么是"种子(seed)"？
>计算机不产生真正的随机数，而是用数学公式从"种子"推算出伪随机序列。
>**相同种子 → 相同随机序列**。无参构造用系统时间做种子，所以每次不同。
>
>固定种子常用于测试，保证结果可以复现。

---

## 5.4 日期时间类

### 5.4.0 概览

|       | 老 API（`java.util`）                | 新 API（`java.time`，JDK 8+）    |
| ----- | --------------------------------- | ---------------------------- |
| 时间戳   | `Date`                            | `Instant`                    |
| 日期    | `Calendar`（抽象类）                   | `LocalDate`                  |
| 时间    | `Calendar`                        | `LocalTime`                  |
| 日期+时间 | `Date` + `Calendar`               | `LocalDateTime`              |
| 格式化   | `DateFormat` / `SimpleDateFormat` | `DateTimeFormatter`          |
| 间隔    | —                                 | `Duration`（时间）/ `Period`（日期） |

---

### 5.4.1 老 API

#### Date 类

```java
Date d1 = new Date();                     // 当前时间
Date d2 = new Date(966666666666L);        // 指定时间戳
System.out.println(d1);                   // 默认格式输出
```

> Date 大部分方法已过时，目前主要用于**时间戳**操作。

#### Calendar 类 —— 抽象类

```java
Calendar c = Calendar.getInstance();     // ⚠️不能 new，用工厂方法获取
c.get(Calendar.YEAR);                     // 获取年份
c.get(Calendar.MONTH) + 1;               // ⚠️ MONTH 从 0 开始，必须 +1
c.get(Calendar.DAY_OF_MONTH);             // 获取日期
c.set(2023, 5, 15);                      // 设置为 2023年6月15日
c.add(Calendar.DATE, 10);                // 加 10 天
```

>[!danger]- Calendar.MONTH 的大坑
>`Calendar.MONTH` 的返回值：0=1月, 1=2月, ..., 11=12月。  
>**获取当前月份时，一定要 +1！**
>```java
>c.get(Calendar.MONTH)    // 6月份返回 5
>c.get(Calendar.MONTH)+1  // 6月份正确返回 6
>```

#### DateFormat / SimpleDateFormat

```java
// Date → 字符串
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String str = sdf.format(new Date());           // "2023-06-15 14:30:00"

// 字符串 → Date
Date date = sdf.parse("2023-06-15 14:30:00");  // 解析字符串
```

**常用格式符号：**

| 符号 | 含义 | 示例 |
|------|------|------|
| `yyyy` | 年份 | 2023 |
| `MM` | 月份 | 06 |
| `dd` | 日期 | 15 |
| `HH` | 小时（24时制） | 14 |
| `mm` | 分钟 | 30 |
| `ss` | 秒 | 00 |

---

### 5.4.2 新 API（java.time）

#### Instant —— 时间戳

```java
Instant now = Instant.now();                 // 当前时间戳
Instant instant = Instant.ofEpochMilli(0);   // 1970-01-01T00:00:00Z
```

#### LocalDate —— 纯日期

```java
LocalDate today = LocalDate.now();            // 今天
LocalDate date = LocalDate.of(2023, 6, 15);   // 指定日期
date.getYear();                                // 2023
date.getMonthValue();                          // 6
date.getDayOfMonth();                          // 15
date.plusDays(10);                             // +10天
date.minusMonths(1);                           // -1月
```

#### LocalTime —— 纯时间

```java
LocalTime now = LocalTime.now();              // 当前时间
LocalTime time = LocalTime.of(14, 30, 0);     // 14:30:00
time.getHour();                                // 14
time.getMinute();                              // 30
time.getSecond();                              // 0
```

#### LocalDateTime —— 日期 + 时间

```java
LocalDateTime dt = LocalDateTime.now();
dt.toLocalDate();                              // 提取日期部分
dt.toLocalTime();                              // 提取时间部分
```

#### Period —— 日期间隔

```java
LocalDate d1 = LocalDate.of(2020, 1, 1);
LocalDate d2 = LocalDate.now();
Period p = Period.between(d1, d2);
p.getYears();                                  // 间隔年数
p.getMonths();                                 // 间隔月数
p.getDays();                                   // 间隔天数
```

#### Duration —— 时间间隔

```java
LocalTime t1 = LocalTime.of(9, 0);
LocalTime t2 = LocalTime.of(12, 30);
Duration d = Duration.between(t1, t2);
d.toHours();                                   // 3
d.toMinutes();                                 // 210
```


#### Data和Local data time的区别

这是一个极具含金量的底层问题！很多工作了三四年的程序员依然在混用这两个类，而你现在就意识到了它们的区别。

在 Java 的发展史中，从 `java.util.Date` 切换到 `java.time.LocalDateTime`，相当于一次**“基因级别的重组”**。

简单来说：`**Date**`** 是 1995 年 Java 刚诞生时的“上古遗物”，而 **`**LocalDateTime**`** 是 2014 年 Java 8 引入的“现代工业级标准”。** 在咱们的战车云端系统中，使用 `LocalDateTime` 具有三大压倒性的优势：

##### 🛡️ 1. 线程安全性（最致命的区别）

- `**Date**`** 的致命缺陷（可变性）：** `Date` 对象是**可变的（Mutable）**。这意味着如果在高并发场景下（比如 1000 个指挥官同时访问服务器），两个线程碰巧拿到了同一个 `Date` 对象，线程 A 可以直接通过 `date.setTime()` 把时间改掉，导致线程 B 读到极其荒谬的时间。这在金融或军工系统中是灾难。
- `**LocalDateTime**`** 的绝对防御（不可变性）：** 它是**不可变的（Immutable）**，就像 `String` 一样。一旦创建，里面的时间就永远冻结了。如果你对它进行加减操作（比如加一天），它不会改变原来的对象，而是**克隆并返回一个全新的对象**。这叫“绝对的线程安全”，哪怕一万个人并发访问，时间数据也绝不会错乱。

##### 🧠 2. 极其反人类的 API 设计 vs 现代流式操作

- **反人类的 **`**Date**`**：** 如果你想用 `Date` 来表示“昨天的时间”，或者“设置月份为 8 月”，你需要借助极其难用的 `Calendar` 类。更奇葩的是，`Date` 里的年份是从 1900 年开始算的，月份是从 `0` 开始算的（0代表一月，11代表十二月）。无数程序员曾在这里写出过让服务器崩溃的 Bug。
- **极度优雅的 **`**LocalDateTime**`**：** 它提供了像人类语言一样的 API。假设你要在代码里计算“三天前的下午两点”，你可以写出极度丝滑的链式代码：Java
```json
// 极其优雅的日期加减算法
LocalDateTime time = LocalDateTime.now()
                                  .minusDays(3)
                                  .withHour(14)
                                  .withMinute(0);
```

##### 🗄️ 3. 数据库的完美映射 (ORM 匹配度)

- `**Date**`** 的时区幽灵：** `Date` 底层其实存的是一串从 1970 年以来的“毫秒级时间戳”，它自己其实是不带时区概念的，但在打印输出时又会受你服务器当前时区的影响。存入 MySQL 时，经常会出现“存进去是 8 点，查出来变成 0 点”的时区漂移幽灵 Bug。
- `**LocalDateTime**`** 的所见即所得：** 它在字面意思上就是“本地的日期和时间”，没有底层的时间戳转换魔法。当你用 Spring Data JPA 把它存入 MySQL 时，它会完美、严丝合缝地映射到 MySQL 的 `DATETIME` 格式。Java 里是 `2026-04-04 15:30`，数据库里存的就绝对是 `2026-04-04 15:30`，绝不飘逸。

---

**总结在咱们项目里的意义：**

当我们用 `newUser.setCreateTime(LocalDateTime.now())` 时，不仅确保了在高并发下不会出 Bug，而且以后如果咱们要开发一个新接口：**“查询过去 24 小时内注册的所有战车指挥官”**，利用 `LocalDateTime` 的 API，只需要半行代码就能搞定时间计算，而不用去写一堆恶心的毫秒数转换逻辑了。


多态，是面向对象三大特性里最抽象、但也最能体现设计思想的一个。结合你笔记里已经写好的 `SmartDevice` 接口与 `RoboticArm`、`CameraDevice`，正好可以把它讲透。


---

## 5.5 包装类

### 为什么需要包装类？

> Java 中基本数据类型不是对象，但泛型、集合只能装对象。  
> 包装类 = 给基本类型包一层，让它变成对象。

**对应关系：**

| 基本类型 | 包装类 |
|----------|--------|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

### 装箱和拆箱

```java
// 手动装箱（基本类型 → 对象）
Integer i = Integer.valueOf(10);
// 手动拆箱（对象 → 基本类型）
int j = i.intValue();

// JDK 5+ 自动装箱/拆箱
Integer a = 10;      // 自动装箱
int b = a;           // 自动拆箱
```

### Integer 常用方法

```java
Integer.parseInt("123")          // 字符串 → int
Integer.valueOf("123")           // 字符串,int → Integer
Integer.toString(123)            // int → 字符串
Integer.intValue()               // Integer int
```

>[!warning]- parseInt 的坑
>`parseInt` 和 `valueOf` 要求字符串必须是**纯数字**，否则运行时抛 `NumberFormatException`。
>```java
>Integer.parseInt("123");    // ✅
>Integer.parseInt("12a");    // ❌ 编译通过，运行报错！
>Integer.parseInt(null);     // ❌
>```

### 包装类的注意事项

1. 包装类都重写了 `toString()`，返回被包装的值。
2. **除了 Character 外**，都有 `valueOf(String s)` 和 `parseXxx(String s)` 方法。
3. 字符串参数不能为 null，必须能解析为相应类型。

---

## 5.6 正则表达式

### 常用元字符

| 元字符 | 含义 | 示例 |
|--------|------|------|
| `.` | 任意一个字符 | `a.c` → "abc", "a1c" |
| `\d` | 数字 [0-9] | `\d+` → "123" |
| `\w` | 单词字符 [a-zA-Z0-9_] | `\w+` → "hello123" |
| `\s` | 空白字符（空格/制表/换行） | |
| `*` | 0 次或多次 | `a*` → "", "a", "aaa" |
| `+` | 1 次或多次 | `a+` → "a", "aaa" |
| `?` | 0 次或 1 次 | `a?` → "" 或 "a" |
| `{n}` | 恰好 n 次 | `a{3}` → "aaa" |
| `{n,}` | 至少 n 次 | `a{2,}` → "aa", "aaa" |
| `{n,m}` | n~m 次 | `a{2,4}` → "aa", "aaa", "aaaa" |
| `^` | 行的开头 | `^abc` |
| `$` | 行的结尾 | `xyz$` |
| `[abc]` | a, b, c 中任意一个 | `[aeiou]` |
| `[^abc]` | 不是 a, b, c 的任意字符 | |

>[!note]- Java 中反斜杠要写两次
>正则的 `\d` 在 Java 字符串中要写成 `\\d`，因为 Java 字符串里 `\` 本身是转义字符。
>```java
>"\\d+"    // 正则：\d+  匹配数字
>"\\\\"    // 正则：\\   匹配一个反斜杠
>```

### 使用方式

#### 方式 ①：String 自带方法（最简单）

```java
String s = "abc123";

s.matches("\\w+")               // true（整个字符串匹配）
s.replaceAll("\\d", "*")        // "abc***"
s.replaceFirst("\\d", "*")      // "abc*23"
s.split("\\d")                  // ["abc", "", "", ""]
```

#### 方式 ②：Pattern + Matcher（功能更强）

```java
Pattern p = Pattern.compile("\\w+");
Matcher m = p.matcher("hello world");

m.matches()      // false —— 必须整个字符串完全匹配
m.find()         // true —— 找到子串 "hello"
m.group()        // "hello" —— 获取匹配到的内容
m.find()         // true —— 继续找下一个 "world"
m.group()        // "world"
```

>[!warning]- matches() 是全量匹配！
>`matches()` 要求**整个字符串**都符合正则才返回 true，不是部分匹配。
>```java
>"hello123".matches("\\w+")     // true  —— 整个字符串都是单词字符
>"hello 123".matches("\\w+")    // false —— 中间有空格！
>```
>部分匹配用 `find()`。

---

## 总结：知识全景图

```
                           第5章 Java API
                                │
        ┌───────┬───────┬───────┼───────┬───────┬───────┐
        │       │       │       │       │       │       │
     字符串   System  Math   日期时间  包装类  正则表达式
        │    Runtime Random     │       │       │
        │       │       │       │       │       │
   ┌────┼────┐  │       │  ┌────┴────┐  │  ┌────┼────┐
   │    │    │  │       │  │         │  │  │    │    │
 String Buf Builder │   老API   新API  │ Pattern Matcher String
 常量 线程 非线程   │ Date   Instant  │          支持方法
 不可 安全  安全   │ Cal   Local~   │
  变  可变 最快   │ DF    Period   │
                  │ SDF   Duration │
```

**三条核心铁律：**

1. `==` 比地址，`equals()` 比内容（String 重写了，StringBuffer/Builder 没重写）
2. `Calendar.MONTH` 从 0 开始，获取月份要 **+1**
3. `matches()` 是全量匹配，部分匹配用 `find()`

