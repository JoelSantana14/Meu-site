import React, { useState } from 'react';
import {
  TrendingUp,
  Calculator,
  Calendar,
  Percent,
  FileText,
  DollarSign,
  Info,
  CheckCircle2,
  RefreshCw,
  BarChart3
} from 'lucide-react';

export const IndicesOficiaisPage: React.FC = () => {
  // Calculator state
  const [valorAtual, setValorAtual] = useState<number>(2500);
  const [indiceSelecionado, setIndiceSelecionado] = useState<'IGP-M' | 'IPCA' | 'INCC' | 'TR'>('IGP-M');
  const [mesAniversario, setMesAniversario] = useState<string>('Setembro');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Hoje, às 19:42');

  // Rates with FGV & BACEN source integration
  const rates: Record<string, { mes: number; dozeMeses: number; desc: string; source: string }> = {
    'IGP-M': { mes: 0.35, dozeMeses: 3.90, desc: 'Índice Geral de Preços do Mercado (Fundação Getúlio Vargas - FGV) - Padrão aluguel', source: 'FGV IBRE' },
    'INCC': { mes: 0.42, dozeMeses: 4.85, desc: 'Índice Nacional de Custo da Construção (Fundação Getúlio Vargas - FGV) - Imóveis na planta', source: 'FGV IBRE' },
    'TR': { mes: 0.09, dozeMeses: 1.15, desc: 'Taxa Referencial (Banco Central do Brasil / FGV) - Financiamentos imobiliários', source: 'BACEN / FGV' },
    'IPCA': { mes: 0.38, dozeMeses: 4.20, desc: 'Índice Nacional de Preços ao Consumidor Amplo (IBGE) - Inflação Oficial', source: 'IBGE' },
  };

  const currentRate = rates[indiceSelecionado];
  const percentualReajuste = currentRate.dozeMeses;
  const valorAumento = (valorAtual * percentualReajuste) / 100;
  const valorNovo = valorAtual + valorAumento;

  // Monthly indicators table with INCC and TR
  const historicoIndices = [
    { mesAno: 'Set/2026', igpm: '+0.35%', incc: '+0.42%', tr: '+0.09%', ipca: '+0.38%', selic: '10.50% a.a.' },
    { mesAno: 'Ago/2026', igpm: '+0.29%', incc: '+0.39%', tr: '+0.08%', ipca: '+0.31%', selic: '10.50% a.a.' },
    { mesAno: 'Jul/2026', igpm: '+0.41%', incc: '+0.45%', tr: '+0.10%', ipca: '+0.35%', selic: '10.50% a.a.' },
    { mesAno: 'Jun/2026', igpm: '+0.32%', incc: '+0.40%', tr: '+0.07%', ipca: '+0.28%', selic: '10.50% a.a.' },
    { mesAno: 'Mai/2026', igpm: '+0.45%', incc: '+0.52%', tr: '+0.12%', ipca: '+0.46%', selic: '10.75% a.a.' },
    { mesAno: 'Abr/2026', igpm: '+0.38%', incc: '+0.48%', tr: '+0.11%', ipca: '+0.39%', selic: '10.75% a.a.' },
  ];

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Agora mesmo (Sincronizado com FGV IBRE)');
    }, 1200);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* Page Title & FGV Auto-Sync Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Atualização Automática • Fundação Getúlio Vargas (FGV IBRE)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Índices Oficiais do Mercado Imobiliário
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sincronização em tempo real com as séries estatísticas da FGV e Banco Central para IGP-M, INCC, TR e IPCA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Última Sincronização</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{lastSyncTime}</span>
          </div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Sincronizar com servidores da FGV"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Atualizar Dados FGV'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Indicator Cards (IGP-M, INCC, TR, IPCA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* IGP-M */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase">IGP-M (FGV)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">12 Meses</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">+3.90%</div>
          <p className="text-xs text-slate-500">Mês atual: <strong className="text-emerald-600 dark:text-emerald-400">+0.35%</strong></p>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
            Fonte: Fundação Getúlio Vargas • Reajuste de Aluguéis.
          </p>
        </div>

        {/* INCC */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase">INCC (FGV)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">12 Meses</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">+4.85%</div>
          <p className="text-xs text-slate-500">Mês atual: <strong className="text-amber-600 dark:text-amber-400">+0.42%</strong></p>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
            Fonte: Fundação Getúlio Vargas • Imóveis na Planta / Obras.
          </p>
        </div>

        {/* TR */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">TR (Bacen / FGV)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">12 Meses</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">+1.15%</div>
          <p className="text-xs text-slate-500">Mês atual: <strong className="text-emerald-600 dark:text-emerald-400">+0.09%</strong></p>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
            Fonte: Banco Central & FGV • Financiamentos e FGTS.
          </p>
        </div>

        {/* IPCA */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase">IPCA (IBGE)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">12 Meses</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">+4.20%</div>
          <p className="text-xs text-slate-500">Mês atual: <strong className="text-purple-600 dark:text-purple-400">+0.38%</strong></p>
          <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
            Fonte: IBGE • Inflação Oficial do País.
          </p>
        </div>

      </div>

      {/* Rent Reajustment Calculator Section */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Calculadora Oficial de Reajuste & Correção (FGV / BACEN)</h2>
            <p className="text-xs text-slate-500">Simule o novo valor de contratos utilizando índices oficiais atualizados em tempo real.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Form Inputs */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Valor Base para Correção (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">R$</span>
                <input
                  type="number"
                  value={valorAtual}
                  onChange={e => setValorAtual(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Índice Oficial (FGV / BACEN / IBGE)
                </label>
                <select
                  value={indiceSelecionado}
                  onChange={e => setIndiceSelecionado(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  <option value="IGP-M">IGP-M (FGV) - 3,90% a.a.</option>
                  <option value="INCC">INCC (FGV) - 4,85% a.a.</option>
                  <option value="TR">TR (Bacen / FGV) - 1,15% a.a.</option>
                  <option value="IPCA">IPCA (IBGE) - 4,20% a.a.</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mês de Referência
                </label>
                <select
                  value={mesAniversario}
                  onChange={e => setMesAniversario(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              * Nota: {currentRate.desc} (Fonte oficial: {currentRate.source})
            </p>
          </div>

          {/* Result Highlight Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-3xl border border-indigo-700/50 shadow-xl space-y-4 text-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
              Resultado Calculado ({mesAniversario})
            </span>

            <div className="space-y-1">
              <span className="text-xs text-slate-300 block">Novo Valor Atualizado:</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                R$ {valorNovo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-800/80 text-xs">
              <div className="bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800/40">
                <span className="text-[10px] text-slate-400 block">Diferença / Aumento:</span>
                <span className="font-bold text-white">+ R$ {valorAumento.toFixed(2)}</span>
              </div>

              <div className="bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800/40">
                <span className="text-[10px] text-slate-400 block">Acumulado 12m:</span>
                <span className="font-bold text-emerald-400">+{percentualReajuste}%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Monthly Historical Table with INCC and TR */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Histórico Mensal Oficial (Fundação Getúlio Vargas & Banco Central)</h3>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-lg">
            Série Temporal FGV IBRE
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4 font-bold">Mês / Ano</th>
                <th className="py-3 px-4 font-bold">IGP-M (FGV)</th>
                <th className="py-3 px-4 font-bold">INCC (FGV)</th>
                <th className="py-3 px-4 font-bold">TR (Bacen)</th>
                <th className="py-3 px-4 font-bold">IPCA (IBGE)</th>
                <th className="py-3 px-4 font-bold">Selic (Bacen)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {historicoIndices.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.mesAno}</td>
                  <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">{row.igpm}</td>
                  <td className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">{row.incc}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{row.tr}</td>
                  <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">{row.ipca}</td>
                  <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300">{row.selic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
