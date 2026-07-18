# 🌐 Premium Notes 网页端自定义域名绑定指南 (Custom Domain Setup Guide)

本应用是一套现代化的高性能 Web App，当前运行在 Google Cloud (Cloud Run) 的托管容器内。当您想要使用自己的专属域名（例如 `www.yournotes.com` 或 `notes.yourbrand.com`）来提供网页端访问时，可以通过以下几种极简、安全的方案进行配置。

---

## 方案一：使用 Google Cloud Run 自定义域名（最推荐）

如果您的应用继续托管在当前的 Google Cloud 原生云端基础设施中，您可以直接在 **Google Cloud Console** 控制台绑定您的域名：

### 1. 登录 Google Cloud 控制台
* 访问 [Google Cloud Console](https://console.cloud.google.com/)。
* 确保切换到与本应用实例关联的 GCP 项目（项目 ID 通常包含于您分享或部署的应用配置中）。

### 2. 添加自定义域名映射
1. 在控制台左侧菜单搜索并选择 **Cloud Run**。
2. 在服务列表中点击您的主服务。
3. 点击页面顶部的 **“管理自定义域名” (Manage Custom Domains)** 按钮。
4. 点击 **“添加映射” (Add Mapping)**。
5. 选择您拥有的域名（如果您尚未在 Google Cloud 验证过该域名，系统会引导您跳转到 Webmaster Central 进行一次快速的域名所有权验证，通常只需在您的 DNS 厂商处添加一条 TXT 记录）。
6. 指定子域名（例如 `notes.yourdomain.com`）或根域名，然后保存。

### 3. 配置您的 DNS 解析记录
添加映射后，Google Cloud 会为您分配一或多条 DNS 记录值（通常是 **CNAME** 记录指向 `ghs.googlehosted.com`，或是 4 条 **A 记录** 的 IP 地址列表）。
* 登录您的域名注册商后台（如阿里云、腾讯云、GoDaddy、Cloudflare 等）。
* 进入该域名的 **DNS 解析设置**。
* 按照 GCP 控制台显示的要求添加对应的 CNAME 或 A 记录。
* **等待生效**：DNS 解析全球同步通常需要 10 分钟到数小时。生效后，Google Cloud 会**自动为您申请并部署免费的 SSL 证书 (HTTPS)**。

---

## 方案二：使用 Cloudflare / Vercel 静态托管（零成本、自带全球 CDN）

由于本系统已经过极致的高性能静态编译（所有页面和动态水波纹、3D 悬浮效果均在前端完成自适应渲染，并搭载了本地防丢及云数据库同步），您非常适合将其导出并一键部署至专业的静态托管平台，从而获得更快的访问速度和更简单的域名绑定体验。

### 1. 使用 Cloudflare Pages (推荐，完全免费)
1. 将项目导出为 **ZIP 压缩包** 或一键推送至您的 **GitHub**。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
3. 点击左侧 **Workers & Pages** -> **Create...** -> **Pages**。
4. 关联您的 GitHub 仓库，或者直接上传解压后的 `dist/` 文件夹。
5. 在 Pages 项目控制面板中，切换至 **Custom Domains (自定义域名)** 选项卡。
6. 点击 **Set up a custom domain**，输入您的专属域名，Cloudflare 会**自动**帮您完成所有 DNS 记录的指向并颁发免费 SSL 证书。

### 2. 使用 Vercel 托管
1. 登录 [Vercel](https://vercel.com/)，点击 **Add New** -> **Project** 并关联您的 GitHub 仓库。
2. 框架预设选择 **Vite**，打包命令为 `npm run build`，输出目录为 `dist`，点击部署。
3. 部署成功后，在项目设置中点击 **Domains**，直接添加您的自定义域名。
4. 在您的 DNS 服务商处添加 Vercel 要求的 CNAME 记录即可。

---

## 🔒 统一多端网关与跨域安全建议 (CORS & OAuth)

如果您在网页端绑定了自定义域名，并且绑定了 Firebase 数据库或启用了第三方第三方登录：
1. **Firebase Authorized Domains**：
   * 登录您的 [Firebase 控制台](https://console.firebase.google.com/)。
   * 进入 **Authentication (身份验证)** -> **Settings (设置)** -> **Authorized Domains (授权网关)**。
   * 点击 **Add Domain (添加域名)**，将您的自定义域名（如 `notes.yourdomain.com`）添加进去，否则自定义域名下的用户将无法完成安全的账户登录。
2. **OAuth 重定向白名单**：
   * 如果配置了 Google OAuth，别忘了在 Google Cloud 的 API 凭据中，将您的新域名添加到“授权的 JavaScript 来源”和“授权的重定向 URI”中。

希望此指南对您的商业化部署与品牌域名绑定有所帮助！如需协助导出代码或进行特定平台集成，请随时指示。🚀
