export type UserRole = 'admin' | 'corretor' | 'recepcionista' | 'leitor';

export interface UserPermissions {
  canAccessCrm?: boolean;
  canAccessImoveis?: boolean;
  canAccessAgenda?: boolean;
  canAccessComissoes?: boolean;
  canAccessRelatorios?: boolean;
  canAccessChat?: boolean;
  canAccessConfiguracoes?: boolean;
  canAccessUsuarios?: boolean;
  canAccessDocumentos?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  whatsapp: string;
  avatar: string;
  commissionRate: number; // Percentage e.g. 5.0
  bio?: string;
  creci?: string;
  cnai?: string; // CNAI do Corretor (Cadastro Nacional de Avaliadores Imobiliários)
  cnae?: string; // Compatibilidade legada
  secondaryPhone?: string; // Telefone de recado
  address?: string; // Endereço completo
  isMasterAdmin?: boolean;
  status?: 'ativo' | 'convidado' | 'bloqueado';
  inviteToken?: string;
  invitedAt?: string;
  permissions?: UserPermissions;
  documents?: GeneratedDocument[];
}

export type PropertyType =
  | 'casa'
  | 'apartamento'
  | 'chacara'
  | 'studio'
  | 'sala_comercial'
  | 'salao_comercial'
  | 'area_lazer'
  | 'terreno'
  | 'cobertura'
  | 'comercial'
  | string;

export type PropertyPurpose = 'venda' | 'aluguel' | string;
export type HighlightLevel = 'super_destaque' | 'destaque' | 'standard';
export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido';

export type TopografiaType = 'plano' | 'aclive' | 'declive' | 'irregular' | 'outros' | string;
export type OcupacaoUsoType = 'rural' | 'residencial' | 'condominio' | 'comercial' | 'misto' | string;

export type ConfigurableFieldCategory =
  | 'tipo_imovel'
  | 'caracteristica_imovel'
  | 'caracteristica_empreendimento'
  | 'caracteristica_regiao'
  | 'topografia'
  | 'ocupacao_uso'
  | 'tarja_foto'
  | 'estagio_negociacao'
  | 'paleta_tom'
  | 'quadro_banner'
  | 'quadro_vitrine'
  | 'rede_social'
  | 'item_rodape'
  | 'bloco_conteudo'
  | 'finalidade';

export interface ConfigurableOption {
  id: string;
  category: ConfigurableFieldCategory;
  label: string;
  value: string;
  order: number;
  active: boolean; // default true. If false, hidden from new form selects, preserved in old properties
  createdAt: string;
  updatedAt?: string;
  isSystemDefault?: boolean;
}

export interface FiftyPartnerInfo {
  enabled: boolean;
  partnerName: string;
  partnerCreci: string;
  partnerEmail: string;
  partnerPhone: string;
  partnerPercentage: number; // e.g. 50 (%)
  partnerAgency?: string;
  notes?: string;
  contractGenerated?: boolean;
  contractGeneratedAt?: string;
}

export type LegalDocType =
  | 'ficha_captacao'
  | 'recibo_aluguel'
  | 'recibo_comissao'
  | 'contrato_parceria'
  | 'contrato_corretagem';

export interface GeneratedDocument {
  id: string;
  type: LegalDocType;
  title: string;
  content: string; // Full formatted document text/markdown
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorId: string;
  propertyId?: string;
  propertyCode?: string;
  propertyTitle?: string;
  leadId?: string;
  leadName?: string;
  agentId?: string;
  agentName?: string;
  partnerName?: string;
  value?: number;
  status: 'rascunho' | 'emitido' | 'assinado' | 'arquivado';
  archived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
  meta?: Record<string, any>;
}

export interface Property {
  id: string;
  code: string;
  title: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  condoFee?: number;
  propertyTax?: number; // IPTU
  areaSqM: number;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parkingSpaces: number;
  highlight: HighlightLevel;
  status: PropertyStatus;
  address: {
    street: string;
    number?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    complement?: string;
  };
  features: string[];
  featuresRegiao?: string[]; // Características da região/vizinhança (Escola, Hospital, Supermercado, etc.)
  featuresEmpreendimento?: string[]; // Características do condomínio/empreendimento
  images: string[];
  imageDescriptions?: Record<string, string>; // Maps image URL or ID/Index to description/caption
  tarja?: string; // Tarja de foto padrão ou personalizada (Ex: 'Destaque', 'Oportunidade', 'Lançamento', 'Exclusivo', etc.)
  tarjaCustomColor?: string; // Cor personalizada para a tarja
  agentId: string;
  createdAt: string;
  
  // Áreas e metragens detalhadas
  areaTerreno?: number; // Tamanho / Área do Terreno em m²
  areaConstruida?: number; // Área Construída em m²
  areaComum?: number; // Área Comum em m²
  areaPrivativa?: number; // Área Privativa em m²
  areaTotal?: number; // Área Total em m²
  
  // Specific fields for terrenos, chácaras, casas e condomínios
  testadaMeters?: number; // Metragem de frente do lote (terrenos, chácaras e casas)
  topografia?: TopografiaType; // plano, aclive, declive, irregular, outros
  ocupacaoUso?: OcupacaoUsoType; // rural, residencial, condominio
  iptuValue?: number; // IPTU formatado
  
  // Fifty / Indicação de corretor parceiro
  fifty?: FiftyPartnerInfo;
  
  // Documentos arquivados no imóvel
  documents?: GeneratedDocument[];

  // Arquivamento e histórico
  archived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
}

export interface DailyVisitStat {
  date: string; // YYYY-MM-DD
  visits: number;
  uniques: number;
}

export interface SiteAnalyticsStats {
  id: string; // 'site_stats'
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  todayUniques: number;
  todayDate: string; // YYYY-MM-DD
  weeklyVisits: number;
  monthlyVisits: number;
  lastVisitedAt: string;
  history?: DailyVisitStat[];
}

export type PipelineStage = 
  | 'novo'
  | 'contato'
  | 'visita'
  | 'proposta'
  | 'negociacao'
  | 'fechado'
  | 'perdido';

export interface LeadNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface NegotiationLog {
  id: string;
  stepId: string;
  stepLabel: string;
  authorName: string;
  timestamp: string;
  notes?: string;
}

export interface NegotiationDoc {
  id: string;
  part: 'vendedor' | 'comprador';
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  archived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  preferredType?: PropertyType;
  budgetMax?: number;
  preferredNeighborhood?: string;
  stage: PipelineStage;
  agentId: string;
  interestedPropertyId?: string;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
  
  // Qualification & Address fields for contracts and CEP auto-fill
  cpfCnpj?: string;
  rgIe?: string;
  profession?: string;
  nationality?: string;
  maritalStatus?: string;
  address?: {
    street: string;
    number?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    complement?: string;
  };
  
  // Fifty Partner info for lead
  fifty?: FiftyPartnerInfo;
  
  // Documents associated with lead
  documents?: GeneratedDocument[];

  // Negotiation Flows (Financiamento vs Cartório)
  negotiationFlow?: 'financiamento' | 'cartorio';
  negotiationStep?: string;
  negotiationLogs?: NegotiationLog[];
  negotiationDocs?: NegotiationDoc[];

  // Arquivamento e histórico
  archived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
}

export type CrmTaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export type CrmTaskType =
  | 'ligacao'
  | 'whatsapp'
  | 'visita'
  | 'proposta'
  | 'documento'
  | 'followup'
  | 'reuniao'
  | 'outro';

export type CrmTaskStatus = 'pendente' | 'concluida' | 'cancelada';

export interface CrmTask {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone?: string;
  leadEmail?: string;
  agentId: string;
  agentName: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: CrmTaskPriority;
  taskType: CrmTaskType;
  status: CrmTaskStatus;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
}

export type VisitStatus = 'agendada' | 'confirmada' | 'realizada' | 'cancelada';

export interface VisitAppointment {
  id: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: VisitStatus;
  notes?: string;
  createdAt: string;
}

export type CommissionStatus = 'pendente' | 'liberado' | 'pago';

export interface Commission {
  id: string;
  propertyId: string;
  leadId: string;
  agentId: string;
  saleValue: number;
  totalCommissionPct: number; // e.g. 6%
  totalCommissionAmount: number;
  agentCommissionPct: number; // e.g. 50% of total or direct %
  agentCommissionAmount: number;
  agencyCommissionAmount: number;
  paymentStatus: CommissionStatus;
  saleDate: string; // YYYY-MM-DD
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  receiverId?: string; // null if channel
  channel: 'geral' | 'gerentes' | 'direto';
  text: string;
  timestamp: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'lead' | 'imovel' | 'visita' | 'venda' | 'chat' | 'sistema' | 'documento';
  linkTab?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: 'imovel' | 'cliente' | 'documento' | 'parceria_fifty' | 'sistema';
  details: string;
  entityId?: string;
}

export interface CustomHtmlBlock {
  id: string;
  title: string;
  position: 'hero_banner' | 'below_highlights' | 'sidebar' | 'footer' | 'custom_page';
  htmlContent: string;
  active: boolean;
  slug?: string;
}

export type Language = 'pt' | 'en' | 'es';

export interface ExclusiveLaunchConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  location: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  features: string[];
  ctaText: string;
  ctaWhatsappMsg: string;
  statusTag?: string;
}

export interface SiteConfig {
  companyName: string;
  creciJuridico?: string;
  creciFisico?: string;
  cnpj?: string;
  primaryColorHex: string;
  accentColorHex: string;
  // Esquema de Cores para Contornos e Detalhes
  colorTheme?: 'padrao' | 'verde' | 'vermelho' | 'azul' | 'dourado_preto';
  contourColorHex?: string; // Cor personalizada para contornos e bordas
  detailsColorHex?: string; // Cor personalizada para detalhes e acentos
  enableCustomContours?: boolean; // Ativação opcional de contornos destacados
  darkMode: boolean;
  backgroundMode?: 'pure_white' | 'light_warm' | 'dark';
  themeMode?: 'light' | 'dark' | 'system';
  language: Language;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logoText: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerImage?: string;
  heroBannerPreset?: string;
  // Banner Customization
  heroTitleOpacity?: number; // 0 to 100 (%)
  heroTitleFontSize?: number; // Font size in px
  heroTitlePositionY?: number; // 0 to 100 (%) vertical position (0=Top, 50=Center, 80=Base)
  showBrokerPhotoOnProperties: boolean;
  layoutPreset: 'clean_claro' | 'warm_claro' | 'corporativo_claro' | 'luxo_escuro' | 'banner_hero_destaques';
  // Dados do Corretor Autônomo
  brokerName?: string;
  brokerCreci?: string;
  brokerCnae?: string;
  brokerCnai?: string;
  brokerPhone?: string;
  brokerSecondaryPhone?: string; // Telefone de recado
  brokerWhatsapp?: string;
  brokerEmail?: string;
  brokerAddress?: string;
  brokerAvatarUrl?: string;
  brokerBio?: string;
  brokerRegion?: string;
  showQuemSomosPage?: boolean;
  showIndicesPage?: boolean;
  showNoticiasPage?: boolean;
  showTrustStatsBar?: boolean;
  showLgpdBanner?: boolean;
  lgpdBannerText?: string;
  lgpdDpoEmail?: string;
  // Partner Websites (Up to 3)
  showPartnerSites?: boolean;
  partnerSite1Name?: string;
  partnerSite1Url?: string;
  partnerSite1Desc?: string;
  partnerSite2Name?: string;
  partnerSite2Url?: string;
  partnerSite2Desc?: string;
  partnerSite3Name?: string;
  partnerSite3Url?: string;
  partnerSite3Desc?: string;
  // Lançamento Exclusivo em Destaque
  exclusiveLaunch?: ExclusiveLaunchConfig;
  // Marca d'água para imagens
  enableWatermark?: boolean;
  watermarkUrl?: string;
  watermarkOpacity?: number; // 10 a 100 (%)
  watermarkPosition?: 'center' | 'bottom-right' | 'top-right' | 'bottom-left' | 'repeat';
  watermarkSize?: 'small' | 'medium' | 'large';
  // Logo Display Configuration
  logoSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  logoPosition?: 'left' | 'right';
  // Indicadores Numéricos de Confiança (4 Cards)
  trustStat1Value?: string;
  trustStat1Label?: string;
  trustStat2Value?: string;
  trustStat2Label?: string;
  trustStat3Value?: string;
  trustStat3Label?: string;
  trustStat4Value?: string;
  trustStat4Label?: string;
  // Diferenciais do Negócio (4 Cards de Proposta de Valor)
  diff1Title?: string;
  diff1Desc?: string;
  diff2Title?: string;
  diff2Desc?: string;
  diff3Title?: string;
  diff3Desc?: string;
  diff4Title?: string;
  diff4Desc?: string;
  // Redes Sociais
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  // SEO & Indexação nos Mecanismos de Busca (Google, Bing)
  customDomain?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonicalUrl?: string;
  seoOgImageUrl?: string;
  seoGoogleSearchConsole?: string;
  seoGoogleAnalyticsId?: string;
  seoMetaPixelId?: string;
  seoCity?: string;
  seoState?: string;
  seoRegion?: string;
  seoRobotsIndex?: boolean;
  seoStructuredDataEnabled?: boolean;
  leadNotificationEmail?: string;
}

export interface DataVersionRecord {
  id: string;
  entity: string;
  entityId: string;
  version: number;
  timestamp: string;
  authorId?: string;
  authorName?: string;
  summary: string;
  previousState?: any;
  newState: any;
}

export interface SystemBackupSnapshot {
  id: string;
  timestamp: string;
  label: string;
  trigger: 'auto' | 'manual' | 'pre_update' | 'export';
  stats: {
    propertiesCount: number;
    leadsCount: number;
    usersCount: number;
    tasksCount: number;
    docsCount: number;
    visitsCount: number;
    commissionsCount: number;
    htmlBlocksCount: number;
    optionsCount?: number;
    hasConfig: boolean;
  };
  data: {
    properties: Property[];
    leads: Lead[];
    users: User[];
    visits: VisitAppointment[];
    commissions: Commission[];
    chatMessages: ChatMessage[];
    customHtmlBlocks: CustomHtmlBlock[];
    documents: GeneratedDocument[];
    crmTasks: CrmTask[];
    auditLogs: AuditLogEntry[];
    siteConfig: SiteConfig;
    configurableOptions?: ConfigurableOption[];
  };
  checksum?: string;
}
