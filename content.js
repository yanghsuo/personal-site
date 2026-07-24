// ============================================================
//  个人网站内容配置（深空版）
//  快速编辑：访问 网址#admin ，默认密码 admin123（可在编辑面板修改）
//  编辑完成后点「导出 content.js」，用下载的文件替换仓库里的本文件并 push 即发布
// ============================================================

const SITE = {

  version: 1,
  editPassword: "admin123",

  hero: {
    badge: "NETWORK ENGINEER · 14 YEARS",
    title: "构建<em>稳定可靠</em>的<br>大规模网络基础设施",
    sub: "我是杨硕，一名深耕数据中心网络 14 年的工程师。专注 BGP 路由架构、高性能无损网络（InfiniBand / RoCE）与 Python 网络自动化，让复杂网络变得简单、可控、可演进。"
  },

  about: {
    lead: "从机房里的第一根网线，到横跨多个数据中心的路由体系——14 年来我一直在做同一件事：让网络成为业务最不需要担心的部分。日常与 BGP、OSPF、VXLAN 打交道，也热衷用 Python 把重复的运维工作自动化掉。"
  },

  stats: [
    { num: "14",    unit: "年", label: "网络工程经验" },
    { num: "50",    unit: "+",  label: "数据中心网络项目" },
    { num: "99.99", unit: "%",  label: "核心网络可用性" }
  ],

  skills: ["Python", "BGP 路由", "OSPF", "VXLAN / EVPN", "InfiniBand", "RoCE 无损网络", "WiFi 无线网络", "网络自动化"],

  timeline: [
    {
      date: "2018 — 至今",
      role: "高级网络工程师 · 数据中心网络",
      desc: "负责大规模数据中心 Spine-Leaf 组网设计与 BGP 路由体系演进，主导 AI 集群 InfiniBand / RoCE 无损网络建设，构建基于 Python 的自动化巡检与变更平台。"
    },
    {
      date: "2014 — 2018",
      role: "网络工程师 · 企业网与园区网",
      desc: "负责园区网络架构规划与运维，完成多园区 OSPF/BGP 混合路由改造与无线网络全覆盖项目，将故障平均恢复时间缩短 60%。"
    },
    {
      date: "2012 — 2014",
      role: "初级网络工程师",
      desc: "从交换机配置与故障排查做起，打下扎实的网络协议功底，考取多项网络专业认证。"
    }
  ],

  articles: [
    { date: "2026-07-23", title: "如何搭建个人网站",            tags: ["教程", "Web"],       url: "#",
      body: "这篇文章记录我用 GitHub Pages 从零搭建这个个人站点的完整过程。整套方案不依赖任何框架与构建工具，纯原生 HTML/CSS/JS，内容集中在一个配置文件里——改文章、改技能、改联系方式都不必动页面结构。先上线，再慢慢迭代。

## 一、定方案：纯静态站就够

个人站不需要后端。我用最朴素的静态站：原生 HTML 加 CSS 加少量 JavaScript，托管在 GitHub Pages 上。它免费、自动上 HTTPS、支持自定义域名，提交即发布，对个人博客和作品集刚刚好。

## 二、项目结构：数据驱动

所有内容都收敛到一个 `content.js`，里面是一个全局对象 `SITE`，统一管理文章、技能、时间线、联系方式等。页面只负责「怎么展示」，内容只负责「展示什么」，两层解耦。一个典型的 `SITE` 包含 `hero`、`about`、`skills`、`timeline`、`articles`、`contact` 等字段；其中 `articles` 是一个数组，每篇文章含 `date`、`title`、`tags`、`url`、`body` 五个字段。

## 三、渲染引擎：用 data 属性配置页面

一个 `admin.js` 里的 `hydrate()` 函数扫描页面，根据元素上的 `data-*` 属性把 `SITE` 的数据渲染出来。常用的几个开关：

- `data-limit="3"`：只渲染前 N 条，首页用它显示「最近 3 篇」
- `data-excerpt`：正文只显示约 80 字摘要，首页用它
- `data-show-body`：渲染完整正文，文章子页用它
- `data-tags`：按标签筛选

## 四、文章系统：首页看最近 3 篇，子页看全部

首页 `index.html` 的文章区挂 `data-limit="3" data-excerpt`，自动只显示最新的三篇，并给出「查看全部」入口；文章子页 `articles.html` 挂 `data-show-body`，列出全部文章并直接渲染正文，顶部还有一个标签筛选目录，点标签即可只看某类文章。正文支持轻量 Markdown：`#` 标题、`**粗体**`、`*斜体*`、行内 `代码`、以及 `-` 列表。

## 五、内容管理：从内联编辑到独立后台

早期我在页面上挂了一个 `#admin` 内联编辑模式，改完点「导出 content.js」下载替换即可。后来把它抽成了独立的后台页面 `admin.html`：左侧是文章列表（可编辑、可删除），右侧是编辑器（标题、日期、标签、正文 Markdown 加实时预览），底部填 GitHub Token 即可「一键发布」。Token 只存在浏览器本地，不会上传到任何地方。

## 六、发布上线：GitHub Pages 加一键推送

仓库的 `main` 分支根目录就是 GitHub Pages 的发布源。发布内容本质就是更新 `content.js` 这一个文件：可以 `gh` 登录后通过 API 推送，也可以在后台填 Token 一键发布，通常 1 到 2 分钟生效。

## 七、踩过的坑与小结

- 浏览器缓存：改完看不到变化，先硬刷新（Ctrl 或 Cmd 加 Shift 加 R），或给地址加 `?v=1` 参数。
- 已存在的文件用 API 更新时必须带上它的 `sha`，否则会报冲突错误。
- 文章目前用 `url: "#"`，没有独立详情页；子页采用「列表加正文」一体式，简单够用。

最小可行、先上线、再迭代——这是做个人站最舒服的节奏。下一步我打算把正文支持得更完整的 Markdown，并给每篇文章加上独立详情页。" },
    { date: "2026-06-10", title: "BGP 路由优化实战笔记",        tags: ["路由", "运维"],      url: "#",
      body: "分享一次大规模数据中心 BGP 邻居收敛与路由策略优化的实战经验：如何通过路由映射（route-map）控制 inbound/outbound 选路、如何缩短收敛时间，以及排障时常用的命令与思路。\n\n（在此撰写正文。）" },
    { date: "2026-05-02", title: "用 Python 自动化日常网络运维", tags: ["Python", "自动化"],  url: "#",
      body: "用 Netmiko / NAPALM 把重复的巡检与变更脚本化，把运维从手工走向自动化：批量采集设备状态、差异比对、自动生成变更脚本，让日常运维更稳更快。\n\n（在此撰写正文。）" }
  ],

  contact: {
    statement: "一起构建更可靠的网络。",
    body: "如果您的团队正在规划数据中心网络、优化 BGP 路由，或用自动化提升运维效率，欢迎随时交流。",
    email: "823829415@qq.com",
    github: "github.com/yanghsuo"
  },

  footer: {
    copyright: "Copyright 2026 杨硕 (Yang Shuo) · Built with Deep Space Design System"
  }

};
