# 河南大学软件学院期末复习公开资料

这里整理河南大学软件学院相关课程的期末复习公开资料，方便同学复习、补充和校对。

公开仓库只放真题、公开课件、课程资料和可共建讲义；付费复习包不进入本仓库。

资料仅供课程复习参考。若发现内容不准确、来源不清或不适合公开，请通过 Issue 或 PR 说明并协助修正。

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

推荐工作流：

1. 将待整理资料放入临时目录，或在 Issue / PR 中说明来源。
2. 让 Agent 逐个判断课程、资料类型、年份、来源和是否需要复核。
3. 拒绝或移除付费复习包、会员资料包、个人隐私、账号凭据、成绩名单、来源明显不清的资料。
4. 将可公开资料移动到正确的 `课程名/资料类型/` 目录。
5. 按 `课程名_资料类型_关键信息[_年份或版本].扩展名` 重命名文件。
6. 更新 `manifest.json`，至少写入 `subject`、`role`、`title`、`publicPath`、`bytes`、`sha256`。
7. 运行 `node scripts/update-readme.mjs` 重新生成 README 科目目录。
8. 运行 `node scripts/validate-materials.mjs` 和 `node scripts/update-readme.mjs --check`。
9. 新建分支并提交 PR，PR 描述必须写清课程、年份、来源、整理动作和待复核问题。

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

收录当前已整理的高数课程 PPT 课件。

- 课件PPT: 34 个文件，见 [课件PPT/](%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6A%EF%BC%88%E4%BA%8C%EF%BC%89/%E8%AF%BE%E4%BB%B6PPT/)。

### 离散数学

包含软件学院 23 级真题和考前复习讲义。

- 复习讲义: [离散数学_考前复习知识点讲义.pdf](%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: [离散数学_真题_软件学院23级离散数学.pdf](%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6_%E7%9C%9F%E9%A2%98_%E8%BD%AF%E4%BB%B6%E5%AD%A6%E9%99%A223%E7%BA%A7%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6.pdf)

### 大学物理

包含 23 真题、考前复习讲义和全部已整理 PDF 课件资料。

- 复习讲义: [大学物理_考前复习知识点讲义.pdf](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: [大学物理-23真题.pdf](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86-23%E7%9C%9F%E9%A2%98.pdf)
- 课件资料: 15 个文件，见 [课件资料/](%E5%A4%A7%E5%AD%A6%E7%89%A9%E7%90%86/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。

### 面向对象程序设计Java

包含 2023-2024 真题、考前复习讲义和全部 Java 章节 PPT。

- 复习讲义: [面向对象程序设计Java_考前复习知识点讲义.pdf](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: [面向对象程序设计Java_真题_Java程序设计2023-2024.pdf](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java_%E7%9C%9F%E9%A2%98_Java%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A12023-2024.pdf)
- 课件PPT: 10 个文件，见 [课件PPT/](%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1Java/%E8%AF%BE%E4%BB%B6PPT/)。

### Web编程基础

包含 22 真题、多份复习讲义和已拆分的 Web 课件资料。

- 复习讲义: 3 个文件，见 [复习讲义/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/)。
- 往年真题: [Web编程基础_真题_Web-22真题.pdf](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80_%E7%9C%9F%E9%A2%98_Web-22%E7%9C%9F%E9%A2%98.pdf)
- 课件资料: 15 个文件，见 [课件资料/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
<!-- MATERIALS:END -->

## 友情链接

- [Henu-Kaguya/Henu-Kaguya](https://github.com/Henu-Kaguya/Henu-Kaguya)：河南大学计算机科学与技术资料合集。
