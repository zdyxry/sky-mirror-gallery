# Decaocto

一个自动同步 Bluesky 内容的个人主页应用，展示 [@cshuamy.bsky.social](https://bsky.app/profile/cshuamy.bsky.social) 的动态。

## ✨ 功能特性

- 🔄 **自动同步** - 实时抓取 Bluesky 账号的最新内容
- 📷 **多媒体支持** - 支持文字、图片和视频内容展示
- 🎨 **瀑布流布局** - Pinterest 风格的卡片式布局
- ♾️ **无限滚动** - 滚动到底部自动加载更多内容
- 🏷️ **内容过滤** - 按类型（全部/仅图片/仅视频）和标签筛选
- 🗺️ **旅行足迹** - 交互式地图展示个人旅行足迹，支持自动获取坐标
- 📱 **移动端优化** - 响应式设计，完美适配手机屏幕
- 📲 **PWA 支持** - 可添加到手机主屏幕，支持离线缓存

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **数据请求**: TanStack Query
- **动画**: Framer Motion
- **地图**: Leaflet + OpenStreetMap
- **地理编码**: OpenStreetMap Nominatim API
- **PWA**: vite-plugin-pwa

## 🚀 本地开发

```bash
# 克隆项目
git clone <YOUR_GIT_URL>

# 进入目录
cd <YOUR_PROJECT_NAME>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🗺️ 旅行足迹功能

项目包含一个旅行足迹地图页面，展示个人去过的地点：

- **访问路径**: `/travel`
- **功能**:
  - 交互式地图标记
  - 按类别筛选（居住地/国内旅行/国际旅行）
  - 点击标记查看地点详情
  - 统计信息展示
  - **自动获取坐标** - 只需填写地点名称，经纬度自动获取

### 添加足迹数据（无需手动填写坐标！）

编辑 `src/data/travelData.ts` 文件中的 `rawTravelPlaces` 数组：

```typescript
export const rawTravelPlaces: RawTravelPlace[] = [
  {
    name: '东京',           // 地点名称（必填）
    country: '日本',       // 国家/地区（可选，帮助提高搜索准确度）
    firstVisitDate: '2019-04',  // 首次访问日期（可选）
    notes: '现代与传统交融的国际大都市',  // 备注（可选）
    category: 'international',  // 类别: 'home' | 'domestic' | 'international'
  },
  // ... 更多地点
];
```

**不需要填写 `lat` 和 `lng`！** 系统会自动通过地理编码 API 获取坐标。

### 预获取坐标（推荐）

为了在部署时更快加载，建议预先获取所有坐标：

```bash
# 运行坐标获取工具
npm run geocode
```

这个命令会：
1. 读取 `rawTravelPlaces` 中的所有地点
2. 调用 OpenStreetMap API 获取坐标
3. 自动更新 `coordinateCache` 缓存对象
4. 后续访问将直接使用缓存，无需等待

### 坐标获取方式

系统使用两级策略获取坐标：

1. **本地缓存优先** - 如果 `coordinateCache` 中有该地点的坐标，直接使用
2. **API 实时获取** - 缓存中没有时，调用 OpenStreetMap Nominatim API 获取

首次访问新地点时，页面会显示加载进度条，自动获取坐标。

## 📦 部署

在 [Lovable](https://lovable.dev) 中点击 Share → Publish 即可发布。

## 📄 许可

MIT License
