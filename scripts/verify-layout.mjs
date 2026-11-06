import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

// CI owns this temporary dependency; it is not part of Atlas's browser bundle.
const require = createRequire(`${process.env.ATLAS_BROWSER_TOOLS}/package.json`);
const { chromium } = require('playwright');
await mkdir('qa-evidence/layout', { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    for (const route of ['', '#mousepads', '#keyboards', '#switches', '#sensitivity']) {
      await page.goto(`http://127.0.0.1:4173/${route}`);
      await page.locator(route === '#sensitivity' ? '.openmouse-companion' : '.consumer-grid').waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Page overflow: ${route} at ${width}`);
      if (route === '#sensitivity') {
        const link = page.getByRole('link', { name: 'Open OpenMouse', exact: true });
        assert.equal(await link.getAttribute('href'), 'https://control.openmouse.app/');
        await link.scrollIntoViewIfNeeded();
      }
      await page.screenshot({ path: `qa-evidence/layout/${width}-${route.slice(1) || 'browse'}.png` });
      if (route === '') {
        await page.locator('.consumer-grid').getByRole('button', { name: /Details/ }).first().click();
        const drawer = page.locator('.consumer-drawer');
        await drawer.locator('.openmouse-companion').waitFor();
        await drawer.locator('.consumer-drawer-actions').scrollIntoViewIfNeeded();
        const overflowing = await drawer.locator('.consumer-drawer-actions button, .openmouse-links a').evaluateAll(nodes => nodes.filter(node => {
          const box = node.getBoundingClientRect();
          const parent = node.parentElement.getBoundingClientRect();
          return box.left < parent.left - 1 || box.right > parent.right + 1;
        }).map(node => node.textContent));
        assert.deepEqual(overflowing, [], `Drawer control overflow at ${width}`);
        await page.screenshot({ path: `qa-evidence/layout/${width}-drawer.png` });
        await page.keyboard.press('Escape');
        await drawer.waitFor({ state: 'hidden' });
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log('Layout checks passed at 390 and 1440 CSS pixels.');
