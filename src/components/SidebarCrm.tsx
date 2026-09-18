import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserPlus,
  Briefcase,
  FileText,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  PlusCircle,
  FolderOpen,
  MessageSquare,
  Sparkles,
  FileCheck2,
  History,
  Lock,
  UserCheck,
  FileSpreadsheet,
  X,
  Sliders,
  Maximize2,
  LayoutGrid
} from 'lucide-react';

interface SidebarCrmProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  tab: string;
  badge?: string;
  action?: () => void;
  subLabel?: string;
}

interface MenuGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
}

export const SidebarCrm: React.FC<SidebarCrmProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const { activeTab, setActiveTab, siteConfig, currentUser } = useApp();

  // Collapsed state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('imobipro_crm_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Search in menu
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    imoveis: true,
    clientes: true,
    corretores: false,
    documentos: false,
    agenda: false,
    financeiro: false,
    relatorios: false,
    configuracoes: false
  });

  const toggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    try {
      localStorage.setItem('imobipro_crm_sidebar_collapsed', String(nextVal));
      window.dispatchEvent(new Event('crm_sidebar_collapsed_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      try {
        localStorage.setItem('imobipro_crm_sidebar_collapsed', 'false');
        window.dispatchEvent(new Event('crm_sidebar_collapsed_changed'));
      } catch (e) {
        console.error(e);
      }
    }
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleNavigate = (tab: string, customAction?: () => void) => {
    setActiveTab(tab);
    if (customAction) customAction();
    if (onCloseMobile) onCloseMobile();
  };

  const menuGroups: MenuGroup[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { id: 'dash_visao', label: 'Visão Geral', icon: LayoutDashboard, tab: 'relatorios' },
        { id: 'dash_grade', label: 'Visão em Grade (Módulos)', icon: LayoutGrid, tab: 'menu_grade' },
        { id: 'dash_indicadores', label: 'Indicadores do Mês', icon: BarChart3, tab: 'relatorios' },
        { id: 'dash_tarefas', label: 'Tarefas do Dia', icon: Calendar, tab: 'crm' }
      ]
    },
    {
      id: 'imoveis',
      title: 'Imóveis',
      icon: Building2,
      items: [
        { id: 'imoveis_listar', label: 'Listar Imóveis', icon: Building2, tab: 'imoveis' },
        { id: 'imoveis_cadastrar', label: 'Cadastrar Imóvel', icon: PlusCircle, tab: 'imoveis' },
        { id: 'imoveis_destaques', label: 'Vitrine & Fotos', icon: Sparkles, tab: 'imoveis' },
        { id: 'imoveis_docs', label: 'Documentos do Imóvel', icon: FolderOpen, tab: 'imoveis' }
      ]
    },
    {
      id: 'clientes',
      title: 'Clientes & CRM',
      icon: Users,
      items: [
        { id: 'crm_funil', label: 'Funil de Vendas (Kanban)', icon: Users, tab: 'crm' },
        { id: 'crm_cadastrar', label: 'Cadastrar Cliente / Lead', icon: UserPlus, tab: 'crm' },
        { id: 'crm_historico', label: 'Histórico & Tarefas', icon: History, tab: 'crm' }
      ]
    },
    {
      id: 'corretores',
      title: 'Corretores / Parceiros',
      icon: UserCheck,
      items: [
        { id: 'usr_listar', label: 'Listar Corretores', icon: UserCheck, tab: 'usuarios' },
        { id: 'usr_cadastrar', label: 'Cadastrar Corretor', icon: UserPlus, tab: 'usuarios' },
        { id: 'usr_parcerias', label: 'Parcerias Fifty (50/50)', icon: Briefcase, tab: 'imoveis' }
      ]
    },
    {
      id: 'documentos',
      title: 'Documentos & Minutas',
      icon: FileText,
      items: [
        { id: 'doc_captacao', label: 'Ficha de Captação', icon: FileText, tab: 'imoveis' },
        { id: 'doc_recibos', label: 'Recibos & Comissões', icon: FileCheck2, tab: 'comissoes' },
        { id: 'doc_contratos', label: 'Modelos de Contrato', icon: FileSpreadsheet, tab: 'configuracoes' }
      ]
    },
    {
      id: 'agenda',
      title: 'Agenda & Visitas',
      icon: Calendar,
      items: [
        { id: 'agenda_compromissos', label: 'Compromissos', icon: Calendar, tab: 'agenda' },
        { id: 'agenda_visitas', label: 'Visitas Agendadas', icon: Calendar, tab: 'agenda' }
      ]
    },
    {
      id: 'financeiro',
      title: 'Financeiro',
      icon: DollarSign,
      items: [
        { id: 'fin_comissoes', label: 'Comissões & Repasses', icon: DollarSign, tab: 'comissoes' },
        { id: 'fin_relatorios', label: 'Balanço Financeiro', icon: BarChart3, tab: 'relatorios' }
      ]
    },
    {
      id: 'relatorios',
      title: 'Relatórios & Exportação',
      icon: BarChart3,
      items: [
        { id: 'rel_desempenho', label: 'Desempenho Geral', icon: BarChart3, tab: 'relatorios' },
        { id: 'rel_export', label: 'Exportar Excel / PDF', icon: FileSpreadsheet, tab: 'relatorios' }
      ]
    },
    {
      id: 'chat',
      title: 'Comunicação',
      icon: MessageSquare,
      items: [
        { id: 'chat_interno', label: 'Chat Interno da Equipe', icon: MessageSquare, tab: 'chat' }
      ]
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: Settings,
      items: [
        { id: 'cfg_dados', label: 'Dados do Corretor / CRECI', icon: Settings, tab: 'configuracoes' },
        { id: 'cfg_banner', label: 'Banner & Tema do Site', icon: Sliders, tab: 'configuracoes' },
        { id: 'cfg_usuarios', label: 'Usuários & Permissões', icon: Shield, tab: 'usuarios' }
      ]
    }
  ];

  // Filter groups if search is typed
  const filteredGroups = menuGroups.map(group => {
    if (!searchQuery.trim()) return group;
    const query = searchQuery.toLowerCase();
    const matchesTitle = group.title.toLowerCase().includes(query);
    const matchingItems = group.items.filter(
      item => item.label.toLowerCase().includes(query) || (item.subLabel && item.subLabel.toLowerCase().includes(query))
    );

    if (matchesTitle || matchingItems.length > 0) {
      return {
        ...group,
        items: matchesTitle ? group.items : matchingItems
      };
    }
    return null;
  }).filter(Boolean) as MenuGroup[];

  const isCurrentActive = (itemTab: string) => {
    if (activeTab === itemTab) return true;
    if (itemTab === 'relatorios' && activeTab === 'estatisticas') return true;
    if (itemTab === 'agenda' && activeTab === 'agendamentos') return true;
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none">
      
      {/* Sidebar Top Header */}
      <div className="h-16 px-3 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-950/80">
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 transition-all duration-300">
              <h2 className="text-sm font-black text-white truncate tracking-tight">
                {siteConfig.brokerName || siteConfig.companyName || 'Painel CRM'}
              </h2>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block -mt-0.5 truncate">
                {siteConfig.brokerCreci || siteConfig.creciJuridico || 'Área Restrita'}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Expand/Collapse Button */}
        <button
          onClick={toggleCollapse}
          className={`hidden lg:flex p-2 rounded-xl transition-all shadow-xs shrink-0 border ${
            isCollapsed
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
          title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60 shrink-0"
          title="Fechar Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Tag (When expanded) */}
      {!isCollapsed && currentUser && (
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-200 block truncate leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium capitalize block truncate">
              {currentUser.role === 'admin' ? '🔑 Administrador' : '💼 Corretor'}
            </span>
          </div>
        </div>
      )}

      {/* Search Input Bar (Only when expanded) */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-800 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar no CRM..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-500 hover:text-white text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Menu Navigation Items (Scrollable List) */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-2 custom-scrollbar">
        {filteredGroups.map(group => {
          const GroupIcon = group.icon;
          const isGroupExpanded = searchQuery.trim() !== '' ? true : (expandedGroups[group.id] ?? false);
          const hasActiveItem = group.items.some(i => isCurrentActive(i.tab));

          return (
            <div key={group.id} className="space-y-1">
              
              {/* Group Accordion Header */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    hasActiveItem
                      ? 'text-indigo-400 bg-indigo-950/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <GroupIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{group.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                      isGroupExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                /* Collapsed Category Divider Icon */
                <div className="pt-2 pb-1 text-center">
                  <div
                    className="w-9 h-9 mx-auto rounded-xl bg-slate-800/60 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-800 hover:text-white transition-colors relative group"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <GroupIcon className="w-4 h-4" />
                    {/* Hover Tooltip in Collapsed Mode */}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-950 text-white text-xs font-bold rounded-xl shadow-2xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800">
                      {group.title}
                    </div>
                  </div>
                </div>
              )}

              {/* Group Sub-Items */}
              {(isCollapsed || isGroupExpanded) && (
                <div className={`space-y-1 ${!isCollapsed ? 'pl-2 border-l border-slate-800/80 ml-3' : ''}`}>
                  {group.items.map(item => {
                    const ItemIcon = item.icon;
                    const active = isCurrentActive(item.tab);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.tab, item.action)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group ${
                          isCollapsed ? 'justify-center' : ''
                        } ${
                          active
                            ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        <ItemIcon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        
                        {!isCollapsed && (
                          <span className="truncate text-left leading-tight">
                            {item.label}
                          </span>
                        )}

                        {/* Hover Tooltip when Collapsed */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-950 text-white text-xs font-bold rounded-xl shadow-2xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800 flex items-center gap-2">
                            <span>{item.label}</span>
                            {active && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Footer Navigation Back to Public Portal */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/80 space-y-2">
        <button
          onClick={() => handleNavigate('portal')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700/80 group relative ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Sair do CRM e ir ao Site Público"
        >
          <Home className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
          {!isCollapsed && <span>Ir para o Site Público</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-950 text-white text-xs font-bold rounded-xl shadow-2xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800">
              Ir para o Site Público
            </div>
          )}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Collapsible Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 h-screen z-50 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sliding Drawer Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Sliding Drawer Container */}
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
