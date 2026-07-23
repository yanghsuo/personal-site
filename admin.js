// ============================================================
//  快速编辑引擎（深空版）
//  用法：访问 网址#admin → 右下角出现「编辑」按钮 → 输入密码
//  · 页面文字点击即可修改，自动存为本地草稿（localStorage）
//  · 「导出 content.js」下载最新内容文件，替换仓库同名文件并 push 即正式发布
// ============================================================
(function () {
  'use strict';

  var LS_KEY = 'deepspace_site_data';

  // ---------- 数据：content.js 默认值 + 本地草稿覆盖 ----------
  var D = JSON.parse(JSON.stringify(typeof SITE !== 'undefined' ? SITE : {}));
  try {
    var draft = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (draft && draft.version === D.version) D = draft;
    else if (draft) localStorage.removeItem(LS_KEY); // content.js 升级则丢弃旧草稿
  } catch (e) {}

  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(D)); } catch (e) {} }

  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  }
  function set(path, val) {
    var ks = path.split('.'), o = D;
    for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    o[ks[ks.length - 1]] = val;
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ---------- 渲染：把数据灌进页面 ----------
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
      al.innerHTML = D.articles.map(function (a, i) {
        return '<a class="article glass" data-i="' + i + '" href="' + esc(a.url || '#') + '">' +
          '<div class="article-date mono" data-e="articles.' + i + '.date">' + esc(a.date) + '</div>' +
          '<div class="article-main">' +
          '<h3 data-e="articles.' + i + '.title">' + esc(a.title) + '</h3>' +
          '<div class="tags mono">' + (a.tags || []).map(function (t, j) {
            return '<span data-e="articles.' + i + '.tags.' + j + '">' + esc(t) + '</span>';
          }).join('') + '</div></div>' +
          '<span class="article-arrow">→</span></a>';
      }).join('');
    }

    // 联系方式链接
    if (D.contact) {
      var em = $('.contact-col a[data-k="email"]'), gh = $('.contact-col a[data-k="github"]'),
        cta = $('.contact-cta');
      if (em) { em.textContent = D.contact.email; em.href = 'mailto:' + D.contact.email; }
      if (gh) { gh.textContent = D.contact.github; gh.href = 'https://' + D.contact.github.replace(/^https?:\/\//, ''); }
      if (cta) cta.href = 'mailto:' + D.contact.email;
    }

    if (document.body.classList.contains('editing')) bindEditable();
  }

  // ---------- 编辑模式 ----------
  var authed = false;

  function bindEditable() {
    $$('[data-e]').forEach(function (el) {
      el.setAttribute('contenteditable', 'plaintext-only');
      if (el.hasAttribute('data-html')) el.setAttribute('contenteditable', 'true');
      el.oninput = function () {
        set(el.getAttribute('data-e'), el.hasAttribute('data-html') ? el.innerHTML : el.textContent);
        save(); flashSaved();
      };
    });
    // 编辑模式下文章卡不跳转；点「→」箭头可修改文章链接
    $$('.article').forEach(function (a) {
      a.onclick = function (e) { e.preventDefault(); };
      var arrow = $('.article-arrow', a);
      if (arrow) arrow.onclick = function (e) {
        e.preventDefault(); e.stopPropagation();
        var i = parseInt(a.getAttribute('data-i'), 10);
        var u = prompt('文章链接（URL）：', D.articles[i].url || '#');
        if (u !== null) { D.articles[i].url = u.trim() || '#'; save(); hydrate(); }
      };
    });
  }
  function unbindEditable() {
    $$('[data-e]').forEach(function (el) {
      el.removeAttribute('contenteditable'); el.oninput = null;
    });
    $$('.article').forEach(function (a) { a.onclick = null; });
  }

  var savedTimer;
  function flashSaved() {
    var tag = $('#adm-saved'); if (!tag) return;
    tag.classList.add('show');
    clearTimeout(savedTimer);
    savedTimer = setTimeout(function () { tag.classList.remove('show'); }, 1200);
  }

  function enterEdit() {
    document.body.classList.add('editing');
    bindEditable();
    $('#adm-panel').classList.add('show');
    $('#adm-btn').classList.remove('show');
  }
  function exitEdit() {
    document.body.classList.remove('editing');
    unbindEditable();
    $('#adm-panel').classList.remove('show');
    if (location.hash.indexOf('admin') > -1) $('#adm-btn').classList.add('show');
  }

  function askAuth() {
    if (authed || sessionStorage.getItem('edit_authed') === '1') { authed = true; enterEdit(); return; }
    var p = prompt('请输入编辑密码：');
    if (p === null) return;
    if (p === (D.editPassword || 'admin123')) {
      authed = true; sessionStorage.setItem('edit_authed', '1'); enterEdit();
    } else alert('密码错误');
  }

  // ---------- 面板操作 ----------
  function addArticle() {
    D.articles.unshift({ date: new Date().toISOString().slice(0, 10), title: '新文章标题', tags: ['标签'], url: '#' });
    save(); hydrate();
  }
  function delArticle() {
    if (!D.articles.length) return;
    var t = D.articles.map(function (a, i) { return (i + 1) + '. ' + a.title; }).join('\n');
    var n = prompt('删除哪一篇？输入序号：\n' + t);
    if (!n) return; n = parseInt(n, 10) - 1;
    if (n >= 0 && n < D.articles.length && confirm('确认删除「' + D.articles[n].title + '」？')) {
      D.articles.splice(n, 1); save(); hydrate();
    }
  }
  function addTimeline() {
    D.timeline.unshift({ date: '2026 — 至今', role: '新经历 · 职位', desc: '这段经历的描述。' });
    save(); hydrate();
  }
  function delTimeline() {
    if (!D.timeline.length) return;
    var t = D.timeline.map(function (x, i) { return (i + 1) + '. ' + x.role; }).join('\n');
    var n = prompt('删除哪一段？输入序号：\n' + t);
    if (!n) return; n = parseInt(n, 10) - 1;
    if (n >= 0 && n < D.timeline.length && confirm('确认删除「' + D.timeline[n].role + '」？')) {
      D.timeline.splice(n, 1); save(); hydrate();
    }
  }
  function addSkill() {
    var s = prompt('新技能名称：'); if (!s) return;
    D.skills.push(s.trim()); save(); hydrate();
  }
  function delSkill() {
    var t = D.skills.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n');
    var n = prompt('删除哪个技能？输入序号：\n' + t);
    if (!n) return; n = parseInt(n, 10) - 1;
    if (n >= 0 && n < D.skills.length) { D.skills.splice(n, 1); save(); hydrate(); }
  }
  function changePwd() {
    var np = prompt('设置新的编辑密码：'); if (!np) return;
    D.editPassword = np.trim(); save();
    alert('密码已更新（记得导出 content.js 使其永久生效）');
  }
  function resetAll() {
    if (confirm('重置所有本地修改、恢复为 content.js 里的内容？不可恢复！')) {
      localStorage.removeItem(LS_KEY); location.reload();
    }
  }
  function exportConfig() {
    var js = '// ============================================================\n' +
      '//  个人网站内容配置（深空版）— 由编辑面板导出\n' +
      '//  快速编辑：访问 网址#admin ，密码见 editPassword\n' +
      '//  用本文件替换仓库里的 content.js 并 push 即正式发布\n' +
      '// ============================================================\n\n' +
      'const SITE = ' + JSON.stringify(D, null, 2) + ';\n';
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([js], { type: 'application/javascript' }));
    a.download = 'content.js'; a.click();
  }

  // ---------- UI 注入 ----------
  function buildUI() {
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<button id="adm-btn" title="进入编辑模式">✎ 编辑</button>' +
      '<div id="adm-panel">' +
      '<div class="adm-head">编辑模式 <span id="adm-saved">已存草稿 ✓</span></div>' +
      '<div class="adm-hint">页面文字点击即可修改，自动保存草稿。<br>「导出」下载 content.js，替换仓库同名文件并 push 即发布。</div>' +
      '<div class="adm-grid">' +
      '<button data-act="addArticle">+ 文章</button><button data-act="delArticle">− 文章</button>' +
      '<button data-act="addTimeline">+ 经历</button><button data-act="delTimeline">− 经历</button>' +
      '<button data-act="addSkill">+ 技能</button><button data-act="delSkill">− 技能</button>' +
      '<button data-act="changePwd">改密码</button><button data-act="resetAll">重置</button>' +
      '</div>' +
      '<button class="adm-primary" data-act="exportConfig">⤓ 导出 content.js（发布用）</button>' +
      '<button class="adm-exit" data-act="exitEdit">退出编辑</button>' +
      '</div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    var acts = {
      addArticle: addArticle, delArticle: delArticle, addTimeline: addTimeline,
      delTimeline: delTimeline, addSkill: addSkill, delSkill: delSkill,
      changePwd: changePwd, resetAll: resetAll, exportConfig: exportConfig, exitEdit: exitEdit
    };
    $('#adm-panel').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (b) acts[b.getAttribute('data-act')]();
    });
    $('#adm-btn').addEventListener('click', askAuth);
  }

  function syncBtnVisibility() {
    var show = location.hash.indexOf('admin') > -1 || sessionStorage.getItem('edit_authed') === '1';
    $('#adm-btn').classList.toggle('show', show && !document.body.classList.contains('editing'));
  }

  // ---------- 启动 ----------
  buildUI();
  hydrate();
  syncBtnVisibility();
  addEventListener('hashchange', syncBtnVisibility);
})();
