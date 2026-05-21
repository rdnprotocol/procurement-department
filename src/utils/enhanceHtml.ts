/**
 * Enhances stored rich HTML for better rendering on the website.
 *
 * Current behavior:
 * - Converts PDF links (<a href="...pdf">) into an inline embedded viewer (iframe) with the original link kept.
 * - Converts video file and common platform links into inline players with the original link kept.
 *
 * Notes:
 * - This is intentionally conservative (regex-based) to avoid bringing heavy HTML parsers.
 * - It runs on the server (used by App Router pages) and returns HTML for dangerouslySetInnerHTML.
 */
export function enhanceHtmlForInlinePdfEmbeds(html: string): string {
  if (!html) return html;

  const anchorRegex =
    /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;

  return html.replace(anchorRegex, (match, _quote: string, href: string, inner: string) => {
    const safeHref = href;
    const normalizedHref = normalizeMediaUrl(href);
    const label = (inner || '').trim();

    if (isPdfUrl(normalizedHref)) {
      const pdfLabel = label || '📄 PDF';

      return [
        '<div class="inline-pdf space-y-2">',
        `  <a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${pdfLabel}</a>`,
        '  <div class="border rounded-lg overflow-hidden bg-white">',
        `    <iframe class="ql-video" src="${safeHref}" loading="lazy"></iframe>`,
        '  </div>',
        '</div>',
      ].join('\n');
    }

    const embedUrl = getVideoEmbedUrl(href);
    if (embedUrl || isVideoUrl(normalizedHref)) {
      const videoLabel = label || 'Video';

      return [
        '<div class="inline-video space-y-2">',
        embedUrl
          ? `  <iframe class="inline-video-embed" src="${embedUrl}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
          : `  <video controls preload="metadata" src="${safeHref}"></video>`,
        `  <a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${videoLabel}</a>`,
        '</div>',
      ].join('\n');
    }

    return match;
  });
}

function normalizeMediaUrl(url: string): string {
  const withoutFragment = url.split('#')[0] || '';
  const withoutQuery = withoutFragment.split('?')[0] || '';

  try {
    return decodeURIComponent(withoutQuery).toLowerCase();
  } catch {
    return withoutQuery.toLowerCase();
  }
}

function isPdfUrl(url: string): boolean {
  return url.endsWith('.pdf');
}

function isVideoUrl(url: string): boolean {
  return (
    /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(url) ||
    url.includes('/storage/v1/object/public/procurement/videos/') ||
    url.includes('/storage/v1/object/sign/procurement/videos/') ||
    url.includes('/videos/')
  );
}

function getVideoEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const pathname = url.pathname;

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (pathname.startsWith('/embed/')) return rawUrl;
      if (pathname.startsWith('/shorts/')) {
        const id = pathname.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const id = url.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'youtu.be') {
      const id = pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'vimeo.com') {
      const id = pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (host === 'player.vimeo.com' && pathname.startsWith('/video/')) {
      return rawUrl;
    }

    if (host === 'facebook.com' || host === 'm.facebook.com' || host === 'fb.watch') {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(rawUrl)}&show_text=false&width=800`;
    }

    if (host === 'tiktok.com' || host === 'm.tiktok.com') {
      const id = getTikTokVideoId(pathname);
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }

    if (host === 'instagram.com' || host === 'm.instagram.com') {
      const embedPath = getInstagramEmbedPath(pathname);
      return embedPath ? `https://www.instagram.com${embedPath}embed/` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function getInstagramEmbedPath(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const supportedTypes = new Set(['p', 'reel', 'reels', 'tv']);
  const type = parts[0];
  const shortcode = parts[1];

  if (!type || !shortcode || !supportedTypes.has(type)) {
    return null;
  }

  const canonicalType = type === 'reels' ? 'reel' : type;
  return `/${canonicalType}/${shortcode}/`;
}

function getTikTokVideoId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const videoIndex = parts.indexOf('video');
  if (videoIndex >= 0) {
    return parts[videoIndex + 1] || null;
  }

  if (parts[0] === 'v' && parts[1]) {
    return parts[1];
  }

  return null;
}
