# 书架 · Books Notes

个人阅读指南站点，手机端优化。每本书含 **原文 / 笔记 / 框架 / 读法** 四个 Tab。

## 在线访问

部署后地址：`https://<你的用户名>.github.io/booksnotes/`

## 本地打开

双击根目录 **`index.html`** 进入书架，再点书名进入各书详情。

## 书目

| 书名 | 目录 |
|------|------|
| 认知觉醒 | `认知觉醒_阅读指南/` |
| 穷爸爸富爸爸 | `穷爸爸富爸爸_阅读指南/` |
| 母爱的羁绊 | `母爱的羁绊_阅读指南/` |
| 国富论 | `国富论_阅读指南/` |

## 维护

```bash
# 重新生成主页
node scripts/build-home.mjs

# 给各书详情页注入「返回书架」按钮
node scripts/inject-home-link.mjs

# 重新生成单本书（进入对应目录）
node scripts/build.mjs
```

## 部署

推送到 GitHub 后，Actions 自动发布 Pages。首次需在仓库 Settings → Pages → Source 选 **GitHub Actions**。
