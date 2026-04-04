# Shopify APP 模板 - 最低配置

模板文件参考`shopify.app.toml`，仅支持模板化 Scope、webhook 等内容，**无法固定 application_url、redirect_urls 等内容**，配置文件中的注释也会被移除。
可用于快速创建 Shopify APP，减少手动配置 Dev Dashboard 的流程。

> Webhook 配置可以被继承，问题是涉及到 Customer 的 webhook 需要手动调整其为 Custom APP 并且申请数据访问权限后才能使用。

> 始终建议显式定义`handle`，便于定位 APP 位置。该配置默认继承，不会自动更新。

默认占位：
- application_url：https://shopify.dev/apps/default-app-home
- redirect_urls：https://shopify.dev/apps/default-app-home/api/auth

### 快速创建 Shopify APP

> 确保已安装 Shopify CLI 工具。

```bash
# 初始化一个 Shopify APP，并且选择 Bun 包管理器（减少重复包），并且指定 APP 模板（公开 GitHub 仓库链接，HTTPS）
# -n 指定 APP 名称
# -p 指定安装路径（不指定时默认在当前目录新建）
shopify app init -d bun --template https://github.com/FixIterate/shopify-app-tpl.git -p ./shopify -n fix-iterate-001
```

执行结果：

```bash
$ shopify app init -d bun --template https://github.com/FixIterate/shopify-app-tpl.git -p ./shopify -n fix-iterate-001
?  Which organization is this work for?
✔  Linnzh - Dev

?  Create this project as a new app on Shopify?
✔  Yes, create it as a new app

?  App name:
✔  fix-iterate-001

╭─ info ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                                                                                                   │
│  Initializing project with `bun`                                                                                                                                                                  │
│  Use the `--package-manager` flag to select a different package manager.                                                                                                                          │
│                                                                                                                                                                                                   │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯


╭─ success ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                                                                                                   │
│  fix-iterate-001 is ready for you to build!                                                                                                                                                       │
│                                                                                                                                                                                                   │
│  Next steps                                                                                                                                                                                       │
│    • Run `cd fix-iterate-001`                                                                                                                                                                     │
│    • For extensions, run `shopify app generate extension`                                                                                                                                         │
│    • To see your app, run `shopify app dev`                                                                                                                                                       │
│                                                                                                                                                                                                   │
│  Reference                                                                                                                                                                                        │
│    • Shopify docs [1]                                                                                                                                                                             │
│    • For an overview of commands, run `shopify app --help`                                                                                                                                        │
│                                                                                                                                                                                                   │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
[1] https://shopify.dev
```

### 命令速览

```bash
# 快速查看 Shopify APP 配置，例如 API Key、API Secret 和 Scope 等
shopify app env show
# 将 Shopify APP 配置创建为 .env 文件
shopify app env pull

# 部署 Shopify APP
# 将本地配置和扩展推送到 Partner Dashboard，创建一个新的版本（version）
# 默认自动 Release（生效），使用 --no-release 时不发布、配置不生效
shopify app deploy --version v1.0.0.260328
shopify app deploy --version v1.0.1.260328 --no-release

# 发布 Shopify APP，可指定历史版本进行生效
shopify app release --version v1.0.0.260328
```

### 快速获取 APP 的安装 URL

通过读取 `.env` 文件中的环境变量以及传入的 Shopify 店铺域名，并解析 shopify.app.toml 文件中的 `auth.redirect_urls[0]` 重定向路径，生成 APP 安装 URL。

```bash
bun run oauth linnzh-au.myshopify.com
```
