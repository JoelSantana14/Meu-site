import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SidebarCrm } from './components/SidebarCrm';
import { VitrinePortal } from './components/VitrinePortal';
import { CrmFunil } from './components/CrmFunil';
import { ImoveisManager } from './components/ImoveisManager';
import { AgendaVisitas } from './components/AgendaVisitas';
import { ComissoesManager } from './components/ComissoesManager';
import { EstatisticasRelatorios } from './components/EstatisticasRelatorios';
import { ChatInterno } from './components/ChatInterno';
import { ConfiguradorHtmlTema } from './components/ConfiguradorHtmlTema';
import { GerenciadorUsuarios } from './components/GerenciadorUsuarios';
import { QuemSomosPage } from './components/QuemSomosPage';
import { IndicesOficiaisPage } from './components/IndicesOficiaisPage';
import { NoticiasMercadoPage } from './components/NoticiasMercadoPage';
import { LoginModal } from './components/LoginModal';
import { InternalGridMenu } from './components/InternalGridMenu';
import { SeoHeadManager } from './components/SeoHeadManager';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import {
  WifiOff,
  Building2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  Home,
  UserCheck,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Smartphone
} from 'lucide-react';

const RestrictedAccessGuard: React.FC<{ onOpenLoginModal: () => void }> = ({ onOpenLoginModal }) => {
  const { setActiveTab } = useApp();

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full">
          Acesso Restrito
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Área Exclusiva de Corretores e Administradores
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          O Painel Interno de Gestão (CRM, Funil de Vendas, Agenda de Visitas, Controle de Comissões, Chat Interno e Relatórios) é restrito à equipe da imobiliária.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onOpenLoginModal}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          <UserCheck className="w-4 h-4" />
          <span>Fazer Login no Sistema</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('portal')}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Voltar ao Site Público</span>
        </button>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const {
    activeTab,
    isOnline,
    siteConfig,
    customHtmlBlocks,
    currentUser,
    isGridMenuModalOpen,
    setIsGridMenuModalOpen
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('imobipro_crm_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleCollapseChanged = () => {
      try {
        setIsSidebarCollapsed(localStorage.getItem('imobipro_crm_sidebar_collapsed') === 'true');
      } catch (e) {}
    };

    const handleToggleMobile = () => {
      setIsMobileSidebarOpen(prev => !prev);
    };

    window.addEventListener('crm_sidebar_collapsed_changed', handleCollapseChanged);
    window.addEventListener('toggle_crm_mobile_sidebar', handleToggleMobile);

    return () => {
      window.removeEventListener('crm_sidebar_collapsed_changed', handleCollapseChanged);
      window.removeEventListener('toggle_crm_mobile_sidebar', handleToggleMobile);
    };
  }, []);

  // Triple-click on footer copyright to open system login
  const [rightsClickCount, setRightsClickCount] = useState(0);
  const [lastRightsClickTime, setLastRightsClickTime] = useState(0);

  const handleRightsClick = () => {
    const now = Date.now();
    if (now - lastRightsClickTime < 1800) {
      const nextCount = rightsClickCount + 1;
      if (nextCount >= 3) {
        setIsLoginModalOpen(true);
        setRightsClickCount(0);
      } else {
        setRightsClickCount(nextCount);
      }
    } else {
      setRightsClickCount(1);
    }
    setLastRightsClickTime(now);
  };

  // List of internal management tabs that require login
  const restrictedTabs = [
    'crm', 'agenda', 'agendamentos', 'comissoes', 'relatorios', 'estatisticas', 'imoveis', 'chat', 'configuracoes', 'usuarios', 'menu_grade'
  ];
  const isRestrictedTab = restrictedTabs.includes(activeTab);

  // Render Custom Full HTML Pages if an active block is set to 'custom_page' and activeTab matches its slug or position
  const activeCustomPage = customHtmlBlocks.find(
    b => b.active && b.position === 'custom_page' && (b.slug === activeTab || b.id === activeTab || `page_${b.slug}` === activeTab)
  );

  const bgClass = siteConfig.backgroundMode === 'pure_white'
    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    : siteConfig.backgroundMode === 'dark' || siteConfig.darkMode
    ? 'bg-slate-950 text-slate-100 dark'
    : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-200 font-sans flex flex-col justify-between`}>
      {/* Dynamic SEO & Meta Tags Manager for Google Ranking */}
      <SeoHeadManager />
      
      {/* Top Offline Warning Banner for PWA Offline Mode */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 text-xs font-black py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Você está em MODO OFFLINE. Todas as alterações serão salvas localmente e sincronizadas quando a conexão retornar.</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar onOpenLoginModal={() => setIsLoginModalOpen(true)} />

      {/* CRM Sidebar (Only in internal restricted area when user is logged in) */}
      {isRestrictedTab && currentUser && (
        <SidebarCrm
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Primary Dynamic Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isRestrictedTab && currentUser
            ? isSidebarCollapsed
              ? 'lg:pl-20'
              : 'lg:pl-72'
            : ''
        }`}
      >
        {/* If restricted tab and user not logged in, block view */}
        {isRestrictedTab && !currentUser ? (
          <RestrictedAccessGuard onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        ) : activeCustomPage ? (
          <div className="max-w-7xl mx-auto p-6">
            <div
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg"
              dangerouslySetInnerHTML={{ __html: activeCustomPage.htmlContent }}
            />
          </div>
        ) : (
          <>
            {(activeTab === 'portal' || activeTab === 'vitrine') && <VitrinePortal />}
            {activeTab === 'quem_somos' && <QuemSomosPage />}
            {activeTab === 'indices_oficiais' && <IndicesOficiaisPage />}
            {activeTab === 'noticias_mercado' && <NoticiasMercadoPage />}
            {activeTab === 'imoveis' && <ImoveisManager />}
            {activeTab === 'crm' && <CrmFunil />}
            {(activeTab === 'agenda' || activeTab === 'agendamentos') && <AgendaVisitas />}
            {activeTab === 'comissoes' && <ComissoesManager />}
            {(activeTab === 'relatorios' || activeTab === 'estatisticas') && <EstatisticasRelatorios />}
            {activeTab === 'chat' && <ChatInterno />}
            {activeTab === 'configuracoes' && <ConfiguradorHtmlTema />}
            {activeTab === 'usuarios' && <GerenciadorUsuarios />}
            {activeTab === 'menu_grade' && (
              <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <InternalGridMenu />
              </div>
            )}
          </>
        )}
      </main>

      {/* Login & Password Recovery Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 py-8 px-4 sm:px-6 lg:px-8 mt-12 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{siteConfig?.companyName || 'Joel Santana - Corretor de Imóveis'}</p>
              {(() => {
                const formatCreci = (val?: string, prefix: string = 'CRECI') => {
                  if (!val || !val.trim()) return null;
                  const clean = val.trim();
                  if (/^creci/i.test(clean)) return clean;
                  return `${prefix}: ${clean}`;
                };

                const creciText = siteConfig?.creciJuridico ? formatCreci(siteConfig.creciJuridico, 'CRECI-J') : 
                                  siteConfig?.creciFisico ? formatCreci(siteConfig.creciFisico, 'CRECI') :
                                  siteConfig?.brokerCreci ? formatCreci(siteConfig.brokerCreci, 'CRECI') : null;
                const addressText = (typeof siteConfig?.address === 'string' && siteConfig.address.trim() !== '') ? siteConfig.address.trim() : null;
                
                if (!creciText && !addressText) return null;
                
                return (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {[creciText, addressText].filter(Boolean).join(' • ')}
                  </p>
                );
              })()}
            </div>
          </div>

          {/* Render Social Links Only If Configured */}
          {(() => {
            const socialLinks = [
              { label: 'Instagram', url: siteConfig?.instagramUrl, icon: <Instagram className="w-3.5 h-3.5" /> },
              { label: 'Facebook', url: siteConfig?.facebookUrl, icon: <Facebook className="w-3.5 h-3.5" /> },
              { label: 'YouTube', url: siteConfig?.youtubeUrl, icon: <Youtube className="w-3.5 h-3.5" /> },
              { label: 'LinkedIn', url: siteConfig?.linkedinUrl, icon: <Linkedin className="w-3.5 h-3.5" /> },
              { label: 'TikTok', url: siteConfig?.tiktokUrl, icon: <Smartphone className="w-3.5 h-3.5" /> },
              { label: 'X / Twitter', url: siteConfig?.twitterUrl, icon: <Twitter className="w-3.5 h-3.5" /> },
            ].filter(s => s.url && s.url.trim() !== '');

            if (socialLinks.length === 0) return null;

            return (
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Redes Sociais:</span>
                {socialLinks.map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.url!.startsWith('http') ? soc.url : `https://${soc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    title={`Acessar ${soc.label}`}
                  >
                    {soc.icon}
                    <span>{soc.label}</span>
                  </a>
                ))}
              </div>
            );
          })()}

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold">
            {siteConfig?.phone || siteConfig?.brokerPhone ? (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-500" /> {siteConfig.phone || siteConfig.brokerPhone}
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Sistema Seguro PWA
            </span>
            <span
              onClick={handleRightsClick}
              className="cursor-default select-none"
              title=""
            >
              © {new Date().getFullYear()} {siteConfig?.companyName || 'Joel Santana'}. Todos os direitos reservados.
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for WhatsApp */}
      <FloatingWhatsApp />

      {/* Global Modern Grid Menu Modal */}
      {isGridMenuModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full my-auto max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative">
            <InternalGridMenu isModal onClose={() => setIsGridMenuModalOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
