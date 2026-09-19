import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  HeartHandshake
} from 'lucide-react';

export const QuemSomosPage: React.FC = () => {
  const { siteConfig, setActiveTab, users } = useApp();

  const masterUser = users.find(u => u.isMasterAdmin || u.id === 'usr_master_joel' || (u.email && u.email.toLowerCase() === 'joelsantanaimoveis@gmail.com')) || users[0];
  const brokerName = siteConfig.brokerName || siteConfig.companyName || masterUser?.name || 'Joel Santana';
  const creci = siteConfig.brokerCreci || siteConfig.creciJuridico || masterUser?.creci || 'CRECI 12345-F';
  const phone = siteConfig.brokerPhone || siteConfig.phone || masterUser?.phone || '(17) 99195-1473';
  const whatsapp = siteConfig.brokerWhatsapp || siteConfig.whatsapp || masterUser?.whatsapp || '5517991951473';
  const email = siteConfig.brokerEmail || siteConfig.email || masterUser?.email || 'joelsantanaimoveis@gmail.com';
  const address = siteConfig.brokerAddress || siteConfig.address || 'São José do Rio Preto - SP e Região';
  const avatarUrl = (siteConfig.brokerAvatarUrl && !siteConfig.brokerAvatarUrl.includes('1560250097-0b93528c311a'))
    ? siteConfig.brokerAvatarUrl
    : ((masterUser?.avatar && !masterUser.avatar.includes('1560250097-0b93528c311a')) ? masterUser.avatar : '/images/joel_santana_avatar.jpg');
  const bio = siteConfig.brokerBio || 'Atuando há mais de 12 anos no mercado imobiliário com foco em transparência, avaliação justa de patrimônio e agilidade em financiamentos bancários.';

  const rawWhatsapp = whatsapp.replace(/\D/g, '');
  const formattedWhatsapp = rawWhatsapp.startsWith('55') ? rawWhatsapp : `55${rawWhatsapp}`;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CRECI Regularizado • {creci}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Quem Somos & Nossa História
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Muito além de intermediar imóveis, conectamos pessoas a novos capítulos de suas vidas com segurança absoluta, atendimento humanizado e inteligência de mercado.
            </p>

            {/* Direct CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent('Olá! Gostaria de conhecer seus serviços de assessoria imobiliária.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>

              <button
                onClick={() => setActiveTab('portal')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-sm transition-all"
              >
                Ver Imóveis Disponíveis
              </button>
            </div>
          </div>

          {/* Broker Portrait Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl text-center space-y-4 max-w-xs w-full">
              <div className="relative mx-auto w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-400 shadow-md">
                <img
                  src={avatarUrl}
                  alt={brokerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{brokerName}</h3>
                <p className="text-xs text-indigo-300 font-bold">{creci}</p>
                <p className="text-[11px] text-slate-300 mt-1">{siteConfig.brokerRegion || address}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Key Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Experiência no Mercado', value: '12+ Anos' },
          { icon: Building2, label: 'Imóveis Comercializados', value: '500+ Imóveis' },
          { icon: HeartHandshake, label: 'Aprovação dos Clientes', value: '99.4%' },
          { icon: TrendingUp, label: 'Aprovação de Crédito', value: 'em até 48h' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-2">
            <stat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Mission & Differentials Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Nossos Pilares</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Por que Escolher Nossa Assessoria?</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Trabalhamos rigorosamente dentro das diretrizes do CRECI, garantindo total tranquilidade em todas as etapas da compra, venda ou locação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Segurança Total</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Análise minuciosa de certidões, matrículas e documentação dos imóveis para eliminar qualquer risco antes do fechamento do contrato.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Avaliação Real de Mercado</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Avaliamos seu imóvel com base em dados atualizados de vendas reais na região, garantindo o melhor valor comercial de mercado.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Aprovação de Crédito Ágil</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Parceria direta com os principais bancos (Caixa, Itaú, Bradesco, Santander) para simular e aprovar sua carta de crédito com as melhores taxas.
            </p>
          </div>
        </div>
      </div>

      {/* Broker Profile & Contact Details Section */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <img
              src={avatarUrl}
              alt={brokerName}
              className="w-48 h-48 rounded-3xl object-cover border-4 border-indigo-500/20 shadow-xl"
            />
          </div>

          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Corretor Responsável</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{brokerName}</h3>
              <p className="text-xs font-bold text-slate-500">{creci}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Atendimento Presencial e Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
