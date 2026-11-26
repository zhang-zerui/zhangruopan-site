# 张若磐作品集网站源码清单

- 核对日期为 2026 年 11 月 26 日，目录时间为北京时间。
- 源码目录为 `/Users/zerui/Documents/Codex/2026-11-19/new-chat-5/work/redesign`。
- 公开首页与本地源码的 World Mall 店面、四季切换、四个案例和互动演示入口一致。本地目录没有 Vercel 项目关联文件。公开页面核对以可读页面和素材为准。  
  [公开首页](https://www.zhangruopan.com/) · [秋景店面素材](https://www.zhangruopan.com/assets/store-fall.webp)

## 本地候选目录

| 路径 | 目录最后修改时间 | Git 仓库 | remote | `.vercel/project.json` | 判断 |
| --- | --- | --- | --- | --- | --- |
| `/Users/zerui/Documents/Codex/2026-11-19/new-chat-5/work/redesign` | 2026-11-23 20:04:35 | 否 | 无 | 无 | 完整网站。World Mall、四季切换、四张案例、宠物和简历齐备，演示入口与公开页面一致 |
| `/Users/zerui/Documents/Codex/2026-11-19/new-chat-5/work/publish/ready` | 2026-11-19 13:17:12 | 否 | 无 | 无 | 早期发布准备目录。有简历且首页没有 World Mall |
| `/Users/zerui/Documents/Codex/2026-11-19/new-chat-5/work/design-assets` | 2026-11-19 15:04:21 | 否 | 无 | 无 | 命中店面图和广告案例图，无网站入口 |
| `/Users/zerui/Documents/Codex/2026-11-19/new-chat-5/work/world-mall-art` | 2026-11-19 23:58:51 | 否 | 无 | 无 | 命中店面图，无网站入口 |

`/Users/zerui/Desktop/zhangruopan-cv.pdf` 是独立简历文件，文件修改时间为 2026-11-19 14:51:42。桌面目录未发现 Git 仓库、remote 或 `.vercel/project.json`。

## 技术栈与本地预览

网站入口是静态 HTML、CSS 和 JavaScript。主页面和案例用静态 HTML，`portfolio.js` 处理主题页面的切换和交互。聊天宠物由 `x-dc` 和本地 React 18.3.1 在浏览器内挂载。演示使用 React、TypeScript 和 JSX，编译产物 `demos/interactive.js` 已在源码目录，静态预览和部署可直接使用。Vercel 配置设置无 .html 后缀的 URL、尾斜杠和响应头。根目录没有 `package.json` 或构建命令。

从站点目录启动静态预览。

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

打开 [本地预览](http://127.0.0.1:4173/)。可直接访问 `/#demos` 查看架构与互动演示。仅当改动演示的 `.ts` 或 `.tsx` 时需要重新编译，演示脚本在 `demos/package.json:5–16`，输入与输出在 `demos/tsconfig.json:3–8`。

```sh
npm --prefix demos install --ignore-scripts
npm --prefix demos run build
```

## 文件目录树

以下 57 个原始文件按本地目录清点，另列本清单。排除了 `.git` 和 `node_modules`。

- `.github/` — GitHub 配置
  - `workflows/` — 工作流
    - `demo-checks.yml` — 检查演示类型、编译、单元和浏览器测试，打包静态预览
- `assets/` — 首屏、案例、陈列柜和本地字体
  - `fonts/` — 4 个运行时 WOFF、4 个对应的 TTF 和 OFL 许可
    - `CrimsonText-Italic.ttf`
    - `CrimsonText-Italic.woff`
    - `CrimsonText-Regular.ttf`
    - `CrimsonText-Regular.woff`
    - `CrimsonText-SemiBold.ttf`
    - `CrimsonText-SemiBold.woff`
    - `Inter.ttf`
    - `Inter.woff`
    - `OFL-CrimsonText.txt`
    - `OFL-Inter.txt`
  - `case-ads.webp`
  - `case-docs.webp`
  - `case-platform.webp`
  - `case-support.webp`
  - `shelf.webp`
  - `store-fall.webp`
  - `store-spring.webp`
  - `store-summer.webp`
  - `store-winter.webp`
- `demos/` — 可直接加载的互动演示和 TypeScript 源码
  - `data/` — 架构及演示数据
    - `architecture.ts` — 架构图节点、连接和中英文说明
    - `scenarios.ts` — 四组演示所用的固定样例数据
  - `.gitignore` — 忽略演示的 node_modules
  - `advertising.tsx` — 两期广告数据与库存决策演示
  - `app.tsx` — 演示首页、标签页和 React 挂载
  - `browser-check.mjs` — Playwright 浏览器验收
  - `check.cjs` — 演示逻辑的 Node 单元测试
  - `demos.css` — 互动演示样式
  - `documents.tsx` — 单据字段核对与模拟写入
  - `illustrations.js` — 物流原单和打印机装纸内联 SVG
  - `interactive.js` — TS/TSX 编译成的浏览器脚本，源码包已带产物
  - `loader.js` — 在演示入口按需加载代码和插图
  - `logic.ts` — 广告汇总、审批规则、箱号校验和字段映射
  - `package.json` — TypeScript、Playwright 和演示命令
  - `rules.tsx` — ERP 规则转译、试跑与模拟通知
  - `shared.tsx` — 通用布局、状态组件和架构图
  - `support.tsx` — 按步骤回放售后对话
  - `tsconfig.json` — ES2020、React JSX、输出 interactive.js
- `media/` — 站点图标、宠物素材和归档的流星首图
  - `agent-pet/` — 宠物素材
    - `actions/` — 七张动作图，运行时按动作名取图
      - `celebrate.png`
      - `drag.png`
      - `idle.png`
      - `sleep.png`
      - `talk.png`
      - `think.png`
      - `wave.png`
  - `favicon.svg` — 浏览器标签页图标
  - `meteor-impact-hero.jpg` — 8 月版首图，现版没有页面引用
- `vendor/` — 站内加载的 React 和 ReactDOM 18.3.1
  - `react-dom.production.min.js`
  - `react.production.min.js`
- `index.html` — 双语页面、案例、资源链接、内联 SVG、宠物模板与逻辑
- `portfolio.css` — 米色主题、布局、响应式样式和本地字体
- `portfolio.js` — 页面切换、四季店面、陈列柜热点、放大图、双语切换、视频加载与联络交互
- `README.md` — 旧版静态部署说明，首页当前的演示构建方式见下文
- `resources.js` — 把 React 的两个资源地址映射到本地 vendor
- `SITE_INVENTORY.md` — 本清单
- `support.js` — x-dc 模板解析、React 加载和挂载
- `vercel.json` — 静态 URL 和响应头
- `zhangruopan-cv.pdf` — 两页简历

## 图片、视频和 PDF

本地有 18 张独立图片和 1 份 PDF。页面引用其中 17 张图片和 1 份 PDF。引用含运行时加载、预加载、标签页图标及下载。

| 本地文件 | 字节数 | 页面引用 | 引用位置 |
| --- | --- | --- | --- |
| `assets/case-ads.webp` | 34,418 | 有 | 首页广告卡 · `index.html:46`。案例封面与放大图 · `index.html:62` |
| `assets/case-docs.webp` | 28,876 | 有 | 首页单据卡 · `index.html:54`。案例封面与放大图 · `index.html:66` |
| `assets/case-platform.webp` | 34,782 | 有 | 首页中台卡 · `index.html:58`。案例封面与放大图 · `index.html:68` |
| `assets/case-support.webp` | 33,500 | 有 | 首页客服卡 · `index.html:50`。案例封面与放大图 · `index.html:64` |
| `assets/shelf.webp` | 169,312 | 有 | 店内陈列柜 · `index.html:43` |
| `assets/store-fall.webp` | 574,982 | 有 | 首屏默认秋景及预加载 · `index.html:18`、`index.html:38`。季节切换 · `portfolio.js:148` |
| `assets/store-spring.webp` | 550,742 | 有 | 关于页配图 · `index.html:61`。季节切换 · `portfolio.js:148` |
| `assets/store-summer.webp` | 578,686 | 有 | 切到夏季时加载 · `portfolio.js:148` |
| `assets/store-winter.webp` | 491,608 | 有 | 切到冬季时加载 · `portfolio.js:148` |
| `media/agent-pet/actions/celebrate.png` | 294,837 | 有 | 宠物动作表与运行时图片 · `index.html:750–752`、`index.html:826–830` |
| `media/agent-pet/actions/drag.png` | 208,699 | 有 | 宠物动作表与运行时图片 · `index.html:750–752`、`index.html:826–830` |
| `media/agent-pet/actions/idle.png` | 246,967 | 有 | 宠物动作表与运行时图片 · `index.html:750–752`、`index.html:826–830`。最小化图 · `index.html:584` |
| `media/agent-pet/actions/sleep.png` | 384,552 | 有 | 宠物动作表与运行时图片 · `index.html:750–752`、`index.html:826–830` |
| `media/agent-pet/actions/talk.png` | 263,773 | 有 | 宠物动作表与运行时图片 · `index.html:750–752`、`index.html:826–830` |
| `media/agent-pet/actions/think.png` | 256,078 | 有 | 宠物动作表与运行时图片 · `index.html:750–752`、`index.html:826–830` |
| `media/agent-pet/actions/wave.png` | 273,151 | 有 | 宠物动作表与运行时图片 · `index.html:750–752`、`index.html:826–830` |
| `media/favicon.svg` | 250 | 有 | 标签页图标 · `index.html:17` |
| `media/meteor-impact-hero.jpg` | 267,307 | 无 | 现版无页面引用。8 月版 `index.html:549` 用于首屏 |
| `zhangruopan-cv.pdf` | 450,703 | 有 | 导航和关于页下载 · `index.html:28`、`index.html:61` |

`index.html:142`、`index.html:333` 的纹理用内联 SVG 数据，案例示意图和演示架构图也包括 DOM 中构造的 SVG。它们没有独立素材文件。`portfolio.css:1–4` 引用 4 个 WOFF，目录里的相应 TTF 是备用原件。

### 引用但缺失

| 文件 | 页面位置 | 影响与已核对来源 |
| --- | --- | --- |
| `Zhangruopan-AI-Homepage-Bookline-v2.mp4` | `index.html:61` · `#experience` 的“播放个人介绍视频”，由 `portfolio.js:282–286` 在展开时设置 `src` | 这个本地版本展开后找不到视频。`.github/workflows/demo-checks.yml:56` 也把它列入预览打包路径。GitHub `main` 有一个同名旧文件（4,164,291 字节）。当前公开站点所用视频的文件版本未核实。 |

## AI 宠物与聊天

| 内容 | 源码位置 |
| --- | --- |
| 宠物按钮、最小化、聊天面板 | `index.html:564–640`，为 `x-dc` 内的模板 |
| 宠物状态、动作图片、拖拽、面板及聊天逻辑 | `index.html:641–1751`，内联 `Component extends DCLogic` |
| 预设回答 | `index.html:1246–1346` 的 `agentReply(question)`，根据关键词返回中英文固定回答 |
| 点选提问、引用资料 | `index.html:1616–1622` 的 `suggestionTexts`，`index.html:1490–1530` 一带的案例导航及引用逻辑 |
| API 调用与回退 | `index.html:1348–1417` 的 `sendMessage` 对同源 `/api/chat` 发 `POST`，请求包含 `question` 和 `history`。成功时读取文本或流，失败或直接用 `file:` 打开时走 `agentReply` |

本地源码没有 `api/chat` 实现，也没有 API 重写代理的 Vercel 配置。公开部署的后台接口状态未从本地源码确认。预设的“操作演示”答复仍写着暂无公开交互 Demo，而首页已展示演示入口。对应 `index.html:1267–1271`、`index.html:45`。

## 模板变量核对

`index.html:564–634` 中静态源码有 65 处双花括号绑定。`support.js:372–382` 解析属性，`support.js:476–507` 解析文字，`support.js:1624–1628` 隐藏原始 `x-dc` 模板。`index.html:1552–1748` 提供值和事件，`msg`、`action`、`sug` 来自相应的循环。源码审查未发现正文中会作为原样文字展示的未绑定占位符。下面是仍保留在原始 HTML 里的所有绑定，同行重复只记一次。

| 位置 | 原始绑定 |
| --- | --- |
| `index.html:564` | `{{ toggleLocale }}` |
| `index.html:565` | `{{ petVisible }}`、`{{ false }}` |
| `index.html:566` | `{{ petLeft }}`、`{{ petTop }}`、`{{ petGlow }}` |
| `index.html:567` | `{{ bubbleVisible }}`、`{{ false }}` |
| `index.html:568` | `{{ tBubble }}` |
| `index.html:570` | `{{ onPetDown }}`、`{{ onPetActivate }}`、`{{ onPetKeyDown }}`、`{{ tOpenAgent }}`、`{{ petCursor }}` |
| `index.html:571` | `{{ petGlow }}` |
| `index.html:572` | `{{ shadowAnim }}` |
| `index.html:573` | `{{ petAnim }}` |
| `index.html:574` | `{{ false }}` |
| `index.html:575` | `{{ false }}` |
| `index.html:578` | `{{ minimizePet }}`、`{{ stopPress }}`、`{{ tMinimizeAgent }}` |
| `index.html:582` | `{{ petMinimized }}`、`{{ false }}` |
| `index.html:583` | `{{ restorePet }}`、`{{ tRestoreAgent }}` |
| `index.html:589` | `{{ chatOpen }}`、`{{ false }}` |
| `index.html:590` | `{{ chatPanelClass }}`、`{{ panelLeft }}`、`{{ panelTop }}` |
| `index.html:594` | `{{ tAgentKicker }}` |
| `index.html:595` | `{{ tAgentTitle }}` |
| `index.html:596` | `{{ tAgentSubtitle }}` |
| `index.html:598` | `{{ closeChat }}`、`{{ tCloseAgent }}` |
| `index.html:601` | `{{ chatLoading }}` |
| `index.html:602` | `{{ messages }}` |
| `index.html:603` | `{{ msg.justify }}` |
| `index.html:604` | `{{ msg.className }}` |
| `index.html:605` | `{{ msg.content }}` |
| `index.html:606` | `{{ msg.actionsVisible }}`、`{{ false }}` |
| `index.html:607` | `{{ msg.referencesLabel }}` |
| `index.html:608` | `{{ msg.actions }}` |
| `index.html:609` | `{{ action.onClick }}`、`{{ action.label }}` |
| `index.html:616` | `{{ chatLoading }}`、`{{ false }}` |
| `index.html:617` | `{{ tThinking }}` |
| `index.html:621` | `{{ showSuggestions }}`、`{{ true }}` |
| `index.html:623` | `{{ tStarters }}` |
| `index.html:625` | `{{ suggestions }}` |
| `index.html:626` | `{{ chatLoading }}`、`{{ sug.onClick }}`、`{{ sug.label }}` |
| `index.html:632` | `{{ onChatSubmit }}` |
| `index.html:633` | `{{ chatInput }}`、`{{ chatLoading }}`、`{{ onChatInput }}`、`{{ tChatInputAria }}`、`{{ tChatPlaceholder }}` |
| `index.html:634` | `{{ chatLoading }}`、`{{ tSendMessage }}` |

`index.html:752`、`index.html:830` 等位置的 `${...}` 表达式在 JavaScript 模板字符串内执行。`demos/illustrations.js:27`、`:73`、`:155` 的双花括号是 JSDoc 类型。`support.js:495`、`:500`、`:638` 的双花括号来自编辑器或错误信息。

## 页面数字指标

以下原文来自本地页面。在 `index.html:61` 等长行，行号后的数字是起始字符列号，`#` 后是页面入口。包含工作经历、案例表现、样本量、规模和交互图解里的数量。简历 PDF 是独立下载件。

### 页面文字

| 源码位置与页面 | 中文原文 | 英文原文 |
| --- | --- | --- |
| `index.html:45:54` · `#home` | 上两层是我的工作物件，下面四份便当里装着项目。选一份打开看看。 | The top shelves hold tools from my work. Pick a bento below to open a case study. |
| `index.html:47:230` · `#home` | 把两期投放回报和站点可售库存放在一起看，复盘准备从约 30 分钟缩短到 5 分钟内。 | Bringing ad returns and sellable stock into one review cut preparation from about 30 minutes to under five. |
| `index.html:51:224` · `#home` | 用机型追问、固定查询和人工接管处理海外售后，高频标准咨询的自动解决率达到 50%+。 | Model-specific troubleshooting, fixed lookups and human handoff resolved 50%+ of common standard inquiries automatically. |
| `index.html:55:223` · `#home` | 让录单员对照原件确认存疑字段。核心字段识别准确率达 90%+，方案应用到 3 家外部企业。 | Clerks verify uncertain fields against the original. Core field accuracy reached 90%+, and three external clients adopted the product. |
| `index.html:59:231` · `#home` | 把问答记录、知识修订和原问题复测连在一起，单条错答的定位与验证从天级缩短到小时级。 | Linking answer history, knowledge edits and retesting shortened failure diagnosis and verification from days to hours. |
| `index.html:61:5745` · `#experience` | 我在深圳做 AI 产品。过去五年，我从码头、堆场和仓储系统做起，随后专注企业知识问答、多模态单据和跨境电商 Agent。 | I build AI products in Shenzhen. I started with terminal, yard and warehouse software, then moved into enterprise knowledge Q&A, multimodal documents and agents for cross-border commerce. |
| `index.html:61:6078` · `#experience` | 5 年产品经验，3 年专注 AI。汕头大学。 | Five years in product, three focused on AI. Shantou University. |
| `index.html:61:6320` · `#experience` | 下载两页简历 | Download my two-page résumé |
| `index.html:61:7604` · `#experience` | 统一 TikTok Shop GMV Max 两期 ROI 的计算方式，按站点和 SKU 核验可售库存。另行梳理 Shopee 按站点复盘 ROAS 的需求。 | Standardized two-period ROI for TikTok Shop GMV Max and checked available stock by site and SKU. Defined site-level ROAS review requirements for Shopee. |
| `index.html:61:8249` · `#experience` | 运营复盘准备由约 30 分钟缩短至 5 分钟内，核心指标与报表核验一致率 98%+，日常复盘采纳率 70%+。 | Review preparation fell from about 30 minutes to within five. Core metrics matched reports in 98%+ of checks and adoption in daily reviews reached 70%+. |
| `index.html:61:8540` · `#experience` | 上线 13 类通知规则，配置周期从 1–2 天缩短至 10 分钟内，关键节点提醒准确触达率 99%+。线上错答定位与修复验证从天级缩短到小时级，内部 MCP 工具全部纳入用户级授权和分发审计。 | Shipped 13 notification rule types. Setup fell from 1–2 days to within ten minutes, with 99%+ accurate delivery at key steps. Answer diagnosis and fix verification fell from days to hours. All internal MCP tools came under per-user grants and distribution audits. |
| `index.html:61:9227` · `#experience` | 为东南亚 Shopee、Amazon 等海外渠道的 9 名客服交付打印机售后 Agent。 | Led the printer after-sales agent for a nine-person team serving Southeast Asian Shopee stores, Amazon and other overseas channels. |
| `index.html:61:10237` · `#experience` | 以 1,000+ 条真实历史工单评测。意图分流准确率从约 72% 提升至 90%+。高频标准咨询自动解决率 50%+，整体工单自动化闭环约 38%。 | Evaluated with 1,000+ real tickets. Intent routing rose from about 72% to 90%+. The agent resolved 50%+ of frequent standard inquiries and about 38% of all tickets end to end. |
| `index.html:61:10570` · `#experience` | 回复草稿采纳率 70%+，常规首次响应在 10 秒内，单客平均处理时长缩短约 25%。新机型放量期间，团队保持 9 人。 | Draft adoption reached 70%+, standard first responses took under ten seconds and average handling time fell about 25%. Staffing stayed at nine as new models scaled. |
| `index.html:61:11154` · `#experience` | 交付码头、堆场和仓储等供应链产品，2023 年 8 月转任 AI 产品经理，负责企业知识问答和多模态单据录入。 | Delivered logistics products for terminals, container yards and warehouses. Moved into AI product management in August 2023, leading enterprise Q&A and multimodal document intake. |
| `index.html:61:11908` · `#experience` | 基于约 1,000 页文档和 550 条历史咨询设计多租户 RAG，按客户、角色和软件版本过滤，依据不足时转人工。 | Designed multi-tenant RAG using about 1,000 pages and 550 historical inquiries. Retrieval was scoped by client, role and software version, with human escalation when evidence was insufficient. |
| `index.html:61:12241` · `#experience` | 使用 10 家客户的 150 份单据逐字段核对，20–30 个核心字段单字段准确率 90%+。每票录入复核由约 30 分钟降至约 13 分钟，商业化复用于 3 家外部企业。 | With 150 documents from ten clients, accuracy reached 90%+ per field across 20–30 core fields. Entry and review fell from about 30 to 13 minutes per shipment. Three external enterprise clients adopted the solution commercially. |
| `index.html:61:12638` · `#experience` | 复用货位、任务、巡检和权限设计，典型堆场项目的货物定位时间从约 30 分钟缩短到约 5 分钟。 | Reused location, task, inspection and permission designs. Time to locate goods in a representative yard fell from about 30 minutes to about five. |
| `index.html:61:15204` · `#methods` | 先汇总归因收入和花费，再算两期各自的 ROI。库存按站点和 SKU 核验可售量。数据未核准时暂停加预算建议，由运营核准后再判断。 | Aggregate attributed sales and spend before calculating each period’s ROI. Verify sellable units by site and SKU and hold the recommendation until the operator can check them. |
| `index.html:61:15732` · `#methods` | 客服四层错答归因表 | Four-layer support error analysis |
| `index.html:61:19318` · `#articles` | AI 用几小时攻破了国家机密系统，然后被关掉了 | — |
| `index.html:63:423` · `#project-ads` | 两期 ROI 已核对 | Period returns checked |
| `index.html:63:1555` · `#project-ads` | 把两期投放回报和站点可售库存放在一起看，复盘准备从约 30 分钟缩短到 5 分钟内。 | Bringing ad returns and sellable stock into one review cut preparation from about 30 minutes to under five. |
| `index.html:63:2338` · `#project-ads` | 先汇总归因收入和花费，再算两期各自的 ROI。库存按站点和 SKU 核验可售量。数据未核准时暂停加预算建议，由运营核准后再判断。 | Aggregate attributed sales and spend before calculating each period’s ROI. Verify sellable units by site and SKU and hold the recommendation until the operator can check them. |
| `index.html:63:3040` · `#project-ads` | 比较两期商品 GMV Max 回报 | Compare two periods of product GMV Max |
| `index.html:63:4507` · `#project-ads` | 结合两期回报和已核准的可售量，由运营决定是否加预算。 | The operator weighs period returns and verified stock before deciding whether to raise spend. |
| `index.html:63:5174` · `#project-ads` | 核心指标与底层报表核验一致率达 98%+，日常复盘采纳率 70%+。TikTok Shop 流程已上线，Shopee 部分完成了按站点复盘 ROAS 的口径梳理。 | Core metrics matched the source reports in 98%+ of checks, with 70%+ adoption in daily reviews. The TikTok Shop workflow shipped. The Shopee work defined site-level ROAS. |
| `index.html:65:289` · `#project-support` | 客服四层错答归因表 | Four-layer support error analysis |
| `index.html:65:1570` · `#project-support` | 用机型追问、固定查询和人工接管处理海外售后，高频标准咨询的自动解决率达到 50%+。 | Model-specific troubleshooting, fixed lookups and human handoff resolved 50%+ of common standard inquiries automatically. |
| `index.html:65:1966` · `#project-support` | 9 名客服处理跨境打印机的驱动、物流和退换货问题。不同机型的安装步骤不一样，退货和退款又需要人工判责。 | Nine agents handled driver installation, delivery and returns. Installation steps varied by printer, and refund decisions needed a human owner. |
| `index.html:65:2972` · `#project-support` | 同一句错答，排查四个环节 | Four places to look when an answer goes wrong |
| `index.html:65:5353` · `#project-support` | 评测使用 1,000+ 条真实历史工单。上表为重构示例。整体工单自动化闭环约 38%，分母包含需要人工处理的咨询。 | Evaluation used 1,000+ real historical tickets. The examples are reconstructed. End-to-end automation was about 38% across all tickets, including those requiring staff. |
| `index.html:65:5812` · `#project-support` | 用 1,000+ 条历史工单评测，意图分流准确率由约 72% 提升到 90%+。全部工单中约 38% 自动闭环，常规咨询首次响应缩短至 10 秒内。 | On an evaluation set of 1,000+ historical tickets, intent routing improved from about 72% to 90%+. About 38% of all tickets closed automatically, and routine first responses took under ten seconds. |
| `index.html:65:6560` · `#project-docs` | 一票物流单据，从录入到复核由 30 分钟降至 13 分钟。 | Cutting shipment entry and review from 30 minutes to 13. |
| `index.html:67:1585` · `#project-docs` | 让录单员对照原件确认存疑字段。核心字段识别准确率达 90%+，方案应用到 3 家外部企业。 | Clerks verify uncertain fields against the original. Core field accuracy reached 90%+, and three external clients adopted the product. |
| `index.html:67:1997` · `#project-docs` | 一票业务包含多份托书和提单，要核对 20–30 个字段。不同客户版式各异，盖章会遮住字符，提单号漏一个字母就会指向错误记录。 | A shipment involves multiple bookings and bills of lading with 20–30 key fields. Layouts and stamps vary, and one missing letter can change a bill number. |
| `index.html:67:4241` · `#project-docs` | 提单 · 第 1 页 | Bill of lading · page 1 |
| `index.html:67:6159` · `#project-docs` | 评测样本为 10 家客户的 150 份单据。图中字段名和编号用于说明复核流程，未使用客户原件或生产接口字段名。 | Evaluation used 150 documents from ten clients. Field names and the sample number illustrate the review process. No original customer document or production API field name is shown. |
| `index.html:67:6629` · `#project-docs` | 评测集覆盖 10 家客户的 150 份真实单据。单票录入及复核耗时下降约 57%，在 3 家外部客户完成商业化复用。 | The evaluation covered 150 real documents from ten clients. Entry and review time fell by about 57%, and the solution was commercially reused by three clients. |
| `index.html:69:1568` · `#project-platform` | 把问答记录、知识修订和原问题复测连在一起，单条错答的定位与验证从天级缩短到小时级。 | Linking answer history, knowledge edits and retesting shortened failure diagnosis and verification from days to hours. |
| `index.html:69:3627` · `#project-platform` | 单条错答的定位与修复验证从天级缩短到小时级，维护效率提升 50%+。内部 MCP 工具全部纳入用户级授权和分发审计。 | Verification fell from days to hours, improving maintenance efficiency by 50%+. All internal MCP tools are covered by per-user authorization and distribution audits. |
| `index.html:69:6568` · `#project-notifications` | 规则配置和调整由 1–2 天缩短至 10 分钟内，关键节点提醒准确触达率 99%+。 | Rule creation and changes fell from 1–2 days to within ten minutes. Accurate delivery at key steps reached 99%+. |
| `index.html:69:8855` · `#project-rag` | 约 1,000 页业务文档按三类元数据过滤。遇到依据不足的提问转人工。 | About 1,000 pages of documentation are filtered by three metadata attributes. Staff take over when evidence is insufficient. |

### 日期

| 源码位置与页面 | 原文 |
| --- | --- |
| `index.html:61:880` · `#all-work` | 2025.09 – 2026.10 ↗ |
| `index.html:61:1089` · `#all-work` | 2024.09 – 2025.08 ↗ |
| `index.html:61:1297` · `#all-work` | 2024.01 – 2024.08 ↗ |
| `index.html:61:1513` · `#all-work` | 2025.09 – 2026.10 ↗ |
| `index.html:61:1748` · `#all-work` | 2025.09 — 2026.10 ↗ |
| `index.html:61:1970` · `#all-work` | 2023.10 — 2024.03 ↗ |
| `index.html:61:6992` · `#experience` | 2025.09 — 2026.10 |
| `index.html:61:9016` · `#experience` | 2024.09 — 2025.08 |
| `index.html:61:10911` · `#experience` | 2021.08 — 2024.08 |
| `index.html:61:12947` · `#experience` | 2020.11 — 2021.05 |
| `index.html:61:18301` · `#articles` | 2026.07 · |
| `index.html:61:18612` · `#articles` | 2026.07 · |
| `index.html:61:18914` · `#articles` | 2026.06 · |
| `index.html:61:19212` · `#articles` | 2026.06 · |
| `index.html:61:19518` · `#articles` | 2026.06 · |
| `index.html:61:19822` · `#articles` | 2026.05 · |
| `index.html:61:20129` · `#articles` | 2026.05 · |
| `index.html:61:20437` · `#articles` | 2026.05 · |
| `index.html:61:20752` · `#articles` | 2026.05 · |
| `index.html:61:21066` · `#articles` | 2026.05 · |
| `index.html:61:21380` · `#articles` | 2026.04 · |
| `index.html:61:21696` · `#articles` | 2026.04 · |
| `index.html:63:1277` · `#project-ads` | 2025.09 – 2026.10 |
| `index.html:65:1292` · `#project-support` | 2024.09 – 2025.08 |
| `index.html:67:1307` · `#project-docs` | 2024.01 – 2024.08 |
| `index.html:69:1290` · `#project-platform` | 2025.09 – 2026.10 |
| `index.html:69:5062` · `#project-notifications` | 2025.09 — 2026.10 |
| `index.html:69:7775` · `#project-rag` | 2023.10 — 2024.03 |

`index.html:61:11154` 的经历正文含“2023 年 8 月转任 AI 产品经理”。页脚版权年份“2026”在 `index.html:71`。

### 案例图内文字

| 来源 | 图内原文 |
| --- | --- |
| `assets/case-ads.webp` · `index.html:46`、`:62` | “复盘准备时间 ≤5 分钟”“原人工核对约 30 分钟”“核心指标与报表一致率 98%+”。两期回报图标注“示例值”，上期 2.5，本期 3.0。 |
| `assets/case-support.webp` · `index.html:50`、`:64` | “四层错因归因”。`9:41` 为示意手机时钟，`DEMO-P01` 为示例机型。 |
| `assets/case-docs.webp` · `index.html:54`、`:66` | “1 个字段待确认”“1 / 1”“提单 · 第 1 页”。 |
| `assets/case-platform.webp` · `index.html:58`、`:68` | 图中 1、2、3 是“回看原回答”“修订知识”“原问题复测”的步骤序号。 |

### 宠物预设中的数字

| 源码位置 | 问答入口 | 中文原文 |
| --- | --- | --- |
| `index.html:1250` | 广告与库存 | TikTok Shop 商品 GMV Max 按两期分别汇总归因收入和花费，再计算 ROI。准备给出加预算建议前，按站点和 SKU 核对可售库存。数据未核准就暂缓建议。复盘准备从约 30 分钟缩短至 5 分钟内。Shopee 的范围是按站点复盘 ROAS 的需求梳理。 |
| `index.html:1253` | 通知中心 | 上线 13 类通知规则，配置周期从 1–2 天缩短至 10 分钟内，关键节点提醒准确触达率 99%+。线上错答定位与修复验证从天级缩短到小时级，内部 MCP 工具全部纳入用户级授权和分发审计。 |
| `index.html:1259` | 打印机售后 | 长沙佳标的 9 名客服服务 Shopee、Amazon 等渠道。1,000+ 条历史工单用于评测，意图分流准确率从约 72% 提升到 90%+。高频标准咨询自动解决率 50%+，全部工单自动化闭环约 38%。复杂退换货和查单失败由客服接手。 |
| `index.html:1275` | 文章列表 | 文章（知乎 @空熵 / 公众号）：<br>· 为什么我更建议优先选择便宜 AI，而不是默认使用最强模型？<br>· 我们越依赖的 AI 工具，越有可能被控制<br>· 小微入局，微信生态任务调度新变革<br>· AI 用几小时攻破了国家机密系统，然后被关掉了<br>· 你以为 AI 在帮你思考，但你正在丧失思考的能力<br>· 你不是懂了，你只是看过<br>…共 12 篇，详见「AI 思考」栏目，点击标题可直达原文。 |
| `index.html:1280` | 一分钟了解他 | 张若磐有 5 年产品经验，3 年专注 AI。跨境运营的投放与库存复盘准备从约 30 分钟减至 5 分钟内。打印机客服的高频标准咨询自动解决率达 50%+。物流单据每票录入和复核从约 30 分钟降到约 13 分钟，方案商用复用于 3 家外部企业。 |
| `index.html:1284` | 面试理由 | 从打印机售后客服与多模态单据项目看，他值得面试的原因是：<br>· 能判断 AI Eligible 边界，并在自动处理、Copilot 与强制转人工之间设计可控流程<br>· 用真实样本、任务成功率、自动化率、P95 延迟与调用成本驱动迭代<br>· 有从 OCR 切换至端到端多模态的真实路线决策记录，并将方案复用至 3 家企业客户 |
| `index.html:1290` | 成功案例 | 在佳标，他为 9 名打印机售后客服搭建 Dify 工作流。装驱动按机型查手册，物流进度查订单，需要判断的退换货转人工。他比较了 SQL 与 HTTP 接口，用 1,000+ 条真实工单检查分流、知识检索、回答和工具调用。 |
| `index.html:1301` | 多模态单据 | 维特项目对 10 家客户的 150 份单据逐字段核对，20–30 个核心字段的单字段准确率达到 90%+。存疑字段先核原文，再经 API 写入。每票录入复核从约 30 分钟降到约 13 分钟，商业化复用于 3 家外部企业客户。 |
| `index.html:1304` | 项目索引 | 首页有三份脱敏设计：广告加预算前的库存核验、售后错答的四类归因、物流单据的字段复核与 OCR 选型。另收录 ERP 通知、AI 中台与 MCP 权限、多租户 RAG。 |
| `index.html:1308` | 优势 | 结合跨境电商与物流供应链项目来看，他的突出优势有三点：判断 AI 场景与技术路线、用真实评测集和分层 Bad Case 归因控制质量，以及把权限、版本、人工兜底、工具调用、UAT 和灰度上线纳入企业交付。代表方案已复用至 3 家外部客户，并沉淀为可复用的 Schema、风险策略与 Workflow。 |
| `index.html:1314` | Agent | 结合他负责的「跨境电商 AI 客服与售后 Agent」来看，他会先定义 AI Eligible 边界，把场景分为自动处理、Copilot 辅助和强制转人工；再串联意图识别、问题分类、知识检索、回答生成与工具调用，并用 Schema、风险分级、人工兜底和 1,000+ 条真实工单评测集持续迭代。 |
| `index.html:1320` | RAG | 结合他负责的「企业智能服务平台 — 可信知识问答」来看，他并不把 RAG 只当作“检索＋生成”：项目基于约 1,000 页业务文档及 550 条历史咨询，定义 Chunk / Metadata、客户 / 角色 / 产品版本三级权限、知识更新和证据不足转人工机制，并按 Retrieval / Ranking / Generation / Knowledge 分层定位 Bad Case。首期标准问题自动解决率约 60%，重复咨询量下降约 50%。 |
| `index.html:1617` | 预设提问 | 一分钟了解他 |

宠物的职业履历预设复用上述四段经历日期，位置为 `index.html:1263–1264`。`index.html:1566–1593` 中还留有旧版指标、履历、案例和文章数组。现版主页面直接使用 HTML，这些数组未绑定到现版宠物模板的显示区域。

### 互动演示的数值

广告演示比较 `2026-04-06 – 04-12、2026-04-13 – 04-19`。金额单位 THB。各单元格按“花费 / 收入 / ROI 或 ROAS”排列，两条明细各按“上期花费 / 收入 → 本期花费 / 收入”排列。库存列的两组数字来自“在库 / 可售”和“日均销量 / 预计可售”。数据在 `demos/data/scenarios.ts:5–14`，展示在 `demos/advertising.tsx:15–25`，计算在 `demos/logic.ts:3–12`。

| 场景 | 渠道口径 | 上期 | 本期 | 两条底层明细 | 库存与销量 | 回刷区间 |
| --- | --- | --- | --- | --- | --- | --- |
| A | TikTok ROI | 1,500 / 4,200 / 2.80 | 2,000 / 8,000 / 4.00 | 1,000 / 2,800 → 1,200 / 4,200；500 / 1,400 → 800 / 3,800 | 700 / 560；20 / 28 天 | — |
| A | Shopee ROAS | 1,500 / 3,900 / 2.60 | 1,800 / 6,300 / 3.50 | 900 / 2,400 → 1,100 / 3,400；600 / 1,500 → 700 / 2,900 | 700 / 560；20 / 28 天 | — |
| B | TikTok ROI | 1,500 / 4,050 / 2.70 | 2,000 / 6,400 / 3.20 | 1,000 / 2,500 → 1,200 / 3,600；500 / 1,550 → 800 / 2,800 | 390 / 360；18 / 20 天 | 3.14–3.26 |
| B | Shopee ROAS | 1,200 / 3,000 / 2.50 | 1,550 / 4,780 / 3.08 | 700 / 1,750 → 900 / 2,700；500 / 1,250 → 650 / 2,080 | 390 / 360；18 / 20 天 | 3.02–3.15 |
| C | TikTok ROI | 1,500 / 5,400 / 3.60 | 2,000 / 10,400 / 5.20 | 1,000 / 3,400 → 1,200 / 6,000；500 / 2,000 → 800 / 4,400 | 840 / 未核准；30 / — | — |
| C | Shopee ROAS | 1,350 / 4,575 / 3.39 | 1,700 / 8,710 / 5.12 | 850 / 2,975 → 1,000 / 5,000；500 / 1,600 → 700 / 3,710 | 840 / 未核准；30 / — | — |

广告演示原文包含“T+1 回刷中 · 保守观察”“演示假设：本期归因收入可能回刷 ±2%，花费不变。”库存门槛 `days < 7` 参与决策，位置 `demos/logic.ts:10`。

| 演示与位置 | 页面原文或可显示的数值 |
| --- | --- |
| `#demo-rules` · `demos/data/scenarios.ts:17`、`:24–33`，`demos/rules.tsx:28–55`，`demos/logic.ts:19–42` | “东南亚新品审批超 24 小时未审提醒对应负责人并带单号直达”“本地转译器支持上面两种句式。审批等待时长可改为 1–720 小时。”“预期有单但 0 命中”“0 命中 · 静默告警”。阈值为严格大于，默认命中等待 49、31、25 h 的三张审批单，24 h 未命中。物流尾款超期 `> 0`，从库命中 36、18、6 h，发前主库复核跳过 1 条已全额付款单据，正常回执 2/2。可在原单查看命中单据耗时，回执、跳过和反馈随操作更新。 |
| `#demo-support` · `demos/data/architecture.ts:59`，`demos/data/scenarios.ts:42–59`，`demos/illustrations.js:158–165` | “同店同会话碎片等候 5–8 秒静默后合并。”“接收碎片 1/3”“接收碎片 2/3”“接收碎片 3/3”“静默 6 秒，3 条碎片合并为 1 次处理。”“识图分数 0.42，低于演示阈值 0.80。”“第一轮”“第二轮”“机器坏了快退钱否则给 1 星”“按一次走纸键”。聊天回放时间列在场景数组中，从 00:00 到 00:20。 |
| `#demo-documents` · `demos/data/scenarios.ts:63–72`，`demos/documents.tsx:23–35`，`demos/logic.ts:63–82` | “总件数”160，“明细 A 毛重（kg）”4,800，“明细 B 毛重（kg）”3,200，“总毛重（kg）”原文 8,000、初始候选 8800。初始“冲突 2 · 待人工复核 2”，修正全部冲突和复核项后两项为 0。逐项读数、校验和写入预览都来自演示数据与表单输入。 |

## 与 GitHub main 的差异

对照 `zhang-zeruix/zhangruopan-site` 的 `main` 提交 `a0a6e8e7b00e93aa0557fcdb24820e7fec9a17b9`，提交时间 2026-08-29 14:53:44（北京时间）。比较了所有文件的 Git blob 哈希。本地有 57 个原始文件，旧版有 17 个。同内容 15 个，改写 1 个，新增 41 个，旧分支独有 1 个。  
[对照提交](https://github.com/zhang-zeruix/zhangruopan-site/commit/a0a6e8e7b00e93aa0557fcdb24820e7fec9a17b9)

| 项目 | 8 月 `main` | 本地线上版本源码 |
| --- | --- | --- |
| 首页和导航 | `index.html` 用深色 `x-dc` 页面和流星首图 | `index.html` 改为米色 World Mall 页面。四季素材、陈列柜、案例卡片由静态页面、`portfolio.css` 和 `portfolio.js` 实现 |
| 案例与演示 | 旧模板内的履历与项目展示 | 四个首页卡片、全部作品索引、六篇项目详情、互动演示与独立简历 PDF。新增 `assets/`、`demos/` 和演示检查工作流 |
| 聊天宠物 | `x-dc`、React、本地动作素材、预设回复和 API 请求 | 动作图及运行时的文件哈希相同。`x-dc` 继续供宠物使用，米色页面和宠物的语言、导航有桥接 |
| 视频与部署 | 有 `Zhangruopan-AI-Homepage-Bookline-v2.mp4` | 同名视频仍被引用，本地缺失。`vercel.json` 和 `README.md` 与旧版的文件哈希相同 |

## 安全检查与快照范围

57 个源码文件与本清单均做了本地检查。未发现环境文件、私钥、硬编码 API Key、令牌或密码。最大文件是 `assets/fonts/Inter.ttf`，876,576 字节，低于 20 MB。

快照包含原始目录的 57 个文件和本清单。快照的 `vercel.json` 增加 `git.deploymentEnabled.live-snapshot = false`，只对该分支跳过 Vercel 自动部署。上面的 `main` 差异统计以加入该设置之前的本地原始目录为准。  
[Vercel 分支部署设置](https://vercel.com/docs/project-configuration/git-configuration#gitdeploymentenabled)
