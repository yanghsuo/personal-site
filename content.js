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
      body: "这篇文章记录我用 GitHub Pages 从零搭建这个个人站点的完整过程。整套方案不依赖任何框架与构建工具，纯原生 HTML/CSS/JS，内容集中在一个配置文件里——改文章、改技能、改联系方式都不必动页面结构。先上线，再慢慢迭代。\n\n## 一、定方案：纯静态站就够\n\n个人站不需要后端。我用最朴素的静态站：原生 HTML 加 CSS 加少量 JavaScript，托管在 GitHub Pages 上。它免费、自动上 HTTPS、支持自定义域名，提交即发布，对个人博客和作品集刚刚好。\n\n## 二、项目结构：数据驱动\n\n所有内容都收敛到一个 `content.js`，里面是一个全局对象 `SITE`，统一管理文章、技能、时间线、联系方式等。页面只负责「怎么展示」，内容只负责「展示什么」，两层解耦。一个典型的 `SITE` 包含 `hero`、`about`、`skills`、`timeline`、`articles`、`contact` 等字段；其中 `articles` 是一个数组，每篇文章含 `date`、`title`、`tags`、`url`、`body` 五个字段。\n\n## 三、渲染引擎：用 data 属性配置页面\n\n一个 `admin.js` 里的 `hydrate()` 函数扫描页面，根据元素上的 `data-*` 属性把 `SITE` 的数据渲染出来。常用的几个开关：\n\n- `data-limit=\"3\"`：只渲染前 N 条，首页用它显示「最近 3 篇」\n- `data-excerpt`：正文只显示约 80 字摘要，首页用它\n- `data-show-body`：渲染完整正文，文章子页用它\n- `data-tags`：按标签筛选\n\n## 四、文章系统：首页看最近 3 篇，子页看全部\n\n首页 `index.html` 的文章区挂 `data-limit=\"3\" data-excerpt`，自动只显示最新的三篇，并给出「查看全部」入口；文章子页 `articles.html` 挂 `data-show-body`，列出全部文章并直接渲染正文，顶部还有一个标签筛选目录，点标签即可只看某类文章。正文支持轻量 Markdown：`#` 标题、`**粗体**`、`*斜体*`、行内 `代码`、以及 `-` 列表。\n\n## 五、内容管理：从内联编辑到独立后台\n\n早期我在页面上挂了一个 `#admin` 内联编辑模式，改完点「导出 content.js」下载替换即可。后来把它抽成了独立的后台页面 `admin.html`：左侧是文章列表（可编辑、可删除），右侧是编辑器（标题、日期、标签、正文 Markdown 加实时预览），底部填 GitHub Token 即可「一键发布」。Token 只存在浏览器本地，不会上传到任何地方。\n\n## 六、发布上线：GitHub Pages 加一键推送\n\n仓库的 `main` 分支根目录就是 GitHub Pages 的发布源。发布内容本质就是更新 `content.js` 这一个文件：可以 `gh` 登录后通过 API 推送，也可以在后台填 Token 一键发布，通常 1 到 2 分钟生效。\n\n## 七、踩过的坑与小结\n\n- 浏览器缓存：改完看不到变化，先硬刷新（Ctrl 或 Cmd 加 Shift 加 R），或给地址加 `?v=1` 参数。\n- 已存在的文件用 API 更新时必须带上它的 `sha`，否则会报冲突错误。\n- 每篇文章都有独立详情页（`article.html?d=日期`）：首页与子页都链接到详情页，子页改为带标签筛选的文章目录。\n\n最小可行、先上线、再迭代——这是做个人站最舒服的节奏。下一步我打算把正文支持得更完整的 Markdown（如代码块、引用、链接等）。\n" },
    { date: "2026-06-10", title: "BGP 路由优化实战笔记",        tags: ["路由", "运维"],      url: "#",
      body: "这篇文章复盘一次大规模数据中心 BGP 邻居收敛与路由策略优化的实战：从现象到根因，再到用 route-map 控制选路、缩短收敛时间，并整理一份可复用的排障命令清单。\n\n## 一、背景：为什么要动 BGP\n\n我们的 Spine-Leaf fabric 采用 eBGP 同时作为 Underlay 与 Overlay 的控制协议。随着集群规模扩大到上百台交换机，一次核心链路抖动后，部分前缀的收敛时间长达数十秒，业务侧出现了明显的吞吐抖动。根因有两个：默认的 BGP 计时器偏保守，以及缺乏明确的 inbound / outbound 选路策略，导致等价路径间的流量分布不均。\n\n## 二、用 route-map 控制选路\n\nBGP 本身不擅长「按意图选路」，需要靠 route-map 在 neighbor 的 inbound 与 outbound 方向施加策略：\n\n- `set local-preference`：影响本 AS 内的出站方向，值越大越优先。\n- `set as-path prepend`：在出方向叠加 AS 号，影响对端 inbound 选路，常用于让流量「绕行」某条链路。\n- `match` 条件：用 `prefix-list` 或 `community` 精确命中目标路由，避免误伤其它前缀。\n\n一个常见模式是把「低时延链路」标记上特定 community，再用 route-map 对它提升 local-preference，让南北向流量优先走这条链路。\n\n## 三、缩短收敛时间\n\n默认 BGP 计时器（Keepalive 60s / Hold 180s）在大集群里太慢。我们做了两件事：\n\n1. 把 `timers bgp` 调小到 10 / 30，并在直连邻居上开启 BFD，链路故障可在亚秒级被感知。\n2. 开启 `nexthop tracking` 与 `bgp additional-paths`，让等价多路径能够快速切换。\n\n注意：计时器调小会增加控制面消息频率，改动前务必确认 CPU 与带宽余量。\n\n## 四、排障常用命令\n\n- `show ip bgp summary`：先看邻居状态是否 Established、收发的 prefix 数是否异常。\n- `show ip bgp neighbors <ip> advertised-routes`：确认本端实际发出去的前缀。\n- `show ip bgp <prefix>`：查看某条前缀的 best path 及其选路属性。\n- `show ip bgp neighbors <ip> routes`：查看对端发来的前缀，验证 inbound 策略是否生效。\n\n把这几条串成 Checklist，故障定位时间从小时级降到了分钟级。\n\n## 五、小结\n\nBGP 优化不是「调一个参数」，而是「策略 + 计时器 + 可观测」三件事一起做：用 route-map 把选路意图写清楚，用 BFD 和 additional-paths 把收敛压到亚秒，用一套命令清单把排障标准化。任何改动前都要在灰度环境验证，并准备好可回滚的 route-map。\n" },
    { date: "2026-05-02", title: "用 Python 自动化日常网络运维", tags: ["Python", "自动化"],  url: "#",
      body: "这篇讲我怎么把日常网络运维从「手工 SSH 敲命令」搬到「Python 脚本化」：用 Netmiko / NAPALM 做批量巡检、差异比对和变更生成，让重复劳动既稳又快。\n\n## 一、为什么要把运维自动化\n\n网络变更最怕两件事：一是人工在几十台设备上重复敲命令，容易漏、容易错；二是巡检结果靠肉眼比对，问题往往第二天才被发现。自动化的目标不是「取代人」，而是把人从重复劳动里解放出来，只做判断和决策。\n\n## 二、工具选型：Netmiko 与 NAPALM\n\n- `Netmiko`：基于 Paramiko 封装的多厂商 SSH 库，一行 `connect` 就能连上 Cisco / Juniper / 华为等设备，适合发命令、收回显。\n- `NAPALM`：在 Netmiko 之上提供统一 API，能把 `show` 命令的输出整理成结构化数据（JSON），还能做配置差异比对与原子化替换。\n\n经验法则：只想批量执行命令用 Netmiko；要做配置比对和回滚，上 NAPALM。\n\n## 三、批量巡检脚本长什么样\n\n核心是把「设备清单 + 要执行的命令」做成数据驱动：\n\n1. 从 CSV / YAML 读设备列表（主机、平台、账号）。\n2. 用线程池并发连接，每台设备执行 `show version`、`show ip bgp summary` 等。\n3. 把结果落库或导出成表格，异常项标红。\n\n并发连接要加超时与重试，单台设备卡死不能拖垮整体。\n\n## 四、差异比对与变更生成\n\n真正省时间的是「变更前 / 后比对」：\n\n- 变更前用 NAPALM `get_config` 抓一份基线。\n- 脚本根据模板生成变更配置（比如批量改 `description`、加 `prefix-list`）。\n- 变更后再抓一次，自动 diff，确认「只动了该动的地方」。\n\n把 diff 结果作为变更工单的附件，复盘和审计都省心。\n\n## 五、落地建议\n\n- 先从一个「只读巡检」小脚本起步，跑通再碰写操作。\n- 账号用只读与变更专用两套，写操作尽量走审批流。\n- 脚本和模板都进版本库，谁改了什么一目了然。\n\n自动化不是一蹴而就，但它带来的「稳定可复现」，是手工永远给不了的。\n" }
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
