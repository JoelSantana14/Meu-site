export function getPropertyImageUrl(img: any): string {
  if (!img) return '';
  let url = '';
  if (typeof img === 'string') url = img;
  else if (typeof img === 'object' && img.url) url = img.url;

  if (!url) return '';
  if (url.includes('images.unsplash.com') && !url.includes('auto=format')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=crop&q=80`;
  }
  return url;
}

export function getPropertyImagesList(propertyOrImages: any): string[] {
  const raw = Array.isArray(propertyOrImages) 
    ? propertyOrImages 
    : (propertyOrImages?.images || []);
  return raw.map(getPropertyImageUrl).filter(Boolean);
}
