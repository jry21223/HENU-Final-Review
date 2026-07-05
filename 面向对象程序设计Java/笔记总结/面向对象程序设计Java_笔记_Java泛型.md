# Java 泛型 (Generics) 详解笔记

> 视频来源：Java中的泛型 Generics in Java  
> 时长：约 24 分钟  
> 整理日期：2024-07-04

---

## 目录

1. [问题的起点：没有泛型的世界](#1-问题的起点没有泛型的世界)
2. [泛型类的诞生](#2-泛型类的诞生)
3. [多类型参数](#3-多类型参数)
4. [有界泛型 —— 给类型参数加约束](#4-有界泛型--给类型参数加约束)
5. [泛型方法](#5-泛型方法)
6. [通配符 —— 解决 List 的类型匹配问题](#6-通配符--解决-list-的类型匹配问题)
7. [类型安全与类型擦除](#7-类型安全与类型擦除)
8. [核心知识图谱](#8-核心知识图谱)
9. [关键术语表](#9-关键术语表)

---

## 1. 问题的起点：没有泛型的世界

### 1.1 需求场景

假设我们需要一个类，用来**打印某个变量的值**。

先从最简单的开始 —— 打印一个 `Integer`：

```java
// IntegerPrinter.java
public class IntegerPrinter {
    private Integer content;          // 属性类型是 Integer

    public IntegerPrinter(Integer content) {
        this.content = content;       // 构造函数接收 Integer
    }

    public void print() {
        System.out.println(content);
    }
}
```

使用它：

```java
// Main.java
IntegerPrinter printer = new IntegerPrinter(123);
printer.print();   // 输出: 123 ✅
```

### 1.2 新需求出现

现在需求变了：我们还需要打印 **String 类型** 的变量。

❌ 不能再用 `IntegerPrinter`，因为它的属性是 `Integer`。

**方案**：再建一个 `StringPrinter` 类：

```java
// StringPrinter.java
public class StringPrinter {
    private String content;

    public StringPrinter(String content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
    }
}
```

```java
// 使用
StringPrinter printer = new StringPrinter("hello");
printer.print();   // 输出: hello ✅
```

### 1.3 根本问题浮现

> **如果要支持 10 种类型，就需要写 10 个几乎一模一样的类！**

- `IntegerPrinter` → 处理 Integer
- `StringPrinter` → 处理 String
- `DoublePrinter` → 处理 Double
- ……

核心矛盾：**类逻辑完全相同，只是类型不同，却产生了大量重复代码。**

---

## 2. 泛型类的诞生

### 2.1 核心思想

> 能不能只写**一个类**，就能处理**所有类型**？

这就是 **泛型 (Generics)** 的设计目的：**将类型也当作参数传入**。

### 2.2 声明泛型类

在类名后面用 **尖括号 `<>`** 包裹一个**类型占位符**（习惯用 `T`）：

```java
// Printer.java —— 泛型类，一个类处理所有类型！
public class Printer<T> {          // <T> 声明：此类接受一个类型参数 T
    private T content;             // T 是占位符，代表「调用时传入的那个类型」

    public Printer(T content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
    }
}
```

**关键理解点：**

| 概念 | 说明 |
|------|------|
| `<T>` 写在哪儿 | 类名后面，类体 `{ }` 前面 |
| `T` 是什么 | 类型占位符（Type Parameter），不是真实类型 |
| `T` 的值谁决定 | **调用方**决定，相当于把「类型」当作参数传入 |
| 习惯命名 | `T`（Type）、`K`（Key）、`V`（Value），也可以用任何字母 |

### 2.3 调用泛型类

```java
// 想打印 Integer 类型
Printer<Integer> ip = new Printer<>(123);
ip.print();  // 123 ✅

// 想打印 String 类型 —— 无需新建类！
Printer<String> sp = new Printer<>("hello");
sp.print();  // hello ✅

// 想打印自定义类型 —— 同样无需新建类！
Printer<Car> cp = new Printer<>(new Car());
cp.print();  // Car@xxx ✅
```

> **对比之前**：不需要 `IntegerPrinter`、`StringPrinter`、`CarPrinter`，**一个 `Printer<T>` 全搞定！**

### 2.4 一个重要限制

```java
// ❌ 泛型参数不能是基本数据类型（primitive type）
Printer<int> p = new Printer<>(123);      // 错误！
Printer<float> p = new Printer<>(3.14f);  // 错误！

// ✅ 必须用对应的包装类（Wrapper Class）
Printer<Integer> p1 = new Printer<>(123);     // int → Integer
Printer<Double> p2 = new Printer<>(3.14);     // double → Double
Printer<Boolean> p3 = new Printer<>(true);    // boolean → Boolean
```

---

## 3. 多类型参数

### 3.1 场景

有时候一个类需要**多种不同类型**的属性。

### 3.2 声明多个类型参数

```java
public class DataStore<T, K> {    // 两个类型参数 T 和 K
    private T data;
    private K metadata;

    public DataStore(T data, K metadata) {
        this.data = data;
        this.metadata = metadata;
    }

    public void print() {
        System.out.println("Data: " + data);
        System.out.println("Metadata: " + metadata);
    }
}
```

### 3.3 使用

```java
// T → String, K → Integer
DataStore<String, Integer> store = new DataStore<>("Hello", 123);
store.print();
// Data: Hello
// Metadata: 123
```

---

## 4. 有界泛型 —— 给类型参数加约束

### 4.1 新需求

在实际项目中，**不是所有类型都适合传入**。

例如，我们只想接受「交通工具」相关的类型（Car、Bus），而不想接受 String、Integer。

### 4.2 用 `extends` 限制类型上界

```java
// 前提：Vehicle 是父类，Car 和 Bus 都 extends Vehicle
public class Vehicle { }
public class Car extends Vehicle { }
public class Bus extends Vehicle { }

// 泛型类 —— 限定 T 必须是 Vehicle 或其子类
public class Printer<T extends Vehicle> {   // 上界约束
    private T content;

    public Printer(T content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
    }
}
```

**使用效果：**

```java
Printer<Car> cp = new Printer<>(new Car());   // ✅ Car extends Vehicle
Printer<Bus> bp = new Printer<>(new Bus());   // ✅ Bus extends Vehicle
Printer<Vehicle> vp = new Printer<>(new Vehicle()); // ✅ Vehicle 本身

Printer<String> sp = new Printer<>("hello");  // ❌ 编译错误！String 不是 Vehicle 子类
```

### 4.3 有界泛型带来的好处：可以调用上界的方法

因为 `T` 一定是 `Vehicle` 的子类，所以在类内部可以安全调用 `Vehicle` 的方法：

```java
// Vehicle.java
public class Vehicle {
    public String getColor() { return "Red"; }
    public String getBrand() { return "Unknown"; }
}

// Printer.java
public class Printer<T extends Vehicle> {
    private T content;

    public Printer(T content) {
        this.content = content;
    }

    public void showInfo() {
        System.out.println(content.getColor());  // ✅ 可以直接调用！
        System.out.println(content.getBrand());  // ✅ 可以直接调用！
    }
}
```

如果把 `extends Vehicle` 去掉：

```java
public class Printer<T> {   // 没有约束
    public void showInfo() {
        content.getColor();  // ❌ 编译错误！Java 不知道 T 有没有 getColor() 方法
    }
}
```

### 4.4 使用接口作为约束

接口约束也用 `extends`（而不是 `implements`）：

```java
public interface Thing {
    void identify();
}

// 约束 T 必须是 Vehicle 子类 并 实现 Thing 接口
public class Printer<T extends Vehicle & Thing> {
    private T content;

    public void describe() {
        content.getColor();   // ✅ Vehicle 的方法
        content.identify();   // ✅ Thing 的方法
    }
}
```

> ⚠️ **规则：类必须写在接口前面！**
> - ✅ `T extends Vehicle & Thing` 
> - ❌ `T extends Thing & Vehicle`（编译错误）

### 4.5 有界泛型小结

```
无约束:  <T>                 → T 可以是任何引用类型
              
类上界:  <T extends Vehicle> → T 必须是 Vehicle 或其子类
                                   好处：可在类内部调用 Vehicle 的方法
              
接口上界: <T extends Thing>  → T 必须实现 Thing 接口
              
混合约束: <T extends Vehicle & Thing>  
                              → T 必须是 Vehicle 子类 **且** 实现 Thing
                              → 类名放前面，接口放后面
```

---

## 5. 泛型方法

### 5.1 场景

有时候不需要整个类是泛型的，**只需要某个方法是泛型的**。

### 5.2 声明泛型方法

在**返回值类型之前**加上 `<T>`：

```java
// 泛型方法：可以打印任意类型的变量
public static <T> void print(T content) {     // <T> 声明这是泛型方法
    System.out.println(content);
}
```

**对比泛型类 vs 泛型方法：**

| | 声明位置 | 作用范围 |
|------|---------|---------|
| 泛型类 | `<T>` 在类名后 | 整个类 |
| 泛型方法 | `<T>` 在返回值前 | 仅该方法 |

### 5.3 使用

```java
// 根据传入的参数，T 自动推断类型
print("hello");      // T → String
print(123);          // T → Integer
print(3.14);         // T → Double
print(new Car());    // T → Car
```

### 5.4 泛型方法的有界约束

和泛型类一样：

```java
// 只有 Vehicle 子类才能调用
public static <T extends Vehicle> void print(T content) {
    System.out.println(content.getColor());  // 可以调用 Vehicle 的方法
}

print(new Car());    // ✅
print("hello");      // ❌ String 不是 Vehicle 子类
```

### 5.5 多参数泛型方法

```java
public static <T, K> void printPair(T first, K second) {
    System.out.println("First: " + first);
    System.out.println("Second: " + second);
}

// 调用
printPair("hello", 123);   // T → String, K → Integer
printPair(new Car(), 3.14); // T → Car, K → Double
```

---

## 6. 通配符 —— 解决 List 的类型匹配问题

### 6.1 问题场景

假设有一个方法，接收一个 `List` 并打印：

```java
// 方法：打印存放 Integer 的 List
public static void printList(List<Integer> list) {
    for (Integer i : list) {
        System.out.println(i);
    }
}

List<Integer> intList = new ArrayList<>();
intList.add(1);
intList.add(2);
printList(intList);   // ✅ 正常
```

但如果想打印 `List<String>` 呢？

```java
List<String> strList = new ArrayList<>();
strList.add("hello");
printList(strList);   // ❌ 编译错误！List<String> 不能传给 List<Integer>
```

### 6.2 直观但不行的方案：用 Object

很多人会想：既然 String 和 Integer 都是 Object 的子类，那用 `List<Object>` 行不行？

```java
public static void printList(List<Object> list) {  // ❌ 不行！
    for (Object o : list) {
        System.out.println(o);
    }
}

List<String> strList = new ArrayList<>();
printList(strList);   // ❌ 仍然报错！！
```

### 6.3 关键认知：泛型的「不变性」

> **`List<String>` 不是 `List<Object>` 的子类！**

虽然 `String` 是 `Object` 的子类，但 **`List<String>` 作为一个整体，和 `List<Object>` 没有继承关系。**

这就是泛型的 **不变性 (Invariance)**：

```
     String  extends  Object              ✅
List<String>  NOT extends  List<Object>   ❌
```

### 6.4 解决方案：通配符 `?`

```java
// ✅ 用 ? 表示「不知道是什么类型，但都可以」
public static void printList(List<?> list) {
    for (Object o : list) {    // 取出来是 Object
        System.out.println(o);
    }
}

List<Integer> intList = new ArrayList<>();
List<String> strList = new ArrayList<>();
printList(intList);   // ✅
printList(strList);   // ✅
```

> `List<?>` 读作 "List of unknown"，可以匹配任意类型的 List。

### 6.5 上界通配符 `? extends X`

有时候不想匹配所有类型，想只限定某个范围：

```java
// 只接受 Vehicle 子类的 List
public static void processVehicles(List<? extends Vehicle> list) {
    for (Vehicle v : list) {
        System.out.println(v.getColor());   // 可以调用 Vehicle 的方法
    }
}

List<Car> cars = new ArrayList<>();
List<Bus> buses = new ArrayList<>();
List<Vehicle> vehicles = new ArrayList<>();

processVehicles(cars);      // ✅
processVehicles(buses);     // ✅
processVehicles(vehicles);  // ✅

List<String> strings = new ArrayList<>();
processVehicles(strings);   // ❌ String 不是 Vehicle 子类
```

**记忆方法：** `? extends Vehicle` → "上限是 Vehicle，必须是 Vehicle 或它的子类"。

### 6.6 下界通配符 `? super X`

指定类型的**下界** —— 必须是某个类的父类（包括自身）：

```java
// 只接受 Car 或其父类的 List
public static void processCars(List<? super Car> list) {
    // 可以往里面加 Car 及其子类
    list.add(new Car());
}

List<Car> cars = new ArrayList<>();
List<Vehicle> vehicles = new ArrayList<>();  // Vehicle 是 Car 的父类
List<Object> objects = new ArrayList<>();    // Object 是 Car 的父类

processCars(cars);      // ✅ Car 本身
processCars(vehicles);  // ✅ Vehicle 是 Car 的父类
processCars(objects);   // ✅ Object 是 Car 的父类

List<Bus> buses = new ArrayList<>();
processCars(buses);     // ❌ Bus 是 Vehicle 子类，不是 Car 的父类
```

**记忆方法：** `? super Car` → "下限是 Car，必须是 Car 或它的父类"。

### 6.7 通配符对比总结

| 写法 | 含义 | 能匹配 | 适用场景 |
|------|------|-------|---------|
| `List<?>` | 任意类型 | 所有 List | 只读不写 |
| `List<? extends X>` | X 及其子类 | List\<X\>, List\<X子类\> | 读取数据（上界） |
| `List<? super X>` | X 及其父类 | List\<X\>, List\<X父类\> | 写入数据（下界） |

> **口诀**：PECS — Producer Extends, Consumer Super  
> - 读取数据用 `? extends`（生产者）
> - 写入数据用 `? super`（消费者）

---

## 7. 类型安全与类型擦除

### 7.1 不推荐的做法：裸类型

```java
// ❌ 用 Object 作为泛型参数 —— 不推荐！
List<Object> list = new ArrayList<>();
list.add("hello");     // 放 String
list.add(123);         // 放 Integer
list.add(new Car());   // 放 Car

// 取出时需要强制转换
String s = (String) list.get(0);  // ✅ 编译通过
String s2 = (String) list.get(1); // ❌ 编译通过，运行时 ClassCastException！
```

### 7.2 问题的根源：泛型只在编译期检查

```java
List<Object> list = new ArrayList<>();
list.add(123);
String s = (String) list.get(0);  
// 编译器不报错（因为你做了强制转换）
// 运行时抛出 ClassCastException！
```

> **泛型的类型检查发生在编译阶段，运行时泛型信息会被擦除（Type Erasure）。**

### 7.3 类型擦除示意

| 编译期 | 运行期（擦除后） |
|--------|----------------|
| `List<Integer>` | `List`（原始类型） |
| `List<String>` | `List`（原始类型） |
| `Printer<Car>` | `Printer`（原始类型，T 被替换为 Object 或上界类型） |

> 这就是为什么 `List<Integer>` 和 `List<String>` 在运行时的 Class 对象是同一个 —— 都是 `List.class`。

---

## 8. 核心知识图谱

```
                            Java Generics（泛型）
                                   │
                  ┌────────────────┼─────────────────┐
                  │                │                  │
             泛型类 (Class)    泛型方法 (Method)    通配符 (?)
                  │                │                  │
         ┌────────┴────────┐  ┌───┴────┐    ┌────────┼────────┐
         │                 │  │        │    │        │        │
     无界 <T>          有界  无界<T>  有界   <?>   <? extends> <? super>
                        extends                           
                   ┌─────┴──────┐                      
                   │            │                      
             <T extends Class>  <T extends Interface>  
                   │                                  
             <T extends Class & Interface>             
                   │                                  
              类名前 接口名后                           
```

### 学习路径回顾（跟着视频的推导）

```
① 没有泛型 → 每增加类型就新建类 → 大量重复代码
         ↓
② 引入泛型类 <T> → 一个类处理所有类型
         ↓
③ 多类型参数 <T, K> → 支持多种不同的类型属性
         ↓
④ 有界泛型 <T extends X> → 限制可接受的类型范围 + 获得方法访问权限
         ↓
⑤ 泛型方法 <T> void method(T t) → 方法级别的泛型
         ↓
⑥ 通配符 List<?> → 解决 List 类型不匹配问题
         ↓
⑦ 上/下界通配符 ? extends / ? super → 精细化控制
         ↓
⑧ 理解类型安全 → 泛型 = 编译期保障，运行期擦除
```

---

## 9. 关键术语表

| 英文 | 中文 | 解释 |
|------|------|------|
| **Generics** | 泛型 | 将类型参数化，让类/方法适用于多种类型 |
| **Type Parameter** | 类型参数 | 尖括号中的占位符，如 T, K, V |
| **Type Argument** | 类型实参 | 调用时传入的具体类型，如 Integer, String |
| **Bounded Type Parameter** | 有界类型参数 | 用 extends 限制类型范围 |
| **Wildcard** | 通配符 | `?`，表示未知类型 |
| **Upper Bounded Wildcard** | 上界通配符 | `? extends X` |
| **Lower Bounded Wildcard** | 下界通配符 | `? super X` |
| **Type Erasure** | 类型擦除 | 泛型信息在编译后被移除 |
| **Type Safety** | 类型安全 | 泛型在编译期捕获类型错误的能力 |
| **Raw Type** | 原始类型 | 不带泛型参数的泛型类，不推荐使用 |
| **Invariance** | 不变性 | `List<A>` 不是 `List<B>` 的子类，即使 A 是 B 的子类 |
| **Angle Brackets** | 尖括号 | `<>`，泛型声明符号 |
| **Curly Braces** | 花括号 | `{}`，类体/方法体 |
| **Diamond Operator** | 菱形运算符 | `new ArrayList<>()` 中的 `<>`，Java 7 引入的类型推断简写 |

---

## 附录：完整代码速查

### 泛型类

```java
public class Box<T> {
    private T item;
    public Box(T item) { this.item = item; }
    public T get() { return item; }
    public void set(T item) { this.item = item; }
}

Box<String> box = new Box<>("hello");
```

### 有界泛型类

```java
public class NumberBox<T extends Number> {
    private T num;
    public NumberBox(T num) { this.num = num; }
    public double doubleValue() { return num.doubleValue(); }  // Number 的方法
}
```

### 泛型方法

```java
public static <T> T getFirst(List<T> list) {
    return list.get(0);
}
```

### 有界泛型方法

```java
public static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) > 0 ? a : b;
}
```

### 通配符

```java
// 读数据（生产者）
public static double sum(List<? extends Number> list) {
    double sum = 0;
    for (Number n : list) sum += n.doubleValue();
    return sum;
}

// 写数据（消费者）
public static void addNumbers(List<? super Integer> list) {
    for (int i = 1; i <= 5; i++) list.add(i);
}
```

