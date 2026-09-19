import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  User,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SiteConfig, User as AppUser, PropertyType } from '../types';

interface FooterLeadCaptureProps {
  siteConfig: SiteConfig;
  users: AppUser[];
  onAddLead: (leadData: any, initialNote?: string) => void;
  onSimulateLeadWeb: (lead: { name: string; email: string; phone: string; message?: string }) => void;
  onShowToast?: (msg: string) => void;
}

export const FooterLeadCapture: React.FC<FooterLeadCaptureProps> = ({
  siteConfig,
  users,
  onAddLead,
  onSimulateLeadWeb,
  onShowToast
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState<'comprar' | 'alugar' | 'vender' | 'investir' | 'duvida'>('comprar');
  const [preferredType, setPreferredType] = useState<PropertyType | 'todos'>('todos');
  const [message, setMessage] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Direct phone / WhatsApp
  const contactPhone = siteConfig.brokerPhone || siteConfig.phone || '11999999999';
  const rawDigits = contactPhone.replace(/\D/g, '');
  const cleanPhone = rawDigits.startsWith('55') ? rawDigits : `55${rawDigits}`;
  const contactEmail = siteConfig.brokerEmail || siteConfig.email || 'contato@imobiliaria.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      if (onShowToast) onShowToast('Por favor, preencha seu nome e telefone.');
      return;
    }

    if (!lgpdConsent) {
      if (onShowToast) onShowToast('Por favor, aceite os termos de privacidade para continuar.');
      return;
    }

    setIsSubmitting(true);

    const purposeLabels = {
      comprar: 'Comprar Imóvel',
      alugar: 'Alugar Imóvel',
      vender: 'Vender / Avaliar Imóvel',
      investir: 'Investimento Imobiliário',
      duvida: 'Dúvidas Gerais / Outro'
    };

    const assignedAgent = users.find(u => u.isMasterAdmin) || users[0];
    const initialNote = `SOLICITAÇÃO DE CONTATO (Rodapé da Vitrine):
- Finalidade: ${purposeLabels[purpose]}
${preferredType !== 'todos' ? `- Tipo preferido: ${preferredType}` : ''}
- Mensagem do visitante: ${message.trim() || 'Solicitou informações de contato e consultoria.'}
- Data/Hora: ${new Date().toLocaleString('pt-BR')}`;

    try {
      // 1. Add lead to database (Firestore + Local)
      onAddLead({
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@lead-web.com`,
        phone: phone.trim(),
        source: 'site_vitrine_rodape',
        stage: 'novo',
        agentId: assignedAgent?.id || 'usr_master_joel',
        preferredType: preferredType !== 'todos' ? preferredType : undefined
      }, initialNote);

      // 2. Trigger real-time web simulation / audio alert
      onSimulateLeadWeb({
        name: name.trim(),
        email: email.trim() || 'lead-site@cliente.com',
        phone: phone.trim(),
        message: `Solicitou contato no rodapé: ${purposeLabels[purpose]}. ${message.trim()}`
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onShowToast) onShowToast('Solicitação enviada com sucesso! Entraremos em contato em breve.');
    } catch (err) {
      console.error('Erro ao enviar lead:', err);
      setIsSubmitting(false);
      if (onShowToast) onShowToast('Ocorreu um erro ao enviar. Tente novamente.');
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <section id="contato-rodape" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl">
        {/* Subtle Ambient Gradient Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-14 items-center">
          
          {/* Left Column: Value Proposition & Direct Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Atendimento Exclusivo</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Fale Diretamente com Nossos Especialistas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Quer agendar uma visita, tirar dúvidas sobre financiamento ou encontrar um imóvel sob medida? Deixe seus dados e retornaremos com atendimento rápido e personalizado.
              </p>
            </div>

            {/* Benefit Bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/30">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Retorno Ágil</h4>
                  <p className="text-[11px] text-slate-400">Resposta em até 2 horas em horário comercial.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Consultoria Sem Compromisso</h4>
                  <p className="text-[11px] text-slate-400">Total transparência, avaliação documental e assessoria de crédito.</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Olá! Gostaria de mais informações sobre os imóveis.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-emerald-600 hover:text-white transition-all border border-slate-700/60 group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-white group-hover:text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-emerald-100">WhatsApp Direto</p>
                  <p className="text-xs font-bold truncate text-white">{siteConfig.brokerPhone || siteConfig.phone || '(11) 99999-9999'}</p>
                </div>
              </a>

              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-indigo-600 hover:text-white transition-all border border-slate-700/60 group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:bg-white group-hover:text-indigo-700 flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-indigo-100">E-mail</p>
                  <p className="text-xs font-bold truncate text-white">{contactEmail}</p>
                </div>
              </a>
            </div>

            {/* CRECI Badge */}
            {siteConfig.brokerCreci && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Credenciamento Profissional: <strong>{siteConfig.brokerCreci}</strong></span>
              </div>
            )}
          </div>

          {/* Right Column: Lead Capture Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800/95 text-slate-900 dark:text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700/80 relative">
            
            {isSuccess ? (
              <div className="py-8 px-4 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Solicitação Recebida com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Obrigado pelo contato, <strong>{name}</strong>. Nossa equipe entrará em contato pelo telefone <strong>{phone}</strong> em instantes.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Olá! Meu nome é ${name}. Enviei uma mensagem pelo site solicitando contato sobre: ${purpose}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Falar no WhatsApp Agora</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
                  >
                    Enviar Outra Mensagem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    Solicite Contato & Informações
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Preencha seus dados abaixo para receber consultoria especializada.
                  </p>
                </div>

                {/* Purpose Selector Chips */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Qual é o seu objetivo?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'comprar', label: 'Comprar' },
                      { id: 'alugar', label: 'Alugar' },
                      { id: 'vender', label: 'Vender/Avaliar' },
                      { id: 'investir', label: 'Investir' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPurpose(item.id as any)}
                        className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all text-center border ${
                          purpose === item.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Phone and Email in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      E-mail (opcional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Property Type (Optional) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Tipo de Imóvel de Interesse
                  </label>
                  <select
                    value={preferredType}
                    onChange={e => setPreferredType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="todos">Qualquer tipo / A definir com corretor</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa Residencial</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="terreno">Terreno / Lote</option>
                    <option value="chacara">Chácara / Sítio</option>
                    <option value="comercial">Imóvel Comercial / Sala / Salão</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Como podemos ajudar? (Mensagem)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Ex: Procuro imóvel na faixa de R$ 500 mil com 2 ou 3 dormitórios, ou gostaria de avaliar meu imóvel..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* LGPD Consent Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={lgpdConsent}
                    onChange={e => setLgpdConsent(e.target.checked)}
                    required
                    className="mt-0.5 w-3.5 h-3.5 accent-indigo-600 rounded shrink-0 cursor-pointer"
                  />
                  <span>
                    Concordo em fornecer meus dados de contato para que a equipe de atendimento entre em contato comigo, em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Enviando dados...</span>
                  ) : (
                    <>
                      <span>Solicitar Contato & Consultoria</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
