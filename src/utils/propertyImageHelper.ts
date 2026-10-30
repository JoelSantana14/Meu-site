export function getPropertyImageUrl(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  return '';
}

export function getPropertyImagesList(propertyOrImages: any): string[] {
  const raw = Array.isArray(propertyOrImages) 
    ? propertyOrImages 
    : (propertyOrImages?.images || []);
  return raw.map(getPropertyImageUrl).filter(Boolean);
}
