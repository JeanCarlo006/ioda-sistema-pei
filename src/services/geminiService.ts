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
  campus?: string;
  modalidade?: string;
  ementaOficial?: string;
  conteudosEspecificosModulo?: string;
  habilidadesCompetenciasPpcBncc?: string;
  dificuldadesEspecificasDisciplina?: string;
  manifestacoesIndividuais?: string;
  especificidadesTranstorno?: string;
  barriers?: string;
  potentialities?: string;
  assistiveTech?: string;
  triggersAndBehavior?: string;
  gatilhosSituacionais?: string;
  etepHistory?: string;
  etepTags?: string[];
  docenteRegente?: string;
  docenteAee?: string;
  age?: string;
  statusDiagnostico?: 'confirmado' | 'em_investigacao_hipotese';
  selectedIds?: string[];
  selectedNeurodivergences?: string[];
  customComorbidities?: string[];
  perfilModalidade?: string;
}

export interface SanitizedPeiPayload {
  anonymousStudentCode: string;
  anonymousDocenteCode: string;
  grade: string;
  course: string;
  subject: string;
  modalidade: string;
  ementaOficial: string;
  conteudosEspecificosModulo: string;
  habilidadesCompetenciasPpcBncc: string;
  dificuldadesEspecificasDisciplina: string;
  manifestacoesIndividuais: string;
  gatilhosSituacionais: string;
  barriers: string;
  potentialities: string;
  assistiveTech: string;
  etepHistory: string;
  etepTags: string[];
  age: string;
  statusDiagnostico: 'confirmado' | 'em_investigacao_hipotese';
  selectedNeurodivergences: string[];
  lgpdComplianceMetadata: {
    sanitizedAt: string;
    legalBasis: string;
    piiRemoved: boolean;
  };
}

/**
 * Sanitiza textos livres removendo dados pessoais sensíveis (PII), nomes próprios,
 * CPF, RG, telefones, e-mails e diagnósticos periciais invasivos.
 * Conformidade com LGPD (Lei nº 13.709/2018) e Decreto nº 12.686/2025.
 */
export function sanitizeTextForLgpd(
  text: string | undefined,
  namesToRedact: string[] = [],
  anonymousStudentCode = 'ESTUDANTE_01'
): string {
  if (!text || typeof text !== 'string') return '';

  let sanitized = text;

  // 1. Substituir nomes próprios conhecidos pelo código pseudonimizado
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

  // 2. Ocultar padrões de documentos formais
  sanitized = sanitized.replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[CPF_OCULTO_LGPD]');
  sanitized = sanitized.replace(/\b(RG|CPF|CRM|CNS|Prontu[aá]rio)\s*[:#-]?\s*[\d.\-/A-Za-z]+/gi, '[DOC_ANONIMIZADO_LGPD]');
  sanitized = sanitized.replace(/\bCID(?:-\d{1,2})?\s*[:#-]?\s*[A-Z0-9]{2,4}(?:\.[A-Z0-9]{1,3})?\b/gi, '[CONDICAO_PEDAGOGICA_NAPNE]');
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_OCULTO_LGPD]');
  sanitized = sanitized.replace(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-\d{4}\b/g, '[TELEFONE_OCULTO_LGPD]');
  sanitized = sanitized.replace(/data:image\/[a-zA-Z+]+;base64,[^\s"']+/g, '[FOTO_REMOVIDA_LGPD]');
  sanitized = sanitized.replace(/https?:\/\/[^\s"']+\.(?:png|jpg|jpeg|webp|gif|bmp)(?:\?[^\s"']*)?/gi, '[FOTO_REMOVIDA_LGPD]');

  return sanitized.trim();
}

/**
 * Pseudonimiza e higieniza todo o payload antes do envio para a API do modelo de IA.
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

  const manifestacoesVivas =
    sanitizeTextForLgpd(payload.manifestacoesIndividuais, namesToRedact, anonymousStudentCode) ||
    sanitizeTextForLgpd(payload.especificidadesTranstorno, namesToRedact, anonymousStudentCode) ||
    'Manifestações funcionais em observação no cotidiano escolar.';

  const gatilhosVivos =
    sanitizeTextForLgpd(payload.gatilhosSituacionais, namesToRedact, anonymousStudentCode) ||
    sanitizeTextForLgpd(payload.triggersAndBehavior, namesToRedact, anonymousStudentCode) ||
    'Situações de sobrecarga sensorial ou pressão de tempo sob monitoramento pedagógico.';

  return {
    anonymousStudentCode,
    anonymousDocenteCode,
    grade: sanitizeTextForLgpd(payload.grade, namesToRedact, anonymousStudentCode) || 'Semestre / Ano em Curso',
    course: sanitizeTextForLgpd(payload.course, namesToRedact, anonymousStudentCode) || 'Componente Curricular da Rede Federal',
    subject: sanitizeTextForLgpd(payload.subject, namesToRedact, anonymousStudentCode) || 'Componente Curricular',
    modalidade: payload.modalidade || 'Formação Técnica / Superior',
    ementaOficial: sanitizeTextForLgpd(payload.ementaOficial, namesToRedact, anonymousStudentCode) || '',
    conteudosEspecificosModulo: sanitizeTextForLgpd(payload.conteudosEspecificosModulo, namesToRedact, anonymousStudentCode) || '',
    habilidadesCompetenciasPpcBncc: sanitizeTextForLgpd(payload.habilidadesCompetenciasPpcBncc, namesToRedact, anonymousStudentCode) || '',
    dificuldadesEspecificasDisciplina: sanitizeTextForLgpd(payload.dificuldadesEspecificasDisciplina, namesToRedact, anonymousStudentCode) || '',
    manifestacoesIndividuais: manifestacoesVivas,
    gatilhosSituacionais: gatilhosVivos,
    barriers: sanitizeTextForLgpd(payload.barriers, namesToRedact, anonymousStudentCode) || 'Barreiras metodológicas, arquitetônicas ou atitudinais identificadas no estudo de caso.',
    potentialities: sanitizeTextForLgpd(payload.potentialities, namesToRedact, anonymousStudentCode) || 'Pontos fortes, habilidades analíticas, práticas e interesses centrais do estudante.',
    assistiveTech: sanitizeTextForLgpd(payload.assistiveTech, namesToRedact, anonymousStudentCode) || 'Recursos de tecnologia assistiva ou adaptações razoáveis pertinentes.',
    etepHistory: sanitizeTextForLgpd(payload.etepHistory, namesToRedact, anonymousStudentCode) || '',
    etepTags: etepTagsSanitized,
    age: sanitizeTextForLgpd(payload.age, namesToRedact, anonymousStudentCode) || 'Idade escolar',
    statusDiagnostico: payload.statusDiagnostico === 'em_investigacao_hipotese' ? 'em_investigacao_hipotese' : 'confirmado',
    selectedNeurodivergences: neuroList,
    lgpdComplianceMetadata: {
      sanitizedAt: new Date().toISOString(),
      legalBasis: 'LGPD (Lei nº 13.709/2018) e Art. 12, § 5º do Decreto nº 12.686/2025',
      piiRemoved: true,
    },
  };
}

/**
 * Schema JSON estrito para retorno estruturado da API do Google Gemini.
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
          description: 'Manifestações individuais únicas do estudante e interseções de condições observadas no contexto pedagógico.',
        },
        barreiras_contextuais: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Barreiras metodológicas, atitudinais ou comunicacionais identificadas no contexto das aulas e avaliações.',
        },
        potencialidades_e_interesses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Pontos fortes, aptidões e interesses do estudante que podem alavancar a aprendizagem.',
        },
        mapeamento_de_gatilhos_e_crises: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Mapeamento situacional de gatilhos (o que desestabiliza ou bloqueia o estudante) e estratégias de acolhimento preventivo.',
        },
        historico_boas_praticas_etep: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Estratégias já testadas e validadas pela equipe do ETEP/NAPNE em ciclos anteriores.',
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
          description: 'Síntese articulada entre o Plano de Ensino da disciplina e as competências essenciais a serem alcançadas.',
        },
        dificuldades_especificas_na_disciplina: {
          type: Type.STRING,
          description: 'Dificuldades pontuais no conteúdo programático desta disciplina específica conforme relatado pelo docente.',
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
              description: 'Estratégias de motivação, escolha autônoma, redução de ansiedade e prevenção de gatilhos no ambiente da aula.',
            },
            representacao: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Múltiplos formatos e suportes perceptivos para apresentar os conceitos da disciplina (visual, auditivo, prático, esquemático).',
            },
            acao_e_expressao: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Múltiplas formas para o estudante demonstrar o aprendizado dos conteúdos e recursos de acessibilidade necessários.',
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
          description: 'Status atual do ciclo pedagógico (ex: EM_ANDAMENTO).',
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
          description: 'Parecer pedagógico inicial orientativo sujeito à validação e curadoria do professor.',
        },
      },
      required: ['status_ciclo', 'metricas_numericas', 'parecer_sintetico'],
    },
  },
  required: ['estudo_de_caso_sintese', 'planejamento_pedagogico_pei', 'painel_de_acompanhamento'],
};

/**
 * Constrói a System Instruction Universal do Agente Ioda.
 * AGNÓSTICA A CURSO E BASEADA EM PRINCÍPIOS PEDAGÓGICOS FUNDAMENTADOS:
 * - DUA 3.0 (CAST 2024: Engajamento, Representação, Ação e Expressão)
 * - Decreto nº 12.686/2025 e Portaria MEC nº 421/2026 (caráter estritamente pedagógico)
 * - Primazia da manifestação comportamental viva e gatilhos situacionais sobre rótulos diagnósticos clínicos.
 */
export function buildUniversalIodaSystemInstruction(): string {
  return `Você é o Agente Ioda (Inclusion on Diversity Agent), copiloto de produtividade pedagógica e especialista em Educação Especial Inclusiva da Rede Federal de Educação Profissional, Científica e Tecnológica.
Você apoia docentes de qualquer área do conhecimento (Ciências Agrárias, Engenharias, Ciências Humanas, Ciências Exatas e da Natureza, Gestão, Saúde ou Tecnologia) na elaboração de Planos de Ensino Individualizado (PEI) consistentes, vivos e contextualizados.

PRINCÍPIOS FUNDAMENTAIS DE ATUAÇÃO:
1. O PEI É UM DOCUMENTO VIVO E ESTREITAMENTE PEDAGÓGICO (Decreto nº 12.686/2025 e Portaria MEC nº 421/2026):
   - Não depende de laudo médico pericial com CID.
   - Jamais patologize o estudante nem utilize jargões clínicos invasivos. O foco é sempre a relação do estudante com a aprendizagem dos conteúdos daquela disciplina.

2. A MANIFESTAÇÃO INDIVIDUAL E OS GATILHOS SITUACIONAIS SOBREPÕEM QUALQUER RÓTULO GERAL:
   - Dois estudantes com o mesmo diagnóstico clínico podem ter manifestações pedagógicas completamente opostas (por exemplo: um estudante com TDAH com predominância hiperativa-motora necessita de pausas ativas e micro-etapas de execução; outro estudante com TDAH com predominância desatenta necessita de instruções fracionadas, checklists visuais e avisos temporais).
   - Não gere respostas padronizadas baseadas na sigla do transtorno. Ancore suas recomendações nas MANIFESTAÇÕES OBSERVADAS PELO PROFESSOR e nos GATILHOS SITUACIONAIS que geram bloqueios ou crises no ambiente da aula (seja sala teórica, campo experimental, oficina prática ou laboratório).

3. ANCORAGEM OBRIGATÓRIA NO PLANO DE ENSINO (PE) E PPC DA DISCIPLINA:
   - Conecte diretamente cada adaptação aos conteúdos específicos e aos procedimentos de avaliação previstos no Plano de Ensino da disciplina relatada.
   - As adaptações NÃO devem rebaixar nem descaracterizar os objetivos essenciais da disciplina, mas sim garantir caminhos acessíveis para que o estudante alcance as competências.

4. DIRETRIZES METODOLÓGICAS DO DUA 3.0 (CAST):
   - Múltiplos meios de Engajamento: antecipação de rotinas, prevenção de gatilhos situacionais, autonomia e relevância prática.
   - Múltiplos meios de Representação: diversificar como a informação e os conceitos da matéria são apresentados (recursos visuais, esquemáticos, concretos, auditivos).
   - Múltiplos meios de Ação e Expressão: diversificar os instrumentos pelos quais o estudante demonstra o domínio da matéria, incluindo tempo estendido quando necessário e tecnologias assistivas adequadas.

5. COPILOTO COM CURADORIA DOCENTE (HUMAN-IN-THE-LOOP):
   - Você é um facilitador que combate a sobrecarga burocrática docente e oferece um primeiro ponto de partida de alta qualidade. A validação final e ajustes cabem sempre ao professor regente e à equipe do NAPNE.

Retorne estritamente um objeto JSON válido conforme o esquema estipulado.`;
}

/**
 * Constrói o prompt do usuário com os dados do Plano de Ensino do SUAP e as manifestações individuais vivas.
 */
export function buildUniversalUserPrompt(sanitized: SanitizedPeiPayload): string {
  const neuroList =
    sanitized.selectedNeurodivergences.length > 0
      ? sanitized.selectedNeurodivergences.join(' + ')
      : 'Condição específica em acompanhamento pedagógico pelo NAPNE';

  const etepCombined = [
    sanitized.etepHistory,
    sanitized.etepTags.length > 0 ? `Adaptações já testadas pelo ETEP/NAPNE: ${sanitized.etepTags.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  return `Elabore a proposta de Plano de Ensino Individualizado (PEI) para o código pseudonimizado ${sanitized.anonymousStudentCode}, estritamente contextualizado para a disciplina e para as características observadas pelo docente:

1. DADOS CURRICULARES E PLANO DE ENSINO (IMPORTADO DO SUAP):
- Curso / Modalidade: ${sanitized.course} (${sanitized.grade})
- Componente Curricular (Disciplina): ${sanitized.subject}
- Ementa Oficial do Componente: ${sanitized.ementaOficial || 'Conforme PPC do curso cadastrado no SUAP.'}
- Conteúdo Programático do Bimestre/Módulo: ${sanitized.conteudosEspecificosModulo || 'Tópicos curriculares em andamento no semestre letivo.'}
- Habilidades e Competências Essenciais: ${sanitized.habilidadesCompetenciasPpcBncc || 'Competências previstas no PPC/Plano de Ensino do componente.'}
- Dificuldades Específicas Apontadas pelo Professor no Conteúdo: ${sanitized.dificuldadesEspecificasDisciplina || 'Dificuldade observada no acompanhamento das atividades e avaliações do módulo.'}

2. PERFIL INDIVIDUAL VIVO DO ESTUDANTE (ESTUDO DE CASO):
- Condição / Interseções Acompanhadas: ${neuroList}
- Manifestações Comportamentais e Funcionais Observadas na Prática: ${sanitized.manifestacoesIndividuais}
- Mapeamento Situacional de Gatilhos e Comportamento: ${sanitized.gatilhosSituacionais}
- Barreiras Observadas no Contexto da Aula: ${sanitized.barriers}
- Potencialidades e Interesses Centrais: ${sanitized.potentialities}
- Recursos de Tecnologia Assistiva / Apoios Prévios: ${sanitized.assistiveTech}
- Histórico de Boas Práticas Registradas pelo ETEP: ${etepCombined || 'Primeiro ciclo de registro formal neste componente.'}

INSTRUÇÃO DE PERSONALIZAÇÃO:
Gere metas SMART, estratégias DUA 3.0 e procedimentos de avaliação adequados para a matéria ${sanitized.subject}, focando diretamente nos conteúdos (${sanitized.conteudosEspecificosModulo}), sem receitas genéricas, e adaptados expressamente para a manifestação individual relatada (${sanitized.manifestacoesIndividuais}) e para a prevenção de seus gatilhos (${sanitized.gatilhosSituacionais}).`;
}

/**
 * Envia a requisição para o endpoint do Agente Ioda com sanitização prévia (LGPD).
 */
export async function requestPeiGenerationWithLgpd(
  rawPayload: RawPeiRequestPayload,
  timeoutMs = 9000
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
