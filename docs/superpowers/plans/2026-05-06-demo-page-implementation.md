# Demo Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `demo.html` effect-showcase page, linked from the main editor toolbar, that presents a fixed finished公众号排版 example with a left-light/right-heavy layout.

**Architecture:** Keep the existing static-file setup and reuse the shared `styles/editor.css` and `scripts/editor.js` files. Add one new standalone HTML page for the showcase, wire a new toolbar button from the main editor into it, and extract a tiny pure helper for page-link resolution so the navigation behavior can be covered by Node's built-in test runner before touching production JS.

**Tech Stack:** Static HTML, shared local CSS, shared vanilla JavaScript, Node.js built-in `node:test`, browser `window.open`.

---

## File Map

- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\demo.html`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.test.js`

No git repository is present in this folder, so this plan does not include commit steps.

### Task 1: Add a Tested Page-Link Helper

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.test.js`

- [ ] **Step 1: Write the failing test for page-link fallback behavior**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { resolvePageLink } = require('./page-links.js');

test('returns the dataset value when present', () => {
  assert.equal(
    resolvePageLink({ configuredPath: 'demo.html', fallbackPath: 'demo.html' }),
    'demo.html'
  );
});

test('returns the fallback when the dataset value is blank', () => {
  assert.equal(
    resolvePageLink({ configuredPath: '', fallbackPath: 'demo.html' }),
    'demo.html'
  );
});

test('trims surrounding whitespace from dataset values', () => {
  assert.equal(
    resolvePageLink({ configuredPath: '  demo.html  ', fallbackPath: 'demo.html' }),
    'demo.html'
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.test.js"`
Expected: FAIL with `Cannot find module './page-links.js'`.

- [ ] **Step 3: Write the minimal helper implementation**

```js
(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.PageLinks = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    function resolvePageLink({ configuredPath, fallbackPath }) {
        const value = String(configuredPath || '').trim();
        return value || fallbackPath;
    }

    return {
        resolvePageLink
    };
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.test.js"`
Expected: PASS with three passing tests.

### Task 2: Wire the Main Editor Toolbar to the Demo Page

**Files:**
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.js`

- [ ] **Step 1: Write the failing test for the second toolbar page target**

Append this test to `scripts/page-links.test.js`:

```js
test('supports a second toolbar entry for the demo page', () => {
  assert.equal(
    resolvePageLink({ configuredPath: 'demo.html', fallbackPath: 'demo.html' }),
    'demo.html'
  );
});
```

- [ ] **Step 2: Run the test to verify the suite still protects the helper before wiring UI**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.test.js"`
Expected: PASS. This confirms the helper can be reused for both `rules.html` and `demo.html` without new production code yet.

- [ ] **Step 3: Add the toolbar button and page dataset to the main HTML**

Update `Markdown编辑器_蓝色主题 - Copy.html` so the `<body>` and toolbar action block become:

```html
<body class="editor-shell" data-rules-page="rules.html" data-demo-page="demo.html">
    <header class="toolbar">
        <div class="toolbar__brand">
            <h1>在线微信编辑器</h1>
            <p>本地离线公众号排版工作台</p>
        </div>
        <div class="toolbar__actions">
            <button type="button" id="openRulesBtn">规则</button>
            <button type="button" id="openDemoBtn">效果展示</button>
            <button type="button" id="openFileBtn">打开文件</button>
            <button type="button" id="saveMarkdownBtn" class="button--accent">保存 Markdown</button>
            <button type="button" id="copyHtmlBtn" class="button--accent">复制 HTML</button>
            <button type="button" id="previewBtn" class="button--accent">预览</button>
            <button type="button" id="clearEditorBtn" class="button--ghost">清空</button>
        </div>
    </header>
```

- [ ] **Step 4: Wire the button in the shared editor script**

Update the selector map and toolbar click logic in `scripts/editor.js` to include the demo button and helper script:

```js
const SELECTORS = {
    editor: '#editor',
    preview: '#preview',
    previewModal: '#previewModal',
    fileInput: '#fileInput',
    toast: '#toast',
    openRulesBtn: '#openRulesBtn',
    openDemoBtn: '#openDemoBtn',
    openFileBtn: '#openFileBtn',
    saveMarkdownBtn: '#saveMarkdownBtn',
    copyHtmlBtn: '#copyHtmlBtn',
    previewBtn: '#previewBtn',
    closePreviewBtn: '#closePreviewBtn',
    clearEditorBtn: '#clearEditorBtn',
    goBackBtn: '#goBackBtn',
    rulesContent: '#rulesContent',
    copyRulesBtn: '#copyRulesBtn',
    rulesFallbackTemplate: '#rulesFallbackTemplate'
};
```

```js
    const pageLinks = window.PageLinks;

    const openRulesBtn = $(SELECTORS.openRulesBtn);
    if (openRulesBtn) {
        openRulesBtn.addEventListener('click', () => {
            const rulesPage = pageLinks && pageLinks.resolvePageLink
                ? pageLinks.resolvePageLink({
                    configuredPath: getBodyData('rulesPage'),
                    fallbackPath: 'rules.html'
                })
                : 'rules.html';

            window.open(rulesPage, '_blank', 'noopener');
        });
    }

    const openDemoBtn = $(SELECTORS.openDemoBtn);
    if (openDemoBtn) {
        openDemoBtn.addEventListener('click', () => {
            const demoPage = pageLinks && pageLinks.resolvePageLink
                ? pageLinks.resolvePageLink({
                    configuredPath: getBodyData('demoPage'),
                    fallbackPath: 'demo.html'
                })
                : 'demo.html';

            window.open(demoPage, '_blank', 'noopener');
        });
    }
```

- [ ] **Step 5: Load the helper before the main script**

Update the main HTML script block to:

```html
    <script src="scripts/marked.min.js"></script>
    <script src="scripts/page-links.js"></script>
    <script src="scripts/editor.js"></script>
```

- [ ] **Step 6: Run a static sanity check on the main HTML wiring**

Run: `rg -n "openDemoBtn|data-demo-page|page-links\.js" "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html"`
Expected: one match for `data-demo-page`, one for `openDemoBtn`, and one for `page-links.js`.

### Task 3: Build the Showcase Page Markup

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\demo.html`

- [ ] **Step 1: Write the failing structural test for the showcase page shell**

Create `scripts/demo-page-structure.test.js` with:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const demoPath = path.join(__dirname, '..', 'demo.html');

test('demo page contains the showcase title and content landmarks', () => {
    const html = fs.readFileSync(demoPath, 'utf-8');

    assert.match(html, /排版效果展示/);
    assert.match(html, /demo-shell/);
    assert.match(html, /demo-sidebar/);
    assert.match(html, /demo-article/);
    assert.match(html, /场景一：掐人怎么办/);
    assert.match(html, /场景二：弹广告牌/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\demo-page-structure.test.js"`
Expected: FAIL with `ENOENT` because `demo.html` does not exist yet.

- [ ] **Step 3: Write the showcase page HTML**

Write `demo.html` as:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>排版效果展示</title>
    <link rel="stylesheet" href="styles/editor.css">
</head>
<body class="demo-shell">
    <header class="toolbar toolbar--demo">
        <div class="toolbar__brand">
            <h1>排版效果展示</h1>
            <p>适合公众号发布的最终成品示例</p>
        </div>
    </header>

    <main class="workspace workspace--demo">
        <aside class="demo-sidebar panel-card panel-card--compact">
            <div class="panel-card__header">
                <h2>素材说明</h2>
            </div>
            <div class="demo-sidebar__content">
                <section class="demo-note">
                    <h3>原始素材</h3>
                    <p>口语化、零散、带场景感的亲子沟通素材，需要整理成更适合公众号阅读的成品内容。</p>
                </section>
                <section class="demo-note">
                    <h3>整理目标</h3>
                    <p>保留原意和情绪张力，同时把重点、节奏和结论整理得更适合发布。</p>
                </section>
                <section class="demo-note">
                    <h3>展示重点</h3>
                    <ul>
                        <li>标题层级</li>
                        <li>重点词高亮</li>
                        <li>笔刷节奏强调</li>
                        <li>红框结论段</li>
                    </ul>
                </section>
            </div>
        </aside>

        <section class="demo-article panel-card">
            <div class="panel-card__header">
                <h2>最终成品</h2>
            </div>
            <article class="demo-article__content preview-content">
                <h2 style="font-size:22px;font-weight:700;margin:32px 0 14px;padding-left:12px;border-left:4px solid #007aaa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;text-align:left;color:#333333;line-height:1.35;">场景一：掐人怎么办 —— 用“搞怪”打破僵局（情绪急救法）</h2>
                <p>当他又开始暴躁、要动手掐人时，千万不要<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">硬碰硬</span>。</p>
                <p>第一步，<span style="color:#007aaa;font-weight:700;">满足内合</span>。<br>您先深呼吸，让自己冷静下来。然后凑近他，用一种滑稽、无奈的语气说：“哎呀，<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">这个小怪兽又生气啦</span>，气得胡子都要翘起来了！”</p>
                <p>第二步，<span style="color:#007aaa;font-weight:700;">制造缺口</span>。<br>您<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">突然静止不动</span>，像木头人一样，眼睛瞪得大大的看着他。</p>
                <p>第三步，<span style="color:#007aaa;font-weight:700;">打破稳态</span>。<br>您突然做一个极其搞怪的动作，比如假装被他的<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">“掐人魔法”</span>定住了，身体僵硬，然后慢慢倒下。</p>
                <p>第四步，<span style="color:#007aaa;font-weight:700;">引入新频</span>。<br>等他愣神的时候，您爬起来，指着旁边说：“不好啦！刚才的‘掐人怪兽’把我们的玩具都吓跑了，它们躲到沙发后面去了！我们一起去把它们<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">抓出来</span>好不好？”</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <tr>
                        <td style="border:1.5px solid #ff6b6b;padding:16px 18px;line-height:1.9;font-size:16px;color:#000000;background:#fffefe;vertical-align:top;">
                            通过这种方式，把他的<span style="color:#8B3A2E;font-weight:700;">攻击性行为</span>消解掉，重新建立<span style="color:#007aaa;font-weight:700;">有趣的互动链接</span>。
                        </td>
                    </tr>
                </table>
                <h2 style="font-size:22px;font-weight:700;margin:32px 0 14px;padding-left:12px;border-left:4px solid #007aaa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;text-align:left;color:#333333;line-height:1.35;">场景二：弹广告牌 —— 用“游戏”转化行为</h2>
                <p>面对孩子不断弹广告牌的行为，可以这样尝试：</p>
                <p>第一步，<span style="color:#007aaa;font-weight:700;">满足内合</span>。<br>你可以跟着他的节奏点头，配上<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">夸张的表情</span>和“噔噔噔噔”的配音。</p>
                <p>第二步，<span style="color:#007aaa;font-weight:700;">制造缺口</span>。<br>你可以<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">突然停下来</span>，做出极其享受的表情，闭上眼睛听。</p>
                <p>第三步，<span style="color:#007aaa;font-weight:700;">打破稳态</span>。<br>用夸张的声调和肢体语言表演：“<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">哇哇哇哇，打疼打疼我了，广告牌也好痛好痛</span>，我要把它……”</p>
                <p>第四步，<span style="color:#007aaa;font-weight:700;">引入新频</span>。<br>立刻转换剧情，指着广告牌说：“哦，<span style="background:linear-gradient(transparent 72%, #74e7e8 0);font-weight:700;">快快快，广告牌被你敲痛了</span>，我们找个东西，我保护它，来来来。”</p>
                <p class="demo-article__closing">这是最终可交付的排版效果示例。</p>
            </article>
        </section>
    </main>

    <script src="scripts/page-links.js"></script>
    <script src="scripts/editor.js"></script>
</body>
</html>
```

- [ ] **Step 4: Run the structure test to verify it passes**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\demo-page-structure.test.js"`
Expected: PASS with one passing test.

### Task 4: Add Shared Demo-Page Styles

**Files:**
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`

- [ ] **Step 1: Write the failing style-presence test for demo layout hooks**

Create `scripts/demo-page-styles.test.js` with:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const cssPath = path.join(__dirname, '..', 'styles', 'editor.css');

test('shared stylesheet contains demo layout selectors', () => {
    const css = fs.readFileSync(cssPath, 'utf-8');

    assert.match(css, /\.demo-shell/);
    assert.match(css, /\.workspace--demo/);
    assert.match(css, /\.demo-sidebar/);
    assert.match(css, /\.demo-article/);
    assert.match(css, /\.demo-article__content/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\demo-page-styles.test.js"`
Expected: FAIL because the demo selectors are not present yet.

- [ ] **Step 3: Add the demo page styles to the shared stylesheet**

Append the following CSS to `styles/editor.css` near the page-layout section:

```css
.demo-shell {
    min-height: 100vh;
}

.workspace--demo {
    display: grid;
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
    gap: 24px;
    align-items: start;
    width: min(1240px, calc(100% - 36px));
    padding: 28px 0 40px;
}

.toolbar--demo {
    position: sticky;
}

.demo-sidebar {
    position: sticky;
    top: 92px;
}

.demo-sidebar__content {
    display: grid;
    gap: 16px;
    padding: 18px 22px 22px;
}

.demo-note {
    display: grid;
    gap: 8px;
}

.demo-note h3 {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 650;
    color: var(--text);
}

.demo-note p,
.demo-note li {
    margin: 0;
    font-size: 13px;
    line-height: 1.75;
    color: var(--text-soft);
}

.demo-note ul {
    margin: 0;
    padding-left: 18px;
}

.demo-article {
    overflow: visible;
    padding-bottom: 12px;
}

.demo-article .panel-card__header {
    border-bottom: 0;
    padding-bottom: 4px;
}

.demo-article__content {
    max-width: 720px;
    margin: 0 auto;
    padding: 8px 32px 36px;
    background: #ffffff;
}

.demo-article__content > :first-child {
    margin-top: 0;
}

.demo-article__closing {
    margin-top: 26px;
    color: var(--text-soft);
    font-size: 14px;
}

@media (max-width: 980px) {
    .workspace--demo {
        grid-template-columns: 1fr;
        gap: 18px;
    }

    .demo-sidebar {
        position: static;
    }
}

@media (max-width: 640px) {
    .workspace--demo {
        width: calc(100% - 16px);
        padding: 18px 0 28px;
    }

    .demo-sidebar__content,
    .demo-article__content {
        padding-left: 16px;
        padding-right: 16px;
    }
}
```

- [ ] **Step 4: Run the style-presence test to verify it passes**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\demo-page-styles.test.js"`
Expected: PASS with one passing test.

### Task 5: Smoke-Test the Showcase End-to-End

**Files:**
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\demo.html`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`

- [ ] **Step 1: Run all three Node-based regression checks**

Run:

```powershell
node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\page-links.test.js"
node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\demo-page-structure.test.js"
node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\demo-page-styles.test.js"
```

Expected: all three commands PASS.

- [ ] **Step 2: Verify the demo entry wiring and fixed content markers**

Run:

```powershell
rg -n "效果展示|demo.html|场景一：掐人怎么办|场景二：弹广告牌" "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器"
```

Expected: the toolbar entry, the new `demo.html` file, and both scene headings are all present.

- [ ] **Step 3: Manually verify the user-visible flow**

Manual checklist:

```text
1. 主编辑器工具栏能看到“效果展示”按钮。
2. 点击“效果展示”后会在新页面打开 `demo.html`。
3. 展示页首屏先看到标题，再立刻看到右侧成品正文开头。
4. 左侧说明区明显比右侧成品弱，不会抢视觉重心。
5. 右侧成品里蓝字、笔刷、红框显示正常。
6. 向下滚动时能继续看到“场景二：弹广告牌”。
7. 手机宽度下页面切为上下结构，阅读顺序自然。
```

Expected: all seven checks pass without the page looking like an editor preview modal.

- [ ] **Step 4: Polish only the specific issue you see during smoke test**

If the first screen still shows too much chrome and not enough article content, adjust only these selectors first:

```css
.workspace--demo {
    gap: 20px;
}

.demo-article__content {
    padding-top: 0;
}

.demo-sidebar {
    top: 84px;
}
```

Expected: the first screen shows the article content sooner without redesigning the whole page.

## Self-Review Checklist

- Spec coverage:
  - Toolbar entry for the demo page: covered by Task 2.
  - New standalone `demo.html`: covered by Task 3.
  - Left-light/right-heavy layout: covered by Task 4.
  - Fixed finished-content example: covered by Task 3.
  - Shared CSS/JS reuse: covered by Tasks 2, 3, and 4.
  - Mobile stacked layout: covered by Task 4 media queries.
  - First-screen emphasis on finished article content: covered by Tasks 3, 4, and 5.

- Placeholder scan:
  - No `TBD`, `TODO`, or “implement later” markers remain.
  - Every command includes an expected result.
  - Every code-writing step includes the concrete code to add.

- Type consistency:
  - `openDemoBtn`, `data-demo-page`, and `resolvePageLink()` names are consistent across HTML, JS, and tests.
  - `demo-shell`, `workspace--demo`, `demo-sidebar`, `demo-article`, and `demo-article__content` are used consistently across HTML, CSS, and tests.

Plan complete and saved to `docs/superpowers/plans/2026-05-06-demo-page-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
