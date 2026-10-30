import { DisciplinaPpcPreset } from '../types/pei';

export const presetsDisciplinasPpc: DisciplinaPpcPreset[] = [
  {
    id: 'bac-0406',
    codigo: 'BAC.0406',
    nome: 'Engenharia de Software',
    periodo: '4º Período',
    curso: 'BSI',
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
    curso: 'BSI',
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
    curso: 'BSI',
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
  {
    id: 'bac-0504',
    codigo: 'BAC.0504',
    nome: 'Programação Web e Dispositivos Móveis',
    periodo: '5º Período',
    curso: 'BSI',
    ementa:
      'Arquitetura cliente-servidor e protocolo HTTP; HTML5 semântico, CSS3 flexbox/grid e acessibilidade digital (WCAG 2.2); JavaScript assíncrono (DOM, Fetch/Promises); Desenvolvimento de APIs RESTful; Frameworks modernos de frontend (React) e introdução a aplicações móveis responsivas.',
    competencias:
      'Construir interfaces web acessíveis e semânticas; Consumir e produzir APIs REST; Implementar componentes interativos responsivos; Aplicar boas práticas de usabilidade e Desenho Universal.',
    barreirasComunsTi: [
      'Dispersão com excesso de ferramentas de build (Node, NPM, Vite) e múltiplos arquivos abertos simultaneamente',
      'Dificuldade de coordenação motora fina em testes rápidos em telas touchscreen de celular',
      'Sobrecarga sensorial com interfaces de desenvolvimento muito coloridas ou com animações constantes',
    ],
    adaptacaoSugeridaPadrao:
      'Projetos em templates estruturados pré-configurados (reduzindo atrito de setup); Foco nos critérios de acessibilidade do próprio DUA/WCAG como projeto prático; Avaliação através de entregas incrementais de funcionalidades (milestones).',
  },
  {
    id: 'tec-0101',
    codigo: 'INF.0101',
    nome: 'Lógica e Ferramentas Digitais (Técnico Integrado)',
    periodo: '1º Ano',
    curso: 'Técnico',
    ementa:
      'Introdução à informática, hardware e sistemas operacionais; Ambientes virtuais de aprendizagem; Ética e segurança digital; Introdução à lógica de blocos e algoritmos visuais (Scratch/Blockly); Ferramentas colaborativas de texto e planilhas.',
    competencias:
      'Operar computadores com autonomia; Organizar arquivos e pastas; Resolver problemas simples de lógica usando blocos; Utilizar a tecnologia de forma ética e colaborativa.',
    barreirasComunsTi: [
      'Dificuldade de transição entre o Ensino Fundamental e a rotina do Ensino Médio Técnico Integrado',
      'Ansiedade em interagir com novos ambientes e prazos no laboratório',
      'Distração com abas do navegador e internet durante a aula prática',
    ],
    adaptacaoSugeridaPadrao:
      'Roteiro de aula impresso na bancada com checklist de tarefas; Fones de cancelamento de ruído disponíveis no laboratório; Uso prioritário de ferramentas visuais em blocos com reforço positivo imediato.',
  },
];
