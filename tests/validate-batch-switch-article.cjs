// Run with: node tests/validate-batch-switch-article.cjs
// Validates static content only; never connects to network devices.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({
  window: {},
  document: { querySelector: () => null, querySelectorAll: () => [] },
});
const contentText = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
vm.runInContext(contentText, context);
const site = vm.runInContext('SITE', context);
// The existing article publishing backend parses the SITE assignment as JSON.
const assignment = contentText.match(/const\s+SITE\s*=\s*([\s\S]*);\s*$/);
assert.ok(assignment, 'Keep the existing SITE assignment format');
assert.equal(JSON.stringify(JSON.parse(assignment[1])), JSON.stringify(site), 'Preserve backend JSON compatibility');
const matching = site.articles.filter((article) => article.date === '2026-11-05');
assert.equal(matching.length, 1, 'The article date must be unique');
const article = matching[0];
assert.equal(site.articles[0], article, 'The article should appear first');
assert.equal(article.url, '#', 'Use the existing article detail page');
assert.equal(article.title, '用 Python 构建 H3C / 飞塔批量命令 Web 管理台');
assert.ok(article.tags.includes('Python') && article.tags.includes('FortiGate'));

const markdown = fs.readFileSync(path.join(root, 'docs', '2026-11-05-batch-switch-web.md'), 'utf8');
assert.equal(markdown, `# ${article.title}\n\n${article.body}`, 'Markdown source and website body must match');
assert.ok(article.body.includes('GALBOT/6.batch_switch_cmd'));
assert.ok(article.body.includes('43 项离线模拟测试'));
assert.ok(article.body.includes('不能运行 Flask'));
assert.ok(article.body.includes('私有'));
assert.ok(!/\/Users\/|192\.168\.|github_pat_|ghp_|BEGIN.*PRIVATE KEY/.test(article.body), 'Do not publish private details');
for (const address of article.body.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g) || []) {
  assert.ok(['127.0.0.1', '192.0.2.10', '192.0.2.11', '198.51.100.20'].includes(address), `Unexpected example address: ${address}`);
}

vm.runInContext(fs.readFileSync(path.join(root, 'admin.js'), 'utf8'), context);
const html = context.window.md2html(article.body);
const fences = (article.body.match(/^```/gm) || []).length;
assert.ok(fences > 0 && fences % 2 === 0, 'Code fences must be balanced');
assert.equal((html.match(/<pre class="code-block">/g) || []).length, fences / 2);
assert.equal((html.match(/<h3>/g) || []).length, 10, 'Render all ten sections');
assert.ok(!html.includes('```'), 'Code fences should render, not appear as text');
assert.ok(!html.includes('\u0001'), 'No renderer placeholders should remain');
console.log(`Article validation passed: one new article, ten sections, ${fences / 2} code blocks, matching Markdown, safe examples.`);
