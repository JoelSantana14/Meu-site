import {
  User,
  Property,
  Lead,
  VisitAppointment,
  Commission,
  ChatMessage,
  PushNotification,
  CustomHtmlBlock,
  SiteConfig,
  CrmTask
} from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_master_joel',
    name: 'Joel Santana',
    email: 'joelsantanaimoveis@gmail.com',
    password: 'Joel@2026',
    role: 'admin',
    isMasterAdmin: true,
    status: 'ativo',
    phone: '(17) 99195-1473',
    whatsapp: '5517991951473',
    avatar: '/images/joel_santana_avatar.jpg',
    commissionRate: 100,
    creci: 'CRECI 00001-J',
    cnai: 'CNAI 00001',
    cnae: 'CNAI 00001',
    secondaryPhone: '(17) 98123-4567',
    address: 'Rua Bernardino de Campos, 1500 - Centro, São José do Rio Preto - SP',
    bio: 'Administrador Geral e Proprietário do Sistema Imobiliário.'
  },
  {
    id: 'usr_corretor1',
    name: 'Ana Souza',
    email: 'ana.souza@joelsantanaimoveis.com.br',
    password: '123456',
    role: 'corretor',
    status: 'ativo',
    phone: '(11) 91234-5678',
    whatsapp: '5511912345678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    commissionRate: 50,
    creci: 'CRECI 98765-F',
    cnai: 'CNAI 98765',
    cnae: 'CNAI 98765',
    secondaryPhone: '(11) 98888-1111',
    address: 'Rua Oscar Freire, 800 - Jardins, São Paulo - SP',
    bio: 'Especialista em apartamentos de luxo e coberturas nos Jardins e Itaim.'
  },
  {
    id: 'usr_corretor2',
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@joelsantanaimoveis.com.br',
    password: '123456',
    role: 'corretor',
    status: 'ativo',
    phone: '(11) 99887-6655',
    whatsapp: '5511998876655',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    commissionRate: 45,
    creci: 'CRECI 54321-F',
    cnai: 'CNAI 54321',
    cnae: 'CNAI 54321',
    secondaryPhone: '(11) 97777-2222',
    address: 'Alameda Rio Negro, 500 - Alphaville, Barueri - SP',
    bio: 'Focado em condomínios fechados e casas em Alphaville e Granja Viana.'
  },
  {
    id: 'usr_recep1',
    name: 'Mariana Costa (Recepcionista)',
    email: 'recepcao@joelsantanaimoveis.com.br',
    password: '123456',
    role: 'recepcionista',
    status: 'ativo',
    phone: '(11) 97766-5544',
    whatsapp: '5511977665544',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    commissionRate: 0,
    creci: 'Atendimento',
    bio: 'Atendimento geral, recepcionista e agendamento de visitas.'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop_1789786127052',
    code: 'IMP-2637',
    title: '🏡 Casa térrea reformada, na Vila Elmaz, São José do Rio Preto!',
    description: '2 salas (uma com pé direito de 5m!)\n Copa + cozinha\n4 vagas (1 coberta) \nEdícula independente: cozinha, 1 dormitório e banheiro\nÁrea de serviço\n\nAceita carro de até R$ 60 mil como parte do pagamento\nPermuta por imóveis de até R$ 160 mil (Vila Toninho, apto no Palestra ou Higienópolis)\nFinanciamento disponível\n\nQuer visitar? Fale comigo agora!\n\n#VilaElmaz #casanova #SãoJoséDoRioPreto #Financiamento #casacomedícula',
    type: 'casa',
    purpose: 'venda',
    price: 310000,
    condoFee: 0,
    propertyTax: 0,
    areaSqM: 232,
    bedrooms: 3,
    bathrooms: 1,
    suites: 1,
    parkingSpaces: 4,
    highlight: 'super_destaque',
    status: 'disponivel',
    address: {
      street: 'Rua Ana Rita Camacho',
      number: '427',
      neighborhood: 'Vila Elmaz',
      city: 'São José do Rio Preto',
      state: 'SP',
      zip: '15051-480'
    },
    features: [
      'Quintal amplo',
      'Documentação pronta para financiamento',
      'Edícula nos Fundos',
      'Pé Direito 5m',
      '4 Vagas de Garagem'
    ],
    featuresRegiao: [
      'Próximo a Escolas e Colégios',
      'Posto de Saúde / Hospital',
      'Transporte Público / Ponto de Ônibus',
      'Academias e Centros Esportivos',
      'Padarias e Confeitarias',
      'Fácil Acesso a Rodovias e Avenidas',
      'Supermercados e Mercados'
    ],
    featuresEmpreendimento: [
      'Portaria 24h',
      'Salão de Festas',
      'Playground'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'
    ],
    tarja: 'Aceita financiamento',
    tarjaCustomColor: '#01df00',
    topografia: 'plano',
    ocupacaoUso: 'residencial',
    agentId: 'usr_master_joel',
    createdAt: '2026-09-19'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_01',
    name: 'Dr. Roberto Mendonça',
    email: 'roberto.mendonca@med.com.br',
    phone: '(11) 99112-3344',
    source: 'Site Direct',
    preferredType: 'cobertura',
    budgetMax: 9000000,
    preferredNeighborhood: 'Itaim Bibi / Moema',
    stage: 'visita',
    agentId: 'usr_corretor1',
    interestedPropertyId: 'prop_01',
    notes: [
      {
        id: 'n1',
        authorId: 'usr_corretor1',
        authorName: 'Ana Souza',
        content: 'Cliente procura imóvel pronto para morar com hidromassagem e mínimo de 4 vagas.',
        timestamp: '2026-09-02 14:30'
      }
    ],
    createdAt: '2026-09-01',
    updatedAt: '2026-09-02'
  },
  {
    id: 'lead_02',
    name: 'Fernanda Albuquerque',
    email: 'fernanda.alb@gmail.com',
    phone: '(11) 98223-4455',
    source: 'WhatsApp',
    preferredType: 'casa',
    budgetMax: 6500000,
    preferredNeighborhood: 'Alphaville',
    stage: 'proposta',
    agentId: 'usr_corretor2',
    interestedPropertyId: 'prop_02',
    notes: [
      {
        id: 'n2',
        authorId: 'usr_corretor2',
        authorName: 'Carlos Eduardo',
        content: 'Enviou proposta inicial de R$ 5.500.000 à vista. Proprietário analisando contraproposta.',
        timestamp: '2026-09-04 10:15'
      }
    ],
    createdAt: '2026-08-25',
    updatedAt: '2026-09-04'
  },
  {
    id: 'lead_03',
    name: 'Tech Ventures Brasil (Luciano)',
    email: 'luciano@techventures.io',
    phone: '(11) 97334-5566',
    source: 'Indicação',
    preferredType: 'comercial',
    budgetMax: 50000,
    preferredNeighborhood: 'Faria Lima',
    stage: 'negociacao',
    agentId: 'usr_corretor3',
    interestedPropertyId: 'prop_04',
    notes: [
      {
        id: 'n3',
        authorId: 'usr_corretor3',
        authorName: 'Marianna Costa',
        content: 'Minuta contratual de aluguel em revisão jurídica.',
        timestamp: '2026-09-05 16:45'
      }
    ],
    createdAt: '2026-08-28',
    updatedAt: '2026-09-05'
  },
  {
    id: 'lead_04',
    name: 'Camila & Rodrigo',
    email: 'camila.rodrigo@outlook.com',
    phone: '(11) 96445-6677',
    source: 'Instagram',
    preferredType: 'apartamento',
    budgetMax: 1500000,
    preferredNeighborhood: 'Vila Madalena / Pinheiros',
    stage: 'fechado',
    agentId: 'usr_corretor1',
    interestedPropertyId: 'prop_06',
    notes: [
      {
        id: 'n4',
        authorId: 'usr_corretor1',
        authorName: 'Ana Souza',
        content: 'Contrato assinado! Sinal pago no valor de R$ 100.000,00.',
        timestamp: '2026-09-05 18:00'
      }
    ],
    createdAt: '2026-09-01',
    updatedAt: '2026-09-05'
  },
  {
    id: 'lead_05',
    name: 'Eduardo Fontes',
    email: 'eduardo.fontes@empresa.com',
    phone: '(11) 95556-7788',
    source: 'Portal VivaReal',
    preferredType: 'apartamento',
    budgetMax: 3500000,
    preferredNeighborhood: 'Jardins',
    stage: 'novo',
    agentId: 'usr_corretor1',
    interestedPropertyId: 'prop_03',
    notes: [],
    createdAt: '2026-09-06',
    updatedAt: '2026-09-06'
  }
];

export const INITIAL_VISITS: VisitAppointment[] = [
  {
    id: 'vis_01',
    leadId: 'lead_01',
    propertyId: 'prop_01',
    agentId: 'usr_corretor1',
    date: '2026-09-08',
    time: '15:00',
    status: 'confirmada',
    notes: 'Cliente quer levar arquiteta de interiores para avaliar o mármore.',
    createdAt: '2026-09-02'
  },
  {
    id: 'vis_02',
    leadId: 'lead_02',
    propertyId: 'prop_02',
    agentId: 'usr_corretor2',
    date: '2026-09-07',
    time: '10:30',
    status: 'realizada',
    notes: 'Gostaram muito da área da piscina.',
    createdAt: '2026-08-30'
  },
  {
    id: 'vis_03',
    leadId: 'lead_05',
    propertyId: 'prop_03',
    agentId: 'usr_corretor1',
    date: '2026-09-09',
    time: '11:00',
    status: 'agendada',
    notes: 'Aguardando confirmação do horário com a portaria do prédio.',
    createdAt: '2026-09-06'
  }
];

export const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: 'com_01',
    propertyId: 'prop_06',
    leadId: 'lead_04',
    agentId: 'usr_corretor1',
    saleValue: 1450000,
    totalCommissionPct: 6,
    totalCommissionAmount: 87000, // 6% of 1.45M
    agentCommissionPct: 50,
    agentCommissionAmount: 43500,
    agencyCommissionAmount: 43500,
    paymentStatus: 'liberado',
    saleDate: '2026-09-05'
  },
  {
    id: 'com_02',
    propertyId: 'prop_03',
    leadId: 'lead_01',
    agentId: 'usr_corretor1',
    saleValue: 3100000,
    totalCommissionPct: 5,
    totalCommissionAmount: 155000,
    agentCommissionPct: 50,
    agentCommissionAmount: 77500,
    agencyCommissionAmount: 77500,
    paymentStatus: 'pago',
    saleDate: '2026-08-12'
  },
  {
    id: 'com_03',
    propertyId: 'prop_02',
    leadId: 'lead_02',
    agentId: 'usr_corretor2',
    saleValue: 5800000,
    totalCommissionPct: 6,
    totalCommissionAmount: 348000,
    agentCommissionPct: 45,
    agentCommissionAmount: 156600,
    agencyCommissionAmount: 191400,
    paymentStatus: 'pendente',
    saleDate: '2026-09-04'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    senderId: 'usr_master_joel',
    senderName: 'Joel Santana',
    senderRole: 'admin',
    senderAvatar: '/images/joel_santana_avatar.jpg',
    channel: 'geral',
    text: 'Pessoal, lembrando que a reunião de alinhamento de metas da semana será hoje às 17h!',
    timestamp: '2026-09-06 09:00'
  },
  {
    id: 'msg_02',
    senderId: 'usr_corretor1',
    senderName: 'Ana Souza',
    senderRole: 'corretor',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    channel: 'geral',
    text: 'Confirmado Geraldo! Acabei de fechar a venda do imóvel IMP-1006 na Vila Madalena 🎉',
    timestamp: '2026-09-06 09:12'
  },
  {
    id: 'msg_03',
    senderId: 'usr_corretor2',
    senderName: 'Carlos Eduardo',
    senderRole: 'corretor',
    senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    channel: 'geral',
    text: 'Parabéns Ana! Excelente resultado!',
    timestamp: '2026-09-06 09:15'
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif_01',
    title: 'Novo Lead Cadastrado!',
    body: 'Eduardo Fontes se cadastrou no site demonstrando interesse no imóvel IMP-1003.',
    timestamp: '2026-09-06 11:20',
    read: false,
    type: 'lead',
    linkTab: 'crm'
  },
  {
    id: 'notif_02',
    title: 'Visita Confirmada',
    body: 'A visita para o imóvel IMP-1001 com Dr. Roberto foi confirmada para 08/09 às 15:00.',
    timestamp: '2026-09-05 14:00',
    read: true,
    type: 'visita',
    linkTab: 'agenda'
  }
];

export const INITIAL_HTML_BLOCKS: CustomHtmlBlock[] = [
  {
    id: 'html_invest_page',
    title: 'Página / Guia do Investidor',
    position: 'custom_page',
    slug: 'guia-investidor',
    htmlContent: `<div class="max-w-4xl mx-auto py-12 px-6">
  <h1 class="text-3xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Guia de Investimento Imobiliário 2026</h1>
  <p class="text-slate-600 dark:text-slate-300 mb-6 text-lg">Por que investir no mercado imobiliário de alto padrão na grande São Paulo e interior?</p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
    <div class="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">1. Valorização Consistente</h3>
      <p class="text-slate-600 dark:text-slate-300 text-sm">Regiões em expansão mantêm taxa de valorização sólida acima dos índices de inflação.</p>
    </div>
    <div class="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">2. Proteção Patrimonial</h3>
      <p class="text-slate-600 dark:text-slate-300 text-sm">Ativos reais garantem liquidez e blindagem patrimonial para você e sua família.</p>
    </div>
  </div>
</div>`,
    active: true
  }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  companyName: 'Joel Santana - Corretor de Imóveis',
  creciJuridico: '',
  creciFisico: 'CRECI 12345-F',
  cnpj: '',
  primaryColorHex: '#4f46e5', // Indigo 600
  accentColorHex: '#06b6d4', // Cyan 500
  colorTheme: 'padrao',
  contourColorHex: '#6366f1',
  detailsColorHex: '#4f46e5',
  enableCustomContours: false,
  darkMode: false,
  backgroundMode: 'pure_white',
  themeMode: 'light',
  language: 'pt',
  phone: '(17) 99195-1473',
  whatsapp: '5517991951473',
  email: 'joelsantanaimoveis@gmail.com',
  address: 'São José do Rio Preto - SP e Região Noroeste Paulista',
  logoText: 'Joel Santana Corretor de Imóveis',
  logoUrl: '',
  heroTitle: 'Conectando pessoas, realizando sonhos.',
  heroSubtitle: 'Casas em condomínio, apartamentos, terrenos e oportunidades comerciais com atendimento exclusivo pelo Corretor Joel Santana.',
  heroBannerImage: '/images/house_with_pool_1789524615804.jpg',
  heroBannerPreset: 'residencial_moderno',
  heroTitleOpacity: 100,
  heroTitleFontSize: 48,
  showBrokerPhotoOnProperties: true,
  layoutPreset: 'clean_claro',
  brokerName: 'Joel Santana',
  brokerCreci: 'CRECI 12345-F',
  brokerCnae: '6821-8/01',
  brokerCnai: 'CNAI 12345',
  brokerPhone: '(17) 99195-1473',
  brokerSecondaryPhone: '(17) 98123-4567',
  brokerWhatsapp: '5517991951473',
  brokerEmail: 'joelsantanaimoveis@gmail.com',
  brokerAddress: 'São José do Rio Preto - SP',
  brokerAvatarUrl: '/images/joel_santana_avatar.jpg',
  brokerBio: 'Joel Santana - Corretor de Imóveis especialista na compra, venda e locação de imóveis residenciais, condomínios fechados, apartamentos e terrenos em São José do Rio Preto e região.',
  brokerRegion: 'São José do Rio Preto, Mirassol, Bady Bassitt, Cedral e Noroeste Paulista',
  showQuemSomosPage: true,
  showIndicesPage: true,
  showNoticiasPage: true,
  showTrustStatsBar: true,
  showLgpdBanner: true,
  lgpdBannerText: 'Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência em nosso site, personalizar anúncios e analisar o tráfego. Em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018), você pode gerenciar suas preferências ou consultar nossa política de privacidade a qualquer momento.',
  lgpdDpoEmail: 'joelsantanaimoveis@gmail.com',
  showPartnerSites: true,
  partnerSite1Name: 'Construtora Metropolitana',
  partnerSite1Url: 'https://example.com/construtora',
  partnerSite1Desc: 'Parceiro oficial em construções e acabamentos',
  partnerSite2Name: 'Rio Preto Arquitetura',
  partnerSite2Url: 'https://example.com/arquitetura',
  partnerSite2Desc: 'Projetos de arquitetura e design de interiores',
  partnerSite3Name: 'Cartório de Registro de Imóveis',
  partnerSite3Url: 'https://example.com/cartorio',
  partnerSite3Desc: 'Certidões rápidas e assessoria documental',
  // SEO & Otimização de Busca no Google
  customDomain: 'www.joelsantanaimoveis.com.br',
  seoTitle: 'Joel Santana Corretor de Imóveis | Comprar e Alugar em São José do Rio Preto e Região - SP',
  seoDescription: 'Encontre as melhores casas, apartamentos, condomínios fechados, terrenos e imóveis comerciais para comprar ou alugar em São José do Rio Preto - SP e região. Atendimento exclusivo com Joel Santana Corretor de Imóveis. WhatsApp: (17) 99195-1473.',
  seoKeywords: 'imóveis são josé do rio preto, casas à venda são josé do rio preto, comprar casa rio preto, apartamentos alugar são josé do rio preto, aluguel são josé do rio preto, terrenos rio preto sp, corretor joel santana, joel santana corretor de imóveis, imobiliária são josé do rio preto, casas em condomínio fechado rio preto, chácaras rio preto, locação de imóveis rio preto sp',
  seoCanonicalUrl: 'https://joelsantanacorretor.com.br',
  seoCity: 'São José do Rio Preto',
  seoState: 'SP',
  seoRegion: 'São José do Rio Preto, Mirassol, Bady Bassitt, Cedral e Noroeste Paulista',
  seoRobotsIndex: true,
  seoStructuredDataEnabled: true,
  seoGoogleSearchConsole: 'google-site-verification=joelsantana-sjrp-imoveis',
  seoGoogleAnalyticsId: 'G-JOELSANTANA',
  seoOgImageUrl: '/images/house_with_pool_1789524615804.jpg',
  exclusiveLaunch: {
    enabled: true,
    badge: 'Lançamento Exclusivo',
    title: 'Residencial Grand Horizon',
    subtitle: 'Condições especiais de financiamento direto com a construtora',
    description: 'Apartamentos modernos de 2 e 3 dormitórios com varanda gourmet, lazer completo estilo resort e localização estratégica com fácil acesso ao metrô e principais vias.',
    price: 'A partir de R$ 420.000',
    location: 'São Paulo - SP • Próximo ao Metrô',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    features: ['Piscina com Raia e Deck Molhado', 'Academia Equipada', 'Espaço Gourmet e Churrasqueira', 'Coworking Integrado', 'Pet Place', 'Portaria Blindada 24h'],
    ctaText: 'Quero Conhecer o Grand Horizon',
    ctaWhatsappMsg: 'Olá Joel! Vi o Lançamento Exclusivo Residencial Grand Horizon no site e quero receber a tabela de preços e agendar uma apresentação.',
    statusTag: 'Obras Iniciadas'
  },
  enableWatermark: false,
  watermarkUrl: '',
  watermarkOpacity: 35,
  watermarkPosition: 'center',
  watermarkSize: 'medium',
  logoSize: 'lg',
  logoPosition: 'left',
  leadNotificationEmail: 'joelsantanaimoveis@gmail.com'
};

export const INITIAL_CRM_TASKS: CrmTask[] = [
  {
    id: 'task_01',
    leadId: 'lead_01',
    leadName: 'Roberto Mendes da Silva',
    leadPhone: '(11) 99123-4567',
    leadEmail: 'roberto.mendes@empresa.com.br',
    agentId: 'usr_corretor1',
    agentName: 'Ana Souza',
    title: 'Ligar para confirmar visita no Apartamento Jardins',
    description: 'Confirmar horário e se o cliente levará arquiteto para medição das suítes.',
    dueDate: '2026-09-12',
    dueTime: '14:30',
    priority: 'alta',
    taskType: 'ligacao',
    status: 'pendente',
    createdAt: '2026-09-10'
  },
  {
    id: 'task_02',
    leadId: 'lead_02',
    leadName: 'Fernanda Albuquerque',
    leadPhone: '(11) 98223-4455',
    leadEmail: 'fernanda.alb@gmail.com',
    agentId: 'usr_corretor2',
    agentName: 'Carlos Eduardo',
    title: 'Enviar minuta da contraproposta da Casa Alphaville',
    description: 'Proprietário contrapropôs R$ 5.800.000,00. Enviar minuta formal de proposta por e-mail e WhatsApp.',
    dueDate: '2026-09-12',
    dueTime: '16:00',
    priority: 'urgente',
    taskType: 'proposta',
    status: 'pendente',
    createdAt: '2026-09-11'
  },
  {
    id: 'task_03',
    leadId: 'lead_03',
    leadName: 'Tech Ventures Brasil (Luciano)',
    leadPhone: '(11) 97334-5566',
    leadEmail: 'luciano@techventures.io',
    agentId: 'usr_corretor1',
    agentName: 'Ana Souza',
    title: 'Cobrar envio do balanço patrimonial e contrato social',
    description: 'Documentação necessária para aprovação da garantia locatícia da laje corporativa.',
    dueDate: '2026-09-11',
    dueTime: '10:00',
    priority: 'alta',
    taskType: 'whatsapp',
    status: 'pendente',
    createdAt: '2026-09-08'
  },
  {
    id: 'task_04',
    leadId: 'lead_04',
    leadName: 'Camila & Rodrigo',
    leadPhone: '(11) 96445-6677',
    leadEmail: 'camila.rodrigo@outlook.com',
    agentId: 'usr_corretor1',
    agentName: 'Ana Souza',
    title: 'Emitir e colher assinaturas do Recibo de Comissão',
    description: 'Emitir recibo conforme Lei 6.530/78 referente ao fechamento da venda do apartamento.',
    dueDate: '2026-09-15',
    dueTime: '11:00',
    priority: 'media',
    taskType: 'documento',
    status: 'pendente',
    createdAt: '2026-09-11'
  },
  {
    id: 'task_05',
    leadId: 'lead_01',
    leadName: 'Roberto Mendes da Silva',
    leadPhone: '(11) 99123-4567',
    leadEmail: 'roberto.mendes@empresa.com.br',
    agentId: 'usr_corretor1',
    agentName: 'Ana Souza',
    title: 'Primeiro contato por WhatsApp e envio de catálogo',
    description: 'Enviado link com catálogo de opções de 4 dormitórios nos Jardins.',
    dueDate: '2026-09-02',
    dueTime: '11:00',
    priority: 'baixa',
    taskType: 'whatsapp',
    status: 'concluida',
    completedAt: '2026-09-02 11:30',
    completedBy: 'Ana Souza',
    createdAt: '2026-09-01'
  }
];

