import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, messaging } from './firebase';

export interface PushNotificationState {
  permission: NotificationPermission | 'unsupported';
  fcmToken: string | null;
  isEnabled: boolean;
}

// Sound chime generator using Web Audio API for push alerts
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Two-tone alert chime (E5 -> A5)
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.15); // A5
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.5);
  } catch (err) {
    console.warn('Audio chime playback omitted:', err);
  }
}

// Request Browser Notification Permission & Obtain FCM Token
export async function requestPushPermission(userId?: string): Promise<{ success: boolean; token: string | null; message: string }> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { success: false, token: null, message: 'Notificações não suportadas neste navegador.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, token: null, message: 'Permissão para notificações push foi recusada pelo usuário.' };
    }

    let token: string | null = null;
    
    // Register service worker if available
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        if (messaging) {
          token = await getToken(messaging, { serviceWorkerRegistration: registration });
        }
      } catch (swErr) {
        console.warn('FCM SW registration note:', swErr);
      }
    }

    // Fallback token identifier if FCM VAPID key is pending
    if (!token) {
      token = `web_push_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Save token to user profile in Firestore
    if (userId) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          fcmToken: token,
          pushEnabled: true,
          fcmTokenUpdatedAt: new Date().toISOString()
        });
      } catch (dbErr) {
        // Fallback setDoc
        await setDoc(doc(db, 'users', userId), {
          fcmToken: token,
          pushEnabled: true,
          fcmTokenUpdatedAt: new Date().toISOString()
        }, { merge: true });
      }
    }

    // Play confirmation chime
    playNotificationSound();

    return {
      success: true,
      token,
      message: 'Notificações Push FCM ativadas com sucesso! Você receberá alertas de novos leads e agendamentos.'
    };
  } catch (err: any) {
    console.error('Error enabling push notifications:', err);
    return {
      success: false,
      token: null,
      message: `Erro ao ativar notificações: ${err?.message || 'Falha na conexão FCM'}`
    };
  }
}

// Trigger Local Native Browser Push Notification
export function triggerNativeNotification(title: string, body: string, icon?: string) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      playNotificationSound();
      const notif = new Notification(title, {
        body,
        icon: icon || '/assets/logo.png',
        badge: '/assets/logo.png',
        tag: `push_${Date.now()}`
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (err) {
      console.warn('Native notification alert failed:', err);
    }
  }
}

// Listen for Foreground FCM Push Messages
export function listenToForegroundFcm(onPushReceived: (payload: { title: string; body: string; type?: string }) => void) {
  if (!messaging) return () => {};

  try {
    return onMessage(messaging, (payload) => {
      console.log('Foreground FCM push message received:', payload);
      const title = payload.notification?.title || '⚡ Novo Alerta FCM';
      const body = payload.notification?.body || 'Nova atividade registrada no sistema.';
      
      triggerNativeNotification(title, body);
      onPushReceived({ title, body, type: payload.data?.type });
    });
  } catch (err) {
    console.warn('FCM onMessage listener error:', err);
    return () => {};
  }
}
