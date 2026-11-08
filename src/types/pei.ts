export interface CabecalhoPEI {
  estudante: string;
  codigo_matricula: string;
  idade: string;
  curso: string;
  componente_curricular: string;
  modulo_periodo: string;
  data_elaboracao: string;
  docente_regente: string;
  docente_aee: string;
  profissional_apoio: string;
  coordenacao_napne: string;
}

export interface HistoricoNAPNE {
  breve_historico_clinico_familiar: string;
  descricao_condicao_especifica: string;
  informacoes_dos_pais: string;
  status_diagnostico?: 'confirmado' | 'em_investigacao_hipotese';
  categoria_neurodivergencia?: string;
  cid_ou_hipotese?: string;
  condicoes_associadas?: string[];
  especificidades_individuais?: string[];
}

export interface EstatisticasCampusParaiso {
  campus: string;
  estudantes_geral: number;
  estudantes_medio: number;
  estudantes_superior: number;
  com_diagnostico_confirmado: number;
  sem_diagnostico_hipotese: number;
  data_atualizacao: string;
}

export interface BarreiraItem {
  id: string;
  categoria: 'metodologica' | 'tecnologica' | 'comunicacional' | 'atitudinal' | 'arquitetonica';
  descricao: string;
  impacto: string;
  estrategia_enfrentamento: string;
}

export interface PotencialidadeItem {
  id: string;
  area: string;
  descricao: string;
  apoio_demandado: string;
}

export interface EstudoDeCaso {
  barreiras: BarreiraItem[];
  potencialidades: PotencialidadeItem[];
  recursos_ta: string[];
  especificidades_transtorno_e_interseccoes?: string[];
  mapeamento_de_gatilhos_e_crises?: string[];
  historico_boas_praticas_etep?: string[];
  interseccao_condicoes?: string[];
  sintese_observacao: {
    interacao_professores: string;
    interacao_colegas: string;
    tarefas_coletivas: string;
    interesses_centrais: string;
    habilidades_tecnicas: string;
    autonomia_rotina: string;
  };
}

export interface MetaPEI {
  id_meta: string;
  descricao_meta: string;
  prazo: string;
  indicador_sucesso: string;
  progresso_percentual: number;
  status: 'nao_iniciada' | 'em_andamento' | 'alcancada';
}

export interface DUAConfig {
  engajamento: string[];
  representacao: string[];
  acao_e_expressao: string[];
}

export interface GestaoSalaDeAula {
  organizacao_espacial: string;
  rotina_e_pausas: string;
  agrupamentos_e_tutoria: string;
  suporte_docente_semanal: string;
}

export interface EstrategiasAvaliacao {
  formato_acessivel: string;
  criterio_de_sucesso: string;
  grau_mediacao: 'com_mediacao' | 'sem_mediacao' | 'pouca_mediacao';
  tempo_e_espaco: string;
  recursos_utilizados: string[];
}

export interface GuiaPraticoSalaAula {
  passo_a_passo_explicacao: string;
  divisao_tarefa_chunking: [string, string, string] | string[];
  avaliacao_pratica: string;
  manejo_e_acolhimento: string;
}

export interface PlanejamentoPEI {
  conteudo_ementa_oficial: string;
  conteudos_especificos_modulo?: string;
  competencias_habilidades_ementa: string;
  dificuldades_especificas_na_disciplina?: string;
  adaptacao_flexibilizacao_curricular: string;
  objetivos_e_metas: MetaPEI[];
  flexibilizacao_metodologica_dua: DUAConfig;
  gestao_sala_de_aula: GestaoSalaDeAula;
  estrategias_avaliacao: EstrategiasAvaliacao;
  observacoes_docente: string;
  guia_pratico_sala_de_aula?: GuiaPraticoSalaAula;
}

export interface PostItPainel {
  id: string;
  autor: string;
  papel: 'Regente' | 'AEE' | 'Apoio' | 'Coordenação' | 'Estudante' | 'Família';
  categoria: 'objetivos' | 'apoio' | 'avaliacao' | 'recursos_ta' | 'rotina';
  conteudo: string;
  data: string;
  cor: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
}

export interface PEICompleto {
  id: string;
  cabecalho: CabecalhoPEI;
  historico_napne: HistoricoNAPNE;
  estudo_de_caso: EstudoDeCaso;
  planejamento_pei: PlanejamentoPEI;
  painel_notas: PostItPainel[];
  metricas: {
    percentual_metas_alcancadas: number;
    nivel_autonomia: number;
    engajamento: number;
    sessoes_semanais_realizadas: number;
    status_geral: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'REVISAO_NECESSARIA';
  };
  parecer_pedagogico: string;
  sugestoes_proximo_ciclo: string[];
}

export interface IodaGeminiPeiSchema {
  estudo_de_caso_sintese: {
    'especificidades_transtorno_e_intersecçoes': string[];
    especificidades_transtorno_e_interseccoes?: string[];
    barreiras_contextuais: string[];
    potencialidades_e_interesses: string[];
    mapeamento_de_gatilhos_e_crises: string[];
    historico_boas_praticas_etep: string[];
  };
  planejamento_pedagogico_pei: {
    conteudo_ementa_e_habilidades_bncc: string;
    dificuldades_especificas_na_disciplina: string;
    conteudo_ementa_oficial?: string;
    competencias_habilidades_ementa?: string;
    adaptacao_flexibilizacao_curricular?: string;
    metas_e_objetivos: {
      id_meta: string;
      descricao_meta: string;
      indicador_sucesso: string;
      prazo?: string;
    }[];
    estrategias_preventivas_e_dua_3_0: {
      engajamento_e_autorregulacao: string[];
      representacao: string[];
      acao_e_expressao: string[];
    };
    estrategias_de_avaliacao: {
      formato_acessivel: string;
      criterio_de_sucesso: string;
    };
    guia_pratico_sala_de_aula?: GuiaPraticoSalaAula;
  };
  painel_de_acompanhamento: {
    status_ciclo: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'REVISAO_NECESSARIA' | string;
    metricas_numericas: {
      percentual_metas_alcancadas: number;
      nivel_autonomia_1_a_5: number;
      engajamento_nas_atividades_1_a_5: number;
    };
    parecer_sintetico: string;
    sugestoes_proximo_ciclo?: string[];
  };
}

export interface SolucaoCondicao {
  id: string;
  titulo: string;
  condicao: string;
  nivelSugerido: 'Médio Técnico' | 'Superior TI' | 'Ambos';
  descricaoProblema: string;
  remediosSugeridos: {
    engajamento: string;
    representacao: string;
    acaoExpressao: string;
    recursosTA: string[];
    avaliacaoAcessivel: string;
  };
  guiaPratico?: GuiaPraticoSalaAula;
}

export type EscalaFonte = 'normal' | 'ampliada' | 'grande';
export type ModoContraste = 'padrao' | 'alto-contraste' | 'conforto';

export interface PreferenciasDUA {
  escalaFonte: EscalaFonte;
  modoContraste: ModoContraste;
}

export interface AvaliacaoSUS {
  id: string;
  data: string;
  avaliador: string;
  respostas: number[]; // 10 itens (1 a 5)
  score: number; // 0 a 100
  comentario?: string;
}

export interface DisciplinaPpcPreset {
  id: string;
  codigo: string;
  nome: string;
  periodo: string;
  curso: string;
  ementa: string;
  competencias: string;
  barreirasComunsTi: string[];
  adaptacaoSugeridaPadrao: string;
}
