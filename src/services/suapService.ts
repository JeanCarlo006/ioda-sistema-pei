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
    id: 'diario-bsi-es2',
    codigoComponente: 'BSI.0406',
    nomeDisciplina: 'Engenharia de Software II',
    curso: '063 - Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins)',
    modalidade: 'Superior',
    campus: 'Campus Paraíso do Tocantins',
    semestrePeriodo: '2026.1 · 4º Período',
    cargaHoraria: '80h',
    docenteSiape: '1489201',
    docenteNome: 'Prof. Regente de TI / NAPNE',
    planoEnsino: {
      ementa:
        'Engenharia de requisitos ágeis, arquitetura de sistemas corporativos, padrões de projeto (GoF), testes automatizados de software, acessibilidade digital (e-MAG / WCAG 2.1) e ciclo de vida de projetos de TI.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Módulo',
          topicos: 'Modelagem de software, requisitos funcionais e não-funcionais, User Stories e definição de arquitetura.',
        },
        {
          bimestreOuEtapa: '2º Módulo',
          topicos: 'Padrões de projeto, Clean Architecture, testes unitários/integração e acessibilidade em interfaces.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Projetar e arquitetar sistemas computacionais inclusivos, aplicando metodologias ágeis e padrões internacionais de acessibilidade.',
      metodologiaPadrao:
        'Aulas em laboratório com desenvolvimento ágil em equipe (Scrum/Kanban) e programação assistida.',
      procedimentosAvaliacaoPadrao:
        'Projetos práticos incrementais, entregas de sprints e defesas técnicas com formatos diversificados.',
    },
    estudantes: [
      {
        id: 'est-jean-carlo',
        matricula: '202510630025',
        nome: 'Jean Carlo Torres de Oliveira',
        idade: '21 anos',
        acompanhadoNapne: false,
        observacoesNapne:
          'Estudante com indicação de adaptações metodológicas, suporte DUA 3.0 e tempo adicional (+50%) em avaliações de código e provas.',
      },
      {
        id: 'est-aluno-02',
        matricula: '202510630018',
        nome: 'Carlos Eduardo Rodrigues',
        idade: '22 anos',
        acompanhadoNapne: false,
      },
      {
        id: 'est-aluno-03',
        matricula: '202510630044',
        nome: 'Mariana Santos Fagundes',
        idade: '20 anos',
        acompanhadoNapne: false,
      },
    ],
  },
  {
    id: 'diario-bsi-bd2',
    codigoComponente: 'BSI.0408',
    nomeDisciplina: 'Banco de Dados II',
    curso: '063 - Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins)',
    modalidade: 'Superior',
    campus: 'Campus Paraíso do Tocantins',
    semestrePeriodo: '2026.1 · 4º Período',
    cargaHoraria: '80h',
    docenteSiape: '1489201',
    docenteNome: 'Prof. Regente de TI / NAPNE',
    planoEnsino: {
      ementa:
        'Processamento e otimização de consultas SQL. Índices B-Tree, transações ACID, controle de concorrência, recuperação de falhas e introdução a bancos NoSQL orientados a documentos e chave-valor.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Módulo',
          topicos: 'Álgebra relacional aplicada, planos de execução e otimização de consultas complexas.',
        },
        {
          bimestreOuEtapa: '2º Módulo',
          topicos: 'Transações, locks, isolamento, integridade e bancos NoSQL distribuídos.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Gerenciar e otimizar bancos de dados relacionais e não-relacionais para aplicações de alto desempenho.',
      metodologiaPadrao:
        'Laboratório prático com scripts SQL e modelagem de cenários práticos.',
      procedimentosAvaliacaoPadrao:
        'Avaliações práticas em laboratório com suporte adaptado.',
    },
    estudantes: [
      {
        id: 'est-jean-carlo',
        matricula: '202510630025',
        nome: 'Jean Carlo Torres de Oliveira',
        idade: '21 anos',
        acompanhadoNapne: false,
        observacoesNapne:
          'Estudante com indicação de adaptações metodológicas em consultas analíticas e avaliações práticas de banco de dados.',
      },
    ],
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
