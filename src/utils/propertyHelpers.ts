import { PropertyType, ConfigurableOption, TopografiaType, OcupacaoUsoType } from '../types';

export function getPropertyTypeLabel(type: PropertyType, options?: ConfigurableOption[]): string {
  if (options && options.length > 0) {
    const match = options.find(o => o.category === 'tipo_imovel' && (o.value === type || o.label.toLowerCase() === (type || '').toLowerCase()));
    if (match) return match.label;
  }

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
      if (!type) return 'Imóvel';
      // If custom capitalized or slug string, format nicely
      return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
  }
}

export function getTopografiaLabel(topografia?: TopografiaType, options?: ConfigurableOption[]): string {
  if (!topografia) return '';
  if (options && options.length > 0) {
    const match = options.find(o => o.category === 'topografia' && (o.value === topografia || o.label.toLowerCase() === topografia.toLowerCase()));
    if (match) return match.label;
  }
  switch (topografia) {
    case 'plano': return 'Plano';
    case 'aclive': return 'Aclive';
    case 'declive': return 'Declive';
    case 'irregular': return 'Irregular';
    case 'outros': return 'Outros';
    default: return topografia.charAt(0).toUpperCase() + topografia.slice(1).replace(/_/g, ' ');
  }
}

export function getOcupacaoUsoLabel(ocupacao?: OcupacaoUsoType, options?: ConfigurableOption[]): string {
  if (!ocupacao) return '';
  if (options && options.length > 0) {
    const match = options.find(o => o.category === 'ocupacao_uso' && (o.value === ocupacao || o.label.toLowerCase() === ocupacao.toLowerCase()));
    if (match) return match.label;
  }
  switch (ocupacao) {
    case 'residencial': return 'Residencial';
    case 'comercial': return 'Comercial';
    case 'condominio': return 'Condomínio Fechado';
    case 'misto': return 'Misto (Residencial e Comercial)';
    case 'rural': return 'Rural / Agrícola';
    default: return ocupacao.charAt(0).toUpperCase() + ocupacao.slice(1).replace(/_/g, ' ');
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
