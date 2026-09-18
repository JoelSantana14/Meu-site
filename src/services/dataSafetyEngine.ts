import { SystemBackupSnapshot, DataVersionRecord } from '../types';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const DB_NAME = 'ImobiPro_DurableDataStore_v1';
const DB_VERSION = 2;

const STORES = [
  'properties',
  'leads',
  'users',
  'visits',
  'commissions',
  'chatMessages',
  'customHtmlBlocks',
  'documents',
  'crmTasks',
  'auditLogs',
  'settings',
  'systemBackups',
  'changeHistory',
  'pendingSyncQueue'
] as const;

type StoreName = typeof STORES[number];

// Active locks to prevent double-click and race conditions
const activeLocks = new Set<string>();

/**
 * Open IndexedDB database with schema migrations
 */
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB não suportado no ambiente'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const idb = (event.target as IDBOpenDBRequest).result;
      STORES.forEach((store) => {
        if (!idb.objectStoreNames.contains(store)) {
          idb.createObjectStore(store, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Perform an atomic read/write transaction in IndexedDB
 */
export async function idbPut<T extends { id: string }>(storeName: StoreName, item: T): Promise<void> {
  try {
    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[DataSafetyEngine] idbPut fallback on ${storeName}:`, err);
    // Fallback in localStorage
    try {
      localStorage.setItem(`idb_fallback_${storeName}_${item.id}`, JSON.stringify(item));
    } catch {}
  }
}

/**
 * Bulk save array of items into IndexedDB
 */
export async function idbBulkPut<T extends { id: string }>(storeName: StoreName, items: T[]): Promise<void> {
  if (!items || items.length === 0) return;
  try {
    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach(item => {
        if (item && item.id) store.put(item);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`[DataSafetyEngine] idbBulkPut error on ${storeName}:`, err);
  }
}

/**
 * Read all records from a store
 */
export async function idbGetAll<T>(storeName: StoreName): Promise<T[]> {
  try {
    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[DataSafetyEngine] idbGetAll error on ${storeName}:`, err);
    return [];
  }
}

/**
 * Delete a record from a store
 */
export async function idbDelete(storeName: StoreName, id: string): Promise<void> {
  try {
    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[DataSafetyEngine] idbDelete error on ${storeName}:`, err);
  }
}

/**
 * Acquire concurrency lock to prevent double-submissions or race conditions
 */
export function acquireLock(key: string): boolean {
  if (activeLocks.has(key)) {
    return false; // already locked
  }
  activeLocks.add(key);
  return true;
}

export function releaseLock(key: string): void {
  activeLocks.delete(key);
}

/**
 * Strict data validation before any save to ensure record integrity
 */
export function validateRecordIntegrity(entityName: string, data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Dados inválidos ou vazios.' };
  }

  if (entityName === 'properties') {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return { valid: false, error: 'Título do imóvel é obrigatório.' };
    }
    if (typeof data.price !== 'number' || isNaN(data.price)) {
      return { valid: false, error: 'Preço do imóvel inválido.' };
    }
  }

  if (entityName === 'leads') {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return { valid: false, error: 'Nome do cliente/lead é obrigatório.' };
    }
    if (!data.phone && !data.email) {
      return { valid: false, error: 'Informe ao menos telefone ou e-mail do cliente.' };
    }
  }

  if (entityName === 'crmTasks') {
    if (!data.title || typeof data.title !== 'string') {
      return { valid: false, error: 'Título da tarefa é obrigatório.' };
    }
    if (!data.dueDate) {
      return { valid: false, error: 'Data de vencimento da tarefa é obrigatória.' };
    }
  }

  return { valid: true };
}

/**
 * Record a version change in IndexedDB and Firestore
 */
export async function recordDataVersion(
  entity: string,
  entityId: string,
  previousState: any,
  newState: any,
  author?: { id: string; name: string },
  summary?: string
): Promise<DataVersionRecord> {
  const versionRecordId = `ver_${entity}_${entityId}_${Date.now()}`;
  const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString().slice(0, 5)}`;

  // Determine current version number
  let nextVersion = 1;
  try {
    const history = await idbGetAll<DataVersionRecord>('changeHistory');
    const entityHistory = history.filter(h => h.entity === entity && h.entityId === entityId);
    if (entityHistory.length > 0) {
      const maxVer = Math.max(...entityHistory.map(h => h.version || 1));
      nextVersion = maxVer + 1;
    }
  } catch {}

  const versionRecord: DataVersionRecord = {
    id: versionRecordId,
    entity,
    entityId,
    version: nextVersion,
    timestamp: nowStr,
    authorId: author?.id || 'sys',
    authorName: author?.name || 'Sistema',
    summary: summary || `Atualização para versão ${nextVersion}`,
    previousState: previousState ? JSON.parse(JSON.stringify(previousState)) : null,
    newState: JSON.parse(JSON.stringify(newState))
  };

  // Persist locally in IndexedDB
  await idbPut('changeHistory', versionRecord);

  // Sync to Firestore change history
  setDoc(doc(db, 'changeHistory', versionRecordId), versionRecord).catch(err => {
    console.warn('[DataSafetyEngine] Offline or error recording changeHistory in Firestore:', err);
  });

  return versionRecord;
}

/**
 * Create a full system backup snapshot (automatic or manual)
 * Retains up to 30 latest versions
 */
export async function createSystemSnapshot(
  data: SystemBackupSnapshot['data'],
  label: string,
  trigger: SystemBackupSnapshot['trigger'] = 'auto'
): Promise<SystemBackupSnapshot> {
  const snapshotId = `bkp_${Date.now()}`;
  const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString().slice(0, 8)}`;

  const stats = {
    propertiesCount: data.properties?.length || 0,
    leadsCount: data.leads?.length || 0,
    usersCount: data.users?.length || 0,
    tasksCount: data.crmTasks?.length || 0,
    docsCount: data.documents?.length || 0,
    visitsCount: data.visits?.length || 0,
    commissionsCount: data.commissions?.length || 0,
    htmlBlocksCount: data.customHtmlBlocks?.length || 0,
    hasConfig: Boolean(data.siteConfig)
  };

  const snapshot: SystemBackupSnapshot = {
    id: snapshotId,
    timestamp: nowStr,
    label,
    trigger,
    stats,
    data: {
      properties: data.properties || [],
      leads: data.leads || [],
      users: data.users || [],
      visits: data.visits || [],
      commissions: data.commissions || [],
      chatMessages: data.chatMessages || [],
      customHtmlBlocks: data.customHtmlBlocks || [],
      documents: data.documents || [],
      crmTasks: data.crmTasks || [],
      auditLogs: data.auditLogs || [],
      siteConfig: data.siteConfig
    }
  };

  // 1. Save to IndexedDB
  await idbPut('systemBackups', snapshot);

  // 2. Prune old backups (keep maximum 30)
  try {
    const existing = await idbGetAll<SystemBackupSnapshot>('systemBackups');
    if (existing.length > 30) {
      // Sort by timestamp asc
      existing.sort((a, b) => a.id.localeCompare(b.id));
      const toDelete = existing.slice(0, existing.length - 30);
      for (const item of toDelete) {
        await idbDelete('systemBackups', item.id);
      }
    }
  } catch (e) {
    console.error('[DataSafetyEngine] Error pruning old backups:', e);
  }

  // 3. Keep latest quick snapshot in localStorage as redundant mirror
  try {
    localStorage.setItem('imobipro_latest_backup_meta', JSON.stringify({
      id: snapshotId,
      timestamp: nowStr,
      label,
      stats
    }));
  } catch {}

  console.log(`[DataSafetyEngine] 🛡️ Ponto de restauração salvo: "${label}" (${stats.propertiesCount} imóveis, ${stats.leadsCount} leads)`);
  return snapshot;
}

/**
 * Retrieve all system backups stored in IndexedDB
 */
export async function getSystemBackups(): Promise<SystemBackupSnapshot[]> {
  try {
    const backups = await idbGetAll<SystemBackupSnapshot>('systemBackups');
    // Sort descending by id/timestamp
    return backups.sort((a, b) => b.id.localeCompare(a.id));
  } catch (err) {
    console.error('[DataSafetyEngine] Failed to get backups:', err);
    return [];
  }
}

/**
 * Export full backup as downloadable JSON file
 */
export function exportBackupToFile(snapshot: SystemBackupSnapshot): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateSlug = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `imobipro_backup_${dateSlug}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validate imported JSON backup content
 */
export function validateImportedBackup(rawJson: string): { valid: boolean; data?: SystemBackupSnapshot; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'O arquivo informado não é um JSON válido.' };
    }
    if (!parsed.data || typeof parsed.data !== 'object') {
      return { valid: false, error: 'O arquivo não contém a estrutura de dados de backup do ImobiPro.' };
    }
    return { valid: true, data: parsed as SystemBackupSnapshot };
  } catch (err: any) {
    return { valid: false, error: `Erro na leitura do arquivo JSON: ${err.message}` };
  }
}

/**
 * Deeply clean an object before sending to Firestore.
 * Strips all `undefined` values and nested undefined keys to prevent Firestore crashes.
 */
export function cleanForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => (typeof item === 'object' && item !== null ? cleanForFirestore(item) : item)) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        if (value !== null && typeof value === 'object') {
          cleaned[key] = cleanForFirestore(value);
        } else {
          cleaned[key] = value;
        }
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Safeguard to ensure a document payload never exceeds Firestore's 1MB limit.
 * If size exceeds maxBytes, gracefully trims or adapts large arrays (such as images)
 * to keep the document writable and prevent Firestore serialization crashes.
 */
export function ensureSafeFirestoreDocumentSize<T extends Record<string, any>>(obj: T, maxBytes = 850000): T {
  try {
    const str = JSON.stringify(obj);
    const size = new TextEncoder().encode(str).length;
    if (size <= maxBytes) {
      return obj;
    }

    console.warn(`[DataSafetyEngine] Document exceeds safe threshold (${size} bytes > ${maxBytes} bytes). Adapting payload for Firestore safety.`);
    const copy: any = { ...obj };

    // If it has an images array with large base64 strings
    if (Array.isArray(copy.images) && copy.images.length > 0) {
      let currentImages = [...copy.images];
      while (currentImages.length > 1) {
        currentImages.pop();
        copy.images = currentImages;
        const newSize = new TextEncoder().encode(JSON.stringify(copy)).length;
        if (newSize <= maxBytes) {
          console.warn(`[DataSafetyEngine] Adjusted images count to ${currentImages.length} to fit Firestore limit.`);
          return copy as T;
        }
      }
    }

    return copy as T;
  } catch {
    return obj;
  }
}

/**
 * Record a permanent deletion tombstone locally and in memory
 */
export function recordPermanentDeletion(entity: string, id: string): void {
  try {
    const key = `imobipro_tombstone_${entity}`;
    const raw = localStorage.getItem(key);
    const set = raw ? JSON.parse(raw) : [];
    if (Array.isArray(set) && !set.includes(id)) {
      set.push(id);
      localStorage.setItem(key, JSON.stringify(set));
    }
  } catch (e) {
    console.error(`[DataSafetyEngine] Failed to record tombstone for ${entity}/${id}:`, e);
  }
}

/**
 * Check if a record ID was permanently deleted by the user
 */
export function isPermanentlyDeleted(entity: string, id: string): boolean {
  try {
    const key = `imobipro_tombstone_${entity}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.includes(id);
  } catch {
    return false;
  }
}

/**
 * Get all permanently deleted IDs for an entity
 */
export function getTombstoneSet(entity: string): Set<string> {
  try {
    const key = `imobipro_tombstone_${entity}`;
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const list = JSON.parse(raw);
    return Array.isArray(list) ? new Set(list) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Queue an offline mutation to be synced when online
 */
export async function queueOfflineSync(action: 'set' | 'delete', collectionName: string, docId: string, data?: any): Promise<void> {
  const syncItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    action,
    collectionName,
    docId,
    data: data ? cleanForFirestore(data) : undefined,
    timestamp: Date.now()
  };
  await idbPut('pendingSyncQueue', syncItem);
}

/**
 * Flush all offline queued items to Firestore
 */
export async function flushPendingSyncQueue(): Promise<number> {
  try {
    const queue = await idbGetAll<any>('pendingSyncQueue');
    if (!queue || queue.length === 0) return 0;

    let syncedCount = 0;
    for (const item of queue) {
      try {
        if (item.action === 'set') {
          const cleanData = cleanForFirestore(item.data);
          await setDoc(doc(db, item.collectionName, item.docId), cleanData, { merge: true });
        } else if (item.action === 'delete') {
          // Set tombstone in Firestore so all clients know it's deleted
          await setDoc(doc(db, item.collectionName, item.docId), { id: item.docId, _deleted: true, deletedAt: new Date().toISOString() }, { merge: true });
        }
        await idbDelete('pendingSyncQueue', item.id);
        syncedCount++;
      } catch (e) {
        console.warn(`[DataSafetyEngine] Failed to sync queue item ${item.id}:`, e);
        break; // stop on failure, retry later
      }
    }
    return syncedCount;
  } catch (e) {
    console.error('[DataSafetyEngine] Error flushing sync queue:', e);
    return 0;
  }
}
