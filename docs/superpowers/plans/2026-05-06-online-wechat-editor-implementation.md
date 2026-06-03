# Online WeChat Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing HTML page into a fully local, offline-capable公众号排版工作台 with an editor-focused main page, a separate `rules.html` page opened from the toolbar, and a full-screen preview modal.

**Architecture:** Keep the current HTML file as the main entry point, but strip it down to structure only. Add a separate local `rules.html` page for rule viewing/copying. Use shared local `styles/editor.css` and `scripts/editor.js` for both pages, vendor a local markdown parser bundle, and render rules from a built-in fallback plus `规则.txt` when the browser allows local fetch.

**Tech Stack:** Static HTML, local CSS, local vanilla JavaScript, local `marked` bundle, browser File API, Clipboard API.

---

## File Map

- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\rules.html`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\marked.min.js`
- Reuse: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\规则.txt`

No git repository is present in this folder, so this plan does not include commit steps.

### Task 1: Create the Offline Page Structure

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\marked.min.js`
- Modify: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\rules.html`

- [ ] **Step 1: Create local asset directories**

Run:

```powershell
New-Item -ItemType Directory -Force -Path "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles"
New-Item -ItemType Directory -Force -Path "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts"
New-Item -ItemType Directory -Force -Path "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\docs\superpowers\plans"
```

Expected: `styles` and `scripts` directories exist next to the HTML file and can host assets for both pages.

- [ ] **Step 2: Vendor a local markdown parser bundle**

Run:

```powershell
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/marked/marked.min.js" -OutFile "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\marked.min.js"
```

Expected: `scripts\marked.min.js` exists and contains the marked UMD bundle.

- [ ] **Step 3: Replace the existing monolithic HTML with an editor-first shell that references only local files**

Write `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html` as:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在线微信编辑器</title>
    <link rel="stylesheet" href="styles/editor.css">
</head>
<body>
    <header class="toolbar">
        <div class="toolbar__brand">
            <h1>在线微信编辑器</h1>
            <p>本地离线公众号排版工作台</p>
        </div>
        <div class="toolbar__actions">
            <button type="button" id="openRulesBtn">规则</button>
            <button type="button" id="openFileBtn">打开文件</button>
            <button type="button" id="saveMarkdownBtn">保存 Markdown</button>
            <button type="button" id="copyHtmlBtn">复制 HTML</button>
            <button type="button" id="previewBtn">预览</button>
            <button type="button" id="clearEditorBtn" class="button--ghost">清空</button>
        </div>
    </header>

    <main class="workspace">
        <section class="editor-panel">
            <div class="panel-card editor-card">
                <div class="panel-card__header">
                    <h2>Markdown 编辑区</h2>
                </div>
                <textarea id="editor" spellcheck="false" placeholder="把原始素材贴在这里，直接整理成适合公众号的 Markdown + HTML 混排内容。"></textarea>
            </div>
        </section>
    </main>

    <div id="previewModal" class="preview-modal" aria-hidden="true">
        <div class="preview-modal__backdrop" data-close-preview="true"></div>
        <div class="preview-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="previewTitle">
            <div class="preview-modal__header">
                <h2 id="previewTitle">预览效果</h2>
                <button type="button" id="closePreviewBtn" class="preview-modal__close" aria-label="关闭预览">×</button>
            </div>
            <div id="preview" class="preview-modal__body preview-content"></div>
        </div>
    </div>

    <input type="file" id="fileInput" accept=".md,.markdown,.txt" hidden>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>

    <script src="scripts/marked.min.js"></script>
    <script src="scripts/editor.js"></script>
</body>
</html>
```

- [ ] **Step 4: Add a dedicated local rules page wired to `规则.txt`**

Write `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\rules.html` as a separate page with:

- the same restrained local visual language as the editor page
- a quick guide card
- a read-only rules content area
- a `复制规则` button
- a built-in fallback rules template
- shared `styles/editor.css` and `scripts/editor.js` references only

- [ ] **Step 5: Verify there are no external runtime dependencies left in the entry file**

Run:

```powershell
Select-String -Path "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html" -Pattern "https://|http://" -SimpleMatch
```

Expected: no CDN script references remain.

### Task 2: Build the Workbench Styles

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`

- [ ] **Step 1: Write the layout and component styles for the editor-first workbench**

Write `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css` to cover:

- restrained toolbar styling with a visible `规则` action
- a single primary editor workspace instead of an in-page rules column
- a large comfortable textarea for long-form Markdown editing
- the existing full-screen preview modal
- shared preview typography and the full-width red-box table treatment
- lightweight toast feedback
- responsive layout that preserves editor focus on desktop and mobile

- [ ] **Step 2: Manually inspect the red-border layout requirement before wiring JS**

Open the editor CSS and verify the red-box preview styles still produce:

- full-width table containers
- no extra horizontal inset
- top-aligned content cells
- natural multiline wrapping

Expected: the red-box cell is full-width, top-aligned, and not visually indented by nested wrappers.

Expected: the main page remains focused on editing and preview behavior, not in-page rules display.

- [ ] **Step 3: Add the dedicated rules page styles to the shared stylesheet**

Write the `rules.html` styles into `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css` with:

- a compact page header and action row
- card styling for quick guide and rules content
- a scrollable read-only rules area
- responsive behavior for narrow screens

Expected: `rules.html` feels visually related to the editor page but remains a separate focused document.

### Task 3: Implement Local Page Behavior

**Files:**
- Create: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js`

- [ ] **Step 1: Write the main editor behavior for editing, preview, file IO, clipboard, and opening `rules.html`**

Write `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js` so that it:

- manages the editor textarea, preview modal, toast, and file input
- opens `rules.html` from the toolbar without replacing the current editing session
- renders preview from local `marked`
- opens local Markdown and text files
- saves the current draft as `.md`
- copies rendered HTML for公众号编辑器粘贴
- keeps the existing keyboard affordances such as `Ctrl+S`, `Ctrl+O`, and preview close via `Esc`
- also handles rules loading and rules-copy behavior when `rules.html` is open

- [ ] **Step 2: Smoke-test the rules fallback logic and preview render path**

Run:

```powershell
Start-Process "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html"
```

Expected: the page opens in the default browser, the main view is editor-focused, and the editor contains the starter draft.

- [ ] **Step 3: Add the dedicated rules page behavior to the shared script**

Implement the rules-page branch in `scripts/editor.js` so that it:

- loads rules from built-in fallback text first
- tries to fetch `./规则.txt` and replaces the fallback when available
- supports `复制规则`
- shows lightweight feedback when local fetch is blocked and fallback is used

Expected: `rules.html` is useful both when opened from the toolbar and when opened directly from disk.

### Task 4: Verify the Offline Workbench End-to-End

**Files:**
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\rules.html`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css`
- Modify if needed after verification: `D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js`

- [ ] **Step 1: Verify local asset wiring and zero external dependencies**

Run:

```powershell
Select-String -Path "D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\Markdown编辑器_蓝色主题 - Copy.html","D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\styles\editor.css","D:\dw\公众号\恐怖故事创作项目\soft\公众号编辑器\在线微信编辑器\scripts\editor.js" -Pattern "cdn.jsdelivr.net|unpkg.com|ajax.googleapis.com"
```

Expected: no matches.

- [ ] **Step 2: Manually verify the primary user workflow**

Manual checklist:

```text
1. 主页面默认没有常驻规则栏，编辑区占据主要空间。
2. 点击“规则”可以打开本地 `rules.html`。
3. 在 `rules.html` 中点击“复制规则”可以复制完整规则。
4. 点击“打开文件”可以读取本地 .md/.txt。
5. 编辑内容后，点击“保存 Markdown”会下载 .md 文件。
6. 点击“预览”会打开全屏弹层。
7. 点击关闭按钮、遮罩空白处、Esc 都能退出预览。
8. 点击“复制 HTML”后可以拿到渲染结果。
9. 红框在预览中顶格、铺满整行、内部换行自然。
```

Expected: all nine checks pass without layout breakage.

- [ ] **Step 3: Fix any post-verification polish issues in place**

If the red box still looks inset or loose, adjust only these selectors first:

```css
.preview-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
}

.preview-content td {
    border: 1.5px solid var(--danger);
    padding: 16px 18px;
    line-height: 1.9;
    font-size: 16px;
    color: #000;
    background: #fffefe;
    vertical-align: top;
}
```

Expected: red border modules visually match the user's latest reference image.

## Self-Review Checklist

- Spec coverage:
  - Editor-focused main page: covered by Task 1 HTML and Task 2 CSS.
  - Separate rules page: covered by Task 1 HTML and Task 3 shared JS/CSS.
  - Quick style guide: covered by `rules.html`.
  - Full-screen preview modal: covered by Task 1 HTML, Task 2 CSS, Task 3 JS.
  - Offline local assets: covered by Task 1 and Task 4.
  - `规则.txt` as source file: covered by Task 3 JS and Task 4.
  - Red box visual correction: covered by Task 2 and Task 4.

- Placeholder scan:
  - No TBD/TODO markers remain.
  - All file paths are explicit.
  - All commands are explicit.

- Type consistency:
  - IDs used in `Markdown编辑器_蓝色主题 - Copy.html` match `editor.js` selectors.
  - IDs used in `rules.html` match the rules selectors in `editor.js`.
  - Modal class name `is-open` is consistent across CSS and JS.

Plan complete and saved to `docs/superpowers/plans/2026-05-06-online-wechat-editor-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
