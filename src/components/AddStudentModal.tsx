import React, { useState } from 'react';
import { PEICompleto, EscalaFonte, ModoContraste } from '../types/pei';
import {
  gerarNovoPeiCompleto,
  bancoDeSolucoesPedagogicas,
} from '../data/initialCases';
import {
  requestPeiGenerationWithLgpd,
  sanitizePeiPayloadForLgpd,
} from '../services/geminiService';
import { CuradoriaDocenteBanner } from './CuradoriaDocenteBanner';
import {
  UserPlus,
  X,
  Sparkles,
  GraduationCap,
  Loader2,
  CheckCircle,
  FileCheck2,
  HelpCircle,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Type,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  History,
  Layers,
  Info,
  Plus,
  ShieldCheck,
} from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: PEICompleto) => void;
  escalaFonteAtual?: EscalaFonte;
  onMudarFonte?: (escala: EscalaFonte) => void;
  modoContrasteAtual?: ModoContraste;
  onMudarContraste?: (modo: ModoContraste) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  escalaFonteAtual = 'normal',
  onMudarFonte,
  modoContrasteAtual = 'padrao',
  onMudarContraste,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [perfilModalidade, setPerfilModalidade] = useState<'medio_tecnico' | 'superior_ti'>('medio_tecnico');
  const [statusDiagnostico, setStatusDiagnostico] = useState<'confirmado' | 'em_investigacao_hipotese'>('confirmado');
  const [categoriaNeurodivergencia, setCategoriaNeurodivergencia] = useState(
    'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)'
  );
  const [mostrarOutrasCondicoes, setMostrarOutrasCondicoes] = useState(false);
  const [verResumoTecnico, setVerResumoTecnico] = useState(false);
  const [showTriggerTooltip, setShowTriggerTooltip] = useState(false);

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [idade, setIdade] = useState('17 anos');
  const [curso, setCurso] = useState('Curso Técnico Integrado ao Ensino Médio em Informática');
  const [disciplina, setDisciplina] = useState('Programação Web e Algoritmos');
  const [modulo, setModulo] = useState('2º Ano / Diurno');
  const [condicao, setCondicao] = useState('');
  const [potencialidades, setPotentialidades] = useState('');
  const [assistiveTech, setAssistiveTech] = useState('');
  const [selectedSolucoes, setSelectedSolucoes] = useState<string[]>(['sol-tdah']);
  const [customComorbidities, setCustomComorbidities] = useState<string[]>([]);
  const [novaComorbidadeInput, setNovaComorbidadeInput] = useState('');

  // NOVO BLOCO 1: Mapeamento de Gatilhos e Comportamento (Análise Funcional)
  const [mapeamentoGatilhos, setMapeamentoGatilhos] = useState(
    'Ruídos altos no laboratório, instruções verbais longas sem apoio visual e mudanças bruscas de rotina.'
  );

  // NOVO BLOCO 2: Histórico ETEP / Boas Práticas Anteriores
  const [historicoEtepTexto, setHistoricoEtepTexto] = useState(
    'Roteiros passo a passo antecipados no Moodle e divisão de projetos práticos em micro-entregas (chunking).'
  );
  const [etepTags, setEtepTags] = useState<string[]>([
    'Tempo adicional (+50%) em provas práticas',
    'Programação em Pares (Pair Programming)',
    'Cartão de Pausa Sensorial Discreta',
  ]);
  const [novaTagEtep, setNovaTagEtep] = useState('');

  const [docenteRegente, setDocenteRegente] = useState('Prof. Docente da Disciplina');
  const [docenteAee] = useState('Profª. Renata Cavalcanti (NAPNE · Campus Paraíso)');

  const [isGenerating, setIsGenerating] = useState(false);
  const [stepMessage, setStepMessage] = useState('');

  if (!isOpen) return null;

  const presetsPpcEPlano = [
    {
      id: 'preset-eng-soft-2',
      tag: 'Superior TI',
      titulo: 'BAC.0406 - Engenharia de Software II',
      curso: 'Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins)',
      modulo: '4º Período / Noturno',
      docente: 'Prof. Alexandre Santos',
      perfil: 'superior_ti' as const,
      idade: '21 anos',
    },
    {
      id: 'preset-bd-sql',
      tag: 'Superior TI',
      titulo: 'Banco de Dados Relacional e SQL',
      curso: 'Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins)',
      modulo: '3º Período / Noturno',
      docente: 'Prof. Docente de Banco de Dados',
      perfil: 'superior_ti' as const,
      idade: '20 anos',
    },
    {
      id: 'preset-algoritmos-bsi',
      tag: 'Superior TI',
      titulo: 'Algoritmos e Lógica de Programação',
      curso: 'Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins)',
      modulo: '1º Período / Noturno',
      docente: 'Prof. Docente de Lógica e Algoritmos',
      perfil: 'superior_ti' as const,
      idade: '19 anos',
    },
    {
      id: 'preset-tecnico-web',
      tag: 'Médio Técnico',
      titulo: 'Programação Web e Algoritmos',
      curso: 'Curso Técnico Integrado ao Ensino Médio em Informática',
      modulo: '2º Ano / Diurno',
      docente: 'Prof. Docente de Desenvolvimento Web',
      perfil: 'medio_tecnico' as const,
      idade: '16 anos',
    },
    {
      id: 'preset-tecnico-redes',
      tag: 'Médio Técnico',
      titulo: 'Fundamentos de Redes de Computadores e Hardware',
      curso: 'Curso Técnico Integrado ao Ensino Médio em Informática',
      modulo: '1º Ano / Diurno',
      docente: 'Prof. Gilberto Mendes',
      perfil: 'medio_tecnico' as const,
      idade: '15 anos',
    },
  ];

  const handleApplyCoursePreset = (preset: typeof presetsPpcEPlano[0]) => {
    setCurso(preset.curso);
    setDisciplina(preset.titulo);
    setModulo(preset.modulo);
    setDocenteRegente(preset.docente);
    setIdade(preset.idade);
    setPerfilModalidade(preset.perfil);
  };

  const handleSelectProfile = (perfil: 'medio_tecnico' | 'superior_ti') => {
    setPerfilModalidade(perfil);

    if (perfil === 'superior_ti') {
      setCurso('Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins)');
      setModulo('4º Período / Noturno');
      setDisciplina('BAC.0406 - Engenharia de Software II');
      setDocenteRegente('Prof. Alexandre Santos');
      setIdade('21 anos');
      syncSelectedConditions(['sol-tdah'], 'BAC.0406 - Engenharia de Software II');
    } else {
      setCurso('Curso Técnico Integrado ao Ensino Médio em Informática');
      setModulo('2º Ano / Diurno');
      setDisciplina('Programação Web e Algoritmos');
      setDocenteRegente('Prof. Docente da Disciplina');
      setIdade('17 anos');
      syncSelectedConditions(['sol-tea'], 'Programação Web e Algoritmos');
    }
  };

  const syncSelectedConditions = (
    ids: string[],
    discOverride?: string,
    extraComorbidities: string[] = customComorbidities
  ) => {
    const finalIds = ids.length > 0 ? ids : ['sol-tdah'];
    setSelectedSolucoes(finalIds);

    const solucoesObjs = finalIds
      .map((sid) => bancoDeSolucoesPedagogicas.find((s) => s.id === sid))
      .filter(Boolean);

    if (solucoesObjs.length > 0) {
      const titulosCombinados = [
        ...solucoesObjs.map((s) => s!.titulo),
        ...extraComorbidities,
      ].join(' + ');
      setCategoriaNeurodivergencia(titulosCombinados);

      const currentDisc = discOverride ?? disciplina;
      const isEngSoft =
        currentDisc.toLowerCase().includes('engenharia de software') ||
        currentDisc.includes('BAC.0406');

      const descricoesCombinadas = solucoesObjs
        .map((s) => `• ${s!.titulo}: ${s!.descricaoProblema}`)
        .join('\n');

      let customCondicao = descricoesCombinadas;
      if (isEngSoft) {
        customCondicao += `\n\n[Contextualização na disciplina BAC.0406 - Engenharia de Software II: acomodações integradas para testes unitários TDD em JUnit/Selenium e relatórios no Jira].`;
      }
      setCondicao(customCondicao);

      const taUnificada = Array.from(
        new Set(solucoesObjs.flatMap((s) => s!.remediosSugeridos.recursosTA))
      );
      setAssistiveTech(taUnificada.join(', '));

      const mapPotencial: Record<string, string> = {
        'sol-tdah':
          'Raciocínio ágil, resolução criativa de bugs lógicos e foco em desafios práticos de codificação quando divididos em etapas curtas',
        'sol-tea':
          'Atenção meticulosa aos detalhes, raciocínio lógico estruturado e facilidade para identificar padrões em código e testes',
        'sol-ahsd':
          'Alta velocidade de abstração lógica, domínio rápido de arquiteturas complexas e hiperfoco criativo em projetos desafiadores',
        'sol-ansiedade':
          'Comprometimento com entregas de qualidade e ótimo desempenho em projetos práticos desenvolvidos no próprio ritmo',
        'sol-aprendizagem':
          'Pensamento computacional visual, visão prática de sistemas e bom raciocínio algorítmico',
        'sol-def-intelectual':
          'Dedicação ao aprendizado prático de computação, colaboração em duplas e boa retenção com instruções objetivas',
        'sol-toc':
          'Elevada precisão técnica, cuidado na cobertura de testes e organização de código',
        'sol-misto-ansioso-depressivo':
          'Comprometimento com projetos significativos quando apoiado por metas graduais',
        'sol-depressao':
          'Capacidade analítica e engajamento construtivo em projetos práticos em ambiente acolhedor',
        'sol-epilepsia':
          'Raciocínio lógico estruturado e consistência técnica em laboratório visualmente seguro',
      };

      const potList = finalIds.map(
        (id) =>
          mapPotencial[id] ||
          'Dedicação ao aprendizado prático de computação, raciocínio lógico e colaboração técnica'
      );
      setPotentialidades(Array.from(new Set(potList)).join('; ') + '.');

      // Auto-populate functional triggers based on selected intersection
      const gatilhosSugeridos: string[] = [];
      if (finalIds.includes('sol-tea')) {
        gatilhosSugeridos.push(
          'Ruídos altos no laboratório, luzes piscantes e mudanças bruscas de rotina sem aviso prévio'
        );
      }
      if (finalIds.includes('sol-tdah')) {
        gatilhosSugeridos.push(
          'Instruções verbais longas sem apoio visual e tarefas extensas sem checkpoints intermediários'
        );
      }
      if (finalIds.includes('sol-ansiedade') || finalIds.includes('sol-misto-ansioso-depressivo')) {
        gatilhosSugeridos.push(
          'Exposição oral imprevista perante a turma e cronômetros regressivos visíveis em provas'
        );
      }
      if (finalIds.includes('sol-ahsd')) {
        gatilhosSugeridos.push(
          'Exercícios mecânicos repetitivos sem desafio conceitual e perfeccionismo em escopos abertos'
        );
      }
      if (gatilhosSugeridos.length > 0) {
        setMapeamentoGatilhos(gatilhosSugeridos.join('; ') + '.');
      }

      if (finalIds.includes('sol-hipotese-sem-laudo')) {
        setStatusDiagnostico('em_investigacao_hipotese');
      }
    }
  };

  const handleTogglePredefinedSolution = (id: string) => {
    const exists = selectedSolucoes.includes(id);
    let nextIds: string[];
    if (exists) {
      nextIds = selectedSolucoes.length > 1 ? selectedSolucoes.filter((item) => item !== id) : [id];
    } else {
      nextIds = [...selectedSolucoes, id];
    }
    syncSelectedConditions(nextIds);
  };

  const handleApplyIntersectionPreset = (ids: string[]) => {
    syncSelectedConditions(ids);
  };

  const handleAddCustomComorbidity = () => {
    const trimmed = novaComorbidadeInput.trim();
    if (!trimmed) return;
    if (!customComorbidities.includes(trimmed)) {
      const updated = [...customComorbidities, trimmed];
      setCustomComorbidities(updated);
      syncSelectedConditions(selectedSolucoes, undefined, updated);
    }
    setNovaComorbidadeInput('');
  };

  const handleRemoveCustomComorbidity = (item: string) => {
    const updated = customComorbidities.filter((c) => c !== item);
    setCustomComorbidities(updated);
    syncSelectedConditions(selectedSolucoes, undefined, updated);
  };

  const handleToggleEtepTag = (tag: string) => {
    if (etepTags.includes(tag)) {
      setEtepTags(etepTags.filter((t) => t !== tag));
    } else {
      setEtepTags([...etepTags, tag]);
    }
  };

  const handleAddCustomEtepTag = () => {
    const trimmed = novaTagEtep.trim();
    if (!trimmed) return;
    if (!etepTags.includes(trimmed)) {
      setEtepTags([...etepTags, trimmed]);
    }
    setNovaTagEtep('');
  };

  const isStep2Valid = nome.trim().length > 0 && disciplina.trim().length > 0;

  const handleFinalSubmit = async () => {
    if (!nome.trim() || !disciplina.trim()) {
      setCurrentStep(2);
      return;
    }

    setIsGenerating(true);
    const modalidadeDesc = perfilModalidade === 'superior_ti' ? 'Superior em TI' : 'Médio Técnico em TI';
    setStepMessage(
      `Sanitizando dados (LGPD · ESTUDANTE_01) e gerando PEI para ${modalidadeDesc}...`
    );

    const gatilhosArray = mapeamentoGatilhos
      .split(/[;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const historicoEtepArray = [
      ...historicoEtepTexto
        .split(/[;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      ...etepTags,
    ];

    const neuroTitles = [
      ...selectedSolucoes
        .map((sid) => bancoDeSolucoesPedagogicas.find((s) => s.id === sid)?.titulo)
        .filter((t): t is string => Boolean(t)),
      ...customComorbidities,
    ];

    try {
      let finalPei: PEICompleto | null = null;
      const localTemplate = gerarNovoPeiCompleto({
        nome: nome.trim(),
        matricula: matricula.trim(),
        idade: idade.trim(),
        curso: curso.trim(),
        disciplina: disciplina.trim(),
        modulo: modulo.trim(),
        condicao: condicao.trim() || 'Barreiras observadas no laboratório de informática.',
        docenteRegente: docenteRegente.trim(),
        docenteAee: docenteAee.trim(),
        solucaoBaseId: selectedSolucoes[0] || 'sol-tdah',
        solucaoBaseIds: selectedSolucoes,
        statusDiagnostico,
        categoriaNeurodivergencia,
        mapeamentoGatilhos: gatilhosArray,
        historicoEtep: historicoEtepArray,
        interseccaoCondicoes: neuroTitles,
      });

      try {
        const { success, data: gen } = await requestPeiGenerationWithLgpd({
          studentName: nome.trim(),
          grade: modulo.trim(),
          course: curso.trim(),
          subject: disciplina.trim(),
          barriers: condicao.trim(),
          potentialities: potencialidades.trim(),
          assistiveTech: assistiveTech.trim(),
          triggersAndBehavior: mapeamentoGatilhos.trim(),
          etepHistory: historicoEtepTexto.trim(),
          etepTags,
          docenteRegente: docenteRegente.trim(),
          docenteAee: docenteAee.trim(),
          age: idade.trim(),
          perfilModalidade,
          statusDiagnostico,
          campus: 'Campus Paraíso',
          selectedIds: selectedSolucoes,
          selectedNeurodivergences: neuroTitles,
          customComorbidities,
        });

        if (success && gen) {
          const metasGeradas =
            Array.isArray(gen.planejamento_pedagogico_pei?.metas_e_objetivos) &&
            gen.planejamento_pedagogico_pei.metas_e_objetivos.length > 0
              ? gen.planejamento_pedagogico_pei.metas_e_objetivos
              : Array.isArray((gen.planejamento_pedagogico_pei as any)?.objetivos_e_metas_adaptadas)
              ? (gen.planejamento_pedagogico_pei as any).objetivos_e_metas_adaptadas
              : [];

          const duaGerado =
            gen.planejamento_pedagogico_pei?.estrategias_preventivas_e_dua_3_0 ||
            (gen.planejamento_pedagogico_pei as any)?.flexibilizacao_metodologica_dua;

          finalPei = {
            ...localTemplate,
            id: `PEI-${Date.now().toString().slice(-4)}`,
            cabecalho: {
              ...localTemplate.cabecalho,
              // Restauramos localmente o nome real apenas na interface do professor (jamais enviado em texto aberto à IA)
              estudante: nome.trim(),
              codigo_matricula:
                matricula.trim() ||
                gen.cabecalho?.codigo_matricula ||
                localTemplate.cabecalho.codigo_matricula,
              curso: curso.trim(),
              componente_curricular: disciplina.trim(),
              modulo_periodo: modulo.trim(),
              docente_regente: docenteRegente.trim(),
            },
            historico_napne: {
              ...localTemplate.historico_napne,
              condicoes_associadas: neuroTitles,
            },
            estudo_de_caso: {
              ...localTemplate.estudo_de_caso,
              mapeamento_de_gatilhos_e_crises:
                Array.isArray(gen.estudo_de_caso_sintese?.mapeamento_de_gatilhos_e_crises) &&
                gen.estudo_de_caso_sintese.mapeamento_de_gatilhos_e_crises.length > 0
                  ? gen.estudo_de_caso_sintese.mapeamento_de_gatilhos_e_crises
                  : gatilhosArray,
              historico_boas_praticas_etep:
                Array.isArray(gen.estudo_de_caso_sintese?.historico_boas_praticas_etep) &&
                gen.estudo_de_caso_sintese.historico_boas_praticas_etep.length > 0
                  ? gen.estudo_de_caso_sintese.historico_boas_praticas_etep
                  : historicoEtepArray,
              interseccao_condicoes: neuroTitles,
            },
            planejamento_pei: {
              ...localTemplate.planejamento_pei,
              conteudo_ementa_oficial:
                gen.planejamento_pedagogico_pei?.conteudo_ementa_oficial ||
                localTemplate.planejamento_pei.conteudo_ementa_oficial,
              competencias_habilidades_ementa:
                gen.planejamento_pedagogico_pei?.competencias_habilidades_ementa ||
                localTemplate.planejamento_pei.competencias_habilidades_ementa,
              adaptacao_flexibilizacao_curricular:
                gen.planejamento_pedagogico_pei?.adaptacao_flexibilizacao_curricular ||
                localTemplate.planejamento_pei.adaptacao_flexibilizacao_curricular,
              objetivos_e_metas:
                metasGeradas.length > 0
                  ? metasGeradas.map((m: any, idx: number) => ({
                      id_meta: m.id_meta || `M${idx + 1}`,
                      descricao_meta: m.descricao_meta,
                      prazo: m.prazo || 'Mensal (4 semanas)',
                      indicador_sucesso: m.indicador_sucesso,
                      progresso_percentual: 50,
                      status: 'em_andamento',
                    }))
                  : localTemplate.planejamento_pei.objetivos_e_metas,
              flexibilizacao_metodologica_dua: {
                engajamento:
                  duaGerado?.engajamento_e_autorregulacao ||
                  duaGerado?.engajamento ||
                  localTemplate.planejamento_pei.flexibilizacao_metodologica_dua.engajamento,
                representacao:
                  duaGerado?.representacao ||
                  localTemplate.planejamento_pei.flexibilizacao_metodologica_dua.representacao,
                acao_e_expressao:
                  duaGerado?.acao_e_expressao ||
                  localTemplate.planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao,
              },
              estrategias_avaliacao: {
                ...localTemplate.planejamento_pei.estrategias_avaliacao,
                formato_acessivel:
                  gen.planejamento_pedagogico_pei?.estrategias_de_avaliacao?.formato_acessivel ||
                  localTemplate.planejamento_pei.estrategias_avaliacao.formato_acessivel,
                criterio_de_sucesso:
                  gen.planejamento_pedagogico_pei?.estrategias_de_avaliacao?.criterio_de_sucesso ||
                  localTemplate.planejamento_pei.estrategias_avaliacao.criterio_de_sucesso,
              },
              guia_pratico_sala_de_aula:
                gen.planejamento_pedagogico_pei?.guia_pratico_sala_de_aula ||
                localTemplate.planejamento_pei.guia_pratico_sala_de_aula,
            },
            parecer_pedagogico:
              gen.painel_de_acompanhamento?.parecer_sintetico ||
              localTemplate.parecer_pedagogico,
          };
        }
      } catch {
        // Fallback to localTemplate
      }

      onAddStudent(finalPei || localTemplate);
      onClose();
    } finally {
      setIsGenerating(false);
      setStepMessage('');
    }
  };

  // Clean Chip / Checkbox list for primary neurodivergences including AH/SD
  const chipsNeurodivergencias = [
    { id: 'sol-tdah', label: 'TDAH (Déficit de Atenção e Hiperatividade)' },
    { id: 'sol-tea', label: 'TEA (Espectro Autista)' },
    { id: 'sol-ahsd', label: 'AH/SD (Altas Habilidades / Superdotação)' },
    { id: 'sol-ansiedade', label: 'Transtornos de Ansiedade' },
    { id: 'sol-aprendizagem', label: 'Dislexia / Disgrafia / Discalculia' },
    { id: 'sol-def-intelectual', label: 'Deficiência Intelectual' },
    { id: 'sol-toc', label: 'TOC (Obsessivo-Compulsivo)' },
    { id: 'sol-misto-ansioso-depressivo', label: 'Misto Ansioso e Depressivo' },
    { id: 'sol-depressao', label: 'Transtornos Depressivos' },
    { id: 'sol-epilepsia', label: 'Epilepsia e Crises Convulsivas' },
  ];

  // Quick Intersection Presets (Comorbidades / Dupla Excepcionalidade)
  const combosInterseccao = [
    { label: 'Autismo (TEA) + TDAH', ids: ['sol-tea', 'sol-tdah'] },
    { label: 'AH/SD + Ansiedade', ids: ['sol-ahsd', 'sol-ansiedade'] },
    { label: 'AH/SD + TDAH (2e)', ids: ['sol-ahsd', 'sol-tdah'] },
    { label: 'TEA + Ansiedade', ids: ['sol-tea', 'sol-ansiedade'] },
    { label: 'TDAH + Dislexia', ids: ['sol-tdah', 'sol-aprendizagem'] },
  ];

  const outrasCondicoesChips = [
    { id: 'sol-baixa-visao', label: 'Baixa Visão / Cegueira' },
    { id: 'sol-motora', label: 'Deficiência Física / Motora' },
    { id: 'sol-auditiva', label: 'Surdez / Deficiência Auditiva' },
    { id: 'sol-hipotese-sem-laudo', label: 'Em Investigação (Sem Laudo)' },
  ];

  const sugestoesGatilhosRapidos = [
    'Ruídos altos no laboratório',
    'Luzes piscantes / brilho excessivo',
    'Instruções verbais longas sem apoio visual',
    'Mudanças bruscas de rotina ou prazos',
    'Apresentação oral imprevista em público',
  ];

  const sugestoesTagsEtep = [
    'Tempo adicional (+50%) em provas práticas',
    'Programação em Pares (Pair Programming)',
    'Cartão de Pausa Sensorial Discreta',
    'Roteiros em Markdown antecipados no Moodle',
    'Substituição de defesa oral por vídeo curto (Loom)',
    'Fonte OpenDyslexic / Alto Contraste no VS Code',
  ];

  const solucoesSelecionadasObjs = selectedSolucoes
    .map((id) => bancoDeSolucoesPedagogicas.find((s) => s.id === id))
    .filter(Boolean);

  const previewLgpd = sanitizePeiPayloadForLgpd(
    {
      studentName: nome || 'Estudante',
      docenteRegente,
      course: curso,
      subject: disciplina,
      barriers: condicao,
      triggersAndBehavior: mapeamentoGatilhos,
      etepHistory: historicoEtepTexto,
      etepTags,
    },
    1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-4 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Gerador de PEI Assistido · Agente Ioda
              </h3>
              <p className="text-xs text-slate-500">
                Passo {currentStep} de 4 — Coleta pedagógica modular (DUA 3.0, Análise Funcional & Histórico ETEP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onMudarFonte && onMudarContraste && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    onMudarFonte(
                      escalaFonteAtual === 'normal'
                        ? 'ampliada'
                        : escalaFonteAtual === 'ampliada'
                        ? 'grande'
                        : 'normal'
                    )
                  }
                  className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded transition-colors"
                  title="Tamanho da fonte"
                >
                  <Type className="w-3.5 h-3.5 inline mr-0.5" />
                  {escalaFonteAtual === 'normal' ? 'A' : escalaFonteAtual === 'ampliada' ? 'A+' : 'A++'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onMudarContraste(
                      modoContrasteAtual === 'padrao'
                        ? 'conforto'
                        : modoContrasteAtual === 'conforto'
                        ? 'alto-contraste'
                        : 'padrao'
                    )
                  }
                  className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white rounded transition-colors"
                  title="Contraste visual"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1 text-emerald-700" />
                  Contraste
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* REQUISITO 2: AVISO DE CURADORIA DOCENTE NO TOPO DO GERADOR DE PEI */}
        <div className="pt-3 shrink-0">
          <CuradoriaDocenteBanner variant="compact" />
        </div>

        {/* Clean Stepper Bar */}
        <div className="py-3 border-b border-slate-100 shrink-0">
          <div className="grid grid-cols-4 gap-2">
            {[
              { step: 1, label: '1. Modalidade' },
              { step: 2, label: '2. Aluno & Aula' },
              { step: 3, label: '3. Perfil, Gatilhos & ETEP' },
              { step: 4, label: '4. Revisar & Gerar' },
            ].map((item) => {
              const isCurrent = currentStep === item.step;
              const isDone = currentStep > item.step;
              const canClick = item.step <= 2 || isStep2Valid;
              return (
                <button
                  key={item.step}
                  type="button"
                  disabled={!canClick || isGenerating}
                  onClick={() => canClick && setCurrentStep(item.step as 1 | 2 | 3 | 4)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                  } ${!canClick ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="flex-1 overflow-y-auto py-5 px-1 space-y-6">
          {/* PASSO 1: MODALIDADE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Escolha o nível de ensino do estudante para calibrar os exemplos práticos:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectProfile('medio_tecnico')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    perfilModalidade === 'medio_tecnico'
                      ? 'bg-emerald-50/70 border-emerald-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        perfilModalidade === 'medio_tecnico'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Laptop className="w-5 h-5" />
                    </div>
                    {perfilModalidade === 'medio_tecnico' && (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Médio Técnico em TI</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Curso Técnico Integrado ao Ensino Médio. Foco em atividades guiadas, duplas no laboratório e roteiros passo a passo.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProfile('superior_ti')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    perfilModalidade === 'superior_ti'
                      ? 'bg-emerald-50/70 border-emerald-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        perfilModalidade === 'superior_ti'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    {perfilModalidade === 'superior_ti' && (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Superior em TI</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sistemas de Informação e Graduação. Foco em autonomia acadêmica, projetos em etapas (sprints) e engenharia de software.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: IDENTIFICAÇÃO DO ALUNO E DISCIPLINA */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nome do Estudante <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome completo do aluno (protegido por pseudonimização LGPD)"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                    required
                  />
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                    Privacidade LGPD: O nome será substituído por código anônimo (ESTUDANTE_01) antes da chamada à IA.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Idade
                  </label>
                  <input
                    type="text"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  Atalhos Rápidos de Disciplinas (Opcional):
                </span>
                <div className="flex flex-wrap gap-2">
                  {presetsPpcEPlano.map((p) => {
                    const isCurrent = disciplina === p.titulo;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyCoursePreset(p)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.titulo}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Disciplina <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Professor(a) Responsável
                  </label>
                  <input
                    type="text"
                    value={docenteRegente}
                    onChange={(e) => setDocenteRegente(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Curso
                  </label>
                  <input
                    type="text"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Período / Turma
                  </label>
                  <input
                    type="text"
                    value={modulo}
                    onChange={(e) => setModulo(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: TRÊS NOVOS BLOCOS PEDAGÓGICOS EM LAYOUT MODULAR (BENTO GRID) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Situação do Laudo */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4">
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Situação do Acompanhamento (Portaria MEC nº 421/2026 — Não exige laudo médico):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStatusDiagnostico('confirmado')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      statusDiagnostico === 'confirmado'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Com Laudo / Prontuário NAPNE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusDiagnostico('em_investigacao_hipotese')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      statusDiagnostico === 'em_investigacao_hipotese'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Sem Laudo (Em Observação Pedagógica)</span>
                  </button>
                </div>
              </div>

              {/* ================================================================= */}
              {/* BLOCO DE ENTRADA 1: INTERSECÇÃO DE NEURODIVERGÊNCIAS E CONDIÇÕES   */}
              {/* ================================================================= */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        1. Intersecção de Neurodivergências e Condições Associadas
                      </h4>
                      <p className="text-xs text-slate-500">
                        Selecione múltiplas condições ou comorbidades (ex: Autismo + TDAH, AH/SD + Ansiedade) para uma visão holística e não estigmatizante
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {selectedSolucoes.length + customComorbidities.length} condição(ões) ativa(s)
                  </span>
                </div>

                {/* Atalhos Rápidos de Intersecção / Comorbidades */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Combinações Frequentes (Intersecção / Dupla Excepcionalidade):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {combosInterseccao.map((combo) => {
                      const isComboActive =
                        combo.ids.every((id) => selectedSolucoes.includes(id)) &&
                        selectedSolucoes.length === combo.ids.length;
                      return (
                        <button
                          key={combo.label}
                          type="button"
                          onClick={() => handleApplyIntersectionPreset(combo.ids)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isComboActive
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                          }`}
                        >
                          {combo.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grade de Seleção Múltipla */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {chipsNeurodivergencias.map((item) => {
                    const isSelected = selectedSolucoes.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTogglePredefinedSolution(item.id)}
                        className={`px-3.5 py-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="leading-snug">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Registro de Outra Condição / Comorbidade Específica */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={novaComorbidadeInput}
                      onChange={(e) => setNovaComorbidadeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomComorbidity();
                        }
                      }}
                      placeholder="Adicionar outra condição associada ou especificidade (ex: TPS, Burnout Acadêmico)..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomComorbidity}
                      className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Incluir na Intersecção</span>
                    </button>
                  </div>

                  {customComorbidities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {customComorbidities.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 text-xs font-semibold"
                        >
                          <span>{c}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomComorbidity(c)}
                            className="text-emerald-700 hover:text-red-600 cursor-pointer"
                            title="Remover condição"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botões discretos para outras condições e resumo */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMostrarOutrasCondicoes(!mostrarOutrasCondicoes)}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    {mostrarOutrasCondicoes ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Ocultar condições sensoriais/motoras</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Mais condições (Visual, Motora, Surdez)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerResumoTecnico(!verResumoTecnico)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    {verResumoTecnico ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Ocultar síntese combinada</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Ver síntese da intersecção selecionada</span>
                      </>
                    )}
                  </button>
                </div>

                {mostrarOutrasCondicoes && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {outrasCondicoesChips.map((item) => {
                      const isSelected = selectedSolucoes.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTogglePredefinedSolution(item.id)}
                          className={`px-3.5 py-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {verResumoTecnico && solucoesSelecionadasObjs.length > 0 && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                    {solucoesSelecionadasObjs.map((s) => (
                      <div key={s!.id}>
                        <strong className="text-slate-900">{s!.titulo}:</strong>{' '}
                        <span>{s!.remediosSugeridos.acaoExpressao}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ================================================================= */}
              {/* BLOCO DE ENTRADA 2 & 3 EM BENTO GRID (GATILHOS + HISTÓRICO ETEP)   */}
              {/* ================================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* BLOCO 2: MAPEAMENTO DE GATILHOS E COMPORTAMENTO (ANÁLISE FUNCIONAL) */}
                <div className="bg-white border border-amber-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            2. Mapeamento de Gatilhos e Comportamento (Análise Funcional)
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Gatilhos sensoriais, ambientais ou rotineiros que podem gerar sobrecarga ou ansiedade
                          </p>
                        </div>
                      </div>

                      {/* Tooltip / Dica de Interface Oficial */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowTriggerTooltip(!showTriggerTooltip)}
                          onMouseEnter={() => setShowTriggerTooltip(true)}
                          onMouseLeave={() => setShowTriggerTooltip(false)}
                          title="Ex: ruídos altos, luzes piscantes, instruções verbais longas sem apoio visual, mudanças bruscas de rotina."
                          aria-label="Dica sobre mapeamento de gatilhos"
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        {showTriggerTooltip && (
                          <div className="absolute right-0 top-9 z-20 w-72 p-3 rounded-xl bg-slate-900 text-white text-xs shadow-xl leading-relaxed">
                            <strong>Dica de preenchimento:</strong> Ex: ruídos altos, luzes piscantes, instruções verbais longas sem apoio visual, mudanças bruscas de rotina.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dica visível e acessível */}
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed">
                      <strong>Dica:</strong>{' '}
                      <em>
                        &ldquo;Ex: ruídos altos, luzes piscantes, instruções verbais longas sem apoio visual, mudanças bruscas de rotina.&rdquo;
                      </em>
                    </div>

                    <textarea
                      value={mapeamentoGatilhos}
                      onChange={(e) => setMapeamentoGatilhos(e.target.value)}
                      rows={3}
                      placeholder="Ex: ruídos altos, luzes piscantes, instruções verbais longas sem apoio visual, mudanças bruscas de rotina."
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs leading-relaxed"
                    />
                  </div>

                  {/* Atalhos rápidos de gatilhos */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Adicionar gatilho observado (+):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sugestoesGatilhosRapidos.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            if (!mapeamentoGatilhos.toLowerCase().includes(g.toLowerCase())) {
                              setMapeamentoGatilhos((prev) =>
                                prev.trim() ? `${prev.replace(/\.$/, '')}; ${g}.` : `${g}.`
                              );
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          + {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BLOCO 3: HISTÓRICO ETEP / BOAS PRÁTICAS ANTERIORES */}
                <div className="bg-white border border-emerald-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <History className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          3. Histórico ETEP / Boas Práticas Anteriores
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Recupere estratégias que já funcionaram em ciclos anteriores sem &ldquo;reinventar a roda&rdquo;
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={historicoEtepTexto}
                      onChange={(e) => setHistoricoEtepTexto(e.target.value)}
                      rows={3}
                      placeholder="Registre adaptações da ETEP/NAPNE e docentes anteriores que tiveram êxito com o estudante..."
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs leading-relaxed"
                    />

                    {/* Sistema de Tags de Boas Práticas Anteriores */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Tags de Estratégias Validadas (Clique para ativar/desativar):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sugestoesTagsEtep.map((tag) => {
                          const active = etepTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleEtepTag(tag)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                                active
                                  ? 'bg-emerald-700 text-white border-emerald-700'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {active && <Check className="w-3 h-3" />}
                              <span>{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Adicionar nova tag ETEP */}
                  <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={novaTagEtep}
                      onChange={(e) => setNovaTagEtep(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomEtepTag();
                        }
                      }}
                      placeholder="Nova tag de boa prática ETEP..."
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomEtepTag}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                    >
                      + Tag
                    </button>
                  </div>
                </div>
              </div>

              {/* Observações e Potencialidades Complementares */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Barreiras Contextuais na Disciplina
                  </label>
                  <textarea
                    value={condicao}
                    onChange={(e) => setCondicao(e.target.value)}
                    rows={2}
                    placeholder="Descreva as barreiras metodológicas ou tecnológicas observadas em aula..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Potencialidades e Interesses do Estudante
                  </label>
                  <textarea
                    value={potencialidades}
                    onChange={(e) => setPotentialidades(e.target.value)}
                    rows={2}
                    placeholder="Ex: Raciocínio lógico, interesse em jogos, aprende melhor com exemplos visuais e práticos..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 4: REVISÃO MODULAR E AUDITORIA DE PRIVACIDADE LGPD */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{nome || 'Estudante'}</h4>
                    <p className="text-xs text-slate-500">
                      {curso} · {modulo}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                    {perfilModalidade === 'superior_ti' ? 'Superior TI' : 'Médio Técnico'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold block mb-0.5">Disciplina & Docente:</span>
                    <span className="text-slate-900 font-bold block">{disciplina}</span>
                    <span className="text-slate-600">{docenteRegente}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-semibold block mb-0.5">
                      Intersecção de Condições:
                    </span>
                    <span className="text-emerald-800 font-bold block">{categoriaNeurodivergencia}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200">
                    <span className="text-amber-900 font-bold block mb-0.5">
                      Mapeamento de Gatilhos (Análise Funcional):
                    </span>
                    <span className="text-slate-700 leading-relaxed">{mapeamentoGatilhos}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <span className="text-emerald-900 font-bold block mb-0.5">
                      Histórico ETEP / Boas Práticas ({etepTags.length} tags):
                    </span>
                    <span className="text-slate-700 leading-relaxed block">{historicoEtepTexto}</span>
                  </div>
                </div>

                {/* Indicador de Sanitização / Pseudonimização LGPD */}
                <div className="p-3.5 rounded-xl bg-emerald-950 text-emerald-50 border border-emerald-800 text-xs flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white block">
                      Camada de Privacidade Ativa — LGPD (Lei nº 13.709/2018) & Art. 12, § 5º do Decreto nº 12.686/2025
                    </span>
                    <p className="text-emerald-200/90 leading-relaxed">
                      Antes de enviar a requisição à API do Gemini, o nome real é pseudonimizado para{' '}
                      <code className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                        {previewLgpd.anonymousStudentCode}
                      </code>{' '}
                      e o docente para{' '}
                      <code className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                        {previewLgpd.anonymousDocenteCode}
                      </code>
                      , removendo CPFs, fotos ou dados clínicos sensíveis do payload externo.
                    </p>
                  </div>
                </div>
              </div>

              {isGenerating && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-emerald-700 animate-spin shrink-0" />
                  <span className="text-xs font-semibold text-emerald-950">{stepMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as any) : prev))}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 2 && !isStep2Valid) return;
                  setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as any) : prev));
                }}
                disabled={currentStep === 2 && !isStep2Valid}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isGenerating || !nome.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gerando PEI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Concluir e Gerar PEI</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
