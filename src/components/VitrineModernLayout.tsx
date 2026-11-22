import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property, PropertyType, PropertyPurpose } from '../types';
import { SuperDestaquesCarousel } from './SuperDestaquesCarousel';
import { WatermarkOverlay } from './WatermarkOverlay';
import { FooterLeadCapture } from './FooterLeadCapture';
import { ClientTestimonialsSection } from './ClientTestimonialsSection';
import { getPropertyImageUrl } from '../utils/propertyImageHelper';
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
  Crown
} from 'lucide-react';

export const VitrineModernLayout: React.FC = () => {
  const {
    properties,
    siteConfig,
    t,
    setSelectedPropertyDetail,
    leads,
    addLead
  } = useApp();

  // Local Filter States for Minimalist Modern Layout
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<'all' | 'venda' | 'aluguel'>('all');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Neighborhood list derived from properties
  const neighborhoods = Array.from(new Set(properties.map(p => p.address?.neighborhood).filter(Boolean)));

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    if (prop.status === 'arquivado' || (prop as any)._deleted) return false;

    if (purposeFilter !== 'all' && prop.purpose !== purposeFilter) return false;
    if (typeFilter !== 'all' && prop.type !== typeFilter) return false;
    if (selectedNeighborhood !== 'all' && prop.address?.neighborhood !== selectedNeighborhood) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = prop.title?.toLowerCase().includes(q);
      const matchDesc = prop.description?.toLowerCase().includes(q);
      const matchCode = prop.code?.toLowerCase().includes(q);
      const matchNeighborhood = prop.address?.neighborhood?.toLowerCase().includes(q);
      const matchCity = prop.address?.city?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCode && !matchNeighborhood && !matchCity) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openPropertyDetail = (prop: Property) => {
    setSelectedPropertyDetail(prop);
  };

  return (
    <div className="space-y-16 pb-20 bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      
      {/* ==================== MINIMALIST MODERN HERO ARCHITECTURE ==================== */}
      <section className="relative min-h-[520px] sm:min-h-[600px] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <AnimatedBlobs variant="hero" />
        
        {/* Background Architectural Image with Dark Sophisticated Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={siteConfig.heroBannerImage || '/images/house_with_pool_1789524615804.jpg'}
            alt="Arquitetura de Alto Padrão"
            loading="eager"
            decoding="async"
            // @ts-ignore
            fetchPriority="high"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl w-full text-center space-y-8 mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-400 font-bold text-xs uppercase tracking-widest border border-white/20 shadow-xl">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>{siteConfig.brokerName || 'Joel Santana'} • {siteConfig.brokerCreci || 'CRECI 128.785-F'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl">
            {siteConfig.heroTitle || 'Arquitetura autoral, endereços exclusivos.'}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            {siteConfig.heroSubtitle || 'Explore o catálogo selecionado de residências de alto padrão e oportunidades de investimento na região.'}
          </p>

          {/* Minimalist Instant Search Bar */}
          <div className="max-w-3xl mx-auto bg-white/95 dark:bg-slate-900/95 p-3 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-full">
              <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Busque por código, bairro, condomínio ou palavra-chave..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('modern-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
            >
              <span>Explorar Imóveis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto border-t border-white/10">
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-white">
                <AnimatedCounter end={properties.length || 12} suffix="+" />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Imóveis Selecionados</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-amber-400">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Atendimento Exclusivo</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-white">
                <AnimatedCounter end={neighborhoods.length || 8} />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Bairros Nobres</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">R$ 0</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Avaliação Gratuita</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SUPER DESTAQUES CAROUSEL ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SuperDestaquesCarousel />
      </section>

      {/* ==================== PROPERTY CATALOG SECTION ==================== */}
      <section id="modern-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Portfólio Disponível
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white">
              Catálogo de Imóveis Exclusivos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Mostrando {filteredProperties.length} imóvel(is) encontrado(s) em São José do Rio Preto e região.
            </p>
          </div>

          {/* Purpose & Type Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setPurposeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                purposeFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setPurposeFilter('venda')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                purposeFilter === 'venda'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              À Venda
            </button>
            <button
              onClick={() => setPurposeFilter('aluguel')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                purposeFilter === 'aluguel'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              Aluguel
            </button>
          </div>
        </div>

        {/* Neighborhood Quick Filter */}
        {neighborhoods.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">Bairro:</span>
            <button
              onClick={() => setSelectedNeighborhood('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                selectedNeighborhood === 'all'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Todos os Bairros
            </button>
            {neighborhoods.map(n => (
              <button
                key={n}
                onClick={() => setSelectedNeighborhood(n)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                  selectedNeighborhood === n
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* Property Grid */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProperties.map(prop => {
              const primaryImage = prop.images && prop.images.length > 0 ? getPropertyImageUrl(prop.images[0]) : '';
              return (
                <div
                  key={prop.id}
                  onClick={() => openPropertyDetail(prop)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={prop.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                        Sem foto
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
                    
                    <WatermarkOverlay siteConfig={siteConfig} />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                        {prop.purpose === 'venda' ? 'À Venda' : 'Aluguel'}
                      </span>
                      {prop.highlight === 'super_destaque' && (
                        <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-slate-950" />
                          <span>Super Destaque</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/10">
                      {prop.code}
                    </div>

                    {/* Bottom Price Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-medium">Valor</span>
                        <span className="text-xl sm:text-2xl font-black text-white drop-shadow">
                          R$ {prop.price.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{prop.address?.neighborhood || 'São José do Rio Preto'}, {prop.address?.city || 'SP'}</span>
                      </p>
                    </div>

                    {/* Specs Footer */}
                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                        <Bed className="w-4 h-4 text-indigo-600" />
                        <span>{prop.bedrooms || 0}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                        <Bath className="w-4 h-4 text-indigo-600" />
                        <span>{prop.bathrooms || 0}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                        <Car className="w-4 h-4 text-indigo-600" />
                        <span>{prop.parkingSpaces || 0}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                        <Maximize2 className="w-4 h-4 text-indigo-600" />
                        <span>{prop.areaSqM || 0}m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum imóvel encontrado</h3>
            <p className="text-xs text-slate-500">Tente ajustar seus filtros de busca ou remover os termos digitados.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-3">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </section>

      {/* ==================== CLIENT TESTIMONIALS SECTION ==================== */}
      {siteConfig.showTestimonialsSection !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ClientTestimonialsSection />
        </section>
      )}

      {/* ==================== FOOTER LEAD CAPTURE ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FooterLeadCapture />
      </section>

    </div>
  );
};
