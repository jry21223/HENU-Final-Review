## java中的数据类型

### java中的取值类型

![image 20](assets/image%2020.png)

![image 21](assets/image%2021.png)

![image 22](assets/image%2022.png)

### 数据间的转换

![image 23](assets/image%2023.png)

![image 24](assets/image%2024.png)

### 引用数据类型

![image 25](assets/image%2025.png)

引用数据类型：类，接口，数组，枚举，注解

![image 26](assets/image%2026.png)

## java中的输入

![image 27](assets/image%2027.png)

## idea中的项目结构

** project→module→package→class**

其中包就相当于文件夹

如：
short a;
a+=1;
而short参与运算的时候会强制转化为int类型，因此运算之后的类型为int，而这个int要赋值给short，在这一步发生了强制转换

![image 28](assets/image%2028.png)

## 字符串

### java中可以直接对字符串进行拼接

![image 29](assets/image%2029.png)

![image 30](assets/image%2030.png)

### 字符串方法

学习 `String` 的方法之前，你必须先牢记一个 Java 宇宙中的铁律：**String 是不可变的（Immutable）**。

这意味着，无论你对字符串调用什么方法（比如替换、变大写），它都**绝对不会改变原来的字符串**，而是会在内存里**生成并返回一个新的字符串**。

`String` 类提供了几十个非常实用的方法，为了方便记忆，我们可以把它们分为 **五大门派**：

#### 1. 查勘派（获取信息）

这部分方法用于调查字符串内部的情况。

- **`length()`**：返回字符串里有多少个字符。注意，数组获取长度是 `arr.length`（属性），而字符串是 `str.length()`（方法）。
    
- **`charAt(int index)`**：就像去抽屉拿东西，传入一个索引（从 0 开始），它还给你那个位置的字符。
    
- **`indexOf(String str)`**：找人专用。帮你在字符串里寻找某个子串**第一次**出现的位置。如果没找到，就返回 `-1`。
    
- **`lastIndexOf(String str)`**：和上面类似，只是它是从后往前找（最后一次出现的位置）。
    

#### 2. 变形派（转换与处理）

记住，这类方法都会产生新的字符串！

- **`toLowerCase()` / `toUpperCase()`**：把字符串里的字母全部变成小写/大写。
    
- **`trim()`**：非常常用！专门用来“掐头去尾”，也就是去除字符串**最前面**和**最后面**的空白字符（空格、换行等），但不会去掉中间的空格。
    
- **`replace(CharSequence target, CharSequence replacement)`**：替换大师。把字符串里所有匹配的旧内容，全部替换成新内容。
    
- **`toCharArray()`** 将字符串转化为字符数组
#### 3. 屠宰派（截取与分割）

- **`substring(int beginIndex, int endIndex)`**：截取子串。Java 里几乎所有的范围都是“左闭右开” `[begin, end)`，即包含起始位置，但不包含结束位置。如果不传 `endIndex`，就默认截取到末尾。
    
- **`split(String regex)`**：碎纸机。根据你传入的规则（正则表达式或普通字符串），把一整块字符串切碎，返回一个字符串数组（`String[]`）。比如用 `,` 切割 `"A,B,C"` 会得到 `["A", "B", "C"]`。
    

#### 4. 判官派（布尔判断）

这些方法统一返回 `boolean`（`true` 或 `false`）。

- **`startsWith(String prefix)`**：判断是不是以某个特定的前缀开头。
    
- **`endsWith(String suffix)`**：判断是不是以某个特定的后缀结尾。
    
- **`contains(CharSequence s)`**：判断字符串里是否包含某段特定的内容。
    
- **`isEmpty()`**：判断字符串是不是空的（即长度为 0，`""`）。_注意它和 `null` 不同，如果是 `null` 调用此方法会报空指针异常。_
    

#### 5. 比较派（内容对比）

- **`equals(Object anObject)`**：最重要的方法！我们在之前的题目里遇见过，比较两个字符串的**内容**是否完全一样（区分大小写）。绝对不要用 `==` 比较字符串内容。
    
- **`equalsIgnoreCase(String anotherString)`**：比较内容，但**忽略大小写**（比如用于验证码比对，"aBc" 和 "ABC" 会被认为相同）。
    



# 运算符
对于对象引用类型来说，`==` 运算符比较的是对象的 **内存地址**（即判断它们是否为同一个对象
## 运算符优先级

![image 31](assets/image%2031.png)

小括号优先于所有，万能小括号

# 内存分配

![image 32](assets/image%2032.png)

![image 33](assets/image%2033.png)

# 权限修饰符

同class访问→private

同包访问→留空

不同包的子class→protected

不同包的无关class→public

### 1. 顶层结构（外部类、接口）

当你新建一个独立的文件，写一个类或接口时：

- **默认权限**：**包级私有（Package-private）**。
    
- **含义**：只有和这个类处于同一个包（Package）下的其他类，才能看见并使用它。一旦跨包，哪怕是子类也无法访问。
    
- _注：顶层结构只能是 `public` 或默认，绝对不能用 `private` 或 `protected` 修饰。_
    

### 2. 类中的成员（变量、普通方法、构造方法）

在普通的 `class` 内部定义变量或方法时，什么都不写：

- **默认权限**：**包级私有（Package-private）**。
    
- **含义**：与类本身一样，当前包内的任何类都可以直接调用这个属性或方法，但不同包的类不行（即便继承了它也不行）。
    

### 3. 接口中的成员（🔥 极度高频踩坑区）

**接口是 Java 中默认修饰符最特殊、最霸道的地方。** 为了保证接口的“契约”性质，你写不写修饰符，编译器都会强行给你加上最严格的公开限制：

- **接口里的变量**：
    
    - 你写：`int MAX_AGE = 100;`
        
    - 默认补充为：**`public static final`** `int MAX_AGE = 100;`
        
    - _含义_：它永远是一个公开的静态全局常量，不能被修改。
        
- **接口里的方法（普通方法）**：
    
    - 你写：`void doSomething();`
        
    - 默认补充为：**`public abstract`** `void doSomething();`
        
    - _含义_：它永远是公开的抽象方法，实现类必须重写它（而且实现类重写时，必须显式加上 `public`，否则会因为权限缩小而报错）。
        
- **接口里的默认方法和静态方法（Java 8+）**：
    
    - 你写：`default void test() {}` 或 `static void test2() {}`
        
    - 默认补充为：**`public`** `default void test() {}` 等。
        
- **接口里的内部类/内部接口**：
    
    - 默认补充为：**`public static`**。
        

### 4. 局部变量（方法内部的变量）

当你在一个方法、`if` 块、`for` 循环里声明变量时：

- **默认权限**：**无权限概念**。
    
- **含义**：局部变量的生命周期严格绑定在它所在的 `{}` 大括号内。你**不能**给它加任何权限修饰符（不能加 `public` 等），唯一能加的修饰符只有 `final`。
    

### 总结与核心法则

为了让你更直观地把“默认（包级私有）”放到整个 Java 权限体系中去对比，你可以通过下面这个**修饰符透视沙盒**来点一点。

记住一个核心原则：**类成员的默认是“只给同包兄弟看”，而接口成员的默认是“全网公开”。**

### 主方法需要用public来修饰吗?

这个问题非常有意思！如果放在几年前，这道题的答案是绝对的**“不可以”。但随着 Java 语言的演进，到了今天，答案变成了“可以，而且官方甚至鼓励你这么做！”**

为了把这个问题解释清楚，我们需要分**“传统 Java”和“现代 Java”**两个阶段来看：

在以前，Java 的主方法签名被定死成了这副模样，一个字都不能少：

```java
public class MyProgram {
    public static void main(String[] args) {
        // ...
    }
}
```

**为什么必须要 **`public`**？**

因为 `main` 方法是整个 Java 程序的入口。当你使用 `java` 命令运行某个类时，**Java 虚拟机（JVM）** 是从类的外部（甚至是包外部）来调用这个方法的。如果你的 `main` 方法不使用 `public`，JVM 就没有足够的访问权限去执行它。

- *补充说明：如果你偷偷把 *`public`* 去掉（变成默认的包可见）或者改成 *`private`*，代码其实****可以正常编译****，但是一运行，JVM 就会无情地给你抛出报错：*`Error: Main method not found in class ... please define the main method as: public static void main(String[] args)`*。*

---

Java 官方一直被吐槽“写个 Hello World 都要写一大堆难以理解的废话”。为了降低新手的学习门槛并简化代码，Java 从 21 版本开始引入了（并在后续 Java 22/23 中不断完善）一个重磅特性：**隐式声明的类与实例主方法（Implicitly Declared Classes and Instance Main Methods）**。

在这个新特性的加持下，JVM 的启动协议被大大放宽了。你**不仅可以省掉 **`**public**`**，连 **`**static**`** 和 **`**String[] args**`** 都可以统统扔掉！**

**新时代的极简写法：**

```java
// 在 Java 21+ 中，你可以直接这么写，甚至连外层的 class 声明都可以省略
void main() {
    System.out.println("告别 public static void main！");
}
```

在最新的 JVM 启动规则中，它寻找程序入口的逻辑变得非常灵活：

1. 优先寻找传统的 `public static void main(String[] args)`。
2. 如果找不到，它允许寻找**非 public** 的（比如无修饰符或 protected）`static void main` 方法。
3. 如果还找不到，它甚至允许去调用**非 static 且非 public 的实例方法** `void main()`。

- 如果你接手的是**老项目**或使用旧版本 JDK，请老老实实加上 `public`。
- 如果你使用的是 **Java 21 及以上版本**，尤其是写一些小脚本、算法题或新手村练习，完全可以不写 `public`，享受极简语法的快乐。

# 面向对象

类相当于一个蓝图

而对象是通过蓝图创建的实例

![image 34](assets/image%2034.png)

## 什么是封装？

封装就是指，对象代表什么，就封装对应的数据，并提供数据对应的行为。

## 类class

- 驼峰方式
- 一个文件中可以多个类，但是只有一个是public修饰，且该类必须为文件名

### 类中的构造方法：

`public class Student{`

`}`

-  这个方法名和类名相同
-  无返回值
-  无函数类型

系统默认提供构造方法(无参)，如果有自定义的就优先读取自定义的方法

*当你自己写了有参构造的时候，系统自带的无参构造就消失了，这时候还要自己补上*

有参构造：

```java
package prac1;

import java.util.Scanner;

public class Student {
     String name;
     int grade;
     String school;

    // 构造方法1：最完整的构造方法
    public Student(String name, int grade, String school) {
        this.name = name;
        this.grade = grade;
        this.school = school;
    }

    // 构造方法2：如果未提供学校，使用默认值
    public Student(String name, int grade) {
        this(name, grade, "光明小学"); // 调用上面的构造方法1
    }

    // 构造方法3：如果只提供名字
    public Student(String name) {
        this(name, 1); // 调用上面的构造方法2，年级默认为1
    }
}
```

无参构造：

```java
    // 这就是一个明确写出来的【无参构造方法】
    public Student() {
        // 你可以在这里给属性赋默认值，或者执行一些初始化操作
        this.name = "未知姓名";
        this.age = 18;
        System.out.println("调用了无参构造方法，创建了一个默认学生。");
    }
}
```

## javabean类

![image 37](assets/image%2037.png)

使用ptg插件可以直接生成javabean：先写好私有属性右键点击空白处，点ptg to java

使用alt+insert直接写getter，setter，构造函数

## static关键字

### 静态变量

当一个变量被 static 修饰时，它就成了所有实例共享的变量。无论你 new 了多少个对象，这个变量在内存中都只有一份。它在类被 JVM 加载时分配内存

### 静态方法

静态方法同样属于类。你可以直接通过 `类名.方法名()` 来调用它，而不需要实例化对象。

注意： 静态方法内部绝对不能直接访问非静态的成员变量或方法，也不能使用 this 或 super 关键字（因为调用静态方法时，可能根本还没有创建任何对象）

使用场景： 通常用于编写工具（Utility classes），比如处理数学计算、字符串格式化等，因为这些操作通常不依赖于对象的状态。

## 接口

接口的直观理解：
假设你要给电脑外接设备。电脑主板的设计师不可能提前预知全世界会有多少种鼠标、键盘、U 盘。那怎么办？

设计师只定义了一个**标准形状和引脚规则**——这就是 USB 接口。 只要任何厂家（不管是罗技还是雷蛇）生产的设备**符合这个 USB 接口的规范**，插上去就能用。

```java
public interface SmartDevice {
    // 定义了一个标准：所有接入的设备都必须能被“初始化”
    void init();
    
    // 定义了一个标准：所有接入的设备都必须能“执行动作”
    void executeAction(String command);
}

```
然后，你可以分别写不同的类去实现（implements）这个接口：


```java
// 机械臂类，承诺遵守 SmartDevice 的规则
public class RoboticArm implements SmartDevice {
    @Override
    public void init() {
        System.out.println("机械臂关节复位归零...");
    }

    @Override
    public void executeAction(String command) {
        System.out.println("机械臂执行抓取动作...");
    }
}

// 摄像头类，也遵守同样的规则
public class CameraDevice implements SmartDevice {
    @Override
    public void init() {
        System.out.println("摄像头开启，调整焦距...");
    }

    @Override
    public void executeAction(String command) {
        System.out.println("摄像头开启目标检测与追踪...");
    }
}
```

## super
### 1. 调用父类的构造方法（最常见！）

**铁律：生儿子之前，必须先有爹。**

在 Java 中，当你 `new` 一个子类对象时，Java 会强制要求先调用父类的构造方法，把父类的那部分初始化好，然后再初始化子类自己。

- **隐式调用**：如果父类有一个无参构造方法，你可以不写 `super()`，编译器会自动在子类构造方法的第一行帮你默默加上去。
    
- **显式调用（必须手动写）**：如果父类**只有**带参数的构造方法（就像咱们刚才的 `Shape` 类），编译器就傻眼了，因为它不知道该传什么参数给父类。这时候，你必须**手动在子类构造方法的第一行**写上 `super(参数)`。
    

**刚才代码里的经典重现：**

Java

```
// 父类：包工头 Shape，要求必须给他配一个油漆工 drawCircle
public Shape(DrawCircle drawCircle) {
    this.drawCircle = drawCircle;
}

// 子类：具体的 Circle
public Circle(int x, int y, int radius, DrawCircle drawCircle) {
    // 💡 第一件事：先把收到的画笔递给老爹，让他存起来！
    // 注意：这一行必须放在子类构造方法的最前面，写在第二行都会直接报错。
    super(drawCircle); 
    
    // 第二件事：再处理自己的事情
    this.x = x;
    // ...
}
```

### 2. 调用父类被重写（Override）的方法

有时候，子类觉得父类的方法不够好，就把它重写了。但是重写并不意味着把父类的方法“杀”了，它只是被隐藏了起来。

如果你在子类的方法里，突然又想借用一下父类原来的逻辑，就可以用 `super.方法名()`。

**通俗场景：**

Java

```
class Father {
    public void cook() {
        System.out.println("煮白米饭");
    }
}

class Son extends Father {
    @Override
    public void cook() {
        // 儿子想做蛋炒饭，但他不会煮饭。
        // 所以先喊老爹把饭煮好：
        super.cook(); 
        
        // 然后儿子自己再加料炒一下：
        System.out.println("加鸡蛋和葱花炒一炒");
    }
}
```

### 3. 访问父类被隐藏的成员变量

如果子类定义了一个和父类名字一模一样的变量（这在专业上叫“隐藏/Shadowing”，虽然平时极不推荐这么干），那么在子类里直接写这个变量名，默认访问的是子类自己的。

如果想要拿到父类的那个变量，就必须加上 `super.`。

**通俗场景：**

Java

```
class Father {
    int age = 50;
}

class Son extends Father {
    int age = 20;

    public void printAge() {
        System.out.println(age);       // 打印 20 (我自己)
        System.out.println(this.age);  // 打印 20 (我自己)
        System.out.println(super.age); // 打印 50 (我爹的年龄)
    }
}
```

**一句话总结避坑：**

- `super()` 加括号：代表**调爹的构造方法**，只能且必须写在子类构造方法的**第一行**。
    
- `super.` 加点：代表**用爹的方法或变量**，可以写在子类普通方法里的任意位置。


## default关键字
### Java 8 接口里的“救世主”（极其重要🔥）

既然你现在在写 Spring Boot 项目，你一定会大量遇到这个用法。

在 Java 8 之前，Java 有一个死板的规定：**`interface`（接口）里只能有抽象方法（没有方法体的方法），绝对不能写具体的实现逻辑。**

但这带来了一个巨大的灾难：假设有一个写好的接口被 100 个类实现了，如果我现在想给这个接口新增一个方法，那这 100 个实现类全部都会报错，必须挨个去重写这个新方法！

为了解决这个问题，Java 8 引入了 `default` 关键字。**只要在接口的方法前面加上 `default`，这个方法就可以拥有方法体（具体的代码逻辑）了。**


```java
public interface Animal {
    // 传统的抽象方法：谁实现我，谁就必须重写它
    void eat();

    // Java 8 引入的 default 方法：带有默认的实现逻辑
    default void sleep() {
        System.out.println("动物默认都需要闭眼睡觉...");
    }
}
```

**有什么好处？** 现在，即使有 100 个类实现了 `Animal` 接口，它们也不需要去改写代码。如果你不重写 `sleep()`，就会自动继承这个默认逻辑；如果你想特殊处理（比如鱼睁着眼睛睡觉），再去重写它即可。

在 Spring Boot 中，比如配置跨域或者拦截器的 `WebMvcConfigurer` 接口，里面全是用 `default` 修饰的方法。这让你可以“想配置哪个就重写哪个”，而不需要把几十个方法全部重写一遍。
### 注解里的“默认值”

在注解中，`default` 的作用就是**把一个“必填项”变成“选填项”**。

- **没有 `default`**：这个参数是**硬性要求**。你不填，代码直接画红线，连编译都通不过。
    
- **有 `default`**：这个参数是**可选的**。你不填，框架就拿 `default` 后面的值去兜底。


# 内部类


[[Java 内部类]]

# 多态

字面意思：**同一个行为，在不同对象身上会表现出不同的形态。**

在 Java 里，多态的核心表达式只有一句话：

> **父类（或接口）的引用，指向子类（或实现类）的对象。**

比如你笔记里的接口 `SmartDevice` 就是一个“类型标准”，而 `RoboticArm` 和 `CameraDevice` 是它的两种具体实现。  
多态就是让一个 `SmartDevice` 类型的变量，既能装机械臂，也能装摄像头。

---

### 二、多态的前提条件

- 必须存在 **继承 / 实现** 关系（`implements SmartDevice`）
- 必须有 **方法重写**（`@Override init()`、`executeAction()`）
- 必须是 **父类引用指向子类对象**（向上转型）

缺任何一个，多态都不成立。

---

### 三、多态的直观写法（结合你的笔记）

```java
// 接口类型       实现类对象（向上转型）
SmartDevice device1 = new RoboticArm();
SmartDevice device2 = new CameraDevice();

device1.init();          // 输出：机械臂关节复位归零...
device2.init();          // 输出：摄像头开启，调整焦距...

device1.executeAction("抓");  // 机械臂执行抓取动作...
device2.executeAction("追");  // 摄像头开启目标检测与追踪...
```

**同样是调用 `init()`，因为实际对象不同，执行的结果完全不同。**  
这就是多态——**同一个方法调用，呈现出多种不同的行为。**

---

### 四、多态的编译与运行规则（重要！）

记住这个口诀：**“编译看左边，运行看右边。”**

用上面的代码举例：

```java
SmartDevice device = new RoboticArm();
device.init();  
```

- **编译时**：`device` 的类型是 `SmartDevice`，所以编译器只认 `SmartDevice` 里定义的方法。  
  如果 `RoboticArm` 有一个自己的专有方法 `grab()`，而你写 `device.grab()`，**编译直接报错**，因为左边（接口）里没有这个方法。
- **运行时**：真正执行的是右边 `new RoboticArm()` 里的重写方法，所以调用的确实是机械臂的 `init()`。

同理：

- 成员变量：编译和运行 **全都看左边**（父类/接口的变量）
- 静态方法：编译和运行 **全都看左边**（不推荐用对象调静态方法）

---

### 五、多态的好处（为什么你的项目需要它）

拿你笔记里的战车系统#举例，如果以后你要接入一个“无人机设备”，只需要让它的类实现 `SmartDevice` 接口，重写 `init()` 和 `executeAction()`，然后就可以直接把对象传给所有已经写好的、接收 `SmartDevice` 参数的代码：

```java
public void startAllDevices(List<SmartDevice> devices) {
    for (SmartDevice d : devices) {
        d.init();   // 不用管它是机械臂、摄像头还是无人机
    }
}
```

这就是多态带来的 **可扩展性** 和 **松耦合**：
- 新增设备时，你**完全不需要改动** `startAllDevices` 这个方法的代码
- 你可以面向接口编程，而不是面向具体的类编程

---

### 六、多态的局限 & 如何突破

多态的弱点是：**通过父类/接口引用，只能调用父类/接口里定义的方法，无法直接调用子类特有的方法。**

比如 `RoboticArm` 有一个专有方法 `selfCheck()`，你没办法这样写：

```java
SmartDevice device = new RoboticArm();
device.selfCheck();   // ❌ 编译错误，因为 SmartDevice 里没有 selfCheck()
```

**解决办法：向下转型 + instanceof 判断。**

```java
if (device instanceof RoboticArm) {
    RoboticArm arm = (RoboticArm) device;
    arm.selfCheck();   // ✅ 先确认类型，再强转调用
}
```

> ⚠️ 向下转型有风险，如果类型不匹配会抛 `ClassCastException`，所以一定要先用 `instanceof` 检查。

---


# Java 集合框架（Collections Framework）

Java 集合框架主要用于存储和操作成组的数据，它摆脱了传统数组长度固定的限制，提供了丰富的数据结构实现。其核心体系主要分为两大派系：**`Collection`（单列集合）** 和 **`Map`（双列键值对）**。
[[Java 集合]]


在集合类中，我们操作的元素都是对象

想要操作基本数据类型的话就要调用他们对应的包装类

| **基本数据类型** | **包装类 (java.lang)**      |
| ---------- | ------------------------ |
| `byte`     | `Byte`                   |
| `short`    | `Short`                  |
| `int`      | **`Integer`** (注意特殊拼写)   |
| `long`     | `Long`                   |
| `float`    | `Float`                  |
| `double`   | `Double`                 |
| `char`     | **`Character`** (注意特殊拼写) |
| `boolean`  | `Boolean`                |
在 Java 5 之前，你必须手动在基本类型和包装类之间转换，代码写起来非常繁琐。Java 5 之后引入了 **自动装箱 (Autoboxing)** 和 **自动拆箱 (Unboxing)**，让编译器帮你完成转换。

自动装箱:
`Integer a = 10; // 等价于 Integer.valueOf(10);`

自动拆箱:
`int b = a //等价于 intValue(a)`

## 一、 核心接口与经典实现类

### 1. List 接口（有序、可重复、有索引）

- **`ArrayList`（动态数组）**
    
    - **底层结构**：Object 数组。
        
    - **特性**：随机访问效率极高（$O(1)$），因为可以通过索引直接定位；但中间插入和删除操作较慢（$O(n)$），需要移动后续元素。
        
    - **扩容机制**：初始容量通常为 10，当空间不足时，自动扩容为原来的 **1.5 倍**。
        
- **`LinkedList`（双向链表）**
    
    - **底层结构**：双向链表。
        
    - **特性**：首尾插入和删除效率极高（$O(1)$），只需修改指针；但随机访问性能较差（$O(n)$），需要从头或尾遍历。
        
    - **其他用途**：由于实现了 `Deque` 接口，常被用作双端队列、栈（Stack）或普通队列。
        

### 2. Set 接口（无序、不可重复）

- **`HashSet`（无序散列表）**
    
    - **底层结构**：基于 `HashMap` 实现（元素存放在 HashMap 的 Key 中，Value 为一个统一的虚拟对象）。
        
    - **去重原理**：依赖元素的 `hashCode()` 和 `equals()` 方法。先比较哈希值，若相同再比较内容。
        
- **`TreeSet`（有序红黑树）**
    
    - **底层结构**：基于 `TreeMap`（红黑树）实现。
        
    - **特性**：元素会自动处于排序状态。支持自然排序（实现 `Comparable` 接口）或定制排序（传入 `Comparator`）。
        
    - **时间复杂度**：增删改查均为 $O(\log n)$。
        

### 3. Map 接口（双列集合、Key 唯一、Value 可重复）

- **`HashMap`（哈希表）**
    
    - **底层结构**：**数组 + 链表 + 红黑树**（JDK 1.8+）。
        
    - **树化阈值**：当链表长度大于 8，且数组总长度大于 64 时，链表会转换为红黑树，以将极端情况下的查找复杂度从 $O(n)$ 降到 $O(\log n)$。
        
    - **特性**：访问速度极快，允许存在一个 null 键和多个 null 值。线程不安全。
        
- **`TreeMap`（红黑树映射）**
    
    - **底层结构**：红黑树。
        
    - **特性**：根据 Key 进行自动排序，常用于需要按键的顺序输出或遍历的业务场景。
        

## 二、 集合框架高性能选型指南

为了在实际开发或算法设计中达到最优性能，可以根据以下决策链进行选型：

1. **是否为键值对（Key-Value）？**
    
    - **是** $\rightarrow$ 使用 `Map` 体系
        
        - 需要按键排序：`TreeMap`
            
        - 不关心顺序、追求极致性能：`HashMap`
            
        - 高并发多线程环境：`ConcurrentHashMap`
            
    - **否** $\rightarrow$ 使用 `Collection` 体系
        
        - **元素是否允许重复？**
            
            - **允许（List）** $\rightarrow$ 频繁随机查询使用 `ArrayList`；频繁首尾增删使用 `LinkedList`。
                
            - **不允许（Set）** $\rightarrow$ 不需要排序使用 `HashSet`；需要自动排序使用 `TreeSet`。
                


### Java 集合特性矩阵

| 集合类名称                | 线程安全  | Null 策略 |
| -------------------- | ----- | ------- |
| ArrayList            | ❌ 不安全 | 🟢 允许   |
| LinkedList           | ❌ 不安全 | 🟢 允许   |
| Vector               | ✅ 安全  | 🟢 允许   |
| CopyOnWriteArrayList | ✅ 安全  | 🟢 允许   |
| HashSet              | ❌ 不安全 | 🟢 允许   |
| TreeSet              | ❌ 不安全 | 🔴 拒绝   |
| HashMap              | ❌ 不安全 | 🟢 允许   |
| TreeMap              | ❌ 不安全 | 🔴 拒绝   |
| Hashtable            | ✅ 安全  | 🔴 拒绝   |
| ConcurrentHashMap    | ✅ 安全  | 🔴 拒绝   |
## MAP接口


在 Java 后端开发中，`Map` 绝对是你未来使用频率最高的数据结构之一。我们可以把它理解为**云端司令部里的“智能储物柜”**。

### 核心概念：键值对 (Key-Value)

传统的数组（比如 `List`）是靠“索引”（0, 1, 2...）来存取东西的，就像一排没有名字的储物柜，你只能记住“我的东西在第 3 个柜子”。

而 `Map` 是靠**“键值对” (Key-Value)** 来存取东西的。

- **Key (键)**：相当于储物柜上的“专属标签”。**标签必须是唯一的**，不能重复。
- **Value (值)**：相当于储物柜里装的“具体物品”。物品可以重复，也可以是任意类型（数字、字符串、甚至另一个 Map）。

### 最强搭档：`HashMap`

`Map` 本身只是一个接口（定义了储物柜的标准），它有很多具体的实现类。我们最常用的是 *`HashMap`*。它的特点是：**存取速度极快（查找时间复杂度接近 O(1)），但它不保证存进去和拿出来的顺序是一致的。**

### Map 的 CRUD

让我们结合 Magichine 战车的遥测数据，来看看怎么操作这个“智能储物柜”：

```java
// 1. 创建一个储物柜 (Key是String类型，Value是Object任意类型)
Map<String, Object> carData = new HashMap<>();

// =================【增】=================
// 使用 put(key, value) 往里放东西
carData.put("deviceId", "Magichine-001");
carData.put("battery", 85);       // 放整数
carData.put("isOnline", true);    // 放布尔值

// =================【改】=================
// 还是用 put。因为 Key 是唯一的，如果放入相同的 Key，新的值会“覆盖”旧的值
carData.put("battery", 82);       // 战车跑了一会儿，电量更新为 82

// =================【查】=================
// 使用 get(key) 通过标签拿东西
Object currentBattery = carData.get("battery"); 
System.out.println("当前电量：" + currentBattery); // 输出 82

// 使用 containsKey(key) 检查有没有某个标签
if (carData.containsKey("error_code")) {
    System.out.println("警告：战车发生故障！");
} else {
    System.out.println("战车运行良好。");
}

// =================【删】=================
// 使用 remove(key) 丢弃某个标签和它对应的值
carData.remove("isOnline");
```

###  如何遍历 Map？（大清点）

如果你想把储物柜里的所有标签和物品都清点一遍，最现代、最优雅的做法是使用 Java 8 的 `forEach` 结合 Lambda 表达式：

```java
// 遍历打印出战车所有的遥测数据
carData.forEach((key, value) -> {
    System.out.println("遥测指标 [" + key + "] 的值是：" + value);
});
```


---

## ArrayList

`ArrayList` 是 Java 集合框架中最常用的 **List 接口**的实现类。它的本质是一个**可以自动扩容的数组**。

- 底层数据结构：`Object[]` 数组
- 特点：查询快（通过索引 O(1)），增删慢（需要移动大量元素，平均 O(n)）
- 有序、可重复、允许 `null`

> 类比你和何同学做的战车管理系统：假设有一个“已入场战车列表”，这个列表可以用 `ArrayList` 实现，因为需要频繁根据索引查看战车，但不会频繁在中间插入或删除。

---

### 二、底层实现与扩容机制

#### 1. 构造与初始化

```java
// 无参构造
ArrayList<String> list = new ArrayList<>();
```

- **JDK 7+**：无参构造时，初始化的是一个**空数组** `{}`，当你第一次 `add` 时才分配容量为 **10** 的数组。
- 若使用带初始容量参数的构造，则直接创建指定大小的数组。

#### 2. 自动扩容

当调用 `add()` 且内部数组容量不足时，会触发 `grow()` 方法：

1. **计算新容量**：`newCapacity = oldCapacity + (oldCapacity >> 1)`，即**原容量的 1.5 倍**。
2. 如果 1.5 倍还不够，就直接使用所需的最小容量。
3. 通过 `Arrays.copyOf()` 将原数组元素拷贝到新数组中。

**源码核心逻辑**（JDK 17 简化版）：
```java
private Object[] grow(int minCapacity) {
    int oldCapacity = elementData.length;
    if (oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        int newCapacity = ArraysSupport.newLength(oldCapacity,
                minCapacity - oldCapacity, /* 最小增长量 */
                oldCapacity >> 1);         /* 优先增长量（0.5倍） */
        return elementData = Arrays.copyOf(elementData, newCapacity);
    } else {
        return elementData = new Object[Math.max(DEFAULT_CAPACITY, minCapacity)];
    }
}
```

**示例**：
- 初始容量 10，添加第 11 个元素 → 扩容到 15
- 添加第 16 个元素 → 扩容到 22（15 * 1.5 取整）

---

### 三、常用方法一览

```java
ArrayList<String> list = new ArrayList<>();

// 增
list.add("坦克A");            // 尾部添加
list.add(0, "坦克B");         // 指定索引插入（会移动后续元素）

// 删
list.remove("坦克A");        // 按对象删除（需要 equals）
list.remove(0);              // 按索引删除，返回被删元素

// 改
list.set(0, "坦克C");

// 查
String s = list.get(0);      // 按索引获取

// 大小
int size = list.size();      // 实际元素个数，不是容量

// 检查
boolean empty = list.isEmpty();
boolean has = list.contains("坦克C");

// 转数组
Object[] arr1 = list.toArray();
String[] arr2 = list.toArray(new String[0]);

// 批量操作
List<String> sub = list.subList(0, 2); // 视图，修改会影响原 list
list.clear(); // 清空
```

---

### 四、ArrayList 与普通数组的对比

| 特性 | 数组 (int[]) | ArrayList |
|------|-------------|-----------|
| 大小固定 | 是 | 否（自动扩容） |
| 存取方式 | 只能通过索引，语法 arr[i] | 通过 get()/set() 方法 |
| 泛型支持 | 无（只能存特定类型或 Object） | 有，编译期类型检查 |
| 基本类型存储 | 可以直接存 | 需要包装类（自动装箱） |
| 性能 | 原生数组略快，无额外开销 | 方法调用有微小开销 |
| 功能丰富度 | 只有 length 属性 | 提供大量操作（增删改查、排序等） |

**建议**：当元素数量确定且需要极致性能时，用数组；通常业务开发直接用 `ArrayList`。

---

### 五、线程安全问题与解决方案

`ArrayList` **不是线程安全的**。多线程并发读写会抛 `ConcurrentModificationException` 或导致数据不一致。

#### 1. 使用 `Collections.synchronizedList()`

```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
```

返回一个加了 `synchronized` 包装的列表，所有方法都加锁，线程安全但性能一般。

#### 2. 使用 `CopyOnWriteArrayList`

```java
List<String> list = new CopyOnWriteArrayList<>();
```

**写时复制**：每次写操作（add/set）都会复制一份新的底层数组，读操作完全无锁。  
适用于**读多写少**的场景，如配置信息、黑名单。

#### 3. 手动同步

在外部手动加锁：
```java
synchronized (list) {
    list.add("data");
}
```

---

### 六、常见的坑与注意点

1. **`subList` 是视图**，不是独立列表。修改原列表会反映到 subList，反之亦然。若想独立拷贝，应用 `new ArrayList<>(list.subList(...))`。

2. **`Arrays.asList()` 返回的 List** 不是 `ArrayList`，而是 `Arrays` 的内部类，大小固定，不能增删，只能改元素。

3. **遍历时删除** 不要用 for-each 直接 remove，应该使用迭代器的 `remove()` 或 `removeIf()`。
   ```java
   // 正确删除偶数
   list.removeIf(n -> n % 2 == 0);
   ```

4. **初始容量优化**：如果能预估元素数量（如 1000 个），最好在构造时指定 `new ArrayList<>(1000)`，减少扩容带来的数组拷贝开销。

---

### 七、总结

- `ArrayList` = 动态数组，查询快，增删慢（尾部添加除外）。
- 扩容是按 **1.5 倍** 进行的。
- 业务中最常用的 List 实现，注意线程安全需外部处理。
- 与 `LinkedList` 对比时，随机访问多用 `ArrayList`，频繁头尾插入删除多用 `LinkedList`。

如果你需要，我可以把上述内容整理成一片新的 Obsidian 笔记（比如 `[[ArrayList详解]]`），并和现有笔记中的 `LinkedList` 做互相链接。



### 📦 构造方法

| 方法                                           | 说明                             |
| -------------------------------------------- | ------------------------------ |
| `new ArrayList<>()`                          | 创建空列表，初始容量为 **10**（首次添加时才分配数组） |
| `new ArrayList<>(int initialCapacity)`       | 指定初始容量，避免频繁扩容                  |
| `new ArrayList<>(Collection<? extends E> c)` | 用另一个集合的元素初始化                   |

```java
List<String> list1 = new ArrayList<>();
List<String> list2 = new ArrayList<>(50);
List<String> list3 = new ArrayList<>(Arrays.asList("A", "B"));
```

---

### ➕ 增

| 方法                                                     | 说明                               |
| ------------------------------------------------------ | -------------------------------- |
| `boolean add(E e)`                                     | 在末尾添加元素，永远返回 `true`              |
| `void add(int index, E e)`                             | 在指定索引插入，元素后移（索引范围 `[0, size()]`） |
| `boolean addAll(Collection<? extends E> c)`            | 将集合所有元素追加到末尾                     |
| `boolean addAll(int index, Collection<? extends E> c)` | 从索引位置开始插入集合全部元素                  |
| `void addFirst(E e)` (Java 21+)                        | 在头部插入（`ArrayList` 会移动所有元素，性能差）   |
| `void addLast(E e)` (Java 21+)                         | 在末尾添加，等价于 `add(e)`               |

```java
ArrayList<String> list = new ArrayList<>();
list.add("A");                     // [A]
list.add(0, "B");                  // [B, A]
list.addAll(List.of("C", "D"));    // [B, A, C, D]
list.addAll(1, List.of("X", "Y")); // [B, X, Y, A, C, D]
```

---

### ➖ 删

| 方法                                              | 说明                        |
| ----------------------------------------------- | ------------------------- |
| `E remove(int index)`                           | 删除指定索引的元素，返回被删除值          |
| `boolean remove(Object o)`                      | 删除第一个匹配的对象（用 `equals` 判断） |
| `boolean removeAll(Collection<?> c)`            | 删除本列表中所有与 `c` 重叠的元素       |
| `boolean retainAll(Collection<?> c)`            | 仅保留本列表中与 `c` 重叠的元素（取交集）   |
| `boolean removeIf(Predicate<? super E> filter)` | 根据条件删除元素                  |
| `void clear()`                                  | 清空列表，容量不变                 |
| `boolean removeFirst()` (Java 21+)              | 删除第一个元素并返回，空列表抛异常         |
| `boolean removeLast()` (Java 21+)               | 删除最后一个元素并返回               |

```java
list.remove(0);                   // 按索引删
list.remove("A");                 // 按对象删
list.removeAll(List.of("B","C")); // 删除多个
list.retainAll(List.of("A"));     // 只保留 "A"
list.removeIf(s -> s.startsWith("X")); // 条件删除
list.clear();
```

---

### ✏️ 改

| 方法                                           | 说明                  |
| -------------------------------------------- | ------------------- |
| `E set(int index, E e)`                      | 将索引位置元素替换为 `e`，返回旧值 |
| `void replaceAll(UnaryOperator<E> operator)` | 对所有元素应用同一函数进行替换     |
| `void sort(Comparator<? super E> c)`         | 按比较器排序（原地排序）        |

```java
list.set(0, "NewValue");
list.replaceAll(String::toUpperCase);
list.sort(Comparator.reverseOrder());
```

---

### 🔍 查

| 方法                           | 说明                   |
| ---------------------------- | -------------------- |
| `E get(int index)`           | 按索引获取元素              |
| `int size()`                 | 实际元素个数               |
| `boolean isEmpty()`          | 是否为空                 |
| `boolean contains(Object o)` | 是否包含某个对象（用 `equals`） |
| `int indexOf(Object o)`      | 对象首次出现的索引，不存在返回 -1   |
| `int lastIndexOf(Object o)`  | 对象最后一次出现的索引          |
| `E getFirst()` (Java 21+)    | 获取第一个元素              |
| `E getLast()` (Java 21+)     | 获取最后一个元素             |

```java
String s = list.get(0);          // 首个元素
if (list.contains("A")) { ... }
int pos = list.indexOf("A");
```

---

### 🔁 遍历相关

| 方法 | 说明 |
|------|------|
| `Iterator<E> iterator()` | 返回普通迭代器 |
| `ListIterator<E> listIterator()` | 返回列表迭代器（支持前后移动） |
| `ListIterator<E> listIterator(int index)` | 从指定索引开始的列表迭代器 |
| `void forEach(Consumer<? super E> action)` | 函数式遍历 |
| `Spliterator<E> spliterator()` | 返回可分割迭代器（支持并行流） |

```java
// 索引循环
for (int i = 0; i < list.size(); i++) { ... }

// 增强 for
for (String item : list) { ... }

// 迭代器
Iterator<String> it = list.iterator();
while (it.hasNext()) { it.next(); }

// 列表迭代器（可逆向）
ListIterator<String> lit = list.listIterator();
while (lit.hasNext()) { lit.next(); }
while (lit.hasPrevious()) { lit.previous(); }

// forEach 函数式
list.forEach(System.out::println);
```

### ArrayList 遍历中删除元素的正确姿势

#### 核心问题

遍历 ArrayList 时删除元素，**不能**用集合自己的 remove()，必须用 Iterator 的 remove()（或倒序遍历）。

#### 为什么？两个原因

**1. fail-fast 机制会抛异常**

ArrayList 内部有两个计数器：
- `modCount`：集合被结构性修改的次数（增删改 +1）
- `expectedModCount`：Iterator 创建时对 modCount 的快照

每次调用 Iterator 的方法时，都会检查两者是否相等：
- `list.remove()` → modCount 变了，expectedModCount 没变 → 不相等 → 抛 ConcurrentModificationException
- `it.remove()` → 同时更新 modCount 和 expectedModCount（自增并同步）→ 安全通过

设计目的：宁可立即报错（fail-fast），也不让并发修改导致的数据错乱悄悄发生。

**2. 索引会错位**

即使不抛异常，正序遍历中删除元素会导致后续元素集体左移，index 却继续右移，造成元素被跳过：
正序删 B: [A, B, C, D] → 删 B → [A, C, D]，index 到了 2 指向 D，C 被跳过了

#### 三种正确写法

```java
// 写法1：倒序 for-i（不需要 Iterator，最简单）
for (int i = list.size() - 1; i >= 0; i--) {
    if (需要删除) {
        list.remove(i);  // 只影响已遍历过的索引，不影响未遍历的
    }
}

// 写法2：Iterator（遍历中安全删除）
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (需要删除) {
        it.remove();  // 内部自动维护 cursor，不会漏元素
    }
}

// 写法3：removeIf（Java 8+，最简洁，只读条件删除）
list.removeIf(s -> 需要删除);
```

#### Iterator.remove() 的内部原理

删除元素后，Iterator 做了一个关键操作：把 cursor 回退到被删元素的索引位置（cursor = lastRet）。这样被删元素后面的元素集体左移后，cursor 正好指向原来下一个元素，不会漏也不会越界。

#### 常见错误

```java
for (String s : list) {      // for-each 底层就是 Iterator
    if (s.isEmpty()) {
        list.remove(s);      // ❌！用了集合的 remove，没用迭代器的
    }
}
// 结果：ConcurrentModificationException
```

#### 记忆口诀

"遍历中删除，Iterator 说了算。正序用 Iterator，倒序用 for-i。"

---

#### ⚙️ 容量与底层数组控制

| 方法                                     | 说明                        |
| -------------------------------------- | ------------------------- |
| `void ensureCapacity(int minCapacity)` | 确保内部数组至少能容纳指定数量的元素，避免多次扩容 |
| `void trimToSize()`                    | 将容量缩减为当前元素个数，释放多余内存       |

```java
list.ensureCapacity(10000);  // 提前扩容，适合大数据量一次性添加
list.trimToSize();           // 减少内存占用
```

---

#### 🔄 转换为数组

| 方法 | 说明 |
|------|------|
| `Object[] toArray()` | 返回 `Object[]` 类型数组 |
| `<T> T[] toArray(T[] a)` | 返回指定类型的数组，传入空数组通常写法 `new String[0]` |

```java
Object[] objArray = list.toArray();
String[] strArray = list.toArray(new String[0]);  // 推荐写法
```

---

#### 📋 截取与克隆

| 方法 | 说明 |
|------|------|
| `List<E> subList(int fromIndex, int toIndex)` | 返回 `[from, to)` 子列表的**视图**，修改会相互影响 |
| `Object clone()` | 返回 `ArrayList` 的浅拷贝（元素本身不复制） |
| `ArrayList<E>(Collection<? extends E> c)` | 通过构造器实现**深拷贝元素引用**（依然是浅拷贝） |

```java
List<String> sub = list.subList(1, 3);
ArrayList<String> clone = (ArrayList<String>) list.clone();
ArrayList<String> copy = new ArrayList<>(list);  // 更常用的拷贝方式
```

> ⚠️ `subList` 非独立，如需独立子列表，用 `new ArrayList<>(list.subList(a, b))`.

---

#### 🧵 线程安全方法（需要外部支持）

`ArrayList` 自身**非线程安全**。通过以下方式可获得同步版本：

- `Collections.synchronizedList(new ArrayList<>())`
- 使用 `CopyOnWriteArrayList`（写时复制）
- 手动用 `synchronized` 块保护

---

#### ⚠️ 特别注意

- **`Arrays.asList()` 返回的列表**不支持 `add/remove`，且与数组互相影响。
- **遍历时删除**必须使用迭代器的 `remove()` 或 `removeIf()`，否则会抛出 `ConcurrentModificationException`。
- **频繁在头部插入/删除**应使用 `LinkedList`，`ArrayList` 会进行大量元素搬移，性能极差。
- **排序**可使用 `Collections.sort(list)` 或 `list.sort(Comparator)`。

---

这就是 `ArrayList` 几乎全部常用方法的梳理。你可以将这份清单做成笔记 `[[ArrayList方法速查表]]`，需要我帮你直接生成完整的 Markdown 文件吗？


---

# 异常处理

[[Java 异常处理]]
![Pasted image 20260704010828](assets/Pasted%20image%2020260704010828.png)![Pasted image 20260704010909](assets/Pasted%20image%2020260704010909.png)
出现异常后，程序会立即终止。为了解决异常，Java提供了对异常进行处理的方式一一异常捕获。异常捕获使用try…catch...finally语句实现，try…catch...finally具体语法格式如下：
```java
try{
      //程序代码块
} catch(异常类  异常对象){
     //处理异常
} catch(异常类 异常对象){
     //处理异常
} finally {
            //最终处理
}
```


在try代码块中编写可能发生异常的Java语句

catch代码块中编写针对异常进行处理的代码。

当try代码块中的程序发生了异常，系统会将异常的信息封装成一个异常对象，并将这个对象传递给catch代码块进行处理。catch代码块需要一个参数指明它所能够接收的异常类型，这个参数的类型必须是Exception类或其子类。



>*finally中的代码块在一种情况下是不会执行的，那就是在try...catch中执行了System.exit(0)语句。System.exit(0)表示退出当前的Java虚拟机，Java虚拟机停止了，任何代码都不能再执行了。*


# 线程

[[Java 多线程]]
## 一、什么是线程？

- **程序**：静态的代码，躺在硬盘里，比如 `BattleServer.java`。
- **进程**：程序运行起来后，操作系统分配的一块独立内存空间。比如你启动了一个 Spring Boot 应用，就是一个进程。
- **线程**：**进程内部的一个执行路径**。一个进程里至少有一个线程（主线程），也可以有多个线程并发执行不同的任务。

举个战车系统的例子：

> 你的后端服务就是一个 **进程**。
> 当多个指挥官同时发送指令时，每个指令处理都可能交给一个独立的 **线程** 去执行，这样才不会因为处理“指挥官A”的指令而卡住“指挥官B”的响应。

---

## 二、为什么需要多线程？

1. **提高响应速度**（用户体验）  
比如 HTTP 请求：主线程接收请求，其余线程处理业务，主线程立刻又能接收下一个请求，不会阻塞。

2. **充分利用多核 CPU**  
现在的服务器基本都是多核，多线程可以把不同任务分配到不同核心上并行处理，榨干硬件性能。

3. **合理利用等待时间**  
比如线程 A 在等数据库返回结果时，CPU 完全可以切到线程 B 去执行计算任务，不让 CPU 闲着（这涉及线程状态切换，见下文）。

---

## 三、Java 中创建线程的方式

### 1. 基础方式：继承 `Thread` 类

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("战车自检线程启动：" + Thread.currentThread().getName());
    }
}

// 启动
MyThread t = new MyThread();
t.start();   // 注意：是 start()，不是 run()！
```

### 2. 常用方式：实现 `Runnable` 接口

```java
class DeviceCheckTask implements Runnable {
    @Override
    public void run() {
        System.out.println("检查设备状态：" + Thread.currentThread().getName());
    }
}

// 使用
Thread t = new Thread(new DeviceCheckTask());
t.start();
```

> **为什么用 Runnable 更好？**  
> Java 是单继承，继承了 Thread 就不能再继承其他类，而实现接口更灵活，且更容易与线程池配合。

### 3. 进阶方式：`Callable` + `Future`（有返回值，可抛异常）

```java
Callable<String> task = () -> {
    // 比如查询战车电量
    return "电量：85%";
};

FutureTask<String> futureTask = new FutureTask<>(task);
Thread t = new Thread(futureTask);
t.start();

// 获取结果（会阻塞直到任务完成）
String result = futureTask.get();
System.out.println(result);
```

### 4. 工业级方式：**线程池**（`ExecutorService`，日常开发必用）

直接 new Thread 非常消耗资源（创建/销毁开销大，线程数不可控）。**线上系统一律使用线程池。**

```java
ExecutorService pool = Executors.newFixedThreadPool(4);  // 固定 4 个线程

pool.execute(() -> System.out.println("执行指令1"));
pool.execute(() -> System.out.println("执行指令2"));

pool.shutdown(); // 优雅关闭
```

常用线程池（`Executors` 工具类）：
- `newFixedThreadPool(n)`：固定数量线程
- `newCachedThreadPool()`：可缓存、自动扩容缩容
- `newSingleThreadExecutor()`：单线程（保证任务顺序执行）
- `newScheduledThreadPool(n)`：支持定时/周期任务

> **阿里巴巴规范强制要求**：生产环境禁止使用 `Executors` 直接创建线程池，要用 `ThreadPoolExecutor` 显式指定参数，防止 OOM（内存溢出）。不过初期学习先用它理解概念。

---

## 四 五种状态简述

1. **新建状态 (New)**：线程对象刚刚被程序创建出来（比如执行了 `new Thread()`），但还没有启动。此时它只是内存中的一个普通 Java 对象，并未与操作系统的底层线程绑定。
    
2. **就绪状态 (Runnable)**：程序调用了该线程对象的 `start()` 方法。此时线程已经排进系统的可运行队列中，具备了随时运行的条件，万事俱备，只欠东风（等操作系统分配 CPU 时间片）。
    
3. **运行状态 (Running)**：处于“就绪状态”的线程幸运地获得了 CPU 资源，正在真正执行 `run()` 方法里你写的业务代码。
    
4. **阻塞状态 (Blocked)**：线程正在运行中，但因为某些原因（比如等待用户输入、试图获取别人占用的锁、主动睡眠等）必须放弃 CPU 使用权，暂时停止运行。
    
5. **死亡/终止状态 (Dead/Terminated)**：线程的 `run()` 方法正常执行完毕，或者因为抛出了未捕获的异常而崩溃退出。线程一旦死亡，生命周期彻底结束，绝不能通过再次调用 `start()` 复生。
    

### 二、 状态之间的转化规则

状态的转化有着严格的规则，其中最核心的考点是：**阻塞状态结束后，线程必须先回到“就绪状态”重新排队，绝对不能直接跳跃到“运行状态”。**

| **当前状态** | **目标状态** | **触发转化的条件**                                                     |
| -------- | -------- | --------------------------------------------------------------- |
| **新建**   | **就绪**   | 程序员在代码中调用了线程对象的 `start()` 方法。                                   |
| **就绪**   | **运行**   | 操作系统的线程调度器选中了该线程，为其分配了 CPU 时间片。                                 |
| **运行**   | **就绪**   | 该线程的 CPU 时间片被耗尽，或者程序中主动调用了 `Thread.yield()` 让出执行权。              |
| **运行**   | **阻塞**   | 线程调用了 `sleep()`、`wait()`、发起网络/文件 I/O 请求，或者试图获取一个已经被其他线程拿走的同步锁。  |
| **阻塞**   | **就绪**   | `sleep()` 睡眠时间到期、被其他线程 `notify()` 唤醒、获取到了之前没抢到的同步锁，或者 I/O 操作完成。 |
| **运行**   | **死亡**   | `run()` 方法的所有代码平稳执行结束，或运行中发生严重错误抛出了未捕获的异常。                      |

## 五、线程安全问题 & 同步机制

多个线程同时读写同一个共享变量时，会出现数据错乱，这就是“线程不安全”。

### 1. `synchronized` 关键字

保证同一时刻只有一个线程能执行被保护的代码块/方法。

```java
private int battleScore = 0;

// 同步方法
public synchronized void addScore(int points) {
    battleScore += points;
}

// 同步代码块（更灵活）
public void addScore2(int points) {
    synchronized (this) {
        battleScore += points;
    }
}
```

### 2. `Lock` 显式锁（`java.util.concurrent.locks`）

比 `synchronized` 更灵活：可尝试获取锁、可中断、可设置超时。

```java
private final Lock lock = new ReentrantLock();

public void criticalTask() {
    lock.lock();
    try {
        // 同步代码
    } finally {
        lock.unlock(); // 必须放在 finally 里！
    }
}
```

### 3. `volatile` 关键字

保证变量的 **可见性**：一个线程修改后，其他线程能立刻看到新值。但它**不保证原子性**，不能替代锁。

```java
private volatile boolean running = true;

// 线程 A
while (running) { ... }

// 线程 B
running = false; // 立即停止线程 A 的循环
```

---

## 六、线程间通信

- **`wait()` / `notify()` / `notifyAll()`**：必须在 `synchronized` 中调用，用于让线程等待某个条件。
- **`CountDownLatch`**：倒计时器，一个线程等待其他线程完成。
- **`CyclicBarrier`**：栅栏，多个线程互相等待，都到了才往下走。
- **`BlockingQueue`**：阻塞队列，非常适合生产者-消费者模式。

---

## 七、进阶：`ThreadLocal`

为每个线程提供独立的变量副本，线程之间互不干扰。常用于保存用户会话信息（如 Spring 中的 RequestContext）。

```java
private ThreadLocal<String> currentCommander = new ThreadLocal<>();

currentCommander.set("指挥官A");
String name = currentCommander.get(); // 在当前线程中获取到的是 "指挥官A"
currentCommander.remove(); // 防止内存泄漏，用完必须清理
```

---

## 八、常见在线程上的“坑”

1. **死锁**：两个线程互相持有对方需要的锁，导致永远等待。预防办法：约定加锁顺序。
2. **活锁**：线程不断尝试失败，一直没进展。预防：随机重试时间。
3. **饥饿**：低优先级线程永远得不到执行。预防：使用公平锁。
4. **OOM（内存溢出）**：无限创建线程或线程池队列无限堆积任务。生产环境务必用 `ThreadPoolExecutor` 限流。

---

## 总结回顾

- 线程是程序并发执行的基本单位。
- 建议使用 **线程池** 管理线程。
- 多线程环境下，共享资源要用 **锁** 或 **volatile** 保护。
- 状态、通信、防坑是高级内容，后续深入接触 Spring Boot 异步任务、消息队列等，你会反复用到。

# GUI

>Swing是Java语言开发图形化界面的一个工具包。它以抽象窗口工具包（AWT）为基础，使跨平台应用程序可以使用可插拔的外观风格。Swing拥有丰富的库和组件，使用非常灵活，开发人员只用很少的代码就可以创建出优雅的用户界面。

为了有效的使用Swing组件，必须了解Swing包的层次结构和继承关系

![Pasted image 20260704141327](assets/Pasted%20image%2020260704141327.png)

- Swing组件的所有类都继承自Container类

根据 GUI开发的功能扩展了两个主要分支，分别是**容器分支**(包括Window窗口和Panel面板)和**组件分支**
- 容器分支：实现图形化用户界面窗口的容器
- 组件分支：实现向容器中填充数据、元素以及交互组件等功能

## JFrame
在Swing组件中，最常见的一个容器就是JFrame，它是一个独立存在的顶级容器(也叫窗口)，不能放置在其他容器之中。JFrame支持通用窗口所有的基本功能，例如，窗口最小化、设定窗口大小等。


| 方法                                                   | 类型   | 功能描述                   |
| ---------------------------------------------------- | ---- | ---------------------- |
| public JFrame() throws HeadlessException             | 构造方法 | 创建一个普通窗体对象             |
| public JFrame(String title) throws HeadlessException | 构造方法 | 创建一个窗体对象，并指定标题         |
| public void *setSize*(int width,int height)          | 普通方法 | 设置窗体大小                 |
| public void setSize(Dimention d)                     | 普通方法 | 通过Dimention设置窗体大小      |
| public void *Background*(Color c)                    | 普通方法 | 设置窗体的背景颜色              |
| public void *setLocation*(int x,int y)               | 普通方法 | 设置组件的显示位置              |
| public void *setLocation*(Point p)                   | 普通方法 | 通过Point设置组件的显示位置       |
| public void setVisiable(boolean b)                   | 普通方法 | 显示或隐藏组件                |
| public Component add(Component comp)                 | 普通方法 | 向容器中增加组件               |
| public *setLayout*(Component comp)                   | 普通方法 | 设置布局管理器，如果设置为null表示不使用 |
| public void pack()                                   | 普通方法 | 调整窗口大小，以适合其子组件的首选大小和布局 |
| public Comntainer getContentPane()                   | 普通方法 | 返回此窗体的容器对象             |
## 布局管理器
>组件在容器中的位置和尺寸是由布局管理器决定的
Swing常用的布局管理器有4种，分别是:

- > [!note]- FlowLayout（流式布局管理器）
  > 在这种布局下，容器会将组件按照添加顺序从左向右放置。当到达容器的边界时，自动将组件放到下一行的开始位置。这些组件可以左对齐、居中对齐（默认方式）或右对齐的方式排列。

- > [!note]- BorderLayout（边界布局管理器）
  > BorderLayout（边界布局管理器）是一种较为复杂的布局方式，它将窗体划分为五个区域，分别是东(EAST)、南(SOUTH)、西(WEST)、北(NORTH)、中(CENTER)。组件可以被放置在这五个区域中的任意一个区域中。BorderLayout的布局效果如右图。
  > ![Pasted image 20260704142737](assets/Pasted%20image%2020260704142737.png)

- > [!note]- GridLayout（网格布局管理器）
  > GridLayout布局管理器是以网格的形式管理容器中组件布局的。GridLayout使用纵横线将容器分成n行m列大小相等的网格，每个网格中放置一个组件。添加到容器中的组件首先放置在第1行第1列（左上角）的网格中，然后在第1行的网格中从左向右依次放置其他组件。一行放满之后，继续在下一行中从左到右放置组件。
  > GridLayout的有三个构造方法，其中，参数rows代表行数，cols代表列数，hgap和vgap规定水平和垂直方向的间隙。水平间隙指的是网格之间的水平距离，垂直间隙是指网格之间的垂直距离。

- > [!note]- GridBagLayout（网格包布局管理器）
  > GridBagLayout是最灵活、最复杂的布局管理器。GridBagLayout与GridLayout布局管理器类似，不同的是，GridBagLayout允许网格中的组件大小各不相同，而且允许一个组件跨越一个或者多个网格。

Swing容器在创建时都会使用一种默认的布局管理器，在程序中可以通过调用容器对象的setLayout()方法设置布局管理器，通过布局管理器自动进行组件的布局管理。

### GridBagLayout 布局管理器使用步骤

1. **创建 GridBagLayout 布局管理器，并设置容器采用该布局管理器**

   ```java
   GridBagLayout layout = new GridBagLayout();
   container.setLayout(layout);
   ```

2. **创建 GridBagConstraints 对象，并设置相关属性（布局约束条件）**

   ```java
   GridBagConstraints constraints = new GridBagConstraints();
   constraints.gridx = 1;       // 设置网格的左上角横向索引
   constraints.gridy = 1;       // 设置网格的左上角纵向索引
   constraints.gridwidth = 1;   // 设置组件横向跨越的网格
   constraints.gridheight = 1;  // 设置组件纵向跨越的网格
   ```

3. **调用 GridBagLayout 对象的 setConstraints() 方法，建立约束与组件的关联**

   ```java
   layout.setConstraints(component, constraints);
   ```

4. **向容器中添加组件**

   ```java
   container.add(component);
   ```

> GridBagConstraints 对象可以重复使用。如果改变布局，只需修改其属性即可。若要向容器中添加多个组件，重复步骤 2、3、4。


## 事件处理机制


Swing组件中的事件处理专门用于响应用户的操作，例如，响应用户的鼠标单击、按下键盘等操作。在Swing事件处理的过程中，主要涉及到三类对象：

- 事件源（Event Source）：事件发生的场所，通常是产生事件的组件，如窗口、按钮、菜单等。
- 事件对象（Event）：封装了GUI组件上发生的特定事件（通常就是用户的一次操作）。
- 监听器（Listener）：负责监听事件源上发生的事件，并对各种事件做出相应处理（监听器对象中包含事件处理器）。

![Pasted image 20260704154455](assets/Pasted%20image%2020260704154455.png)
```java
 import java.awt.event.*;
 import javax.swing.*;
 // 自定义事件监听器类
 class MyListener implements ActionListener{
	// 实现监听器方法，对监听事件进行处理
	public void actionPerformed(ActionEvent e) {
		System.out.println("用户点击了JButton按钮组件");
	}
 }
```

 ```java
 public class Example07 {
	private static void createAndShowGUI() {
		JFrame f = new JFrame("JFrame窗口");
		f.setSize(200, 100); 
		// 创建一个按钮组件，作为事件源
		JButton btn = new JButton("按钮");  
		// 为按钮组件事件源添加自定义监听器
		btn.addActionListener(new MyListener());
		f.add(btn);
		f.setVisible(true);
		f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
	public static void main(String[] args) {
		// 调用createAndShowGUI()方法
		createAndShowGUI();
	}
 }
 ```


### 实现Swing事件处理的主要步骤如下：
#### 1. 创建事件源：
除了一些常见的按钮、键盘等组件可以作为事件源外，还可以使用JFrame窗口在内的顶级容器作为事件源。

#### 2. 自定义事件监听器：
根据要监听的事件源创建指定类型的监听器进行事件处理。监听器是一个特殊的Java类，必须实现XxxListener接口。根据组件触发的动作进行区分，例如，WindowListener用于监听窗口事件，ActionListener用于监听动作事件。

#### 3. 为事件源注册监听器：
使用addXxxListener()方法为指定事件源添加特定类型的监听器。当事件源上发生监听事件后，就会触发绑定的事件监听器，由监听器中的方法对事件进行相应处理。

### 窗体事件

大部分GUI应用程序都需要使用Window窗体对象作为最外层的容器，可以说窗体对象是所有GUI应用程序的基础，应用程序中通常都是将其他组件直接或者间接地添加到窗体中。

例如，窗体的打开、关闭、激活、停用等，这些动作都属于窗体事件


Java提供了一个WindowEvent类用于表示窗体事件。在应用程序中，当对窗体事件进行处理时，首先需要定义一个实现了WindowListener接口的类作为窗体监听器，然后通过`addWindowListener()`方法将窗体对象与窗体监听器进行绑定。

```java
 import java.awt.event.*;
 import javax.swing.*;
 public class Example08 {
	private static void createAndShowGUI() {
		JFrame f = new JFrame("WindowEvent");
		f.setSize(400, 300);
		f.setLocation(300, 200);
		f.setVisible(true);
        		 f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		// 使用内部类创建WindowListener实例对象，监听窗体事件
		f.addWindowListener(new WindowListener() {
			public void windowOpened(WindowEvent e) {
				System.out.println("windowOpened---窗体打开事件");
			}
			public void windowIconified(WindowEvent e) {
				System.out.println("windowIconified---窗体图标化事件");
			}
			public void windowDeiconified(WindowEvent e) {
			  System.out.println("windowDeiconified---窗体取消图标化事件");
			}
			public void windowDeactivated(WindowEvent e) {
				System.out.println("windowDeactivated---窗体停用事件");
			}
			public void windowClosing(WindowEvent e) {
				System.out.println("windowClosing---窗体正在关闭事件");
			}
			public void windowClosed(WindowEvent e) {
				System.out.println("windowClosed---窗体关闭事件");
			}
			
				public void windowActivated(WindowEvent e) {
				System.out.println("windowActivated---窗体激活事件");
			}
		});
	}
	public static void main(String[] args) {		
		createAndShowGUI();
	}
 }

```


### 鼠标事件

>在图形用户界面中，用户会经常使用鼠标进行选择、切换界面等操作
>这些操作被定义为鼠标事件，包括鼠标按下、鼠标松开、鼠标单击等。
>Java提供了一个MouseEvent类描述鼠标事件。处理鼠标事件时，首先需要通过实现MouseListener接口定义监听器（也可以通过继承适配器MouseAdapter类定义监听器），然后调用addMouseListener()方法将监听器绑定到事件源对象。


### 键盘事件

### 动作事件


# API

[[Java API]]

# IO流

[[Java IO流]]

# 泛型

[[Java泛型]]
