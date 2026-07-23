// ============================================================
//  个人网站配置文件
//  编辑密码默认: admin123（登录后可在编辑面板修改）
// ============================================================

const SITE = {

  title: "杨硕 · 个人主页",
  editPassword: "admin123",

  nav: {
    logo: "👤 杨硕",
    links: [
      { label: "关于",   href: "#about" },
      { label: "经历",   href: "#experience" },
      { label: "项目",   href: "#projects" },
      { label: "文章",   href: "#articles" },
      { label: "联系",   href: "#contact" }
    ]
  },

  hero: {
    emoji: "🌐",
    name: "杨硕",
    role: "网络工程师 · 北京",
    tagline: "14年网络技术沉淀，精通路由协议、VXLAN、WiFi 及网络自动化编程。",
    links: [
      { icon: "📄", label: "简历", url: "#" },
      { icon: "🐙", label: "GitHub", url: "https://github.com/yanghsuo" }
    ]
  },

  about: {
    label: "About",
    title: "关于我",
    desc: "14年网络工程实战经验，深度掌握 BGP、OSPF 等路由协议，熟悉 VXLAN、ROCE、InfiniBand 等数据中心网络技术。擅长 WiFi 无线网络规划与优化，同时具备网络自动化编程能力，用 Python 驱动网络运维效率提升。"
  },

  skills: ["Python", "BGP", "OSPF", "VXLAN", "InfiniBand", "ROCE", "WiFi", "网络自动化"],

  timeline: [
    {
      date: "2024 - 至今",
      title: "公司名称",
      subtitle: "网络工程师",
      desc: "负责数据中心网络架构设计与运维，推动网络自动化体系建设。"
    },
    {
      date: "2015 - 2023",
      title: "上一家公司",
      subtitle: "网络工程师",
      desc: "负责大规模园区网与数据中心的规划、部署和优化。"
    }
  ],

  projects: [
    {
      icon: "🔧",
      name: "项目名称",
      desc: "项目简介，说明背景、角色和关键成果。",
      stack: ["Python", "BGP", "VXLAN"]
    },
    {
      icon: "🚀",
      name: "项目二",
      desc: "项目简介。",
      stack: ["Python", "ROCE"]
    }
  ],

  articles: [
    {
      id: "1",
      date: "2026-07-23",
      title: "示例文章：如何搭建个人网站",
      summary: "这是一篇示例文章，点击卡片可以阅读全文。",
      content: "这是文章正文，支持简单的排版。\n\n你可以写任意多个段落。段落之间用空行分隔。\n\n支持**粗体**、*斜体*、`行内代码`和[链接](https://example.com)。\n\n```\n// 也支持代码块\nfunc main() {\n    fmt.Println(\"Hello World\")\n}\n```\n\n更多文章请在编辑模式下点击右下角面板的「➕ 文章」来添加。",
      tags: ["教程", "Web"]
    }
  ],

  contact: [
    { icon: "📧", text: "email@example.com" },
    { icon: "🐙", text: "github.com/yanghsuo" }
  ],

  footer: "© 2026 杨硕"

};
