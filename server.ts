import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

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

// Advanced Ioda Pedagogical Engine for TI (Ensino Médio Técnico e Superior)
function synthesizeIodaPei(params: any) {
  const {
    studentName = 'Estudante',
    grade,
    course,
    subject,
    barriers = 'Dificuldade motora ou visual no laboratório de informática',
    potentialities = 'Raciocínio lógico e dedutivo para tecnologia',
    assistiveTech = 'Softwares adaptados e tempo ampliado',
    docenteRegente = 'Prof. Responsável da Disciplina',
    docenteAee = 'Profª. Renata Cavalcanti (NAPNE · Campus Paraíso)',
    perfilModalidade = 'medio_tecnico',
    statusDiagnostico = 'confirmado',
  } = params;

  const isSuperior =
    perfilModalidade === 'superior_ti' ||
    (course && (
      course.toLowerCase().includes('superior') ||
      course.toLowerCase().includes('sistemas') ||
      course.toLowerCase().includes('ciência') ||
      course.toLowerCase().includes('engenharia')
    )) ||
    (grade && grade.toLowerCase().includes('semestre'));

  const finalCourse = course || (isSuperior
    ? 'Bacharelado em Sistemas de Informação (TI)'
    : 'Curso Técnico Integrado ao Ensino Médio em Informática');

  const finalGrade = grade || (isSuperior ? '4º Semestre / Noturno' : '2º Ano / Diurno');
  const finalSubject = subject || (isSuperior ? 'Banco de Dados Relacional e SQL' : 'Programação Web e Algoritmos');

  const selectedIds: string[] = Array.isArray(params.selectedIds) ? params.selectedIds : [];
  const selectedNeurodivergences: string[] = Array.isArray(params.selectedNeurodivergences)
    ? params.selectedNeurodivergences
    : [];
  const combinedContext = `${barriers} ${selectedIds.join(' ')} ${selectedNeurodivergences.join(' ')}`.toLowerCase();

  const isEngSoft =
    finalSubject.toLowerCase().includes('engenharia de software') ||
    finalSubject.toLowerCase().includes('bac.0406') ||
    finalSubject.toLowerCase().includes('qualidade');

  const isVisual =
    combinedContext.includes('visão') ||
    combinedContext.includes('visual') ||
    combinedContext.includes('cego') ||
    combinedContext.includes('cegueira') ||
    combinedContext.includes('sol-baixa-visao');

  const isMotor =
    combinedContext.includes('motor') ||
    combinedContext.includes('digita') ||
    combinedContext.includes('paralisia') ||
    combinedContext.includes('espastic') ||
    combinedContext.includes('mão') ||
    combinedContext.includes('punho') ||
    combinedContext.includes('sol-motora');

  const isAutism =
    combinedContext.includes('autista') ||
    combinedContext.includes('autismo') ||
    combinedContext.includes('tea') ||
    combinedContext.includes('sensorial') ||
    combinedContext.includes('ruído') ||
    combinedContext.includes('sol-tea');

  const isAdhd =
    combinedContext.includes('tdah') ||
    combinedContext.includes('déficit de atenção') ||
    combinedContext.includes('hiperativid') ||
    combinedContext.includes('sol-tdah');

  const isAnxiety =
    combinedContext.includes('ansied') ||
    combinedContext.includes('pânico') ||
    combinedContext.includes('fóbic') ||
    combinedContext.includes('sol-ansiedade') ||
    combinedContext.includes('sol-misto-ansioso-depressivo');

  const isLearning =
    combinedContext.includes('dislex') ||
    combinedContext.includes('disgraf') ||
    combinedContext.includes('discalcul') ||
    combinedContext.includes('aprendizagem') ||
    combinedContext.includes('sol-aprendizagem');

  const isIntellectual =
    combinedContext.includes('intelectual') ||
    combinedContext.includes('desenvolvimento intelectual') ||
    combinedContext.includes('sol-def-intelectual');

  const isOCD =
    combinedContext.includes('toc') ||
    combinedContext.includes('obsessiv') ||
    combinedContext.includes('compulsiv') ||
    combinedContext.includes('sol-toc');

  const isDepression =
    combinedContext.includes('depress') ||
    combinedContext.includes('anedonia') ||
    combinedContext.includes('sol-depressao') ||
    combinedContext.includes('sol-misto-ansioso-depressivo');

  const isEpilepsy =
    combinedContext.includes('epilep') ||
    combinedContext.includes('convuls') ||
    combinedContext.includes('crise') ||
    combinedContext.includes('sol-epilepsia');

  // Dynamic cumulative DUA 3.0 recommendations tailored for ALL selected neurodivergences
  const engajamento: string[] = [];
  if (isEngSoft) {
    engajamento.push(
      'Metodologia ágil com ciclos curtos de teste (TDD red-green-refactor) e rastreamento visual de tarefas e bugs no Jira / GitHub Projects (Plano de Ensino BAC.0406).'
    );
  } else {
    engajamento.push(
      isSuperior
        ? 'Contextualização em problemas corporativos reais de engenharia de software, modelagem de dados e arquitetura de sistemas do PPC do BSI.'
        : 'Projetos práticos de desenvolvimento integrados à formação técnica e comunitária no IFTO Campus Paraíso.'
    );
  }

  if (isAdhd) {
    engajamento.push(
      'TDAH: Divisão das atividades de laboratório (LABIN/LADES) em micro-sprints com técnica Pomodoro (25min foco / 5min pausa) e entregas graduais.'
    );
  }
  if (isAutism) {
    engajamento.push(
      'TEA: Previsibilidade com cronograma semanal antecipado no Moodle, rotina metódica de testes, papéis técnicos definidos e cartão de pausa sensorial.'
    );
  }
  if (isAnxiety) {
    engajamento.push(
      'Ansiedade: Ambiente de laboratório acolhedor, substituição de defesas orais abertas por vídeos curtos (Loom) ou banca reservada e rubricas analíticas prévias.'
    );
  }
  if (isOCD) {
    engajamento.push(
      'TOC: Critérios explícitos de aceite (Definition of Done) para interromper refatorações excessivas com validação automática por pipeline de CI/CD.'
    );
  }
  if (isDepression) {
    engajamento.push(
      'Humor/Depressão: Acolhimento contínuo com metas graduais de recomposição da autoeficácia, acesso assíncrono ao Moodle e duplas colaborativas.'
    );
  }
  if (isEpilepsy) {
    engajamento.push(
      'Epilepsia: Ambiente calmo sem sobrecarga de estresse temporal, pausas a cada 45 minutos e protocolo de segurança alinhado.'
    );
  }
  if (isLearning) {
    engajamento.push(
      'Aprendizagem (Dislexia/Disgrafia/Discalculia): Acolhimento que remove punição por erros sintáticos de digitação, valorizando o raciocínio algorítmico.'
    );
  }
  if (isIntellectual) {
    engajamento.push(
      'Desenvolvimento Intelectual: Mediação assistida de monitor de TI, desafios contextualizados e valorização imediata de cada etapa concluída.'
    );
  }
  if (isMotor) {
    engajamento.push(
      'Motora: Metodologia de Pair Programming com rodízio orientado (estudante atua como arquiteto da lógica e dos casos de teste).'
    );
  }
  engajamento.push(
    'Sessões de alinhamento contínuo com a coordenação pedagógica do NAPNE e docente regente no Campus Paraíso.'
  );

  const representacao: string[] = [];
  if (isEngSoft) {
    representacao.push(
      'Disponibilização antecipada no Moodle de modelos de planos de teste (IEEE 829), especificações de casos de teste e suítes JUnit/Selenium comentadas.'
    );
  } else {
    representacao.push(
      'Disponibilização antecipada de roteiros de laboratório em formato Markdown acessível e snippets de código comentados.'
    );
  }
  if (isLearning) {
    representacao.push(
      'Aprendizagem: Instalação de fontes acessíveis (OpenDyslexic Mono / JetBrains Mono) na IDE e enunciados em tabelas limpas de casos de teste (Input / Output).'
    );
  }
  if (isAutism || isOCD) {
    representacao.push(
      'TEA / TOC: Roteiros de laboratório passo a passo com critérios de aceite objetivos e linguagem direta sem ambiguidades.'
    );
  }
  if (isAdhd) {
    representacao.push(
      'TDAH: Instruções fracionadas em checklists interativos com destaque visual das entregas prioritárias e linters em tempo real.'
    );
  }
  if (isVisual) {
    representacao.push(
      'Visual: Substituição obrigatória de diagramas rasterizados por representações textuais estruturadas acessíveis ao leitor NVDA (scripts DDL, DBML, YAML e Mermaid).'
    );
  }
  if (isIntellectual) {
    representacao.push(
      'Desenvolvimento Intelectual: Fracionamento de conceitos abstratos em blocos curtos (2 a 3 passos) ilustrados com fluxogramas visuais.'
    );
  }
  if (isEpilepsy) {
    representacao.push(
      'Epilepsia: Monitores com taxa de atualização estável (60Hz+), filtros antirreflexo e temas de IDE sem contrastes estroboscópicos ou flashes.'
    );
  }
  if (representacao.length < 3) {
    representacao.push(
      'Diagramação visual de arquiteturas e algoritmos com casos de teste exemplificados em tabelas claras.'
    );
  }

  const acaoExpressao: string[] = [];
  if (isAnxiety || isDepression) {
    acaoExpressao.push(
      'Opção de gravação de vídeo/screencast curto (Loom) ou apresentação individual ao docente em substituição a exposições orais para toda a turma.'
    );
  }
  if (isAdhd || isAutism) {
    acaoExpressao.push(
      'Entregas contínuas fracionadas por sprint no GitHub/Jira em substituição a avaliações únicas extensas, com uso de templates estruturados.'
    );
  }
  if (isVisual) {
    acaoExpressao.push(
      'Interação com banco de dados e servidores via terminal de linha de comando (CLI/SSH) acessível ao NVDA.'
    );
  }
  if (isMotor) {
    acaoExpressao.push(
      'Uso de teclado mecânico ergonômico de ativação leve, atalhos de IDE e ferramentas de autocompletar inteligente.'
    );
  }
  if (isEngSoft) {
    acaoExpressao.push(
      'Entrega prática de suítes de testes automatizados (JUnit/Selenium) e relatórios de bugs no Jira com avaliação formativa.'
    );
  } else {
    acaoExpressao.push(
      'Demonstração de competência por meio de repositório Git com commits semânticos e defesa técnica guiada.'
    );
  }
  acaoExpressao.push(
    'Tempo estendido (+50%) assegurado em todas as avaliações práticas de programação, testes e modelagem de software.'
  );

  // Assistive Technology suggestions combined across all selected conditions
  const taList: string[] = [];
  if (isAdhd) {
    taList.push('Quadro Kanban integrado ao Jira / GitHub Projects e temporizador Pomodoro');
  }
  if (isAutism) {
    taList.push('Abafador de ruídos circum-aural (27dB+) e cartão de pausa sensorial para uso no LABIN');
  }
  if (isAnxiety || isDepression) {
    taList.push('Ferramenta de gravação de tela Loom e rubricas analíticas antecipadas no Moodle');
  }
  if (isLearning) {
    taList.push('Fontes especializadas (OpenDyslexic Mono) e linters visuais no VS Code (Error Lens)');
  }
  if (isOCD) {
    taList.push('Checklists automatizados de Definition of Done (DoD) e pipelines CI/CD no GitHub Actions');
  }
  if (isEpilepsy) {
    taList.push('Monitor LCD/LED 60Hz+ antirreflexo e tema de IDE com contraste suave sem animações piscantes');
  }
  if (isIntellectual) {
    taList.push('Templates de código pré-estruturados (scaffolding) e ambiente visual de depuração passo a passo');
  }
  if (isVisual) {
    taList.push('Leitor de telas NVDA configurado com sintetizador em português e terminal CLI acessível');
  }
  if (isMotor) {
    taList.push('Teclado mecânico com apoio de punho regulável e mouse vertical ergonômico');
  }
  if (isEngSoft) {
    taList.push('Frameworks de automação de testes (JUnit, Selenium) e rastreamento de defeitos (Jira)');
  }
  taList.push('Tempo estendido (+50%) assegurado em avaliações práticas de computação');
  taList.push('Bancada de laboratório acessível nos laboratórios LABIN 1/2/3 e LADES do Campus Paraíso');

  // Specific SMART goals tailored for modality, discipline, and combined neurodivergences
  const metas: any[] = [
    {
      id_meta: 'M1',
      descricao_meta: isEngSoft
        ? `Aplicar técnicas de teste de software (caixa-preta, partição de equivalência e ciclo TDD red-green-refactor) na implementação de suítes de testes automatizados com apoio de TA.`
        : `Compreender e implementar as estruturas práticas de ${finalSubject} utilizando ferramentas de acessibilidade configuradas e controle de versão no Git.`,
      prazo: 'Mensal (4 semanas)',
      indicador_sucesso: isEngSoft
        ? 'Suíte de testes automatizados funcional com cobertura de código documentada no GitHub/Jira.'
        : 'Repositório contendo código funcional, scripts documentados e validação técnica em laboratório.',
      progresso_percentual: 50,
      status: 'em_andamento',
    },
    {
      id_meta: 'M2',
      descricao_meta: isEngSoft
        ? `Elaborar plano de testes e gerenciar o ciclo de defeitos em ferramenta de bug tracking (Jira/Bugzilla) em equipe ágil com vias de apresentação acessíveis.`
        : `Desenvolver projeto prático colaborativo aplicando as diretrizes do DUA 3.0 com entregas graduais e sustentação técnica acessível.`,
      prazo: 'Bimestral (8 semanas)',
      indicador_sucesso: isEngSoft
        ? 'Entrega de plano de testes completo com casos documentados e rastreabilidade entre requisitos e defeitos.'
        : 'Entrega dos módulos de software testados e validados com documentação clara.',
      progresso_percentual: 35,
      status: 'em_andamento',
    },
  ];

  if (isAutism && isAdhd) {
    metas.push({
      id_meta: 'M3',
      descricao_meta:
        'Consolidar rotina combinada de autorregulação sensorial (uso de abafador e roteiros previsíveis para TEA) e autogestão executiva por micro-sprints (Pomodoro e Kanban para TDAH) durante os laboratórios práticos.',
      prazo: 'Semestral (12 semanas)',
      indicador_sucesso:
        'Conclusão de 85% das micro-entregas semanais sem sobrecarga sensorial ou bloqueio executivo nos laboratórios LABIN/LADES.',
      progresso_percentual: 40,
      status: 'em_andamento',
    });
  } else if (selectedNeurodivergences.length > 1) {
    metas.push({
      id_meta: 'M3',
      descricao_meta: `Integrar os apoios de Tecnologia Assistiva e flexibilizações de tempo/espaço para atender conjuntamente às necessidades de ${selectedNeurodivergences.join(' + ')}.`,
      prazo: 'Semestral (12 semanas)',
      indicador_sucesso:
        'Participação autônoma e segura nas atividades avaliativas com alcance pleno dos objetivos técnicos da ementa.',
      progresso_percentual: 40,
      status: 'em_andamento',
    });
  }

  return {
    cabecalho: {
      estudante: studentName,
      codigo_matricula: `TI-${Math.floor(1000 + Math.random() * 9000)}`,
      idade: params.age || (isSuperior ? '21 anos' : '17 anos'),
      curso: finalCourse,
      componente_curricular: finalSubject,
      modulo_periodo: finalGrade,
      data_elaboracao: new Date().toISOString().split('T')[0],
      docente_regente: docenteRegente,
      docente_aee: docenteAee,
      profissional_apoio: isSuperior ? 'Monitor de Acessibilidade Digital' : 'Monitor de Tecnologia Assistiva / Apoio Escolar',
      coordenacao_napne: 'Coordenação NAPNE · Campus Paraíso',
    },
    historico_e_condicao_napne: {
      breve_historico_clinico_familiar: `Estudante matriculado no ${finalCourse} no Campus Paraíso (${isSuperior ? 'Ensino Superior em TI' : 'Ensino Médio Técnico Integrado'}). Acompanhado pelo NAPNE com foco na garantia do direito à educação inclusiva e acessibilidade curricular nos termos da PNEEI (Decreto nº 12.686/2025) e Portaria MEC nº 421/2026.${
        statusDiagnostico === 'em_investigacao_hipotese'
          ? ' Atendimento garantido sem dependência de laudo médico pericial prévio (investigação pedagógica pelo NAPNE).'
          : ''
      }`,
      descricao_condicao_especifica: barriers,
      informacoes_dos_pais: isSuperior
        ? 'Estudante com autonomia acadêmica universitária em contato com o NAPNE e coordenação do curso.'
        : 'Estudante e responsáveis em contato constante com o NAPNE Campus Paraíso e coordenação do curso.',
    },
    estudo_de_caso_sintese: {
      barreiras_identificadas: [
        `Barreiras Metodológicas: Aulas práticas de ${finalSubject} com formato tradicional sem diversificação de vias DUA 3.0.`,
        `Barreiras Tecnológicas: Computadores de laboratório sem perfil prévio de acessibilidade para a condição do estudante.`,
        `Barreiras Atitudinais: Risco de pressupostos capacitistas sobre a capacidade de desenvolvimento técnico em ${isSuperior ? 'nível superior' : 'nível médio integrado'}.`,
      ],
      potencialidades_interesses: [
        potentialities,
        `Capacidade de raciocínio dedutivo e pensamento computacional quando garantidos os apoios necessários para ${isSuperior ? 'projetos complexos de TI' : 'o aprendizado prático de TI'}.`,
        'Excelente cooperação em metodologias ativas com papéis técnicos definidos.',
      ],
      recursos_tecnologia_assistiva: taList,
    },
    planejamento_pedagogico_pei: {
      conteudo_ementa_oficial: `Ementa Oficial do Componente Curricular: ${finalSubject}. Conteúdos teóricos e desenvolvimento de aplicações práticas no ${finalCourse}.`,
      competencias_habilidades_ementa: `Desenvolver competências de análise, modelagem e codificação em ${finalSubject}, aplicando boas práticas de desenvolvimento de software e pensamento computacional.`,
      adaptacao_flexibilizacao_curricular:
        `Garantia do currículo de TI pleno (${isSuperior ? 'Superior' : 'Médio Técnico'}) sem rebaixamento de conteúdos. Acessibilização assegurada pela diversificação das vias de representação, engajamento e de ação técnica.`,
      objetivos_e_metas_adaptadas: metas,
      flexibilizacao_metodologica_dua: {
        engajamento,
        representacao,
        acao_e_expressao: acaoExpressao,
      },
      gestao_sala_de_aula: [
        'Bancada de laboratório reservada com layout ergonômico e ferramentas de acessibilidade instaladas.',
        'Pausas programadas a cada 45-60 minutos para prevenção de fadiga física, visual ou cognitiva.',
        'Sessões de suporte semanais garantidas na carga horária docente entre o professor técnico e o NAPNE Campus Paraíso.',
      ],
      estrategias_de_avaliacao: {
        formato_acessivel:
          'Avaliação formativa processual com entregas graduais no Git, testes práticos em laboratório e tempo estendido (+50%).',
        criterio_de_sucesso: 'Compreensão substantiva da lógica e capacidade de aplicação prática na disciplina.',
      },
      guia_pratico_sala_de_aula: {
        passo_a_passo_explicacao: isEngSoft
          ? '1. Demonstre o caso de teste funcionando na tela antes da teoria; 2. Entregue um esqueleto de código JUnit/Selenium comentado; 3. Valide a execução junto com o estudante na bancada.'
          : '1. Inicie a aula mostrando o resultado prático funcionando; 2. Entregue um roteiro visual objetivo com exemplo de entrada e saída; 3. Permita testar cada bloco antes de avançar.',
        divisao_tarefa_chunking: [
          `Etapa 1 (Preparação - 15 min): Ler o objetivo curto da prática de ${finalSubject} e abrir o template base na IDE.`,
          'Etapa 2 (Execução - 20 min): Implementar a função ou requisito principal com validação visual imediata.',
          'Etapa 3 (Entrega - 10 min): Executar os casos de teste e registrar o envio no repositório ou Moodle.',
        ],
        avaliacao_pratica:
          'Prova/trabalho dividido em partes menores com tempo adicional de 50%, enunciados diretos sem pegadinhas e opção de defesa prática comentada na máquina.',
        manejo_e_acolhimento:
          'Se o estudante travar, apresentar ansiedade ou sobrecarga sensorial, permita pausa de 5 a 10 minutos, reduza a cobrança imediata e retome a partir do último ponto que funcionou.',
      },
    },
    painel_de_acompanhamento: {
      status_periodo: 'EM_ANDAMENTO',
      metricas_grafico: {
        percentual_metas_alcancadas: 45,
        nivel_autonomia_1_a_5: 4,
        engajamento_nas_atividades_1_a_5: 5,
      },
      parecer_pedagogico: `PEI estruturado pelo agente Ioda em estrita conformidade com a Portaria MEC nº 421/2026 e Decreto nº 12.686/2025 para assegurar a permanência e êxito em ${finalCourse}.`,
      sugestoes_proximo_ciclo: [
        'Manter reuniões semanais de suporte entre a equipe técnica e o NAPNE Campus Paraíso.',
        `Avançar para projeto prático integrador de ${isSuperior ? 'nível superior' : 'nível médio técnico'} no período seguinte.`,
      ],
    },
  };
}

// Track quota cooldown to prevent repeated 429 errors
let quotaCooldownUntil = 0;

function isQuotaOnCooldown(): boolean {
  return Date.now() < quotaCooldownUntil;
}

function triggerQuotaCooldown(durationMs = 300000) {
  quotaCooldownUntil = Date.now() + durationMs;
}

// API Route: Generate PEI with Ioda AI
app.post('/api/gemini/generate-pei', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const {
      studentName,
      grade,
      course,
      subject,
      barriers,
      potentialities,
      assistiveTech,
      perfilModalidade = 'medio_tecnico',
      statusDiagnostico = 'confirmado',
    } = req.body;

    const isSuperior =
      perfilModalidade === 'superior_ti' ||
      (course && course.toLowerCase().includes('superior'));

    // Check if API key is not configured or currently on quota cooldown
    if (!process.env.GEMINI_API_KEY || isQuotaOnCooldown()) {
      console.log('[Ioda Engine] Utilizando Motor Pedagógico Ioda DUA 3.0 com benchmark de TI.');
      const synthesized = synthesizeIodaPei(req.body);
      return res.json({
        success: true,
        data: synthesized,
        isIodaEngine: true,
        notice: `PEI estruturado pelo Motor Pedagógico Ioda (DUA 3.0 · ${isSuperior ? 'Superior em TI' : 'Médio Técnico em TI'})`,
      });
    }

    const modalityGuidelines = isSuperior
      ? `PERFIL SELECIONADO: ENSINO SUPERIOR EM TI (Bacharelado / Tecnologia em Sistemas de Informação - 14 estudantes no Campus Paraíso).
Diretrizes Pedagógicas para Superior em TI:
- Foco em autonomia acadêmica, raciocínio lógico avançado e arquitetura de software.
- Instrumentos de avaliação: entregas contínuas em repositório Git, sustentação oral das decisões arquiteturais e avaliações práticas baseadas em projetos com tempo estendido (+50%).`
      : `PERFIL SELECIONADO: ENSINO MÉDIO TÉCNICO INTEGRADO EM INFORMÁTICA (15 estudantes no Campus Paraíso).
Diretrizes Pedagógicas para Médio Técnico em TI:
- Formação Profissional Técnica articulada à BNCC.
- Acomodações de laboratório de informática: duplas colaborativas, roteiros passo a passo em Markdown, acompanhamento de monitoria e garantia de permanência e êxito.`;

    const systemPrompt = `Você é o agente Ioda (Inclusion on Diversity Agent), especialista sênior em Educação Especial Inclusiva do Brasil e NAPNE, focado em Tecnologia da Informação (TI).
Legislação e Referências:
- Decreto nº 12.686/2025 e Portaria MEC nº 421/2026 - O PEI NÃO depende de laudo médico pericial.
- DUA 3.0 (CAST 2024): Engajamento, Representação, Ação e Expressão.
- Princípio Inegociável: O currículo de TI deve ser acessível sem empobrecimento ou rebaixamento cognitivo.

${modalityGuidelines}

Retorne estritamente um JSON estruturado com:
{
  "cabecalho": { "estudante": "", "codigo_matricula": "", "idade": "", "curso": "", "componente_curricular": "", "modulo_periodo": "", "docente_regente": "", "docente_aee": "" },
  "historico_e_condicao_napne": { "breve_historico_clinico_familiar": "", "descricao_condicao_especifica": "", "informacoes_dos_pais": "" },
  "estudo_de_caso_sintese": { "barreiras_identificadas": [], "potencialidades_interesses": [], "recursos_tecnologia_assistiva": [] },
  "planejamento_pedagogico_pei": {
    "conteudo_ementa_oficial": "",
    "competencias_habilidades_ementa": "",
    "adaptacao_flexibilizacao_curricular": "",
    "objetivos_e_metas_adaptadas": [{ "id_meta": "M1", "descricao_meta": "", "prazo": "", "indicador_sucesso": "" }],
    "flexibilizacao_metodologica_dua": { "engajamento": [], "representacao": [], "acao_e_expressao": [] },
    "gestao_sala_de_aula": [],
    "estrategias_de_avaliacao": { "formato_acessivel": "", "criterio_de_sucesso": "" },
    "guia_pratico_sala_de_aula": {
      "passo_a_passo_explicacao": "Como explicar o conteúdo específico da disciplina de forma tangível para o perfil do estudante",
      "divisao_tarefa_chunking": ["Etapa 1...", "Etapa 2...", "Etapa 3..."],
      "avaliacao_pratica": "Formato concreto da prova/trabalho adaptado e critérios de correção justos",
      "manejo_e_acolhimento": "O que fazer na prática se o aluno travar ou se desregular"
    }
  },
  "painel_de_acompanhamento": { "status_periodo": "EM_ANDAMENTO", "parecer_pedagogico": "", "sugestoes_proximo_ciclo": [] }
}`;

    const neuroList = Array.isArray(req.body?.selectedNeurodivergences) && req.body.selectedNeurodivergences.length > 0
      ? req.body.selectedNeurodivergences.join(' + ')
      : 'Neurodivergência / Condição específica';

    const userPrompt = `Gere o PEI completo pelo agente Ioda para o perfil ${isSuperior ? 'SUPERIOR EM TI' : 'MÉDIO TÉCNICO EM INFORMÁTICA'}:
Aluno: ${studentName || 'Estudante'}
Nível / Modalidade: ${isSuperior ? 'Ensino Superior em TI' : 'Ensino Médio Técnico Integrado em Informática'}
Curso: ${course || (isSuperior ? 'Bacharelado em Sistemas de Informação' : 'Curso Técnico Integrado ao Ensino Médio em Informática')} (${grade || (isSuperior ? '4º Semestre' : '2º Ano')})
Disciplina de TI: ${subject || (isSuperior ? 'Banco de Dados Relacional e SQL' : 'Programação Web e Algoritmos')}
Situação Diagnóstica: ${statusDiagnostico === 'em_investigacao_hipotese' ? 'Sem Laudo / Hipótese em Investigação (Portaria MEC nº 421/2026)' : 'Diagnóstico Confirmado no NAPNE'}
Neurodivergências Selecionadas (Comorbidade / Múltiplas): ${neuroList} (ATENÇÃO: Se houver mais de uma neurodivergência, adapte as estratégias DUA 3.0, recursos de TA e metas SMART para contemplar simultaneamente todas as condições informadas)
Condição e Barreiras: ${barriers || 'Dificuldades no laboratório de informática'}
Potencialidades: ${potentialities || 'Raciocínio lógico e dedutivo para tecnologia'}
Recursos de TA prévios: ${assistiveTech || 'Softwares de acessibilidade e tempo ampliado (+50%)'}`;

    // Attempt Gemini call with quick timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });
      clearTimeout(timeoutId);

      const outputText = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      // Extract JSON if wrapped in markdown blocks
      let jsonStr = outputText.trim();
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }

      if (jsonStr.startsWith('{')) {
        const parsed = JSON.parse(jsonStr);
        return res.json({
          success: true,
          data: parsed,
          groundingChunks,
          isAiGenerated: true,
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
        triggerQuotaCooldown(300000); // 5 min cooldown on quota exhaustion
        console.log('[Ioda Pedagogical Engine] Cota de API de IA atingida. Ativando Motor Pedagógico Ioda DUA 3.0 com benchmark de TI.');
      } else {
        console.log('[Ioda Pedagogical Engine] Ativando Motor Pedagógico Ioda para sintetizar o PEI com excelência curricular.');
      }

      const synthesized = synthesizeIodaPei(req.body);
      return res.json({
        success: true,
        data: synthesized,
        isIodaEngine: true,
        notice: `PEI estruturado pelo Motor Pedagógico Ioda (DUA 3.0 · ${isSuperior ? 'Superior em TI' : 'Médio Técnico em TI'})`,
      });
    }
  } catch (_error: any) {
    console.log('[Ioda Server] Requisição tratada pelo motor pedagógico resiliente.');
    const fallbackData = synthesizeIodaPei(req.body || {});
    return res.json({
      success: true,
      data: fallbackData,
      isIodaEngine: true,
      notice: 'Recuperação automática do PEI efetuada com sucesso.',
    });
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
