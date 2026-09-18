import React from 'react';
import { SiteConfig } from '../types';

interface WatermarkOverlayProps {
  siteConfig?: Partial<SiteConfig>;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({ siteConfig }) => {
  if (!siteConfig?.enableWatermark) return null;

  const watermarkSrc = siteConfig.watermarkUrl || siteConfig.logoUrl;
  const opacity = (siteConfig.watermarkOpacity ?? 35) / 100;
  const position = siteConfig.watermarkPosition || 'center';
  const size = siteConfig.watermarkSize || 'medium';

  // Size classes
  const sizeClass =
    size === 'small'
      ? 'max-w-[25%] max-h-[25%]'
      : size === 'large'
      ? 'max-w-[65%] max-h-[65%]'
      : 'max-w-[42%] max-h-[42%]';

  // If pattern repeat mode
  if (position === 'repeat') {
    return (
      <div
        className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden flex flex-wrap items-center justify-around gap-6 p-4"
        style={{ opacity }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="transform -rotate-12 flex items-center justify-center shrink-0">
            {watermarkSrc ? (
              <img
                src={watermarkSrc}
                alt="Marca d'água"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow"
              />
            ) : (
              <span className="text-white font-black text-xs sm:text-sm uppercase tracking-widest bg-black/40 px-2 py-1 rounded backdrop-blur-xs">
                {siteConfig.companyName || siteConfig.brokerName || 'Joel Santana'}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Positioning classes
  let posClass = 'inset-0 flex items-center justify-center';
  if (position === 'bottom-right') {
    posClass = 'absolute bottom-8 right-3 flex items-end justify-end';
  } else if (position === 'top-right') {
    posClass = 'absolute top-12 right-3 flex items-start justify-end';
  } else if (position === 'bottom-left') {
    posClass = 'absolute bottom-8 left-3 flex items-end justify-start';
  }

  return (
    <div className={`absolute pointer-events-none select-none z-10 p-2 ${posClass}`} style={{ opacity }}>
      {watermarkSrc ? (
        <img
          src={watermarkSrc}
          alt="Marca d'água"
          className={`${sizeClass} w-auto h-auto object-contain filter drop-shadow-md`}
        />
      ) : (
        <div className="bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20">
          <span className="text-white font-black text-xs sm:text-sm uppercase tracking-widest drop-shadow">
            {siteConfig?.companyName || siteConfig?.brokerName || 'Joel Santana'}
          </span>
        </div>
      )}
    </div>
  );
};
