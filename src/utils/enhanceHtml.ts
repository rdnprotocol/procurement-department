/**
 * Enhances stored rich HTML for better rendering on the website.
 *
 * Current behavior:
 * - Converts PDF links (<a href="...pdf">) into an inline embedded viewer (iframe) with the original link kept.
 *
 * Notes:
 * - This is intentionally conservative (regex-based) to avoid bringing heavy HTML parsers.
 * - It runs on the server (used by App Router pages) and returns HTML for dangerouslySetInnerHTML.
 */
export function enhanceHtmlForInlinePdfEmbeds(html: string): string {
  if (!html) return html;

  // Match <a ... href="...pdf[?query]" ...>...</a>
  // - Case-insensitive
  // - Allows querystring after .pdf
  const pdfAnchorRegex =
    /<a\b[^>]*\bhref="([^"]*?\.pdf(?:\?[^"]*)?)"[^>]*>([\s\S]*?)<\/a>/gi;

  return html.replace(pdfAnchorRegex, (_match, href: string, inner: string) => {
    const label = (inner || '').trim() || '📄 PDF';
    const safeHref = href;

    return [
      '<div class="inline-pdf space-y-2">',
      `  <a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${label}</a>`,
      '  <div class="border rounded-lg overflow-hidden bg-white">',
      `    <iframe class="ql-video" src="${safeHref}" loading="lazy"></iframe>`,
      '  </div>',
      '</div>',
    ].join('\n');
  });
}

