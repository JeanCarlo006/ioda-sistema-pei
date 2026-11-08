import { PEICompleto, PostItPainel, DisciplinaPpcPreset } from '../types/pei';

export const apiService = {
  /**
   * Busca todos os PEIs cadastrados no banco de dados SQLite
   */
  async getPeis(): Promise<PEICompleto[]> {
    try {
      const res = await fetch('/api/peis');
      if (!res.ok) throw new Error('Falha ao carregar PEIs');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('Usando fallback local temporário:', err);
      return [];
    }
  },

  /**
   * Salva ou atualiza um PEI no banco de dados
   */
  async savePei(pei: PEICompleto): Promise<PEICompleto> {
    const res = await fetch('/api/peis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pei),
    });
    if (!res.ok) throw new Error('Falha ao salvar PEI no banco');
    const json = await res.json();
    return json.data || pei;
  },

  /**
   * Exclui um PEI do banco de dados
   */
  async deletePei(id: string): Promise<boolean> {
    const res = await fetch(`/api/peis/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  /**
   * Adiciona uma nota colaborativa (Post-it) no painel do PEI
   */
  async addNote(peiId: string, note: PostItPainel): Promise<PostItPainel> {
    const res = await fetch(`/api/peis/${encodeURIComponent(peiId)}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error('Falha ao adicionar nota');
    const json = await res.json();
    return json.data || note;
  },

  /**
   * Remove uma nota colaborativa do painel
   */
  async deleteNote(peiId: string, noteId: string): Promise<boolean> {
    const res = await fetch(`/api/peis/${encodeURIComponent(peiId)}/notes/${encodeURIComponent(noteId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  /**
   * Busca disciplinas e competências do PPC
   */
  async getPpcDisciplinas(): Promise<DisciplinaPpcPreset[]> {
    try {
      const res = await fetch('/api/ppc');
      if (!res.ok) throw new Error('Falha ao carregar PPC');
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Pesquisa na Base de Conhecimento RAG (DUA 3.0, Legislações, Protocolos ETEP)
   */
  async searchKnowledgeBase(query: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/knowledge-base/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Busca as turmas/diários do professor integrados ao SUAP
   */
  async getSuapDiarios(): Promise<any[]> {
    try {
      const res = await fetch('/api/suap/diarios');
      if (!res.ok) throw new Error('Falha ao carregar diários do SUAP');
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Busca o Plano de Ensino oficial do diário cadastrado no SUAP
   */
  async getSuapPlanoEnsino(diarioId: string): Promise<any | null> {
    try {
      const res = await fetch(`/api/suap/diarios/${encodeURIComponent(diarioId)}/plano-ensino`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Busca estudantes matriculados no diário do SUAP
   */
  async getSuapEstudantes(diarioId: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/suap/diarios/${encodeURIComponent(diarioId)}/estudantes`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Busca a configuração atual da IA (provedor, modelo, se possui chave)
   */
  async getAiConfig(): Promise<{
    provider: string;
    hasKey: boolean;
    maskedKey: string;
    model: string;
    ollamaHost: string;
    isQuotaOnCooldown: boolean;
  }> {
    try {
      const res = await fetch('/api/config/ai');
      if (!res.ok) throw new Error('Falha ao obter status de IA');
      const json = await res.json();
      return json.data || { provider: 'gemini', hasKey: false, maskedKey: '', model: 'gemini-2.5-flash', ollamaHost: 'http://localhost:11434', isQuotaOnCooldown: false };
    } catch {
      return { provider: 'gemini', hasKey: false, maskedKey: '', model: 'gemini-2.5-flash', ollamaHost: 'http://localhost:11434', isQuotaOnCooldown: false };
    }
  },

  /**
   * Salva configurações de IA (Chave do Gemini ou Servidor Local Ollama)
   */
  async saveAiConfig(config: { apiKey?: string; provider?: string; model?: string; ollamaHost?: string }): Promise<boolean> {
    const res = await fetch('/api/config/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.ok;
  },
};

