# 贡献指南

感谢你愿意一起维护这份公开复习资料。这个仓库优先收录来源清楚、可复核、对复习直接有帮助的文件。

## 可以贡献什么

- 往年真题、回忆版真题、样卷、练习题。
- 老师公开课件、课程讲义、实验资料。
- 自己整理的复习讲义、知识点索引、错题整理。
- 对已有资料的勘误、重命名、分类调整。

## 不建议提交什么

- 来源不清、明显错科、无法确认课程归属的资料。
- 用 AI 生成的 PPT 或伪装成课件的内容。
- 带有个人隐私、账号信息、学生名单、成绩信息的文件。
- 付费复习包、会员资料包或其他不应公开分发的内容。
- 与课程复习无关的大文件或重复文件。

## 公开边界

提交前请阅读 [PUBLICATION_POLICY.md](PUBLICATION_POLICY.md)。不确定能否公开的资料，不要直接放入正式目录；可以先放入 `待复核课件PPT` 或 `待复核资料`，并在 PR 描述中说明风险点。

## 提交流程

1. Fork 仓库或在新分支工作。
2. 按 [docs/naming.md](docs/naming.md) 放置和命名资料。
3. 更新 `manifest.json`，确保新增文件有 `publicPath`、`bytes` 和 `sha256`。
4. 在所有资料文件最终写入后，刷新 manifest 里的文件元数据：

```bash
node scripts/refresh-manifest-metadata.mjs --write
```

不要手写 `bytes` 或 `sha256`；它们必须由脚本按最终文件内容计算。任何资料文件内容改动后，都要重新运行这一步。

5. 重新生成 README 科目目录并运行校验：

```bash
node scripts/update-readme.mjs
node scripts/validate-materials.mjs
node scripts/update-readme.mjs --check
```

6. 按 [docs/commit-format.md](docs/commit-format.md) 写 commit message 和 PR 标题。
7. 在 PR 描述里写清楚资料来源、课程、年份、是否需要复核。

## 提交前检查

- 文件放在正确课程目录和资料类型目录下。
- 文件名符合 [docs/naming.md](docs/naming.md)。
- Commit message 符合 [docs/commit-format.md](docs/commit-format.md)。
- PR 描述写清楚资料来源、课程、年份和是否需要人工复核。
- `manifest.json` 与实际文件一致。
- 不手写或猜测 `bytes` / `sha256`；使用 `node scripts/refresh-manifest-metadata.mjs --write` 生成。
- `README.md` 的科目目录已由 `node scripts/update-readme.mjs` 重新生成。
- `node scripts/validate-materials.mjs` 可以通过。
- `node scripts/update-readme.mjs --check` 可以通过。
- 没有个人隐私、账号信息、学生名单、成绩信息。
- 没有把付费资料、会员资料或内部资料放入公开仓库。

## 资料质量原则

- 真实优先：真实课件比重新包装的摘要更有价值。
- 可追溯优先：文件名、PR 描述和 manifest 要能看出资料来源。
- 少而准优先：不要为了凑数量加入低质量或错科资料。
- 可下架优先：发现不适合公开的资料，应及时提交下架 Issue 或移除 PR。
