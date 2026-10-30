import React from 'react';
import { PEICompleto } from '../types/pei';
import { getIdentificadorConfidencial } from '../data/initialCases';
import {
  Sparkles,
  FileText,
  Search,
  BookOpen,
  LayoutDashboard,
  Printer,
  UserPlus,
  ArrowRight,
  FolderOpen,
  Wrench,
  Trash2,
} from 'lucide-react';

interface ILovePeiHubProps {
  activePei: PEICompleto;
  allStudents: PEICompleto[];
  onSelectStudent: (student: PEICompleto) => void;
  onNavigate: (tabId: string) => void;
  onOpenAddStudent: () => void;
  onOpenSolutionBank: () => void;
  onOpenCampusStats: () => void;
  onPrint: () => void;
  onRequestDeletePei?: (peiToDelete: PEICompleto) => void;
}

export const ILovePeiHub: React.FC<ILovePeiHubProps> = ({
  activePei,
  allStudents,
  onSelectStudent,
  onNavigate,
  onOpenAddStudent,
  onOpenSolutionBank,
  onPrint,
  onRequestDeletePei,
}) => {
  const toolCards = [
    {
      id: 'novo_pei',
      title: 'Criar Novo PEI',
      description: 'Elaborar passo a passo um novo Plano de Aula Individualizado para um estudante.',
      iconBg: 'bg-emerald-600 text-white',
      icon: Sparkles,
      action: onOpenAddStudent,
    },
    {
      id: 'plano_pei',
      title: 'Plano de Aula (PEI)',
      description: 'Ver o Guia Prático de Sala de Aula, adaptações de prova, metas e o Guia do Aluno.',
      iconBg: 'bg-emerald-700 text-white',
      icon: FileText,
      action: () => onNavigate('pei'),
    },
    {
      id: 'estudo_caso',
      title: 'Estudo de Caso',
      description: 'Consultar as dificuldades observadas, pontos fortes do estudante e recursos de apoio.',
      iconBg: 'bg-teal-700 text-white',
      icon: Search,
      action: () => onNavigate('estudo_caso'),
    },
    {
      id: 'painel_metas',
      title: 'Metas e Notas',
      description: 'Acompanhar o progresso das metas e registrar observações rápidas da equipe.',
      iconBg: 'bg-slate-800 text-white',
      icon: LayoutDashboard,
      action: () => onNavigate('painel'),
    },
    {
      id: 'modelo_oficial',
      title: 'Imprimir p/ SEI',
      description: 'Visualizar, editar e imprimir o documento formal padronizado do IFTO / NAPNE.',
      iconBg: 'bg-emerald-900 text-white',
      icon: BookOpen,
      action: () => onNavigate('documento_oficial'),
    },
    {
      id: 'banco_solucoes',
      title: 'Guia de Metodologias',
      description: 'Consultar como explicar o conteúdo, dividir tarefas e avaliar cada condição.',
      iconBg: 'bg-slate-900 text-white',
      icon: Wrench,
      action: onOpenSolutionBank,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Clean Institutional Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            NAPNE · IFTO Campus Paraíso do Tocantins
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Central de Planos de Ensino Individualizados (PEI)
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Escolha uma ferramenta abaixo para planejar aulas, consultar adaptações práticas ou abrir o documento de um estudante.
          </p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenAddStudent}
            className="w-full md:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Elaborar Novo PEI</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tools on Left + Confidential Saved PEIs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 6 Direct Action Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {toolCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={card.action}
                className="group bg-white rounded-2xl border border-slate-200 p-6 text-left hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-4 group-hover:text-emerald-700 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Abrir</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Saved PEIs List (Confidential on Home Screen) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                PEIs Cadastrados ({allStudents.length})
              </h3>
            </div>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Sigilo Ativo
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Para proteger a privacidade, o nome do estudante só é exibido após abrir o PEI:
          </p>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {allStudents.map((s, idx) => {
              const isSelected = s.id === activePei.id;
              const isSemLaudo =
                s.historico_napne.status_diagnostico === 'em_investigacao_hipotese';

              return (
                <div
                  key={s.id}
                  className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between gap-2 group ${
                    isSelected
                      ? 'bg-emerald-50/50 border-emerald-600'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudent(s);
                      onNavigate('pei');
                    }}
                    className="flex-1 min-w-0 text-left cursor-pointer flex items-center justify-between"
                  >
                    <div className="truncate mr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                          {getIdentificadorConfidencial(s, idx)}
                        </span>
                        {isSemLaudo && (
                          <span className="text-[10px] font-semibold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                            s/ laudo
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {s.cabecalho.componente_curricular}
                      </div>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 shrink-0">
                      Abrir →
                    </span>
                  </button>

                  {onRequestDeletePei && allStudents.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestDeletePei(s);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                      title={`Excluir ${getIdentificadorConfidencial(s, idx)}`}
                      aria-label="Excluir PEI"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Criar Novo PEI</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir PEI Selecionado</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
