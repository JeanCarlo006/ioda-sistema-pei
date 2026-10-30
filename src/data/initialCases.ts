import { PEICompleto, SolucaoCondicao, EstatisticasCampusParaiso } from '../types/pei';

// ESTATÍSTICAS REAIS DO NAPNE · CAMPUS PARAÍSO (29 ESTUDANTES ACOMPANHADOS)
export const estatisticasCampusParaiso: EstatisticasCampusParaiso = {
  campus: 'NAPNE · Campus Paraíso',
  estudantes_geral: 29,
  estudantes_medio: 15,
  estudantes_superior: 14,
  com_diagnostico_confirmado: 24,
  sem_diagnostico_hipotese: 5,
  data_atualizacao: '2026-10-27',
};

// 1. CASO ENSINO MÉDIO TÉCNICO INTEGRADO EM INFORMÁTICA - CAMPUS PARAÍSO (DIAGNÓSTICO CONFIRMADO)
export const casoLucasTecnico: PEICompleto = {
  id: 'MED-INF-02',
  cabecalho: {
    estudante: 'Lucas Ferreira de Lima',
    codigo_matricula: '2025.1.INF.042',
    idade: '17 anos',
    curso: 'Curso Técnico Integrado ao Ensino Médio em Informática',
    componente_curricular: 'Programação Web e Algoritmos II',
    modulo_periodo: '2º Ano / 4º Bimestre',
    data_elaboracao: '2026-10-27',
    docente_regente: 'Prof. Carlos Eduardo Viana (Docente da Área Técnica de TI)',
    docente_aee: 'Profª. Renata Cavalcanti (Especialista em Educação Especial / NAPNE)',
    profissional_apoio: 'Monitor de Acessibilidade Digital e Laboratório',
    coordenacao_napne: 'Coordenação NAPNE · Campus Paraíso',
  },
  historico_napne: {
    status_diagnostico: 'confirmado',
    categoria_neurodivergencia: 'Deficiência Física & Coordenação Fina',
    cid_ou_hipotese: 'Condição com leve espasticidade em MMSS acompanhada pelo NAPNE',
    breve_historico_clinico_familiar:
      'Estudante do Curso Técnico Integrado em Informática no Campus Paraíso (integrante dos 15 estudantes acompanhados no Ensino Médio). Nos termos da PNEEI (Decreto nº 12.686/2025) e Portaria MEC nº 421/2026, o PEI possui finalidade estritamente pedagógica para acessibilizar o currículo técnico de computação sem rebaixamento de conteúdos.',
    descricao_condicao_especifica:
      'Limitação motora manual para digitação acelerada de sintaxe em teclados convencionais e fadiga visual com fontes monoespaçadas compactas sem realce de sintaxe adequado. Apresenta excelente habilidade de abstração lógica, raciocínio dedutivo, decomposição de problemas e afinidade por arquitetura de software.',
    informacoes_dos_pais:
      'Comunicação regular mantida entre família, equipe do NAPNE e coordenação do curso. Acompanhamento focado em assegurar tempo estendido em avaliações de laboratório e trabalho colaborativo inclusivo.',
  },
  estudo_de_caso: {
    barreiras: [
      {
        id: 'B1',
        categoria: 'metodologica',
        descricao: 'Avaliações práticas de programação com exigência de digitação manual sob pressão temporal restrita (ex: implementar 3 algoritmos em 50 minutos).',
        impacto: 'A fadiga muscular nas mãos impede a finalização do código, gerando notas que não refletem sua real capacidade lógica.',
        estrategia_enfrentamento: 'DUA 3.0: Tempo ampliado (+50%), entrega de projetos em etapas com versionamento no Git (avaliação processual contínua) e opção de defesa oral da lógica.',
      },
      {
        id: 'B2',
        categoria: 'tecnologica',
        descricao: 'Computadores do laboratório de informática com configurações padrão sem fontes acessíveis, extensões de autocompletar ou teclado de toque suave.',
        impacto: 'Dificulta a leitura rápida de mensagens de erro do terminal e compilação.',
        estrategia_enfrentamento: 'Instalação de perfil acessível no VS Code (tema de alto contraste, fonte OpenDyslexic Mono, leitor de linter configurado e atalhos de snippets).',
      },
      {
        id: 'B3',
        categoria: 'comunicacional',
        descricao: 'Enunciados de problemas algorítmicos em textos prolixos e blocos contínuos sem diagramação visual ou exemplos de entrada/saída destacados.',
        impacto: 'A dislexia visual gera sobrecarga cognitiva na interpretação do enunciado antes mesmo de iniciar o algoritmo.',
        estrategia_enfrentamento: 'Roteiros de laboratório com DUA: enunciados em tópicos, diagramas de fluxo de dados, casos de teste claros (Input/Output) e palavras-chave grifadas.',
      },
      {
        id: 'B4',
        categoria: 'atitudinal',
        descricao: 'Colegas de turma que, em trabalhos em grupo, relegavam Lucas a funções secundárias (ex: apenas fazer slides) por pressuporem que ele não programava rápido.',
        impacto: 'Isolamento e frustração quanto ao seu desenvolvimento profissional técnico.',
        estrategia_enfrentamento: 'Implementação da metodologia de Pair Programming (Programação em Pares) orientada pelo professor, com divisão alternada entre Piloto (digitação) e Copiloto (arquitetura e lógica).',
      },
    ],
    potencialidades: [
      {
        id: 'P1',
        area: 'Raciocínio Algorítmico & Lógica',
        descricao: 'Capacidade analítica notável para decompor problemas complexos em funções e fluxogramas modulares.',
        apoio_demandado: 'Estimular seu protagonismo como arquiteto da solução lógica nos projetos de desenvolvimento web.',
      },
      {
        id: 'P2',
        area: 'Domínio de Tecnologias Web Modernas',
        descricao: 'Curiosidade autodidata; já domina conceitos de HTML semântico, estilização com Tailwind CSS e consumo de APIs REST.',
        apoio_demandado: 'Aproveitar seu conhecimento prático para propor projetos reais de acessibilidade digital para a instituição.',
      },
      {
        id: 'P3',
        area: 'Colaboração & Comunicação',
        descricao: 'Excelente comunicação interpessoal quando em ambientes acolhedores e receptivos; ótimo para explicar conceitos aos colegas.',
        apoio_demandado: 'Tutoria por pares estruturada no laboratório de programação.',
      },
    ],
    recursos_ta: [
      'Teclado ergonômico mecânico com switches de ativação leve e apoio de punho articulado',
      'Extensões do editor VS Code (GitHub Copilot para autocompletar código repetitivo, Error Lens e tema Dracula High Contrast)',
      'Fonte tipográfica especializada para programação inclusiva (OpenDyslexic Mono / JetBrains Mono com ligaduras)',
      'Suporte para notebook com regulagem de altura e mouse vertical ergonômico',
      'Roteiros de prática de laboratório em formato Markdown com casos de teste em tabelas limpas',
    ],
    sintese_observacao: {
      interacao_professores: 'Participativo durante aulas teóricas e discussões de lógica; questiona com profundidade a complexidade dos algoritmos.',
      interacao_colegas: 'Muito respeitado após a adoção da programação em pares; colegas valorizam suas sugestões arquiteturais.',
      tarefas_coletivas: 'Rendimento excelente em projetos modulares divididos pelo Git/GitHub.',
      interesses_centrais: 'Desenvolvimento Web Fullstack, acessibilidade digital WCAG, inteligência artificial aplicada.',
      habilidades_tecnicas: 'Domínio de JavaScript assíncrono, algoritmos de ordenação e busca, estilização moderna e consumo de APIs.',
      autonomia_rotina: 'Totalmente autônomo na locomoção e rotina no campus; demanda apenas ergonomia física na bancada de trabalho.',
    },
  },
  planejamento_pei: {
    conteudo_ementa_oficial:
      'Programação Web II: Estruturas de dados em memória (Vetores e Matrizes), Manipulação do DOM (Document Object Model), Funções Assíncronas (Promises/Async-Await) e Consumo de APIs REST com validação de dados.',
    competencias_habilidades_ementa:
      'Desenvolver algoritmos modulares em linguagem web (JavaScript/TypeScript); manipular dados em estruturas de repetição; consumir e tratar retornos assíncronos de serviços web; aplicar boas práticas de usabilidade e acessibilidade (WCAG).',
    adaptacao_flexibilizacao_curricular:
      'Garantia do currículo técnico pleno da habilitação profissional. Eliminação da barreira de velocidade manual através do uso de ferramentas de automação de código, divisão de projetos em sprints e foco na correção da lógica algorítmica.',
    objetivos_e_metas: [
      {
        id_meta: 'M1',
        descricao_meta: 'Implementar algoritmos de manipulação de vetores e objetos (filtro, busca e ordenação) para exibição dinâmica no DOM.',
        prazo: 'Mensal (4 semanas - até 28/11/2026)',
        indicador_sucesso: 'Entrega de repositório no GitHub contendo código funcional com testes unitários passando e documentação em Markdown.',
        progresso_percentual: 85,
        status: 'em_andamento',
      },
      {
        id_meta: 'M2',
        descricao_meta: 'Construir uma aplicação web interativa que consuma dados assíncronos de uma API REST pública com tratamento de erros.',
        prazo: 'Bimestral (8 semanas - até 20/12/2026)',
        indicador_sucesso: 'Apresentação prática da aplicação rodando localmente com explicação oral do fluxo das Promises e manipulação de estados.',
        progresso_percentual: 60,
        status: 'em_andamento',
      },
      {
        id_meta: 'M3',
        descricao_meta: 'Atuar efetivamente na metodologia de Pair Programming exercendo o papel de arquiteto de lógica e copiloto.',
        prazo: 'Bimestral contínuo',
        indicador_sucesso: 'Validação pelo professor e colega de dupla da contribuição técnica na modelagem do projeto em equipe.',
        progresso_percentual: 90,
        status: 'alcancada',
      },
    ],
    flexibilizacao_metodologica_dua: {
      engajamento: [
        'Proposta de tema desafiador: criar um portal de consulta de acessibilidade do próprio campus escolar com dados reais da comunidade.',
        'Metodologia ágil adaptada com reuniões rápidas (daily standups) para organização de tarefas sem acúmulo de sobrecarga no final.',
        'Reconhecimento das habilidades analíticas do estudante como referência para o grupo na modelagem de soluções.',
      ],
      representacao: [
        'Apresentação dos conceitos com diagramas visuais (fluxogramas no Mermaid/Miro) antes do código fonte puro.',
        'Exemplos de código comentados com destaque sintático semântico e disponibilização antecipada em repositório modelo no GitHub.',
        'Roteiros de laboratório com vídeos tutoriais curtos (2 a 4 minutos) gravados pelo professor demonstrando o passo a passo da depuração.',
      ],
      acao_e_expressao: [
        'Permissão para uso de geradores de snippets de código e autocompletar inteligente para mitigar a fadiga motora.',
        'Avaliações práticas com tempo estendido e liberdade de escolha entre entrega de código comentado ou defesa oral com gravação de tela.',
        'Versionamento contínuo no Git para valorizar o processo evolutivo da construção do software e não apenas o resultado estático.',
      ],
    },
    gestao_sala_de_aula: {
      organizacao_espacial:
        'Bancada ergonômica de laboratório reservada com espaço amplo para apoio de braços e cadeira de rodas, próxima a telas de visualização e sem obstrução por cabos.',
      rotina_e_pausas:
        'Aulas práticas de laboratório com pausas de alongamento de 5 minutos a cada 45 minutos para relaxamento da musculatura de punho e dedos.',
      agrupamentos_e_tutoria:
        'Programação em pares (Pair Programming) planejada com rodízio orientado pelo professor, garantindo que Lucas exerça protagonismo na tomada de decisão do código.',
      suporte_docente_semanal:
        'Sessões de suporte semanais às segundas-feiras entre o docente técnico de informática, mediador do NAPNE e monitor para alinhar os laboratórios da semana.',
    },
    estrategias_avaliacao: {
      formato_acessivel:
        'Avaliação formativa baseada em portfólio digital no GitHub (commits progressivos), resolução de desafios práticos em pares e tempo estendido em provas práticas.',
      criterio_de_sucesso:
        'Compreensão da lógica computacional, estruturação correta do algoritmo e funcionamento esperado do sistema, sem penalização por velocidade de digitação.',
      grau_mediacao: 'pouca_mediacao',
      tempo_e_espaco:
        'Tempo estendido (+50%) em ambiente de laboratório com IDE e perfil acessível configurados previamente.',
      recursos_utilizados: [
        'IDE VS Code com tema acessível e fonte OpenDyslexic',
        'Teclado ergonômico de toque suave',
        'Repositório no GitHub para entrega contínua',
        'Linter e testes automatizados para feedback imediato',
      ],
    },
    observacoes_docente:
      'Lucas teve uma evolução extraordinária. Ao retirar a barreira da digitação apressada através do tempo estendido e do pair programming, ele demonstrou ser um dos estudantes mais capacitados na arquitetura da lógica do sistema da turma. O projeto web desenvolvido por sua dupla alcançou nível técnico de excelência.',
  },
  painel_notas: [
    {
      id: 'NL1',
      autor: 'Prof. Carlos Eduardo (Docente TI)',
      papel: 'Regente',
      categoria: 'objetivos',
      conteudo: 'Lucas arquitetou a função de ordenação assíncrona hoje com extrema elegância no laboratório. A lógica dele estava impecável.',
      data: '26/10/2026',
      cor: 'green',
    },
    {
      id: 'NL2',
      autor: 'Thiago (Monitor de Lab)',
      papel: 'Apoio',
      categoria: 'recursos_ta',
      conteudo: 'Configuramos a extensão Error Lens e a fonte OpenDyslexic Mono no terminal da máquina 12. Lucas relatou que a leitura dos erros ficou muito mais rápida.',
      data: '24/10/2026',
      cor: 'blue',
    },
    {
      id: 'NL3',
      autor: 'Profª. Renata (NAPNE)',
      papel: 'AEE',
      categoria: 'apoio',
      conteudo: 'Sessão semanal de alinhamento com Carlos foi muito produtiva. Próximo laboratório terá enunciado diagramado com casos de teste em tabelas.',
      data: '21/10/2026',
      cor: 'yellow',
    },
    {
      id: 'NL4',
      autor: 'Lucas (Estudante)',
      papel: 'Estudante',
      categoria: 'rotina',
      conteudo: 'O trabalho com minha dupla no Pair Programming funcionou demais! Eu pensava na estrutura e o colega me ajudava na digitação mais rápida.',
      data: '20/10/2026',
      cor: 'orange',
    },
  ],
  metricas: {
    percentual_metas_alcancadas: 78,
    nivel_autonomia: 5,
    engajamento: 5,
    sessoes_semanais_realizadas: 10,
    status_geral: 'EM_ANDAMENTO',
  },
  parecer_pedagogico:
    'O PEI de Lucas Ferreira de Lima comprova que na Educação Profissional e Tecnológica (EPT), a eliminação de barreiras metodológicas e tecnológicas viabiliza o alcance integral das competências do perfil profissional de conclusão técnico em Informática, em estrito acordo com a Portaria MEC nº 421/2026 e o Decreto nº 12.686/2025.',
  sugestoes_proximo_ciclo: [
    'Inserir Lucas como monitor voluntário de lógica de programação no semestre seguinte.',
    'Apresentar o portal web desenvolvido por ele na Semana Nacional de Ciência e Tecnologia (SNCT).',
    'Manter o perfil acessível salvo na nuvem da instituição para uso em outras disciplinas da área técnica.',
  ],
};

// 2. CASO ENSINO SUPERIOR EM TECNOLOGIA DA INFORMAÇÃO
export const casoBeatrizSuperior: PEICompleto = {
  id: 'SUP-BSI-04',
  cabecalho: {
    estudante: 'Beatriz Santos Rocha',
    codigo_matricula: '2024.2.BSI.108',
    idade: '21 anos',
    curso: 'Bacharelado em Sistemas de Informação (TI)',
    componente_curricular: 'Banco de Dados Relacional e Engenharia de Dados',
    modulo_periodo: '4º Semestre / Noturno',
    data_elaboracao: '2026-10-27',
    docente_regente: 'Prof. Dr. Marcelo Albuquerque (Docente do Departamento de Computação)',
    docente_aee: 'Profª. Dra. Cláudia Fagundes (Especialista em Acessibilidade Universitária / NAPNE)',
    profissional_apoio: 'Monitor de Tecnologia Assistiva e Apoio Acadêmico',
    coordenacao_napne: 'Coordenação NAPNE · Campus Paraíso',
  },
  historico_napne: {
    status_diagnostico: 'confirmado',
    categoria_neurodivergencia: 'Deficiência Visual (Baixa Visão Severa)',
    cid_ou_hipotese: 'Condição visual acompanhada com uso de Tecnologia Assistiva',
    breve_historico_clinico_familiar:
      'Estudante universitário de graduação em Sistemas de Informação no Campus Paraíso (integrante dos 14 estudantes acompanhados no Ensino Superior). Utiliza leitor de tela NVDA associado a ampliação de 300% com alto contraste invertido em monitores de 27 polegadas. Plenamente capacitado em tecnologias computacionais e linha de comando.',
    descricao_condicao_especifica:
      'Incapacidade de visualizar diagramas gráficos de Modelo Entidade-Relacionamento (MER) apresentados em imagens rasterizadas (.png/.jpg) ou ferramentas visuais que carecem de suporte a leitores de tela. Em contrapartida, possui raciocínio abstrato de alto nível, excelente compreensão de álgebra relacional e sintaxe SQL.',
    informacoes_dos_pais:
      'Estudante com autonomia acadêmica universitária em contato regular com o NAPNE e coordenação do curso para garantia de acessibilidade nos sistemas e laboratórios.',
  },
  estudo_de_caso: {
    barreiras: [
      {
        id: 'B1',
        categoria: 'metodologica',
        descricao: 'Aulas teóricas e materiais de estudo baseados em slides com diagramas conceituais gráficos de banco de dados sem descrição textual alternativa das tabelas e cardinalidades.',
        impacto: 'O leitor de tela lê apenas o nome do arquivo de imagem, limitando o acesso autônomo à estrutura das entidades.',
        estrategia_enfrentamento: 'DUA 3.0: Disponibilização concomitante de representação textual estruturada (formato DBML / Markdown descritivo / YAML) das entidades e relacionamentos.',
      },
      {
        id: 'B2',
        categoria: 'tecnologica',
        descricao: 'Ferramentas de modelagem gráfica obrigatórias que não possuem acessibilidade por teclado ou atalhos para leitores de tela.',
        impacto: 'Impossibilita a realização de tarefas práticas nas ferramentas recomendadas pelo plano de curso tradicional.',
        estrategia_enfrentamento: 'Aceite de ferramentas de modelagem textual (Code-First / DBML / scripts SQL DDL comentados) como equivalentes funcionais plenos.',
      },
      {
        id: 'B3',
        categoria: 'metodologica',
        descricao: 'Provas escritas tradicionais em folhas de papel impressas com diagramas compactos para resolução de queries complexas à mão.',
        impacto: 'Totalmente inacessível para a condição de baixa visão severa.',
        estrategia_enfrentamento: 'Avaliação prática digital realizada no laboratório com acesso a terminal SQL (PostgreSQL/SQLite) em ambiente de alto contraste e tempo estendido (+50%).',
      },
      {
        id: 'B4',
        categoria: 'atitudinal',
        descricao: 'Concepção errônea de que a área de banco de dados e computação exige necessariamente a visão gráfica tradicional para modelagem conceitual.',
        impacto: 'Dúvidas infundadas sobre a aptidão do estudante para o mercado de TI em engenharia de dados.',
        estrategia_enfrentamento: 'Esclarecimento pedagógico pelo NAPNE de que os maiores bancos de dados mundiais são operados em ambientes CLI e scripts textuais, nos quais o estudante se destaca.',
      },
    ],
    potencialidades: [
      {
        id: 'P1',
        area: 'Pensamento Lógico-Estrutural & Álgebra Relacional',
        descricao: 'Raciocínio lógico dedutivo apurado; compreende uniões, junções (INNER/OUTER JOINS), subqueries correlacionadas e normalização (1FN até BCNF) com rapidez.',
        apoio_demandado: 'Orientar seu potencial para desenvolvimento de procedimentos armazenados (Stored Procedures), funções e otimização de índices.',
      },
      {
        id: 'P2',
        area: 'Domínio de Ambientes de Linha de Comando (CLI)',
        descricao: 'Navegação fluida e ágil em terminais Linux/Windows com leitor de tela e scripts Bash/Python.',
        apoio_demandado: 'Permitir que todas as interações com o SGDB sejam feitas via CLI ou drivers programáticos.',
      },
      {
        id: 'P3',
        area: 'Autonomia e Defesa de Direitos',
        descricao: 'Proativa, comunica com clareza suas demandas ao corpo docente e sugere soluções tecnológicas viáveis.',
        apoio_demandado: 'Canal de comunicação semanal contínuo com o docente e monitor da matéria.',
      },
    ],
    recursos_ta: [
      'Leitor de telas de código aberto NVDA e leitor Orca em distribuição Linux Ubuntu',
      'Monitor de 27 polegadas com braço pantográfico regulável e taxa de contraste 3000:1',
      'Terminal com fonte monoespaçada tamanho 22pt e esquema de cores preto puro e verde esmeralda',
      'Formatador de texto estruturado DBML (Database Markup Language) para representação de esquemas relacionais',
      'Apoio de monitoria acadêmica para audiodescrição de esquemas em sala e conversão de materiais em LaTeX/Markdown',
    ],
    sintese_observacao: {
      interacao_professores: 'Excelente relacionamento acadêmico; debates conceituais de alto nível com o docente.',
      interacao_colegas: 'Integra grupo de estudos de engenharia de software; muito requisitada pelos colegas para revisar consultas SQL complexas.',
      tarefas_coletivas: 'Atua na equipe como arquiteta de banco de dados e redatora dos scripts de migração de dados.',
      interesses_centrais: 'Engenharia de Dados, Bancos de Dados Distribuídos, Acessibilidade Web e Computação em Nuvem.',
      habilidades_tecnicas: 'Normalização relacional rigorosa, SQL analítico, sintaxe DDL/DML e automação em Python.',
      autonomia_rotina: 'Autonomia completa no campus; utiliza bengala guia para locomoção externa.',
    },
  },
  planejamento_pei: {
    conteudo_ementa_oficial:
      'Banco de Dados Relacional: Conceitos de SGBD, Modelo Relacional, Teoria da Normalização (1FN, 2FN, 3FN), Linguagem SQL completa (DDL: CREATE/ALTER/DROP; DML: INSERT/UPDATE/DELETE; DQL: SELECT, JOINs, GROUP BY, HAVING, subqueries, WINDOW functions), Transações ACID e Índices.',
    competencias_habilidades_ementa:
      'Modelar, projetar, implementar e gerenciar bancos de dados relacionais; escrever consultas otimizadas para recuperação de informações complexas; garantir integridade, consistência e segurança dos dados.',
    adaptacao_flexibilizacao_curricular:
      'Plena conservação dos conteúdos de nível superior em computação. Adequação da via de representação: em vez de desenhos manuais de diagramas visuais, o esquema relacional é especificado através de linguagens declarativas (DDL e DBML), garantindo total equivalência técnica.',
    objetivos_e_metas: [
      {
        id_meta: 'M1',
        descricao_meta: 'Modelar esquemas conceituais e lógicos de banco de dados aplicando normalização até 3FN utilizando linguagem declarativa acessível (DBML/SQL).',
        prazo: 'Mensal (4 semanas - até 25/11/2026)',
        indicador_sucesso: 'Entrega do esquema normalizado de um sistema corporativo com script DDL funcional executável em PostgreSQL.',
        progresso_percentual: 80,
        status: 'em_andamento',
      },
      {
        id_meta: 'M2',
        descricao_meta: 'Elaborar consultas analíticas avançadas em SQL contendo múltiplos JOINs, agregações e subqueries correlacionadas.',
        prazo: 'Bimestral (8 semanas - até 22/12/2026)',
        indicador_sucesso: 'Resolução autônoma de lista de 20 problemas de extração de dados com taxa de acerto superior a 85% no terminal de testes.',
        progresso_percentual: 70,
        status: 'em_andamento',
      },
      {
        id_meta: 'M3',
        descricao_meta: 'Apresentar seminário técnico sobre otimização de consultas e planos de execução (EXPLAIN ANALYZE) para a turma.',
        prazo: 'Final do período',
        indicador_sucesso: 'Apresentação oral com demonstração em tempo real no terminal.',
        progresso_percentual: 40,
        status: 'em_andamento',
      },
    ],
    flexibilizacao_metodologica_dua: {
      engajamento: [
        'Problematização com cenários do mundo real: bancos de dados de serviços de saúde pública e sistemas de bilhetagem de transporte urbano.',
        'Participação ativa em grupos de engenharia de software onde Beatriz lidera a modelagem relacional dos dados.',
        'Autonomia para escolha das ferramentas de terminal que ofereçam o melhor fluxo de produtividade pessoal.',
      ],
      representacao: [
        'Disponibilização antecipada (mínimo de 48 horas) de todos os materiais em texto digital estruturado (.md, .sql, .pdf acessível com tags).',
        'Substituição de diagramas visuais inacessíveis por tabelas textuais com cabeçalhos descritivos e notação cardinal descritiva (ex: "CLIENTE (1,1) faz PEDIDO (0,N)").',
        'Audiodescrição das projeções feitas pelo docente no quadro durante as aulas expositivas.',
      ],
      acao_e_expressao: [
        'Realização de todas as atividades e exames práticos em formato digital, com editor de texto acessível e cliente de banco de dados CLI.',
        'Tempo estendido (+50%) em exames avaliativos, sem penalização por consultas a manuais de sintaxe padrão.',
        'Opção de sustentação oral das decisões de projeto de banco de dados para a banca de professores.',
      ],
    },
    gestao_sala_de_aula: {
      organizacao_espacial:
        'Lugar reservado na primeira fileira do laboratório de computação, próximo à tomada de rede e monitor de 27 polegadas de alto contraste configurado.',
      rotina_e_pausas:
        'Pausa de descanso visual a cada 60 minutos de trabalho contínuo em tela para evitar fadiga ocular.',
      agrupamentos_e_tutoria:
        'Trabalho em equipes de projeto integrador com bolsista de apoio técnico do NAPNE para suporte na conversão de documentação de terceiros.',
      suporte_docente_semanal:
        'Sessões de suporte semanais garantidas na carga horária docente (quintas-feiras às 14h) entre o Prof. Dr. Marcelo, Beatriz e a monitora do NAPNE.',
    },
    estrategias_avaliacao: {
      formato_acessivel:
        'Avaliação prática contínua baseada na entrega de scripts SQL comentados, plano de execução de queries e projeto prático de banco de dados com defesa oral.',
      criterio_de_sucesso:
        'Rigor conceitual na normalização, corretude das consultas SQL e aplicação adequada de índices e integridade referencial.',
      grau_mediacao: 'sem_mediacao',
      tempo_e_espaco:
        'Tempo estendido (+50%) no laboratório de acessibilidade ou laboratório da disciplina com leitor NVDA.',
      recursos_utilizados: [
        'Leitor de telas NVDA configurado com sintetizador de voz pt-BR',
        'Terminal de comando interativo PostgreSQL (psql)',
        'Monitor de alta resolução em contraste invertido',
        'Editor de texto VS Code com leitor de terminal integrado',
      ],
    },
    observacoes_docente:
      'A atuação da estudante Beatriz é inspiradora. Sua capacidade de compreender relações conceituais complexas e redigir consultas SQL otimizadas supera a média da turma. A adaptação da metodologia com descrições textuais das cardinalidades (DUA 3.0) beneficiou inclusive os demais estudantes que apresentavam dificuldades na compreensão dos diagramas visuais.',
  },
  painel_notas: [
    {
      id: 'NB1',
      autor: 'Prof. Dr. Marcelo (Docente BD)',
      papel: 'Regente',
      categoria: 'objetivos',
      conteudo: 'Beatriz entregou a lista de álgebra relacional em formato LaTeX acessível com nota máxima! As consultas com subqueries ficaram perfeitas.',
      data: '25/10/2026',
      cor: 'green',
    },
    {
      id: 'NB2',
      autor: 'Juliana (Monitora NAPNE)',
      papel: 'Apoio',
      categoria: 'recursos_ta',
      conteudo: 'Converti todos os slides do módulo de Normalização e 3FN para formato Markdown puro com tabelas textuais. Beatriz já está estudando com o NVDA.',
      data: '23/10/2026',
      cor: 'blue',
    },
  ],
  metricas: {
    percentual_metas_alcancadas: 82,
    nivel_autonomia: 5,
    engajamento: 5,
    sessoes_semanais_realizadas: 12,
    status_geral: 'EM_ANDAMENTO',
  },
  parecer_pedagogico:
    'No Ensino Superior, o PEI e as diretrizes da PNEEI (Portaria MEC 421/2026) asseguram a eliminação de barreiras epistemológicas e tecnológicas. A experiência de Beatriz Santos Rocha em Banco de Dados comprova a viabilidade e o rigor da inclusão acadêmica em cursos de Tecnologia da Informação.',
  sugestoes_proximo_ciclo: [
    'Submeter relato de experiência sobre modelagem de banco de dados acessível no Congresso Brasileiro de Informática na Educação (CBIE).',
    'Convidar Beatriz para integrar projeto de extensão universitária em desenvolvimento de software acessível.',
    'Garantir continuidade dos apoios no semestre seguinte para as disciplinas de Engenharia de Software e Redes.',
  ],
};

// 3. CASO ENSINO MÉDIO TÉCNICO INTEGRADO EM INFORMÁTICA - REDES E HARDWARE (TEA)
export const casoMatheusRedes: PEICompleto = {
  id: 'MED-INF-01',
  cabecalho: {
    estudante: 'Matheus Alencar da Silva',
    codigo_matricula: '2026.1.INF.019',
    idade: '16 anos',
    curso: 'Curso Técnico Integrado ao Ensino Médio em Informática',
    componente_curricular: 'Fundamentos de Redes de Computadores e Hardware',
    modulo_periodo: '1º Ano / 3º Bimestre',
    data_elaboracao: '2026-10-27',
    docente_regente: 'Prof. Gilberto Mendes (Docente de Redes e Telecomunicações)',
    docente_aee: 'Profª. Simone Fontes (Professora do AEE / NAPNE)',
    profissional_apoio: 'Monitor de Laboratório de Redes e Acessibilidade',
    coordenacao_napne: 'Coordenação NAPNE · Campus Paraíso',
  },
  historico_napne: {
    breve_historico_clinico_familiar:
      'Estudante com perfil de Transtorno do Espectro Autista acompanhado pelo NAPNE Campus Paraíso. Apresenta hipersensibilidade auditiva no laboratório de redes e perfil de comunicação literal e metódica. Excelente capacidade de memorização sistemática de padrões e grande interesse por protocolos de comunicação e sub-redes.',
    descricao_condicao_especifica:
      'Pode apresentar sobrecarga sensorial em aulas práticas com ruído intenso simultâneo e comandos vagos ou polissêmicos. Demanda antecipação visual das etapas da aula prática de laboratório e uso permitido de abafadores de ruído circum-aurais.',
    informacoes_dos_pais:
      'Comunicação regular mantida entre família e escola para assegurar acolhimento pedagógico e mediação em dinâmicas de equipe.',
  },
  estudo_de_caso: {
    barreiras: [
      {
        id: 'B1',
        categoria: 'metodologica',
        descricao: 'Aulas práticas no datacenter/laboratório com múltiplos estímulos sonoros concomitantes sem abafador ou roteiro antecipado.',
        impacto: 'Sobrecarga sensorial que leva à exaustão e dificuldade de concentração.',
        estrategia_enfrentamento: 'Permissão de uso de abafador de ruído passivo de alta atenuação e realização prévia de simulação no Cisco Packet Tracer antes da prática física.',
      },
      {
        id: 'B2',
        categoria: 'comunicacional',
        descricao: 'Instruções orais com linguagem ambígua ou metáforas (ex: "dê um jeito nisso", "veja o que acha").',
        impacto: 'Insegurança na execução dos procedimentos de cabeamento e configuração.',
        estrategia_enfrentamento: 'Roteiros de laboratório claros, com checklists objetivos (Passo 1, Passo 2, Verificação) e critérios de sucesso explícitos.',
      },
    ],
    potencialidades: [
      {
        id: 'P1',
        area: 'Precisão Matemática & Sub-redes',
        descricao: 'Cálculo de máscaras de sub-rede (/24, /27, /30) e conversão binária realizado de cabeça com extrema velocidade e sem erros.',
        apoio_demandado: 'Atuar como referência técnica para apoiar colegas com dificuldades no cálculo de endereçamento IP.',
      },
    ],
    recursos_ta: [
      'Abafador de ruído circum-aural (concha) com certificação NRR 27dB',
      'Software simulador de redes Cisco Packet Tracer instalado em seu computador de laboratório',
      'Checklist impresso plastificado com fluxo de configuração de switches e roteadores',
    ],
    sintese_observacao: {
      interacao_professores: 'Respeitoso e focado; responde com precisão quando questionado objetivamente.',
      interacao_colegas: 'Convívio tranquilo; prefere trabalhar com colegas calmos que respeitam o ritmo concentrado.',
      tarefas_coletivas: 'Executa as tarefas técnicas com perfeição quando os papéis estão combinados previamente.',
      interesses_centrais: 'Redes de computadores, protocolos de internet, segurança da informação, hardware de servidores.',
      habilidades_tecnicas: 'Arquitetura TCP/IP, cálculo de sub-redes VLSM e crimpagem de cabos de rede.',
      autonomia_rotina: 'Autônomo em todos os cuidados pessoais.',
    },
  },
  planejamento_pei: {
    conteudo_ementa_oficial:
      'Redes de Computadores: Modelo OSI e arquitetura TCP/IP; Endereçamento IPv4 e IPv6; Cálculo de Sub-redes; Meios de transmissão e cabeamento estruturado (Norma ANSI/TIA-568); Configuração básica de switches e roteamento estático.',
    competencias_habilidades_ementa:
      'Configurar redes de computadores cabeadas e sem fio; implementar endereçamento lógico e físico; utilizar ferramentas de diagnóstico e simulação; montar e testar cabos de par trançado.',
    adaptacao_flexibilizacao_curricular:
      'Conteúdo integral sem simplificações. Acessibilidade sensorial garantida através de simuladores prévios e abafador de ruídos em laboratório.',
    objetivos_e_metas: [
      {
        id_meta: 'M1',
        descricao_meta: 'Projetar e calcular esquema de endereçamento IPv4 com sub-redes para uma topologia com 4 departamentos.',
        prazo: 'Mensal (4 semanas - até 26/11/2026)',
        indicador_sucesso: 'Entrega da tabela de sub-redes com faixas de IP válidas, máscaras e broadcast 100% corretos.',
        progresso_percentual: 95,
        status: 'alcancada',
      },
      {
        id_meta: 'M2',
        descricao_meta: 'Simular e validar a conectividade da rede projetada utilizando o Cisco Packet Tracer.',
        prazo: 'Bimestral (8 semanas - até 20/12/2026)',
        indicador_sucesso: 'Demonstração de ping bem-sucedido entre todas as sub-redes com comandos de diagnóstico.',
        progresso_percentual: 75,
        status: 'em_andamento',
      },
    ],
    flexibilizacao_metodologica_dua: {
      engajamento: [
        'Desafios de configuração baseados em competições de cibersegurança e redes (CTF educacional).',
        'Previsibilidade total: cronograma de laboratórios divulgado com antecedência de duas semanas.',
        'Permissão de fone/abafador sonoro durante toda a prática em laboratório barulhento.',
      ],
      representacao: [
        'Diagramas de rede em padrão Cisco com código de cores semântico.',
        'Roteiros passo a passo em formato de checklist numerado sem ambiguidades textuais.',
        'Simulações visuais da transmissão de pacotes antes da implementação no hardware físico.',
      ],
      acao_e_expressao: [
        'Demonstração da configuração através de arquivos de configuração (.pkt) e saída de comandos de terminal.',
        'Avaliação prática mediada em bancada com tempo estendido e ambiente silencioso.',
        'Aceite de relatórios técnicos concisos em tópicos objetivos.',
      ],
    },
    gestao_sala_de_aula: {
      organizacao_espacial: 'Bancada distante do servidor central de alta rotação acústica do laboratório.',
      rotina_e_pausas: 'Pausa de autorregulação sensorial de 5 minutos permitida quando houver sobrecarga sonora.',
      agrupamentos_e_tutoria: 'Trabalho em duplas com colega calmo e alinhamento prévio das tarefas de cada um.',
      suporte_docente_semanal: 'Reunião semanal de suporte entre docente de redes e o NAPNE nas sextas-feiras.',
    },
    estrategias_avaliacao: {
      formato_acessivel: 'Avaliação prática no simulador e na bancada com roteiro objetivo e sem pressão de comunicação informal.',
      criterio_de_sucesso: 'Conectividade e corretude técnica das configurações de rede conforme a norma técnica.',
      grau_mediacao: 'sem_mediacao',
      tempo_e_espaco: 'Ambiente com ruído controlado e tempo ampliado.',
      recursos_utilizados: ['Cisco Packet Tracer', 'Abafador de ruídos', 'Checklist técnico'],
    },
    observacoes_docente:
      'O rendimento de Matheus em redes é primoroso. Ao utilizarmos o abafador de ruídos e o roteiro estruturado com DUA 3.0, sua concentração atingiu nível máximo.',
  },
  painel_notas: [
    {
      id: 'NM1',
      autor: 'Prof. Gilberto (Docente Redes)',
      papel: 'Regente',
      categoria: 'objetivos',
      conteudo: 'Matheus calculou o endereçamento VLSM de 5 redes em menos de 15 minutos sem cometer um único erro!',
      data: '25/10/2026',
      cor: 'green',
    },
  ],
  metricas: {
    percentual_metas_alcancadas: 85,
    nivel_autonomia: 5,
    engajamento: 5,
    sessoes_semanais_realizadas: 8,
    status_geral: 'EM_ANDAMENTO',
  },
  parecer_pedagogico:
    'A adaptação do ambiente de laboratório para acolhimento de estudantes autistas no Ensino Médio Técnico Integrado em Informática assegura o desenvolvimento pleno de suas competências técnicas com equidade e dignidade.',
  sugestoes_proximo_ciclo: [
    'Incentivar participação na Olimpíada Brasileira de Informática (OBI).',
    'Manter o protocolo de abafador e roteiros estruturados para a disciplina de Sistemas Operacionais.',
  ],
};

// 4. CASO ENSINO SUPERIOR EM TI - DUPLA EXCEPCIONALIDADE (TDAH + ALTAS HABILIDADES/SUPERDOTAÇÃO)
export const casoLarissaSuperior: PEICompleto = {
  id: 'SUP-BSI-07',
  cabecalho: {
    estudante: 'Larissa Menezes Costa',
    codigo_matricula: '2024.1.BSI.031',
    idade: '20 anos',
    curso: 'Bacharelado em Sistemas de Informação (TI)',
    componente_curricular: 'Engenharia de Software e Programação Orientada a Objetos',
    modulo_periodo: '3º Semestre / Noturno',
    data_elaboracao: '2026-10-27',
    docente_regente: 'Profª. Dra. Helena Bittencourt (Docente de Engenharia de Software)',
    docente_aee: 'Profª. Renata Cavalcanti (Especialista em Educação Especial / NAPNE)',
    profissional_apoio: 'Monitor de Acessibilidade Digital e Laboratório',
    coordenacao_napne: 'Coordenação NAPNE · Campus Paraíso',
  },
  historico_napne: {
    status_diagnostico: 'confirmado',
    categoria_neurodivergencia: 'TDAH Combinado + Altas Habilidades / Superdotação (Dupla Excepcionalidade)',
    cid_ou_hipotese: 'Perfil com laudo de neurodivergência arquivado no NAPNE',
    breve_historico_clinico_familiar:
      'Estudante do Bacharelado em Sistemas de Informação no Campus Paraíso (integrante dos 14 estudantes acompanhados no Ensino Superior). Apresenta perfil de Dupla Excepcionalidade: velocidade de processamento lógico muito acima da média e hiperfoco criativo, associado a desafios na função executiva e planejamento de prazos longos.',
    descricao_condicao_especifica:
      'Tendência a sobrecarga quando projetos semestrais possuem prazos únicos e distantes. Beneficia-se de entregas modulares curtas (micro-sprints no GitHub/Kanban) e tarefas com objetivos explícitos.',
    informacoes_dos_pais:
      'Estudante universitário autônomo com acompanhamento pedagógico pelo NAPNE Campus Paraíso.',
  },
  estudo_de_caso: {
    barreiras: [
      {
        id: 'B1',
        categoria: 'metodologica',
        descricao: 'Projetos semestrais com prazos únicos e distantes (ex: entrega de software completo apenas no fim do semestre).',
        impacto: 'Déficit de função executiva leva à procrastinação, hiperfoco de última hora, sobrecarga e perda de prazos intermediários.',
        estrategia_enfrentamento: 'DUA 3.0: Metodologia Scrum educacional com micro-sprints semanais (Kanban), checkpoints regulares e feedback contínuo.',
      },
      {
        id: 'B2',
        categoria: 'atitudinal',
        descricao: 'Expectativa docente de que por ter Altas Habilidades ela "não precisa de apoio" ou que a desorganização com relatórios é "desleixo".',
        impacto: 'Invisibilização do TDAH e sofrimento psicológico (ansiedade de desempenho e síndrome do impostor).',
        estrategia_enfrentamento: 'Sensibilização docente com orientação do NAPNE: reconhecimento da dupla excepcionalidade como demanda legítima de acessibilidade pedagógica.',
      },
      {
        id: 'B3',
        categoria: 'tecnologica',
        descricao: 'Exigência de preenchimento de extensos relatórios técnicos manuais em formatos rígidos e burocráticos.',
        impacto: 'Dispersão e bloqueio executivo na escrita burocrática, contrastando com seu código fonte de altíssima qualidade.',
        estrategia_enfrentamento: 'Aceite de documentação técnica viva via Markdown no repositório GitHub, issues e diagramas de classe em Mermaid.js.',
      },
    ],
    potencialidades: [
      {
        id: 'P1',
        area: 'Arquitetura de Software & Design Patterns',
        descricao: 'Facilidade ímpar para desenhar arquiteturas desacopladas, microsserviços e aplicar padrões de projeto (GoF).',
        apoio_demandado: 'Enriquecimento curricular com desafios de ponta, participação em projetos de pesquisa e inovação.',
      },
      {
        id: 'P2',
        area: 'Resolução Criativa de Problemas',
        descricao: 'Pensamento divergente; propõe abordagens inovadoras que superam os requisitos básicos propostos pelo docente.',
        apoio_demandado: 'Canalizar a criatividade dentro do escopo com mentoria técnica orientada.',
      },
    ],
    recursos_ta: [
      'Quadro Kanban digital integrado ao GitHub Projects para microtarefas visuais',
      'Extensões de foco e linter no VS Code (Pomodoro Timer, Error Lens, Todo Tree)',
      'Templates estruturados em Markdown com seções pré-definidas para documentação',
      'Gravação em áudio das reuniões de alinhamento para consulta posterior',
    ],
    sintese_observacao: {
      interacao_professores: 'Muito participativa e questionadora; propõe soluções de alta complexidade conceitual.',
      interacao_colegas: 'Excelente liderança técnica em hackathons e projetos de desenvolvimento.',
      tarefas_coletivas: 'Rendimento excelente quando atua como Tech Lead com colega responsável pela gestão de cronograma.',
      interesses_centrais: 'Engenharia de Software, Arquitetura em Nuvem, Inteligência Artificial e UI/UX.',
      habilidades_tecnicas: 'Java, TypeScript, Docker, Design Patterns e Arquitetura Limpa.',
      autonomia_rotina: 'Autônoma nas atividades de vida diária; necessita de suporte focado em gestão executiva e prazos.',
    },
  },
  planejamento_pei: {
    conteudo_ementa_oficial:
      'Engenharia de Software: Ciclo de vida de software, Metodologias Ágeis (Scrum/Kanban), Modelagem Orientada a Objetos com UML, Padrões de Projeto (Design Patterns) e Testes Automatizados.',
    competencias_habilidades_ementa:
      'Modelar e construir sistemas orientados a objetos robustos; aplicar princípios SOLID e design patterns; implementar pipeline de testes unitários; atuar em equipes ágeis com versionamento e entrega contínua.',
    adaptacao_flexibilizacao_curricular:
      'Enriquecimento curricular nos termos da Portaria MEC nº 421/2026: aprofundamento prático em arquitetura de microsserviços e automação, com suporte às funções executivas através de micro-entregas semanais.',
    objetivos_e_metas: [
      {
        id_meta: 'M1',
        descricao_meta: 'Modelar e implementar microsserviço com princípios SOLID e cobertura de testes unitários de 80%.',
        prazo: 'Mensal (4 semanas - até 26/11/2026)',
        indicador_sucesso: 'Pipeline de CI/CD no GitHub Actions aprovando todos os testes com código documentado.',
        progresso_percentual: 70,
        status: 'em_andamento',
      },
      {
        id_meta: 'M2',
        descricao_meta: 'Manter quadro Kanban no GitHub Projects atualizado semanalmente com checklist de issues fechadas.',
        prazo: 'Bimestral (8 semanas - até 20/12/2026)',
        indicador_sucesso: 'Pelo menos 85% das micro-entregas semanais cumpridas sem acúmulo no final do período.',
        progresso_percentual: 80,
        status: 'em_andamento',
      },
    ],
    flexibilizacao_metodologica_dua: {
      engajamento: [
        'Enriquecimento curricular com desafios de computação em nuvem e arquitetura avançada.',
        'Metodologia ágil com gamificação de micro-entregas semanais para manter dopamina e motivação.',
        'Feedback formativo imediato pós-sprint pelo docente regente.',
      ],
      representacao: [
        'Instruções curtas e visualmente estruturadas em tópicos destacados (sem blocos monolíticos de texto).',
        'Modelos de exemplo comentados (starter kits de repositório no GitHub).',
        'Uso de diagramas dinâmicos em Mermaid e fluxogramas visuais.',
      ],
      acao_e_expressao: [
        'Demonstração prática através de código funcional no GitHub e gravação de screencast curto (Loom).',
        'Aceite de documentação técnica sintetizada em Markdown em vez de relatórios em Word.',
        'Apresentação técnica no formato de "Tech Talk" universitária.',
      ],
    },
    gestao_sala_de_aula: {
      organizacao_espacial: 'Mesa de trabalho em laboratório com iluminação adequada e espaço para notebook pessoal.',
      rotina_e_pausas: 'Pausas programadas com técnica Pomodoro para descanso cognitivo e autorregulação.',
      agrupamentos_e_tutoria: 'Pareamento em equipe ágil com papel de liderança técnica (Tech Lead).',
      suporte_docente_semanal: 'Reunião semanal de 15 minutos de alinhamento com NAPNE e docente de Engenharia de Software.',
    },
    estrategias_avaliacao: {
      formato_acessivel: 'Avaliação processual baseada em commits semanais e demonstração ao vivo de microsserviço funcional.',
      criterio_de_sucesso: 'Aplicação correta dos padrões de projeto e testes, com autonomia no versionamento.',
      grau_mediacao: 'pouca_mediacao',
      tempo_e_espaco: 'Entregas fracionadas semanais com tempo estendido caso ocorra crise de dispersão.',
      recursos_utilizados: ['GitHub Projects (Kanban)', 'Pomodoro Timer', 'Extensões de foco VS Code'],
    },
    observacoes_docente:
      'Larissa é brilhante na concepção técnica de software. Com a divisão do projeto em micro-sprints e apoio do NAPNE Campus Paraíso nas funções executivas, seu potencial foi plenamente potencializado.',
  },
  painel_notas: [
    {
      id: 'NL1',
      autor: 'Profª. Dra. Helena (Docente)',
      papel: 'Regente',
      categoria: 'objetivos',
      conteudo: 'Larissa implementou um padrão Factory Method e Strategy impecáveis no backend! O acompanhamento semanal tem evitado a procrastinação.',
      data: '24/10/2026',
      cor: 'green',
    },
  ],
  metricas: {
    percentual_metas_alcancadas: 75,
    nivel_autonomia: 5,
    engajamento: 5,
    sessoes_semanais_realizadas: 6,
    status_geral: 'EM_ANDAMENTO',
  },
  parecer_pedagogico:
    'A inclusão universitária na área de TI no Campus Paraíso abrange o reconhecimento da neurodivergência e da dupla excepcionalidade. O PEI permite equalizar o desafio cognitivo à gestão do tempo, viabilizando excelência técnica e bem-estar.',
  sugestoes_proximo_ciclo: [
    'Submeter projeto para o edital de Iniciação Tecnológica (PIBITI).',
    'Convidar Larissa para ministrar oficina de Git e GitHub para os calouros.',
  ],
};

// 5. CASO ENSINO MÉDIO TÉCNICO - HIPÓTESE DIAGNÓSTICA / SEM LAUDO CONFIRMADO (PORTARIA MEC 421/2026)
export const casoCauaSemLaudo: PEICompleto = {
  id: 'MED-INF-05-HIP',
  cabecalho: {
    estudante: 'Cauã Ribeiro dos Santos',
    codigo_matricula: '2026.1.INF.058',
    idade: '15 anos',
    curso: 'Curso Técnico Integrado ao Ensino Médio em Informática',
    componente_curricular: 'Lógica de Programação e Algoritmos',
    modulo_periodo: '1º Ano / 2º Semestre',
    data_elaboracao: '2026-10-27',
    docente_regente: 'Prof. Marcos Vinícius Toledo (Docente de Algoritmos e Lógica)',
    docente_aee: 'Profª. Renata Cavalcanti (Especialista em Educação Especial / NAPNE)',
    profissional_apoio: 'Monitor de Acessibilidade Digital e Laboratório',
    coordenacao_napne: 'Coordenação NAPNE · Campus Paraíso',
  },
  historico_napne: {
    status_diagnostico: 'em_investigacao_hipotese',
    categoria_neurodivergencia: 'Hipótese Diagnóstica em Investigação Pedagógica (Sem Laudo)',
    cid_ou_hipotese: 'Em investigação pedagógica pelo NAPNE (Portaria MEC nº 421/2026)',
    breve_historico_clinico_familiar:
      'Estudante do 1º Ano do Curso Técnico Integrado em Informática no Campus Paraíso. Integra o grupo dos 5 estudantes acompanhados pelo NAPNE que não possuem diagnóstico médico formal. Conforme preconizado pela Portaria MEC nº 421/2026 e pelo Decreto nº 12.686/2025, a ausência de laudo médico NÃO impede a elaboração do PEI nem a concessão de apoios e Tecnologias Assistivas no laboratório de TI.',
    descricao_condicao_especifica:
      'Apresenta grande dificuldade na decodificação e digitação de sintaxes textuais rígidas de código (troca de caracteres como ponto-e-vírgula, chaves e parênteses) e fadiga na leitura de enunciados densos. Demonstra excelente raciocínio algorítmico quando apoiado por linters visuais e enunciados fracionados.',
    informacoes_dos_pais:
      'Família acolhida pelo NAPNE Campus Paraíso, com alinhamento contínuo sobre os apoios pedagógicos em sala de aula.',
  },
  estudo_de_caso: {
    barreiras: [
      {
        id: 'B1',
        categoria: 'metodologica',
        descricao: 'Avaliações de programação manuscritas no papel ou com penalização severa por erros de sintaxe ortográfica de código (ex: esquecimento de vírgula ou parêntese).',
        impacto: 'Gera reprovação por falhas de ortografia/dislexia de sintaxe, ocultando que a lógica algorítmica do estudante estava correta.',
        estrategia_enfrentamento: 'DUA 3.0: Foco na semântica e na lógica do algoritmo; permissão de IDEs com linters visuais que destacam automaticamente erros sintáticos com cores nítidas.',
      },
      {
        id: 'B2',
        categoria: 'comunicacional',
        descricao: 'Enunciados de exercícios com textos densos, vocabulário rebuscado e instruções orais sem apoio visual de entrada/saída.',
        impacto: 'Dificuldade de processamento textual atrasa o início da resolução do problema.',
        estrategia_enfrentamento: 'Enunciados com metodologia DUA: destacados em tópicos, tabela de casos de teste (Input/Output) e leitura mediada em voz alta se necessário.',
      },
      {
        id: 'B3',
        categoria: 'atitudinal',
        descricao: 'Risco de questionamentos da equipe pedagógica sobre a concessão de tempo ampliado pelo fato do estudante "ainda não ter laudo com CID".',
        impacto: 'Insegurança docente e desamparo ao estudante em momento crucial de transição para o ensino técnico.',
        estrategia_enfrentamento: 'Formação continuada do NAPNE Campus Paraíso com base na Portaria MEC nº 421/2026, firmando que a acessibilidade é dever imediato da instituição.',
      },
    ],
    potencialidades: [
      {
        id: 'P1',
        area: 'Raciocínio Algorítmico Visual & Lógica Abstrata',
        descricao: 'Capacidade veloz de resolução de problemas quando apoiado por fluxogramas, linguagens visuais de blocos (Scratch/Blockly) ou representações gráficas.',
        apoio_demandado: 'Utilizar ferramentas visuais como ponte para a linguagem textual de programação.',
      },
      {
        id: 'P2',
        area: 'Resiliência & Motivação com Tecnologia',
        descricao: 'Grande entusiasmo em aprender informática, curiosidade com hardware e manutenção de computadores.',
        apoio_demandado: 'Vincular os algoritmos a aplicações práticas de automação e robótica educativa.',
      },
    ],
    recursos_ta: [
      'Extensões do VS Code para dislexia e apoio visual (Color Highlight, Bracket Pair Colorizer, Error Lens)',
      'Fontes tipográficas acessíveis (OpenDyslexic Mono / Atkinson Hyperlegible)',
      'Tempo estendido (+50%) em provas práticas e avaliações diagnósticas',
      'Permissão de leitor de tela / sintetizador de voz para leitura de enunciados longos',
      'Caderno de apoio com glossário visual de sintaxe de lógica de programação',
    ],
    sintese_observacao: {
      interacao_professores: 'Participativo e atento; solicita esclarecimentos individuais quando o enunciado é muito prolixo.',
      interacao_colegas: 'Bem integrado; colaborativo e respeitoso nas dinâmicas de laboratório.',
      tarefas_coletivas: 'Rendimento excelente em atividades práticas manuais de laboratório.',
      interesses_centrais: 'Lógica de Programação, Jogos Digitais, Montagem e Manutenção de Hardware.',
      habilidades_tecnicas: 'Compreensão de laços de repetição, condicionais e estruturas vetoriais.',
      autonomia_rotina: 'Autônomo; necessita apenas de adequação visual e tempo estendido para leitura.',
    },
  },
  planejamento_pei: {
    conteudo_ementa_oficial:
      'Lógica de Programação e Algoritmos: Conceito de algoritmos, tipos primitivos de dados, variáveis e constantes, operadores lógicos e aritméticos, estruturas condicionais (if/else), estruturas de repetição (for/while) e vetores unidimensionais.',
    competencias_habilidades_ementa:
      'Compreender a lógica algorítmica para resolução de problemas computacionais; implementar estruturas de controle de fluxo; desenvolver pensamento computacional decompondo problemas em sub-rotinas.',
    adaptacao_flexibilizacao_curricular:
      'Garantia do currículo pleno sem rebaixamento cognitivo. Flexibilização metodológica nos canais de leitura e escrita através do DUA 3.0 e Tecnologias Assistivas, com validação diagnóstica contínua.',
    objetivos_e_metas: [
      {
        id_meta: 'M1',
        descricao_meta: 'Construir algoritmos com estruturas condicionais e de repetição utilizando IDE com linter visual e fonte acessível.',
        prazo: 'Mensal (4 semanas - até 26/11/2026)',
        indicador_sucesso: 'Execução correta de pelo menos 4 de 5 exercícios de lógica com casos de teste validados.',
        progresso_percentual: 65,
        status: 'em_andamento',
      },
      {
        id_meta: 'M2',
        descricao_meta: 'Explicar verbalmente ou via fluxograma o fluxo de dados e execução de um algoritmo de ordenação de vetores.',
        prazo: 'Bimestral (8 semanas - até 20/12/2026)',
        indicador_sucesso: 'Apresentação oral com demonstração prática para o docente sem penalização por trocas sintáticas manuais.',
        progresso_percentual: 50,
        status: 'em_andamento',
      },
    ],
    flexibilizacao_metodologica_dua: {
      engajamento: [
        'Desafios práticos com aplicação em cenários reais e contextualizados do campus.',
        'Acolhimento pedagógico seguro que remove a ansiedade e o estigma do erro sintático.',
        'Reconhecimento das soluções lógicas elegantes desenvolvidas pelo estudante.',
      ],
      representacao: [
        'Disponibilização de enunciados com fontes acessíveis (OpenDyslexic) e espaçamento ampliado.',
        'Uso de fluxogramas e tabelas visuais com exemplos de entrada e saída esperados.',
        'Possibilidade de ouvir o enunciado através de sintetizador de voz ou leitura do monitor.',
      ],
      acao_e_expressao: [
        'Avaliação prática no computador com tempo ampliado (+50%) e corretor ortográfico/sintático.',
        'Permissão de defesa oral da solução algorítmica em caso de dúvida sobre a lógica.',
        'Foco da correção na resolução do problema e não na memorização de caracteres pontuais.',
      ],
    },
    gestao_sala_de_aula: {
      organizacao_espacial: 'Bancada de laboratório bem posicionada para visualização do quadro e do projetor.',
      rotina_e_pausas: 'Pausas visuais para descanso ocular após 40 minutos de leitura contínua de código.',
      agrupamentos_e_tutoria: 'Programação em pares orientada com colega acolhedor.',
      suporte_docente_semanal: 'Reunião pedagógica semanal entre docente de algoritmos e equipe do NAPNE Campus Paraíso.',
    },
    estrategias_avaliacao: {
      formato_acessivel: 'Prova prática no laboratório com IDE configurada (linter ativo), tempo ampliado e enunciados em tópicos claros.',
      criterio_de_sucesso: 'Raciocínio lógico correto, corretude da solução e fluxo de processamento.',
      grau_mediacao: 'pouca_mediacao',
      tempo_e_espaco: 'Tempo ampliado (+50%) em ambiente tranquilo de laboratório.',
      recursos_utilizados: ['VS Code com fonte OpenDyslexic', 'Linter de erros visuais', 'Tabela de casos de teste'],
    },
    observacoes_docente:
      'O PEI investigativo de Cauã evidencia a excelência da diretriz da Portaria MEC nº 421/2026: ao eliminar barreiras de digitação e enunciados confusos, ele demonstrou um raciocínio lógico brilhante, superando o receio inicial da turma.',
  },
  painel_notas: [
    {
      id: 'NC1',
      autor: 'Prof. Marcos (Docente Algoritmos)',
      papel: 'Regente',
      categoria: 'objetivos',
      conteudo: 'Cauã resolveu um problema complexo de laços aninhados hoje! A extensão de cores para parênteses e o tempo estendido fizeram total diferença.',
      data: '23/10/2026',
      cor: 'green',
    },
    {
      id: 'NC2',
      autor: 'Profª. Renata (NAPNE)',
      papel: 'AEE',
      categoria: 'apoio',
      conteudo: 'Protocolo de atendimento sem laudo (Portaria MEC 421/2026) plenamente implementado. Família acolhida e estudante motivado.',
      data: '22/10/2026',
      cor: 'yellow',
    },
  ],
  metricas: {
    percentual_metas_alcancadas: 58,
    nivel_autonomia: 4,
    engajamento: 5,
    sessoes_semanais_realizadas: 8,
    status_geral: 'EM_ANDAMENTO',
  },
  parecer_pedagogico:
    'A elaboração do PEI para estudantes em hipótese diagnóstica assegura que o direito à educação pública, gratuita e inclusiva no Campus Paraíso não seja refém da lentidão burocrática de laudos periciais externos, materializando a equidade preconizada no Decreto nº 12.686/2025 e Portaria MEC nº 421/2026.',
  sugestoes_proximo_ciclo: [
    'Manter o acompanhamento pelo NAPNE e registrar a evolução pedagógica para o relatório multiprofissional.',
    'Apresentar os recursos de linter e fontes acessíveis no planejamento pedagógico geral do curso.',
  ],
};

export const todosOsCasos: PEICompleto[] = [
  casoLucasTecnico,
  casoBeatrizSuperior,
  casoMatheusRedes,
  casoLarissaSuperior,
  casoCauaSemLaudo,
];

// BANCO DE SOLUÇÕES PEDAGÓGICAS PARA CONDIÇÕES E NEURODIVERGÊNCIAS EM TI / COMPUTAÇÃO
// Fundamentado no PPC do Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins),
// no Plano de Ensino de Engenharia de Software II (BAC.0406) e nas diretrizes DUA 3.0 / Portaria MEC nº 421/2026.
export const bancoDeSolucoesPedagogicas: SolucaoCondicao[] = [
  {
    id: 'sol-tdah',
    titulo: 'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)',
    condicao: 'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Dificuldade de sustentação de atenção em longas sessões de codificação nos laboratórios (LABIN), desorganização em projetos de software extensos com prazos distantes e bloqueio executivo na leitura de normas técnicas densas (ex: ISO/IEC 25010, CMMI, MPS.BR).',
    remediosSugeridos: {
      engajamento:
        'Metodologia ágil com divisão de projetos em micro-sprints semanais (Kanban/Jira/GitHub Projects); técnica Pomodoro (25 min de foco / 5 min de pausa); feedback formativo imediato pós-entrega.',
      representacao:
        'Roteiros de laboratório fracionados em checklists objetivos com caixas de seleção; disponibilização de starter kits e snippets comentados; linters visuais (Error Lens) no VS Code.',
      acaoExpressao:
        'Demonstração progressiva por commits semanais de testes unitários (TDD: red-green-refactor); aceitação de documentação sintetizada em Markdown em vez de relatórios extensos; tempo estendido (+50%).',
      recursosTA: [
        'Quadro Kanban digital integrado ao Jira / GitHub Projects',
        'Extensões de foco e linter no VS Code (Error Lens, Todo Tree, Pomodoro Timer)',
        'Templates estruturados em Markdown para planos de teste',
        'Fones com cancelamento ativo de ruído para sessões de programação no LABIN',
      ],
      avaliacaoAcessivel:
        'Avaliação processual somativa por marcos parciais semanais entregues, mitigando o peso de uma única prova final teórica ou entrega acumulada.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Inicie a aula mostrando o código ou teste já funcionando na tela (visão do objetivo final em 2 minutos). Em seguida, explique apenas o conceito central do dia usando um exemplo curto de código comentado, evitando exposições teóricas contínuas maiores que 15 minutos antes de ir para a prática no computador.',
      divisao_tarefa_chunking: [
        'Etapa 1 (15 min): Baixar o template inicial (starter kit) já configurado e rodar o primeiro teste de verificação.',
        'Etapa 2 (20 min): Implementar apenas a função principal ou caso de teste solicitado seguindo o checklist de 3 itens no quadro.',
        'Etapa 3 (10 min): Validar com o linter visual na IDE, registrar o commit no Git e receber visto imediato do professor.',
      ],
      avaliacao_pratica:
        'Substitua provas longas de papel por desafios práticos de laboratório divididos em 3 blocos curtos com pontuação imediata a cada bloco concluído e tempo estendido (+50%). Valorize a lógica e o funcionamento do teste acima de detalhes burocráticos de formatação.',
      manejo_e_acolhimento:
        'Se o estudante travar por sobrecarga executiva ("não sei por onde começar"), sente-se ao lado dele por 2 minutos, escreva a assinatura da primeira função ou o comentário "// Passo 1 aqui" no editor dele e combine apenas os próximos 10 minutos de código.',
    },
  },
  {
    id: 'sol-tea',
    titulo: 'Transtorno do Espectro Autista (TEA)',
    condicao: 'Transtorno do Espectro Autista (TEA)',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Sobrecarga sensorial decorrente de ruídos contínuos de coolers, servidores e conversas paralelas nos laboratórios (LABIN/LADES), somada a desestabilização por mudanças imprevistas de rotina e insegurança com instruções ambíguas ou metáforas.',
    remediosSugeridos: {
      engajamento:
        'Previsibilidade com cronograma detalhado de aulas práticas e testes de software publicado com antecedência no AVA Moodle; definição explícita de papéis em equipes de desenvolvimento.',
      representacao:
        'Roteiros de laboratório estruturados em formato de checklist numerado sem ambiguidades; tabelas explícitas de casos de teste com entradas e saídas esperadas (partição de equivalência); fluxogramas visuais.',
      acaoExpressao:
        'Demonstração prática através de código funcional com suíte de testes automatizados (JUnit/Selenium); tempo estendido (+50%); opção de sustentação técnica individual ou gravação assíncrona (Loom).',
      recursosTA: [
        'Abafador de ruídos circum-aural (27dB+) para uso nos laboratórios de computação',
        'Cartão de pausa sensorial para autorregulação discreta',
        'Roteiros técnicos estruturados no AVA Moodle com critérios objetivos de aceite',
        'Ambiente de bancada reservado com iluminação estável e menor tráfego de pessoas',
      ],
      avaliacaoAcessivel:
        'Avaliação prática em laboratório com critérios analíticos explícitos (Definition of Done), sem pressão de comunicação informal desestruturada.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Publique o roteiro da aula no Moodle com antecedência. Use linguagem literal, direta e sem figuras de linguagem. Apresente entradas e saídas esperadas em tabelas claras (Ex: Entrada = 5 -> Saída Esperada = "Aprovado") e mantenha a mesma bancada fixa no laboratório.',
      divisao_tarefa_chunking: [
        'Etapa 1: Ler o roteiro passo a passo numerado (1.1, 1.2, 1.3) com critérios objetivos de conclusão.',
        'Etapa 2: Codificar os módulos individualmente ou em dupla fixa com papel técnico claramente definido (ex: responsável pelos testes unitários).',
        'Etapa 3: Executar a bateria de testes automatizados que confirma visualmente (verde/vermelho) se a tarefa terminou.',
      ],
      avaliacao_pratica:
        'Enunciados 100% objetivos com rubrica analítica entregue junto com a prova (indicando exatamente quantos pontos vale cada requisito técnico). Permita apresentação individual para o professor ou vídeo gravado em vez de exposição diante da turma.',
      manejo_e_acolhimento:
        'Caso haja desconforto sensorial por barulho ou mudança imprevista no laboratório, permita imediatamente o uso do abafador auricular ou uma pausa de 5 a 10 minutos fora da sala sem necessidade de justificativa pública.',
    },
  },
  {
    id: 'sol-ansiedade',
    titulo: 'Transtornos de ansiedade (generalizada, fóbico-ansiosos, pânico, outros)',
    condicao: 'Transtornos de ansiedade (generalizada, fóbico-ansiosos, pânico, outros)',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Bloqueio cognitivo e sintomas físicos agudos (taquicardia, tremores) em apresentações públicas de seminários, defesas de projetos de software perante a turma ou avaliações práticas cronometradas com pressão temporal rígida.',
    remediosSugeridos: {
      engajamento:
        'Ambiente de laboratório psicologicamente seguro e acolhedor; possibilidade de apresentação em pequenos grupos ou gravação em vídeo (screencast com Loom); mediação prévia pelo professor regente e NAPNE.',
      representacao:
        'Disponibilização antecipada (48h) dos enunciados de laboratório e rubricas avaliativas no Moodle para reduzir a ansiedade antecipatória; exemplos de soluções esperadas.',
      acaoExpressao:
        'Tempo estendido (+50%) garantido em avaliações de código e testes; permissão de pausas de 5-10 minutos para autorregulação fora do laboratório; avaliação fracionada em etapas.',
      recursosTA: [
        'Software de gravação de tela (Loom / OBS Studio) para apresentação assíncrona',
        'Rubricas analíticas de avaliação disponibilizadas previamente no AVA Moodle',
        'Espaço de vivência discente do campus disponível para pausas de regulação',
      ],
      avaliacaoAcessivel:
        'Substituição de bancas e seminários abertos por apresentação reservada para o docente ou envio de vídeo gravado, preservando a mesma exigência técnica da ementa.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Evite chamadas orais surpresa ("cold calling") durante a explicação. Antecipe no início da aula exatamente o que será cobrado e mostre um exemplo resolvido completo para eliminar o medo do desconhecido.',
      divisao_tarefa_chunking: [
        'Etapa 1: Validar primeiro um exemplo guiado de baixa complexidade sem valer nota para ganhar segurança.',
        'Etapa 2: Desenvolver o requisito principal do exercício com consulta livre à documentação e material de apoio.',
        'Etapa 3: Entregar o código no repositório ou apresentar em vídeo curto gravado (Loom) sem exposição pública.',
      ],
      avaliacao_pratica:
        'Avaliação em etapas ao longo do bimestre em vez de uma única prova de alto risco. Conceda +50% de tempo adicional sem cronômetro regressivo visível na tela e aceite defesa em horário de atendimento individual.',
      manejo_e_acolhimento:
        'Se o aluno apresentar branco cognitivo, tremores ou respiração curta durante uma prática, valide com calma ("Está tudo bem, seu progresso até aqui já está salvo"), permita beber água ou respirar fora do laboratório e retome a avaliação de onde parou.',
    },
  },
  {
    id: 'sol-aprendizagem',
    titulo: 'Transtorno específico de aprendizagem (dislexia, disgrafia, discalculia)',
    condicao: 'Transtorno específico de aprendizagem (dislexia, disgrafia, discalculia)',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Troca, espelhamento e omissão de caracteres em sintaxes rígidas de linguagens de programação (ponto-e-vírgula, parênteses, chaves, operadores lógicos); fadiga visual rápida na leitura de enunciados densos e logs extensos de testes.',
    remediosSugeridos: {
      engajamento:
        'Acolhimento pedagógico seguro que remove a punição punitiva por erros mecânicos de sintaxe, valorizando a arquitetura, a corretude lógica e o raciocínio do algoritmo.',
      representacao:
        'Uso de fontes tipográficas especializadas (OpenDyslexic Mono, JetBrains Mono); realce colorido de delimitadores e operadores; diagramas visuais de fluxo de dados (Mermaid/UML).',
      acaoExpressao:
        'Permissão de IDEs configuradas com linters visuais e autocompletar em tempo real; permissão de leitor de tela / sintetizador de voz para enunciados; tempo estendido (+50%) e defesa oral da lógica.',
      recursosTA: [
        'Fontes acessíveis OpenDyslexic Mono e Atkinson Hyperlegible instaladas na IDE',
        'Extensões de linter visual no VS Code (Error Lens, Bracket Pair Colorizer, Prettier)',
        'Sintetizador de voz / leitor de tela para leitura mediada de enunciados longos',
        'Tabela de consulta de operadores lógicos e sintaxes de teste (JUnit/Selenium)',
      ],
      avaliacaoAcessivel:
        'Avaliação prática em laboratório com IDE configurada e linter ativo; correção focada no raciocínio e fluxo de processamento, sem prejuízo por pequenas trocas de caracteres.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Associe sempre o código textual a um fluxograma visual ou diagrama de blocos no quadro. Destaque com cores diferentes onde abrem e fecham chaves/parênteses e leia em voz alta os enunciados das questões.',
      divisao_tarefa_chunking: [
        'Etapa 1: Desenhar ou montar a lógica do algoritmo em fluxograma/pseudocódigo antes de lidar com a sintaxe da linguagem.',
        'Etapa 2: Codificar no VS Code utilizando folha de consulta rápida (Cheat Sheet) de comandos e autocompletar ativo.',
        'Etapa 3: Testar o programa com apoio do formatador automático (Prettier) e explicar oralmente a lógica ao professor.',
      ],
      avaliacao_pratica:
        'Provas práticas sempre no computador com corretor sintático ativo (nunca exigir código escrito à mão no papel). Desconsidere trocas ortográficas em nomes de variáveis e avalie 100% pela lógica algorítmica.',
      manejo_e_acolhimento:
        'Quando o código não compilar por um erro simples de digitação (ex: inversão de letras ou falta de ponto-e-vírgula), aponte diretamente a linha para o estudante corrigir sem descontar nota, mantendo o foco no raciocínio.',
    },
  },
  {
    id: 'sol-def-intelectual',
    titulo: 'Deficiência intelectual / Transtorno do desenvolvimento intelectual',
    condicao: 'Deficiência intelectual / Transtorno do desenvolvimento intelectual',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Dificuldade na retenção de sequências extensas de instruções abstratas e na compreensão de conceitos excessivamente teóricos desvinculados da experimentação prática nos laboratórios de informática.',
    remediosSugeridos: {
      engajamento:
        'Aprendizagem mediada e contextualizada com exemplos práticos imediatos do cotidiano do campus; valorização dos sucessos intermediários com reforço pedagógico positivo pelo monitor de apoio.',
      representacao:
        'Fracionamento de instruções complexas em 2 a 3 passos objetivos por vez; suporte de esquemas visuais coloridos, fluxogramas simplificados e tutoriais passo a passo em vídeo curto.',
      acaoExpressao:
        'Avaliação prática focada na execução de tarefas técnicas concretas (ex: rodar teste unitário, identificar falha guiada); tempo ampliado (+100%); mediação assistida de monitor.',
      recursosTA: [
        'Roteiros impressos com esquemas visuais passo a passo',
        'Ambiente de desenvolvimento simplificado com atalhos de execução pré-configurados',
        'Apoio individualizado de monitor de acessibilidade pedagógica do NAPNE',
      ],
      avaliacaoAcessivel:
        'Avaliação formativa mediada com base em checklists concretos de tarefas práticas realizadas em laboratório.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Transforme abstrações em situações concretas do dia a dia (ex: comparar um Banco de Dados a uma ficha de cadastro da biblioteca do campus). Demonstre a ação primeiro na máquina do aluno e peça para ele repetir logo em seguida.',
      divisao_tarefa_chunking: [
        'Etapa 1: Seguir um guia visual ilustrado com capturas de tela contendo apenas 2 a 3 comandos por bloco.',
        'Etapa 2: Preencher as lacunas de um código pré-estruturado (scaffolding) com mediação do monitor ou colega tutor.',
        'Etapa 3: Executar o sistema na prática e demonstrar oralmente para o professor o que o programa faz.',
      ],
      avaliacao_pratica:
        'Avaliação contínua por portfólio das atividades práticas realizadas em laboratório com mediação pedagógica, instruções curtas e tempo ampliado (+100%).',
      manejo_e_acolhimento:
        'Se o aluno demonstrar frustração diante de uma tarefa abstrata, volte um passo para o exemplo concreto ilustrado, elogie o que já foi construído e faça o próximo passo em conjunto (modelagem guiada).',
    },
  },
  {
    id: 'sol-toc',
    titulo: 'Transtorno obsessivo-compulsivo (TOC)',
    condicao: 'Transtorno obsessivo-compulsivo (TOC)',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Perfeccionismo paralisante e rigidez cognitiva na refatoração de código, redação de planos de teste e documentação, gerando atrasos severos na entrega por checagens repetitivas exaustivas ou sofrimento desproporcional com avisos do compilador.',
    remediosSugeridos: {
      engajamento:
        'Definição explícita e pactuada de critérios de "concluído" (Definition of Done - DoD); estabelecimento de limites saudáveis de refatoração para interromper ciclos de checagem repetitiva.',
      representacao:
        'Checklists com critérios finitos e objetivos de aceite (ex: "passou nos 3 testes unitários principais = atividade finalizada com sucesso"); sem regras abertas ou subjetivas.',
      acaoExpressao:
        'Prazos intermediários com margem de segurança; avaliação com foco na funcionalidade e não na perfeição estilística; tempo estendido (+50%).',
      recursosTA: [
        'Pipelines de testes automatizados (CI/CD) que fornecem validação objetiva e externa do código',
        'Ferramenta de rastreio de tarefas (Jira / GitHub Projects) com etapas sequenciais limitadas',
        'Temporizador para limitar o tempo de refatoração a blocos pré-determinados',
      ],
      avaliacaoAcessivel:
        'Avaliação baseada no cumprimento dos testes funcionais automatizados, liberando o estudante da necessidade de reescrever o código indefinidamente.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Deixe claro desde o início qual é o critério exato de "pronto" (Definition of Done). Evite pedir "faça o melhor código possível"; peça "faça uma função que receba X e retorne Y passando nos 3 testes".',
      divisao_tarefa_chunking: [
        'Etapa 1: Escrever a versão inicial funcional do código sem se preocupar com otimização estética.',
        'Etapa 2: Rodar os 3 casos de teste objetivos fornecidos pelo professor.',
        'Etapa 3: Assim que os testes ficarem verdes, encerrar a questão e enviar (proibindo reescritas infinitas).',
      ],
      avaliacao_pratica:
        'Questões fechadas em escopo com bateria de testes automatizados: passou no teste = nota máxima garantida naquele item, dando segurança objetiva para o aluno avançar.',
      manejo_e_acolhimento:
        'Se o estudante ficar preso refatorando ou verificando repetidamente a mesma linha que já está correta, valide verbalmente ("Já conferi seu método, está 100% correto e com nota máxima, vamos salvar e passar para a próxima etapa").',
    },
  },
  {
    id: 'sol-misto-ansioso-depressivo',
    titulo: 'Transtorno misto ansioso e depressivo',
    condicao: 'Transtorno misto ansioso e depressivo',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Oscilações significativas de energia e motivação aliadas a episódios agudos de ansiedade de desempenho; desmotivação diante de erros de compilação ou falhas em testes somada a medo paralisante de reprovação.',
    remediosSugeridos: {
      engajamento:
        'Acolhimento pedagógico seguro com escuta pelo professor e pelo NAPNE; pactuação de metas de pequeno porte para recomposição gradual da autoeficácia acadêmica; flexibilidade em situações de crise.',
      representacao:
        'Materiais didáticos sintetizados e organizados no AVA Moodle; roteiros objetivos que evitam a sensação de sobrecarga cognitiva ou volume inatingível de tarefas.',
      acaoExpressao:
        'Entregas fracionadas semanais; avaliação contínua formativa que substitui provas de grande peso emocional; tempo estendido (+50%) em laboratório.',
      recursosTA: [
        'Acesso ao AVA Moodle com possibilidade de envio flexível em períodos de acompanhamento',
        'Canal de comunicação reservado e direto com o docente regente e equipe do NAPNE',
        'Calendário visual de entregas com marcos graduais',
      ],
      avaliacaoAcessivel:
        'Composição da nota através de múltiplos pequenos exercícios práticos de laboratório, com feedback formativo e oportunidade de reenvio.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Apresente o conteúdo de forma calma, mostrando que erros de compilação fazem parte natural do desenvolvimento de software. Disponibilize o resumo da aula e o código-base no Moodle para estudo no ritmo do aluno.',
      divisao_tarefa_chunking: [
        'Etapa 1: Completar uma micro-tarefa inicial rápida (5-10 min) para destravar a inércia e gerar confiança imediata.',
        'Etapa 2: Desenvolver o bloco intermediário em dupla acolhedora com suporte do professor.',
        'Etapa 3: Registrar a entrega parcial no Moodle garantindo pontuação cumulativa.',
      ],
      avaliacao_pratica:
        'Avaliação distribuída em pequenas entregas semanais durante as próprias aulas de laboratório, permitindo correção e reenvio sem penalidade severa.',
      manejo_e_acolhimento:
        'Em dias de baixa energia ou pico ansioso, reduza o escopo imediato para uma meta mínima alcançável naquela aula e mantenha diálogo reservado e empático junto ao NAPNE.',
    },
  },
  {
    id: 'sol-depressao',
    titulo: 'Transtornos depressivos',
    condicao: 'Transtornos depressivos',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Lentificação do processamento cognitivo, fadiga extrema e crises de anedonia/desânimo que comprometem a assiduidade e a energia necessária para iniciar e manter projetos extensos de desenvolvimento de software.',
    remediosSugeridos: {
      engajamento:
        'Apoio tutorial próximo pelo docente e NAPNE; inclusão em duplas colaborativas acolhedoras (Pair Programming); celebração e registro explícito de cada avanço alcançado.',
      representacao:
        'Gravação de aulas expositivas e disponibilização de roteiros de laboratório no AVA Moodle para consulta em momentos de melhor disposição energética.',
      acaoExpressao:
        'Aplicação do regime de Atividades Acompanhadas (Decreto-Lei nº 1.044/1969 e ODP-IFTO) em fases agudas; flexibilização de cronogramas sem rebaixamento curricular; tempo estendido (+50%).',
      recursosTA: [
        'Ambiente Virtual de Aprendizagem Moodle para acesso assíncrono aos conteúdos e testes',
        'Monitoria orientada pelo NAPNE Campus Paraíso para acompanhamento do cronograma',
        'Canal de atendimento pedagógico individualizado',
      ],
      avaliacaoAcessivel:
        'Avaliação baseada na consolidação das competências ao longo do semestre, permitindo prazos estendidos para conclusão de projetos práticos.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Disponibilize roteiros autoexplicativos e códigos comentados no Moodle para que o estudante não perca o fio condutor caso tenha tido dificuldade de concentração na explicação oral.',
      divisao_tarefa_chunking: [
        'Etapa 1: Selecionar com o aluno um tema de projeto alinhado aos seus interesses pessoais para estimular o engajamento.',
        'Etapa 2: Dividir o projeto em entregas curtas assíncronas com prazos flexíveis pactuados com o NAPNE.',
        'Etapa 3: Validar cada entrega de forma acolhedora, destacando os pontos fortes do código construído.',
      ],
      avaliacao_pratica:
        'Priorize entregas práticas assíncronas via Git/Moodle e defesas individuais tranquilas, assegurando segunda oportunidade de entrega em fases agudas.',
      manejo_e_acolhimento:
        'Nunca exponha faltas ou atrasos perante a turma. Acolha o estudante individualmente, reconecte-o a um colega parceiro de laboratório e acione o suporte multiprofissional do NAPNE.',
    },
  },
  {
    id: 'sol-epilepsia',
    titulo: 'Epilepsia e crises convulsivas',
    condicao: 'Epilepsia e crises convulsivas',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Fotossensibilidade a telas de monitores com taxas de atualização oscilantes ou brilho excessivo nos laboratórios (LABIN); fadiga física e necessidade de recuperação cognitiva pós-ictal ou prevenção de crises causadas por estresse severo.',
    remediosSugeridos: {
      engajamento:
        'Ambiente de laboratório calmo, sem estresse temporal punitivo; protocolo de primeiros socorros e segurança em saúde já alinhado com a equipe de enfermagem do campus.',
      representacao:
        'Monitores com filtro antirreflexo e taxa estável de 60Hz+; configuração de temas de alto contraste com fundo escuro suave (modo sépia/escuro) sem elementos piscantes ou animações rápidas.',
      acaoExpressao:
        'Pausas preventivas programadas a cada 45 minutos longe da tela; tempo ampliado (+50%) em práticas avaliativas; garantia de reposição de avaliações em caso de crise.',
      recursosTA: [
        'Monitores do laboratório configurados com filtros de luz azul e taxa estável de atualização',
        'Temas de IDE com paleta de cores suave sem flashes ou contrastes estroboscópicos',
        'Assento em bancada de fácil acesso e circulação segura no laboratório',
      ],
      avaliacaoAcessivel:
        'Garantia de reposição de qualquer atividade avaliativa interrompida por crise convulsiva, com tempo integral recomposto e ambiente tranquilo.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Certifique-se de que o projetor e os monitores do laboratório estejam em modo escuro/conforto sem cintilação (flicker). Combine pausas visuais de 5 minutos a cada 45 minutos de tela.',
      divisao_tarefa_chunking: [
        'Etapa 1: Configurar o ambiente visual (tema escuro suave ou sépia na IDE) e planejar a lógica no papel.',
        'Etapa 2: Codificar o módulo principal em sessão tranquila com salvamento automático (Auto-Save) ativado no VS Code.',
        'Etapa 3: Realizar pausa visual preventiva antes de executar e validar os testes finais.',
      ],
      avaliacao_pratica:
        'Avaliações sem pressão de cronômetro estressante, com salvamento automático contínuo e garantia integral de reagendamento caso ocorra mal-estar ou crise.',
      manejo_e_acolhimento:
        'Ao menor sinal de aura, tontura ou fadiga visual, interrompa imediatamente o uso da tela, posicione o estudante em local seguro e ventilado e acione o protocolo de saúde do campus.',
    },
  },
  {
    id: 'sol-baixa-visao-sql',
    titulo: 'Deficiência Visual / Baixa Visão Severa ou Cegueira',
    condicao: 'Baixa Visão Severa, Retinopatia, Glaucoma ou Cegueira',
    nivelSugerido: 'Superior TI',
    descricaoProblema:
      'Diagramas visuais de Modelos de Dados (MER/UML) em imagens rasterizadas (.png/.jpg) são completamente inacessíveis a leitores de tela em disciplinas como Banco de Dados e Engenharia de Software.',
    remediosSugeridos: {
      engajamento:
        'Envolvimento em projetos reais de modelagem de dados e sistemas corporativos com foco no raciocínio abstrato e arquitetura lógica.',
      representacao:
        'Substituição de diagramas visuais por linguagens declarativas acessíveis (DBML / YAML / scripts SQL DDL comentados) e audiodescrição em sala.',
      acaoExpressao:
        'Interação com o sistema via terminal CLI e clientes acessíveis ao leitor NVDA; entrega de scripts e documentação em Markdown acessível; tempo estendido (+50%).',
      recursosTA: [
        'Leitor de telas NVDA / Orca com voz pt-BR configurada',
        'Terminal com alto contraste invertido e fonte monoespaçada 22pt+',
        'Monitor de 27 a 32 polegadas com braço articulado pantográfico',
        'Documentação técnica em Markdown ou LaTeX acessível',
      ],
      avaliacaoAcessivel:
        'Resolução de problemas de consultas analíticas e modelagem via terminal de testes com tempo estendido e defesa oral.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Nunca aponte para o quadro dizendo apenas "vejam este diagrama aqui". Verbalize toda estrutura lógica em voz alta e entregue os diagramas em formato textual estruturado (Markdown, SQL DDL ou DBML).',
      divisao_tarefa_chunking: [
        'Etapa 1: Receber o arquivo texto/Markdown acessível e explorar a estrutura com o leitor de telas NVDA ou lupas de ampliação.',
        'Etapa 2: Escrever os scripts ou algoritmos via teclado e terminal CLI acessível.',
        'Etapa 3: Validar a saída textual no console e realizar breve defesa oral das decisões técnicas.',
      ],
      avaliacao_pratica:
        'Provas 100% em formato digital acessível (Markdown/HTML sem imagens bloqueadas) com leitor NVDA, ampliação de fonte e tempo estendido (+50%).',
      manejo_e_acolhimento:
        'Se uma ferramenta gráfica de laboratório apresentar inacessibilidade ao leitor de tela, substitua imediatamente a interface visual pela equivalente em linha de comando (CLI) ou pareamento técnico.',
    },
  },
  {
    id: 'sol-motor-programacao',
    titulo: 'Deficiência Física / Dificuldade Motora em Laboratório',
    condicao: 'Paralisia Cerebral, Espasticidade, Tetraparesia, LER/DORT ou Tremores',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Lentidão ou dor muscular na digitação em teclado convencional durante aulas práticas de programação e testes de software cronometrados no laboratório.',
    remediosSugeridos: {
      engajamento:
        'Adoção da metodologia de Pair Programming (programação em pares): o aluno atua com destaque como copiloto e arquiteto da lógica do sistema.',
      representacao:
        'Roteiros de laboratório diagramados com diagramas de fluxo de dados (Mermaid/UML) e snippets de código comentados disponíveis antecipadamente no Moodle.',
      acaoExpressao:
        'Tempo estendido (+50%), ferramentas de autocompletar inteligente (Copilot/Snippets), entrega de código versionado no Git e defesa oral do algoritmo.',
      recursosTA: [
        'Teclados mecânicos de ativação leve com colmeia acrílica',
        'Mouse ergonômico vertical ou trackball',
        'Extensões de atalhos e autocompletar na IDE (VS Code)',
        'Suporte ergonômico articulado para apoio dos braços',
      ],
      avaliacaoAcessivel:
        'Avaliação formativa contínua baseada em commits no GitHub e demonstração funcional em vez de digitação em tempo cronometrado.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Forneça o esqueleto do código (boilerplate) já pronto para evitar digitação repetitiva desnecessária. Foque a atividade nas linhas decisivas da lógica.',
      divisao_tarefa_chunking: [
        'Etapa 1: Abrir o projeto pré-estruturado com snippets e autocompletar inteligente habilitados.',
        'Etapa 2: Implementar a regra de negócio central em Pair Programming (atuando como navegador/arquiteto) ou usando ditado/atalhos.',
        'Etapa 3: Demonstrar o funcionamento e sustentar oralmente a solução construída.',
      ],
      avaliacao_pratica:
        'Avalie a arquitetura e a lógica do algoritmo permitindo defesa oral complementar e tempo estendido (+50%), sem exigir digitação extensa do zero.',
      manejo_e_acolhimento:
        'Ao notar fadiga muscular nos membros superiores, incentive pausas de alongamento e permita que o estudante dite a lógica final para o professor ou monitor registrar.',
    },
  },
  {
    id: 'sol-surdez-ti',
    titulo: 'Surdez / Deficiência Auditiva em Computação',
    condicao: 'Surdez, Deficiência Auditiva Bilateral',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Aulas expositivas rápidas e termos técnicos de informática e engenharia de software em inglês sem tradutor intérprete de Libras ou legendagem dificultam o acompanhamento.',
    remediosSugeridos: {
      engajamento:
        'Valorização do estudante em projetos de acessibilidade digital e design visual de interfaces web e móveis.',
      representacao:
        'Disponibilização antecipada de slides e códigos; presença de Tradutor Intérprete de Libras com vocabulário técnico de TI.',
      acaoExpressao:
        'Submissão de código documentado, diagramas arquiteturais e relatórios textuais ou sinalizados em Libras gravados em vídeo.',
      recursosTA: [
        'Softwares de transcrição de áudio em tempo real e legendagem automática',
        'Glossário de sinais de Libras para termos computacionais (algoritmo, banco de dados, rede)',
        'Fones com amplificação sonora para estudantes com resíduo auditivo',
      ],
      avaliacaoAcessivel:
        'Avaliações práticas com apoio de intérprete de Libras para esclarecimento de dúvidas e tempo estendido.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Fale sempre de frente para a turma e em ritmo cadenciado para sincronia com o intérprete de Libras. Nunca explique enquanto escreve de costas para o quadro.',
      divisao_tarefa_chunking: [
        'Etapa 1: Apresentar o mapa visual do conteúdo e o glossário técnico do dia (português/inglês/Libras).',
        'Etapa 2: Desenvolver a prática no computador seguindo roteiro visual ilustrado.',
        'Etapa 3: Validar o código funcionando e apresentar em Libras (com intérprete) ou documentação visual.',
      ],
      avaliacao_pratica:
        'Provas com enunciados diretos em frases curtas (respeitando o português como segunda língua), apoio presencial do intérprete de Libras e foco na execução prática do software.',
      manejo_e_acolhimento:
        'Garanta que avisos orais dados durante o laboratório (como correções de enunciado ou prazos) sejam sempre escritos no quadro ou enviados no chat da turma.',
    },
  },
  {
    id: 'sol-hipotese-sem-laudo',
    titulo: 'Hipótese Diagnóstica / Sem Laudo Fechado (Portaria MEC nº 421/2026)',
    condicao: 'Hipótese de neurodivergência ou transtorno em processo investigativo pelo NAPNE',
    nivelSugerido: 'Ambos',
    descricaoProblema:
      'Dificuldade acadêmica persistente em sala ou laboratório de TI sem que o estudante possua laudo pericial formal fechado, com risco indevido de atraso na concessão de apoios.',
    remediosSugeridos: {
      engajamento:
        'Garantia legal imediata: a Portaria MEC nº 421/2026 assegura que o PEI independe de laudo médico, focando na acolhida pedagógica e redução do estresse escolar.',
      representacao:
        'Diversificação multissensorial dos conteúdos (roteiros em tópicos, recursos visuais, esquemas e áudio explicativo); disponibilização prévia de materiais antes das aulas de laboratório.',
      acaoExpressao:
        'Tempo estendido (+50%) em todas as avaliações, tolerância a erros pontuais de ortografia de código, permissão de consulta orientada e possibilidade de defesa oral da lógica.',
      recursosTA: [
        'Tempo estendido (+50%) em provas e projetos práticos',
        'Extensões de auxílio visual e linter de código na IDE',
        'Formulário de observação pedagógica contínua do NAPNE Campus Paraíso',
        'Enunciados com metodologia DUA em formato claro e direto',
      ],
      avaliacaoAcessivel:
        'Avaliação diagnóstica e formativa processual com feedback imediato, sem dependência de prova única cronometrada.',
    },
    guiaPratico: {
      passo_a_passo_explicacao:
        'Combine explicação visual no projetor com exemplos práticos imediatos. Observe em qual formato (visual, passo a passo escrito ou prática guiada) o estudante responde com maior fluidez.',
      divisao_tarefa_chunking: [
        'Etapa 1: Entregar o roteiro da aula dividido em 3 metas curtas com exemplos de entrada e saída.',
        'Etapa 2: Acompanhar de perto os primeiros 10 minutos de laboratório para destravar dúvidas iniciais.',
        'Etapa 3: Validar a entrega parcial e registrar no painel quais apoios funcionaram melhor.',
      ],
      avaliacao_pratica:
        'Aplique imediatamente tempo estendido (+50%), enunciados claros em tópicos e possibilidade de explicação oral complementar, mesmo sem laudo médico.',
      manejo_e_acolhimento:
        'Acolha o estudante sem exigir justificativas clínicas; tranquilize-o de que a escola adaptará o método de ensino para apoiar seu sucesso na disciplina.',
    },
  },
];

// Gerador Rápido de Novo PEI Completo para Aluno Cadastrado (Suporta múltiplas neurodivergências combinadas)
export function gerarNovoPeiCompleto(dados: {
  nome: string;
  matricula: string;
  idade: string;
  curso: string;
  disciplina: string;
  modulo: string;
  condicao: string;
  docenteRegente: string;
  docenteAee: string;
  solucaoBaseId?: string;
  solucaoBaseIds?: string[];
  statusDiagnostico?: 'confirmado' | 'em_investigacao_hipotese';
  categoriaNeurodivergencia?: string;
}): PEICompleto {
  const idsList =
    dados.solucaoBaseIds && dados.solucaoBaseIds.length > 0
      ? dados.solucaoBaseIds
      : dados.solucaoBaseId
      ? [dados.solucaoBaseId]
      : ['sol-tdah'];

  const solucoesSelecionadas = idsList
    .map((sid) => bancoDeSolucoesPedagogicas.find((s) => s.id === sid))
    .filter(Boolean) as SolucaoCondicao[];

  const solucaoPrimaria = solucoesSelecionadas[0] || bancoDeSolucoesPedagogicas[0];

  const recursosTaCombinados = Array.from(
    new Set(solucoesSelecionadas.flatMap((s) => s.remediosSugeridos.recursosTA))
  );

  const engajamentoCombinado = Array.from(
    new Set([
      ...solucoesSelecionadas.map((s) => `[${s.titulo}]: ${s.remediosSugeridos.engajamento}`),
      'Acompanhamento contínuo dos marcos parciais do projeto.',
      'Reconhecimento das habilidades do estudante perante a turma.',
    ])
  );

  const representacaoCombinada = Array.from(
    new Set([
      ...solucoesSelecionadas.map((s) => `[${s.titulo}]: ${s.remediosSugeridos.representacao}`),
      'Disponibilização antecipada de guias e roteiros de laboratório.',
      'Suporte multissensorial com materiais textuais, diagramas e tutoriais.',
    ])
  );

  const acaoExpressaoCombinada = Array.from(
    new Set([
      ...solucoesSelecionadas.map((s) => `[${s.titulo}]: ${s.remediosSugeridos.acaoExpressao}`),
      'Tempo ampliado (+50%) em atividades avaliativas de laboratório.',
      'Múltiplas formas de demonstração técnica (código, documentação, defesa oral).',
    ])
  );

  const avaliacaoCombinada = solucoesSelecionadas
    .map((s) => s.remediosSugeridos.avaliacaoAcessivel)
    .join(' ');

  const guiaPraticoCombinado = {
    passo_a_passo_explicacao: solucoesSelecionadas
      .map((s) => s.guiaPratico?.passo_a_passo_explicacao)
      .filter(Boolean)
      .join(' '),
    divisao_tarefa_chunking:
      solucaoPrimaria.guiaPratico?.divisao_tarefa_chunking || [
        'Etapa 1: Preparar o ambiente com roteiro objetivo e exemplo guiado.',
        'Etapa 2: Desenvolver o bloco principal da atividade com suporte de recursos de acessibilidade.',
        'Etapa 3: Validar o funcionamento prático e registrar o avanço com feedback imediato.',
      ],
    avaliacao_pratica: solucoesSelecionadas
      .map((s) => s.guiaPratico?.avaliacao_pratica)
      .filter(Boolean)
      .join(' '),
    manejo_e_acolhimento: solucoesSelecionadas
      .map((s) => s.guiaPratico?.manejo_e_acolhimento)
      .filter(Boolean)
      .join(' '),
  };

  const id = `PEI-${Date.now().toString().slice(-4)}`;

  return {
    id,
    cabecalho: {
      estudante: dados.nome,
      codigo_matricula: dados.matricula || `TI-${Math.floor(1000 + Math.random() * 9000)}`,
      idade: dados.idade || '18 anos',
      curso: dados.curso || 'Curso Técnico em Informática / Bacharelado em TI',
      componente_curricular: dados.disciplina || 'Tecnologia da Informação',
      modulo_periodo: dados.modulo || '2º Semestre / 2026',
      data_elaboracao: new Date().toISOString().split('T')[0],
      docente_regente: dados.docenteRegente || 'Prof. Responsável pela Disciplina',
      docente_aee: dados.docenteAee || 'Profª. Especialista do NAPNE',
      profissional_apoio: 'Monitor de Tecnologia Assistiva / Apoio Escolar',
      coordenacao_napne: 'Coordenação NAPNE · Campus Paraíso',
    },
    historico_napne: {
      status_diagnostico: dados.statusDiagnostico || 'confirmado',
      categoria_neurodivergencia:
        dados.categoriaNeurodivergencia ||
        solucoesSelecionadas.map((s) => s.titulo).join(' + ') ||
        (dados.statusDiagnostico === 'em_investigacao_hipotese'
          ? 'Hipótese Diagnóstica / Em Investigação pelo NAPNE'
          : 'Neurodivergência / Condição Acompanhada'),
      cid_ou_hipotese:
        dados.statusDiagnostico === 'em_investigacao_hipotese'
          ? 'Em investigação pedagógica multiprofissional (Portaria MEC nº 421/2026)'
          : 'Diagnóstico confirmado em prontuário NAPNE',
      breve_historico_clinico_familiar: `Estudante do ${dados.curso} no Campus Paraíso. Acompanhado pelo NAPNE com foco na garantia do direito à educação inclusiva e acessibilidade curricular nos termos da Portaria MEC nº 421/2026 e Decreto nº 12.686/2025.${
        dados.statusDiagnostico === 'em_investigacao_hipotese'
          ? ' Atendimento pedagógico iniciado com base nas barreiras escolares observadas, sem dependência de laudo pericial prévio.'
          : ''
      }`,
      descricao_condicao_especifica: dados.condicao || solucaoPrimaria.descricaoProblema,
      informacoes_dos_pais: 'Estudante e família em alinhamento constante com o NAPNE Campus Paraíso e coordenação de curso.',
    },
    estudo_de_caso: {
      barreiras: [
        {
          id: 'B1',
          categoria: 'metodologica',
          descricao: `Metodologia de ensino em ${dados.disciplina} focada exclusivamente em formato único sem opções acessíveis para ${solucoesSelecionadas.map((s) => s.titulo).join(' + ')}.`,
          impacto: 'Dificuldade de demonstração plena da capacidade técnica na ausência de recursos adaptados.',
          estrategia_enfrentamento: solucoesSelecionadas.map((s) => s.remediosSugeridos.acaoExpressao).join(' '),
        },
        {
          id: 'B2',
          categoria: 'tecnologica',
          descricao: 'Ambientes de desenvolvimento e computadores de laboratório sem configuração prévia de acessibilidade.',
          impacto: 'Sobrecarga visual, sensorial ou executiva durante atividades práticas prolongadas.',
          estrategia_enfrentamento: `Instalação e configuração de: ${recursosTaCombinados.join(', ')}.`,
        },
        {
          id: 'B3',
          categoria: 'atitudinal',
          descricao: 'Risco de expectativas rebaixadas ou desconhecimento das potencialidades técnicas do aluno pela turma.',
          impacto: 'Isolamento em trabalhos práticos de equipe.',
          estrategia_enfrentamento: 'Planejamento docente com metodologias ativas e valorização das contribuições do estudante.',
        },
      ],
      potencialidades: [
        {
          id: 'P1',
          area: 'Capacidade Analítica & Computacional',
          descricao: 'Motivação para resolução de problemas e aprendizado prático de ferramentas de TI.',
          apoio_demandado: 'Orientação personalizada em projetos de desenvolvimento.',
        },
        {
          id: 'P2',
          area: 'Trabalho Colaborativo',
          descricao: 'Excelente cooperação em duplas estruturadas com objetivos transparentes.',
          apoio_demandado: 'Incentivo contínuo ao trabalho compartilhado.',
        },
      ],
      recursos_ta: recursosTaCombinados,
      sintese_observacao: {
        interacao_professores: 'Receptivo e proativo nas orientações pedagógicas.',
        interacao_colegas: 'Excelente entrosamento em equipes de desenvolvimento.',
        tarefas_coletivas: 'Participa com responsabilidade nas etapas atribuídas.',
        interesses_centrais: dados.disciplina,
        habilidades_tecnicas: 'Pensamento computacional e capacidade lógica.',
        autonomia_rotina: 'Autônomo com suporte dos recursos de acessibilidade recomendados.',
      },
    },
    planejamento_pei: {
      conteudo_ementa_oficial: `Ementa Oficial do Componente Curricular: ${dados.disciplina}. Abordagem dos conceitos fundamentais teóricos e práticos de desenvolvimento e aplicação.`,
      competencias_habilidades_ementa: `Desenvolver competências técnicas, operacionais e de raciocínio lógico em ${dados.disciplina}, aplicando boas práticas da profissão.`,
      adaptacao_flexibilizacao_curricular:
        'Currículo mantido na íntegra sem rebaixamento conceitual. Acessibilidade promovida nas formas de representação dos conteúdos e nos canais de expressão técnica.',
      objetivos_e_metas: [
        {
          id_meta: 'M1',
          descricao_meta: `Compreender e aplicar os fundamentos centrais de ${dados.disciplina} através de atividades estruturadas com DUA 3.0.`,
          prazo: 'Mensal (4 semanas)',
          indicador_sucesso: 'Execução autônoma de projeto prático documentado e com funcionamento validado.',
          progresso_percentual: 60,
          status: 'em_andamento',
        },
        {
          id_meta: 'M2',
          descricao_meta: `Integrar os apoios de Tecnologia Assistiva e flexibilizações de laboratório para atender simultaneamente a: ${solucoesSelecionadas.map((s) => s.titulo).join(' + ')}.`,
          prazo: 'Bimestral (8 semanas)',
          indicador_sucesso: 'Apresentação técnica com validação entre pares e feedback formativo do docente.',
          progresso_percentual: 35,
          status: 'em_andamento',
        },
      ],
      flexibilizacao_metodologica_dua: {
        engajamento: engajamentoCombinado,
        representacao: representacaoCombinada,
        acao_e_expressao: acaoExpressaoCombinada,
      },
      gestao_sala_de_aula: {
        organizacao_espacial: 'Bancada de laboratório acessível com layout ergonômico e espaço para circulação.',
        rotina_e_pausas: 'Pausas programadas a cada 45-60 minutos para prevenção de fadiga física e sensorial.',
        agrupamentos_e_tutoria: 'Trabalho em duplas colaborativas com papéis técnicos definidos.',
        suporte_docente_semanal: 'Sessão semanal de alinhamento pedagógico entre docente técnico e NAPNE.',
      },
      estrategias_avaliacao: {
        formato_acessivel: avaliacaoCombinada,
        criterio_de_sucesso: 'Compreensão técnica, corretude lógica e aplicação prática dos conceitos da ementa.',
        grau_mediacao: 'pouca_mediacao',
        tempo_e_espaco: 'Tempo estendido (+50%) em ambiente de laboratório com recursos de TA disponíveis.',
        recursos_utilizados: recursosTaCombinados,
      },
      observacoes_docente: `O PEI foi estruturado de forma personalizada para ${dados.nome}, integrando as acomodações recomendadas para ${solucoesSelecionadas.map((s) => s.titulo).join(' + ')} com foco no desenvolvimento de autonomia e excelência técnica.`,
      guia_pratico_sala_de_aula: guiaPraticoCombinado,
    },
    painel_notas: [
      {
        id: `N_init_${Date.now()}`,
        autor: dados.docenteRegente || 'Docente Responsável',
        papel: 'Regente',
        categoria: 'objetivos',
        conteudo: `Início do acompanhamento pedagógico inclusivo para ${dados.disciplina}. Metas pactuadas no PEI.`,
        data: new Date().toLocaleDateString('pt-BR'),
        cor: 'green',
      },
    ],
    metricas: {
      percentual_metas_alcancadas: 45,
      nivel_autonomia: 4,
      engajamento: 5,
      sessoes_semanais_realizadas: 4,
      status_geral: 'EM_ANDAMENTO',
    },
    parecer_pedagogico: `PEI elaborado em consonância com a Portaria MEC nº 421/2026 e Decreto nº 12.686/2025 para assegurar o pleno direito à escolarização técnica e superior com equidade.`,
    sugestoes_proximo_ciclo: [
      'Manter as sessões semanais de suporte pedagógico com o NAPNE.',
      'Acompanhar a evolução das metas no conselho de classe / colegiado de curso.',
    ],
  };
}

/**
 * Retorna o identificador anônimo/confidencial do estudante para visualização externa (Hub e listas públicas),
 * preservando a privacidade até que o docente acesse o PEI específico.
 */
export function getIdentificadorConfidencial(pei: PEICompleto, index?: number): string {
  const isSuperior =
    pei.cabecalho.curso.toLowerCase().includes('superior') ||
    pei.cabecalho.curso.toLowerCase().includes('sistemas');
  const modalidade = isSuperior ? 'Superior TI' : 'Médio Técnico';
  const numLabel = index !== undefined ? `#${index + 1}` : '';
  const codMat = pei.cabecalho.codigo_matricula
    ? `[${pei.cabecalho.codigo_matricula}]`
    : '';
  return `PEI ${numLabel} · ${modalidade} ${codMat}`.trim();
}

