import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');
const styleNames = [
  'bodyStyle',
  'cardStyle',
  'containerStyle',
  'mutedStyle',
  'placeholderGradient',
  'sectionBaseStyle',
  'surfaceStyle',
  'titleStyle',
  'wideContainerStyle',
];

for (const dir of fs.readdirSync(src, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of fs.readdirSync(path.join(src, dir.name)).filter((x) => x.startsWith('Layout') && x.endsWith('.tsx'))) {
    const fp = path.join(src, dir.name, f);
    let t = fs.readFileSync(fp, 'utf8');
    t = t.replace(/^import type \{ LayoutProps \} from '\.\.\/types';\r?\n/m, '');
    t = t.replace(/^import \{[\s\S]*?\} from '\.\.\/styles';\r?\n/m, '');
    const afterImports = t.replace(/^import[\s\S]*?from '\.\.\/content';\r?\n/m, '');
    const used = styleNames.filter((n) => new RegExp(`\\b${n}\\b`).test(afterImports) || new RegExp(`\\b${n}\\b`).test(t));
    // detect usage in remaining file (including content import section body)
    const usedFinal = styleNames.filter((n) => {
      const re = new RegExp(`\\b${n}\\b`, 'g');
      return (t.match(re) || []).length > 0;
    });
    const importBlock =
      `import type { LayoutProps } from '../types';\n` +
      `import {\n  ${usedFinal.join(',\n  ')}\n} from '../styles';\n`;
    fs.writeFileSync(fp, importBlock + t);
  }
}
console.log('pruned');
