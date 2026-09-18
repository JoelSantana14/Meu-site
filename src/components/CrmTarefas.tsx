import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CrmTask,
  CrmTaskPriority,
  CrmTaskType,
  CrmTaskStatus,
  Lead
} from '../types';
import {
  CheckSquare,
  Square,
  Calendar,
  Clock,
  AlertTriangle,
  AlertCircle,
  Phone,
  MessageCircle,
  Mail,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  User as UserIcon,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Bell,
  FileText,
  Users,
  X,
  Flame,
  ArrowUpDown
} from 'lucide-react';

interface CrmTarefasProps {
  onOpenLeadDetail?: (lead: Lead) => void;
  filterLeadId?: string; // If provided, shows tasks for this specific lead
}

export const CrmTarefas: React.FC<CrmTarefasProps> = ({
  onOpenLeadDetail,
  filterLeadId
}) => {
  const {
    crmTasks,
    leads,
    users,
    currentUser,
    addCrmTask,
    updateCrmTask,
    toggleCrmTaskStatus,
    deleteCrmTask,
    siteConfig
  } = useApp();

  // Local filters
  const [statusFilter, setStatusFilter] = useState<'todas' | 'pendentes' | 'atrasadas' | 'hoje' | 'concluidas'>('pendentes');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todas');
  const [agentFilter, setAgentFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Create/Edit Task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form states
  const [formLeadId, setFormLeadId] = useState<string>(filterLeadId || '');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [formDueTime, setFormDueTime] = useState<string>('15:00');
  const [formPriority, setFormPriority] = useState<CrmTaskPriority>('media');
  const [formType, setFormType] = useState<CrmTaskType>('ligacao');
  const [formAgentId, setFormAgentId] = useState<string>(currentUser?.id || users[0]?.id || '');

  // Today string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Preset suggestions for tasks
  const quickSuggestions = [
    { title: 'Ligar para confirmar visita ao imóvel', type: 'ligacao' as CrmTaskType, priority: 'alta' as CrmTaskPriority },
    { title: 'Enviar opções e catálogo pelo WhatsApp', type: 'whatsapp' as CrmTaskType, priority: 'media' as CrmTaskPriority },
    { title: 'Cobrar retorno sobre a proposta enviada', type: 'proposta' as CrmTaskType, priority: 'urgente' as CrmTaskPriority },
    { title: 'Solicitar documentos para análise de garantia', type: 'documento' as CrmTaskType, priority: 'alta' as CrmTaskPriority },
    { title: 'Follow-up de alinhamento com cliente', type: 'followup' as CrmTaskType, priority: 'media' as CrmTaskPriority },
    { title: 'Reunião presencial para fechamento', type: 'reuniao' as CrmTaskType, priority: 'alta' as CrmTaskPriority }
  ];

  // Helper to open modal for creation
  const handleOpenCreateModal = (preselectedLeadId?: string) => {
    setEditingTaskId(null);
    setFormLeadId(preselectedLeadId || filterLeadId || leads[0]?.id || '');
    setFormTitle('');
    setFormDescription('');
    setFormDueDate(new Date().toISOString().split('T')[0]);
    setFormDueTime('14:00');
    setFormPriority('media');
    setFormType('ligacao');
    setFormAgentId(currentUser?.id || users[0]?.id || '');
    setIsModalOpen(true);
  };

  // Helper to open modal for editing
  const handleOpenEditModal = (task: CrmTask) => {
    setEditingTaskId(task.id);
    setFormLeadId(task.leadId);
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormDueDate(task.dueDate);
    setFormDueTime(task.dueTime || '');
    setFormPriority(task.priority);
    setFormType(task.taskType);
    setFormAgentId(task.agentId);
    setIsModalOpen(true);
  };

  // Save form
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDueDate) return;

    const selectedLead = leads.find(l => l.id === formLeadId);
    const selectedAgent = users.find(u => u.id === formAgentId);

    const leadName = selectedLead ? selectedLead.name : 'Cliente Geral';
    const leadPhone = selectedLead ? selectedLead.phone : undefined;
    const leadEmail = selectedLead ? selectedLead.email : undefined;
    const agentName = selectedAgent ? selectedAgent.name : (currentUser?.name || 'Corretor');

    if (editingTaskId) {
      const existing = crmTasks.find(t => t.id === editingTaskId);
      if (existing) {
        updateCrmTask({
          ...existing,
          leadId: formLeadId,
          leadName,
          leadPhone,
          leadEmail,
          agentId: formAgentId,
          agentName,
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          dueDate: formDueDate,
          dueTime: formDueTime.trim() || undefined,
          priority: formPriority,
          taskType: formType
        });
      }
    } else {
      addCrmTask({
        leadId: formLeadId,
        leadName,
        leadPhone,
        leadEmail,
        agentId: formAgentId,
        agentName,
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        dueDate: formDueDate,
        dueTime: formDueTime.trim() || undefined,
        priority: formPriority,
        taskType: formType,
        status: 'pendente'
      });
    }

    setIsModalOpen(false);
  };

  // Date shortcut setter
  const setQuickDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setFormDueDate(d.toISOString().split('T')[0]);
  };

  // Open WhatsApp directly for lead
  const handleWhatsappLead = (phone?: string, leadName?: string, taskTitle?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const num = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(
      `Olá ${leadName || ''}! Sou da ${siteConfig.companyName}. Estou entrando em contato referente a: "${taskTitle || 'nosso atendimento imobiliário'}". Podemos conversar?`
    );
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return crmTasks.filter(task => {
      // Direct lead filter if prop supplied
      if (filterLeadId && task.leadId !== filterLeadId) {
        return false;
      }

      // Status filter
      if (statusFilter === 'pendentes') {
        if (task.status !== 'pendente') return false;
      } else if (statusFilter === 'concluidas') {
        if (task.status !== 'concluida') return false;
      } else if (statusFilter === 'hoje') {
        if (task.status !== 'pendente' || task.dueDate !== todayStr) return false;
      } else if (statusFilter === 'atrasadas') {
        if (task.status !== 'pendente' || task.dueDate >= todayStr) return false;
      }

      // Type filter
      if (typeFilter !== 'todos' && task.taskType !== typeFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'todas' && task.priority !== priorityFilter) {
        return false;
      }

      // Agent filter
      if (agentFilter !== 'todos' && task.agentId !== agentFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = (task.description || '').toLowerCase().includes(q);
        const matchLead = task.leadName.toLowerCase().includes(q);
        const matchPhone = (task.leadPhone || '').includes(q);
        if (!matchTitle && !matchDesc && !matchLead && !matchPhone) return false;
      }

      return true;
    }).sort((a, b) => {
      // Pending first
      if (a.status === 'pendente' && b.status !== 'pendente') return -1;
      if (a.status !== 'pendente' && b.status === 'pendente') return 1;

      // Atrasadas first among pending
      const aIsOverdue = a.status === 'pendente' && a.dueDate < todayStr;
      const bIsOverdue = b.status === 'pendente' && b.dueDate < todayStr;
      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;

      // Due date ascending
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [crmTasks, filterLeadId, statusFilter, typeFilter, priorityFilter, agentFilter, searchQuery, todayStr]);

  // General counters
  const counters = useMemo(() => {
    const baseList = filterLeadId ? crmTasks.filter(t => t.leadId === filterLeadId) : crmTasks;
    const total = baseList.length;
    const pendentes = baseList.filter(t => t.status === 'pendente').length;
    const concluidas = baseList.filter(t => t.status === 'concluida').length;
    const hoje = baseList.filter(t => t.status === 'pendente' && t.dueDate === todayStr).length;
    const atrasadas = baseList.filter(t => t.status === 'pendente' && t.dueDate < todayStr).length;

    return { total, pendentes, concluidas, hoje, atrasadas };
  }, [crmTasks, filterLeadId, todayStr]);

  // Visual helper for type icon and label
  const getTaskTypeBadge = (type: CrmTaskType) => {
    switch (type) {
      case 'ligacao':
        return { label: 'Ligação', icon: Phone, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200' };
      case 'whatsapp':
        return { label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300 border-green-200' };
      case 'visita':
        return { label: 'Visita', icon: Calendar, color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200' };
      case 'reuniao':
        return { label: 'Reunião', icon: Users, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200' };
      case 'proposta':
        return { label: 'Proposta', icon: Sparkles, color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200' };
      case 'documento':
        return { label: 'Documento', icon: FileText, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200' };
      case 'followup':
        return { label: 'Follow-up', icon: Clock, color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200' };
      default:
        return { label: 'Outro', icon: Bell, color: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200' };
    }
  };

  const getPriorityBadge = (p: CrmTaskPriority) => {
    switch (p) {
      case 'urgente':
        return { label: 'Urgente', color: 'bg-red-500 text-white shadow-xs' };
      case 'alta':
        return { label: 'Alta', color: 'bg-amber-500 text-white' };
      case 'media':
        return { label: 'Média', color: 'bg-blue-500 text-white' };
      case 'baixa':
        return { label: 'Baixa', color: 'bg-slate-400 text-white' };
    }
  };

  const formatDueDate = (dateStr: string, timeStr?: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return timeStr ? `${formatted} às ${timeStr}` : formatted;
  };

  return (
    <div className="space-y-6">

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Pendentes */}
        <button
          type="button"
          onClick={() => setStatusFilter('pendentes')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'pendentes'
              ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendentes</span>
            <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{counters.pendentes}</span>
            <span className="text-xs text-slate-500">ativas</span>
          </div>
        </button>

        {/* Vence Hoje */}
        <button
          type="button"
          onClick={() => setStatusFilter('hoje')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'hoje'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Vence Hoje</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{counters.hoje}</span>
            <span className="text-xs text-slate-500">para hoje</span>
          </div>
        </button>

        {/* Atrasadas */}
        <button
          type="button"
          onClick={() => setStatusFilter('atrasadas')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'atrasadas'
              ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-700 ring-2 ring-red-500/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
              {counters.atrasadas > 0 && <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />}
              Atrasadas
            </span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600 dark:text-red-400">{counters.atrasadas}</span>
            <span className="text-xs text-slate-500">urgente</span>
          </div>
        </button>

        {/* Concluídas */}
        <button
          type="button"
          onClick={() => setStatusFilter('concluidas')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'concluidas'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{counters.concluidas}</span>
            <span className="text-xs text-slate-500">finalizadas</span>
          </div>
        </button>
      </div>

      {/* Control Bar: Filters and Add Button */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Left: Search & Selects */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, contato ou telefone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
          >
            <option value="todas">Todos os Status ({counters.total})</option>
            <option value="pendentes">Pendentes ({counters.pendentes})</option>
            <option value="hoje">Vencem Hoje ({counters.hoje})</option>
            <option value="atrasadas">Atrasadas ({counters.atrasadas})</option>
            <option value="concluidas">Concluídas ({counters.concluidas})</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="ligacao">Ligação 📞</option>
            <option value="whatsapp">WhatsApp 💬</option>
            <option value="visita">Visita 📅</option>
            <option value="proposta">Proposta 📄</option>
            <option value="documento">Documento 📑</option>
            <option value="followup">Follow-up ⏰</option>
            <option value="reuniao">Reunião 👥</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
          >
            <option value="todas">Todas Prioridades</option>
            <option value="urgente">Urgente 🔴</option>
            <option value="alta">Alta 🟠</option>
            <option value="media">Média 🟡</option>
            <option value="baixa">Baixa 🟢</option>
          </select>

          {/* Agent Filter (if not filtering a specific lead) */}
          {!filterLeadId && (
            <select
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="todos">Todos os Corretores</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Right: Add Task Button */}
        <button
          type="button"
          onClick={() => handleOpenCreateModal()}
          className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Tarefa / Lembrete</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              Nenhuma tarefa encontrada
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {statusFilter === 'concluidas'
                ? 'Nenhuma tarefa concluída com os filtros selecionados.'
                : 'Você está em dia com seus contatos! Crie um novo lembrete para não perder prazos ou follow-ups.'}
            </p>
            <button
              type="button"
              onClick={() => handleOpenCreateModal()}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Primeira Tarefa</span>
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'concluida';
            const isOverdue = !isCompleted && task.dueDate < todayStr;
            const isDueToday = !isCompleted && task.dueDate === todayStr;

            const typeInfo = getTaskTypeBadge(task.taskType);
            const priorityInfo = getPriorityBadge(task.priority);
            const TypeIcon = typeInfo.icon;

            // Find full lead object if needed for actions
            const linkedLead = leads.find(l => l.id === task.leadId);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : isOverdue
                    ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 shadow-xs'
                    : isDueToday
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300'
                }`}
              >
                {/* Left: Checkbox + Content */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  
                  {/* Completion Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleCrmTaskStatus(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none shrink-0"
                    title={isCompleted ? 'Marcar como Pendente' : 'Marcar como Concluída'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <div className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-sm bg-transparent hover:bg-indigo-500 transition-all" />
                      </div>
                    )}
                  </button>

                  {/* Text & Metadata */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Priority Tag */}
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>

                      {/* Type Badge */}
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border flex items-center gap-1 ${typeInfo.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        <span>{typeInfo.label}</span>
                      </span>

                      {/* Due Date Indicator */}
                      {isCompleted ? (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Concluída {task.completedAt ? `em ${task.completedAt}` : ''}</span>
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2 py-0.5 text-[11px] font-black text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/80 rounded-md border border-red-300 dark:border-red-800 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Atrasada • {formatDueDate(task.dueDate, task.dueTime)}</span>
                        </span>
                      ) : isDueToday ? (
                        <span className="px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 rounded-md border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Vence Hoje • {task.dueTime ? `às ${task.dueTime}` : 'Hoje'}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Vence em {formatDueDate(task.dueDate, task.dueTime)}</span>
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <h3 className={`text-sm font-bold text-slate-900 dark:text-white ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                      {task.title}
                    </h3>

                    {/* Task Description */}
                    {task.description && (
                      <p className={`text-xs text-slate-600 dark:text-slate-300 line-clamp-2 ${isCompleted ? 'line-through opacity-70' : ''}`}>
                        {task.description}
                      </p>
                    )}

                    {/* Linked Lead / Contact Section */}
                    <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50/80 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Contato: {task.leadName}</span>
                        {task.leadPhone && (
                          <span className="text-slate-500 font-normal text-[11px] ml-1">({task.leadPhone})</span>
                        )}
                        {linkedLead && onOpenLeadDetail && (
                          <button
                            type="button"
                            onClick={() => onOpenLeadDetail(linkedLead)}
                            className="ml-1 text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-200 underline text-[11px]"
                            title="Ver ficha completa do lead no CRM"
                          >
                            Ver Ficha
                          </button>
                        )}
                      </div>

                      {/* Broker Assigned */}
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span>Resp:</span>
                        <strong className="text-slate-700 dark:text-slate-300">{task.agentName}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Contact Actions & Management */}
                <div className="flex items-center justify-end gap-1.5 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                  
                  {/* WhatsApp Quick Action */}
                  {task.leadPhone && (
                    <button
                      type="button"
                      onClick={() => handleWhatsappLead(task.leadPhone, task.leadName, task.title)}
                      className="p-2 bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                      title="Chamar cliente no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Call Quick Action */}
                  {task.leadPhone && (
                    <a
                      href={`tel:${task.leadPhone.replace(/\D/g, '')}`}
                      className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"
                      title="Ligar para o cliente"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                  {/* Mail Quick Action */}
                  {task.leadEmail && (
                    <a
                      href={`mailto:${task.leadEmail}?subject=${encodeURIComponent(`Contato: ${task.title}`)}`}
                      className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                      title="Enviar e-mail ao cliente"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}

                  {/* Edit Task */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(task)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                    title="Editar Tarefa / Prazo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Task */}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Deseja excluir a tarefa "${task.title}"?`)) {
                        deleteCrmTask(task.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all"
                    title="Excluir Tarefa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE / EDIT TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingTaskId ? 'Editar Tarefa / Lembrete' : 'Nova Tarefa no CRM'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina o contato vinculado, data de vencimento e prioridade.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions (if creating new) */}
            {!editingTaskId && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Sugestões Rápidas de Ação:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormTitle(sug.title);
                        setFormType(sug.type);
                        setFormPriority(sug.priority);
                      }}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 rounded-lg transition-all"
                    >
                      + {sug.title.split(' ')[0]} {sug.title.split(' ')[1]}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveTask} className="space-y-4">
              
              {/* 1. Linked Lead Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Contato Vinculado (Lead / Cliente) *
                </label>
                <select
                  value={formLeadId}
                  onChange={e => setFormLeadId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" disabled>Selecione um contato...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} {lead.phone ? `(${lead.phone})` : ''} — Estágio: {lead.stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Task Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Título da Tarefa / Lembrete *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Ex: Ligar para confirmar visita no apartamento..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* 3. Task Type & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Type */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tipo de Tarefa
                  </label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as CrmTaskType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    <option value="ligacao">Ligação Telefônica 📞</option>
                    <option value="whatsapp">Mensagem WhatsApp 💬</option>
                    <option value="visita">Agendamento de Visita 📅</option>
                    <option value="reuniao">Reunião Presencial / Online 👥</option>
                    <option value="proposta">Envio de Proposta / Contraproposta 📄</option>
                    <option value="documento">Coleta / Emissão de Documento 📑</option>
                    <option value="followup">Follow-up de Contato ⏰</option>
                    <option value="outro">Outro Lembrete 📌</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as CrmTaskPriority)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    <option value="urgente">Urgente 🔴</option>
                    <option value="alta">Alta 🟠</option>
                    <option value="media">Média 🟡</option>
                    <option value="baixa">Baixa 🟢</option>
                  </select>
                </div>
              </div>

              {/* 4. Due Date & Time */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Data e Horário de Vencimento *
                  </label>
                  {/* Quick date shortcuts */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded"
                    >
                      Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded"
                    >
                      Amanhã
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(3)}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded"
                    >
                      Em 3 dias
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                  <input
                    type="time"
                    value={formDueTime}
                    onChange={e => setFormDueTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* 5. Assigned Broker */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Corretor Responsável
                </label>
                <select
                  value={formAgentId}
                  onChange={e => setFormAgentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Description / Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Observações e Detalhes da Tarefa
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Instruções sobre o que falar, condições combinadas, detalhes do imóvel..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {editingTaskId ? 'Salvar Alterações' : 'Criar Lembrete'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
