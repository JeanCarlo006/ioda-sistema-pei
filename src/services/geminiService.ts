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

  return {
    anonymousStudentCode,
    anonymousDocenteCode,
    grade: sanitizeTextForLgpd(payload.grade, namesToRedact, anonymousStudentCode) || '2º Ano / Diurno',
    course:
      sanitizeTextForLgpd(payload.course, namesToRedact, anonymousStudentCode) ||
      'Curso Técnico Integrado ao Ensino Médio em Informática',
    subject:
      sanitizeTextForLgpd(payload.subject, namesToRedact, anonymousStudentCode) ||
      'Programação Web e Algoritmos',
    barriers:
      sanitizeTextForLgpd(payload.barriers, namesToRedact, anonymousStudentCode) ||
      'Barreiras pedagógicas e sensoriais observadas no laboratório de informática.',
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
 * Schema JSON estrito para configuração de resposta estruturada na chamada da API do Google Gemini.
 */
export const IODA_GEMINI_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    estudo_de_caso_sintese: {
      type: Type.OBJECT,
      properties: {
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
        'barreiras_contextuais',
        'potencialidades_e_interesses',
        'mapeamento_de_gatilhos_e_crises',
        'historico_boas_praticas_etep',
      ],
    },
    planejamento_pedagogico_pei: {
      type: Type.OBJECT,
      properties: {
        conteudo_ementa_oficial: {
          type: Type.STRING,
          description: 'Conteúdo programático e ementa oficial da disciplina sem empobrecimento curricular.',
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
              description: 'Estratégias para prevenção de gatilhos, regulação emocional/sensorial e motivação.',
            },
            representacao: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Estratégias multissensoriais e materiais acessíveis.',
            },
            acao_e_expressao: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Múltiplas vias de demonstração do aprendizado e Recursos de TA/CAA.',
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
        'conteudo_ementa_oficial',
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
 * pedagógicas (DUA 3.0 / Análise Funcional / Histórico ETEP / Intersecção de Neurodivergências) e LGPD.
 */
export function buildIodaSystemInstruction(isSuperior: boolean): string {
  const modalityGuidelines = isSuperior
    ? `PERFIL SELECIONADO: ENSINO SUPERIOR EM TI (Bacharelado / Tecnologia em Sistemas de Informação - IFTO Campus Paraíso).
Diretrizes Pedagógicas para Superior em TI:
- Foco em autonomia acadêmica, raciocínio lógico avançado, engenharia de dados e arquitetura de software.
- Instrumentos de avaliação: entregas contínuas em repositório Git, sustentação em formato acessível (vídeo curto ou banca reservada) e avaliações práticas baseadas em projetos com tempo estendido (+50%).`
    : `PERFIL SELECIONADO: ENSINO MÉDIO TÉCNICO INTEGRADO EM INFORMÁTICA (IFTO Campus Paraíso).
Diretrizes Pedagógicas para Médio Técnico em TI:
- Formação Profissional Técnica articulada ao Ensino Médio.
- Acomodações de laboratório de informática: programação em pares (Pair Programming), roteiros passo a passo em Markdown, fracionamento de tarefas (chunking), acompanhamento de monitoria e garantia de permanência e êxito.`;

  return `Você é o Agente Ioda (Inclusion on Diversity Agent), especialista sênior em Educação Especial Inclusiva, Desenho Universal para a Aprendizagem (DUA 3.0 - CAST 2024), Tecnologia Assistiva (TA/CAA) e atuação junto ao NAPNE e Equipe Técnico-Pedagógica (ETEP).

DIRETRIZES NORMATIVAS E DE PRIVACIDADE (LGPD):
1. Conformidade estrita com a LGPD (Lei nº 13.709/2018), Art. 12, § 5º do Decreto nº 12.686/2025 e Portaria MEC nº 421/2026.
2. O PEI possui caráter estritamente pedagógico e NÃO depende de laudo médico pericial. Jamais utilize linguagem patologizante ou estigmatizante; utilize sempre códigos pseudonimizados (ex: ESTUDANTE_01) e abordagem biopsicossocial/funcional.
3. Curadoria Docente (Human-in-the-Loop): Você atua como ferramenta de apoio para redução da sobrecarga burocrática do professor, cabendo ao docente regente e à equipe pedagógica (NAPNE/ETEP) revisar e validar todas as propostas.
4. Princípio Inegociável: Garanta o acesso ao currículo pleno de Tecnologia da Informação (TI) sem empobrecimento ou rebaixamento cognitivo.
5. Intersecção de Neurodivergências e Comorbidades: Articule de forma holística todas as condições informadas simultaneamente (ex: Autismo + TDAH, AH/SD + Ansiedade), prevenindo gatilhos sensoriais/ambientais (Análise Funcional) e aproveitando o Histórico ETEP de boas práticas anteriores.

${modalityGuidelines}

Retorne estritamente um objeto JSON válido seguindo exatamente esta estrutura:
{
  "estudo_de_caso_sintese": {
    "barreiras_contextuais": ["string"],
    "potencialidades_e_interesses": ["string"],
    "mapeamento_de_gatilhos_e_crises": ["string"],
    "historico_boas_praticas_etep": ["string"]
  },
  "planejamento_pedagogico_pei": {
    "conteudo_ementa_oficial": "string",
    "metas_e_objetivos": [
      {
        "id_meta": "M1",
        "descricao_meta": "string",
        "indicador_sucesso": "string"
      }
    ],
    "estrategias_preventivas_e_dua_3_0": {
      "engajamento_e_autorregulacao": ["Estratégias para prevenção de gatilhos e motivação"],
      "representacao": ["Estratégias multissensoriais e materiais acessíveis"],
      "acao_e_expressao": ["Múltiplas vias de demonstração do aprendizado e Recursos de TA/CAA"]
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
 * Constrói o prompt do usuário já anonimizado/pseudonimizado (LGPD) para envio ao Gemini.
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

  return `Elabore o Plano de Ensino Individualizado (PEI) completo para o código anônimo ${sanitized.anonymousStudentCode} (${isSuperior ? 'ENSINO SUPERIOR EM TI' : 'ENSINO MÉDIO TÉCNICO EM INFORMÁTICA'}):

- Identificador Anônimo (LGPD Art. 12, § 5º Decreto nº 12.686/2025): ${sanitized.anonymousStudentCode}
- Docente Regente (Pseudonimizado): ${sanitized.anonymousDocenteCode}
- Faixa Etária: ${sanitized.age}
- Curso / Período: ${sanitized.course} (${sanitized.grade})
- Componente Curricular (Disciplina): ${sanitized.subject}
- Situação Diagnóstica: ${
    sanitized.statusDiagnostico === 'em_investigacao_hipotese'
      ? 'Em observação pedagógica / Sem laudo médico prévio (Portaria MEC nº 421/2026)'
      : 'Condição acompanhada pelo NAPNE'
  }
- Intersecção de Neurodivergências e Condições Associadas (Visão Holística): ${neuroList}
- Barreiras Contextuais Observadas: ${sanitized.barriers}
- Potencialidades e Interesses do Estudante: ${sanitized.potentialities}
- Mapeamento de Gatilhos e Comportamento (Análise Funcional / Prevenção de Crises): ${sanitized.triggersAndBehavior}
- Histórico ETEP / Boas Práticas Anteriores que já funcionaram: ${etepCombined}
- Recursos de Tecnologia Assistiva (TA/CAA) prévios: ${sanitized.assistiveTech}

IMPORTANTE: Articule diretamente o Mapeamento de Gatilhos com as estratégias de "engajamento_e_autorregulacao" do DUA 3.0, recupere e evolua as boas práticas do Histórico ETEP em "historico_boas_praticas_etep", e contemple simultaneamente a intersecção de todas as condições informadas (${neuroList}).`;
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
      // Explicitly pass anonymous identifier instead of real student name
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
