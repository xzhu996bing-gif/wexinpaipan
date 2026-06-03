const INITIAL_DRAFT = [
    '# 在这里开始排版',
    '',
    '把原始素材贴进来，然后按你的规则整理成适合微信公众号发布的 Markdown + HTML 混排内容。',
    '',
    '## 小提示',
    '',
    '- 点击“规则”查看完整规则',
    '- 支持打开本地 .md / .markdown / .txt',
    '- 复制 HTML 后可直接粘贴到公众号编辑器',
    '- 预览会以全屏弹层打开'
].join('\n');

const RULES_FALLBACK_MESSAGE = [
    '规则文件暂时没有加载成功。',
    '',
    '如果你现在是直接双击 HTML，用的是 file:// 本地协议，浏览器通常会拦截对 `规则.txt` 的读取。',
    '',
    '把当前目录放到本地或公网 HTTP 服务下访问后，这里会按 body[data-rules-source] 指向的路径正常加载规则文件。',
    '',
    '例如可以用任意简单静态服务打开这个目录，再访问 rules.html。'
].join('\n');

const MARKDOWN_OPTIONS = {
    gfm: true,
    breaks: true
};

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
    previewCopyBtn: '#previewCopyBtn',
    clearEditorBtn: '#clearEditorBtn',
    goBackBtn: '#goBackBtn',
    homeBtn: '#homeBtn',
    rulesContent: '#rulesContent',
    copyRulesBtn: '#copyRulesBtn',
    rulesFallbackTemplate: '#rulesFallbackTemplate'
};

const INLINE_STYLES = {
    h1: 'margin:0 0 28px;font-size:28px;line-height:1.4;text-align:center;font-weight:700;color:#111827;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    h2: 'font-size:22px;font-weight:700;margin:32px 0 14px;padding-left:12px;border-left:4px solid #007aaa;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;text-align:left;color:#333333;line-height:1.35;',
    h3: 'margin:26px 0 12px;font-size:18px;line-height:1.45;font-weight:700;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    p: 'margin:0 0 22px;font-size:16px;line-height:1.85;color:#000000;word-break:break-word;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    blockquote: 'margin:24px 0;padding:16px 20px;border-left:4px solid #007aaa;border-radius:4px;background-color:#f3fafc;color:#555555;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    ul: 'margin:16px 0 22px;padding-left:28px;list-style-position:outside;list-style-type:disc;',
    ol: 'margin:16px 0 22px;padding-left:28px;list-style-position:outside;',
    li: 'margin:8px 0;font-size:16px;line-height:1.8;color:#000000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    table: 'width:100%;margin:16px 0;border-collapse:collapse;border-spacing:0;table-layout:fixed;',
    tr: 'vertical-align:top;',
    td: 'width:100%;border:1.5px solid #ff6b6b;padding:16px 18px;background:#fffefe;color:#000000;font-size:16px;line-height:1.9;vertical-align:top;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    th: 'border:1px solid #d9e2ec;padding:12px 14px;background:#f8fafc;color:#111827;font-size:15px;line-height:1.7;text-align:left;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    strong: 'font-weight:700;color:#17324d;'
};

if (window.marked) {
    window.marked.setOptions(MARKDOWN_OPTIONS);
}

function $(selector) {
    return document.querySelector(selector);
}

function getBodyData(name) {
    return document.body ? document.body.dataset[name] || '' : '';
}

function getRulesFallbackText() {
    const template = $(SELECTORS.rulesFallbackTemplate);
    if (template && template.textContent) {
        const text = template.textContent.trim();
        if (text) {
            return text;
        }
    }

    return RULES_FALLBACK_MESSAGE;
}

function showToast(message) {
    const toast = $(SELECTORS.toast);
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add('is-visible');

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 2200);
}

async function copyPlainText(text, successMessage) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showToast(successMessage);
            return true;
        }
    } catch (error) {
        // Fall through to execCommand fallback.
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;

    try {
        copied = document.execCommand('copy');
    } catch (error) {
        copied = false;
    }

    document.body.removeChild(textarea);

    if (copied) {
        showToast(successMessage);
        return true;
    }

    showToast('复制失败，请手动复制');
    return false;
}

function renderMarkdown(markdown) {
    if (!window.marked) {
        throw new Error('marked is required for editor rendering');
    }

    return window.marked.parse(markdown || '');
}

function applyInlineStyles(container) {
    container.querySelectorAll('h1').forEach((node) => {
        node.style.cssText = INLINE_STYLES.h1;
    });

    container.querySelectorAll('h2').forEach((node) => {
        node.style.cssText = INLINE_STYLES.h2;
    });

    container.querySelectorAll('h3').forEach((node) => {
        node.style.cssText = INLINE_STYLES.h3;
    });

    container.querySelectorAll('p').forEach((node) => {
        node.style.cssText = INLINE_STYLES.p;
    });

    container.querySelectorAll('blockquote').forEach((node) => {
        node.style.cssText = INLINE_STYLES.blockquote;
    });

    container.querySelectorAll('ul').forEach((node) => {
        node.style.cssText = INLINE_STYLES.ul;
    });

    container.querySelectorAll('ol').forEach((node) => {
        node.style.cssText = INLINE_STYLES.ol;
    });

    container.querySelectorAll('li').forEach((node) => {
        node.style.cssText = INLINE_STYLES.li;
    });

    container.querySelectorAll('table').forEach((node) => {
        node.style.cssText = INLINE_STYLES.table;
    });

    container.querySelectorAll('tr').forEach((node) => {
        node.style.cssText = INLINE_STYLES.tr;
    });

    container.querySelectorAll('td').forEach((node) => {
        node.style.cssText = INLINE_STYLES.td;
    });

    container.querySelectorAll('th').forEach((node) => {
        node.style.cssText = INLINE_STYLES.th;
    });

    container.querySelectorAll('strong').forEach((node) => {
        node.style.cssText = INLINE_STYLES.strong;
    });
}

function buildInlineHtml(markdown) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderMarkdown(markdown);
    applyInlineStyles(wrapper);
    return wrapper;
}

function buildInlineHtmlFromPreview(preview, markdown) {
    const wrapper = document.createElement('div');
    const previewHtml = preview && preview.innerHTML ? preview.innerHTML.trim() : '';
    wrapper.innerHTML = previewHtml || renderMarkdown(markdown);
    applyInlineStyles(wrapper);
    return wrapper;
}

async function copyRichHtml(html, plainText) {
    if (navigator.clipboard && window.ClipboardItem && navigator.clipboard.write) {
        try {
            const item = new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([plainText], { type: 'text/plain' })
            });
            await navigator.clipboard.write([item]);
            return true;
        } catch (error) {
            // Fall through to copy event fallback.
        }
    }

    const holder = document.createElement('div');
    holder.setAttribute('contenteditable', 'true');
    holder.style.position = 'fixed';
    holder.style.left = '-9999px';
    holder.style.top = '0';
    holder.style.opacity = '0';
    holder.innerHTML = html;
    document.body.appendChild(holder);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(holder);
    selection.removeAllRanges();
    selection.addRange(range);

    const listener = (event) => {
        event.preventDefault();
        event.clipboardData.setData('text/html', html);
        event.clipboardData.setData('text/plain', plainText);
    };

    document.addEventListener('copy', listener);

    try {
        const copied = document.execCommand('copy');
        return copied;
    } catch (error) {
        return false;
    } finally {
        document.removeEventListener('copy', listener);
        selection.removeAllRanges();
        document.body.removeChild(holder);
    }
}

function insertIndent(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const indent = '    ';
    const selected = value.slice(start, end);

    if (selected.includes('\n')) {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const block = value.slice(lineStart, end);
        const indented = block.replace(/(^|\n)/g, `$1${indent}`);
        textarea.value = `${value.slice(0, lineStart)}${indented}${value.slice(end)}`;
        textarea.selectionStart = start + indent.length;
        textarea.selectionEnd = end + indent.length * (block.match(/(^|\n)/g) || []).length;
        return;
    }

    textarea.value = `${value.slice(0, start)}${indent}${value.slice(end)}`;
    textarea.selectionStart = textarea.selectionEnd = start + indent.length;
}

function downloadTextFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function createEditorController() {
    const editor = $(SELECTORS.editor);
    const preview = $(SELECTORS.preview);
    const previewModal = $(SELECTORS.previewModal);
    const fileInput = $(SELECTORS.fileInput);

    if (!editor || !preview || !previewModal || !fileInput) {
        return null;
    }

    const renderPreview = () => {
        preview.innerHTML = renderMarkdown(editor.value);
    };

    const openPreview = () => {
        renderPreview();
        previewModal.classList.add('is-open');
        previewModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closePreview = () => {
        previewModal.classList.remove('is-open');
        previewModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const saveMarkdown = () => {
        const stamp = new Date().toISOString().slice(0, 10);
        downloadTextFile(editor.value, `公众号排版稿_${stamp}.md`, 'text/markdown;charset=utf-8');
        showToast('已保存 Markdown');
    };

    const openFile = () => {
        fileInput.click();
    };

    const clearEditor = () => {
        if (!window.confirm('确定要清空当前内容吗？')) {
            return;
        }

        editor.value = '';
        renderPreview();
        showToast('已清空编辑区');
    };

    const copyHtml = async () => {
        renderPreview();
        const wrapper = buildInlineHtmlFromPreview(preview, editor.value);
        const html = wrapper.innerHTML;
        const plainText = wrapper.innerText;
        const copied = await copyRichHtml(html, plainText);

        if (copied) {
            showToast('已复制 HTML');
            return;
        }

        await copyPlainText(html, '已复制 HTML 文本');
    };

    editor.addEventListener('input', renderPreview);

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

            window.location.href = rulesPage;
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

            window.location.href = demoPage;
        });
    }

    const openFileBtn = $(SELECTORS.openFileBtn);
    if (openFileBtn) {
        openFileBtn.addEventListener('click', openFile);
    }

    const saveMarkdownBtn = $(SELECTORS.saveMarkdownBtn);
    if (saveMarkdownBtn) {
        saveMarkdownBtn.addEventListener('click', saveMarkdown);
    }

    const copyHtmlBtn = $(SELECTORS.copyHtmlBtn);
    if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', copyHtml);
    }

    const previewBtn = $(SELECTORS.previewBtn);
    if (previewBtn) {
        previewBtn.addEventListener('click', openPreview);
    }

    const closePreviewBtn = $(SELECTORS.closePreviewBtn);
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreview);
    }

    const previewCopyBtn = $(SELECTORS.previewCopyBtn);
    if (previewCopyBtn) {
        previewCopyBtn.addEventListener('click', copyHtml);
    }

    const clearEditorBtn = $(SELECTORS.clearEditorBtn);
    if (clearEditorBtn) {
        clearEditorBtn.addEventListener('click', clearEditor);
    }

    previewModal.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.dataset.closePreview === 'true') {
            closePreview();
        }
    });

    fileInput.addEventListener('change', (event) => {
        const input = event.target;
        const file = input.files && input.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            editor.value = String(loadEvent.target && loadEvent.target.result ? loadEvent.target.result : '');
            renderPreview();
            showToast(`已打开 ${file.name}`);
        };
        reader.onerror = () => {
            showToast('打开文件失败');
        };
        reader.readAsText(file, 'utf-8');
        input.value = '';
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        const hasPrimaryModifier = event.ctrlKey || event.metaKey;
        const isSave = hasPrimaryModifier && key === 's';
        const isOpen = hasPrimaryModifier && key === 'o';

        if (event.key === 'Escape' && previewModal.classList.contains('is-open')) {
            closePreview();
        }

        if (isSave) {
            event.preventDefault();
            saveMarkdown();
        }

        if (isOpen) {
            event.preventDefault();
            openFile();
        }

        if (event.key === 'Tab' && document.activeElement === editor) {
            event.preventDefault();
            insertIndent(editor);
            renderPreview();
        }
    });

    if (!editor.value) {
        editor.value = INITIAL_DRAFT;
    }
    renderPreview();

    return {
        renderPreview
    };
}

function initGoBackButton() {
    const goBackBtn = $(SELECTORS.goBackBtn);
    if (!goBackBtn) {
        return;
    }

    goBackBtn.addEventListener('click', () => {
        const editorPage = getBodyData('editorPage') || 'Markdown编辑器_蓝色主题 - Copy.html';
        const navigation = window.EditorNavigation;
        const result = navigation && navigation.resolveEditorNavigationTarget
            ? navigation.resolveEditorNavigationTarget({
                editorPage,
                referrer: document.referrer || ''
            })
            : { type: 'location', target: editorPage };

        window.location.href = result.target;
    });
}

function initHomeButton() {
    const homeBtn = $(SELECTORS.homeBtn);
    if (!homeBtn) {
        return;
    }

    homeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
}

function createRulesController() {
    const rulesContent = $(SELECTORS.rulesContent);
    if (!rulesContent) {
        return null;
    }

    initGoBackButton();

    const loadRules = async () => {
        const rulesSource = getBodyData('rulesSource');
        const fallbackText = getRulesFallbackText();

        if (!rulesSource) {
            rulesContent.textContent = fallbackText;
            showToast('未配置规则文件路径');
            return;
        }

        try {
            const response = await fetch(rulesSource);
            if (!response.ok) {
                throw new Error(`rules request failed: ${response.status}`);
            }

            const text = (await response.text()).trim();
            rulesContent.textContent = text || fallbackText;
            showToast('规则已加载');
        } catch (error) {
            rulesContent.textContent = fallbackText;
            showToast('规则加载失败，已显示内置规则');
        }
    };

    const copyRulesBtn = $(SELECTORS.copyRulesBtn);
    if (copyRulesBtn) {
        copyRulesBtn.addEventListener('click', async () => {
            await copyPlainText(rulesContent.textContent, '已复制规则全文');
        });
    }

    loadRules();

    return {
        loadRules
    };
}

function init() {
    createEditorController();
    createRulesController();
    initGoBackButton();
    initHomeButton();
}

init();
