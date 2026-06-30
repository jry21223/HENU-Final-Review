# Manifest 规范

`manifest.json` 是公开资料仓库的机器可读索引。README 适合人看，manifest 适合网站、脚本、搜索、校验和后续导入流程使用。

## 基本结构

```json
{
  "version": 1,
  "generatedAt": "2026-06-30T14:03:15.474Z",
  "subjects": [
    {
      "name": "离散数学",
      "note": "包含软件学院 23 级真题和考前复习讲义。",
      "assets": []
    }
  ]
}
```

## 必填字段

每个 `asset` 必须包含：

| 字段 | 说明 |
| --- | --- |
| `subject` | 课程名，必须与所在 subject 的 `name` 一致。 |
| `role` | 资料类型目录，例如 `往年真题`、`课件资料`。 |
| `title` | 展示标题，通常等于文件名。 |
| `publicPath` | 仓库内相对路径，格式为 `课程名/资料类型/文件名`。 |
| `bytes` | 文件字节数。 |
| `sha256` | 文件 SHA-256，用于去重和完整性校验。 |

## 建议字段

为了后续做网站、搜索和可信度标记，建议逐步补充：

| 字段 | 示例 | 说明 |
| --- | --- | --- |
| `year` | `2023` | 年份、学年或考试年份。 |
| `college` | `软件学院` | 适用学院。 |
| `major` | `网络工程` | 适用专业，可省略。 |
| `sourceType` | `teacher_public` | 来源类型。 |
| `sourceNote` | `老师公开课件` | 人类可读来源说明。 |
| `reviewStatus` | `verified` | 复核状态。 |
| `containsPersonalInfo` | `false` | 是否含个人信息；公开仓库必须为 `false` 或省略。 |
| `licenseStatus` | `public_review_only` | 公开边界或授权状态说明。 |

## sourceType 建议取值

- `teacher_public`：老师公开课件或公开讲义。
- `course_group`：课程群资料。
- `student_recall`：同学回忆版真题。
- `student_note`：同学个人整理笔记或讲义。
- `derived_index`：从公开资料整理出的索引或目录。
- `unknown_reviewing`：来源待复核，只能放在待复核目录。

## reviewStatus 建议取值

- `verified`：已确认课程、年份和来源。
- `needs_review`：需要复核，但暂时保留。
- `ocr_unclear`：OCR 或扫描质量不清晰。
- `year_uncertain`：年份不确定。
- `source_uncertain`：来源不确定。
- `deprecated`：不再推荐使用，等待替换或移除。

## 示例

```json
{
  "subject": "离散数学",
  "role": "往年真题",
  "title": "离散数学_真题_软件学院23级.pdf",
  "publicPath": "离散数学/往年真题/离散数学_真题_软件学院23级.pdf",
  "year": "2023",
  "college": "软件学院",
  "major": "网络工程",
  "sourceType": "student_recall",
  "sourceNote": "软件学院23级同学回忆版，待进一步校对。",
  "reviewStatus": "needs_review",
  "containsPersonalInfo": false,
  "licenseStatus": "public_review_only",
  "bytes": 240532,
  "sha256": "20122cc28de5c25d5df70f6b37b8e73db87748acc34bd6bfbc1ed6958a72b40a"
}
```

## 校验

默认校验必填字段、文件存在性、路径安全性、目录类型、文件大小和 hash：

```bash
node scripts/validate-materials.mjs
```

当来源字段全部补齐后，可以使用严格来源校验：

```bash
node scripts/validate-materials.mjs --strict-metadata
```
