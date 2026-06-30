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

## 仓库校验

提交资料变更前运行：

```bash
node scripts/validate-materials.mjs
```

该脚本会检查：

- `manifest.json` 是否能解析。
- manifest 中的文件是否真实存在。
- `bytes` 和 `sha256` 是否与实际文件一致。
- 课程目录、资料类型目录和 `publicPath` 是否匹配。
- 文件名是否包含临时文件、危险字符或明显未规范化词语。
- 是否存在重复 `publicPath`。

PR 和 `main` 分支 push 会通过 GitHub Actions 自动运行同一套校验。

## 友情链接

- [Henu-Kaguya/Henu-Kaguya](https://github.com/Henu-Kaguya/Henu-Kaguya)：计算机学院资料。

最后更新：2026-06-30T14:03:15.474Z

## 科目目录

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

包含 22 真题、考前复习讲义和已拆分的 Web 课件资料。

- 复习讲义: [Web编程基础_考前复习知识点讲义.pdf](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E5%A4%8D%E4%B9%A0%E8%AE%B2%E4%B9%89/Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80_%E8%80%83%E5%89%8D%E5%A4%8D%E4%B9%A0%E7%9F%A5%E8%AF%86%E7%82%B9%E8%AE%B2%E4%B9%89.pdf)
- 往年真题: [Web编程基础_真题_Web-22真题.pdf](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E5%BE%80%E5%B9%B4%E7%9C%9F%E9%A2%98/Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80_%E7%9C%9F%E9%A2%98_Web-22%E7%9C%9F%E9%A2%98.pdf)
- 课件资料: 15 个文件，见 [课件资料/](Web%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/%E8%AF%BE%E4%BB%B6%E8%B5%84%E6%96%99/)。
