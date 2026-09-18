import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lead,
  PipelineStage,
  PropertyType,
  FiftyPartnerInfo,
  LegalDocType,
  GeneratedDocument
} from '../types';
import { fetchAddressByCep, formatCep } from '../utils/cepHelper';
import { DocumentosJuridicosModal } from './DocumentosJuridicosModal';
import { ArchiveReasonModal } from './ArchiveReasonModal';
import { CrmTarefas } from './CrmTarefas';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  DollarSign,
  MessageCircle,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  UserCheck,
  ChevronRight,
  X,
  Send,
  MapPin,
  Loader2,
  AlertCircle,
  Handshake,
  FileCheck,
  Edit,
  Save,
  Trash2,
  Archive,
  ArchiveRestore,
  Printer,
  ShieldCheck,
  ExternalLink,
  CheckSquare,
  Bell,
  Flame,
  Upload
} from 'lucide-react';

const STAGES: { id: PipelineStage; label: string; color: string; badge: string }[] = [
  { id: 'novo', label: 'Novo Lead', color: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200' },
  { id: 'contato', label: 'Primeiro Contato', color: 'bg-cyan-500', badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200' },
  { id: 'visita', label: 'Visita Agendada', color: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200' },
  { id: 'proposta', label: 'Proposta Enviada', color: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200' },
  { id: 'negociacao', label: 'Em Negociação', color: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200' },
  { id: 'fechado', label: 'Fechado / Ganho', color: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200' },
  { id: 'perdido', label: 'Perdido', color: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200' }
];

export const CrmFunil: React.FC = () => {
  const {
    leads,
    users,
    properties,
    documents,
    crmTasks,
    currentUser,
    updateLeadStage,
    addLead,
    updateLead,
    deleteLead,
    archiveLead,
    unarchiveLead,
    deleteDocument,
    archiveDocument,
    unarchiveDocument,
    deleteNegotiationDoc,
    archiveNegotiationDoc,
    unarchiveNegotiationDoc,
    addLeadNote,
    addAuditLog,
    siteConfig
  } = useApp();

  const [crmView, setCrmView] = useState<'funil' | 'tarefas'>('funil');
  const [leadViewMode, setLeadViewMode] = useState<'ativos' | 'arquivados'>('ativos');
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState<string>('todos');

  // Archive Reason Modal State
  const [archiveModalConfig, setArchiveModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    itemType: 'lead' | 'imovel' | 'documento';
    itemName: string;
    onConfirm: (reason: string) => Promise<void> | void;
  } | null>(null);

  // Computed metrics for tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasksCount = crmTasks.filter(t => t.status === 'pendente').length;
  const overdueTasksCount = crmTasks.filter(t => t.status === 'pendente' && t.dueDate < todayStr).length;

  // New Lead Modal State
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('Site Direct');
  const [newLeadType, setNewLeadType] = useState<PropertyType>('apartamento');
  const [newLeadBudget, setNewLeadBudget] = useState<number | ''>('');
  const [newLeadAgent, setNewLeadAgent] = useState<string>(currentUser?.id || users[0]?.id || '');
  const [newLeadNote, setNewLeadNote] = useState('');
  
  // Qualification fields
  const [newLeadCpf, setNewLeadCpf] = useState('');
  const [newLeadRg, setNewLeadRg] = useState('');
  const [newLeadProfession, setNewLeadProfession] = useState('');

  // Address & CEP states for New Lead
  const [newLeadCep, setNewLeadCep] = useState('');
  const [isSearchingNewCep, setIsSearchingNewCep] = useState(false);
  const [newCepError, setNewCepError] = useState<string | null>(null);
  const [newLeadStreet, setNewLeadStreet] = useState('');
  const [newLeadNumber, setNewLeadNumber] = useState('');
  const [newLeadNeighborhood, setNewLeadNeighborhood] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('São Paulo');
  const [newLeadState, setNewLeadState] = useState('SP');
  const [newLeadComplement, setNewLeadComplement] = useState('');

  // Fifty fields for New Lead
  const [newIsFiftyEnabled, setNewIsFiftyEnabled] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerCreci, setNewPartnerCreci] = useState('');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerPercentage, setNewPartnerPercentage] = useState<number>(50);
  const [newPartnerAgency, setNewPartnerAgency] = useState('');
  const [newPartnerNotes, setNewPartnerNotes] = useState('');

  // Lead Detail Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'documentos' | 'fifty' | 'notas' | 'tarefas'>('info');
  const [noteText, setNoteText] = useState('');

  // Keep selectedLead in sync with leads array to reflect notes/edits immediately
  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find(l => l.id === selectedLead.id);
      if (updated) {
        setSelectedLead(updated);
      }
    }
  }, [leads]);

  // Lead Editing State inside detail modal
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBudget, setEditBudget] = useState<number | ''>('');
  const [editCpf, setEditCpf] = useState('');
  const [editRg, setEditRg] = useState('');
  const [editProfession, setEditProfession] = useState('');
  const [editCep, setEditCep] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editNeighborhood, setEditNeighborhood] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editComplement, setEditComplement] = useState('');
  const [isSearchingEditCep, setIsSearchingEditCep] = useState(false);
  const [editCepError, setEditCepError] = useState<string | null>(null);

  // Fifty editing state
  const [editIsFifty, setEditIsFifty] = useState(false);
  const [editPartnerName, setEditPartnerName] = useState('');
  const [editPartnerCreci, setEditPartnerCreci] = useState('');
  const [editPartnerEmail, setEditPartnerEmail] = useState('');
  const [editPartnerPhone, setEditPartnerPhone] = useState('');
  const [editPartnerPercentage, setEditPartnerPercentage] = useState<number>(50);
  const [editPartnerAgency, setEditPartnerAgency] = useState('');
  const [editPartnerNotes, setEditPartnerNotes] = useState('');

  // Legal Document Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalType, setDocModalType] = useState<LegalDocType>('contrato_corretagem');

  // Handle CEP lookup for New Lead
  const handleLookupNewCep = async (cepToQuery?: string) => {
    const raw = cepToQuery || newLeadCep;
    const clean = raw.replace(/\D/g, '');
    if (clean.length !== 8) {
      setNewCepError('Digite os 8 dígitos do CEP para buscar.');
      return;
    }

    setIsSearchingNewCep(true);
    setNewCepError(null);

    const res = await fetchAddressByCep(clean);
    setIsSearchingNewCep(false);

    if (res.success && res.data) {
      setNewLeadStreet(res.data.street || newLeadStreet);
      setNewLeadNeighborhood(res.data.neighborhood || newLeadNeighborhood);
      setNewLeadCity(res.data.city || newLeadCity);
      setNewLeadState(res.data.state || newLeadState);
      setNewLeadCep(res.data.zip);
    } else {
      setNewCepError(res.error || 'CEP não encontrado.');
    }
  };

  const handleNewCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setNewLeadCep(formatted);
    setNewCepError(null);
    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      handleLookupNewCep(digits);
    }
  };

  // Handle CEP lookup for Edit Lead
  const handleLookupEditCep = async (cepToQuery?: string) => {
    const raw = cepToQuery || editCep;
    const clean = raw.replace(/\D/g, '');
    if (clean.length !== 8) {
      setEditCepError('Digite os 8 dígitos do CEP.');
      return;
    }

    setIsSearchingEditCep(true);
    setEditCepError(null);

    const res = await fetchAddressByCep(clean);
    setIsSearchingEditCep(false);

    if (res.success && res.data) {
      setEditStreet(res.data.street || editStreet);
      setEditNeighborhood(res.data.neighborhood || editNeighborhood);
      setEditCity(res.data.city || editCity);
      setEditState(res.data.state || editState);
      setEditCep(res.data.zip);
    } else {
      setEditCepError(res.error || 'CEP não encontrado.');
    }
  };

  const handleEditCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setEditCep(formatted);
    setEditCepError(null);
    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      handleLookupEditCep(digits);
    }
  };

  const activeLeadsCount = leads.filter(l => !l.archived).length;
  const archivedLeadsCount = leads.filter(l => l.archived).length;

  const filteredLeads = leads.filter(l => {
    const isArchived = Boolean(l.archived);
    if (leadViewMode === 'ativos' && isArchived) return false;
    if (leadViewMode === 'arquivados' && !isArchived) return false;
    if (agentFilter !== 'todos' && l.agentId !== agentFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = l.name.toLowerCase().includes(term);
      const matchPhone = l.phone.includes(term);
      const matchEmail = l.email.toLowerCase().includes(term);
      if (!matchName && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) return;

    const fiftyData: FiftyPartnerInfo | undefined = newIsFiftyEnabled ? {
      enabled: true,
      partnerName: newPartnerName.trim() || 'Corretor Parceiro',
      partnerCreci: newPartnerCreci.trim() || 'CRECI 00000-F',
      partnerEmail: newPartnerEmail.trim() || 'parceiro@email.com',
      partnerPhone: newPartnerPhone.trim() || '(11) 90000-0000',
      partnerPercentage: Number(newPartnerPercentage) || 50,
      partnerAgency: newPartnerAgency.trim() || undefined,
      notes: newPartnerNotes.trim() || undefined
    } : undefined;

    const addressData = (newLeadStreet.trim() || newLeadCity.trim() || newLeadCep.trim()) ? {
      street: newLeadStreet.trim(),
      number: newLeadNumber.trim() || undefined,
      neighborhood: newLeadNeighborhood.trim(),
      city: newLeadCity.trim() || 'São Paulo',
      state: newLeadState.trim().toUpperCase() || 'SP',
      zip: newLeadCep.trim() || '01000-000',
      complement: newLeadComplement.trim() || undefined
    } : undefined;

    addLead(
      {
        name: newLeadName.trim(),
        email: newLeadEmail.trim() || 'cliente@email.com',
        phone: newLeadPhone.trim(),
        source: newLeadSource,
        preferredType: newLeadType,
        budgetMax: newLeadBudget ? Number(newLeadBudget) : undefined,
        stage: 'novo',
        agentId: newLeadAgent || currentUser?.id || users[0]?.id || 'usr_master_joel',
        cpfCnpj: newLeadCpf.trim() || undefined,
        rgIe: newLeadRg.trim() || undefined,
        profession: newLeadProfession.trim() || undefined,
        address: addressData,
        fifty: fiftyData
      },
      newLeadNote
    );

    addAuditLog({
      action: 'Cadastro de Novo Lead / Cliente',
      category: 'cliente',
      details: `Cadastrou o lead ${newLeadName.trim()} com telefone ${newLeadPhone.trim()}${newIsFiftyEnabled ? ' (Parceria Fifty ativada)' : ''}.`
    });

    setIsNewLeadOpen(false);
    resetNewLeadForm();
  };

  const resetNewLeadForm = () => {
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadNote('');
    setNewLeadBudget('');
    setNewLeadCpf('');
    setNewLeadRg('');
    setNewLeadProfession('');
    setNewLeadCep('');
    setNewLeadStreet('');
    setNewLeadNumber('');
    setNewLeadNeighborhood('');
    setNewLeadCity('São Paulo');
    setNewLeadState('SP');
    setNewLeadComplement('');
    setNewIsFiftyEnabled(false);
    setNewPartnerName('');
    setNewPartnerCreci('');
    setNewPartnerEmail('');
    setNewPartnerPhone('');
    setNewPartnerPercentage(50);
    setNewPartnerAgency('');
    setNewPartnerNotes('');
    setNewCepError(null);
  };

  const handleOpenLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveModalTab('info');
    setIsEditingLead(false);

    // Sync editing state
    setEditName(lead.name);
    setEditPhone(lead.phone);
    setEditEmail(lead.email);
    setEditBudget(lead.budgetMax || '');
    setEditCpf(lead.cpfCnpj || '');
    setEditRg(lead.rgIe || '');
    setEditProfession(lead.profession || '');
    setEditCep(lead.address?.zip || '');
    setEditStreet(lead.address?.street || '');
    setEditNumber(lead.address?.number || '');
    setEditNeighborhood(lead.address?.neighborhood || '');
    setEditCity(lead.address?.city || 'São Paulo');
    setEditState(lead.address?.state || 'SP');
    setEditComplement(lead.address?.complement || '');

    if (lead.fifty?.enabled) {
      setEditIsFifty(true);
      setEditPartnerName(lead.fifty.partnerName || '');
      setEditPartnerCreci(lead.fifty.partnerCreci || '');
      setEditPartnerEmail(lead.fifty.partnerEmail || '');
      setEditPartnerPhone(lead.fifty.partnerPhone || '');
      setEditPartnerPercentage(lead.fifty.partnerPercentage || 50);
      setEditPartnerAgency(lead.fifty.partnerAgency || '');
      setEditPartnerNotes(lead.fifty.notes || '');
    } else {
      setEditIsFifty(false);
      setEditPartnerName('');
      setEditPartnerCreci('');
      setEditPartnerEmail('');
      setEditPartnerPhone('');
      setEditPartnerPercentage(50);
      setEditPartnerAgency('');
      setEditPartnerNotes('');
    }
  };

  const handleSaveLeadEdit = () => {
    if (!selectedLead) return;

    const fiftyData: FiftyPartnerInfo | undefined = editIsFifty ? {
      enabled: true,
      partnerName: editPartnerName.trim() || 'Corretor Parceiro',
      partnerCreci: editPartnerCreci.trim() || 'CRECI 00000-F',
      partnerEmail: editPartnerEmail.trim() || 'parceiro@email.com',
      partnerPhone: editPartnerPhone.trim() || '(11) 90000-0000',
      partnerPercentage: Number(editPartnerPercentage) || 50,
      partnerAgency: editPartnerAgency.trim() || undefined,
      notes: editPartnerNotes.trim() || undefined
    } : undefined;

    const addressData = (editStreet.trim() || editCity.trim() || editCep.trim()) ? {
      street: editStreet.trim(),
      number: editNumber.trim() || undefined,
      neighborhood: editNeighborhood.trim(),
      city: editCity.trim() || 'São Paulo',
      state: editState.trim().toUpperCase() || 'SP',
      zip: editCep.trim() || '01000-000',
      complement: editComplement.trim() || undefined
    } : undefined;

    const updated: Lead = {
      ...selectedLead,
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      budgetMax: editBudget ? Number(editBudget) : undefined,
      cpfCnpj: editCpf.trim() || undefined,
      rgIe: editRg.trim() || undefined,
      profession: editProfession.trim() || undefined,
      address: addressData,
      fifty: fiftyData,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    updateLead(updated);
    setSelectedLead(updated);
    setIsEditingLead(false);

    addAuditLog({
      action: 'Atualização de Lead / Cliente',
      category: 'cliente',
      details: `Atualizou os dados cadastrais do lead ${updated.name}.`,
      entityId: updated.id
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteText.trim()) return;

    addLeadNote(selectedLead.id, noteText);
    setNoteText('');
  };

  const handleOpenDocModal = (docType: LegalDocType) => {
    setDocModalType(docType);
    setIsDocModalOpen(true);
  };

  const formatCurrency = (val?: number) => {
    if (!val) return 'Não especificado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleOpenWhatsapp = (phone: string, leadName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const num = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(`Olá ${leadName}! Sou da ${siteConfig.companyName}. Gostaria de conversar sobre as opções de imóveis para você.`);
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  const FINANCIAMENTO_STEPS = [
    { id: 'doc_recebidos', label: '1. Recebimento de Documentos (Vendedor + Comprador)' },
    { id: 'envio_correspondente', label: '2. Envio ao Correspondente Bancário' },
    { id: 'aprovado', label: '3. Financiamento Aprovado' },
    { id: 'condicionado', label: '4. Financiamento Condicionado' },
    { id: 'reprovado', label: '5. Financiamento Reprovado' },
  ];

  const CARTORIO_STEPS = [
    { id: 'docs_cartorio', label: '1. Documentos Recebidos (Vendedor + Comprador)' },
    { id: 'envio_cartorio', label: '2. Envio ao Cartório' },
    { id: 'escritura_agendada', label: '3. Escritura Agendada' },
    { id: 'minuta_enviada', label: '4. Minuta Enviada aos Clientes' },
    { id: 'escritura_lavrada', label: '5. Escritura Lavrada' },
  ];

  const handleSetNegotiationFlow = (flow: 'financiamento' | 'cartorio') => {
    if (!selectedLead) return;
    const defaultStep = flow === 'financiamento' ? 'doc_recebidos' : 'docs_cartorio';
    const updated: Lead = {
      ...selectedLead,
      negotiationFlow: flow,
      negotiationStep: selectedLead.negotiationStep || defaultStep,
      negotiationLogs: selectedLead.negotiationLogs || [
        {
          id: `log_${Date.now()}`,
          stepId: defaultStep,
          stepLabel: flow === 'financiamento' ? 'Recebimento de Documentos' : 'Documentos Recebidos',
          authorName: currentUser?.name || 'Administrador',
          timestamp: new Date().toLocaleString(),
          notes: 'Fluxo de negociação iniciado.'
        }
      ],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    updateLead(updated);
    setSelectedLead(updated);
  };

  const handleAdvanceNegotiationStep = (stepId: string, stepLabel: string) => {
    if (!selectedLead) return;
    const newLog = {
      id: `log_${Date.now()}`,
      stepId,
      stepLabel,
      authorName: currentUser?.name || 'Administrador',
      timestamp: new Date().toLocaleString(),
      notes: `Estágio avançado para: ${stepLabel}`
    };
    const updated: Lead = {
      ...selectedLead,
      negotiationStep: stepId,
      negotiationLogs: [newLog, ...(selectedLead.negotiationLogs || [])],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    updateLead(updated);
    setSelectedLead(updated);

    addAuditLog({
      action: 'Avanço de Estágio de Negociação',
      category: 'cliente',
      details: `Avançou negociação do lead ${selectedLead.name} para o estágio: ${stepLabel}`,
      entityId: selectedLead.id
    });
  };

  const [uploadPart, setUploadPart] = useState<'vendedor' | 'comprador'>('comprador');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocUrl, setUploadDocUrl] = useState('');

  const handleUploadNegDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !uploadDocName.trim()) return;

    const newDoc = {
      id: `ndoc_${Date.now()}`,
      part: uploadPart,
      name: uploadDocName.trim(),
      url: uploadDocUrl.trim() || '#',
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: currentUser?.name || 'Administrador'
    };

    const updated: Lead = {
      ...selectedLead,
      negotiationDocs: [...(selectedLead.negotiationDocs || []), newDoc],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    updateLead(updated);
    setSelectedLead(updated);
    setUploadDocName('');
    setUploadDocUrl('');
  };

  // Get lead documents (both stored in lead.documents or global documents referencing this lead)
  const leadDocs = selectedLead ? [
    ...(selectedLead.documents || []),
    ...documents.filter(d => d.leadId === selectedLead.id && !selectedLead.documents?.some(sd => sd.id === d.id))
  ] : [];

  // Get lead tasks
  const selectedLeadTasks = selectedLead ? crmTasks.filter(t => t.leadId === selectedLead.id) : [];
  const selectedLeadPendingTasks = selectedLeadTasks.filter(t => t.status === 'pendente');
  const selectedLeadOverdueTasks = selectedLeadPendingTasks.filter(t => t.dueDate < todayStr);

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6">
      
      {/* Top CRM Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  CRM Imobiliário & Tarefas
                </h1>
                <p className="text-xs text-slate-500">
                  Gestão de clientes, lembretes de atendimento com prazo de vencimento, documentos e parcerias Fifty.
                </p>
              </div>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCrmView('funil')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  crmView === 'funil'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Funil de Vendas</span>
              </button>

              <button
                type="button"
                onClick={() => setCrmView('tarefas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
                  crmView === 'tarefas'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tarefas</span>
                {pendingTasksCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    overdueTasksCount > 0
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {pendingTasksCount}
                  </span>
                )}
              </button>
            </div>

            {crmView === 'funil' && (
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setLeadViewMode('ativos')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    leadViewMode === 'ativos'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Ativos ({activeLeadsCount})
                </button>

                <button
                  type="button"
                  onClick={() => setLeadViewMode('arquivados')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    leadViewMode === 'arquivados'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Arquivados ({archivedLeadsCount})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Funil Filters Bar */}
        {crmView === 'funil' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar cliente, telefone, e-mail..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Filter by Agent */}
              <select
                value={agentFilter}
                onChange={e => setAgentFilter(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="todos">Todos os Corretores</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            {/* New Lead Button */}
            <button
              onClick={() => {
                resetNewLeadForm();
                setIsNewLeadOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Lead</span>
            </button>
          </div>
        )}
      </div>

      {/* RENDER VIEW: KANBAN OR TAREFAS */}
      {crmView === 'tarefas' ? (
        <CrmTarefas onOpenLeadDetail={lead => handleOpenLeadModal(lead)} />
      ) : (
        /* KANBAN BOARD */
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
          {STAGES.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage.id);

            return (
              <div
                key={stage.id}
                className="w-80 shrink-0 bg-slate-100/80 dark:bg-slate-800/60 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col max-h-[80vh]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{stage.label}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
                      {stageLeads.length}
                    </span>
                  </div>
                </div>

                {/* Leads Stack */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-2xl text-slate-400 text-xs font-medium">
                      Nenhum lead neste estágio
                    </div>
                  ) : (
                    stageLeads.map(lead => {
                      const agent = users.find(u => u.id === lead.agentId);
                      const prop = properties.find(p => p.id === lead.interestedPropertyId);
                      const leadTasks = crmTasks.filter(t => t.leadId === lead.id);
                      const leadPendingTasks = leadTasks.filter(t => t.status === 'pendente');
                      const leadOverdueTasks = leadPendingTasks.filter(t => t.dueDate < todayStr);

                      return (
                        <div
                          key={lead.id}
                          onClick={() => handleOpenLeadModal(lead)}
                          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                        >
                          {/* Lead Title & Agent */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                {lead.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Origem: {lead.source}
                              </span>
                            </div>
                            {agent && (
                              <img
                                src={agent.avatar}
                                alt={agent.name}
                                title={`Corretor: ${agent.name}`}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                            )}
                          </div>

                          {/* Fifty Badge if enabled */}
                          {lead.fifty?.enabled && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg text-[10px] font-bold">
                              <Handshake className="w-3 h-3" />
                              <span>Parceria Fifty {lead.fifty.partnerPercentage}% ({lead.fifty.partnerName.split(' ')[0]})</span>
                            </div>
                          )}

                          {/* Address preview if available */}
                          {lead.address?.neighborhood && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{lead.address.neighborhood}, {lead.address.city}</span>
                            </div>
                          )}

                          {/* Property interest preview */}
                          {prop && (
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-[11px] border border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
                              <Building className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                                {prop.code} - {prop.title}
                              </span>
                            </div>
                          )}

                          {/* Budget */}
                          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Orçamento:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {formatCurrency(lead.budgetMax)}
                            </span>
                          </div>

                          {/* Tasks Badge if pending */}
                          {leadPendingTasks.length > 0 && (
                            <div
                              onClick={e => {
                                e.stopPropagation();
                                handleOpenLeadModal(lead);
                                setActiveModalTab('tarefas');
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                                leadOverdueTasks.length > 0
                                  ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 hover:bg-red-100'
                                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100'
                              }`}
                              title="Ver tarefas deste contato"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {leadOverdueTasks.length > 0 ? (
                                  <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                                <span className="truncate">
                                  {leadOverdueTasks.length > 0
                                    ? `${leadOverdueTasks.length} tarefa(s) atrasada(s)`
                                    : `${leadPendingTasks.length} lembrete(s) ativo(s)`}
                                </span>
                              </div>
                              <span className="text-[10px] underline ml-1 shrink-0">Abrir</span>
                            </div>
                          )}

                          {/* Stage Selector & Actions */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                            <select
                              value={lead.stage}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateLeadStage(lead.id, e.target.value as PipelineStage)}
                              className="text-[10px] font-bold py-1 px-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 border-none focus:ring-1 focus:ring-indigo-500"
                            >
                              {STAGES.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1">
                              {/* Open Tasks Button */}
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleOpenLeadModal(lead);
                                  setActiveModalTab('tarefas');
                                }}
                                className="p-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-lg transition-colors relative"
                                title="Tarefas e Lembretes do Contato"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                                {leadPendingTasks.length > 0 && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                                    {leadPendingTasks.length}
                                  </span>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleOpenLeadModal(lead);
                                  setActiveModalTab('documentos');
                                }}
                                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors"
                                title="Documentos do Cliente"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleOpenWhatsapp(lead.phone, lead.name);
                                }}
                                className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                title="Conversar no WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>

                              {/* Archive or Restore */}
                              {lead.archived ? (
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    unarchiveLead(lead.id);
                                  }}
                                  className="p-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded-lg transition-colors"
                                  title="Reativar / Desarquivar Lead"
                                >
                                  <ArchiveRestore className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setArchiveModalConfig({
                                      isOpen: true,
                                      title: 'Arquivar Lead do CRM',
                                      itemType: 'lead',
                                      itemName: `${lead.name} (${lead.phone})`,
                                      onConfirm: async (reason) => {
                                        await archiveLead(lead.id, reason);
                                      }
                                    });
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-700 dark:hover:bg-amber-950/60 dark:hover:text-amber-300 text-slate-500 rounded-lg transition-colors"
                                  title="Arquivar Lead (Requer Motivo)"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete (Admin Only) */}
                              {currentUser?.role === 'admin' && (
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (confirm(`[ADMIN] Tem certeza que deseja excluir permanentemente o lead "${lead.name}"? Esta ação não pode ser desfeita.`)) {
                                      deleteLead(lead.id);
                                    }
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-700 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 text-slate-500 rounded-lg transition-colors"
                                  title="[Administrador] Excluir Lead Permanentemente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== NEW LEAD MODAL WITH CEP & FIFTY ==================== */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white">Cadastrar Novo Lead / Cliente</h3>
                <p className="text-xs text-slate-500">
                  Preencha os dados do cliente com consulta de CEP automática e controle de parceria Fifty.
                </p>
              </div>
              <button
                onClick={() => setIsNewLeadOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={newLeadName}
                    onChange={e => setNewLeadName(e.target.value)}
                    placeholder="Ex: Dra. Mariana Ribeiro Silveira"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={newLeadPhone}
                    onChange={e => setNewLeadPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">E-mail</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={e => setNewLeadEmail(e.target.value)}
                    placeholder="mariana.silveira@email.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">CPF / CNPJ</label>
                  <input
                    type="text"
                    value={newLeadCpf}
                    onChange={e => setNewLeadCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Profissão</label>
                  <input
                    type="text"
                    value={newLeadProfession}
                    onChange={e => setNewLeadProfession(e.target.value)}
                    placeholder="Ex: Médica, Advogado..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Canal de Origem</label>
                  <select
                    value={newLeadSource}
                    onChange={e => setNewLeadSource(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Site Direct">Site Imobiliária</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Portal VivaReal">VivaReal / ZAP</option>
                    <option value="Indicação">Indicação / Parceria</option>
                    <option value="Ligação Direta">Ligação Direta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Tipo de Imóvel</label>
                  <select
                    value={newLeadType}
                    onChange={e => setNewLeadType(e.target.value as PropertyType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="comercial">Comercial</option>
                    <option value="terreno">Terreno</option>
                    <option value="chacara">Chácara / Sítio</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Orçamento Máximo (R$)</label>
                  <input
                    type="number"
                    value={newLeadBudget}
                    onChange={e => setNewLeadBudget(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ex: 1200000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              </div>

              {/* ==================== ENDEREÇO COM CEP AUTOMÁTICO ==================== */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-black uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
                      Endereço do Cliente (Preenchimento Automático por CEP)
                    </span>
                  </div>
                  {isSearchingNewCep && (
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Consultando ViaCEP...</span>
                    </span>
                  )}
                </div>

                {newCepError && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{newCepError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      CEP
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newLeadCep}
                        onChange={handleNewCepChange}
                        placeholder="00000-000"
                        maxLength={9}
                        className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleLookupNewCep()}
                        disabled={isSearchingNewCep}
                        className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
                        title="Buscar endereço por CEP"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Logradouro / Rua
                    </label>
                    <input
                      type="text"
                      value={newLeadStreet}
                      onChange={e => setNewLeadStreet(e.target.value)}
                      placeholder="Rua, Avenida, Alameda..."
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={newLeadNumber}
                      onChange={e => setNewLeadNumber(e.target.value)}
                      placeholder="Ex: 120"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={newLeadNeighborhood}
                      onChange={e => setNewLeadNeighborhood(e.target.value)}
                      placeholder="Bairro"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={newLeadCity}
                      onChange={e => setNewLeadCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newLeadState}
                      onChange={e => setNewLeadState(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* ==================== FIFTY / INDICAÇÃO DE PARCERIA ==================== */}
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newIsFiftyEnabled}
                      onChange={e => setNewIsFiftyEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-black text-[12px] text-amber-950 dark:text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
                      <Handshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Fifty / Indicação de Corretor Parceiro
                    </span>
                  </label>
                  {newIsFiftyEnabled && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      Parceria Ativada
                    </span>
                  )}
                </div>

                {newIsFiftyEnabled && (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-150 border-t border-amber-200/60 dark:border-amber-900/40">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Nome do Parceiro *
                        </label>
                        <input
                          type="text"
                          required={newIsFiftyEnabled}
                          value={newPartnerName}
                          onChange={e => setNewPartnerName(e.target.value)}
                          placeholder="Ex: Roberto Mendes"
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          CRECI do Parceiro *
                        </label>
                        <input
                          type="text"
                          required={newIsFiftyEnabled}
                          value={newPartnerCreci}
                          onChange={e => setNewPartnerCreci(e.target.value)}
                          placeholder="CRECI 78910-F"
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          % Fifty (Honorários)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={newPartnerPercentage}
                          onChange={e => setNewPartnerPercentage(Number(e.target.value))}
                          placeholder="50"
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl font-bold text-amber-700 dark:text-amber-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Telefone / WhatsApp do Parceiro
                        </label>
                        <input
                          type="tel"
                          value={newPartnerPhone}
                          onChange={e => setNewPartnerPhone(e.target.value)}
                          placeholder="(11) 97777-5555"
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          E-mail do Parceiro
                        </label>
                        <input
                          type="email"
                          value={newPartnerEmail}
                          onChange={e => setNewPartnerEmail(e.target.value)}
                          placeholder="parceiro@imobiliaria.com"
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Broker assignment */}
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Corretor Responsável</label>
                <select
                  value={newLeadAgent}
                  onChange={e => setNewLeadAgent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role === 'admin' ? 'Gerente' : 'Corretor'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Nota Inicial de Atendimento</label>
                <textarea
                  rows={2}
                  value={newLeadNote}
                  onChange={e => setNewLeadNote(e.target.value)}
                  placeholder="Observações sobre perfil de busca, preferências, etc..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewLeadOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cadastrar Lead no CRM</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==================== LEAD DETAIL & DOCUMENTS MODAL ==================== */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
            
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 pr-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 inline-block">
                    {STAGES.find(s => s.id === selectedLead.stage)?.label}
                  </span>
                  {selectedLead.fifty?.enabled && (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 inline-flex items-center gap-1">
                      <Handshake className="w-3 h-3" /> Fifty {selectedLead.fifty.partnerPercentage}%
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedLead.name}</h3>
                <p className="text-xs text-slate-500">Cadastrado em {selectedLead.createdAt} via {selectedLead.source}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenWhatsapp(selectedLead.phone, selectedLead.name)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => setIsEditingLead(!isEditingLead)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditingLead ? 'Cancelar Edição' : 'Editar Dados'}</span>
                </button>

                {selectedLead.archived ? (
                  <button
                    onClick={() => {
                      unarchiveLead(selectedLead.id);
                    }}
                    className="px-3 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArchiveRestore className="w-4 h-4" />
                    <span>Reativar Lead</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setArchiveModalConfig({
                        isOpen: true,
                        title: 'Arquivar Lead do CRM',
                        itemType: 'lead',
                        itemName: `${selectedLead.name} (${selectedLead.phone})`,
                        onConfirm: async (reason) => {
                          await archiveLead(selectedLead.id, reason);
                        }
                      });
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-800 dark:hover:bg-amber-950/60 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    title="Arquivar lead com justificativa"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Arquivar</span>
                  </button>
                )}

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      if (confirm(`[ADMIN] Tem certeza que deseja excluir permanentemente o lead "${selectedLead.name}"? Esta ação não pode ser desfeita.`)) {
                        deleteLead(selectedLead.id);
                        setSelectedLead(null);
                      }
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    title="[Administrador] Excluir Lead Permanentemente"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                )}
              </div>
            </div>

            {/* Archived Alert Banner */}
            {selectedLead.archived && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Archive className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      Este Lead está arquivado no sistema
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300">
                      <strong>Motivo:</strong> {selectedLead.archiveReason || 'Não informado'} • <strong>Arquivado por:</strong> {selectedLead.archivedByName || 'Usuário'} em {selectedLead.archivedAt || 'data não registrada'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    unarchiveLead(selectedLead.id);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow"
                >
                  <ArchiveRestore className="w-3.5 h-3.5" />
                  <span>Reativar Lead</span>
                </button>
              </div>
            )}

            {/* Modal Tabs Navigation */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => { setActiveModalTab('info'); setIsEditingLead(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeModalTab === 'info'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Dados Cadastrais
              </button>

              <button
                onClick={() => { setActiveModalTab('documentos'); setIsEditingLead(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeModalTab === 'documentos'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Documentos & Contratos ({leadDocs.length})</span>
              </button>

              <button
                onClick={() => { setActiveModalTab('fifty'); setIsEditingLead(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeModalTab === 'fifty'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Fifty / Parceria {selectedLead.fifty?.enabled ? '✓' : ''}</span>
              </button>

              <button
                onClick={() => { setActiveModalTab('tarefas'); setIsEditingLead(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all relative ${
                  activeModalTab === 'tarefas'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tarefas ({selectedLeadTasks.length})</span>
                {selectedLeadPendingTasks.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    selectedLeadOverdueTasks.length > 0
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-indigo-900/60 text-white'
                  }`}>
                    {selectedLeadPendingTasks.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveModalTab('notas'); setIsEditingLead(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeModalTab === 'notas'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Histórico ({selectedLead.notes.length})</span>
              </button>

              <button
                onClick={() => { setActiveModalTab('negociacao'); setIsEditingLead(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeModalTab === 'negociacao'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Negociação & Fluxo</span>
              </button>
            </div>

            {/* TAB 1: DADOS CADASTRAIS (VIEW OR EDIT) */}
            {activeModalTab === 'info' && (
              <div className="space-y-4 text-xs">
                {isEditingLead ? (
                  /* EDITING FORM */
                  <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Edit className="w-4 h-4 text-indigo-600" />
                      <span>Editar Cadastro do Cliente</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 uppercase mb-1">Telefone / WhatsApp</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={e => setEditPhone(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-500 uppercase mb-1">E-mail</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 uppercase mb-1">CPF / CNPJ</label>
                        <input
                          type="text"
                          value={editCpf}
                          onChange={e => setEditCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 uppercase mb-1">Orçamento Máximo (R$)</label>
                        <input
                          type="number"
                          value={editBudget}
                          onChange={e => setEditBudget(e.target.value ? Number(e.target.value) : '')}
                          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-indigo-600"
                        />
                      </div>
                    </div>

                    {/* Address with CEP */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Endereço & CEP
                        </span>
                        {isSearchingEditCep && (
                          <span className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando CEP...
                          </span>
                        )}
                      </div>

                      {editCepError && (
                        <div className="p-2 bg-amber-50 text-amber-800 rounded-lg text-xs">
                          {editCepError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="block font-bold text-slate-500 uppercase text-[10px]">CEP</label>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={editCep}
                              onChange={handleEditCepChange}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleLookupEditCep()}
                              className="px-2 bg-indigo-600 text-white rounded-lg"
                            >
                              <Search className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-500 uppercase text-[10px]">Rua</label>
                          <input
                            type="text"
                            value={editStreet}
                            onChange={e => setEditStreet(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-500 uppercase text-[10px]">Número</label>
                          <input
                            type="text"
                            value={editNumber}
                            onChange={e => setEditNumber(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block font-bold text-slate-500 uppercase text-[10px]">Bairro</label>
                          <input
                            type="text"
                            value={editNeighborhood}
                            onChange={e => setEditNeighborhood(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-500 uppercase text-[10px]">Cidade</label>
                          <input
                            type="text"
                            value={editCity}
                            onChange={e => setEditCity(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-500 uppercase text-[10px]">UF</label>
                          <input
                            type="text"
                            maxLength={2}
                            value={editState}
                            onChange={e => setEditState(e.target.value.toUpperCase())}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingLead(false)}
                        className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveLeadEdit}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Salvar Alterações</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VIEW CARD */
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Telefone</span>
                        <span className="font-bold text-slate-900 dark:text-white">{selectedLead.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">E-mail</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedLead.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Orçamento Máximo</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(selectedLead.budgetMax)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">CPF / CNPJ</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLead.cpfCnpj || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Profissão</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLead.profession || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tipo Preferido</span>
                        <span className="font-bold capitalize text-slate-800 dark:text-slate-200">{selectedLead.preferredType || 'Qualquer'}</span>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                          Endereço Cadastrado
                        </span>
                      </div>
                      {selectedLead.address ? (
                        <p className="text-slate-700 dark:text-slate-300">
                          {selectedLead.address.street}
                          {selectedLead.address.number ? `, ${selectedLead.address.number}` : ''}
                          {selectedLead.address.complement ? ` - ${selectedLead.address.complement}` : ''}
                          <br />
                          {selectedLead.address.neighborhood} • {selectedLead.address.city} - {selectedLead.address.state}
                          <br />
                          <span className="font-mono text-slate-500 text-[11px]">CEP: {selectedLead.address.zip}</span>
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">Nenhum endereço cadastrado para este cliente. Clique em "Editar Dados" para adicionar.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DOCUMENTOS & CONTRATOS */}
            {activeModalTab === 'documentos' && (
              <div className="space-y-4 text-xs">
                
                {/* Generation Buttons */}
                <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Emitir Documento Jurídico para {selectedLead.name}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Modelos Padrão COFECI / CRECI</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleOpenDocModal('contrato_corretagem')}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-500 rounded-xl text-left font-bold text-slate-800 dark:text-slate-200 hover:shadow transition-all flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="block text-[11px] font-black">Contrato de Corretagem</span>
                        <span className="text-[10px] text-slate-400 font-normal">Prestação de serviços</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleOpenDocModal('contrato_parceria')}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-500 rounded-xl text-left font-bold text-slate-800 dark:text-slate-200 hover:shadow transition-all flex items-center gap-2"
                    >
                      <Handshake className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="block text-[11px] font-black">Contrato Fifty (Parceria)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Divisão de honorários</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleOpenDocModal('recibo_comissao')}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-500 rounded-xl text-left font-bold text-slate-800 dark:text-slate-200 hover:shadow transition-all flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="block text-[11px] font-black">Recibo de Comissão</span>
                        <span className="text-[10px] text-slate-400 font-normal">Lei 6.530/78 e CCB</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleOpenDocModal('recibo_aluguel')}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-500 rounded-xl text-left font-bold text-slate-800 dark:text-slate-200 hover:shadow transition-all flex items-center gap-2"
                    >
                      <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="block text-[11px] font-black">Recibo de Aluguel</span>
                        <span className="text-[10px] text-slate-400 font-normal">Locação e encargos</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleOpenDocModal('ficha_captacao')}
                      className="p-2.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-500 rounded-xl text-left font-bold text-slate-800 dark:text-slate-200 hover:shadow transition-all flex items-center gap-2"
                    >
                      <Building className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <span className="block text-[11px] font-black">Ficha de Atendimento</span>
                        <span className="text-[10px] text-slate-400 font-normal">Captação & visita</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* List of generated documents for this client */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>Documentos Arquivados ({leadDocs.length})</span>
                  </h4>

                  {leadDocs.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-2xl text-slate-400 text-xs">
                      Nenhum documento arquivado para este cliente ainda. Clique em um dos modelos acima para emitir.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {leadDocs.map(doc => (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="p-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-lg">
                              <FileCheck className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block text-xs">{doc.title}</span>
                              <span className="text-[10px] text-slate-400">
                                Emitido em {doc.createdAt} • Autor: {doc.authorName} • Status: {doc.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setDocModalType(doc.type);
                                setIsDocModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Abrir / Imprimir</span>
                            </button>

                            {/* Archive Document */}
                            {doc.archived ? (
                              <button
                                type="button"
                                onClick={() => unarchiveDocument(doc.id)}
                                className="p-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded-lg text-[10px] font-bold"
                                title="Desarquivar Documento"
                              >
                                <ArchiveRestore className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setArchiveModalConfig({
                                    isOpen: true,
                                    title: 'Arquivar Documento Emitido',
                                    itemType: 'documento',
                                    itemName: doc.title,
                                    onConfirm: async (reason) => {
                                      await archiveDocument(doc.id, reason);
                                    }
                                  });
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-700 dark:hover:bg-amber-950/60 text-slate-500 rounded-lg text-[10px]"
                                title="Arquivar Documento"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Document (Admin Only) */}
                            {currentUser?.role === 'admin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`[ADMIN] Deseja excluir permanentemente o documento "${doc.title}"?`)) {
                                    deleteDocument(doc.id);
                                  }
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-700 dark:hover:bg-rose-950/60 text-slate-500 rounded-lg text-[10px]"
                                title="[Administrador] Excluir Documento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: FIFTY / PARCERIA */}
            {activeModalTab === 'fifty' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                      <Handshake className="w-4 h-4 text-amber-600" />
                      Status da Parceria Fifty
                    </span>

                    {selectedLead.fifty?.enabled ? (
                      <span className="px-2.5 py-1 bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-200 rounded-full font-black text-[10px]">
                        ATIVA ({selectedLead.fifty.partnerPercentage}% de Honorários)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full font-bold text-[10px]">
                        INATIVA
                      </span>
                    )}
                  </div>

                  {selectedLead.fifty?.enabled ? (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-amber-900/60">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Corretor Parceiro</span>
                          <span className="font-bold text-slate-900 dark:text-white">{selectedLead.fifty.partnerName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">CRECI</span>
                          <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{selectedLead.fifty.partnerCreci}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Divisão Fifty</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">{selectedLead.fifty.partnerPercentage}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Telefone / WhatsApp</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLead.fifty.partnerPhone || 'Não informado'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">E-mail</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLead.fifty.partnerEmail || 'Não informado'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Imobiliária Parceira</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLead.fifty.partnerAgency || 'Autônomo'}</span>
                        </div>
                      </div>

                      {selectedLead.fifty.notes && (
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 border border-amber-200/80 dark:border-amber-900/60">
                          <span className="font-bold block text-[10px] text-slate-400 uppercase">Observações do Acordo:</span>
                          {selectedLead.fifty.notes}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleOpenDocModal('contrato_parceria')}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-2 shadow"
                        >
                          <Handshake className="w-4 h-4" />
                          <span>Gerar Contrato de Parceria (Fifty)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl space-y-3">
                      <p className="text-slate-500 text-xs">
                        Este cliente foi captado de forma direta. Caso este atendimento envolva divisão de honorários (Fifty) com outro corretor credenciado, você pode ativar a parceria clicando no botão abaixo:
                      </p>
                      <button
                        onClick={() => {
                          setIsEditingLead(true);
                          setActiveModalTab('info');
                          setEditIsFifty(true);
                        }}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-2 shadow"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Configurar Parceria Fifty</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: NEGOCIAÇÃO & FLUXO */}
            {activeModalTab === 'negociacao' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>Gestão de Estágios da Negociação</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">Selecione o fluxo adequado e acompanhe o andamento documentacional e jurídico.</p>
                  </div>
                  <button
                    onClick={() => {
                      const printContent = `
                        <html>
                          <head><title>Dossiê de Negociação - ${selectedLead.name}</title></head>
                          <body style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2>Dossiê de Negociação • ${siteConfig.companyName}</h2>
                            <hr/>
                            <p><strong>Cliente:</strong> ${selectedLead.name} (${selectedLead.email} - ${selectedLead.phone})</p>
                            <p><strong>Fluxo:</strong> ${selectedLead.negotiationFlow === 'financiamento' ? 'Financiamento (Correspondente)' : selectedLead.negotiationFlow === 'cartorio' ? 'Escritura em Cartório' : 'Não definido'}</p>
                            <p><strong>Estágio Atual:</strong> ${selectedLead.negotiationStep || 'Iniciando'}</p>
                            <h3>Documentos Anexados:</h3>
                            <ul>
                              ${(selectedLead.negotiationDocs || []).map(d => `<li>[${d.part.toUpperCase()}] ${d.name} (Enviado por ${d.uploadedBy} em ${d.uploadedAt})</li>`).join('')}
                            </ul>
                            <h3>Linha do Tempo (Logs):</h3>
                            <ul>
                              ${(selectedLead.negotiationLogs || []).map(l => `<li><strong>${l.timestamp}</strong> - ${l.stepLabel} (${l.authorName})</li>`).join('')}
                            </ul>
                          </body>
                        </html>
                      `;
                      const win = window.open('', '_blank');
                      if (win) {
                        win.document.write(printContent);
                        win.document.close();
                        win.print();
                      }
                    }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Exportar Dossiê (PDF)</span>
                  </button>
                </div>

                {!selectedLead.negotiationFlow ? (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">Escolha o tipo de fluxo de negociação para iniciar o acompanhamento:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => handleSetNegotiationFlow('financiamento')}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 shadow"
                      >
                        <Building className="w-4 h-4" />
                        <span>Fluxo A: Financiamento Bancário</span>
                      </button>
                      <button
                        onClick={() => handleSetNegotiationFlow('cartorio')}
                        className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Fluxo B: Escritura em Cartório</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Fluxo Ativo: <span className="text-indigo-600 dark:text-indigo-400 capitalize font-black">{selectedLead.negotiationFlow}</span>
                      </span>
                      <button
                        onClick={() => handleSetNegotiationFlow(selectedLead.negotiationFlow === 'financiamento' ? 'cartorio' : 'financiamento')}
                        className="text-[11px] text-indigo-600 hover:underline font-bold"
                      >
                        Alternar Fluxo
                      </button>
                    </div>

                    {/* Step Progression */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <h5 className="font-bold text-slate-900 dark:text-white">Estágios do Processo</h5>
                      <div className="space-y-2">
                        {(selectedLead.negotiationFlow === 'financiamento' ? FINANCIAMENTO_STEPS : CARTORIO_STEPS).map((step, idx) => {
                          const isCurrent = selectedLead.negotiationStep === step.id;
                          return (
                            <div
                              key={step.id}
                              onClick={() => handleAdvanceNegotiationStep(step.id, step.label)}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isCurrent
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 font-bold text-indigo-900 dark:text-indigo-200 shadow-xs'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                  {idx + 1}
                                </div>
                                <span>{step.label}</span>
                              </div>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase">Atual</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Document Upload by Part (Vendedor vs Comprador) */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <span>Documentação por Parte (Vendedor & Comprador)</span>
                      </h5>

                      <form onSubmit={handleUploadNegDoc} className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                        <select
                          value={uploadPart}
                          onChange={e => setUploadPart(e.target.value as 'vendedor' | 'comprador')}
                          className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                        >
                          <option value="comprador">Comprador</option>
                          <option value="vendedor">Vendedor</option>
                        </select>
                        <input
                          type="text"
                          required
                          value={uploadDocName}
                          onChange={e => setUploadDocName(e.target.value)}
                          placeholder="Nome do documento (ex: RG, CPF, Matrícula)..."
                          className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                        <input
                          type="text"
                          value={uploadDocUrl}
                          onChange={e => setUploadDocUrl(e.target.value)}
                          placeholder="Link ou URL do arquivo (opcional)"
                          className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Anexar</span>
                        </button>
                      </form>

                      {/* Documents List */}
                      <div className="space-y-2 pt-2 max-h-36 overflow-y-auto">
                        {(!selectedLead.negotiationDocs || selectedLead.negotiationDocs.length === 0) ? (
                          <p className="text-slate-400 text-center py-2">Nenhum documento anexado a esta negociação ainda.</p>
                        ) : (
                          selectedLead.negotiationDocs.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${doc.part === 'vendedor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'}`}>
                                  {doc.part.toUpperCase()}
                                </span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>Por {doc.uploadedBy} em {doc.uploadedAt}</span>
                                {doc.url && doc.url !== '#' && (
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-bold flex items-center gap-1">
                                    <span>Ver</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                {doc.archived ? (
                                  <button
                                    type="button"
                                    onClick={() => unarchiveNegotiationDoc(selectedLead.id, doc.id)}
                                    className="p-1 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded"
                                    title="Desarquivar"
                                  >
                                    <ArchiveRestore className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setArchiveModalConfig({
                                        isOpen: true,
                                        title: 'Arquivar Documento de Negociação',
                                        itemType: 'documento',
                                        itemName: doc.name,
                                        onConfirm: async (reason) => {
                                          await archiveNegotiationDoc(selectedLead.id, doc.id, reason);
                                        }
                                      });
                                    }}
                                    className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded"
                                    title="Arquivar documento"
                                  >
                                    <Archive className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {currentUser?.role === 'admin' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`[ADMIN] Excluir documento "${doc.name}" permanentemente?`)) {
                                        deleteNegotiationDoc(selectedLead.id, doc.id);
                                      }
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded"
                                    title="[Admin] Excluir documento"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Timeline Log */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>Linha do Tempo da Negociação</span>
                      </h5>
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {(!selectedLead.negotiationLogs || selectedLead.negotiationLogs.length === 0) ? (
                          <p className="text-slate-400 text-center py-2">Nenhum registro na linha do tempo.</p>
                        ) : (
                          selectedLead.negotiationLogs.map(log => (
                            <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <p className="font-bold text-slate-800 dark:text-slate-200">{log.stepLabel}</p>
                                <p className="text-[10px] text-slate-400">{log.notes || 'Estágio atualizado'} • por {log.authorName}</p>
                              </div>
                              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{log.timestamp}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: NOTAS & INTERAÇÕES */}
            {activeModalTab === 'notas' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Histórico de Atendimento ({selectedLead.notes.length})</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedLead.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                      Nenhuma anotação registrada ainda.
                    </p>
                  ) : (
                    selectedLead.notes.map(note => (
                      <div key={note.id} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                          <span className="text-indigo-600 dark:text-indigo-400">{note.authorName}</span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    required
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Adicionar nova observação ou histórico de ligação..."
                    className="flex-1 p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 5: TAREFAS & LEMBRETES VINCULADOS */}
            {activeModalTab === 'tarefas' && (
              <div className="pt-1">
                <CrmTarefas filterLeadId={selectedLead.id} />
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==================== LEGAL DOCUMENTS MODAL ==================== */}
      <DocumentosJuridicosModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        lead={selectedLead}
        initialDocType={docModalType}
      />

      {/* ==================== ARCHIVE REASON MODAL ==================== */}
      {archiveModalConfig && (
        <ArchiveReasonModal
          isOpen={archiveModalConfig.isOpen}
          onClose={() => setArchiveModalConfig(null)}
          title={archiveModalConfig.title}
          itemType={archiveModalConfig.itemType}
          itemName={archiveModalConfig.itemName}
          onConfirm={archiveModalConfig.onConfirm}
        />
      )}

    </div>
  );
};
