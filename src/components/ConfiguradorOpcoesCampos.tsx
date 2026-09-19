import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfigurableFieldCategory, ConfigurableOption } from '../types';
import { CONFIGURABLE_CATEGORIES_LABELS } from '../utils/defaultConfigurableOptions';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Power,
  Search,
  Building2,
  MapPin,
  Mountain,
  TreePine,
  Sparkles,
  Award,
  Palette,
  Layout,
  Star,
  MessageCircle,
  List,
  Code,
  Tag,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  EyeOff
} from 'lucide-react';

const CATEGORY_ICONS: Record<ConfigurableFieldCategory, React.ElementType> = {
  tipo_imovel: Building2,
  caracteristica_imovel: Sparkles,
  caracteristica_empreendimento: ShieldCheck,
  caracteristica_regiao: MapPin,
  tarja_foto: Award,
  topografia: Mountain,
  ocupacao_uso: TreePine,
  estagio_negociacao: Sliders,
  paleta_tom: Palette,
  quadro_banner: Layout,
  quadro_vitrine: Star,
  rede_social: MessageCircle,
  item_rodape: List,
  bloco_conteudo: Code,
  finalidade: Tag
};

export const ConfiguradorOpcoesCampos: React.FC = () => {
  const {
    configurableOptions,
    addConfigurableOption,
    deleteConfigurableOption,
    toggleConfigurableOptionStatus,
    reorderConfigurableOptions,
    renameConfigurableOption,
    properties,
    currentUser
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ConfigurableFieldCategory | 'todas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  
  // New option form state
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [newOptionCategory, setNewOptionCategory] = useState<ConfigurableFieldCategory>('tipo_imovel');
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Edit / Rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editCascade, setEditCascade] = useState(true);

  // Delete confirmation modal
  const [deletingOption, setDeletingOption] = useState<ConfigurableOption | null>(null);
  const [deleteCleanupCascade, setDeleteCleanupCascade] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const categories: ConfigurableFieldCategory[] = [
    'tipo_imovel',
    'caracteristica_imovel',
    'caracteristica_empreendimento',
    'caracteristica_regiao',
    'tarja_foto',
    'topografia',
    'ocupacao_uso',
    'estagio_negociacao',
    'paleta_tom',
    'quadro_banner',
    'quadro_vitrine',
    'rede_social',
    'item_rodape',
    'bloco_conteudo',
    'finalidade'
  ];

  // Calculate usage in properties and records
  const getUsageCount = (opt: ConfigurableOption): number => {
    let count = 0;
    properties.forEach(p => {
      if (opt.category === 'tipo_imovel' && (p.type === opt.value || p.type === opt.label)) {
        count++;
      } else if (opt.category === 'caracteristica_imovel' && p.features) {
        if (p.features.includes(opt.label) || p.features.includes(opt.value)) count++;
      } else if (opt.category === 'caracteristica_regiao' && p.featuresRegiao) {
        if (p.featuresRegiao.includes(opt.label) || p.featuresRegiao.includes(opt.value)) count++;
      } else if (opt.category === 'caracteristica_empreendimento' && p.featuresEmpreendimento) {
        if (p.featuresEmpreendimento.includes(opt.label) || p.featuresEmpreendimento.includes(opt.value)) count++;
      } else if (opt.category === 'topografia' && (p.topografia === opt.value || p.topografia === opt.label)) {
        count++;
      } else if (opt.category === 'ocupacao_uso' && (p.ocupacaoUso === opt.value || p.ocupacaoUso === opt.label)) {
        count++;
      } else if (opt.category === 'tarja_foto' && (p.tarja === opt.label || p.tarja === opt.value)) {
        count++;
      } else if (opt.category === 'finalidade' && (p.purpose === opt.label || p.purpose === opt.value)) {
        count++;
      }
    });
    return count;
  };

  // Filter options
  const filteredOptions = configurableOptions.filter(opt => {
    if (selectedCategory !== 'todas' && opt.category !== selectedCategory) {
      return false;
    }
    if (statusFilter === 'ativos' && !opt.active) return false;
    if (statusFilter === 'inativos' && opt.active) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const catLabel = (CONFIGURABLE_CATEGORIES_LABELS[opt.category] || '').toLowerCase();
      return (
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        catLabel.includes(q)
      );
    }
    return true;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);

    if (!newOptionLabel.trim()) {
      setAddError('Por favor, digite o nome da opção.');
      return;
    }

    const res = await addConfigurableOption(newOptionCategory, newOptionLabel);
    if (!res.success) {
      setAddError(res.error || 'Erro ao adicionar opção.');
    } else {
      setAddSuccess(`Opção "${newOptionLabel}" salva e disponível imediatamente em novos cadastros!`);
      setNewOptionLabel('');
      setTimeout(() => {
        setAddSuccess(null);
        setIsAddingOpen(false);
      }, 1500);
    }
  };

  const handleStartEdit = (opt: ConfigurableOption) => {
    setEditingId(opt.id);
    setEditLabel(opt.label);
    setEditCascade(true);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editLabel.trim()) return;
    await renameConfigurableOption(id, editLabel, editCascade);
    setEditingId(null);
    setActionSuccessMessage(`Opção alterada com sucesso para "${editLabel}"!`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditLabel('');
  };

  const handleMove = async (opt: ConfigurableOption, direction: 'up' | 'down') => {
    const sameCategory = configurableOptions
      .filter(o => o.category === opt.category)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const currentIndex = sameCategory.findIndex(o => o.id === opt.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sameCategory.length) return;

    const reordered = [...sameCategory];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    await reorderConfigurableOptions(opt.category, reordered.map(o => o.id));
  };

  const openDeleteModal = (opt: ConfigurableOption) => {
    setDeletingOption(opt);
    setDeleteCleanupCascade(false);
    setMasterPasswordInput('');
    setDeletePasswordError(null);
  };

  const handleSoftDelete = async () => {
    if (!deletingOption) return;
    await toggleConfigurableOptionStatus(deletingOption.id);
    setActionSuccessMessage(`Opção "${deletingOption.label}" desativada (soft delete). Não aparecerá em novos cadastros.`);
    setDeletingOption(null);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!deletingOption) return;
    setDeletePasswordError(null);

    // Require admin or master pass verification if not already authenticated
    const isAdmin = currentUser?.role === 'admin' || currentUser?.isMasterAdmin;
    if (!isAdmin && masterPasswordInput !== 'Joel@2026') {
      setDeletePasswordError('Apenas administradores com senha master podem excluir itens definitivamente.');
      return;
    }

    const optLabel = deletingOption.label;
    const res = await deleteConfigurableOption(deletingOption.id, deleteCleanupCascade);
    if (res.success) {
      setActionSuccessMessage(`Item "${optLabel}" excluído com sucesso! Registro salvo no histórico de auditoria.`);
      setDeletingOption(null);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } else {
      setDeletePasswordError(res.error || 'Erro ao excluir item.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Central de Gerenciamento & Exclusão Segura</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Itens e Campos Configuráveis
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            Gerencie todos os itens adicionáveis do sistema: tipos de imóvel (incluindo Sobrado), diferenciais, 
            características de lazer e região, topografia, ocupação/uso, tarjas de foto, estágios de negociação, 
            paletas, quadros e blocos. Exclua com segurança sem quebrar dados existentes ou desative com 1 clique.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddingOpen(true);
            if (selectedCategory !== 'todas') {
              setNewOptionCategory(selectedCategory);
            }
          }}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 shrink-0 text-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Item / Opção</span>
        </button>
      </div>

      {/* Categories & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('todas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === 'todas'
                ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>Todas as Categorias</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/20">
              {configurableOptions.length}
            </span>
          </button>

          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat] || Sliders;
            const count = configurableOptions.filter(o => o.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{CONFIGURABLE_CATEGORIES_LABELS[cat] || cat}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/20">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar item por nome ou código..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Status:</span>
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'todos'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('ativos')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'ativos'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setStatusFilter('inativos')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'inativos'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Inativos (Pausados)
            </button>
          </div>
        </div>
      </div>

      {/* Add New Option Form */}
      {isAddingOpen && (
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-500/30 dark:border-indigo-500/40 rounded-3xl p-6 shadow-md animate-in fade-in zoom-in duration-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-base">Cadastrar Novo Item / Opção</h3>
            </div>
            <button
              onClick={() => {
                setIsAddingOpen(false);
                setAddError(null);
                setAddSuccess(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {addError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          {addSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{addSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Categoria do Campo *
              </label>
              <select
                value={newOptionCategory}
                onChange={e => setNewOptionCategory(e.target.value as ConfigurableFieldCategory)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {CONFIGURABLE_CATEGORIES_LABELS[cat] || cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Nome do Novo Item *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newOptionLabel}
                  onChange={e => setNewOptionLabel(e.target.value)}
                  placeholder="Ex: Sobrado Triplex, Tarja Lançamento, Piscina Aquecida..."
                  className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Item</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Options Table / List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {filteredOptions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              Nenhum item encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Nenhum item corresponde ao filtro ou busca selecionada. Use o botão "+ Novo Item / Opção" para cadastrar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-14 text-center">Ordem</th>
                  <th className="py-3.5 px-4">Nome do Item</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4 text-center">Uso Atual</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações de Exclusão & Edição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOptions.map((opt) => {
                  const Icon = CATEGORY_ICONS[opt.category] || Sliders;
                  const usage = getUsageCount(opt);
                  const isEditing = editingId === opt.id;

                  return (
                    <tr
                      key={opt.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        !opt.active ? 'opacity-50 bg-slate-50/40 dark:bg-slate-900/40' : ''
                      }`}
                    >
                      {/* Reorder Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMove(opt, 'up')}
                            title="Mover para cima"
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(opt, 'down')}
                            title="Mover para baixo"
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Option Label / Rename Form */}
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {isEditing ? (
                          <div className="flex flex-col gap-1.5 py-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editLabel}
                                onChange={e => setEditLabel(e.target.value)}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-indigo-400 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(opt.id)}
                                className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                title="Salvar alteração"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                                title="Cancelar"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editCascade}
                                onChange={e => setEditCascade(e.target.checked)}
                                className="rounded text-indigo-600"
                              />
                              <span>Atualizar também os registros já cadastrados com este nome</span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{opt.label}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-normal">
                              ({opt.value})
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold">
                          <Icon className="w-3 h-3 text-indigo-500" />
                          <span>{CONFIGURABLE_CATEGORIES_LABELS[opt.category] || opt.category}</span>
                        </span>
                      </td>

                      {/* Usage Count Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            usage > 0
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {usage} {usage === 1 ? 'imóvel vinculado' : 'imóveis vinculados'}
                        </span>
                      </td>

                      {/* Status Active / Inactive */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleConfigurableOptionStatus(opt.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all ${
                            opt.active
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300'
                          }`}
                          title={opt.active ? 'Clique para desativar (Soft Delete)' : 'Clique para reativar'}
                        >
                          <Power className="w-3 h-3" />
                          <span>{opt.active ? 'Ativo' : 'Inativo (Pausado)'}</span>
                        </button>
                      </td>

                      {/* Action Buttons: Rename & Delete with Trash */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(opt)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Editar / Renomear"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(opt)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Excluir este item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Advanced Safe Deletion Confirmation Modal */}
      {deletingOption && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 rounded-2xl flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Confirmação de Exclusão Segura
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Deseja realmente excluir "{deletingOption.label}"?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Categoria: <strong className="text-slate-700 dark:text-slate-200">{CONFIGURABLE_CATEGORIES_LABELS[deletingOption.category] || deletingOption.category}</strong>
                </p>
              </div>
            </div>

            {/* Usage Analysis Box */}
            {(() => {
              const usageCount = getUsageCount(deletingOption);
              return usageCount > 0 ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Item atualmente vinculado a {usageCount} {usageCount === 1 ? 'imóvel' : 'imóveis'}</span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                    A exclusão segura garante que os {usageCount} imóveis <strong>NÃO serão corrompidos nem quebrarão no site</strong>. O item apenas deixará de aparecer em novos formulários de cadastro.
                  </p>
                  
                  <label className="flex items-center gap-2 pt-2 border-t border-amber-200 dark:border-amber-800/40 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteCleanupCascade}
                      onChange={e => setDeleteCleanupCascade(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Remover também este item dos {usageCount} imóveis existentes agora</span>
                  </label>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span><strong>Nenhum registro vinculado:</strong> A exclusão deste item é 100% segura e não afeta nenhum imóvel.</span>
                </div>
              );
            })()}

            {/* Error Message */}
            {deletePasswordError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deletePasswordError}</span>
              </div>
            )}

            {/* Optional Master Password input if needed */}
            {!(currentUser?.role === 'admin' || currentUser?.isMasterAdmin) && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Senha Master de Administrador *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={masterPasswordInput}
                    onChange={e => setMasterPasswordInput(e.target.value)}
                    placeholder="Digite a senha master para autorizar..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Audit Log info */}
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Esta operação será registrada com data, hora e responsável no log de auditoria do CRM.</span>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingOption(null)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSoftDelete}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                title="Pausa a opção sem deletar do histórico"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Desativar Apenas (Soft Delete)</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Definitivamente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
