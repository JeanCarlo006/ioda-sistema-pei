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
  Filter,
  Info,
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
  onRequestDeletePei,
  filtroDocente = 'todos',
  onMudarFiltroDocente,
}) => {
  const [cursoFiltro, setCursoFiltro] = useState<string>('todos');
  const [termoBusca, setTermoBusca] = useState<string>('');

  // Filtra diários institucionais do SUAP
  const diariosFiltrados = DIARIOS_SUAP_INSTITUCIONAIS.filter((d) => {
    if (cursoFiltro !== 'todos' && !d.curso.toLowerCase().includes(cursoFiltro.toLowerCase())) {
      return false;
    }
    if (filtroDocente !== 'todos') {
      const parts = filtroDocente.split(' ').filter((p) => p.length > 2);
      const matchDocente = parts.some(
        (p) =>
          d.docenteNome.toLowerCase().includes(p.toLowerCase()) ||
          d.nomeDisciplina.toLowerCase().includes(p.toLowerCase())
      );
      if (!matchDocente) return false;
    }
    if (termoBusca) {
      const q = termoBusca.toLowerCase();
      return (
        d.nomeDisciplina.toLowerCase().includes(q) ||
        d.codigoComponente.toLowerCase().includes(q) ||
        d.curso.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtra PEIs cadastrados no banco de dados SQLite
  const peisFiltrados = allStudents.filter((pei) => {
    if (cursoFiltro !== 'todos' && !pei.cabecalho.curso.toLowerCase().includes(cursoFiltro.toLowerCase())) {
      return false;
    }
    if (termoBusca) {
      const q = termoBusca.toLowerCase();
      return (
        pei.cabecalho.estudante.toLowerCase().includes(q) ||
        pei.cabecalho.codigo_matricula.toLowerCase().includes(q) ||
        pei.cabecalho.componente_curricular.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 font-sans">
      {/* 1. QUADRO DE APRESENTAÇÃO DO MÓDULO (ESTILO OFICIAL SUAP) */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#006633] text-white px-2 py-0.5 rounded">
                MÓDULO OFICIAL SUAP
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Ano Letivo 2026/1 · Campus Paraíso do Tocantins
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Painel Docente de Planos de Ensino Individualizados (PEI)
            </h1>
            <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
              Ambiente de elaboração e gestão pedagógica de PEIs integrado ao SUAP. Seus diários, turmas e planos de ensino oficiais são carregados automaticamente para orientar o Agente Ioda na aplicação das diretrizes do <strong>DUA 3.0</strong> e dos <strong>14 Cadernos do MEC (PNEEII)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="px-4 py-2 bg-[#006633] hover:bg-[#005026] text-white font-bold text-xs rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Cadastrar Novo PEI</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros e Seleção de Contexto do SUAP */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Filter className="w-3.5 h-3.5 text-[#006633]" />
              <span>Filtrar por Curso:</span>
            </div>
            <select
              value={cursoFiltro}
              onChange={(e) => setCursoFiltro(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:ring-1 focus:ring-[#006633] focus:outline-none"
            >
              <option value="todos">Todos os Cursos do Docente</option>
              <option value="Sistemas para Internet">Tecnologia em Sistemas para Internet (TSI)</option>
              <option value="Informática">Técnico Integrado em Informática</option>
            </select>

            <div className="flex items-center gap-1.5 font-bold text-slate-800 ml-2">
              <span>Docente Regente:</span>
            </div>
            <select
              value={filtroDocente}
              onChange={(e) => onMudarFiltroDocente && onMudarFiltroDocente(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:ring-1 focus:ring-[#006633] focus:outline-none"
            >
              <option value="todos">Prof. Jean Carlo · SIAPE 1982731 (Todos os Diários)</option>
              <option value="Web">Diário: Programação Web II (TSI)</option>
              <option value="Algoritmos">Diário: Algoritmos e Estruturas de Dados (Informática)</option>
              <option value="Banco">Diário: Banco de Dados Relacionais e Não-Relacionais (TSI)</option>
              <option value="Redes">Diário: Redes de Computadores e S.O. (Informática)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#006633]" />
            <span>Portaria MEC nº 421/2026: PEI funcional sem exigência de laudo prévio</span>
          </div>
        </div>
      </div>

      {/* 2. SEÇÃO: MEUS DIÁRIOS ATRIBUÍDOS NO SUAP (ESTILO TABELA OFICIAL SUAP) */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs space-y-3 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#006633]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Diários e Turmas Atribuídos no SUAP ({diariosFiltrados.length})
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Sincronização em tempo real com o banco de dados do SUAP
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-2.5 border-r border-slate-200">Diário / Código</th>
                <th className="p-2.5 border-r border-slate-200">Componente Curricular</th>
                <th className="p-2.5 border-r border-slate-200">Curso / Semestre</th>
                <th className="p-2.5 border-r border-slate-200 text-center">C.H.</th>
                <th className="p-2.5 border-r border-slate-200">Docente Regente</th>
                <th className="p-2.5 border-r border-slate-200 text-center">PEIs Ativos</th>
                <th className="p-2.5 text-center">Ações no Diário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {diariosFiltrados.map((diario, index) => {
                const peisDoDiario = allStudents.filter((p) =>
                  p.cabecalho.componente_curricular.toLowerCase().includes(diario.nomeDisciplina.toLowerCase()) ||
                  diario.nomeDisciplina.toLowerCase().includes(p.cabecalho.componente_curricular.toLowerCase())
                );
                return (
                  <tr
                    key={diario.id}
                    className={`hover:bg-slate-50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}
                  >
                    <td className="p-2.5 border-r border-slate-200 font-mono font-bold text-[#006633]">
                      {diario.codigoComponente}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold">
                      <div>{diario.nomeDisciplina}</div>
                      <div className="text-[10px] text-slate-500 font-normal line-clamp-1">
                        Ementa: {diario.planoEnsino.ementa}
                      </div>
                    </td>
                    <td className="p-2.5 border-r border-slate-200">
                      <div>{diario.curso}</div>
                      <div className="text-[10px] text-slate-500">{diario.semestrePeriodo}</div>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-mono">
                      {diario.cargaHoraria}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-700">
                      {diario.docenteNome}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-center">
                      {peisDoDiario.length === 0 ? (
                        <span className="text-slate-500 font-normal">0 cadastrados</span>
                      ) : (
                        <span className="font-bold text-[#006633] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {peisDoDiario.length} PEI{peisDoDiario.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={onOpenAddStudent}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-[#006633] text-[#006633] hover:text-white border border-emerald-300 rounded font-bold text-xs transition-colors cursor-pointer"
                        title="Elaborar PEI para estudante deste diário com apoio da IA"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>+ Criar PEI</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SEÇÃO: PLANOS DE ENSINO INDIVIDUALIZADOS (PEIs) CADASTRADOS NO BANCO */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs space-y-3 p-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#006633]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Planos de Ensino Individualizados (PEI) Registrados ({peisFiltrados.length})
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Armazenamento permanente no banco de dados SQLite institucional
          </span>
        </div>

        {peisFiltrados.length === 0 ? (
          /* ESTADO VAZIO INSTITUCIONAL DO SUAP */
          <div className="p-6 bg-slate-50 border border-slate-200 rounded text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                Nenhum Plano de Ensino Individualizado (PEI) cadastrado ainda
              </h3>
              <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
                O banco de dados SQLite está limpo e pronto para receber os PEIs reais das suas matérias.
                Clique no botão abaixo para cadastrar o primeiro estudante e gerar as adaptações pedagógicas DUA 3.0 com o Agente Ioda.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAddStudent}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006633] hover:bg-[#005026] text-white font-bold text-xs rounded shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Cadastrar Primeiro PEI do Diário</span>
              </button>
            </div>
          </div>
        ) : (
          /* TABELA DE PEIs CADASTRADOS NO BANCO */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2.5 border-r border-slate-200">Matrícula</th>
                  <th className="p-2.5 border-r border-slate-200">Nome do Estudante</th>
                  <th className="p-2.5 border-r border-slate-200">Componente / Diário</th>
                  <th className="p-2.5 border-r border-slate-200">Curso</th>
                  <th className="p-2.5 border-r border-slate-200">Condição Pedagógica</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Status</th>
                  <th className="p-2.5 text-center">Ações Pedagógicas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {peisFiltrados.map((pei, index) => {
                  const isSelected = activePei?.id === pei.id;
                  const isHipotese = pei.historico_napne.status_diagnostico === 'em_investigacao_hipotese';

                  return (
                    <tr
                      key={pei.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-emerald-50/70 font-semibold' : index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                      }`}
                    >
                      <td className="p-2.5 border-r border-slate-200 font-mono text-slate-600">
                        {pei.cabecalho.codigo_matricula || pei.id}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">
                        <div>{pei.cabecalho.estudante}</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          Docente: {pei.cabecalho.docente_regente}
                        </div>
                      </td>
                      <td className="p-2.5 border-r border-slate-200">
                        {pei.cabecalho.componente_curricular}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-600">
                        {pei.cabecalho.curso}
                      </td>
                      <td className="p-2.5 border-r border-slate-200">
                        <span className="inline-block text-slate-800 font-medium">
                          {pei.historico_napne.categoria_neurodivergencia || 'Acompanhamento NAPNE'}
                        </span>
                        {isHipotese && (
                          <span className="block text-[10px] text-amber-800 font-bold">
                            (Em investigação pedagógica · Sem laudo)
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {pei.metricas?.status_geral || 'EM ANDAMENTO'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectStudent(pei);
                              onNavigate('pei');
                            }}
                            className="px-2.5 py-1 bg-[#006633] text-white hover:bg-[#005026] rounded text-[11px] font-bold cursor-pointer"
                            title="Abrir Plano de Ensino Individualizado"
                          >
                            Abrir PEI
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectStudent(pei);
                              onNavigate('documento_oficial');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold cursor-pointer"
                            title="Imprimir documento oficial para o SEI"
                          >
                            SEI
                          </button>
                          {onRequestDeletePei && (
                            <button
                              type="button"
                              onClick={() => onRequestDeletePei(pei)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Excluir PEI do banco SQLite"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
