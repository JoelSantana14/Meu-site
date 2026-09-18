import { PropertyType } from '../types';

export function getPropertyTypeLabel(type: PropertyType): string {
  switch (type) {
    case 'casa':
      return 'Casa';
    case 'apartamento':
      return 'Apartamento';
    case 'chacara':
      return 'Chácara / Sítio';
    case 'studio':
      return 'Studio / Kitnet';
    case 'sala_comercial':
      return 'Sala Comercial';
    case 'salao_comercial':
      return 'Salão Comercial';
    case 'area_lazer':
      return 'Área de Lazer / Festas';
    case 'terreno':
      return 'Terreno / Lote';
    case 'cobertura':
      return 'Cobertura';
    case 'comercial':
      return 'Comercial Geral';
    default:
      return 'Imóvel';
  }
}

export function formatCreciDisplay(value?: string | null, prefix: string = 'CRECI'): string {
  if (!value) return '';
  const clean = value.trim();
  if (!clean) return '';
  if (/^creci/i.test(clean)) {
    return clean;
  }
  return `${prefix}: ${clean}`;
}

export const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'chacara', label: 'Chácara / Sítio' },
  { value: 'studio', label: 'Studio / Kitnet' },
  { value: 'sala_comercial', label: 'Sala Comercial' },
  { value: 'salao_comercial', label: 'Salão Comercial' },
  { value: 'area_lazer', label: 'Área de Lazer / Espaço Eventos' },
  { value: 'terreno', label: 'Terreno / Lote' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'comercial', label: 'Outros Comerciais' }
];
