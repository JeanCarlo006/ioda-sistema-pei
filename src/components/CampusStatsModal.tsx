import React from 'react';
import { estatisticasCampusParaiso } from '../data/initialCases';
import {
  X,
  Building2,
  GraduationCap,
  FileCheck2,
  HelpCircle,
  ShieldCheck,
  Users,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface CampusStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterCategory?: (filter: 'todos' | 'medio' | 'superior' | 'confirmado' | 'hipotese') => void;
}

export const CampusStatsModal: React.FC<CampusStatsModalProps> = ({
  isOpen,
  onClose,
  onFilterCategory,
}) => {
  if (!isOpen) return null;

  const stats = estatisticasCampusParaiso;

  const handleSelectFilter = (filter: 'todos' | 'medio' | 'superior' | 'confirmado' | 'hipotese') => {
    if (onFilterCategory) {
      onFilterCategory(filter);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Censo & Estatísticas Institucionais
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  Atualizado em 27/10/2026
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Neurodivergências & Acompanhamento · NAPNE Campus Paraíso
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div
            onClick={() => handleSelectFilter('todos')}
            className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center cursor-pointer transition-all"
          >
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Geral</span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
              {stats.estudantes_geral}
            </span>
            <span className="text-[10px] text-slate-500">estudantes</span>
          </div>

          <div
            onClick={() => handleSelectFilter('medio')}
            className="p-3.5 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-xl text-center cursor-pointer transition-all"
          >
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Médio Técnico</span>
            <span className="text-2xl font-black font-mono text-emerald-900 mt-1 block">
              {stats.estudantes_medio}
            </span>
            <span className="text-[10px] text-emerald-700">alunos (51.7%)</span>
          </div>

          <div
            onClick={() => handleSelectFilter('superior')}
            className="p-3.5 bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 rounded-xl text-center cursor-pointer transition-all"
          >
            <span className="text-[11px] font-semibold text-teal-800 uppercase block">Superior TI</span>
            <span className="text-2xl font-black font-mono text-teal-900 mt-1 block">
              {stats.estudantes_superior}
            </span>
            <span className="text-[10px] text-teal-700">alunos (48.3%)</span>
          </div>

          <div
            onClick={() => handleSelectFilter('confirmado')}
            className="p-3.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-xl text-center cursor-pointer transition-all"
          >
            <span className="text-[11px] font-semibold text-blue-800 uppercase block">Com Laudo</span>
            <span className="text-2xl font-black font-mono text-blue-900 mt-1 block">
              {stats.com_diagnostico_confirmado}
            </span>
            <span className="text-[10px] text-blue-700">confirmados</span>
          </div>

          <div
            onClick={() => handleSelectFilter('hipotese')}
            className="p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-center cursor-pointer transition-all"
          >
            <span className="text-[11px] font-semibold text-amber-900 uppercase block">Sem Laudo</span>
            <span className="text-2xl font-black font-mono text-amber-950 mt-1 block">
              {stats.sem_diagnostico_hipotese}
            </span>
            <span className="text-[10px] text-amber-800 font-medium">hipótese / suspeita</span>
          </div>
        </div>

        {/* Legal Highlight on Students without Diagnosis */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4.5 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                Diretriz Legal Portaria MEC nº 421/2026: Os 5 Estudantes Sem Diagnóstico Confirmado
              </h4>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                A legislação educacional brasileira (Portaria MEC nº 421/2026, Decreto nº 12.686/2025 e
                Nota Técnica MEC nº 04/2014) determina expressamente que <strong>a ausência de laudo médico pericial não é impeditivo para a elaboração do PEI</strong>, nem para o atendimento pelo NAPNE ou acesso a Tecnologias Assistivas.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                <span className="bg-amber-200/60 text-amber-950 px-2 py-0.5 rounded font-medium">
                  Atendimento Centrado na Barreira Escolar
                </span>
                <span className="bg-amber-200/60 text-amber-950 px-2 py-0.5 rounded font-medium">
                  PEI Provisório e Investigativo
                </span>
                <span className="bg-amber-200/60 text-amber-950 px-2 py-0.5 rounded font-medium">
                  Acolhida Imediata sem Burocracia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution & Conditions Mapped in Campus Paraíso */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Condições & Neurodivergências Mapeadas no Campus Paraíso:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Transtorno do Espectro Autista (TEA)</strong>
                <span>Níveis 1 e 2 de suporte; sensibilidade sonora em laboratórios e necessidade de previsibilidade de rotina.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">TDAH & Dupla Excepcionalidade</strong>
                <span>TDAH com Altas Habilidades/Superdotação; velocidade lógica alta e demanda de apoio executivo/Kanban.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Deficiências Sensoriais & Motoras</strong>
                <span>Baixa visão severa em modelagem de dados e limitações motoras para digitação acelerada de código.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Casos em Investigação / Sem Laudo</strong>
                <span>Dificuldades específicas de aprendizagem e leitura de sintaxe em processo de avaliação multiprofissional.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Clique em uma das categorias para filtrar os alunos no sistema:
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectFilter('todos')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Ver Todos (29)
            </button>
            <button
              onClick={() => handleSelectFilter('hipotese')}
              className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg cursor-pointer"
            >
              Ver Casos s/ Laudo (5)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
