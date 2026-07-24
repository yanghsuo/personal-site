// ============================================================
//  文章后台逻辑（admin-app.js）
//  · 读取 content.js 的 SITE.articles 进行增删改
//  · 「保存到本地」写入 localStorage 草稿；「发布」用 GitHub API 直接提交 content.js
//  · 文章编写入口已与公开页面解耦，独立于此后台页
// ============================================================
(function () {
  'use strict';

  var LS_SET = 'ys_admin_settings';
  var LS_DRAFT = 'ys_admin_draft';

  var SITE0 = (typeof SITE !== 'undefined') ? SITE : { articles: [] };
  var state = JSON.parse(JSON.stringify(SITE0)); // 完整站点数据（发布时整体写回 content.js）

  function loadSettings() { try { return JSON.parse(localStorage.getItem(LS_SET)) || {}; } catch (e) { return {}; } }
  function saveSettings(s) { localStorage.setItem(LS_SET, JSON.stringify(s)); }
  function loadDraft() { try { return JSON.parse(localStorage.getItem(LS_DRAFT)); } catch (e) { return null; } }
  function saveDraft() { localStorage.setItem(LS_DRAFT, JSON.stringify(state.articles)); }
  function clearDraft() { localStorage.removeItem(LS_DRAFT); }

  var settings = Object.assign(
    { owner: 'yanghsuo', repo: 'personal-site', branch: 'main', path: 'content.js', token: '' },
    loadSettings()
  );

  var editIndex = null; // null = 新建
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ---------- 渲染文章列表 ----------
  function renderList() {
    var box = $('articleList');
    if (!state.articles.length) {
      box.innerHTML = '<div class="adm-empty">还没有文章，点右上角「＋ 新建文章」开始。</div>';
      return;
    }
    box.innerHTML = state.articles.map(function (a, i) {
      return '<div class="adm-item">' +
        '<div class="adm-item-main">' +
        '<div class="adm-item-date mono">' + esc(a.date) + '</div>' +
        '<div class="adm-item-title">' + esc(a.title || '（无标题）') + '</div>' +
        '<div class="tags mono">' + (a.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="adm-item-actions">' +
        '<button class="btn btn-ghost small" data-edit="' + i + '">编辑</button>' +
        '<button class="btn btn-ghost adm-danger small" data-del="' + i + '">删除</button>' +
        '</div></div>';
    }).join('');
  }

  // ---------- 打开编辑器 ----------
  function openEditor(i) {
    editIndex = i;
    var a = (i == null)
      ? { date: new Date().toISOString().slice(0, 10), title: '', tags: [], url: '#', body: '' }
      : state.articles[i];
    $('fTitle').value = a.title || '';
    $('fDate').value = a.date || '';
    $('fTags').value = (a.tags || []).join(', ');
    $('fUrl').value = a.url || '#';
    $('fBody').value = a.body || '';
    $('delBtn').style.display = (i == null) ? 'none' : '';
    $('editorCard').hidden = false;
    $('editorCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    updatePreview();
    setStatus('');
  }

  function collect() {
    return {
      date: $('fDate').value || new Date().toISOString().slice(0, 10),
      title: $('fTitle').value.trim() || '未命名文章',
      tags: $('fTags').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      url: $('fUrl').value.trim() || '#',
      body: $('fBody').value
    };
  }

  function updatePreview() {
    var b = $('fBody').value;
    $('fPreview').innerHTML = (typeof window.md2html === 'function')
      ? window.md2html(b)
      : esc(b).replace(/\n/g, '<br>');
  }

  function setStatus(msg, ok) {
    var s = $('status');
    s.textContent = msg || '';
    s.className = 'adm-status' + (ok === true ? ' ok' : ok === false ? ' err' : '');
  }

  // ---------- 保存到本地草稿 ----------
  function saveLocal() {
    var a = collect();
    if (editIndex == null) state.articles.unshift(a);
    else state.articles[editIndex] = a;
    saveDraft();
    renderList();
    setStatus('已保存到本地草稿（尚未发布到 GitHub）。', true);
  }

  function delArticle(i) {
    if (i == null) return;
    if (!confirm('确认删除「' + (state.articles[i].title || '该文章') + '」？')) return;
    state.articles.splice(i, 1);
    saveDraft();
    renderList();
    $('editorCard').hidden = true;
    setStatus('已删除（仅本地草稿，发布后才会从线上移除）。', true);
  }

  // ---------- 生成 content.js 文本（整体写回，保留其它板块） ----------
  function buildContentJS() {
    return '// ============================================================\n' +
      '//  个人网站内容配置（深空版）— 由文章后台 admin.html 发布\n' +
      '// ============================================================\n\n' +
      'const SITE = ' + JSON.stringify(state, null, 2) + ';\n';
  }

  function b64utf8(s) { return btoa(unescape(encodeURIComponent(s))); }

  function ghHeaders(extra) {
    var h = { 'Authorization': 'Bearer ' + settings.token, 'Accept': 'application/vnd.github+json' };
    if (extra) Object.assign(h, extra);
    return h;
  }

  // ---------- 发布到 GitHub ----------
  function publish() {
    // 编辑器还开着时，先把当前编辑并入 state
    if (!$('editorCard').hidden) {
      var a = collect();
      if (editIndex == null) state.articles.unshift(a); else state.articles[editIndex] = a;
      saveDraft(); renderList();
    }
    if (!settings.token) {
      setStatus('请先在「发布设置」里填写 GitHub Token。', false);
      $('settingsBody').hidden = false;
      $('setCaret').classList.add('collapsed');
      $('settingsBody').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    var content = buildContentJS();
    var base = 'https://api.github.com/repos/' + settings.owner + '/' + settings.repo + '/contents/' + settings.path;
    setStatus('正在发布…');
    fetch(base + '?ref=' + settings.branch, { headers: ghHeaders() })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (j) { throw new Error(j.message || ('HTTP ' + r.status)); });
        return r.json();
      })
      .then(function (meta) {
        return fetch(base, {
          method: 'PUT',
          headers: ghHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            message: 'update articles via admin',
            content: b64utf8(content),
            sha: meta.sha,
            branch: settings.branch
          })
        });
      })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (j) { throw new Error(j.message || ('HTTP ' + r.status)); });
        return r.json();
      })
      .then(function () {
        clearDraft();
        setStatus('✅ 已发布！GitHub Pages 约 1–2 分钟自动生效。', true);
      })
      .catch(function (err) {
        setStatus('发布失败：' + err.message, false);
      });
  }

  // ---------- 从仓库拉取最新内容 ----------
  function pull() {
    if (!settings.token) {
      setStatus('拉取最新需要填写 Token。', false);
      $('settingsBody').hidden = false;
      return;
    }
    var raw = 'https://raw.githubusercontent.com/' + settings.owner + '/' + settings.repo + '/' +
      settings.branch + '/' + settings.path;
    setStatus('正在从仓库拉取最新内容…');
    fetch(raw)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (txt) {
        var src = txt.replace(/const\s+SITE\s*=/, 'window.__SITE__ =');
        /* eslint-disable no-eval */
        eval(src);
        /* eslint-enable no-eval */
        state = JSON.parse(JSON.stringify(window.__SITE__));
        saveDraft();
        renderList();
        setStatus('已拉取仓库最新内容到本地。', true);
      })
      .catch(function (e) { setStatus('拉取失败：' + e.message, false); });
  }

  // ---------- 绑定事件 ----------
  function bind() {
    $('newBtn').onclick = function () { openEditor(null); };
    $('saveBtn').onclick = saveLocal;
    $('publishBtn').onclick = publish;
    $('cancelBtn').onclick = function () { $('editorCard').hidden = true; setStatus(''); };
    $('delBtn').onclick = function () { delArticle(editIndex); };
    $('fBody').oninput = updatePreview;

    $('articleList').onclick = function (e) {
      var ed = e.target.closest('[data-edit]');
      if (ed) { openEditor(parseInt(ed.getAttribute('data-edit'), 10)); return; }
      var dl = e.target.closest('[data-del]');
      if (dl) { delArticle(parseInt(dl.getAttribute('data-del'), 10)); }
    };

    $('saveSettings').onclick = function () {
      settings.token = $('setToken').value.trim();
      var parts = $('setRepo').value.trim().split('/');
      settings.owner = parts[0] || 'yanghsuo';
      if (parts[1]) settings.repo = parts[1];
      settings.branch = $('setBranch').value.trim() || 'main';
      settings.path = $('setPath').value.trim() || 'content.js';
      saveSettings(settings);
      setStatus('设置已保存（Token 存于本机 localStorage）。', true);
    };
    $('pullBtn').onclick = pull;

    document.querySelector('[data-toggle="settingsBody"]').onclick = function () {
      var b = $('settingsBody');
      b.hidden = !b.hidden;
      $('setCaret').classList.toggle('collapsed', b.hidden);
    };
  }

  function init() {
    var d = loadDraft();
    if (d && Array.isArray(d)) state.articles = d; // 恢复未发布的本地草稿
    $('setToken').value = settings.token || '';
    $('setRepo').value = settings.owner + '/' + settings.repo;
    $('setBranch').value = settings.branch;
    $('setPath').value = settings.path;
    bind();
    renderList();
  }

  init();
})();
