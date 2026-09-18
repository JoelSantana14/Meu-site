import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentosJuridicosModal } from './DocumentosJuridicosModal';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  ShieldCheck,
  Eye,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Shield,
  FileCode,
  UserCheck,
  CheckCircle2,
  X,
  FileText,
  Globe,
  Search
} from 'lucide-react';

interface InternalGridMenuProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const InternalGridMenu: React.FC<InternalGridMenuProps> = ({ onClose, isModal = false }) => {
  const {
    setActiveTab,
    properties,
    leads,
    visits,
    commissions,
    chatMessages,
    users,
    currentUser,
    siteConfig,
    documents
  } = useApp();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.isMasterAdmin;

  const [isLegalDocsOpen, setIsLegalDocsOpen] = useState(false);

  const totalProperties = properties.length;
  const activeLeads = leads.length;
  const pendingVisits = visits.filter(v => v.status === 'pendente' || v.status === 'agendada').length;
  const totalCommissionsValue = commissions.reduce((acc, c) => acc + (c.agentCommissionAmount || 0), 0);
  const unreadMessages = chatMessages.length;
  const totalDocuments = documents?.length || 0;

  const menuModules = [
    {
      id: 'relatorios',
      title: 'Dashboard & Relatórios',
      subtitle: 'Visão geral de desempenho, vendas e métricas',
      icon: LayoutDashboard,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      badge: 'Geral',
      stats: 'Métricas em tempo real',
      quickAction: {
        label: 'Ver Gráficos',
        action: () => {
          setActiveTab('relatorios');
          if (onClose) onClose();
        }
      }
    },
    {
      id: 'imoveis',
      title: 'Catálogo de Imóveis',
      subtitle: 'Gestão completa, fotos (até 35), valores e status',
      icon: Building2,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      badge: `${totalProperties} Imóveis`,
      stats: `${properties.filter(p => p.status === 'disponivel').length} disponíveis`,
      quickAction: {
        label: '+ Novo Imóvel',
        action: () => {
          setActiveTab('imoveis');
          if (onClose) onClose();
        }
      }
    },
    {
      id: 'crm',
      title: 'CRM & Funil de Vendas',
      subtitle: 'Acompanhamento de leads, contatos e negociações',
      icon: Users,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      badge: `${activeLeads} Clientes`,
      stats: 'Quadro Kanban',
      quickAction: {
        label: '+ Cadastrar Lead',
        action: () => {
          setActiveTab('crm');
          if (onClose) onClose();
        }
      }
    },
    {
      id: 'agenda',
      title: 'Agenda de Visitas',
      subtitle: 'Calendário de atendimentos e visitas presenciais',
      icon: Calendar,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      badge: `${pendingVisits} Agendadas`,
      stats: 'Compromissos',
      quickAction: {
        label: '+ Agendar Visita',
        action: () => {
          setActiveTab('agenda');
          if (onClose) onClose();
        }
      }
    },
    ...(isAdmin ? [{
      id: 'comissoes',
      title: 'Comissões & Repasses',
      subtitle: 'Controle financeiro de vendas e porcentagens de corretores',
      icon: DollarSign,
      color: 'bg-violet-600',
      lightColor: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
      badge: 'Financeiro',
      stats: `R$ ${totalCommissionsValue.toLocaleString('pt-BR')}`,
      quickAction: {
        label: 'Ver Extrato',
        action: () => {
          setActiveTab('comissoes');
          if (onClose) onClose();
        }
      }
    }] : []),
    {
      id: 'chat',
      title: 'Chat Interno da Equipe',
      subtitle: 'Comunicação instantânea e avisos em tempo real',
      icon: MessageSquare,
      color: 'bg-teal-600',
      lightColor: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
      badge: `${unreadMessages} Msg`,
      stats: 'Canais de equipe',
      quickAction: {
        label: 'Abrir Chat',
        action: () => {
          setActiveTab('chat');
          if (onClose) onClose();
        }
      }
    },
    {
      id: 'documentos',
      title: 'Documentos & Minutas Jurídicas',
      subtitle: '5 modelos completos: Ficha de Captação, Aluguel, Comissão, Fifty e Corretagem',
      icon: FileText,
      color: 'bg-indigo-700',
      lightColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      badge: `${totalDocuments} Gerados`,
      stats: 'Lei 6.530/78 & Cód. Civil',
      quickAction: {
        label: 'Emitir Documento',
        action: () => {
          setIsLegalDocsOpen(true);
        }
      }
    },
    ...(isAdmin ? [{
      id: 'configuracoes',
      title: 'Tema, Cores & Marca',
      subtitle: 'Paleta rápida, banners, logo, marca d\'água e páginas',
      icon: Settings,
      color: 'bg-pink-600',
      lightColor: 'bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
      badge: 'Personalização',
      stats: siteConfig.backgroundMode === 'pure_white' ? 'Fundo Branco' : 'Custom',
      quickAction: {
        label: 'Configurar Tema',
        action: () => {
          setActiveTab('configuracoes');
          if (onClose) onClose();
        }
      }
    }] : []),
    ...(isAdmin ? [{
      id: 'seo',
      title: 'SEO & Google Ranking',
      subtitle: 'Visibilidade no Google para São José do Rio Preto e Região',
      icon: Search,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      badge: 'Google Pronto',
      stats: 'SJRP & Região',
      quickAction: {
        label: 'Ajustar SEO',
        action: () => {
          setActiveTab('configuracoes');
          if (onClose) onClose();
        }
      }
    }] : []),
    ...(isAdmin ? [{
      id: 'usuarios',
      title: 'Gestão de Usuários',
      subtitle: 'Controle de corretores, recepcionistas e permissões',
      icon: ShieldCheck,
      color: 'bg-rose-600',
      lightColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      badge: `${users.length} Membros`,
      stats: 'Admin Exclusivo',
      quickAction: {
        label: 'Gerenciar Equipe',
        action: () => {
          setActiveTab('usuarios');
          if (onClose) onClose();
        }
      }
    }] : []),
    {
      id: 'portal',
      title: 'Visualizar Site Público',
      subtitle: 'Abrir a vitrine de imóveis como cliente/visitante',
      icon: Eye,
      color: 'bg-slate-900 dark:bg-slate-800',
      lightColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
      badge: 'Público',
      stats: 'Vitrine Online',
      quickAction: {
        label: 'Ver Site',
        action: () => {
          setActiveTab('portal');
          if (onClose) onClose();
        }
      }
    }
  ];

  const handleNavigate = (tabId: string) => {
    if (tabId === 'documentos') {
      setIsLegalDocsOpen(true);
      return;
    }
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
            style={{ backgroundColor: siteConfig.primaryColorHex || '#4f46e5' }}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Menu do Sistema & Módulos</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold uppercase">
                Painel Restrito
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acesso rápido em grade moderna aos módulos e ferramentas de gestão imobiliária.
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Status Strip */}
      {currentUser && (
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-800/40 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-400/60"
            />
            <div>
              <p className="font-black text-sm text-white">{currentUser.name}</p>
              <p className="text-[11px] text-indigo-200">
                {currentUser.role === 'admin' ? 'Administrador Geral' : 'Corretor Credenciado'} • {currentUser.creci || 'CRECI 12345-F'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate('portal')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Site Público</span>
            </button>
          </div>
        </div>
      )}

      {/* Modern Card Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {menuModules.map(module => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              onClick={() => handleNavigate(module.id)}
              className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 hover:border-indigo-500 flex flex-col justify-between cursor-pointer space-y-4 relative overflow-hidden"
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-2">
                <div className={`w-12 h-12 rounded-2xl ${module.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${module.lightColor}`}>
                  {module.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                  <span>{module.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {module.subtitle}
                </p>
              </div>

              {/* Footer Stat / Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  {module.stats}
                </span>
                <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  Acessar Módulo &rarr;
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL GLOBAL DE DOCUMENTOS E MINUTAS JURÍDICAS */}
      <DocumentosJuridicosModal
        isOpen={isLegalDocsOpen}
        onClose={() => setIsLegalDocsOpen(false)}
      />

    </div>
  );
};
