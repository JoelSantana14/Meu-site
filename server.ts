import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initBackupCron, runDailyBackup } from './src/services/backupCron';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Initialize background jobs
  initBackupCron();

  // Initialize Gemini API client lazily when API calls are made
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // REST API: Properties
  app.get('/api/properties', async (_req, res) => {
    try {
      const { collection, getDocs, getFirestore } = await import('firebase/firestore');
      const { initializeApp, getApps } = await import('firebase/app');
      let cfg: any = {};
      try {
        cfg = (await import('./firebase-applet-config.json')).default;
      } catch {
        cfg = {
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          apiKey: process.env.VITE_FIREBASE_API_KEY,
          firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || '(default)'
        };
      }
      const fbApp = !getApps().length ? initializeApp(cfg) : getApps()[0];
      const firestore = getFirestore(fbApp, cfg.firestoreDatabaseId || '(default)');
      const snap = await getDocs(collection(firestore, 'properties'));
      const properties = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      res.json({ success: true, count: properties.length, data: properties });
    } catch (err: any) {
      console.error('[API /api/properties GET error]:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/properties', async (req, res) => {
    try {
      const { doc, setDoc, getFirestore } = await import('firebase/firestore');
      const { initializeApp, getApps } = await import('firebase/app');
      let cfg: any = {};
      try {
        cfg = (await import('./firebase-applet-config.json')).default;
      } catch {
        cfg = {
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          apiKey: process.env.VITE_FIREBASE_API_KEY,
          firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || '(default)'
        };
      }
      const fbApp = !getApps().length ? initializeApp(cfg) : getApps()[0];
      const firestore = getFirestore(fbApp, cfg.firestoreDatabaseId || '(default)');
      
      const propertyData = req.body;
      const id = propertyData.id || `prop_${Date.now()}`;
      const toSave = {
        ...propertyData,
        id,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(firestore, 'properties', id), toSave, { merge: true });
      res.json({ success: true, id, message: 'Imóvel gravado com sucesso no banco de dados', data: toSave });
    } catch (err: any) {
      console.error('[API /api/properties POST error]:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/properties/:id', async (req, res) => {
    try {
      const { doc, deleteDoc, getFirestore } = await import('firebase/firestore');
      const { initializeApp, getApps } = await import('firebase/app');
      let cfg: any = {};
      try {
        cfg = (await import('./firebase-applet-config.json')).default;
      } catch {
        cfg = {
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          apiKey: process.env.VITE_FIREBASE_API_KEY,
          firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || '(default)'
        };
      }
      const fbApp = !getApps().length ? initializeApp(cfg) : getApps()[0];
      const firestore = getFirestore(fbApp, cfg.firestoreDatabaseId || '(default)');
      const { id } = req.params;
      await deleteDoc(doc(firestore, 'properties', id));
      res.json({ success: true, message: `Imóvel ${id} excluído com sucesso do banco de dados.` });
    } catch (err: any) {
      console.error('[API /api/properties DELETE error]:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // REST API: Leads
  app.get('/api/leads', async (_req, res) => {
    try {
      const { collection, getDocs, getFirestore } = await import('firebase/firestore');
      const { initializeApp, getApps } = await import('firebase/app');
      let cfg: any = {};
      try {
        cfg = (await import('./firebase-applet-config.json')).default;
      } catch {
        cfg = {
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          apiKey: process.env.VITE_FIREBASE_API_KEY,
          firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || '(default)'
        };
      }
      const fbApp = !getApps().length ? initializeApp(cfg) : getApps()[0];
      const firestore = getFirestore(fbApp, cfg.firestoreDatabaseId || '(default)');
      const snap = await getDocs(collection(firestore, 'leads'));
      const leads = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      res.json({ success: true, count: leads.length, data: leads });
    } catch (err: any) {
      console.error('[API /api/leads GET error]:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/leads', async (req, res) => {
    try {
      const { doc, setDoc, getFirestore } = await import('firebase/firestore');
      const { initializeApp, getApps } = await import('firebase/app');
      let cfg: any = {};
      try {
        cfg = (await import('./firebase-applet-config.json')).default;
      } catch {
        cfg = {
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          apiKey: process.env.VITE_FIREBASE_API_KEY,
          firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || '(default)'
        };
      }
      const fbApp = !getApps().length ? initializeApp(cfg) : getApps()[0];
      const firestore = getFirestore(fbApp, cfg.firestoreDatabaseId || '(default)');
      const leadData = req.body;
      const id = leadData.id || `lead_${Date.now()}`;
      const toSave = { ...leadData, id, updatedAt: new Date().toISOString() };
      await setDoc(doc(firestore, 'leads', id), toSave, { merge: true });
      res.json({ success: true, id, message: 'Lead gravado com sucesso no banco', data: toSave });
    } catch (err: any) {
      console.error('[API /api/leads POST error]:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Manual Backup Trigger
  app.post('/api/trigger-backup', async (_req, res) => {
    try {
      await runDailyBackup(true);
      res.json({ success: true, message: 'Backup disparado com sucesso.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI Natural Language Search Endpoint
  app.post('/api/ai-search', async (req, res) => {
    try {
      const { query, properties } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string é obrigatória.' });
      }

      const ai = getGeminiClient();

      if (ai) {
        try {
          const prompt = `Você é o assistente virtual de inteligência artificial da ImobiPro / Joel Santana Corretor de Imóveis.
Sua missão é analisar o pedido de busca em linguagem natural do cliente e correlacionar com a lista de imóveis disponíveis.

Pedido do Cliente: "${query}"

Lista de Imóveis Cadastrados:
${JSON.stringify((properties || []).map((p: any) => ({
  id: p.id,
  code: p.code,
  title: p.title,
  description: p.description,
  type: p.type,
  purpose: p.purpose,
  price: p.price,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  city: p.address?.city,
  neighborhood: p.address?.neighborhood,
  features: p.features
})), null, 2)}

Responda ESTRITAMENTE em formato JSON válido com a seguinte estrutura:
{
  "summary": "Uma frase resumindo o que a IA compreendeu da busca (ex: Buscando apartamentos com 3 quartos próximos a estações de metrô).",
  "matchedPropertyIds": ["id1", "id2"],
  "matchReasons": {
    "id1": "Breve justificativa do motivo de combinar com a busca"
  },
  "extractedFilters": {
    "purpose": "venda" | "aluguel" | "todos",
    "type": "casa" | "apartamento" | "chacara" | "studio" | "sala_comercial" | "salao_comercial" | "area_lazer" | "terreno" | "todos",
    "minBedrooms": number ou 0,
    "maxPrice": number ou 0,
    "keywords": ["palavra1", "palavra2"]
  }
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            return res.json({ success: true, ...parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini API call failed, using intelligent fallback:', geminiError);
        }
      }

      // Intelligent Local Fallback if Gemini key is missing or call failed
      const cleanQuery = query.toLowerCase();
      let purpose: 'venda' | 'aluguel' | 'todos' = 'todos';
      if (cleanQuery.includes('aluguel') || cleanQuery.includes('alugar') || cleanQuery.includes('locação')) purpose = 'aluguel';
      if (cleanQuery.includes('venda') || cleanQuery.includes('comprar') || cleanQuery.includes('compra')) purpose = 'venda';

      let type = 'todos';
      if (cleanQuery.includes('apartamento') || cleanQuery.includes('apto') || cleanQuery.includes('flat')) type = 'apartamento';
      else if (cleanQuery.includes('casa') || cleanQuery.includes('sobrado') || cleanQuery.includes('residência')) type = 'casa';
      else if (cleanQuery.includes('chácara') || cleanQuery.includes('chacara') || cleanQuery.includes('sítio') || cleanQuery.includes('sitio')) type = 'chacara';
      else if (cleanQuery.includes('studio') || cleanQuery.includes('kitnet')) type = 'studio';
      else if (cleanQuery.includes('sala') || cleanQuery.includes('escritório')) type = 'sala_comercial';
      else if (cleanQuery.includes('salão') || cleanQuery.includes('galpão')) type = 'salao_comercial';
      else if (cleanQuery.includes('lazer') || cleanQuery.includes('evento')) type = 'area_lazer';
      else if (cleanQuery.includes('terreno') || cleanQuery.includes('lote')) type = 'terreno';

      // Extract bedrooms numbers (e.g., "3 quartos", "2 dorms")
      const bedroomMatch = cleanQuery.match(/(\d+)\s*(quarto|dormitório|dorm|suite|suíte)/i);
      const minBedrooms = bedroomMatch ? parseInt(bedroomMatch[1], 10) : 0;

      const propsList = Array.isArray(properties) ? properties : [];
      const matchedPropertyIds: string[] = [];
      const matchReasons: Record<string, string> = {};

      propsList.forEach((p: any) => {
        let isMatch = true;
        let reasons: string[] = [];

        if (purpose !== 'todos' && p.purpose !== purpose) isMatch = false;
        if (type !== 'todos' && p.type !== type) isMatch = false;
        if (minBedrooms > 0 && (p.bedrooms || 0) < minBedrooms) isMatch = false;

        if (cleanQuery.includes('metrô') || cleanQuery.includes('metro')) {
          const hasMetro = (p.description + ' ' + (p.features || []).join(' ')).toLowerCase().includes('metrô') ||
                           (p.description + ' ' + (p.features || []).join(' ')).toLowerCase().includes('metro');
          if (hasMetro) {
            reasons.push('Próximo ao metrô/transporte público');
          }
        }

        if (cleanQuery.includes('piscina') && (p.description + ' ' + (p.features || []).join(' ')).toLowerCase().includes('piscina')) {
          reasons.push('Possui piscina');
        }

        if (cleanQuery.includes('churrasqueira') && (p.description + ' ' + (p.features || []).join(' ')).toLowerCase().includes('churrasqueira')) {
          reasons.push('Possui espaço com churrasqueira');
        }

        if (isMatch) {
          matchedPropertyIds.push(p.id);
          matchReasons[p.id] = reasons.length > 0
            ? reasons.join(' • ')
            : `Imóvel do tipo ${p.type} para ${p.purpose} alinhado à sua busca.`;
        }
      });

      return res.json({
        success: true,
        source: 'local_ai_parser',
        summary: `Busca inteligente para: "${query}"`,
        matchedPropertyIds,
        matchReasons,
        extractedFilters: {
          purpose,
          type,
          minBedrooms,
          maxPrice: 0,
          keywords: cleanQuery.split(/\s+/).filter(w => w.length > 3)
        }
      });

    } catch (err: any) {
      console.error('Error in /api/ai-search:', err);
      return res.status(500).json({ error: 'Erro interno na busca com Inteligência Artificial.' });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
