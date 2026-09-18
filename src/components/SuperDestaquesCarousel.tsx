import React, { useState, useEffect } from 'react';
import { Property, User } from '../types';
import { useApp } from '../context/AppContext';
import { WatermarkOverlay } from './WatermarkOverlay';
import { getPropertyTypeLabel } from '../utils/propertyHelpers';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize2,
  Car,
  MapPin,
  Calendar,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Heart,
  Image as ImageIcon
} from 'lucide-react';

interface SuperDestaquesCarouselProps {
  properties: Property[];
  users: User[];
  showBrokerPhoto: boolean;
  onSelectProperty: (property: Property) => void;
  onOpenVisitModal: (property: Property) => void;
  t: (key: any) => string;
  isLoading?: boolean;
}

export const SuperDestaquesCarousel: React.FC<SuperDestaquesCarouselProps> = ({
  properties,
  users,
  showBrokerPhoto,
  onSelectProperty,
  onOpenVisitModal,
  t,
  isLoading
}) => {
  const { siteConfig } = useApp();
  const launchTitleLower = (siteConfig.exclusiveLaunch?.title || '').toLowerCase().trim();
  const isExclusiveActive = siteConfig.exclusiveLaunch?.enabled !== false;

  // Filter properties explicitly marked as super_destaque, excluding any matching exclusive launch
  const displayList = properties.filter(p => {
    if (p.highlight !== 'super_destaque') return false;
    if (isExclusiveActive && launchTitleLower && p.title.toLowerCase().includes(launchTitleLower)) {
      return false; // Already presented in VIP launch
    }
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = sessionStorage.getItem('last_super_destaque_idx');
      const next = saved !== null ? (parseInt(saved, 10) + 1) : Math.floor(Math.random() * 10);
      return next;
    } catch {
      return 0;
    }
  });
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Safe index within valid bounds
  const safeCurrentIndex = displayList.length > 0 ? (currentIndex % displayList.length + displayList.length) % displayList.length : 0;

  useEffect(() => {
    try {
      sessionStorage.setItem('last_super_destaque_idx', String(safeCurrentIndex));
    } catch {
      // ignore
    }
  }, [safeCurrentIndex]);

  useEffect(() => {
    if (isLoading || !isAutoPlay || displayList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayList.length);
      setSelectedPhotoIndex(0);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLoading, displayList.length, isAutoPlay]);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            <div className="lg:col-span-7 bg-slate-200 dark:bg-slate-800 h-80 lg:h-full relative flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 opacity-40 animate-spin" />
            </div>
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="grid grid-cols-4 gap-2 py-4 border-y border-slate-200 dark:border-slate-800">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (displayList.length === 0) return null;

  const currentProperty = displayList[safeCurrentIndex];
  if (!currentProperty) return null;

  const agent = users.find(u => u.id === currentProperty.agentId) || users[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % displayList.length);
    setSelectedPhotoIndex(0);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + displayList.length) % displayList.length);
    setSelectedPhotoIndex(0);
  };

  const propImages = Array.isArray(currentProperty.images) && currentProperty.images.length > 0
    ? currentProperty.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80'];

  const currentImage = propImages[selectedPhotoIndex] || propImages[0];

  const addressText = typeof currentProperty.address === 'string'
    ? currentProperty.address
    : currentProperty.address
      ? [currentProperty.address.street, currentProperty.address.neighborhood, currentProperty.address.city ? `${currentProperty.address.city}/${currentProperty.address.state || 'SP'}` : ''].filter(Boolean).join(', ')
      : 'São Paulo - SP';

  return (
    <section 
      id="super-destaques-topo" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2 w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Seleção Exclusiva de Imóveis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <span>Imóveis em Destaque</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold">
              {safeCurrentIndex + 1} de {displayList.length}
            </span>
          </h2>
        </div>

        {/* Carousel Navigation Buttons & Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            {displayList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setSelectedPhotoIndex(0);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  safeCurrentIndex === idx
                    ? 'w-8 bg-indigo-600'
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Ir para destaque ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-95"
              title="Destaque anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
              title="Próximo destaque"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Showcase Card - Proportional & Balanced Layout */}
      <div
        style={siteConfig.enableCustomContours && siteConfig.contourColor ? { borderColor: siteConfig.contourColor, borderWidth: '1.5px' } : undefined}
        className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 transition-all w-full ${
          siteConfig.enableCustomContours ? 'theme-contour' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        
        {/* Left: Balanced Proportional Image Container (6 Cols) */}
        <div className="lg:col-span-6 relative h-64 sm:h-72 lg:h-[340px] bg-slate-900 overflow-hidden flex flex-col justify-between group">
          
          {/* Main Property Photo */}
          <img
            src={currentImage}
            alt={currentProperty.title}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash.com')) {
                target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80';
              }
            }}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
          <WatermarkOverlay siteConfig={siteConfig} />

          {/* Top Overlay Badges */}
          <div className="relative z-10 p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                {currentProperty.purpose === 'venda' ? 'À Venda' : 'Aluguel'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium uppercase tracking-wider border border-white/10">
                {getPropertyTypeLabel(currentProperty.type)}
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/10">
              {currentProperty.code}
            </div>
          </div>

          {/* Bottom Location Overlay & Thumbnails Strip */}
          <div className="relative z-10 p-4 space-y-2">
            <div className="flex items-center justify-between text-white text-xs font-semibold gap-2">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{addressText}</span>
              </span>

              {/* Photo Caption Pill */}
              {(() => {
                const currentImgUrl = propImages[selectedPhotoIndex] || propImages[0];
                const caption = currentProperty.imageDescriptions?.[currentImgUrl] || currentProperty.imageDescriptions?.[String(selectedPhotoIndex)];
                if (!caption) return null;
                return (
                  <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[11px] text-slate-200 border border-white/10 flex items-center gap-1 truncate max-w-[200px]">
                    <ImageIcon className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">{caption}</span>
                  </span>
                );
              })()}
            </div>

            {/* Photo Thumbnails */}
            {propImages.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
                {propImages.map((imgUrl, imgIdx) => (
                  <button
                    key={imgIdx}
                    onClick={() => setSelectedPhotoIndex(imgIdx)}
                    className={`w-11 h-8 rounded-lg overflow-hidden border transition-all shrink-0 ${
                      selectedPhotoIndex === imgIdx
                        ? 'border-white ring-2 ring-indigo-500 scale-105 shadow-sm'
                        : 'border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Foto ${imgIdx + 1}`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('unsplash.com')) {
                          target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80';
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Essential Property Information (6 Cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            
            {/* Price Badge */}
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                Valor
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  R$ {currentProperty.price.toLocaleString('pt-BR')}
                </span>
                {currentProperty.purpose === 'aluguel' && (
                  <span className="text-xs font-semibold text-slate-500">/mês</span>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 
                onClick={() => onSelectProperty(currentProperty)}
                className="text-base sm:text-xl font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors leading-snug line-clamp-2"
              >
                {currentProperty.title}
              </h3>
            </div>

            {/* Essential Specs Grid */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-bold text-center">
              <div className="space-y-0.5">
                <Bed className="w-3.5 h-3.5 mx-auto text-indigo-600 dark:text-indigo-400" />
                <span className="block font-black text-xs">{currentProperty.bedrooms}</span>
                <span className="text-[9px] text-slate-400 font-medium">Quartos</span>
              </div>
              <div className="space-y-0.5">
                <Bath className="w-3.5 h-3.5 mx-auto text-indigo-600 dark:text-indigo-400" />
                <span className="block font-black text-xs">{currentProperty.bathrooms}</span>
                <span className="text-[9px] text-slate-400 font-medium">Banheiros</span>
              </div>
              <div className="space-y-0.5">
                <Car className="w-3.5 h-3.5 mx-auto text-indigo-600 dark:text-indigo-400" />
                <span className="block font-black text-xs">{currentProperty.parkingSpaces}</span>
                <span className="text-[9px] text-slate-400 font-medium">Vagas</span>
              </div>
              <div className="space-y-0.5">
                <Maximize2 className="w-3.5 h-3.5 mx-auto text-indigo-600 dark:text-indigo-400" />
                <span className="block font-black text-xs">{currentProperty.areaSqM}m²</span>
                <span className="text-[9px] text-slate-400 font-medium">Área</span>
              </div>
            </div>

            {/* Features Tags (Max 3) */}
            {currentProperty.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentProperty.features.slice(0, 3).map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1 border border-slate-200/80 dark:border-slate-700"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* Direct Clean Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => onSelectProperty(currentProperty)}
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver Anúncio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenVisitModal(currentProperty)}
              className="py-3 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Agendar Visita</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mini Thumbnails Strip of All Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {displayList.map((prop, idx) => (
          <div
            key={prop.id}
            onClick={() => {
              setCurrentIndex(idx);
              setSelectedPhotoIndex(0);
            }}
            className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white dark:bg-slate-900 ${
              currentIndex === idx
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 opacity-80'
            }`}
          >
            <img
              src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80'}
              alt={prop.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                {prop.code}
              </span>
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {prop.title}
              </p>
              <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400">
                R$ {prop.price.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
