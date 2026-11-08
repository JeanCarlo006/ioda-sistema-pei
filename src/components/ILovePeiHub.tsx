import React from 'react';
import { PEICompleto } from '../types/pei';
import { DIARIOS_SUAP_INSTITUCIONAIS, DiarioSuap } from '../services/suapService';
import { CuradoriaDocenteBanner } from './CuradoriaDocenteBanner';
import {
  Sparkles,
  FileText,
  Search,
  BookOpen,
  LayoutDashboard,
  UserPlus,
  ArrowRight,
  FolderOpen,
  Wrench,
  Trash2,
  CheckCircle2,
  Layers,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Clock,
  Building2,
  Users,
  AlertCircle,
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
  onOpenSolutionBank,
  onPrint,
  onRequestDeletePei,
  filtroDocente = 'todos',
  onMudarFiltroDocente,
}) => {
  // Filtra diários do SUAP conforme o professor selecionado
  const diariosFiltrados = DIARIOS_SUAP_INSTITUCIONAIS.filter((d) => {
    if (filtroDocente === 'todos') return true;
    const parts = filtroDocente.split(' ').filter((p) => p.length > 2);
    return parts.some(
      (p) =>
        d.docenteNome.toLowerCase().includes(p.toLowerCase()) ||
        d.nomeDisciplina.toLowerCase().includes(p.toLowerCase()) ||
        d.curso.toLowerCase().includes(p.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Banner de Curadoria Docente (Human-in-the-Loop) */}
      <CuradoriaDocenteBanner />

      {/* CABEÇALHO INSTITUCIONAL SUAP */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-emerald-800 uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                SUAP · IFTO
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Módulo de Acessibilidade & PEI (Portaria MEC nº 421/2026)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Painel Docente de Planos de Ensino Individualizados
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Sistema integrado ao SUAP: seus diários, turmas e planos de ensino (PE) são vinculados automaticamente, evitando retrabalho e permitindo ao agente Ioda estruturar adaptações pedagógicas focadas na sua matéria.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Criar PEI do Diário</span>
            </button>
          </div>
        </div>

        {/* Barra de Perfil Docente e RBAC */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Docente Autenticado no SUAP:</span>
            </div>
            <select
              value={filtroDocente}
              onChange={(e) => onMudarFiltroDocente && onMudarFiltroDocente(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer shadow-2xs"
            >
              <option value="todos">Todos os Docentes / Cursos (Visão Coordenação NAPNE & ETEP)</option>
              <option value="Prof. Marcos Aurélio de Souza">Prof. Marcos Aurélio · Agropecuária (Manejo Animal / Solos)</option>
              <option value="Profª. Dra. Cláudia Rezende">Profª. Dra. Cláudia · Edificações (Desenho Técnico & CAD)</option>
              <option value="Profª. Mariana Duarte">Profª. Mariana · Química e Alimentos (Química Experimental)</option>
              <option value="Prof. Roberto Silveira">Prof. Roberto · Administração (Gestão de Pessoas)</option>
              <option value="Profª. Dra. Helena Bittencourt">Profª. Dra. Helena · BSI / Informática (Engenharia de Software)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Acesso nominal autorizado aos estudantes das suas turmas (LGPD/SUAP)</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: MEUS DIÁRIOS VINCULADOS NO SUAP (SEM DIGITAÇÃO MANUAL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Diários e Turmas Atribuídos no Semestre (SUAP)
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {diariosFiltrados.length} diário(s) sincronizado(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diariosFiltrados.map((diario) => {
            const estudantesNapne = diario.estudantes.filter((e) => e.acompanhadoNapne);

            return (
              <div
                key={diario.id}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {diario.codigoComponente}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {diario.cargaHoraria}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {diario.nomeDisciplina}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {diario.curso}
                    </p>
                  </div>

                  {/* Ementa do Plano de Ensino */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-[11px] text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800 block mb-0.5">Ementa do Plano de Ensino:</span>
                    <p className="line-clamp-2">{diario.planoEnsino.ementa}</p>
                  </div>

                  {/* Status de Estudantes NAPNE */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">
                      {diario.estudantes.length} estudantes matriculados
                    </span>
                    {estudantesNapne.length > 0 && (
                      <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <AlertCircle className="w-3 h-3 text-emerald-700" />
                        {estudantesNapne.length} no NAPNE
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onOpenAddStudent}
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Elaborar PEI desta Disciplina</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: ESTUDANTES COM PEI ATIVO NOS SEUS DIÁRIOS (COM NOMES REAIS) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Estudantes Acompanhados com PEI Estruturado
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {allStudents.length} estudante(s) sob sua regência
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allStudents.map((pei) => {
            const isSelected = pei.id === activePei.id;
            const isSemLaudo =
              pei.historico_napne.status_diagnostico === 'em_investigacao_hipotese';

            return (
              <div
                key={pei.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between gap-4 transition-all ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top: Student Name + Matricula */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {pei.cabecalho.estudante}
                        </h3>
                        {isSemLaudo ? (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            Observação Pedagógica
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            Com Laudo
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-500 mt-0.5 block">
                        Matrícula: {pei.cabecalho.codigo_matricula} · {pei.cabecalho.idade}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-800 font-mono">
                        {pei.metricas.percentual_metas_alcancadas}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">avanço</span>
                    </div>
                  </div>

                  {/* Course & Subject */}
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-800 font-semibold line-clamp-1">
                      {pei.cabecalho.componente_curricular}
                    </p>
                    <p className="text-slate-500 text-[11px] line-clamp-1">
                      {pei.cabecalho.curso}
                    </p>
                    <p className="text-emerald-800 font-medium text-[11px]">
                      Docente: {pei.cabecalho.docente_regente}
                    </p>
                  </div>

                  {/* Functional Condition & Triggers */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{pei.historico_napne.categoria_neurodivergencia || 'Especificidade'}</span>
                    </div>
                    {pei.estudo_de_caso.mapeamento_de_gatilhos_e_crises &&
                      pei.estudo_de_caso.mapeamento_de_gatilhos_e_crises.length > 0 && (
                        <p className="text-[11px] text-amber-900 line-clamp-2">
                          <strong>Gatilho observável:</strong>{' '}
                          {pei.estudo_de_caso.mapeamento_de_gatilhos_e_crises[0]}
                        </p>
                      )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudent(pei);
                      onNavigate('pei');
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Abrir Plano (PEI)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudent(pei);
                      onNavigate('documento_oficial');
                    }}
                    className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    title="Exportar Word (.docx) ou PDF para processo SEI"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  </button>

                  {onRequestDeletePei && allStudents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRequestDeletePei(pei)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Excluir este PEI"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 3: ATALHOS PEDAGÓGICOS E RECURSOS DUA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('pei')}
          className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-left transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
            Plano de Aula DUA 3.0
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Flexibilização em engajamento, representação e tecnologia assistiva.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('estudo_caso')}
          className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-left transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
            Gatilhos & Comportamento
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Análise funcional do estudante e boas práticas validadas pelo ETEP.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('documento_oficial')}
          className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-left transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
            Exportar Word (.docx) & PDF (SEI)
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Documento padronizado pelo IFTO pronto para processo no SEI.
          </p>
        </button>
      </div>
    </div>
  );
};
