# 河南大学期末复习公开资料

仓库内所有资料都会定期同步到https://henukit.cn/library 方便同学们下载

政治资料特别说明：来源为“河南大学考试墙&河南大学小过儿”。按本批资料的来源说明，原始 PDF 内容及联系方式予以保留，作为老师公开分享资料的特例；这不构成仓库对其他含联系方式资料的普遍收录许可。相关政治题目已整理上传至线上刷题网站。资料仅作课程复习参考，不代表学校官方教材、官方命题或对考试内容的保证。

## 参与共建

- 资料命名规则见 [docs/naming.md](docs/naming.md)。
- 提交信息和 PR 要求见 [docs/commit-format.md](docs/commit-format.md)。
- 贡献流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。
- 公开资料收录、隐私检查和下架规则见 [PUBLICATION_POLICY.md](PUBLICATION_POLICY.md)。
- 本地整理和上传校验可使用 [skills/henu-public-materials](skills/henu-public-materials/)。
- 资料整理和 PR 描述模板来自 [jry21223/final-review-template-kit](https://github.com/jry21223/final-review-template-kit)。
- 想参与贡献可以先 fork 仓库，按规范整理资料后提交 PR；PR 描述里写清课程、年份、来源和是否需要复核。

## 使用 Agent 整理资料并提交 PR

本仓库内置 `skills/henu-public-materials`，用于指导 AI Agent 按公开资料仓库规范整理文件。适合处理批量归类课件、规范文件名、拆分或移动资料包、剔除不应公开内容、更新 `manifest.json` 与 README 科目目录，并准备 Pull Request。

使用 Agent 前，先让它读取：

- [skills/henu-public-materials/SKILL.md](skills/henu-public-materials/SKILL.md)
- [skills/henu-public-materials/references/upload-format.md](skills/henu-public-materials/references/upload-format.md)
- [docs/naming.md](docs/naming.md)
- [PUBLICATION_POLICY.md](PUBLICATION_POLICY.md)


可以直接给 Agent 使用类似提示词：

```text
请按本仓库 skills/henu-public-materials 规范整理这些资料：
1. 读取 upload-format、naming、publication policy。
2. 判断每个文件所属课程、资料类型、来源和是否可公开。
3. 过滤付费包、隐私信息、账号凭据、明显来源不清的资料。
4. 规范文件名并放入正确目录。
5. 更新 manifest.json 和 README 自动生成目录。
6. 运行校验脚本，修复 ERROR，把 WARNING 写入 PR 说明。
7. 新建分支提交，并打开 draft PR。
```

Agent 可以辅助整理，但不能替代人工复核。涉及来源不明、版权不确定、隐私风险或考试纪律风险的资料，应放入 `待复核资料` 或暂不公开。

## 仓库校验

提交资料变更前运行：

```bash
node scripts/validate-materials.mjs
node scripts/update-readme.mjs
```

PR 和 `main` 分支 push 会通过 GitHub Actions 自动检查资料结构与 README 目录是否和 `manifest.json` 同步。

<!-- MATERIALS:START -->
## 科目目录

> 此区块由 `manifest.json` 自动生成。请不要手动编辑；运行 `node scripts/update-readme.mjs` 更新。

### 高等数学A（二）

收录当前已整理的高数课程 PPT 课件、考前复习讲义和2021-2025年高数A/B卷真题。

- 复习讲义: [高等数学A（二）_考前复习知识点讲义.pdf](%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 课件PPT: 34 个文件，见 [课件PPT/](%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89/%E8%AF%BE%E4%BB%B6PPT/)。
- 待复核资料: 6 个文件，见 [待复核资料/](%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。
- 往年真题: 9 个文件，见 [往年真题/](%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/)。
- 笔记总结: [高等数学A（二）_笔记_高数重点笔记.md](%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89_%E7%AC%94%E8%AE%B0_%E9%AB%98%E6%95%B0%E9%87%8D%E7%82%B9%E7%AC%94%E8%AE%B0.md)

### 离散数学

包含 23 级真题、考前复习讲义和期末复习自总结。

- 复习讲义: [离散数学_考前复习知识点讲义.pdf](%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: [离散数学_真题_软件学院23级离散数学.pdf](%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6_%E7%9C%9F%E9%A2%98_%E8%BD%AF%E4%BB%B6%E5%AD%A6%E9%99%A223%E7%BA%A7%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6.pdf)
- 笔记总结: [离散数学_笔记_期末复习自总结_V4.pdf](%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6_%E7%AC%94%E8%AE%B0_%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%E8%87%AA%E6%80%BB%E7%BB%93_V4.pdf)
- 待复核资料: 21 个文件，见 [待复核资料/](%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。

### 大学物理

包含 23 真题、24 练习、考前复习讲义、PDF 课件资料和期末复习总结。

- 复习讲义: [大学物理_考前复习知识点讲义.pdf](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: [大学物理_真题_23真题.pdf](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86_%E7%9C%9F%E9%A2%98_23%E7%9C%9F%E9%A2%98.pdf)
- 课件资料: 15 个文件，见 [课件资料/](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
- 题库练习: [大学物理_题库练习_24练习.pdf](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86_%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0_24%E7%BB%83%E4%B9%A0.pdf)
- 笔记总结: 6 个文件，见 [笔记总结/](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/)。
- 待复核课件PPT: 22 个文件，见 [待复核课件PPT/](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%AF%BE%E4%BB%B6PPT/)。
- 待复核资料: 9 个文件，见 [待复核资料/](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。

### 面向对象程序设计Java

包含 2023-2024、24 真题、考前复习讲义、Java 章节 PPT 和公开学习笔记。

- 复习讲义: [面向对象程序设计Java_考前复习知识点讲义.pdf](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: 4 个文件，见 [往年真题/](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/)。
- 课件PPT: 10 个文件，见 [课件PPT/](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E8%AF%BE%E4%BB%B6PPT/)。
- 笔记总结: 11 个文件，见 [笔记总结/](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/)。
- 待复核资料: 5 个文件，见 [待复核资料/](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。

### Web编程基础

包含 22 真题、多份复习讲义和已拆分的 Web 课件资料。

- 复习讲义: 3 个文件，见 [复习讲义/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/)。
- 往年真题: 2 个文件，见 [往年真题/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/)。
- 课件资料: 15 个文件，见 [课件资料/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
- 笔记总结: 4 个文件，见 [笔记总结/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/)。
- 待复核资料: 3 个文件，见 [待复核资料/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。

### 数据库系统

包含考前复习讲义、数据库系统课程 PPT 课件、章节习题与答案解析。

- 复习讲义: [数据库系统_考前复习知识点讲义.pdf](%E6%95%B0%E6%8D%AE%E5%BA%93%E7%B3%BB%E7%BB%9F/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E6%95%B0%E6%8D%AE%E5%BA%93%E7%B3%BB%E7%BB%9F_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 课件PPT: 15 个文件，见 [课件PPT/](%E6%95%B0%E6%8D%AE%E5%BA%93%E7%B3%BB%E7%BB%9F/%E8%AF%BE%E4%BB%B6PPT/)。
- 答案解析: 3 个文件，见 [答案解析/](%E6%95%B0%E6%8D%AE%E5%BA%93%E7%B3%BB%E7%BB%9F/%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90/)。
- 题库练习: 3 个文件，见 [题库练习/](%E6%95%B0%E6%8D%AE%E5%BA%93%E7%B3%BB%E7%BB%9F/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 计算机网络

包含考前复习讲义和样卷资料。

- 复习讲义: [计算机网络_考前复习知识点讲义.pdf](%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: [计算机网络_样卷_sample.pdf](%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C_%E6%A0%B7%E5%8D%B7_sample.pdf)

### 计算机组成原理

包含考前复习讲义、计算机组成原理课程 PDF 课件、笔记与复习题。

- 复习讲义: [计算机组成原理_考前复习知识点讲义.pdf](%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BB%84%E6%88%90%E5%8E%9F%E7%90%86/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BB%84%E6%88%90%E5%8E%9F%E7%90%86_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 课件资料: 7 个文件，见 [课件资料/](%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BB%84%E6%88%90%E5%8E%9F%E7%90%86/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
- 笔记总结: [计算机组成原理_笔记_组成原理总结.pdf](%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BB%84%E6%88%90%E5%8E%9F%E7%90%86/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BB%84%E6%88%90%E5%8E%9F%E7%90%86_%E7%AC%94%E8%AE%B0_%E7%BB%84%E6%88%90%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93.pdf)

### 软件工程

包含考前复习讲义、软件工程课程 PPT 课件与复习整理笔记。

- 复习讲义: 13 个文件，见 [复习讲义/](%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/)。
- 课件PPT: 14 个文件，见 [课件PPT/](%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/%E8%AF%BE%E4%BB%B6PPT/)。
- 待复核资料: 2 个文件，见 [待复核资料/](%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。
- 题库练习: 2 个文件，见 [题库练习/](%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 电工电子技术基础

包含考前复习讲义和电工电子技术基础 PDF 课件资料。

- 复习讲义: [电工电子技术基础_考前复习知识点讲义.pdf](%E7%94%B5%E5%B7%A5%E7%94%B5%E5%AD%90%E6%8A%80%E6%9C%AF%E5%9F%BA%E7%A1%80/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E7%94%B5%E5%B7%A5%E7%94%B5%E5%AD%90%E6%8A%80%E6%9C%AF%E5%9F%BA%E7%A1%80_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 课件资料: 9 个文件，见 [课件资料/](%E7%94%B5%E5%B7%A5%E7%94%B5%E5%AD%90%E6%8A%80%E6%9C%AF%E5%9F%BA%E7%A1%80/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。

### 移动开发

包含考前复习讲义和移动开发/HarmonyOS 相关 PPT 课件。

- 复习讲义: [移动开发_考前复习知识点讲义.pdf](%E7%A7%BB%E5%8A%A8%E5%BC%80%E5%8F%91/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E7%A7%BB%E5%8A%A8%E5%BC%80%E5%8F%91_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 课件PPT: 11 个文件，见 [课件PPT/](%E7%A7%BB%E5%8A%A8%E5%BC%80%E5%8F%91/%E8%AF%BE%E4%BB%B6PPT/)。

### 思想道德与法治

收录教师分享的思修课程重点与习题资料；原文件来源标注为河南大学考试墙&河南大学小过儿。

- 复习讲义: 2 个文件，见 [复习讲义/](%E6%80%9D%E6%83%B3%E9%81%93%E5%BE%B7%E4%B8%8E%E6%B3%95%E6%B2%BB/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/)。
- 题库练习: 2 个文件，见 [题库练习/](%E6%80%9D%E6%83%B3%E9%81%93%E5%BE%B7%E4%B8%8E%E6%B3%95%E6%B2%BB/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。
- 笔记总结: [思想道德与法治_笔记_思修重点复习.md](%E6%80%9D%E6%83%B3%E9%81%93%E5%BE%B7%E4%B8%8E%E6%B3%95%E6%B2%BB/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E6%80%9D%E6%83%B3%E9%81%93%E5%BE%B7%E4%B8%8E%E6%B3%95%E6%B2%BB_%E7%AC%94%E8%AE%B0_%E6%80%9D%E4%BF%AE%E9%87%8D%E7%82%B9%E5%A4%8D%E4%B9%A0.md)

### 习近平新时代中国特色社会主义思想概论

收录教师分享的习概课程教材重点与习题资料；原文件来源标注为河南大学考试墙&河南大学小过儿。

- 复习讲义: [习近平新时代中国特色社会主义思想概论_复习讲义_2025年冬最新教材重点.pdf](%E4%B9%A0%E8%BF%91%E5%B9%B3%E6%96%B0%E6%97%B6%E4%BB%A3%E4%B8%AD%E5%9B%BD%E7%89%B9%E8%89%B2%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%80%9D%E6%83%B3%E6%A6%82%E8%AE%BA/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E4%B9%A0%E8%BF%91%E5%B9%B3%E6%96%B0%E6%97%B6%E4%BB%A3%E4%B8%AD%E5%9B%BD%E7%89%B9%E8%89%B2%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%80%9D%E6%83%B3%E6%A6%82%E8%AE%BA_%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89_2025%E5%B9%B4%E5%86%AC%E6%9C%80%E6%96%B0%E6%95%99%E6%9D%90%E9%87%8D%E7%82%B9.pdf)
- 题库练习: [习近平新时代中国特色社会主义思想概论_题库练习_2025年冬最新教材习题库.pdf](%E4%B9%A0%E8%BF%91%E5%B9%B3%E6%96%B0%E6%97%B6%E4%BB%A3%E4%B8%AD%E5%9B%BD%E7%89%B9%E8%89%B2%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%80%9D%E6%83%B3%E6%A6%82%E8%AE%BA/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/%E4%B9%A0%E8%BF%91%E5%B9%B3%E6%96%B0%E6%97%B6%E4%BB%A3%E4%B8%AD%E5%9B%BD%E7%89%B9%E8%89%B2%E7%A4%BE%E4%BC%9A%E4%B8%BB%E4%B9%89%E6%80%9D%E6%83%B3%E6%A6%82%E8%AE%BA_%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0_2025%E5%B9%B4%E5%86%AC%E6%9C%80%E6%96%B0%E6%95%99%E6%9D%90%E4%B9%A0%E9%A2%98%E5%BA%93.pdf)

### Python程序设计

包含 Python 期末复习知识点梳理、复习题和思维导图。

- 复习讲义: [Python程序设计_复习讲义_期末复习知识点梳理.docx](Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1_%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89_%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E6%A2%B3%E7%90%86.docx)
- 待复核资料: [Python程序设计_待复核_期末复习半本通.pdf](Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1_%E5%BE%85%E5%A4%8D%E6%A0%B8_%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%E5%8D%8A%E6%9C%AC%E9%80%9A.pdf)
- 笔记总结: [Python程序设计_笔记总结_思维导图.pdf](Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1_%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93_%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE.pdf)
- 题库练习: [Python程序设计_题库练习_期末复习题_文字版.txt](Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/Python%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1_%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0_%E6%9C%9F%E6%9C%AB%E5%A4%8D%E4%B9%A0%E9%A2%98_%E6%96%87%E5%AD%97%E7%89%88.txt)

### 专业英语

包含专业英语课程 Chapter 课件 PDF、课文整理、习题库和期末答案。

- 复习讲义: [专业英语_复习讲义_1-12单元课文整理.pdf](%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD_%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89_1-12%E5%8D%95%E5%85%83%E8%AF%BE%E6%96%87%E6%95%B4%E7%90%86.pdf)
- 待复核资料: [专业英语_待复核_选择题回忆版.docx](%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD_%E5%BE%85%E5%A4%8D%E6%A0%B8_%E9%80%89%E6%8B%A9%E9%A2%98%E5%9B%9E%E5%BF%86%E7%89%88.docx)
- 答案解析: [专业英语_答案解析_2023年期末答案.docx](%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD/%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90/%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD_%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90_2023%E5%B9%B4%E6%9C%9F%E6%9C%AB%E7%AD%94%E6%A1%88.docx)
- 课件资料: 10 个文件，见 [课件资料/](%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
- 题库练习: 4 个文件，见 [题库练习/](%E4%B8%93%E4%B8%9A%E8%8B%B1%E8%AF%AD/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 大数据

包含大数据基础课程课件、章节单元测验、雨课堂习题和笔记。

- 待复核资料: [大数据_待复核_选择题回忆版.docx](%E5%A4%A7%E6%95%B0%E6%8D%AE/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/%E5%A4%A7%E6%95%B0%E6%8D%AE_%E5%BE%85%E5%A4%8D%E6%A0%B8_%E9%80%89%E6%8B%A9%E9%A2%98%E5%9B%9E%E5%BF%86%E7%89%88.docx)
- 笔记总结: [大数据_笔记_大数据笔记.pdf](%E5%A4%A7%E6%95%B0%E6%8D%AE/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E5%A4%A7%E6%95%B0%E6%8D%AE_%E7%AC%94%E8%AE%B0_%E5%A4%A7%E6%95%B0%E6%8D%AE%E7%AC%94%E8%AE%B0.pdf)
- 课件资料: 3 个文件，见 [课件资料/](%E5%A4%A7%E6%95%B0%E6%8D%AE/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
- 题库练习: 4 个文件，见 [题库练习/](%E5%A4%A7%E6%95%B0%E6%8D%AE/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 工程经济学

包含工程经济学课程课件（绪论、经济效益分析、风险等）、复习讲义和期末试题。

- 复习讲义: 3 个文件，见 [复习讲义/](%E5%B7%A5%E7%A8%8B%E7%BB%8F%E6%B5%8E%E5%AD%A6/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/)。
- 待复核资料: 2 个文件，见 [待复核资料/](%E5%B7%A5%E7%A8%8B%E7%BB%8F%E6%B5%8E%E5%AD%A6/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。
- 笔记总结: [工程经济学_笔记_部分笔记.pdf](%E5%B7%A5%E7%A8%8B%E7%BB%8F%E6%B5%8E%E5%AD%A6/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E5%B7%A5%E7%A8%8B%E7%BB%8F%E6%B5%8E%E5%AD%A6_%E7%AC%94%E8%AE%B0_%E9%83%A8%E5%88%86%E7%AC%94%E8%AE%B0.pdf)
- 课件PPT: 6 个文件，见 [课件PPT/](%E5%B7%A5%E7%A8%8B%E7%BB%8F%E6%B5%8E%E5%AD%A6/%E8%AF%BE%E4%BB%B6PPT/)。
- 题库练习: 2 个文件，见 [题库练习/](%E5%B7%A5%E7%A8%8B%E7%BB%8F%E6%B5%8E%E5%AD%A6/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 机器学习

包含机器学习课程章节 PPT/PDF 课件、课程知识点总结、2023-2024 期末真题与回忆版。

- 复习讲义: [机器学习_复习讲义_课程知识点总结.pdf](%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0_%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89_%E8%AF%BE%E7%A8%8B%E7%9F%A5%E8%AF%86%E7%82%B9%E6%80%BB%E7%BB%93.pdf)
- 待复核资料: 3 个文件，见 [待复核资料/](%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。
- 课件PPT: 11 个文件，见 [课件PPT/](%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/%E8%AF%BE%E4%BB%B6PPT/)。
- 课件资料: 8 个文件，见 [课件资料/](%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。

### 算法

包含《算法设计与分析》课程课件（分治、贪心、动态规划、回溯、分支限界等）和章节习题、作业。

- 复习讲义: [算法_复习讲义_总复习.pptx](%E7%AE%97%E6%B3%95/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E7%AE%97%E6%B3%95_%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89_%E6%80%BB%E5%A4%8D%E4%B9%A0.pptx)
- 课件PPT: 14 个文件，见 [课件PPT/](%E7%AE%97%E6%B3%95/%E8%AF%BE%E4%BB%B6PPT/)。
- 题库练习: 6 个文件，见 [题库练习/](%E7%AE%97%E6%B3%95/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。
- 笔记总结: [算法_笔记_算法基础.md](%E7%AE%97%E6%B3%95/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E7%AE%97%E6%B3%95_%E7%AC%94%E8%AE%B0_%E7%AE%97%E6%B3%95%E5%9F%BA%E7%A1%80.md)

### 编译原理

包含编译原理课件、复习题、练习题答案及历年试卷（计算161-2、惠普151 等班级）。

- 复习讲义: [编译原理_复习讲义_考点清单.txt](%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86_%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89_%E8%80%83%E7%82%B9%E6%B8%85%E5%8D%95.txt)
- 待复核资料: 3 个文件，见 [待复核资料/](%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。
- 往年真题: 3 个文件，见 [往年真题/](%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/)。
- 答案解析: [编译原理_答案解析_练习题_文字版.txt](%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86_%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90_%E7%BB%83%E4%B9%A0%E9%A2%98_%E6%96%87%E5%AD%97%E7%89%88.txt)
- 课件资料: [编译原理_课件_演示文稿.pdf](%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86_%E8%AF%BE%E4%BB%B6_%E6%BC%94%E7%A4%BA%E6%96%87%E7%A8%BF.pdf)
- 题库练习: 2 个文件，见 [题库练习/](%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 计算机操作系统

包含计算机操作系统课程两套 PDF 课件、章节习题和真题卷子。

- 待复核资料: [计算机操作系统_待复核_真题卷子.docx](%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F_%E5%BE%85%E5%A4%8D%E6%A0%B8_%E7%9C%9F%E9%A2%98%E5%8D%B7%E5%AD%90.docx)
- 课件资料: 14 个文件，见 [课件资料/](%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
- 题库练习: [计算机操作系统_题库练习_章节习题.docx](%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F_%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0_%E7%AB%A0%E8%8A%82%E4%B9%A0%E9%A2%98.docx)

### 软件体系结构

包含软件体系结构复习讲义、复习题整理和待复核资料。

- 复习讲义: 2 个文件，见 [复习讲义/](%E8%BD%AF%E4%BB%B6%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/)。
- 待复核资料: 2 个文件，见 [待复核资料/](%E8%BD%AF%E4%BB%B6%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。
- 题库练习: 2 个文件，见 [题库练习/](%E8%BD%AF%E4%BB%B6%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 软件质量测试

包含软件质量测试课程课件 PPT/PDF、测试工具使用说明、雨课堂作业和笔记。

- 复习讲义: [软件质量测试_复习讲义_软件测试基础概念.pdf](%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95_%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89_%E8%BD%AF%E4%BB%B6%E6%B5%8B%E8%AF%95%E5%9F%BA%E7%A1%80%E6%A6%82%E5%BF%B5.pdf)
- 待复核资料: [软件质量测试_待复核_选择题回忆版.docx](%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95_%E5%BE%85%E5%A4%8D%E6%A0%B8_%E9%80%89%E6%8B%A9%E9%A2%98%E5%9B%9E%E5%BF%86%E7%89%88.docx)
- 笔记总结: [软件质量测试_笔记_测试笔记.pdf](%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95_%E7%AC%94%E8%AE%B0_%E6%B5%8B%E8%AF%95%E7%AC%94%E8%AE%B0.pdf)
- 课件PPT: 15 个文件，见 [课件PPT/](%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95/%E8%AF%BE%E4%BB%B6PPT/)。
- 课件资料: 11 个文件，见 [课件资料/](%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
- 题库练习: 2 个文件，见 [题库练习/](%E8%BD%AF%E4%BB%B6%E8%B4%A8%E9%87%8F%E6%B5%8B%E8%AF%95/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。

### 软件项目管理

包含软件项目管理课程复习讲义、简答题、笔记和综合测试。

- 复习讲义: 2 个文件，见 [复习讲义/](%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/)。
- 待复核资料: 2 个文件，见 [待复核资料/](%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86/%E5%BE%85%E5%A4%8D%E6%A0%B8%E8%B5%84%E6%96%99/)。
- 笔记总结: [软件项目管理_笔记_简要笔记.pdf](%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86/%E7%AC%94%E8%AE%B0%E6%80%BB%E7%BB%93/%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86_%E7%AC%94%E8%AE%B0_%E7%AE%80%E8%A6%81%E7%AC%94%E8%AE%B0.pdf)
- 答案解析: [软件项目管理_答案解析_习题参考答案.pdf](%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86/%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90/%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86_%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90_%E4%B9%A0%E9%A2%98%E5%8F%82%E8%80%83%E7%AD%94%E6%A1%88.pdf)
- 题库练习: 2 个文件，见 [题库练习/](%E8%BD%AF%E4%BB%B6%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86/%E9%A2%98%E5%BA%93%E7%BB%83%E4%B9%A0/)。
<!-- MATERIALS:END -->

## 友情链接

- [Henu-Kaguya/Henu-Kaguya](https://github.com/Henu-Kaguya/Henu-Kaguya)：河南大学计算机科学与技术资料合集。
