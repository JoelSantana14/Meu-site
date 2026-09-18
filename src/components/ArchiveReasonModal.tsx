import React, { useState } from 'react';
import { Archive, X, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ArchiveReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  title: string;
  itemType: 'lead' | 'imovel' | 'documento';
  itemName: string;
}

const PRESET_REASONS: Record<'lead' | 'imovel' | 'documento', string[]> = {
  lead: [
    'Cliente comprou outro imóvel',
    'Desistiu da negociação',
    'Sem retorno / Contato inacessível',
    'Orçamento incompatível no momento',
    'Atendimento transferido para parceiro',
    'Lead duplicado no sistema'
  ],
  imovel: [
    'Vendido diretamente pelo proprietário',
    'Locado diretamente pelo proprietário',
    'Suspenso a pedido do proprietário',
    'Documentação do imóvel pendente / irregular',
    'Reavaliação comercial necessária',
    'Contrato de exclusividade encerrado'
  ],
  documento: [
    'Minuta substituída por versão atualizada',
    'Negociação cancelada pelas partes',
    'Erro de digitação / dados cadastrais incorretos',
    'Documento vencido ou sem validade jurídica',
    'Solicitação do cliente / proprietário'
  ]
};

export const ArchiveReasonModal: React.FC<ArchiveReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemType,
  itemName
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = PRESET_REASONS[itemType] || PRESET_REASONS.lead;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanReason = reason.trim();
    if (!cleanReason) {
      setError('Por favor, informe ou selecione o motivo do arquivamento.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(cleanReason);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Ocorreu um erro ao arquivar o item. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0 border border-amber-500/20">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Item selecionado: <strong className="text-slate-700 dark:text-slate-200 font-bold">{itemName}</strong>
            </p>
          </div>
        </div>

        {/* Notice about notification to Admin & Reception */}
        <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Notificação Obrigatória</span>
          </div>
          <p className="text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
            O arquivamento está disponível para toda a equipe. O motivo informado será gravado no histórico de auditoria e <strong>notificado imediatamente ao Administrador e à Recepção</strong>.
          </p>
        </div>

        {/* Reason Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Selecione uma justificativa rápida:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setReason(p);
                  setError(null);
                }}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition-all text-left ${
                  reason === p
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Ou detalhe o motivo do arquivamento <span className="text-red-500">*</span>:
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={e => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Explique detalhadamente o motivo para a administração e recepção..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/50 p-2.5 rounded-xl border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              <Archive className="w-4 h-4" />
              <span>{isSubmitting ? 'Arquivando...' : 'Confirmar Arquivamento'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
