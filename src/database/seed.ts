import { db, studentRepo, peiRepo, ppcRepo, knowledgeBaseRepo } from './db';
import { todosOsCasos } from '../data/initialCases';
import { presetsDisciplinasPpc } from '../data/ppcPresets';

export function seedDatabaseIfNeeded() {
  // 1. Verifica se já existem PEIs
  const existingPeis = db.prepare('SELECT count(*) as count FROM peis').get() as { count: number };
  if (existingPeis.count === 0) {
    console.log('📦 Semeando banco de dados com casos reais iniciais do Campus Paraíso...');
    for (const pei of todosOsCasos) {
      peiRepo.savePei(pei);
    }
    console.log(`✅ ${todosOsCasos.length} casos de PEI semeados no banco de dados SQLite com sucesso!`);
  }

  // 2. Semeia presets de PPC se tabela estiver vazia
  const existingPpc = db.prepare('SELECT count(*) as count FROM ppc_disciplinas').get() as { count: number };
  if (existingPpc.count === 0) {
    console.log('📚 Semeando componentes curriculares do PPC no banco de dados...');
    for (const disc of presetsDisciplinasPpc) {
      ppcRepo.upsert(disc);
    }
    console.log(`✅ ${presetsDisciplinasPpc.length} disciplinas PPC semeadas!`);
  }

  // 3. Semeia a Base de Conhecimento RAG do Agente Ioda se vazia
  const existingKb = db.prepare('SELECT count(*) as count FROM knowledge_base_docs').get() as { count: number };
  if (existingKb.count === 0) {
    console.log('🧠 Semeando Base de Conhecimento RAG (DUA 3.0, Legislação e Práticas ETEP)...');

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-mec-421-2026',
      categoria: 'legislacao',
      titulo: 'Portaria MEC nº 421/2026 e Decreto nº 12.686/2025',
      conteudo: `O Plano de Ensino Individualizado (PEI) possui finalidade estritamente pedagógica e funcional.
A elaboração e implementação do PEI NÃO dependem de apresentação prévia de laudo médico pericial com CID.
Estudantes em processo de investigação ou com hipóteses diagnósticas têm direito imediato a todas as adequações pedagógicas,
assegurando permanência e êxito escolar sem rebaixamento de conteúdos curriculares.`,
      tags: ['mec', 'decreto_12686', 'legislacao', 'laudo_medico', 'pei'],
    });

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-dua-3-ti',
      categoria: 'dua_3_0',
      titulo: 'Desenho Universal para a Aprendizagem (DUA 3.0) em Laboratórios de Informática',
      conteudo: `Diretrizes DUA 3.0 aplicadas à computação (Ensino Médio Técnico e Superior em TI):
1. Engajamento: Escolha de temas de projetos de software alinhados a hiperfocos/interesses do aluno, antecipação de rotinas de aula, ambiente de laboratório com controle de sobrecarga sensorial.
2. Representação: Código-fonte com realce de sintaxe de alto contraste, fontes monoespaçadas legíveis (OpenDyslexic Mono, Fira Code), diagramas UML/arquitetura claros, enunciados fracionados (chunking).
3. Ação e Expressão: Múltiplas formas de demonstrar aprendizado (repositório Git, defesa oral, vídeo demonstrativo), programação em pares (Pair Programming) e concessão de tempo estendido (+50%) em provas práticas de código.`,
      tags: ['dua_3_0', 'cast_2024', 'programacao', 'laboratorio_ti', 'acessibilidade'],
    });

    knowledgeBaseRepo.upsertDoc({
      id: 'doc-etep-napne-paraiso',
      categoria: 'etep_praticas',
      titulo: 'Boas Práticas e Protocolos ETEP/NAPNE · IFTO Campus Paraíso',
      conteudo: `Protocolo de acolhimento e acompanhamento:
- Mapeamento preventivo de gatilhos (ruídos de teclados/ar-condicionado, avaliações cronometradas com pressão excessiva).
- Estabelecimento de tutor/colega de apoio em laboratório para estudantes com dificuldades de coordenação motora ou ansiedade social.
- Divisão de entregas em milestones curtos e cumulativos com feedback formativo frequente.`,
      tags: ['napne', 'ifto', 'paraiso', 'etep', 'gatilhos'],
    });

    console.log('✅ Base de Conhecimento RAG semeada!');
  }
}
