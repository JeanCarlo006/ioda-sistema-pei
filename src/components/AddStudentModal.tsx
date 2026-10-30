import React, { useState } from 'react';
import { PEICompleto, EscalaFonte, ModoContraste } from '../types/pei';
import {
  gerarNovoPeiCompleto,
  bancoDeSolucoesPedagogicas,
} from '../data/initialCases';
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

  const syncSelectedConditions = (ids: string[], discOverride?: string) => {
    const finalIds = ids.length > 0 ? ids : ['sol-tdah'];
    setSelectedSolucoes(finalIds);

    const solucoesObjs = finalIds
      .map((sid) => bancoDeSolucoesPedagogicas.find((s) => s.id === sid))
      .filter(Boolean);

    if (solucoesObjs.length > 0) {
      const titulosCombinados = solucoesObjs.map((s) => s!.titulo).join(' + ');
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

  const isStep2Valid = nome.trim().length > 0 && disciplina.trim().length > 0;

  const handleFinalSubmit = async () => {
    if (!nome.trim() || !disciplina.trim()) {
      setCurrentStep(2);
      return;
    }

    setIsGenerating(true);
    const modalidadeDesc = perfilModalidade === 'superior_ti' ? 'Superior em TI' : 'Médio Técnico em TI';
    setStepMessage(`Gerando estratégias práticas de sala de aula para ${modalidadeDesc}...`);

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
      });

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 7000)
        );

        const fetchPromise = fetch('/api/gemini/generate-pei', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            studentName: nome.trim(),
            grade: modulo.trim(),
            course: curso.trim(),
            subject: disciplina.trim(),
            barriers: condicao.trim(),
            potentialities: potencialidades.trim(),
            assistiveTech: assistiveTech.trim(),
            docenteRegente: docenteRegente.trim(),
            docenteAee: docenteAee.trim(),
            age: idade.trim(),
            perfilModalidade,
            statusDiagnostico,
            campus: 'Campus Paraíso',
            selectedIds: selectedSolucoes,
            selectedNeurodivergences: selectedSolucoes
              .map((sid) => bancoDeSolucoesPedagogicas.find((s) => s.id === sid)?.titulo)
              .filter(Boolean),
          }),
        });

        const response: any = await Promise.race([fetchPromise, timeoutPromise]);
        const contentType = response.headers?.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            const gen = resData.data;

            finalPei = {
              ...localTemplate,
              id: `PEI-${Date.now().toString().slice(-4)}`,
              cabecalho: {
                ...localTemplate.cabecalho,
                estudante: gen.cabecalho?.estudante || nome.trim(),
                codigo_matricula:
                  gen.cabecalho?.codigo_matricula ||
                  matricula.trim() ||
                  localTemplate.cabecalho.codigo_matricula,
                curso: gen.cabecalho?.curso || curso.trim(),
                componente_curricular: gen.cabecalho?.componente_curricular || disciplina.trim(),
                modulo_periodo: gen.cabecalho?.modulo_periodo || modulo.trim(),
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
                  Array.isArray(gen.planejamento_pedagogico_pei?.objetivos_e_metas_adaptadas) &&
                  gen.planejamento_pedagogico_pei.objetivos_e_metas_adaptadas.length > 0
                    ? gen.planejamento_pedagogico_pei.objetivos_e_metas_adaptadas.map((m: any) => ({
                        id_meta: m.id_meta || 'M1',
                        descricao_meta: m.descricao_meta,
                        prazo: m.prazo || 'Mensal (4 semanas)',
                        indicador_sucesso: m.indicador_sucesso,
                        progresso_percentual: 50,
                        status: 'em_andamento',
                      }))
                    : localTemplate.planejamento_pei.objetivos_e_metas,
                flexibilizacao_metodologica_dua: {
                  engajamento:
                    gen.planejamento_pedagogico_pei?.flexibilizacao_metodologica_dua?.engajamento ||
                    localTemplate.planejamento_pei.flexibilizacao_metodologica_dua.engajamento,
                  representacao:
                    gen.planejamento_pedagogico_pei?.flexibilizacao_metodologica_dua?.representacao ||
                    localTemplate.planejamento_pei.flexibilizacao_metodologica_dua.representacao,
                  acao_e_expressao:
                    gen.planejamento_pedagogico_pei?.flexibilizacao_metodologica_dua?.acao_e_expressao ||
                    localTemplate.planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao,
                },
                guia_pratico_sala_de_aula:
                  gen.planejamento_pedagogico_pei?.guia_pratico_sala_de_aula ||
                  localTemplate.planejamento_pei.guia_pratico_sala_de_aula,
              },
            };
          }
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

  // Clean Chip / Checkbox list for the 9 primary neurodivergences
  const chipsNeurodivergencias = [
    { id: 'sol-tdah', label: 'TDAH (Déficit de Atenção e Hiperatividade)' },
    { id: 'sol-tea', label: 'TEA (Espectro Autista)' },
    { id: 'sol-ansiedade', label: 'Transtornos de Ansiedade' },
    { id: 'sol-aprendizagem', label: 'Dislexia / Disgrafia / Discalculia' },
    { id: 'sol-def-intelectual', label: 'Deficiência Intelectual' },
    { id: 'sol-toc', label: 'TOC (Obsessivo-Compulsivo)' },
    { id: 'sol-misto-ansioso-depressivo', label: 'Misto Ansioso e Depressivo' },
    { id: 'sol-depressao', label: 'Transtornos Depressivos' },
    { id: 'sol-epilepsia', label: 'Epilepsia e Crises Convulsivas' },
  ];

  const outrasCondicoesChips = [
    { id: 'sol-baixa-visao', label: 'Baixa Visão / Cegueira' },
    { id: 'sol-motora', label: 'Deficiência Física / Motora' },
    { id: 'sol-auditiva', label: 'Surdez / Deficiência Auditiva' },
    { id: 'sol-hipotese-sem-laudo', label: 'Em Investigação (Sem Laudo)' },
  ];

  const solucoesSelecionadasObjs = selectedSolucoes
    .map((id) => bancoDeSolucoesPedagogicas.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-4 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Novo Plano de Aula (PEI)
              </h3>
              <p className="text-xs text-slate-500">
                Passo {currentStep} de 4 — Preenchimento rápido e simplificado
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

        {/* Clean Stepper Bar */}
        <div className="py-3 border-b border-slate-100 shrink-0">
          <div className="grid grid-cols-4 gap-2">
            {[
              { step: 1, label: '1. Modalidade' },
              { step: 2, label: '2. Aluno & Aula' },
              { step: 3, label: '3. Condições' },
              { step: 4, label: '4. Gerar PEI' },
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
        <div className="flex-1 overflow-y-auto py-5 px-1 space-y-5">
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
                    placeholder="Digite o nome completo do aluno"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                    required
                  />
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

          {/* PASSO 3: SELEÇÃO LIMPA DE NEURODIVERGÊNCIAS (CHIPS / CHECKBOXES) */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Situação do Laudo */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Situação do Diagnóstico:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStatusDiagnostico('confirmado')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      statusDiagnostico === 'confirmado'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Com Laudo Confirmado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusDiagnostico('em_investigacao_hipotese')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      statusDiagnostico === 'em_investigacao_hipotese'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Sem Laudo (Em Observação)</span>
                  </button>
                </div>
              </div>

              {/* Chips / Checkboxes de Neurodivergências (LIMPOS, SEM TEXTOS LONGOS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Selecione uma ou mais condições do estudante:
                  </label>
                  <span className="text-xs font-semibold text-emerald-700">
                    {selectedSolucoes.length} selecionada(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {chipsNeurodivergencias.map((item) => {
                    const isSelected = selectedSolucoes.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTogglePredefinedSolution(item.id)}
                        className={`px-3.5 py-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
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

                {/* Botão discreto para outras condições */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMostrarOutrasCondicoes(!mostrarOutrasCondicoes)}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    {mostrarOutrasCondicoes ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Ocultar condições visuais/motoras/auditivas</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Mais condições (Visual, Motora, Surdez)</span>
                      </>
                    )}
                  </button>

                  {/* Botão discreto "Ver resumo" fechado por padrão */}
                  <button
                    type="button"
                    onClick={() => setVerResumoTecnico(!verResumoTecnico)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    {verResumoTecnico ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Ocultar resumo</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Ver resumo das condições selecionadas</span>
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

              {/* Observações e Potencialidades (Digitação Tradicional Limpa) */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Dificuldades / Barreiras Observadas em Aula
                  </label>
                  <textarea
                    value={condicao}
                    onChange={(e) => setCondicao(e.target.value)}
                    rows={2}
                    placeholder="Descreva as barreiras ou dificuldades observadas no laboratório e na sala de aula..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Interesses e Pontos Fortes do Estudante
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

          {/* PASSO 4: REVISÃO SIMPLES */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{nome || 'Estudante'}</h4>
                    <p className="text-xs text-slate-500">{curso} · {modulo}</p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                    {perfilModalidade === 'superior_ti' ? 'Superior TI' : 'Médio Técnico'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold">Disciplina: </span>
                    <span className="text-slate-900 font-bold">{disciplina}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Professor(a): </span>
                    <span className="text-slate-800">{docenteRegente}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Condições Selecionadas: </span>
                    <span className="text-emerald-800 font-bold">{categoriaNeurodivergencia}</span>
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
