import cron from 'node-cron';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');

async function gatherAllData() {
  const collections = ['properties', 'leads', 'users', 'visits', 'commissions', 'chatMessages', 'customHtmlBlocks', 'documents', 'crmTasks', 'auditLogs', 'changeHistory'];
  const data: any = {};
  
  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    data[col] = snap.docs.map(doc => doc.data());
  }
  
  const settingsSnap = await getDocs(collection(db, 'settings'));
  data.siteConfig = settingsSnap.docs.find(d => d.id === 'siteConfig')?.data() || null;
  
  return data;
}

export async function runDailyBackup(force = false) {
  try {
    console.log('[BackupCron] Iniciando rotina de backup...');
    const data = await gatherAllData();
    
    const targetEmail = data.siteConfig?.backupEmail || 'despachanteimobiliariorp@yahoo.com';
    
    const snapshotId = `bkp_auto_${Date.now()}`;
    const nowStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString().slice(0, 8)}`;
    const stats = {
      propertiesCount: data.properties?.length || 0,
      leadsCount: data.leads?.length || 0,
      usersCount: data.users?.length || 0,
      docsCount: data.documents?.length || 0
    };
    
    const snapshot = {
      id: snapshotId,
      timestamp: nowStr,
      label: 'Backup Diário Automático',
      trigger: 'auto',
      stats,
      data
    };

    const jsonString = JSON.stringify(snapshot, null, 2);
    
    console.log(`[BackupCron] Backup gerado com sucesso. Enviando para ${targetEmail}...`);
    
    let attempts = 0;
    let sent = false;
    let info: any = null;
    
    let transporter: any;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.log('[BackupCron] Usando Ethereal Email (teste) pois não há SMTP configurado.');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
    
    while (attempts < 3 && !sent) {
      try {
        attempts++;
        info = await transporter.sendMail({
          from: '"ImobiPro Backup" <backup@imobipro.com>',
          to: targetEmail,
          subject: `Backup diário — ImobiPro — ${new Date().toLocaleDateString('pt-BR')}`,
          text: `Data/hora do backup: ${nowStr}\n\nResumo:\n- Imóveis: ${stats.propertiesCount}\n- Leads: ${stats.leadsCount}\n- Usuários: ${stats.usersCount}\n- Documentos: ${stats.docsCount}\n\nArquivo anexo.`,
          attachments: [
            {
              filename: `imobipro_backup_${nowStr.replace(/[: ]/g, '_')}.json`,
              content: jsonString
            }
          ]
        });
        
        console.log(`[BackupCron] E-mail enviado com sucesso (tentativa ${attempts}).`);
        if (!process.env.SMTP_HOST && info) {
          console.log(`[BackupCron] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        sent = true;
      } catch (err: any) {
        console.warn(`[BackupCron] Falha ao enviar e-mail (tentativa ${attempts}):`, err.message);
        if (attempts >= 3) {
          console.error('[BackupCron] Todas as 3 tentativas de envio falharam. Backup mantido localmente.');
          const localPath = path.join(process.cwd(), `backup_falha_${Date.now()}.json`);
          fs.writeFileSync(localPath, jsonString);
        } else {
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }
    
    // Register the backup in auditLogs
    try {
      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, 'auditLogs', logId), {
        id: logId,
        timestamp: new Date().toISOString(),
        action: 'system_backup',
        entity: 'system',
        entityId: snapshotId,
        userId: 'sys',
        userName: 'Sistema',
        details: `Backup automático gerado. Registros salvos: ${JSON.stringify(stats)}. Enviado para: ${targetEmail}. Status: ${sent ? 'Sucesso' : 'Falhou'}`,
      });
    } catch (e) {
      console.warn('[BackupCron] Failed to save auditLog', e);
    }
    
  } catch (err) {
    console.error('[BackupCron] Erro fatal durante a rotina de backup:', err);
  }
}

export function initBackupCron() {
  cron.schedule('0 2 * * *', () => {
    runDailyBackup();
  });
  console.log('[BackupCron] Rotina de backup automático configurada para 02:00 diariamente.');
}
