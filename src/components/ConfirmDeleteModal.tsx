import React from 'react';
import { PEICompleto } from '../types/pei';
import { AlertTriangle, Trash2, X, ArrowLeft } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  pei: PEICompleto | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  pei,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !pei) return null;

  const codigo = pei.cabecalho.codigo_matricula || pei.id;
  const nome = pei.cabecalho.estudante;
  const curso = pei.cabecalho.curso;
  const disciplina = pei.cabecalho.componente_curricular;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-delete-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-scaleUp relative">
        {/* Close button top right */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md font-mono">
              Ação Irreversível
            </span>
            <h3 id="modal-delete-title" className="text-lg sm:text-xl font-bold text-slate-900">
              Confirmar Exclusão de PEI
            </h3>
          </div>
        </div>

        {/* Main Confirmation Question as requested */}
        <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
          <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
            Tem certeza de que deseja excluir o PEI Nº <span className="font-mono text-red-700 font-bold">{codigo}</span> do estudante <span className="underline decoration-red-300 font-bold">{nome}</span>?
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Caso este plano tenha sido salvo por engano ou com dados incorretos, a exclusão removerá todo o planejamento pedagógico, flexibilizações curriculares (DUA 3.0), metas de aprendizagem e histórico do estudo de caso.
          </p>
        </div>

        {/* Document Details Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Componente Curricular:</span>
            <strong className="text-slate-800 text-right">{disciplina}</strong>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Curso / Modalidade:</span>
            <span className="text-slate-700 text-right truncate max-w-[240px]">{curso}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Docente Regente:</span>
            <span className="text-slate-700 text-right">{pei.cabecalho.docente_regente}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancelar e Manter PEI</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sim, Excluir PEI Nº {codigo}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
