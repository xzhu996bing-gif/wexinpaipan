const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
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

test('browser global exposes WorkspacePlatforms API', () => {
  const scriptPath = path.join(__dirname, 'workspace-platforms.js');
  const source = fs.readFileSync(scriptPath, 'utf-8');
  const context = { console };
  context.globalThis = context;

  vm.runInNewContext(source, context, { filename: scriptPath });

  assert.deepEqual(
    Object.keys(context.WorkspacePlatforms).sort(),
    ['WORKSPACE_PLATFORMS', 'getDefaultPlatformId', 'getPlatformById']
  );
  assert.equal(context.WorkspacePlatforms.getDefaultPlatformId(), 'wechat');
});
