import { Language } from '../types';

export const translations = {
  pt: {
    // Navigation & System
    portalTitle: 'Portal Imobiliário',
    homeNav: 'Início / Imóveis',
    restrictedArea: 'Área Restrita (Corretores)',
    restrictedAreaBadge: 'SISTEMA DE GESTÃO IMOBILIÁRIA (ÁREA RESTRITA CORRETORES & ADMIN)',
    publicSiteButton: 'Site Público',
    viewPublicSite: 'Ver Site Público',
    panelRestricted: 'PAINEL RESTRITO',
    officialSite: 'SITE OFICIAL',
    
    // Internal Panel Nav
    dashboardNav: 'Dashboard',
    crmNav: 'CRM Leads',
    agendaNav: 'Agenda Visitas',
    propertiesNav: 'Gestão Imóveis',
    commissionsNav: 'Comissões',
    chatNav: 'Chat Interno',
    settingsNav: 'Configurações',

    // Portal & Search
    heroTitle: 'Encontre o Imóvel Perfeito para O Seu Estilo de Vida',
    heroSubtitle: '',
    buyTab: 'Comprar',
    rentTab: 'Alugar',
    highStandardTab: 'Alto Padrão',
    locationLabel: 'Localização / Bairro',
    propertyTypeLabel: 'Tipo de Imóvel',
    allTypes: 'Todos os Tipos',
    apartment: 'Apartamento',
    penthouse: 'Cobertura Duplex',
    house: 'Casa de Condomínio',
    land: 'Terreno / Lote',
    commercial: 'Comercial',
    maxPriceLabel: 'Valor Máximo',
    anyPrice: 'Qualquer Valor',
    minBedroomsLabel: 'Quartos Mínimos',
    anyBedrooms: 'Qualquer Qtd',
    searchButton: 'Buscar Imóveis',
    foundCount: 'imóveis encontrados',
    superHighlights: '⭐ Imóveis em Destaque',
    featured: 'Em Destaque',
    penthouses: 'Coberturas',
    houses: 'Casas',
    all: 'Todos',
    
    // Property Card & Details
    superDestaqueBadge: 'DESTAQUE ESPECIAL',
    emDestaqueBadge: 'EM DESTAQUE',
    saleBadge: 'Venda',
    rentBadge: 'Aluguel',
    viewProperty: 'Ver Imóvel',
    scheduleVisit: 'Agendar Visita',
    contactWhatsapp: 'Falar no WhatsApp',
    valueLabel: 'Valor',
    perMonth: '/mês',
    bedroomsShort: 'Qts',
    bathroomsShort: 'Ban',
    parkingShort: 'Vag',
    areaShort: 'm²',

    // Mortgage Calculator
    simulatorTitle: 'Simulador de Financiamento Habitacional',
    simulatorHeadline: 'Planeje o Financiamento do Seu Imóvel',
    propertyValue: 'Valor do Imóvel',
    downPayment: 'Entrada',
    termYears: 'Prazo (Anos)',
    interestRate: 'Taxa de Juros (a.a.)',
    estimatedInstallment: 'Primeira Parcela Estimada',
    financedValue: 'Valor Financiado',
    recommendedIncome: 'Renda Mínima Recomendada',
    approveCreditButton: 'Aprovar Crédito com Especialista',

    // Owner CTA
    ownerTitle: 'Quer vender ou alugar seu imóvel com agilidade e segurança?',
    ownerDesc: 'Anuncie conosco. Oferecemos fotos profissionais, tour virtual e divulgação nos maiores portais.',
    ownerFormTitle: 'Cadastre ou avalie seu imóvel:',
    fullName: 'Seu Nome Completo',
    phoneWhatsapp: 'WhatsApp / Telefone',
    requestEvaluation: 'Solicitar Avaliação do Imóvel',

    // CRM
    crmTitle: 'CRM & Funil de Vendas',
    newLead: 'Novo Lead',
    leadStageNovo: 'Novo Lead',
    leadStageContato: 'Primeiro Contato',
    leadStageVisita: 'Visita Agendada',
    leadStageProposta: 'Proposta Enviada',
    leadStageNegociacao: 'Em Negociação',
    leadStageFechado: 'Fechado / Ganho',
    leadStagePerdido: 'Perdido',

    // Auth & Users
    loginTitle: 'Acesso ao Sistema',
    adminLogin: 'Login Administrador',
    agentLogin: 'Login Corretor',
    emailLabel: 'E-mail Cadastrado',
    passwordLabel: 'Senha de Acesso',
    enterSystemButton: 'Entrar no Sistema',
    forgotPassword: 'Esqueci minha senha',
    changePassword: 'Alterar Senha',
    roleAdmin: 'Gerente / Admin',
    roleAgent: 'Corretor',
    loginButton: 'Entrar no Sistema',

    // Export & Reports
    exportPdf: 'Exportar para PDF',
    exportExcel: 'Exportar para Excel',
    brokerStats: 'Estatísticas do Corretor',
    totalSales: 'Vendas Totais',
    conversionRate: 'Taxa de Conversão',
    avgTicket: 'Ticket Médio',

    // Connectivity
    onlineStatus: 'Online',
    offlineStatus: 'Acesso Offline Ativo'
  },
  en: {
    // Navigation & System
    portalTitle: 'Real Estate Portal',
    homeNav: 'Home / Properties',
    restrictedArea: 'Restricted Area (Agents)',
    restrictedAreaBadge: 'REAL ESTATE MANAGEMENT SYSTEM (RESTRICTED AGENTS & ADMIN AREA)',
    publicSiteButton: 'Public Site',
    viewPublicSite: 'View Public Site',
    panelRestricted: 'RESTRICTED PANEL',
    officialSite: 'OFFICIAL SITE',

    // Internal Panel Nav
    dashboardNav: 'Dashboard',
    crmNav: 'CRM Leads',
    agendaNav: 'Visit Schedule',
    propertiesNav: 'Property Admin',
    commissionsNav: 'Commissions',
    chatNav: 'Internal Chat',
    settingsNav: 'Settings',

    // Portal & Search
    heroTitle: 'Find the Perfect Property for Your Lifestyle',
    heroSubtitle: 'Exclusive curation of luxury houses, penthouses and apartments in prime locations.',
    buyTab: 'Buy',
    rentTab: 'Rent',
    highStandardTab: 'Luxury',
    locationLabel: 'Location / Neighborhood',
    propertyTypeLabel: 'Property Type',
    allTypes: 'All Types',
    apartment: 'Apartment',
    penthouse: 'Duplex Penthouse',
    house: 'Gated House',
    land: 'Land Lot',
    commercial: 'Commercial',
    maxPriceLabel: 'Max Price',
    anyPrice: 'Any Price',
    minBedroomsLabel: 'Min Bedrooms',
    anyBedrooms: 'Any Qty',
    searchButton: 'Search Properties',
    foundCount: 'properties found',
    superHighlights: '🔥 Super Featured',
    featured: '⭐ Featured',
    penthouses: 'Penthouses',
    houses: 'Houses',
    all: 'All',

    // Property Card & Details
    superDestaqueBadge: 'SUPER FEATURED',
    emDestaqueBadge: 'FEATURED',
    saleBadge: 'Sale',
    rentBadge: 'Rent',
    viewProperty: 'View Property',
    scheduleVisit: 'Schedule Visit',
    contactWhatsapp: 'Chat on WhatsApp',
    valueLabel: 'Price',
    perMonth: '/mo',
    bedroomsShort: 'Beds',
    bathroomsShort: 'Baths',
    parkingShort: 'Park',
    areaShort: 'sqm',

    // Mortgage Calculator
    simulatorTitle: 'Housing Loan Mortgage Simulator',
    simulatorHeadline: 'Plan Your Property Mortgage',
    propertyValue: 'Property Value',
    downPayment: 'Down Payment',
    termYears: 'Term (Years)',
    interestRate: 'Interest Rate (p.a.)',
    estimatedInstallment: 'Estimated 1st Installment',
    financedValue: 'Financed Amount',
    recommendedIncome: 'Min Recommended Income',
    approveCreditButton: 'Get Approved with Specialist',

    // Owner CTA
    ownerTitle: 'Want to sell or rent your property quickly and safely?',
    ownerDesc: 'List with us. Professional photos, virtual tours, and promotion on major real estate portals.',
    ownerFormTitle: 'List your property for free:',
    fullName: 'Your Full Name',
    phoneWhatsapp: 'WhatsApp / Phone',
    requestEvaluation: 'Request Free Valuation',

    // CRM
    crmTitle: 'CRM & Sales Pipeline',
    newLead: 'New Lead',
    leadStageNovo: 'New Lead',
    leadStageContato: 'First Contact',
    leadStageVisita: 'Visit Scheduled',
    leadStageProposta: 'Proposal Sent',
    leadStageNegociacao: 'In Negotiation',
    leadStageFechado: 'Closed / Won',
    leadStagePerdido: 'Lost',

    // Auth & Users
    loginTitle: 'System Sign In',
    adminLogin: 'Admin Sign In',
    agentLogin: 'Broker Sign In',
    emailLabel: 'Registered Email',
    passwordLabel: 'Access Password',
    enterSystemButton: 'Sign In to System',
    forgotPassword: 'Forgot my password',
    changePassword: 'Change Password',
    roleAdmin: 'Manager / Admin',
    roleAgent: 'Real Estate Agent',
    loginButton: 'Sign In',

    // Export & Reports
    exportPdf: 'Export to PDF',
    exportExcel: 'Export to Excel',
    brokerStats: 'Agent Statistics',
    totalSales: 'Total Sales',
    conversionRate: 'Conversion Rate',
    avgTicket: 'Average Ticket',

    // Connectivity
    onlineStatus: 'Online',
    offlineStatus: 'Offline Access Active'
  },
  es: {
    // Navigation & System
    portalTitle: 'Portal Inmobiliario',
    homeNav: 'Inicio / Inmuebles',
    restrictedArea: 'Área Restringida (Agentes)',
    restrictedAreaBadge: 'SISTEMA DE GESTIÓN INMOBILIARIA (ÁREA RESTRINGIDA AGENTES Y ADMIN)',
    publicSiteButton: 'Sitio Público',
    viewPublicSite: 'Ver Sitio Público',
    panelRestricted: 'PANEL RESTRINGIDO',
    officialSite: 'SITIO OFICIAL',

    // Internal Panel Nav
    dashboardNav: 'Panel',
    crmNav: 'CRM Leads',
    agendaNav: 'Agenda Visitas',
    propertiesNav: 'Gestión Inmuebles',
    commissionsNav: 'Comisiones',
    chatNav: 'Chat Interno',
    settingsNav: 'Configuración',

    // Portal & Search
    heroTitle: 'Encuentre el Inmueble Perfecto para Su Estilo de Vida',
    heroSubtitle: 'Curaduría exclusiva de casas, áticos y apartamentos de lujo en las mejores ubicaciones.',
    buyTab: 'Comprar',
    rentTab: 'Alquilar',
    highStandardTab: 'Alto Nivel',
    locationLabel: 'Ubicación / Barrio',
    propertyTypeLabel: 'Tipo de Inmueble',
    allTypes: 'Todos los Tipos',
    apartment: 'Apartamento',
    penthouse: 'Ático Dúplex',
    house: 'Casa en Condominio',
    land: 'Terreno / Lote',
    commercial: 'Comercial',
    maxPriceLabel: 'Valor Máximo',
    anyPrice: 'Cualquier Valor',
    minBedroomsLabel: 'Habitaciones Mínimas',
    anyBedrooms: 'Cualquier Cant',
    searchButton: 'Buscar Inmuebles',
    foundCount: 'inmuebles encontrados',
    superHighlights: '🔥 Super Destacados',
    featured: '⭐ Destacados',
    penthouses: 'Áticos',
    houses: 'Casas',
    all: 'Todos',

    // Property Card & Details
    superDestaqueBadge: 'SUPER DESTACADO',
    emDestaqueBadge: 'DESTACADO',
    saleBadge: 'Venta',
    rentBadge: 'Alquiler',
    viewProperty: 'Ver Inmueble',
    scheduleVisit: 'Agendar Visita',
    contactWhatsapp: 'Contactar por WhatsApp',
    valueLabel: 'Precio',
    perMonth: '/mes',
    bedroomsShort: 'Dorm',
    bathroomsShort: 'Baños',
    parkingShort: 'Gar',
    areaShort: 'm²',

    // Mortgage Calculator
    simulatorTitle: 'Simulador de Hipoteca Inmobiliaria',
    simulatorHeadline: 'Planifique la Hipoteca de Su Inmueble',
    propertyValue: 'Valor del Inmueble',
    downPayment: 'Entrada',
    termYears: 'Plazo (Años)',
    interestRate: 'Tasa de Interés (a.a.)',
    estimatedInstallment: 'Primera Cuota Estimada',
    financedValue: 'Monto Financiado',
    recommendedIncome: 'Ingreso Mínimo Recomendado',
    approveCreditButton: 'Aprobar Crédito con Especialista',

    // Owner CTA
    ownerTitle: '¿Desea vender o alquilar su inmueble con rapidez y seguridad?',
    ownerDesc: 'Anuncie con nosotros. Fotos profesionales, tours virtuales y difusión en los principales portales.',
    ownerFormTitle: 'Anuncie o solicite valoración:',
    fullName: 'Su Nombre Completo',
    phoneWhatsapp: 'WhatsApp / Teléfono',
    requestEvaluation: 'Solicitar Valoración del Inmueble',

    // CRM
    crmTitle: 'CRM y Embudo de Ventas',
    newLead: 'Nuevo Lead',
    leadStageNovo: 'Nuevo Lead',
    leadStageContato: 'Primer Contacto',
    leadStageVisita: 'Visita Agendada',
    leadStageProposta: 'Propuesta Enviada',
    leadStageNegociacao: 'En Negociación',
    leadStageFechado: 'Cerrado / Ganado',
    leadStagePerdido: 'Perdido',

    // Auth & Users
    loginTitle: 'Acceso al Sistema',
    adminLogin: 'Acceso Administrador',
    agentLogin: 'Acceso Agente',
    emailLabel: 'Correo Electrónico',
    passwordLabel: 'Contraseña de Acceso',
    enterSystemButton: 'Entrar al Sistema',
    forgotPassword: 'Olvidé mi contraseña',
    changePassword: 'Cambiar Contraseña',
    roleAdmin: 'Gerente / Admin',
    roleAgent: 'Agente Inmobiliario',
    loginButton: 'Iniciar Sesión',

    // Export & Reports
    exportPdf: 'Exportar a PDF',
    exportExcel: 'Exportar a Excel',
    brokerStats: 'Estadísticas por Agente',
    totalSales: 'Ventas Totales',
    conversionRate: 'Tasa de Conversión',
    avgTicket: 'Ticket Medio',

    // Connectivity
    onlineStatus: 'En Línea',
    offlineStatus: 'Acceso Offline Activo'
  }
};

export type TranslationKey = keyof typeof translations['pt'];

export function getTranslation(lang: Language, key: TranslationKey): string {
  const dict = translations[lang] || translations.pt;
  return dict[key] || translations.pt[key] || key;
}
