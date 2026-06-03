# Workspace Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `workspace.html` shell page with a left-side platform switcher and a right-side iframe that loads the existing WeChat editor by default, while reserving a Xiaohongshu placeholder entry for later.

**Architecture:** Keep the existing WeChat editor page as its own standalone document and introduce a lightweight shell page above it. Use one small pure helper for platform registration/default resolution, one shell script for iframe switching and active-state sync, a simple placeholder HTML for Xiaohongshu, and shared CSS additions for the shell layout plus embedded-WeChat spacing fixes.

**Tech Stack:** Static HTML, shared local CSS, vanilla JavaScript, browser iframe, Node.js built-in `node:test`.

---

## File Map

- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\workspace.html`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\xiaohongshu-placeholder.html`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-platforms.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-platforms.test.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-structure.test.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-styles.test.js`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`

No git repository is present in this folder, so this plan does not include commit steps.

### Task 1: Add a Tested Platform Registry Helper

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-platforms.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-platforms.test.js`

- [ ] **Step 1: Write the failing tests for platform lookup and default selection**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  WORKSPACE_PLATFORMS,
  getDefaultPlatformId,
  getPlatformById
} = require('./workspace-platforms.js');

test('wechat is the default platform', () => {
  assert.equal(getDefaultPlatformId(), 'wechat');
});

test('wechat platform points at the current editor page', () => {
  assert.deepEqual(getPlatformById('wechat'), {
    id: 'wechat',
    label: '微信编辑器',
    page: 'Markdown编辑器_蓝色主题 - Copy.html'
  });
});

test('xiaohongshu platform points at the placeholder page', () => {
  assert.deepEqual(getPlatformById('xiaohongshu'), {
    id: 'xiaohongshu',
    label: '小红书编辑器',
    page: 'xiaohongshu-placeholder.html'
  });
});

test('unknown platform falls back to the default platform', () => {
  assert.equal(getPlatformById('unknown').id, 'wechat');
});

test('platform list preserves left-nav order', () => {
  assert.deepEqual(
    WORKSPACE_PLATFORMS.map((item) => item.id),
    ['wechat', 'xiaohongshu']
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-platforms.test.js"`
Expected: FAIL with `Cannot find module './workspace-platforms.js'`.

- [ ] **Step 3: Write the minimal helper implementation**

```js
(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.WorkspacePlatforms = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
    const WORKSPACE_PLATFORMS = [
        {
            id: 'wechat',
            label: '微信编辑器',
            page: 'Markdown编辑器_蓝色主题 - Copy.html'
        },
        {
            id: 'xiaohongshu',
            label: '小红书编辑器',
            page: 'xiaohongshu-placeholder.html'
        }
    ];

    function getDefaultPlatformId() {
        return WORKSPACE_PLATFORMS[0].id;
    }

    function getPlatformById(id) {
        return WORKSPACE_PLATFORMS.find((item) => item.id === id) || WORKSPACE_PLATFORMS[0];
    }

    return {
        WORKSPACE_PLATFORMS,
        getDefaultPlatformId,
        getPlatformById
    };
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-platforms.test.js"`
Expected: PASS with five passing tests.

### Task 2: Build the Workspace Shell Markup

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\workspace.html`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-structure.test.js`

- [ ] **Step 1: Write the failing structure test for the shell page**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workspacePath = path.join(__dirname, '..', 'workspace.html');

test('workspace shell contains nav entries and iframe host', () => {
    const html = fs.readFileSync(workspacePath, 'utf-8');

    assert.match(html, /workspace-shell/);
    assert.match(html, /平台选择/);
    assert.match(html, /data-platform-id="wechat"/);
    assert.match(html, /data-platform-id="xiaohongshu"/);
    assert.match(html, /id="editorViewport"/);
    assert.match(html, /Markdown编辑器_蓝色主题 - Copy\.html/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-structure.test.js"`
Expected: FAIL with `ENOENT` because `workspace.html` does not exist yet.

- [ ] **Step 3: Write the shell page HTML**

Write `workspace.html` as:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>编辑器工作台</title>
    <link rel="stylesheet" href="styles/editor.css">
</head>
<body class="workspace-shell">
    <main class="workspace-shell__layout">
        <aside class="workspace-shell__sidebar">
            <div class="workspace-shell__sidebar-inner">
                <p class="workspace-shell__eyebrow">平台选择</p>
                <h1>编辑器工作台</h1>
                <p class="workspace-shell__subtitle">左边切平台，右边直接进入对应编辑器。</p>
                <nav class="workspace-shell__nav" aria-label="平台切换">
                    <button type="button" class="workspace-shell__nav-item is-active" data-platform-id="wechat">微信编辑器</button>
                    <button type="button" class="workspace-shell__nav-item" data-platform-id="xiaohongshu">小红书编辑器</button>
                </nav>
            </div>
        </aside>

        <section class="workspace-shell__main">
            <iframe
                id="editorViewport"
                class="workspace-shell__frame"
                title="平台编辑器"
                src="Markdown编辑器_蓝色主题 - Copy.html"
                loading="eager"
            ></iframe>
        </section>
    </main>

    <script src="scripts/workspace-platforms.js"></script>
    <script src="scripts/workspace.js"></script>
</body>
</html>
```

- [ ] **Step 4: Run the structure test to verify it passes**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-structure.test.js"`
Expected: PASS with one passing test.

### Task 3: Wire the Left Nav to the Right-Side iframe

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace.js`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\workspace.html`

- [ ] **Step 1: Write the failing behavior test for active-state markers in the shell HTML**

Append this test to `scripts/workspace-shell-structure.test.js`:

```js
test('wechat entry starts active and xiaohongshu starts inactive', () => {
    const html = fs.readFileSync(workspacePath, 'utf-8');

    assert.match(html, /workspace-shell__nav-item is-active" data-platform-id="wechat"/);
    assert.match(html, /workspace-shell__nav-item" data-platform-id="xiaohongshu"/);
});
```

- [ ] **Step 2: Run the structure test to verify it passes before JS wiring**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-structure.test.js"`
Expected: PASS. This confirms the shell HTML exposes the markers needed by the script.

- [ ] **Step 3: Write the shell script**

Write `scripts/workspace.js` as:

```js
function initWorkspaceShell() {
    const api = window.WorkspacePlatforms;
    const frame = document.querySelector('#editorViewport');
    const navItems = Array.from(document.querySelectorAll('[data-platform-id]'));

    if (!api || !frame || !navItems.length) {
        return;
    }

    const setActivePlatform = (platformId) => {
        const platform = api.getPlatformById(platformId);
        frame.src = platform.page;

        navItems.forEach((item) => {
            const isActive = item.dataset.platformId === platform.id;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            setActivePlatform(item.dataset.platformId || api.getDefaultPlatformId());
        });
    });

    setActivePlatform(api.getDefaultPlatformId());
}

initWorkspaceShell();
```

- [ ] **Step 4: Add `aria-pressed` defaults to the shell buttons**

Update the nav buttons in `workspace.html` to:

```html
<button type="button" class="workspace-shell__nav-item is-active" data-platform-id="wechat" aria-pressed="true">微信编辑器</button>
<button type="button" class="workspace-shell__nav-item" data-platform-id="xiaohongshu" aria-pressed="false">小红书编辑器</button>
```

- [ ] **Step 5: Run a static sanity check on the shell wiring**

Run: `rg -n "editorViewport|workspace-platforms\.js|workspace\.js|aria-pressed" "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\workspace.html"`
Expected: one match for `editorViewport`, one for `workspace-platforms.js`, one for `workspace.js`, and two for `aria-pressed`.

### Task 4: Add the Xiaohongshu Placeholder Page

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\xiaohongshu-placeholder.html`

- [ ] **Step 1: Write the failing content-presence test for the placeholder page**

Create `scripts/xiaohongshu-placeholder.test.js` with:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const placeholderPath = path.join(__dirname, '..', 'xiaohongshu-placeholder.html');

test('xiaohongshu placeholder states that the editor is coming later', () => {
    const html = fs.readFileSync(placeholderPath, 'utf-8');

    assert.match(html, /小红书编辑器/);
    assert.match(html, /正在准备中/);
    assert.match(html, /后续会接入独立页面/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\xiaohongshu-placeholder.test.js"`
Expected: FAIL with `ENOENT` because the placeholder page does not exist yet.

- [ ] **Step 3: Write the placeholder page HTML**

Write `xiaohongshu-placeholder.html` as:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>小红书编辑器</title>
    <link rel="stylesheet" href="styles/editor.css">
</head>
<body class="placeholder-shell">
    <main class="placeholder-shell__body">
        <section class="placeholder-shell__card panel-card panel-card--compact">
            <div class="panel-card__header">
                <h1>小红书编辑器</h1>
            </div>
            <div class="placeholder-shell__content">
                <p>正在准备中。</p>
                <p>后续会接入独立页面、独立样式和独立脚本。</p>
            </div>
        </section>
    </main>
</body>
</html>
```

- [ ] **Step 4: Run the placeholder test to verify it passes**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\xiaohongshu-placeholder.test.js"`
Expected: PASS with one passing test.

### Task 5: Add Shell Styles and Embedded-WeChat Layout Fixes

**Files:**
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-styles.test.js`

- [ ] **Step 1: Write the failing style-presence test for shell and placeholder selectors**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const cssPath = path.join(__dirname, '..', 'styles', 'editor.css');

test('shared stylesheet contains shell, frame, and placeholder selectors', () => {
    const css = fs.readFileSync(cssPath, 'utf-8');

    assert.match(css, /\.workspace-shell/);
    assert.match(css, /\.workspace-shell__layout/);
    assert.match(css, /\.workspace-shell__nav-item/);
    assert.match(css, /\.workspace-shell__frame/);
    assert.match(css, /\.placeholder-shell/);
});

test('shared stylesheet tightens the embedded wechat editor workspace', () => {
    const css = fs.readFileSync(cssPath, 'utf-8');

    assert.match(css, /\.editor-shell \.workspace--editor-only/);
    assert.match(css, /\.editor-panel/);
    assert.match(css, /\.editor-card/);
});
```

- [ ] **Step 2: Run the style test to verify it fails**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-styles.test.js"`
Expected: FAIL because the shell selectors are not present yet.

- [ ] **Step 3: Add the workspace shell and placeholder styles**

Append the following CSS to `styles/editor.css` near the layout section:

```css
.workspace-shell,
.placeholder-shell {
    min-height: 100vh;
}

.workspace-shell__layout {
    display: grid;
    grid-template-columns: 256px minmax(0, 1fr);
    min-height: 100vh;
    background: linear-gradient(180deg, #f2f5f9 0%, #eaf0f7 100%);
}

.workspace-shell__sidebar {
    border-right: 1px solid rgba(196, 210, 225, 0.78);
    background: rgba(249, 251, 255, 0.92);
}

.workspace-shell__sidebar-inner {
    display: grid;
    gap: 14px;
    padding: 28px 20px 24px;
}

.workspace-shell__eyebrow {
    margin: 0;
    color: var(--text-soft);
    font-size: 12px;
    line-height: 1.4;
}

.workspace-shell__sidebar-inner h1 {
    margin: 0;
    font-size: 20px;
    line-height: 1.3;
    color: var(--text);
}

.workspace-shell__subtitle {
    margin: 0;
    color: var(--text-soft);
    font-size: 13px;
    line-height: 1.7;
}

.workspace-shell__nav {
    display: grid;
    gap: 8px;
}

.workspace-shell__nav-item {
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: transparent;
    color: var(--text-soft);
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.workspace-shell__nav-item.is-active {
    border-color: rgba(47, 110, 167, 0.24);
    background: rgba(234, 242, 251, 0.96);
    color: var(--brand-strong);
}

.workspace-shell__main {
    min-width: 0;
    padding: 0;
}

.workspace-shell__frame {
    display: block;
    width: 100%;
    min-height: 100vh;
    border: 0;
    background: #ffffff;
}

.placeholder-shell__body {
    display: grid;
    place-items: center;
    min-height: 100vh;
    padding: 24px;
}

.placeholder-shell__card {
    width: min(520px, 100%);
}

.placeholder-shell__content {
    display: grid;
    gap: 12px;
    padding: 18px 22px 24px;
}

.placeholder-shell__content p {
    margin: 0;
    color: var(--text-soft);
    font-size: 14px;
    line-height: 1.8;
}

.editor-panel {
    width: min(1100px, 100%);
    margin: 0 auto;
}

.editor-shell .workspace--editor-only {
    width: min(100%, calc(100% - 32px));
    padding: 18px 0 28px;
}

.editor-card {
    min-height: calc(100vh - 118px);
}

#editor {
    min-height: calc(100vh - 196px);
}

@media (max-width: 900px) {
    .workspace-shell__layout {
        grid-template-columns: 1fr;
    }

    .workspace-shell__sidebar {
        border-right: 0;
        border-bottom: 1px solid rgba(196, 210, 225, 0.78);
    }

    .workspace-shell__nav {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .workspace-shell__sidebar-inner {
        padding: 18px 14px 14px;
    }

    .workspace-shell__nav {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 4: Run the style test to verify it passes**

Run: `node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-styles.test.js"`
Expected: PASS with two passing tests.

### Task 6: Smoke-Test the Whole Workspace Flow

**Files:**
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\workspace.html`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\xiaohongshu-placeholder.html`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace.js`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`

- [ ] **Step 1: Run all four Node-based regression checks**

Run:

```powershell
node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-platforms.test.js"
node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-structure.test.js"
node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\xiaohongshu-placeholder.test.js"
node "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\workspace-shell-styles.test.js"
```

Expected: all four commands PASS.

- [ ] **Step 2: Verify the shell entry and iframe targets statically**

Run:

```powershell
rg -n "workspace-shell|editorViewport|Markdown编辑器_蓝色主题 - Copy\.html|xiaohongshu-placeholder\.html|微信编辑器|小红书编辑器" "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器"
```

Expected: matches appear in the new shell page, helper, placeholder page, and script files.

- [ ] **Step 3: Manually verify the user-visible flow**

Manual checklist:

```text
1. 打开 `workspace.html` 后，左侧能看到“微信编辑器”和“小红书编辑器”。
2. 初始状态下，“微信编辑器”处于高亮选中状态。
3. 页面加载完成后，右侧 iframe 已直接显示微信编辑器。
4. 右侧不再出现明显的大块无效空白，编辑器区域更像主工作区。
5. 微信编辑器内部的规则、保存、复制 HTML、预览等功能仍然正常。
6. 点击“小红书编辑器”后，右侧切到占位页，并显示“正在准备中”。
7. 再点击“微信编辑器”后，右侧能切回原微信编辑器页面。
8. 手机宽度下，左侧平台区改为更适合小屏的布局，iframe 仍可用。
```

Expected: all eight checks pass without the shell taking over platform-specific controls.

- [ ] **Step 4: Polish only the specific layout issue you observe**

If the embedded WeChat editor still feels too narrow, adjust only these selectors first:

```css
.editor-panel {
    width: min(1180px, 100%);
}

.editor-shell .workspace--editor-only {
    width: min(100%, calc(100% - 20px));
}
```

Expected: the editor fills more horizontal space without reworking its internal toolbar or controls.

## Self-Review Checklist

- Spec coverage:
  - New workspace shell entry page: covered by Task 2.
  - Left-side platform switching: covered by Tasks 2 and 3.
  - Right-side iframe with WeChat default: covered by Tasks 1, 2, and 3.
  - Xiaohongshu placeholder only: covered by Task 4.
  - Keep WeChat toolbar inside the WeChat page: preserved by Tasks 3 and 6.
  - Embedded-WeChat spacing improvement: covered by Task 5.
  - Mobile-friendly shell layout: covered by Task 5 media queries.

- Placeholder scan:
  - No `TBD`, `TODO`, or “implement later” markers remain.
  - Every file-creation step includes exact content.
  - Every verification step includes an exact command and expected result.

- Type consistency:
  - `wechat`, `xiaohongshu`, `editorViewport`, `WorkspacePlatforms`, and `workspace-shell__nav-item` are named consistently across HTML, JS, CSS, and tests.
  - The WeChat page target is consistently `Markdown编辑器_蓝色主题 - Copy.html` across helper, shell, and checks.

Plan complete and saved to `docs/superpowers/plans/2026-05-06-workspace-shell-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
