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
import { DIARIOS_SUAP_INSTITUCIONAIS, DiarioSuap } from '../services/suapService';
import {
  UserPlus,
  X,
  Sparkles,
  GraduationCap,
  Loader2,
  CheckCircle,
  CheckCircle2,
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
  BookOpen,
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
  // Wizard de 5 etapas sequenciais para baixa carga cognitiva (poucos campos por tela)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [perfilModalidade, setPerfilModalidade] = useState<'medio_tecnico' | 'superior_ti'>('medio_tecnico');
  const [statusDiagnostico, setStatusDiagnostico] = useState<'confirmado' | 'em_investigacao_hipotese'>('confirmado');
  const [categoriaNeurodivergencia, setCategoriaNeurodivergencia] = useState(
    'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)'
  );
  const [mostrarOutrasCondicoes, setMostrarOutrasCondicoes] = useState(false);
  const [showTriggerTooltip, setShowTriggerTooltip] = useState(false);

  const [selectedDiarioId, setSelectedDiarioId] = useState<string>(DIARIOS_SUAP_INSTITUCIONAIS[0]?.id || '');

  // Passo 1: Identificação Básica integrada ao SUAP
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [idade, setIdade] = useState('');
  const [curso, setCurso] = useState(DIARIOS_SUAP_INSTITUCIONAIS[0]?.curso || '');
  const [modulo, setModulo] = useState(DIARIOS_SUAP_INSTITUCIONAIS[0]?.semestrePeriodo || '');
  const [docenteRegente, setDocenteRegente] = useState('Prof. Regente da Disciplina');
  const [docenteAee] = useState('Equipe NAPNE / AEE');

  // Passo 2: Detalhamento do Componente Curricular (PPC / Plano de Ensino do SUAP)
  const [disciplina, setDisciplina] = useState(DIARIOS_SUAP_INSTITUCIONAIS[0]?.nomeDisciplina || '');
  const [ementaOficial, setEmentaOficial] = useState(DIARIOS_SUAP_INSTITUCIONAIS[0]?.planoEnsino.ementa || '');
  const [conteudosEspecificosModulo, setConteudosEspecificosModulo] = useState(
    DIARIOS_SUAP_INSTITUCIONAIS[0]?.planoEnsino.conteudosProgramaticos
      .map((c) => `${c.bimestreOuEtapa}: ${c.topicos}`)
      .join('\n\n') || ''
  );
  const [habilidadesCompetenciasPpcBncc, setHabilidadesCompetenciasPpcBncc] = useState(
    DIARIOS_SUAP_INSTITUCIONAIS[0]?.planoEnsino.habilidadesCompetenciasPpc || ''
  );
  const [dificuldadesEspecificasDisciplina, setDificuldadesEspecificasDisciplina] = useState('');

  const handleSelectDiarioSuap = (diario: DiarioSuap) => {
    setSelectedDiarioId(diario.id);
    setCurso(diario.curso);
    setDisciplina(diario.nomeDisciplina);
    setModulo(diario.semestrePeriodo);
    setDocenteRegente(diario.docenteNome || 'Prof. Regente da Disciplina');
    setEmentaOficial(diario.planoEnsino.ementa);
    const conteudosText = diario.planoEnsino.conteudosProgramaticos
      .map((c) => `${c.bimestreOuEtapa}: ${c.topicos}`)
      .join('\n\n');
    setConteudosEspecificosModulo(conteudosText);
    setHabilidadesCompetenciasPpcBncc(diario.planoEnsino.habilidadesCompetenciasPpc);

    if (diario.estudantes.length > 0) {
      const primeiro = diario.estudantes[0];
      setNome(primeiro.nome);
      setMatricula(primeiro.matricula);
      if (primeiro.idade) setIdade(primeiro.idade);
      if (primeiro.observacoesNapne) {
        setEspecificidadesTranstorno(primeiro.observacoesNapne);
      }
    }
  };

  // Passo 3: Especificidades por Transtorno / Neurodivergência & Intersecções
  const [selectedSolucoes, setSelectedSolucoes] = useState<string[]>(['sol-tdah']);
  const [customComorbidities, setCustomComorbidities] = useState<string[]>([]);
  const [novaComorbidadeInput, setNovaComorbidadeInput] = useState('');
  const [especificidadesTranstorno, setEspecificidadesTranstorno] = useState('');
  const [condicao, setCondicao] = useState('');
  const [potencialidades, setPotentialidades] = useState('');
  const [assistiveTech, setAssistiveTech] = useState('');

  // Passo 4: Mapeamento de Gatilhos (Análise Funcional) & Histórico ETEP
  const [mapeamentoGatilhos, setMapeamentoGatilhos] = useState('');
  const [historicoEtepTexto, setHistoricoEtepTexto] = useState('');
  const [etepTags, setEtepTags] = useState<string[]>([]);
  const [novaTagEtep, setNovaTagEtep] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [stepMessage, setStepMessage] = useState('');

  if (!isOpen) return null;

  const presetsPpcEPlano = [
    // Agropecuária
    {
      id: 'preset-agro-zootecnia',
      tag: 'Agropecuária',
      titulo: 'AGR.0201 - Zootecnia Geral e Manejo Animal',
      curso: 'Técnico Integrado ao Ensino Médio em Agropecuária',
      modulo: '2º Ano / Integral',
      docente: 'Prof. Marcos Aurélio de Souza',
      perfil: 'medio_tecnico' as const,
      idade: '16 anos',
      ementa:
        'Fisiologia e bem-estar animal, instalações zootécnicas, nutrição básica de ruminantes e monogástricos, vacinação, biossegurança e registro de índices produtivos no campo.',
      conteudosModulo:
        'Práticas de contenção e manejo de rebanhos, cálculo de ração balanceada e preenchimento de fichas de controle sanitário na fazenda-escola.',
      habilidadesPpcBncc:
        'Planejar e executar operações de manejo animal com segurança; aplicar noções de bem-estar animal e sustentabilidade agropecuária (PPC Agropecuária).',
      dificuldadesPadrao:
        'Hipersensibilidade auditiva ou tátil a ruídos de maquinário e odores de esterco; dificuldade em fixar passos procedimentais sem roteiro visual ilustrado.',
    },
    {
      id: 'preset-agro-mecanizacao',
      tag: 'Agropecuária',
      titulo: 'AGR.0403 - Mecanização Agrícola e Irrigação',
      curso: 'Técnico Integrado ao Ensino Médio em Agropecuária',
      modulo: '3º Ano / Integral',
      docente: 'Prof. Marcos Aurélio de Souza',
      perfil: 'medio_tecnico' as const,
      idade: '17 anos',
      ementa:
        'Operação e manutenção preventiva de tratores e implementos; sistemas de irrigação (gotejamento/aspersão); regulagem de pulverizadores e segurança do trabalho rural (NR-31).',
      conteudosModulo:
        'Regulagem de distribuição de sementes e adubos, cálculo de vazão de água e condução segura de maquinários na lavoura experimental.',
      habilidadesPpcBncc:
        'Operar sistemas de mecanização e irrigação agrícola de forma sustentável e preventiva (PPC Agropecuária / BNCC).',
      dificuldadesPadrao:
        'Ansiedade ao operar maquinários pesados com vibração; dificuldade em cálculos de vazão em tempo real sob sol intenso sem apoio de tabela simplificada.',
    },
    // Edificações
    {
      id: 'preset-edif-desenho',
      tag: 'Edificações',
      titulo: 'EDF.0301 - Desenho Técnico Arquitetônico e CAD',
      curso: 'Técnico em Edificações Subsequente/Integrado',
      modulo: '2º Módulo / Vespertino',
      docente: 'Profª. Dra. Cláudia Rezende',
      perfil: 'medio_tecnico' as const,
      idade: '18 anos',
      ementa:
        'Normas da ABNT para desenho de construção civil (NBR 6492); plantas baixas, cortes, fachadas, coberturas, detalhamento construtivo e desenho auxiliado por computador (CAD/BIM).',
      conteudosModulo:
        'Elaboração de pranchas de projeto arquitetônico residencial unifamiliar com escalas, cotas normalizadas e espessura de penas em software CAD.',
      habilidadesPpcBncc:
        'Interpretar e elaborar projetos técnicos de edificações com exatidão normativa e domínio de ferramentas gráficas (PPC Edificações).',
      dificuldadesPadrao:
        'Fadiga na leitura espacial de cortes e fachadas; sobrecarga cognitiva com densidade de linhas e espessuras na prancha técnica sem modelo tátil ou tridimensional.',
    },
    // Química e Alimentos
    {
      id: 'preset-quim-laboratorio',
      tag: 'Química e Alimentos',
      titulo: 'QUI.0102 - Química Geral Experimental e Laboratório',
      curso: 'Técnico Integrado em Química / Alimentos',
      modulo: '1º Ano / Diurno',
      docente: 'Profª. Mariana Duarte',
      perfil: 'medio_tecnico' as const,
      idade: '15 anos',
      ementa:
        'Biossegurança e boas práticas em laboratório químico; técnicas de pesagem e medição volumétrica; preparo e padronização de soluções; titulações ácido-base e relatórios.',
      conteudosModulo:
        'Calibração de vidrarias, manuseio seguro de ácidos e bases na capela de exaustão e confecção de relatórios de aulas práticas.',
      habilidadesPpcBncc:
        'Realizar ensaios físico-químicos com rigor metodológico e observância das normas de biossegurança e sustentabilidade (PPC Química).',
      dificuldadesPadrao:
        'Receio ou ansiedade de manuseio com frascos de vidro e reagentes; dispersão durante instruções orais complexas sem checklist impresso de segurança.',
    },
    // Administração
    {
      id: 'preset-adm-gestao',
      tag: 'Administração',
      titulo: 'ADM.0402 - Gestão de Pessoas e Comportamento Organizacional',
      curso: 'Técnico em Administração Integrado / Subsequente',
      modulo: '3º Módulo / Noturno',
      docente: 'Prof. Roberto Silveira',
      perfil: 'medio_tecnico' as const,
      idade: '19 anos',
      ementa:
        'Modelos de liderança, motivação, comunicação organizacional, dinâmicas de equipe, gestão de conflitos, recrutamento, seleção e inclusão no trabalho.',
      conteudosModulo:
        'Análise de clima organizacional, mapeamento de competências e elaboração de planos de treinamento e desenvolvimento.',
      habilidadesPpcBncc:
        'Compreender o comportamento humano nas organizações e desenvolver processos participativos de gestão com foco na empatia e acessibilidade (PPC Administração).',
      dificuldadesPadrao:
        'Insegurança em dinâmicas de grupo e dramatizações simuladas; dificuldade com textos teóricos longos sem esquemas gráficos conceituais.',
    },
    // Informática & BSI
    {
      id: 'preset-eng-soft-2',
      tag: 'Superior TI',
      titulo: 'BAC.0406 - Engenharia de Software II',
      curso: 'Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins)',
      modulo: '4º Período / Noturno',
      docente: 'Prof. Alexandre Santos',
      perfil: 'superior_ti' as const,
      idade: '21 anos',
      ementa:
        'Qualidade de Software, Verificação e Validação (V&V), Fundamentos de Testes (Caixa-Preta, Caixa-Branca), Automação de Testes Unitários (JUnit) e de Interface (Selenium), TDD e Gestão de Defeitos.',
      conteudosModulo:
        'Planejamento de testes (IEEE 829), partição de equivalência, análise de valor limite, ciclo TDD (Red-Green-Refactor) com JUnit 5 e rastreamento de bugs no Jira.',
      habilidadesPpcBncc:
        'Projetar, implementar e executar suítes de testes automatizados; avaliar métricas de cobertura de código e assegurar a qualidade de sistemas corporativos (PPC BSI / DCN Computação).',
      dificuldadesPadrao:
        'Fadiga executiva ao redigir documentação extensa de planos de teste sem template estruturado e ansiedade em defesas orais abertas.',
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
      ementa:
        ' Projeto de Banco de Dados Relacional, Modelo Entidade-Relacionamento (MER), Normalização (1FN, 2FN, 3FN, BCNF), Álgebra Relacional e Linguagem SQL (DDL, DML, DQL, Joins, Subqueries e Transações ACID).',
      conteudosModulo:
        'Conversão MER para Modelo Lógico, criação de tabelas com integridade referencial (DDL) e consultas analíticas com INNER/LEFT JOIN, GROUP BY e HAVING no PostgreSQL.',
      habilidadesPpcBncc:
        'Modelar esquemas de dados íntegros e normalizados; elaborar consultas SQL eficientes e gerenciar transações em SGBDs relacionais (PPC BSI).',
      dificuldadesPadrao:
        'Barreira visual/abstrata na leitura de diagramas MER complexos sem descrição textual declarativa (DBML/DDL) e perda de foco em queries aninhadas longas.',
    },
    {
      id: 'preset-tecnico-web',
      tag: 'Médio Técnico TI',
      titulo: 'Programação Web e Algoritmos',
      curso: 'Curso Técnico Integrado ao Ensino Médio em Informática',
      modulo: '2º Ano / Diurno',
      docente: 'Prof. Docente de Desenvolvimento Web',
      perfil: 'medio_tecnico' as const,
      idade: '16 anos',
      ementa:
        'Estruturas de dados em memória (vetores e objetos), manipulação do DOM, eventos, funções assíncronas (Promises/Async-Await) e consumo de APIs REST com HTML5, CSS3 e JavaScript.',
      conteudosModulo:
        'Desenvolvimento de interfaces responsivas, manipulação de listas dinâmicas no DOM e validação de formulários acessíveis.',
      habilidadesPpcBncc:
        'Desenvolver aplicações web front-end acessíveis; aplicar pensamento computacional e decomposição algorítmica (BNCC Computação & PPC Técnico em Informática).',
      dificuldadesPadrao:
        'Sobrecarga ao ler enunciados extensos e dificuldade em manter a atenção durante a depuração de erros sintáticos no navegador/terminal.',
    },
  ];

  const handleApplyCoursePreset = (preset: typeof presetsPpcEPlano[0]) => {
    setCurso(preset.curso);
    setDisciplina(preset.titulo);
    setModulo(preset.modulo);
    setDocenteRegente(preset.docente);
    setIdade(preset.idade);
    setPerfilModalidade(preset.perfil);
    setEmentaOficial(preset.ementa);
    setConteudosEspecificosModulo(preset.conteudosModulo);
    setHabilidadesCompetenciasPpcBncc(preset.habilidadesPpcBncc);
    setDificuldadesEspecificasDisciplina(preset.dificuldadesPadrao);
  };

  const handleSelectProfile = (perfil: 'medio_tecnico' | 'superior_ti') => {
    setPerfilModalidade(perfil);
    if (perfil === 'superior_ti') {
      handleApplyCoursePreset(presetsPpcEPlano[0]);
      syncSelectedConditions(['sol-tdah'], presetsPpcEPlano[0].titulo);
    } else {
      handleApplyCoursePreset(presetsPpcEPlano[3]);
      syncSelectedConditions(['sol-tea'], presetsPpcEPlano[3].titulo);
    }
  };

  const mapEspecificidadesPorCondicao: Record<string, string> = {
    'sol-tea':
      'TEA: Comunicação literal e direta (evitar metáforas ou comandos vagos), necessidade de previsibilidade de rotina e sensibilidade sensorial a ruídos intensos no laboratório.',
    'sol-tdah':
      'TDAH: Desafios na função executiva e atenção sustentada em tarefas longas; ótimo rendimento quando atividades são fracionadas em micro-sprints (Pomodoro/Kanban) com feedback imediato.',
    'sol-ahsd':
      'AH/SD (Altas Habilidades / Superdotação): Rapidez de abstração lógica e hiperfoco criativo; necessita de enriquecimento curricular e desafios arquiteturais para evitar desmotivação com exercícios repetitivos.',
    'sol-ansiedade':
      'Ansiedade: Sobrecarga emocional sob pressão temporal estrita ou exposições orais imprevistas em público; beneficia-se de rubricas prévias e apresentação em vídeo curto ou individual.',
    'sol-aprendizagem':
      'Dislexia / Disgrafia / Discalculia: Fadiga visual na leitura de blocos densos de código ou textos sem espaçamento; excelente compreensão lógica quando apoiado por fontes acessíveis (OpenDyslexic) e diagramas.',
    'sol-baixa-visao':
      'Deficiência Visual / Baixa Visão: Necessidade de ampliação de tela, alto contraste, leitor de telas (NVDA) e substituição de diagramas puramente gráficos por descrições textuais estruturadas (DBML/Markdown).',
    'sol-auditiva':
      'Surdez / Deficiência Auditiva: Necessidade de apoio visual constante, legendagem, glossário técnico em Libras e posicionamento docente de frente para a turma em sincronia com o intérprete.',
    'sol-motora':
      'Deficiência Física / Motora: Fadiga motora fina em digitação extensa sob tempo restrito; pleno domínio intelectual quando apoiado por autocompletar inteligente, Pair Programming e tempo estendido (+50%).',
    'sol-def-intelectual':
      'Deficiência Intelectual: Necessidade de mediação estruturada, conceitos abstratos ancorados em exemplos concretos e instruções divididas em 2 a 3 passos objetivos.',
    'sol-toc':
      'TOC: Tendência a perfeccionismo ou refatoração repetitiva; beneficia-se de critérios explícitos de conclusão (Definition of Done) para avançar com segurança.',
    'sol-misto-ansioso-depressivo':
      'Misto Ansioso e Depressivo: Oscilação de energia mental; demanda metas graduais, acolhimento sem exposição e validação contínua dos avanços.',
    'sol-depressao':
      'Humor / Depressão: Necessidade de recomposição gradual da autoeficácia acadêmica por meio de entregas curtas e trabalho colaborativo em dupla acolhedora.',
    'sol-epilepsia':
      'Epilepsia: Prevenção de estresse luminoso (monitores 60Hz+ antirreflexo, tema escuro suave sem animações piscantes) e pausas regulares de descanso.',
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

      const descricoesCombinadas = solucoesObjs
        .map((s) => `• ${s!.titulo}: ${s!.descricaoProblema}`)
        .join('\n');

      setCondicao(descricoesCombinadas);

      const especificidadesCombinadas = finalIds
        .map((id) => mapEspecificidadesPorCondicao[id])
        .filter(Boolean);
      if (extraComorbidities.length > 0) {
        especificidadesCombinadas.push(
          `Intersecção adicional informada: ${extraComorbidities.join(', ')}.`
        );
      }
      if (especificidadesCombinadas.length > 0) {
        setEspecificidadesTranstorno(especificidadesCombinadas.join('\n'));
      }

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
        'sol-baixa-visao':
          'Excelente memória auditiva/estrutural, domínio de atalhos de teclado e linha de comando (CLI)',
        'sol-auditiva':
          'Forte percepção visual-espacial para arquitetura de interfaces, fluxogramas e diagramas de sistemas',
        'sol-motora':
          'Capacidade analítica e arquitetural destacada para liderar a lógica em programação em pares',
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

  const isStep1Valid = nome.trim().length > 0;
  const isStep2Valid = disciplina.trim().length > 0;

  const handleFinalSubmit = async () => {
    if (!nome.trim()) {
      setCurrentStep(1);
      return;
    }
    if (!disciplina.trim()) {
      setCurrentStep(2);
      return;
    }

    setIsGenerating(true);
    const modalidadeDesc = perfilModalidade === 'superior_ti' ? 'Superior em TI' : 'Médio Técnico em TI';
    setStepMessage(
      `Anonimizando dados (LGPD · ESTUDANTE_01) e gerando PEI contextualizado para ${disciplina} (${modalidadeDesc})...`
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

    const especificidadesArray = especificidadesTranstorno
      .split(/[;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

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
        condicao:
          `${especificidadesTranstorno.trim()}\n\nDificuldades específicas em ${disciplina.trim()}: ${dificuldadesEspecificasDisciplina.trim()}`.trim() ||
          condicao.trim(),
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

      // Enriquecer o template local com os dados específicos do componente curricular e neurodivergência
      localTemplate.estudo_de_caso.especificidades_transtorno_e_interseccoes = especificidadesArray;
      localTemplate.planejamento_pei.conteudo_ementa_oficial = `${ementaOficial.trim()} | Conteúdos do Semestre: ${conteudosEspecificosModulo.trim()}`;
      localTemplate.planejamento_pei.conteudos_especificos_modulo = conteudosEspecificosModulo.trim();
      localTemplate.planejamento_pei.competencias_habilidades_ementa = habilidadesCompetenciasPpcBncc.trim();
      localTemplate.planejamento_pei.dificuldades_especificas_na_disciplina = dificuldadesEspecificasDisciplina.trim();

      try {
        const { success, data: gen } = await requestPeiGenerationWithLgpd({
          studentName: nome.trim(),
          grade: modulo.trim(),
          course: curso.trim(),
          subject: disciplina.trim(),
          ementaOficial: ementaOficial.trim(),
          conteudosEspecificosModulo: conteudosEspecificosModulo.trim(),
          habilidadesCompetenciasPpcBncc: habilidadesCompetenciasPpcBncc.trim(),
          dificuldadesEspecificasDisciplina: dificuldadesEspecificasDisciplina.trim(),
          especificidadesTranstorno: especificidadesTranstorno.trim(),
          barriers: condicao.trim() || dificuldadesEspecificasDisciplina.trim(),
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

          const espTranstornoGeradas =
            gen.estudo_de_caso_sintese?.['especificidades_transtorno_e_intersecçoes'] ||
            gen.estudo_de_caso_sintese?.especificidades_transtorno_e_interseccoes ||
            especificidadesArray;

          finalPei = {
            ...localTemplate,
            id: `PEI-${Date.now().toString().slice(-4)}`,
            cabecalho: {
              ...localTemplate.cabecalho,
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
              especificidades_individuais: espTranstornoGeradas,
            },
            estudo_de_caso: {
              ...localTemplate.estudo_de_caso,
              especificidades_transtorno_e_interseccoes: espTranstornoGeradas,
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
                gen.planejamento_pedagogico_pei?.conteudo_ementa_e_habilidades_bncc ||
                gen.planejamento_pedagogico_pei?.conteudo_ementa_oficial ||
                localTemplate.planejamento_pei.conteudo_ementa_oficial,
              conteudos_especificos_modulo: conteudosEspecificosModulo.trim(),
              competencias_habilidades_ementa:
                habilidadesCompetenciasPpcBncc.trim() ||
                gen.planejamento_pedagogico_pei?.competencias_habilidades_ementa ||
                localTemplate.planejamento_pei.competencias_habilidades_ementa,
              dificuldades_especificas_na_disciplina:
                gen.planejamento_pedagogico_pei?.dificuldades_especificas_na_disciplina ||
                dificuldadesEspecificasDisciplina.trim(),
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
                  (duaGerado as any)?.engajamento ||
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

  // Chips de Neurodivergências e Condições
  const chipsNeurodivergencias = [
    { id: 'sol-tdah', label: 'TDAH (Déficit de Atenção e Hiperatividade)' },
    { id: 'sol-tea', label: 'TEA (Espectro Autista)' },
    { id: 'sol-ahsd', label: 'AH/SD (Altas Habilidades / Superdotação)' },
    { id: 'sol-ansiedade', label: 'Transtornos de Ansiedade' },
    { id: 'sol-aprendizagem', label: 'Dislexia / Disgrafia / Discalculia' },
    { id: 'sol-baixa-visao', label: 'Deficiência Visual / Baixa Visão' },
    { id: 'sol-auditiva', label: 'Surdez / Deficiência Auditiva' },
    { id: 'sol-motora', label: 'Deficiência Física / Motora' },
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
    { id: 'sol-def-intelectual', label: 'Deficiência Intelectual' },
    { id: 'sol-toc', label: 'TOC (Obsessivo-Compulsivo)' },
    { id: 'sol-misto-ansioso-depressivo', label: 'Misto Ansioso e Depressivo' },
    { id: 'sol-depressao', label: 'Transtornos Depressivos' },
    { id: 'sol-epilepsia', label: 'Epilepsia e Crises Convulsivas' },
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

  const previewLgpd = sanitizePeiPayloadForLgpd(
    {
      studentName: nome || 'Estudante',
      docenteRegente,
      course: curso,
      subject: disciplina,
      ementaOficial,
      conteudosEspecificosModulo,
      habilidadesCompetenciasPpcBncc,
      dificuldadesEspecificasDisciplina,
      especificidadesTranstorno,
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
                Gerador de PEI Contextualizado · Agente Ioda
              </h3>
              <p className="text-xs text-slate-500">
                Etapa {currentStep} de 5 — Wizard progressivo de baixa carga cognitiva
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

        {/* AVISO DE CURADORIA DOCENTE NO TOPO DO GERADOR DE PEI */}
        <div className="pt-3 shrink-0">
          <CuradoriaDocenteBanner variant="compact" />
        </div>

        {/* Progressive 5-Step Stepper Bar */}
        <div className="py-3 border-b border-slate-100 shrink-0">
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { step: 1, label: '1. Aluno' },
              { step: 2, label: '2. Disciplina' },
              { step: 3, label: '3. Condições' },
              { step: 4, label: '4. Gatilhos/ETEP' },
              { step: 5, label: '5. Gerar PEI' },
            ].map((item) => {
              const isCurrent = currentStep === item.step;
              const isDone = currentStep > item.step;
              const canClick =
                item.step === 1 ||
                (item.step === 2 && isStep1Valid) ||
                (item.step >= 3 && isStep1Valid && isStep2Valid);
              return (
                <button
                  key={item.step}
                  type="button"
                  disabled={!canClick || isGenerating}
                  onClick={() => canClick && setCurrentStep(item.step as 1 | 2 | 3 | 4 | 5)}
                  className={`py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                  } ${!canClick ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isDone && <Check className="w-3 h-3 text-emerald-700 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="flex-1 overflow-y-auto py-5 px-1 space-y-5">
          {/* ================================================================= */}
          {/* PASSO 1: MODALIDADE E IDENTIFICAÇÃO BÁSICA                        */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    Turmas / Diários Importados do SUAP (Selecione sua disciplina):
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Sincronizado com o SUAP
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DIARIOS_SUAP_INSTITUCIONAIS.map((d) => {
                    const isSelected = selectedDiarioId === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleSelectDiarioSuap(d)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {d.modalidade} · {d.campus}
                          </span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                          {d.nomeDisciplina}
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {d.curso} ({d.semestrePeriodo})
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estudantes matriculados neste diário no SUAP */}
              {(() => {
                const diarioAtual = DIARIOS_SUAP_INSTITUCIONAIS.find((d) => d.id === selectedDiarioId);
                return (
                  <div className="space-y-2">
                    <div className="bg-[#121518] border border-[#232830] rounded-xl p-3 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00d284] shrink-0"></span>
                        <span>Diário ativo: <strong>{diarioAtual?.nomeDisciplina || disciplina}</strong> ({diarioAtual?.codigoComponente})</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#00d284] bg-[#00d284]/10 border border-[#00d284]/30 px-2 py-0.5 rounded self-start sm:self-auto">
                        SUAP · Campus Paraíso
                      </span>
                    </div>

                    {diarioAtual && diarioAtual.estudantes.length > 0 && (
                      <div className="bg-[#161a1f] border border-[#272d36] rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            Alunos da Matéria no SUAP (Clique para importar os dados automaticamente):
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {diarioAtual.estudantes.length} estudantes matriculados
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {diarioAtual.estudantes.map((est) => {
                            const isCurrentEst = nome === est.nome;
                            return (
                              <button
                                key={est.id}
                                type="button"
                                onClick={() => {
                                  setNome(est.nome);
                                  setMatricula(est.matricula);
                                  if (est.idade) setIdade(est.idade);
                                  if (est.observacoesNapne) setEspecificidadesTranstorno(est.observacoesNapne);
                                }}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isCurrentEst
                                    ? 'bg-[#0099ff] text-white border-[#0099ff] shadow-sm'
                                    : 'bg-[#1c2026] text-slate-200 border-[#2d3440] hover:bg-[#232830]'
                                }`}
                              >
                                <span>{est.nome}</span>
                                <span className="text-[10px] opacity-75 font-mono">({est.matricula})</span>
                                {isCurrentEst && <Check className="w-3.5 h-3.5 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Card Bento: Dados do Estudante */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Nome do Estudante <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite o nome do estudante (será anonimizado para a IA)"
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                      required
                    />
                    <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                      Filtro LGPD Ativo: Substituído por código (ESTUDANTE_01) antes do envio ao Gemini.
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
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Curso
                    </label>
                    <input
                      type="text"
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
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
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Professor(a) Regente
                    </label>
                    <input
                      type="text"
                      value={docenteRegente}
                      onChange={(e) => setDocenteRegente(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASSO 2: DETALHAMENTO DO COMPONENTE CURRICULAR (PPC / BNCC)       */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Banner de Sincronização SUAP */}
              {disciplina && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 text-emerald-950 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      Plano de Ensino sincronizado do SUAP: <strong className="font-bold text-emerald-900">{disciplina}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-100/90 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {curso.split('(')[0].trim() || 'Curso'}
                    </span>
                    <span className="text-[10px] bg-white border border-emerald-300 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                      {docenteRegente || 'Docente'}
                    </span>
                  </div>
                </div>
              )}

              {/* Atalhos Rápidos de Disciplinas por Área do IFTO */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-bold text-slate-800">
                    Atalhos Rápidos de Disciplinas (Agropecuária, Edificações, Química, Gestão e TI):
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Preenche ementa e competências oficiais
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetsPpcEPlano.map((p) => {
                    const isCurrent = disciplina === p.titulo;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyCoursePreset(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                        }`}
                      >
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isCurrent ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.tag}
                        </span>
                        <span>{p.titulo}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bento Grid: Campos de Detalhamento Curricular */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Detalhamento do Componente Curricular (Evita Planos Genéricos)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Informe os conteúdos reais da disciplina e as dificuldades observadas no estudante
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nome do Componente Curricular (Disciplina) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      1. Ementa Oficial do Componente
                    </label>
                    <textarea
                      value={ementaOficial}
                      onChange={(e) => setEmentaOficial(e.target.value)}
                      rows={3}
                      placeholder="Ementa oficial constante no PPC do curso..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      2. Conteúdos Específicos do Módulo / Semestre
                    </label>
                    <textarea
                      value={conteudosEspecificosModulo}
                      onChange={(e) => setConteudosEspecificosModulo(e.target.value)}
                      rows={3}
                      placeholder="Tópicos práticos e teóricos trabalhados neste ciclo/bimestre..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      3. Habilidades e Competências Exigidas (PPC / BNCC)
                    </label>
                    <textarea
                      value={habilidadesCompetenciasPpcBncc}
                      onChange={(e) => setHabilidadesCompetenciasPpcBncc(e.target.value)}
                      rows={3}
                      placeholder="Habilidades técnicas e cognitivas esperadas pelo PPC/BNCC..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      4. Dificuldades Específicas do Estudante nesta Disciplina
                    </label>
                    <textarea
                      value={dificuldadesEspecificasDisciplina}
                      onChange={(e) => setDificuldadesEspecificasDisciplina(e.target.value)}
                      rows={3}
                      placeholder="Ex: Dificuldade em absorver instruções teóricas extensas sem checklist visual, sobrecarga sensorial em aulas práticas de campo ou laboratório, ansiedade em avaliações com tempo rígido..."
                      className="w-full p-2.5 border border-amber-300 bg-amber-50/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASSO 3: ESPECIFICIDADES POR TRANSTORNO E INTERSECÇÕES            */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Situação do Laudo */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4">
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Situação do Acompanhamento (Portaria MEC nº 421/2026 — Independe de laudo médico):
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

              {/* Card Bento: Seleção de Condições e Intersecções */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Intersecção de Neurodivergências e Condições Associadas
                      </h4>
                      <p className="text-xs text-slate-500">
                        Selecione uma ou mais condições (TEA, TDAH, AH/SD, Auditiva, Visual, etc.)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {selectedSolucoes.length + customComorbidities.length} selecionada(s)
                  </span>
                </div>

                {/* Combos Rápidos de Intersecção */}
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
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isComboActive
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        {combo.label}
                      </button>
                    );
                  })}
                </div>

                {/* Grade de Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {chipsNeurodivergencias.map((item) => {
                    const isSelected = selectedSolucoes.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTogglePredefinedSolution(item.id)}
                        className={`px-3 py-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="leading-snug">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Mais condições e adição livre */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMostrarOutrasCondicoes(!mostrarOutrasCondicoes)}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    {mostrarOutrasCondicoes ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Ocultar outras condições</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Mais condições (TOC, Depressão, Epilepsia, DI, Sem Laudo)</span>
                      </>
                    )}
                  </button>
                </div>

                {mostrarOutrasCondicoes && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {outrasCondicoesChips.map((item) => {
                      const isSelected = selectedSolucoes.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTogglePredefinedSolution(item.id)}
                          className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              isSelected
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
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
                    placeholder="Adicionar outra condição associada (ex: TPS, Dupla Excepcionalidade específica)..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomComorbidity}
                    className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Incluir</span>
                  </button>
                </div>

                {customComorbidities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
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
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Botões Rápidos: Manifestações Funcionais Observadas (Perfil Vivo) */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Manifestação Funcional Observada na Prática (Clique para adicionar ao perfil do estudante):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Desatenção & dispersão com tarefas longas', text: 'Predominância de desatenção sustentada e dispersão em instruções extensas; rende muito mais com checklists e fracionamento.' },
                      { label: 'Hiperatividade motora & pausas ativas', text: 'Inquietação motora e necessidade de alternar posturas a cada 20-25 minutos; canaliza energia em práticas procedimentais.' },
                      { label: 'Sobrecarga sensorial com ruídos/estímulos', text: 'Hipersensibilidade a ruídos intensos e sobrecarga de estímulos no ambiente; necessita de local calmo ou fones abafadores.' },
                      { label: 'Rigidez e ansiedade com quebra de rotina', text: 'Demanda alta previsibilidade da rotina da aula, antecipação de etapas e comunicação literal (evitar comandos ambíguos).' },
                      { label: 'Fadiga muscular de escrita / lentidão motora', text: 'Fadiga motora fina em cópias ou redação manuscrita rápida sob pressão temporal; necessita de suporte digital e tempo estendido.' },
                      { label: 'Alta abstração porém lentidão executiva', text: 'Excelente capacidade de raciocínio e abstração lógica, com ritmo de execução pausado e necessidade de tempo ampliado (+50%).' },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => {
                          setEspecificidadesTranstorno((prev) => (prev ? `${prev}\n- ${chip.text}` : chip.text));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        + {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campo de Especificidades Individuais por Transtorno / Neurodivergência */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Manifestação Funcional Individual (O Ser Humano Real na Sala de Aula)
                    </label>
                    <textarea
                      value={especificidadesTranstorno}
                      onChange={(e) => setEspecificidadesTranstorno(e.target.value)}
                      rows={3}
                      placeholder="Detalhe como o estudante se comporta na aula (ex: hiperatividade motora vs desatenção, reações a frustração)..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Potencialidades, Habilidades e Interesses Centrais
                    </label>
                    <textarea
                      value={potencialidades}
                      onChange={(e) => setPotentialidades(e.target.value)}
                      rows={3}
                      placeholder="Pontos fortes, afinidades práticas e áreas de destaque do estudante..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PASSO 4: GATILHOS (ANÁLISE FUNCIONAL) E HISTÓRICO ETEP            */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* BLOCO: MAPEAMENTO DE GATILHOS E COMPORTAMENTO (ANÁLISE FUNCIONAL) */}
              <div className="bg-white border border-amber-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Mapeamento de Gatilhos e Comportamento (Análise Funcional)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Gatilhos sensoriais, ambientais ou rotineiros para prevenção de sobrecarga
                        </p>
                      </div>
                    </div>

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
                          <strong>Dica:</strong> Ex: ruídos altos, luzes piscantes, instruções verbais longas sem apoio visual, mudanças bruscas de rotina.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed">
                    <strong>Dica:</strong>{' '}
                    <em>
                      &ldquo;Ex: ruídos altos, luzes piscantes, instruções verbais longas sem apoio visual, mudanças bruscas de rotina.&rdquo;
                    </em>
                  </div>

                  <textarea
                    value={mapeamentoGatilhos}
                    onChange={(e) => setMapeamentoGatilhos(e.target.value)}
                    rows={4}
                    placeholder="Ex: ruídos altos, luzes piscantes, instruções verbais longas sem apoio visual, mudanças bruscas de rotina."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs leading-relaxed"
                  />
                </div>

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

              {/* BLOCO: HISTÓRICO ETEP / BOAS PRÁTICAS ANTERIORES */}
              <div className="bg-white border border-emerald-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Histórico ETEP / Boas Práticas Anteriores
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Recupere adaptações eficazes em ciclos anteriores sem &ldquo;reinventar a roda&rdquo;
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
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
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
          )}

          {/* ================================================================= */}
          {/* PASSO 5: REVISÃO MODULAR E AUDITORIA DE PRIVACIDADE LGPD          */}
          {/* ================================================================= */}
          {currentStep === 5 && (
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
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold block">
                      Componente Curricular & Conteúdos:
                    </span>
                    <span className="text-slate-900 font-bold block">{disciplina}</span>
                    <p className="text-slate-600 line-clamp-2">{conteudosEspecificosModulo}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold block">
                      Especificidades & Intersecção:
                    </span>
                    <span className="text-emerald-800 font-bold block">{categoriaNeurodivergencia}</span>
                    <p className="text-slate-600 line-clamp-2">{especificidadesTranstorno}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                    <span className="text-amber-900 font-bold block">
                      Dificuldades na Disciplina & Gatilhos:
                    </span>
                    <p className="text-slate-700 line-clamp-2">{dificuldadesEspecificasDisciplina}</p>
                    <p className="text-amber-900/90 text-[11px] line-clamp-1">
                      Gatilhos: {mapeamentoGatilhos}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-emerald-900 font-bold block">
                      Histórico ETEP ({etepTags.length} tags):
                    </span>
                    <p className="text-slate-700 line-clamp-2">{historicoEtepTexto}</p>
                  </div>
                </div>

                {/* Indicador de Sanitização / Pseudonimização LGPD */}
                <div className="p-3.5 rounded-xl bg-emerald-950 text-emerald-50 border border-emerald-800 text-xs flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white block">
                      Filtro de Anonimização LGPD Ativo (Lei nº 13.709/2018 & Art. 12, § 5º do Decreto nº 12.686/2025)
                    </span>
                    <p className="text-emerald-200/90 leading-relaxed">
                      Antes de enviar a requisição à API do Gemini, o nome real é substituído por{' '}
                      <code className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                        {previewLgpd.anonymousStudentCode}
                      </code>{' '}
                      e o docente por{' '}
                      <code className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                        {previewLgpd.anonymousDocenteCode}
                      </code>
                      , removendo CPFs, fotos e documentos clínicos sensíveis.
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
                <span>Etapa Anterior</span>
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
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !isStep1Valid) return;
                  if (currentStep === 2 && !isStep2Valid) return;
                  setCurrentStep((prev) => (prev < 5 ? ((prev + 1) as any) : prev));
                }}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                }
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
              >
                <span>Próxima Etapa</span>
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
