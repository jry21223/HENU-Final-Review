# 第5章 集合 笔记

> 来源：第5章 集合.pptx (123页)  
> 涵盖：Collection/List/Set/Map、迭代器、泛型、Lambda

---

## 目录

- [5.1 集合概述](#51-集合概述)
- [5.2 Collection 接口](#52-collection-接口)
- [5.3 List 接口](#53-list-接口)
- [5.4 Set 接口](#54-set-接口)
- [5.5 Map 接口](#55-map-接口)
- [5.6 泛型（速览）](#56-泛型速览)
- [5.7 Lambda 表达式](#57-lambda-表达式)

---

## 5.1 集合概述

> **集合 = 长度可变的容器**，用于存储任意类型的对象。都在 `java.util` 包，需要导包。

### 为什么需要集合？

- 数组长度**固定**，无法动态扩容
- 集合长度**可变**，存多少都没问题

### 两大体系

```
                        集合框架
                           │
              ┌────────────┴────────────┐
              │                         │
      Collection (单列)               Map (双列)
      存储一个个对象              存储 键→值 映射
              │                         │
       ┌──────┴──────┐           ┌─────┴─────┐
       │             │           │           │
     List           Set       HashMap     TreeMap
   有序可重复     无序不可重复  键无序     键有序
       │             │
  ┌────┴────┐   ┌───┴───┐
  │         │   │       │
ArrayList LinkedList HashSet TreeSet
 数组实现  链表实现  哈希表  红黑树
```

| | Collection（单列） | Map（双列） |
|---|------|------|
| 存储内容 | 一个个对象 | 键值对 Key → Value |
| 子接口 | List、Set | — |
| 特点 | — | Key 不可重复，一个 Key 映射一个 Value |
| 类比 | 一排座位 | 字典（查词→释义） |

---

## 5.2 Collection 接口

> Collection 是**所有单列集合的父接口**，定义了通用方法。

| 方法 | 说明 |
|------|------|
| `add(obj)` | 添加元素 |
| `remove(obj)` | 删除指定元素 |
| `size()` | 获取元素个数 |
| `isEmpty()` | 判断是否为空 |
| `contains(obj)` | 判断是否包含指定元素 |
| `clear()` | 清空所有元素 |
| `toArray()` | 集合转数组 |
| `iterator()` | 获取迭代器 |

---

## 5.3 List 接口

> **有序、可重复、有索引**。存入顺序 = 取出顺序。

### List 特有方法

| 方法 | 说明 |
|------|------|
| `add(index, obj)` | 在指定位置插入 |
| `get(index)` | 获取指定位置的元素 |
| `set(index, obj)` | 替换指定位置的元素 |
| `remove(index)` | 删除指定位置的元素 |
| `indexOf(obj)` | 返回元素第一次出现的索引 |

### 5.3.1 ArrayList —— 数组实现

> 底层是**可变数组**。**查询快，增删慢**。

```java
import java.util.ArrayList;

ArrayList<String> list = new ArrayList<>();
list.add("张三");
list.add("李四");
list.add("王五");

list.get(1);         // "李四"（通过索引访问）
list.remove(0);      // 删除第一个元素
list.size();         // 2
```

>[!note]- ArrayList 为什么查询快、增删慢？
>**查询快**：数组在内存中连续存储，通过索引直接计算地址 → O(1)。
>
>**增删慢**：插入/删除中间元素时，后面的所有元素都要**整体移动** → O(n)。
>
>就像排队插队——插一个人，后面所有人都要往后挪一步。

>[!warning]- 泛型安全机制
>不指定泛型时，集合可以存任意类型，但取出来是 Object，需要强转，容易出错。
>```java
>// ❌ 不安全
>ArrayList list = new ArrayList();
>list.add("hello");
>list.add(123);
>String s = (String) list.get(1);  // 运行时 ClassCastException！
>
>// ✅ 安全：指定泛型
>ArrayList<String> list = new ArrayList<>();
>list.add("hello");
>// list.add(123);  // 编译就报错！
>```

### 5.3.2 LinkedList —— 链表实现

> 底层是**双向链表**。**查询慢，增删快**。

```java
import java.util.LinkedList;

LinkedList<String> list = new LinkedList<>();
list.add("A");
list.addFirst("B");     // 头部插入
list.addLast("C");      // 尾部插入

list.getFirst();        // "B"
list.removeFirst();     // 删除头部
list.removeLast();      // 删除尾部
```

**LinkedList 特有方法：**

| 方法 | 说明 |
|------|------|
| `addFirst(obj)` / `addLast(obj)` | 头部/尾部添加 |
| `getFirst()` / `getLast()` | 获取头部/尾部元素 |
| `removeFirst()` / `removeLast()` | 删除头部/尾部元素 |

>[!note]- LinkedList 为什么增删快、查询慢？
>**增删快**：只需修改前后节点的引用指针 → O(1)。
>
>**查询慢**：必须从头部一个一个往后找 → O(n)。
>
>就像火车车厢——加一节或拆一节很容易（改挂钩），但要找第100节车厢得从第一节走过去。

### 5.3.3 ArrayList vs LinkedList

| | ArrayList | LinkedList |
|---|----------|------------|
| 底层 | 可变数组 | 双向链表 |
| 查询 | ✅ **快**（O(1)） | ❌ 慢（O(n)） |
| 增删 | ❌ 慢（O(n)） | ✅ **快**（O(1)） |
| 内存 | 连续空间 | 每个节点额外存前后指针 |
| 适用 | **多查询少增删** | **多增删少查询** |

### 5.3.4 迭代器 Iterator

> 专门用来遍历集合，像指针一样依次指向每个元素。

```java
ArrayList<String> list = new ArrayList<>();
list.add("A"); list.add("B"); list.add("C");

Iterator<String> it = list.iterator();
while (it.hasNext()) {         // 还有下一个？
    String s = it.next();      // 取下一个
    System.out.println(s);
}
```

**工作原理：**

```
  初始位置   第一次next()  第二次next()  第三次next()
     ↓          ↓            ↓            ↓
   [A] [B] [C]   [A] [B] [C]   [A] [B] [C]   [A] [B] [C]
    ↑            ↑            ↑            ↑  hasNext()=false
  指针          指针          指针          指针  结束
```

>[!danger]- 并发修改异常 ConcurrentModificationException
>**用迭代器遍历时，不能直接调集合的 `remove()` 删元素！**
>
>```java
>// ❌ 错误：迭代期间用集合的 remove()
>Iterator<String> it = list.iterator();
>while (it.hasNext()) {
>    String s = it.next();
>    if ("张三".equals(s)) {
>        list.remove(s);   // ❌ 抛 ConcurrentModificationException！
>    }
>}
>```
>
>**两种正确做法：**
>```java
>// 方法①：用迭代器自己的 remove()
>if ("张三".equals(s)) {
>    it.remove();   // ✅ 迭代器自己的删除方法
>}
>
>// 方法②：找到后 break（不再继续迭代）
>if ("张三".equals(s)) {
>    list.remove(s);
>    break;         // ✅ 删除后跳出循环
>}
>```

### 5.3.5 foreach（增强 for 循环）

```java
// 传统 for
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}

// foreach（更简洁）
for (String s : list) {
    System.out.println(s);
}
```

>[!warning]- foreach 的局限
>foreach 只能**读取**，不能**修改**集合中的元素。  
>需要修改时还是用传统 for 或迭代器。

---

## 5.4 Set 接口

> **无序、不可重复**。没有索引，不能通过位置访问。

### 5.4.1 HashSet —— 哈希表实现

```java
HashSet<String> set = new HashSet<>();
set.add("张三");
set.add("李四");
set.add("张三");    // 重复 → 不会存入！
System.out.println(set);  // [李四, 张三]（顺序不确定）
```

>[!note]- HashSet 如何判断重复？
>存入元素时的完整流程：
>1. 调用 `hashCode()` 计算哈希值 → 确定存储位置
>2. 如果该位置**没有元素** → 直接存入
>3. 如果该位置**已有元素** → 调用 `equals()` 逐个比较
>4. `equals()` 返回 `true` → 视为重复，**舍弃**
>5. `equals()` 返回 `false` → 存入（链表/红黑树）
>
>```java
>// 自定义类存入 HashSet 时，必须重写 hashCode() 和 equals()！
>class Student {
>    private int id;
>    
>    @Override
>    public int hashCode() {
>        return id;                   // 用 id 做哈希值
>    }
>    
>    @Override
>    public boolean equals(Object obj) {
>        return this.id == ((Student) obj).id;  // id 相同 = 同一学生
>    }
>}
>```

### 5.4.2 LinkedHashSet

> HashSet 的子类，用双向链表维护插入顺序。**有序的 Set**。

```java
LinkedHashSet<String> set = new LinkedHashSet<>();
set.add("B");
set.add("A");
set.add("C");
// 迭代顺序 = 插入顺序：B → A → C
```

### 5.4.3 TreeSet —— 红黑树实现，自动排序

```java
TreeSet<Integer> set = new TreeSet<>();
set.add(5);
set.add(1);
set.add(3);
System.out.println(set);  // [1, 3, 5]（自动排序！）
```

**自定义对象排序的两种方式：**

| 方式 | 实现 | 方法 |
|------|------|------|
| **自然排序** | `implements Comparable<T>` | 重写 `compareTo()` |
| **比较器排序** | 传入 `Comparator<T>` | 重写 `compare()` |

```java
// 方式①：自然排序
class Student implements Comparable<Student> {
    private int age;
    
    @Override
    public int compareTo(Student o) {
        return this.age - o.age; // 按年龄升序
    }
}

// 方式②：比较器排序
TreeSet<Student> set = new TreeSet<>(new Comparator<Student>() {
    @Override
    public int compare(Student o1, Student o2) {
        return o1.age - o2.age;
    }
});
```

> String、Integer 等包装类都已实现 Comparable，直接放 TreeSet 就能排序。

---

## 5.5 Map 接口

> **双列集合**，每个元素是 Key → Value 的映射。

### 5.5.1 常用方法

| 方法 | 说明 |
|------|------|
| `put(key, value)` | 存入键值对。键重复 → **值覆盖** |
| `get(key)` | 根据键获取值 |
| `remove(key)` | 删除指定键的映射 |
| `containsKey(key)` | 是否包含指定键 |
| `containsValue(value)` | 是否包含指定值 |
| `keySet()` | 返回所有键的 Set 集合 |
| `values()` | 返回所有值的 Collection |
| `size()` | 键值对个数 |

### 5.5.2 HashMap —— 哈希表实现

```java
HashMap<String, String> map = new HashMap<>();
map.put("1", "张三");
map.put("2", "李四");
map.put("3", "王五");
map.put("1", "赵六");   // 键重复 → 覆盖 "张三"

String name = map.get("1");  // "赵六"
```

>[!note]- HashMap 键唯一，值覆盖
>```java
>map.put("3", "王五");
>map.put("3", "赵六");  // 相同的键 → 王五被覆盖
>// 最终 map 中只有 2 个键值对，键"3"的值是"赵六"
>```

**两种遍历方式：**

```java
// 方式①：先遍历键，再取对应的值
for (String key : map.keySet()) {
    String value = map.get(key);
    System.out.println(key + " = " + value);
}

// 方式②：直接遍历键值对（推荐）
for (Map.Entry<String, String> entry : map.entrySet()) {
    String key = entry.getKey();
    String value = entry.getValue();
    System.out.println(key + " = " + value);
}
```

### 5.5.3 LinkedHashMap

> HashMap 的子类，双链表维护插入顺序。**有序的 Map**。

### 5.5.4 TreeMap

> 红黑树实现，**按键排序**的 Map。排序规则同 TreeSet（自然排序 / 比较器）。

### 5.5.5 Properties

> Hashtable 的子类，专门用来存取**配置文件**（键和值都是 String）。

```java
Properties p = new Properties();
p.setProperty("color", "red");
p.setProperty("font-size", "14px");
p.setProperty("language", "chinese");

p.getProperty("color");  // "red"
```

### 5.5.6 HashMap vs Hashtable

| | HashMap | Hashtable |
|---|--------|----------|
| 线程安全 | ❌ | ✅（synchronized） |
| null 键/值 | ✅ 允许 | ❌ 不允许 |
| 效率 | 高 | 低 |
| 现状 | **推荐使用** | 基本被取代 |

---

## 5.6 泛型速览

> 详细的泛型笔记参见 `Java泛型_详细笔记.md`，这里只做集合相关的核心速查。

### 为什么集合需要泛型？

```java
// ❌ 没有泛型：什么都往里塞，取出要强转
ArrayList list = new ArrayList();
list.add("hello");
list.add(123);            // 编译不报错
String s = (String) list.get(1);  // 运行时报错！

// ✅ 有泛型：编译期就限定类型
ArrayList<String> list = new ArrayList<>();
list.add("hello");
// list.add(123);          // 编译就报错！
String s = list.get(0);  // 不需要强转！
```

### 泛型通配符速查

| 写法 | 含义 | 示例 |
|------|------|------|
| `List<?>` | 任意类型 | 只读不写 |
| `List<? extends Number>` | Number 及其子类 | 可读，不能写 |
| `List<? super Integer>` | Integer 及其父类 | 可写 Integer |

---

## 5.7 Lambda 表达式

> JDK 8 新特性，简化匿名内部类写法。

```java
// 传统匿名内部类
new Thread(new Runnable() {
    public void run() {
        System.out.println("线程运行");
    }
}).start();

// Lambda 表达式（一样的功能）
new Thread(() -> {
    System.out.println("线程运行");
}).start();
```

**Lambda 语法：**

| 格式 | 示例 |
|------|------|
| `() -> 表达式` | `() -> System.out.println("hi")` |
| `(参数) -> 表达式` | `(s) -> System.out.println(s)` |
| `(参数) -> { 语句块 }` | `(a, b) -> { return a + b; }` |

---

## 总结：集合框架全景图

```
                          集合
                           │
              ┌────────────┴────────────┐
              │                         │
        Collection                    Map
         (单列)                    (键→值)
              │                         │
       ┌──────┴──────┐           ┌─────┴─────┐
       │             │           │           │
     List           Set       HashMap     TreeMap
   有序可重复    无序不可重复   (哈希表)    (红黑树)
       │             │           │           │
  ┌────┴────┐   ┌───┴───┐   LinkedHashMap  └─ Properties
  │         │   │       │   (有序Map)
ArrayList LinkedList HashSet
(数组)    (链表)   (哈希)
           │       │
      增删快  查询快  ├─ LinkedHashSet (有序Set)
                      └─ TreeSet (排序Set)
                          └─ Comparable / Comparator
```

## 四大选择原则

| 场景 | 选什么 |
|------|--------|
| 多查询，少增删 | `ArrayList` |
| 多增删，少查询 | `LinkedList` |
| 去重，不关心顺序 | `HashSet` |
| 去重，要排序 | `TreeSet` |
| 去重，要保持插入顺序 | `LinkedHashSet` |
| 键值对，不关心顺序 | `HashMap` |
| 键值对，要排序 | `TreeMap` |
| 键值对，要保持插入顺序 | `LinkedHashMap` |

## 核心坑点速查

| 坑 | 说明 |
|----|------|
| 迭代器删元素 | 用 `it.remove()`，不要用 `list.remove()` |
| HashSet 去自定义对象 | 必须重写 `hashCode()` 和 `equals()` |
| TreeSet 存自定义对象 | 必须实现 `Comparable` 或传入 `Comparator` |
| HashMap 键重复 | 后 put 的值**覆盖**前一个，不是报错 |
| 泛型信息运行时擦除 | `ArrayList<String>` 和 `ArrayList<Integer>` 运行时都是 ArrayList |

