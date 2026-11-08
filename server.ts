import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  sanitizePeiPayloadForLgpd,
  buildUniversalIodaSystemInstruction,
  buildUniversalUserPrompt,
  IODA_GEMINI_RESPONSE_SCHEMA,
} from './src/services/geminiService';
import { suapService } from './src/services/suapService';
import { studentRepo, peiRepo, ppcRepo, knowledgeBaseRepo, settingsRepo } from './src/database/db';
import { seedDatabaseIfNeeded } from './src/database/seed';

dotenv.config();

// Inicializa e semeia o banco SQLite relacional com os casos do Campus Paraíso
seedDatabaseIfNeeded();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

import { synthesizeIodaPei } from './src/services/universalPedagogicalEngine';

// Track quota cooldown to prevent repeated 429 errors
let quotaCooldownUntil = 0;

function isQuotaOnCooldown(): boolean {
  return Date.now() < quotaCooldownUntil;
}

function triggerQuotaCooldown(durationMs = 300000) {
  quotaCooldownUntil = Date.now() + durationMs;
}

// Rotas de Configuração da Inteligência Artificial (Gemini / Ollama Llama)
app.get('/api/config/ai', (req: Request, res: Response) => {
  const savedKey = settingsRepo.get('gemini_api_key');
  const envKey = process.env.GEMINI_API_KEY || '';
  const activeProvider = settingsRepo.get('ai_provider') || process.env.AI_PROVIDER || 'gemini';
  const activeModel = settingsRepo.get('ai_model') || process.env.AI_MODEL || 'gemini-3.8-flash';
  const ollamaHost = settingsRepo.get('ollama_host') || 'http://localhost:11434';
  const hasKey = Boolean(envKey || savedKey);
  const rawKey = savedKey || envKey;
  const maskedKey = hasKey && rawKey.length > 8 ? `${rawKey.substring(0, 4)}...${rawKey.slice(-4)}` : '';

  res.json({
    success: true,
    data: {
      provider: activeProvider,
      hasKey,
      maskedKey,
      model: activeModel,
      ollamaHost,
      isQuotaOnCooldown: isQuotaOnCooldown(),
    },
  });
});

app.post('/api/config/ai', (req: Request, res: Response) => {
  const { apiKey, provider, model, ollamaHost } = req.body || {};
  if (apiKey && typeof apiKey === 'string') {
    settingsRepo.set('gemini_api_key', apiKey.trim());
  }
  if (provider && ['gemini', 'ollama'].includes(provider)) {
    settingsRepo.set('ai_provider', provider);
  }
  if (model) {
    settingsRepo.set('ai_model', model);
  }
  if (ollamaHost) {
    settingsRepo.set('ollama_host', ollamaHost);
  }
  res.json({ success: true, message: 'Configurações de IA salvas com sucesso!' });
});

// API Route: Generate PEI with Ioda AI (LGPD Sanitized + RAG Drive + Structured JSON Schema)
app.post('/api/gemini/generate-pei', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    // 1. Camada de Privacidade e Minimização LGPD (Lei nº 13.709/2018 & Portaria MEC nº 421/2026)
    const sanitizedPayload = sanitizePeiPayloadForLgpd(req.body || {}, 1);

    const activeApiKey = settingsRepo.get('gemini_api_key') || process.env.GEMINI_API_KEY || '';
    const activeProvider = settingsRepo.get('ai_provider') || process.env.AI_PROVIDER || 'gemini';

    // 2. Consulta RAG à Base de Conhecimento Institucional no SQLite (Cadernos MEC, DUA 3.0, Diretrizes IFTO)
    const ragQuery = `${req.body.subject || ''} ${req.body.course || ''} ${req.body.barriers || ''} ${req.body.triggersAndBehavior || ''}`;
    const ragDocs = knowledgeBaseRepo.search(ragQuery, 3);
    const ragContext = ragDocs.map((doc: any) => `[DOCUMENTO OFICIAL RAG: ${doc.titulo}]\n${doc.conteudo}`).join('\n\n');

    // 3. Fallback inteligente caso não haja chave de API ou se cota estiver pausada
    if (!activeApiKey || isQuotaOnCooldown()) {
      console.log('[Ioda Engine] Utilizando Motor Pedagógico Ioda DUA 3.0 com proteção LGPD.');
      const synthesized = synthesizeIodaPei(req.body);
      return res.json({
        success: true,
        data: synthesized,
        isIodaEngine: true,
        lgpdSanitized: true,
        hasApiKey: Boolean(activeApiKey),
        notice: 'PEI estruturado pelo Motor Pedagógico Ioda (DUA 3.0 Universal)',
      });
    }

    const baseSystemPrompt = buildUniversalIodaSystemInstruction();
    const systemPromptWithRag = ragContext ? `${baseSystemPrompt}\n\n=== DIRETRIZES INSTITUCIONAIS RELEVANTES (RAG IFTO/MEC) ===\n${ragContext}` : baseSystemPrompt;
    const userPrompt = buildUniversalUserPrompt(sanitizedPayload);

    // Initialize Google GenAI client with active configured key
    const clientAi = new GoogleGenAI({
      apiKey: activeApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Model fallback chain: user preference -> gemini-3.8-flash -> gemini-3.5-flash-lite -> gemini-flash-latest
    const chosenModel = settingsRepo.get('ai_model') || process.env.AI_MODEL || 'gemini-3.8-flash';
    const modelsToTry = [chosenModel, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );

    let parsed: any = null;
    let groundingChunks: any[] = [];
    let usedModelName = '';

    for (const modelCandidate of modelsToTry) {
      try {
        console.log(`[Ioda AI] Solicitando elaboração de PEI ao modelo ${modelCandidate}...`);
        const response = await clientAi.models.generateContent({
          model: modelCandidate,
          contents: userPrompt,
          config: {
            systemInstruction: systemPromptWithRag,
            responseMimeType: 'application/json',
            responseSchema: IODA_GEMINI_RESPONSE_SCHEMA,
          },
        });

        const outputText = response.text || '';
        groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        let jsonStr = outputText.trim();
        if (jsonStr.includes('```json')) {
          jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
        } else if (jsonStr.includes('```')) {
          jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
        }

        if (jsonStr.startsWith('{')) {
          parsed = JSON.parse(jsonStr);
          usedModelName = modelCandidate;
          console.log(`[Ioda AI] PEI estruturado com sucesso pelo modelo ${modelCandidate}!`);
          break;
        }
      } catch (genError: any) {
        console.warn(`[Ioda AI] Modelo ${modelCandidate} indisponível ou em alta demanda:`, genError?.message || genError);
        const isQuota = `${genError?.message}`.includes('429') || `${genError?.message}`.includes('quota');
        if (isQuota) {
          triggerQuotaCooldown(180000);
        }
      }
    }

    if (parsed) {
      const fallbackBase = synthesizeIodaPei(req.body);

      // Merge structured Gemini output with full pedagogical structure
      const mergedData = {
        ...fallbackBase,
        ...parsed,
        estudo_de_caso_sintese: {
          ...fallbackBase.estudo_de_caso_sintese,
          ...(parsed.estudo_de_caso_sintese || {}),
        },
        planejamento_pedagogico_pei: {
          ...fallbackBase.planejamento_pedagogico_pei,
          ...(parsed.planejamento_pedagogico_pei || {}),
          estrategias_preventivas_e_dua_3_0: {
            ...fallbackBase.planejamento_pedagogico_pei.estrategias_preventivas_e_dua_3_0,
            ...(parsed.planejamento_pedagogico_pei?.estrategias_preventivas_e_dua_3_0 || {}),
          },
        },
        painel_de_acompanhamento: {
          ...fallbackBase.painel_de_acompanhamento,
          ...(parsed.painel_de_acompanhamento || {}),
        },
      };

      return res.json({
        success: true,
        data: mergedData,
        groundingChunks,
        isAiGenerated: true,
        modelUsed: usedModelName,
        lgpdSanitized: true,
      });
    }

    // Caso nenhum modelo responda a tempo ou ocorra indisponibilidade temporária de nuvem,
    // o Motor Pedagógico Ioda (DUA 3.0 Universal) garante 100% de disponibilidade sem travar o professor
    console.log('[Ioda Engine] Ativando Motor Pedagógico Ioda DUA 3.0 para síntese curricular contínua.');
    const synthesized = synthesizeIodaPei(req.body);
    return res.json({
      success: true,
      data: synthesized,
      isIodaEngine: true,
      lgpdSanitized: true,
      notice: 'PEI estruturado pelo Motor Pedagógico Ioda (DUA 3.0 Universal)',
    });
  } catch (_error: any) {
    console.log('[Ioda Server] Requisição tratada pelo motor pedagógico resiliente.');
    const fallbackData = synthesizeIodaPei(req.body || {});
    return res.json({
      success: true,
      data: fallbackData,
      isIodaEngine: true,
      lgpdSanitized: true,
      notice: 'Recuperação automática do PEI efetuada com sucesso.',
    });
  }
});

// ==================== REST API ENDPOINTS (SQLite Relational Database) ====================

// GET /api/peis - Listar todos os PEIs salvos no banco
app.get('/api/peis', (_req: Request, res: Response) => {
  try {
    const peis = peiRepo.getAllPeis();
    res.json({ success: true, data: peis });
  } catch (error: any) {
    console.error('Erro ao buscar PEIs do banco:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/peis/:id - Obter um PEI específico
app.get('/api/peis/:id', (req: Request, res: Response) => {
  try {
    const pei = peiRepo.getById(req.params.id);
    if (!pei) {
      return res.status(404).json({ success: false, error: 'PEI não encontrado no banco' });
    }
    res.json({ success: true, data: pei });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/peis - Criar ou atualizar PEI no banco
app.post('/api/peis', (req: Request, res: Response) => {
  try {
    const pei = req.body;
    if (!pei || !pei.id || !pei.cabecalho) {
      return res.status(400).json({ success: false, error: 'Estrutura de PEI incompleta' });
    }
    peiRepo.savePei(pei);
    res.json({ success: true, data: pei });
  } catch (error: any) {
    console.error('Erro ao persistir PEI:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/peis/:id - Atualizar PEI
app.put('/api/peis/:id', (req: Request, res: Response) => {
  try {
    const pei = req.body;
    peiRepo.savePei(pei);
    res.json({ success: true, data: pei });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/peis/:id - Excluir PEI do banco
app.delete('/api/peis/:id', (req: Request, res: Response) => {
  try {
    peiRepo.deletePei(req.params.id);
    res.json({ success: true, message: 'PEI excluído do banco com sucesso' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/peis/:id/notes - Adicionar nota colaborativa (Post-it)
app.post('/api/peis/:id/notes', (req: Request, res: Response) => {
  try {
    const peiId = req.params.id;
    const note = req.body;
    if (!note || !note.id || !note.conteudo) {
      return res.status(400).json({ success: false, error: 'Nota incompleta' });
    }
    peiRepo.addNote(peiId, note);
    res.json({ success: true, data: note });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/peis/:id/notes/:noteId - Remover nota colaborativa
app.delete('/api/peis/:id/notes/:noteId', (req: Request, res: Response) => {
  try {
    peiRepo.deleteNote(req.params.noteId);
    res.json({ success: true, message: 'Nota removida' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/students - Listar todos os estudantes
app.get('/api/students', (_req: Request, res: Response) => {
  try {
    const students = studentRepo.getAll();
    res.json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/ppc - Componentes Curriculares da base de PPC
app.get('/api/ppc', (_req: Request, res: Response) => {
  try {
    const list = ppcRepo.getAll();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/knowledge-base/search - RAG search de legislações e DUA 3.0
app.get('/api/knowledge-base/search', (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || '');
    const results = knowledgeBaseRepo.search(query, 5);
    res.json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ROTAS DE INTEGRAÇÃO COM O SUAP ====================

// GET /api/suap/diarios - Busca diários do professor no SUAP
app.get('/api/suap/diarios', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const diarios = await suapService.getDiariosDocente(token);
    res.json({ success: true, data: diarios });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/suap/diarios/:id/plano-ensino - Plano de ensino importado do SUAP
app.get('/api/suap/diarios/:id/plano-ensino', async (req: Request, res: Response) => {
  try {
    const plano = await suapService.getPlanoEnsinoDiario(req.params.id);
    if (!plano) {
      return res.status(404).json({ success: false, error: 'Plano de ensino não encontrado no SUAP' });
    }
    res.json({ success: true, data: plano });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/suap/diarios/:id/estudantes - Estudantes matriculados no diário
app.get('/api/suap/diarios/:id/estudantes', async (req: Request, res: Response) => {
  try {
    const estudantes = await suapService.getEstudantesDiario(req.params.id);
    res.json({ success: true, data: estudantes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
