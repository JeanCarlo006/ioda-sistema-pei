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

  // 3. Semeia a Base de Conhecimento RAG do Agente Ioda com os documentos oficiais do Drive
  const existingKb = db.prepare('SELECT count(*) as count FROM knowledge_base_docs').get() as { count: number };
  if (existingKb.count < 5) {
    console.log('🧠 Semeando Base de Conhecimento RAG Institucional (Drive / MEC / IFTO / DUA 3.0)...');

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-mec-421-2026',
      categoria: 'legislacao_federal',
      titulo: 'Portaria MEC nº 421/2026 e Decreto Presidencial nº 12.686/2025',
      conteudo: `O Plano de Ensino Individualizado (PEI) possui finalidade estritamente pedagógica, funcional e curricular.
A elaboração e a aplicação do PEI NÃO dependem de apresentação prévia de laudo médico pericial ou código de CID.
Estudantes em processo de investigação pedagógica ou com hipótese diagnóstica têm direito pleno às adequações imediatas.
O PEI não autoriza o rebaixamento de conteúdos curriculares ou eliminação de objetivos essenciais do PPC, mas sim a flexibilização das vias de acesso, tempo, metodologia e tecnologia assistiva.`,
      tags: ['mec', 'portaria_421', 'decreto_12686', 'sem_laudo', 'pei', 'diretrizes'],
    });

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-ifto-politica-inclusao',
      categoria: 'normas_ifto',
      titulo: 'Política de Educação Inclusiva do IFTO (Resolução CONSUP/IFTO)',
      conteudo: `A inclusão escolar no IFTO é princípio institucional norteador de todos os níveis de ensino (Cursos Técnicos Integrados, Subsequentes, PROEJA, Superiores e Pós-Graduação).
O Núcleo de Atendimento às Pessoas com Necessidades Específicas (NAPNE) e a Equipe Técnico-Pedagógica (ETEP) atuam em regime de assessoria e colaboração com os docentes.
A elaboração e execução do PEI é atribuição pedagógica do docente regente do componente curricular, com suporte do docente de AEE/NAPNE.
Garante-se a confidencialidade e a segurança das informações dos estudantes, em estrita consonância com a LGPD (Lei nº 13.709/2018).`,
      tags: ['ifto', 'politica_inclusao', 'consup', 'napne', 'etep', 'lgpd'],
    });

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-ifto-capacitacao-pei',
      categoria: 'praticas_ifto',
      titulo: 'Diretrizes Institucionais de Elaboração do PEI · NAPNE/IFTO 2026',
      conteudo: `Orientações práticas para o preenchimento do PEI pelo professor do IFTO:
1. O PEI é um documento vivo e dinâmico, revisado bimestralmente conforme o avanço do estudante.
2. Iniciar pela análise da própria disciplina: o que é núcleo conceitual essencial da ementa e quais são os objetivos de aprendizagem do PPC.
3. Não rotular o estudante por diagnósticos abstratos; identificar as barreiras concretas observadas em sala, campo ou laboratório (ex: ruídos, instruções longas, coordenação motora, fadiga ocular).
4. O processo oficial é finalizado com o envio do documento ao Sistema Eletrônico de Informações (SEI) com assinaturas do Docente e da Coordenação do NAPNE.`,
      tags: ['ifto', 'pei', 'sei', 'elaboracao', 'docente', 'napne'],
    });

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-mec-pneeii-funcional',
      categoria: 'cadernos_mec',
      titulo: 'Cadernos Pedagógicos da Política Nacional de Educação Especial Inclusiva (PNEEII / MEC)',
      conteudo: `Fundamentos da avaliação pedagógica e análise funcional do comportamento:
A identificação das necessidades educacionais específicas deve pautar-se nas barreiras atitudinais, metodológicas e comunicacionais presentes no ambiente escolar.
Estudantes com a mesma condição diagnóstica (ex: dois estudantes autistas ou com TDAH) manifestam padrões comportamentais, ritmos e potencialidades totalmente distintos.
O mapeamento de gatilhos situacionais de sobrecarga ou crise é ferramenta preventiva indispensável para a regulação emocional e o êxito acadêmico.`,
      tags: ['pneeii', 'mec', 'cadernos_pedagogicos', 'analise_funcional', 'gatilhos'],
    });

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-dua-3-universal',
      categoria: 'dua_3_0',
      titulo: 'Desenho Universal para a Aprendizagem (DUA 3.0 / CAST 2024)',
      conteudo: `Princípios universais aplicáveis a qualquer ambiente acadêmico (aulas teóricas, laboratórios químicos, ateliês de desenho, oficinas mecânicas e aulas de campo agropecuárias):
Princípio 1 - Engajamento (Por que aprender): Antecipação da rotina, pausas ativas regulatórias, conexão do conteúdo com interesses e redução de ameaças/estímulos aversivos.
Princípio 2 - Representação (O que aprender): Múltiplos formatos de apresentação (esquemas visuais, glossários ilustrados, modelos táteis, checklists de passos), minimizando a dependência exclusiva da fala do professor ou de textos densos.
Princípio 3 - Ação e Expressão (Como aprender): Diversificação das formas de avaliação (prática assistida, apresentação gravada em vídeo, relatórios em tópicos objetivos, demonstração prática) com concessão de tempo adicional (+50%) e uso de tecnologias assistivas.`,
      tags: ['dua_3_0', 'cast', 'engajamento', 'representacao', 'expressao', 'acessibilidade'],
    });

    console.log('✅ Base de Conhecimento RAG Institucional atualizada com sucesso!');
  }
}
