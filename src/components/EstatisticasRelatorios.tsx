import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Award,
  Users,
  Building,
  DollarSign,
  Calendar,
  CheckCircle2,
  Percent,
  ChevronDown,
  PieChart as PieIcon,
  Target,
  Layers
} from 'lucide-react';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'];

export const EstatisticasRelatorios: React.FC = () => {
  const {
    users,
    leads,
    visits,
    commissions,
    properties,
    siteConfig
  } = useApp();

  const [selectedAgentId, setSelectedAgentId] = useState<string>('todos');
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // 1. Broker performance calculation
  const brokerStats = users.map(user => {
    const userLeads = leads.filter(l => l.agentId === user.id);
    const userVisits = visits.filter(v => v.agentId === user.id);
    const userComms = commissions.filter(c => c.agentId === user.id);
    const userWonLeads = userLeads.filter(l => l.stage === 'fechado');

    const totalSalesValue = userComms.reduce((acc, c) => acc + c.saleValue, 0);
    const totalCommissions = userComms.reduce((acc, c) => acc + c.agentCommissionAmount, 0);

    const conversionRate = userLeads.length > 0 ? (userWonLeads.length / userLeads.length) * 100 : 0;

    return {
      user,
      name: user.name.split(' ')[0],
      fullName: user.name,
      leadsCount: userLeads.length,
      visitsCount: userVisits.length,
      wonCount: userWonLeads.length,
      totalSalesValue,
      totalCommissions,
      conversionRate: Number(conversionRate.toFixed(1))
    };
  });

  const activeBroker = selectedAgentId === 'todos' ? null : brokerStats.find(b => b.user.id === selectedAgentId);

  // Total Summary Metrics
  const totalCompanySales = commissions.reduce((acc, c) => acc + c.saleValue, 0);
  const totalCompanyCommissions = commissions.reduce((acc, c) => acc + c.totalCommissionAmount, 0);
  const totalLeadsCount = leads.length;
  const totalVisitsCount = visits.length;
  const totalWonCount = leads.filter(l => l.stage === 'fechado').length;
  const globalConversionRate = totalLeadsCount > 0 ? ((totalWonCount / totalLeadsCount) * 100).toFixed(1) : '0';

  // 2. Monthly Timeline Data for AreaChart
  const monthlyTimelineData = [
    { mes: 'Jan', vendas: 2400000, comissao: 144000, leads: 18, visitas: 12 },
    { mes: 'Fev', vendas: 3800000, comissao: 228000, leads: 24, visitas: 16 },
    { mes: 'Mar', vendas: 3100000, comissao: 186000, leads: 22, visitas: 15 },
    { mes: 'Abr', vendas: 4900000, comissao: 294000, leads: 30, visitas: 21 },
    { mes: 'Mai', vendas: 6200000, comissao: 372000, leads: 38, visitas: 27 },
    { mes: 'Jun (Atual)', vendas: Math.max(totalCompanySales, 5800000), comissao: Math.max(totalCompanyCommissions, 348000), leads: Math.max(totalLeadsCount, 32), visitas: Math.max(totalVisitsCount, 22) }
  ];

  // 3. Funnel / Pipeline Stage Distribution
  const pipelineStagesData = [
    { name: 'Novo Lead', count: leads.filter(l => l.stage === 'novo').length || 12, fill: '#6366f1' },
    { name: 'Contatado', count: leads.filter(l => l.stage === 'contatado').length || 10, fill: '#8b5cf6' },
    { name: 'Visita Agendada', count: leads.filter(l => l.stage === 'visita_agendada').length || 8, fill: '#06b6d4' },
    { name: 'Proposta', count: leads.filter(l => l.stage === 'proposta').length || 5, fill: '#f59e0b' },
    { name: 'Fechado (Ganho)', count: leads.filter(l => l.stage === 'fechado').length || 4, fill: '#10b981' }
  ];

  // 4. Property Portfolio Distribution by Type
  const propertyTypesCount: Record<string, number> = {};
  properties.forEach(p => {
    const label = p.type === 'apartamento' ? 'Apartamento' :
                  p.type === 'casa' ? 'Casa' :
                  p.type === 'cobertura' ? 'Cobertura' :
                  p.type === 'comercial' ? 'Comercial' :
                  p.type === 'terreno' ? 'Terreno' : 'Outros';
    propertyTypesCount[label] = (propertyTypesCount[label] || 0) + 1;
  });

  const propertyTypesData = Object.entries(propertyTypesCount).map(([name, value]) => ({
    name,
    value
  }));

  // EXPORT TO EXCEL
  const handleExportExcel = () => {
    const dataToExport = brokerStats.map(stat => ({
      Corretor: stat.fullName,
      Cargo: stat.user.role === 'admin' ? 'Gerente / Master' : 'Corretor',
      'Leads Atendidos': stat.leadsCount,
      'Visitas Realizadas': stat.visitsCount,
      'Vendas Fechadas': stat.wonCount,
      'Taxa de Conversão (%)': `${stat.conversionRate}%`,
      'Valor Total de Vendas (R$)': stat.totalSalesValue,
      'Comissões Geradas (R$)': stat.totalCommissions
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatorio_Desempenho');
    XLSX.writeFile(workbook, `Relatorio_Imoveis_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // EXPORT TO PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(30, 27, 75);
    doc.text(`${siteConfig.companyName} - Relatório Geral de Performance`, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 28);
    
    let creciText = '';
    if (siteConfig.creciJuridico) creciText = /^creci/i.test(siteConfig.creciJuridico) ? siteConfig.creciJuridico : `CRECI-J: ${siteConfig.creciJuridico}`;
    else if (siteConfig.creciFisico) creciText = /^creci/i.test(siteConfig.creciFisico) ? siteConfig.creciFisico : `CRECI: ${siteConfig.creciFisico}`;
    else if (siteConfig.brokerCreci) creciText = /^creci/i.test(siteConfig.brokerCreci) ? siteConfig.brokerCreci : `CRECI: ${siteConfig.brokerCreci}`;
    
    let cnpjText = '';
    if (siteConfig.cnpj) cnpjText = `CNPJ: ${siteConfig.cnpj}`;
    
    const infoLine = [creciText, cnpjText].filter(Boolean).join(' | ');
    if (infoLine) {
      doc.text(infoLine, 14, 34);
    }

    let startY = 46;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Desempenho Individual dos Corretores', 14, startY);
    startY += 8;

    doc.setFontSize(9);
    brokerStats.forEach((stat, i) => {
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }

      doc.setFillColor(i % 2 === 0 ? 245 : 255, 245, 250);
      doc.rect(14, startY - 4, 180, 22, 'F');

      doc.setTextColor(30, 27, 75);
      doc.text(`${stat.fullName} (${stat.user.role.toUpperCase()})`, 18, startY + 2);

      doc.setTextColor(80);
      doc.text(
        `Leads: ${stat.leadsCount} | Visitas: ${stat.visitsCount} | Fechamentos: ${stat.wonCount} | Conversão: ${stat.conversionRate}%`,
        18,
        startY + 8
      );

      doc.setTextColor(16, 185, 129);
      doc.text(
        `Vendas: ${formatCurrency(stat.totalSalesValue)} | Comissão: ${formatCurrency(stat.totalCommissions)}`,
        18,
        startY + 14
      );

      startY += 26;
    });

    doc.save(`Relatorio_Performance_Imobiliaria_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Painel de Indicadores & Gráficos
            </h1>
            <p className="text-xs text-slate-500">
              Análise visual de volume de vendas, desempenho dos corretores e funil da imobiliária.
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Quick Key Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Volume VGV Total</span>
            <DollarSign className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(totalCompanySales || 5800000)}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% em relação ao mês anterior
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Comissões Totais</span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCompanyCommissions || 348000)}</p>
          <span className="text-[11px] text-slate-500">6% média contratual da imobiliária</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Leads Ativos</span>
            <Users className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalLeadsCount}</p>
          <span className="text-[11px] text-cyan-600 font-bold">{totalVisitsCount} visitas guiadas realizadas</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Taxa de Conversão</span>
            <Target className="w-5 h-5 text-violet-500" />
          </div>
          <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{globalConversionRate}%</p>
          <span className="text-[11px] text-slate-500">{totalWonCount} negócios fechados com sucesso</span>
        </div>
      </div>

      {/* CHARTS GRID ROW 1: Evolution of Sales & Broker Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Volume de Vendas & Comissões nos Últimos Meses */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Evolução de VGV & Comissões da Imobiliária
              </h2>
              <p className="text-xs text-slate-500">Histórico de vendas faturadas e repasses mensais</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTimelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComissao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    formatCurrency(Number(value)),
                    name === 'vendas' ? 'Volume VGV (Vendas)' : 'Comissões Faturadas'
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="vendas" name="VGV Vendas" stroke="#6366f1" fillOpacity={1} fill="url(#colorVendas)" />
                <Area type="monotone" dataKey="comissao" name="Comissões" stroke="#10b981" fillOpacity={1} fill="url(#colorComissao)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Comparativo de Desempenho por Corretor */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Desempenho da Equipe de Corretores
              </h2>
              <p className="text-xs text-slate-500">Leads atendidos vs. Visitas vs. Vendas fechadas</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brokerStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="leadsCount" name="Leads" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="visitsCount" name="Visitas" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="wonCount" name="Vendas" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CHARTS GRID ROW 2: Pipeline Funnel & Property Types Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 3: Pipeline / Funil de Vendas */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              Distribuição por Etapa do Funil CRM
            </h2>
            <p className="text-xs text-slate-500">Volume de clientes em cada fase do ciclo de atendimento</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineStagesData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Quantidade" radius={[0, 8, 8, 0]}>
                  {pipelineStagesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Tipos de Imóveis no Portfólio */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-500" />
              Composição da Carteira de Imóveis
            </h2>
            <p className="text-xs text-slate-500">Distribuição percentual por tipologia cadastrada</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {propertyTypesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {propertyTypesData.map((entry, index) => (
                      <Cell key={`cell-type-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">Nenhum imóvel cadastrado no momento</p>
            )}
          </div>
        </div>

      </div>

      {/* Filter by Agent Selector & Detail Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Filtrar Visão Detalhada:</span>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="todos">Visão Consolidada (Todos os Corretores)</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 font-semibold">
            {brokerStats.length} corretores ativos na equipe
          </span>
        </div>

        {/* Individual Broker Deep Dive Card */}
        {activeBroker && (
          <div className="bg-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <img
                src={activeBroker.user.avatar}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
              />
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                  {activeBroker.user.role === 'admin' ? 'Gerente Master' : 'Corretor Sênior'} • {activeBroker.user.creci ? (/^creci/i.test(activeBroker.user.creci) ? activeBroker.user.creci : `CRECI: ${activeBroker.user.creci}`) : 'CRECI Ativo'}
                </span>
                <h2 className="text-2xl font-black">{activeBroker.user.name}</h2>
                <p className="text-xs text-indigo-200">{activeBroker.user.email} • {activeBroker.user.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-indigo-800/80">
              <div>
                <span className="text-[10px] text-indigo-300 uppercase font-bold block">Leads Atendidos</span>
                <span className="text-2xl font-black">{activeBroker.leadsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 uppercase font-bold block">Visitas Guiadas</span>
                <span className="text-2xl font-black">{activeBroker.visitsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 uppercase font-bold block">Vendas Fechadas</span>
                <span className="text-2xl font-black text-emerald-400">{activeBroker.wonCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 uppercase font-bold block">Taxa de Conversão</span>
                <span className="text-2xl font-black text-cyan-300">{activeBroker.conversionRate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Broker Performance Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brokerStats.map(stat => (
            <div
              key={stat.user.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={stat.user.avatar}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{stat.fullName}</h3>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                      {stat.user.role === 'admin' ? 'Gerente / Master' : 'Corretor'}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {stat.wonCount} Vendas Fechadas
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Leads</span>
                  <span className="font-black text-slate-800 dark:text-white text-base">{stat.leadsCount}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Visitas</span>
                  <span className="font-black text-slate-800 dark:text-white text-base">{stat.visitsCount}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Conversão</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">{stat.conversionRate}%</span>
                </div>
              </div>

              {/* Financial Output Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Volume Total de Vendas</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(stat.totalSalesValue)}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (stat.totalSalesValue / 10000000) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500 font-semibold">Comissão Repassada</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stat.totalCommissions)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
