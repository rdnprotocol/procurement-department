/**
 * Normalizes image paths for Next.js Image component
 * Ensures all image paths start with '/' or are absolute URLs
 */
export function normalizeImagePath(imagePath: string | null | undefined): string {
  // Return default image if no path provided
  if (!imagePath) {
    return '/file.jpg';
  }

  // If already starts with '/' or is absolute URL, return as is
  if (imagePath.startsWith('/') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Add leading slash for relative paths
  return `/${imagePath}`;
}

/**
 * Validates if an image exists in the public directory
 * Returns the path if valid, otherwise returns default image
 */
export function getValidImagePath(imagePath: string | null | undefined): string {
  const normalizedPath = normalizeImagePath(imagePath);
  
  // List of known valid images in public directory
  const validImages = [
    '/city.png',
    '/file.jpg',
    '/footer_vector_green.png',
    '/logo-bosoo-white.png',
    '/logo-tov.jpeg',
    '/news-image-1.jpg',
    '/tov-aimag.jpg',
    '/tov.png',
    '/tumen-nasan-small.jpg',
    '/tumen-nasan.png',
    '/vectorddd.png',
    '/zassan-logo-2.png'
  ];

  // Return the path if it's in our valid list or starts with http (external)
  if (validImages.includes(normalizedPath) || normalizedPath.startsWith('http')) {
    return normalizedPath;
  }

  // Return default image if not found
  return '/file.jpg';
}