import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole, UserPermissions, LegalDocType } from '../types';
import { DocumentosJuridicosModal } from './DocumentosJuridicosModal';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Key,
  Copy,
  Trash2,
  Edit3,
  Lock,
  Eye,
  Building2,
  Phone,
  Mail,
  Percent,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  FileText,
  FileCheck,
  ShieldAlert,
  MapPin,
  PhoneForwarded,
  Briefcase
} from 'lucide-react';

export const GerenciadorUsuarios: React.FC = () => {
  const {
    users,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    updateUserProfile,
    setActiveTab
  } = useApp();

  const isAdmin = currentUser?.role === 'admin' || currentUser?.isMasterAdmin;

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Acesso Restrito a Administradores</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A gestão de usuários, corretores e números de contato da equipe é restrita aos administradores.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('relatorios')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Modals state
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showInviteModal, setShowInviteModal] = useState<{ user: User; link: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Legal documents modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalUser, setDocModalUser] = useState<User | null>(null);
  const [docModalType, setDocModalType] = useState<LegalDocType>('recibo_comissao');

  // New User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    role: 'corretor' as UserRole,
    creci: '',
    cnae: '',
    address: '',
    commissionRate: 50,
    password: '',
    bio: '',
    status: 'ativo' as 'ativo' | 'convidado' | 'bloqueado'
  });

  // Edit User Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    role: 'corretor' as UserRole,
    creci: '',
    cnae: '',
    address: '',
    commissionRate: 50,
    bio: '',
    status: 'ativo' as 'ativo' | 'convidado' | 'bloqueado'
  });

  // Permissions state for editing user
  const [permissionsData, setPermissionsData] = useState<UserPermissions>({});

  const isCurrentAdmin = currentUser?.role === 'admin' || currentUser?.isMasterAdmin;

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.creci && u.creci.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.cnae && u.cnae.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.secondaryPhone && u.secondaryPhone.includes(searchTerm)) ||
      (u.address && u.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'todos' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'todos' || (u.status || 'ativo') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle create user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Por favor, preencha o nome e o e-mail do usuário.');
      return;
    }

    const defaultPerms: UserPermissions = getRoleDefaultPermissions(formData.role);

    const res = addUser({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || '(11) 98765-4321',
      secondaryPhone: formData.secondaryPhone.trim(),
      whatsapp: formData.whatsapp.trim() || formData.phone.trim().replace(/\D/g, '') || '5511987654321',
      role: formData.role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      commissionRate: Number(formData.commissionRate) || 50,
      creci: formData.creci.trim() || 'CRECI 00000-F',
      cnae: formData.cnae.trim() || 'CNAI 12345',
      cnai: formData.cnae.trim() || 'CNAI 12345',
      address: formData.address.trim(),
      bio: formData.bio.trim(),
      status: formData.status,
      password: formData.password ? formData.password.trim() : '123456',
      permissions: defaultPerms
    });

    setIsNewUserModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      secondaryPhone: '',
      whatsapp: '',
      role: 'corretor',
      creci: '',
      cnae: '',
      address: '',
      commissionRate: 50,
      password: '',
      bio: '',
      status: 'ativo'
    });

    if (res.inviteLink) {
      setShowInviteModal({ user: res.user, link: res.inviteLink });
    }
  };

  // Open Edit User Modal
  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      secondaryPhone: user.secondaryPhone || '',
      whatsapp: user.whatsapp || '',
      role: user.role,
      creci: user.creci || '',
      cnae: user.cnai || user.cnae || '',
      address: user.address || '',
      commissionRate: user.commissionRate ?? 50,
      bio: user.bio || '',
      status: user.status || 'ativo'
    });
    const existingPerms = user.permissions || getRoleDefaultPermissions(user.role);
    setPermissionsData(existingPerms);
  };

  // Save User Edit
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: User = {
      ...editingUser,
      name: editFormData.name.trim(),
      email: editFormData.email.trim().toLowerCase(),
      phone: editFormData.phone.trim(),
      secondaryPhone: editFormData.secondaryPhone.trim(),
      whatsapp: editFormData.whatsapp.trim() || editFormData.phone.trim().replace(/\D/g, ''),
      role: editFormData.role,
      creci: editFormData.creci.trim(),
      cnae: editFormData.cnae.trim(),
      cnai: editFormData.cnae.trim(),
      address: editFormData.address.trim(),
      commissionRate: Number(editFormData.commissionRate) || 0,
      bio: editFormData.bio.trim(),
      status: editFormData.status,
      permissions: permissionsData
    };

    updateUser(updated);
    setEditingUser(null);
  };

  // Quick Role Default Permissions Generator
  function getRoleDefaultPermissions(role: UserRole): UserPermissions {
    switch (role) {
      case 'admin':
        return {
          canAccessCrm: true,
          canAccessImoveis: true,
          canAccessAgenda: true,
          canAccessComissoes: true,
          canAccessRelatorios: true,
          canAccessChat: true,
          canAccessConfiguracoes: true,
          canAccessUsuarios: true
        };
      case 'corretor':
        return {
          canAccessCrm: true,
          canAccessImoveis: true,
          canAccessAgenda: true,
          canAccessComissoes: true,
          canAccessRelatorios: false,
          canAccessChat: true,
          canAccessConfiguracoes: false,
          canAccessUsuarios: false
        };
      case 'recepcionista':
        return {
          canAccessCrm: true,
          canAccessImoveis: true,
          canAccessAgenda: true,
          canAccessComissoes: false,
          canAccessRelatorios: false,
          canAccessChat: true,
          canAccessConfiguracoes: false,
          canAccessUsuarios: false
        };
      case 'leitor':
        return {
          canAccessCrm: false,
          canAccessImoveis: true,
          canAccessAgenda: false,
          canAccessComissoes: false,
          canAccessRelatorios: true,
          canAccessChat: false,
          canAccessConfiguracoes: false,
          canAccessUsuarios: false
        };
      default:
        return {};
    }
  }

  // Handle role change during editing
  const handleRoleChangeInEdit = (newRole: UserRole) => {
    if (!editingUser) return;
    const defaultPerms = getRoleDefaultPermissions(newRole);
    setEditingUser({ ...editingUser, role: newRole });
    setPermissionsData(defaultPerms);
  };

  // Role Badge Styling
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrador
          </span>
        );
      case 'corretor':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Corretor
          </span>
        );
      case 'recepcionista':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Recepcionista
          </span>
        );
      case 'leitor':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Leitor (Somente Leitura)
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 rounded-full text-xs font-black uppercase tracking-wider">
              Controle de Acesso
            </span>
            <span className="text-xs text-slate-400 font-bold">• {users.length} Usuários Cadastrados</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Gestão de Usuários e Permissões do CRM
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Gerencie os corretores, administradores e leitores do sistema. Configure cargos e permissões específicas de quem pode visualizar e editar cada seção do CRM.
          </p>
        </div>

        {isCurrentAdmin && (
          <button
            onClick={() => setIsNewUserModalOpen(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm shrink-0"
          >
            <UserPlus className="w-5 h-5" />
            <span>Novo Usuário / Corretor</span>
          </button>
        )}
      </div>

      {/* Role Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administradores</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <p className="text-[11px] text-slate-500">Acesso total ao sistema</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corretores</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {users.filter(u => u.role === 'corretor').length}
          </div>
          <p className="text-[11px] text-slate-500">Atendimento & Fechamento</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recepcionistas</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {users.filter(u => u.role === 'recepcionista').length}
          </div>
          <p className="text-[11px] text-slate-500">Atendimento & Agenda</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leitores (Read-Only)</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {users.filter(u => u.role === 'leitor').length}
          </div>
          <p className="text-[11px] text-slate-500">Somente Visualização</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail ou CRECI..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="todos">Todos os Cargos</option>
            <option value="admin">Administradores</option>
            <option value="corretor">Corretores</option>
            <option value="recepcionista">Recepcionistas</option>
            <option value="leitor">Leitores (Somente Leitura)</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="convidado">Convidados</option>
            <option value="bloqueado">Bloqueados</option>
          </select>
        </div>
      </div>

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => {
          const isMaster = user.isMasterAdmin || user.id === 'usr_master_joel';
          const userStatus = user.status || 'ativo';

          return (
            <div
              key={user.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden ${
                userStatus === 'bloqueado'
                  ? 'border-rose-300 dark:border-rose-900/50 opacity-75'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {isMaster && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
                  Master Admin
                </div>
              )}

              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-start gap-4">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-md shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getRoleBadge(user.role)}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        userStatus === 'ativo'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : userStatus === 'convidado'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {userStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">
                      <strong className="text-slate-500 font-semibold">Principal: </strong>
                      {user.phone || 'Não informado'}
                    </span>
                  </div>
                  {/* Telefone de Recado */}
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <PhoneForwarded className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">
                      <strong className="text-slate-500 font-semibold">Recado: </strong>
                      {user.secondaryPhone ? (
                        <span className="font-bold text-amber-700 dark:text-amber-300">{user.secondaryPhone}</span>
                      ) : (
                        <span className="text-slate-400 italic">Não informado</span>
                      )}
                    </span>
                  </div>
                  {/* Endereço do Corretor */}
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="truncate" title={user.address || 'Endereço não informado'}>
                      <strong className="text-slate-500 font-semibold">Endereço: </strong>
                      {user.address ? (
                        <span>{user.address}</span>
                      ) : (
                        <span className="text-slate-400 italic">Não informado</span>
                      )}
                    </span>
                  </div>
                  {/* CRECI, CNAI & Comissão */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70 text-[11px] font-bold flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-600 dark:text-slate-300">{user.creci || 'CRECI 00000-F'}</span>
                      {(user.cnai || user.cnae) ? (
                        <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded text-[10px] font-mono">
                          CNAI: {user.cnai || user.cnae}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded text-[10px]">
                          CNAI não inf.
                        </span>
                      )}
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Comissão: {user.commissionRate}%</span>
                  </div>
                </div>

                {/* Permissions Summary Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Acessos Permitidos do CRM:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                    {user.role === 'admin' ? (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-md">
                        ✓ Acesso Total (Todas as Seções)
                      </span>
                    ) : (
                      <>
                        {(user.permissions?.canAccessCrm ?? true) && (
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-md">CRM Funil</span>
                        )}
                        {(user.permissions?.canAccessImoveis ?? true) && (
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md">Imóveis</span>
                        )}
                        {(user.permissions?.canAccessAgenda ?? true) && (
                          <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-md">Agenda Visitas</span>
                        )}
                        {(user.permissions?.canAccessComissoes ?? (user.role === 'corretor')) && (
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-md">Comissões</span>
                        )}
                        {(user.permissions?.canAccessRelatorios ?? (user.role === 'leitor')) && (
                          <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-md">Relatórios</span>
                        )}
                        {user.role === 'leitor' && (
                          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md">
                            👁️ Somente Leitura
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleOpenEditUser(user)}
                    disabled={!isCurrentAdmin && currentUser?.id !== user.id}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 disabled:opacity-50"
                    title="Editar Permissões e Perfil"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setDocModalUser(user);
                      setDocModalType('recibo_comissao');
                      setIsDocModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                    title="Emitir / Ver Documentos Jurídicos do Corretor"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Documentos</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {user.status === 'convidado' && user.inviteToken && (
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/#convite=${user.inviteToken}`;
                        navigator.clipboard.writeText(link);
                        alert(`Link de convite copiado para a área de transferência:\n\n${link}`);
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl transition-colors"
                      title="Copiar Link de Convite"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}

                  {isCurrentAdmin && !isMaster && (
                    <button
                      onClick={() => {
                        const newStatus = userStatus === 'bloqueado' ? 'ativo' : 'bloqueado';
                        updateUser({ ...user, status: newStatus });
                      }}
                      className={`p-2 rounded-xl transition-colors ${
                        userStatus === 'bloqueado'
                          ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                          : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950'
                      }`}
                      title={userStatus === 'bloqueado' ? 'Desbloquear Usuário' : 'Bloquear Acesso do Usuário'}
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}

                  {isCurrentAdmin && !isMaster && (
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir permanentemente o usuário ${user.name}?`)) {
                          deleteUser(user.id);
                        }
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-colors"
                      title="Excluir Usuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New User */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Cadastrar Novo Usuário / Corretor</h3>
                  <p className="text-xs text-slate-500">Adicione um novo membro à equipe da imobiliária.</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Roberto Alves"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">E-mail de Acesso *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="roberto@imobiliaria.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Cargo / Função *</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="corretor">Corretor de Imóveis</option>
                    <option value="admin">Administrador Geral</option>
                    <option value="recepcionista">Recepcionista / Atendimento</option>
                    <option value="leitor">Leitor (Somente Leitura)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Telefone Principal</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(17) 99195-1473"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                    <PhoneForwarded className="w-3.5 h-3.5 text-amber-500" />
                    <span>Telefone de Recado</span>
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryPhone}
                    onChange={e => setFormData({ ...formData, secondaryPhone: e.target.value })}
                    placeholder="Ex: (17) 98123-4567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CRECI do Corretor</label>
                  <input
                    type="text"
                    value={formData.creci}
                    onChange={e => setFormData({ ...formData, creci: e.target.value })}
                    placeholder="CRECI 12345-F"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    <span>CNAI do Corretor</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cnae}
                    onChange={e => setFormData({ ...formData, cnae: e.target.value })}
                    placeholder="Ex: CNAI 12345 - Avaliador Imobiliário"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Endereço Completo</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Av. Alberto Andaló, 3000 - Centro, São José do Rio Preto - SP"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Taxa de Comissão (%)</label>
                  <input
                    type="number"
                    value={formData.commissionRate}
                    onChange={e => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    placeholder="50"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Senha Inicial</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Padrão: 123456"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg"
                >
                  Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User Role & Permissions */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Permissões & Perfil de {editingUser.name}
                  </h3>
                  <p className="text-xs text-slate-500">Ajuste o cargo e as permissões de acesso ao CRM.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-6 text-xs">
              {/* Ficha Cadastral do Usuário / Corretor */}
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
                <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Ficha Cadastral do Corretor / Usuário
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">E-mail Profissional *</label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Telefone Principal</label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                      placeholder="(17) 99195-1473"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1 text-amber-700 dark:text-amber-400">
                      <PhoneForwarded className="w-3.5 h-3.5" />
                      <span>Telefone de Recado</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.secondaryPhone}
                      onChange={e => setEditFormData({ ...editFormData, secondaryPhone: e.target.value })}
                      placeholder="Ex: (17) 98123-4567"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={editFormData.whatsapp}
                      onChange={e => setEditFormData({ ...editFormData, whatsapp: e.target.value })}
                      placeholder="5517991951473"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CRECI do Corretor</label>
                    <input
                      type="text"
                      value={editFormData.creci}
                      onChange={e => setEditFormData({ ...editFormData, creci: e.target.value })}
                      placeholder="CRECI 12345-F"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1 text-blue-700 dark:text-blue-400">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>CNAI do Corretor</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.cnae}
                      onChange={e => setEditFormData({ ...editFormData, cnae: e.target.value })}
                      placeholder="Ex: CNAI 12345"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Comissão (%)</label>
                    <input
                      type="number"
                      value={editFormData.commissionRate}
                      onChange={e => setEditFormData({ ...editFormData, commissionRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1 text-rose-700 dark:text-rose-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Endereço Completo do Corretor</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={e => setEditFormData({ ...editFormData, address: e.target.value })}
                    placeholder="Ex: Av. Alberto Andaló, 3000 - Centro, São José do Rio Preto - SP"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                  Cargo Principal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      role: 'admin' as UserRole,
                      title: 'Administrador',
                      desc: 'Acesso total e ilimitado a todas as seções e gerenciamento de equipe.'
                    },
                    {
                      role: 'corretor' as UserRole,
                      title: 'Corretor',
                      desc: 'Acesso ao CRM, Imóveis, Agenda de Visitas, Minhas Comissões e Chat.'
                    },
                    {
                      role: 'recepcionista' as UserRole,
                      title: 'Recepcionista',
                      desc: 'Acesso ao Atendimento de Leads, Agenda de Visitas e Chat Interno.'
                    },
                    {
                      role: 'leitor' as UserRole,
                      title: 'Leitor (Read-Only)',
                      desc: 'Somente visualização de Imóveis e Relatórios (sem criação ou alteração).'
                    }
                  ].map(item => (
                    <div
                      key={item.role}
                      onClick={() => handleRoleChangeInEdit(item.role)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        editingUser.role === item.role
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                        <span>{item.title}</span>
                        {editingUser.role === item.role && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Granular Matrix */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Controle Granular de Módulos (Permissões)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'canAccessCrm', label: 'Funil de Vendas (CRM Leads)' },
                    { key: 'canAccessImoveis', label: 'Gestão de Imóveis' },
                    { key: 'canAccessAgenda', label: 'Agenda & Visitas' },
                    { key: 'canAccessComissoes', label: 'Relatório de Comissões' },
                    { key: 'canAccessRelatorios', label: 'Estatísticas & Relatórios' },
                    { key: 'canAccessChat', label: 'Chat Interno' },
                    { key: 'canAccessConfiguracoes', label: 'Configurações da Empresa' },
                    { key: 'canAccessUsuarios', label: 'Gerenciamento de Usuários' }
                  ].map(perm => {
                    const isChecked = permissionsData[perm.key as keyof UserPermissions] ?? false;
                    return (
                      <label
                        key={perm.key}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="font-bold text-slate-700 dark:text-slate-300">{perm.label}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => setPermissionsData({ ...permissionsData, [perm.key]: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg"
                >
                  Salvar Alterações de Permissão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DOCUMENTOS JURÍDICOS PARA O CORRETOR/USUÁRIO */}
      <DocumentosJuridicosModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        agent={docModalUser}
        initialDocType={docModalType}
      />
    </div>
  );
};
