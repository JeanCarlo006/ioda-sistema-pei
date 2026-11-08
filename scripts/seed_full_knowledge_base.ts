import { db, knowledgeBaseRepo } from '../src/database/db';

export function seedOfficialMecAndIftoKnowledgeBase() {
  console.log('🏛️ Atualizando Base de Conhecimento RAG Institucional com os 14 Cadernos MEC e Normas IFTO...');

  // 1. Resolução CONSUP/IFTO nº 48/2021 - Política de Inclusão do IFTO
  knowledgeBaseRepo.upsertDoc({
    id: 'doc-ifto-resolucao-consup-48-2021',
    categoria: 'normas_ifto',
    titulo: 'Resolução CONSUP/IFTO nº 48/2021 · Política de Inclusão do IFTO',
    conteudo: `DIRETRIZES DA POLÍTICA DE INCLUSÃO DO INSTITUTO FEDERAL DO TOCANTINS (IFTO):
1. Princípios: A inclusão é direito inalienável e princípio norteador em todos os cursos técnicos integrados, subsequentes, PROEJA, graduações e pós-graduações.
2. Papel do Professor Regente: O docente da disciplina é o responsável pedagógico pela regência, adaptação curricular, aplicação e acompanhamento do PEI em sua sala de aula, laboratório ou campo agrícola.
3. Papel do NAPNE e ETEP: O Núcleo de Atendimento às Pessoas com Necessidades Específicas (NAPNE) e a Equipe Técnico-Pedagógica (ETEP) assessoram diretamente os professores, fornecendo apoio técnico, formação continuada e mediação de recursos assistivos.
4. Avaliação e Procedimentos: A avaliação para identificação das necessidades educacionais deve ser circunstanciada e pedagógica. É assegurado tempo estendido em avaliações, flexibilização de instrumentos avaliativos e uso de tecnologias assistivas.
5. Certificação Diferenciada: Nos casos em que o estudante não alcançar a totalidade das competências terminais do PPC devido a severas limitações orgânicas ou cognitivas, é facultada a certificação diferenciada com histórico descritivo detalhado das competências adquiridas.
6. Privacidade e Sigilo: Todas as informações diagnósticas e funcionais são de caráter estritamente confidencial, sob responsabilidade ética e legal dos servidores (LGPD - Lei nº 13.709/2018).`,
    tags: ['ifto', 'consup_48_2021', 'politica_inclusao', 'napne', 'etep', 'docente_regente', 'certificacao_especial', 'lgpd'],
  });

  // 2. Portaria MEC nº 421/2026 e Decreto nº 12.686/2025
  knowledgeBaseRepo.upsertDoc({
    id: 'doc-mec-portaria-421-2026',
    categoria: 'legislacao_federal',
    titulo: 'Portaria MEC nº 421/2026 e Decreto Presidencial nº 12.686/2025 · Diretrizes Nacionais do PEI',
    conteudo: `MARCO REGULATÓRIO NACIONAL DO PLANO DE ENSINO INDIVIDUALIZADO:
1. Finalidade Estritamente Pedagógica: O PEI é um instrumento de planejamento didático-metodológico e curricular, não se confundindo com relatório clínico ou laudo pericial.
2. Não Condicionamento a Laudos Médicos: O direito ao PEI e às adaptações pedagógicas NÃO depende da apresentação prévia de laudo médico ou de código de Classificação Internacional de Doenças (CID). Estudantes com hipótese diagnóstica, laudo em investigação ou com barreiras funcionais evidentes têm direito imediato ao PEI.
3. Não Rebaixamento Curricular: É vedada a redução injustificada de conteúdos programáticos ou a exclusão de competências essenciais previstas no Projeto Pedagógico do Curso (PPC). As adaptações devem focar nas vias de acesso, tempo, metodologia e suportes (DUA 3.0).
4. Temporalidade e Revisão: O PEI deve ser elaborado no início de cada período letivo e avaliado a cada bimestre letivo pelos docentes regentes em conjunto com o AEE/NAPNE.`,
    tags: ['mec', 'portaria_421_2026', 'decreto_12686', 'sem_laudo', 'pei_obrigatorio', 'nao_rebaixamento', 'dua'],
  });

  // 3. Os 14 Cadernos Pedagógicos da PNEEII / MEC
  const cadernos = [
    {
      id: 'doc-mec-pneeii-vol-1',
      vol: 1,
      titulo: 'Caderno PNEEII/MEC Vol. 1 · Política de Educação Especial Inclusiva: Concepções e Princípios',
      conteudo: `FUNDAMENTOS DA POLÍTICA NACIONAL DE EDUCAÇÃO ESPECIAL INCLUSIVA:
- Paradigma da Inclusão: Superação da visão médico-patológica da deficiência. A deficiência é o resultado da interação entre impedimentos corporais e as diversas barreiras atitudinais, arquitetônicas e pedagógicas do ambiente.
- Transversalidade: O AEE e as medidas de acessibilidade perpassam todos os níveis de ensino, com destaque para a Educação Profissional, Científica e Tecnológica (EPT).
- Centralidade do Estudante: O processo pedagógico deve respeitar os ritmos singulares de aprendizagem sem segregação em salas isoladas.`,
      tags: ['mec', 'pneeii', 'vol_1', 'fundamentos', 'modelo_social', 'ept', 'inclusao'],
    },
    {
      id: 'doc-mec-pneeii-vol-2',
      vol: 2,
      titulo: 'Caderno PNEEII/MEC Vol. 2 · Atendimento Educacional Especializado (AEE): Concepções e Metodologias',
      conteudo: `METODOLOGIAS E ARTICULAÇÃO DO AEE COM A SALA REGULAR:
- Complementaridade: O AEE complementa e suplementa a formação dos estudantes, não substituindo o ensino regular nem o trabalho dos professores das disciplinas.
- Trabalho Colaborativo: Parceria contínua entre o professor de AEE/NAPNE e o professor regente para cocriação de estratégias e adaptações de materiais didáticos.
- Salas de Recursos Multifuncionais (SRM): Espaço de enriquecimento curricular, treinamento em tecnologias assistivas e apoio à autonomia do estudante.`,
      tags: ['mec', 'pneeii', 'vol_2', 'aee', 'trabalho_colaborativo', 'metodologia', 'srm'],
    },
    {
      id: 'doc-mec-pneeii-vol-3',
      vol: 3,
      titulo: 'Caderno PNEEII/MEC Vol. 3 · Documentação do AEE na Escola Inclusiva: Estudo de Caso, PAEE e PEI',
      conteudo: `INSTRUMENTAL PEDAGÓGICO OBRIGATÓRIO: ESTUDO DE CASO, PAEE E PEI:
- Estudo de Caso: Investigação preliminar que mapeia a história de vida, histórico escolar, interesses, potencialidades, manifestações comportamentais e barreiras do estudante no ambiente acadêmico.
- PAEE (Plano de Atendimento Educacional Especializado): Documento elaborado pelo especialista do AEE para orientar os atendimentos na Sala de Recursos.
- PEI (Plano de Ensino Individualizado): Planejamento curricular de cada disciplina elaborado pelo professor da matéria. Articula ementa, metas SMART, estratégias metodológicas, recursos de acessibilidade e critérios avaliativos adaptados.`,
      tags: ['mec', 'pneeii', 'vol_3', 'estudo_de_caso', 'paee', 'pei', 'documentacao_escolar', 'metas_smart'],
    },
    {
      id: 'doc-mec-pneeii-vol-4',
      vol: 4,
      titulo: 'Caderno PNEEII/MEC Vol. 4 · Práticas Pedagógicas Inclusivas em Salas de Aula: Diferenciação e DUA',
      conteudo: `PRÁTICAS EM SALA DE AULA, OFICINAS E LABORATÓRIOS:
- Diferenciação Pedagógica: Oferecer diferentes caminhos para que todos os estudantes aprendam os mesmos conceitos essenciais do currículo.
- Desenho Universal para a Aprendizagem (DUA): Planejar a aula previamente acessível para todos, reduzindo a necessidade de adaptações reativas posteriores.
- Gestão do Tempo e do Espaço: Permitir pausas sensoriais/regulatórias, fragmentar instruções complexas em passos sequenciais e disponibilizar cronogramas visuais no início da aula.`,
      tags: ['mec', 'pneeii', 'vol_4', 'praticas_inclusivas', 'diferenciacao', 'dua', 'sala_de_aula', 'laboratorio'],
    },
    {
      id: 'doc-mec-pneeii-vol-5',
      vol: 5,
      titulo: 'Caderno PNEEII/MEC Vol. 5 · Educação Inclusiva e Tecnologia Assistiva',
      conteudo: `RECURSOS DE TECNOLOGIA ASSISTIVA E ACESSIBILIDADE DIGITAL:
- Categorias de TA: Comunicação Alternativa e Aumentativa (CAA), recursos de alta e baixa tecnologia, leitores de tela (NVDA), ampliadores de texto, sintetizadores de voz, teclados virtuais e softwares pedagógicos acessíveis.
- Adequação de Materiais Digitais: Fontes legíveis (sans-serif), alto contraste, áudio-descrição de imagens e gráficos nas aulas teóricas e apostilas em formato PDF acessível ou texto aberto editável.`,
      tags: ['mec', 'pneeii', 'vol_5', 'tecnologia_assistiva', 'acessibilidade_digital', 'caa', 'nvda', 'materiais_adaptados'],
    },
    {
      id: 'doc-mec-pneeii-vol-6',
      vol: 6,
      titulo: 'Caderno PNEEII/MEC Vol. 6 · Práticas Inclusivas e Estudantes Autistas (TEA)',
      conteudo: `DIRETRIZES PARA O ENSINO DE ESTUDANTES NO ESPECTRO AUTISTA (TEA):
- Previsibilidade e Rotina: Notificar com antecedência qualquer alteração de datas de provas, troca de professores, aulas práticas em campo ou trabalhos em grupo.
- Perfil Sensorial e Gatilhos: Identificar hipersensibilidade ou hipossensibilidade a ruídos altos, iluminação fluorescente piscante, toques físicos ou odores de reagentes em laboratórios.
- Comunicação Clara e Literal: Evitar enunciados ambíguos, ironias, metáforas excessivas ou perguntas com dupla interpretação em avaliações de disciplinas exatas ou técnicas.
- Interesses Focados como Alavanca: Aproveitar os hiperfocos do estudante para contextualizar temas e exercícios da disciplina.`,
      tags: ['mec', 'pneeii', 'vol_6', 'autismo', 'tea', 'previsibilidade', 'gatilhos', 'perfil_sensorial', 'hiperfoco'],
    },
    {
      id: 'doc-mec-pneeii-vol-7',
      vol: 7,
      titulo: 'Caderno PNEEII/MEC Vol. 7 · Altas Habilidades ou Superdotação (AH/SD)',
      conteudo: `DIRETRIZES PARA ESTUDANTES COM ALTAS HABILIDADES / SUPERDOTAÇÃO:
- Dupla Excepcionalidade: Ocorrência simultânea de AH/SD com TEA, TDAH ou transtornos de aprendizagem (ex: alta capacidade de raciocínio abstrato combinada com desorganização executiva ou fobia social).
- Enriquecimento Curricular: Oferta de desafios acadêmicos aprofundados, iniciação científica, monitoria voluntária, projetos de pesquisa aplicada e aceleração de estudos conforme previsto na LDB.`,
      tags: ['mec', 'pneeii', 'vol_7', 'altas_habilidades', 'superdotacao', 'dupla_excepcionalidade', 'enriquecimento_curricular'],
    },
    {
      id: 'doc-mec-pneeii-vol-8',
      vol: 8,
      titulo: 'Caderno PNEEII/MEC Vol. 8 · Práticas Inclusivas e Deficiências Sensoriais (Visual e Auditiva)',
      conteudo: `ATENDIMENTO A DEFICIÊNCIAS SENSORIAIS (CEGUEIRA, BAIXA VISÃO, SURDEZ E SURDOCEGUEIRA):
- Deficiência Auditiva e Surdez: Presença de Tradutor e Intérprete de Libras (TILS) em todas as aulas teóricas e práticas; legendagem de vídeos didáticos; apoio prioritário em elementos visuais.
- Deficiência Visual: Disponibilização prévia de apostilas em formato digital acessível; gráficos e mapas táteis com relevo nas disciplinas técnicas; descrição oral de fórmulas químicas, circuitos e slides.`,
      tags: ['mec', 'pneeii', 'vol_8', 'deficiencia_sensorial', 'surdez', 'libras', 'baixa_visao', 'cegueira', 'graficos_tateis'],
    },
    {
      id: 'doc-mec-pneeii-vol-9',
      vol: 9,
      titulo: 'Caderno PNEEII/MEC Vol. 9 · Infâncias, Juventudes e Transição Escolar',
      conteudo: `ACOMPANHAMENTO NA TRANSIÇÃO DA EDUCAÇÃO BÁSICA PARA O MUNDO DO TRABALHO:
- Transição no Ensino Técnico: Apoio na transição do Ensino Fundamental para os Cursos Técnicos Integrados e preparação para estágios supervisionados e visitas técnicas.
- Articulação com a Família e ETEP: Escuta ativa da família e fortalecimento do protagonismo juvenil do estudante na construção de seu próprio PEI.`,
      tags: ['mec', 'pneeii', 'vol_9', 'juventudes', 'transicao_escolar', 'estagios', 'autonomia', 'protagonismo'],
    },
    {
      id: 'doc-mec-pneeii-vol-10',
      vol: 10,
      titulo: 'Caderno PNEEII/MEC Vol. 10 · Práticas Inclusivas em Alfabetização, Letramento e Linguagens',
      conteudo: `MULTILETRAMENTOS E ACESSIBILIDADE COGNITIVA NAS LINGUAGENS:
- Textos em Leitura Fácil: Adaptação de enunciados complexos para linguagem clara e direta, sem perda do rigor conceitual técnico.
- Glossários Terminológicos: Criação de glossários ilustrados com termos técnicos específicos das disciplinas profissionais (ex: agronomia, informática, edificações).`,
      tags: ['mec', 'pneeii', 'vol_10', 'letramento', 'leitura_facil', 'linguagem_clara', 'glossario_tecnico'],
    },
    {
      id: 'doc-mec-pneeii-vol-11',
      vol: 11,
      titulo: 'Caderno PNEEII/MEC Vol. 11 · AEE em Ambiente Hospitalar e Domiciliar',
      conteudo: `CONTINUIDADE PEDAGÓGICA PARA ESTUDANTES EM TRATAMENTO DE SAÚDE:
- Atendimento Domiciliar e Remoto: Garantia de acesso aos materiais didáticos e atividades adaptadas durante afastamentos médicos prolongados.
- Flexibilização de Prazos: Reprogramação do cronograma de entregas e avaliações mediadas sem prejuízo da frequência escolar justificada por laudo.`,
      tags: ['mec', 'pneeii', 'vol_11', 'ambiente_hospitalar', 'atendimento_domiciliar', 'saude_cronica', 'prazos_flexiveis'],
    },
    {
      id: 'doc-mec-pneeii-vol-12',
      vol: 12,
      titulo: 'Caderno PNEEII/MEC Vol. 12 · Educação Inclusiva e Intersetorialidade',
      conteudo: `ARTICULAÇÃO ENTRE EDUCAÇÃO, SAÚDE E ASSISTÊNCIA SOCIAL:
- Trabalho Intersetorial: Diálogo entre a equipe pedagógica da escola (NAPNE/ETEP) e profissionais externos (psicólogos, fonoaudiólogos, terapeutas ocupacionais e neurologistas) que acompanham o aluno.
- Foco Escolar: O papel da escola é exclusivamente pedagógico; as orientações clínicas servem como subsídio para eliminação de barreiras de aprendizagem.`,
      tags: ['mec', 'pneeii', 'vol_12', 'intersetorialidade', 'rede_de_apoio', 'saude_e_educacao', 'napne'],
    },
    {
      id: 'doc-mec-pneeii-vol-13',
      vol: 13,
      titulo: 'Caderno PNEEII/MEC Vol. 13 · Profissional de Apoio Escolar e Mediação Pedagógica',
      conteudo: `PAPEL E LIMITES DO PROFISSIONAL DE APOIO ESCOLAR (LEI BRASILEIRA DE INCLUSÃO - LEI Nº 13.146/2015):
- Atribuições: Auxílio em atividades de alimentação, higiene, locomoção e comunicação, além de mediação em sala de aula quando estritamente necessário.
- Não Substituição Docente: O profissional de apoio não elabora conteúdos, não avalia e não substitui a responsabilidade pedagógica do professor da disciplina.
- Promoção da Independência: O apoio deve encorajar a autonomia progressiva do estudante, evitando dependência tutelar.`,
      tags: ['mec', 'pneeii', 'vol_13', 'profissional_de_apoio', 'lbi', 'autonomia', 'mediacao_escolar'],
    },
    {
      id: 'doc-mec-pneeii-vol-14',
      vol: 14,
      titulo: 'Caderno PNEEII/MEC Vol. 14 · Gestão Escolar Inclusiva e Liderança Pedagógica',
      conteudo: `GESTÃO DEMOCRÁTICA E CULTURA INCLUSIVA INSTITUCIONAL:
- Compromisso Coletivo: A inclusão não é tarefa exclusiva do NAPNE ou do AEE, mas compromisso institucional de toda a gestão escolar, coordenações de curso e corpo docente.
- Registro Institucional: O PEI deve compor a pasta acadêmica do aluno no SUAP e no Sistema Eletrônico de Informações (SEI), garantindo rastreabilidade histórica ao longo de toda a sua trajetória no IFTO.`,
      tags: ['mec', 'pneeii', 'vol_14', 'gestao_escolar', 'lideranca_pedagogica', 'suap', 'sei', 'cultura_inclusiva'],
    },
  ];

  for (const cad of cadernos) {
    knowledgeBaseRepo.upsertDoc({
      id: cad.id,
      categoria: 'cadernos_mec',
      titulo: cad.titulo,
      conteudo: cad.conteudo,
      tags: cad.tags,
    });
  }

  // 4. Princípios do Desenho Universal para a Aprendizagem (DUA 3.0 CAST 2024)
  knowledgeBaseRepo.upsertDoc({
    id: 'doc-dua-3-cast-universal',
    categoria: 'dua_3_0',
    titulo: 'Desenho Universal para a Aprendizagem (DUA 3.0 / CAST 2024)',
    conteudo: `DIRETRIZES GLOBAIS DO DUA 3.0 PARA O ENSINO TÉCNICO E SUPERIOR:
1. Múltiplos Meios de Engajamento (O Porquê da Aprendizagem):
   - Estimular o interesse e a autonomia através de escolhas de temas de projetos.
   - Fornecer suporte para autorregulação, previsão de rotinas de aula e pausas ativas.
   - Reduzir ameaças e distrações no ambiente de sala ou laboratório.
2. Múltiplos Meios de Representação (O Quê da Aprendizagem):
   - Apresentar conceitos por meio de esquemas visuais, textos simplificados, mapas mentais, modelos tridimensionais táteis e vídeos explicativos.
   - Fornecer glossários de símbolos e terminologias técnicas prévias.
   - Destacar padrões, ideias fundamentais e relações conceituais.
3. Múltiplos Meios de Ação e Expressão (O Como da Aprendizagem):
   - Diversificar os instrumentos de avaliação: provas escritas em tópicos, seminários gravados, relatórios práticos orais, mapas conceituais ou projetos aplicados.
   - Concessão de tempo adicional em avaliações formais (+50% do tempo regulamentar).
   - Uso livre de tecnologias assistivas, calculadoras, softwares de leitura e corretores gramaticais.`,
    tags: ['dua_3_0', 'cast_2024', 'engajamento', 'representacao', 'acao_e_expressao', 'acessibilidade_curricular'],
  });

  const total = db.prepare('SELECT count(*) as count FROM knowledge_base_docs').get() as { count: number };
  console.log(`✅ Base de Conhecimento RAG Institucional atualizada com sucesso! Total de documentos oficiais no SQLite: ${total.count}`);
}

seedOfficialMecAndIftoKnowledgeBase();
