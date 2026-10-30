import React from 'react';
import { Star, Quote, CheckCircle2, User } from 'lucide-react';
import { Testimonial } from '../types';

interface ClientTestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const ClientTestimonialsSection: React.FC<ClientTestimonialsSectionProps> = ({ testimonials = [] }) => {
  const activeTestimonials = testimonials.filter(t => t.active !== false);

  if (activeTestimonials.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-sm font-semibold shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Depoimentos de Clientes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Histórias de Sucesso e Confiança
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Veja o que dizem proprietários, compradores e investidores que confiaram em nosso trabalho para realizar grandes negócios imobiliários.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-6 right-6 text-indigo-100 dark:text-indigo-900/40 group-hover:text-indigo-200 dark:group-hover:text-indigo-900/70 transition-colors">
                <Quote className="w-10 h-10" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.rating}.0
                  </span>
                </div>

                {/* Comment */}
                <p className="text-slate-700 dark:text-slate-200 text-base italic leading-relaxed">
                  "{t.comment}"
                </p>

                {t.propertyTitle && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.propertyTitle}</span>
                  </div>
                )}
              </div>

              {/* Client Profile */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-950 flex-shrink-0 border-2 border-indigo-500/30 shadow-md">
                  {t.clientAvatar ? (
                    <img
                      src={t.clientAvatar}
                      alt={t.clientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {t.clientName}
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {t.clientRole || 'Cliente Satisfeito'}
                  </p>
                  {t.date && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Avaliado em {t.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
