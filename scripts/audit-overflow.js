/**
 * ========================================================
 * POKÉDEX LITE — Diagnostic Horizontal Overflow Scanner
 * Run this snippet directly in the Browser DevTools Console
 * or during headless Playwright audits to pinpoint elements
 * breaking viewport constraints.
 * ========================================================
 */

export function scanHorizontalOverflow() {
  const docWidth = document.documentElement.offsetWidth;
  const elements = Array.from(document.querySelectorAll('*'));
  const offendingElements = [];

  elements.forEach((el) => {
    const box = el.getBoundingClientRect();
    if (box.right > docWidth || box.left < 0) {
      offendingElements.push({
        element: el,
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        left: box.left,
        right: box.right,
        width: box.width,
        overflowAmount: box.right - docWidth,
      });
      // Visually highlight the offending element with a neon outline
      el.style.outline = '3px dashed #ff3860';
    }
  });

  if (offendingElements.length === 0) {
    console.log('%c✅ [SRE Audit] Zero horizontal scroll detected across DOM!', 'color: #00ff88; font-weight: bold;');
  } else {
    console.warn(`%c⚠️ [SRE Audit] Found ${offendingElements.length} elements exceeding horizontal bounds:`, 'color: #ff3860; font-weight: bold;');
    console.table(offendingElements);
  }

  return offendingElements;
}

if (typeof window !== 'undefined') {
  window.__auditOverflow = scanHorizontalOverflow;
}
