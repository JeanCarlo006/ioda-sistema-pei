import { Type, Schema } from '@google/genai';
import { IodaGeminiPeiSchema } from '../types/pei';

export interface RawPeiRequestPayload {
  studentName?: string;
  studentCode?: string;
  cpf?: string;
  photoUrl?: string;
  grade?: string;
  course?: string;
  subject?: string;
  ementaOficial?: string;
  conteudosEspecificosModulo?: string;
  habilidadesCompetenciasPpcBncc?: string;
  dificuldadesEspecificasDisciplina?: string;
  especificidadesTranstorno?: string;
  barriers?: string;
  potentialities?: string;
  assistiveTech?: string;
  triggersAndBehavior?: string;
  etepHistory?: string;
  etepTags?: string[];
  docenteRegente?: string;
  docenteAee?: string;
  age?: string;
  perfilModalidade?: 'medio_tecnico' | 'superior_ti';
  statusDiagnostico?: 'confirmado' | 'em_investigacao_hipotese';
  campus?: string;
  selectedIds?: string[];
  selectedNeurodivergences?: string[];
  customComorbidities?: string[];
}

export interface SanitizedPeiPayload {
  anonymousStudentCode: string;
  anonymousDocenteCode: string;
  grade: string;
  course: string;
  subject: string;
  ementaOficial: string;
  conteudosEspecificosModulo: string;
  habilidadesCompetenciasPpcBncc: string;
  dificuldadesEspecificasDisciplina: string;
  especificidadesTranstorno: string;
  barriers: string;
  potentialities: string;
  assistiveTech: string;
  triggersAndBehavior: string;
  etepHistory: string;
  etepTags: string[];
  age: string;
  perfilModalidade: 'medio_tecnico' | 'superior_ti';
  statusDiagnostico: 'confirmado' | 'em_investigacao_hipotese';
  selectedIds: string[];
  selectedNeurodivergences: string[];
  lgpdComplianceMetadata: {
    sanitizedAt: string;
    legalBasis: string;
    piiRemoved: boolean;
  };
}

/**
 * Sanitiza textos livres removendo dados pessoais sensíveis (PII), nomes próprios,
 * CPF, RG, telefones, e-mails, URLs de fotos e diagnósticos clínicos periciais invasivos
 * (ex: códigos CID explícitos, números de prontuário médico ou CRM).
 *
 * Conformidade normativa:
 * - Lei Geral de Proteção de Dados Pessoais - LGPD (Lei nº 13.709/2018, Arts. 6º, 11 e 14)
 * - Decreto nº 12.686/2025 (Art. 12, § 5º - Proteção e sigilo de informações educacionais e clínicas)
 * - Portaria MEC nº 421/2026 (Foco pedagógico e funcional, não médico-patologizante)
 */
export function sanitizeTextForLgpd(
  text: string | undefined,
  namesToRedact: string[] = [],
  anonymousStudentCode = 'ESTUDANTE_01'
): string {
  if (!text || typeof text !== 'string') return '';

  let sanitized = text;

  // 1. Substituir nomes próprios conhecidos (nome completo e partes com >= 3 letras) pelo código anônimo
  for (const rawName of namesToRedact) {
    if (!rawName || typeof rawName !== 'string') continue;
    const trimmed = rawName.trim();
    if (trimmed.length >= 2) {
      const escapedFull = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      sanitized = sanitized.replace(new RegExp(escapedFull, 'gi'), anonymousStudentCode);

      const parts = trimmed
        .split(/\s+/)
        .filter((p) => p.length >= 3 && !['dos', 'das', 'por', 'com', 'sem', 'prof', 'profa', 'dr', 'dra'].includes(p.toLowerCase()));
      for (const part of parts) {
        const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        sanitized = sanitized.replace(new RegExp(`\\b${escapedPart}\\b`, 'gi'), anonymousStudentCode);
      }
    }
  }

  // 2. Remover padrão de CPF (000.000.000-00 ou 11 dígitos contínuos identificados como CPF)
  sanitized = sanitized.replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[CPF_OCULTO_LGPD]');

  // 3. Remover padrão de RG / Prontuário / CRM médico
  sanitized = sanitized.replace(/\b(RG|CPF|CRM|CNS|Prontu[aá]rio)\s*[:#-]?\s*[\d.\-/A-Za-z]+/gi, '[DOC_ANONIMIZADO_LGPD]');

  // 4. Remover códigos CID-10 / CID-11 explícitos (ex: CID F84.0, CID-10 F90.0, CID 6A02) mantendo apenas a visão funcional
  sanitized = sanitized.replace(/\bCID(?:-\d{1,2})?\s*[:#-]?\s*[A-Z0-9]{2,4}(?:\.[A-Z0-9]{1,3})?\b/gi, '[CONDICAO_PEDAGOGICA_NAPNE]');

  // 5. Remover e-mails e telefones
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_OCULTO_LGPD]');
  sanitized = sanitized.replace(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-\d{4}\b/g, '[TELEFONE_OCULTO_LGPD]');

  // 6. Remover imagens embutidas (data:image/...) ou URLs de fotos
  sanitized = sanitized.replace(/data:image\/[a-zA-Z+]+;base64,[^\s"']+/g, '[FOTO_REMOVIDA_LGPD]');
  sanitized = sanitized.replace(/https?:\/\/[^\s"']+\.(?:png|jpg|jpeg|webp|gif|bmp)(?:\?[^\s"']*)?/gi, '[FOTO_REMOVIDA_LGPD]');

  return sanitized.trim();
}

/**
 * Pseudonimiza e sanitiza toda a carga útil (payload) antes do envio para a API do Google Gemini.
 * Garante que nenhum dado pessoal identificável (nome completo, CPF, foto, matrícula nominal ou
 * laudo clínico invasivo) saia para o modelo externo.
 */
export function sanitizePeiPayloadForLgpd(
  payload: RawPeiRequestPayload,
  studentIndex = 1
): SanitizedPeiPayload {
  const anonymousStudentCode = `ESTUDANTE_${String(studentIndex).padStart(2, '0')}`;
  const anonymousDocenteCode = `DOCENTE_REGENTE_${String(studentIndex).padStart(2, '0')}`;

  const namesToRedact = [
    payload.studentName || '',
    payload.docenteRegente || '',
    payload.docenteAee || '',
  ].filter(Boolean);

  const neuroList = Array.from(
    new Set([
      ...(Array.isArray(payload.selectedNeurodivergences) ? payload.selectedNeurodivergences : []),
      ...(Array.isArray(payload.customComorbidities) ? payload.customComorbidities : []),
    ])
  ).map((item) => sanitizeTextForLgpd(item, namesToRedact, anonymousStudentCode));

  const etepTagsSanitized = Array.isArray(payload.etepTags)
    ? payload.etepTags.map((tag) => sanitizeTextForLgpd(tag, namesToRedact, anonymousStudentCode)).filter(Boolean)
    : [];

  const subjectSanitized =
    sanitizeTextForLgpd(payload.subject, namesToRedact, anonymousStudentCode) ||
    'Programação Web e Algoritmos';

  return {
    anonymousStudentCode,
    anonymousDocenteCode,
    grade: sanitizeTextForLgpd(payload.grade, namesToRedact, anonymousStudentCode) || '2º Ano / Diurno',
    course:
      sanitizeTextForLgpd(payload.course, namesToRedact, anonymousStudentCode) ||
      'Curso Técnico Integrado ao Ensino Médio em Informática',
    subject: subjectSanitized,
    ementaOficial:
      sanitizeTextForLgpd(payload.ementaOficial, namesToRedact, anonymousStudentCode) ||
      `Ementa oficial de ${subjectSanitized}: fundamentos teóricos, modelagem lógica e implementação prática em laboratório.`,
    conteudosEspecificosModulo:
      sanitizeTextForLgpd(payload.conteudosEspecificosModulo, namesToRedact, anonymousStudentCode) ||
      `Conteúdos práticos do semestre em ${subjectSanitized}, resolução de problemas e desenvolvimento guiado.`,
    habilidadesCompetenciasPpcBncc:
      sanitizeTextForLgpd(payload.habilidadesCompetenciasPpcBncc, namesToRedact, anonymousStudentCode) ||
      `Desenvolver pensamento computacional, raciocínio algorítmico e competências técnicas previstas no PPC/BNCC para ${subjectSanitized}.`,
    dificuldadesEspecificasDisciplina:
      sanitizeTextForLgpd(payload.dificuldadesEspecificasDisciplina, namesToRedact, anonymousStudentCode) ||
      sanitizeTextForLgpd(payload.barriers, namesToRedact, anonymousStudentCode) ||
      `Dificuldade em acompanhar aulas práticas extensas ou enunciados complexos em ${subjectSanitized} sem fracionamento (chunking) e apoio visual.`,
    especificidadesTranstorno:
      sanitizeTextForLgpd(payload.especificidadesTranstorno, namesToRedact, anonymousStudentCode) ||
      (neuroList.length > 0
        ? `Especificidades funcionais combinadas para ${neuroList.join(' + ')} no contexto do laboratório de TI.`
        : 'Necessidade de previsibilidade de rotina, instruções estruturadas e diversificação multissensorial DUA 3.0.'),
    barriers:
      sanitizeTextForLgpd(payload.barriers, namesToRedact, anonymousStudentCode) ||
      'Barreiras pedagógicas, metodológicas e sensoriais observadas no laboratório de informática.',
    potentialities:
      sanitizeTextForLgpd(payload.potentialities, namesToRedact, anonymousStudentCode) ||
      'Raciocínio lógico, pensamento computacional e resolução prática de problemas.',
    assistiveTech:
      sanitizeTextForLgpd(payload.assistiveTech, namesToRedact, anonymousStudentCode) ||
      'Recursos de Tecnologia Assistiva e tempo ampliado (+50%).',
    triggersAndBehavior:
      sanitizeTextForLgpd(payload.triggersAndBehavior, namesToRedact, anonymousStudentCode) ||
      'Ruídos intensos no laboratório, instruções verbais longas sem apoio visual e mudanças bruscas de rotina.',
    etepHistory:
      sanitizeTextForLgpd(payload.etepHistory, namesToRedact, anonymousStudentCode) ||
      'Uso de roteiros estruturados passo a passo, programação em pares e fracionamento de entregas (chunking).',
    etepTags: etepTagsSanitized,
    age: sanitizeTextForLgpd(payload.age, namesToRedact, anonymousStudentCode) || '17 anos',
    perfilModalidade: payload.perfilModalidade === 'superior_ti' ? 'superior_ti' : 'medio_tecnico',
    statusDiagnostico:
      payload.statusDiagnostico === 'em_investigacao_hipotese' ? 'em_investigacao_hipotese' : 'confirmado',
    selectedIds: Array.isArray(payload.selectedIds) ? payload.selectedIds : [],
    selectedNeurodivergences: neuroList,
    lgpdComplianceMetadata: {
      sanitizedAt: new Date().toISOString(),
      legalBasis: 'LGPD (Lei nº 13.709/2018) e Art. 12, § 5º do Decreto nº 12.686/2025',
      piiRemoved: true,
    },
  };
}

/**
 * Schema JSON estrito para configuração de resposta estruturada na chamada da API do Google Gemini (Requisito 4).
 */
export const IODA_GEMINI_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    estudo_de_caso_sintese: {
      type: Type.OBJECT,
      properties: {
        'especificidades_transtorno_e_intersecçoes': {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Especificidades individuais por transtorno/neurodivergência (TEA, TDAH, AH/SD, Auditiva, Visual, etc.) e suas intersecções/comorbidades.',
        },
        barreiras_contextuais: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Barreiras metodológicas, tecnológicas, comunicacionais ou atitudinais no contexto escolar.',
        },
        potencialidades_e_interesses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Pontos fortes, habilidades técnicas e interesses centrais do estudante.',
        },
        mapeamento_de_gatilhos_e_crises: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Análise funcional: gatilhos sensoriais, ambientais ou rotineiros e estratégias de prevenção de sobrecarga ou ansiedade.',
        },
        historico_boas_praticas_etep: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Histórico ETEP: estratégias e adaptações que já funcionaram em ciclos anteriores.',
        },
      },
      required: [
        'especificidades_transtorno_e_intersecçoes',
        'barreiras_contextuais',
        'potencialidades_e_interesses',
        'mapeamento_de_gatilhos_e_crises',
        'historico_boas_praticas_etep',
      ],
    },
    planejamento_pedagogico_pei: {
      type: Type.OBJECT,
      properties: {
        conteudo_ementa_e_habilidades_bncc: {
          type: Type.STRING,
          description: 'Ementa oficial do componente, conteúdos específicos do módulo/semestre e habilidades/competências exigidas pelo PPC/BNCC.',
        },
        dificuldades_especificas_na_disciplina: {
          type: Type.STRING,
          description: 'Dificuldades específicas observadas no estudante referente àquela disciplina.',
        },
        metas_e_objetivos: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id_meta: { type: Type.STRING },
              descricao_meta: { type: Type.STRING },
              indicador_sucesso: { type: Type.STRING },
            },
            required: ['id_meta', 'descricao_meta', 'indicador_sucesso'],
          },
        },
        estrategias_preventivas_e_dua_3_0: {
          type: Type.OBJECT,
          properties: {
            engajamento_e_autorregulacao: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Estratégias de motivação e prevenção de gatilhos.',
            },
            representacao: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Estratégias multissensoriais e materiais acessíveis.',
            },
            acao_e_expressao: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Múltiplas vias de demonstração e recursos de TA/CAA.',
            },
          },
          required: ['engajamento_e_autorregulacao', 'representacao', 'acao_e_expressao'],
        },
        estrategias_de_avaliacao: {
          type: Type.OBJECT,
          properties: {
            formato_acessivel: { type: Type.STRING },
            criterio_de_sucesso: { type: Type.STRING },
          },
          required: ['formato_acessivel', 'criterio_de_sucesso'],
        },
      },
      required: [
        'conteudo_ementa_e_habilidades_bncc',
        'dificuldades_especificas_na_disciplina',
        'metas_e_objetivos',
        'estrategias_preventivas_e_dua_3_0',
        'estrategias_de_avaliacao',
      ],
    },
    painel_de_acompanhamento: {
      type: Type.OBJECT,
      properties: {
        status_ciclo: {
          type: Type.STRING,
          description: 'Status atual do ciclo (ex: EM_ANDAMENTO).',
        },
        metricas_numericas: {
          type: Type.OBJECT,
          properties: {
            percentual_metas_alcancadas: { type: Type.NUMBER },
            nivel_autonomia_1_a_5: { type: Type.NUMBER },
            engajamento_nas_atividades_1_a_5: { type: Type.NUMBER },
          },
          required: [
            'percentual_metas_alcancadas',
            'nivel_autonomia_1_a_5',
            'engajamento_nas_atividades_1_a_5',
          ],
        },
        parecer_sintetico: {
          type: Type.STRING,
          description: 'Parecer pedagógico sintético sujeito à curadoria e validação docente.',
        },
      },
      required: ['status_ciclo', 'metricas_numericas', 'parecer_sintetico'],
    },
  },
  required: ['estudo_de_caso_sintese', 'planejamento_pedagogico_pei', 'painel_de_acompanhamento'],
};

/**
 * Constrói a System Instruction atualizada do Agente Ioda conforme diretrizes normativas,
 * especificidade curricular (PPC/BNCC), especificidades por neurodivergência, DUA 3.0 e LGPD.
 */
export function buildIodaSystemInstruction(isSuperior: boolean): string {
  const modalityGuidelines = isSuperior
    ? `PERFIL SELECIONADO: ENSINO SUPERIOR EM TI (Bacharelado / Tecnologia em Sistemas de Informação - IFTO Campus Paraíso).
Diretrizes Pedagógicas para Superior em TI:
- Foco em autonomia acadêmica, raciocínio lógico avançado, engenharia de dados e arquitetura de software conforme PPC do curso.
- Instrumentos de avaliação: entregas contínuas em repositório Git, sustentação em formato acessível (vídeo curto ou banca reservada) e avaliações práticas baseadas em projetos com tempo estendido (+50%).`
    : `PERFIL SELECIONADO: ENSINO MÉDIO TÉCNICO INTEGRADO EM INFORMÁTICA (IFTO Campus Paraíso).
Diretrizes Pedagógicas para Médio Técnico em TI:
- Formação Profissional Técnica articulada à BNCC e ao PPC do Curso Técnico em Informática.
- Acomodações de laboratório de informática: programação em pares (Pair Programming), roteiros passo a passo em Markdown, fracionamento de tarefas (chunking), acompanhamento de monitoria e garantia de permanência e êxito.`;

  return `Você é o Agente Ioda (Inclusion on Diversity Agent), copiloto de produtividade pedagógica e especialista sênior em Educação Especial Inclusiva, Desenho Universal para a Aprendizagem (DUA 3.0 - CAST 2024), Tecnologia Assistiva (TA/CAA) e atuação junto ao NAPNE e Equipe Técnico-Pedagógica (ETEP).

DIRETRIZES NORMATIVAS, ESPECIFICIDADE E PRIVACIDADE (LGPD):
1. Conformidade estrita com a LGPD (Lei nº 13.709/2018), Art. 12, § 5º do Decreto nº 12.686/2025 e Portaria MEC nº 421/2026.
2. O PEI possui caráter estritamente pedagógico e NÃO depende de laudo médico pericial. Jamais utilize linguagem patologizante ou genérica; utilize sempre códigos pseudonimizados (ex: ESTUDANTE_01).
3. PROIBIDO GERAR PLANOS GENÉRICOS: Conecte diretamente as especificidades individuais do transtorno/neurodivergência (TEA, TDAH, AH/SD, Deficiência Auditiva/Visual e comorbidades) com os conteúdos específicos do módulo/semestre, a ementa oficial, as habilidades PPC/BNCC e as dificuldades observadas naquela disciplina.
4. Curadoria Docente (Human-in-the-Loop): Você é um copiloto de produtividade que reduz a sobrecarga burocrática do docente, cabendo ao professor regente e à equipe pedagógica a validação final.

${modalityGuidelines}

Retorne estritamente um objeto JSON válido seguindo exatamente esta estrutura:
{
  "estudo_de_caso_sintese": {
    "especificidades_transtorno_e_intersecçoes": ["string"],
    "barreiras_contextuais": ["string"],
    "potencialidades_e_interesses": ["string"],
    "mapeamento_de_gatilhos_e_crises": ["string"],
    "historico_boas_praticas_etep": ["string"]
  },
  "planejamento_pedagogico_pei": {
    "conteudo_ementa_e_habilidades_bncc": "string",
    "dificuldades_especificas_na_disciplina": "string",
    "metas_e_objetivos": [
      {
        "id_meta": "M1",
        "descricao_meta": "string",
        "indicador_sucesso": "string"
      }
    ],
    "estrategias_preventivas_e_dua_3_0": {
      "engajamento_e_autorregulacao": ["Estratégias de motivação e prevenção de gatilhos"],
      "representacao": ["Estratégias multissensoriais e materiais acessíveis"],
      "acao_e_expressao": ["Múltiplas vias de demonstração e recursos de TA/CAA"]
    },
    "estrategias_de_avaliacao": {
      "formato_acessivel": "string",
      "criterio_de_sucesso": "string"
    }
  },
  "painel_de_acompanhamento": {
    "status_ciclo": "EM_ANDAMENTO",
    "metricas_numericas": {
      "percentual_metas_alcancadas": 0,
      "nivel_autonomia_1_a_5": 1,
      "engajamento_nas_atividades_1_a_5": 1
    },
    "parecer_sintetico": "string"
  }
}`;
}

/**
 * Constrói o prompt do usuário já anonimizado/pseudonimizado (LGPD) com especificidade curricular e clínica-funcional.
 */
export function buildSanitizedUserPrompt(sanitized: SanitizedPeiPayload): string {
  const isSuperior = sanitized.perfilModalidade === 'superior_ti';
  const neuroList =
    sanitized.selectedNeurodivergences.length > 0
      ? sanitized.selectedNeurodivergences.join(' + ')
      : 'Perfil neurodivergente / condição específica em acompanhamento pedagógico';

  const etepCombined = [
    sanitized.etepHistory,
    sanitized.etepTags.length > 0 ? `Tags ETEP validadas: ${sanitized.etepTags.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  return `Elabore o Plano de Ensino Individualizado (PEI) altamente específico e contextualizado para o código pseudonimizado ${sanitized.anonymousStudentCode} (${isSuperior ? 'ENSINO SUPERIOR EM TI' : 'ENSINO MÉDIO TÉCNICO EM INFORMÁTICA'}):

1. IDENTIFICAÇÃO PSEUDONIMIZADA (LGPD & Art. 12, § 5º Decreto nº 12.686/2025):
- Estudante: ${sanitized.anonymousStudentCode} (${sanitized.age})
- Docente Regente: ${sanitized.anonymousDocenteCode}
- Curso / Período: ${sanitized.course} (${sanitized.grade})
- Situação Diagnóstica: ${
    sanitized.statusDiagnostico === 'em_investigacao_hipotese'
      ? 'Em observação pedagógica / Sem laudo médico prévio (Portaria MEC nº 421/2026)'
      : 'Condição acompanhada pelo NAPNE'
  }

2. ESPECIFICIDADES POR TRANSTORNO / NEURODIVERGÊNCIA E INTERSECÇÕES:
- Condições e Comorbidades Selecionadas: ${neuroList}
- Especificidades Individuais do Estudante: ${sanitized.especificidadesTranstorno}

3. DETALHAMENTO DO COMPONENTE CURRICULAR:
- Componente Curricular (Disciplina): ${sanitized.subject}
- Ementa Oficial do Componente: ${sanitized.ementaOficial}
- Conteúdos Específicos do Módulo/Semestre: ${sanitized.conteudosEspecificosModulo}
- Habilidades e Competências Exigidas (PPC / BNCC): ${sanitized.habilidadesCompetenciasPpcBncc}
- Dificuldades Específicas Observadas na Disciplina: ${sanitized.dificuldadesEspecificasDisciplina}

4. ANÁLISE FUNCIONAL, POTENCIALIDADES E HISTÓRICO ETEP:
- Barreiras Contextuais: ${sanitized.barriers}
- Potencialidades e Interesses: ${sanitized.potentialities}
- Mapeamento de Gatilhos e Comportamento (Análise Funcional): ${sanitized.triggersAndBehavior}
- Histórico ETEP / Boas Práticas Anteriores: ${etepCombined}
- Recursos de TA/CAA Prévios: ${sanitized.assistiveTech}

INSTRUÇÃO CRÍTICA: Gere metas SMART, estratégias DUA 3.0 e critérios de avaliação estritamente ancorados nos conteúdos específicos (${sanitized.conteudosEspecificosModulo}), nas dificuldades observadas (${sanitized.dificuldadesEspecificasDisciplina}) e nas especificidades de (${neuroList}).`;
}

/**
 * Envia a requisição para o endpoint do Agente Ioda aplicando sanitização prévia de dados (LGPD).
 */
export async function requestPeiGenerationWithLgpd(
  rawPayload: RawPeiRequestPayload,
  timeoutMs = 7500
): Promise<{
  success: boolean;
  data?: IodaGeminiPeiSchema & Record<string, any>;
  sanitizedPayload: SanitizedPeiPayload;
}> {
  const sanitizedPayload = sanitizePeiPayloadForLgpd(rawPayload, 1);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );

  const fetchPromise = fetch('/api/gemini/generate-pei', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      ...sanitizedPayload,
      studentName: sanitizedPayload.anonymousStudentCode,
      docenteRegente: sanitizedPayload.anonymousDocenteCode,
    }),
  });

  const response: Response = await Promise.race([fetchPromise, timeoutPromise]);
  const contentType = response.headers?.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const resData = await response.json();
    return {
      success: Boolean(resData.success),
      data: resData.data,
      sanitizedPayload,
    };
  }

  return {
    success: false,
    sanitizedPayload,
  };
}
