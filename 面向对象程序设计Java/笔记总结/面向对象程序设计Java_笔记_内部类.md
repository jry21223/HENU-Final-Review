# 内部类 笔记

> 来源：第4章 面向对象高级技术.pptx §4.6（81-99页）  
> 涵盖：成员内部类、局部内部类、静态内部类、匿名内部类

---

## 4.6 内部类概述

> **内部类 = 定义在类内部的类。** 外面的叫外部类，里面的叫内部类。

根据位置和修饰符，分为四种：

```
                        内部类
                          │
        ┌─────────┬───────┼───────┬──────────┐
        │         │       │       │          │
    成员内部类  局部内部类  静态内部类  匿名内部类
   (类中成员位置) (方法内) (static修饰) (没有名字)
```

---

## 4.6.1 成员内部类

> 定义在类中、方法外的类。和成员变量、成员方法平级。

**定义方式：**

```java
class Outer {
    private String name = "外部类";

    class Inner {                       // 成员内部类
        public void show() {
            System.out.println(name);   // ✅ 可以访问外部类的所有成员（包括私有）
        }
    }

    public void createInner() {
        Inner in = new Inner();         // 外部类内部可以直接 new
        in.show();
    }
}
```

**外部如何创建内部类对象：**

```java
// 格式：外部类名.内部类名 变量 = new 外部类名().new 内部类名();
Outer.Inner inner = new Outer().new Inner();
inner.show();
```

>[!note]- 为什么是 `new Outer().new Inner()`？
>内部类对象依赖于外部类对象存在。必须先有外部类对象，才有内部类对象。
>
>```java
>Outer outer = new Outer();        // 先创建外部类
>Outer.Inner inner = outer.new Inner();  // 再通过外部类创建内部类
>```

---

## 4.6.2 局部内部类

> 定义在**方法内部**的类。作用范围仅限于该方法。

```java
class Outer {
    public void method() {
        // 局部内部类：定义在方法里
        class Inner {
            public void show() {
                System.out.println("局部内部类");
            }
        }
        Inner in = new Inner();    // 只能在方法内部使用
        in.show();
    }
}
```

**特点：**

- 有效范围**只限于方法内部**
- 可以访问外部类的所有成员
- 可以访问方法中的局部变量（JDK 8+ 不要求 `final`）

>[!note]- JDK 8 之前 vs 之后
>JDK 8 之前：局部内部类访问的局部变量必须加 `final`。
>JDK 8 之后：不强制加 `final`，但如果局部变量在内部类中被使用，它实际上仍然是 `effectively final`（不能重新赋值）。

---

## 4.6.3 静态内部类

> 用 `static` 修饰的成员内部类。**只能访问外部类的静态成员**。

```java
class Outer {
    private static String name = "外部类";

    static class Inner {              // 静态内部类
        public void show() {
            System.out.println(name); // ✅ 能访问静态成员
            // System.out.println(age); // ❌ 不能访问非静态成员！
        }
    }
}
```

**创建方式（不需要外部类对象）：**

```java
// 格式：外部类名.静态内部类名 变量 = new 外部类名.静态内部类名();
Outer.Inner inner = new Outer.Inner();  // 注意：没有 .new
inner.show();
```

**四种内部类创建方式对比：**

| 类型    | 创建语法                      |
| ----- | ------------------------- |
| 成员内部类 | `new Outer().new Inner()` |
| 局部内部类 | 只能在方法内 `new`              |
| 静态内部类 | `new Outer.Inner()`       |
| 匿名内部类 | `new 接口/父类() { ... }`     |

---

## 4.6.4 匿名内部类

> **没有名字的内部类**。最常用，尤其是配合接口/抽象类。

**场景：** 调用一个方法，参数是接口类型，不想专门写一个实现类。

```java
// 定义接口
interface Animal {
    void shout();
}

// 方法接收 Animal 接口
public static void animalShout(Animal a) {
    a.shout();
}

// 调用时直接写匿名内部类
animalShout(new Animal() {         // new 接口名() { 实现 }
    public void shout() {
        System.out.println("喵喵……");
    }
});
```

**编写步骤：**

```
① 在参数位置写 new 接口名() {}
    → 相当于创建了一个匿名子类对象

② 在大括号 {} 中写实现代码
    → 重写接口的抽象方法

③ 完成！
    → 这个匿名对象直接作为参数传入
```

**常见用法：**

```java
// ① 线程
new Thread(new Runnable() {
    public void run() {
        System.out.println("新线程");
    }
}).start();

// ② 比较器
TreeSet<String> set = new TreeSet<>(new Comparator<String>() {
    public int compare(String o1, String o2) {
        return o1.length() - o2.length();
    }
});

// ③ Lambda 简化（JDK 8+）
new Thread(() -> System.out.println("新线程")).start();
```

>[!note]- 匿名内部类 → Lambda 的进化
>匿名内部类在 JDK 8 后可以用 Lambda 表达式简化（仅限函数式接口）：
>```java
>// 匿名内部类
>animalShout(new Animal() {
>    public void shout() { System.out.println("喵"); }
>});
>
>// Lambda 等价写法（Animal 是函数式接口时）
>animalShout(() -> System.out.println("喵"));
>```

---

## 四种内部类对比总结

| | 成员内部类 | 局部内部类 | 静态内部类 | 匿名内部类 |
|---|-----------|-----------|-----------|-----------|
| 定义位置 | 类中、方法外 | **方法内部** | 类中、方法外（static） | 调用时直接写 |
| 修饰符 | class | class | `static class` | 无（没名字） |
| 访问外部非静态成员 | ✅ | ✅ | ❌ 只能访问静态 | ✅ |
| 创建方式 | `new Outer().new Inner()` | 方法内 `new` | `new Outer.Inner()` | `new 接口(){…}` |
| 使用场景 | 紧密关联的辅助类 | 仅方法内使用的临时类 | 与外部类松耦合 | **临时实现接口/抽象类** |

---

## 核心规则速查

| # | 规则 |
|---|------|
| 1 | 内部类可以访问外部类的**所有**成员（包括 `private`） |
| 2 | 静态内部类**只能**访问外部类的静态成员 |
| 3 | 成员内部类对象必须依赖外部类对象：`new Outer().new Inner()` |
| 4 | 静态内部类对象不需要外部类对象：`new Outer.Inner()` |
| 5 | 局部内部类的作用范围**仅限于所在方法** |
| 6 | 匿名内部类必须**实现接口的所有抽象方法**或**重写父类方法** |
| 7 | JDK 8+ 局部内部类访问局部变量不再强制加 `final` |
| 8 | Lambda 是匿名内部类的简化写法（仅限函数式接口） |

