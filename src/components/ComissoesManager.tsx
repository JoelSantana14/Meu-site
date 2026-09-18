import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Commission, CommissionStatus } from '../types';
import {
  DollarSign,
  Plus,
  CheckCircle,
  Clock,
  Building,
  User,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  X,
  ShieldAlert
} from 'lucide-react';

export const ComissoesManager: React.FC = () => {
  const {
    commissions,
    addCommission,
    updateCommissionStatus,
    users,
    properties,
    leads,
    currentUser,
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
            As comissões de cada membro da equipe e repasses financeiros são visíveis apenas para administradores.
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

  const [filterAgent, setFilterAgent] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyId, setPropertyId] = useState<string>(properties[0]?.id || '');
  const [leadId, setLeadId] = useState<string>(leads[0]?.id || '');
  const [agentId, setAgentId] = useState<string>(users[1]?.id || users[0]?.id || '');
  const [saleValue, setSaleValue] = useState<number | ''>(1500000);
  const [totalCommissionPct, setTotalCommissionPct] = useState<number>(6);
  const [agentCommissionPct, setAgentCommissionPct] = useState<number>(50); // 50% of the total commission
  const [paymentStatus, setPaymentStatus] = useState<CommissionStatus>('pendente');
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const filtered = commissions.filter(c => {
    if (filterAgent !== 'todos' && c.agentId !== filterAgent) return false;
    if (filterStatus !== 'todos' && c.paymentStatus !== filterStatus) return false;
    return true;
  });

  const totalVolumeVendas = filtered.reduce((acc, c) => acc + c.saleValue, 0);
  const totalComissaoGerada = filtered.reduce((acc, c) => acc + c.totalCommissionAmount, 0);
  const totalComissaoCorretores = filtered.reduce((acc, c) => acc + c.agentCommissionAmount, 0);
  const totalComissaoImobiliaria = filtered.reduce((acc, c) => acc + c.agencyCommissionAmount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleCreateCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleValue || !totalCommissionPct) return;

    const val = Number(saleValue);
    const totalCommAmt = val * (totalCommissionPct / 100);
    const agentCommAmt = totalCommAmt * (agentCommissionPct / 100);
    const agencyCommAmt = totalCommAmt - agentCommAmt;

    addCommission({
      propertyId,
      leadId,
      agentId,
      saleValue: val,
      totalCommissionPct,
      totalCommissionAmount: totalCommAmt,
      agentCommissionPct,
      agentCommissionAmount: agentCommAmt,
      agencyCommissionAmount: agencyCommAmt,
      paymentStatus,
      saleDate
    });

    setIsModalOpen(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Gestão Financeira & Controle de Comissões
            </h1>
            <p className="text-xs text-slate-500">
              Acompanhamento de fechamento de vendas e divisão de comissões entre corretores e imobiliária.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Venda / Comissão</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Volume Total Fechado</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(totalVolumeVendas)}</p>
          <span className="text-[10px] text-slate-500">{filtered.length} transações registradas</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Comissão Total Gerada</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(totalComissaoGerada)}</p>
          <span className="text-[10px] text-indigo-500 font-semibold">Média de 5.8% por contrato</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Comissões de Corretores</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalComissaoCorretores)}</p>
          <span className="text-[10px] text-emerald-500 font-semibold">Repasses a equipe</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Receita Imobiliária</span>
          <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{formatCurrency(totalComissaoImobiliaria)}</p>
          <span className="text-[10px] text-cyan-500 font-semibold">Margem retida</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <select
            value={filterAgent}
            onChange={e => setFilterAgent(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="todos">Todos os Corretores</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="todos">Todos Status</option>
            <option value="pendente">Pendente</option>
            <option value="liberado">Liberado</option>
            <option value="pago">Pago</option>
          </select>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <th className="p-4">Data Venda</th>
                <th className="p-4">Imóvel & Código</th>
                <th className="p-4">Corretor</th>
                <th className="p-4">Valor da Venda</th>
                <th className="p-4">Comissão Total</th>
                <th className="p-4">Repasse Corretor</th>
                <th className="p-4">Status Pagamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
              {filtered.map(comm => {
                const prop = properties.find(p => p.id === comm.propertyId);
                const agent = users.find(u => u.id === comm.agentId);

                return (
                  <tr key={comm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-mono">{comm.saleDate}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      [{prop?.code || 'IMP'}] {prop?.title || 'Imóvel Exemplo'}
                    </td>
                    <td className="p-4 text-slate-800 dark:text-slate-200 font-semibold">{agent?.name}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{formatCurrency(comm.saleValue)}</td>
                    <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(comm.totalCommissionAmount)} ({comm.totalCommissionPct}%)
                    </td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(comm.agentCommissionAmount)} ({comm.agentCommissionPct}% do total)
                    </td>
                    <td className="p-4">
                      <select
                        value={comm.paymentStatus}
                        onChange={e => updateCommissionStatus(comm.id, e.target.value as CommissionStatus)}
                        className={`text-[10px] font-black uppercase py-1 px-3 rounded-full border-none cursor-pointer ${
                          comm.paymentStatus === 'pago'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : comm.paymentStatus === 'liberado'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="liberado">Liberado</option>
                        <option value="pago">Pago</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW COMMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1">Registrar Comissão de Venda</h3>
            <p className="text-xs text-slate-500 mb-6">
              Calcule e atribua a comissão para a transação fechada.
            </p>

            <form onSubmit={handleCreateCommission} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Imóvel Vendido</label>
                <select
                  value={propertyId}
                  onChange={e => setPropertyId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>[{p.code}] {p.title} - {formatCurrency(p.price)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Cliente Comprador</label>
                <select
                  value={leadId}
                  onChange={e => setLeadId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.phone})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Corretor Vendedor</label>
                  <select
                    value={agentId}
                    onChange={e => setAgentId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Valor do Negócio (R$)</label>
                  <input
                    type="number"
                    required
                    value={saleValue}
                    onChange={e => setSaleValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">% Comissão Total</label>
                  <input
                    type="number"
                    step="0.5"
                    value={totalCommissionPct}
                    onChange={e => setTotalCommissionPct(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">% Repasse ao Corretor</label>
                  <input
                    type="number"
                    step="5"
                    value={agentCommissionPct}
                    onChange={e => setAgentCommissionPct(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Status do Pagamento</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as CommissionStatus)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="liberado">Liberado</option>
                    <option value="pago">Pago</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Data do Contrato</label>
                  <input
                    type="date"
                    value={saleDate}
                    onChange={e => setSaleDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all mt-2"
              >
                Registrar Lançamento Financeiro
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
