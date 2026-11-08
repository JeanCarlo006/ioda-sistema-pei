import React from 'react';
import { PEICompleto } from '../types/pei';
import { CuradoriaDocenteBanner } from './CuradoriaDocenteBanner';
import {
  UserCheck,
  BookOpen,
  UserPlus,
  FileCheck2,
  HelpCircle,
  Trash2,
} from 'lucide-react';

interface StudentHeaderProps {
  pei: PEICompleto;
  allStudents: PEICompleto[];
  onSelectCase: (selectedPei: PEICompleto) => void;
  onOpenAddStudent: () => void;
  onOpenCampusStats?: () => void;
  onRequestDeletePei?: (peiToDelete: PEICompleto) => void;
  filtroDocente?: string;
  onMudarFiltroDocente?: (docente: string) => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  pei,
  allStudents,
  onSelectCase,
  onOpenAddStudent,
  onRequestDeletePei,
}) => {
  const { cabecalho, metricas, historico_napne } = pei;

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'E';
  };

  const isHipotese = historico_napne.status_diagnostico === 'em_investigacao_hipotese';

  return (
    <div className="bg-[#14171a] border-b border-[#23282f] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Barra de Contexto SUAP */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 bg-[#181c22] border border-[#272e37] rounded-lg text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#00d284] animate-pulse"></span>
              SUAP Conectado:
            </span>
            <span className="text-[#00d284] font-semibold">
              Módulo NAPNE · Gestão Pedagógica de PEI
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="font-semibold text-slate-300 bg-[#20252d] border border-[#2f3642] px-2 py-0.5 rounded">
              {cabecalho.estudante} ({cabecalho.codigo_matricula || 'SUAP'})
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Portaria MEC nº 421/2026</span>
          </div>
        </div>

        {/* Aviso de Curadoria */}
        <CuradoriaDocenteBanner variant="compact" />

        {/* Seletor de Estudantes da Turma com PEI */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#20252c]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1">
              PEIs Cadastrados:
            </span>
            {allStudents.map((c) => {
              const isCurrent = c.id === pei.id;
              const shortName = c.cabecalho.estudante.split(' ').slice(0, 2).join(' ');

              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0099ff] text-white shadow-xs'
                      : 'bg-[#1b1f24] text-slate-300 hover:bg-[#232930] border border-[#2b323c]'
                  }`}
                >
                  {shortName || c.cabecalho.codigo_matricula}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Indicar Outro Aluno</span>
            </button>

            {onRequestDeletePei && allStudents.length > 1 && (
              <button
                type="button"
                onClick={() => onRequestDeletePei(pei)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 transition-colors cursor-pointer"
                title="Excluir este PEI"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            )}
          </div>
        </div>

        {/* Card do Estudante Ativo */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#1b2026] border border-[#2d343e] flex items-center justify-center text-[#00d284] font-bold text-lg shrink-0">
              {getInitial(cabecalho.estudante)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">
                  {cabecalho.estudante}
                </h1>
                <span className="text-xs font-mono text-slate-400 bg-[#1e2329] px-2 py-0.5 rounded border border-[#292f37]">
                  {cabecalho.codigo_matricula}
                </span>

                {isHipotese ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/40 border border-amber-600/40 px-2 py-0.5 rounded">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    Em Investigação Pedagógica (Portaria 421)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-600/40 px-2 py-0.5 rounded">
                    <FileCheck2 className="w-3 h-3 text-emerald-400" />
                    {historico_napne.categoria_neurodivergencia || 'PEI Concluído'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="font-semibold text-[#00d284]">
                  {cabecalho.componente_curricular}
                </span>
                <span className="text-slate-600">·</span>
                <span>{cabecalho.curso}</span>
                <span className="text-slate-600">·</span>
                <span>{cabecalho.modulo_periodo}</span>
              </div>
            </div>
          </div>

          {/* Métricas Compactas */}
          <div className="flex items-center gap-4 bg-[#181c22] border border-[#262c35] rounded-lg px-4 py-2 shrink-0">
            <div>
              <span className="block text-[10px] font-medium text-slate-400 uppercase">
                Metas Concluídas
              </span>
              <span className="text-sm font-bold font-mono text-[#00d284] tabular-nums">
                {metricas.percentual_metas_alcancadas}%
              </span>
            </div>
            <div className="w-px h-6 bg-[#262c35]" />
            <div>
              <span className="block text-[10px] font-medium text-slate-400 uppercase">
                Autonomia
              </span>
              <span className="text-sm font-bold font-mono text-white tabular-nums">
                {metricas.nivel_autonomia}/5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
