import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { InternalGridMenu } from './InternalGridMenu';
import {
  Building2,
  Users,
  Home,
  Calendar,
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  Globe,
  Bell,
  Wifi,
  WifiOff,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Lock,
  LayoutDashboard,
  LayoutGrid,
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenLoginModal: () => void }> = ({ onOpenLoginModal }) => {
  const {
    siteConfig,
    activeTab,
    setActiveTab,
    currentUser,
    users,
    loginAsUser,
    logout,
    toggleDarkMode,
    setLanguage,
    notifications,
    markAllNotificationsRead,
    fcmPermissionStatus,
    fcmToken,
    enablePushNotifications,
    sendTestPushNotification,
    isOnline,
    customHtmlBlocks,
    t,
    siteStats,
    isGridMenuModalOpen,
    setIsGridMenuModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('imobipro_crm_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleCollapseChanged = () => {
      try {
        setIsSidebarCollapsed(localStorage.getItem('imobipro_crm_sidebar_collapsed') === 'true');
      } catch (e) {}
    };
    window.addEventListener('crm_sidebar_collapsed_changed', handleCollapseChanged);
    return () => window.removeEventListener('crm_sidebar_collapsed_changed', handleCollapseChanged);
  }, []);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const isAdmin = currentUser?.role === 'admin' || currentUser?.isMasterAdmin;

  // List of internal management tabs
  const internalTabIds = ['crm', 'agenda', 'agendamentos', 'comissoes', 'relatorios', 'estatisticas', 'imoveis', 'chat', 'configuracoes', 'usuarios'];
  
  // Is the current view an internal restricted management view?
  const isRestrictedArea = internalTabIds.includes(activeTab);

  // Internal Restricted Area Nav Items
  const internalNavItems = [
    { id: 'relatorios', label: t('dashboardNav'), icon: BarChart3 },
    { id: 'crm', label: t('crmNav'), icon: Users, badge: 'Kanban' },
    { id: 'agenda', label: t('agendaNav'), icon: Calendar },
    { id: 'imoveis', label: t('propertiesNav'), icon: Building2 },
    ...(isAdmin ? [{ id: 'comissoes', label: t('commissionsNav'), icon: DollarSign }] : []),
    { id: 'chat', label: t('chatNav'), icon: MessageSquare },
    ...(isAdmin ? [{ id: 'usuarios', label: 'Usuários', icon: ShieldCheck }] : []),
    ...(isAdmin ? [{ id: 'configuracoes', label: t('settingsNav'), icon: Settings }] : [])
  ];

  // Custom pages from HTML Blocks (for Public Website)
  const customPages = customHtmlBlocks.filter(b => b.position === 'custom_page' && b.active && b.slug);

  const handleAccessRestrictedArea = () => {
    if (!currentUser) {
      onOpenLoginModal();
    } else {
      setActiveTab('relatorios');
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-md shadow-slate-900/5 dark:shadow-black/30 border-b border-slate-200/80 dark:border-slate-800/80'
        : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
    } ${
      isRestrictedArea && currentUser
        ? isSidebarCollapsed
          ? 'lg:pl-20'
          : 'lg:pl-72'
        : ''
    }`}>
      


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between min-h-[4.5rem] py-2 gap-4 ${siteConfig.logoPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('portal')}>
            {siteConfig.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt={siteConfig.logoText || siteConfig.companyName || 'Logo'}
                className={`w-auto object-contain rounded-lg transition-all ${
                  siteConfig.logoSize === 'sm' ? 'h-8 sm:h-10 max-w-[180px]' :
                  siteConfig.logoSize === 'md' ? 'h-10 sm:h-12 max-w-[240px]' :
                  siteConfig.logoSize === 'xl' ? 'h-18 sm:h-20 max-w-[400px]' :
                  siteConfig.logoSize === '2xl' ? 'h-24 sm:h-28 max-w-[480px]' :
                  'h-14 sm:h-16 max-w-[320px]' /* 'lg' default - enlarged logo */
                }`}
              />
            ) : (
              <div
                className={`rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-transform hover:scale-105 shrink-0 ${
                  siteConfig.logoSize === 'sm' ? 'w-8 h-8 text-base' :
                  siteConfig.logoSize === 'md' ? 'w-10 h-10 text-lg' :
                  siteConfig.logoSize === 'xl' ? 'w-16 h-16 text-2xl' :
                  siteConfig.logoSize === '2xl' ? 'w-20 h-20 text-3xl' :
                  'w-12 h-12 text-xl' /* 'lg' default */
                }`}
                style={{ backgroundColor: siteConfig.primaryColorHex }}
              >
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                {siteConfig.logoText || siteConfig.brokerName || siteConfig.companyName || 'Joel Santana'}
                {isRestrictedArea ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black uppercase tracking-wider shrink-0">
                    {t('panelRestricted')}
                  </span>
                ) : (
                  (siteConfig.brokerCreci || siteConfig.creciJuridico) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold uppercase tracking-wider shrink-0">
                      {siteConfig.brokerCreci || siteConfig.creciJuridico}
                    </span>
                  )
                )}
              </span>
              {siteConfig.companyName && siteConfig.companyName !== siteConfig.logoText && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5 font-medium truncate">
                  {siteConfig.companyName}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            
            {/* PUBLIC WEBSITE MODE NAV */}
            {!isRestrictedArea && (
              <>
                <button
                  onClick={() => setActiveTab('portal')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    activeTab === 'portal' || activeTab === 'vitrine'
                      ? 'text-white shadow-sm font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                  style={activeTab === 'portal' || activeTab === 'vitrine' ? { backgroundColor: siteConfig.primaryColorHex } : {}}
                >
                  <Home className="w-4 h-4" />
                  <span>{t('homeNav')}</span>
                </button>

                {/* Public Secondary Pages (Quem Somos, Índices, Notícias, Custom Pages) */}
                {siteConfig.showQuemSomosPage !== false && (
                  <button
                    onClick={() => setActiveTab('quem_somos')}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      activeTab === 'quem_somos'
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    🏢 Quem Somos
                  </button>
                )}

                {siteConfig.showIndicesPage !== false && (
                  <button
                    onClick={() => setActiveTab('indices_oficiais')}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      activeTab === 'indices_oficiais'
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    📊 Índices Oficiais
                  </button>
                )}

                {siteConfig.showNoticiasPage !== false && (
                  <button
                    onClick={() => setActiveTab('noticias_mercado')}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      activeTab === 'noticias_mercado'
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    📰 Notícias
                  </button>
                )}

                {customPages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActiveTab(`page_${page.slug}`)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      activeTab === `page_${page.slug}`
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    📄 {page.title}
                  </button>
                ))}

                {/* WhatsApp Direct Action Button with Subtle Shimmer / Glow */}
                <a
                  href={`https://wa.me/55${(siteConfig.brokerWhatsapp || siteConfig.brokerPhone || '17991951473').replace(/\D/g, '')}?text=${encodeURIComponent('Olá Joel Santana, vim pelo site e gostaria de atendimento sobre imóveis.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:text-white text-xs font-bold transition-all duration-300 border border-emerald-300/60 dark:border-emerald-700/60 hover:border-emerald-600 shadow-xs hover:shadow-md hover:shadow-emerald-600/20 hover:scale-[1.03] active:scale-[0.98] group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
                  <span>WhatsApp</span>
                </a>
              </>
            )}

            {/* RESTRICTED INTERNAL PANEL NAV */}
            {isRestrictedArea && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.dispatchEvent(new Event('toggle_crm_mobile_sidebar'))}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-sm"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Menu CRM</span>
                </button>

                <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                  <span>Painel CRM • Navegação no Menu Lateral</span>
                </div>

                <button
                  onClick={() => setIsGridMenuModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-400/30 transition-all shadow-xs"
                  title="Abrir Menu em Grade dos Módulos"
                >
                  <LayoutGrid className="w-4 h-4 text-amber-500" />
                  <span>Grade</span>
                </button>

                {/* Back to Public Site */}
                <button
                  onClick={() => setActiveTab('portal')}
                  className="ml-2 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
                >
                  <Home className="w-3.5 h-3.5 text-amber-500" />
                  <span>Site Público</span>
                </button>
              </div>
            )}

          </nav>

          {/* Right Controls: Online status, Language, Dark Mode, Notifications, User Profile */}
          <div className="flex items-center space-x-2">
            
            {/* Connection Badge */}
            <div
              title={isOnline ? 'Conectado à internet' : 'Modo Offline - Dados salvos localmente'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{siteConfig.language}</span>
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                  <button
                    onClick={() => { setLanguage('pt'); setIsLangDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>Português</span>
                    {siteConfig.language === 'pt' && '✓'}
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>English</span>
                    {siteConfig.language === 'en' && '✓'}
                  </button>
                  <button
                    onClick={() => { setLanguage('es'); setIsLangDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>Español</span>
                    {siteConfig.language === 'es' && '✓'}
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Alternar Modo Escuro"
            >
              {siteConfig.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Notifications Bell (Only show inside restricted CRM area) */}
            {isRestrictedArea && currentUser && (currentUser.role === 'corretor' || currentUser.role === 'admin') && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {isNotifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Notificações Push</span>
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                          Marcar lidas
                        </button>
                      )}
                    </div>

                    {/* FCM Push Notification Bar */}
                    <div className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-200">
                        <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="font-medium text-[11px]">Push FCM:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            const res = await enablePushNotifications();
                            alert(res.message);
                          }}
                          className={`px-2 py-0.5 font-bold text-[10px] rounded-lg transition-all ${
                            fcmPermissionStatus === 'granted'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                          }`}
                        >
                          {fcmPermissionStatus === 'granted' ? 'Ativo 🔔' : 'Ativar Push FCM'}
                        </button>
                        {fcmPermissionStatus === 'granted' && (
                          <button
                            onClick={sendTestPushNotification}
                            className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition-all"
                            title="Testar Notificação Push no Navegador"
                          >
                            Testar
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-slate-500 text-center">Nenhuma notificação no momento.</p>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              if (notif.linkTab) setActiveTab(notif.linkTab);
                              setIsNotifDropdownOpen(false);
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                              !notif.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 dark:text-white">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">{notif.body}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Session Menu (Visible ONLY when a user is actively authenticated/logged in) */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Menu do Usuário"
                >
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>

                {/* User Selector Dropdown */}
                {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2.5 z-50">
                  <div className="p-3 bg-indigo-50/70 dark:bg-slate-900 rounded-xl mb-2 border border-indigo-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                    <span className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-semibold">
                      {currentUser.role === 'admin' ? 'Gerente / Administrador' : 'Corretor Ativo'}
                    </span>
                  </div>

                  {/* Direct Shortcuts */}
                  <div className="space-y-1 mb-2">
                    <button
                      onClick={() => {
                        setIsGridMenuModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl flex items-center justify-between transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-amber-300" />
                        <span>Menu em Grade (Módulos)</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('configuracoes');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Settings className="w-4 h-4 text-indigo-500" />
                      <span>Configurações do Sistema</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('imoveis');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span>Cadastrar & Gerenciar Imóveis</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('crm');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>Cadastrar Clientes (CRM)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('relatorios');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                      <span>Painel de Desempenho</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
                    <button
                      onClick={() => {
                        logout();
                        setActiveTab('portal');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto shadow-2xl rounded-b-3xl animate-in fade-in slide-in-from-top-2 duration-200">
          
          <button
            onClick={() => {
              setActiveTab('portal');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold ${
              !isRestrictedArea ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>🌐 Início / Catálogo de Imóveis</span>
          </button>

          {/* Public Secondary Pages Links */}
          {siteConfig.showQuemSomosPage !== false && (
            <button
              onClick={() => {
                setActiveTab('quem_somos');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>🏢 Quem Somos</span>
            </button>
          )}

          {/* Índices Link */}
          {siteConfig.showIndicesPage !== false && (
            <button
              onClick={() => {
                setActiveTab('indices_oficiais');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>📊 Índices Oficiais</span>
            </button>
          )}

          {/* Notícias Link */}
          {siteConfig.showNoticiasPage !== false && (
            <button
              onClick={() => {
                setActiveTab('noticias_mercado');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>📰 Notícias do Mercado</span>
            </button>
          )}

          {/* Custom pages */}
          {customPages.map(page => (
            <button
              key={page.id}
              onClick={() => {
                setActiveTab(`page_${page.slug}`);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>📄 {page.title}</span>
            </button>
          ))}

          {/* Internal Panel Links - ONLY visible if currentUser is logged in */}
          {currentUser && (
            <>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Painel do Corretor / Gestão
              </div>

              {internalNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  setActiveTab('portal');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="w-5 h-5" />
                <span>Desconectar / Sair</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Fixed Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-around py-2 px-1 shadow-lg">
        {currentUser ? (
          <>
            <button
              onClick={() => setActiveTab('portal')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold ${
                activeTab === 'portal' || activeTab === 'vitrine' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span>Site</span>
            </button>

            <button
              onClick={() => setActiveTab('relatorios')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold ${
                activeTab === 'relatorios' || activeTab === 'estatisticas' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <BarChart3 className="w-5 h-5 mb-0.5" />
              <span>Painel</span>
            </button>

            <button
              onClick={() => setActiveTab('imoveis')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold ${
                activeTab === 'imoveis' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>Imóveis</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold ${
                activeTab === 'crm' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span>CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold ${
                activeTab === 'configuracoes' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Settings className="w-5 h-5 mb-0.5" />
              <span>Config</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setActiveTab('portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold ${
                activeTab === 'portal' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span>Início</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('portal');
                const target = document.getElementById('imoveis-list');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400"
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>Imóveis</span>
            </button>

            {siteConfig.showQuemSomosPage !== false && (
              <button
                onClick={() => setActiveTab('quem_somos')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold ${
                  activeTab === 'quem_somos' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Users className="w-5 h-5 mb-0.5" />
                <span>Quem Somos</span>
              </button>
            )}

            <a
              href={`https://wa.me/${(() => {
                const raw = (siteConfig?.whatsapp || siteConfig?.brokerWhatsapp || '5511987654321').replace(/\D/g, '');
                return raw.startsWith('55') ? raw : `55${raw}`;
              })()}?text=Olá!%20Gostaria%20de%20atendimento%20sobre%20os%20imóveis.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
            >
              <MessageCircle className="w-5 h-5 mb-0.5" />
              <span>WhatsApp</span>
            </a>
          </>
        )}
      </div>
    </header>
  );
};
