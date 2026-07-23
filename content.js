// ============================================================
//  个人网站配置文件
//  推荐：直接在网页上点 ✏️ 编辑，比改这个文件更方便
//  编辑密码默认: admin123（登录后可在编辑面板修改）
// ============================================================

const SITE = {

  title: "个人主页",
  editPassword: "admin123",

  nav: {
    logo: "👤 你的名字",
    links: [
      { label: "关于",   href: "#about" },
      { label: "经历",   href: "#experience" },
      { label: "项目",   href: "#projects" },
      { label: "文章",   href: "#articles" },
      { label: "联系",   href: "#contact" }
    ]
  },

  hero: {
    emoji: "🧑‍💻",
    name: "你的名字",
    role: "头衔 · 城市",
    tagline: "简短的一句话自我介绍，让人一眼记住你。",
    links: [
      { icon: "📄", label: "简历", url: "#" },
      { icon: "🐙", label: "GitHub", url: "#" }
    ]
  },

  about: {
    label: "About",
    title: "关于我",
    desc: "这里写一段自我介绍。可以介绍你的背景、专注领域和兴趣方向。"
  },

  skills: ["Kubernetes", "Linux", "网络", "Python", "SRE", "监控"],

  timeline: [
    {
      date: "2024 - 至今",
      title: "公司名称",
      subtitle: "职位",
      desc: "工作内容描述，2-3句话概括核心职责和成果。"
    },
    {
      date: "2020 - 2023",
      title: "上一家公司",
      subtitle: "职位",
      desc: "工作内容描述。"
    }
  ],

  projects: [
    {
      icon: "🔧",
      name: "项目名称",
      desc: "项目简介，说明背景、角色和关键成果。",
      stack: ["Go", "K8s", "gRPC"]
    },
    {
      icon: "🚀",
      name: "项目二",
      desc: "项目简介。",
      stack: ["Python", "Django"]
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
    { icon: "🐙", text: "github.com/你的ID" }
  ],

  footer: "© 2026 你的名字"

};
