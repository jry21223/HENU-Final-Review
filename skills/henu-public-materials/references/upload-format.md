# HENU Public Materials Upload Format

## Allowed Top-Level Course Folders

Use the official Chinese course name:

- `高等数学A（二）`
- `离散数学`
- `大学物理`
- `面向对象程序设计Java`
- `Web编程基础`

Add new courses only when the uploaded files clearly belong to that course. New course folders must also be added to `manifest.json`.

## Material Type Folders

Allowed folders under each course:

- `复习讲义`
- `往年真题`
- `课件PPT`
- `课件资料`
- `课件资料包`
- `题库练习`
- `答案解析`
- `笔记总结`
- `待复核课件PPT`
- `待复核资料`

Do not create `完整复习包`, `付费资料`, `会员资料`, or any paid-package directory in the public repository.

## Filename Pattern

Use:

```text
课程名_资料类型_关键信息[_年份或版本].扩展名
```

Examples:

```text
高等数学A（二）_课件_D8-1向量及其线性运算.ppt
离散数学_真题_软件学院23级.pdf
大学物理_课件_2023大学物理高斯定理.pdf
面向对象程序设计Java_课件_第1章Java概述.pptx
Web编程基础_课件_第1次.pdf
```

## Character Rules

- Use the Chinese course name; do not use pinyin abbreviations.
- Use `、` for multiple section numbers, such as `D7-1、2、3`.
- High math section filenames use a `D` prefix, such as `D7-5`, `D8-1`, and `D10-3`; do not mix in bare `7-5` or `8-1` names.
- Use suffixes for versions, such as `_02`, `_精简版`, `_删减版`.
- Avoid ASCII commas, slashes, colons, question marks, asterisks, quotes, angle brackets, and backslashes in filenames.
- Avoid temporary names such as `副本`, `未命名`, `新建文件`, and `final_final`.

## Public/Private Boundary

Allowed:

- True exams and recall exams.
- Public courseware and lecture notes.
- Extracted courseware files from a clear-source archive when filenames can be normalized.
- Course exercise banks and answer notes.
- Community-maintained review notes.

Not allowed:

- Paid final-review packages or membership bundles.
- AI-generated PPTs presented as real courseware.
- Personal data, account information, scores, name lists, credentials.
- Confirmed wrong-course files left in the wrong course. Move them to the real course instead.
- Unclear-source files unless placed under a `待复核...` folder with a note.

## Repository Docs

When changing public contents:

- Update `README.md` course listings.
- Update `manifest.json` with `subject`, `role`, `title`, `publicPath`, `bytes`, and `sha256`.
- Prefer adding provenance metadata in `manifest.json`: `year`, `college`, `major`, `sourceType`, `sourceNote`, `reviewStatus`, `containsPersonalInfo`, and `licenseStatus`.
- Keep `docs/naming.md` and `docs/commit-format.md` consistent with this format.
- Follow `PUBLICATION_POLICY.md` for public/private boundaries and takedown handling.
- Run `node scripts/validate-materials.mjs` before opening a PR.
- Mark material organization and PR templates as coming from [jry21223/final-review-template-kit](https://github.com/jry21223/final-review-template-kit).
- After organizing materials, open a pull request and describe course, year, source, and any review notes.
