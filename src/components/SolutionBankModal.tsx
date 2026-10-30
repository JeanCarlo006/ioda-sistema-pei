import React, { useState } from 'react';
import { SolucaoCondicao, PEICompleto } from '../types/pei';
import { bancoDeSolucoesPedagogicas } from '../data/initialCases';
import {
  Wrench,
  X,
  CheckCircle2,
  BookOpen,
  ListChecks,
  FileCheck,
  HeartHandshake,
  Cpu,
} from 'lucide-react';

interface SolutionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePei: PEICompleto;
  onApplySolution: (solucao: SolucaoCondicao) => void;
}

export const SolutionBankModal: React.FC<SolutionBankModalProps> = ({
  isOpen,
  onClose,
  activePei,
  onApplySolution,
}) => {
  const [selectedId, setSelectedId] = useState<string>(bancoDeSolucoesPedagogicas[0].id);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedSolution =
    bancoDeSolucoesPedagogicas.find((s) => s.id === selectedId) ||
    bancoDeSolucoesPedagogicas[0];

  const handleApply = () => {
    onApplySolution(selectedSolution);
    setAppliedSuccess(selectedSolution.titulo);
    setTimeout(() => {
      setAppliedSuccess(null);
    }, 3000);
  };

  const guia = selectedSolution.guiaPratico;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col">
        {/* Clean Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Guia Prático de Metodologias de Ensino
              </h3>
              <p className="text-xs text-slate-500">
                Selecione uma condição para ver como explicar a matéria, dividir atividades e adaptar provas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-5 overflow-y-auto flex-1">
          {/* Left: Clean List of Conditions */}
          <div className="lg:col-span-4 space-y-1.5 pr-1 overflow-y-auto max-h-[60vh]">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Condições e Neurodivergências
            </span>
            {bancoDeSolucoesPedagogicas.map((sol) => {
              const isSelected = sol.id === selectedId;
              return (
                <button
                  key={sol.id}
                  onClick={() => setSelectedId(sol.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {sol.titulo}
                </button>
              );
            })}
          </div>

          {/* Right: 4-Part Practical Classroom Guide */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5">
            <div className="space-y-5">
              {/* Top Title */}
              <div className="border-b border-slate-200 pb-4">
                <h4 className="text-base font-bold text-slate-900">
                  {selectedSolution.titulo}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedSolution.descricaoProblema}
                </p>
              </div>

              {/* 4 Practical Pillars */}
              {guia && (
                <div className="grid grid-cols-1 gap-4">
                  {/* 1. Passo a Passo na Prática */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>1. Passo a Passo na Prática (Como Explicar o Conteúdo)</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {guia.passo_a_passo_explicacao}
                    </p>
                  </div>

                  {/* 2. Divisão da Tarefa (Chunking) */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                      <ListChecks className="w-4 h-4 text-emerald-600" />
                      <span>2. Divisão da Tarefa em 3 Etapas Menores (Chunking)</span>
                    </div>
                    <ul className="space-y-1.5">
                      {guia.divisao_tarefa_chunking.map((etapa, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
                        >
                          {etapa}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Como Avaliar na Prática */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>3. Como Avaliar na Prática (Provas e Trabalhos)</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {guia.avaliacao_pratica}
                    </p>
                  </div>

                  {/* 4. Manejo e Acolhimento */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                      <HeartHandshake className="w-4 h-4 text-emerald-600" />
                      <span>4. Manejo e Acolhimento (Se o Aluno Travar ou Desregular)</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {guia.manejo_e_acolhimento}
                    </p>
                  </div>
                </div>
              )}

              {/* Recursos de Apoio */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Recursos e Tecnologias de Apoio Recomendados</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSolution.remediosSugeridos.recursosTA.map((ta, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {ta}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Apply Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Aplicar estas orientações ao PEI de:{' '}
                <strong className="text-slate-900">{activePei.cabecalho.estudante}</strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {appliedSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Adicionado ao PEI!
                  </span>
                )}
                <button
                  onClick={handleApply}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Adicionar Guia ao PEI Atual
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
