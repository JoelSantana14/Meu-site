import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Property, Lead, LegalDocType, GeneratedDocument, User } from '../types';
import {
  generateLegalDocumentContent,
  exportDocumentToPdfOrPrint,
  formatDocCurrency,
  DocumentContextData
} from '../utils/legalDocuments';
import {
  FileText,
  Printer,
  Download,
  Save,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Edit3,
  Copy,
  Check,
  AlertCircle,
  FileCheck,
  Building,
  UserCheck,
  RefreshCw
} from 'lucide-react';

interface DocumentosJuridicosModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  lead?: Lead | null;
  agent?: User | null;
  initialDocType?: LegalDocType;
}

export const DocumentosJuridicosModal: React.FC<DocumentosJuridicosModalProps> = ({
  isOpen,
  onClose,
  property,
  lead,
  agent,
  initialDocType = 'ficha_captacao'
}) => {
  const {
    siteConfig,
    currentUser,
    users,
    addAuditLog,
    saveDocument
  } = useApp();

  const [selectedType, setSelectedType] = useState<LegalDocType>(initialDocType);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form custom parameters
  const [ownerName, setOwnerName] = useState('Carlos Alberto de Souza');
  const [ownerCpf, setOwnerCpf] = useState('123.456.789-00');
  const [ownerRg, setOwnerRg] = useState('12.345.678-9 SSP/SP');
  const [ownerPhone, setOwnerPhone] = useState('(11) 98765-4321');
  const [ownerEmail, setOwnerEmail] = useState('carlos.proprietario@email.com');
  const [ownerAddress, setOwnerAddress] = useState('Av. Brigadeiro Faria Lima, 2000, Apto 82, São Paulo - SP');

  const [tenantName, setTenantName] = useState(lead?.name || 'Mariana Ribeiro Silveira');
  const [tenantCpf, setTenantCpf] = useState(lead?.cpfCnpj || '987.654.321-99');
  const [contractValue, setContractValue] = useState<number>(property?.price || 450000);
  const [commissionPct, setCommissionPct] = useState<number>(6);
  const [commissionValue, setCommissionValue] = useState<number>((property?.price || 450000) * 0.06);
  const [referencePeriod, setReferencePeriod] = useState('Mês Atual / 2026');
  const [isExclusive, setIsExclusive] = useState(true);
  const [exclusiveMonths, setExclusiveMonths] = useState(6);

  // Partner fifty fields
  const [partnerName, setPartnerName] = useState(property?.fifty?.partnerName || lead?.fifty?.partnerName || 'Roberto Mendes');
  const [partnerCreci, setPartnerCreci] = useState(property?.fifty?.partnerCreci || lead?.fifty?.partnerCreci || 'CRECI 78910-F');
  const [partnerEmail, setPartnerEmail] = useState(property?.fifty?.partnerEmail || lead?.fifty?.partnerEmail || 'roberto@parceiro.com.br');
  const [partnerPhone, setPartnerPhone] = useState(property?.fifty?.partnerPhone || lead?.fifty?.partnerPhone || '(11) 97777-5555');
  const [partnerPercentage, setPartnerPercentage] = useState(property?.fifty?.partnerPercentage || lead?.fifty?.partnerPercentage || 50);

  const effectiveAgent = agent || currentUser || users[0];

  useEffect(() => {
    if (initialDocType) {
      setSelectedType(initialDocType);
    }
  }, [initialDocType]);

  // Recalculate content whenever parameters change
  const refreshContent = () => {
    const ctx: DocumentContextData = {
      property,
      lead,
      agent: effectiveAgent,
      siteConfig,
      customData: {
        ownerName,
        ownerCpf,
        ownerRg,
        ownerPhone,
        ownerEmail,
        ownerAddress,
        tenantName,
        tenantCpf,
        contractValue,
        commissionPct,
        commissionValue: (contractValue * commissionPct) / 100,
        referencePeriod,
        isExclusive,
        exclusiveMonths,
        partnerName,
        partnerCreci,
        partnerEmail,
        partnerPhone,
        partnerPercentage
      }
    };

    const res = generateLegalDocumentContent(selectedType, ctx);
    setDocTitle(res.title);
    setDocContent(res.content);
  };

  useEffect(() => {
    refreshContent();
  }, [
    selectedType,
    property,
    lead,
    ownerName,
    ownerCpf,
    ownerRg,
    ownerPhone,
    ownerEmail,
    ownerAddress,
    tenantName,
    tenantCpf,
    contractValue,
    commissionPct,
    referencePeriod,
    isExclusive,
    exclusiveMonths,
    partnerName,
    partnerCreci,
    partnerEmail,
    partnerPhone,
    partnerPercentage
  ]);

  if (!isOpen) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportPdf = () => {
    exportDocumentToPdfOrPrint(docTitle, docContent, siteConfig);

    // Register action in log
    if (addAuditLog) {
      addAuditLog({
        action: 'Emissão e Impressão de Documento Jurídico',
        category: 'documento',
        details: `Emitiu ${docTitle} em PDF/Impressão para o imóvel ${property?.code || 'N/A'}.`,
        entityId: property?.id || lead?.id
      });
    }
  };

  const handleSaveDocument = () => {
    const newDoc: GeneratedDocument = {
      id: `DOC-${Date.now()}`,
      type: selectedType,
      title: docTitle,
      content: docContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorName: currentUser?.name || 'Administrador',
      authorId: currentUser?.id || 'admin',
      propertyId: property?.id,
      propertyCode: property?.code,
      propertyTitle: property?.title,
      leadId: lead?.id,
      leadName: lead?.name,
      agentId: effectiveAgent?.id,
      agentName: effectiveAgent?.name,
      partnerName: selectedType === 'contrato_parceria' ? partnerName : undefined,
      value: contractValue,
      status: 'emitido'
    };

    if (saveDocument) {
      saveDocument(newDoc);
    }

    if (addAuditLog) {
      addAuditLog({
        action: 'Salvamento e Arquivamento de Minuta Jurídica',
        category: 'documento',
        details: `Arquivou documento '${docTitle}' com validade jurídica no cadastro.`,
        entityId: property?.id || lead?.id
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const docTypesList: { id: LegalDocType; title: string; badge: string; desc: string }[] = [
    {
      id: 'ficha_captacao',
      title: '1. Ficha de Captação Completa',
      badge: 'Lei 6.530/78',
      desc: 'Autorização expressa de venda/locação, dados do imóvel, condições, exclusividade e honorários.'
    },
    {
      id: 'recibo_aluguel',
      title: '2. Recibo de Aluguel',
      badge: 'Lei 8.245/91',
      desc: 'Quitação locatícia mensal com rateio de condomínio, IPTU e competência.'
    },
    {
      id: 'recibo_comissao',
      title: '3. Recibo de Comissão',
      badge: 'Arts. 722-729 CCB',
      desc: 'Quitação de honorários de corretagem com detalhamento da transação imobiliária.'
    },
    {
      id: 'contrato_parceria',
      title: '4. Contrato de Parceria (Fifty)',
      badge: 'Co-Corretagem',
      desc: 'Divisão de honorários (50/50 ou personalizado), deveres e foro entre corretores parceiros.'
    },
    {
      id: 'contrato_corretagem',
      title: '5. Contrato de Prestação de Serviços',
      badge: 'Minuta Jurídica',
      desc: 'Contrato completo de corretagem com exclusividade, percentual CRECI e vigência.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  Módulo de Documentos & Minutas Jurídicas
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                  Válido Conforme Lei 6.530/78
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {property ? `Imóvel: ${property.code} - ${property.title}` : lead ? `Cliente: ${lead.name}` : 'Modelos Jurídicos Profissionais'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* Left Column: Template Selection & Live Parameters (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 space-y-5 bg-slate-50 dark:bg-slate-900/60 overflow-y-auto">
            
            {/* Template Selector Buttons */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Selecione o Modelo Jurídico:
              </label>
              <div className="space-y-2">
                {docTypesList.map(dt => (
                  <button
                    key={dt.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(dt.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-start gap-2.5 ${
                      selectedType === dt.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${selectedType === dt.id ? 'text-amber-300' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold">{dt.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          selectedType === dt.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {dt.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 leading-snug ${selectedType === dt.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {dt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Custom Parameters for Chosen Document */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Dados das Partes & Parâmetros
                </span>
                <button
                  type="button"
                  onClick={refreshContent}
                  title="Atualizar texto da minuta"
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Recalcular</span>
                </button>
              </div>

              {/* Proprietary fields */}
              {(selectedType === 'ficha_captacao' || selectedType === 'contrato_corretagem' || selectedType === 'recibo_aluguel' || selectedType === 'recibo_comissao') && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Proprietário(a) / Locador(a):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome do Proprietário"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="CPF/CNPJ"
                      value={ownerCpf}
                      onChange={e => setOwnerCpf(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Tenant / Lead fields */}
              {(selectedType === 'recibo_aluguel') && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Locatário(a) / Inquilino:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome do Inquilino"
                      value={tenantName}
                      onChange={e => setTenantName(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="CPF Inquilino"
                      value={tenantCpf}
                      onChange={e => setTenantCpf(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Fifty partner fields */}
              {selectedType === 'contrato_parceria' && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    Dados do Corretor Parceiro (Fifty):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome do Parceiro"
                      value={partnerName}
                      onChange={e => setPartnerName(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="CRECI do Parceiro"
                      value={partnerCreci}
                      onChange={e => setPartnerCreci(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="E-mail"
                      value={partnerEmail}
                      onChange={e => setPartnerEmail(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Telefone"
                      value={partnerPhone}
                      onChange={e => setPartnerPhone(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="text-[11px] text-slate-500 font-bold">Divisão (% parceiro):</label>
                    <input
                      type="number"
                      min={10}
                      max={90}
                      value={partnerPercentage}
                      onChange={e => setPartnerPercentage(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center font-bold"
                    />
                    <span className="text-xs text-slate-500 font-bold">% ({100 - partnerPercentage}% para você)</span>
                  </div>
                </div>
              )}

              {/* Financial values */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block">Valor de Referência (R$):</label>
                  <input
                    type="number"
                    value={contractValue}
                    onChange={e => setContractValue(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block">Comissão (%):</label>
                  <input
                    type="number"
                    value={commissionPct}
                    onChange={e => setCommissionPct(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Exclusive Checkbox for Ficha e Contrato */}
              {(selectedType === 'ficha_captacao' || selectedType === 'contrato_corretagem') && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isExclusive}
                      onChange={e => setIsExclusive(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Com Exclusividade de Venda</span>
                  </label>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                    Vigência: {exclusiveMonths} meses
                  </span>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Live Document Preview & Editor (7 Cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 overflow-y-auto">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {docTitle}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isEditing ? 'Modo de Edição Manual Ativo' : 'Visualização da Minuta'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    isEditing
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Concluir Edição' : 'Editar Minuta'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Document Text Box */}
            <div className="flex-1 min-h-[320px] max-h-[440px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shadow-inner">
              {isEditing ? (
                <textarea
                  value={docContent}
                  onChange={e => setDocContent(e.target.value)}
                  className="w-full h-full min-h-[300px] bg-transparent text-xs font-mono text-slate-800 dark:text-slate-200 outline-none resize-none leading-relaxed"
                />
              ) : (
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {docContent}
                </pre>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Documento arquivado com sucesso no cadastro!</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleSaveDocument}
                  className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black rounded-xl transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar & Arquivar</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Exportar em PDF / Imprimir</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
