// ============================================================
//  站点渲染引擎（深空版）
//  负责把 content.js 的数据渲染进页面（文章 / 技能 / 时间线 / 联系）。
//  文章的编写与发布已迁移到独立的后台页 admin.html。
// ============================================================
(function () {
  'use strict';

  var D = typeof SITE !== 'undefined' ? JSON.parse(JSON.stringify(SITE)) : {};

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  }

  // 轻量 Markdown -> HTML（先转义再做行内/块级转换；支持 #/##/### 标题、
  // **粗体**、*斜体*、`代码`、- 列表，以及段落与换行）。供子页正文与后台预览共用。
  function md2html(src) {
    if (!src) return '';
    var text = esc(src);
    var codes = [];
    text = text.replace(/`([^`]+)`/g, function (m, c) { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    var lines = text.split(/\r?\n/);
    var html = '', inList = false;
    function inline(t) {
      return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }
    function closeList() { if (inList) { html += '</ul>'; inList = false; } }
    lines.forEach(function (line) {
      var s = line.trim();
      var m;
      if (!s) { closeList(); return; }
      if ((m = s.match(/^###\s+(.*)$/))) { closeList(); html += '<h4>' + inline(m[1]) + '</h4>'; }
      else if ((m = s.match(/^##\s+(.*)$/))) { closeList(); html += '<h3>' + inline(m[1]) + '</h3>'; }
      else if ((m = s.match(/^#\s+(.*)$/))) { closeList(); html += '<h2>' + inline(m[1]) + '</h2>'; }
      else if ((m = s.match(/^[-*]\s+(.*)$/))) { if (!inList) { html += '<ul>'; inList = true; } html += '<li>' + inline(m[1]) + '</li>'; }
      else if ((m = s.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) { closeList(); html += '<figure class="article-fig"><img src="' + m[2] + '" alt="' + m[1] + '" loading="lazy">' + (m[1] ? '<figcaption>' + inline(m[1]) + '</figcaption>' : '') + '</figure>'; }
      else { closeList(); html += '<p>' + inline(s) + '</p>'; }
    });
    closeList();
    html = html.replace(/\u0000(\d+)\u0000/g, function (mm, i) { return '<code>' + codes[+i] + '</code>'; });
    return html;
  }

  function hydrate() {
    // 简单文本 / 富文本绑定
    $$('[data-e]').forEach(function (el) {
      var v = get(el.getAttribute('data-e'));
      if (v == null) return;
      if (el.hasAttribute('data-html')) el.innerHTML = v;
      else el.textContent = v;
    });

    // 技能芯片（保留原 SVG 图标：按索引取，超出用通用图标）
    var chipsBox = $('.chips');
    if (chipsBox && D.skills) {
      if (!hydrate._icons) {
        hydrate._icons = $$('.chip svg', chipsBox).map(function (s) { return s.outerHTML; });
      }
      var generic = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".45"/></svg>';
      chipsBox.innerHTML = D.skills.map(function (s, i) {
        return '<div class="chip glass" data-i="' + i + '">' +
          (hydrate._icons[i] || generic) +
          '<span data-e="skills.' + i + '">' + esc(s) + '</span></div>';
      }).join('');
    }

    // 时间线
    var tl = $('.timeline');
    if (tl && D.timeline) {
      tl.innerHTML = D.timeline.map(function (t, i) {
        var last = i === D.timeline.length - 1;
        return '<div class="tl-item" data-i="' + i + '">' +
          '<div class="tl-marker"><span class="tl-dot"></span>' + (last ? '' : '<span class="tl-line"></span>') + '</div>' +
          '<div class="tl-body">' +
          '<div class="tl-date mono" data-e="timeline.' + i + '.date">' + esc(t.date) + '</div>' +
          '<h3 class="tl-role" data-e="timeline.' + i + '.role">' + esc(t.role) + '</h3>' +
          '<p class="tl-desc" data-e="timeline.' + i + '.desc">' + esc(t.desc) + '</p>' +
          '</div></div>';
      }).join('');
    }

    // 文章
    var al = $('.article-list');
    if (al && D.articles) {
      var list = D.articles;
      var limit = parseInt(al.getAttribute('data-limit'), 10);
      if (limit > 0) list = list.slice(0, limit); // 首页只展示最近 N 篇
      var showBody = al.hasAttribute('data-show-body');
      var excerpt = al.hasAttribute('data-excerpt');
      al.innerHTML = list.map(function (a, i) {
        var tagsAttr = (a.tags || []).map(esc).join(' ');
        var extra = '';
        if (showBody) {
          // 子页：展示完整正文（Markdown 渲染）
          extra = '<div class="article-body">' + md2html(a.body || '') + '</div>';
        } else if (excerpt && a.body) {
          // 首页预览：仅展示前 80 字纯文本摘要（去除 Markdown 符号）
          var ex = (a.body || '').replace(/[#*>`\-]/g, ' ').replace(/\s+/g, ' ').trim();
          if (ex.length > 80) ex = ex.slice(0, 80) + '…';
          extra = '<div class="article-excerpt">' + esc(ex) + '</div>';
        }
        // 链接：若 url 显式给出且非 # 则用它，否则跳转到独立详情页 article.html?d=日期
        var href = (a.url && a.url !== '#') ? a.url : ('article.html?d=' + encodeURIComponent(a.date));
        return '<a class="article glass" data-i="' + i + '" data-tags="' + tagsAttr + '" href="' + esc(href) + '">' +
          '<div class="article-date mono">' + esc(a.date) + '</div>' +
          '<div class="article-main">' +
          '<h3>' + esc(a.title) + '</h3>' +
          '<div class="tags mono">' + (a.tags || []).map(function (t) {
            return '<span>' + esc(t) + '</span>';
          }).join('') + '</div>' + extra +
          '</div>' +
          '<span class="article-arrow">→</span></a>';
      }).join('');
    }

    // 联系方式链接
    if (D.contact) {
      var em = $('.contact-col a[data-k="email"]'), gh = $('.contact-col a[data-k="github"]');
      if (em) { em.textContent = D.contact.email; em.href = 'mailto:' + D.contact.email; }
      if (gh) { gh.textContent = D.contact.github; gh.href = 'https://' + D.contact.github.replace(/^https?:\/\//, ''); }
    }
  }

  window.md2html = md2html;
  hydrate();
})();
