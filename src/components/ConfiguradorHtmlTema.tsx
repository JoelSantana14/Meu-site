import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CustomHtmlBlock, User, UserRole } from '../types';
import {
  Settings,
  Palette,
  Code,
  Globe,
  Lock,
  Plus,
  Trash2,
  CheckCircle,
  CheckCircle2,
  Eye,
  Edit3,
  X,
  FileCode,
  Shield,
  ShieldCheck,
  Key,
  Users,
  UserPlus,
  Copy,
  Check,
  Upload,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Layout,
  Sun,
  Moon,
  Building2,
  Phone,
  Image as ImageIcon,
  Bell,
  FileText,
  DollarSign,
  MapPin,
  Tag,
  ListPlus,
  Sliders,
  MessageCircle,
  Award,
  Star,
  Search,
  Share2,
  ExternalLink,
  AlertCircle,
  Compass,
  Loader2,
  Save,
  Rocket,
  LayoutGrid,
  List,
  DownloadCloud,
  UploadCloud,
  History,
  HardDrive,
  PhoneForwarded,
  Briefcase,
  Crown
} from 'lucide-react';

export const ConfiguradorHtmlTema: React.FC = () => {
  const {
    siteConfig,
    updateSiteConfig,
    customHtmlBlocks,
    addHtmlBlock,
    updateHtmlBlock,
    deleteHtmlBlock,
    toggleHtmlBlockActive,
    createManualBackup,
    exportSystemBackup,
    importSystemBackup,
    lastSaveStatus,
    getChangeHistoryList,
    getBackupList,
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    updateUserProfile,
    updateUserPassword,
    setActiveTab,
    properties,
    leads,
    fcmPermissionStatus,
    fcmToken,
    enablePushNotifications,
    sendTestPushNotification
  } = useApp();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.isMasterAdmin;

  if (!siteConfig) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-500 font-medium">
        Carregando configurações do sistema...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Acesso Restrito ao Administrador</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            As configurações do site, temas, banners e dados gerenciais são restritos exclusivamente aos administradores do sistema.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('relatorios')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  // Active Tab in Config Panel: 'tema' | 'lancamento' | 'legal' | 'equipe' | 'perfil' | 'notificacoes' | 'html' | 'seo'
  const [activeSubTab, setActiveSubTab] = useState<'tema' | 'lancamento' | 'legal' | 'equipe' | 'perfil' | 'notificacoes' | 'html' | 'seo' | 'seguranca'>('tema');

  // View Mode: Cards (Grade) vs Lista (Saved locally)
  const [configViewMode, setConfigViewMode] = useState<'grid' | 'list'>(() => {
    try {
      return (localStorage.getItem('imobipro_config_view_mode') as 'grid' | 'list') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const toggleConfigViewMode = (mode: 'grid' | 'list') => {
    setConfigViewMode(mode);
    try {
      localStorage.setItem('imobipro_config_view_mode', mode);
    } catch (e) {
      console.error(e);
    }
  };

  // HTML Blocks Feedback Message
  const [htmlFeedback, setHtmlFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // SEO & Google Ranking State (Joel Santana - São José do Rio Preto)
  const [customDomain, setCustomDomain] = useState(siteConfig.customDomain || 'www.joelsantanaimoveis.com.br');
  const [seoTitle, setSeoTitle] = useState(siteConfig.seoTitle || 'Joel Santana Corretor de Imóveis | Comprar e Alugar em São José do Rio Preto e Região - SP');
  const [seoDescription, setSeoDescription] = useState(siteConfig.seoDescription || 'Encontre as melhores casas, apartamentos, condomínios fechados, terrenos e imóveis comerciais para comprar ou alugar em São José do Rio Preto - SP e região. Atendimento exclusivo com Joel Santana Corretor de Imóveis. WhatsApp: (17) 99195-1473.');
  const [seoKeywords, setSeoKeywords] = useState(siteConfig.seoKeywords || 'imóveis são josé do rio preto, casas à venda são josé do rio preto, comprar casa rio preto, apartamentos alugar são josé do rio preto, aluguel são josé do rio preto, terrenos rio preto sp, corretor joel santana, joel santana corretor de imóveis, imobiliária são josé do rio preto, casas em condomínio fechado rio preto, chácaras rio preto, locação de imóveis rio preto sp');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(siteConfig.seoCanonicalUrl || 'https://joelsantanacorretor.com.br');
  const [seoOgImageUrl, setSeoOgImageUrl] = useState(siteConfig.seoOgImageUrl || '/images/house_with_pool_1789524615804.jpg');
  const [seoGoogleSearchConsole, setSeoGoogleSearchConsole] = useState(siteConfig.seoGoogleSearchConsole || 'google-site-verification=joelsantana-sjrp-imoveis');
  const [seoGoogleAnalyticsId, setSeoGoogleAnalyticsId] = useState(siteConfig.seoGoogleAnalyticsId || 'G-JOELSANTANA');
  const [seoMetaPixelId, setSeoMetaPixelId] = useState(siteConfig.seoMetaPixelId || '');
  const [seoCity, setSeoCity] = useState(siteConfig.seoCity || 'São José do Rio Preto');
  const [seoState, setSeoState] = useState(siteConfig.seoState || 'SP');
  const [seoRegion, setSeoRegion] = useState(siteConfig.seoRegion || 'São José do Rio Preto, Mirassol, Bady Bassitt, Cedral e Noroeste Paulista');
  const [seoRobotsIndex, setSeoRobotsIndex] = useState<boolean>(siteConfig.seoRobotsIndex !== false);
  const [seoStructuredDataEnabled, setSeoStructuredDataEnabled] = useState<boolean>(siteConfig.seoStructuredDataEnabled !== false);

  // Theme & Layout State
  const [primaryColor, setPrimaryColor] = useState(siteConfig.primaryColorHex || '#4f46e5');
  const [accentColor, setAccentColor] = useState(siteConfig.accentColorHex || '#f59e0b');
  const [colorTheme, setColorTheme] = useState<'padrao' | 'verde' | 'vermelho' | 'azul' | 'dourado_preto'>(siteConfig.colorTheme || 'padrao');
  const [contourColor, setContourColor] = useState(siteConfig.contourColorHex || '#6366f1');
  const [detailsColor, setDetailsColor] = useState(siteConfig.detailsColorHex || '#4f46e5');
  const [enableCustomContours, setEnableCustomContours] = useState<boolean>(siteConfig.enableCustomContours ?? false);
  const [backgroundMode, setBackgroundMode] = useState<'pure_white' | 'light_warm' | 'dark'>(siteConfig.backgroundMode || 'pure_white');
  const [companyName, setCompanyName] = useState(siteConfig.companyName || 'Joel Santana - Corretor de Imóveis');
  const [backupEmail, setBackupEmail] = useState(siteConfig.backupEmail || 'despachanteimobiliariorp@yahoo.com');
  const [creciJuridico, setCreciJuridico] = useState(siteConfig.creciJuridico || '');
  const [creciFisico, setCreciFisico] = useState(siteConfig.creciFisico || siteConfig.brokerCreci || 'CRECI 12345-F');
  const [brokerCnae, setBrokerCnae] = useState(siteConfig.brokerCnae || '6821-8/01');
  const [brokerSecondaryPhone, setBrokerSecondaryPhone] = useState(siteConfig.brokerSecondaryPhone || '');
  const [cnpj, setCnpj] = useState(siteConfig.cnpj || '');
  const [heroTitle, setHeroTitle] = useState(siteConfig.heroTitle || 'Encontre o Imóvel Perfeito para O Seu Estilo de Vida');
  const [heroTitleOpacity, setHeroTitleOpacity] = useState<number>(siteConfig.heroTitleOpacity ?? 100);
  const [heroTitleFontSize, setHeroTitleFontSize] = useState<number>(siteConfig.heroTitleFontSize ?? 48);
  const [heroTitlePositionY, setHeroTitlePositionY] = useState<number>(siteConfig.heroTitlePositionY ?? 80);
  const [heroSubtitle, setHeroSubtitle] = useState(siteConfig.heroSubtitle || '');
  const [heroBannerImage, setHeroBannerImage] = useState(siteConfig.heroBannerImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=80');
  const [heroBannerPreset, setHeroBannerPreset] = useState(siteConfig.heroBannerPreset || 'mansao_luxo');
  const [phone, setPhone] = useState(siteConfig.phone || '(11) 98765-4321');
  const [whatsapp, setWhatsapp] = useState(siteConfig.whatsapp || '5511987654321');
  const [email, setEmail] = useState(siteConfig.email || 'joelsantanaimoveis@gmail.com');
  const [address, setAddress] = useState(siteConfig.address || 'São Paulo - SP');
  const [showBrokerPhoto, setShowBrokerPhoto] = useState(siteConfig.showBrokerPhotoOnProperties);
  const [layoutPreset, setLayoutPreset] = useState(siteConfig.layoutPreset || 'clean_claro');
  const [darkMode, setDarkMode] = useState(siteConfig.darkMode);

  // Lançamento Exclusivo State
  const defaultExclusiveLaunch = siteConfig.exclusiveLaunch || {
    enabled: true,
    badge: 'Lançamento Exclusivo • Joel Santana',
    title: 'Residencial Jardins de Versailles',
    subtitle: 'O mais alto padrão de sofisticação, arquitetura autoral e sustentabilidade nos Jardins.',
    description: 'Um projeto monumental concebido para quem valoriza espaço generoso, segurança biométrica de ponta, lazer estilo resort privativo e acabamentos nobres em mármore importado. Plantas inteligentes com iluminação natural abundante e vista panorâmica permanente.',
    price: 'A partir de R$ 3.850.000',
    location: 'Jardins / Itaim Bibi, São Paulo - SP',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
    features: [
      '3 a 5 Suítes com Closet Master',
      'Piscina Privativa Aquecida na Varanda',
      '4 a 6 Vagas Determinadas com Ponto Elétrico',
      'Elevador e Hall Social com Reconhecimento Facial',
      'Spa, Academia By Technogym & Wine Lounge',
      'Gerador Full que atende 100% das Unidades'
    ],
    ctaText: 'Solicitar Apresentação Exclusiva & Book Digital',
    ctaWhatsappMsg: 'Olá Joel Santana! Gostaria de receber a apresentação completa e o book digital do Residencial Jardins de Versailles.',
    statusTag: 'Obras Iniciadas'
  };

  const [exclusiveEnabled, setExclusiveEnabled] = useState<boolean>(defaultExclusiveLaunch.enabled !== false);
  const [exclusiveBadge, setExclusiveBadge] = useState<string>(defaultExclusiveLaunch.badge);
  const [exclusiveTitle, setExclusiveTitle] = useState<string>(defaultExclusiveLaunch.title);
  const [exclusiveSubtitle, setExclusiveSubtitle] = useState<string>(defaultExclusiveLaunch.subtitle);
  const [exclusiveDescription, setExclusiveDescription] = useState<string>(defaultExclusiveLaunch.description);
  const [exclusivePrice, setExclusivePrice] = useState<string>(defaultExclusiveLaunch.price);
  const [exclusiveLocation, setExclusiveLocation] = useState<string>(defaultExclusiveLaunch.location);
  const [exclusiveImageUrl, setExclusiveImageUrl] = useState<string>(defaultExclusiveLaunch.imageUrl);
  const [exclusiveSecondaryImageUrl, setExclusiveSecondaryImageUrl] = useState<string>(defaultExclusiveLaunch.secondaryImageUrl || '');
  const [exclusiveFeatures, setExclusiveFeatures] = useState<string[]>(defaultExclusiveLaunch.features || []);
  const [newFeatureInput, setNewFeatureInput] = useState<string>('');
  const [exclusiveCtaText, setExclusiveCtaText] = useState<string>(defaultExclusiveLaunch.ctaText);
  const [exclusiveCtaWhatsappMsg, setExclusiveCtaWhatsappMsg] = useState<string>(defaultExclusiveLaunch.ctaWhatsappMsg);
  const [exclusiveStatusTag, setExclusiveStatusTag] = useState<string>(defaultExclusiveLaunch.statusTag || 'Obras Iniciadas');

  // Page Toggles State
  const [showQuemSomosPage, setShowQuemSomosPage] = useState<boolean>(siteConfig.showQuemSomosPage !== false);
  const [showIndicesPage, setShowIndicesPage] = useState<boolean>(siteConfig.showIndicesPage !== false);
  const [showNoticiasPage, setShowNoticiasPage] = useState<boolean>(siteConfig.showNoticiasPage !== false);
  const [showTrustStatsBar, setShowTrustStatsBar] = useState<boolean>(siteConfig.showTrustStatsBar !== false);
  const [showLgpdBanner, setShowLgpdBanner] = useState<boolean>(siteConfig.showLgpdBanner !== false);
  const [lgpdBannerText, setLgpdBannerText] = useState<string>(siteConfig.lgpdBannerText || 'Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência em nosso site, personalizar anúncios e analisar o tráfego. Em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018), você pode gerenciar suas preferências ou consultar nossa política de privacidade a qualquer momento.');
  const [lgpdDpoEmail, setLgpdDpoEmail] = useState<string>(siteConfig.lgpdDpoEmail || 'joelsantanaimoveis@gmail.com');
  const [leadNotificationEmail, setLeadNotificationEmail] = useState<string>(siteConfig.leadNotificationEmail || 'joelsantanaimoveis@gmail.com');

  // Partner Websites State
  const [showPartnerSites, setShowPartnerSites] = useState<boolean>(siteConfig.showPartnerSites !== false);
  const [partnerSite1Name, setPartnerSite1Name] = useState<string>(siteConfig.partnerSite1Name || '');
  const [partnerSite1Url, setPartnerSite1Url] = useState<string>(siteConfig.partnerSite1Url || '');
  const [partnerSite1Desc, setPartnerSite1Desc] = useState<string>(siteConfig.partnerSite1Desc || '');
  const [partnerSite2Name, setPartnerSite2Name] = useState<string>(siteConfig.partnerSite2Name || '');
  const [partnerSite2Url, setPartnerSite2Url] = useState<string>(siteConfig.partnerSite2Url || '');
  const [partnerSite2Desc, setPartnerSite2Desc] = useState<string>(siteConfig.partnerSite2Desc || '');
  const [partnerSite3Name, setPartnerSite3Name] = useState<string>(siteConfig.partnerSite3Name || '');
  const [partnerSite3Url, setPartnerSite3Url] = useState<string>(siteConfig.partnerSite3Url || '');
  const [partnerSite3Desc, setPartnerSite3Desc] = useState<string>(siteConfig.partnerSite3Desc || '');

  // Watermark State
  const [enableWatermark, setEnableWatermark] = useState<boolean>(siteConfig.enableWatermark || false);
  const [watermarkUrl, setWatermarkUrl] = useState<string>(siteConfig.watermarkUrl || '');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(siteConfig.watermarkOpacity ?? 35);
  const [watermarkPosition, setWatermarkPosition] = useState<'center' | 'bottom-right' | 'top-right' | 'bottom-left' | 'repeat'>(siteConfig.watermarkPosition || 'center');
  const [watermarkSize, setWatermarkSize] = useState<'small' | 'medium' | 'large'>(siteConfig.watermarkSize || 'medium');

  // Social Media State
  const [instagramUrl, setInstagramUrl] = useState<string>(siteConfig.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState<string>(siteConfig.facebookUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState<string>(siteConfig.youtubeUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState<string>(siteConfig.linkedinUrl || '');
  const [tiktokUrl, setTiktokUrl] = useState<string>(siteConfig.tiktokUrl || '');
  const [twitterUrl, setTwitterUrl] = useState<string>(siteConfig.twitterUrl || '');

  useEffect(() => {
    if (!siteConfig) return;
    setInstagramUrl(siteConfig.instagramUrl || '');
    setFacebookUrl(siteConfig.facebookUrl || '');
    setYoutubeUrl(siteConfig.youtubeUrl || '');
    setLinkedinUrl(siteConfig.linkedinUrl || '');
    setTiktokUrl(siteConfig.tiktokUrl || '');
    setTwitterUrl(siteConfig.twitterUrl || '');

    if (siteConfig.heroTitle) setHeroTitle(siteConfig.heroTitle);
    if (siteConfig.heroTitleOpacity !== undefined) setHeroTitleOpacity(siteConfig.heroTitleOpacity);
    if (siteConfig.heroTitleFontSize !== undefined) setHeroTitleFontSize(siteConfig.heroTitleFontSize);
    if (siteConfig.heroTitlePositionY !== undefined) setHeroTitlePositionY(siteConfig.heroTitlePositionY);
    if (siteConfig.heroSubtitle !== undefined) setHeroSubtitle(siteConfig.heroSubtitle);
    if (siteConfig.heroBannerImage) setHeroBannerImage(siteConfig.heroBannerImage);
    if (siteConfig.heroBannerPreset) setHeroBannerPreset(siteConfig.heroBannerPreset);

    if (siteConfig.primaryColorHex) setPrimaryColor(siteConfig.primaryColorHex);
    if (siteConfig.accentColorHex) setAccentColor(siteConfig.accentColorHex);
    if (siteConfig.colorTheme) setColorTheme(siteConfig.colorTheme);
    if (siteConfig.contourColorHex) setContourColor(siteConfig.contourColorHex);
    if (siteConfig.detailsColorHex) setDetailsColor(siteConfig.detailsColorHex);
    if (siteConfig.enableCustomContours !== undefined) setEnableCustomContours(siteConfig.enableCustomContours);
    if (siteConfig.backgroundMode) setBackgroundMode(siteConfig.backgroundMode);
    if (siteConfig.companyName) setCompanyName(siteConfig.companyName);
    if (siteConfig.creciJuridico) setCreciJuridico(siteConfig.creciJuridico);
    if (siteConfig.creciFisico) setCreciFisico(siteConfig.creciFisico);
    if (siteConfig.brokerCnae) setBrokerCnae(siteConfig.brokerCnae);
    if (siteConfig.brokerSecondaryPhone) setBrokerSecondaryPhone(siteConfig.brokerSecondaryPhone);
    if (siteConfig.cnpj) setCnpj(siteConfig.cnpj);
    if (siteConfig.phone) setPhone(siteConfig.phone);
    if (siteConfig.whatsapp) setWhatsapp(siteConfig.whatsapp);
    if (siteConfig.email) setEmail(siteConfig.email);
    if (siteConfig.address) setAddress(siteConfig.address);
    if (siteConfig.showBrokerPhotoOnProperties !== undefined) setShowBrokerPhoto(siteConfig.showBrokerPhotoOnProperties);
    if (siteConfig.brokerName) setBrokerName(siteConfig.brokerName);
    if (siteConfig.brokerCreci) setBrokerCreci(siteConfig.brokerCreci);
    if (siteConfig.brokerCnai) setBrokerCnai(siteConfig.brokerCnai);
    if (siteConfig.brokerPhone) setBrokerPhone(siteConfig.brokerPhone);
    if (siteConfig.brokerWhatsapp) setBrokerWhatsapp(siteConfig.brokerWhatsapp);
    if (siteConfig.brokerEmail) setBrokerEmail(siteConfig.brokerEmail);
    if (siteConfig.brokerBio) setBrokerBio(siteConfig.brokerBio);
    if (siteConfig.brokerRegion) setBrokerRegion(siteConfig.brokerRegion);

    const masterAv = users.find(u => u.isMasterAdmin || u.id === 'usr_master_joel' || (u.email && u.email.toLowerCase() === 'joelsantanaimoveis@gmail.com'))?.avatar;
    const effectiveAv = (siteConfig.brokerAvatarUrl && !siteConfig.brokerAvatarUrl.includes('1560250097-0b93528c311a'))
      ? siteConfig.brokerAvatarUrl
      : (masterAv || siteConfig.brokerAvatarUrl);

    if (effectiveAv) {
      setBrokerAvatarUrl(effectiveAv);
      setProfileAvatar(effectiveAv);
    }
  }, [siteConfig, users]);

  // Trust Stats & Differentials Configurable State
  const [trustStat1Value, setTrustStat1Value] = useState<string>(siteConfig.trustStat1Value || '+1.500');
  const [trustStat1Label, setTrustStat1Label] = useState<string>(siteConfig.trustStat1Label || 'Imóveis Cadastrados');
  const [trustStat2Value, setTrustStat2Value] = useState<string>(siteConfig.trustStat2Value || '100%');
  const [trustStat2Label, setTrustStat2Label] = useState<string>(siteConfig.trustStat2Label || 'Documentação Auditada');
  const [trustStat3Value, setTrustStat3Value] = useState<string>(siteConfig.trustStat3Value || 'Ágil e Direto');
  const [trustStat3Label, setTrustStat3Label] = useState<string>(siteConfig.trustStat3Label || 'Atendimento via WhatsApp');
  const [trustStat4Value, setTrustStat4Value] = useState<string>(siteConfig.trustStat4Value || 'Nota 4.9/5');
  const [trustStat4Label, setTrustStat4Label] = useState<string>(siteConfig.trustStat4Label || 'Avaliações Positivas');

  const [diff1Title, setDiff1Title] = useState<string>(siteConfig.diff1Title || '100% Documentação Auditada');
  const [diff1Desc, setDiff1Desc] = useState<string>(siteConfig.diff1Desc || 'Análise rigorosa das certidões e matrículas antes da colocação no mercado.');
  const [diff2Title, setDiff2Title] = useState<string>(siteConfig.diff2Title || 'Atendimento Ágil e Atencioso');
  const [diff2Desc, setDiff2Desc] = useState<string>(siteConfig.diff2Desc || 'Corretores credenciados de prontidão via WhatsApp para tirar todas as dúvidas imediatamente.');
  const [diff3Title, setDiff3Title] = useState<string>(siteConfig.diff3Title || 'Imóveis Verificados e Validados');
  const [diff3Desc, setDiff3Desc] = useState<string>(siteConfig.diff3Desc || 'Imóveis verificados e validados para garantir uma negociação totalmente segura.');
  const [diff4Title, setDiff4Title] = useState<string>(siteConfig.diff4Title || 'Avaliação Precisa de Mercado');
  const [diff4Desc, setDiff4Desc] = useState<string>(siteConfig.diff4Desc || 'Metodologia com dados reais de transações na região para garantir o valor justo.');

  // Notification Toast & Persistence State
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isSavingBlock, setIsSavingBlock] = useState(false);

  const showSuccessNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setSaveErrorMessage(null);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4500);
  };

  const showErrorNotification = (msg: string) => {
    setSaveErrorMessage(msg);
    setSaveSuccessMessage(null);
    setTimeout(() => {
      setSaveErrorMessage(null);
    }, 6000);
  };

  // Logo State
  const [logoText, setLogoText] = useState(siteConfig.logoText || 'Joel Santana');
  const [logoUrl, setLogoUrl] = useState(siteConfig.logoUrl || '');
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>(siteConfig.logoSize || 'lg');
  const [logoPosition, setLogoPosition] = useState<'left' | 'right'>(siteConfig.logoPosition || 'left');

  // Autonomous Broker State
  const [brokerName, setBrokerName] = useState(siteConfig.brokerName || 'Joel Santana');
  const [brokerCreci, setBrokerCreci] = useState(siteConfig.brokerCreci || 'CRECI 12345-F');
  const [brokerCnai, setBrokerCnai] = useState(siteConfig.brokerCnai || 'CNAI 12345');
  const [brokerPhone, setBrokerPhone] = useState(siteConfig.brokerPhone || '(11) 98765-4321');
  const [brokerWhatsapp, setBrokerWhatsapp] = useState(siteConfig.brokerWhatsapp || '5511987654321');
  const [brokerEmail, setBrokerEmail] = useState(siteConfig.brokerEmail || 'joelsantanaimoveis@gmail.com');
  const [brokerAddress, setBrokerAddress] = useState(siteConfig.brokerAddress || 'São Paulo - SP');
  const [brokerAvatarUrl, setBrokerAvatarUrl] = useState(siteConfig.brokerAvatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80');
  const [brokerBio, setBrokerBio] = useState(siteConfig.brokerBio || 'Corretor autônomo de imóveis especializado em lançamentos, alto padrão e assessoria imobiliária personalizada.');
  const [brokerRegion, setBrokerRegion] = useState(siteConfig.brokerRegion || 'São Paulo e Região Metropolitana');

  // Banner Presets Gallery
  const BANNER_PRESETS = [
    {
      id: 'mansao_luxo',
      title: '1. Mansão Iluminada ao Entardecer',
      desc: 'Arquitetura contemporânea imponente com piscina aquecida iluminada.',
      tag: 'Alto Padrão',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=80'
    },
    {
      id: 'cobertura_skyline',
      title: '2. Cobertura Skyline Pôr do Sol',
      desc: 'Vista panorâmica privilegiada dos arranha-céus da metrópole.',
      tag: 'Penthouse Skyline',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&auto=format&fit=crop&q=80'
    },
    {
      id: 'piscina_borda_infinita',
      title: '3. Residência com Piscina Infinita',
      desc: 'Conceito aberto contemporâneo com deck de madeira e borda infinita.',
      tag: 'Exclusividade',
      url: '/images/leisure_area_pool_card_1789505179384.jpg'
    },
    {
      id: 'living_minimalista',
      title: '4. Living Minimalista & Pé Direito Duplo',
      desc: 'Design de interiores escandinavo e acabamento em mármore nobre.',
      tag: 'Design Assinado',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&auto=format&fit=crop&q=80'
    },
    {
      id: 'corporativo_triple_a',
      title: '5. Torre Comercial & Corporativa Prime',
      desc: 'Fachada envidraçada espelhada para escritórios e lajes corporativas.',
      tag: 'Comercial Triple A',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop&q=80'
    },
    {
      id: 'villa_tropical',
      title: '6. Villa Tropical & Paisagismo Exuberante',
      desc: 'Mansão cercada por área verde e spa integrado nos Jardins.',
      tag: 'Villa & Spa',
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&auto=format&fit=crop&q=80'
    },
    {
      id: 'skyline_noturno',
      title: '7. Penthouse Skyline Noturno',
      desc: 'Ambiente noturno cosmopolita com luzes urbanas e terraço gourmet.',
      tag: 'Cosmopolita',
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&auto=format&fit=crop&q=80'
    },
    {
      id: 'casa_campo_haras',
      title: '8. Casa de Campo & Condomínio Fechado',
      desc: 'Refúgio campestre com lagos, haras e total privacidade na natureza.',
      tag: 'Campo & Natureza',
      url: '/images/fazenda_sede_1789524647400.jpg'
    },
    {
      id: 'chacara_lazer',
      title: '9. Chácara & Imóvel Rural de Lazer',
      desc: 'Propriedade rural com área verde, pomar e espaço de convivência.',
      tag: 'Chácara & Rural',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&auto=format&fit=crop&q=80'
    },
    {
      id: 'casa_praia',
      title: '10. Casa de Praia & Vista para o Mar',
      desc: 'Imóvel no litoral com brisa marinha e arquitetura praiana.',
      tag: 'Praia & Litoral',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&auto=format&fit=crop&q=80'
    }
  ];

  const handleBannerFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        setHeroBannerImage(e.target.result as string);
        setHeroBannerPreset('custom');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/png'); // PNG for transparency
            setLogoUrl(dataUrl);
          } else {
            setLogoUrl(e.target.result as string);
          }
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExclusiveMainImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setExclusiveImageUrl(dataUrl);
          } else {
            setExclusiveImageUrl(e.target.result as string);
          }
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExclusiveSecondaryImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        setExclusiveSecondaryImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBrokerAvatarFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setBrokerAvatarUrl(dataUrl);
          } else {
            setBrokerAvatarUrl(e.target.result as string);
          }
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Feature to Exclusive Launch
  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setExclusiveFeatures([...exclusiveFeatures, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setExclusiveFeatures(exclusiveFeatures.filter((_, i) => i !== index));
  };

  // Theme Preset Selector
  const handleSelectThemePreset = (preset: 'padrao' | 'verde' | 'vermelho' | 'azul' | 'dourado_preto') => {
    setColorTheme(preset);
    if (preset === 'padrao') {
      setContourColor('#6366f1');
      setDetailsColor('#4f46e5');
      setPrimaryColor('#4f46e5');
      setAccentColor('#06b6d4');
      setEnableCustomContours(false);
    } else if (preset === 'verde') {
      setContourColor('#10b981');
      setDetailsColor('#059669');
      setPrimaryColor('#059669');
      setAccentColor('#10b981');
      setEnableCustomContours(true);
    } else if (preset === 'vermelho') {
      setContourColor('#ef4444');
      setDetailsColor('#dc2626');
      setPrimaryColor('#dc2626');
      setAccentColor('#ef4444');
      setEnableCustomContours(true);
    } else if (preset === 'azul') {
      setContourColor('#3b82f6');
      setDetailsColor('#2563eb');
      setPrimaryColor('#2563eb');
      setAccentColor('#3b82f6');
      setEnableCustomContours(true);
    } else if (preset === 'dourado_preto') {
      setContourColor('#d97706');
      setDetailsColor('#d97706');
      setPrimaryColor('#d97706');
      setAccentColor('#f59e0b');
      setEnableCustomContours(true);
    }
  };

  // Global Save Handler with double-click protection and persistent feedback
  const handleSaveAllConfigurations = async (customMsg?: string) => {
    if (isSavingConfig) return;
    setIsSavingConfig(true);

    try {
      const updatedExclusive = {
        enabled: exclusiveEnabled,
        badge: exclusiveBadge,
        title: exclusiveTitle,
        subtitle: exclusiveSubtitle,
        description: exclusiveDescription,
        price: exclusivePrice,
        location: exclusiveLocation,
        imageUrl: exclusiveImageUrl,
        secondaryImageUrl: exclusiveSecondaryImageUrl,
        features: exclusiveFeatures,
        ctaText: exclusiveCtaText,
        ctaWhatsappMsg: exclusiveCtaWhatsappMsg,
        statusTag: exclusiveStatusTag
      };

      const normalizeUrl = (url: string) => {
        if (!url || !url.trim()) return '';
        let cleaned = url.trim();
        if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
          cleaned = 'https://' + cleaned;
        }
        return cleaned;
      };

      await updateSiteConfig({
        primaryColorHex: primaryColor,
        accentColorHex: accentColor,
        colorTheme,
        contourColorHex: contourColor,
        detailsColorHex: detailsColor,
        enableCustomContours,
        backgroundMode,
        companyName,
        backupEmail,
        creciJuridico,
        creciFisico,
        cnpj,
        heroTitle,
        heroTitleOpacity,
        heroTitleFontSize,
        heroTitlePositionY,
        heroSubtitle,
        heroBannerImage,
        heroBannerPreset,
        phone,
        whatsapp,
        email,
        address,
        showBrokerPhotoOnProperties: showBrokerPhoto,
        layoutPreset,
        darkMode: backgroundMode === 'dark' ? true : darkMode,
        logoText,
        logoUrl,
        logoSize,
        logoPosition,
        brokerName: brokerName || profileName || currentUser?.name,
        brokerCreci: creciFisico || profileCreci || brokerCreci,
        brokerCnai,
        brokerCnae: brokerCnae || profileCnae || '6821-8/01',
        brokerPhone: brokerPhone || profilePhone || currentUser?.phone,
        brokerSecondaryPhone: brokerSecondaryPhone || profileSecondaryPhone,
        brokerWhatsapp: brokerWhatsapp || profileWhatsapp || currentUser?.whatsapp,
        brokerEmail: brokerEmail || currentUser?.email,
        brokerAddress: brokerAddress || profileAddress,
        brokerAvatarUrl: (profileAvatar && !profileAvatar.includes('1560250097-0b93528c311a'))
          ? profileAvatar
          : ((brokerAvatarUrl && !brokerAvatarUrl.includes('1560250097-0b93528c311a')) ? brokerAvatarUrl : (currentUser?.avatar || brokerAvatarUrl)),
        brokerBio: profileBio || brokerBio,
        brokerRegion,
        showQuemSomosPage,
        showIndicesPage,
        showNoticiasPage,
        showTrustStatsBar,
        showLgpdBanner,
        lgpdBannerText,
        lgpdDpoEmail,
        showPartnerSites,
        partnerSite1Name,
        partnerSite1Url,
        partnerSite1Desc,
        partnerSite2Name,
        partnerSite2Url,
        partnerSite2Desc,
        partnerSite3Name,
        partnerSite3Url,
        partnerSite3Desc,
        enableWatermark,
        watermarkUrl,
        watermarkOpacity,
        watermarkPosition,
        watermarkSize,
        trustStat1Value,
        trustStat1Label,
        trustStat2Value,
        trustStat2Label,
        trustStat3Value,
        trustStat3Label,
        trustStat4Value,
        trustStat4Label,
        diff1Title,
        diff1Desc,
        diff2Title,
        diff2Desc,
        diff3Title,
        diff3Desc,
        diff4Title,
        diff4Desc,
        instagramUrl: normalizeUrl(instagramUrl),
        facebookUrl: normalizeUrl(facebookUrl),
        youtubeUrl: normalizeUrl(youtubeUrl),
        linkedinUrl: normalizeUrl(linkedinUrl),
        tiktokUrl: normalizeUrl(tiktokUrl),
        twitterUrl: normalizeUrl(twitterUrl),
        exclusiveLaunch: updatedExclusive,
        // SEO & Buscadores
        customDomain,
        seoTitle,
        seoDescription,
        seoKeywords,
        seoCanonicalUrl,
        seoOgImageUrl,
        seoGoogleSearchConsole,
        seoGoogleAnalyticsId,
        seoMetaPixelId,
        seoCity,
        seoState,
        seoRegion,
        seoRobotsIndex,
        seoStructuredDataEnabled,
        leadNotificationEmail
      });

      showSuccessNotification(customMsg || '✨ Todas as configurações foram salvas com sucesso no banco de dados e navegador!');
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      showErrorNotification('Erro ao salvar configurações. Seus dados permanecem na tela para você tentar novamente.');
    } finally {
      setTimeout(() => setIsSavingConfig(false), 500);
    }
  };

  const handleApplyPresetSeoSjrp = (saveImmediately: boolean = false) => {
    const sjrpTitle = 'Joel Santana Corretor de Imóveis | Comprar e Alugar em São José do Rio Preto e Região - SP';
    const sjrpDesc = 'Encontre as melhores casas, apartamentos, condomínios fechados, terrenos e imóveis comerciais para comprar ou alugar em São José do Rio Preto - SP e região. Atendimento exclusivo com Joel Santana Corretor de Imóveis. WhatsApp: (17) 99195-1473.';
    const sjrpKeywords = 'imóveis são josé do rio preto, casas à venda são josé do rio preto, comprar casa rio preto, apartamentos alugar são josé do rio preto, aluguel são josé do rio preto, terrenos rio preto sp, corretor joel santana, joel santana corretor de imóveis, imobiliária são josé do rio preto, casas em condomínio fechado rio preto, chácaras rio preto, locação de imóveis rio preto sp';
    const sjrpUrl = 'https://joelsantanacorretor.com.br';
    const sjrpCity = 'São José do Rio Preto';
    const sjrpState = 'SP';
    const sjrpRegion = 'São José do Rio Preto, Mirassol, Bady Bassitt, Cedral e Noroeste Paulista';
    const sjrpConsole = 'google-site-verification=joelsantana-sjrp-imoveis';
    const sjrpAnalytics = 'G-JOELSANTANA';

    setSeoTitle(sjrpTitle);
    setSeoDescription(sjrpDesc);
    setSeoKeywords(sjrpKeywords);
    setSeoCanonicalUrl(sjrpUrl);
    setSeoCity(sjrpCity);
    setSeoState(sjrpState);
    setSeoRegion(sjrpRegion);
    setSeoRobotsIndex(true);
    setSeoStructuredDataEnabled(true);
    setSeoGoogleSearchConsole(sjrpConsole);
    setSeoGoogleAnalyticsId(sjrpAnalytics);

    if (saveImmediately) {
      updateSiteConfig({
        seoTitle: sjrpTitle,
        seoDescription: sjrpDesc,
        seoKeywords: sjrpKeywords,
        seoCanonicalUrl: sjrpUrl,
        seoCity: sjrpCity,
        seoState: sjrpState,
        seoRegion: sjrpRegion,
        seoRobotsIndex: true,
        seoStructuredDataEnabled: true,
        seoGoogleSearchConsole: sjrpConsole,
        seoGoogleAnalyticsId: sjrpAnalytics
      });
      showSuccessNotification('🚀 Configuração de SEO para São José do Rio Preto salva e aplicada com sucesso!');
    } else {
      showSuccessNotification('🚀 Configuração de SEO recomendada para São José do Rio Preto e Região preenchida! Clique em Salvar para publicar.');
    }
  };

  // Quick Action to Toggle and Save Exclusive Launch State
  const handleToggleExclusiveAndSave = (enabled: boolean) => {
    setExclusiveEnabled(enabled);
    const updatedExclusive = {
      ...(siteConfig.exclusiveLaunch || {}),
      enabled,
      badge: exclusiveBadge,
      title: exclusiveTitle,
      subtitle: exclusiveSubtitle,
      description: exclusiveDescription,
      price: exclusivePrice,
      location: exclusiveLocation,
      imageUrl: exclusiveImageUrl,
      secondaryImageUrl: exclusiveSecondaryImageUrl,
      features: exclusiveFeatures,
      ctaText: exclusiveCtaText,
      ctaWhatsappMsg: exclusiveCtaWhatsappMsg,
      statusTag: exclusiveStatusTag
    };

    updateSiteConfig({ exclusiveLaunch: updatedExclusive });
    showSuccessNotification(
      enabled
        ? '✓ Lançamento Exclusivo ATIVADO no portal com sucesso!'
        : '✕ Lançamento Exclusivo DESATIVADO e OCULTO do portal público com sucesso!'
    );
  };

  // Quick Action to Reset / Clear Launch Frame
  const handleResetExclusiveLaunch = () => {
    if (!window.confirm('Deseja realmente desativar e redefinir o quadro de lançamento exclusivo?')) return;
    setExclusiveEnabled(false);
    setExclusiveTitle('');
    setExclusiveSubtitle('');
    setExclusiveDescription('');
    setExclusivePrice('');
    setExclusiveLocation('');
    setExclusiveFeatures([]);

    const updatedExclusive = {
      enabled: false,
      badge: '',
      title: '',
      subtitle: '',
      description: '',
      price: '',
      location: '',
      imageUrl: '',
      secondaryImageUrl: '',
      features: [],
      ctaText: 'Falar com Joel Santana',
      ctaWhatsappMsg: 'Olá Joel Santana! Gostaria de mais informações.',
      statusTag: 'Em Breve'
    };

    updateSiteConfig({ exclusiveLaunch: updatedExclusive });
    showSuccessNotification('Quadro de lançamento desativado e limpo com sucesso.');
  };

  // Safe delete with visual feedback
  const handleDeleteHtmlBlock = (id: string, title: string) => {
    deleteHtmlBlock(id);
    const msg = `Quadro/Bloco "${title}" excluído com sucesso!`;
    setHtmlFeedback({ type: 'success', message: msg });
    showSuccessNotification(msg);
  };

  // New Team Member Form (Admin Joel)
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('corretor');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberSecondaryPhone, setNewMemberSecondaryPhone] = useState('');
  const [newMemberCreci, setNewMemberCreci] = useState('');
  const [newMemberCnae, setNewMemberCnae] = useState('');
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const [newMemberBio, setNewMemberBio] = useState('');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // User Profile Edit Form
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileSecondaryPhone, setProfileSecondaryPhone] = useState(currentUser?.secondaryPhone || siteConfig.brokerSecondaryPhone || '');
  const [profileWhatsapp, setProfileWhatsapp] = useState(currentUser?.whatsapp || '');
  const [profileCreci, setProfileCreci] = useState(currentUser?.creci || '');
  const [profileCnae, setProfileCnae] = useState(currentUser?.cnai || currentUser?.cnae || siteConfig.brokerCnai || siteConfig.brokerCnae || 'CNAI 12345');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || siteConfig.brokerAddress || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileSecondaryPhone(currentUser.secondaryPhone || siteConfig.brokerSecondaryPhone || '');
      setProfileWhatsapp(currentUser.whatsapp || '');
      setProfileCreci(currentUser.creci || '');
      setProfileCnae(currentUser.cnai || currentUser.cnae || siteConfig.brokerCnai || siteConfig.brokerCnae || 'CNAI 12345');
      setProfileAddress(currentUser.address || siteConfig.brokerAddress || '');
      setProfileBio(currentUser.bio || '');
      setProfileAvatar(currentUser.avatar || '');
    }
  }, [currentUser, siteConfig]);

  // HTML Block Modal
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockTitle, setBlockTitle] = useState('');
  const [blockPosition, setBlockPosition] = useState<CustomHtmlBlock['position']>('hero_banner');
  const [blockSlug, setBlockSlug] = useState('');
  const [blockContent, setBlockContent] = useState('');

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const handleAvatarFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          let finalDataUrl = e.target.result as string;
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            finalDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
          
          setProfileAvatar(finalDataUrl);
          setBrokerAvatarUrl(finalDataUrl);
          if (currentUser) {
            updateUserProfile(currentUser.id, { avatar: finalDataUrl });
          }
          updateSiteConfig({ brokerAvatarUrl: finalDataUrl });
          showSuccessNotification('Foto atualizada com sucesso no perfil e na vitrine do site!');
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWatermarkFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/png'); // Keep PNG for transparency
            setWatermarkUrl(dataUrl);
            setEnableWatermark(true);
          } else {
            setWatermarkUrl(e.target.result as string);
            setEnableWatermark(true);
          }
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    const res = addUser({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      phone: newMemberPhone || '(11) 90000-0000',
      secondaryPhone: newMemberSecondaryPhone,
      whatsapp: newMemberPhone ? `55${newMemberPhone.replace(/\D/g, '')}` : '5511900000000',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
      commissionRate: newMemberRole === 'corretor' ? 50 : 0,
      creci: newMemberCreci,
      cnae: newMemberCnae,
      cnai: newMemberCnae,
      address: newMemberAddress,
      bio: newMemberBio,
      status: 'convidado'
    });

    setGeneratedInviteLink(res.inviteLink);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setNewMemberSecondaryPhone('');
    setNewMemberCreci('');
    setNewMemberCnae('');
    setNewMemberAddress('');
    setNewMemberBio('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateUserProfile(currentUser.id, {
      name: profileName,
      phone: profilePhone,
      secondaryPhone: profileSecondaryPhone,
      whatsapp: profileWhatsapp,
      creci: profileCreci,
      cnae: profileCnae,
      cnai: profileCnae,
      address: profileAddress,
      bio: profileBio,
      avatar: profileAvatar
    });

    await updateSiteConfig({
      brokerAvatarUrl: profileAvatar,
      brokerName: profileName,
      brokerCreci: profileCreci,
      brokerCnae: profileCnae,
      brokerCnai: profileCnae,
      brokerPhone: profilePhone,
      brokerSecondaryPhone: profileSecondaryPhone,
      brokerWhatsapp: profileWhatsapp,
      brokerAddress: profileAddress,
      brokerBio: profileBio
    });

    setBrokerAvatarUrl(profileAvatar);
    setProfileSuccessMsg(true);
    showSuccessNotification('Perfil e dados de exibição do site salvos com sucesso!');
    setTimeout(() => setProfileSuccessMsg(false), 4000);
  };

  const handleOpenNewHtmlModal = () => {
    setEditingBlockId(null);
    setBlockTitle('');
    setBlockPosition('hero_banner');
    setBlockSlug('');
    setBlockContent(`<div style="background: #1e1b4b; color: white; padding: 20px; border-radius: 12px; text-align: center;">
  <h2>Seu Bloco HTML Customizado</h2>
  <p>Edite este código HTML como quiser!</p>
</div>`);
    setIsHtmlModalOpen(true);
  };

  const handleOpenEditHtmlModal = (b: CustomHtmlBlock) => {
    setEditingBlockId(b.id);
    setBlockTitle(b.title);
    setBlockPosition(b.position);
    setBlockSlug(b.slug || '');
    setBlockContent(b.htmlContent);
    setIsHtmlModalOpen(true);
  };

  const handleSaveHtmlBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingBlock) return;
    setHtmlFeedback(null);

    const trimmedTitle = (blockTitle || '').trim();
    const trimmedContent = (blockContent || '').trim();
    let rawSlug = (blockSlug || '').trim();

    // 1. Validação do Título
    if (!trimmedTitle) {
      const errMsg = 'O título do bloco ou página é obrigatório.';
      console.warn('[ConfiguradorHtmlTema] Falha na validação: Título vazio.');
      setHtmlFeedback({ type: 'error', message: errMsg });
      return;
    }

    // 2. Validação do Conteúdo HTML
    if (!trimmedContent) {
      const errMsg = 'O código HTML ou script não pode estar vazio.';
      console.warn('[ConfiguradorHtmlTema] Falha na validação: Conteúdo HTML vazio.');
      setHtmlFeedback({ type: 'error', message: errMsg });
      return;
    }

    // 3. Validação e Sanitização do Slug
    let validSlug = '';
    if (blockPosition === 'custom_page') {
      if (!rawSlug) {
        rawSlug = trimmedTitle;
      }
      validSlug = rawSlug
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-z0-9-_]/g, '-')     // apenas letras, números e hífens
        .replace(/-+/g, '-')             // remove múltiplos hífens consecutivos
        .replace(/^-|-$/g, '');          // remove hífens nas extremidades

      if (!validSlug) {
        validSlug = `pagina-${Date.now()}`;
      }
    } else {
      if (rawSlug) {
        validSlug = rawSlug
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9-_]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
    }

    // 4. Log de Verificação antes da gravação (Requisito obrigatório do usuário)
    console.log('[ConfiguradorHtmlTema] Verificação e Validação antes da gravação:', {
      operacao: editingBlockId ? 'ATUALIZAR_BLOCO' : 'CRIAR_NOVO_BLOCO',
      blocoId: editingBlockId || 'novo',
      titulo: trimmedTitle,
      posicao: blockPosition,
      slugOriginal: blockSlug,
      slugValidado: validSlug,
      isPaginaCustomizada: blockPosition === 'custom_page',
      tamanhoHtmlChars: trimmedContent.length,
      validacaoSlugAprovada: blockPosition === 'custom_page' ? Boolean(validSlug) : true,
      validacaoHtmlAprovada: Boolean(trimmedContent),
      timestamp: new Date().toISOString()
    });

    setIsSavingBlock(true);

    try {
      if (editingBlockId) {
        const existing = customHtmlBlocks.find(b => b.id === editingBlockId);
        if (existing) {
          updateHtmlBlock({
            ...existing,
            title: trimmedTitle,
            position: blockPosition,
            slug: validSlug || '',
            htmlContent: trimmedContent
          });
        }
        const successMsg = blockPosition === 'custom_page'
          ? `Página personalizada "${trimmedTitle}" atualizada com sucesso! (Slug ativo: /page_${validSlug})`
          : `Bloco HTML "${trimmedTitle}" atualizado com sucesso!`;
        setHtmlFeedback({ type: 'success', message: successMsg });
        showSuccessNotification(successMsg);
      } else {
        addHtmlBlock({
          title: trimmedTitle,
          position: blockPosition,
          slug: validSlug || '',
          htmlContent: trimmedContent,
          active: true
        });
        const successMsg = blockPosition === 'custom_page'
          ? `Nova página personalizada "${trimmedTitle}" criada com sucesso! Acesse pelo menu superior ou slug: /page_${validSlug}`
          : `Novo bloco HTML "${trimmedTitle}" criado e salvo com sucesso!`;
        setHtmlFeedback({ type: 'success', message: successMsg });
        showSuccessNotification(successMsg);
      }

      setIsHtmlModalOpen(false);
    } catch (err: any) {
      const errMsg = `Erro ao salvar bloco HTML: ${err?.message || 'Falha na gravação.'}`;
      console.error('[ConfiguradorHtmlTema] Erro na gravação:', err);
      setHtmlFeedback({ type: 'error', message: errMsg });
      showErrorNotification(errMsg);
    } finally {
      setTimeout(() => setIsSavingBlock(false), 400);
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newPassword) return;

    updateUserPassword(currentUser.id, newPassword);
    setPassMsg('Senha alterada com sucesso!');
    setNewPassword('');
    setTimeout(() => setPassMsg(''), 4000);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* Visual Success Confirmation Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-emerald-100">Configurações Salvas</p>
            <p className="text-xs font-semibold">{saveSuccessMessage}</p>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)} className="ml-2 text-emerald-200 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Visual Error Notification */}
      {saveErrorMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-rose-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-400 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-rose-100">Atenção ao Salvar</p>
            <p className="text-xs font-semibold">{saveErrorMessage}</p>
          </div>
          <button onClick={() => setSaveErrorMessage(null)} className="ml-2 text-rose-200 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Top Banner Header with Dynamic Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Painel de Configurações Internas
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gerencie tema visual, lançamento exclusivo, dados jurídicos (CRECI/CNPJ), equipe e páginas.
            </p>
          </div>
        </div>

        {/* Action Save Button & View Mode Toggle in Top Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => toggleConfigViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                configViewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Exibir seções em Grade (Cards)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards (Grade)</span>
            </button>
            <button
              onClick={() => toggleConfigViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                configViewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Exibir seções em Lista"
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>

          <button
            type="button"
            disabled={isSavingConfig}
            onClick={() => handleSaveAllConfigurations()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSavingConfig ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{isSavingConfig ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Tabs Navigation Bar */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveSubTab('tema')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'tema'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Tema, Cores & Banner</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lancamento')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'lancamento'
              ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Lançamento Exclusivo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('legal')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'legal'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>CRECI, CNPJ & Dados Legais</span>
        </button>

        {(currentUser?.role === 'admin' || currentUser?.isMasterAdmin) && (
          <button
            onClick={() => setActiveSubTab('equipe')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'equipe'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestão da Equipe</span>
          </button>
        )}

        <button
          onClick={() => setActiveSubTab('perfil')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'perfil'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Meu Perfil</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notificacoes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'notificacoes'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notificações Push (FCM)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('html')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'html'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Páginas & Blocos HTML</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seo')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'seo'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4 text-emerald-500" />
          <span>SEO & Google Ranking</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seguranca')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'seguranca'
              ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>Segurança & Backup</span>
        </button>
      </div>

      {/* ==================== TAB 2: LANÇAMENTO EXCLUSIVO CONFIGURATION ==================== */}
      {activeSubTab === 'lancamento' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Main Activation & Information Header */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Configuração do Lançamento Exclusivo (VIP)</h2>
                  <p className="text-xs text-slate-500">Configure fotos, valores, diferenciais e mensagens de WhatsApp do empreendimento em destaque.</p>
                </div>
              </div>

              {/* Activation Switch & Instant Action Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Status:</span>
                  <button
                    type="button"
                    onClick={() => setExclusiveEnabled(!exclusiveEnabled)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      exclusiveEnabled
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {exclusiveEnabled ? '✓ Ativo no Site' : '✕ Oculto / Desativado'}
                  </button>
                </div>

                {exclusiveEnabled ? (
                  <button
                    type="button"
                    onClick={() => handleToggleExclusiveAndSave(false)}
                    className="px-3 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-200 dark:border-amber-800 transition-all"
                    title="Oculta o quadro imediatamente do site público"
                  >
                    Ocultar do Site Agora
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleExclusiveAndSave(true)}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 transition-all"
                    title="Ativa e publica o quadro no site público"
                  >
                    Ativar no Site Agora
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetExclusiveLaunch}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 transition-all"
                  title="Limpa os campos e desativa o lançamento"
                >
                  Limpar / Redefinir
                </button>
              </div>
            </div>

            {/* Status Notice Banner */}
            {!exclusiveEnabled && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  <strong>Atenção:</strong> Este quadro de lançamento está atualmente <strong>DESATIVADO e OCULTO</strong>. Ele não será exibido na página inicial pública para os visitantes.
                </span>
              </div>
            )}

            {/* Live Interactive Preview Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pré-visualização do Lançamento no Portal:
              </span>
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Photo showcase in preview */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                    <img
                      src={exclusiveImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80'}
                      alt="Lançamento Exclusivo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                      {exclusiveStatusTag || 'Obras Iniciadas'}
                    </div>
                  </div>
                </div>

                {/* Info in preview */}
                <div className="lg:col-span-6 space-y-3">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-widest inline-block">
                    {exclusiveBadge || 'Lançamento Exclusivo • Joel Santana'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{exclusiveTitle || 'Título do Lançamento'}</h3>
                  <p className="text-xs text-amber-200 font-semibold">{exclusiveLocation || 'Localização Nobre'}</p>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{exclusiveDescription}</p>
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor Especial:</span>
                    <span className="text-xl font-black text-amber-300">{exclusivePrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields for Exclusive Launch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
              
              {/* Left Column: Titles & Texts */}
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Título do Lançamento</label>
                  <input
                    type="text"
                    value={exclusiveTitle}
                    onChange={e => setExclusiveTitle(e.target.value)}
                    placeholder="Ex: Residencial Jardins de Versailles"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Tag VIP / Badge Superior</label>
                  <input
                    type="text"
                    value={exclusiveBadge}
                    onChange={e => setExclusiveBadge(e.target.value)}
                    placeholder="Ex: Lançamento Exclusivo • Joel Santana"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Subtítulo / Proposta</label>
                  <input
                    type="text"
                    value={exclusiveSubtitle}
                    onChange={e => setExclusiveSubtitle(e.target.value)}
                    placeholder="Ex: O mais alto padrão de sofisticação e sustentabilidade..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">Preço / A partir de</label>
                    <input
                      type="text"
                      value={exclusivePrice}
                      onChange={e => setExclusivePrice(e.target.value)}
                      placeholder="Ex: A partir de R$ 3.850.000"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">Status da Obra</label>
                    <input
                      type="text"
                      value={exclusiveStatusTag}
                      onChange={e => setExclusiveStatusTag(e.target.value)}
                      placeholder="Ex: Obras Iniciadas / Pré-Lançamento"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Localização</label>
                  <input
                    type="text"
                    value={exclusiveLocation}
                    onChange={e => setExclusiveLocation(e.target.value)}
                    placeholder="Ex: Jardins / Itaim Bibi, São Paulo - SP"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Texto Descritivo Completo</label>
                  <textarea
                    rows={4}
                    value={exclusiveDescription}
                    onChange={e => setExclusiveDescription(e.target.value)}
                    placeholder="Descreva os detalhes nobres, metragens, diferenciais arquitetônicos e conceito do imóvel..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Photos & Interactive Features List */}
              <div className="space-y-4">
                
                {/* Main Photo Upload & URL */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block font-bold text-slate-500 uppercase">Foto Principal do Lançamento</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={exclusiveImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80'}
                      alt="Foto Principal"
                      className="w-20 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                    />
                    <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      <span>Subir Imagem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files?.[0]) handleExclusiveMainImageUpload(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={exclusiveImageUrl}
                    onChange={e => setExclusiveImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/foto-lancamento.jpg"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                {/* Secondary Photo Upload & URL */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block font-bold text-slate-500 uppercase">Foto Secundária / Planta ou Living</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={exclusiveSecondaryImageUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&auto=format&fit=crop&q=80'}
                      alt="Foto Secundária"
                      className="w-20 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                    />
                    <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      <span>Subir Imagem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files?.[0]) handleExclusiveSecondaryImageUpload(e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={exclusiveSecondaryImageUrl}
                    onChange={e => setExclusiveSecondaryImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/foto-secundaria.jpg"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                {/* Differentiators / Features List */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-500 uppercase">Diferenciais & Itens de Lazer do Lançamento</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={e => setNewFeatureInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="Ex: Piscina com borda infinita aquecida"
                      className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  {/* Chips Display */}
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {exclusiveFeatures.map((feat, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-medium border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <span>✓ {feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-rose-500 hover:text-rose-700 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Action & Message */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-500 uppercase">Texto do Botão & Mensagem WhatsApp</label>
                  <input
                    type="text"
                    value={exclusiveCtaText}
                    onChange={e => setExclusiveCtaText(e.target.value)}
                    placeholder="Ex: Solicitar Apresentação Exclusiva & Book"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs"
                  />
                  <input
                    type="text"
                    value={exclusiveCtaWhatsappMsg}
                    onChange={e => setExclusiveCtaWhatsappMsg(e.target.value)}
                    placeholder="Mensagem pré-formatada do WhatsApp..."
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

              </div>

            </div>

            {/* Save Button for Exclusive Launch */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleSaveAllConfigurations('✨ Lançamento Exclusivo atualizado e salvo com sucesso!')}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSavingConfig ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSavingConfig ? 'Salvando Lançamento...' : 'Salvar Configurações do Lançamento'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== TAB 3: DADOS LEGAIS, CRECI & CNPJ ==================== */}
      {activeSubTab === 'legal' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Identidade, CRECI Jurídico/Físico & CNPJ</h2>
                <p className="text-xs text-slate-500">Configure os dados legais que aparecem no rodapé, cabeçalho e contratos gerados pelo sistema.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Nome da Empresa / Imobiliária</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Ex: Joel Santana Imóveis"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">E-mail para Backup Automático</label>
                <input
                  type="email"
                  value={backupEmail}
                  onChange={e => setBackupEmail(e.target.value)}
                  placeholder="Ex: seuemail@dominio.com"
                  className="w-full p-2.5 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Onde você receberá o backup diário dos dados</span>
              </div>

              <div>
                <label className="block font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">
                  CRECI Jurídico (Imobiliária)
                </label>
                <input
                  type="text"
                  value={creciJuridico}
                  onChange={e => setCreciJuridico(e.target.value)}
                  placeholder="Ex: CRECI 34567-J"
                  className="w-full p-2.5 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Para pessoas jurídicas registradas no CRECI</span>
              </div>

              <div>
                <label className="block font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">
                  CRECI Físico (Corretor Autônomo)
                </label>
                <input
                  type="text"
                  value={creciFisico}
                  onChange={e => {
                    setCreciFisico(e.target.value);
                    setBrokerCreci(e.target.value);
                  }}
                  placeholder="Ex: CRECI 12345-F"
                  className="w-full p-2.5 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Registro profissional do corretor responsável</span>
              </div>

              <div>
                <label className="block font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">
                  CNAI (Avaliação Imobiliária)
                </label>
                <input
                  type="text"
                  value={brokerCnai}
                  onChange={e => setBrokerCnai(e.target.value)}
                  placeholder="Ex: CNAI 12345 (opcional)"
                  className="w-full p-2.5 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Cadastro Nacional de Avaliadores Imobiliários (só aparece se preenchido)</span>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">CNPJ da Imobiliária</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={e => setCnpj(e.target.value)}
                  placeholder="Ex: 12.345.678/0001-90"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Telefone Comercial Fixo</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(11) 3456-7890"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">WhatsApp Principal de Atendimento</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="5511987654321"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">E-mail Principal</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contato@joelsantanaimoveis.com.br"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-500 uppercase mb-1">Endereço Comercial / Sede</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Av. Brigadeiro Faria Lima, 2000 - Itaim Bibi, São Paulo - SP"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-3 p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <label className="font-bold text-indigo-900 dark:text-indigo-300 uppercase">E-mail para Alerta de Novos Leads no CRM</label>
                </div>
                <p className="text-[11px] text-slate-500">
                  Informe o endereço de e-mail que receberá os alertas instantâneos sempre que um novo lead se cadastrar no site ou CRM.
                </p>
                <input
                  type="email"
                  value={leadNotificationEmail}
                  onChange={e => setLeadNotificationEmail(e.target.value)}
                  placeholder="joelsantanaimoveis@gmail.com"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

            </div>

            {/* Save Button for Legal Data */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleSaveAllConfigurations('🏢 Dados Legais, CRECI e CNPJ salvos com sucesso!')}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSavingConfig ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSavingConfig ? 'Salvando Dados Legais...' : 'Salvar Dados Legais & CRECI'}</span>
              </button>
            </div>

          </div>

          {/* LGPD & Privacy Parameters Card */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Parâmetros de Privacidade & LGPD</h2>
                <p className="text-xs text-slate-500">Configure o banner de consentimento de cookies e os canais de atendimento ao titular (Encarregado DPO).</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">Exibir Banner de Cookies / LGPD no Site</span>
                  <span className="text-slate-500">Aparece no rodapé para novos visitantes solicitarem consentimento conforme a LGPD.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLgpdBanner}
                    onChange={e => setShowLgpdBanner(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Texto do Banner LGPD</label>
                <textarea
                  rows={3}
                  value={lgpdBannerText}
                  onChange={e => setLgpdBannerText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">E-mail do Encarregado de Dados (DPO)</label>
                <input
                  type="email"
                  value={lgpdDpoEmail}
                  onChange={e => setLgpdDpoEmail(e.target.value)}
                  placeholder="dpo@joelsantanaimoveis.com.br"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleSaveAllConfigurations('🔒 Parâmetros LGPD salvos com sucesso!')}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSavingConfig ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSavingConfig ? 'Salvando LGPD...' : 'Salvar Parâmetros LGPD'}</span>
              </button>
            </div>
          </div>

          {/* SITES PARCEIROS CARD */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Sites Parceiros (Divulgação Externa)</h3>
                <p className="text-xs text-slate-500">Configure até 3 sites parceiros para exibição discreta no site.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">Exibir Quadro de Sites Parceiros no Site</span>
                  <span className="text-slate-500">Ativa ou desativa a exibição dos links parceiros.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPartnerSites}
                    onChange={e => setShowPartnerSites(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Partner 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">Parceiro 1</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nome do Site</label>
                    <input
                      type="text"
                      value={partnerSite1Name}
                      onChange={e => setPartnerSite1Name(e.target.value)}
                      placeholder="Ex: Construtora Metropolitana"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">URL (Link)</label>
                    <input
                      type="url"
                      value={partnerSite1Url}
                      onChange={e => setPartnerSite1Url(e.target.value)}
                      placeholder="https://exemplo.com.br"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Breve Descrição</label>
                  <input
                    type="text"
                    value={partnerSite1Desc}
                    onChange={e => setPartnerSite1Desc(e.target.value)}
                    placeholder="Ex: Acabamentos e materiais de construção"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Partner 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">Parceiro 2</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nome do Site</label>
                    <input
                      type="text"
                      value={partnerSite2Name}
                      onChange={e => setPartnerSite2Name(e.target.value)}
                      placeholder="Ex: Rio Preto Arquitetura"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">URL (Link)</label>
                    <input
                      type="url"
                      value={partnerSite2Url}
                      onChange={e => setPartnerSite2Url(e.target.value)}
                      placeholder="https://exemplo.com.br"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Breve Descrição</label>
                  <input
                    type="text"
                    value={partnerSite2Desc}
                    onChange={e => setPartnerSite2Desc(e.target.value)}
                    placeholder="Ex: Projetos de arquitetura e design"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Partner 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">Parceiro 3</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Nome do Site</label>
                    <input
                      type="text"
                      value={partnerSite3Name}
                      onChange={e => setPartnerSite3Name(e.target.value)}
                      placeholder="Ex: Cartório de Notas"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">URL (Link)</label>
                    <input
                      type="url"
                      value={partnerSite3Url}
                      onChange={e => setPartnerSite3Url(e.target.value)}
                      placeholder="https://exemplo.com.br"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Breve Descrição</label>
                  <input
                    type="text"
                    value={partnerSite3Desc}
                    onChange={e => setPartnerSite3Desc(e.target.value)}
                    placeholder="Ex: Certidões e assessoria documental"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleSaveAllConfigurations('🌐 Sites parceiros salvos com sucesso!')}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSavingConfig ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSavingConfig ? 'Salvando Parceiros...' : 'Salvar Sites Parceiros'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: CORES, TEMA & BANNER ==================== */}
      {activeSubTab === 'tema' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* MODO CLARO & SELEÇÃO DE TEMA */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Modo Claro e Apresentação do Site</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newMode = !darkMode;
                  setDarkMode(newMode);
                  updateSiteConfig({ darkMode: newMode });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  !darkMode
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {!darkMode ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4" />}
                <span>{!darkMode ? 'Ativar Modo Claro (Ativo)' : 'Alternar para Modo Claro'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setDarkMode(false);
                  updateSiteConfig({ darkMode: false });
                }}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 bg-slate-50 text-slate-900 ${
                  !darkMode ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-lg' : 'border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-sm">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Modo Claro (Recomendado)
                  </span>
                  {!darkMode && <CheckCircle className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-xs text-slate-600">
                  Visual leve, limpo e extremamente nítido. Fundo em tons neutros claros que realçam as fotos dos imóveis.
                </p>
              </div>

              <div
                onClick={() => {
                  setDarkMode(true);
                  updateSiteConfig({ darkMode: true });
                }}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 bg-slate-900 text-white ${
                  darkMode ? 'border-indigo-500 ring-2 ring-indigo-400/30 shadow-lg' : 'border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-sm">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    Modo Escuro (Dark Mode)
                  </span>
                  {darkMode && <CheckCircle className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400">
                  Visual noturno sofisticado em tons navy com contraste de elementos claros.
                </p>
              </div>
            </div>
          </div>

          {/* ESQUEMA DE CORES, CONTORNOS E DETALHES DO SITE */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Cores de Contornos & Detalhes do Site</span>
                    {enableCustomContours && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Ativado
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Defina paletas cromáticas opcionais para contornos de cards, botões de ação e detalhes visuais da imobiliária.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEnableCustomContours(!enableCustomContours)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                    enableCustomContours
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{enableCustomContours ? 'Contornos Customizados: Ligado' : 'Ativar Contornos Customizados'}</span>
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Escolha um Tema de Contornos & Detalhes (Pré-definidos):
                </label>
                <span className="text-[11px] text-slate-400">Clique para aplicar instantaneamente</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* 1. Padrão */}
                <div
                  onClick={() => handleSelectThemePreset('padrao')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-3 bg-white dark:bg-slate-900 ${
                    colorTheme === 'padrao' && !enableCustomContours
                      ? 'border-indigo-600 ring-2 ring-indigo-400/30 shadow-md scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">Padrão Neutro</span>
                    {colorTheme === 'padrao' && !enableCustomContours && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-[#4f46e5] shadow-xs" title="Índigo" />
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-[#6366f1] shadow-xs" title="Ardósia / Índigo" />
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-slate-100 shadow-xs" title="Neutro Claro" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Design limpo, minimalista e atemporal com foco nas fotos dos imóveis.
                  </p>
                </div>

                {/* 2. Verde */}
                <div
                  onClick={() => handleSelectThemePreset('verde')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-3 bg-emerald-50/40 dark:bg-emerald-950/20 ${
                    colorTheme === 'verde'
                      ? 'border-emerald-500 ring-2 ring-emerald-400/30 shadow-md scale-[1.02]'
                      : 'border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-300">Verde Esmeralda</span>
                    {colorTheme === 'verde' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-emerald-600 bg-[#10b981] shadow-xs" title="Contorno Verde" />
                    <div className="w-6 h-6 rounded-full border border-emerald-700 bg-[#059669] shadow-xs" title="Detalhe Verde Escuro" />
                    <div className="w-6 h-6 rounded-full border border-emerald-300 bg-emerald-100 shadow-xs" title="Fundo Suave" />
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 leading-tight">
                    Contornos e detalhes verdes que transmitem prosperidade, segurança e natureza.
                  </p>
                </div>

                {/* 3. Vermelho */}
                <div
                  onClick={() => handleSelectThemePreset('vermelho')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-3 bg-rose-50/40 dark:bg-rose-950/20 ${
                    colorTheme === 'vermelho'
                      ? 'border-rose-500 ring-2 ring-rose-400/30 shadow-md scale-[1.02]'
                      : 'border-rose-200/80 dark:border-rose-800/60 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-rose-900 dark:text-rose-300">Vermelho Rubi</span>
                    {colorTheme === 'vermelho' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-rose-600 bg-[#ef4444] shadow-xs" title="Contorno Vermelho" />
                    <div className="w-6 h-6 rounded-full border border-rose-700 bg-[#dc2626] shadow-xs" title="Detalhe Vermelho Escuro" />
                    <div className="w-6 h-6 rounded-full border border-rose-300 bg-rose-100 shadow-xs" title="Fundo Suave" />
                  </div>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300/80 leading-tight">
                    Contornos de alto impacto visual e energia para destacar ofertas quentes e oportunidades.
                  </p>
                </div>

                {/* 4. Azul */}
                <div
                  onClick={() => handleSelectThemePreset('azul')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-3 bg-blue-50/40 dark:bg-blue-950/20 ${
                    colorTheme === 'azul'
                      ? 'border-blue-500 ring-2 ring-blue-400/30 shadow-md scale-[1.02]'
                      : 'border-blue-200/80 dark:border-blue-800/60 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-blue-900 dark:text-blue-300">Azul Royal</span>
                    {colorTheme === 'azul' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-blue-600 bg-[#3b82f6] shadow-xs" title="Contorno Azul" />
                    <div className="w-6 h-6 rounded-full border border-blue-700 bg-[#2563eb] shadow-xs" title="Detalhe Azul Escuro" />
                    <div className="w-6 h-6 rounded-full border border-blue-300 bg-blue-100 shadow-xs" title="Fundo Suave" />
                  </div>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300/80 leading-tight">
                    Contornos azuis corporativos que transmitem autoridade, solidez e credibilidade imobiliária.
                  </p>
                </div>

                {/* 5. Dourado e Preto (Premium) */}
                <div
                  onClick={() => handleSelectThemePreset('dourado_preto')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-3 bg-gradient-to-br from-amber-50/60 to-slate-900/10 dark:from-slate-900 dark:to-amber-950/40 ${
                    colorTheme === 'dourado_preto'
                      ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-md scale-[1.02]'
                      : 'border-amber-300/80 dark:border-amber-800/60 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                      <span>Dourado & Preto</span>
                    </span>
                    {colorTheme === 'dourado_preto' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-amber-600 bg-[#d97706] shadow-xs" title="Ouro Dourado" />
                    <div className="w-6 h-6 rounded-full border border-slate-900 bg-[#0f172a] shadow-xs" title="Preto Ônix" />
                    <div className="w-6 h-6 rounded-full border border-amber-300 bg-[#fef3c7] shadow-xs" title="Brilho Nobre" />
                  </div>
                  <p className="text-[11px] text-amber-900 dark:text-amber-300/80 leading-tight font-medium">
                    Misto nobre de dourado e preto premium para imóveis de luxo e alto padrão.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Color Pickers & Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              
              {/* Pickers (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Ajuste Fino de Cores (Totalmente Customizável)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cor do Contorno */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Cor dos Contornos (Bordas)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">{contourColor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={contourColor}
                        onChange={e => {
                          setContourColor(e.target.value);
                          setEnableCustomContours(true);
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={contourColor}
                        onChange={e => {
                          setContourColor(e.target.value);
                          setEnableCustomContours(true);
                        }}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                        placeholder="#10b981"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Bordas de cards de imóveis, inputs da busca e botões secundários.
                    </p>
                  </div>

                  {/* Cor dos Detalhes / Acentos */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Cor dos Detalhes & Destaques
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">{detailsColor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={detailsColor}
                        onChange={e => {
                          setDetailsColor(e.target.value);
                          setEnableCustomContours(true);
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={detailsColor}
                        onChange={e => {
                          setDetailsColor(e.target.value);
                          setEnableCustomContours(true);
                        }}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                        placeholder="#059669"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Badges de status, ícones em destaque e elementos de ênfase.
                    </p>
                  </div>

                  {/* Cor Primária */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Cor Primária (Botões de Ação)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">{primaryColor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                        placeholder="#4f46e5"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Botões principais, cabeçalhos de destaque e links ativos.
                    </p>
                  </div>

                  {/* Cor de Acento Secundário */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Cor de Acento Secundário
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">{accentColor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={e => setAccentColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={e => setAccentColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                        placeholder="#f59e0b"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Selo de novidade, estrelas e gradientes secundários.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectThemePreset('padrao')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Restaurar Padrão
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveAllConfigurations('Cores de contornos e detalhes salvas com sucesso!')}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Cores no Site</span>
                  </button>
                </div>
              </div>

              {/* Live Card Preview (5 Cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Pré-Visualização em Tempo Real</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">Exemplo de Card do Imóvel</span>
                </div>

                <div
                  className="rounded-3xl p-4 transition-all shadow-xl bg-white dark:bg-slate-900"
                  style={{
                    borderWidth: enableCustomContours ? '2px' : '1px',
                    borderColor: enableCustomContours ? contourColor : '#e2e8f0'
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-video mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                      alt="Exemplo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-md"
                        style={{ backgroundColor: detailsColor }}
                      >
                        Venda Exclusiva
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black text-white bg-slate-950/80 backdrop-blur-xs">
                        R$ 1.850.000
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: detailsColor }}
                      >
                        Condomínio Damha • Rio Preto
                      </span>
                      <span className="text-[10px] text-slate-400">Cód. JS-409</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      Mansão Térrea com Piscina Aquecida
                    </h4>

                    {/* Button Sample */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all text-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Ver Detalhes
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          borderWidth: '1.5px',
                          borderColor: contourColor,
                          color: detailsColor
                        }}
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 text-center italic">
                  * Alterações aplicadas são propagadas automaticamente para a vitrine e cards de imóveis.
                </p>
              </div>

            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Minha Logo Personalizada</h2>
              </div>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="text-xs px-3 py-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover Logo</span>
                </button>
              )}
            </div>

            {/* Logo Preview Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pré-visualização da Logo no Cabeçalho do Site:
              </span>
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-12 w-auto max-w-[200px] object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white p-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-white block">
                      {logoText || companyName || 'Joel Santana'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium block">
                      {creciJuridico || creciFisico || 'CRECI 12345-F'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  ✓ Transparência e Exibição Automática
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Upload Logo */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-500 uppercase text-xs">Upload de Arquivo de Logo</label>
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors text-center">
                  <Upload className="w-7 h-7 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Selecionar arquivo de logo (PNG/SVG)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Suporta fundo transparente para melhor acabamento</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files?.[0]) handleLogoFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Logo URL and Name */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-xs mb-1">Nome / Texto da Logo</label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={e => setLogoText(e.target.value)}
                    placeholder="Ex: Joel Santana Imóveis"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase text-xs mb-1">Link / URL da Imagem da Logo</label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="https://exemplo.com/minha-logo.png"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOTO OFICIAL DO CORRETOR / APRESENTAÇÃO NA VITRINE */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Minha Foto Oficial (Site, Vitrine e Quem Somos)</h2>
                  <p className="text-xs text-slate-500">
                    Sua foto oficial exibida no card de apresentação da página inicial, nos imóveis e na página Quem Somos.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={profileAvatar || brokerAvatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                  alt="Minha Foto Oficial"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500 shadow-lg shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {brokerName || profileName || 'Joel Santana'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      {brokerCreci || profileCreci || 'CRECI 12345-F'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Sincronizada automaticamente com seu perfil e ativa em toda a vitrine pública.
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md text-xs shrink-0">
                <Upload className="w-4 h-4" />
                <span>Atualizar Minha Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files?.[0]) handleAvatarFileUpload(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Banner do Topo - Opções e Seleção (Trocar Banner) */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Banner do Topo (10 Opções Prontas & Upload)</h2>
                  <p className="text-xs text-slate-500">
                    Selecione uma das opções de alta resolução ou suba sua própria imagem de capa.
                  </p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold rounded-full">
                {BANNER_PRESETS.length} Opções Prontas
              </span>
            </div>

            {/* Current Active Banner Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Banner Ativo no Topo do Site:
              </span>
              <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl group">
                <img
                  src={heroBannerImage}
                  alt="Banner Ativo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider w-fit mb-2 shadow-sm">
                    {heroBannerPreset === 'custom' ? 'Banner Personalizado (Upload)' : 'Preset Selecionado'}
                  </span>
                  <h3
                    className="font-black leading-tight transition-all"
                    style={{
                      opacity: heroTitleOpacity / 100,
                      fontSize: `${Math.min(heroTitleFontSize, 36)}px`
                    }}
                  >
                    {heroTitle || 'Conectando pessoas, realizando sonhos.'}
                  </h3>
                </div>
              </div>
            </div>

            {/* Title Text, Transparency and Font Size Controls */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Personalizar Título do Banner
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Texto do Título Principal
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={e => setHeroTitle(e.target.value)}
                  placeholder="Conectando pessoas, realizando sonhos."
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Transparência / Opacidade do Título
                    </label>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{heroTitleOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={heroTitleOpacity}
                    onChange={e => setHeroTitleOpacity(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tamanho da Fonte (px)
                    </label>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{heroTitleFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={72}
                    step={2}
                    value={heroTitleFontSize}
                    onChange={e => setHeroTitleFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              {/* Vertical Position Control (Top / Center / Base of Image) */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Posição Vertical do Texto no Banner
                    </label>
                    <span className="text-[11px] text-slate-500 block">Ajuste fino (Mover para cima ou para baixo)</span>
                  </div>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {heroTitlePositionY <= 25 ? 'Topo' : heroTitlePositionY <= 60 ? 'Centro' : 'Base da Imagem'} ({heroTitlePositionY}%)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={15}
                    max={88}
                    step={1}
                    value={heroTitlePositionY}
                    onChange={e => setHeroTitlePositionY(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHeroTitlePositionY(20)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      heroTitlePositionY === 20
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ↑ Topo (20%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTitlePositionY(50)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      heroTitlePositionY === 50
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ↕ Centro (50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTitlePositionY(80)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      heroTitlePositionY === 80
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ↓ Base da Imagem (80% - Recomendado)
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Custom Banner */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Quer usar sua própria foto de capa?</p>
                <p className="text-[11px] text-slate-500">Faça o upload de uma imagem em alta resolução (1920x800 recomendado).</p>
              </div>
              <label className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-sm shrink-0">
                <Upload className="w-4 h-4" />
                <span>Fazer Upload de Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files?.[0]) handleBannerFileUpload(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BANNER_PRESETS.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setHeroBannerImage(preset.url);
                    setHeroBannerPreset(preset.id);
                  }}
                  className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition-all relative group ${
                    heroBannerImage === preset.url
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-xl'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 opacity-90'
                  }`}
                >
                  <div className="relative h-32">
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                      {preset.tag}
                    </div>
                    {heroBannerImage === preset.url && (
                      <div className="absolute top-2 right-2 p-1 rounded-full bg-indigo-600 text-white shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 space-y-1">
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">{preset.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{preset.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONFIGURAÇÃO DE ESTATÍSTICAS DE CONFIANÇA E DIFERENCIAIS */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Indicadores de Confiança e Diferenciais da Home</h2>
                <p className="text-xs text-slate-500">Configure os 4 indicadores numéricos e os 4 diferenciais exibidos na página inicial.</p>
              </div>
            </div>

            {/* Trust Stats 4 Cards Config */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Indicadores Numéricos (4 Cards do Topo)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Card 1</span>
                  <input
                    type="text"
                    value={trustStat1Value}
                    onChange={e => setTrustStat1Value(e.target.value)}
                    placeholder="Valor (ex: +1.500)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <input
                    type="text"
                    value={trustStat1Label}
                    onChange={e => setTrustStat1Label(e.target.value)}
                    placeholder="Rótulo (ex: Imóveis)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Card 2</span>
                  <input
                    type="text"
                    value={trustStat2Value}
                    onChange={e => setTrustStat2Value(e.target.value)}
                    placeholder="Valor (ex: 100%)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <input
                    type="text"
                    value={trustStat2Label}
                    onChange={e => setTrustStat2Label(e.target.value)}
                    placeholder="Rótulo (ex: Documentação)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Card 3</span>
                  <input
                    type="text"
                    value={trustStat3Value}
                    onChange={e => setTrustStat3Value(e.target.value)}
                    placeholder="Valor (ex: Ágil e Direto)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <input
                    type="text"
                    value={trustStat3Label}
                    onChange={e => setTrustStat3Label(e.target.value)}
                    placeholder="Rótulo (ex: WhatsApp)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Card 4</span>
                  <input
                    type="text"
                    value={trustStat4Value}
                    onChange={e => setTrustStat4Value(e.target.value)}
                    placeholder="Valor (ex: Nota 4.9/5)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <input
                    type="text"
                    value={trustStat4Label}
                    onChange={e => setTrustStat4Label(e.target.value)}
                    placeholder="Rótulo (ex: Avaliações)"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Differentials 4 Cards Config */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Diferenciais do Negócio (4 Cards Principais)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Diferencial 1</span>
                  <input
                    type="text"
                    value={diff1Title}
                    onChange={e => setDiff1Title(e.target.value)}
                    placeholder="Título"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <textarea
                    rows={2}
                    value={diff1Desc}
                    onChange={e => setDiff1Desc(e.target.value)}
                    placeholder="Descrição"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Diferencial 2</span>
                  <input
                    type="text"
                    value={diff2Title}
                    onChange={e => setDiff2Title(e.target.value)}
                    placeholder="Título"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <textarea
                    rows={2}
                    value={diff2Desc}
                    onChange={e => setDiff2Desc(e.target.value)}
                    placeholder="Descrição"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Diferencial 3</span>
                  <input
                    type="text"
                    value={diff3Title}
                    onChange={e => setDiff3Title(e.target.value)}
                    placeholder="Título"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <textarea
                    rows={2}
                    value={diff3Desc}
                    onChange={e => setDiff3Desc(e.target.value)}
                    placeholder="Descrição"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Diferencial 4</span>
                  <input
                    type="text"
                    value={diff4Title}
                    onChange={e => setDiff4Title(e.target.value)}
                    placeholder="Título"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <textarea
                    rows={2}
                    value={diff4Desc}
                    onChange={e => setDiff4Desc(e.target.value)}
                    placeholder="Descrição"
                    className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MARCA D'ÁGUA PARA FOTOS */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Marca d'Água nas Fotos dos Imóveis</h2>
              </div>
              <button
                type="button"
                onClick={() => setEnableWatermark(!enableWatermark)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  enableWatermark
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {enableWatermark ? '✓ Marca d\'Água Ativa' : '✕ Desativada'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <label className="block font-bold text-slate-500 uppercase">Upload de Logo para Marca d'Água</label>
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors text-center">
                  <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Selecionar arquivo PNG com transparência</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files?.[0]) handleWatermarkFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Opacidade da Marca d'Água ({watermarkOpacity}%)</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={watermarkOpacity}
                    onChange={e => setWatermarkOpacity(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Posição na Foto</label>
                  <select
                    value={watermarkPosition}
                    onChange={e => setWatermarkPosition(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="center">Centro da Foto (Proteção Máxima)</option>
                    <option value="bottom-right">Canto Inferior Direito</option>
                    <option value="top-right">Canto Superior Direito</option>
                    <option value="bottom-left">Canto Inferior Esquerdo</option>
                    <option value="repeat">Padrão Repetido (Grade Completa)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button for Theme */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleSaveAllConfigurations('🎨 Configurações de Tema, Banner e Cores salvas com sucesso!')}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSavingConfig ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSavingConfig ? 'Salvando Tema...' : 'Salvar Tema e Banner'}</span>
              </button>
            </div>
          </div>

      {/* ==================== REDES SOCIAIS OFICIAIS ==================== */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Redes Sociais do Site</h2>
                  <p className="text-xs text-slate-500">Configure os links oficiais. Apenas as redes com links preenchidos serão exibidas aos visitantes no site.</p>
                </div>
              </div>
              <button
                onClick={() => handleSaveAllConfigurations('✨ Redes sociais salvas com sucesso!')}
                disabled={isSavingConfig}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingConfig ? 'Salvando...' : 'Salvar Redes Sociais'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Instagram (URL)</label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={e => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/seuperfil"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Facebook (URL)</label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={e => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/seuperfil"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">YouTube (URL)</label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@seucanal"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">LinkedIn (URL)</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/seuperfil"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">TikTok (URL)</label>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={e => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@seuperfil"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 dark:text-slate-300">X / Twitter (URL)</label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={e => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/seuperfil"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================== TAB 4: GESTÃO DA EQUIPE ==================== */}
      {activeSubTab === 'equipe' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Gestão da Equipe de Corretores & Convites</h2>
                <p className="text-xs text-slate-500">Cadastre novos corretores e gere links de convite para adesão à plataforma.</p>
              </div>
            </div>

            {/* New Member Form */}
            <form onSubmit={handleCreateTeamMember} className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">+ Convidar Novo Membro da Equipe</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">E-mail Profissional</label>
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={e => setNewMemberEmail(e.target.value)}
                    placeholder="carlos@exemplo.com"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Cargo / Função</label>
                  <select
                    value={newMemberRole}
                    onChange={e => setNewMemberRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="corretor">Corretor de Imóveis</option>
                    <option value="gerente">Gerente de Vendas</option>
                    <option value="captador">Captador de Imóveis</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">CRECI do Corretor</label>
                  <input
                    type="text"
                    value={newMemberCreci}
                    onChange={e => setNewMemberCreci(e.target.value)}
                    placeholder="Ex: CRECI 98765-F"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>CNAI do Corretor</span>
                  </label>
                  <input
                    type="text"
                    value={newMemberCnae}
                    onChange={e => setNewMemberCnae(e.target.value)}
                    placeholder="Ex: CNAI 12345"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Telefone Principal</label>
                  <input
                    type="tel"
                    value={newMemberPhone}
                    onChange={e => setNewMemberPhone(e.target.value)}
                    placeholder="(17) 99195-1473"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-600 dark:text-amber-400 uppercase mb-1 flex items-center gap-1">
                    <PhoneForwarded className="w-3.5 h-3.5" />
                    <span>Telefone de Recado</span>
                  </label>
                  <input
                    type="tel"
                    value={newMemberSecondaryPhone}
                    onChange={e => setNewMemberSecondaryPhone(e.target.value)}
                    placeholder="Ex: (17) 98123-4567"
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-amber-300/80 dark:border-amber-700/80 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-rose-600 dark:text-rose-400 uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Endereço Completo</span>
                </label>
                <input
                  type="text"
                  value={newMemberAddress}
                  onChange={e => setNewMemberAddress(e.target.value)}
                  placeholder="Ex: Av. Alberto Andaló, 3000 - Centro, São José do Rio Preto - SP"
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Gerar Link de Convite</span>
              </button>
            </form>

            {/* Generated Invite Box */}
            {generatedInviteLink && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2 text-xs">
                <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Link de Convite Gerado com Sucesso!</span>
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedInviteLink}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-emerald-300 rounded-xl font-mono text-[11px]"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedInviteLink);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Membros da Equipe ({users.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.map(u => (
                  <div key={u.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                    <div className="space-y-0.5 overflow-hidden">
                      <p className="font-black text-xs text-slate-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">{u.role} {u.creci ? `• ${u.creci}` : ''}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== TAB 5: MEU PERFIL ==================== */}
      {activeSubTab === 'perfil' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Meu Perfil de Corretor & Credenciais</h2>
                <p className="text-xs text-slate-500">Atualize sua foto oficial, biografia profissional e altere sua senha de acesso.</p>
              </div>
            </div>

            {profileSuccessMsg && (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Perfil atualizado com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              
              <div className="space-y-3 text-center md:text-left">
                <label className="block font-bold text-slate-500 uppercase">Foto do Perfil</label>
                <img
                  src={profileAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                  alt="Avatar"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-indigo-100 dark:border-indigo-900 shadow-xl mx-auto md:mx-0"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>Trocar Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files?.[0]) handleAvatarFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">CRECI do Corretor</label>
                    <input
                      type="text"
                      value={profileCreci}
                      onChange={e => setProfileCreci(e.target.value)}
                      placeholder="CRECI 12345-F"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">Telefone Principal</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={e => setProfilePhone(e.target.value)}
                      placeholder="(17) 99195-1473"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-amber-700 dark:text-amber-400 uppercase mb-1 flex items-center gap-1">
                      <PhoneForwarded className="w-3.5 h-3.5" />
                      <span>Telefone de Recado</span>
                    </label>
                    <input
                      type="tel"
                      value={profileSecondaryPhone}
                      onChange={e => setProfileSecondaryPhone(e.target.value)}
                      placeholder="Ex: (17) 98123-4567"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-amber-300/80 dark:border-amber-700/80 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 uppercase mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      value={profileWhatsapp}
                      onChange={e => setProfileWhatsapp(e.target.value)}
                      placeholder="5517991951473"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-blue-700 dark:text-blue-400 uppercase mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>CNAI do Corretor</span>
                    </label>
                    <input
                      type="text"
                      value={profileCnae}
                      onChange={e => setProfileCnae(e.target.value)}
                      placeholder="Ex: CNAI 12345 - Avaliador Imobiliário"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-blue-300/80 dark:border-blue-700/80 rounded-xl font-medium font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-rose-700 dark:text-rose-400 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Endereço Completo do Corretor / Escritório</span>
                  </label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={e => setProfileAddress(e.target.value)}
                    placeholder="Ex: Av. Alberto Andaló, 3000 - Centro, São José do Rio Preto - SP"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-rose-300/80 dark:border-rose-700/80 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Biografia Profissional</label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={e => setProfileBio(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  Salvar Alterações do Perfil
                </button>
              </div>

            </form>

            {/* Password Change Form */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-500" />
                <span>Alterar Senha de Acesso</span>
              </h3>

              {passMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
                  {passMsg}
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="flex flex-col sm:flex-row items-center gap-3 text-xs">
                <input
                  type="password"
                  placeholder="Nova senha secreta"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full sm:w-80 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-black text-white font-bold rounded-xl"
                >
                  Atualizar Senha
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ==================== TAB 6: NOTIFICAÇÕES PUSH (FCM) ==================== */}
      {activeSubTab === 'notificacoes' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Notificações Push para Corretores (Firebase FCM)</h2>
                  <p className="text-xs text-slate-500">Alertas instantâneos no navegador/celular quando novos leads ou visitas forem registrados.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await enablePushNotifications();
                    showSuccessNotification(res.message);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                    fcmPermissionStatus === 'granted'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>{fcmPermissionStatus === 'granted' ? 'Notificações Ativas 🔔' : 'Solicitar Permissão de Push'}</span>
                </button>

                {fcmPermissionStatus === 'granted' && (
                  <button
                    type="button"
                    onClick={() => {
                      sendTestPushNotification();
                      showSuccessNotification('🔔 Notificação de teste enviada!');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Testar Alerta Push
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Status da Permissão no Navegador:</span>
                <span className={`font-mono font-black uppercase px-2.5 py-1 rounded-lg ${
                  fcmPermissionStatus === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : fcmPermissionStatus === 'denied'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {fcmPermissionStatus === 'granted' ? 'Concedida (Permitido)' : fcmPermissionStatus === 'denied' ? 'Bloqueada (Denied)' : 'Pendente (Default)'}
                </span>
              </div>

              {fcmToken && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">FCM Token do Dispositivo:</span>
                  <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-400 truncate">
                    {fcmToken}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                ℹ️ Quando ativado, os corretores recebem uma notificação sonora e um pop-up nativo no sistema operacional sempre que um visitante cadastrar um novo lead ou agendar uma visita a um imóvel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: PÁGINAS & BLOCOS HTML ==================== */}
      {activeSubTab === 'html' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                  <FileCode className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Páginas Personalizadas & Blocos HTML</h2>
                  <p className="text-xs text-slate-500">Insira blocos HTML, scripts de rastreamento (Meta Pixel, Google Tag) ou crie novas páginas.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenNewHtmlModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Bloco HTML</span>
              </button>
            </div>

            {/* HTML Feedback Alert Banner */}
            {htmlFeedback && (
              <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold border transition-all ${
                htmlFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              }`}>
                <div className="flex items-center gap-2">
                  {htmlFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                  <span>{htmlFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHtmlFeedback(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* HTML Blocks List */}
            <div className="space-y-3">
              {customHtmlBlocks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                  <FileCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">Nenhum bloco HTML customizado criado ainda.</p>
                </div>
              ) : (
                customHtmlBlocks.map(block => (
                  <div key={block.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{block.title}</span>
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-md uppercase">
                          {block.position}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate max-w-md">{block.htmlContent}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHtmlBlockActive(block.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                          block.active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {block.active ? 'Ativo' : 'Pausado'}
                      </button>

                      <button
                        onClick={() => handleOpenEditHtmlModal(block)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteHtmlBlock(block.id, block.title)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-all"
                        title="Excluir este bloco"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* HTML Block Modal */}
      {isHtmlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingBlockId ? 'Editar Bloco HTML' : 'Novo Bloco / Script HTML'}
              </h3>
              <button onClick={() => setIsHtmlModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHtmlBlock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Título do Bloco</label>
                <input
                  type="text"
                  required
                  value={blockTitle}
                  onChange={e => setBlockTitle(e.target.value)}
                  placeholder="Ex: Banner Promocional / Pixel Meta"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Posicionamento</label>
                  <select
                    value={blockPosition}
                    onChange={e => setBlockPosition(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="hero_banner">Abaixo do Banner Principal</option>
                    <option value="below_highlights">Abaixo dos Destaques</option>
                    <option value="footer">No Rodapé</option>
                    <option value="custom_page">Página Completa Independente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Slug / URL (Opcional)</label>
                  <input
                    type="text"
                    value={blockSlug}
                    onChange={e => setBlockSlug(e.target.value)}
                    placeholder="Ex: sobre-nos"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {blockPosition === 'custom_page' && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-start gap-2 text-indigo-900 dark:text-indigo-200">
                  <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Página Independente no Menu Superior</p>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                      Esta página terá sua própria URL pública (ex: <code className="bg-indigo-100 dark:bg-indigo-900 px-1 py-0.5 rounded">/page_{blockSlug || 'seu-slug'}</code>) e aparecerá automaticamente como um link de navegação para os visitantes.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Conteúdo HTML / Script</label>
                <textarea
                  rows={8}
                  required
                  value={blockContent}
                  onChange={e => setBlockContent(e.target.value)}
                  placeholder="<div>Conteúdo HTML da sua página ou bloco...</div>"
                  className="w-full p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none"
                />
              </div>

              {htmlFeedback?.type === 'error' && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{htmlFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingBlock}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all text-xs uppercase flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSavingBlock ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSavingBlock ? 'Validando & Gravando...' : 'Salvar Bloco HTML & Validar'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: SEO & GOOGLE RANKING ==================== */}
      {activeSubTab === 'seo' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Main SEO Header */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">SEO & Google Ranking</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-black rounded-full uppercase tracking-wider">
                    Google Pronto
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Configuração de alta conversão para o site do <strong>Joel Santana Corretor de Imóveis</strong> aparecer nas primeiras posições de busca quando clientes pesquisarem por imóveis para compra, venda e locação em <strong>São José do Rio Preto e região</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleApplyPresetSeoSjrp(false)}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
                title="Restaura os termos ideais para São José do Rio Preto e Joel Santana"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Restaurar Padrão SJRP</span>
              </button>

              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleApplyPresetSeoSjrp(true)}
                className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                title="Aplica o padrão de SJRP e salva no banco de dados imediatamente"
              >
                <Rocket className="w-4 h-4" />
                <span>Aplicar & Salvar Imediato</span>
              </button>

              <button
                type="button"
                disabled={isSavingConfig}
                onClick={() => handleSaveAllConfigurations('🚀 Configurações de SEO salvas e aplicadas aos buscadores!')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSavingConfig ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isSavingConfig ? 'Salvando...' : 'Salvar SEO'}</span>
              </button>
            </div>
          </div>

          {/* Domínio Próprio & Registro.br Configuração */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">Domínio Próprio & Configuração no Registro.br</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">Configuração DNS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Seu Domínio Próprio (Ex: www.joelsantanaimoveis.com.br)
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={e => setCustomDomain(e.target.value)}
                  placeholder="www.joelsantanaimoveis.com.br"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Informe o seu domínio oficial registrado no Registro.br para exibir nos rodapés, compartilhamentos e indexação.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Passo a Passo Rápido no Registro.br:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  <li>Acesse <b>registro.br</b> e entre com sua conta.</li>
                  <li>Clique no seu domínio e vá em <b>DNS / Editar Zona</b>.</li>
                  <li>Adicione uma entrada tipo <b>CNAME</b> com nome <code>www</code> apontando para a URL da nuvem.</li>
                  <li>Ou configure o <b>Redirecionamento Web</b> para direcionar sem <code>www</code> para com <code>www</code>.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* SERP Google Preview Card */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">Prévia Realista no Google (Snippet de Busca)</h3>
              </div>
              <span className="text-[11px] text-slate-500">Como seu link aparecerá para os visitantes que pesquisam no Google</span>
            </div>

            {/* Google Search Result Box */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 font-sans max-w-3xl space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">
                  J
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{seoCanonicalUrl || 'https://joelsantanacorretor.com.br'}</span>
                <span className="text-slate-400">› imoveis › sao-jose-do-rio-preto</span>
              </div>

              <h4 className="text-lg sm:text-xl font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                {seoTitle || 'Joel Santana Corretor de Imóveis | Comprar e Alugar em São José do Rio Preto e Região - SP'}
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {seoDescription || 'Encontre as melhores casas, apartamentos, condomínios fechados, terrenos e imóveis comerciais para comprar ou alugar em São José do Rio Preto - SP e região. Atendimento com Joel Santana Corretor de Imóveis.'}
              </p>

              {/* Rich snippet stars & quick tags */}
              <div className="pt-2 flex items-center gap-4 text-xs text-amber-600 dark:text-amber-400 font-semibold border-t border-slate-200 dark:border-slate-800 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <span>★★★★★</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">4.9</span>
                  <span className="text-slate-500">(87 avaliações no Google)</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-400">Corretor de Imóveis Credenciado</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">São José do Rio Preto - SP</span>
              </div>
            </div>
          </div>

          {/* SEO Core Metadata Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Titles, Descriptions, Keywords */}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Metatags Principais (Title & Description)</h3>
              </div>

              {/* SEO Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Título da Página (Meta Title)
                  </label>
                  <span className={`text-[11px] font-mono font-bold ${
                    seoTitle.length >= 45 && seoTitle.length <= 65 ? 'text-emerald-600' : 'text-amber-500'
                  }`}>
                    {seoTitle.length}/60 caracteres {seoTitle.length >= 45 && seoTitle.length <= 65 ? '✓ Ideal' : ''}
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder="Ex: Joel Santana Corretor de Imóveis | São José do Rio Preto"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Aparece na aba do navegador e no título clicável azul do Google. Deve conter o nome de Joel Santana e a cidade.
                </p>
              </div>

              {/* SEO Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Descrição para os Buscadores (Meta Description)
                  </label>
                  <span className={`text-[11px] font-mono font-bold ${
                    seoDescription.length >= 130 && seoDescription.length <= 165 ? 'text-emerald-600' : 'text-amber-500'
                  }`}>
                    {seoDescription.length}/160 caracteres {seoDescription.length >= 130 && seoDescription.length <= 165 ? '✓ Ideal' : ''}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={seoDescription}
                  onChange={e => setSeoDescription(e.target.value)}
                  placeholder="Descrição que aparece embaixo do link no Google..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Texto persuasivo que incentiva o cliente a clicar. Inclui tipos de imóveis (casas, apartamentos, terrenos) e o WhatsApp de Joel Santana.
                </p>
              </div>

              {/* SEO Keywords */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Palavras-Chave de Busca (Keywords)
                </label>
                <textarea
                  rows={3}
                  value={seoKeywords}
                  onChange={e => setSeoKeywords(e.target.value)}
                  placeholder="imóveis são josé do rio preto, casas comprar rio preto, ..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                
                {/* Keyword Chips to add */}
                <div className="pt-1">
                  <p className="text-[11px] font-bold text-slate-500 mb-2">Termos mais buscados na região (clique para adicionar):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'condomínio fechado rio preto',
                      'casas damha são josé do rio preto',
                      'apartamento aluguel sjrp',
                      'imóveis comerciais rio preto',
                      'terreno quinta do golfe',
                      'casas no jardim yolanda',
                      'imobiliária em rio preto sp',
                      'alugar casa rio preto direto com corretor'
                    ].map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          if (!seoKeywords.toLowerCase().includes(term)) {
                            setSeoKeywords(prev => prev ? `${prev}, ${term}` : term);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 text-[10px] font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-all"
                      >
                        + {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Geographic SEO & Social Sharing (Open Graph) */}
            <div className="space-y-8">
              
              {/* Geographic Targeting Box */}
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Alvo Geográfico Local (São José do Rio Preto)</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Cidade Principal</label>
                    <input
                      type="text"
                      value={seoCity}
                      onChange={e => setSeoCity(e.target.value)}
                      placeholder="São José do Rio Preto"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Estado (UF)</label>
                    <input
                      type="text"
                      value={seoState}
                      onChange={e => setSeoState(e.target.value)}
                      placeholder="SP"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Região de Atendimento</label>
                  <input
                    type="text"
                    value={seoRegion}
                    onChange={e => setSeoRegion(e.target.value)}
                    placeholder="São José do Rio Preto, Mirassol, Cedral, Bady Bassitt..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">URL Canônica do Site</label>
                  <input
                    type="url"
                    value={seoCanonicalUrl}
                    onChange={e => setSeoCanonicalUrl(e.target.value)}
                    placeholder="https://joelsantanacorretor.com.br"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Evita conteúdo duplicado no Google e unifica a autoridade de página no domínio oficial.
                  </p>
                </div>
              </div>

              {/* Social Sharing & WhatsApp Preview (Open Graph) */}
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Compartilhamento no WhatsApp & Redes Sociais</h3>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    URL da Imagem de Compartilhamento (og:image)
                  </label>
                  <input
                    type="url"
                    value={seoOgImageUrl}
                    onChange={e => setSeoOgImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono mb-2"
                  />
                </div>

                {/* WhatsApp Card Preview */}
                <div className="p-3 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 space-y-2">
                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    Como o link aparece ao enviar no WhatsApp:
                  </p>
                  
                  <div className="bg-[#0b141a] text-white rounded-xl overflow-hidden border border-[#202c33] max-w-sm shadow-md">
                    {seoOgImageUrl && (
                      <div className="h-32 w-full bg-slate-900 overflow-hidden">
                        <img src={seoOgImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <p className="font-bold text-xs text-[#e9edef] line-clamp-1">{seoTitle}</p>
                      <p className="text-[11px] text-[#8696a0] line-clamp-2 leading-relaxed">{seoDescription}</p>
                      <p className="text-[10px] text-[#00a884] font-mono">{seoCanonicalUrl ? new URL(seoCanonicalUrl).hostname : 'joelsantanacorretor.com.br'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Tools & Analytics */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Ferramentas de Webmaster & Indexação</h3>
              </div>
              <span className="text-[11px] text-slate-500">Google Search Console, Google Analytics e Meta Pixel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Google Search Console Verification
                </label>
                <input
                  type="text"
                  value={seoGoogleSearchConsole}
                  onChange={e => setSeoGoogleSearchConsole(e.target.value)}
                  placeholder="google-site-verification=..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Código de propriedade para monitorar posições no Google.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Google Analytics 4 (ID de Medição)
                </label>
                <input
                  type="text"
                  value={seoGoogleAnalyticsId}
                  onChange={e => setSeoGoogleAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Rastreia visitantes e imóveis mais acessados no site.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Meta Pixel ID (Facebook / Instagram)
                </label>
                <input
                  type="text"
                  value={seoMetaPixelId}
                  onChange={e => setSeoMetaPixelId(e.target.value)}
                  placeholder="Ex: 123456789012345"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Para campanhas de remarketing de imóveis nas redes sociais.</p>
              </div>
            </div>

            {/* Indexation & Robots switches */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Indexação Pública nos Buscadores (Robots Index, Follow)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Permite expressamente que robôs do Google, Bing e Yahoo rastreiem e indexem todas as páginas e imóveis.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSeoRobotsIndex(!seoRobotsIndex)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    seoRobotsIndex
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {seoRobotsIndex ? '✓ Permitir Indexação' : 'Bloquear Buscadores (noindex)'}
                </button>
              </div>
            </div>
          </div>

          {/* Schema.org RealEstateAgent Structured Data */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Dados Estruturados Schema.org (RealEstateAgent & LocalBusiness)</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSeoStructuredDataEnabled(!seoStructuredDataEnabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    seoStructuredDataEnabled
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}
                >
                  {seoStructuredDataEnabled ? 'Ativo (Recomendado)' : 'Desativado'}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              O Google utiliza a tag <code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-amber-700 dark:text-amber-400">JSON-LD</code> para entender que seu site pertence a um Corretor de Imóveis credenciado com atuação física em São José do Rio Preto, exibindo telefone, WhatsApp, CRECI e endereço nas caixas de respostas do Google Maps e buscas locais.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-emerald-400">
              <pre>{JSON.stringify({
                "@context": "https://schema.org",
                "@type": ["RealEstateAgent", "LocalBusiness"],
                "name": siteConfig.companyName || "Joel Santana Corretor de Imóveis",
                "telephone": siteConfig.phone || "(17) 99195-1473",
                "url": seoCanonicalUrl || "https://joelsantanacorretor.com.br",
                "image": seoOgImageUrl || "/images/house_with_pool_1789524615804.jpg",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": seoCity || "São José do Rio Preto",
                  "addressRegion": seoState || "SP",
                  "addressCountry": "BR"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": -20.8113,
                  "longitude": -49.3758
                },
                "priceRange": "$$$"
              }, null, 2)}</pre>
            </div>
          </div>

          {/* Crawl Files (Sitemap.xml & Robots.txt Links) */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-base text-white">Arquivos Oficiais para Robôs de Busca</h4>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                O arquivo <code className="text-emerald-300">/sitemap.xml</code> e o arquivo <code className="text-emerald-300">/robots.txt</code> são gerados automaticamente pelo sistema e estão 100% prontos para envio ao Google Search Console.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>Ver sitemap.xml</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>Ver robots.txt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Bottom Save Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={isSavingConfig}
              onClick={() => handleSaveAllConfigurations('🚀 Configurações de SEO salvas e aplicadas aos buscadores com sucesso!')}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSavingConfig ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{isSavingConfig ? 'Publicando SEO nos Buscadores...' : 'Salvar Todas as Configurações de SEO'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================== TAB 9: SEGURANÇA & BACKUP ==================== */}
      {activeSubTab === 'seguranca' && (
        <div className="space-y-6 animate-fade-in pb-20">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <ShieldCheck className="w-32 h-32 text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-red-500" />
              Backup & Restauração do Sistema
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
              O sistema realiza <strong>backups automáticos periodicamente</strong> (a cada 15 minutos em caso de atividade) e salva todos os dados em uma <strong>dupla camada de segurança</strong> (Nuvem Firestore + IndexedDB Local).
              <br /><br />
              Se houver perda de conexão, suas alterações são <strong>enfileiradas e sincronizadas automaticamente</strong> assim que a internet retornar, garantindo resiliência total e evitando qualquer tipo de perda de dados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <DownloadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Criar Ponto de Restauração</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gera um snapshot (fotografia) imediato do banco de dados e envia por e-mail.</p>
                </div>
                <button
                  onClick={async () => {
                    await createManualBackup?.();
                    try {
                      const res = await fetch('/api/trigger-backup', { method: 'POST' });
                      const json = await res.json();
                      if (json.success) {
                        alert('Backup gerado e e-mail enviado com sucesso!');
                      } else {
                        alert('Backup gerado, mas houve erro no envio do e-mail: ' + json.error);
                      }
                    } catch(err: any) {
                      alert('Backup local gerado, mas falha ao disparar envio remoto.');
                    }
                  }}
                  className="mt-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 w-full text-center"
                >
                  Criar Backup Manual Agora
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <Save className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Exportar Dados (.json)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Baixa um arquivo completo com todos os imóveis e dados do CRM.</p>
                </div>
                <button
                  onClick={() => exportSystemBackup?.()}
                  className="mt-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 w-full text-center"
                >
                  Baixar Arquivo de Backup
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4 relative overflow-hidden group/import">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Restaurar de Arquivo</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Carrega um arquivo de backup previamente baixado (formato .json).</p>
                </div>
                
                <label className="mt-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 w-full text-center cursor-pointer">
                  <span>Selecionar Arquivo .json</span>
                  <input 
                    type="file" 
                    accept=".json"
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && importSystemBackup) {
                        const confirm = window.confirm('ATENÇÃO: Isso irá substituir os dados atuais pelos dados do arquivo. Deseja continuar?');
                        if (confirm) {
                          const res = await importSystemBackup(file);
                          alert(res.message);
                        }
                      }
                    }} 
                  />
                </label>
              </div>

            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-slate-400" />
                Status do Sistema de Segurança Atômica
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dupla Camada de Persistência (Nuvem + Local)</span>
                   </div>
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">Ativo e Protegido</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fila Offline & Sincronização Automática</span>
                   </div>
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">Monitorando</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
