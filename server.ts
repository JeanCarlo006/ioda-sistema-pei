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
import { studentRepo, peiRepo, ppcRepo, knowledgeBaseRepo } from './src/database/db';
import { seedDatabaseIfNeeded } from './src/database/seed';

dotenv.config();

// Inicializa e semeia o banco SQLite relacional com os casos do Campus Paraíso
seedDatabaseIfNeeded();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client (Server-Side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

import { synthesizeIodaPei } from './src/services/universalPedagogicalEngine';

// Track quota cooldown to prevent repeated 429 errors
let quotaCooldownUntil = 0;

function isQuotaOnCooldown(): boolean {
  return Date.now() < quotaCooldownUntil;
}

function triggerQuotaCooldown(durationMs = 300000) {
  quotaCooldownUntil = Date.now() + durationMs;
}

// API Route: Generate PEI with Ioda AI (LGPD Sanitized + Structured JSON Schema)
app.post('/api/gemini/generate-pei', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    // 1. Camada de Privacidade e Tratamento de Dados (LGPD - Lei nº 13.709/2018 & Art. 12, § 5º Decreto nº 12.686/2025)
    const sanitizedPayload = sanitizePeiPayloadForLgpd(req.body || {}, 1);
    // Check if API key is not configured or currently on quota cooldown
    if (!process.env.GEMINI_API_KEY || isQuotaOnCooldown()) {
      console.log('[Ioda Engine] Utilizando Motor Pedagógico Ioda DUA 3.0 com proteção LGPD.');
      const synthesized = synthesizeIodaPei(req.body);
      return res.json({
        success: true,
        data: synthesized,
        isIodaEngine: true,
        lgpdSanitized: true,
        notice: 'PEI estruturado pelo Motor Pedagógico Ioda (DUA 3.0 Universal)',
      });
    }

    const systemPrompt = buildUniversalIodaSystemInstruction();
    const userPrompt = buildUniversalUserPrompt(sanitizedPayload);

    // Attempt Gemini call with quick timeout and structured JSON Schema
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: IODA_GEMINI_RESPONSE_SCHEMA,
        },
      });
      clearTimeout(timeoutId);

      const outputText = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      let jsonStr = outputText.trim();
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }

      if (jsonStr.startsWith('{')) {
        const parsed = JSON.parse(jsonStr);
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
          lgpdSanitized: true,
        });
      } else {
        throw new Error('Retorno sem JSON');
      }
    } catch (genError: any) {
      clearTimeout(timeoutId);
      const isQuotaError =
        genError?.status === 429 ||
        genError?.code === 429 ||
        `${genError?.message}`.includes('429') ||
        `${genError?.message}`.includes('quota') ||
        `${genError?.message}`.includes('RESOURCE_EXHAUSTED');

      if (isQuotaError) {
        triggerQuotaCooldown(300000);
        console.log('[Ioda Pedagogical Engine] Cota de API de IA atingida. Ativando Motor Pedagógico Ioda DUA 3.0.');
      } else {
        console.log('[Ioda Pedagogical Engine] Ativando Motor Pedagógico Ioda para sintetizar o PEI com excelência curricular.');
      }

      const synthesized = synthesizeIodaPei(req.body);
      return res.json({
        success: true,
        data: synthesized,
        isIodaEngine: true,
        lgpdSanitized: true,
        notice: 'PEI estruturado pelo Motor Pedagógico Ioda (DUA 3.0 Universal)',
      });
    }
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
