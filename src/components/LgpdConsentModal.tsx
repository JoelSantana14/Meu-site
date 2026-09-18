import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Cookie,
  X,
  Check,
  Send,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Eye,
  Trash2,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';
import { SiteConfig } from '../types';

interface LgpdConsentProps {
  siteConfig: SiteConfig;
}

export const LgpdConsentModal: React.FC<LgpdConsentProps> = ({ siteConfig }) => {
  // Banner visibility state
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'rights' | 'preferences' | null>(null);

  // Cookie Preference States
  const [consentState, setConsentState] = useState<{
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
  }>({
    essential: true,
    analytics: true,
    marketing: false
  });

  // Rights Form State
  const [rightsForm, setRightsForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
    requestType: 'acesso' as 'acesso' | 'correcao' | 'exclusao' | 'revogacao' | 'portabilidade',
    details: '',
    acceptedTerms: false
  });
  const [rightsSuccessMsg, setRightsSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (siteConfig.showLgpdBanner === false) {
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, [siteConfig.showLgpdBanner]);

  const handleAcceptAll = () => {
    const fullConsent = { essential: true, analytics: true, marketing: true, timestamp: new Date().toISOString() };
    localStorage.setItem('imobipro_lgpd_consent', JSON.stringify(fullConsent));
    setConsentState(fullConsent);
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const minimalConsent = { essential: true, analytics: false, marketing: false, timestamp: new Date().toISOString() };
    localStorage.setItem('imobipro_lgpd_consent', JSON.stringify(minimalConsent));
    setConsentState(minimalConsent);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const customConsent = { ...consentState, timestamp: new Date().toISOString() };
    localStorage.setItem('imobipro_lgpd_consent', JSON.stringify(customConsent));
    setShowBanner(false);
    setActiveModal(null);
  };

  const handleSubmitRightsRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightsForm.acceptedTerms) {
      alert('Você precisa aceitar os termos de solicitação conforme a LGPD.');
      return;
    }

    const logEntry = {
      id: `lgpd_req_${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      fullName: rightsForm.fullName,
      email: rightsForm.email,
      phone: rightsForm.phone,
      cpf: rightsForm.cpf,
      requestType: rightsForm.requestType,
      details: rightsForm.details,
      status: 'Pendente (Prazo de resposta: 15 dias)'
    };

    const existingReqs = JSON.parse(localStorage.getItem('imobipro_lgpd_requests') || '[]');
    existingReqs.push(logEntry);
    localStorage.setItem('imobipro_lgpd_requests', JSON.stringify(existingReqs));

    setRightsSuccessMsg(
      `Sua solicitação de ${rightsForm.requestType.toUpperCase()} foi registrada sob o protocolo LGPD-${logEntry.id.slice(-6)}. Nosso Encarregado de Dados (DPO) responderá para o e-mail ${rightsForm.email} no prazo legal de até 15 dias.`
    );

    setRightsForm({
      fullName: '',
      email: '',
      phone: '',
      cpf: '',
      requestType: 'acesso',
      details: '',
      acceptedTerms: false
    });
  };

  const companyName = siteConfig.companyName || 'Joel Santana Corretor de Imóveis';
  const creciText = siteConfig.creciFisico || siteConfig.brokerCreci || 'CRECI Regularizado';
  const dpoEmail = siteConfig.email || 'dpo@joelsantanacorretor.com.br';
  const dpoPhone = siteConfig.phone || '(16) 99765-4321';

  return (
    <>
      {/* Floating LGPD Cookie Banner - Discreet & Compact */}
      {showBanner && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md w-full mx-4 sm:mx-0 p-4 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 text-white shadow-2xl rounded-2xl animate-in slide-in-from-bottom duration-300 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0 mt-0.5 border border-indigo-500/30">
              <Cookie className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Privacidade e LGPD</span>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="text-[11px] text-indigo-400 hover:underline font-semibold"
                >
                  Política
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {siteConfig.lgpdBannerText || 'Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de privacidade e LGPD.'}
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setActiveModal('preferences')}
                  className="text-[11px] text-slate-400 hover:text-white underline font-medium"
                >
                  Preferências
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRejectNonEssential}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg transition-all"
                  >
                    Apenas essenciais
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg shadow transition-all flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Aceitar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: COOKIE PREFERENCES */}
      {activeModal === 'preferences' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Gerenciar Preferências de Cookies</h3>
                  <p className="text-xs text-slate-500">Ajuste suas permissões conforme a LGPD</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Essential */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Cookies Essenciais (Obrigatório)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                      Ativo
                    </span>
                  </span>
                  <p className="text-slate-500 leading-relaxed">
                    Necessários para o funcionamento seguro do portal, prevenção de fraudes e manutenção do seu estado de navegação.
                  </p>
                </div>
                <input type="checkbox" checked disabled className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-not-allowed" />
              </div>

              {/* Analytics */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">Cookies de Desempenho e Analytics</span>
                  <p className="text-slate-500 leading-relaxed">
                    Nos ajudam a entender quais imóveis e regiões são mais buscados, permitindo melhorar continuamente a experiência do usuário.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentState.analytics}
                  onChange={e => setConsentState({ ...consentState, analytics: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* Marketing */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">Cookies de Marketing e Parcerias</span>
                  <p className="text-slate-500 leading-relaxed">
                    Utilizados para sugerir lançamentos imobiliários personalizados de acordo com o seu perfil de interesse.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentState.marketing}
                  onChange={e => setConsentState({ ...consentState, marketing: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all"
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRIVACY POLICY */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-slate-900 dark:text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Política de Privacidade e Proteção de Dados</h3>
                  <p className="text-xs text-slate-500">Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 pr-2 leading-relaxed flex-1">
              <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200">
                <p className="font-bold">Controlador do Tratamento de Dados:</p>
                <p>{companyName} • {creciText}</p>
                <p>Encarregado de Dados (DPO): {dpoEmail} | {dpoPhone}</p>
              </div>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">1. Coleta e Finalidade dos Dados</h4>
              <p>
                Coletamos dados pessoais (nome, e-mail, telefone/WhatsApp, perfil de preferência de imóvel e histórico de agendamento de visitas) estritamente para as seguintes finalidades legais:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Atendimento a solicitações de informações sobre imóveis anunciados.</li>
                <li>Agendamento e confirmação de visitas presenciais ou virtuais com o corretor credenciado.</li>
                <li>Elaboração de propostas de compra, venda ou locação imobiliária.</li>
                <li>Cumprimento de obrigações legais perante o COAF e Conselho Regional de Corretores de Imóveis (CRECI).</li>
              </ul>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">2. Compartilhamento Seguro</h4>
              <p>
                Seus dados nunca serão vendidos a terceiros. O compartilhamento ocorre exclusivamente quando necessário para a concretização do negócio imobiliário (ex.: cartórios, instituições financeiras para financiamento habitacional e proprietários autorizados).
              </p>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">3. Segurança e Retenção de Dados</h4>
              <p>
                Adotamos medidas técnicas e organizacionais de segurança, incluindo criptografia de tráfego (SSL/TLS), controle de acesso restrito e armazenamentos isolados. Os dados são mantidos pelo período necessário ao cumprimento da finalidade ou prazos prescricionais legais.
              </p>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">4. Seus Direitos (Art. 18 da LGPD)</h4>
              <p>
                Você possui o direito de solicitar a qualquer momento a confirmação da existência de tratamento, acesso aos seus dados, correção de inconsistências, eliminação ou revogação de consentimento através do nosso portal de direitos do titular.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <button
                onClick={() => setActiveModal('rights')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Exercer Direitos de Titular</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TERMS OF USE */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-slate-900 dark:text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Termos de Uso do Portal Imobiliário</h3>
                  <p className="text-xs text-slate-500">Condições gerais para navegação e utilização do sistema</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 pr-2 leading-relaxed flex-1">
              <h4 className="font-black text-slate-900 dark:text-white text-sm">1. Aceitação dos Termos</h4>
              <p>
                Ao navegar no portal imobiliário {companyName}, você concorda com as disposições estabelecidas nestes Termos de Uso e em nossa Política de Privacidade.
              </p>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">2. Veracidade e Atualização das Informações</h4>
              <p>
                Todos os anúncios de imóveis, preços, disponibilidade e especificações são revisados continuamente. No entanto, os valores e disponibilidade estão sujeitos a alterações sem aviso prévio conforme determinação dos proprietários.
              </p>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">3. Propriedade Intelectual</h4>
              <p>
                As fotos, marcas, layouts, marcas d'água e descrições dos imóveis contidas neste site são protegidas por direitos de propriedade intelectual mantidos por {companyName}. É vedada a reprodução não autorizada.
              </p>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">4. Uso Responsável</h4>
              <p>
                O usuário compromete-se a fornecer informações verdadeiras ao preencher formulários de contato ou agendamento de visitas, abstendo-se de praticar atos fraudulentos ou spam.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DATA SUBJECT RIGHTS PORTAL (ART. 18 LGPD) */}
      {activeModal === 'rights' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-slate-900 dark:text-white max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Portal de Direitos do Titular de Dados</h3>
                  <p className="text-xs text-slate-500">Solicitação formal com respaldo no Art. 18 da LGPD</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setRightsSuccessMsg(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs pr-1 flex-1">
              {rightsSuccessMsg ? (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3 text-emerald-900 dark:text-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Solicitação Registrada com Sucesso!</span>
                  </div>
                  <p className="leading-relaxed">{rightsSuccessMsg}</p>
                  <button
                    onClick={() => setRightsSuccessMsg(null)}
                    className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                  >
                    Fazer Nova Solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRightsRequest} className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                    Preencha o formulário abaixo para exercer seus direitos garantidos pela LGPD. Nossa equipe de privacidade validará sua identidade para responder com segurança.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={rightsForm.fullName}
                        onChange={e => setRightsForm({ ...rightsForm, fullName: e.target.value })}
                        placeholder="Seu nome"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail Cadastrado *</label>
                      <input
                        type="email"
                        required
                        value={rightsForm.email}
                        onChange={e => setRightsForm({ ...rightsForm, email: e.target.value })}
                        placeholder="seu-email@exemplo.com"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp</label>
                      <input
                        type="text"
                        value={rightsForm.phone}
                        onChange={e => setRightsForm({ ...rightsForm, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Solicitação *</label>
                      <select
                        value={rightsForm.requestType}
                        onChange={e => setRightsForm({ ...rightsForm, requestType: e.target.value as any })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                      >
                        <option value="acesso">Confirmar Existência e Acessar Meus Dados</option>
                        <option value="correcao">Corrigir Dados Incompletos ou Desatualizados</option>
                        <option value="exclusao">Eliminação / Exclusão de Dados Pessoais</option>
                        <option value="revogacao">Revogação de Consentimento</option>
                        <option value="portabilidade">Portabilidade dos Dados</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detalhes da Solicitação</label>
                    <textarea
                      rows={3}
                      value={rightsForm.details}
                      onChange={e => setRightsForm({ ...rightsForm, details: e.target.value })}
                      placeholder="Descreva detalhes específicos caso queira (ex.: excluir histórico de busca por imóveis)..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={rightsForm.acceptedTerms}
                      onChange={e => setRightsForm({ ...rightsForm, acceptedTerms: e.target.checked })}
                      className="mt-0.5 w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      Declaro que sou o titular dos dados informados e estou ciente de que o atendimento requererá validação prévia de identidade.
                    </span>
                  </label>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitação LGPD</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
