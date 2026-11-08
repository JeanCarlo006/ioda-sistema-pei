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
  filtroDocente = 'todos',
  onMudarFiltroDocente,
}) => {
  const { cabecalho, metricas, historico_napne } = pei;

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'E';
  };

  const isHipotese = historico_napne.status_diagnostico === 'em_investigacao_hipotese';

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Barra de Sessão SUAP / Controle de Acesso Docente (RBAC) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sessão SUAP Ativa:
            </span>
            <select
              value={filtroDocente}
              onChange={(e) => onMudarFiltroDocente && onMudarFiltroDocente(e.target.value)}
              aria-label="Perfil docente autenticado no SUAP"
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer shadow-2xs"
            >
              <option value="todos">Prof. Jean Carlo · SIAPE 1982731 (Todos os Diários)</option>
              <option value="Web">Diário: Programação Web II (TSI)</option>
              <option value="Algoritmos">Diário: Algoritmos e Estruturas de Dados (Informática)</option>
              <option value="Banco">Diário: Banco de Dados Relacionais e Não-Relacionais (TSI)</option>
              <option value="Redes">Diário: Redes de Computadores e S.O. (Informática)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Autenticação SUAP (SIAPE)
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Acesso restrito aos diários do docente</span>
          </div>
        </div>

        {/* Aviso Institucional de Curadoria Docente (Human-in-the-Loop) */}
        <CuradoriaDocenteBanner variant="compact" />

        {/* Compact Student Switcher Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">
              Estudantes no Diário:
            </span>
            {allStudents.map((c) => {
              const isCurrent = c.id === pei.id;
              const shortName = c.cabecalho.estudante.split(' ').slice(0, 2).join(' ');

              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Novo Aluno</span>
            </button>

            {onRequestDeletePei && allStudents.length > 1 && (
              <button
                type="button"
                onClick={() => onRequestDeletePei(pei)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                title="Excluir este PEI"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir PEI</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean Single-Row Active Student Profile */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xl shrink-0">
              {getInitial(cabecalho.estudante)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {cabecalho.estudante}
                </h1>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {cabecalho.codigo_matricula}
                </span>

                {isHipotese ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    Em Observação (Sem Laudo)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                    {historico_napne.categoria_neurodivergencia || 'Com Laudo'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                <span className="font-semibold text-emerald-800">
                  {cabecalho.componente_curricular}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{cabecalho.curso}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{cabecalho.modulo_periodo}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  {cabecalho.docente_regente}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {cabecalho.docente_aee}
                </span>
              </div>
            </div>
          </div>

          {/* Compact Progress Summary */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shrink-0">
            <div>
              <span className="block text-[11px] font-medium text-slate-500">
                Metas Concluídas
              </span>
              <span className="text-base font-bold font-mono text-emerald-700 tabular-nums">
                {metricas.percentual_metas_alcancadas}%
              </span>
            </div>
            <div className="w-px h-7 bg-slate-200" />
            <div>
              <span className="block text-[11px] font-medium text-slate-500">
                Autonomia
              </span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {metricas.nivel_autonomia}/5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
