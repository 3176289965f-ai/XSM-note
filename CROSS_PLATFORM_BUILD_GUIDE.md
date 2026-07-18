# 🌐 Premium Notes 多端原生打包指南 (Cross-Platform Distribution Guide)

本应用采用高保真、沉浸式、符合苹果/微软设计美学的 React SPA 架构构建，支持高度动态的 **3D 悬浮卡片**、**点击物理涟漪**、**实时 Spotlight 聚光灯折射光泽** 以及 **双模态暗黑模式**。

为了帮助您将本系统一键部署至 **安卓 Play 商店**、**苹果 App Store**、**Windows 桌面端** 以及 **macOS 桌面端**，我们已经为您在项目中预先配置好 **Capacitor Mobile** 与 **Electron Desktop** 双重引擎架构。 

以下是各平台的极简打包发布指南：

---

## 🛠 准备工作：导出项目

在开始各端打包之前，请先在网页编辑器的 **设置菜单**（Settings Menu）中将项目导出为 **ZIP 压缩包** 并解压，或将其推送到您的 **GitHub 仓库**。

在本地电脑上使用 VS Code 打开项目，并运行以下命令安装完整依赖：
```bash
npm install
```

---

## 📱 一、安卓端 (Google Play 商店) & 苹果端 (App Store)

我们使用目前最流行、运行效率最高的 **Capacitor** 引擎，将 React 网页直接映射为原生系统下的 High-Performance WebKit 容器，并支持一键桥接原生 API。

### 1. 编译并初始化
确保本地已经生成最新的 `dist/` 静态网页目录：
```bash
# 1. 编译网页版本
npm run build

# 2. 初始化 Capacitor 配置（已为您配置 appId: com.premiumnote.app）
# 此命令只需在首次拉取代码时执行一次即可
npx cap init "Premium Notes" "com.premiumnote.app" --web-dir=dist
```

### 2. 安卓打包 (Android)
运行以下命令来添加安卓原生项目：
```bash
# 1. 添加 Android 原生平台文件夹
npm run mobile:add-android

# 2. 将最新的网页 dist 内容同步到安卓原生代码中
npm run mobile:sync

# 3. 使用 Android Studio 打开原生安卓项目进行编译和发布
npm run mobile:open-android
```
* **在 Android Studio 中操作：**
  * 等待 Gradle 同步完成。
  * **测试运行：** 连接您的安卓真机或启动模拟器，点击顶部的 `Run` 按钮即可直接真机测试。
  * **发布至 Play 商店：**
    1. 点击菜单栏 `Build` -> `Generate Signed Bundle / APK`。
    2. 选择 `Android App Bundle (.aab)`（Play 商店目前强制要求的格式，比 APK 更省流量）。
    3. 创建或选择您的签名密钥对（Key Store），并输入密码。
    4. 编译完成后的 `.aab` 文件即可直接上传至 Google Play Console 进行审核上线！

### 3. 苹果 iOS 打包 (iOS)
*(注意：编译 iOS App 需要在一台 macOS 系统的电脑上，并安装了 Xcode)*
```bash
# 1. 添加 iOS 原生平台文件夹
npm run mobile:add-ios

# 2. 将最新的网页内容同步到 iOS 原生代码中
npm run mobile:sync

# 3. 使用 Xcode 打开原生 iOS 项目
npm run mobile:open-ios
```
* **在 Xcode 中操作：**
  * **测试运行：** 在左上角选择目标模拟器（如 iPhone 15 Pro），点击左上角三角 `Play` 按钮启动测试。
  * **签名设置：**
    1. 点击左侧导航栏最顶部的 `App` 根节点。
    2. 切换至 `Signing & Capabilities` 标签页。
    3. 勾选 `Automatically manage signing`，并在 `Team` 中选择您的 Apple 开发者账号。
  * **发布至 App Store：**
    1. 在顶部运行设备栏中选择 `Any iOS Device (arm64)`。
    2. 点击菜单栏 `Product` -> `Archive`。
    3. 归档成功后，在 Organizer 窗口中点击 `Distribute App`，选择 `App Store Connect` 并按照指引一步步上传。
    4. 上传完成后，在 App Store Connect 网页后台选择该构建版本，提交审核即可上线 App Store！

---

## 💻 二、Windows 桌面端 & macOS 桌面端

我们使用超高成熟度的 **Electron** 框架，为应用专门设计了**无边框毛玻璃微立体悬浮设计 (Frameless / TitleBarStyle Hidden)**。窗口边缘带用 Apple Native 的果冻缩放三色交通灯按钮，与系统完美融合。

### 1. 本地开发与测试
在开发阶段，运行以下命令即可直接唤起桌面窗口查看极致的 PC 客户端交互：
```bash
# 确保已经 build
npm run build

# 启动 Electron 桌面版测试
npm run desktop:start
```

### 2. 跨平台打包 (Windows `.exe` & macOS `.dmg` / `.app`)
我们推荐使用极其强大、配置全自动的 `electron-builder` 工具进行一键打包。

首先在您的项目根目录安装打包工具：
```bash
npm install electron-builder --save-dev
```

接着，在 `package.json` 中配置基础的打包属性，您可以把以下配置追加到 `package.json` 的最外层：

```json
"build": {
  "appId": "com.premiumnote.desktop",
  "productName": "Premium Notes",
  "copyright": "Copyright © 2026",
  "directories": {
    "output": "dist-desktop"
  },
  "files": [
    "dist/**/*",
    "electron-main.cjs",
    "electron-preload.js"
  ],
  "mac": {
    "target": ["dmg", "zip"],
    "category": "public.app-category.productivity"
  },
  "win": {
    "target": ["nsis", "zip"],
    "icon": "assets/icon.ico"
  }
}
```

并在 `package.json` 的 `"scripts"` 中添加一行打包快捷命令：
```json
"desktop:build": "npm run build && electron-builder"
```

运行打包命令：
```bash
npm run desktop:build
```
* **输出成果物：**
  * 执行完毕后，根目录下会自动生成一个 `dist-desktop` 目录。
  * **Windows 系统下：** 输出可一键安装的 `Premium Notes Setup.exe`。
  * **macOS 系统下：** 输出可拖拽安装的 `Premium Notes.dmg`。

---

## 🌐 三、网页版 (Web Service)

网页版具备极强的自适应响应式（Responsive Design）排版。

* **开发热更新：** `npm run dev`
* **打包编译：** `npm run build` （输出至 `dist/`，可一键部署至任一静态托管空间，如 Vercel, Netlify, Cloudflare Pages 或本平台绑定的 Cloud Run 容器中）。

所有视觉风格、3D 悬浮响应、以及点击水波涟漪特效已完美兼容所有平台。祝您的应用上线顺利！🎉
