import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { siteConfig, activeTab } = useApp();
  const [showTooltip, setShowTooltip] = useState(true);

  // Only show on public views (portal, quem_somos, etc.), never inside internal CRM
  const restrictedTabs = ['crm', 'agenda', 'agendamentos', 'comissoes', 'relatorios', 'estatisticas', 'imoveis', 'chat', 'configuracoes', 'usuarios'];
  if (restrictedTabs.includes(activeTab)) {
    return null;
  }

  const rawPhone = (siteConfig.whatsapp || siteConfig.brokerWhatsapp || siteConfig.brokerPhone || '5517991951473').replace(/\D/g, '');
  const cleanPhone = rawPhone.startsWith('55') ? rawPhone : `55${rawPhone}`;
  const brokerName = siteConfig.brokerName || siteConfig.logoText || 'Joel Santana';
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá ${brokerName}, vi o site e gostaria de atendimento sobre imóveis.`)}`;

  return (
    <div className="fixed bottom-20 lg:bottom-7 right-5 z-40 flex items-center gap-3 select-none">
      {/* Sleek Tooltip Popover */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-right-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Atendimento online via WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 p-0.5"
            aria-label="Fechar dica"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Conversar no WhatsApp com ${brokerName}`}
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/50 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Subtle breathing pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-pulse-ring pointer-events-none -z-10" />

        <MessageCircle className="w-7 h-7 fill-white text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
      </a>
    </div>
  );
};
