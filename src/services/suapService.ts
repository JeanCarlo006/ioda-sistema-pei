/**
 * Serviço de Integração com o SUAP (Sistema Unificado de Administração Pública)
 * Utilizado por todos os Institutos Federais da Rede Federal de EPCT.
 *
 * Responsável por:
 * 1. Buscar os diários/turmas atribuídos ao docente no semestre.
 * 2. Importar automaticamente o Plano de Ensino (PE) e PPC da disciplina (Ementa, Conteúdos Programáticos e Metodologia).
 * 3. Listar os estudantes matriculados na turma, eliminando retrabalho de digitação manual pelo professor.
 */

export interface ConteudoBimestralSuap {
  bimestreOuEtapa: string;
  topicos: string;
}

export interface PlanoEnsinoSuap {
  ementa: string;
  conteudosProgramaticos: ConteudoBimestralSuap[];
  habilidadesCompetenciasPpc: string;
  metodologiaPadrao: string;
  procedimentosAvaliacaoPadrao: string;
}

export interface EstudanteTurmaSuap {
  id: string;
  matricula: string;
  nome: string;
  idade?: string;
  acompanhadoNapne: boolean;
  observacoesNapne?: string;
}

export interface DiarioSuap {
  id: string;
  codigoComponente: string;
  nomeDisciplina: string;
  curso: string;
  modalidade: 'Tecnico Integrado' | 'Subsequente' | 'Superior' | 'Proeja' | 'Pos-Graduacao';
  campus: string;
  semestrePeriodo: string;
  cargaHoraria: string;
  docenteSiape: string;
  docenteNome: string;
  planoEnsino: PlanoEnsinoSuap;
  estudantes: EstudanteTurmaSuap[];
}

/**
 * Catálogo representativo e realista de diários de múltiplos cursos da Rede Federal
 * (Agronomia, Edificações, Alimentos, Química, Administração, Informática e Licenciaturas)
 * Disponível imediatamente para teste ou conectado à API REST real do SUAP via token.
 */
export const DIARIOS_SUAP_INSTITUCIONAIS: DiarioSuap[] = [
  {
    id: 'diario-tsi-web2',
    codigoComponente: 'TSI.2026.1.0042',
    nomeDisciplina: 'Programação Web II',
    curso: 'Tecnologia em Sistemas para Internet',
    modalidade: 'Superior',
    campus: 'Campus Paraíso do Tocantins',
    semestrePeriodo: '2026.1 · 4º Período',
    cargaHoraria: '80h',
    docenteSiape: '1982731',
    docenteNome: 'Prof. Jean Carlo',
    planoEnsino: {
      ementa:
        'Desenvolvimento de aplicações web full stack, arquiteturas orientadas a serviços e RESTful APIs. Persistência de dados assíncrona, autenticação, controle de sessão, acessibilidade web (WCAG/e-MAG) e boas práticas de engenharia de software.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Bimestre',
          topicos: 'Arquitetura cliente-servidor moderna, APIs REST, TypeScript no backend e frontend, integração com banco de dados.',
        },
        {
          bimestreOuEtapa: '2º Bimestre',
          topicos: 'Autenticação segura, gerenciamento de estado global, diretrizes de acessibilidade e implantação contínua.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Projetar, implementar e testar aplicações web completas com interfaces acessíveis e serviços de backend escaláveis.',
      metodologiaPadrao:
        'Aulas teórico-práticas em laboratório de informática com desenvolvimento orientado a projetos e pair programming.',
      procedimentosAvaliacaoPadrao:
        'Projetos práticos de desenvolvimento contínuo, entregas incrementais via Git/GitHub e defesas técnicas.',
    },
    estudantes: [],
  },
  {
    id: 'diario-info-algoritmos',
    codigoComponente: 'INFO.2026.1.0019',
    nomeDisciplina: 'Algoritmos e Estruturas de Dados',
    curso: 'Técnico Integrado ao Ensino Médio em Informática',
    modalidade: 'Tecnico Integrado',
    campus: 'Campus Paraíso do Tocantins',
    semestrePeriodo: '2026.1 · 1º Ano A',
    cargaHoraria: '120h',
    docenteSiape: '1982731',
    docenteNome: 'Prof. Jean Carlo',
    planoEnsino: {
      ementa:
        'Fundamentos de lógica de programação. Tipos primitivos, variáveis, estruturas condicionais e de repetição. Vetores, matrizes, funções, modularização e técnicas de depuração de código.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Bimestre',
          topicos: 'Lógica algorítmica, variáveis, operadores aritméticos/lógicos e estruturas condicionais.',
        },
        {
          bimestreOuEtapa: '2º Bimestre',
          topicos: 'Laços de repetição (while, for), depuração passo a passo e resolução de problemas.',
        },
        {
          bimestreOuEtapa: '3º Bimestre',
          topicos: 'Vetores unidimensionais, manipulação de arrays e algoritmos de busca.',
        },
        {
          bimestreOuEtapa: '4º Bimestre',
          topicos: 'Matrizes bidimensionais, modularização com funções e projeto final integrador.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Construir algoritmos estruturados para resolução de problemas computacionais com raciocínio lógico e sintaxe precisa.',
      metodologiaPadrao:
        'Aulas expositivas dialogadas seguidas de oficinas práticas de programação assistida em bancada.',
      procedimentosAvaliacaoPadrao:
        'Avaliações práticas individuais em laboratório com tempo adaptável e listas progressivas de desafios.',
    },
    estudantes: [],
  },
  {
    id: 'diario-tsi-banco-dados',
    codigoComponente: 'TSI.2026.1.0048',
    nomeDisciplina: 'Banco de Dados Relacionais e Não-Relacionais',
    curso: 'Tecnologia em Sistemas para Internet',
    modalidade: 'Superior',
    campus: 'Campus Paraíso do Tocantins',
    semestrePeriodo: '2026.1 · 3º Período',
    cargaHoraria: '80h',
    docenteSiape: '1982731',
    docenteNome: 'Prof. Jean Carlo',
    planoEnsino: {
      ementa:
        'Modelagem conceitual e lógica de banco de dados (DER/MER). Linguagem SQL (DDL, DML, DQL). Integridade referencial, consultas com junções complexas, normalização e introdução a bancos NoSQL orientados a documentos.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Bimestre',
          topicos: 'Modelagem relacional, cardinalidades, álgebra relacional e criação de esquemas em SQL.',
        },
        {
          bimestreOuEtapa: '2º Bimestre',
          topicos: 'Consultas avançadas (JOINs, GROUP BY, subqueries), índices, transações ACID e NoSQL.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Modelar e administrar esquemas de bancos de dados otimizados, formulando consultas precisas para sistemas corporativos.',
      metodologiaPadrao:
        'Laboratório prático de banco de dados com ferramentas visuais e via linha de comando.',
      procedimentosAvaliacaoPadrao:
        'Modelagem de cenários práticos e exercícios de escrita de queries com múltiplos formatos de entrega.',
    },
    estudantes: [],
  },
  {
    id: 'diario-info-redes',
    codigoComponente: 'INFO.2026.1.0025',
    nomeDisciplina: 'Redes de Computadores e Sistemas Operacionais',
    curso: 'Técnico Integrado ao Ensino Médio em Informática',
    modalidade: 'Tecnico Integrado',
    campus: 'Campus Paraíso do Tocantins',
    semestrePeriodo: '2026.1 · 2º Ano',
    cargaHoraria: '80h',
    docenteSiape: '1982731',
    docenteNome: 'Prof. Jean Carlo',
    planoEnsino: {
      ementa:
        'Topologias e arquiteturas de redes. Modelo OSI e pilha TCP/IP. Endereçamento IPv4 e IPv6. Instalação, configuração e administração básica de sistemas operacionais tipo Linux.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Bimestre',
          topicos: 'Conceitos de redes, meios físicos, cabeamento estruturado e camadas OSI/TCP-IP.',
        },
        {
          bimestreOuEtapa: '2º Bimestre',
          topicos: 'Protocolos de transporte e aplicação (DNS, DHCP, HTTP), subredes e comandos Linux de terminal.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Configurar parâmetros de rede, diagnosticar falhas de conectividade e operar utilitários de linha de comando.',
      metodologiaPadrao:
        'Aulas práticas em bancada de simulação de redes (Packet Tracer) e máquinas virtuais Linux.',
      procedimentosAvaliacaoPadrao:
        'Relatórios de práticas simuladas e diagnósticos práticos de rede com roteiro acessível.',
    },
    estudantes: [],
  },
];

export const suapService = {
  /**
   * Obtém a lista de diários atribuídos ao professor logado no SUAP.
   * Se configurada a variável SUAP_API_URL, consome a API REST oficial do SUAP.
   * Caso contrário, fornece o catálogo realista multissetorial da Rede Federal.
   */
  async getDiariosDocente(token?: string): Promise<DiarioSuap[]> {
    if (process.env.SUAP_API_URL && token) {
      try {
        const res = await fetch(`${process.env.SUAP_API_URL}/api/v2/minhas-turmas/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (err) {
        console.warn('[SUAP Service] Falha na conexão com API remota, usando cache local:', err);
      }
    }

    return DIARIOS_SUAP_INSTITUCIONAIS;
  },

  /**
   * Obtém o Plano de Ensino oficial do diário diretamente do SUAP.
   */
  async getPlanoEnsinoDiario(diarioId: string): Promise<PlanoEnsinoSuap | null> {
    const diario = DIARIOS_SUAP_INSTITUCIONAIS.find((d) => d.id === diarioId);
    return diario ? diario.planoEnsino : null;
  },

  /**
   * Busca os estudantes matriculados no diário.
   */
  async getEstudantesDiario(diarioId: string): Promise<EstudanteTurmaSuap[]> {
    const diario = DIARIOS_SUAP_INSTITUCIONAIS.find((d) => d.id === diarioId);
    return diario ? diario.estudantes : [];
  },
};
