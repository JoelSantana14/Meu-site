import { ConfigurableFieldCategory, ConfigurableOption } from '../types';

export interface CategoryMetadata {
  id: ConfigurableFieldCategory;
  name: string;
  description: string;
  singularName: string;
  iconName: string;
  examplePlaceholder: string;
}

export const CONFIGURABLE_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'tipo_imovel',
    name: 'Tipos de Imóvel',
    description: 'Categorias e tipologias de imóveis ofertados no catálogo e site (Sobrado, Casa, Apartamento, Chácara, etc.)',
    singularName: 'Tipo de Imóvel',
    iconName: 'Building2',
    examplePlaceholder: 'Ex: Sobrado Triplex, Casa Térrea, Galpão Logístico, Studio...'
  },
  {
    id: 'caracteristica_imovel',
    name: 'Diferenciais do Imóvel',
    description: 'Diferenciais, acabamentos e comodidades privativas (churrasqueira, piscina, mobiliado, energia solar, etc.)',
    singularName: 'Diferencial do Imóvel',
    iconName: 'Sparkles',
    examplePlaceholder: 'Ex: Energia Solar, Varanda Gourmet, Quarto de Empregada, Mobiliado...'
  },
  {
    id: 'caracteristica_empreendimento',
    name: 'Características do Empreendimento / Lazer',
    description: 'Comodidades do condomínio, áreas comuns, clube, segurança e lazer (piscina, playground, quadras, pista de caminhada)',
    singularName: 'Característica do Empreendimento',
    iconName: 'ShieldCheck',
    examplePlaceholder: 'Ex: Piscina Aquecida, Pista de Caminhada, Portaria 24h, Quadra de Tênis...'
  },
  {
    id: 'caracteristica_regiao',
    name: 'Características da Região / Proximidades',
    description: 'Serviços, comércios e facilidades ao redor do imóvel (escola, posto de saúde, mercado, academia, etc.)',
    singularName: 'Característica da Região',
    iconName: 'MapPin',
    examplePlaceholder: 'Ex: Próximo ao Metrô, Perto de Escolas, Mercado 24h, Posto de Saúde...'
  },
  {
    id: 'tarja_foto',
    name: 'Tarjas de Foto (Padrão e Personalizadas)',
    description: 'Selos, faixas e tarjas visuais exibidas sobre a foto de capa e cards de imóveis',
    singularName: 'Tarja de Foto',
    iconName: 'Award',
    examplePlaceholder: 'Ex: Destaque, Oportunidade, Lançamento, Exclusivo, Sobrado, Preço Reduzido...'
  },
  {
    id: 'topografia',
    name: 'Topografia do Solo',
    description: 'Declividade e perfil do relevo (terrenos, chácaras e construções)',
    singularName: 'Topografia',
    iconName: 'Mountain',
    examplePlaceholder: 'Ex: Plano, Aclive Suave, Em Patamares, Declive...'
  },
  {
    id: 'ocupacao_uso',
    name: 'Tipo de Ocupação e Uso',
    description: 'Destinação do zoneamento ou estilo de ocupação do solo (Rural, Residencial, Condomínio, Comercial)',
    singularName: 'Tipo de Ocupação/Uso',
    iconName: 'TreePine',
    examplePlaceholder: 'Ex: Residencial, Condomínio Fechado, Rural, Comercial, Misto...'
  },
  {
    id: 'estagio_negociacao',
    name: 'Estágios de Negociação (Fluxo A e B)',
    description: 'Fases da esteira de vendas e pós-venda (Financiamento bancário vs Cartório / À vista)',
    singularName: 'Estágio de Negociação',
    iconName: 'Sliders',
    examplePlaceholder: 'Ex: Análise de Crédito Bancário, Vistoria de Avaliação, Minuta de Escritura...'
  },
  {
    id: 'paleta_tom',
    name: 'Paleta de Tons Rápidos',
    description: 'Esquemas cromáticos predefinidos e personalizados para o portal e CRM',
    singularName: 'Tom / Paleta',
    iconName: 'Palette',
    examplePlaceholder: 'Ex: Azul Corporativo, Dourado & Preto Luxo, Verde Esmeralda...'
  },
  {
    id: 'quadro_banner',
    name: 'Quadros do Banner Principal',
    description: 'Slides, chamadas em destaque e imagens rotativas do topo do portal',
    singularName: 'Quadro do Banner',
    iconName: 'Layout',
    examplePlaceholder: 'Ex: Casas em Condomínio, Lançamentos na Planta, Terrenos...'
  },
  {
    id: 'quadro_vitrine',
    name: 'Quadros & Cards da Vitrine',
    description: 'Blocos de indicadores de confiança, diferenciais de atendimento e destaques da vitrine',
    singularName: 'Quadro da Vitrine',
    iconName: 'Star',
    examplePlaceholder: 'Ex: Anos de Mercado, Segurança Jurídica, Atendimento Personalizado...'
  },
  {
    id: 'rede_social',
    name: 'Redes Sociais e Contatos',
    description: 'Canais de comunicação, redes e links rápidos para atendimento do cliente',
    singularName: 'Canal / Rede Social',
    iconName: 'MessageCircle',
    examplePlaceholder: 'Ex: WhatsApp Comercial, Instagram Oficial, Canal YouTube...'
  },
  {
    id: 'item_rodape',
    name: 'Itens e Links do Rodapé',
    description: 'Links institucionais, políticas, páginas e atalhos exibidos no rodapé do portal',
    singularName: 'Item do Rodapé',
    iconName: 'List',
    examplePlaceholder: 'Ex: Quem Somos, Simule Financiamento, Termos LGPD, Fale Conosco...'
  },
  {
    id: 'bloco_conteudo',
    name: 'Blocos de Conteúdo e Páginas',
    description: 'Seções personalizadas em HTML, avisos promocionais e blocos institucionais',
    singularName: 'Bloco de Conteúdo',
    iconName: 'Code',
    examplePlaceholder: 'Ex: Banner Promocional Feirão, Vídeo Institucional, Tabela de Índices...'
  },
  {
    id: 'finalidade',
    name: 'Finalidade da Transação',
    description: 'Modalidade de negociação do imóvel (Venda, Aluguel, Temporada, Permuta)',
    singularName: 'Finalidade',
    iconName: 'Tag',
    examplePlaceholder: 'Ex: Venda, Aluguel, Temporada, Permuta...'
  }
];

export const CONFIGURABLE_CATEGORIES_LABELS: Record<ConfigurableFieldCategory, string> = {
  tipo_imovel: 'Tipos de Imóvel',
  caracteristica_imovel: 'Diferenciais do Imóvel',
  caracteristica_empreendimento: 'Características do Empreendimento / Lazer',
  caracteristica_regiao: 'Características da Região',
  tarja_foto: 'Tarjas de Foto',
  topografia: 'Topografia do Solo',
  ocupacao_uso: 'Tipo de Ocupação/Uso',
  estagio_negociacao: 'Estágios de Negociação (Fluxo A e B)',
  paleta_tom: 'Paleta de Tons Rápidos',
  quadro_banner: 'Quadros do Banner',
  quadro_vitrine: 'Quadros da Vitrine',
  rede_social: 'Redes Sociais & Contatos',
  item_rodape: 'Itens do Rodapé',
  bloco_conteudo: 'Blocos de Conteúdo',
  finalidade: 'Finalidade da Transação'
};

export function slugifyOption(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export const INITIAL_CONFIGURABLE_OPTIONS: ConfigurableOption[] = [
  // 1. Tipos de Imóvel
  { id: 'opt_tipo_casa', category: 'tipo_imovel', label: 'Casa', value: 'casa', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_apto', category: 'tipo_imovel', label: 'Apartamento', value: 'apartamento', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_chacara', category: 'tipo_imovel', label: 'Chácara / Sítio', value: 'chacara', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_terreno', category: 'tipo_imovel', label: 'Terreno / Lote', value: 'terreno', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_condominio', category: 'tipo_imovel', label: 'Casa em Condomínio Fechado', value: 'casa_condominio', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_cobertura', category: 'tipo_imovel', label: 'Cobertura', value: 'cobertura', order: 6, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_studio', category: 'tipo_imovel', label: 'Studio / Kitnet', value: 'studio', order: 7, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_sala', category: 'tipo_imovel', label: 'Sala Comercial', value: 'sala_comercial', order: 8, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_salao', category: 'tipo_imovel', label: 'Salão Comercial', value: 'salao_comercial', order: 9, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_lazer', category: 'tipo_imovel', label: 'Área de Lazer / Espaço Eventos', value: 'area_lazer', order: 10, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_galpao', category: 'tipo_imovel', label: 'Galpão Industrial / Logístico', value: 'galpao', order: 11, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_sobrado', category: 'tipo_imovel', label: 'Sobrado Residencial', value: 'sobrado', order: 12, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_flat', category: 'tipo_imovel', label: 'Flat / Apart-Hotel', value: 'flat', order: 13, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tipo_comercial', category: 'tipo_imovel', label: 'Comercial Geral', value: 'comercial', order: 14, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 2. Características do Imóvel / Empreendimento
  { id: 'opt_feat_piscina', category: 'caracteristica_imovel', label: 'Piscina', value: 'piscina', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_varanda', category: 'caracteristica_imovel', label: 'Varanda Gourmet', value: 'varanda_gourmet', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_ar', category: 'caracteristica_imovel', label: 'Ar Condicionado', value: 'ar_condicionado', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_churrasqueira', category: 'caracteristica_imovel', label: 'Churrasqueira', value: 'churrasqueira', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_planejados', category: 'caracteristica_imovel', label: 'Móveis Planejados', value: 'moveis_planejados', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_solar', category: 'caracteristica_imovel', label: 'Aquecimento Solar / Energia Fotovoltaica', value: 'energia_solar', order: 6, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_portaria', category: 'caracteristica_imovel', label: 'Portaria 24h & Segurança', value: 'portaria_24h', order: 7, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_academia', category: 'caracteristica_imovel', label: 'Academia / Espaço Fitness', value: 'academia_fitness', order: 8, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_playground', category: 'caracteristica_imovel', label: 'Playground Infantil', value: 'playground', order: 9, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_quadra', category: 'caracteristica_imovel', label: 'Quadra Poliesportiva / Beach Tennis', value: 'quadra_esportes', order: 10, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_caminhada', category: 'caracteristica_imovel', label: 'Pista de Caminhada', value: 'pista_caminhada', order: 11, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_festas', category: 'caracteristica_imovel', label: 'Salão de Festas', value: 'salao_festas', order: 12, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_edicula', category: 'caracteristica_imovel', label: 'Edícula nos Fundos', value: 'edicula', order: 13, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_closet', category: 'caracteristica_imovel', label: 'Suíte com Closet', value: 'suite_closet', order: 14, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_homeoffice', category: 'caracteristica_imovel', label: 'Escritório / Home Office', value: 'home_office', order: 15, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_quintal', category: 'caracteristica_imovel', label: 'Quintal Amplo / Jardim', value: 'quintal_amplo', order: 16, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_elevador', category: 'caracteristica_imovel', label: 'Elevador Social & Serviço', value: 'elevador', order: 17, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_feat_pet', category: 'caracteristica_imovel', label: 'Pet Place / Espaço Pet', value: 'pet_place', order: 18, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 3. Características da Região / Proximidades
  { id: 'opt_reg_escola', category: 'caracteristica_regiao', label: 'Próximo a Escolas e Colégios', value: 'escolas_colegios', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_saude', category: 'caracteristica_regiao', label: 'Posto de Saúde / Hospital', value: 'posto_saude_hospital', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_mercado', category: 'caracteristica_regiao', label: 'Supermercados e Mercados', value: 'supermercados', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_farmacia', category: 'caracteristica_regiao', label: 'Farmácias e Drogarias', value: 'farmacias', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_academia', category: 'caracteristica_regiao', label: 'Academias e Centros Esportivos', value: 'academias', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_shopping', category: 'caracteristica_regiao', label: 'Shopping Centers e Galerias', value: 'shopping_centers', order: 6, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_transporte', category: 'caracteristica_regiao', label: 'Transporte Público / Ponto de Ônibus', value: 'transporte_publico', order: 7, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_padaria', category: 'caracteristica_regiao', label: 'Padarias e Confeitarias', value: 'padarias', order: 8, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_restaurante', category: 'caracteristica_regiao', label: 'Restaurantes, Cafés e Bares', value: 'restaurantes_bares', order: 9, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_parque', category: 'caracteristica_regiao', label: 'Parques, Praças e Áreas Verdes', value: 'parques_pracas', order: 10, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_rodovia', category: 'caracteristica_regiao', label: 'Fácil Acesso a Rodovias e Avenidas', value: 'facil_acesso_rodovias', order: 11, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_banco', category: 'caracteristica_regiao', label: 'Agências Bancárias e Caixas Eletrônicos', value: 'agencias_bancarias', order: 12, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_reg_universidade', category: 'caracteristica_regiao', label: 'Faculdades e Universidades', value: 'faculdades_universidades', order: 13, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 4. Topografia
  { id: 'opt_topo_plano', category: 'topografia', label: 'Plano', value: 'plano', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_topo_aclive_suave', category: 'topografia', label: 'Aclive Suave', value: 'aclive_suave', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_topo_aclive_forte', category: 'topografia', label: 'Aclive Acentuado', value: 'aclive_acentuado', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_topo_declive_suave', category: 'topografia', label: 'Declive Suave', value: 'declive_suave', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_topo_declive_forte', category: 'topografia', label: 'Declive Acentuado', value: 'declive_acentuado', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_topo_irregular', category: 'topografia', label: 'Irregular', value: 'irregular', order: 6, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_topo_patamares', category: 'topografia', label: 'Em Patamares / Terraplanado', value: 'patamares', order: 7, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_topo_ondulado', category: 'topografia', label: 'Ondulado / Relevo Misto', value: 'ondulado', order: 8, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 5. Tipo de Ocupação / Uso
  { id: 'opt_uso_residencial', category: 'ocupacao_uso', label: 'Residencial', value: 'residencial', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_uso_condominio', category: 'ocupacao_uso', label: 'Condomínio Fechado', value: 'condominio', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_uso_comercial', category: 'ocupacao_uso', label: 'Comercial', value: 'comercial', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_uso_misto', category: 'ocupacao_uso', label: 'Misto (Residencial e Comercial)', value: 'misto', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_uso_rural', category: 'ocupacao_uso', label: 'Rural / Agrícola', value: 'rural', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_uso_loteamento', category: 'ocupacao_uso', label: 'Loteamento Aberto', value: 'loteamento_aberto', order: 6, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_uso_industrial', category: 'ocupacao_uso', label: 'Industrial / Logístico', value: 'industrial', order: 7, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 6. Finalidade
  { id: 'opt_fin_venda', category: 'finalidade', label: 'Venda', value: 'venda', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_fin_aluguel', category: 'finalidade', label: 'Aluguel / Locação', value: 'aluguel', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_fin_temporada', category: 'finalidade', label: 'Aluguel por Temporada', value: 'temporada', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_fin_permuta', category: 'finalidade', label: 'Permuta / Aceita Troca', value: 'permuta', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 7. Tarjas de Foto (Padrão e Personalizadas)
  { id: 'opt_tarja_destaque', category: 'tarja_foto', label: 'Destaque', value: 'destaque', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_oportunidade', category: 'tarja_foto', label: 'Oportunidade', value: 'oportunidade', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_lancamento', category: 'tarja_foto', label: 'Lançamento', value: 'lancamento', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_exclusivo', category: 'tarja_foto', label: 'Exclusivo', value: 'exclusivo', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_pronto', category: 'tarja_foto', label: 'Pronto para Morar', value: 'pronto_para_morar', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_preco_reduzido', category: 'tarja_foto', label: 'Preço Reduzido', value: 'preco_reduzido', order: 6, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_financiamento', category: 'tarja_foto', label: 'Aceita Financiamento', value: 'aceita_financiamento', order: 7, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_sobrado', category: 'tarja_foto', label: 'Sobrado', value: 'sobrado', order: 8, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_tarja_proprietario', category: 'tarja_foto', label: 'Direto com Proprietário', value: 'direto_proprietario', order: 9, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 8. Estágios de Negociação (Fluxos A e B)
  { id: 'opt_est_novo', category: 'estagio_negociacao', label: 'Novo Lead / Contato Inicial', value: 'novo_lead', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_est_visita', category: 'estagio_negociacao', label: 'Visita Agendada', value: 'visita_agendada', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_est_proposta', category: 'estagio_negociacao', label: 'Proposta Enviada', value: 'proposta_enviada', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_est_analise_credito', category: 'estagio_negociacao', label: '[Fluxo A] Análise de Crédito Bancário', value: 'analise_credito', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_est_vistoria_banco', category: 'estagio_negociacao', label: '[Fluxo A] Vistoria de Avaliação do Banco', value: 'vistoria_banco', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_est_certidoes_cartorio', category: 'estagio_negociacao', label: '[Fluxo B] Emissão de Certidões & Cartório', value: 'certidoes_cartorio', order: 6, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_est_minuta_escritura', category: 'estagio_negociacao', label: '[Fluxo B] Minuta de Escritura Pública', value: 'minuta_escritura', order: 7, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_est_fechado', category: 'estagio_negociacao', label: 'Fechado / Ganho (Venda Efetivada)', value: 'fechado_ganho', order: 8, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 9. Paleta de Tons Rápidos
  { id: 'opt_pal_azul', category: 'paleta_tom', label: 'Azul Corporativo Moderno', value: 'azul_corporativo', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_pal_verde', category: 'paleta_tom', label: 'Verde Imobiliário Esmeralda', value: 'verde_imobiliario', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_pal_dourado', category: 'paleta_tom', label: 'Dourado & Preto Luxo', value: 'dourado_luxo', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_pal_ambar', category: 'paleta_tom', label: 'Âmbar Elegance', value: 'ambar_elegance', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_pal_terracota', category: 'paleta_tom', label: 'Vinho Terracota', value: 'vinho_terracota', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 10. Quadros do Banner Principal
  { id: 'opt_bnr_casas', category: 'quadro_banner', label: 'Banner: Casas em Condomínio Fechado', value: 'banner_casas_condominio', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_bnr_lancamento', category: 'quadro_banner', label: 'Banner: Lançamentos & Planta', value: 'banner_lancamentos', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_bnr_terrenos', category: 'quadro_banner', label: 'Banner: Terrenos & Chácaras', value: 'banner_terrenos_chacaras', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_bnr_comercial', category: 'quadro_banner', label: 'Banner: Imóveis Comerciais & Salas', value: 'banner_comercial', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 11. Quadros e Cards da Vitrine
  { id: 'opt_vit_experiencia', category: 'quadro_vitrine', label: 'Card Confiança: Anos de Experiência', value: 'card_confianca_experiencia', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_vit_juridico', category: 'quadro_vitrine', label: 'Card Confiança: Segurança Jurídica', value: 'card_confianca_juridico', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_vit_atendimento', category: 'quadro_vitrine', label: 'Card Confiança: Atendimento Personalizado', value: 'card_confianca_atendimento', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_vit_financiamento', category: 'quadro_vitrine', label: 'Card Confiança: Financiamento Aprovado', value: 'card_confianca_financiamento', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 12. Redes Sociais e Contatos
  { id: 'opt_soc_whatsapp', category: 'rede_social', label: 'WhatsApp Comercial Direto', value: 'whatsapp_comercial', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_soc_instagram', category: 'rede_social', label: 'Instagram Oficial', value: 'instagram_oficial', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_soc_facebook', category: 'rede_social', label: 'Página no Facebook', value: 'facebook_pagina', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_soc_youtube', category: 'rede_social', label: 'Canal de Vídeos no YouTube', value: 'youtube_canal', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_soc_linkedin', category: 'rede_social', label: 'Perfil no LinkedIn', value: 'linkedin_perfil', order: 5, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 13. Itens e Links do Rodapé
  { id: 'opt_rod_quemsomos', category: 'item_rodape', label: 'Link: Quem Somos / História', value: 'link_quem_somos', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_rod_simulacao', category: 'item_rodape', label: 'Link: Simulação de Financiamento', value: 'link_simulacao', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_rod_indices', category: 'item_rodape', label: 'Link: Índices Oficiais (INCC/IGP-M)', value: 'link_indices', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_rod_lgpd', category: 'item_rodape', label: 'Link: Política de Privacidade LGPD', value: 'link_lgpd', order: 4, active: true, createdAt: '2026-01-01', isSystemDefault: true },

  // 14. Blocos de Conteúdo e Páginas
  { id: 'opt_blk_hero', category: 'bloco_conteudo', label: 'Bloco de Topo: Chamada Principal', value: 'bloco_hero', order: 1, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_blk_destaques', category: 'bloco_conteudo', label: 'Bloco Intermediário: Super Destaques', value: 'bloco_destaques', order: 2, active: true, createdAt: '2026-01-01', isSystemDefault: true },
  { id: 'opt_blk_custompage', category: 'bloco_conteudo', label: 'Bloco de Página Personalizada (HTML)', value: 'bloco_custom_page', order: 3, active: true, createdAt: '2026-01-01', isSystemDefault: true }
];
