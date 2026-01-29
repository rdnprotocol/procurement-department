/**
 * Utilities to keep the admin editor stable.
 *
 * We prefer storing PDF references as plain links in HTML, and only enhance them
 * into inline embeds at render time on public pages.
 */

/**
 * Replace embedded iframes (Quill "video" embeds) that point to PDFs
 * with simple anchor links for editing.
 */
export function normalizeHtmlForEditor(html: string): string {
  if (!html) return html;

  // Quill stores "video" embeds as <iframe class="ql-video" ...>.
  // In the admin editor we don't want giant embedded iframes; we show them as links instead.
  // Keep common video providers intact.
  const iframeRegex =
    /<iframe\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*>(?:<\/iframe>)?/gi;

  return html.replace(iframeRegex, (match, _q: string, src: string) => {
    const srcLower = String(src).toLowerCase();
    const isKnownVideo =
      srcLower.includes('youtube.com') ||
      srcLower.includes('youtu.be') ||
      srcLower.includes('vimeo.com');

    // Only normalize Quill embeds (ql-video) or file-like iframes; keep known video embeds.
    const isQuillVideo = /class=(["'])[^"']*\bql-video\b[^"']*\1/i.test(match);
    if (!isQuillVideo || isKnownVideo) {
      return match;
    }

    const safeSrc = src;
    const label = srcLower.includes('.pdf') ? '📄 PDF' : '📎 Файл';
    return `<a href="${safeSrc}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
}

/**
 * Normalize HTML before saving from the editor.
 * Currently: same as editor normalization (strip PDF iframes to links).
 */
export function normalizeHtmlForStorage(html: string): string {
  return normalizeHtmlForEditor(html);
}

