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
    title: "构建<em>稳定可靠</em>的<br>大规模办公网络基础设施",
    sub: "我是杨硕，一名办公网网络架构师，14 年网络领域经验。专注大规模办公网架构设计、SD-WAN 推进与网络自动化，基于 AI 开发 15+ 自动化运维工具，让 1000+ 职场的网络稳定、可控、可演进。"
  },

  about: {
    lead: "从第一根网线到覆盖 1000+ 职场的办公网络体系——14 年来我一直在做同一件事：让网络成为业务最不需要担心的部分。日常与路由交换、WLAN、SD-WAN、VXLAN、QoS 打交道，也热衷用 Python 和 AI 把重复的运维工作自动化掉。"
  },

  stats: [
    { num: "14",   unit: "年", label: "网络工程经验" },
    { num: "1000", unit: "+",  label: "覆盖职场网络" },
    { num: "15",   unit: "+",  label: "自研 AI 运维工具" }
  ],

  skills: ["路由交换 (BGP/OSPF)", "SD-WAN 即插即用", "VXLAN / 园区网", "WLAN 无线网络", "QoS / 防火墙策略", "Python 自动化", "AI 智能运维", "Zabbix / Grafana"],

  timeline: [
    {
      date: "2020.09 — 至今",
      role: "网络架构师（办公网方向）",
      desc: "主导超大规模分布式办公网络的架构战略与演进路线，从 0 到 1 建立覆盖全量职场的标准化架构体系与智能化运维底座；以平台化、自动化能力支撑业务高速扩张，并推动运维从「人工响应」向「AI 驱动」的范式升级。"
    },
    {
      date: "2017.09 — 2020.09",
      role: "高级网络工程师",
      desc: "作为技术负责人带领团队承接千万级网络项目交付，主导私有云与多行业关键业务网络的架构规划与高可用落地；同时搭建团队技术能力培养体系，显著拉升交付质量与人才储备。"
    },
    {
      date: "2014.10 — 2017.09",
      role: "网络工程师",
      desc: "负责轨道交通行业售前方案体系与技术攻坚，主导多条城市地铁核心业务系统的网络架构设计与交付管理，并建立渠道技术赋能机制，支撑行业业务的规模化拓展。"
    },
    {
      date: "2012.06 — 2014.10",
      role: "网络工程师",
      desc: "参与运营商及政企客户的网络系统集成与端到端交付，在复杂异构环境中锤炼路由交换与故障定位硬功，并协同前端构建面向客户的技术方案。"
    }
  ],

  articles: [
    { date: "2026-07-25", title: "OSPF 的基础", tags: ["路由", "OSPF"], url: "#",
      body: "OSPF（Open Shortest Path First）是企业网和数据中心里用得最广的内部网关协议（IGP）之一。它基于链路状态（Link-State）算法，收敛快、无路由环路，而且是开放标准，多厂商设备互通无障碍。这篇文章把 OSPF 最核心的概念一次讲清，让你既能上手配置，也明白为什么要这样配。\n\n## 一、OSPF 是什么\n\nOSPF 是链路状态路由协议，属于 IGP，只在同一个自治系统（AS）内部运行。和距离矢量协议（如 RIP）只告诉邻居「离目标有多远」不同，OSPF 路由器会把本地的链路状态（接口、IP、开销、邻居）打包成 LSA 发给全网，每台路由器据此独立拼出一张完整的网络拓扑图，再用 SPF（Dijkstra）算法算出到每个目标的最短路径。\n\n它有三个典型优点：\n\n- 无环路：每台路由器都掌握全网拓扑，计算天然无环。\n- 收敛快：拓扑变化只在局部泛洪，触发更新而非周期性全量广播。\n- 分层设计：用 Area 把网络切块，限制 LSA 泛洪范围，规模越大优势越明显。\n\n## 二、Router ID 与邻居 / 邻接\n\n每台 OSPF 路由器都需要一个 32 位的 Router ID（形如 IP 地址），用来在全网唯一标识自己。选举规则：优先手工指定的 `router-id`；否则选最大的环回口 IP；再否则选最大的物理接口 IP。\n\n一定要分清两个词：\n\n- 邻居（Neighbor）：Hello 包双向连通、关键参数一致（Area ID、掩码、Hello/Dead 计时器、认证）即成为邻居，状态到 2-Way。\n- 邻接（Adjacency）：进一步同步链路状态数据库（LSDB），状态到 Full。并非所有邻居都建邻接——在广播型多路访问网络上，只有 DR / BDR 与每台路由器建立 Full 邻接。\n\n## 三、区域（Area）与分层\n\nOSPF 的灵魂是分层。所有非骨干区域都必须围绕骨干区域 Area 0 连接，非骨干区域之间不能直接互通，跨区流量必须经由 Area 0 转发。\n\n- Area 0（骨干区域）：骨干，负责区域间的路由转发。\n- ABR（区域边界路由器）：连接 Area 0 与非骨干区域，把区域内的路由汇总后通告出去。\n- ASBR（自治系统边界路由器）：既跑 OSPF 又跑其他协议（如 BGP），负责外部路由重分布。\n- Stub / NSSA 区域：末端区域，通过阻挡外部 LSA 来缩小数据库和路由表，很适合分支站点。\n\n分层的核心价值，是把 LSA 泛洪限制在本区域内，网络越大越省资源。\n\n## 四、DR 与 BDR\n\n在以太网这类多路访问（Broadcast / Multi-Access）链路上，若 N 台路由器两两建立邻接，会产生 N×(N-1)/2 个邻接关系，泛洪会爆炸。OSPF 会选举一台 DR（指定路由器）和一台 BDR（备份指定路由器）：\n\n- 所有路由器只和 DR、BDR 建立 Full 邻接，彼此之间保持在 2-Way。\n- DR 负责把 LSA 转发给所有人，BDR 在 DR 失效时立即顶上。\n- 选举看接口优先级（默认 1），相同时比 Router ID 大者胜。把某接口优先级设为 0，可让它永远不参与选举。\n- 点到点链路（如串口、PPP）不需要 DR / BDR。\n\n## 五、度量值：Cost\n\nOSPF 用 Cost 作为度量，一条路径的总 Cost 是沿途出接口 Cost 之和。默认 Cost = 100 Mbps / 接口带宽（参考带宽可以修改，例如改成 10 Gbps，避免万兆链路算出来都是 1）。选路就是选 Cost 最小的路径。想影响选路，最直接的方式是调整接口 `bandwidth` 或 `ip ospf cost`。\n\n## 六、五种报文类型\n\nOSPF 直接承载在 IP 上（协议号 89），不依赖 TCP / UDP。共有五类报文：\n\n1. Hello：发现并维护邻居，选举 DR / BDR。\n2. DBD（Database Description）：摘要交换，先对一下彼此有哪些 LSA。\n3. LSR（Link-State Request）：向邻居请求自己缺少的 LSA。\n4. LSU（Link-State Update）：把 LSA 发给邻居，真正的路由信息就在这里。\n5. LSAck：确认收到 LSU，保证泛洪可靠。\n\n邻居状态从 Down → Init → 2-Way → ExStart → Exchange → Loading → Full，正是靠这几类报文一步步建立起邻接。\n\n## 七、一段最小配置\n\n以 Cisco 风格为例，把环回口和直连接口宣告进 OSPF，传统写法用 `network` 命令：\n\n- `router ospf 1`：启动 OSPF 进程 1\n- `router-id 1.1.1.1`：手工指定 Router ID\n- `network 10.0.0.0 0.0.0.255 area 0`：把匹配到的接口宣告进 Area 0\n- `network 192.168.1.0 0.0.0.3 area 0`：把点对点链路宣告进 Area 0\n\n更现代的写法是在接口下直接宣告，语义更清楚：\n\n- `interface Loopback0` 配 `ip address 1.1.1.1 255.255.255.255`：环回口，常兼作 Router ID\n- `interface GigabitEthernet0/0` 配 `ip ospf 1 area 0`：把该接口加入进程 1 的 Area 0\n\n## 八、排障常用思路\n\n- `show ip ospf neighbor`：先看邻居状态是不是 Full（广播网里 2-Way 是正常的，表示未建邻接）。\n- `show ip ospf interface`：看接口是否启用了 OSPF、DR / BDR 是谁、网络类型是否正确。\n- `show ip ospf database`：看 LSDB 里有哪些 LSA，验证拓扑是否同步。\n- 邻居起不来，九成是这几项不一致：Area ID、掩码（广播网要求一致）、Hello / Dead 计时器、认证方式、网络类型（点到点 vs 广播）。\n\n## 九、小结\n\nOSPF 概念虽多，抓住主线就清晰：链路状态 + 分区（以 Area 0 为核心）+ DR / BDR 控制泛洪 + Cost 度量 + SPF 算路。把它和之前写的 BGP 放在一起看更有意思——BGP 管 AS 之间怎么选路（重策略），OSPF 管 AS 内部怎么打通（重拓扑），两者配合才构成一张完整可用的网络。\n" },

    { date: "2026-07-23", title: "如何搭建个人网站",            tags: ["教程", "Web"],       url: "#",
      body: "这篇文章记录我用 GitHub Pages 从零搭建这个个人站点的完整过程。整套方案不依赖任何框架与构建工具，纯原生 HTML/CSS/JS，内容集中在一个配置文件里——改文章、改技能、改联系方式都不必动页面结构。先上线，再慢慢迭代。\n\n## 一、定方案：纯静态站就够\n\n个人站不需要后端。我用最朴素的静态站：原生 HTML 加 CSS 加少量 JavaScript，托管在 GitHub Pages 上。它免费、自动上 HTTPS、支持自定义域名，提交即发布，对个人博客和作品集刚刚好。\n\n## 二、项目结构：数据驱动\n\n所有内容都收敛到一个 `content.js`，里面是一个全局对象 `SITE`，统一管理文章、技能、时间线、联系方式等。页面只负责「怎么展示」，内容只负责「展示什么」，两层解耦。一个典型的 `SITE` 包含 `hero`、`about`、`skills`、`timeline`、`articles`、`contact` 等字段；其中 `articles` 是一个数组，每篇文章含 `date`、`title`、`tags`、`url`、`body` 五个字段。\n\n## 三、渲染引擎：用 data 属性配置页面\n\n一个 `admin.js` 里的 `hydrate()` 函数扫描页面，根据元素上的 `data-*` 属性把 `SITE` 的数据渲染出来。常用的几个开关：\n\n- `data-limit=\"3\"`：只渲染前 N 条，首页用它显示「最近 3 篇」\n- `data-excerpt`：正文只显示约 80 字摘要，首页用它\n- `data-show-body`：渲染完整正文，文章子页用它\n- `data-tags`：按标签筛选\n\n## 四、文章系统：首页看最近 3 篇，子页看全部\n\n首页 `index.html` 的文章区挂 `data-limit=\"3\" data-excerpt`，自动只显示最新的三篇，并给出「查看全部」入口；文章子页 `articles.html` 挂 `data-show-body`，列出全部文章并直接渲染正文，顶部还有一个标签筛选目录，点标签即可只看某类文章。正文支持轻量 Markdown：`#` 标题、`**粗体**`、`*斜体*`、行内 `代码`、以及 `-` 列表。\n\n## 五、内容管理：从内联编辑到独立后台\n\n早期我在页面上挂了一个 `#admin` 内联编辑模式，改完点「导出 content.js」下载替换即可。后来把它抽成了独立的后台页面 `admin.html`：左侧是文章列表（可编辑、可删除），右侧是编辑器（标题、日期、标签、正文 Markdown 加实时预览），底部填 GitHub Token 即可「一键发布」。Token 只存在浏览器本地，不会上传到任何地方。\n\n## 六、发布上线：GitHub Pages 加一键推送\n\n仓库的 `main` 分支根目录就是 GitHub Pages 的发布源。发布内容本质就是更新 `content.js` 这一个文件：可以 `gh` 登录后通过 API 推送，也可以在后台填 Token 一键发布，通常 1 到 2 分钟生效。\n\n## 七、踩过的坑与小结\n\n- 浏览器缓存：改完看不到变化，先硬刷新（Ctrl 或 Cmd 加 Shift 加 R），或给地址加 `?v=1` 参数。\n- 已存在的文件用 API 更新时必须带上它的 `sha`，否则会报冲突错误。\n- 每篇文章都有独立详情页（`article.html?d=日期`）：首页与子页都链接到详情页，子页改为带标签筛选的文章目录。\n\n最小可行、先上线、再迭代——这是做个人站最舒服的节奏。下一步我打算把正文支持得更完整的 Markdown（如代码块、引用、链接等）。\n" },
    { date: "2026-06-10", title: "BGP 路由优化实战笔记",        tags: ["路由", "运维"],      url: "#",
      body: "这篇文章复盘一次大规模数据中心 BGP 邻居收敛与路由策略优化的实战：从现象到根因，再到用 route-map 控制选路、缩短收敛时间，并整理一份可复用的排障命令清单。\n\n## 一、背景：为什么要动 BGP\n\n我们的 Spine-Leaf fabric 采用 eBGP 同时作为 Underlay 与 Overlay 的控制协议。随着集群规模扩大到上百台交换机，一次核心链路抖动后，部分前缀的收敛时间长达数十秒，业务侧出现了明显的吞吐抖动。根因有两个：默认的 BGP 计时器偏保守，以及缺乏明确的 inbound / outbound 选路策略，导致等价路径间的流量分布不均。\n\n## 二、用 route-map 控制选路\n\nBGP 本身不擅长「按意图选路」，需要靠 route-map 在 neighbor 的 inbound 与 outbound 方向施加策略：\n\n- `set local-preference`：影响本 AS 内的出站方向，值越大越优先。\n- `set as-path prepend`：在出方向叠加 AS 号，影响对端 inbound 选路，常用于让流量「绕行」某条链路。\n- `match` 条件：用 `prefix-list` 或 `community` 精确命中目标路由，避免误伤其它前缀。\n\n一个常见模式是把「低时延链路」标记上特定 community，再用 route-map 对它提升 local-preference，让南北向流量优先走这条链路。\n\n## 三、缩短收敛时间\n\n默认 BGP 计时器（Keepalive 60s / Hold 180s）在大集群里太慢。我们做了两件事：\n\n1. 把 `timers bgp` 调小到 10 / 30，并在直连邻居上开启 BFD，链路故障可在亚秒级被感知。\n2. 开启 `nexthop tracking` 与 `bgp additional-paths`，让等价多路径能够快速切换。\n\n注意：计时器调小会增加控制面消息频率，改动前务必确认 CPU 与带宽余量。\n\n## 四、排障常用命令\n\n- `show ip bgp summary`：先看邻居状态是否 Established、收发的 prefix 数是否异常。\n- `show ip bgp neighbors <ip> advertised-routes`：确认本端实际发出去的前缀。\n- `show ip bgp <prefix>`：查看某条前缀的 best path 及其选路属性。\n- `show ip bgp neighbors <ip> routes`：查看对端发来的前缀，验证 inbound 策略是否生效。\n\n把这几条串成 Checklist，故障定位时间从小时级降到了分钟级。\n\n## 五、小结\n\nBGP 优化不是「调一个参数」，而是「策略 + 计时器 + 可观测」三件事一起做：用 route-map 把选路意图写清楚，用 BFD 和 additional-paths 把收敛压到亚秒，用一套命令清单把排障标准化。任何改动前都要在灰度环境验证，并准备好可回滚的 route-map。\n" },
    { date: "2026-05-02", title: "用 Python 自动化日常网络运维", tags: ["Python", "自动化"],  url: "#",
      body: "这篇讲我怎么把日常网络运维从「手工 SSH 敲命令」搬到「Python 脚本化」：用 Netmiko / NAPALM 做批量巡检、差异比对和变更生成，让重复劳动既稳又快。\n\n## 一、为什么要把运维自动化\n\n网络变更最怕两件事：一是人工在几十台设备上重复敲命令，容易漏、容易错；二是巡检结果靠肉眼比对，问题往往第二天才被发现。自动化的目标不是「取代人」，而是把人从重复劳动里解放出来，只做判断和决策。\n\n## 二、工具选型：Netmiko 与 NAPALM\n\n- `Netmiko`：基于 Paramiko 封装的多厂商 SSH 库，一行 `connect` 就能连上 Cisco / Juniper / 华为等设备，适合发命令、收回显。\n- `NAPALM`：在 Netmiko 之上提供统一 API，能把 `show` 命令的输出整理成结构化数据（JSON），还能做配置差异比对与原子化替换。\n\n经验法则：只想批量执行命令用 Netmiko；要做配置比对和回滚，上 NAPALM。\n\n## 三、批量巡检脚本长什么样\n\n核心是把「设备清单 + 要执行的命令」做成数据驱动：\n\n1. 从 CSV / YAML 读设备列表（主机、平台、账号）。\n2. 用线程池并发连接，每台设备执行 `show version`、`show ip bgp summary` 等。\n3. 把结果落库或导出成表格，异常项标红。\n\n并发连接要加超时与重试，单台设备卡死不能拖垮整体。\n\n## 四、差异比对与变更生成\n\n真正省时间的是「变更前 / 后比对」：\n\n- 变更前用 NAPALM `get_config` 抓一份基线。\n- 脚本根据模板生成变更配置（比如批量改 `description`、加 `prefix-list`）。\n- 变更后再抓一次，自动 diff，确认「只动了该动的地方」。\n\n把 diff 结果作为变更工单的附件，复盘和审计都省心。\n\n## 五、落地建议\n\n- 先从一个「只读巡检」小脚本起步，跑通再碰写操作。\n- 账号用只读与变更专用两套，写操作尽量走审批流。\n- 脚本和模板都进版本库，谁改了什么一目了然。\n\n自动化不是一蹴而就，但它带来的「稳定可复现」，是手工永远给不了的。\n" }
  ],

  contact: {
    statement: "一起构建更可靠的网络。",
    body: "如果您的团队正在规划大规模办公网架构、推进 SD-WAN，或用 AI 与自动化提升运维效率，欢迎随时交流。",
    email: "823829415@qq.com",
    github: "github.com/yanghsuo"
  },

  footer: {
    copyright: "Copyright 2026 杨硕 (Yang Shuo) · Built with Deep Space Design System"
  }

};
