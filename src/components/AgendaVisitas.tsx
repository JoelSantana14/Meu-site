import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VisitAppointment, VisitStatus } from '../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  UserCheck,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Search,
  X,
  Send
} from 'lucide-react';

export const AgendaVisitas: React.FC = () => {
  const {
    visits,
    leads,
    properties,
    users,
    addVisit,
    updateVisitStatus,
    currentUser,
    siteConfig
  } = useApp();

  const [filterAgent, setFilterAgent] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadId, setLeadId] = useState<string>(leads[0]?.id || '');
  const [propertyId, setPropertyId] = useState<string>(properties[0]?.id || '');
  const [agentId, setAgentId] = useState<string>(currentUser?.id || users[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('14:30');
  const [notes, setNotes] = useState<string>('');

  const filteredVisits = visits.filter(v => {
    if (filterAgent !== 'todos' && v.agentId !== filterAgent) return false;
    if (filterStatus !== 'todos' && v.status !== filterStatus) return false;
    if (selectedDateFilter && v.date !== selectedDateFilter) return false;
    return true;
  });

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId || !propertyId || !date || !time) return;

    addVisit({
      leadId,
      propertyId,
      agentId,
      date,
      time,
      status: 'agendada',
      notes
    });

    setIsModalOpen(false);
    setNotes('');
  };

  const handleSendWhatsappReminder = (v: VisitAppointment) => {
    const lead = leads.find(l => l.id === v.leadId);
    const prop = properties.find(p => p.id === v.propertyId);
    if (!lead) return;

    const cleanPhone = lead.phone.replace(/\D/g, '');
    const num = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(
      `Olá ${lead.name}! Passando para confirmar nossa visita agendada para o imóvel ${prop?.code || ''} no dia ${v.date} às ${v.time}. Qualquer dúvida estou à disposição!`
    );
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl">
            <CalendarIcon className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sistema de Agendamento de Visitas
            </h1>
            <p className="text-xs text-slate-500">
              Sincronize horários entre corretores, clientes e imóveis com lembretes via WhatsApp.
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDateFilter}
            onChange={e => setSelectedDateFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          />

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="todos">Todos Status</option>
            <option value="agendada">Agendadas</option>
            <option value="confirmada">Confirmadas</option>
            <option value="realizada">Realizadas</option>
            <option value="cancelada">Canceladas</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Visita</span>
          </button>
        </div>
      </div>

      {/* Visits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisits.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700">
            <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
              Nenhuma visita encontrada
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não existem compromissos agendados para os filtros selecionados.
            </p>
          </div>
        ) : (
          filteredVisits.map(visit => {
            const lead = leads.find(l => l.id === visit.leadId);
            const prop = properties.find(p => p.id === visit.propertyId);
            const agent = users.find(u => u.id === visit.agentId);

            return (
              <div
                key={visit.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col justify-between space-y-4"
              >
                {/* Date & Time Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl font-mono text-xs font-bold">
                      {visit.date} às {visit.time}
                    </span>
                  </div>

                  <select
                    value={visit.status}
                    onChange={e => updateVisitStatus(visit.id, e.target.value as VisitStatus)}
                    className={`text-[10px] font-black uppercase py-1 px-3 rounded-full border-none focus:ring-1 focus:ring-indigo-500 ${
                      visit.status === 'agendada'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : visit.status === 'confirmada'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : visit.status === 'realizada'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    <option value="agendada">Agendada</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Cliente</span>
                    <span className="font-bold text-slate-900 dark:text-white">{lead?.name || 'Cliente Externo'}</span>
                    <span className="text-[11px] text-slate-500 block">{lead?.phone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Imóvel da Visita</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block truncate">
                      {prop?.code ? `[${prop.code}] ` : ''}{prop?.title || 'Imóvel indisponível'}
                    </span>
                  </div>

                  {visit.notes && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-800">
                      "{visit.notes}"
                    </div>
                  )}
                </div>

                {/* Footer Agent & WhatsApp Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {agent && (
                      <img src={agent.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    )}
                    <span className="text-[11px] text-slate-500 font-medium">{agent?.name}</span>
                  </div>

                  <button
                    onClick={() => handleSendWhatsappReminder(visit)}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Lembrete Whats</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* NEW VISIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1">Agendar Nova Visita</h3>
            <p className="text-xs text-slate-500 mb-6">
              Vincule um cliente e imóvel para registrar no calendário do corretor.
            </p>

            <form onSubmit={handleCreateVisit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Selecione o Cliente (Lead)</label>
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

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Selecione o Imóvel</label>
                <select
                  value={propertyId}
                  onChange={e => setPropertyId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>[{p.code}] {p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Corretor Acompanhante</label>
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
                <label className="block font-bold text-slate-500 uppercase mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Pegar a chave na portaria com Seu Antônio..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all mt-2"
              >
                Salvar Agendamento na Agenda
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
