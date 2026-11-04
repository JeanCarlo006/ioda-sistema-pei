import React, { useState } from 'react';
import {
  Sparkles,
  FileEdit,
  BarChart3,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Download,
  Compass,
} from 'lucide-react';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreatePei?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onStartCreatePei,
  onNavigateTab,
}) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      number: 'Passo 1 de 4',
      badge: 'Coleta Estruturada & Rápida',
      title: '1. Como preencher o formulário por etapas de forma rápida',
      subtitle:
        'Design com baixa carga cognitiva dividido em etapas sequenciais (Wizard) para evitar planos genéricos.',
      icon: ClipboardList,
      iconColor: 'bg-emerald-600 text-white',
      highlights: [
        {
          label: 'Detalhamento do Componente Curricular (PPC / BNCC)',
          desc: 'Use atalhos rápidos de disciplinas ou informe a ementa oficial, conteúdos do semestre, habilidades PPC/BNCC e dificuldades específicas observadas na matéria.',
        },
        {
          label: 'Especificidades por Neurodivergência e Intersecções',
          desc: 'Selecione condições (TEA, TDAH, AH/SD, Auditiva, Visual) e comorbidades, detalhando as características individuais do estudante.',
        },
        {
          label: 'Mapeamento de Gatilhos & Histórico ETEP',
          desc: 'Registre gatilhos sensoriais/rotineiros (Análise Funcional) e recupere boas práticas que já funcionaram em ciclos anteriores.',
        },
      ],
      ctaLabel: 'Experimentar o Formulário em Etapas',
      ctaAction: () => {
        onClose();
        onStartCreatePei?.();
      },
    },
    {
      number: 'Passo 2 de 4',
      badge: 'IA Contextualizada + LGPD',
      title: '2. Como o Agente Ioda gera o PEI preliminar',
      subtitle:
        'Cruzamento pedagógico entre ementa, DUA 3.0 e Tecnologia Assistiva com anonimização automática.',
      icon: Sparkles,
      iconColor: 'bg-teal-700 text-white',
      highlights: [
        {
          label: 'Filtro de Anonimização LGPD (Decreto nº 12.686/2025)',
          desc: 'Antes de qualquer envio à API do Gemini, nomes completos, CPF e dados sensíveis são substituídos por códigos anônimos (ex: ESTUDANTE_01).',
        },
        {
          label: 'Estratégias Preventivas e DUA 3.0 (CAST 2024)',
          desc: 'O agente gera propostas específicas de Engajamento/Autorregulação (prevenção de gatilhos), Representação multissensorial e Ação/Expressão (TA/CAA).',
        },
        {
          label: 'Metas SMART Ancoradas na Disciplina',
          desc: 'Metas e indicadores de sucesso conectados diretamente aos conteúdos do módulo e às dificuldades reais do estudante.',
        },
      ],
      ctaLabel: null,
      ctaAction: undefined,
    },
    {
      number: 'Passo 3 de 4',
      badge: 'Human-in-the-Loop',
      title: '3. Onde revisar e editar o texto (Curadoria Docente)',
      subtitle:
        'O Agente Ioda é um copiloto de produtividade para reduzir a burocracia: a decisão final é sempre do professor.',
      icon: FileEdit,
      iconColor: 'bg-amber-600 text-white',
      highlights: [
        {
          label: 'Aba "Plano de Aula (PEI)" e "Estudo de Caso"',
          desc: 'Adicione novas metas, ajuste o status de evolução, aplique metodologias do Banco de Soluções e registre suas observações docentes.',
        },
        {
          label: 'Edição Completa no Modelo Oficial (Aba "Imprimir p/ SEI")',
          desc: 'Clique no botão "Editar Campos" para revisar e alterar qualquer texto da ementa, histórico, adaptações e parecer antes de oficializar.',
        },
        {
          label: 'Validação Multiprofissional (Docente + NAPNE/ETEP)',
          desc: 'Todas as sugestões preliminares ficam abertas para curadoria conjunta com a coordenação pedagógica e equipe do NAPNE.',
        },
      ],
      ctaLabel: 'Ir para Revisão no Modelo Oficial',
      ctaAction: () => {
        onClose();
        onNavigateTab?.('documento_oficial');
      },
    },
    {
      number: 'Passo 4 de 4',
      badge: 'Métricas & Exportação SEI',
      title: '4. Como acompanhar o progresso pelos gráficos e exportar para PDF',
      subtitle:
        'Monitoramento contínuo do ciclo letivo e geração instantânea do documento institucional.',
      icon: BarChart3,
      iconColor: 'bg-slate-900 text-white',
      highlights: [
        {
          label: 'Gráficos de Progresso na Aba "Metas e Notas"',
          desc: 'Acompanhe visualmente o percentual de metas alcançadas, nível de autonomia (1 a 5), engajamento e quadro colaborativo de anotações.',
        },
        {
          label: 'Exportação Direta para PDF Oficial (IFTO / NAPNE)',
          desc: 'Gere o arquivo PDF formatado em padrão A4 com cabeçalho oficial, tabelas normativas e bloco de assinaturas para anexar ao SEI.',
        },
        {
          label: 'Modo Apresentação (Sigilo em Reuniões e Eventos)',
          desc: 'Ative o botão "Apresentação / LGPD" no topo da barra para ocultar nomes reais ao projetar a tela.',
        },
      ],
      ctaLabel: 'Ver Painel de Gráficos e Metas',
      ctaAction: () => {
        onClose();
        onNavigateTab?.('painel');
      },
    },
  ];

  const current = tourSteps[step];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-tour-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-4">
        {/* Top Bar: Step Indicator & Close */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tour Guiado · {current.number}</span>
            </span>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              • {current.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
            title="Pular ou fechar tour"
          >
            <span>Pular tour</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="grid grid-cols-4 gap-2">
          {tourSteps.map((s, idx) => (
            <button
              key={s.number}
              type="button"
              onClick={() => setStep(idx as 0 | 1 | 2 | 3)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === step
                  ? 'bg-emerald-600'
                  : idx < step
                  ? 'bg-emerald-300'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Ir para etapa ${idx + 1} do tour`}
            />
          ))}
        </div>

        {/* Main Step Header */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${current.iconColor}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3
              id="onboarding-tour-title"
              className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug"
            >
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Bento Grid Cards for Step Highlights */}
        <div className="grid grid-cols-1 gap-3">
          {current.highlights.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {item.label}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Human-in-the-Loop & LGPD Callout */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-800 shrink-0" />
            <span>
              <strong>Copiloto Docente:</strong> O Agente Ioda auxilia na produtividade, mas a revisão e validação final são sempre do professor.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            LGPD
          </span>
        </div>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 0 | 1 | 2 | 3)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Fechar
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {current.ctaLabel && current.ctaAction && (
              <button
                type="button"
                onClick={current.ctaAction}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{current.ctaLabel}</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as 0 | 1 | 2 | 3)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir Tour e Começar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
