import { sanitizePeiPayloadForLgpd } from './geminiService';

/**
 * Motor Pedagógico Universal do Ioda
 * 
 * AGNÓSTICO A CURSO E BASEADO EM PRINCÍPIOS DUA 3.0:
 * 1. Opera sobre qualquer componente curricular (Agronomia, Alimentos, Edificações, Administração, Química, Informática, Letras, etc.).
 * 2. Ancorado diretamente no Plano de Ensino da disciplina (ementa oficial, tópicos do módulo e procedimentos de avaliação).
 * 3. Baseado na primazia da MANIFESTAÇÃO INDIVIDUAL e dos GATILHOS SITUACIONAIS sobre rótulos de diagnóstico médico.
 * 4. Conformidade com Decreto nº 12.686/2025, Portaria MEC nº 421/2026 e DUA 3.0 (CAST 2024).
 */
export function synthesizeIodaPei(params: any) {
  const sanitized = sanitizePeiPayloadForLgpd(params, 1);

  const {
    course,
    subject,
    ementaOficial,
    conteudosEspecificosModulo,
    habilidadesCompetenciasPpcBncc,
    dificuldadesEspecificasDisciplina,
    manifestacoesIndividuais,
    gatilhosSituacionais,
    barriers,
    potentialities,
    etepHistory,
    etepTags,
    selectedNeurodivergences,
  } = sanitized;

  const disciplinaNome = subject || 'Componente Curricular';
  const conteudoAtivo =
    conteudosEspecificosModulo || ementaOficial || 'Conteúdos programáticos vigentes do semestre';
  const dificuldadeAtiva =
    dificuldadesEspecificasDisciplina ||
    'Dificuldade no ritmo de acompanhamento ou instrumentos avaliativos tradicionais';
  const manifestacaoAtiva =
    manifestacoesIndividuais || 'Características pedagógicas observadas no cotidiano de aula';
  const gatilhosAtivos =
    gatilhosSituacionais || 'Sobrecarga de estímulos ou pressão temporal estrita';

  // Análise funcional da manifestação individual:
  const ctx = `${manifestacaoAtiva} ${gatilhosAtivos} ${selectedNeurodivergences.join(' ')}`.toLowerCase();

  const isDesatencao =
    ctx.includes('desaten') || ctx.includes('foco') || ctx.includes('dispers') || ctx.includes('distra');
  const isHiperatividade =
    ctx.includes('hiperativ') || ctx.includes('inquiet') || ctx.includes('motor') || ctx.includes('impulsiv');
  const isSensorial =
    ctx.includes('ruído') ||
    ctx.includes('som') ||
    ctx.includes('luz') ||
    ctx.includes('sensorial') ||
    ctx.includes('abafador') ||
    ctx.includes('sobrecarga');
  const isRigidezRotina =
    ctx.includes('rotina') ||
    ctx.includes('mudança') ||
    ctx.includes('previsibil') ||
    ctx.includes('rigidez') ||
    ctx.includes('ansiedade') ||
    ctx.includes('pânico');
  const isVisual =
    ctx.includes('visual') ||
    ctx.includes('visão') ||
    ctx.includes('fonte') ||
    ctx.includes('contraste') ||
    ctx.includes('cego') ||
    ctx.includes('baixa visão');
  const isAuditiva =
    ctx.includes('auditiv') || ctx.includes('surd') || ctx.includes('libras');
  const isFadigaEscrita =
    ctx.includes('escrita') ||
    ctx.includes('cópia') ||
    ctx.includes('digita') ||
    ctx.includes('motora fina') ||
    ctx.includes('disgrafia') ||
    ctx.includes('fadiga');

  // 1. DUA 3.0: Múltiplos Meios de Engajamento e Autorregulação
  const engajamento: string[] = [];
  if (gatilhosAtivos) {
    engajamento.push(
      `Manejo Preventivo de Gatilhos: Antecipação prévia das etapas da aula para atenuar gatilhos de (${gatilhosAtivos}), garantindo previsão de rotina e cartão de pausa discreta (5 a 10 minutos).`
    );
  }
  if (isHiperatividade) {
    engajamento.push(
      `Gestão de Movimento: Permitir alternância de posturas e pausas ativas a cada 25 minutos de atividade concentrada, canalizando a energia motora em tarefas procedimentais da disciplina.`
    );
  } else if (isDesatencao) {
    engajamento.push(
      `Manutenção do Foco: Fracionamento dos tópicos de (${conteudoAtivo}) em micro-etapas sequenciais com marcadores visuais de início e fim para prevenir dispersão.`
    );
  }
  if (isSensorial) {
    engajamento.push(
      `Conforto Sensorial: Autorização para uso de fones abafadores ou acomodação em local com menor incidência de ruídos e circulação intensa.`
    );
  }
  if (isRigidezRotina) {
    engajamento.push(
      `Previsibilidade Pedagógica: Apresentação da agenda da aula no quadro no início da atividade, antecipando qualquer alteração de dinâmica ou de prazo.`
    );
  }
  engajamento.push(
    `Contextualização Prática: Conectar os conceitos de (${conteudoAtivo}) com aplicações concretas do curso (${course}) e áreas de interesse demonstradas pelo estudante.`
  );

  // 2. DUA 3.0: Múltiplos Meios de Representação
  const representacao: string[] = [];
  representacao.push(
    `Multiplicidade Sensorial: Apresentação dos conceitos de (${conteudoAtivo}) com apoio de esquemas visuais, mapas conceituais, diagramas e demonstrações práticas concretas.`
  );
  if (isVisual) {
    representacao.push(
      `Acessibilidade Visual: Disponibilização prévia de materiais digitais com fontes ampliadas (mínimo 16pt), alto contraste e compatibilidade com leitores de tela.`
    );
  } else if (isAuditiva) {
    representacao.push(
      `Acessibilidade Comunicacional: Apoio visual integral com roteiros em tópicos, recursos imagéticos e articulação com tradutor intérprete de Libras quando aplicável.`
    );
  }
  representacao.push(
    `Roteiros Estruturados: Fornecimento de tutoriais passo a passo e checklists objetivos dos passos necessários para a execução dos exercícios e práticas da disciplina.`
  );

  // 3. DUA 3.0: Múltiplos Meios de Ação e Expressão
  const acaoExpressao: string[] = [];
  acaoExpressao.push(
    `Flexibilidade de Formato: Diversificação dos instrumentos de demonstração do aprendizado dos conteúdos de (${conteudoAtivo}) (possibilidade de entrega por portfólio prático, relatório executivo, apresentação oral reservada ou projeto orientado).`
  );
  if (isFadigaEscrita) {
    acaoExpressao.push(
      `Adaptação de Registro: Substituição de cópias extensas de quadro ou textos manuscritos longos por digitação acessível, esquemas conceituais ou gravação de síntese oral.`
    );
  }
  acaoExpressao.push(
    `Adequação Temporal e Espacial: Concessão de tempo adicional (+50%) para resolução de avaliações formais e realização em ambiente reservado com baixa estimulação distratora.`
  );

  // Metas pedagógicas contextualizadas com a disciplina
  const metas = [
    {
      id_meta: 'M1',
      descricao_meta: `Compreender os princípios essenciais de (${conteudoAtivo}) da disciplina ${disciplinaNome}, com auxílio de roteiros estruturados e suportes visuais.`,
      indicador_sucesso: `Atingir autonomia na identificação e aplicação dos conceitos fundamentais de (${conteudoAtivo}) em pelo menos 70% das atividades propostas.`,
      prazo: 'Mensal (4 semanas)',
    },
    {
      id_meta: 'M2',
      descricao_meta: `Superar as dificuldades pontuais em (${dificuldadeAtiva}) por meio de fracionamento das etapas e apoios pedagógicos pactuados.`,
      indicador_sucesso: `Concluir as etapas avaliativas propostas utilizando as acomodações de tempo e recursos de acessibilidade pactuados.`,
      prazo: 'Bimestral / Semestral',
    },
  ];

  const parecerTexto = `Plano de Ensino Individualizado estruturado sob os princípios do DUA 3.0 e Decreto nº 12.686/2025 para a disciplina ${disciplinaNome} (${course}). As estratégias asseguram acessibilidade aos conteúdos programáticos essenciais sem rebaixamento curricular, priorizando o acolhimento preventivo de gatilhos situacionais e a diversificação avaliativa. Proposta sujeita à curadoria e validação final do professor regente e equipe do NAPNE.`;

  return {
    estudo_de_caso_sintese: {
      'especificidades_transtorno_e_intersecçoes': [
        manifestacaoAtiva,
        ...(selectedNeurodivergences.length > 0
          ? [`Condições em acompanhamento: ${selectedNeurodivergences.join(' + ')}`]
          : []),
      ],
      barreiras_contextuais: [
        barriers ||
          `Exigência de ritmo uniforme e avaliações restritas a formato tradicional sem acomodação de tempo em ${disciplinaNome}.`,
        `Sobrecarga em aulas expositivas com instruções verbais longas e sem apoio visual prévio.`,
      ],
      potencialidades_e_interesses: [
        potentialities ||
          'Capacidade analítica, interesse prático e engajamento quando instruído com clareza de expectativas.',
      ],
      mapeamento_de_gatilhos_e_crises: [
        `Gatilhos Situacionais: ${gatilhosAtivos}.`,
        'Protocolo de Acolhimento: Antecipação de rotinas, comunicação serena e concessão de pausa breve para autorregulação.',
      ],
      historico_boas_praticas_etep: [
        etepHistory ||
          'Fracionamento de tarefas complexas, tempo estendido (+50%) e materiais disponibilizados com antecedência.',
        ...(etepTags.length > 0 ? etepTags : []),
      ],
    },
    planejamento_pedagogico_pei: {
      conteudo_ementa_e_habilidades_bncc:
        `${disciplinaNome} (${course}): ${conteudoAtivo}. ${habilidadesCompetenciasPpcBncc || ''}`.trim(),
      dificuldades_especificas_na_disciplina: dificuldadeAtiva,
      metas_e_objetivos: metas,
      estrategias_preventivas_e_dua_3_0: {
        engajamento_e_autorregulacao: engajamento,
        representacao: representacao,
        acao_e_expressao: acaoExpressao,
      },
      estrategias_de_avaliacao: {
        formato_acessivel: `Avaliações diversificadas (projetos práticos, relatórios modulares ou avaliações orais reservadas) com tempo estendido (+50%) e enunciado estruturado em tópicos.`,
        criterio_de_sucesso: `Demonstração do domínio dos conceitos essenciais de (${conteudoAtivo}), valorizando o processo de raciocínio e a superação das barreiras identificadas.`,
      },
    },
    painel_de_acompanhamento: {
      status_ciclo: 'EM_ANDAMENTO',
      metricas_numericas: {
        percentual_metas_alcancadas: 50,
        nivel_autonomia_1_a_5: 3,
        engajamento_nas_atividades_1_a_5: 4,
      },
      parecer_sintetico: parecerTexto,
      sugestoes_proximo_ciclo: [
        'Acompanhamento regular e alinhamento pedagógico entre docente regente e NAPNE.',
        'Revisão bimestral dos indicadores de sucesso conforme a evolução do estudante na disciplina.',
      ],
    },
  };
}
