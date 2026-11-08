import React, { useState } from 'react';
import { PEICompleto } from '../types/pei';
import { DIARIOS_SUAP_INSTITUCIONAIS, DiarioSuap } from '../services/suapService';
import {
  FileText,
  Search,
  BookOpen,
  LayoutDashboard,
  UserPlus,
  ArrowRight,
  FolderOpen,
  Trash2,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Clock,
  Building2,
  Users,
  AlertCircle,
  Sparkles,
  Printer,
  ChevronRight,
  ChevronDown,
  Filter,
  Info,
  Check,
  Plus,
  ExternalLink,
} from 'lucide-react';

interface ILovePeiHubProps {
  activePei: PEICompleto | null;
  allStudents: PEICompleto[];
  onSelectStudent: (student: PEICompleto) => void;
  onNavigate: (tabId: string) => void;
  onOpenAddStudent: () => void;
  onOpenSolutionBank: () => void;
  onOpenCampusStats: () => void;
  onPrint: () => void;
  onRequestDeletePei?: (peiToDelete: PEICompleto) => void;
  onOpenOnboardingTour?: () => void;
  filtroDocente?: string;
  onMudarFiltroDocente?: (docente: string) => void;
}

export const ILovePeiHub: React.FC<ILovePeiHubProps> = ({
  activePei,
  allStudents,
  onSelectStudent,
  onNavigate,
  onOpenAddStudent,
  onPrint,
  onRequestDeletePei,
}) => {
  const [diarioAtivoId, setDiarioAtivoId] = useState<string>(DIARIOS_SUAP_INSTITUCIONAIS[0]?.id || '');
  const [isDadosGeraisOpen, setIsDadosGeraisOpen] = useState(true);
  const [isAlunosTurmaOpen, setIsAlunosTurmaOpen] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');

  const diarioAtual = DIARIOS_SUAP_INSTITUCIONAIS.find((d) => d.id === diarioAtivoId) || DIARIOS_SUAP_INSTITUCIONAIS[0];

  // Filtra alunos da turma do SUAP
  const alunosTurma = (diarioAtual?.estudantes || []).filter((est) => {
    if (!termoBusca) return true;
    const q = termoBusca.toLowerCase();
    return est.nome.toLowerCase().includes(q) || est.matricula.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 font-sans text-slate-200">
      {/* 1. Breadcrumbs do SUAP */}
      <div className="flex items-center text-xs text-slate-400 gap-1.5 flex-wrap">
        <span className="hover:text-white cursor-pointer">Início</span>
        <span>&rsaquo;</span>
        <span className="hover:text-white cursor-pointer">Ensino</span>
        <span>&rsaquo;</span>
        <span className="text-slate-200 font-medium">Módulo NAPNE · Gestão de PEIs</span>
        {diarioAtual && (
          <>
            <span>&rsaquo;</span>
            <span className="text-[#00d284] font-semibold">{diarioAtual.codigoComponente}</span>
          </>
        )}
      </div>

      {/* 2. Barra de Título Oficial do SUAP (com Botão Editar / Adicionar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[#23272d]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[#0099ff] bg-[#0099ff]/15 border border-[#0099ff]/30 px-2 py-0.5 rounded">
              Matriculado no SUAP
            </span>
            <span className="text-[11px] font-bold text-[#00d284] bg-[#00d284]/15 border border-[#00d284]/30 px-2 py-0.5 rounded">
              IFTO · Campus Paraíso
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Gestão de PEIs · {diarioAtual?.nomeDisciplina || 'Engenharia de Software II'} ({diarioAtual?.codigoComponente || 'BSI.0406'})
          </h1>
          <p className="text-xs text-slate-400">
            063 - Bacharelado em Sistemas de Informação (Campus Paraíso do Tocantins) · 2026/1
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onOpenAddStudent}
            className="px-3.5 py-1.5 bg-[#0099ff] hover:bg-[#0088ee] text-white font-bold text-xs rounded shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Adicionar Aluno da Matéria para PEI</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('normas')}
            className="px-3 py-1.5 bg-[#1e2227] hover:bg-[#252a31] border border-[#2e343d] text-slate-300 font-semibold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00d284]" />
            <span>14 Cadernos MEC (RAG)</span>
          </button>
        </div>
      </div>

      {/* 3. Card Bento: Dados Gerais da Matéria / Diário no SUAP */}
      <div className="bg-[#171a1e] border border-[#242930] rounded-lg overflow-hidden shadow-sm">
        <div
          onClick={() => setIsDadosGeraisOpen(!isDadosGeraisOpen)}
          className="px-4 py-2.5 bg-[#14171a] border-b border-[#242930] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00d284] uppercase tracking-wider">
              Dados gerais do diário
            </span>
            <span className="text-[11px] text-slate-400">
              ({diarioAtual?.codigoComponente})
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isDadosGeraisOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isDadosGeraisOpen && (
          <div className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px]">Componente Curricular:</span>
                <span className="font-bold text-white text-xs">{diarioAtual?.nomeDisciplina}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Código da Matéria:</span>
                <span className="font-mono font-bold text-[#00d284] text-xs">{diarioAtual?.codigoComponente}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Período de Referência / Turma:</span>
                <span className="font-semibold text-slate-200 text-xs">{diarioAtual?.semestrePeriodo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Carga Horária Semestral:</span>
                <span className="font-semibold text-slate-200 text-xs">{diarioAtual?.cargaHoraria} (Presencial)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-[#20252c]">
              <div className="md:col-span-2">
                <span className="text-slate-400 block text-[11px]">Curso Vinculado:</span>
                <span className="font-semibold text-slate-200 text-xs">{diarioAtual?.curso}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Docente / Coordenação AEE:</span>
                <span className="font-semibold text-slate-200 text-xs">{diarioAtual?.docenteNome}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#20252c]">
              <span className="text-slate-400 block text-[11px] mb-1">Ementa Oficial do PPC:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed bg-[#121417] p-2.5 rounded border border-[#20252c]">
                {diarioAtual?.planoEnsino.ementa}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Card: Estudantes Matriculados no SUAP (O Professor e NAPNE decidem quem precisa de PEI) */}
      <div className="bg-[#171a1e] border border-[#242930] rounded-lg overflow-hidden shadow-sm">
        <div
          onClick={() => setIsAlunosTurmaOpen(!isAlunosTurmaOpen)}
          className="px-4 py-2.5 bg-[#14171a] border-b border-[#242930] flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00d284] uppercase tracking-wider">
              Estudantes Matriculados no Diário · Indicação e Elaboração de PEI
            </span>
            <span className="text-[11px] bg-[#1f242b] text-slate-300 px-2 py-0.5 rounded font-mono">
              {alunosTurma.length} estudantes na turma
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isAlunosTurmaOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isAlunosTurmaOpen && (
          <div className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">
                O SUAP já possui a lista oficial dos estudantes matriculados nesta disciplina. <strong>O professor regente e a equipe do NAPNE</strong> avaliam em conjunto quais estudantes necessitam de Plano de Ensino Individualizado (PEI) para adaptações pedagógicas DUA 3.0.
              </p>
              <div className="relative shrink-0 w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por nome ou matrícula"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-[#121417] border border-[#262c34] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#00d284]"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-[#22272e] rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#121417] text-slate-400 font-bold border-b border-[#22272e]">
                    <th className="p-2.5 border-r border-[#1f242a]">Matrícula</th>
                    <th className="p-2.5 border-r border-[#1f242a]">Nome do Estudante</th>
                    <th className="p-2.5 border-r border-[#1f242a]">Situação SUAP</th>
                    <th className="p-2.5 border-r border-[#1f242a] text-center">Status PEI</th>
                    <th className="p-2.5 text-right">Ação / Elaboração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20252c] text-slate-300">
                  {alunosTurma.map((est) => {
                    const peiExistente = allStudents.find(
                      (p) =>
                        p.cabecalho.codigo_matricula === est.matricula ||
                        p.cabecalho.estudante.toLowerCase() === est.nome.toLowerCase()
                    );

                    return (
                      <tr key={est.id} className="hover:bg-[#1c2026] transition-colors">
                        <td className="p-2.5 border-r border-[#1f242a] font-mono text-slate-300 font-semibold">
                          {est.matricula}
                        </td>
                        <td className="p-2.5 border-r border-[#1f242a]">
                          <div className="font-bold text-white">{est.nome}</div>
                          {est.observacoesNapne && (
                            <div className="text-[10px] text-amber-300/90 line-clamp-1 mt-0.5">
                              Indicação: {est.observacoesNapne}
                            </div>
                          )}
                        </td>
                        <td className="p-2.5 border-r border-[#1f242a]">
                          <span className="text-[10px] font-bold text-[#00d284] bg-[#00d284]/10 border border-[#00d284]/30 px-1.5 py-0.5 rounded">
                            Matriculado no SUAP
                          </span>
                        </td>
                        <td className="p-2.5 border-r border-[#1f242a] text-center">
                          {peiExistente ? (
                            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded inline-flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>PEI Ativo (DUA 3.0)</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 rounded">
                              Sem PEI Elaborado
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right">
                          {peiExistente ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectStudent(peiExistente);
                                  onNavigate('pei');
                                }}
                                className="px-2.5 py-1 bg-[#1e2329] hover:bg-[#282f37] border border-[#343d47] text-white rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Visualizar PEI
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectStudent(peiExistente);
                                  onNavigate('documento_oficial');
                                }}
                                className="px-2 py-1 bg-[#0099ff]/20 hover:bg-[#0099ff]/30 text-[#0099ff] border border-[#0099ff]/40 rounded text-[11px] font-semibold cursor-pointer"
                                title="Gerar Documento Oficial SEI"
                              >
                                SEI
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={onOpenAddStudent}
                              className="px-2.5 py-1 bg-[#0099ff] hover:bg-[#0088ee] text-white font-bold text-[11px] rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              <span>+ Indicar / Elaborar PEI</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Seção de PEIs Elaborados & Metas Ativas */}
      <div className="bg-[#171a1e] border border-[#242930] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#242930] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00d284] uppercase tracking-wider">
              PEIs Ativos nesta Disciplina ({allStudents.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Resolução CONSUP/IFTO nº 48/2021 & Portaria MEC nº 421/2026
          </span>
        </div>

        {allStudents.length === 0 ? (
          <div className="bg-[#121417] border border-[#22272e] rounded-lg p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#1b2026] text-[#00d284] border border-[#2d343e] flex items-center justify-center mx-auto text-lg font-bold">
              PEI
            </div>
            <h3 className="text-xs font-bold text-slate-200">
              Nenhum PEI elaborado nesta matéria até o momento
            </h3>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
              O professor regente e o NAPNE decidem quais estudantes precisam de PEI. Na tabela de estudantes da turma acima, localize o aluno desejado e clique no botão <strong>"+ Indicar / Elaborar PEI"</strong> para formular o plano adaptado com IA.
            </p>
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="px-3.5 py-1.5 bg-[#0099ff] hover:bg-[#0088ee] text-white font-bold text-xs rounded shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 mt-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Indicar Estudante da Turma para PEI</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allStudents.map((pei) => (
              <div
                key={pei.id}
                className="bg-[#121417] border border-[#242a32] hover:border-[#00d284]/50 rounded-lg p-3.5 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs">
                    {pei.cabecalho.estudante}
                  </div>
                  <span className="text-[10px] font-mono text-[#00d284] bg-[#00d284]/10 border border-[#00d284]/30 px-1.5 py-0.2 rounded">
                    {pei.cabecalho.codigo_matricula}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {pei.cabecalho.componente_curricular} · {pei.cabecalho.modulo_periodo}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#1d2229] text-[11px]">
                  <span className="text-slate-400">
                    Metas: <strong className="text-white">{pei.planejamento_pei.objetivos_e_metas.length} cadastradas</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStudent(pei);
                        onNavigate('pei');
                      }}
                      className="px-2.5 py-1 bg-[#1e2329] hover:bg-[#282f37] text-white rounded text-[11px] font-semibold cursor-pointer"
                    >
                      Abrir PEI
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStudent(pei);
                        onNavigate('documento_oficial');
                      }}
                      className="px-2 py-1 bg-[#0099ff]/20 hover:bg-[#0099ff]/30 text-[#0099ff] rounded text-[11px] font-semibold cursor-pointer"
                    >
                      SEI
                    </button>
                    {onRequestDeletePei && (
                      <button
                        type="button"
                        onClick={() => onRequestDeletePei(pei)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                        title="Remover PEI"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
