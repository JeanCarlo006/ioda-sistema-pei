import { db, studentRepo, peiRepo, ppcRepo, knowledgeBaseRepo } from './db';
import { presetsDisciplinasPpc } from '../data/ppcPresets';

export function seedDatabaseIfNeeded() {
  // 1. Cria tabela app_settings se não existir
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 2. Semeia presets de componentes curriculares PPC (Agro, Edificações, Química, ADM, TI)
  const existingPpc = db.prepare('SELECT count(*) as count FROM ppc_disciplinas').get() as { count: number };
  if (existingPpc.count === 0) {
    console.log('📚 Semeando componentes curriculares dos cursos do IFTO no banco de dados...');
    for (const disc of presetsDisciplinasPpc) {
      ppcRepo.upsert(disc);
    }
  }

  // 3. Semeia a Base de Conhecimento RAG do Agente Ioda com os 14 Cadernos MEC e Normas IFTO
  const existingKb = db.prepare('SELECT count(*) as count FROM knowledge_base_docs').get() as { count: number };
  if (existingKb.count < 14) {
    import('../../scripts/seed_full_knowledge_base').then((m) => {
      m.seedOfficialMecAndIftoKnowledgeBase();
    }).catch(console.error);
  }
}
