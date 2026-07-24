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
      body: "从域名、静态托管到自动部署，记录我用 GitHub Pages 搭建这个个人站点的全过程：如何组织目录结构、如何做响应式布局，以及如何用 #admin 模式快速更新内容。\n\n（在此撰写正文，支持多段。编辑后在 #admin 模式点「导出 content.js」即可发布。）" },
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
