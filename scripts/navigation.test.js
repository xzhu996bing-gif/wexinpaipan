const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveEditorNavigationTarget } = require('./navigation.js');

test('falls back to editor page when referrer is not the editor', () => {
  const result = resolveEditorNavigationTarget({
    editorPage: 'Markdown编辑器_蓝色主题 - Copy.html',
    referrer: 'file:///D:/somewhere/other.html'
  });

  assert.deepEqual(result, {
    type: 'location',
    target: 'Markdown编辑器_蓝色主题 - Copy.html'
  });
});

test('uses referrer when it is the editor page', () => {
  const result = resolveEditorNavigationTarget({
    editorPage: 'Markdown编辑器_蓝色主题 - Copy.html',
    referrer: 'file:///D:/dw/%E5%85%AC%E4%BC%97%E5%8F%B7/%E6%81%90%E6%80%96%E6%95%85%E4%BA%8B%E5%88%9B%E4%BD%9C%E9%A1%B9%E7%9B%AE/soft/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8/%E5%9C%A8%E7%BA%BF%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8/Markdown%E7%BC%96%E8%BE%91%E5%99%A8_%E8%93%9D%E8%89%B2%E4%B8%BB%E9%A2%98%20-%20Copy.html'
  });

  assert.deepEqual(result, {
    type: 'location',
    target: 'file:///D:/dw/%E5%85%AC%E4%BC%97%E5%8F%B7/%E6%81%90%E6%80%96%E6%95%85%E4%BA%8B%E5%88%9B%E4%BD%9C%E9%A1%B9%E7%9B%AE/soft/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8/%E5%9C%A8%E7%BA%BF%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8/Markdown%E7%BC%96%E8%BE%91%E5%99%A8_%E8%93%9D%E8%89%B2%E4%B8%BB%E9%A2%98%20-%20Copy.html'
  });
});
