import React, { useState } from 'react';
import { PEICompleto } from '../types/pei';
import { presetsDisciplinasPpc } from '../data/ppcPresets';
import {
  FileCode,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  X,
  GraduationCap,
} from 'lucide-react';

interface PpcAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePei: PEICompleto;
  onApplyPpcAdaptations: (adaptacoes: {
    disciplina: string;
    ementa: string;
    competencias: string;
    adaptacaoCurricular: string;
    engajamento: string;
    representacao: string;
    acaoExpressao: string;
    barreirasTi: string[];
  }) => void;
}

export const PpcAnalyzerModal: React.FC<PpcAnalyzerModalProps> = ({
  isOpen,
  onClose,
  activePei,
  onApplyPpcAdaptations,
}) => {
  if (!isOpen) return null;

  const [selectedPresetId, setSelectedPresetId] = useState<string>(presetsDisciplinasPpc[0].id);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customNome, setCustomNome] = useState('');
  const [customEmenta, setCustomEmenta] = useState('');
  const [customCompetencias, setCustomCompetencias] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    disciplina: string;
    ementa: string;
    competencias: string;
    adaptacaoCurricular: string;
    engajamento: string;
    representacao: string;
    acaoExpressao: string;
    barreirasTi: string[];
  } | null>(null);

  const selectedPreset = presetsDisciplinasPpc.find((p) => p.id === selectedPresetId);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const nomeDisciplina = isCustom ? customNome || 'Componente Curricular' : selectedPreset?.nome || '';
      const ementa = isCustom ? customEmenta : selectedPreset?.ementa || '';
      const competencias = isCustom ? customCompetencias : selectedPreset?.competencias || '';
      const barreirasPreset = !isCustom && selectedPreset ? selectedPreset.barreirasComunsTi : [
        'Dificuldade com carga densa de conteúdo sem fragmentação prática',
        'Sobrecarga sensorial no ambiente de laboratório com múltiplas tarefas',
        'Ansiedade em avaliações de código com tempo rígido',
      ];

      const neuroDesc = activePei.historico_napne.descricao_condicao_especifica || 'Neurodivergência';
      const condicao = (activePei.historico_napne.categoria_neurodivergencia || '').toLowerCase();

      // Pedagogical adaptation crossed with student condition
      let adaptCurricular = '';
      let engajamento = '';
      let representacao = '';
      let acaoExpressao = '';

      if (condicao.includes('tea') || condicao.includes('autis')) {
        adaptCurricular = `Na disciplina de ${nomeDisciplina}, priorizar tarefas com escopo fechado e bem delimitado. Permitir que o estudante aprofunde nos módulos técnicos correspondentes ao seu hiperfoco (ex: modelagem de dados ou automação de testes).`;
        engajamento = `Antecipar o roteiro da aula no início dos 100 minutos; autorizar uso de fones abafadores no laboratório de informática; permitir trabalho individual ou em duplas com colega tutor acolhedor.`;
        representacao = `Fornecer fluxogramas conceituais e exemplos práticos de código funcionando antes de debater a sintaxe abstrata; evitar ambiguidades textuais em enunciados de laboratório.`;
        acaoExpressao = `Avaliação com entrega de artefatos práticos modulares (milestones de software) com tempo ampliado (+50%) e sem apresentação pública oral obrigatória.`;
      } else if (condicao.includes('tdah')) {
        adaptCurricular = `Na disciplina de ${nomeDisciplina}, quebrar os blocos longos de conteúdo em ciclos curtos de 20 minutos (micro-projetos de código com feedback e compilação imediata).`;
        engajamento = `Gamificação das atividades de programação; pausas ativas a cada 30 minutos de tela; escolha de temas de projetos alinhados com o interesse pessoal do estudante.`;
        representacao = `Código com syntax highlighting de alto contraste; mapas mentais visuais dos relacionamentos e variáveis; resumos em bullet points ao invés de parágrafos extensos.`;
        acaoExpressao = `Provas práticas com consulta aberta à documentação oficial e notas de aula; checklists de tarefas interativos para evitar omissão de etapas na entrega do código.`;
      } else {
        adaptCurricular = `Na disciplina de ${nomeDisciplina}, adequar o volume de atividades sem rebaixar o rigor conceitual, focando nos núcleos essenciais das competências do PPC do IFTO.`;
        engajamento = `Acolhimento contínuo e validação de esforço; diálogo aberto sobre o nível de estresse com avaliações práticas.`;
        representacao = `Disponibilização prévia de materiais em múltiplos formatos (slides visuais, códigos comentados e tutoriais passo a passo).`;
        acaoExpressao = `Flexibilidade nos formatos de entrega (código comentado, mapas conceituais ou explicação gravada em vídeo/áudio).`;
      }

      setAnalysisResult({
        disciplina: nomeDisciplina,
        ementa,
        competencias,
        adaptacaoCurricular,
        engajamento,
        representacao,
        acaoExpressao,
        barreirasTi: barreirasPreset,
      });

      setIsAnalyzing(false);
    }, 600);
  };

  const handleApply = () => {
    if (!analysisResult) return;
    onApplyPpcAdaptations(analysisResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                IFTO Campus Paraíso · PPC & DUA 3.0
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Analisador Curricular de Ementas (TI)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Context Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-200/60 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Estudante ativo:</span>{' '}
            <strong className="text-slate-900">{activePei.cabecalho.estudante}</strong>{' '}
            <span className="text-emerald-800">
              ({activePei.historico_napne.categoria_neurodivergencia || 'Neurodivergência'})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
            PPC Bacharelado & Técnico TI
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Preset Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2 uppercase tracking-wide">
              1. Selecione a Disciplina do PPC ou Cole uma Ementa:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {presetsDisciplinasPpc.map((preset) => {
                const isSel = !isCustom && selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedPresetId(preset.id);
                      setAnalysisResult(null);
                    }}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSel
                        ? 'bg-emerald-50 border-emerald-600 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-800">
                        {preset.codigo} · {preset.periodo}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">{preset.curso}</span>
                    </div>
                    <span className="text-xs font-bold block mt-1">{preset.nome}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setIsCustom(true);
                  setAnalysisResult(null);
                }}
                className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                  isCustom
                    ? 'bg-emerald-50 border-emerald-600 text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase text-emerald-800">
                  Personalizado
                </span>
                <span className="text-xs font-bold block mt-1">
                  Digitar / Colar Outra Disciplina
                </span>
              </button>
            </div>

            {/* Custom inputs */}
            {isCustom && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nome da Disciplina:
                  </label>
                  <input
                    type="text"
                    value={customNome}
                    onChange={(e) => setCustomNome(e.target.value)}
                    placeholder="Ex: Redes sem Fio e IoT"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Ementa / Conteúdo Programático:
                  </label>
                  <textarea
                    rows={3}
                    value={customEmenta}
                    onChange={(e) => setCustomEmenta(e.target.value)}
                    placeholder="Cole aqui a ementa oficial do plano de ensino..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              Cruza o perfil do aluno com as exigências técnicas da matéria
            </span>
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isAnalyzing ? 'Analisando Ementa...' : 'Cruzar Ementa com o PEI'}</span>
            </button>
          </div>

          {/* Result Card */}
          {analysisResult && (
            <div className="border border-emerald-300 rounded-2xl bg-white p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Adaptações Pedagógicas Geradas para {analysisResult.disciplina}
                  </h3>
                </div>
              </div>

              {/* Barreiras de TI identificadas */}
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Barreiras e Pontos de Atenção no Laboratório:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysisResult.barreirasTi.map((barr, i) => (
                    <li
                      key={i}
                      className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2"
                    >
                      <span className="text-emerald-700 font-bold shrink-0">•</span>
                      <span>{barr}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Proposta de Adaptação Curricular */}
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 text-xs">
                <strong className="text-emerald-950 block mb-1">
                  Adaptação e Flexibilização Curricular Proposta:
                </strong>
                <p className="text-slate-800 leading-relaxed">
                  {analysisResult.adaptacaoCurricular}
                </p>
              </div>

              {/* DUA Prático */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block mb-1">Engajamento</strong>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {analysisResult.engajamento}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block mb-1">Representação</strong>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {analysisResult.representacao}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-slate-900 block mb-1">Ação & Expressão</strong>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {analysisResult.acaoExpressao}
                  </p>
                </div>
              </div>

              {/* Bottom apply button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApply}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Aplicar ao PEI do Estudante</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
