# 第1章 Java 概述 笔记

> 来源：第1章 Java概述.pptx (69页)  
> 涵盖：Java语言特点、JDK/JRE/JVM、第一个程序、环境变量、运行机制、IDEA

---

## 目录

- [1.1 Java 简介](#11-java-简介)
- [1.2 JDK 的使用](#12-jdk-的使用)
- [1.3 第一个 Java 程序](#13-第一个-java-程序)
- [1.4 系统环境变量](#14-系统环境变量)
- [1.5 Java 的运行机制](#15-java-的运行机制)
- [1.6 集成开发环境 IDEA](#16-集成开发环境-idea)

---

## 1.1 Java 简介

### 1.1.1 计算机语言的三个层次

| 层次 | 特点 | 示例 |
|------|------|------|
| **机器语言** | 二进制 0/1，CPU 直接识别，人类难读写 | `10110000 01100001` |
| **汇编语言** | 英文缩写标识符，需汇编器翻译 | `MOV AL, 61h` |
| **高级语言** | 接近自然语言，易读写，需编译器/解释器 | `System.out.println()` |

> Java 属于**高级语言**，是目前绝大多数开发者的选择。

### 1.1.2 Java 发展简史

| 时间 | 里程碑 |
|------|--------|
| 1995.5.23 | Java 诞生（Sun 公司，James Gosling） |
| 2009.4 | Oracle 以 74 亿美元收购 Sun |
| 2014.3 | Java SE 8（Lambda 表达式，里程碑版本） |
| 2018.9 | Java SE 11（长期支持 LTS，市场主流） |

### 1.1.3 三大技术平台

| 平台 | 全称 | 用途 |
|------|------|------|
| **Java SE** | Standard Edition | 桌面应用，核心基础（集合/IO/网络等） |
| **Java EE** | Enterprise Edition | 企业级应用（Servlet/JSP/EJB 等） |
| **Java ME** | Micro Edition | 嵌入式/移动设备 |

> Java SE 是根基，Java EE 和 Java ME 都在其基础上扩展。

>[!note]- 三个平台的关系
>```
>        Java SE (标准版)
>        /            \
>   Java EE (企业版)   Java ME (微型版)
>```
>学 Java 就是先学 Java SE，它是所有方向的必修课。

### 1.1.4 Java 五大特点

| 特点 | 说明 |
|------|------|
| **简单** | 丢弃了 C++ 的指针、运算符重载、多重继承；自动垃圾回收 |
| **面向对象** | 纯粹 OOP，支持类/接口/继承/多态 |
| **跨平台** | 一次编译，到处运行（Write Once, Run Anywhere） |
| **多线程** | 内置多线程支持，提高执行效率 |
| **动态** | 运行时动态加载类 |

>[!note]- "简单"具体体现在哪？
>相比 C++，Java 砍掉了三样最让人头疼的东西：
>1. **指针** → 用引用代替，不再操心内存地址
>2. **运算符重载** → 避免 `+` 被你重载成奇怪逻辑
>3. **多重继承** → 只支持单继承 + 多接口实现，避免菱形继承问题
>4. **手动内存管理** → 自动垃圾回收（GC），不用 `free`/`delete`

---

## 1.2 JDK 的使用

### 1.2.1 JDK / JRE / JVM 三者关系

```
  ┌─────────────────────────────┐
  │            JDK              │  ← 开发工具包（开发用）
  │  ┌───────────────────────┐  │
  │  │         JRE           │  │  ← 运行环境（运行用）
  │  │  ┌─────────────────┐  │  │
  │  │  │      JVM        │  │  │  ← 虚拟机（核心）
  │  │  └─────────────────┘  │  │
  │  └───────────────────────┘  │
  └─────────────────────────────┘
```

| 缩写 | 全称 | 包含 | 使用者 |
|------|------|------|--------|
| **JDK** | Java Development Kit | JRE + 编译器(javac) + 工具 | 开发者 |
| **JRE** | Java Runtime Environment | JVM + 核心类库 | 普通用户 |
| **JVM** | Java Virtual Machine | 字节码执行引擎 | 底层 |

> JDK 自带 JRE，装 JDK 就够，不需要单独装 JRE。

### 1.2.2 JDK 安装目录结构

| 目录/文件 | 作用 |
|-----------|------|
| `bin/` | 可执行程序：`javac.exe`(编译器)、`java.exe`(运行)、`jar.exe`(打包) |
| `jre/` | Java 运行时环境（含 JVM） |
| `lib/` | Java 类库（开发工具用的归档包） |
| `include/` | C/C++ 头文件（JVM 底层是 C++ 实现的） |
| `src.zip` | JDK 核心类**源代码**（可解压学习） |
| `db/` | JavaDB 小型数据库（JDK 6+） |

### 1.2.3 两个最重要的可执行文件

| 程序 | 作用 | 输入 | 输出 |
|------|------|------|------|
| `javac.exe` | **编译器** | `.java` 源文件 | `.class` 字节码文件 |
| `java.exe` | **运行器** | `.class` 字节码 | 程序执行结果 |

---

## 1.3 第一个 Java 程序

### 1.3.1 HelloWorld.java

```java
class HelloWorld {
    public static void main(String[] args) {
        System.out.println("这是第一个Java程序！");
    }
}
```

**逐行解释：**

| 代码 | 含义 |
|------|------|
| `class HelloWorld` | 定义一个类，`class` 是关键字，`HelloWorld` 是类名 |
| `{ }` 大括号 | 定义类的管辖范围 |
| `public static void main(String[] args)` | **程序入口**，JVM 从这里开始执行 |
| `System.out.println(...)` | 打印一行文本到控制台 |

### 1.3.2 编译和运行

```bash
# ① 编译（生成 .class 文件）
javac HelloWorld.java      # 注意：要写 .java 后缀

# ② 运行（执行字节码）
java HelloWorld             # 注意：不能写 .class 后缀！
```

**完整流程：**

```
HelloWorld.java  ──javac──→  HelloWorld.class  ──java──→  输出结果
   (源文件)        编译         (字节码)         运行
```

>[!danger]- 两个最容易犯的错
>**① javac 要带 `.java`，java 不能带 `.class`**
>```bash
>javac HelloWorld        # ❌ 缺少 .java
>java HelloWorld.class   # ❌ 多了 .class
>```
>
>**② 隐藏文件扩展名陷阱**
>Windows 默认隐藏已知扩展名，`HelloWorld.java` 实际是 `HelloWorld.java.txt`。
>解决：文件夹选项 → 取消勾选「隐藏已知文件类型的扩展名」。

### 1.3.3 HelloWorld 常见错误

| 错误类型 | 示例 |
|----------|------|
| 扩展名错误 | `javac HelloWorld` 或 `java HelloWorld.class` |
| 大小写错误 | Java 严格区分大小写，`String` ≠ `string` |
| 中英文符号 | 分号 `;` 用了中文 `；` |
| 缺少括号/分号 | 大括号不匹配，语句末尾忘写 `;` |
| 拼写错误 | `main` 写成 `mian`，`String` 写成 `Stirng` |

---

## 1.4 系统环境变量

### 1.4.1 path 环境变量

> **问题**：每次编译都要跑到 JDK 的 bin 目录下，太麻烦。  
> **解决**：把 bin 目录加到 path，让系统在任何位置都能找到 `javac` 和 `java`。

**原理：** 在命令行输入命令时，系统先找**当前目录**，找不到就去 **path 变量**里的路径挨个找。

```
输入 javac
  → 当前目录有 javac.exe 吗？ 有 → 执行
                             没有 → path 里有吗？ 有 → 执行
                                                  没有 → 报错
```

**配置步骤：**
1. 复制 JDK bin 路径，如 `C:\Program Files\Java\jdk1.8.0_201\bin`
2. 系统属性 → 高级 → 环境变量 → 系统变量 → Path → 编辑
3. 粘贴路径，末尾加分号 `;`

### 1.4.2 classpath 环境变量

> **问题**：JVM 在哪里找 `.class` 文件？  
> **答案**：classpath 指定的路径（JDK 5.0 后默认是当前目录 `.`，一般不需要手动设）。

---

## 1.5 Java 的运行机制

### 1.5.1 核心流程

```
  编写          编译                 运行
  .java  ──→  .class  ──→   JVM 加载 ──→ 解释执行 ──→ 输出结果
 (源文件)  javac  (字节码)  (类加载器)   (虚拟机)
```

### 1.5.2 跨平台原理（Write Once, Run Anywhere）

```
              ┌─────────────┐
              │  Hello.java │  同一份源代码
              └──────┬──────┘
                     │ javac 编译
              ┌──────▼──────┐
              │ Hello.class │  同一份字节码
              └──────┬──────┘
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
    │Win JVM │ │Mac JVM │ │Linux JVM│  不同平台装不同的JVM
    └────────┘ └───────┘ └────────┘
```

>[!warning]- JVM 本身不跨平台
>Java 程序跨平台，但 **JVM 本身是平台相关的**。  
>Windows 上的 JVM 是 `.exe` 格式，Linux 上不是同一个文件。  
>每个操作系统需要安装对应版本的 JVM。

---

## 1.6 集成开发环境 IDEA

> 目前业界公认最好的 Java IDE，JetBrains 出品。

**两个版本：**

| 版本 | 特点 |
|------|------|
| **旗舰版 (Ultimate)** | 功能完整，30 天试用，之后需付费 |
| **社区版 (Community)** | 免费，基础功能齐全 |

**常用快捷键：**

| 快捷键 | 功能 |
|--------|------|
| `psvm` + Tab | 快速生成 `main` 方法 |
| `sout` + Tab | 快速生成 `System.out.println()` |
| `Ctrl + D` | 复制当前行 |
| `Ctrl + /` | 单行注释 |
| `F5` ~ `F8` | Debug 调试（Step Into/Over 等） |

---

## 总结：Java 程序开发全流程

```
                    IDE (IDEA/Eclipse)
                          │
                          ▼
              编写 HelloWorld.java
                          │
                          ▼
              javac HelloWorld.java  ← JDK 编译器
                          │
                          ▼
              生成 HelloWorld.class  ← 字节码
                          │
                          ▼
               java HelloWorld       ← JVM 执行
                          │
                          ▼
               控制台输出结果
```

## 核心记忆点速查

| # | 要点 |
|---|------|
| 1 | JDK ⊃ JRE ⊃ JVM（开发工具包 > 运行环境 > 虚拟机） |
| 2 | `javac` 编译 → `.java` → `.class` |
| 3 | `java` 运行 → 类名不带 `.class` |
| 4 | path 环境变量 = 让系统找到 `javac` 和 `java` |
| 5 | Java 跨平台靠 **JVM**，JVM 本身不跨平台 |
| 6 | 安装路径不要有中文和空格 |
| 7 | 编写代码注意英文半角符号 |

