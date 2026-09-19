import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Tag
} from 'lucide-react';
import { Property, SiteConfig } from '../types';
import { WatermarkOverlay } from './WatermarkOverlay';

interface PropertyGalleryProps {
  property: Property;
  siteConfig?: Partial<SiteConfig>;
  initialIndex?: number;
  className?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80';

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  property,
  siteConfig,
  initialIndex = 0,
  className = ''
}) => {
  const images = property.images && property.images.length > 0
    ? property.images
    : [FALLBACK_IMAGE];

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showThumbnailsInFullscreen, setShowThumbnailsInFullscreen] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const fullscreenThumbnailsRef = useRef<HTMLDivElement>(null);

  // Safely wrap navigation
  const nextImage = useCallback(() => {
    setDirection(1);
    setIsZoomed(false);
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setIsZoomed(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setIsZoomed(false);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, nextImage, prevImage]);

  // Lock body scroll when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Auto-scroll thumbnail container to keep active thumbnail visible
  useEffect(() => {
    const activeEl = thumbnailsRef.current?.children[currentIndex] as HTMLElement | undefined;
    if (activeEl && thumbnailsRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const activeFsEl = fullscreenThumbnailsRef.current?.children[currentIndex] as HTMLElement | undefined;
    if (activeFsEl && fullscreenThumbnailsRef.current) {
      activeFsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // Pre-load neighboring images for smooth transitions
  useEffect(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    const imgNext = new Image();
    imgNext.src = images[nextIdx];
    const imgPrev = new Image();
    imgPrev.src = images[prevIdx];
  }, [currentIndex, images]);

  // Touch handlers for mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // px
    if (diff > minSwipeDistance) {
      nextImage(); // Swiped left -> next
    } else if (diff < -minSwipeDistance) {
      prevImage(); // Swiped right -> prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentImgUrl = images[currentIndex] || images[0];
  const caption =
    property.imageDescriptions?.[currentImgUrl] ||
    property.imageDescriptions?.[String(currentIndex)] ||
    '';

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
      scale: 0.98
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 380, damping: 32 },
        opacity: { duration: 0.22 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 380, damping: 32 },
        opacity: { duration: 0.18 }
      }
    })
  };

  return (
    <div className={`space-y-3 select-none ${className}`}>
      {/* Main Interactive Stage */}
      <div
        className="relative aspect-[16/9] sm:aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 group/img shadow-xl border border-slate-200 dark:border-slate-800"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            src={currentImgUrl}
            alt={`${property.title} - Foto ${currentIndex + 1}`}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash.com')) {
                target.src = FALLBACK_IMAGE;
              }
            }}
            className="w-full h-full object-cover select-none cursor-pointer"
            onClick={() => setIsFullscreen(true)}
            title="Clique para expandir em tela cheia"
          />
        </AnimatePresence>

        {/* Watermark Overlay */}
        <WatermarkOverlay siteConfig={siteConfig} />

        {/* Top Badges: Tarja & Code */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
          {property.tarja && (
            <span
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg flex items-center gap-1.5 backdrop-blur-md"
              style={{
                backgroundColor: property.tarjaCustomColor || '#4f46e5'
              }}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{property.tarja}</span>
            </span>
          )}
        </div>

        {/* Fullscreen Trigger Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(true);
            }}
            className="bg-black/60 hover:bg-black/90 active:scale-95 text-white p-2.5 rounded-xl backdrop-blur-md transition-all shadow-lg border border-white/20 hover:border-white/40 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Abrir em Tela Cheia (F)"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Tela Cheia</span>
          </button>
        </div>

        {/* Navigation Arrows (Prev / Next) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 active:scale-95 text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-xl border border-white/20 hover:border-white/50 opacity-90 sm:opacity-0 group-hover/img:opacity-100 cursor-pointer"
              title="Foto Anterior (←)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 active:scale-95 text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-xl border border-white/20 hover:border-white/50 opacity-90 sm:opacity-0 group-hover/img:opacity-100 cursor-pointer"
              title="Próxima Foto (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Photo Counter Pill */}
            <div className="absolute bottom-3 right-3 z-10 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono font-bold shadow-md border border-white/10 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Caption / Description Display */}
      {caption ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium shadow-xs">
          <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <span className="leading-snug">{caption}</span>
        </div>
      ) : null}

      {/* Scrollable Thumbnails Strip */}
      {images.length > 1 && (
        <div className="relative group/strip">
          <div
            ref={thumbnailsRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scroll-smooth snap-x"
          >
            {images.map((img, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToImage(i)}
                  className={`relative shrink-0 w-20 sm:w-24 md:w-28 aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border-2 transition-all cursor-pointer snap-center ${
                    isActive
                      ? 'border-indigo-600 ring-2 ring-indigo-500/50 scale-102 shadow-md opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                  }`}
                  title={`Foto ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${i + 1}`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('unsplash.com')) {
                        target.src = FALLBACK_IMAGE;
                      }
                    }}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                  {isActive && (
                    <span className="absolute bottom-1 right-1 bg-indigo-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                      {i + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FULLSCREEN LIGHTBOX MODAL                                 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Fullscreen Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-20">
              <div className="flex items-center gap-3">
                <span className="text-white/80 font-mono text-xs font-bold px-2 py-1 rounded bg-white/10 border border-white/10">
                  {property.code}
                </span>
                <span className="text-white font-bold text-sm sm:text-base line-clamp-1 max-w-xs sm:max-w-md">
                  {property.title}
                </span>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/10 cursor-pointer"
                  title={isZoomed ? 'Reduzir Zoom' : 'Ampliar Imagem'}
                >
                  {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowThumbnailsInFullscreen(!showThumbnailsInFullscreen)}
                  className={`p-2.5 rounded-xl transition-all border border-white/10 cursor-pointer ${
                    showThumbnailsInFullscreen
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={showThumbnailsInFullscreen ? 'Ocultar Miniaturas' : 'Exibir Miniaturas'}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreen(false);
                    setIsZoomed(false);
                  }}
                  className="p-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 active:scale-95 text-white transition-all shadow-lg cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Fechar Tela Cheia (ESC)"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline">Fechar (ESC)</span>
                </button>
              </div>
            </div>

            {/* Center Stage: Huge Photo */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ${
                    isZoomed ? 'scale-125 sm:scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={currentImgUrl}
                    alt={`${property.title} - Foto ${currentIndex + 1}`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('unsplash.com')) {
                        target.src = FALLBACK_IMAGE;
                      }
                    }}
                    className="max-w-[95vw] max-h-[75vh] object-contain rounded-xl shadow-2xl select-none"
                  />
                  <WatermarkOverlay siteConfig={siteConfig} />
                </motion.div>
              </AnimatePresence>

              {/* Left/Right Floating Arrows in Fullscreen */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/70 hover:bg-black active:scale-95 text-white transition-all shadow-2xl border border-white/20 cursor-pointer"
                    title="Foto Anterior (Seta Esquerda)"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/70 hover:bg-black active:scale-95 text-white transition-all shadow-2xl border border-white/20 cursor-pointer"
                    title="Próxima Foto (Seta Direita)"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Section: Caption, Counter & Fullscreen Thumbnails */}
            <div className="bg-gradient-to-t from-black/90 via-black/80 to-transparent p-4 sm:p-6 space-y-3 z-20">
              {/* Caption in Fullscreen */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl mx-auto">
                {caption ? (
                  <p className="text-white/90 text-xs sm:text-sm text-center sm:text-left font-medium bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    {caption}
                  </p>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 text-white/70 text-xs font-mono">
                  <span>
                    Foto <strong className="text-white">{currentIndex + 1}</strong> de{' '}
                    <strong className="text-white">{images.length}</strong>
                  </span>
                  <span className="hidden md:inline text-white/40">• Use ← e → para navegar</span>
                </div>
              </div>

              {/* Fullscreen Thumbnail Strip */}
              {showThumbnailsInFullscreen && images.length > 1 && (
                <div
                  ref={fullscreenThumbnailsRef}
                  className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-5xl mx-auto scrollbar-thin scrollbar-thumb-white/20 scroll-smooth snap-x"
                >
                  {images.map((img, i) => {
                    const isActive = i === currentIndex;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goToImage(i)}
                        className={`relative shrink-0 w-16 sm:w-20 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer snap-center ${
                          isActive
                            ? 'border-indigo-400 ring-2 ring-indigo-500/50 scale-105 opacity-100'
                            : 'border-transparent opacity-50 hover:opacity-90'
                        }`}
                        title={`Ir para foto ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`Miniatura ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
