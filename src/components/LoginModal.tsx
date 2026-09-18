import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, AlertCircle, UserPlus, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';

export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { loginWithCredentials, requestPasswordReset, acceptInvitation, setActiveTab, t } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'login' | 'forgot' | 'invite'>('login');
  
  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Invitation activation
  const [inviteCodeOrEmail, setInviteCodeOrEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteConfirm, setInviteConfirm] = useState('');
  const [inviteMessage, setInviteMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleNormalLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = loginWithCredentials(email, password);
    if (result.success) {
      onClose();
      setActiveTab('relatorios'); // Redirect to restricted panel
    } else {
      setErrorMessage(result.message || 'E-mail ou senha incorretos.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    const res = requestPasswordReset(forgotEmail);
    setResetMessage({ success: res.success, text: res.message });
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteMessage(null);

    if (invitePassword !== inviteConfirm) {
      setInviteMessage({ success: false, text: 'As senhas informadas não coincidem.' });
      return;
    }

    const res = acceptInvitation(inviteCodeOrEmail, invitePassword);
    setInviteMessage({ success: res.success, text: res.message });

    if (res.success) {
      setTimeout(() => {
        onClose();
        setActiveTab('relatorios');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            {viewMode === 'invite' ? <UserPlus className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {viewMode === 'login' && 'Acesso Restrito ao Sistema'}
            {viewMode === 'forgot' && 'Recuperar Senha'}
            {viewMode === 'invite' && 'Primeiro Acesso / Ativar Convite'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {viewMode === 'login' && 'Digite seu e-mail e senha cadastrados pelo administrador.'}
            {viewMode === 'forgot' && 'Insira seu e-mail cadastrado para redefinição de senha.'}
            {viewMode === 'invite' && 'Insira seu e-mail ou código recebido do Administrador Joel para criar sua senha.'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && viewMode === 'login' && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {viewMode === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
            {resetMessage && (
              <div
                className={`p-3 rounded-xl font-bold text-center ${
                  resetMessage.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {resetMessage.text}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">{t('emailLabel')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="joelsantanaimoveis@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all"
            >
              Enviar Instruções de Redefinição
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('login');
                setResetMessage(null);
              }}
              className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 block"
            >
              &larr; Voltar para a tela de login
            </button>
          </form>
        )}

        {/* INVITATION ACTIVATION VIEW */}
        {viewMode === 'invite' && (
          <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
            {inviteMessage && (
              <div
                className={`p-3 rounded-xl font-bold flex items-center gap-2 ${
                  inviteMessage.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {inviteMessage.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{inviteMessage.text}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">E-mail ou Código de Convite</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={inviteCodeOrEmail}
                  onChange={e => setInviteCodeOrEmail(e.target.value)}
                  placeholder="Ex: seu-email@imobiliaria.com ou INV-X892"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Crie sua Senha de Acesso</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={invitePassword}
                  onChange={e => setInvitePassword(e.target.value)}
                  placeholder="Nova senha (min. 4 caracteres)"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Confirme a Senha</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={inviteConfirm}
                  onChange={e => setInviteConfirm(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ativar Meu Cadastro e Entrar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('login');
                setInviteMessage(null);
              }}
              className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 block"
            >
              &larr; Voltar para a tela de login
            </button>
          </form>
        )}

        {/* NORMAL LOGIN VIEW */}
        {viewMode === 'login' && (
          <form onSubmit={handleNormalLoginSubmit} className="space-y-4 text-xs" autoComplete="off">
            <div>
              <label className="block font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{t('emailLabel')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu-email@exemplo.com.br"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-500 dark:text-slate-400 uppercase">{t('passwordLabel')}</label>
                <button
                  type="button"
                  onClick={() => setViewMode('forgot')}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('enterSystemButton')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* FIRST ACCESS / INVITATION LINK */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setViewMode('invite')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Primeiro acesso? Ativar convite de cadastro</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
