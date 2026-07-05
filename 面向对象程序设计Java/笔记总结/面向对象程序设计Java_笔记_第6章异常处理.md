# 第6章 异常处理机制 笔记

> 来源：第6章 异常处理机制.pptx (38页)  
> 涵盖：异常分类、try-catch-finally、throws、throw、自定义异常

---

## 目录

- [6.1 异常是什么](#61-异常是什么)
- [6.2 异常分类](#62-异常分类)
- [6.3 捕捉异常 try-catch-finally](#63-捕捉异常-try-catch-finally)
- [6.4 声明异常 throws](#64-声明异常-throws)
- [6.5 throw 抛出异常 & 自定义异常](#65-throw-抛出异常--自定义异常)

---

## 6.1 异常是什么

> **异常 = 程序运行时发生的非正常状况。**  
> Java 把各种异常情况封装成异常类，通过异常处理机制来应对。

```java
// 一个典型的异常
public static int divide(int x, int y) {
    return x / y;
}

divide(5, 0);   // → ArithmeticException: / by zero
                // 程序到此终止，后面的代码不会执行
```

**异常发生的后果：**
- 程序**立即终止**
- 异常发生点**后面的代码不会执行**

---

## 6.2 异常分类

### 6.2.1 继承体系

```
                    java.lang.Throwable
                           │
              ┌────────────┴────────────┐
              │                         │
            Error                    Exception
         (错误类)                    (异常类)
              │                         │
         系统级错误              ┌───────┴────────┐
         无法恢复                │                │
                          RuntimeException   其他Exception
                          (运行时异常)       (编译时异常)
                          unchecked         checked
```

### 6.2.2 Error vs Exception

| | Error | Exception |
|---|-------|-----------|
| 严重程度 | **严重**，系统级 | 可处理 |
| 能否处理 | ❌ 修改程序也恢复不了 | ✅ 可以通过代码处理 |
| 举例 | 类不存在、内存溢出 | 除以0、空指针、文件未找到 |
| 类比 | 楼塌了（偷工减料） | 感冒发烧（能治好） |

### 6.2.3 编译时异常 vs 运行时异常

这是最重要的区分。

| | 编译时异常 (Checked) | 运行时异常 (Unchecked) |
|---|------|------|
| 检测时机 | **编译时** | **运行时** |
| 是否必须处理 | ✅ **必须处理**，否则编译通不过 | ❌ 可以不处理，也能编译 |
| 处理方式 | `try-catch` 或 `throws` | 也可以处理，但不强制 |
| 常见例子 | `IOException`、`SQLException` | `NullPointerException`、`ArithmeticException`、`ArrayIndexOutOfBoundsException` |

```java
// 编译时异常：不处理 → 编译报错
FileReader reader = new FileReader("a.txt");  // ❌ 编译不通过！

// 运行时异常：不处理也能编译
int[] arr = new int[5];
System.out.println(arr[6]);   // ✅ 编译通过，运行时抛异常
```

>[!note]- 为什么有两种异常？
>**编译时异常**：外部因素导致的、程序员无法完全控制的问题（文件不存在、网络断开等）。  
>Java 编译器**强制**你处理，防止程序在关键时刻崩溃。
>
>**运行时异常**：通常是**程序逻辑错误**（空指针、越界等）。  
>这些应该通过**写好代码**来避免，而不是到处 try-catch。

### 6.2.4 Throwable 常用方法

| 方法 | 说明 |
|------|------|
| `getMessage()` | 返回异常的简短描述 |
| `toString()` | 返回异常的完整信息（类名 + 描述） |
| `printStackTrace()` | 打印异常堆栈跟踪（最常用，调试用） |

---

## 6.3 捕捉异常 try-catch-finally

### 6.3.1 基本语法

```java
try {
    // 可能发生异常的代码
} catch (异常类型 变量名) {
    // 处理异常的代码
} finally {
    // 无论是否异常，都会执行的代码（可选）
}
```

### 6.3.2 执行流程

```
try 块正常：                    try 块抛异常：

  try {                          try {           ← 发生异常！
      语句1                           语句1
      语句2                           语句2 ← 异常！
      语句3                     →     catch {     ← 跳到 catch
  }                                   处理异常
  catch {                           }
      (跳过)                         finally {   ← 必定执行
  }                                  清理代码
  finally {                         }
      必定执行                       程序继续运行 ✅
  }
```

>[!warning]- try 中异常后面的代码不会执行
>```java
>try {
>    int x = 5 / 0;                     // 异常！
>    System.out.println("这行不会执行");  // ❌ 跳过
>} catch (ArithmeticException e) {
>    System.out.println("出错了！");      // ✅ 跳到这
>}
>```

### 6.3.3 多个 catch 块

```java
try {
    // 可能抛出多种异常的代码
} catch (ArithmeticException e) {
    // 处理算术异常
} catch (NullPointerException e) {
    // 处理空指针异常
} catch (Exception e) {
    // 兜底：处理所有其他异常
}
```

> **匹配规则**：从上到下依次匹配，**找到第一个匹配的 catch 就停止**。  
> ⚠️ 子类异常放前面，父类异常放后面（否则子类永远匹配不到）。

### 6.3.4 finally —— 无论如何都执行

```java
try {
    // ... 
} catch (Exception e) {
    return;         // 即使 return 了……
} finally {
    System.out.println("finally 仍然执行！");   // ✅ 照样执行！
}
```

**唯一例外：** `System.exit(0)` 会让 JVM 直接退出，`finally` 也不执行。

```java
try {
    System.exit(0);     // JVM 直接死了
} finally {
    System.out.println("不会打印");  // ❌ 不执行
}
```

>[!note]- finally 的典型用途
>释放系统资源（如关闭文件流、数据库连接）：
>```java
>FileInputStream in = null;
>try {
>    in = new FileInputStream("test.txt");
>    // 读文件...
>} catch (IOException e) {
>    e.printStackTrace();
>} finally {
>    if (in != null) {
>        try { in.close(); } catch (IOException e) { }
>    }
>}
>```

---

## 6.4 声明异常 throws

> 自己不处理，**甩锅**给调用者去处理。

### 语法

```java
修饰符 返回值类型 方法名(参数) throws 异常类1, 异常类2 {
    // 方法体
}
```

### 示例

```java
// divide() 自己不处理异常，声明抛出，让调用者处理
public static int divide(int x, int y) throws Exception {
    if (y == 0) {
        throw new Exception("除数不能为0");
    }
    return x / y;
}

// 调用者必须处理
public static void main(String[] args) {
    try {
        int result = divide(10, 0);    // 调用可能抛异常的方法
    } catch (Exception e) {
        System.out.println(e.getMessage());  // "除数不能为0"
    }
}
```

### 调用链上的异常传递

```
divide() throws Exception    ← 声明：我可能抛异常，但我不管
       │
    main() 调用 divide()
       │
    ┌──┴── 两种选择 ──┐
    │                 │
  try-catch         throws
  自己处理          继续甩锅给上层
```

>[!warning]- throws 只是甩锅，不是处理
>```java
>public static void main(String[] args) throws Exception {
>    divide(10, 0);   // 编译通过，但运行时没被 catch → 程序终止！
>}
>```
>`throws` 只是让编译通过，运行时遇到异常没人 catch → 仍然崩溃。

---

## 6.5 throw 抛出异常 & 自定义异常

### 6.5.1 throw vs throws

最容易搞混的两个关键字：

| | `throw` | `throws` |
|---|--------|----------|
| 位置 | **方法体内** | **方法声明后面** |
| 作用 | **手动抛出**一个异常对象 | **声明**该方法可能抛出哪些异常 |
| 后面跟 | 异常**对象** | 异常**类名** |
| 数量 | 一次只能抛一个 | 可以声明多个 |

```java
// throw：在方法里面，手动抛出异常对象
public void check(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能为负");
    }
}

// throws：在方法声明上，甩锅给调用者
public void readFile() throws IOException {
    // ...
}
```

>[!note]- 记忆口诀
>- **throw = 甩出去**（动词，动作）：在方法里面 new 一个异常对象扔出去
>- **throws = 甩锅声明**（名词/声明）：在方法签名上写"我可能会出这些事，你自己看着办"

### 6.5.2 自定义异常

> JDK 提供的异常不够用时，自己定义一个。

**步骤：继承 Exception，调用父类构造方法即可：**

```java
// ① 定义异常类，继承 Exception
class DivideByMinusException extends Exception {
    public DivideByMinusException() {
        super();                          // 调用 Exception 无参构造
    }
    public DivideByMinusException(String msg) {
        super(msg);                       // 调用 Exception 带参构造
    }
}
```

```java
// ② 在方法中使用
public static int divide(int x, int y) throws DivideByMinusException {
    if (y < 0) {
        throw new DivideByMinusException("除数不能为负数！");
    }
    if (y == 0) {
        throw new DivideByMinusException("除数不能为零！");
    }
    return x / y;
}
```

```java
// ③ 调用者捕获处理
public static void main(String[] args) {
    try {
        int result = divide(10, -2);
    } catch (DivideByMinusException e) {
        System.out.println(e.getMessage());  // "除数不能为负数！"
    }
}
```

>[!danger]- throw 抛出异常后必须处理（编译时异常）
>```java
>// ❌ 编译不通过！
>public void divide(int x, int y) {
>    if (y < 0) {
>        throw new DivideByMinusException();  // 抛了但没声明也没处理
>    }
>}
>
>// ✅ 两种修复方式任选其一：
>// 方式一：throws 声明
>public void divide(int x, int y) throws DivideByMinusException { ... }
>
>// 方式二：try-catch 自己处理
>public void divide(int x, int y) {
>    if (y < 0) {
>        try {
>            throw new DivideByMinusException();
>        } catch (DivideByMinusException e) { ... }
>    }
>}
>```
>如果是**运行时异常**（继承 RuntimeException），则不需要声明。

---

## 总结：异常全貌

```
                          Throwable
                              │
                    ┌─────────┴─────────┐
                    │                   │
                  Error             Exception
               (不可恢复)               │
                          ┌────────────┴────────────┐
                          │                         │
                   RuntimeException          其他 Exception
                   (运行时/unchecked)         (编译时/checked)
                  可以不处理                  必须 try-catch 或 throws


处理方式：
        ┌─ try-catch-finally（自己处理）
        │
  异常 ─┼─ throws（声明甩锅，让调用者处理）
        │
        └─ throw（手动抛出异常对象）
```

## 核心对比速查

| 对比项                      | 区分                                 |
| ------------------------ | ---------------------------------- |
| **Error vs Exception**   | Error 严重不可恢复，Exception 可处理         |
| **Checked vs Unchecked** | Checked 必须处理（编译期检查），Unchecked 可不处理 |
| **throw vs throws**      | throw 是动作（抛对象），throws 是声明（甩锅）      |
| **try-catch vs throws**  | try-catch 自己处理，throws 甩给调用者        |
| **finally 不执行的情况**       | 只有 `System.exit(0)`                |

## 异常处理代码模板

```java
// 标准模板：尝试 → 捕获 → 善后
public void doSomething() {
    Resource r = null;
    try {
        r = new Resource();
        // 可能出异常的代码
    } catch (SpecificException e) {
        // 处理特定异常
        e.printStackTrace();
    } catch (Exception e) {
        // 兜底处理
        System.out.println(e.getMessage());
    } finally {
        // 无论是否异常，释放资源
        if (r != null) {
            try { r.close(); } catch (Exception e) { }
        }
    }
}
```

## 常见异常速查表

| 异常类 | 类型 | 触发条件 |
|--------|------|---------|
| `ArithmeticException` | 运行时 | 除以 0 |
| `NullPointerException` | 运行时 | 对 null 调用方法 |
| `ArrayIndexOutOfBoundsException` | 运行时 | 数组下标越界 |
| `StringIndexOutOfBoundsException` | 运行时 | 字符串索引越界 |
| `ClassCastException` | 运行时 | 类型强转错误 |
| `NumberFormatException` | 运行时 | 字符串转数字格式错误 |
| `IOException` | 编译时 | IO 操作失败 |
| `FileNotFoundException` | 编译时 | 文件未找到 |
| `SQLException` | 编译时 | 数据库操作失败 |
| `InterruptedException` | 编译时 | 线程被中断 |

