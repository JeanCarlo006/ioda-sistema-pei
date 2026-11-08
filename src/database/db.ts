import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PEICompleto, PostItPainel, DisciplinaPpcPreset } from '../types/pei';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que o diretório data/ existe na raiz do projeto
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ioda_sistema.db');
export const db = new DatabaseSync(dbPath);

// Configuração do SQLite: Foreign keys ativas e WAL mode para alta performance
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

/**
 * Criação das tabelas relacionais do sistema
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      codigo_matricula TEXT NOT NULL,
      nome TEXT NOT NULL,
      idade TEXT NOT NULL,
      curso TEXT NOT NULL,
      status_diagnostico TEXT NOT NULL DEFAULT 'confirmado',
      categoria_neurodivergencia TEXT,
      cid_ou_hipotese TEXT,
      breve_historico_clinico_familiar TEXT,
      descricao_condicao_especifica TEXT,
      informacoes_dos_pais TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS peis (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      componente_curricular TEXT NOT NULL,
      modulo_periodo TEXT NOT NULL,
      data_elaboracao TEXT NOT NULL,
      docente_regente TEXT NOT NULL,
      docente_aee TEXT,
      profissional_apoio TEXT,
      coordenacao_napne TEXT,
      status_geral TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
      estudo_de_caso TEXT NOT NULL,
      planejamento_pei TEXT NOT NULL,
      metricas TEXT NOT NULL,
      parecer_pedagogico TEXT,
      sugestoes_proximo_ciclo TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pei_notes (
      id TEXT NOT NULL,
      pei_id TEXT NOT NULL REFERENCES peis(id) ON DELETE CASCADE,
      autor TEXT NOT NULL,
      papel TEXT NOT NULL,
      categoria TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      data TEXT NOT NULL,
      cor TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (id, pei_id)
    );

    CREATE TABLE IF NOT EXISTS ppc_disciplinas (
      id TEXT PRIMARY KEY,
      codigo TEXT,
      nome TEXT NOT NULL,
      periodo TEXT,
      curso TEXT NOT NULL,
      ementa TEXT,
      competencias TEXT,
      barreiras_comuns_ti TEXT,
      adaptacao_sugerida_padrao TEXT
    );

    CREATE TABLE IF NOT EXISTS knowledge_base_docs (
      id TEXT PRIMARY KEY,
      categoria TEXT NOT NULL,
      titulo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      tags TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

// Inicializa tabelas
initDatabase();

/**
 * Operações de Estudantes
 */
export const studentRepo = {
  getAll() {
    return db.prepare('SELECT * FROM students ORDER BY nome ASC').all() as any[];
  },

  getById(id: string) {
    return db.prepare('SELECT * FROM students WHERE id = ?').get(id) as any | undefined;
  },

  upsert(student: {
    id: string;
    codigo_matricula: string;
    nome: string;
    idade: string;
    curso: string;
    status_diagnostico?: string;
    categoria_neurodivergencia?: string;
    cid_ou_hipotese?: string;
    breve_historico_clinico_familiar?: string;
    descricao_condicao_especifica?: string;
    informacoes_dos_pais?: string;
  }) {
    const stmt = db.prepare(`
      INSERT INTO students (
        id, codigo_matricula, nome, idade, curso, status_diagnostico,
        categoria_neurodivergencia, cid_ou_hipotese, breve_historico_clinico_familiar,
        descricao_condicao_especifica, informacoes_dos_pais, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        codigo_matricula = excluded.codigo_matricula,
        nome = excluded.nome,
        idade = excluded.idade,
        curso = excluded.curso,
        status_diagnostico = excluded.status_diagnostico,
        categoria_neurodivergencia = excluded.categoria_neurodivergencia,
        cid_ou_hipotese = excluded.cid_ou_hipotese,
        breve_historico_clinico_familiar = excluded.breve_historico_clinico_familiar,
        descricao_condicao_especifica = excluded.descricao_condicao_especifica,
        informacoes_dos_pais = excluded.informacoes_dos_pais,
        updated_at = datetime('now')
    `);
    stmt.run(
      student.id,
      student.codigo_matricula,
      student.nome,
      student.idade,
      student.curso,
      student.status_diagnostico || 'confirmado',
      student.categoria_neurodivergencia || null,
      student.cid_ou_hipotese || null,
      student.breve_historico_clinico_familiar || null,
      student.descricao_condicao_especifica || null,
      student.informacoes_dos_pais || null
    );
  },

  delete(id: string) {
    db.prepare('DELETE FROM students WHERE id = ?').run(id);
  },
};

/**
 * Operações de PEI Completo
 */
export const peiRepo = {
  getAllPeis(): PEICompleto[] {
    const peiRows = db.prepare(`
      SELECT p.*, s.codigo_matricula, s.nome as estudante_nome, s.idade as estudante_idade,
             s.curso as estudante_curso, s.status_diagnostico, s.categoria_neurodivergencia,
             s.cid_ou_hipotese, s.breve_historico_clinico_familiar,
             s.descricao_condicao_especifica, s.informacoes_dos_pais
      FROM peis p
      JOIN students s ON p.student_id = s.id
      ORDER BY p.updated_at DESC
    `).all() as any[];

    return peiRows.map((row) => this.rowToPeiCompleto(row));
  },

  getById(id: string): PEICompleto | null {
    const row = db.prepare(`
      SELECT p.*, s.codigo_matricula, s.nome as estudante_nome, s.idade as estudante_idade,
             s.curso as estudante_curso, s.status_diagnostico, s.categoria_neurodivergencia,
             s.cid_ou_hipotese, s.breve_historico_clinico_familiar,
             s.descricao_condicao_especifica, s.informacoes_dos_pais
      FROM peis p
      JOIN students s ON p.student_id = s.id
      WHERE p.id = ?
    `).get(id) as any;

    if (!row) return null;
    return this.rowToPeiCompleto(row);
  },

  rowToPeiCompleto(row: any): PEICompleto {
    const notesRows = db.prepare('SELECT * FROM pei_notes WHERE pei_id = ? ORDER BY created_at ASC').all(row.id) as any[];

    const painel_notas: PostItPainel[] = notesRows.map((n) => ({
      id: n.id,
      autor: n.autor,
      papel: n.papel,
      categoria: n.categoria,
      conteudo: n.conteudo,
      data: n.data,
      cor: n.cor,
    }));

    return {
      id: row.id,
      cabecalho: {
        estudante: row.estudante_nome,
        codigo_matricula: row.codigo_matricula,
        idade: row.estudante_idade,
        curso: row.estudante_curso,
        componente_curricular: row.componente_curricular,
        modulo_periodo: row.modulo_periodo,
        data_elaboracao: row.data_elaboracao,
        docente_regente: row.docente_regente,
        docente_aee: row.docente_aee || '',
        profissional_apoio: row.profissional_apoio || '',
        coordenacao_napne: row.coordenacao_napne || '',
      },
      historico_napne: {
        status_diagnostico: row.status_diagnostico,
        categoria_neurodivergencia: row.categoria_neurodivergencia,
        cid_ou_hipotese: row.cid_ou_hipotese,
        breve_historico_clinico_familiar: row.breve_historico_clinico_familiar,
        descricao_condicao_especifica: row.descricao_condicao_especifica,
        informacoes_dos_pais: row.informacoes_dos_pais,
      },
      estudo_de_caso: JSON.parse(row.estudo_de_caso),
      planejamento_pei: JSON.parse(row.planejamento_pei),
      painel_notas,
      metricas: JSON.parse(row.metricas),
      parecer_pedagogico: row.parecer_pedagogico || '',
      sugestoes_proximo_ciclo: row.sugestoes_proximo_ciclo ? JSON.parse(row.sugestoes_proximo_ciclo) : [],
    };
  },

  savePei(pei: PEICompleto) {
    // 1. Garante que o estudante existe/está atualizado
    studentRepo.upsert({
      id: pei.id, // ou mapeado se houver tabela separada
      codigo_matricula: pei.cabecalho.codigo_matricula,
      nome: pei.cabecalho.estudante,
      idade: pei.cabecalho.idade,
      curso: pei.cabecalho.curso,
      status_diagnostico: pei.historico_napne.status_diagnostico,
      categoria_neurodivergencia: pei.historico_napne.categoria_neurodivergencia,
      cid_ou_hipotese: pei.historico_napne.cid_ou_hipotese,
      breve_historico_clinico_familiar: pei.historico_napne.breve_historico_clinico_familiar,
      descricao_condicao_especifica: pei.historico_napne.descricao_condicao_especifica,
      informacoes_dos_pais: pei.historico_napne.informacoes_dos_pais,
    });

    // 2. Insere/Atualiza o PEI
    const stmt = db.prepare(`
      INSERT INTO peis (
        id, student_id, componente_curricular, modulo_periodo, data_elaboracao,
        docente_regente, docente_aee, profissional_apoio, coordenacao_napne,
        status_geral, estudo_de_caso, planejamento_pei, metricas, parecer_pedagogico,
        sugestoes_proximo_ciclo, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        componente_curricular = excluded.componente_curricular,
        modulo_periodo = excluded.modulo_periodo,
        data_elaboracao = excluded.data_elaboracao,
        docente_regente = excluded.docente_regente,
        docente_aee = excluded.docente_aee,
        profissional_apoio = excluded.profissional_apoio,
        coordenacao_napne = excluded.coordenacao_napne,
        status_geral = excluded.status_geral,
        estudo_de_caso = excluded.estudo_de_caso,
        planejamento_pei = excluded.planejamento_pei,
        metricas = excluded.metricas,
        parecer_pedagogico = excluded.parecer_pedagogico,
        sugestoes_proximo_ciclo = excluded.sugestoes_proximo_ciclo,
        updated_at = datetime('now')
    `);

    stmt.run(
      pei.id,
      pei.id, // student_id vinculado ao ID do PEI
      pei.cabecalho.componente_curricular,
      pei.cabecalho.modulo_periodo,
      pei.cabecalho.data_elaboracao,
      pei.cabecalho.docente_regente,
      pei.cabecalho.docente_aee,
      pei.cabecalho.profissional_apoio,
      pei.cabecalho.coordenacao_napne,
      pei.metricas?.status_geral || 'EM_ANDAMENTO',
      JSON.stringify(pei.estudo_de_caso),
      JSON.stringify(pei.planejamento_pei),
      JSON.stringify(pei.metricas),
      pei.parecer_pedagogico,
      JSON.stringify(pei.sugestoes_proximo_ciclo || [])
    );

    // 3. Salva notas do painel se houver
    if (Array.isArray(pei.painel_notas)) {
      const deleteNotesStmt = db.prepare('DELETE FROM pei_notes WHERE pei_id = ?');
      deleteNotesStmt.run(pei.id);

      const insertNoteStmt = db.prepare(`
        INSERT OR REPLACE INTO pei_notes (id, pei_id, autor, papel, categoria, conteudo, data, cor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const nota of pei.painel_notas) {
        insertNoteStmt.run(
          nota.id,
          pei.id,
          nota.autor,
          nota.papel,
          nota.categoria,
          nota.conteudo,
          nota.data,
          nota.cor
        );
      }
    }
  },

  deletePei(id: string) {
    db.prepare('DELETE FROM peis WHERE id = ?').run(id);
    db.prepare('DELETE FROM students WHERE id = ?').run(id);
  },

  addNote(peiId: string, note: PostItPainel) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO pei_notes (id, pei_id, autor, papel, categoria, conteudo, data, cor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(note.id, peiId, note.autor, note.papel, note.categoria, note.conteudo, note.data, note.cor);
  },

  deleteNote(noteId: string) {
    db.prepare('DELETE FROM pei_notes WHERE id = ?').run(noteId);
  },
};

/**
 * Operações da Base de Conhecimento PPC de Disciplinas
 */
export const ppcRepo = {
  getAll(): DisciplinaPpcPreset[] {
    const rows = db.prepare('SELECT * FROM ppc_disciplinas ORDER BY nome ASC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      codigo: r.codigo,
      nome: r.nome,
      periodo: r.periodo,
      curso: r.curso,
      ementa: r.ementa,
      competencias: r.competencias,
      barreirasComunsTi: r.barreiras_comuns_ti ? JSON.parse(r.barreiras_comuns_ti) : [],
      adaptacaoSugeridaPadrao: r.adaptacao_sugerida_padrao,
    }));
  },

  upsert(disc: DisciplinaPpcPreset) {
    const stmt = db.prepare(`
      INSERT INTO ppc_disciplinas (id, codigo, nome, periodo, curso, ementa, competencias, barreiras_comuns_ti, adaptacao_sugerida_padrao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        codigo = excluded.codigo,
        nome = excluded.nome,
        periodo = excluded.periodo,
        curso = excluded.curso,
        ementa = excluded.ementa,
        competencias = excluded.competencias,
        barreiras_comuns_ti = excluded.barreiras_comuns_ti,
        adaptacao_sugerida_padrao = excluded.adaptacao_sugerida_padrao
    `);
    stmt.run(
      disc.id,
      disc.codigo,
      disc.nome,
      disc.periodo,
      disc.curso,
      disc.ementa,
      disc.competencias,
      JSON.stringify(disc.barreirasComunsTi || []),
      disc.adaptacaoSugeridaPadrao
    );
  },
};

/**
 * Base de Conhecimento RAG do Agente (Leis, Diretrizes, DUA 3.0)
 */
export const knowledgeBaseRepo = {
  search(query: string, limit = 5) {
    const terms = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    if (terms.length === 0) {
      return db.prepare('SELECT * FROM knowledge_base_docs LIMIT ?').all(limit) as any[];
    }
    const whereClauses = terms.map(() => '(LOWER(titulo) LIKE ? OR LOWER(conteudo) LIKE ? OR LOWER(tags) LIKE ?)').join(' OR ');
    const params: string[] = [];
    terms.forEach((t) => {
      params.push(`%${t}%`, `%${t}%`, `%${t}%`);
    });
    params.push(String(limit));

    return db.prepare(`SELECT * FROM knowledge_base_docs WHERE ${whereClauses} LIMIT ?`).all(...params) as any[];
  },

  upsertDoc(doc: { id: string; categoria: string; titulo: string; conteudo: string; tags?: string[] }) {
    const stmt = db.prepare(`
      INSERT INTO knowledge_base_docs (id, categoria, titulo, conteudo, tags)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        categoria = excluded.categoria,
        titulo = excluded.titulo,
        conteudo = excluded.conteudo,
        tags = excluded.tags
    `);
    stmt.run(doc.id, doc.categoria, doc.titulo, doc.conteudo, JSON.stringify(doc.tags || []));
  },
};

/**
 * Repositório de Configurações da Aplicação e Conexão de IA
 */
export const settingsRepo = {
  get(key: string): string | null {
    const row = db.prepare('SELECT value FROM app_settings WHERE key = ?').get(key) as { value: string } | undefined;
    return row ? row.value : null;
  },

  set(key: string, value: string) {
    const stmt = db.prepare(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = datetime('now')
    `);
    stmt.run(key, value);
  },

  getAll() {
    return db.prepare('SELECT key, value FROM app_settings').all() as { key: string; value: string }[];
  },
};

