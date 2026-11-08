import { DisciplinaPpcPreset } from '../types/pei';

export const presetsDisciplinasPpc: DisciplinaPpcPreset[] = [
  // --- AGROPECUÁRIA & CIÊNCIAS AGRÁRIAS ---
  {
    id: 'agro-0201',
    codigo: 'AGR.0201',
    nome: 'Zootecnia Geral e Manejo Animal',
    periodo: '2º Ano',
    curso: 'Técnico em Agropecuária Integrado',
    ementa:
      'Manejo sanitário e nutricional de rebanhos; Fisiologia animal aplicada; Instalações zootécnicas; Bem-estar animal, biossegurança em campo e registros zootécnicos em planilhas de campo.',
    competencias:
      'Compreender o comportamento animal e aplicar técnicas de manejo sem estresse; Executar dosagens sanitárias com precisão; Registrar dados de ganho de peso e alimentação; Respeitar protocolos de segurança no curral.',
    barreirasComunsTi: [
      'Hipersensibilidade olfativa ou tátil com materiais biológicos e esterco no campo',
      'Sobrecarga sensorial com ruídos intensos de animais e maquinários agrícolas',
      'Dificuldade de regulação motora fina na medição rápida de doses de medicamentos em campo',
    ],
    adaptacaoSugeridaPadrao:
      'Uso de equipamentos de proteção individual adaptados (abafadores de ruído, luvas respiráveis); Roteiro impresso plastificado para etapas do manejo; Parcerias com colegas tutores em atividades externas de campo.',
  },
  {
    id: 'agro-0403',
    codigo: 'AGR.0403',
    nome: 'Mecanização Agrícola e Irrigação',
    periodo: '3º Ano',
    curso: 'Técnico em Agropecuária Integrado',
    ementa:
      'Tratores e implementos agrícolas; Regulagem de semeadoras e pulverizadores; Sistemas de irrigação (gotejamento, aspersão); Segurança no trabalho rural (NR-31) e manutenção preventiva.',
    competencias:
      'Identificar componentes mecânicos de maquinário agrícola; Efetuar regulagens de vazão e profundidade; Operar sistemas de irrigação racionalizando o uso de água; Seguir normas de segurança operacional.',
    barreirasComunsTi: [
      'Ansiedade em operar equipamentos mecânicos com vibração intensa ou motores ruidosos',
      'Dificuldade com raciocínio proporcional e cálculo de vazão/pressão em tempo real',
      'Desconforto com exposição solar prolongada sem intervalos estruturados de hidratação',
    ],
    adaptacaoSugeridaPadrao:
      'Checklist visual passo a passo colado no painel da máquina ou prancheta; Uso de calculadora e tabelas de consulta para calibração; Pausas programadas na sombra.',
  },

  // --- EDIFICAÇÕES & ENGENHARIA CIVIL ---
  {
    id: 'edif-0301',
    codigo: 'EDF.0301',
    nome: 'Desenho Técnico Arquitetônico e CAD',
    periodo: '2º Módulo',
    curso: 'Técnico em Edificações',
    ementa:
      'Normas técnicas de desenho (NBR 6492); Plantas baixas, cortes, fachadas e coberturas; Escalas e cotagem; Introdução a softwares CAD/BIM e representação espacial bidimensional e tridimensional.',
    competencias:
      'Ler e interpretar projetos arquitetônicos; Elaborar pranchas técnicas normalizadas; Desenvolver representações gráficas em ambiente CAD com exatidão de medidas e camadas.',
    barreirasComunsTi: [
      'Dificuldade na transposição espacial tridimensional para a representação ortogonal 2D',
      'Fadiga executiva na conferência repetitiva de cotas milimétricas em pranchas densas',
      'Sobrecarga visual no monitor de CAD com múltiplas linhas de diferentes espessuras e cores',
    ],
    adaptacaoSugeridaPadrao:
      'Configuração de temas de alto contraste no AutoCAD/LibreCAD; Utilização de modelos físicos/maquetes táteis simples para visualização prévia de cortes; Fragmentação de pranchas em etapas modulares.',
  },

  // --- QUÍMICA & ALIMENTOS ---
  {
    id: 'quim-0102',
    codigo: 'QUI.0102',
    nome: 'Química Geral Experimental e Laboratório',
    periodo: '1º Módulo',
    curso: 'Técnico em Química / Alimentos',
    ementa:
      'Segurança em laboratório de química; Vidrarias e equipamentos de medição volumétrica e gravimétrica; Separação de misturas; Soluções, concentração, titulação ácido-base e relatórios experimentais.',
    competencias:
      'Manusear reagentes e vidrarias com segurança; Preparar soluções com cálculos estequeométricos corretos; Registrar observações empíricas e redigir relatórios técnicos padronizados.',
    barreirasComunsTi: [
      'Hipersensibilidade a odores fortes de reagentes ou receio excessivo de contaminação/acidentes',
      'Coordenação motora fina ao zerar buretas ou meniscos em titulações',
      'Fadiga executiva ao redigir relatórios experimentais extensos sem esqueleto pré-formatado',
    ],
    adaptacaoSugeridaPadrao:
      'Bancada próxima à capela de exaustão com boa ventilação; Pipetadores automáticos para facilitar manuseio volumétrico; Roteiro de relatório experimental semiestruturado em tópicos objetivos.',
  },

  // --- ADMINISTRAÇÃO & GESTÃO ---
  {
    id: 'adm-0402',
    codigo: 'ADM.0402',
    nome: 'Gestão de Pessoas e Comportamento Organizacional',
    periodo: '3º Módulo',
    curso: 'Técnico em Administração',
    ementa:
      'Teorias motivacionais e liderança; Comunicação interpessoal nas organizações; Recrutamento e seleção; Dinâmicas de equipe e resolução de conflitos; Legislação trabalhista e clima organizacional.',
    competencias:
      'Analisar dinâmicas organizacionais; Elaborar perfis de cargos e critérios de avaliação; Comunicar-se com clareza em diferentes contextos profissionais; Promover práticas inclusivas no trabalho.',
    barreirasComunsTi: [
      'Ansiedade social em dinâmicas de grupo, simulações de entrevista ou dramatizações em sala',
      'Dificuldade em decodificar comunicações implícitas, sarcasmos ou entonações subjetivas',
      'Sobrecarga com textos teóricos longos de psicologia organizacional sem síntese visual',
    ],
    adaptacaoSugeridaPadrao:
      'Opção por análise escrita de estudos de caso reais ao invés de encenações teatrais; Mapas conceituais claros das teorias administrativas; Critérios objetivos e explícitos de avaliação.',
  },

  // --- INFORMÁTICA & SISTEMAS DE INFORMAÇÃO ---
  {
    id: 'bac-0406',
    codigo: 'BAC.0406',
    nome: 'Engenharia de Software',
    periodo: '4º Período',
    curso: 'BSI (Sistemas de Informação)',
    ementa:
      'Conceitos fundamentais de engenharia de software; Ciclo de vida do software; Processos de desenvolvimento ágil (Scrum/Kanban) e cascata; Engenharia de requisitos e histórias de usuário; Modelagem de sistemas com UML (diagramas de caso de uso e classes); Testes de software; Qualidade e gerência de configuração.',
    competencias:
      'Compreender os processos de ciclo de vida de software; Saber elicitar e documentar requisitos com acessibilidade; Modelar sistemas orientados a objetos; Trabalhar colaborativamente em equipes ágeis; Aplicar testes de unidade e critérios de aceitação.',
    barreirasComunsTi: [
      'Sobrecarga sensorial e atrito social em dinâmicas de grupo e reuniões diárias (Daily Scrum)',
      'Dificuldade de abstração e decodificação de múltiplos diagramas UML complexos em uma única tela',
      'Ansiedade diante de prazos curtos de Sprints e entregas parciais de software',
    ],
    adaptacaoSugeridaPadrao:
      'Papéis bem delimitados no Scrum (ex: estudante como especialista em testes ou arquitetura de dados); Uso de ferramentas visuais com alto contraste para UML (Draw.io/PlantUML); Entrega de requisitos em checklists lineares sem excesso de texto denso.',
  },
  {
    id: 'bac-0102',
    codigo: 'BAC.0102',
    nome: 'Algoritmos e Programação Estruturada',
    periodo: '1º Período',
    curso: 'BSI (Sistemas de Informação)',
    ementa:
      'Lógica de programação e pensamento computacional; Conceito de variáveis, tipos de dados e operadores; Estruturas condicionais (se/senão, escolha); Estruturas de repetição (enquanto, para); Vetores, matrizes e cadeias de caracteres; Modularização, funções, passagem de parâmetros por valor e referência.',
    competencias:
      'Desenvolver raciocínio lógico formal; Implementar e depurar algoritmos em linguagem estruturada (C/Python); Resolver problemas computacionais fracionando em subproblemas; Manipular memória e coleções homogêneas.',
    barreirasComunsTi: [
      'Sobrecarga de sintaxe estrita (erros de compilação por pontuação que causam frustração e desregulação)',
      'Dificuldade em visualizar fluxos de repetição e vetores na memória sem recursos gráficos',
      'Fadiga ocular no editor de código com cores e contrastes inadequados',
    ],
    adaptacaoSugeridaPadrao:
      'Uso de representações gráficas (Python Tutor, diagramas de blocos) para rastreio de memória; Depuração guiada permitindo consulta a um guia de sintaxe básico plastificado; Fragmentação de listas de exercícios em baterias curtas de 3 questões com dificuldade gradual.',
  },
  {
    id: 'bac-0305',
    codigo: 'BAC.0305',
    nome: 'Banco de Dados Relacional e SQL',
    periodo: '3º Período',
    curso: 'BSI (Sistemas de Informação)',
    ementa:
      'Sistemas Gerenciadores de Banco de Dados (SGBD); Modelo Entidade-Relacionamento (MER) conceitual e lógico; Normalização até a 3ª Forma Normal; Linguagem SQL: DDL (definição de tabelas, chaves primárias e estrangeiras) e DML (SELECT com JOINs, GROUP BY, subqueries); Transações e integridade relacional.',
    competencias:
      'Modelar bancos de dados a partir de requisitos de negócio; Normalizar estruturas relacionais; Escrever consultas SQL eficientes e com integridade de dados; Administrar instâncias básicas de SGBD (PostgreSQL/MySQL).',
    barreirasComunsTi: [
      'Abstração de relacionamentos muitos-para-muitos (N:N) e junções (JOINs) sem representação visual',
      'Sobrecarga cognitiva na digitação de scripts SQL longos sem autocompletar adaptado',
      'Pânico ao manipular comandos destrutivos (DELETE/UPDATE) em ambiente de avaliação',
    ],
    adaptacaoSugeridaPadrao:
      'Uso de diagramas com código de cores para tabelas de junção; Banco de testes isolado (sandbox individual) para que o erro não gere frustração catastrófica; Avaliação focada na lógica relacional com consulta autorizada a diagramas conceituais.',
  },
];
