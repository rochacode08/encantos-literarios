// Verifica se todo arquivo local referenciado em HTML, CSS e JS existe.
// Rodar com: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function filesIn(dir, ext) {
  return fs.readdirSync(path.join(root, dir))
    .filter(f => f.endsWith(ext))
    .map(f => path.join(dir, f));
}

function isLocal(ref) {
  return ref && !/^(https?:|data:|mailto:|tel:|#|javascript:)/.test(ref) && !ref.includes('${');
}

function checkRefs(file, refs, baseDir) {
  const missing = [];
  for (const ref of refs) {
    const clean = ref.split(/[?#]/)[0];
    if (!isLocal(clean) || clean === '') continue;
    if (!fs.existsSync(path.join(root, baseDir, clean))) missing.push(clean);
  }
  return missing;
}

test('HTML: src, href e srcset apontam para arquivos existentes', () => {
  const missing = {};
  for (const file of filesIn('.', '.html')) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const refs = [...html.matchAll(/\b(?:src|href|srcset)="([^"]+)"/g)].map(m => m[1]);
    const found = checkRefs(file, refs, '.');
    if (found.length) missing[file] = found;
  }
  assert.deepEqual(missing, {}, 'recursos ausentes');
});

test('CSS: url() e @import apontam para arquivos existentes', () => {
  const missing = {};
  for (const file of filesIn('css', '.css')) {
    const css = fs.readFileSync(path.join(root, file), 'utf8');
    const refs = [
      ...[...css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map(m => m[1]),
      ...[...css.matchAll(/@import\s+["']([^"']+)["']/g)].map(m => m[1])
    ];
    const found = checkRefs(file, refs, 'css');
    if (found.length) missing[file] = found;
  }
  assert.deepEqual(missing, {}, 'recursos ausentes');
});

test('JS: caminhos assets/... usados nos scripts existem', () => {
  const missing = {};
  for (const file of filesIn('js', '.js')) {
    const js = fs.readFileSync(path.join(root, file), 'utf8');
    const refs = [...js.matchAll(/['"`]((?:\.\.\/)?assets\/[^'"`]+)['"`]/g)].map(m => m[1]);
    const found = checkRefs(file, refs, '.');
    if (found.length) missing[file] = found;
  }
  assert.deepEqual(missing, {}, 'recursos ausentes');
});
