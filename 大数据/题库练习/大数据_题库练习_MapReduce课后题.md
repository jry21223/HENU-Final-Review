###  题目 1：文件合并与去重

#### 需求说明

合并两个文件（文件 A、文件 B），去除重复内容，输出到文件 C。

#### 实现思路

- **Map 阶段**：直接读取每行数据，以 **行内容本身** 作为 Key（利用 Hadoop 自动去重特性），Value 任意（如设为 `NullWritable`）。
- **Reduce 阶段**：无需复杂逻辑，直接输出 Key（自动去重后的行数据）

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

public class FileMergeDeduplication {

    // Map 类：读取每行数据，Key 设为行内容，Value 为 空
    // <输入键，输入值，输出键，输出值>
    // 本例中<每一行在文件中的偏移量，一行的文本，一行文本，空字符串>
    public static class MergeMapper extends Mapper<LongWritable, Text, Text, NullWritable> {
        private Text line = new Text();

        // value为map函数自动从文件中读取, 具体来说: Mapreduce的InputFormat模块对输入进行预处理，将文件分为InputSplit(分区)，并使用RecordReader从InputSplit中读取数据。
        
        // 默认情况下(没有使用job.setInputFormatClass()）, Mapreduce使用TextInputFormat模块，其RR会逐行读取数据。
        
        // <输入键，输入值，MapReduce任务上下文环境> 可以理解成context把我的数据交给Mapreduce框架去处理，比如:shuffle等等
        
        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        
            line = value.toString().trim();
            // NullWritable.get()表示获取NullWritable的单例对象
            context.write(line, NullWritable.get()); // 写入键值对, map过程的输入
        }
    }

    // Reduce 类：直接输出 Key（自动去重后的数据）
    // <输入键，输入值，输出键，输出值>
    // <一行文本，空，一行文本，空>
    public static class MergeReducer extends Reducer<Text, NullWritable, Text, NullWritable> {
        
        // <输入键(Mapper的输出键), map端shuffle后的结果类型, Mapreduce的上下文环境>
        // 比如: <"apple", <1, 1, 1>>
        @Override
        protected void reduce(Text key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {
            context.write(key, NullWritable.get()); // 输出去重后的行
        }
    }

    // 这里只设置了Reducer/Mapreduce整体框架的输出<k,v>类型，是因为在不设置Mapper输出的情况下, hadoop默认Mapper的输出与Reducer的输出保持一致, 如果输出不一致，可以.setMapperOutputKeyClass()来设置。
    // Mapper和Reducer的输入都可以不用设置，原因是Mapper的输入实际上是由FileInputFormat决定的
    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        
        // 每个Mapreduce程序都需要有一个job, 即一个Mapreduce作业, 在job中完成Mapreduce的相关配置
        Job job = Job.getInstance(conf, "FileMergeDeduplication");
        job.setJarByClass(FileMergeDeduplication.class);

        // 设置 Mapper、Reducer 类
        job.setMapperClass(MergeMapper.class);
        job.setReducerClass(MergeReducer.class);

        // 与Reducer类的类型对应
        // 设置输出 Key、Value 类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(NullWritable.class);

        // 输入路径（支持多个文件/文件夹，用逗号分隔）
        FileInputFormat.addInputPaths(job, args[0]); 
        // 输出路径（确保为空，Hadoop 自动创建）
        FileOutputFormat.setOutputPath(job, new Path(args[1])); 

        System.exit(job.waitForCompletion(true) ? 0 : 1); // 等待任务结束，true表示显示进度条
    }
}
```

### 题目 2：输入文件的排序

#### 需求说明

读取多个文件中的整数，升序排序后输出 **“排序位次 原整数”** 格式（如 `1 5` 表示 5 是第 1 小的数）。

#### 实现思路

- **Map 阶段**：读取每行整数，以 **整数本身** 为 Key（用于排序），Value 也存整数（保留原始值）。
- **Reduce 阶段**：遍历所有 Key（自动升序），按顺序标记 **排序位次**，输出 `位次 原整数`。

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

public class IntegerSort {

    // Map 类：读取整数，Key 为整数（用于排序），Value 存原始整数
    public static class SortMapper extends Mapper<LongWritable, Text, IntWritable, IntWritable> {
        private IntWritable num = new IntWritable();

        @Override
        protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
            int intValue = Integer.parseInt(value.toString().trim());
            num.set(intValue);
            context.write(num, num); // Key=整数（排序用），Value=原始值
        }
    }

    // Reduce 类：遍历升序 Key，标记位次并输出
    public static class SortReducer extends Reducer<IntWritable, IntWritable, Text, NullWritable> {
        private Text result = new Text();
        private int rank = 1; // 排序位次

        @Override
        protected void reduce(IntWritable key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
            for (IntWritable val : values) {
                // 构造 "位次  原整数" 格式
                result.set(rank + "  " + val.get()); 
                context.write(result, NullWritable.get());
                rank++; // 位次递增
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "IntegerSort");
        job.setJarByClass(IntegerSort.class);

        // 设置 Mapper、Reducer 类
        job.setMapperClass(SortMapper.class);
        job.setReducerClass(SortReducer.class);

        // 设置 Map 输出类型（Key=IntWritable，Value=IntWritable）
        job.setMapOutputKeyClass(IntWritable.class);
        job.setMapOutputValueClass(IntWritable.class);
        // 设置最终输出类型（Key=Text，Value=NullWritable）
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(NullWritable.class);

        // 输入路径（支持多个文件/文件夹）
        FileInputFormat.addInputPaths(job, args[0]); 
        // 输出路径
        FileOutputFormat.setOutputPath(job, new Path(args[1])); 

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
```

### 题目 3：祖孙关系挖掘

#### 需求说明

从 `child-parent` 表中挖掘祖孙关系（`grandchild-grandparent`），输出格式如 `Steven Alice`。

#### 实现思路

- Map 阶段：
  - 读取每行`child` `parent` ，，输出两组 Key-Value：
    - 以 `parent` 为 Key，`child` 为 Value（标记 “父 -> 子”）。
    - 以 `child` 为 Key，`parent` 为 Value（标记 “子 -> 父”）。
- Reduce 阶段：
  - 分组后，区分 `child` 集合（子节点）和 `parent` 集合（父节点）。
  - 若某节点既是子（有 `child`）又是父（有 `parent`），则子节点与父节点的父节点形成 **祖孙关系**。

```java
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GrandparentFinder {

    // Map 类：输出两组 Key-Value，标记“父->子”和“子->父”
    public static class RelationMapper extends Mapper<Object, Text, Text, Text> {
        @Override
        protected void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            String[] parts = value.toString().split(" ");
            if (parts.length == 2) {
                String child = parts[0];
                String parent = parts[1];
                // 标记：parent -> child（父节点 -> 子节点）
                context.write(new Text(parent), new Text("child:" + child)); 
                // 标记：child -> parent（子节点 -> 父节点）
                context.write(new Text(child), new Text("parent:" + parent)); 
            }
        }
    }

    // Reduce 类：挖掘祖孙关系
    public static class RelationReducer extends Reducer<Text, Text, Text, Text> {
        @Override
        protected void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
            List<String> children = new ArrayList<>(); // 子节点列表
            List<String> parents = new ArrayList<>();   // 父节点列表

            // 分组解析：区分 child 和 parent
            for (Text val : values) {
                String[] parts = val.toString().split(":");
                if ("child".equals(parts[0])) {
                    children.add(parts[1]);
                } else if ("parent".equals(parts[0])) {
                    parents.add(parts[1]);
                }
            }

            // 若当前节点既是子（有 children）又是父（有 parents），则子与父的父形成祖孙
            if (!children.isEmpty() && !parents.isEmpty()) {
                for (String grandchild : children) {
                    for (String grandparent : parents) {
                        // 输出：grandchild -> grandparent
                        context.write(new Text(grandchild), new Text(grandparent)); 
                    }
                }
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "GrandparentFinder");
        job.setJarByClass(GrandparentFinder.class);

        // 设置 Mapper、Reducer 类
        job.setMapperClass(RelationMapper.class);
        job.setReducerClass(RelationReducer.class);

        // 设置输出类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);

        // 输入路径（child-parent 表文件）
        FileInputFormat.addInputPath(job, new Path(args[0])); 
        // 输出路径
        FileOutputFormat.setOutputPath(job, new Path(args[1])); 

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
```

