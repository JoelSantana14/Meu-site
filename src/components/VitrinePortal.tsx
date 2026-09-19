import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Property, PropertyType, PropertyPurpose } from '../types';
import { SuperDestaquesCarousel } from './SuperDestaquesCarousel';
import { WatermarkOverlay } from './WatermarkOverlay';
import { LgpdConsentModal } from './LgpdConsentModal';
import { ExclusiveLaunchModal } from './ExclusiveLaunchModal';
import { PropertyGallery } from './PropertyGallery';
import { FooterLeadCapture } from './FooterLeadCapture';
import { getPropertyTypeLabel } from '../utils/propertyHelpers';
import { AnimatedBlobs } from './AnimatedBlobs';
import { AnimatedCounter } from './AnimatedCounter';
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Star,
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  Calculator,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Send,
  Building2,
  ArrowRight,
  Heart,
  ShieldCheck,
  Award,
  Zap,
  TrendingUp,
  Share2,
  SlidersHorizontal,
  Home,
  Check,
  Sun,
  Settings,
  UserCheck,
  PlusCircle,
  Globe,
  BarChart3,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const PropertyCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col animate-pulse">
    {/* Image Container Skeleton */}
    <div className="relative aspect-[16/10] bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
        <div className="h-5 w-24 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="h-5 w-16 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <div className="h-5 w-16 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="h-8 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>
      <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 opacity-40" />
    </div>

    {/* Body Content Skeleton */}
    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5" />
        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
      </div>

      {/* Features Strip Skeleton */}
      <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-100 dark:border-slate-800">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      {/* Price & Actions Skeleton */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-32" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="w-28 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const getCleanWhatsapp = (waNumber?: string) => {
  const digits = (waNumber || '5511987654321').replace(/\D/g, '');
  if (!digits) return '5511987654321';
  return digits.startsWith('55') ? digits : `55${digits}`;
};

export const VitrinePortal: React.FC = () => {
  const {
    currentUser,
    properties,
    isPropertiesLoading,
    siteConfig,
    customHtmlBlocks,
    addVisit,
    users,
    simulateNewLeadWeb,
    addLead,
    setActiveTab,
    selectedPropertyDetail,
    setSelectedPropertyDetail,
    siteStats,
    recordSitePageView,
    t
  } = useApp();

  // Track visitor on mount
  useEffect(() => {
    recordSitePageView();
  }, []);

  // Search filter states
  const [purposeTab, setPurposeTab] = useState<PropertyPurpose | 'todos'>('venda');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'todos'>('todos');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [bedroomsMin, setBedroomsMin] = useState<number | ''>('');
  const [collectionFilter, setCollectionFilter] = useState<'todos' | 'super_destaque' | 'destaque' | 'cobertura' | 'casa'>('todos');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // AI Natural Language Search State
  const [aiSearchInput, setAiSearchInput] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<{
    summary: string;
    matchedPropertyIds: string[];
    matchReasons: Record<string, string>;
  } | null>(null);

  // Favorites, Modal Active Image & Toast state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('imobi_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [onlyFavoritesFilter, setOnlyFavoritesFilter] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleShareProperty = (e: React.MouseEvent, prop: Property) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    const shareData = {
      title: prop.title,
      text: `Confira este imóvel (${prop.code}): ${prop.title} - R$ ${prop.price.toLocaleString('pt-BR')}`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.text} | Código: ${prop.code}`).then(() => {
        showToast('📋 Link do imóvel copiado para a área de transferência!');
      }).catch(() => {
        showToast('Código do imóvel: ' + prop.code);
      });
    }
  };

  const openPropertyDetail = (prop: Property) => {
    setSelectedPropertyDetail(prop);
  };

  const handleAiSearchSubmit = async (queryText?: string) => {
    const queryToUse = queryText || aiSearchInput;
    if (!queryToUse || !queryToUse.trim()) return;

    setIsAiSearching(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse,
          properties: properties
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAiSearchResult({
            summary: data.summary,
            matchedPropertyIds: data.matchedPropertyIds || [],
            matchReasons: data.matchReasons || {}
          });

          setTimeout(() => {
            const el = document.getElementById('imoveis-list');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        } else {
          executeLocalAiSearchFallback(queryToUse);
        }
      } else {
        executeLocalAiSearchFallback(queryToUse);
      }
    } catch (err) {
      console.warn('Error fetching AI search:', err);
      executeLocalAiSearchFallback(queryToUse);
    } finally {
      setIsAiSearching(false);
    }
  };

  const executeLocalAiSearchFallback = (queryText: string) => {
    const cleanQuery = queryText.toLowerCase();
    const matchedIds: string[] = [];
    const matchReasons: Record<string, string> = {};

    properties.forEach(p => {
      let score = 0;
      const reasons: string[] = [];
      const textToSearch = `${p.title} ${p.description} ${p.type} ${p.purpose} ${p.address.neighborhood} ${p.address.city} ${(p.features || []).join(' ')}`.toLowerCase();

      if ((cleanQuery.includes('apartamento') || cleanQuery.includes('apto')) && (p.type === 'apartamento' || p.type === 'studio' || p.type === 'cobertura')) { score += 3; reasons.push('Tipo Apartamento'); }
      if ((cleanQuery.includes('casa') || cleanQuery.includes('sobrado')) && p.type === 'casa') { score += 3; reasons.push('Tipo Casa'); }
      if ((cleanQuery.includes('chácara') || cleanQuery.includes('chacara') || cleanQuery.includes('sítio')) && p.type === 'chacara') { score += 3; reasons.push('Tipo Chácara'); }

      if (cleanQuery.includes('3 quartos') || cleanQuery.includes('3 dormitórios') || cleanQuery.includes('3 dorms')) {
        if (p.bedrooms >= 3) { score += 3; reasons.push('3+ dormitórios'); }
      } else if (cleanQuery.includes('2 quartos') || cleanQuery.includes('2 dorms')) {
        if (p.bedrooms >= 2) { score += 2; reasons.push('2+ dormitórios'); }
      }

      if (cleanQuery.includes('metrô') || cleanQuery.includes('metro')) {
        if (textToSearch.includes('metrô') || textToSearch.includes('metro')) {
          score += 4;
          reasons.push('Próximo ao metrô / transporte público');
        }
      }

      if (cleanQuery.includes('piscina') && textToSearch.includes('piscina')) { score += 2; reasons.push('Possui Piscina'); }
      if (cleanQuery.includes('churrasqueira') && textToSearch.includes('churrasqueira')) { score += 2; reasons.push('Espaço Gourmet / Churrasqueira'); }
      if ((cleanQuery.includes('alugar') || cleanQuery.includes('aluguel')) && p.purpose === 'aluguel') { score += 2; }
      if ((cleanQuery.includes('comprar') || cleanQuery.includes('venda')) && p.purpose === 'venda') { score += 2; }

      if (score > 0) {
        matchedIds.push(p.id);
        matchReasons[p.id] = reasons.length > 0 ? reasons.join(' • ') : `Combina com sua busca "${queryText}"`;
      }
    });

    setAiSearchResult({
      summary: `Resultados encontrados pela IA para "${queryText}"`,
      matchedPropertyIds: matchedIds,
      matchReasons
    });
  };

  const handleClearAiSearch = () => {
    setAiSearchInput('');
    setAiSearchResult(null);
  };

  const triggerFilterAnimation = (updateFn: () => void) => {
    setIsFilterLoading(true);
    updateFn();
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 200);
  };

  // Visit Scheduling Modal
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isExclusiveModalOpen, setIsExclusiveModalOpen] = useState(false);
  const [visitProperty, setVisitProperty] = useState<Property | null>(null);
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitEmail, setVisitEmail] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('14:00');
  const [visitNotes, setVisitNotes] = useState('');
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  // Global click interceptor for custom HTML block links ("#contato", "#saiba-mais", etc.)
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const text = (anchor.textContent || '').toLowerCase().trim();
        if (href === '#saiba-mais' || href === '#lancamento' || text.includes('saiba mais')) {
          e.preventDefault();
          setIsExclusiveModalOpen(true);
        } else if (href === '#contato') {
          e.preventDefault();
          const contactSection = document.getElementById('contato') || document.querySelector('footer');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            setIsExclusiveModalOpen(true);
          }
        }
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Lead contact form state inside property detail
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMsg, setLeadMsg] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Owner evaluation form state
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerType, setOwnerType] = useState('apartamento');
  const [ownerCity, setOwnerCity] = useState('São Paulo');
  const [ownerSubmitted, setOwnerSubmitted] = useState(false);

  // Financing & MCMV Calculator State
  const [simulatorMode, setSimulatorMode] = useState<'mercado' | 'mcmv'>('mercado');
  const [calcPropertyPrice, setCalcPropertyPrice] = useState<number>(350000);
  const [calcDownPaymentPct, setCalcDownPaymentPct] = useState(20);
  const [calcInterestRatePct, setCalcInterestRatePct] = useState(10.5);
  const [calcYears, setCalcYears] = useState(30);
  const [mcmvIncome, setMcmvIncome] = useState<number>(4500);

  // Mercado Calculations
  const downPaymentAmount = (calcPropertyPrice * calcDownPaymentPct) / 100;
  const loanAmount = calcPropertyPrice - downPaymentAmount;
  const monthlyRate = calcInterestRatePct / 100 / 12;
  const totalMonths = calcYears * 12;
  const mercadoMonthlyPayment = loanAmount > 0
    ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;
  const mercadoRecommendedIncome = mercadoMonthlyPayment * 3.33;

  // MCMV Calculations (Minha Casa, Minha Vida rules current)
  const mcmvSubsidy = mcmvIncome <= 2640 ? 55000 : mcmvIncome <= 4400 ? Math.max(12000, 55000 - ((mcmvIncome - 2640) * 20)) : 0;
  const mcmvInterestRate = mcmvIncome <= 2640 ? 4.25 : mcmvIncome <= 4400 ? 5.5 : 7.66;
  const mcmvDownPayment = Math.max(0, (calcPropertyPrice * 0.10) - mcmvSubsidy);
  const mcmvLoan = Math.max(0, calcPropertyPrice - mcmvDownPayment - mcmvSubsidy);
  const mcmvMonthlyRate = mcmvInterestRate / 100 / 12;
  const mcmvMonthlyPayment = mcmvLoan > 0
    ? (mcmvLoan * (mcmvMonthlyRate * Math.pow(1 + mcmvMonthlyRate, 35 * 12))) / (Math.pow(1 + mcmvMonthlyRate, 35 * 12) - 1)
    : 0;
  const mcmvRecommendedIncome = mcmvIncome;

  const estimatedMonthlyPayment = simulatorMode === 'mcmv' ? mcmvMonthlyPayment : mercadoMonthlyPayment;
  const recommendedIncome = simulatorMode === 'mcmv' ? mcmvRecommendedIncome : mercadoRecommendedIncome;
  const effectiveLoanAmount = simulatorMode === 'mcmv' ? mcmvLoan : loanAmount;

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(item => item !== id);
      showToast('Imóvel removido dos favoritos');
    } else {
      updated = [...favorites, id];
      showToast('❤️ Imóvel salvo nos seus favoritos!');
    }
    setFavorites(updated);
    try {
      localStorage.setItem('imobi_favorites', JSON.stringify(updated));
    } catch {}
  };

  // Deduplication logic against active exclusive launch
  const launchTitleLower = (siteConfig.exclusiveLaunch?.title || '').toLowerCase().trim();
  const isExclusiveActive = siteConfig.exclusiveLaunch?.enabled !== false;

  // Filter properties
  const filteredProperties = properties.filter(p => {
    // Hide archived properties from public catalog
    if (p.archived) return false;

    // Strict deduplication against active exclusive launch ONLY if ID or full exact title matches
    if (isExclusiveActive && siteConfig.exclusiveLaunch?.propertyId && p.id === siteConfig.exclusiveLaunch.propertyId) {
      return false;
    }
    if (isExclusiveActive && launchTitleLower && launchTitleLower.length > 5 && p.title.toLowerCase().trim() === launchTitleLower) {
      return false;
    }

    if (onlyFavoritesFilter) {
      if (!favorites.includes(p.id)) return false;
    }

    if (aiSearchResult) {
      return aiSearchResult.matchedPropertyIds.includes(p.id);
    }

    // Purpose filter (venda / aluguel / todos)
    if (purposeTab !== 'todos' && p.purpose?.toLowerCase() !== purposeTab.toLowerCase()) {
      return false;
    }

    // Type filter
    if (typeFilter !== 'todos' && p.type?.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }

    if (maxPrice !== '' && p.price > maxPrice) return false;
    if (bedroomsMin !== '' && (p.bedrooms || 0) < bedroomsMin) return false;

    if (neighborhoodSearch.trim()) {
      const term = neighborhoodSearch.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(term);
      const matchCode = (p.code || '').toLowerCase().includes(term);
      const matchNeigh = (p.address?.neighborhood || '').toLowerCase().includes(term);
      const matchCity = (p.address?.city || '').toLowerCase().includes(term);
      const matchDesc = (p.description || '').toLowerCase().includes(term);
      if (!matchTitle && !matchCode && !matchNeigh && !matchCity && !matchDesc) return false;
    }

    if (collectionFilter !== 'todos' && p.type?.toLowerCase() !== collectionFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Pagination State & Logic
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [purposeTab, typeFilter, neighborhoodSearch, maxPrice, bedroomsMin, collectionFilter, aiSearchResult, onlyFavoritesFilter]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startItem = filteredProperties.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProperties.length);

  const handleOpenVisitModal = (prop: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVisitProperty(prop);
    setIsVisitModalOpen(true);
    setVisitSubmitted(false);
  };

  const handleScheduleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitProperty || !visitDate || !visitTime || !visitName || !visitPhone) return;

    addVisit({
      propertyId: visitProperty.id,
      agentId: visitProperty.agentId,
      date: visitDate,
      time: visitTime,
      status: 'pendente',
      clientName: visitName,
      clientPhone: visitPhone,
      clientEmail: visitEmail,
      notes: visitNotes
    });

    simulateNewLeadWeb({
      name: visitName,
      email: visitEmail || 'visita@cliente.com',
      phone: visitPhone,
      propertyId: visitProperty.id,
      message: `Solicitou agendamento de visita para ${visitDate} às ${visitTime}. Obs: ${visitNotes}`
    });

    setVisitSubmitted(true);
  };

  const handleLeadSubmitInDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyDetail || !leadName || !leadPhone) return;

    simulateNewLeadWeb({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      propertyId: selectedPropertyDetail.id,
      message: leadMsg || 'Solicitou atendimento sobre este imóvel.'
    });

    setLeadSuccess(true);
    setTimeout(() => setLeadSuccess(false), 5000);
  };

  const handleOwnerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone) return;

    addLead({
      name: ownerName,
      email: 'proprietario@imobiliaria.com',
      phone: ownerPhone,
      source: 'site',
      status: 'novo',
      interest: ownerType,
      budget: 0,
      assignedAgentId: users[0]?.id || 'u1'
    }, `PROPRIETÁRIO solicitando avaliação e cadastro de imóvel (${ownerType}).`);

    simulateNewLeadWeb({
      name: ownerName,
      email: 'proprietario@imobiliaria.com',
      phone: ownerPhone,
      message: `PROPRIETÁRIO solicitando avaliação e cadastro de imóvel (${ownerType}).`
    });

    setOwnerSubmitted(true);

    const agent = users[0];
    const waNumber = getCleanWhatsapp(siteConfig?.whatsapp || agent?.whatsapp);
    const text = encodeURIComponent(`Olá, sou ${ownerName} (${ownerPhone}) e gostaria de solicitar uma avaliação e cadastro do meu imóvel (${ownerType}) através do site.`);
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  // Custom HTML Blocks with strict deduplication
  const heroHtmlBlocks = customHtmlBlocks.filter(b => {
    if (b.position !== 'hero_banner' || !b.active) return false;
    if (b.id === 'html_hero_accent') return false; // Prevent deprecated duplicate banner
    if (isExclusiveActive && launchTitleLower && (
      b.title.toLowerCase().includes(launchTitleLower) ||
      b.htmlContent.toLowerCase().includes(launchTitleLower) ||
      b.htmlContent.toLowerCase().includes('grand horizon')
    )) {
      return false; // Prevent duplicate enterprise banner
    }
    return true;
  });

  const belowHighlightsHtmlBlocks = customHtmlBlocks.filter(b => {
    if (b.position !== 'below_highlights' || !b.active) return false;
    if (b.id === 'html_hero_accent') return false;
    if (isExclusiveActive && launchTitleLower && (
      b.title.toLowerCase().includes(launchTitleLower) ||
      b.htmlContent.toLowerCase().includes(launchTitleLower) ||
      b.htmlContent.toLowerCase().includes('grand horizon')
    )) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-12 pb-16">

      {/* ==================== EXCLUSIVE ADMIN VISITOR COUNTER BANNER ==================== */}
      {(currentUser?.role === 'admin' || currentUser?.isMasterAdmin) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-slate-900/95 backdrop-blur-md text-white py-2.5 px-4 sm:px-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-amber-500/40 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-black text-amber-400 uppercase tracking-wider text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                🔒 Painel Admin (Tráfego do Site)
              </span>
              <span className="font-medium text-slate-200">
                👁️ <strong className="text-white font-bold">{siteStats?.totalVisits?.toLocaleString('pt-BR') || 0}</strong> visitas registradas (<span className="text-emerald-400 font-bold">+{siteStats?.todayVisits || 0} hoje</span> • {siteStats?.uniqueVisitors || 0} visitantes únicos)
              </span>
              <span className="hidden md:inline text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Visível somente para Administradores
              </span>
            </div>
            <button
              onClick={() => setActiveTab('estatisticas')}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black rounded-xl text-[11px] transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ver Gráficos & Estatísticas</span>
            </button>
          </div>
        </div>
      )}
      
      {/* ==================== HERO BANNER SECTION ==================== */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 overflow-hidden py-16 px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Modern Organic Floating Blobs Behind Hero */}
        <AnimatedBlobs variant="hero" />

        {/* Background High-Res Architectural Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={siteConfig.heroBannerImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=80'}
            alt="Imóveis de Alto Padrão"
            className="w-full h-full object-cover object-center opacity-70 scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-indigo-950/30" />
        </div>

        {/* Hero Content (Clean Banner Headline with vertical position slider) */}
        <div 
          className="absolute left-1/2 z-10 max-w-4xl w-[90%] text-center space-y-6 transition-all duration-300"
          style={{
            top: `${siteConfig.heroTitlePositionY ?? 70}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Main Display Headline with Transparency and Font Size Controls */}
          <div className="space-y-3">
            <h1
              className="font-black text-white tracking-tight leading-tight drop-shadow-2xl transition-all select-none"
              style={{
                opacity: (siteConfig.heroTitleOpacity ?? 100) / 100,
                fontSize: siteConfig.heroTitleFontSize ? `${siteConfig.heroTitleFontSize}px` : undefined
              }}
            >
              {siteConfig.heroTitle || 'Conectando pessoas, realizando sonhos.'}
            </h1>
            {siteConfig.heroSubtitle && (
              <p className="text-sm sm:text-base text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-md">
                {siteConfig.heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ==================== SEARCH PANEL (OUTSIDE & BELOW BANNER) ==================== */}
      <section id="search-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="glass-surface bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-7 border border-white/60 dark:border-slate-800/80 shadow-2xl shadow-slate-950/10 dark:shadow-black/40 text-left space-y-5 backdrop-blur-xl">
            
            {/* AI Natural Language Search Feature Bar */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-950/70 dark:via-purple-950/50 dark:to-indigo-950/70 p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wide text-indigo-950 dark:text-indigo-200 uppercase flex items-center gap-1.5">
                      Busca Inteligente com Inteligência Artificial
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">NOVO</span>
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      Pesquise em linguagem natural como se estivesse conversando com um corretor
                    </p>
                  </div>
                </div>

                {aiSearchResult && (
                  <button
                    onClick={handleClearAiSearch}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-700"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpar busca IA</span>
                  </button>
                )}
              </div>

              {/* AI Input Form */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleAiSearchSubmit();
                }}
                className="flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="relative flex-1 w-full">
                  <Sparkles className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={aiSearchInput}
                    onChange={e => setAiSearchInput(e.target.value)}
                    placeholder="Ex: 'apartamento com 3 quartos perto do metrô' ou 'chácara com piscina para alugar'"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAiSearching || !aiSearchInput.trim()}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shrink-0 disabled:opacity-50"
                >
                  {isAiSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analisando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Pesquisar IA</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">Sugestões:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAiSearchInput('apartamento com 3 quartos perto do metrô');
                    handleAiSearchSubmit('apartamento com 3 quartos perto do metrô');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
                >
                  🏙️ Apartamento 3 quartos perto do metrô
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiSearchInput('casa com piscina para venda');
                    handleAiSearchSubmit('casa com piscina para venda');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
                >
                  🏊 Casa com piscina para venda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiSearchInput('chácara com área verde no interior');
                    handleAiSearchSubmit('chácara com área verde no interior');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
                >
                  🌳 Chácara com área verde no interior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiSearchInput('studio para alugar em SP');
                    handleAiSearchSubmit('studio para alugar em SP');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
                >
                  🔑 Studio para alugar em SP
                </button>
              </div>

              {/* Active AI Result Badge */}
              {aiSearchResult && (
                <div className="p-3 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-between gap-3 shadow-md animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{aiSearchResult.summary} ({filteredProperties.length} imóveis encontrados)</span>
                  </div>
                  <button
                    onClick={handleClearAiSearch}
                    className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white text-[10px] uppercase font-black tracking-wider transition-colors shrink-0"
                  >
                    Restaurar Todos
                  </button>
                </div>
              )}
            </div>

            {/* Search Purpose Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto max-w-full">
              <button
                onClick={() => triggerFilterAnimation(() => { setOnlyFavoritesFilter(false); setPurposeTab('todos'); })}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  !onlyFavoritesFilter && purposeTab === 'todos'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Todos os Imóveis</span>
              </button>

              <button
                onClick={() => {
                  setOnlyFavoritesFilter(!onlyFavoritesFilter);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 border ${
                  onlyFavoritesFilter
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${onlyFavoritesFilter ? 'fill-white' : 'text-rose-500'}`} />
                <span>Favoritos ({favorites.length})</span>
              </button>

              <button
                onClick={() => triggerFilterAnimation(() => { setOnlyFavoritesFilter(false); setPurposeTab('venda'); })}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  !onlyFavoritesFilter && purposeTab === 'venda'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('buyTab')}</span>
              </button>

              <button
                onClick={() => triggerFilterAnimation(() => { setOnlyFavoritesFilter(false); setPurposeTab('aluguel'); })}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                  !onlyFavoritesFilter && purposeTab === 'aluguel'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t('rentTab')}</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Neighborhood / Keyword */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 block">{t('locationLabel')}</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-indigo-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={neighborhoodSearch}
                    onChange={e => setNeighborhoodSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 block">{t('propertyTypeLabel')}</label>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as PropertyType | 'todos')}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="todos">{t('allTypes')}</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="chacara">Chácara / Sítio</option>
                  <option value="studio">Studio / Kitnet</option>
                  <option value="sala_comercial">Sala Comercial</option>
                  <option value="salao_comercial">Salão Comercial</option>
                  <option value="area_lazer">Área de Lazer / Espaço Eventos</option>
                  <option value="terreno">Terreno / Lote</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="comercial">Comercial Geral</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 block">{t('maxPriceLabel')}</label>
                <select
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{t('anyPrice')}</option>
                  <option value="200000">Até R$ 200.000</option>
                  <option value="350000">Até R$ 350.000</option>
                  <option value="500000">Até R$ 500.000</option>
                  <option value="800000">Até R$ 800.000</option>
                  <option value="1200000">Até R$ 1.200.000</option>
                  <option value="2500000">Até R$ 2.500.000</option>
                  <option value="5000000">Até R$ 5.000.000</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 block">{t('minBedroomsLabel')}</label>
                <select
                  value={bedroomsMin}
                  onChange={e => setBedroomsMin(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{t('anyBedrooms')}</option>
                  <option value="1">1+ Quarto</option>
                  <option value="2">2+ Quartos</option>
                  <option value="3">3+ Quartos</option>
                  <option value="4">4+ Suítes</option>
                </select>
              </div>

            </div>

            {/* Quick Search Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">{filteredProperties.length}</span> {t('foundCount')}
              </div>

              <button
                onClick={() => {
                  const targetSection = document.getElementById('imoveis-list');
                  if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <Search className="w-4 h-4" />
                <span>{t('searchButton')}</span>
              </button>
            </div>

          </div>
        </section>

      {/* ==================== FEATURED LISTINGS SECTION (RIGHT BELOW SEARCH) ==================== */}
      <section id="imoveis-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Acervo de Imóveis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Imóveis Selecionados</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                {filteredProperties.length}
              </span>
            </h2>
          </div>

          {/* Collection Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: t('all') },
              { id: 'casa', label: 'Casas' },
              { id: 'apartamento', label: 'Apartamentos' },
              { id: 'chacara', label: 'Chácaras' },
              { id: 'studio', label: 'Studios' },
              { id: 'sala_comercial', label: 'Comercial' },
              { id: 'area_lazer', label: 'Áreas Lazer' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => triggerFilterAnimation(() => setCollectionFilter(f.id as any))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  collectionFilter === f.id
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 font-bold shadow-md'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {isPropertiesLoading || isFilterLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum imóvel encontrado para estes filtros.</p>
            <p className="text-xs text-slate-500">Tente buscar por outro bairro ou limpe os filtros para ver todo o catálogo.</p>
            <button
              onClick={() => {
                triggerFilterAnimation(() => {
                  setPurposeTab('todos');
                  setTypeFilter('todos');
                  setNeighborhoodSearch('');
                  setMaxPrice('');
                  setBedroomsMin('');
                  setCollectionFilter('todos');
                });
              }}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProperties.map(prop => {
              const isFav = favorites.includes(prop.id);
              const agent = users.find(u => u.id === prop.agentId) || users[0];

              return (
                <div
                  key={prop.id}
                  onClick={() => openPropertyDetail(prop)}
                  style={siteConfig.enableCustomContours && siteConfig.contourColor ? { borderColor: siteConfig.contourColor, borderWidth: '1.5px' } : undefined}
                  className={`group bg-white dark:bg-slate-900 rounded-3xl border shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer ${
                    siteConfig.enableCustomContours ? 'theme-contour theme-contour-hover' : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  
                  {/* Image Container with Badges & Watermark */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'}
                      alt={prop.title}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('unsplash.com')) {
                          target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Watermark Overlay */}
                    <WatermarkOverlay siteConfig={siteConfig} />

                    {/* Top-Left Badges: Purpose & Highlights (Clean and compact) */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-600/95 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        {prop.purpose === 'venda' ? t('saleBadge') : t('rentBadge')}
                      </span>
                      {prop.highlight === 'super_destaque' ? (
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-slate-950" />
                          <span>Super Destaque</span>
                        </span>
                      ) : prop.highlight === 'destaque' ? (
                        <span className="px-2.5 py-1 rounded-xl bg-indigo-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                          Destaque
                        </span>
                      ) : null}
                      {prop.tarja && (
                        <span
                          style={prop.tarjaCustomColor ? { backgroundColor: prop.tarjaCustomColor } : undefined}
                          className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1"
                        >
                          <Award className="w-3 h-3" />
                          <span>{prop.tarja}</span>
                        </span>
                      )}
                      {prop.images && prop.images.length >= 3 && prop.highlight !== 'super_destaque' && !prop.tarja && (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/95 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-slate-950" />
                          <span>Destaque Fotos</span>
                        </span>
                      )}
                    </div>

                    {/* Top-Right: Favorite Button (Isolated, prevents badge overlap on vertical phones) */}
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={e => toggleFavorite(prop.id, e)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
                          isFav ? 'bg-rose-500 text-white scale-110' : 'bg-black/50 text-white hover:bg-rose-500 hover:scale-110 active:scale-95'
                        }`}
                        title="Salvar nos Favoritos"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Overlay: Location on Left, Property Code on Right */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center gap-1 min-w-0 text-slate-200 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{prop.address.neighborhood}, {prop.address.city}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white font-mono text-[10px] font-bold shrink-0 border border-white/10 shadow-xs">
                        {prop.code}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-1.5">
                      {/* Property Type Badge (Moved outside image to prevent mobile overlap) */}
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 text-[10px] font-bold">
                          {getPropertyTypeLabel(prop.type)}
                        </span>
                        {prop.status === 'reservado' && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Reservado</span>
                        )}
                      </div>

                      <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {prop.description}
                      </p>
                    </div>

                    {/* Features Strip */}
                    <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{prop.bedrooms} Qts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{prop.bathrooms} Ban</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{prop.parkingSpaces} Vag</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{prop.areaSqM || prop.areaTerreno || prop.areaConstruida || 0}m²</span>
                      </div>
                    </div>

                    {/* Secondary Area Badges if specified */}
                    {(prop.areaTerreno || prop.areaConstruida || prop.areaComum) ? (
                      <div className="flex items-center gap-1.5 flex-wrap -mt-2 text-[10px] text-slate-500 font-medium">
                        {prop.areaTerreno ? <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Terreno: {prop.areaTerreno}m²</span> : null}
                        {prop.areaConstruida ? <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Construída: {prop.areaConstruida}m²</span> : null}
                        {prop.areaComum ? <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Comum: {prop.areaComum}m²</span> : null}
                      </div>
                    ) : null}

                    {/* Price & Actions Row */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('valueLabel')}</span>
                        <span
                          style={siteConfig.enableCustomContours && siteConfig.detailsColor ? { color: siteConfig.detailsColor } : undefined}
                          className="text-xl font-black text-indigo-600 dark:text-indigo-400 theme-accent-text"
                        >
                          R$ {prop.price.toLocaleString('pt-BR')}
                          {prop.purpose === 'aluguel' && <span className="text-xs text-slate-400 font-medium">{t('perMonth')}</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={e => handleShareProperty(e, prop)}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
                          title="Compartilhar imóvel"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <a
                          href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Olá ${agent.name}, vi o imóvel ${prop.code} (${prop.title}) no site e gostaria de atendimento.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 hover:scale-110 active:scale-95"
                          title={t('contactWhatsapp')}
                        >
                          <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
                        </a>

                        <button
                          onClick={() => openPropertyDetail(prop)}
                          className="px-3.5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                        >
                          <span>{t('viewProperty')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
            </div>

            {/* Pagination Bar with Page Counter */}
            {filteredProperties.length > 0 && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 font-medium">
                  Mostrando <span className="font-bold text-slate-900 dark:text-white">{startItem}</span> a <span className="font-bold text-slate-900 dark:text-white">{endItem}</span> de <span className="font-bold text-slate-900 dark:text-white">{filteredProperties.length}</span> imóveis disponíveis • Página <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentPage}</span> de <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-xs disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>

                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages: (number | string)[] = [];
                        if (totalPages <= 7) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                          if (currentPage <= 4) {
                            pages.push(1, 2, 3, 4, 5, '...', totalPages);
                          } else if (currentPage >= totalPages - 3) {
                            pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                          } else {
                            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                          }
                        }

                        return pages.map((page, idx) => {
                          if (page === '...') {
                            return (
                              <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400 select-none">
                                ...
                              </span>
                            );
                          }
                          const pageNum = Number(page);
                          const isActive = pageNum === currentPage;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setCurrentPage(pageNum);
                                window.scrollTo({ top: 400, behavior: 'smooth' });
                              }}
                              className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                                isActive
                                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                              }`}
                              title={`Ir para a Página ${pageNum}`}
                            >
                              {pageNum}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-xs disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </section>

      {/* ==================== LANÇAMENTO EXCLUSIVO VIP SECTION ==================== */}
      {(siteConfig.exclusiveLaunch?.enabled !== false) && (() => {
        const exclusive = siteConfig.exclusiveLaunch || {
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

        const waNumber = getCleanWhatsapp(siteConfig.whatsapp || siteConfig.brokerWhatsapp);
        const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(exclusive.ctaWhatsappMsg || `Olá Joel! Gostaria de informações sobre ${exclusive.title}.`)}`;

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-indigo-900/60 shadow-2xl text-white">
              
              {/* Background Glow Accents */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Visual Showcase (Main Photo + Secondary Preview) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img
                      src={exclusive.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80'}
                      alt={exclusive.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Watermark Overlay on Exclusive Launch */}
                    <WatermarkOverlay siteConfig={siteConfig} />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{exclusive.statusTag || 'Obras Iniciadas'}</span>
                      </span>
                    </div>

                    {/* Location Pin Tag */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{exclusive.location}</span>
                    </div>
                  </div>

                  {/* Secondary Image Strip / Highlights preview if available */}
                  {exclusive.secondaryImageUrl && (
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-16 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0">
                        <img
                          src={exclusive.secondaryImageUrl}
                          alt="Detalhe do Lançamento"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-slate-300 italic leading-snug">
                        "Plantas autorais concebidas com acabamentos de luxo e vista privativa deslumbrante."
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Architectural Description, Features & VIP CTA */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Top VIP Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{exclusive.badge || 'Lançamento Exclusivo • Joel Santana'}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      {exclusive.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                      {exclusive.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {exclusive.description}
                  </p>

                  {/* Features List */}
                  {exclusive.features && exclusive.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                      {exclusive.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price & Action Button */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Condições Especiais de Lançamento:
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-300">
                        {exclusive.price}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsExclusiveModalOpen(true)}
                        className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Saiba Mais & Detalhes</span>
                      </button>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>{exclusive.ctaText || 'Receber Book Digital no WhatsApp'}</span>
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {/* ==================== SUPER DESTAQUES CAROUSEL (TOP SPOTLIGHT) ==================== */}
      <SuperDestaquesCarousel
        properties={properties}
        users={users}
        showBrokerPhoto={siteConfig.showBrokerPhotoOnProperties}
        onSelectProperty={setSelectedPropertyDetail}
        onOpenVisitModal={handleOpenVisitModal}
        t={t}
        isLoading={isPropertiesLoading}
      />

      {/* Render Custom HTML Hero Banner Blocks if active */}
      {heroHtmlBlocks.map(block => (
        <div key={block.id} className="max-w-7xl mx-auto px-4">
          <div dangerouslySetInnerHTML={{ __html: block.htmlContent }} />
        </div>
      ))}

      {/* ==================== CATEGORIES GRID SECTION ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Exploração por Estilo de Vida
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              O que você procura hoje?
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Navegue por nossas categorias especializadas e encontre as melhores opções para você e sua família.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              id: 'casa',
              title: 'Casas Residenciais',
              icon: Home,
              count: 'Disponíveis',
              img: '/images/house_with_roof_card_1789502902446.jpg',
              fallbackImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80'
            },
            {
              id: 'apartamento',
              title: 'Apartamentos',
              icon: Building2,
              count: 'Disponíveis',
              img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop&q=80',
              fallbackImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=80'
            },
            {
              id: 'chacara',
              title: 'Chácaras & Sítios',
              icon: Sun,
              count: 'Lazer e Moradia',
              img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
              fallbackImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80'
            },
            {
              id: 'studio',
              title: 'Studios & Kitnets',
              icon: Sparkles,
              count: 'Práticos',
              img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&auto=format&fit=crop&q=80',
              fallbackImg: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&auto=format&fit=crop&q=80'
            },
            {
              id: 'sala_comercial',
              title: 'Salas & Salões',
              icon: Award,
              count: 'Comerciais',
              img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
              fallbackImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80'
            },
            {
              id: 'area_lazer',
              title: 'Áreas de Lazer',
              icon: Maximize2,
              count: 'Festas / Eventos',
              img: '/images/leisure_area_pool_card_1789505179384.jpg',
              fallbackImg: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&auto=format&fit=crop&q=80'
            }
          ].map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  triggerFilterAnimation(() => {
                    setTypeFilter(cat.id as PropertyType);
                  });
                  const target = document.getElementById('imoveis-list');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (cat.fallbackImg && target.src !== cat.fallbackImg) {
                      target.src = cat.fallbackImg;
                    } else if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/90 text-white flex items-center justify-center mb-1 shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs leading-snug">{cat.title}</h3>
                  <span className="text-[10px] text-slate-300">{cat.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== REALOCATED INFORMATIONS / TRUST STATS BAR (BELOW LISTINGS) ==================== */}
      {siteConfig.showTrustStatsBar !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 relative z-20">
          <AnimatedBlobs variant="subtle" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl">
            <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/60 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3 transition-transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {(!siteConfig.trustStat1Value || siteConfig.trustStat1Value === '+1.500') ? (
                    <AnimatedCounter end={1500} prefix="+" />
                  ) : (
                    siteConfig.trustStat1Value
                  )}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {siteConfig.trustStat1Label || 'Imóveis Cadastrados'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/60 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3 transition-transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {(!siteConfig.trustStat2Value || siteConfig.trustStat2Value === '100%') ? (
                    <AnimatedCounter end={100} suffix="%" />
                  ) : (
                    siteConfig.trustStat2Value
                  )}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {siteConfig.trustStat2Label || 'Documentação Auditada'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/60 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex items-center gap-3 transition-transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {siteConfig.trustStat3Value || 'Ágil e Direto'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {siteConfig.trustStat3Label || 'Atendimento via WhatsApp'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/60 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex items-center gap-3 transition-transform hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {(!siteConfig.trustStat4Value || siteConfig.trustStat4Value === 'Nota 4.9/5') ? (
                    <>Nota <AnimatedCounter end={4.9} decimals={1} />/5</>
                  ) : (
                    siteConfig.trustStat4Value
                  )}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {siteConfig.trustStat4Label || 'Avaliações Positivas'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Render Custom HTML Blocks below highlights if active */}
      {belowHighlightsHtmlBlocks.map(block => (
        <div key={block.id} className="max-w-7xl mx-auto px-4">
          <div dangerouslySetInnerHTML={{ __html: block.htmlContent }} />
        </div>
      ))}

      {/* ==================== MORTGAGE & MCMV SIMULATOR SECTION ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-indigo-900/50 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-indigo-900/60 pb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 block flex items-center gap-1">
                <Calculator className="w-4 h-4" />
                <span>{t('simulatorTitle')}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {t('simulatorHeadline')}
              </h2>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex items-center gap-2 bg-indigo-950/80 p-1.5 rounded-2xl border border-indigo-800/80">
              <button
                onClick={() => setSimulatorMode('mercado')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  simulatorMode === 'mercado' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-200 hover:text-white'
                }`}
              >
                Financiamento Mercado (SFH)
              </button>
              <button
                onClick={() => setSimulatorMode('mcmv')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  simulatorMode === 'mcmv' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-indigo-200 hover:text-white'
                }`}
              >
                🏛️ Minha Casa, Minha Vida (MCMV)
              </button>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Area */}
            <div className="lg:col-span-7 space-y-6">
              
              {simulatorMode === 'mcmv' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Renda Familiar Bruta Mensal (MCMV):</span>
                    <span className="text-amber-300 font-mono text-sm font-black">R$ {mcmvIncome.toLocaleString('pt-BR')}</span>
                  </div>
                  <input
                    type="range"
                    min={1500}
                    max={12000}
                    step={250}
                    value={mcmvIncome}
                    onChange={e => setMcmvIncome(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <p className="text-[11px] text-indigo-200">
                    *Regras vigentes 2026: Juros subsidiados de {mcmvInterestRate}% a.a. • Subsídio governamental estimado de até R$ {mcmvSubsidy.toLocaleString('pt-BR')}.
                  </p>
                </div>
              )}

              {/* Property Value Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-indigo-200">{t('propertyValue')}:</span>
                  <span className="text-amber-300 font-mono text-sm">R$ {calcPropertyPrice.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min={simulatorMode === 'mcmv' ? 150000 : 200000}
                  max={simulatorMode === 'mcmv' ? 500000 : 10000000}
                  step={25000}
                  value={calcPropertyPrice}
                  onChange={e => setCalcPropertyPrice(Number(e.target.value))}
                  className="w-full h-2 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              {simulatorMode === 'mercado' && (
                <>
                  {/* Down Payment % Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-indigo-200">{t('downPayment')} ({calcDownPaymentPct}%):</span>
                      <span className="text-emerald-400 font-mono text-sm">R$ {downPaymentAmount.toLocaleString('pt-BR')}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={80}
                      step={5}
                      value={calcDownPaymentPct}
                      onChange={e => setCalcDownPaymentPct(Number(e.target.value))}
                      className="w-full h-2 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Years & Rate */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-indigo-300">{t('termYears')}</label>
                      <select
                        value={calcYears}
                        onChange={e => setCalcYears(Number(e.target.value))}
                        className="w-full p-2.5 bg-indigo-900/60 border border-indigo-700/60 rounded-xl text-xs font-bold text-white focus:outline-none"
                      >
                        <option value={10}>10 Anos (120 meses)</option>
                        <option value={15}>15 Anos (180 meses)</option>
                        <option value={20}>20 Anos (240 meses)</option>
                        <option value={30}>30 Anos (360 meses)</option>
                        <option value={35}>35 Anos (420 meses)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-indigo-300">{t('interestRate')}</label>
                      <select
                        value={calcInterestRatePct}
                        onChange={e => setCalcInterestRatePct(Number(e.target.value))}
                        className="w-full p-2.5 bg-indigo-900/60 border border-indigo-700/60 rounded-xl text-xs font-bold text-white focus:outline-none"
                      >
                        <option value={8.5}>8,5% a.a. (Taxa Promo)</option>
                        <option value={10.5}>10,5% a.a. (Média de Mercado)</option>
                        <option value={12.0}>12,0% a.a.</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {simulatorMode === 'mcmv' && (
                <div className="pt-2">
                  <a
                    href="https://simuladorhabitacao.caixa.gov.br/home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 underline"
                  >
                    <span>🔗 Acessar Simulador Oficial da Caixa (Habitação CEF)</span>
                  </a>
                </div>
              )}

            </div>

            {/* Results Display Box */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 space-y-4">
              <span className="text-[10px] font-black uppercase text-indigo-300 block tracking-widest">
                {simulatorMode === 'mcmv' ? 'Minha Casa, Minha Vida (Simulação)' : t('simulatorTitle')}
              </span>

              <div className="space-y-1">
                <span className="text-xs text-indigo-200">{t('estimatedInstallment')}:</span>
                <p className="text-3xl font-black text-amber-300">
                  R$ {estimatedMonthlyPayment.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}<span className="text-xs font-normal text-indigo-200">{t('perMonth')}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {simulatorMode === 'mcmv' ? 'Subsídio Gov.' : t('financedValue')}
                  </span>
                  <span className="font-bold text-white">
                    R$ {simulatorMode === 'mcmv' ? mcmvSubsidy.toLocaleString('pt-BR') : loanAmount.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t('recommendedIncome')}</span>
                  <span className="font-bold text-emerald-400">R$ {recommendedIncome.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${getCleanWhatsapp(siteConfig?.whatsapp || siteConfig?.brokerWhatsapp)}?text=${encodeURIComponent(`Olá! Gostaria de simular e aprovar um crédito (${simulatorMode === 'mcmv' ? 'Minha Casa Minha Vida' : 'Financiamento Mercado'}) para um imóvel no valor de R$ ${calcPropertyPrice.toLocaleString('pt-BR')}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider block text-center mt-2"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
                <span>{t('approveCreditButton')}</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== SITES PARCEIROS SECTION ==================== */}
      {(siteConfig.showPartnerSites !== false) && (
        (siteConfig.partnerSite1Name || siteConfig.partnerSite2Name || siteConfig.partnerSite3Name) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-slate-100 dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Sites & Parceiros Recomendados</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Links úteis e parceiros institucionais</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {siteConfig.partnerSite1Name && (
                  <a
                    href={siteConfig.partnerSite1Url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{siteConfig.partnerSite1Name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{siteConfig.partnerSite1Desc || 'Visite o site parceiro'}</p>
                    </div>
                  </a>
                )}

                {siteConfig.partnerSite2Name && (
                  <a
                    href={siteConfig.partnerSite2Url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{siteConfig.partnerSite2Name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{siteConfig.partnerSite2Desc || 'Visite o site parceiro'}</p>
                    </div>
                  </a>
                )}

                {siteConfig.partnerSite3Name && (
                  <a
                    href={siteConfig.partnerSite3Url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{siteConfig.partnerSite3Name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{siteConfig.partnerSite3Desc || 'Visite o site parceiro'}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </section>
        )
      )}

      {/* ==================== VALUE PROPOSITIONS SECTION ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Nossos Diferenciais
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Por que somos a escolha certa para o seu imóvel?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: siteConfig.diff1Title || '100% Documentação Auditada',
              desc: siteConfig.diff1Desc || 'Análise rigorosa das certidões e matrículas antes da colocação no mercado.'
            },
            {
              icon: Zap,
              title: siteConfig.diff2Title || 'Atendimento Ágil e Atencioso',
              desc: siteConfig.diff2Desc || 'Corretores credenciados de prontidão via WhatsApp para tirar todas as dúvidas imediatamente.'
            },
            {
              icon: Award,
              title: siteConfig.diff3Title || 'Imóveis Verificados e Validados',
              desc: siteConfig.diff3Desc || 'Imóveis verificados e validados para garantir uma negociação totalmente segura.'
            },
            {
              icon: TrendingUp,
              title: siteConfig.diff4Title || 'Avaliação Precisa de Mercado',
              desc: siteConfig.diff4Desc || 'Metodologia com dados reais de transações na região para garantir o valor justo.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3 hover:border-indigo-500 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== OWNER SELLER CTA BANNER ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-black uppercase tracking-widest inline-block">
              Para Proprietários de Imóveis
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              {t('ownerTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('ownerDesc')}
            </p>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-3xl text-slate-900 dark:text-white shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('ownerFormTitle')}</h3>

            {ownerSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>Solicitação recebida com sucesso!</p>
                <p className="text-[11px] font-normal">Um de nossos gerentes de captação entrará em contato em breve no número informado.</p>
              </div>
            ) : (
              <form onSubmit={handleOwnerFormSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{t('fullName')}</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="Ex: Roberto Alcantara"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{t('phoneWhatsapp')}</label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={e => setOwnerPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{t('propertyTypeLabel')}</label>
                    <select
                      value={ownerType}
                      onChange={e => setOwnerType(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="apartamento">{t('apartment')}</option>
                      <option value="cobertura">{t('penthouse')}</option>
                      <option value="casa">{t('house')}</option>
                      <option value="comercial">{t('commercial')}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-xs uppercase tracking-wider"
                >
                  {t('requestEvaluation')}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ==================== AUTONOMOUS BROKER PRESENTATION CARD (AT END OF PAGE) ==================== */}
      {siteConfig.brokerName && (() => {
        const masterUser = users.find(u => u.isMasterAdmin || u.id === 'usr_master_joel' || (u.email && u.email.toLowerCase() === 'joelsantanaimoveis@gmail.com')) || users[0];
        const displayAvatar = (siteConfig.brokerAvatarUrl && !siteConfig.brokerAvatarUrl.includes('1560250097-0b93528c311a'))
          ? siteConfig.brokerAvatarUrl
          : (masterUser?.avatar || siteConfig.brokerAvatarUrl);

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <img
                  src={displayAvatar}
                  alt={siteConfig.brokerName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-xl shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{siteConfig.brokerName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                      {siteConfig.brokerCreci || 'CRECI 12345-F'}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 font-medium">
                    {siteConfig.brokerRegion || 'Atendimento Personalizado em São Paulo e Região'}
                  </p>
                  <p className="text-xs text-slate-300 max-w-xl line-clamp-2">
                    {siteConfig.brokerBio || 'Corretor autônomo com ampla experiência no mercado imobiliário. Atendimento direto e sem intermediários.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ==================== FOOTER LEAD CAPTURE SECTION ==================== */}
      <FooterLeadCapture
        siteConfig={siteConfig}
        users={users}
        onAddLead={addLead}
        onSimulateLeadWeb={simulateNewLeadWeb}
        onShowToast={showToast}
      />

      {/* ==================== PROPERTY DETAIL MODAL ==================== */}
      {selectedPropertyDetail && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 w-full h-full overflow-y-auto p-4 sm:p-8 lg:p-12 space-y-6">
          
          <div className="w-full space-y-6 relative">
            <div className="sticky top-4 z-30 flex justify-end px-4 sm:px-8">
              <button
                onClick={() => setSelectedPropertyDetail(null)}
                className="bg-slate-900/90 hover:bg-black text-white p-3 rounded-full transition-colors shadow-2xl flex items-center gap-2 text-xs font-bold"
                title="Fechar Imóvel"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">Fechar Visualização</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 -mt-12 max-w-7xl mx-auto px-2 sm:px-6">
              
              {/* Main Photo & Interactive Gallery */}
              <PropertyGallery
                property={selectedPropertyDetail}
                siteConfig={siteConfig}
              />

              {/* Title, Actions & Price Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">
                      {selectedPropertyDetail.code}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {selectedPropertyDetail.purpose === 'venda' ? 'Venda' : 'Aluguel'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedPropertyDetail.title}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{selectedPropertyDetail.address.street}, {selectedPropertyDetail.address.neighborhood} - {selectedPropertyDetail.address.city}/{selectedPropertyDetail.address.state}</span>
                  </p>

                  {/* Favorite & Share Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={e => toggleFavorite(selectedPropertyDetail.id, e)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs border ${
                        favorites.includes(selectedPropertyDetail.id)
                          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(selectedPropertyDetail.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{favorites.includes(selectedPropertyDetail.id) ? 'Favoritado' : 'Salvar Favorito'}</span>
                    </button>

                    <button
                      onClick={e => handleShareProperty(e, selectedPropertyDetail)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Compartilhar</span>
                    </button>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
                    R$ {selectedPropertyDetail.price.toLocaleString('pt-BR')}
                  </span>
                  {selectedPropertyDetail.condoFee && (
                    <span className="text-[11px] text-slate-400 block">Condomínio: R$ {selectedPropertyDetail.condoFee}/mês</span>
                  )}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs font-semibold">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Área Útil / Privativa</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.areaPrivativa || selectedPropertyDetail.areaSqM || 0} m²</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Dormitórios</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.bedrooms} ({selectedPropertyDetail.suites} suítes)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Banheiros</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.bathrooms} banheiros</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Vagas</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.parkingSpaces} vagas</span>
                </div>

                {/* Additional Areas if defined */}
                {selectedPropertyDetail.areaTerreno ? (
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Área do Terreno</span>
                    <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.areaTerreno} m²</span>
                  </div>
                ) : null}
                {selectedPropertyDetail.areaConstruida ? (
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Área Construída</span>
                    <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.areaConstruida} m²</span>
                  </div>
                ) : null}
                {selectedPropertyDetail.areaComum ? (
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Área Comum</span>
                    <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.areaComum} m²</span>
                  </div>
                ) : null}
                {selectedPropertyDetail.areaTotal ? (
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Área Total</span>
                    <span className="text-slate-900 dark:text-white font-bold">{selectedPropertyDetail.areaTotal} m²</span>
                  </div>
                ) : null}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Descrição do Imóvel</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedPropertyDetail.description}
                </p>
              </div>

              {/* Broker Photo & Profile Card (Controlled by Site Config) */}
              {siteConfig.showBrokerPhotoOnProperties && (() => {
                const masterUser = users.find(u => u.isMasterAdmin || u.id === 'usr_master_joel' || (u.email && u.email.toLowerCase() === 'joelsantanaimoveis@gmail.com')) || users[0];
                const captador = users.find(u => u.id === selectedPropertyDetail.agentId) || masterUser || users[0];
                const captadorAvatar = (captador?.avatar && !captador.avatar.includes('1560250097-0b93528c311a'))
                  ? captador.avatar
                  : ((siteConfig.brokerAvatarUrl && !siteConfig.brokerAvatarUrl.includes('1560250097-0b93528c311a')) ? siteConfig.brokerAvatarUrl : (masterUser?.avatar || captador?.avatar));

                return (
                  <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-4 shadow-sm">
                    <img src={captadorAvatar} alt={captador?.name || 'Corretor'} className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-indigo-500 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 block tracking-wider">Corretor Responsável pelo Imóvel</span>
                      <p className="font-black text-sm text-slate-900 dark:text-white">{captador?.name || siteConfig.brokerName || 'Joel Santana'}</p>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{captador?.creci || siteConfig.brokerCreci || 'CRECI Regularizado'} • {captador?.phone || siteConfig.brokerPhone}</p>
                      {(captador?.bio || siteConfig.brokerBio) && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">{captador?.bio || siteConfig.brokerBio}</p>}
                    </div>
                  </div>
                );
              })()}

              {/* Topografia, Testada, Ocupação e IPTU if present */}
              {(selectedPropertyDetail.topografia || selectedPropertyDetail.ocupacaoUso || selectedPropertyDetail.testadaMeters || selectedPropertyDetail.iptuAnnual) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-indigo-50/40 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 text-xs">
                  {selectedPropertyDetail.topografia && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Topografia</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{selectedPropertyDetail.topografia}</span>
                    </div>
                  )}
                  {selectedPropertyDetail.ocupacaoUso && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Ocupação / Uso</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{selectedPropertyDetail.ocupacaoUso}</span>
                    </div>
                  )}
                  {selectedPropertyDetail.testadaMeters ? (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Testada (Frente)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPropertyDetail.testadaMeters} m</span>
                    </div>
                  ) : null}
                  {selectedPropertyDetail.iptuAnnual ? (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">IPTU</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">R$ {selectedPropertyDetail.iptuAnnual.toLocaleString('pt-BR')}</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Features Chips */}
              <div className="space-y-3">
                {selectedPropertyDetail.features && selectedPropertyDetail.features.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Recursos & Diferenciais do Imóvel</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPropertyDetail.features.map((feat, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-indigo-200/60 dark:border-indigo-900/40">
                          <Check className="w-3 h-3 text-indigo-500" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPropertyDetail.featuresEmpreendimento && selectedPropertyDetail.featuresEmpreendimento.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-xs text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">Empreendimento & Lazer</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPropertyDetail.featuresEmpreendimento.map((feat, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-900/40">
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPropertyDetail.featuresRegiao && selectedPropertyDetail.featuresRegiao.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-xs text-sky-900 dark:text-sky-300 uppercase tracking-wider">Região & Proximidades</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPropertyDetail.featuresRegiao.map((feat, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-sky-200/60 dark:border-sky-900/40">
                          <MapPin className="w-3 h-3 text-sky-500" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact & Scheduling Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => handleOpenVisitModal(selectedPropertyDetail)}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all text-xs uppercase flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Visita Presencial</span>
                </button>

                <a
                  href={`https://wa.me/${getCleanWhatsapp(siteConfig?.whatsapp || siteConfig?.brokerWhatsapp)}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel ${selectedPropertyDetail.code} - ${selectedPropertyDetail.title}. Gostaria de mais detalhes.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all text-xs uppercase flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-500" />
                  <span>Atendimento Rápido WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================== VISIT SCHEDULING MODAL ==================== */}
      {isVisitModalOpen && visitProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => setIsVisitModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Agendar Visita Guiada</h3>
              <p className="text-xs text-slate-500">{visitProperty.title} ({visitProperty.code})</p>
            </div>

            {visitSubmitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Visita Agendada com Sucesso!</h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-400">
                  Um de nossos corretores entrará em contato para confirmar o horário e local do encontro.
                </p>
                <button
                  onClick={() => setIsVisitModalOpen(false)}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleVisitSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={visitName}
                    onChange={e => setVisitName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={visitPhone}
                      onChange={e => setVisitPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Data da Visita</label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={e => setVisitDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Horário Preferencial</label>
                  <select
                    value={visitTime}
                    onChange={e => setVisitTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="09:00">09:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>

                <label className="flex items-start gap-2 cursor-pointer pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <input type="checkbox" required className="mt-0.5 w-3.5 h-3.5 accent-indigo-600 rounded shrink-0" />
                  <span>Concordo com os Termos de Uso e Política de Privacidade conforme a LGPD (Lei nº 13.709/2018).</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-xs uppercase"
                >
                  Confirmar Agendamento
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Exclusive VIP Launch Presentation & Scheduling Modal */}
      <ExclusiveLaunchModal
        isOpen={isExclusiveModalOpen}
        onClose={() => setIsExclusiveModalOpen(false)}
        siteConfig={siteConfig}
        users={users}
      />

      {/* LGPD Cookie Consent Banner & Legal Modals */}
      <LgpdConsentModal siteConfig={siteConfig} />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-indigo-600 px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-indigo-400 text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
