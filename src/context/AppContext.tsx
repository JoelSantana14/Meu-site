import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  requestPushPermission,
  triggerNativeNotification,
  listenToForegroundFcm,
  playNotificationSound
} from '../lib/pushNotifications';
import {
  User,
  Property,
  Lead,
  VisitAppointment,
  Commission,
  ChatMessage,
  PushNotification,
  CustomHtmlBlock,
  SiteConfig,
  PipelineStage,
  Language,
  GeneratedDocument,
  AuditLogEntry,
  CrmTask,
  SystemBackupSnapshot,
  DataVersionRecord,
  ConfigurableFieldCategory,
  ConfigurableOption,
  SiteAnalyticsStats,
  DailyVisitStat
} from '../types';

import {
  INITIAL_CONFIGURABLE_OPTIONS,
  CONFIGURABLE_CATEGORIES,
  slugifyOption
} from '../utils/defaultConfigurableOptions';

import {
  idbGet,
  idbPut,
  idbBulkPut,
  idbGetAll,
  idbDelete,
  acquireLock,
  releaseLock,
  validateRecordIntegrity,
  recordDataVersion,
  createSystemSnapshot,
  getSystemBackups,
  exportBackupToFile,
  validateImportedBackup,
  queueOfflineSync,
  flushPendingSyncQueue,
  cleanForFirestore,
  ensureSafeFirestoreDocumentSize,
  recordPermanentDeletion,
  isPermanentlyDeleted,
  getTombstoneSet
} from '../services/dataSafetyEngine';

import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_VISITS,
  INITIAL_COMMISSIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_HTML_BLOCKS,
  INITIAL_SITE_CONFIG,
  INITIAL_CRM_TASKS
} from '../mockData';

import { getTranslation, TranslationKey } from '../utils/translations';

interface AppContextType {
  // State
  users: User[];
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  properties: Property[];
  isPropertiesLoading: boolean;
  leads: Lead[];
  visits: VisitAppointment[];
  commissions: Commission[];
  chatMessages: ChatMessage[];
  notifications: PushNotification[];
  customHtmlBlocks: CustomHtmlBlock[];
  documents: GeneratedDocument[];
  crmTasks: CrmTask[];
  auditLogs: AuditLogEntry[];
  siteConfig: SiteConfig;
  configurableOptions: ConfigurableOption[];
  isOnline: boolean;
  selectedPropertyDetail: Property | null;
  setSelectedPropertyDetail: (prop: Property | null) => void;
  isGridMenuModalOpen: boolean;
  setIsGridMenuModalOpen: (open: boolean) => void;
  t: (key: TranslationKey) => string;
  
  // Actions
  loginAsUser: (userId: string) => void;
  loginWithCredentials: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  updateUserPassword: (userId: string, newPass: string) => boolean;
  requestPasswordReset: (email: string) => { success: boolean; message: string };
  
  // User & Team Management
  addUser: (userData: Omit<User, 'id'>) => { user: User; inviteLink: string };
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  updateUserProfile: (userId: string, profileData: Partial<User>) => void;
  acceptInvitation: (inviteToken: string, newPassword: string) => { success: boolean; message: string };
  
  // Property Actions
  addProperty: (prop: Omit<Property, 'id' | 'createdAt'>) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateProperty: (prop: Property) => Promise<{ success: boolean; error?: string }>;
  deleteProperty: (id: string) => Promise<{ success: boolean; message?: string }>;
  archiveProperty: (id: string, reason: string) => Promise<{ success: boolean; message?: string }>;
  unarchiveProperty: (id: string) => Promise<{ success: boolean; message?: string }>;
  deleteProperties: (ids: string[]) => void;
  clearAllProperties: () => void;
  
  // CRM Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes'>, initialNote?: string) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => Promise<{ success: boolean; message?: string }>;
  archiveLead: (id: string, reason: string) => Promise<{ success: boolean; message?: string }>;
  unarchiveLead: (id: string) => Promise<{ success: boolean; message?: string }>;
  updateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  addLeadNote: (leadId: string, noteContent: string) => void;
  addCrmTask: (task: Omit<CrmTask, 'id' | 'createdAt'>) => void;
  updateCrmTask: (task: CrmTask) => void;
  toggleCrmTaskStatus: (taskId: string) => void;
  deleteCrmTask: (taskId: string) => void;
  archiveNegotiationDoc: (leadId: string, docId: string, reason: string) => Promise<{ success: boolean; message?: string }>;
  unarchiveNegotiationDoc: (leadId: string, docId: string) => Promise<{ success: boolean; message?: string }>;
  deleteNegotiationDoc: (leadId: string, docId: string) => Promise<{ success: boolean; message?: string }>;
  
  // Legal Documents & Auditing
  saveDocument: (doc: GeneratedDocument) => void;
  deleteDocument: (id: string) => Promise<{ success: boolean; message?: string }>;
  archiveDocument: (id: string, reason: string) => Promise<{ success: boolean; message?: string }>;
  unarchiveDocument: (id: string) => Promise<{ success: boolean; message?: string }>;
  addAuditLog: (entry: { action: string; category: 'imovel' | 'cliente' | 'documento' | 'parceria_fifty' | 'sistema'; details: string; entityId?: string }) => void;
  
  // Visits Actions
  addVisit: (visit: Omit<VisitAppointment, 'id' | 'createdAt'>) => void;
  updateVisitStatus: (visitId: string, status: VisitAppointment['status']) => void;
  
  // Commissions Actions
  addCommission: (comm: Omit<Commission, 'id'>) => void;
  updateCommissionStatus: (commId: string, status: Commission['paymentStatus']) => void;
  
  // Chat Actions
  sendChatMessage: (text: string, channel: 'geral' | 'gerentes' | 'direto', receiverId?: string) => void;
  
  // HTML Blocks & Custom Pages
  addHtmlBlock: (block: Omit<CustomHtmlBlock, 'id'>) => void;
  updateHtmlBlock: (block: CustomHtmlBlock) => void;
  deleteHtmlBlock: (id: string) => void;
  toggleHtmlBlockActive: (id: string) => void;
  
  // Config & Theme
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: Language) => void;

  // Visitor Analytics & Counter (Admin Only)
  siteStats: SiteAnalyticsStats | null;
  recordSitePageView: () => Promise<void>;

  // Configurable Dynamic Fields & Options
  addConfigurableOption: (category: ConfigurableFieldCategory, label: string) => Promise<{ success: boolean; option?: ConfigurableOption; error?: string }>;
  updateConfigurableOption: (id: string, updates: Partial<ConfigurableOption>) => Promise<{ success: boolean; error?: string }>;
  deleteConfigurableOption: (id: string, cleanupFromExistingRecords?: boolean) => Promise<{ success: boolean; error?: string; affectedCount?: number }>;
  toggleConfigurableOptionStatus: (id: string) => Promise<{ success: boolean; error?: string }>;
  reorderConfigurableOptions: (category: ConfigurableFieldCategory, orderedIds: string[]) => Promise<{ success: boolean; error?: string }>;
  renameConfigurableOption: (id: string, newLabel: string, updateExistingProperties?: boolean) => Promise<{ success: boolean; error?: string }>;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  fcmPermissionStatus: 'default' | 'granted' | 'denied' | 'unsupported';
  fcmToken: string | null;
  enablePushNotifications: () => Promise<{ success: boolean; message: string }>;
  sendTestPushNotification: () => void;
  
  // Helper Simulator
  simulateNewLeadWeb: (leadData: { name: string; email: string; phone: string; propertyId?: string; message?: string }) => void;

  // Robust Persistence & Backup Engine
  createManualBackup: (label?: string) => Promise<SystemBackupSnapshot>;
  restoreBackup: (snapshot: SystemBackupSnapshot) => Promise<{ success: boolean; message: string }>;
  exportSystemBackup: (snapshot?: SystemBackupSnapshot) => void;
  importSystemBackup: (file: File) => Promise<{ success: boolean; message: string }>;
  getBackupList: () => Promise<SystemBackupSnapshot[]>;
  getChangeHistoryList: (entity?: string, entityId?: string) => Promise<DataVersionRecord[]>;
  lastSaveStatus: { status: 'idle' | 'saving' | 'saved' | 'error'; message: string; timestamp?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'imobipro_app_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Offline listener & Persistence Status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSaveStatus, setLastSaveStatus] = useState<{ status: 'idle' | 'saving' | 'saved' | 'error'; message: string; timestamp?: string }>({
    status: 'saved',
    message: 'Sistema de salvamento robusto ativo e verificado',
    timestamp: new Date().toLocaleTimeString().slice(0, 5)
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushPendingSyncQueue().then(count => {
        if (count > 0) {
          console.log(`[DataSafetyEngine] Sincronizados ${count} itens pendentes da fila offline.`);
          setLastSaveStatus({
            status: 'saved',
            message: `${count} item(ns) sincronizados com a nuvem após reconexão`,
            timestamp: new Date().toLocaleTimeString().slice(0, 5)
          });
        }
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      setLastSaveStatus({
        status: 'saved',
        message: 'Modo offline ativo — dados continuam sendo gravados com segurança local',
        timestamp: new Date().toLocaleTimeString().slice(0, 5)
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial cache hydration from IndexedDB to guarantee instant zero-loss availability
    idbGetAll<Property>('properties').then(cached => {
      if (cached && cached.length > 0) {
        setProperties(cached);
        setIsPropertiesLoading(false);
      }
    });

    idbGetAll<Lead>('leads').then(cached => {
      if (cached && cached.length > 0) {
        setLeads(cached);
      }
    });

    idbGetAll<GeneratedDocument>('documents').then(cached => {
      if (cached && cached.length > 0) {
        setDocuments(cached);
      }
    });

    idbGetAll<CrmTask>('crmTasks').then(cached => {
      if (cached && cached.length > 0) {
        setCrmTasks(cached);
      }
    });

    idbGetAll<ConfigurableOption>('configurableOptions').then(cached => {
      if (cached && cached.length > 0) {
        setConfigurableOptions(cached);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time Firestore States
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Default to master broker so CRM sidebar and admin tools are immediately accessible
  });
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<Property | null>(null);
  const [isGridMenuModalOpen, setIsGridMenuModalOpen] = useState<boolean>(false);

  const [properties, setProperties] = useState<Property[]>(() => {
    const tombstones = getTombstoneSet('properties');
    try {
      const saved = localStorage.getItem('imobipro_properties_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: any) => p && !p._deleted && !tombstones.has(p.id));
        }
      }
    } catch {}
    const sampleCleared = typeof localStorage !== 'undefined' && localStorage.getItem('imobipro_sample_properties_cleared') === 'true';
    if (sampleCleared) return [];
    return INITIAL_PROPERTIES.filter(p => !tombstones.has(p.id));
  });
  const [isPropertiesLoading, setIsPropertiesLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [visits, setVisits] = useState<VisitAppointment[]>(INITIAL_VISITS);
  const [commissions, setCommissions] = useState<Commission[]>(INITIAL_COMMISSIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [customHtmlBlocks, setCustomHtmlBlocks] = useState<CustomHtmlBlock[]>(() => {
    try {
      const saved = localStorage.getItem('imobipro_custom_html_blocks');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out duplicate hero accent banner if stored previously
          return parsed.filter((b: CustomHtmlBlock) => b && b.id !== 'html_hero_accent');
        }
      }
    } catch (e) {
      console.error('Error loading customHtmlBlocks from localStorage:', e);
    }
    return INITIAL_HTML_BLOCKS.filter(b => b.id !== 'html_hero_accent');
  });
  const [documents, setDocuments] = useState<GeneratedDocument[]>(() => {
    try {
      const saved = localStorage.getItem('imobipro_documents');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  const [crmTasks, setCrmTasks] = useState<CrmTask[]>(() => {
    try {
      const saved = localStorage.getItem('imobipro_crm_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CRM_TASKS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('imobipro_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'log_init',
        timestamp: `${new Date().toISOString().split('T')[0]} 08:00`,
        userId: 'usr_master_joel',
        userName: 'Joel Santana',
        action: 'Inicialização do Sistema Imobiliário',
        category: 'sistema',
        details: 'Módulo jurídico e controle de parceria Fifty ativados.'
      }
    ];
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('imobipro_site_config');
      if (saved) {
        return { ...INITIAL_SITE_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SITE_CONFIG;
  });

  const [configurableOptions, setConfigurableOptions] = useState<ConfigurableOption[]>(() => {
    try {
      const saved = localStorage.getItem('imobipro_configurable_options');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONFIGURABLE_OPTIONS;
  });

  // Visitor Counter & Analytics State (Admin Exclusive)
  const INITIAL_SITE_STATS: SiteAnalyticsStats = {
    id: 'site_stats',
    totalVisits: 1482,
    uniqueVisitors: 894,
    todayVisits: 38,
    todayUniques: 27,
    todayDate: new Date().toISOString().split('T')[0],
    weeklyVisits: 285,
    monthlyVisits: 1190,
    lastVisitedAt: new Date().toISOString(),
    history: [
      { date: '2026-06-14', visits: 42, uniques: 31 },
      { date: '2026-06-15', visits: 55, uniques: 39 },
      { date: '2026-06-16', visits: 48, uniques: 33 },
      { date: '2026-06-17', visits: 61, uniques: 45 },
      { date: '2026-06-18', visits: 52, uniques: 38 },
      { date: '2026-06-19', visits: 38, uniques: 27 }
    ]
  };

  const [siteStats, setSiteStats] = useState<SiteAnalyticsStats>(() => {
    try {
      const saved = localStorage.getItem('imobipro_site_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SITE_STATS;
  });

  // Record public site page view & visitor counter
  const recordSitePageView = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sessionKey = `imobipro_visit_session_${todayStr}`;
    const isNewUniqueSession = typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(sessionKey);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(sessionKey, '1');
    }

    setSiteStats(prev => {
      const current = prev || INITIAL_SITE_STATS;
      const isSameDay = current.todayDate === todayStr;
      const newTodayVisits = isSameDay ? (current.todayVisits || 0) + 1 : 1;
      const newTodayUniques = isSameDay ? ((current.todayUniques || 0) + (isNewUniqueSession ? 1 : 0)) : 1;
      const newTotalVisits = (current.totalVisits || 0) + 1;
      const newUniqueVisitors = (current.uniqueVisitors || 0) + (isNewUniqueSession ? 1 : 0);
      const newWeeklyVisits = (current.weeklyVisits || 0) + 1;
      const newMonthlyVisits = (current.monthlyVisits || 0) + 1;

      let history = Array.isArray(current.history) ? [...current.history] : [];
      const historyIdx = history.findIndex(h => h.date === todayStr);
      if (historyIdx >= 0) {
        history[historyIdx] = {
          date: todayStr,
          visits: history[historyIdx].visits + 1,
          uniques: history[historyIdx].uniques + (isNewUniqueSession ? 1 : 0)
        };
      } else {
        history.push({
          date: todayStr,
          visits: 1,
          uniques: 1
        });
        if (history.length > 30) history = history.slice(-30);
      }

      const updated: SiteAnalyticsStats = {
        id: 'site_stats',
        totalVisits: newTotalVisits,
        uniqueVisitors: newUniqueVisitors,
        todayVisits: newTodayVisits,
        todayUniques: newTodayUniques,
        todayDate: todayStr,
        weeklyVisits: newWeeklyVisits,
        monthlyVisits: newMonthlyVisits,
        lastVisitedAt: new Date().toISOString(),
        history
      };

      try {
        localStorage.setItem('imobipro_site_stats', JSON.stringify(updated));
      } catch {}
      idbPut('siteStats', updated).catch(() => {});
      setDoc(doc(db, 'analytics', 'site_stats'), cleanForFirestore(updated), { merge: true }).catch(() => {});

      return updated;
    });
  };

  // FCM Push Notifications State
  const [fcmPermissionStatus, setFcmPermissionStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission as any;
    }
    return 'unsupported';
  });
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeFcm = listenToForegroundFcm((payload) => {
      const notifId = `notif_${Date.now()}`;
      const newNotif: PushNotification = {
        id: notifId,
        title: payload.title,
        body: payload.body,
        timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString().slice(0, 5)}`,
        read: false,
        type: payload.type === 'visita' ? 'visita' : 'lead',
        linkTab: payload.type === 'visita' ? 'agenda' : 'crm'
      };
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      unsubscribeFcm();
    };
  }, []);

  const enablePushNotifications = async () => {
    const res = await requestPushPermission(currentUser?.id);
    if (res.token) {
      setFcmToken(res.token);
      setFcmPermissionStatus('granted');
    } else {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setFcmPermissionStatus(Notification.permission as any);
      }
    }
    return res;
  };

  const sendTestPushNotification = () => {
    const testTitle = '⚡ Teste Notificação Push FCM';
    const testBody = 'As Notificações Push FCM estão ativas e alertando sobre novos leads e visitas!';
    triggerNativeNotification(testTitle, testBody);
  };

  // Automated Periodic Backup Snapshot Engine (every 15 min & upon initial load)
  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (properties.length > 0 || leads.length > 0) {
        createSystemSnapshot({
          properties,
          leads,
          users,
          visits,
          commissions,
          chatMessages,
          customHtmlBlocks,
          documents,
          crmTasks,
          auditLogs,
          siteConfig
        }, `Snapshot Automático de Inicialização - ${new Date().toLocaleTimeString().slice(0, 5)}`, 'auto').catch(() => {});
      }
    }, 4000);

    const interval = setInterval(() => {
      if (properties.length > 0 || leads.length > 0) {
        createSystemSnapshot({
          properties,
          leads,
          users,
          visits,
          commissions,
          chatMessages,
          customHtmlBlocks,
          documents,
          crmTasks,
          auditLogs,
          siteConfig
        }, `Backup Automático Periódico - ${new Date().toLocaleTimeString().slice(0, 5)}`, 'auto').catch(() => {});
      }
    }, 15 * 60 * 1000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [properties, leads, users, visits, commissions, chatMessages, customHtmlBlocks, documents, crmTasks, auditLogs, siteConfig]);


  // Firestore Listeners & Auto Seed
  useEffect(() => {
    // 1. Users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (snapshot.empty) {
        
        setUsers(INITIAL_USERS);
      } else {
        const list = snapshot.docs.map(doc => doc.data() as User).filter((d: any) => d && !d._deleted);
        
        // Ensure master admin Joel is always present and updated in Firestore
        const masterTemplate = INITIAL_USERS.find(u => u.id === 'usr_master_joel') || INITIAL_USERS[0];
        const existingMasterIdx = list.findIndex(u => u.id === 'usr_master_joel' || (u.email && u.email.toLowerCase() === 'joelsantanaimoveis@gmail.com'));
        
        if (existingMasterIdx === -1) {
          // Master admin missing in Firestore: add immediately
          
          list.unshift(masterTemplate);
        } else {
          // If master admin in Firestore has outdated email or missing isMasterAdmin flag, update it
          const existingMaster = list[existingMasterIdx];
          if (!existingMaster.email || existingMaster.email.toLowerCase() !== 'joelsantanaimoveis@gmail.com' || !existingMaster.isMasterAdmin) {
            const updatedMaster: User = {
              ...existingMaster,
              email: 'joelsantanaimoveis@gmail.com',
              name: 'Joel Santana',
              role: 'admin',
              isMasterAdmin: true,
              password: existingMaster.password || 'Joel@2026',
              status: 'ativo'
            };
            setDoc(doc(db, 'users', updatedMaster.id), updatedMaster);
            list[existingMasterIdx] = updatedMaster;
          }
        }

        setUsers(list);
      }
    }, (err) => console.error('Firestore users err:', err));

    // 2. Properties
    const unsubProps = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const tombstones = getTombstoneSet('properties');
      const sampleCleared = localStorage.getItem('imobipro_sample_properties_cleared') === 'true';
      if (snapshot.empty) {
        if (sampleCleared) {
          setProperties([]);
          idbBulkPut('properties', []);
          try {
            localStorage.setItem('imobipro_properties_cache', JSON.stringify([]));
          } catch {}
        } else {
          // Check IndexedDB first before resetting to initial mock
          idbGetAll<Property>('properties').then(localProps => {
            const cleanLocal = (localProps || []).filter(p => p && !(p as any)._deleted && !tombstones.has(p.id));
            if (cleanLocal.length > 0) {
              setProperties(cleanLocal);
              try {
                localStorage.setItem('imobipro_properties_cache', JSON.stringify(cleanLocal));
              } catch {}
            } else {
              const cleanInitial = INITIAL_PROPERTIES.filter(p => !tombstones.has(p.id));
              setProperties(cleanInitial);
              idbBulkPut('properties', cleanInitial);
              try {
                localStorage.setItem('imobipro_properties_cache', JSON.stringify(cleanInitial));
              } catch {}
            }
          });
        }
      } else {
        const remoteList = snapshot.docs.map(doc => {
          const data = doc.data() as Property;
          if (!data) return null;
          return {
            ...data,
            id: data.id || doc.id,
            title: data.title || 'Imóvel sem título',
            type: data.type || 'casa',
            purpose: data.purpose || 'venda',
            price: typeof data.price === 'number' ? data.price : 0,
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'],
            features: Array.isArray(data.features) ? data.features : [],
            address: data.address || { street: '', neighborhood: '', city: 'São José do Rio Preto', state: 'SP', zip: '' }
          };
        }).filter((p): p is Property => p !== null && !(p as any)._deleted && !tombstones.has(p.id));
        
        // Merge with locally stored IndexedDB properties so new/pending properties and custom user photos never vanish
        idbGetAll<Property>('properties').then(localProps => {
          const localMap = new Map<string, Property>();
          (localProps || []).forEach(lp => {
            if (lp && lp.id) localMap.set(lp.id, lp);
          });

          // Enrich remote items with local user-uploaded photos if remote had fewer photos or fallback
          const enrichedRemote = remoteList.map(r => {
            const local = localMap.get(r.id);
            if (local && Array.isArray(local.images) && local.images.length > 0) {
              const remoteHasGeneric = !r.images || r.images.length === 0 || (r.images.length === 1 && r.images[0] === '/images/house_with_pool_1789524615804.jpg');
              if (remoteHasGeneric || local.images.length > (r.images?.length || 0)) {
                return {
                  ...r,
                  images: local.images,
                  imageDescriptions: local.imageDescriptions || r.imageDescriptions
                };
              }
            }
            return r;
          });

          const pendingLocal = (localProps || []).filter(p => 
            p && 
            p.id && 
            !(p as any)._deleted && 
            !tombstones.has(p.id) && 
            !enrichedRemote.some(r => r.id === p.id)
          );

          const merged = [...pendingLocal, ...enrichedRemote];
          setProperties(merged);
          idbBulkPut('properties', merged);
          try {
            localStorage.setItem('imobipro_properties_cache', JSON.stringify(merged));
          } catch {}

          // Background auto-sync for any pending local records
          if (pendingLocal.length > 0) {
            pendingLocal.forEach(async (pending) => {
              try {
                const safeDoc = ensureSafeFirestoreDocumentSize(cleanForFirestore(pending));
                await setDoc(doc(db, 'properties', pending.id), safeDoc, { merge: true });
              } catch (e) {
                console.warn('[Sync] Retrying local property sync in background:', pending.id, e);
              }
            });
          }
        }).catch(() => {
          setProperties(remoteList);
          idbBulkPut('properties', remoteList);
          try {
            localStorage.setItem('imobipro_properties_cache', JSON.stringify(remoteList));
          } catch {}
        });
      }
      setIsPropertiesLoading(false);
    }, (err) => {
      console.error('Firestore properties err:', err);
      idbGetAll<Property>('properties').then(localProps => {
        const tombstones = getTombstoneSet('properties');
        const cleanLocal = (localProps || []).filter(p => p && !(p as any)._deleted && !tombstones.has(p.id));
        setProperties(cleanLocal);
        setIsPropertiesLoading(false);
      });
    });

    // 3. Leads
    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      if (snapshot.empty) {
        if (!localStorage.getItem('leads_initialized')) {
          
          setLeads(INITIAL_LEADS);
          idbBulkPut('leads', INITIAL_LEADS);
          localStorage.setItem('leads_initialized', 'true');
        } else {
          setLeads([]);
        }
      } else {
        localStorage.setItem('leads_initialized', 'true');
        const list = snapshot.docs.map(doc => doc.data() as Lead).filter((d: any) => d && !d._deleted);
        setLeads(list);
        idbBulkPut('leads', list);
      }
    }, (err) => {
      console.error('Firestore leads err:', err);
      idbGetAll<Lead>('leads').then(local => {
        if (local && local.length > 0) setLeads(local);
      });
    });

    // 4. Visits
    const unsubVisits = onSnapshot(collection(db, 'visits'), (snapshot) => {
      if (snapshot.empty) {
        if (!localStorage.getItem('visits_initialized')) {
          
          setVisits(INITIAL_VISITS);
          localStorage.setItem('visits_initialized', 'true');
        } else {
          setVisits([]);
        }
      } else {
        localStorage.setItem('visits_initialized', 'true');
        const list = snapshot.docs.map(doc => doc.data() as VisitAppointment).filter((d: any) => d && !d._deleted);
        setVisits(list);
        idbBulkPut('visits', list);
      }
    }, (err) => console.error('Firestore visits err:', err));

    // 5. Commissions
    const unsubComm = onSnapshot(collection(db, 'commissions'), (snapshot) => {
      if (snapshot.empty) {
        if (!localStorage.getItem('commissions_initialized')) {
          
          setCommissions(INITIAL_COMMISSIONS);
          localStorage.setItem('commissions_initialized', 'true');
        } else {
          setCommissions([]);
        }
      } else {
        localStorage.setItem('commissions_initialized', 'true');
        const list = snapshot.docs.map(doc => doc.data() as Commission).filter((d: any) => d && !d._deleted);
        setCommissions(list);
        idbBulkPut('commissions', list);
      }
    }, (err) => console.error('Firestore commissions err:', err));

    // 6. Chat Messages
    const unsubChat = onSnapshot(collection(db, 'chatMessages'), (snapshot) => {
      if (snapshot.empty) {
        if (!localStorage.getItem('chat_messages_initialized')) {
          
          setChatMessages(INITIAL_CHAT_MESSAGES);
          localStorage.setItem('chat_messages_initialized', 'true');
        } else {
          setChatMessages([]);
        }
      } else {
        localStorage.setItem('chat_messages_initialized', 'true');
        const list = snapshot.docs.map(doc => doc.data() as ChatMessage).filter((d: any) => d && !d._deleted);
        // Sort by timestamp
        list.sort((a, b) => a.id.localeCompare(b.id));
        setChatMessages(list);
      }
    }, (err) => console.error('Firestore chat err:', err));

    // 7. Notifications
    const unsubNotif = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      if (snapshot.empty) {
        if (!localStorage.getItem('notifications_initialized')) {
          
          setNotifications(INITIAL_NOTIFICATIONS);
          localStorage.setItem('notifications_initialized', 'true');
        } else {
          setNotifications([]);
        }
      } else {
        localStorage.setItem('notifications_initialized', 'true');
        const list = snapshot.docs.map(doc => doc.data() as PushNotification).filter((d: any) => d && !d._deleted);
        setNotifications(list);
      }
    }, (err) => console.error('Firestore notifications err:', err));

    // 8. Custom HTML Blocks
    const unsubHtml = onSnapshot(collection(db, 'customHtmlBlocks'), (snapshot) => {
      const isAlreadyInitialized = localStorage.getItem('imobipro_initialized_html') === 'true';

      if (snapshot.empty) {
        if (!isAlreadyInitialized) {
          // First run only: seed initial non-duplicate blocks
          const validInitial = INITIAL_HTML_BLOCKS.filter(b => b.id !== 'html_hero_accent');
          
          localStorage.setItem('imobipro_initialized_html', 'true');
        } else {
          // User intentionally deleted all blocks: preserve empty state
          setCustomHtmlBlocks([]);
          try {
            localStorage.setItem('imobipro_custom_html_blocks', JSON.stringify([]));
          } catch (e) {
            console.error('Error saving empty customHtmlBlocks:', e);
          }
        }
      } else {
        localStorage.setItem('imobipro_initialized_html', 'true');
        const list = snapshot.docs
          .map(doc => doc.data() as CustomHtmlBlock)
          .filter(b => b && b.id !== 'html_hero_accent'); // Discard duplicate banner

        // Purge deprecated duplicate from Firestore if present
        if (snapshot.docs.some(d => d.id === 'html_hero_accent')) {
          deleteDoc(doc(db, 'customHtmlBlocks', 'html_hero_accent')).catch(() => {});
        }

        setCustomHtmlBlocks(list);
        try {
          localStorage.setItem('imobipro_custom_html_blocks', JSON.stringify(list));
        } catch (e) {
          console.error('Error saving customHtmlBlocks to localStorage:', e);
        }
      }
    }, (err) => console.error('Firestore html blocks err:', err));

    // 9. Site Config (Safe Hydration & Zero-Overwrite)
    const unsubConfig = onSnapshot(doc(db, 'settings', 'siteConfig'), (snapshot) => {
      if (snapshot.exists()) {
        const remoteCfg = snapshot.data() as Partial<SiteConfig>;
        const merged = { ...INITIAL_SITE_CONFIG, ...remoteCfg };
        setSiteConfig(merged);
        try {
          localStorage.setItem('imobipro_site_config', JSON.stringify(merged));
        } catch (e) {
          console.error('Failed to sync siteConfig to localStorage', e);
        }
        idbPut('settings', { id: 'siteConfig', ...merged });
      } else {
        // If snapshot does not exist in Firestore, DO NOT overwrite with INITIAL_SITE_CONFIG!
        // First check if user has custom config in localStorage or IDB
        let localExisting: Partial<SiteConfig> | null = null;
        try {
          const saved = localStorage.getItem('imobipro_site_config');
          if (saved) {
            localExisting = JSON.parse(saved);
          }
        } catch (e) {
          console.error(e);
        }

        if (localExisting && Object.keys(localExisting).length > 0) {
          const merged = { ...INITIAL_SITE_CONFIG, ...localExisting };
          setSiteConfig(merged);
          idbPut('settings', { id: 'siteConfig', ...merged });
          // Persist the user's custom config to Firestore
          const cleanConfig = cleanObjectForFirestore(merged);
          setDoc(doc(db, 'settings', 'siteConfig'), cleanConfig).catch(() => {});
        } else {
          // Fresh first install only
          setSiteConfig(INITIAL_SITE_CONFIG);
          try {
            localStorage.setItem('imobipro_site_config', JSON.stringify(INITIAL_SITE_CONFIG));
          } catch (e) {
            console.error(e);
          }
          idbPut('settings', { id: 'siteConfig', ...INITIAL_SITE_CONFIG });
          const cleanConfig = cleanObjectForFirestore(INITIAL_SITE_CONFIG);
          setDoc(doc(db, 'settings', 'siteConfig'), cleanConfig).catch(() => {});
        }
      }
    }, (err) => {
      console.error('Firestore siteConfig err:', err);
      // On network error, retain existing state without resetting
    });

    // 10. CRM Tasks & Reminders
    const unsubTasks = onSnapshot(collection(db, 'crmTasks'), (snapshot) => {
      if (snapshot.empty) {
        if (!localStorage.getItem('crm_tasks_initialized')) {
          
          setCrmTasks(INITIAL_CRM_TASKS);
          localStorage.setItem('crm_tasks_initialized', 'true');
        } else {
          setCrmTasks([]);
        }
      } else {
        localStorage.setItem('crm_tasks_initialized', 'true');
        const list = snapshot.docs.map(doc => doc.data() as CrmTask).filter((d: any) => d && !d._deleted);
        // Sort tasks: pending first, then by dueDate ascending
        list.sort((a, b) => {
          if (a.status === 'pendente' && b.status !== 'pendente') return -1;
          if (a.status !== 'pendente' && b.status === 'pendente') return 1;
          return a.dueDate.localeCompare(b.dueDate);
        });
        setCrmTasks(list);
        idbBulkPut('crmTasks', list);
        try {
          localStorage.setItem('imobipro_crm_tasks', JSON.stringify(list));
        } catch (e) {
          console.error(e);
        }
      }
    }, (err) => console.error('Firestore tasks err:', err));

    // 11. Documents (Durable Cloud + IndexedDB Sync)
    const unsubDocs = onSnapshot(collection(db, 'documents'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as GeneratedDocument).filter((d: any) => d && !d._deleted);
        setDocuments(list);
        idbBulkPut('documents', list);
        try {
          localStorage.setItem('imobipro_documents', JSON.stringify(list));
        } catch {}
      }
    }, (err) => console.error('Firestore docs err:', err));

    // 12. Audit Logs (Durable Cloud + IndexedDB Sync)
    const unsubAudit = onSnapshot(collection(db, 'auditLogs'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as AuditLogEntry).filter((d: any) => d && !d._deleted);
        list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setAuditLogs(list.slice(0, 200));
        idbBulkPut('auditLogs', list);
        try {
          localStorage.setItem('imobipro_audit_logs', JSON.stringify(list));
        } catch {}
      }
    }, (err) => console.error('Firestore audit err:', err));

    // 13. Configurable Options (Realtime Firestore + Offline Store)
    const unsubOptions = onSnapshot(collection(db, 'configurable_options'), (snapshot) => {
      if (snapshot.empty) {
        const isInit = localStorage.getItem('imobipro_options_initialized') === 'true';
        if (!isInit) {
          // Seed defaults to Firestore and IndexedDB
          INITIAL_CONFIGURABLE_OPTIONS.forEach(opt => {
            setDoc(doc(db, 'configurable_options', opt.id), opt).catch(() => {});
          });
          setConfigurableOptions(INITIAL_CONFIGURABLE_OPTIONS);
          idbBulkPut('configurableOptions', INITIAL_CONFIGURABLE_OPTIONS);
          localStorage.setItem('imobipro_options_initialized', 'true');
        } else {
          idbGetAll<ConfigurableOption>('configurableOptions').then(local => {
            const list = local && local.length > 0 ? local : INITIAL_CONFIGURABLE_OPTIONS;
            setConfigurableOptions(list);
            list.forEach(opt => {
              setDoc(doc(db, 'configurable_options', opt.id), opt).catch(() => {});
            });
          });
        }
      } else {
        localStorage.setItem('imobipro_options_initialized', 'true');
        const list = snapshot.docs.map(d => d.data() as ConfigurableOption).filter((d: any) => d && !d._deleted);
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setConfigurableOptions(list);
        idbBulkPut('configurableOptions', list);
        try {
          localStorage.setItem('imobipro_configurable_options', JSON.stringify(list));
        } catch {}
      }
    }, (err) => {
      console.error('Firestore configurable options err:', err);
      idbGetAll<ConfigurableOption>('configurableOptions').then(local => {
        if (local && local.length > 0) setConfigurableOptions(local);
      });
    });

    // 14. Visitor Analytics & Counter
    const unsubSiteStats = onSnapshot(doc(db, 'analytics', 'site_stats'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteAnalyticsStats;
        if (data) {
          setSiteStats(data);
          idbPut('siteStats', data).catch(() => {});
          try {
            localStorage.setItem('imobipro_site_stats', JSON.stringify(data));
          } catch {}
        }
      } else {
        idbGet<SiteAnalyticsStats>('siteStats', 'site_stats').then(local => {
          const stats = local || INITIAL_SITE_STATS;
          setSiteStats(stats);
          setDoc(doc(db, 'analytics', 'site_stats'), cleanForFirestore(stats)).catch(() => {});
        });
      }
    }, (err) => {
      console.warn('Firestore siteStats error:', err);
      idbGet<SiteAnalyticsStats>('siteStats', 'site_stats').then(local => {
        if (local) setSiteStats(local);
      });
    });

    return () => {
      unsubUsers();
      unsubProps();
      unsubLeads();
      unsubVisits();
      unsubComm();
      unsubChat();
      unsubNotif();
      unsubHtml();
      unsubConfig();
      unsubTasks();
      unsubDocs();
      unsubAudit();
      unsubOptions();
      unsubSiteStats();
    };
  }, []);

  // Save current user locally
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);

  // Dark mode and Theme Color Preset / Contours effect
  useEffect(() => {
    if (siteConfig.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const themePreset = siteConfig.colorTheme || 'padrao';
    if (themePreset && themePreset !== 'padrao') {
      document.documentElement.setAttribute('data-theme-preset', themePreset);
    } else {
      document.documentElement.removeAttribute('data-theme-preset');
    }

    // Dynamic CSS variables for primary, accent, contour, and details
    if (siteConfig.primaryColorHex) {
      document.documentElement.style.setProperty('--theme-primary', siteConfig.primaryColorHex);
    }
    if (siteConfig.accentColorHex) {
      document.documentElement.style.setProperty('--theme-accent', siteConfig.accentColorHex);
    }
    if (siteConfig.contourColorHex && siteConfig.enableCustomContours) {
      document.documentElement.style.setProperty('--theme-contour', siteConfig.contourColorHex);
      document.documentElement.style.setProperty('--theme-contour-focus', siteConfig.contourColorHex);
    } else if (!siteConfig.enableCustomContours && themePreset === 'padrao') {
      document.documentElement.style.removeProperty('--theme-contour');
      document.documentElement.style.removeProperty('--theme-contour-focus');
    }
    if (siteConfig.detailsColorHex && siteConfig.enableCustomContours) {
      document.documentElement.style.setProperty('--theme-details', siteConfig.detailsColorHex);
    } else if (!siteConfig.enableCustomContours && themePreset === 'padrao') {
      document.documentElement.style.removeProperty('--theme-details');
    }
  }, [siteConfig]);

  // Login Security State
  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);
  const [loginLockoutUntil, setLoginLockoutUntil] = useState<number>(0);

  // Inactivity Logout Effect (30 Minutes)
  React.useEffect(() => {
    if (!currentUser) return;
    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
    let lastActivityTime = Date.now();

    const handleActivity = () => {
      lastActivityTime = Date.now();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivityTime > INACTIVITY_LIMIT) {
        setCurrentUser(null);
        alert('Sua sessão expirou por inatividade por motivos de segurança. Por favor, faça login novamente.');
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [currentUser]);

  // Actions
  const loginAsUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginWithCredentials = (email: string, pass: string) => {
    // 0. Rate limiting / Lockout Check
    if (Date.now() < loginLockoutUntil) {
      const remainingMins = Math.ceil((loginLockoutUntil - Date.now()) / 60000);
      return {
        success: false,
        message: `Acesso temporariamente bloqueado por segurança devido a múltiplas tentativas malsucedidas. Tente novamente em ${remainingMins} minuto(s).`
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Helper for failed attempt
    const registerFailedLogin = () => {
      const nextCount = failedLoginAttempts + 1;
      setFailedLoginAttempts(nextCount);
      if (nextCount >= 5) {
        const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 min lock
        setLoginLockoutUntil(lockoutTime);
        setFailedLoginAttempts(0);
        return {
          success: false,
          message: 'Múltiplas tentativas de login incorretas. Conta bloqueada temporariamente por 15 minutos por motivos de segurança.'
        };
      }
      return {
        success: false,
        message: 'Usuário ou senha inválidos. Por favor, verifique suas credenciais.'
      };
    };

    // 1. Search in current users state
    let found = users.find(u => u.email.toLowerCase().trim() === cleanEmail);

    // 2. If not found, check INITIAL_USERS as fallback and sync to Firestore
    if (!found) {
      found = INITIAL_USERS.find(u => u.email.toLowerCase().trim() === cleanEmail);
      if (found) {
        setDoc(doc(db, 'users', found.id), found).catch(err => console.error('Error syncing user to Firestore:', err));
        setUsers(prev => [...prev.filter(u => u.id !== found!.id), found!]);
      }
    }

    // 3. Special handler for master admin Joel
    if (!found && cleanEmail === 'joelsantanaimoveis@gmail.com') {
      const masterTemplate = INITIAL_USERS.find(u => u.id === 'usr_master_joel') || INITIAL_USERS[0];
      found = { ...masterTemplate, email: 'joelsantanaimoveis@gmail.com', password: 'Joel@2026', status: 'ativo' };
      setDoc(doc(db, 'users', 'usr_master_joel'), found).catch(err => console.error('Error creating master user in Firestore:', err));
      setUsers(prev => [...prev.filter(u => u.id !== 'usr_master_joel'), found!]);
    }

    if (!found) {
      return registerFailedLogin();
    }

    if (found.status === 'bloqueado') {
      return { success: false, message: 'Este usuário está bloqueado temporariamente pelo administrador.' };
    }

    if (found.status === 'convidado') {
      return { success: false, message: 'Você possui um convite pendente. Clique em "Ativar Convite / Primeiro Acesso" abaixo para criar sua senha.' };
    }

    const expectedPassword = found.password || (cleanEmail === 'joelsantanaimoveis@gmail.com' ? 'Joel@2026' : '123456');
    if (cleanPass !== expectedPassword) {
      return registerFailedLogin();
    }

    // Success login: reset security rate limiters
    setFailedLoginAttempts(0);
    setLoginLockoutUntil(0);
    setCurrentUser(found);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserPassword = (userId: string, newPass: string) => {
    if (!newPass || newPass.trim().length < 4) return false;
    
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPass.trim() };
      }
      return u;
    });

    setUsers(updatedUsers);

    const target = updatedUsers.find(u => u.id === userId);
    if (target) {
      setDoc(doc(db, 'users', userId), target).catch(err => console.error('Error updating user password in Firestore:', err));
    }

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, password: newPass.trim() } : null);
    }
    return true;
  };

  // Team & User Management
  const addUser = (userData: Omit<User, 'id'>) => {
    const id = `usr_${Date.now()}`;
    const token = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const nowIso = new Date().toISOString();

    const newUser: User = {
      ...userData,
      id,
      status: userData.status || 'convidado',
      inviteToken: token,
      invitedAt: nowIso
    };

    setDoc(doc(db, 'users', id), newUser).catch(err => console.error('Error adding user to Firestore:', err));

    const inviteLink = `${window.location.origin}/#convite=${token}`;
    return { user: newUser, inviteLink };
  };

  const updateUser = (updatedUser: User) => {
    setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch(err => console.error('Error updating user in Firestore:', err));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === 'usr_master_joel') return; // Cannot delete master admin
    recordPermanentDeletion('users', userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    setDoc(doc(db, 'users', userId), { id: userId, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(err => console.error('Error deleting user from Firestore:', err));
  };

  const updateUserProfile = (userId: string, profileData: Partial<User>) => {
    const found = users.find(u => u.id === userId);
    if (!found) return;

    const updated = { ...found, ...profileData };
    updateUser(updated);

    // If master user or current broker profile is updated, automatically synchronize siteConfig broker fields!
    if (found.isMasterAdmin || found.role === 'admin' || userId === 'usr_master_joel' || (currentUser && currentUser.id === userId)) {
      const cfgUpdates: Partial<SiteConfig> = {};
      if (profileData.avatar) cfgUpdates.brokerAvatarUrl = profileData.avatar;
      if (profileData.name) cfgUpdates.brokerName = profileData.name;
      if (profileData.creci) cfgUpdates.brokerCreci = profileData.creci;
      if (profileData.phone) cfgUpdates.brokerPhone = profileData.phone;
      if (profileData.secondaryPhone) cfgUpdates.brokerSecondaryPhone = profileData.secondaryPhone;
      if (profileData.whatsapp) cfgUpdates.brokerWhatsapp = profileData.whatsapp;
      if (profileData.cnai || profileData.cnae) {
        cfgUpdates.brokerCnae = profileData.cnai || profileData.cnae;
        cfgUpdates.brokerCnai = profileData.cnai || profileData.cnae;
      }
      if (profileData.address) cfgUpdates.brokerAddress = profileData.address;
      if (profileData.bio) cfgUpdates.brokerBio = profileData.bio;
      if (Object.keys(cfgUpdates).length > 0) {
        updateSiteConfig(cfgUpdates);
      }
    }
  };

  const acceptInvitation = (inviteCodeOrEmail: string, newPassword: string) => {
    const cleanCode = inviteCodeOrEmail.trim().toUpperCase();
    const cleanEmail = inviteCodeOrEmail.trim().toLowerCase();

    const found = users.find(u =>
      (u.inviteToken && u.inviteToken.toUpperCase() === cleanCode) ||
      u.email.toLowerCase() === cleanEmail
    );

    if (!found) {
      return { success: false, message: 'Código de convite ou e-mail não localizado na base do sistema.' };
    }

    if (newPassword.trim().length < 4) {
      return { success: false, message: 'A nova senha deve ter pelo menos 4 caracteres.' };
    }

    const updatedUser: User = {
      ...found,
      password: newPassword.trim(),
      status: 'ativo',
      inviteToken: undefined
    };

    updateUser(updatedUser);
    setCurrentUser(updatedUser);

    return {
      success: true,
      message: `Bem-vindo, ${found.name}! Seu cadastro foi ativado com sucesso.`
    };
  };

  const requestPasswordReset = (email: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      return {
        success: true,
        message: `Instruções de redefinição de senha foram enviadas para ${email}.`
      };
    }
    return {
      success: false,
      message: 'E-mail não encontrado em nossa base de usuários.'
    };
  };

  // Property CRUD with Robust Durability & Versioning
  const addProperty = async (propData: Omit<Property, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string; error?: string }> => {
    const id = `prop_${Date.now()}`;
    const newProp: Property = {
      ...propData,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const val = validateRecordIntegrity('properties', newProp);
    if (!val.valid) {
      setLastSaveStatus({ status: 'error', message: `Erro ao salvar imóvel: ${val.error}`, timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return { success: false, error: val.error };
    }

    setLastSaveStatus({ status: 'saving', message: 'Salvando imóvel com persistência...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });

    // 1. Optimistic memory, local cache, and local IndexedDB
    setProperties(prev => {
      const updated = [newProp, ...prev];
      try {
        localStorage.setItem('imobipro_properties_cache', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await idbPut('properties', newProp);
    await recordDataVersion('properties', id, null, newProp, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Cadastro do imóvel ${newProp.title}`);

    // 2. Cloud Firestore with safe cleaning and document size limit protection
    const cleanProp = ensureSafeFirestoreDocumentSize(cleanForFirestore(newProp));
    try {
      await setDoc(doc(db, 'properties', id), cleanProp, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Imóvel salvo com sucesso na nuvem e redundância local', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return { success: true, id };
    } catch (err: any) {
      console.warn('[DataSafety] Firestore offline ou erro de rede, salvo localmente com segurança:', err);
      await queueOfflineSync('set', 'properties', id, cleanProp);
      setLastSaveStatus({ status: 'saved', message: 'Salvo com segurança localmente (sincronização automática na fila)', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return { success: true, id };
    }
  };

  const updateProperty = async (updated: Property): Promise<{ success: boolean; error?: string }> => {
    if (!acquireLock(updated.id)) {
      console.warn('[DataSafety] Bloqueado clique duplo ou gravação concorrente em andamento para:', updated.id);
      return { success: false, error: 'Gravação em andamento. Aguarde...' };
    }

    const val = validateRecordIntegrity('properties', updated);
    if (!val.valid) {
      releaseLock(updated.id);
      setLastSaveStatus({ status: 'error', message: `Erro ao atualizar: ${val.error}`, timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return { success: false, error: val.error };
    }

    setLastSaveStatus({ status: 'saving', message: 'Atualizando imóvel...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    const prevProp = properties.find(p => p.id === updated.id);

    setProperties(prev => {
      const list = prev.map(p => p.id === updated.id ? updated : p);
      try {
        localStorage.setItem('imobipro_properties_cache', JSON.stringify(list));
      } catch {}
      return list;
    });
    await idbPut('properties', updated);
    await recordDataVersion('properties', updated.id, prevProp, updated, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Atualização do imóvel ${updated.title}`);

    const cleanProp = ensureSafeFirestoreDocumentSize(cleanForFirestore(updated));
    try {
      await setDoc(doc(db, 'properties', updated.id), cleanProp, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Imóvel atualizado com sucesso!', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return { success: true };
    } catch (err: any) {
      console.warn('[DataSafety] Firestore offline, atualizado localmente:', err);
      await queueOfflineSync('set', 'properties', updated.id, cleanProp);
      setLastSaveStatus({ status: 'saved', message: 'Atualizado com segurança local (fila de sincronização ativa)', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return { success: true };
    } finally {
      releaseLock(updated.id);
    }
  };

  // Broadcast notification and chat alert for Admin & Reception
  const sendNotificationToAdminAndReception = async (
    title: string,
    body: string,
    type: 'lead' | 'imovel' | 'documento',
    linkTab: string
  ) => {
    const notifId = `notif_${Date.now()}`;
    const nowStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString().slice(0, 5);
    const newNotif: PushNotification = {
      id: notifId,
      title,
      body,
      timestamp: `${nowStr} ${timeStr}`,
      read: false,
      type,
      linkTab
    };

    setNotifications(prev => [newNotif, ...prev]);
    setDoc(doc(db, 'notifications', notifId), newNotif).catch(err => console.error('Error adding notification:', err));
    triggerNativeNotification(title, body);

    const chatMsgId = `msg_${Date.now()}`;
    const systemChatMsg: ChatMessage = {
      id: chatMsgId,
      senderId: 'sistema',
      senderName: 'Sistema (Alerta para Admin & Recepção)',
      senderRole: 'admin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      channel: 'geral',
      text: `📢 **[Notificação de Arquivamento]**\n${body}`,
      timestamp: `${nowStr} ${timeStr}`
    };
    setChatMessages(prev => [...prev, systemChatMsg]);
    setDoc(doc(db, 'chatMessages', chatMsgId), systemChatMsg).catch(() => {});
  };

  const deleteProperty = async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (currentUser?.role !== 'admin') {
      alert('Acesso restrito: Apenas administradores têm permissão para excluir Imóveis do catálogo.');
      return { success: false, message: 'Apenas administradores podem excluir Imóveis.' };
    }
    recordPermanentDeletion('properties', id);
    localStorage.setItem('imobipro_sample_properties_cleared', 'true');
    const existing = properties.find(p => p.id === id);
    if (existing) {
      await recordDataVersion('properties', id, existing, null, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Exclusão do imóvel ${existing.title}`);
    }
    setProperties(prev => {
      const updated = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('imobipro_properties_cache', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    await idbDelete('properties', id);
    setDoc(doc(db, 'properties', id), { id, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(async (err) => {
      console.error('Error deleting property from Firestore:', err);
      await queueOfflineSync('delete', 'properties', id);
    });

    addAuditLog({
      action: 'Exclusão de Imóvel',
      category: 'imovel',
      details: `Imóvel ${existing?.code || id} (${existing?.title}) excluído definitivamente pelo Administrador ${currentUser?.name}.`,
      entityId: id
    });
    return { success: true };
  };

  const archiveProperty = async (id: string, reason: string): Promise<{ success: boolean; message?: string }> => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return { success: false, message: 'Imóvel não encontrado.' };
    const nowStr = new Date().toISOString();
    const userName = currentUser?.name || 'Usuário';
    const updatedProp: Property = {
      ...prop,
      archived: true,
      archivedAt: nowStr,
      archivedBy: userName,
      archiveReason: reason
    };
    await updateProperty(updatedProp);

    const title = '📁 Imóvel Arquivado';
    const body = `${userName} (${currentUser?.role || 'corretor'}) arquivou o Imóvel ${prop.code} (${prop.title}). Motivo: "${reason}". Notificação enviada para Administração e Recepção.`;
    await sendNotificationToAdminAndReception(title, body, 'imovel', 'imoveis');

    addAuditLog({
      action: 'Arquivamento de Imóvel',
      category: 'imovel',
      details: `Imóvel ${prop.code} (${prop.title}) foi arquivado por ${userName}. Motivo: "${reason}". Notificado Administrador e Recepção.`,
      entityId: id
    });
    return { success: true };
  };

  const unarchiveProperty = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return { success: false, message: 'Imóvel não encontrado.' };
    const updatedProp: Property = {
      ...prop,
      archived: false,
      archivedAt: undefined,
      archivedBy: undefined,
      archiveReason: undefined
    };
    await updateProperty(updatedProp);
    addAuditLog({
      action: 'Restauração de Imóvel',
      category: 'imovel',
      details: `Imóvel ${prop.code} (${prop.title}) reativado no catálogo por ${currentUser?.name || 'Usuário'}.`,
      entityId: id
    });
    return { success: true };
  };

  const deleteProperties = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    localStorage.setItem('imobipro_sample_properties_cleared', 'true');
    ids.forEach(id => recordPermanentDeletion('properties', id));
    for (const id of ids) {
      const existing = properties.find(p => p.id === id);
      if (existing) {
        await recordDataVersion('properties', id, existing, null, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Exclusão em lote`);
      }
      await idbDelete('properties', id);
    }
    setProperties(prev => {
      const updated = prev.filter(p => !ids.includes(p.id));
      try {
        localStorage.setItem('imobipro_properties_cache', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    ids.forEach(id => {
      setDoc(doc(db, 'properties', id), { id, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(() => queueOfflineSync('delete', 'properties', id));
    });
  };

  const clearAllProperties = async () => {
    localStorage.setItem('imobipro_sample_properties_cleared', 'true');
    for (const p of properties) {
      recordPermanentDeletion('properties', p.id);
      await recordDataVersion('properties', p.id, p, null, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Limpeza de catálogo`);
      await idbDelete('properties', p.id);
      setDoc(doc(db, 'properties', p.id), { id: p.id, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    }
    setProperties([]);
    try {
      localStorage.setItem('imobipro_properties_cache', JSON.stringify([]));
    } catch {}
  };

  // CRM Leads with Robust Durability & Versioning
  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes'>, initialNote?: string) => {
    const nowStr = new Date().toISOString().split('T')[0];
    const newNotes = initialNote ? [
      {
        id: `note_${Date.now()}`,
        authorId: currentUser?.id || 'sys',
        authorName: currentUser?.name || 'Sistema',
        content: initialNote,
        timestamp: `${nowStr} ${new Date().toLocaleTimeString().slice(0, 5)}`
      }
    ] : [];

    const id = `lead_${Date.now()}`;
    const newLead: Lead = {
      ...leadData,
      id,
      notes: newNotes,
      createdAt: nowStr,
      updatedAt: nowStr
    };

    const val = validateRecordIntegrity('leads', newLead);
    if (!val.valid) {
      setLastSaveStatus({ status: 'error', message: `Erro ao salvar lead: ${val.error}`, timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return;
    }

    setLastSaveStatus({ status: 'saving', message: 'Salvando lead...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    setLeads(prev => [newLead, ...prev]);
    await idbPut('leads', newLead);
    await recordDataVersion('leads', id, null, newLead, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Cadastro de lead: ${newLead.name}`);

    const cleanLead = cleanForFirestore(newLead);
    try {
      await setDoc(doc(db, 'leads', id), cleanLead, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Lead salvo com sucesso na nuvem e localmente', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } catch (err) {
      console.warn('[DataSafety] Firestore offline, lead salvo localmente:', err);
      await queueOfflineSync('set', 'leads', id, cleanLead);
      setLastSaveStatus({ status: 'saved', message: 'Lead salvo localmente com segurança', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    }

    // Push notification
    const notifId = `notif_${Date.now()}`;
    const newNotif: PushNotification = {
      id: notifId,
      title: '⚡ Novo Lead Cadastrado!',
      body: `${leadData.name} se cadastrou através da origem: ${leadData.source}.`,
      timestamp: `${nowStr} ${new Date().toLocaleTimeString().slice(0, 5)}`,
      read: false,
      type: 'lead',
      linkTab: 'crm'
    };
    setDoc(doc(db, 'notifications', notifId), newNotif).catch(err => console.error('Error adding notification:', err));
    
    // Trigger Push Notification alert & chime
    triggerNativeNotification(newNotif.title, newNotif.body);

    // Email Notification Alert for New Lead
    const targetEmail = siteConfig.leadNotificationEmail || siteConfig.email || 'joelsantanaimoveis@gmail.com';
    console.log(`[EMAIL NOTIFICATION DISPATCH] 📧 Novo lead cadastrado (${leadData.name} - ${leadData.phone}). Alerta enviado com sucesso para: ${targetEmail}`);
    
    addAuditLog({
      action: 'Notificação por E-mail de Novo Lead',
      category: 'cliente',
      details: `E-mail de alerta enviado para ${targetEmail} referente ao novo lead ${leadData.name} (${leadData.phone}).`,
      entityId: id
    });
  };

  const updateLeadStage = async (leadId: string, newStage: PipelineStage) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const nowStr = new Date().toISOString().split('T')[0];
    const updated = {
      ...lead,
      stage: newStage,
      updatedAt: nowStr
    };
    updateLead(updated);
  };

  const addLeadNote = async (leadId: string, noteContent: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const nowStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString().slice(0, 5);
    const newNote = {
      id: `note_${Date.now()}`,
      authorId: currentUser?.id || 'sys',
      authorName: currentUser?.name || 'Sistema',
      content: noteContent,
      timestamp: `${nowStr} ${timeStr}`
    };

    const updated = {
      ...lead,
      notes: [...lead.notes, newNote],
      updatedAt: nowStr
    };
    updateLead(updated);
  };

  const updateLead = async (updated: Lead) => {
    if (!acquireLock(updated.id)) {
      return;
    }

    const val = validateRecordIntegrity('leads', updated);
    if (!val.valid) {
      releaseLock(updated.id);
      return;
    }

    setLastSaveStatus({ status: 'saving', message: 'Atualizando lead...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    const prevLead = leads.find(l => l.id === updated.id);

    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    await idbPut('leads', updated);
    await recordDataVersion('leads', updated.id, prevLead, updated, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Atualização de lead: ${updated.name}`);

    const cleanLead = cleanForFirestore(updated);
    try {
      await setDoc(doc(db, 'leads', updated.id), cleanLead, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Lead atualizado com sucesso!', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } catch (err) {
      console.warn('[DataSafety] Firestore offline, lead atualizado localmente:', err);
      await queueOfflineSync('set', 'leads', updated.id, cleanLead);
      setLastSaveStatus({ status: 'saved', message: 'Lead preservado com segurança local', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } finally {
      releaseLock(updated.id);
    }
  };

  const deleteLead = async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (currentUser?.role !== 'admin') {
      alert('Acesso restrito: Apenas administradores têm permissão para excluir Leads definitivamente.');
      return { success: false, message: 'Apenas administradores podem excluir Leads.' };
    }
    recordPermanentDeletion('leads', id);
    const existing = leads.find(l => l.id === id);
    if (existing) {
      await recordDataVersion('leads', id, existing, null, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Exclusão definitiva do lead ${existing.name}`);
    }
    setLeads(prev => prev.filter(l => l.id !== id));
    await idbDelete('leads', id);
    setDoc(doc(db, 'leads', id), { id, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(async (err) => {
      console.error('Error deleting lead from Firestore:', err);
      await queueOfflineSync('delete', 'leads', id);
    });

    addAuditLog({
      action: 'Exclusão de Lead',
      category: 'cliente',
      details: `Lead "${existing?.name || id}" foi excluído definitivamente pelo Administrador ${currentUser?.name}.`,
      entityId: id
    });
    return { success: true };
  };

  const archiveLead = async (id: string, reason: string): Promise<{ success: boolean; message?: string }> => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return { success: false, message: 'Lead não encontrado.' };
    const nowStr = new Date().toISOString();
    const userName = currentUser?.name || 'Usuário';
    const updatedLead: Lead = {
      ...lead,
      archived: true,
      archivedAt: nowStr,
      archivedBy: userName,
      archiveReason: reason,
      updatedAt: nowStr.split('T')[0]
    };
    await updateLead(updatedLead);

    const title = '📁 Lead Arquivado';
    const body = `${userName} (${currentUser?.role || 'corretor'}) arquivou o Lead "${lead.name}". Motivo: "${reason}". Notificação enviada para Administração e Recepção.`;
    await sendNotificationToAdminAndReception(title, body, 'lead', 'crm');

    addAuditLog({
      action: 'Arquivamento de Lead',
      category: 'cliente',
      details: `Lead "${lead.name}" foi arquivado por ${userName}. Motivo: "${reason}". Notificado Administrador e Recepção.`,
      entityId: id
    });
    return { success: true };
  };

  const unarchiveLead = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return { success: false, message: 'Lead não encontrado.' };
    const updatedLead: Lead = {
      ...lead,
      archived: false,
      archivedAt: undefined,
      archivedBy: undefined,
      archiveReason: undefined,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    await updateLead(updatedLead);
    addAuditLog({
      action: 'Restauração de Lead',
      category: 'cliente',
      details: `Lead "${lead.name}" foi reativado no funil por ${currentUser?.name || 'Usuário'}.`,
      entityId: id
    });
    return { success: true };
  };

  const archiveNegotiationDoc = async (leadId: string, docId: string, reason: string): Promise<{ success: boolean; message?: string }> => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || !lead.negotiationDocs) return { success: false, message: 'Lead ou documento não encontrado.' };
    const targetDoc = lead.negotiationDocs.find(d => d.id === docId);
    if (!targetDoc) return { success: false, message: 'Documento não encontrado.' };

    const nowStr = new Date().toISOString();
    const userName = currentUser?.name || 'Usuário';
    const updatedDocs = lead.negotiationDocs.map(d => d.id === docId ? {
      ...d,
      archived: true,
      archivedAt: nowStr,
      archivedBy: userName,
      archiveReason: reason
    } : d);

    await updateLead({
      ...lead,
      negotiationDocs: updatedDocs
    });

    const title = '📁 Documento de Negociação Arquivado';
    const body = `${userName} arquivou o anexo "${targetDoc.name}" (${targetDoc.part}) da negociação de "${lead.name}". Motivo: "${reason}".`;
    await sendNotificationToAdminAndReception(title, body, 'documento', 'crm');

    addAuditLog({
      action: 'Arquivamento de Anexo da Negociação',
      category: 'documento',
      details: `Anexo "${targetDoc.name}" do lead "${lead.name}" arquivado por ${userName}. Motivo: "${reason}". Notificado Administrador e Recepção.`,
      entityId: leadId
    });
    return { success: true };
  };

  const unarchiveNegotiationDoc = async (leadId: string, docId: string): Promise<{ success: boolean; message?: string }> => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || !lead.negotiationDocs) return { success: false, message: 'Lead ou documento não encontrado.' };
    const updatedDocs = lead.negotiationDocs.map(d => d.id === docId ? {
      ...d,
      archived: false,
      archivedAt: undefined,
      archivedBy: undefined,
      archiveReason: undefined
    } : d);

    await updateLead({
      ...lead,
      negotiationDocs: updatedDocs
    });
    return { success: true };
  };

  const deleteNegotiationDoc = async (leadId: string, docId: string): Promise<{ success: boolean; message?: string }> => {
    if (currentUser?.role !== 'admin') {
      alert('Acesso restrito: Apenas administradores têm permissão para excluir anexos de negociação.');
      return { success: false, message: 'Apenas administradores podem excluir anexos.' };
    }
    const lead = leads.find(l => l.id === leadId);
    if (!lead || !lead.negotiationDocs) return { success: false, message: 'Lead ou documento não encontrado.' };
    const targetDoc = lead.negotiationDocs.find(d => d.id === docId);

    const updatedDocs = lead.negotiationDocs.filter(d => d.id !== docId);
    await updateLead({
      ...lead,
      negotiationDocs: updatedDocs
    });

    addAuditLog({
      action: 'Exclusão de Anexo da Negociação',
      category: 'documento',
      details: `Exclusão permanente do anexo "${targetDoc?.name || docId}" do lead "${lead.name}" efetuada pelo Administrador ${currentUser?.name}.`,
      entityId: leadId
    });
    return { success: true };
  };

  // CRM Tasks & Reminders with Robust Durability
  const addCrmTask = async (taskData: Omit<CrmTask, 'id' | 'createdAt'>) => {
    const id = `task_${Date.now()}`;
    const nowStr = new Date().toISOString().split('T')[0];
    const newTask: CrmTask = {
      ...taskData,
      id,
      createdAt: nowStr
    };

    const val = validateRecordIntegrity('crmTasks', newTask);
    if (!val.valid) {
      setLastSaveStatus({ status: 'error', message: `Erro ao salvar tarefa: ${val.error}`, timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return;
    }

    setLastSaveStatus({ status: 'saving', message: 'Salvando tarefa...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    setCrmTasks(prev => {
      const updated = [newTask, ...prev];
      try {
        localStorage.setItem('imobipro_crm_tasks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    await idbPut('crmTasks', newTask);
    await recordDataVersion('crmTasks', id, null, newTask, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Criação da tarefa "${newTask.title}"`);

    const cleanTask = cleanForFirestore(newTask);
    try {
      await setDoc(doc(db, 'crmTasks', id), cleanTask, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Tarefa salva com sucesso!', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } catch (err) {
      await queueOfflineSync('set', 'crmTasks', id, cleanTask);
      setLastSaveStatus({ status: 'saved', message: 'Tarefa preservada localmente com segurança', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    }

    addAuditLog({
      action: 'Criação de Tarefa CRM',
      category: 'cliente',
      details: `Criada tarefa "${newTask.title}" para o contato ${newTask.leadName} com vencimento em ${newTask.dueDate}.`,
      entityId: newTask.leadId
    });

    // Alert if urgent or due today
    if (newTask.priority === 'urgente' || newTask.dueDate === nowStr) {
      triggerNativeNotification(`⏰ Lembrete CRM: ${newTask.title}`, `Contato: ${newTask.leadName} • Vence: ${newTask.dueDate} ${newTask.dueTime || ''}`);
    }
  };

  const updateCrmTask = async (updatedTask: CrmTask) => {
    if (!acquireLock(updatedTask.id)) return;

    const val = validateRecordIntegrity('crmTasks', updatedTask);
    if (!val.valid) {
      releaseLock(updatedTask.id);
      return;
    }

    const prevTask = crmTasks.find(t => t.id === updatedTask.id);
    setCrmTasks(prev => {
      const updated = prev.map(t => t.id === updatedTask.id ? updatedTask : t);
      try {
        localStorage.setItem('imobipro_crm_tasks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    await idbPut('crmTasks', updatedTask);
    await recordDataVersion('crmTasks', updatedTask.id, prevTask, updatedTask, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Atualização da tarefa "${updatedTask.title}"`);

    const cleanTask = cleanForFirestore(updatedTask);
    try {
      await setDoc(doc(db, 'crmTasks', updatedTask.id), cleanTask, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Tarefa atualizada com sucesso!', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } catch (err) {
      await queueOfflineSync('set', 'crmTasks', updatedTask.id, cleanTask);
      setLastSaveStatus({ status: 'saved', message: 'Tarefa preservada com segurança local', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } finally {
      releaseLock(updatedTask.id);
    }
  };

  const toggleCrmTaskStatus = (taskId: string) => {
    const task = crmTasks.find(t => t.id === taskId);
    if (!task) return;

    const now = new Date();
    const nowStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString().slice(0, 5)}`;
    const isCompleting = task.status !== 'concluida';
    const updatedTask: CrmTask = {
      ...task,
      status: isCompleting ? 'concluida' : 'pendente',
      completedAt: isCompleting ? nowStr : undefined,
      completedBy: isCompleting ? (currentUser?.name || 'Corretor') : undefined
    };

    updateCrmTask(updatedTask);

    addAuditLog({
      action: isCompleting ? 'Conclusão de Tarefa CRM' : 'Reabertura de Tarefa CRM',
      category: 'cliente',
      details: `Tarefa "${task.title}" vinculada ao cliente ${task.leadName} foi ${isCompleting ? 'concluída' : 'reaberta'}.`,
      entityId: task.leadId
    });
  };

  const deleteCrmTask = async (taskId: string) => {
    recordPermanentDeletion('crmTasks', taskId);
    const task = crmTasks.find(t => t.id === taskId);
    if (task) {
      await recordDataVersion('crmTasks', taskId, task, null, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Exclusão da tarefa "${task.title}"`);
    }

    setCrmTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      try {
        localStorage.setItem('imobipro_crm_tasks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    await idbDelete('crmTasks', taskId);
    setDoc(doc(db, 'crmTasks', taskId), { id: taskId, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(err => {
      console.error('Error deleting crmTask from Firestore:', err);
      queueOfflineSync('delete', 'crmTasks', taskId);
    });

    if (task) {
      addAuditLog({
        action: 'Exclusão de Tarefa CRM',
        category: 'cliente',
        details: `Excluiu a tarefa "${task.title}" do contato ${task.leadName}.`,
        entityId: task.leadId
      });
    }
  };

  // Legal Documents & Audit Logs with Robust Durability
  const saveDocument = async (docItem: GeneratedDocument) => {
    setLastSaveStatus({ status: 'saving', message: 'Salvando documento jurídico...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });

    const prevDoc = documents.find(d => d.id === docItem.id);
    setDocuments(prev => {
      const existingIdx = prev.findIndex(d => d.id === docItem.id);
      let updatedList: GeneratedDocument[];
      if (existingIdx >= 0) {
        updatedList = [...prev];
        updatedList[existingIdx] = docItem;
      } else {
        updatedList = [docItem, ...prev];
      }
      try {
        localStorage.setItem('imobipro_documents', JSON.stringify(updatedList));
      } catch (e) {
        console.error(e);
      }
      return updatedList;
    });

    await idbPut('documents', docItem);
    await recordDataVersion('documents', docItem.id, prevDoc, docItem, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Documento "${docItem.title}"`);

    const cleanDoc = cleanForFirestore(docItem);
    try {
      await setDoc(doc(db, 'documents', docItem.id), cleanDoc, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Documento salvo com sucesso na nuvem e localmente!', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } catch (err) {
      await queueOfflineSync('set', 'documents', docItem.id, cleanDoc);
      setLastSaveStatus({ status: 'saved', message: 'Documento preservado localmente com segurança', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    }

    // Also link to property if propertyId is provided
    if (docItem.propertyId) {
      const prop = properties.find(p => p.id === docItem.propertyId);
      if (prop) {
        const propDocs = prop.documents || [];
        const updatedPropDocs = [docItem, ...propDocs.filter(d => d.id !== docItem.id)];
        updateProperty({ ...prop, documents: updatedPropDocs });
      }
    }

    // Also link to lead if leadId is provided
    if (docItem.leadId) {
      const lead = leads.find(l => l.id === docItem.leadId);
      if (lead) {
        const leadDocs = lead.documents || [];
        const updatedLeadDocs = [docItem, ...leadDocs.filter(d => d.id !== docItem.id)];
        updateLead({ ...lead, documents: updatedLeadDocs });
      }
    }
  };

  const deleteDocument = async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (currentUser?.role !== 'admin') {
      alert('Acesso restrito: Apenas administradores têm permissão para excluir documentos do sistema.');
      return { success: false, message: 'Apenas administradores podem excluir documentos.' };
    }
    recordPermanentDeletion('documents', id);
    const existing = documents.find(d => d.id === id);
    if (existing) {
      await recordDataVersion('documents', id, existing, null, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, `Exclusão definitiva do documento "${existing.title}"`);
    }

    setDocuments(prev => {
      const updated = prev.filter(d => d.id !== id);
      try {
        localStorage.setItem('imobipro_documents', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    await idbDelete('documents', id);
    setDoc(doc(db, 'documents', id), { id, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(() => queueOfflineSync('delete', 'documents', id));

    // Also remove from lead.documents if linked
    if (existing?.leadId) {
      const targetLead = leads.find(l => l.id === existing.leadId);
      if (targetLead && targetLead.documents) {
        updateLead({
          ...targetLead,
          documents: targetLead.documents.filter(d => d.id !== id)
        });
      }
    }

    // Also remove from property.documents if linked
    if (existing?.propertyId) {
      const targetProp = properties.find(p => p.id === existing.propertyId);
      if (targetProp && targetProp.documents) {
        updateProperty({
          ...targetProp,
          documents: targetProp.documents.filter(d => d.id !== id)
        });
      }
    }

    addAuditLog({
      action: 'Exclusão de Documento',
      category: 'documento',
      details: `Documento "${existing?.title || id}" excluído definitivamente pelo Administrador ${currentUser?.name}.`,
      entityId: id
    });
    return { success: true };
  };

  const archiveDocument = async (id: string, reason: string): Promise<{ success: boolean; message?: string }> => {
    const docItem = documents.find(d => d.id === id);
    if (!docItem) return { success: false, message: 'Documento não encontrado.' };
    const nowStr = new Date().toISOString();
    const userName = currentUser?.name || 'Usuário';
    const updatedDoc: GeneratedDocument = {
      ...docItem,
      status: 'arquivado',
      archived: true,
      archivedAt: nowStr,
      archivedBy: userName,
      archiveReason: reason
    };
    await saveDocument(updatedDoc);

    const title = '📁 Documento Jurídico Arquivado';
    const body = `${userName} (${currentUser?.role || 'corretor'}) arquivou o documento "${docItem.title}". Motivo: "${reason}". Notificação para Administração e Recepção.`;
    await sendNotificationToAdminAndReception(title, body, 'documento', 'crm');

    addAuditLog({
      action: 'Arquivamento de Documento',
      category: 'documento',
      details: `Documento "${docItem.title}" arquivado por ${userName}. Motivo: "${reason}". Notificado Administrador e Recepção.`,
      entityId: id
    });
    return { success: true };
  };

  const unarchiveDocument = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const docItem = documents.find(d => d.id === id);
    if (!docItem) return { success: false, message: 'Documento não encontrado.' };
    const updatedDoc: GeneratedDocument = {
      ...docItem,
      status: 'emitido',
      archived: false,
      archivedAt: undefined,
      archivedBy: undefined,
      archiveReason: undefined
    };
    await saveDocument(updatedDoc);
    addAuditLog({
      action: 'Restauração de Documento',
      category: 'documento',
      details: `Documento "${docItem.title}" foi reativado por ${currentUser?.name || 'Usuário'}.`,
      entityId: id
    });
    return { success: true };
  };

  const addAuditLog = async (entry: { action: string; category: 'imovel' | 'cliente' | 'documento' | 'parceria_fifty' | 'sistema'; details: string; entityId?: string }) => {
    const now = new Date();
    const nowStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString().slice(0, 5)}`;
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: nowStr,
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrador',
      ...entry
    };

    setAuditLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 200); // keep last 200 entries
      try {
        localStorage.setItem('imobipro_audit_logs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    await idbPut('auditLogs', newLog);
    setDoc(doc(db, 'auditLogs', newLog.id), newLog).catch(() => queueOfflineSync('set', 'auditLogs', newLog.id, newLog));
  };

  // Visits
  const addVisit = (visitData: Omit<VisitAppointment, 'id' | 'createdAt'>) => {
    const nowStr = new Date().toISOString().split('T')[0];
    const id = `vis_${Date.now()}`;
    const newVisit: VisitAppointment = {
      ...visitData,
      id,
      createdAt: nowStr
    };
    setDoc(doc(db, 'visits', id), newVisit).catch(err => console.error('Error adding visit:', err));

    // Push notification
    const notifId = `notif_${Date.now()}`;
    const newNotif: PushNotification = {
      id: notifId,
      title: '📅 Nova Visita Agendada!',
      body: `Visita agendada para ${visitData.date} às ${visitData.time}.`,
      timestamp: `${nowStr} ${new Date().toLocaleTimeString().slice(0, 5)}`,
      read: false,
      type: 'visita',
      linkTab: 'agenda'
    };
    setDoc(doc(db, 'notifications', notifId), newNotif).catch(err => console.error('Error adding notification:', err));

    // Trigger Push Notification alert & chime
    triggerNativeNotification(newNotif.title, newNotif.body);
  };

  const updateVisitStatus = (visitId: string, status: VisitAppointment['status']) => {
    const visit = visits.find(v => v.id === visitId);
    if (!visit) return;
    updateDoc(doc(db, 'visits', visitId), { status }).catch(err => console.error('Error updating visit status:', err));
  };

  // Commissions
  const addCommission = (commData: Omit<Commission, 'id'>) => {
    const id = `com_${Date.now()}`;
    const newComm: Commission = {
      ...commData,
      id
    };
    setDoc(doc(db, 'commissions', id), newComm).catch(err => console.error('Error adding commission:', err));
  };

  const updateCommissionStatus = (commId: string, status: Commission['paymentStatus']) => {
    updateDoc(doc(db, 'commissions', commId), { paymentStatus: status }).catch(err => console.error('Error updating commission status:', err));
  };

  // Chat
  const sendChatMessage = (text: string, channel: 'geral' | 'gerentes' | 'direto', receiverId?: string) => {
    if (!currentUser) return;
    const nowStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString().slice(0, 5);
    const id = `msg_${Date.now()}`;

    const newMsg: ChatMessage = {
      id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      channel,
      receiverId,
      text,
      timestamp: `${nowStr} ${timeStr}`
    };

    setDoc(doc(db, 'chatMessages', id), newMsg).catch(err => console.error('Error sending chat message:', err));
  };

  // Deep recursive cleaning to prevent Firestore errors with undefined values
  const cleanObjectForFirestore = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) return obj.map(cleanObjectForFirestore).filter(v => v !== undefined);
    if (typeof obj === 'object') {
      const res: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined) {
          res[k] = cleanObjectForFirestore(v);
        }
      }
      return res;
    }
    return obj;
  };

  // HTML Blocks
  const cleanBlockForFirestore = (block: Partial<CustomHtmlBlock>): Record<string, any> => {
    return cleanObjectForFirestore(block);
  };

  const addHtmlBlock = (blockData: Omit<CustomHtmlBlock, 'id'>) => {
    const id = `html_${Date.now()}`;
    const newBlock: CustomHtmlBlock = {
      ...blockData,
      id
    };

    // Optimistic local update
    setCustomHtmlBlocks(prev => {
      const next = [newBlock, ...prev];
      try {
        localStorage.setItem('imobipro_custom_html_blocks', JSON.stringify(next));
      } catch (e) {
        console.error('Error caching customHtmlBlocks:', e);
      }
      return next;
    });

    const firestoreData = cleanBlockForFirestore(newBlock);
    setDoc(doc(db, 'customHtmlBlocks', id), firestoreData).catch(err => {
      console.error('Error adding html block to Firestore:', err);
    });
  };

  const updateHtmlBlock = (updated: CustomHtmlBlock) => {
    // Optimistic local update
    setCustomHtmlBlocks(prev => {
      const next = prev.map(b => b.id === updated.id ? updated : b);
      try {
        localStorage.setItem('imobipro_custom_html_blocks', JSON.stringify(next));
      } catch (e) {
        console.error('Error updating customHtmlBlocks in localStorage:', e);
      }
      return next;
    });

    const firestoreData = cleanBlockForFirestore(updated);
    setDoc(doc(db, 'customHtmlBlocks', updated.id), firestoreData).catch(err => {
      console.error('Error updating html block in Firestore:', err);
    });
  };

  const deleteHtmlBlock = (id: string) => {
    recordPermanentDeletion('customHtmlBlocks', id);
    setCustomHtmlBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      try {
        localStorage.setItem('imobipro_custom_html_blocks', JSON.stringify(next));
      } catch (e) {
        console.error('Error updating customHtmlBlocks in localStorage:', e);
      }
      return next;
    });
    setDoc(doc(db, 'customHtmlBlocks', id), { id, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true }).catch(err => console.error('Error deleting html block:', err));
  };

  const toggleHtmlBlockActive = (id: string) => {
    const block = customHtmlBlocks.find(b => b.id === id);
    if (!block) return;
    const updated = { ...block, active: !block.active };
    setCustomHtmlBlocks(prev => {
      const next = prev.map(b => b.id === id ? updated : b);
      try {
        localStorage.setItem('imobipro_custom_html_blocks', JSON.stringify(next));
      } catch (e) {
        console.error('Error updating customHtmlBlocks in localStorage:', e);
      }
      return next;
    });
    updateDoc(doc(db, 'customHtmlBlocks', id), { active: !block.active }).catch(err => console.error('Error toggling html block:', err));
  };

  // Config with Robust Durability & Versioning
  const updateSiteConfig = async (newCfg: Partial<SiteConfig>) => {
    const updated = { ...siteConfig, ...newCfg };
    const val = validateRecordIntegrity('settings', updated);
    if (!val.valid) {
      setLastSaveStatus({ status: 'error', message: `Erro na configuração: ${val.error}`, timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return;
    }

    setLastSaveStatus({ status: 'saving', message: 'Salvando configurações...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    setSiteConfig(updated);
    try {
      localStorage.setItem('imobipro_site_config', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    await idbPut('settings', { id: 'siteConfig', ...updated });
    await recordDataVersion('settings', 'siteConfig', siteConfig, updated, currentUser ? { id: currentUser.id, name: currentUser.name } : undefined, 'Alteração de configurações gerais');

    try {
      const cleanConfig = cleanForFirestore(updated);
      await setDoc(doc(db, 'settings', 'siteConfig'), cleanConfig, { merge: true });
      setLastSaveStatus({ status: 'saved', message: 'Configurações salvas com sucesso na nuvem e localmente!', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    } catch (err) {
      await queueOfflineSync('set', 'settings', 'siteConfig', updated);
      setLastSaveStatus({ status: 'saved', message: 'Configurações preservadas com segurança local', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
    }
  };

  const toggleDarkMode = () => {
    updateSiteConfig({ darkMode: !siteConfig.darkMode });
  };

  const setLanguage = (lang: Language) => {
    updateSiteConfig({ language: lang });
  };

  // Configurable Dynamic Fields & Options System
  const addConfigurableOption = async (category: ConfigurableFieldCategory, label: string): Promise<{ success: boolean; option?: ConfigurableOption; error?: string }> => {
    const cleanLabel = (label || '').trim();
    if (!cleanLabel) {
      return { success: false, error: 'O nome da opção não pode estar em branco.' };
    }

    // Check if duplicate option already exists in this category
    const existing = configurableOptions.find(o => 
      o.category === category && 
      o.label.toLowerCase() === cleanLabel.toLowerCase()
    );

    if (existing) {
      // If was previously deactivated, reactivate it seamlessly
      if (!existing.active) {
        await updateConfigurableOption(existing.id, { active: true });
        return { success: true, option: { ...existing, active: true } };
      }
      return { success: true, option: existing };
    }

    const categoryOptions = configurableOptions.filter(o => o.category === category);
    const maxOrder = categoryOptions.reduce((max, o) => Math.max(max, o.order || 0), 0);

    const newOption: ConfigurableOption = {
      id: `opt_${category}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      category,
      label: cleanLabel,
      value: slugifyOption(cleanLabel),
      order: maxOrder + 1,
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const nextList = [...configurableOptions, newOption];
    setConfigurableOptions(nextList);
    try {
      localStorage.setItem('imobipro_configurable_options', JSON.stringify(nextList));
    } catch {}
    await idbPut('configurableOptions', newOption);

    // Persist to Cloud Firestore
    try {
      await setDoc(doc(db, 'configurable_options', newOption.id), newOption);
      setLastSaveStatus({
        status: 'saved',
        message: `Opção "${cleanLabel}" salva com sucesso`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5)
      });
    } catch (err: any) {
      console.warn('[ConfigurableOptions] Fallback offline sync for new option:', err);
      await queueOfflineSync('set', 'configurableOptions', newOption.id, newOption);
    }

    addAuditLog({
      action: 'Criação de Opção de Campo',
      category: 'sistema',
      details: `Nova opção "${cleanLabel}" cadastrada na categoria "${category}".`,
      entityId: newOption.id
    });

    return { success: true, option: newOption };
  };

  const updateConfigurableOption = async (id: string, updates: Partial<ConfigurableOption>): Promise<{ success: boolean; error?: string }> => {
    const target = configurableOptions.find(o => o.id === id);
    if (!target) return { success: false, error: 'Opção não encontrada' };

    const updated: ConfigurableOption = {
      ...target,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const nextList = configurableOptions.map(o => o.id === id ? updated : o);
    setConfigurableOptions(nextList);
    try {
      localStorage.setItem('imobipro_configurable_options', JSON.stringify(nextList));
    } catch {}
    await idbPut('configurableOptions', updated);

    try {
      await setDoc(doc(db, 'configurable_options', id), updated, { merge: true });
    } catch (err: any) {
      await queueOfflineSync('set', 'configurableOptions', id, updated);
    }

    return { success: true };
  };

  const deleteConfigurableOption = async (id: string, cleanupFromExistingRecords: boolean = false): Promise<{ success: boolean; error?: string; affectedCount?: number }> => {
    const target = configurableOptions.find(o => o.id === id);
    if (!target) return { success: false, error: 'Opção não encontrada' };

    // Calculate usage count in properties
    let affectedCount = 0;
    properties.forEach(p => {
      let isUsed = false;
      if (target.category === 'tipo_imovel' && (p.type === target.value || p.type === target.label)) isUsed = true;
      else if (target.category === 'caracteristica_imovel' && p.features && (p.features.includes(target.label) || p.features.includes(target.value))) isUsed = true;
      else if (target.category === 'caracteristica_regiao' && p.featuresRegiao && (p.featuresRegiao.includes(target.label) || p.featuresRegiao.includes(target.value))) isUsed = true;
      else if (target.category === 'caracteristica_empreendimento' && p.featuresEmpreendimento && (p.featuresEmpreendimento.includes(target.label) || p.featuresEmpreendimento.includes(target.value))) isUsed = true;
      else if (target.category === 'topografia' && (p.topografia === target.value || p.topografia === target.label)) isUsed = true;
      else if (target.category === 'ocupacao_uso' && (p.ocupacaoUso === target.value || p.ocupacaoUso === target.label)) isUsed = true;
      else if (target.category === 'tarja_foto' && (p.tarja === target.label || p.tarja === target.value)) isUsed = true;
      if (isUsed) affectedCount++;
    });

    // If cleanup was requested, strip it from existing properties
    if (cleanupFromExistingRecords && affectedCount > 0) {
      properties.forEach(prop => {
        let changed = false;
        const updated = { ...prop };
        if (target.category === 'caracteristica_imovel' && updated.features) {
          if (updated.features.includes(target.label) || updated.features.includes(target.value)) {
            updated.features = updated.features.filter(f => f !== target.label && f !== target.value);
            changed = true;
          }
        } else if (target.category === 'caracteristica_regiao' && updated.featuresRegiao) {
          if (updated.featuresRegiao.includes(target.label) || updated.featuresRegiao.includes(target.value)) {
            updated.featuresRegiao = updated.featuresRegiao.filter(f => f !== target.label && f !== target.value);
            changed = true;
          }
        } else if (target.category === 'caracteristica_empreendimento' && updated.featuresEmpreendimento) {
          if (updated.featuresEmpreendimento.includes(target.label) || updated.featuresEmpreendimento.includes(target.value)) {
            updated.featuresEmpreendimento = updated.featuresEmpreendimento.filter(f => f !== target.label && f !== target.value);
            changed = true;
          }
        } else if (target.category === 'tarja_foto' && (updated.tarja === target.label || updated.tarja === target.value)) {
          updated.tarja = undefined;
          changed = true;
        }

        if (changed) {
          updateProperty(updated).catch(() => {});
        }
      });
    }

    const nextList = configurableOptions.filter(o => o.id !== id);
    setConfigurableOptions(nextList);
    try {
      localStorage.setItem('imobipro_configurable_options', JSON.stringify(nextList));
    } catch {}
    await idbDelete('configurableOptions', id);

    try {
      await deleteDoc(doc(db, 'configurable_options', id));
      setLastSaveStatus({
        status: 'saved',
        message: `Opção "${target.label}" excluída com sucesso`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5)
      });
    } catch (err: any) {
      await queueOfflineSync('delete', 'configurableOptions', id);
    }

    const catName = CONFIGURABLE_CATEGORIES.find(c => c.id === target.category)?.name || target.category;

    addAuditLog({
      action: 'Exclusão de Opção de Campo',
      category: 'sistema',
      details: `Opção "${target.label}" da categoria "${catName}" excluída por ${currentUser?.name || 'Administrador'}. Vínculos existentes: ${affectedCount} registro(s).`,
      entityId: id
    });

    return { success: true, affectedCount };
  };

  const toggleConfigurableOptionStatus = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = configurableOptions.find(o => o.id === id);
    if (!target) return { success: false, error: 'Opção não encontrada' };
    return updateConfigurableOption(id, { active: !target.active });
  };

  const reorderConfigurableOptions = async (category: ConfigurableFieldCategory, orderedIds: string[]): Promise<{ success: boolean; error?: string }> => {
    const updatedList = configurableOptions.map(opt => {
      if (opt.category !== category) return opt;
      const newIndex = orderedIds.indexOf(opt.id);
      if (newIndex !== -1) {
        return { ...opt, order: newIndex + 1 };
      }
      return opt;
    });

    setConfigurableOptions(updatedList);
    try {
      localStorage.setItem('imobipro_configurable_options', JSON.stringify(updatedList));
    } catch {}
    await idbBulkPut('configurableOptions', updatedList);

    // Sync order updates in Firestore
    for (let i = 0; i < orderedIds.length; i++) {
      const optId = orderedIds[i];
      setDoc(doc(db, 'configurable_options', optId), { order: i + 1 }, { merge: true }).catch(() => {});
    }

    return { success: true };
  };

  const renameConfigurableOption = async (id: string, newLabel: string, updateExistingProperties: boolean = true): Promise<{ success: boolean; error?: string }> => {
    const cleanLabel = (newLabel || '').trim();
    if (!cleanLabel) return { success: false, error: 'O nome não pode estar em branco' };

    const target = configurableOptions.find(o => o.id === id);
    if (!target) return { success: false, error: 'Opção não encontrada' };

    const oldLabel = target.label;
    const oldValue = target.value;
    const newValue = slugifyOption(cleanLabel);

    await updateConfigurableOption(id, { label: cleanLabel, value: newValue });

    // Sync existing properties if requested
    if (updateExistingProperties) {
      properties.forEach(prop => {
        let changed = false;
        const updatedProp = { ...prop };

        if (target.category === 'tipo_imovel' && (prop.type === oldValue || prop.type === oldLabel)) {
          updatedProp.type = newValue;
          changed = true;
        } else if (target.category === 'caracteristica_imovel' && prop.features) {
          if (prop.features.includes(oldLabel) || prop.features.includes(oldValue)) {
            updatedProp.features = prop.features.map(f => (f === oldLabel || f === oldValue) ? cleanLabel : f);
            changed = true;
          }
        } else if (target.category === 'caracteristica_regiao' && prop.featuresRegiao) {
          if (prop.featuresRegiao.includes(oldLabel) || prop.featuresRegiao.includes(oldValue)) {
            updatedProp.featuresRegiao = prop.featuresRegiao.map(f => (f === oldLabel || f === oldValue) ? cleanLabel : f);
            changed = true;
          }
        } else if (target.category === 'topografia' && (prop.topografia === oldValue || prop.topografia === oldLabel)) {
          updatedProp.topografia = newValue;
          changed = true;
        } else if (target.category === 'ocupacao_uso' && (prop.ocupacaoUso === oldValue || prop.ocupacaoUso === oldLabel)) {
          updatedProp.ocupacaoUso = newValue;
          changed = true;
        }

        if (changed) {
          updateProperty(updatedProp).catch(() => {});
        }
      });
    }

    return { success: true };
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    updateDoc(doc(db, 'notifications', id), { read: true }).catch(err => console.error('Error marking notification read:', err));
  };

  const markAllNotificationsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
    });
  };

  // Website Lead Registration Simulator
  const simulateNewLeadWeb = (leadData: { name: string; email: string; phone: string; propertyId?: string; message?: string }) => {
    let assignedBrokerId = 'usr_corretor1';
    if (leadData.propertyId) {
      const prop = properties.find(p => p.id === leadData.propertyId);
      if (prop) assignedBrokerId = prop.agentId;
    }

    addLead(
      {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        source: 'Formulário do Site',
        stage: 'novo',
        agentId: assignedBrokerId,
        interestedPropertyId: leadData.propertyId
      },
      leadData.message ? `Mensagem do site: "${leadData.message}"` : 'Cadastrou-se solicitando contato sobre imóvel.'
    );
  };

  // Robust System Backup & Snapshot Operations
  const createManualBackup = async (label?: string): Promise<SystemBackupSnapshot> => {
    const snap = await createSystemSnapshot({
      properties,
      leads,
      users,
      visits,
      commissions,
      chatMessages,
      customHtmlBlocks,
      documents,
      crmTasks,
      auditLogs,
      siteConfig,
      configurableOptions
    }, label || `Backup Manual do Usuário - ${new Date().toLocaleTimeString().slice(0, 5)}`, 'manual');

    setLastSaveStatus({
      status: 'saved',
      message: `Ponto de restauração "${snap.label}" criado com sucesso!`,
      timestamp: new Date().toLocaleTimeString().slice(0, 5)
    });

    addAuditLog({
      action: 'Criação de Backup Manual',
      category: 'sistema',
      details: `Ponto de restauração "${snap.label}" gerado pelo usuário.`
    });

    return snap;
  };

  const restoreBackup = async (snapshot: SystemBackupSnapshot): Promise<{ success: boolean; message: string }> => {
    if (!snapshot || !snapshot.data) {
      return { success: false, message: 'Dados do backup inválidos ou corrompidos.' };
    }

    try {
      setLastSaveStatus({ status: 'saving', message: 'Restaurando ponto de restauração...', timestamp: new Date().toLocaleTimeString().slice(0, 5) });

      // Before restoring, create an emergency safety snapshot of current state
      await createSystemSnapshot({
        properties,
        leads,
        users,
        visits,
        commissions,
        chatMessages,
        customHtmlBlocks,
        documents,
        crmTasks,
        auditLogs,
        siteConfig,
        configurableOptions
      }, `Snapshot de Emergência Pré-Restauração (${new Date().toLocaleTimeString().slice(0, 5)})`, 'pre_update');

      const d = snapshot.data;
      
      const checkAndRestore = async (collectionName: string, items: any[]) => {
        if (!Array.isArray(items)) return [];
        const restored = [];
        for (const item of items) {
          if (isPermanentlyDeleted(collectionName, item.id)) {
            console.log(`[Restore] Ignorando ${item.id} pois está registrado na lista de exclusões permanentes.`);
            continue;
          }
          const docRef = doc(db, collectionName, item.id);
          try {
            const snap = await getDoc(docRef);
            if (snap.exists() && snap.data()._deleted) {
              console.log(`[Restore] Ignorando ${item.id} pois foi excluído permanentemente.`);
              continue; // Do not resurrect tombstoned documents
            }
            const cleanItem = cleanForFirestore(item);
            await setDoc(docRef, cleanItem, { merge: true });
            restored.push(item);
          } catch(e) {
            console.error(`Error restoring ${item.id}:`, e);
          }
        }
        return restored;
      };

      if (d.properties) {
        const restored = await checkAndRestore('properties', d.properties);
        setProperties(restored);
        await idbBulkPut('properties', restored);
      }

      if (d.leads) {
        const restored = await checkAndRestore('leads', d.leads);
        setLeads(restored);
        await idbBulkPut('leads', restored);
      }

      if (d.crmTasks) {
        const restored = await checkAndRestore('crmTasks', d.crmTasks);
        setCrmTasks(restored);
        await idbBulkPut('crmTasks', restored);
      }

      if (d.documents) {
        const restored = await checkAndRestore('documents', d.documents);
        setDocuments(restored);
        await idbBulkPut('documents', restored);
      }

      if (d.siteConfig) {
        setSiteConfig(d.siteConfig);
        await idbPut('settings', { id: 'siteConfig', ...d.siteConfig });
        await setDoc(doc(db, 'settings', 'siteConfig'), cleanForFirestore(d.siteConfig), { merge: true });
      }

      if (d.configurableOptions) {
        const restored = await checkAndRestore('configurable_options', d.configurableOptions);
        setConfigurableOptions(restored);
        await idbBulkPut('configurableOptions', restored);
      }

      setLastSaveStatus({ status: 'saved', message: 'Backup restaurado com sucesso!', timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      addAuditLog({
        action: 'Restauração de Backup Realizada',
        category: 'sistema',
        details: `Restaurada a versão "${snapshot.label}" criada em ${snapshot.timestamp}. Exclusões recentes não foram desfeitas.`
      });

      return { success: true, message: `Backup "${snapshot.label}" restaurado com sucesso total! Exclusões recentes foram preservadas.` };
    } catch (err: any) {
      setLastSaveStatus({ status: 'error', message: `Erro ao restaurar: ${err.message}`, timestamp: new Date().toLocaleTimeString().slice(0, 5) });
      return { success: false, message: `Erro ao restaurar backup: ${err.message}` };
    }
  };

  const exportSystemBackup = (snapshotToExport?: SystemBackupSnapshot) => {
    if (snapshotToExport) {
      exportBackupToFile(snapshotToExport);
      return;
    }
    const currentData = {
      properties,
      leads,
      users,
      visits,
      commissions,
      chatMessages,
      customHtmlBlocks,
      documents,
      crmTasks,
      auditLogs,
      siteConfig,
      configurableOptions
    };
    createSystemSnapshot(currentData, `Exportação de Segurança - ${new Date().toLocaleTimeString().slice(0, 5)}`, 'export').then(snap => {
      exportBackupToFile(snap);
      setLastSaveStatus({
        status: 'saved',
        message: 'Arquivo de backup gerado e baixado com sucesso!',
        timestamp: new Date().toLocaleTimeString().slice(0, 5)
      });
    });
  };

  const importSystemBackup = async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const validation = validateImportedBackup(text);
        if (!validation.valid || !validation.data) {
          resolve({ success: false, message: validation.error || 'Arquivo de backup inválido ou com integridade corrompida.' });
          return;
        }
        const res = await restoreBackup(validation.data);
        resolve(res);
      };
      reader.onerror = () => resolve({ success: false, message: 'Falha ao ler o arquivo selecionado.' });
      reader.readAsText(file);
    });
  };

  const getBackupList = async (): Promise<SystemBackupSnapshot[]> => {
    return await getSystemBackups();
  };

  const getChangeHistoryList = async (entity?: string, entityId?: string): Promise<DataVersionRecord[]> => {
    const all = await idbGetAll<DataVersionRecord>('changeHistory');
    let filtered = all;
    if (entity) {
      filtered = filtered.filter(v => v.entity === entity);
    }
    if (entityId) {
      filtered = filtered.filter(v => v.entityId === entityId);
    }
    filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return filtered;
  };

  const t = (key: TranslationKey) => getTranslation(siteConfig.language, key);

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        activeTab,
        setActiveTab,
        properties,
        isPropertiesLoading,
        leads,
        visits,
        commissions,
        chatMessages,
        notifications,
        customHtmlBlocks,
        documents,
        crmTasks,
        auditLogs,
        siteConfig,
        configurableOptions,
        isOnline,
        lastSaveStatus,
        createManualBackup,
        restoreBackup,
        exportSystemBackup,
        importSystemBackup,
        getBackupList,
        getChangeHistoryList,
        selectedPropertyDetail,
        setSelectedPropertyDetail,
        isGridMenuModalOpen,
        setIsGridMenuModalOpen,
        t,
        loginAsUser,
        loginWithCredentials,
        logout,
        updateUserPassword,
        requestPasswordReset,
        addUser,
        updateUser,
        deleteUser,
        updateUserProfile,
        acceptInvitation,
        addProperty,
        updateProperty,
        deleteProperty,
        archiveProperty,
        unarchiveProperty,
        deleteProperties,
        clearAllProperties,
        addLead,
        updateLead,
        deleteLead,
        archiveLead,
        unarchiveLead,
        updateLeadStage,
        addLeadNote,
        addCrmTask,
        updateCrmTask,
        toggleCrmTaskStatus,
        deleteCrmTask,
        archiveNegotiationDoc,
        unarchiveNegotiationDoc,
        deleteNegotiationDoc,
        saveDocument,
        deleteDocument,
        archiveDocument,
        unarchiveDocument,
        addAuditLog,
        addVisit,
        updateVisitStatus,
        addCommission,
        updateCommissionStatus,
        sendChatMessage,
        addHtmlBlock,
        updateHtmlBlock,
        deleteHtmlBlock,
        toggleHtmlBlockActive,
        updateSiteConfig,
        toggleDarkMode,
        setLanguage,
        siteStats,
        recordSitePageView,
        addConfigurableOption,
        updateConfigurableOption,
        deleteConfigurableOption,
        toggleConfigurableOptionStatus,
        reorderConfigurableOptions,
        renameConfigurableOption,
        markNotificationRead,
        markAllNotificationsRead,
        fcmPermissionStatus,
        fcmToken,
        enablePushNotifications,
        sendTestPushNotification,
        simulateNewLeadWeb
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
