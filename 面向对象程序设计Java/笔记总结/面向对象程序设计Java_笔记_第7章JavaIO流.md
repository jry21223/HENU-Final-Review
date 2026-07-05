# 第7章 Java IO流 笔记

> 来源：第7章 Java IO流.pptx (76页)  
> 涵盖：File类、字节流、字符流、转换流、缓冲流、文件拷贝

---

## 目录

- [7.1 File 类 —— 操作文件本身](#71-file-类--操作文件本身)
- [7.2 字节流 —— 万能管道](#72-字节流--万能管道)
- [7.3 字符流 —— 专为文本而生](#73-字符流--专为文本而生)
- [7.4 转换流 —— 字节与字符的桥梁](#74-转换流--字节与字符的桥梁)

---

## 7.1 File 类 —— 操作文件本身

> `java.io.File` 是 Java 中**唯一代表磁盘文件/目录本身**的类。  
> 它操作的是文件的"外壳"（名称、路径、是否存在），**不是文件内容**。

### 7.1.1 三种构造方法

```java
new File("d:/hello/demo.txt")                    // ① 完整路径
new File("d:/hello", "demo.txt")                  // ② 父目录 + 文件名
new File(new File("d:/hello"), "demo.txt")        // ③ 父目录File对象 + 文件名
```

> 处理单个文件用①；处理同一目录下多个文件用②或③更方便。

### 7.1.2 常用方法速查

| 方法 | 返回 | 说明 |
|------|------|------|
| `exists()` | `boolean` | 文件/目录是否存在 |
| `createNewFile()` | `boolean` | 创建文件，成功返回 true |
| `mkdir()` | `boolean` | 创建单层目录 |
| `mkdirs()` | `boolean` | 创建多层目录（自动创建不存在的父目录） |
| `delete()` | `boolean` | 删除文件或**空**目录 |
| `isFile()` | `boolean` | 是否是文件 |
| `isDirectory()` | `boolean` | 是否是目录 |
| `getParentFile()` | `File` | 获取父目录的 File 对象 |
| `getName()` | `String` | 获取文件名 |
| `getAbsolutePath()` | `String` | 获取绝对路径 |

**基础用法示例：**

```java
// 存在就删，不存在就建
File file = new File("d:/hello/demo.txt");
if (file.exists()) {
    file.delete();                    // 删除
} else {
    file.createNewFile();             // 创建
}

// 确保父目录存在再创建文件
File file = new File("d:/hello1/demo.txt");
if (!file.getParentFile().exists()) {
    file.getParentFile().mkdir();     // 先创建父目录
}
file.createNewFile();
```

>[!danger]- delete() 的三大陷阱
>**① 删不掉非空目录**
>```java
>File dir = new File("d:/mydir");
>dir.delete();  // 如果 mydir 里面有文件 → 返回 false，删不掉！
>```
>解决：必须**递归**先删内部文件/子目录，再删自身。
>
>**② 不进回收站**
>`delete()` 直接从虚拟机删除，**不可恢复**。操作需谨慎。
>
>**③ 返回值**
>成功返回 `true`，失败（不存在/非空目录/无权限）返回 `false`。

### 7.1.3 遍历目录

**三种方法对比：**

| 方法 | 返回值 | 能否递归 | 说明 |
|------|--------|---------|------|
| `list()` | `String[]` | ❌ | 只返回文件名 |
| `list(FilenameFilter)` | `String[]` | ❌ | 带过滤器的文件名 |
| `listFiles()` | `File[]` | ✅ | 返回 File 对象，可递归 |

**基本遍历：**

```java
File dir = new File("D:/project");
if (dir.isDirectory()) {
    String[] names = dir.list();
    for (String name : names) {
        System.out.println(name);
    }
}
```

**带过滤器的遍历（如只取 `.java` 文件）：**

```java
File dir = new File("D:/project");
FilenameFilter filter = new FilenameFilter() {
    public boolean accept(File dir, String name) {
        return name.endsWith(".java");   // 只保留 .java 文件
    }
};
String[] files = dir.list(filter);
```

>[!note]- list(FilenameFilter) 的工作原理
>1. 调用 `list(filter)`，传入过滤器对象  
>2. 取出目录下所有子项  
>3. **逐个**调用过滤器的 `accept(dir, name)`，传入当前目录和子项名  
>4. `accept()` 返回 `true` → 加到结果数组；返回 `false` → 跳过

**递归遍历整个目录树：**

```java
void walk(File dir) {
    File[] files = dir.listFiles();          // 获取所有子项
    for (File f : files) {
        if (f.isDirectory()) {
            walk(f);                         // 是目录 → 递归
        }
        System.out.println(f.getAbsolutePath());
    }
}
```

### 7.1.4 递归删除非空目录

```java
void deleteDir(File dir) {
    if (dir.isDirectory()) {
        for (File f : dir.listFiles()) {
            deleteDir(f);                    // 递归删除子项
        }
    }
    dir.delete();                            // 最后删除自身
}
```

>[!note]- 为什么需要递归删除？
>Java 的安全机制：`delete()` 只能删"空目录"，防止误删大量数据。  
>类比：倒垃圾前先把垃圾桶里的东西一件件拿出来分类扔掉，最后才能扔垃圾桶本身。

---

## 7.2 字节流 —— 万能管道

### 7.2.1 核心概念

> 计算机中**所有文件**（文本、图片、音频、视频）底层都是**二进制字节**。  
> 字节流操作的是 `byte`，可以处理**任何类型**的文件。

**输入/输出是相对于谁？**

```
磁盘文件 ──read()──→ [ 程序(内存) ] ──write()──→ 磁盘文件
       输入(Input)                 输出(Output)
```

> **以程序（内存）为"我"**：读入 = 输入，写出 = 输出。

>[!warning]- 别理解反了！
>- `FileInputStream` = 把文件内容**读到**内存 → 输入
>- `FileOutputStream` = 把内存数据**写到**文件 → 输出

### 7.2.2 两个抽象父类

`InputStream` 和 `OutputStream` 都是**抽象类**，不能 `new`。

| 父类 | 子类（常用） | 用途 |
|------|-------------|------|
| `InputStream` | `FileInputStream` | 从文件读字节 |
| | `BufferedInputStream` | 带缓冲的读 |
| `OutputStream` | `FileOutputStream` | 向文件写字节 |
| | `BufferedOutputStream` | 带缓冲的写 |

**继承体系概览：**

```
InputStream                    OutputStream
  ├── FileInputStream            ├── FileOutputStream
  ├── BufferedInputStream        ├── BufferedOutputStream
  ├── ByteArrayInputStream       ├── ByteArrayOutputStream
  └── ...                        └── ...
```

### 7.2.3 读文件（FileInputStream）

```java
FileInputStream in = new FileInputStream("test.txt");
int b;
while ((b = in.read()) != -1) {    // read() 返回 -1 表示读到末尾
    System.out.println(b);         // 输出读到的字节值（0~255）
}
in.close();                        // ⚠️ 一定要关！
```

>[!danger]- 核心约定：read() 返回 -1
>这是 Java IO 最重要的判断条件：
>- 正常读取：返回 0 ~ 255 的字节值（int 类型）
>- 读到末尾：返回 **-1**
>
>**所有字节输入流的 read() 都遵循这个约定！**

>[!warning]- close() 必须执行
>如果读的过程中抛异常，`close()` 会被跳过 → 资源泄漏。
>**正确姿势：**
>```java
>FileInputStream in = null;
>try {
>    in = new FileInputStream("test.txt");
>    // ... 读操作 ...
>} finally {
>    if (in != null) {
>        try { in.close(); } catch (IOException e) { }
>    }
>}
>```

### 7.2.4 写文件（FileOutputStream）

```java
// 覆盖写（默认）：文件存在则先清空再写入
OutputStream out = new FileOutputStream("example.txt");

// 追加写：文件存在则在末尾追加
OutputStream out = new FileOutputStream("example.txt", true);

out.write(65);                          // 写一个字节 'A'
out.write("hello".getBytes());          // 写字节数组
out.close();
```

>[!warning]- 覆盖写 vs 追加写
>```java
>new FileOutputStream("a.txt")       // 覆盖：每次打开先把文件清空
>new FileOutputStream("a.txt", true) // 追加：在末尾继续写
>```

### 7.2.5 文件拷贝 —— 逐字节 vs 缓冲区

**❌ 逐字节拷贝（极慢）：**

```java
InputStream in = new FileInputStream("src.pdf");
OutputStream out = new FileOutputStream("dest.pdf");
int len;
while ((len = in.read()) != -1) {    // 每次读 1 字节
    out.write(len);                    // 每次写 1 字节
}
in.close();
out.close();
```

**✅ 缓冲区拷贝（快百倍）：**

```java
InputStream in = new FileInputStream("src.pdf");
OutputStream out = new FileOutputStream("dest.pdf");
byte[] buff = new byte[1024];          // 1KB 缓冲区
int len;
while ((len = in.read(buff)) != -1) { // 一次读 1024 字节
    out.write(buff, 0, len);           // 一次写 len 字节
}
in.close();
out.close();
```

>[!note]- 为什么缓冲区能快那么多？
>烤箱鸭类比：运 10000 只烤鸭从北京到上海——
>- 逐字节 = 每次运 1 只 → 10000 趟 → 极慢
>- 缓冲区 = 每次装一车（1024 只）→ 约 10 趟 → 飞快
>
>每次 `read()` / `write()` 都是一次**磁盘 I/O**，减少 I/O 次数 = 大幅提速。

### 7.2.6 字节缓冲流（Buffered~）

在普通流外面包一层缓冲：

```java
BufferedInputStream bis = new BufferedInputStream(
    new FileInputStream("src.txt")
);
BufferedOutputStream bos = new BufferedOutputStream(
    new FileOutputStream("des.txt")
);

int len;
while ((len = bis.read()) != -1) {    // 内部自动缓冲
    bos.write(len);
}
bis.close();
bos.close();
```

> 缓冲流内部**自带缓冲区**，即使代码写的是逐字节 `read()`，底层也是批量读写。

---

## 7.3 字符流 —— 专为文本而生

### 7.3.1 为什么要字符流？

字节流读文本时拿到的是 `byte` 数字（如 `65` = `'A'`），需要手动转字符，不方便。

| | 字节流 | 字符流 |
|---|--------|--------|
| 父类 | `InputStream` / `OutputStream` | `Reader` / `Writer` |
| 操作单位 | `byte`（字节） | `char`（字符） |
| 读到的数据 | `65`（数字） | `'A'`（字符） |
| 适用文件 | **所有文件** | **仅文本文件** |

**继承体系：**

```
Reader                          Writer
  ├── FileReader                  ├── FileWriter
  ├── BufferedReader              ├── BufferedWriter
  ├── InputStreamReader           ├── OutputStreamWriter
  └── ...                         └── ...
```

>[!danger]- 字符流不能操作非文本文件！
>图片、视频、音频等二进制文件用字符流读取会**造成数据永久损坏**。
>
>原因：字符流会按编码把字节映射成字符，二进制数据没有对应的字符映射，转换过程中必然丢失/错乱。

### 7.3.2 读文本（FileReader）

```java
FileReader reader = new FileReader("reader.txt");
int ch;
while ((ch = reader.read()) != -1) {   // 返回字符的编码值，末尾返回 -1
    System.out.println((char) ch);      // 强转为字符
}
reader.close();
```

> `FileReader.read()` 返回 `char` 的 int 值，和 `InputStream.read()` 返回 `byte` 的 int 值是最大区别。

### 7.3.3 写文本（FileWriter）

```java
FileWriter writer = new FileWriter("writer.txt");          // 覆盖写
FileWriter writer = new FileWriter("writer.txt", true);    // 追加写

writer.write("你好，Java");     // 写字符串
writer.write("\r\n");            // 换行
writer.close();
```

### 7.3.4 字符缓冲流 —— readLine() 神器

```java
// 读：一行一行读
BufferedReader br = new BufferedReader(new FileReader("test.txt"));
String line;
while ((line = br.readLine()) != null) {   // 读到末尾返回 null
    System.out.println(line);
}
br.close();

// 写：带缓冲 + newLine()
BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"));
bw.write("第一行");
bw.newLine();                               // 跨平台换行
bw.write("第二行");
bw.close();                                 // ⚠️ 必须关，否则数据丢失！
```

>[!danger]- BufferedWriter 不 close = 丢数据
>缓冲流的 `write()` 先把数据塞进内部缓冲区，**缓冲区满了或 close() 时**才真正写入文件。
>
>如果忘了 `close()` → 最后一批数据留在缓冲区没写入 → **文件内容不完整**。
>```java
>BufferedWriter bw = new BufferedWriter(new FileWriter("a.txt"));
>bw.write("hello");
>// 没有 close() → a.txt 可能是空的！！
>```

>[!note]- readLine() vs read() 的末尾判断
>| 方法 | 读到末尾返回 |
>|------|------------|
>| `InputStream.read()` | `-1` |
>| `Reader.read()` | `-1` |
>| `BufferedReader.readLine()` | **`null`** |
>
>不要搞混！

---

## 7.4 转换流 —— 字节与字符的桥梁

### 7.4.1 为什么需要转换流？

场景：手上只有一个字节流（如网络传输来的 `InputStream`），但想按**字符**方式读写。

**两个桥梁：**

```
InputStream ──→ InputStreamReader ──→ Reader（字节→字符）
OutputStream ──→ OutputStreamWriter ──→ Writer（字节→字符）
```

### 7.4.2 经典四层包装（装饰器模式）

```java
BufferedReader br = new BufferedReader(         // ④ 缓冲 + readLine()
    new InputStreamReader(                       // ③ 字节 → 字符（桥梁）
        new FileInputStream("src.txt")           // ② 从文件读字节
    )                                            // ① 磁盘文件本身
);
BufferedWriter bw = new BufferedWriter(
    new OutputStreamWriter(
        new FileOutputStream("des.txt")
    )
);

String line;
while ((line = br.readLine()) != null) {
    bw.write(line);
    bw.newLine();
}
br.close();
bw.close();
```

**各层职责：**

| 层 | 类 | 职责 | 比喻 |
|----|-----|------|------|
| ① | `FileInputStream` | 从磁盘读原始字节 | 水管 |
| ② | `InputStreamReader` | 字节 → 字符 | 翻译官 |
| ③ | `BufferedReader` | 加缓冲区 + `readLine()` | 卡车 |

>[!note]- 这就是装饰器模式
>每一层包装都**增强**上一层的能力，各层职责单一。
>- `FileInputStream`：只管读字节
>- `InputStreamReader`：只管字节→字符转换
>- `BufferedReader`：只管缓冲和高级方法
>
>可以灵活组合，比如去掉缓冲、换成别的输入源等。

>[!danger]- 转换流只能用于文本文件！
>`InputStreamReader` 转换的是文本字节流。  
>如果把图片的字节流传入 → 字节无法正确映射成字符 → **数据永久损坏**。

---

## 总结：IO 流全景图

```
                          java.io
                             │
             ┌───────────────┼───────────────┐
             │               │               │
          File类           字节流           字符流
        (操作文件外壳)   (操作二进制)     (操作文本)
             │               │               │
        exists()        InputStream       Reader
        createNewFile() OutputStream      Writer
        delete()            │               │
        listFiles()    FileInputStream  FileReader
        mkdir/mkdirs   FileOutputStream FileWriter
             │               │               │
       递归遍历/删除    Buffered~      BufferedReader
                        缓冲提升效率    BufferedWriter
                             │          readLine()!
                             │               │
                        ┌────┴────┐    ┌─────┴─────┐
                   InputStreamReader  OutputStreamWriter
                        (字节 ←→ 字符，仅文本！)
```

---

## 核心铁律速查

| # | 铁律 | 说明 |
|---|------|------|
| 1 | **close() 必须执行** | 用 `try-finally` 或 try-with-resources |
| 2 | `read()` 返回 **-1** 表末尾 | 字节流和字符流的 `read()` 都是 -1 |
| 3 | `readLine()` 返回 **null** 表末尾 | 不要和 `read()` 的 -1 搞混 |
| 4 | `delete()` 不进回收站 | 且只能删空目录，非空需递归 |
| 5 | 字符流 ≠ 万能流 | 图片/视频/音频用字节流，否则数据损坏 |
| 6 | 缓冲拷贝比逐字节快百倍 | 减少磁盘 I/O 次数是关键 |
| 7 | 追加写用 `(path, true)` | 默认是覆盖写 |
| 8 | 输入/输出以**程序**为准 | 读入=Input，写出=Output |

---

## 类继承速查表

| 类型 | 输入（读） | 输出（写） |
|------|-----------|-----------|
| 抽象父类 | `InputStream` | `OutputStream` |
| 文件流 | `FileInputStream` | `FileOutputStream` |
| 缓冲流 | `BufferedInputStream` | `BufferedOutputStream` |
| 抽象父类 | `Reader` | `Writer` |
| 文件流 | `FileReader` | `FileWriter` |
| 缓冲流 | `BufferedReader` | `BufferedWriter` |
| 转换流 | `InputStreamReader` | `OutputStreamWriter` |

