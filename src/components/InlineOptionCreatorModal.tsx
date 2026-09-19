import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfigurableFieldCategory, ConfigurableOption } from '../types';
import { CONFIGURABLE_CATEGORIES_LABELS } from '../utils/defaultConfigurableOptions';
import {
  Plus,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Trash2,
  List,
  AlertTriangle,
  Power
} from 'lucide-react';

interface InlineOptionCreatorModalProps {
  isOpen: boolean;
  category: ConfigurableFieldCategory;
  onClose: () => void;
  onOptionCreated: (newOption: ConfigurableOption) => void;
}

export const InlineOptionCreatorModal: React.FC<InlineOptionCreatorModalProps> = ({
  isOpen,
  category,
  onClose,
  onOptionCreated
}) => {
  const {
    addConfigurableOption,
    deleteConfigurableOption,
    toggleConfigurableOptionStatus,
    configurableOptions,
    properties
  } = useApp();

  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion state inside modal
  const [deletingOpt, setDeletingOpt] = useState<ConfigurableOption | null>(null);

  if (!isOpen) return null;

  const categoryLabel = CONFIGURABLE_CATEGORIES_LABELS[category] || category;
  const currentCategoryOptions = configurableOptions.filter(o => o.category === category);

  // Usage count helper
  const getUsageCount = (opt: ConfigurableOption): number => {
    let count = 0;
    properties.forEach(p => {
      if (opt.category === 'tipo_imovel' && (p.type === opt.value || p.type === opt.label)) count++;
      else if (opt.category === 'caracteristica_imovel' && p.features && (p.features.includes(opt.label) || p.features.includes(opt.value))) count++;
      else if (opt.category === 'caracteristica_regiao' && p.featuresRegiao && (p.featuresRegiao.includes(opt.label) || p.featuresRegiao.includes(opt.value))) count++;
      else if (opt.category === 'caracteristica_empreendimento' && p.featuresEmpreendimento && (p.featuresEmpreendimento.includes(opt.label) || p.featuresEmpreendimento.includes(opt.value))) count++;
      else if (opt.category === 'topografia' && (p.topografia === opt.value || p.topografia === opt.label)) count++;
      else if (opt.category === 'ocupacao_uso' && (p.ocupacaoUso === opt.value || p.ocupacaoUso === opt.label)) count++;
      else if (opt.category === 'tarja_foto' && (p.tarja === opt.label || p.tarja === opt.value)) count++;
    });
    return count;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = label.trim();
    if (!clean) {
      setError('Por favor, informe o nome da opção.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await addConfigurableOption(category, clean);
    setIsSubmitting(false);

    if (!res.success || !res.option) {
      setError(res.error || 'Erro ao cadastrar opção.');
      return;
    }

    onOptionCreated(res.option);
    setLabel('');
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!deletingOpt) return;
    const optLabel = deletingOpt.label;
    await deleteConfigurableOption(deletingOpt.id);
    setDeletingOpt(null);
    setSuccessMsg(`Opção "${optLabel}" excluída com sucesso!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Opções de {categoryLabel}
              </h3>
              <p className="text-[11px] text-slate-500 font-bold">
                Adicione novas opções ou exclua as existentes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Adicionar Nova Opção</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Gerenciar / Excluir ({currentCategoryOptions.length})</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 shrink-0">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Add New Option */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Nome da Nova Opção *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder={`Ex: Nova opção para ${categoryLabel}...`}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Esta opção ficará salva no banco de dados e sincronizada na nuvem com segurança.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Salvando...' : 'Salvar & Selecionar'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Manage & Delete Existing Options */}
        {activeTab === 'manage' && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {deletingOpt ? (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500/40 rounded-2xl space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Deseja realmente excluir "{deletingOpt.label}"?</span>
                </div>
                {(() => {
                  const usage = getUsageCount(deletingOpt);
                  return usage > 0 ? (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400">
                      Este item está em uso por <strong>{usage} imóvel(is)</strong>. A exclusão segura não danifica os dados já salvos no catálogo.
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Nenhum imóvel vinculado. A exclusão é 100% segura.
                    </p>
                  );
                })()}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDeletingOpt(null)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirmar Exclusão</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl max-h-64">
              {currentCategoryOptions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Nenhuma opção cadastrada nesta categoria.
                </div>
              ) : (
                currentCategoryOptions.map(opt => {
                  const usage = getUsageCount(opt);
                  return (
                    <div
                      key={opt.id}
                      className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${opt.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {opt.label}
                        </span>
                        {usage > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold shrink-0">
                            {usage} {usage === 1 ? 'imóvel' : 'imóveis'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleConfigurableOptionStatus(opt.id)}
                          className={`p-1.5 rounded-lg transition-colors text-xs ${
                            opt.active
                              ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={opt.active ? 'Desativar (Soft Delete)' : 'Reativar'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingOpt(opt)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Excluir esta opção"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
