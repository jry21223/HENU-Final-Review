# 第8章 多线程 笔记

> 来源：第8章 多线程.pptx (89页)  
> 涵盖：进程与线程、线程创建、生命周期、调度、同步、死锁

---

## 目录

- [8.1 线程简介](#81-线程简介)
- [8.2 线程的创建](#82-线程的创建)
- [8.3 线程的生命周期](#83-线程的生命周期)
- [8.4 线程的调度](#84-线程的调度)
- [8.5 多线程同步](#85-多线程同步)

---

## 8.1 线程简介

### 8.1.1 进程 (Process)

> **进程 = 正在运行的程序。** 每个独立执行的程序都是一个进程。

现代操作系统都是**多任务**的，表面上看多个进程在同时运行，实际上：

```
    时间片轮转：
    CPU 时间切分成无数微小片段
    → 这段时间跑进程A
    → 下一段时间跑进程B
    → 再下一段跑进程C
    → 循环...

    因为切换极快（毫秒级），人感觉是"同时"在跑
```

>[!note]- 并发 ≠ 并行
>- **并发 (Concurrency)**：多个任务交替执行，同一时刻只有一个在执行（单核CPU的"假同时"）
>- **并行 (Parallelism)**：多个任务真正同时执行（多核CPU的"真同时"）
>
>单核CPU只能并发，多核CPU可以并行。

### 8.1.2 线程 (Thread)

> **线程 = 进程内部的执行单元。** 一个进程至少有一个线程。

```java
// 你写的每个 Java 程序都自带一个线程 —— 主线程
public static void main(String[] args) {
    // 这段代码运行在 "main" 线程上
}
```

**单线程 vs 多线程：**

```
单线程（你没用过的普通程序）：          多线程：
                                      
  代码行1                               线程1: 代码段A    线程2: 代码段B
    ↓                                     ↓                ↓
  代码行2                               执行中...        执行中...
    ↓                                     ↓                ↓
  代码行3                                ...              ...
    ↓                                    ↓                ↓
  ...                                 交替/同时执行
```

### 8.1.3 进程 vs 线程

| | 进程 | 线程 |
|---|------|------|
| 定义 | 正在运行的程序 | 进程内的执行单元 |
| 资源 | 独立的内存空间 | 共享进程的内存 |
| 崩溃影响 | 一个崩溃不影响其他进程 | **一个崩溃 → 整个进程崩溃** |
| 创建开销 | **大**（尤其在 Windows） | **小** |
| 通信 | 进程间通信慢（管道/网络） | 线程间通信快（读写同一变量） |

>[!warning]- 多线程的稳定性比多进程差
>多线程中，任何一个线程崩了，整个进程都崩。  
>多进程中，一个进程崩了，其他进程不受影响（比如 Chrome 每个标签是一个进程）。
>
>但多线程胜在**轻量、通信快**，所以 Java 服务器基本都是多线程模型。

---

## 8.2 线程的创建

Java 提供两种方式，JDK 8 还加了 Lambda 简化写法。

### 8.2.1 方式一：继承 Thread 类

```java
// ① 定义类继承 Thread
class MyThread extends Thread {
    public void run() {                    // ② 重写 run()，写线程要执行的代码
        while (true) {
            System.out.println("MyThread 在运行");
        }
    }
}

// ③ 使用
MyThread t = new MyThread();
t.start();   // ⚠️ 是 start()，不是 run()！
```

>[!danger]- 大坑：调用 run() ≠ 启动线程
>```java
>MyThread t = new MyThread();
>t.run();    // ❌ 这只是普通方法调用，在 main 线程中执行，不会创建新线程！
>t.start();  // ✅ 这才是启动新线程，JVM 会自动调用 run()
>```
>调用 `run()` 的结果：程序卡在 `run()` 的死循环里，main 后面的代码永远不执行。

**[例] 单线程（错误示范）→ 多线程（正确示范）：**

```java
// ❌ 单线程 — main 的循环永远得不到执行
MyThread t = new MyThread();
t.run();                           // 卡在 run() 的死循环里！
while (true) {
    System.out.println("main 在运行");  // 永远不会打印！
}

// ✅ 多线程 — 两个循环交替执行
MyThread t = new MyThread();
t.start();                         // 启动新线程
while (true) {
    System.out.println("main 在运行");  // 交替打印！
}
```

### 8.2.2 方式二：实现 Runnable 接口

**为什么需要第二种方式？**

> Java **只支持单继承**。如果类已经继承了其他父类（如 `Student extends Person`），就不能再继承 `Thread`。

```java
// ① 定义类实现 Runnable
class MyThread implements Runnable {
    public void run() {
        while (true) {
            System.out.println("MyThread 在运行");
        }
    }
}

// ② 使用：任务对象 → 包装成 Thread → start
MyThread task = new MyThread();        // 这只是"任务"
Thread t = new Thread(task);           // 把任务交给线程
t.start();                             // 启动线程
```

### 8.2.3 售票案例 —— 两种方式的致命区别

> PPT 的核心案例，**前面已经详细讲过**，这里只做结论速查。

**场景：** 4 个窗口卖 100 张票。

| | extends Thread | implements Runnable |
|---|----------------|---------------------|
| 创建方式 | `new TicketWindow().start()` × 4 | `new TicketWindow()` × 1，`new Thread(tw)` × 4 |
| 对象数量 | **4 个** TicketWindow | **1 个** TicketWindow |
| tickets 变量 | **4 个独立副本**（各 100） | **1 个共享**（共 100） |
| 总卖出 | ~400 张（错误！） | ~100 张（正确） |

>[!note]- 为什么会有这个差别？—— 复习
>**例一** `new TicketWindow()` × 4 → 堆中有 4 个对象 → 4 个独立的 `tickets` 变量 → 各卖各的。
>
>**例二** `new TicketWindow()` × 1 → 堆中只有 1 个对象 → 4 条线程共享同一个 `tickets` → 真正共享。
>
>Thread 的 `start()` 只能调一次，`extends Thread` 想开 4 个窗口就**被迫** new 4 个对象，所以天然不适合共享数据。

**Runnable 的优势：**

1. ✅ 适合**多个线程处理同一资源**（线程和数据解耦）
2. ✅ 避免**单继承限制**
3. ✅ 更好的面向对象设计

### 8.2.4 JDK 8 Lambda 简化写法

```java
// 传统写法
Thread t = new Thread(new Runnable() {
    public void run() {
        System.out.println("新线程运行");
    }
});

// Lambda 简化
Thread t = new Thread(() -> {
    System.out.println("新线程运行");
});
t.start();
```

---

## 8.3 线程的生命周期

线程从创建到死亡，经历 **5 种状态**：

```
                    获取CPU
    就绪 ──────────────→ 运行
     ↑                    │
     │    ┌───────────────┤
     │    │ 失去CPU/      │ sleep()/wait()
     │    │ yield()       │ 阻塞IO/等锁
     │    ↓               ↓
     │  就绪 ←───────── 阻塞
     │                    │
   start()               │ run()结束/异常
     ↑                    ↓
   新建 ───────────────→ 死亡
```

### 五种状态详解

| 状态 | 进入条件 | 特点 |
|------|---------|------|
| **新建 (New)** | `new Thread()` | 仅分配内存，还不是真正的线程 |
| **就绪 (Runnable)** | 调用 `start()` | 具备运行条件，等待 CPU 调度 |
| **运行 (Running)** | 获得 CPU 时间片 | 正在执行 `run()` 方法 |
| **阻塞 (Blocked)** | `sleep()`/`wait()`/等锁/阻塞 IO | 暂停执行，让出 CPU |
| **死亡 (Terminated)** | `run()` 结束 / 异常 / `stop()` | 线程生命周期结束，不可复活 |

### 进入阻塞状态的 5 种原因

| 原因 | 如何解除阻塞 |
|------|------------|
| 等待同步锁（`synchronized`） | 获取到锁 |
| 调用阻塞式 IO 方法 | IO 操作完成 |
| 调用 `wait()` | 被 `notify()` / `notifyAll()` 唤醒 |
| 调用 `sleep(ms)` | 休眠时间到 |
| 调用 `join()` | 被 join 的线程执行完毕 |

>[!warning]- 阻塞 → 就绪，不是直接进入运行
>线程从阻塞状态恢复后，回到**就绪队列**重新排队，不会立即执行。

---

## 8.4 线程的调度

### 8.4.1 两种调度模型

| 模型 | 规则 |
|------|------|
| **分时调度** | 所有线程轮流获得 CPU，平均分配时间片 |
| **抢占式调度**（Java 默认） | 优先级高的优先获得 CPU，同优先级随机选 |

### 8.4.2 线程优先级

> 优先级用 1~10 整数表示，数字越大优先级越高。

| 常量 | 值 | 含义 |
|------|-----|------|
| `Thread.MIN_PRIORITY` | 1 | 最低 |
| `Thread.NORM_PRIORITY` | 5 | 默认（普通） |
| `Thread.MAX_PRIORITY` | 10 | 最高 |

```java
Thread t = new Thread(task);
t.setPriority(Thread.MAX_PRIORITY);  // 设为最高优先级
t.start();
```

>[!warning]- 优先级不保证执行顺序
>优先级只是**提高**获得 CPU 的概率，不是绝对的。  
>不同的操作系统对优先级的支持不一样，**不要依赖优先级来实现业务逻辑**。

### 8.4.3 线程休眠 —— `sleep()`

```java
Thread.sleep(2000);   // 当前线程休眠 2000 毫秒 = 2 秒
```

- `sleep()` 是**静态方法**，只能让**当前正在执行的线程**休眠
- 休眠结束后回到**就绪状态**，不是立即执行
- 必须处理 `InterruptedException`

```java
// 典型用法：交替执行
for (int i = 0; i < 10; i++) {
    System.out.println("线程A: " + i);
    Thread.sleep(500);   // 休眠 500ms，让另一线程有机会执行
}
```

### 8.4.4 线程让步 —— `yield()`

```java
Thread.yield();   // 当前线程让出 CPU，回到就绪状态重新排队
```

| | `sleep()` | `yield()` |
|---|----------|----------|
| 状态 | 进入**阻塞** | 进入**就绪** |
| 时机 | 必须等时间到 | 可能立刻又被选中 |
| 锁 | 不释放锁 | 不释放锁 |
| 异常 | 抛 `InterruptedException` | 不抛 |

>[!note]- yield() 实际效果
>`yield()` 只是"建议"调度器让出 CPU。调度器可能忽略这个建议。  
>而且让出后，如果同优先级没有其他线程，当前线程可能立刻又被选中。

### 8.4.5 线程插队 —— `join()`

```java
Thread t1 = new Thread(task);
t1.start();
t1.join();   // main 线程在此阻塞，直到 t1 执行完毕才继续
```

> **效果**：调用 `join()` 的线程（如 main）暂停，等待被 join 的线程执行完毕。

---

## 8.5 多线程同步

### 8.5.1 线程安全问题

**问题再现 —— 售票卖到负数：**

```java
class SaleThread implements Runnable {
    private int tickets = 10;

    public void run() {
        while (tickets > 0) {
            try { Thread.sleep(10); } catch (Exception e) { }
            System.out.println(Thread.currentThread().getName()
                + "---卖出的票" + tickets--);
        }
    }
}
// 运行结果可能出现：0、-1、-2……
```

>[!note]- 为什么会卖出负数？
>当 `tickets = 1` 时，4 个线程几乎同时执行：
>1. 线程① 判断 `tickets > 0` → **通过**（此时 tickets 还是 1）
>2. 线程② 判断 `tickets > 0` → **通过**（此时 tickets 还是 1）
>3. 线程③ 判断 `tickets > 0` → **通过**（此时 tickets 还是 1）
>4. 线程④ 判断 `tickets > 0` → **通过**（此时 tickets 还是 1）
>5. 然后 `tickets--` 执行 4 次 → 0, -1, -2, -3
>
>**根本原因：** `tickets > 0` 判断和 `tickets--` 之间被其他线程**插入了**。

### 8.5.2 同步代码块 (synchronized block)

```java
synchronized(lock) {     // lock = 锁对象，任意对象，但必须唯一
    // 操作共享资源的代码
}
```

**售票修复版：**

```java
class Ticket1 implements Runnable {
    private int tickets = 10;
    Object lock = new Object();         // 锁对象（必须在 run() 外面！）

    public void run() {
        while (true) {
            synchronized (lock) {       // 加锁
                if (tickets > 0) {
                    try { Thread.sleep(10); } catch (Exception e) { }
                    System.out.println(Thread.currentThread().getName()
                        + "---卖出的票" + tickets--);
                } else {
                    break;
                }
            }                           // 释放锁
        }
    }
}
```

**synchronized 工作流程：**

```
线程A: ┌── 抢到锁 ──→ 执行同步块 ──→ 释放锁 ──┐
       │                                      │
线程B: │  等待...等待...等待... ──→ 抢到锁 ──→ 执行
       │                                      │
线程C: │  等待...等待...等待...等待... ──→ 抢到锁

       同一时刻，只有拿到锁的线程能进入同步块
```

>[!danger]- 锁对象的两个铁律
>**① 必须唯一：** 多个线程必须用**同一个**锁对象。
>```java
>// ❌ 错误：每个线程 new 自己的锁
>public void run() {
>    Object lock = new Object();  // 每个线程一把新锁 = 没锁！
>    synchronized(lock) { ... }
>}
>```
>
>**② 任意类型：** 锁对象可以是任意引用类型（Object、String、自定义类都可以），关键是大家用同一把。
>```java
>Object lock = new Object();     // ✅
>String lock = "lock";           // ✅（但不推荐，字符串常量池可能共享）
>```

### 8.5.3 同步方法 (synchronized method)

```java
// 同步方法：整个方法加锁
private synchronized void saleTicket() {
    if (tickets > 0) {
        try { Thread.sleep(10); } catch (Exception e) { }
        System.out.println(Thread.currentThread().getName()
            + "---卖出的票" + tickets--);
    }
}
```

**同步方法 vs 同步代码块：**

| | 同步代码块 | 同步方法 |
|---|-----------|---------|
| 锁范围 | 只有 `{}` 内的代码 | **整个方法** |
| 锁对象 | 自己指定 | **`this`**（当前对象） |
| 灵活性 | ✅ 可以精确控制锁的范围 | ❌ 锁住整个方法 |
| 性能 | ✅ 更优（只锁必要代码） | ❌ 效率较低 |

>[!note]- 同步方法的锁是谁？
>- **普通同步方法**：锁是 `this`（当前调用对象）
>- **静态同步方法**：锁是 `类名.class`（该类的 Class 对象）
>
>```java
>class Example {
>    public synchronized void method1() { }  // 锁 = this
>    public static synchronized void method2() { }  // 锁 = Example.class
>}
>```

### 8.5.4 死锁 (Deadlock)

**经典场景 —— 中国人和美国人吃饭：**

```
中国人拿了筷子（chopsticks），等刀叉（knifeAndFork）
美国人拿了刀叉（knifeAndFork），等筷子（chopsticks）
→ 都不放手 → 永远僵持 → 死锁！
```

**代码模拟：**

```java
// 两把锁
static Object chopsticks = new Object();
static Object knifeAndFork = new Object();

// 线程 Chinese：先拿筷子，再拿刀叉
synchronized (chopsticks) {
    synchronized (knifeAndFork) {
        // 吃饭...
    }
}

// 线程 American：先拿刀叉，再拿筷子
synchronized (knifeAndFork) {
    synchronized (chopsticks) {
        // 吃饭...
    }
}
// → Chinese 拿着 chopsticks 等 knifeAndFork
// → American 拿着 knifeAndFork 等 chopsticks
// → 死锁！
```

>[!note]- 死锁的四个必要条件（缺一不可）
>1. **互斥**：资源不能共享，一次只能一个线程用
>2. **持有并等待**：拿着已有的锁，等新的锁
>3. **不可剥夺**：不能强行抢走别人的锁
>4. **循环等待**：线程A等线程B的锁，线程B等线程A的锁
>
>**预防方法**：破坏其中任意一个条件。最常见的是**统一加锁顺序**（都先拿筷子再拿刀叉）。

>[!warning]- 同步的代价
>加上 `synchronized` 后，线程执行同步代码时每次都要**判断锁的状态**，非常消耗资源，效率会降低。  
>**只锁必要的代码**，不要滥用同步。

---

## 总结：多线程知识全景

```
                         第8章 多线程
                              │
        ┌─────────┬───────────┼───────────┬──────────┐
        │         │           │           │          │
     基本概念   线程创建    生命周期     调度       同步
        │         │           │           │          │
    进程/线程   ┌──┴──┐    5种状态    ┌──┼──┐    ┌──┼──┐
              extends Runnable  New   优先 sleep 安全 同步 死锁
              Thread  接口    就绪   级   yield     代码块
              (单继承) (推荐)  运行   join         同步方法
                             阻塞
                             死亡
```

## 核心铁律速查

| # | 铁律 |
|---|------|
| 1 | 启动线程用 `start()`，**不是** `run()` |
| 2 | **一个 Thread 对象只能 `start()` 一次**，再次调用抛异常 |
| 3 | `extends Thread` 想开 N 个线程 = 被迫 new N 个对象 → 不能共享数据 |
| 4 | `implements Runnable` 可以 1 个任务 + N 个线程 → 推荐 |
| 5 | `sleep()` 不释放锁，`wait()` 释放锁 |
| 6 | 锁对象**必须唯一**（多个线程用同一把锁），不能放在 `run()` 里面 new |
| 7 | 普通同步方法锁 = `this`，静态同步方法锁 = `类名.class` |
| 8 | 死锁 = 互相持有对方需要的锁，**统一加锁顺序**可预防 |

---

## 线程方法速查表

| 方法 | 作用 | 释放锁？ | 进入状态 |
|------|------|---------|---------|
| `start()` | 启动线程 | — | 就绪 |
| `sleep(ms)` | 休眠指定毫秒 | ❌ 不释放 | 阻塞 |
| `yield()` | 让出 CPU | ❌ 不释放 | 就绪 |
| `join()` | 等待线程结束 | ❌ 不释放 | 阻塞 |
| `wait()` | 等待唤醒 | ✅ **释放锁** | 阻塞 |
| `notify()` / `notifyAll()` | 唤醒等待线程 | — | 就绪 |
| `setPriority(n)` | 设置优先级 1~10 | — | — |
| `currentThread()` | 获取当前线程对象 | — | — |
| `getName()` / `setName()` | 获取/设置线程名 | — | — |

