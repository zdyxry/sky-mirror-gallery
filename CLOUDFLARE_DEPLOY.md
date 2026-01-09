# 部署到 Cloudflare Pages 指南

本项目是一个纯静态前端应用，最适合部署到 Cloudflare Pages。

## 方案选择

- ✅ **推荐：Cloudflare Pages** - 专为静态网站和 SPA 设计
- ❌ 不推荐：Cloudflare Workers - 需要额外配置，且不如 Pages 适合静态网站

## 部署步骤

### 方法 1：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 进入 `Pages` 选项卡

2. **连接 Git 仓库**
   - 点击 `Create a project`
   - 选择 `Connect to Git`
   - 授权 GitHub/GitLab
   - 选择此仓库

3. **配置构建设置**
   ```
   Framework preset: None (或选择 Vite)
   Build command: npm run build
   Build output directory: dist
   Node.js version: 18 或更高
   ```

4. **环境变量**（如需要）
   - 目前项目直接使用 Bluesky 公共 API，无需环境变量

5. **部署**
   - 点击 `Save and Deploy`
   - 等待构建完成
   - 获得 `*.pages.dev` 域名

### 方法 2：通过 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   # 或
   bun add -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   npm run build
   # 或
   bun run build
   ```

4. **部署到 Pages**
   ```bash
   wrangler pages deploy dist --project-name=sky-mirror-gallery
   ```

## 项目配置说明

### 1. SPA 路由支持
已创建 `_redirects` 文件，确保所有路由都指向 `index.html`：
```
/*    /index.html   200
```

### 2. 安全头和缓存
已创建 `public/_headers` 文件，配置：
- 安全响应头（XSS 保护、内容类型保护等）
- 静态资源缓存策略

### 3. PWA 支持
项目已配置 PWA，部署后用户可以将应用添加到主屏幕。

## 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中
2. 点击 `Custom domains`
3. 添加你的域名
4. 按照指引配置 DNS（如果域名也在 Cloudflare，会自动配置）

## 自动部署

- **主分支推送** → 自动部署到生产环境
- **其他分支推送** → 自动部署到预览环境

## 注意事项

1. **API 限制**
   - 项目使用 Bluesky 公共 API
   - 如遇到速率限制，可考虑添加服务端缓存（需要使用 Cloudflare Workers）

2. **性能优化**
   - Cloudflare Pages 自动提供全球 CDN
   - 已配置资源缓存策略
   - PWA 支持离线访问

3. **成本**
   - Cloudflare Pages 免费套餐：
     - 500 次构建/月
     - 无限请求
     - 无限带宽

## 本地测试生产构建

```bash
# 构建
npm run build

# 预览
npm run preview

# 或使用 Wrangler 本地预览
wrangler pages dev dist
```

## 故障排查

### 路由 404 错误
- 确认 `_redirects` 文件在项目根目录
- 检查 Cloudflare Pages 构建日志

### 构建失败

#### Bun lockfile 版本不兼容
如遇到 `Outdated lockfile version` 错误：
```
Outdated lockfile version: failed to parse lockfile: 'bun.lockb'
error: lockfile had changes, but lockfile is frozen
```

**解决方案：**
1. **删除 bun.lockb**（推荐）- 让 Cloudflare 使用 npm
   ```bash
   rm bun.lockb
   git add . && git commit -m "Remove bun.lockb for Cloudflare Pages compatibility"
   ```

2. **或者在 Cloudflare Pages 设置中强制使用 npm：**
   - 环境变量：`NPM_FLAGS` = `--legacy-peer-deps`（如需要）
   - 或在项目根目录添加 `.nvmrc` 指定 Node 版本

3. **或者更新本地 bun.lockb：**
   ```bash
   bun install
   git add bun.lockb && git commit -m "Update bun.lockb"
   ```

#### 其他构建问题
- 检查 Node.js 版本（需要 18+）
- 确认所有依赖已正确安装
- 查看构建日志中的错误信息

## 进阶：使用 Cloudflare Workers（如需服务端功能）

如果将来需要添加服务端功能（如 API 代理、认证等），可以：

1. 创建 `functions/` 目录
2. 添加 Cloudflare Pages Functions
3. 详见：https://developers.cloudflare.com/pages/functions/

---

**开始部署：**

```bash
# 快速部署命令
npm run build && wrangler pages deploy dist --project-name=sky-mirror-gallery
```
