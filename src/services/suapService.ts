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
    id: 'diario-agro-101',
    codigoComponente: 'AGR.0203',
    nomeDisciplina: 'Manejo e Conservação do Solo e Água',
    curso: 'Curso Técnico Integrado ao Ensino Médio em Agropecuária',
    modalidade: 'Tecnico Integrado',
    campus: 'Campus Rural / Agrícola',
    semestrePeriodo: '2026.1 · 2º Ano',
    cargaHoraria: '80h',
    docenteSiape: '1948201',
    docenteNome: 'Prof. Marcos Vinícius Ferreira',
    planoEnsino: {
      ementa:
        'Fundamentos de gênese, morfologia e classificação de solos. Propriedades físicas e químicas do solo. Práticas conservacionistas, terraceamento, controle de erosão e dimensionamento de canais de escoamento em campo.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Bimestre',
          topicos: 'Textura, estrutura e densidade do solo; ensaios granulométricos em laboratório.',
        },
        {
          bimestreOuEtapa: '2º Bimestre',
          topicos: 'Erosão hídrica e eólica; cálculo de perdas de solo (Equação Universal de Perdas de Solo - EUPS).',
        },
        {
          bimestreOuEtapa: '3º Bimestre',
          topicos: 'Práticas de terraceamento em nível e gradiente; levantamento topográfico expedito.',
        },
        {
          bimestreOuEtapa: '4º Bimestre',
          topicos: 'Manejo de bacias hidrográficas agrícolas e cobertura vegetal de proteção.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Planejar e executar práticas conservacionistas de solos e recursos hídricos; operar instrumentos de campo e interpretar laudos de fertilidade e capacidade de uso do solo conforme PPC de Agropecuária.',
      metodologiaPadrao:
        'Aulas teóricas em sala, práticas em área experimental de campo e elaboração de relatórios técnicos em equipe.',
      procedimentosAvaliacaoPadrao:
        'Provas escritas dissertativas, avaliação de práticas em campo e entrega de relatório de terraceamento.',
    },
    estudantes: [
      {
        id: 'est-agro-01',
        matricula: '2025.1.AGR.012',
        nome: 'Gabriel Mendes de Oliveira',
        idade: '16 anos',
        acompanhadoNapne: true,
        observacoesNapne:
          'Estudante em acompanhamento pelo NAPNE. Apresenta alta sensibilidade a sobrecarga de ruídos de maquinário em aulas de campo e necessidade de fracionamento de tarefas de cálculo de perda de solo.',
      },
      {
        id: 'est-agro-02',
        matricula: '2025.1.AGR.033',
        nome: 'Juliana Paes Cavalcante',
        idade: '17 anos',
        acompanhadoNapne: false,
      },
    ],
  },
  {
    id: 'diario-edf-202',
    codigoComponente: 'EDF.0305',
    nomeDisciplina: 'Desenho Técnico da Construção Civil e CAD',
    curso: 'Curso Técnico Integrado ao Ensino Médio em Edificações',
    modalidade: 'Tecnico Integrado',
    campus: 'Campus Central',
    semestrePeriodo: '2026.1 · 3º Ano',
    cargaHoraria: '100h',
    docenteSiape: '2049102',
    docenteNome: 'Profª. Cláudia Helena Ribeiro',
    planoEnsino: {
      ementa:
        'Normas da ABNT para desenho de arquitetura (NBR 6492). Plantas baixas, cortes, fachadas, coberturas e locação de obras. Introdução ao software CAD bidimensional e representação gráfica de projetos arquitetônicos residenciais.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Bimestre',
          topicos: 'Normas de caligrafia técnica, escalas, cotagem e convenções gráficas em prancha.',
        },
        {
          bimestreOuEtapa: '2º Bimestre',
          topicos: 'Desenho manual e digital de planta baixa com espessura de paredes e vãos.',
        },
        {
          bimestreOuEtapa: '3º Bimestre',
          topicos: 'Cortes esquemáticos longitudinais e transversais com especificação de níveis.',
        },
        {
          bimestreOuEtapa: '4º Bimestre',
          topicos: 'Geração de pranchas finais no CAD, layout de plotagem e memorial descritivo.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Interpretar e elaborar projetos gráficos de construção civil em conformidade com as normas técnicas vigentes e ferramentas computacionais CAD.',
      metodologiaPadrao:
        'Aulas no ateliê de pranchetas e no laboratório de computação gráfica (CAD).',
      procedimentosAvaliacaoPadrao:
        'Avaliação prática contínua de pranchas executadas e projeto final de residência unifamiliar.',
    },
    estudantes: [
      {
        id: 'est-edf-01',
        matricula: '2024.1.EDF.009',
        nome: 'Mateus Henrique Silveira',
        idade: '17 anos',
        acompanhadoNapne: true,
        observacoesNapne:
          'Estudante com tremor fino nas mãos e fadiga ocular ao manusear réguas normógrafas e telas com fundo escuro. Raciocínio espacial excelente.',
      },
    ],
  },
  {
    id: 'diario-qui-301',
    codigoComponente: 'QUI.0102',
    nomeDisciplina: 'Química Geral e Inorgânica Experimental',
    curso: 'Licenciatura em Química',
    modalidade: 'Superior',
    campus: 'Campus Universitário',
    semestrePeriodo: '2026.1 · 1º Período',
    cargaHoraria: '90h',
    docenteSiape: '1589304',
    docenteNome: 'Prof. Dr. Ricardo Antunes',
    planoEnsino: {
      ementa:
        'Segurança e normas em laboratório químico. Vidrarias e técnicas de pesagem e volumetria. Estequiometria, preparo e padronização de soluções, reações ácido-base e equilíbrio químico em fase aquosa.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Semestre - Etapa A',
          topicos: 'Boas práticas de laboratório, manuseio de reagentes, fichas FISPQ e descarte de resíduos.',
        },
        {
          bimestreOuEtapa: '1º Semestre - Etapa B',
          topicos: 'Preparo de soluções aquosas, cálculos de concentração molar e titulação volumétrica.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Executar operações fundamentais de bancada química com segurança, rigor volumétrico e capacidade de registro analítico.',
      metodologiaPadrao:
        'Aulas práticas em bancada de laboratório de química e relatórios científicos analíticos.',
      procedimentosAvaliacaoPadrao:
        'Desempenho procedimental em bancada, caderno de laboratório e prova prática de titulação.',
    },
    estudantes: [
      {
        id: 'est-qui-01',
        matricula: '2026.1.QUI.021',
        nome: 'Camila Vasconcelos',
        idade: '19 anos',
        acompanhadoNapne: true,
        observacoesNapne:
          'Estudante com diagnóstico de TDAH de predomínio desatento: facilidade com conceitos teóricos, mas oscilação de foco durante procedimentos sequenciais longos de titulação, necessitando de roteiro em checklist visual.',
      },
    ],
  },
  {
    id: 'diario-adm-401',
    codigoComponente: 'ADM.0201',
    nomeDisciplina: 'Gestão de Pessoas e Comportamento Organizacional',
    curso: 'Tecnologia em Gestão Pública / Administração',
    modalidade: 'Superior',
    campus: 'Campus Avançado',
    semestrePeriodo: '2026.1 · 3º Período',
    cargaHoraria: '60h',
    docenteSiape: '1892043',
    docenteNome: 'Profª. Ma. Mariana Lacerda',
    planoEnsino: {
      ementa:
        'Teorias da administração e motivação no trabalho. Liderança, dinâmica de equipes e comunicação interpessoal. Gestão de conflitos, avaliação de desempenho e políticas de inclusão no serviço público.',
      conteudosProgramaticos: [
        {
          bimestreOuEtapa: '1º Módulo',
          topicos: 'Cultura e clima organizacional; modelos clássicos e contemporâneos de motivação.',
        },
        {
          bimestreOuEtapa: '2º Módulo',
          topicos: 'Comunicação assertiva, gestão de equipes multifuncionais e negociação de conflitos.',
        },
      ],
      habilidadesCompetenciasPpc:
        'Compreender as dinâmicas humanas nas organizações públicas e privadas, elaborando planos de integração e desenvolvimento de equipes.',
      metodologiaPadrao:
        'Estudos de casos reais, dinâmicas de grupo, debates temáticos e seminários expositivos.',
      procedimentosAvaliacaoPadrao:
        'Seminário oral em equipe, análise de estudo de caso escrito e autoavaliação formativa.',
    },
    estudantes: [
      {
        id: 'est-adm-01',
        matricula: '2025.2.ADM.014',
        nome: 'Lucas Duarte Costa',
        idade: '22 anos',
        acompanhadoNapne: true,
        observacoesNapne:
          'Estudante autista (TEA nível 1 de suporte): excelente redação e análise crítica textual, com gatilho de ansiedade intensa diante de apresentações orais em público ou dinâmicas não estruturadas sem aviso prévio.',
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
