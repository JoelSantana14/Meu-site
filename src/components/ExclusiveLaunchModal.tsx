import React, { useState, useEffect } from 'react';
import { SiteConfig, User } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Send,
  Building2,
  ChevronRight,
  Phone,
  Clock,
  Eye,
  Check
} from 'lucide-react';

interface ExclusiveLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  users: User[];
}

export const ExclusiveLaunchModal: React.FC<ExclusiveLaunchModalProps> = ({
  isOpen,
  onClose,
  siteConfig,
  users
}) => {
  const { addVisit, simulateNewLeadWeb, addAuditLog } = useApp();
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // Scheduling Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const exclusive = siteConfig.exclusiveLaunch || {
    enabled: true,
    badge: 'Lançamento Exclusivo • Joel Santana',
    title: 'Residencial Grand Horizon',
    subtitle: 'Alto padrão e sofisticação com condições exclusivas direto com a construtora.',
    description: 'Um projeto concebido para proporcionar o máximo conforto, segurança e valorização patrimonial com infraestrutura completa de lazer estilo resort.',
    price: 'A partir de R$ 980.000',
    location: 'Zona Sul Nobre, São José do Rio Preto - SP',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
    features: [
      'Plantas inteligentes e acabamento de alto padrão',
      'Varanda gourmet integrada com vista panorâmica',
      'Vagas de garagem cobertas com infraestrutura elétrica',
      'Portaria blindada e segurança 24h com controle de acesso',
      'Piscina aquecida, academia equipada e espaço gourmet',
      'Localização privilegiada com fácil acesso às principais vias'
    ],
    ctaText: 'Quero Conhecer o Lançamento',
    ctaWhatsappMsg: 'Olá Joel Santana! Gostaria de receber a apresentação completa, plantas e tabela de preços do lançamento exclusivo.',
    statusTag: 'Obras Iniciadas'
  };

  const images = [exclusive.imageUrl, exclusive.secondaryImageUrl].filter(Boolean) as string[];
  const activeImage = images[selectedPhotoIdx] || images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80';

  const cleanWhatsapp = (siteConfig.whatsapp || siteConfig.brokerWhatsapp || '5517991951473').replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    exclusive.ctaWhatsappMsg || `Olá Joel Santana! Gostaria de saber mais sobre o lançamento ${exclusive.title}.`
  )}`;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Por favor, preencha pelo menos seu nome e WhatsApp para contato.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const broker = users.find(u => u.role === 'admin' || u.id === 'usr_master_joel') || users[0];

      // Register visit appointment if date was chosen
      if (date && time) {
        addVisit({
          propertyId: `launch_${exclusive.title.replace(/\s+/g, '_').toLowerCase()}`,
          agentId: broker?.id || 'usr_master_joel',
          date,
          time,
          status: 'pendente',
          clientName: name.trim(),
          clientPhone: phone.trim(),
          clientEmail: email.trim() || undefined,
          notes: `Interesse em Lançamento Exclusivo: ${exclusive.title}. ${notes}`
        });
      }

      // Create lead in CRM
      simulateNewLeadWeb({
        name: name.trim(),
        email: email.trim() || 'cliente@lancamento.com',
        phone: phone.trim(),
        propertyId: `launch_${exclusive.title.replace(/\s+/g, '_').toLowerCase()}`,
        message: `Solicitou apresentação do ${exclusive.title}. ${date ? `Agendamento pretendido: ${date} às ${time}.` : ''} Mensagem: ${notes}`
      });

      addAuditLog({
        action: 'Interesse em Lançamento VIP',
        category: 'lead',
        details: `Cliente ${name.trim()} (${phone.trim()}) solicitou apresentação de ${exclusive.title}.`
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting launch interest:', err);
      setErrorMessage('Não foi possível enviar sua solicitação. Por favor, utilize o botão de WhatsApp direto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white dark:bg-slate-900 w-full h-full overflow-y-auto p-4 sm:p-8 lg:p-12 animate-fade-in flex flex-col"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-7xl mx-auto flex-1 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{exclusive.badge || 'Lançamento Exclusivo'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              {exclusive.statusTag || 'Obras Iniciadas'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl transition-colors text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <X className="w-4 h-4" />
            <span>Fechar Lançamento</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 flex-1">
          {/* Main Visual Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200 dark:border-slate-800">
              <img
                src={activeImage}
                alt={exclusive.title}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl sm:text-3xl font-black">{exclusive.title}</h2>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{exclusive.location}</span>
                </p>
              </div>
            </div>

            {/* Thumbnails Strip */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPhotoIdx === idx
                        ? 'border-indigo-600 scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Fast Action WhatsApp Banner */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-900/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Condições Especiais de Lançamento:
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                {exclusive.price}
              </span>
              <p className="text-xs text-slate-300 mt-1">
                {exclusive.subtitle}
              </p>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Receber Book no WhatsApp</span>
            </a>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sobre o Empreendimento
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {exclusive.description}
            </p>
          </div>

          {/* Differentials & Features */}
          {exclusive.features && exclusive.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Diferenciais & Infraestrutura Completa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exclusive.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIP Contact & Scheduling Form */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Agendar Apresentação VIP ou Receber Material Completo
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Preencha para receber plantas humanizadas, book digital e agendar uma reunião com Joel Santana.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-6 h-6" />
                </div>
                <h5 className="font-black text-emerald-900 dark:text-emerald-200 text-base">
                  Solicitação Enviada com Sucesso!
                </h5>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                  Obrigado pelo interesse no {exclusive.title}! O corretor Joel Santana entrará em contato em breve pelo WhatsApp {phone}.
                </p>
                <div className="pt-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Iniciar Conversa Imediata no WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Seu WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(17) 99999-9999"
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Seu E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Data Preferencial (opcional)
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Horário Preferencial (opcional)
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mensagem ou dúvidas específicas (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Gostaria de saber opções de financiamento, metragens disponíveis e agendar uma apresentação..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Enviando Solicitação...' : 'Confirmar Solicitação de Apresentação'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
