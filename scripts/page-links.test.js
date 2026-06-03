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

test('supports a second toolbar entry for the demo page', () => {
  assert.equal(
    resolvePageLink({ configuredPath: 'demo.html', fallbackPath: 'demo.html' }),
    'demo.html'
  );
});

test('returns fallback for rules page when configured path is empty', () => {
  assert.equal(
    resolvePageLink({ configuredPath: '', fallbackPath: 'rules.html' }),
    'rules.html'
  );
});

test('browser global exposes PageLinks API', () => {
  const vm = require('node:vm');
  const fs = require('node:fs');
  const path = require('node:path');

  const scriptPath = path.join(__dirname, 'page-links.js');
  const source = fs.readFileSync(scriptPath, 'utf-8');
  const context = { console };
  context.globalThis = context;

  vm.runInNewContext(source, context, { filename: scriptPath });

  assert.deepEqual(
    Object.keys(context.PageLinks).sort(),
    ['resolvePageLink']
  );
  assert.equal(
    context.PageLinks.resolvePageLink({ configuredPath: 'demo.html', fallbackPath: 'other.html' }),
    'demo.html'
  );
});
