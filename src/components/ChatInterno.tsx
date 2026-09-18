import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, Users, Shield, Hash, User, Circle } from 'lucide-react';

export const ChatInterno: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    currentUser,
    users
  } = useApp();

  const [activeChannel, setActiveChannel] = useState<'geral' | 'gerentes' | 'direto'>('geral');
  const [selectedDirectUser, setSelectedDirectUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const filteredMessages = chatMessages.filter(msg => {
    if (activeChannel === 'direto') {
      if (!selectedDirectUser || !currentUser) return false;
      return (
        (msg.senderId === currentUser.id && msg.receiverId === selectedDirectUser) ||
        (msg.senderId === selectedDirectUser && msg.receiverId === currentUser.id)
      );
    }
    return msg.channel === activeChannel;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendChatMessage(
      messageText,
      activeChannel,
      activeChannel === 'direto' ? selectedDirectUser || undefined : undefined
    );

    setMessageText('');
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl">
            <MessageSquare className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Chat Interno & Comunicação da Equipe
            </h1>
            <p className="text-xs text-slate-500">
              Troque mensagens instantâneas entre corretores e gerentes de forma segura.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Window Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg h-[650px]">
        
        {/* Left Channels Sidebar */}
        <div className="md:col-span-1 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-4 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Canais da Imobiliária</div>
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveChannel('geral');
                  setSelectedDirectUser(null);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                  activeChannel === 'geral'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Hash className="w-4 h-4" />
                <span>Geral (Todos)</span>
              </button>

              <button
                onClick={() => {
                  setActiveChannel('gerentes');
                  setSelectedDirectUser(null);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                  activeChannel === 'gerentes'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Apenas Gerência</span>
              </button>
            </div>

            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider pt-2 flex items-center justify-between">
              <span>Conversa no Particular</span>
              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full font-bold">Privado</span>
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {users.filter(u => u.id !== currentUser?.id && u.status !== 'bloqueado').map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setActiveChannel('direto');
                    setSelectedDirectUser(user.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between group transition-colors ${
                    activeChannel === 'direto' && selectedDirectUser === user.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="relative shrink-0">
                      <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border border-white" />
                    </div>
                    <span className="truncate">{user.name}</span>
                  </div>
                  <span className="text-[9px] opacity-70 group-hover:opacity-100 font-bold shrink-0">Particular</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current User Card */}
          {currentUser && (
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-xl object-cover" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-emerald-500" /> Online
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Main Chat Display */}
        <div className="md:col-span-3 flex flex-col justify-between h-full bg-white dark:bg-slate-800">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-xl font-bold text-xs">
                {activeChannel === 'direto' ? 'Mensagem Direta' : `#${activeChannel}`}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {activeChannel === 'direto'
                  ? users.find(u => u.id === selectedDirectUser)?.name || 'Selecione um usuário'
                  : activeChannel === 'geral'
                  ? 'Canal Geral de Corretores e Equipe'
                  : 'Canal Exclusivo de Gerência e Alinhamento Estratégico'}
              </h3>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400">
                Nenhuma mensagem nesta conversa ainda. Envie a primeira mensagem!
              </div>
            ) : (
              filteredMessages.map(msg => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className={`max-w-md space-y-1 ${isMe ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none shadow'
                            : 'bg-slate-100 dark:bg-slate-700/80 text-slate-900 dark:text-white rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              required
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="Digite sua mensagem para a equipe..."
              className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
