import React, { useState, useEffect } from 'react';
import { todosOsCasos } from './data/initialCases';
import { PEICompleto, MetaPEI, PostItPainel, SolucaoCondicao, EscalaFonte, ModoContraste } from './types/pei';
import { Navbar } from './components/Navbar';
import { StudentHeader } from './components/StudentHeader';
import { PeiView } from './components/PeiView';
import { CaseStudyView } from './components/CaseStudyView';
import { OfficialTemplateView } from './components/OfficialTemplateView';
import { PeiPainelView } from './components/PeiPainelView';
import { AddStudentModal } from './components/AddStudentModal';
import { SolutionBankModal } from './components/SolutionBankModal';
import { CampusStatsModal } from './components/CampusStatsModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { CentralAjudaModal } from './components/CentralAjudaModal';
import { ILovePeiHub } from './components/ILovePeiHub';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { exportOfficialPeiPdf } from './utils/exportOfficialPdf';

export default function App() {
  const [studentsList, setStudentsList] = useState<PEICompleto[]>(todosOsCasos);
  const [activePei, setActivePei] = useState<PEICompleto>(todosOsCasos[0]);
  const [activeTab, setActiveTab] = useState<string>('hub');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isSolutionBankOpen, setIsSolutionBankOpen] = useState<boolean>(false);
  const [isCampusStatsOpen, setIsCampusStatsOpen] = useState<boolean>(false);
  const [isCentralAjudaOpen, setIsCentralAjudaOpen] = useState<boolean>(false);
  const [peiToDelete, setPeiToDelete] = useState<PEICompleto | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const [escalaFonte, setEscalaFonte] = useState<EscalaFonte>('normal');
  const [modoContraste, setModoContraste] = useState<ModoContraste>('padrao');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-ampliada', 'font-scale-grande');
    root.classList.add(`font-scale-${escalaFonte}`);

    const body = document.body;
    body.classList.remove('theme-padrao', 'theme-alto-contraste', 'theme-conforto');
    body.classList.add(`theme-${modoContraste}`);
  }, [escalaFonte, modoContraste]);

  const handleAddNewStudent = (newStudent: PEICompleto) => {
    setStudentsList((prev) => [newStudent, ...prev]);
    setActivePei(newStudent);
    setActiveTab('pei');
  };

  const handleSelectStudent = (student: PEICompleto) => {
    setActivePei(student);
  };

  const handleRequestDeletePei = (pei: PEICompleto) => {
    setPeiToDelete(pei);
  };

  const handleConfirmDeletePei = () => {
    if (!peiToDelete) return;

    const codigo = peiToDelete.cabecalho.codigo_matricula || peiToDelete.id;
    const nomeEstudante = peiToDelete.cabecalho.estudante;

    setStudentsList((prev) => {
      const remaining = prev.filter((s) => s.id !== peiToDelete.id);
      if (activePei.id === peiToDelete.id && remaining.length > 0) {
        setActivePei(remaining[0]);
      }
      return remaining;
    });

    setPeiToDelete(null);
    setDeleteNotice(`O PEI Nº ${codigo} do estudante ${nomeEstudante} foi excluído com sucesso.`);
    setTimeout(() => {
      setDeleteNotice(null);
    }, 5000);
  };

  const handleUpdateMetaStatus = (
    metaId: string,
    newStatus: MetaPEI['status'],
    newProgress: number
  ) => {
    setActivePei((prev) => {
      const updatedMetas = prev.planejamento_pei.objetivos_e_metas.map((m) =>
        m.id_meta === metaId
          ? { ...m, status: newStatus, progresso_percentual: newProgress }
          : m
      );

      const totalMetas = updatedMetas.length;
      const avgProgress = Math.round(
        updatedMetas.reduce((acc, curr) => acc + curr.progresso_percentual, 0) / (totalMetas || 1)
      );

      const updatedPei = {
        ...prev,
        planejamento_pei: {
          ...prev.planejamento_pei,
          objetivos_e_metas: updatedMetas,
        },
        metricas: {
          ...prev.metricas,
          percentual_metas_alcancadas: avgProgress,
        },
      };

      setStudentsList((list) =>
        list.map((s) => (s.id === updatedPei.id ? updatedPei : s))
      );

      return updatedPei;
    });
  };

  const handleAddMeta = (newMeta: MetaPEI) => {
    setActivePei((prev) => {
      const updated = {
        ...prev,
        planejamento_pei: {
          ...prev.planejamento_pei,
          objetivos_e_metas: [...prev.planejamento_pei.objetivos_e_metas, newMeta],
        },
      };
      setStudentsList((list) =>
        list.map((s) => (s.id === updated.id ? updated : s))
      );
      return updated;
    });
  };

  const handleUpdateObservacoes = (novaObs: string) => {
    setActivePei((prev) => {
      const updated: PEICompleto = {
        ...prev,
        planejamento_pei: {
          ...prev.planejamento_pei,
          observacoes_docente: novaObs,
        },
      };
      setStudentsList((list) =>
        list.map((s) => (s.id === updated.id ? updated : s))
      );
      return updated;
    });
  };

  const handleApplySolution = (solucao: SolucaoCondicao) => {
    setActivePei((prev) => {
      const updated: PEICompleto = {
        ...prev,
        estudo_de_caso: {
          ...prev.estudo_de_caso,
          recursos_ta: [
            ...new Set([...prev.estudo_de_caso.recursos_ta, ...solucao.remediosSugeridos.recursosTA]),
          ],
        },
        planejamento_pei: {
          ...prev.planejamento_pei,
          guia_pratico_sala_de_aula:
            solucao.guiaPratico || prev.planejamento_pei.guia_pratico_sala_de_aula,
          flexibilizacao_metodologica_dua: {
            engajamento: [
              solucao.remediosSugeridos.engajamento,
              ...prev.planejamento_pei.flexibilizacao_metodologica_dua.engajamento,
            ],
            representacao: [
              solucao.remediosSugeridos.representacao,
              ...prev.planejamento_pei.flexibilizacao_metodologica_dua.representacao,
            ],
            acao_e_expressao: [
              solucao.remediosSugeridos.acaoExpressao,
              ...prev.planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao,
            ],
          },
          estrategias_avaliacao: {
            ...prev.planejamento_pei.estrategias_avaliacao,
            formato_acessivel: solucao.remediosSugeridos.avaliacaoAcessivel,
            recursos_utilizados: [
              ...new Set([
                ...prev.planejamento_pei.estrategias_avaliacao.recursos_utilizados,
                ...solucao.remediosSugeridos.recursosTA,
              ]),
            ],
          },
        },
        painel_notas: [
          {
            id: `N_Sol_${Date.now()}`,
            autor: 'NAPNE · Campus Paraíso',
            papel: 'AEE',
            categoria: 'apoio',
            conteudo: `Guia prático aplicado (${solucao.titulo}): ${solucao.remediosSugeridos.acaoExpressao}`,
            data: new Date().toLocaleDateString('pt-BR'),
            cor: 'green',
          },
          ...prev.painel_notas,
        ],
      };

      setStudentsList((list) =>
        list.map((s) => (s.id === updated.id ? updated : s))
      );

      return updated;
    });
  };

  const handleUpdatePei = (updated: PEICompleto) => {
    setActivePei(updated);
    setStudentsList((list) =>
      list.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const handleAddPostIt = (postIt: PostItPainel) => {
    setActivePei((prev) => {
      const updated = {
        ...prev,
        painel_notas: [postIt, ...prev.painel_notas],
      };
      setStudentsList((list) =>
        list.map((s) => (s.id === updated.id ? updated : s))
      );
      return updated;
    });
  };

  const handleDeletePostIt = (id: string) => {
    setActivePei((prev) => {
      const updated = {
        ...prev,
        painel_notas: prev.painel_notas.filter((n) => n.id !== id),
      };
      setStudentsList((list) =>
        list.map((s) => (s.id === updated.id ? updated : s))
      );
      return updated;
    });
  };

  const handlePrint = () => {
    if (activeTab !== 'documento_oficial') {
      setActiveTab('documento_oficial');
    }
    exportOfficialPeiPdf(activePei);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        onOpenSolutionBank={() => setIsSolutionBankOpen(true)}
        onOpenCampusStats={() => setIsCampusStatsOpen(true)}
        onPrint={handlePrint}
        escalaFonte={escalaFonte}
        onMudarFonte={setEscalaFonte}
        modoContraste={modoContraste}
        onMudarContraste={setModoContraste}
      />

      {/* Single Clean Student Header when viewing a PEI tab */}
      {activeTab !== 'hub' && (
        <div className="no-print">
          <StudentHeader
            pei={activePei}
            allStudents={studentsList}
            onSelectCase={handleSelectStudent}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenCampusStats={() => setIsCampusStatsOpen(true)}
            onRequestDeletePei={handleRequestDeletePei}
          />
        </div>
      )}

      {/* Notification Banner on PEI Deletion */}
      {deleteNotice && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 no-print">
          <div className="p-3.5 bg-emerald-900 text-white rounded-xl shadow-md flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-semibold">{deleteNotice}</span>
            </div>
            <button
              onClick={() => setDeleteNotice(null)}
              className="text-emerald-200 hover:text-white font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'hub' && (
          <ILovePeiHub
            activePei={activePei}
            allStudents={studentsList}
            onSelectStudent={handleSelectStudent}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenSolutionBank={() => setIsSolutionBankOpen(true)}
            onOpenCampusStats={() => setIsCampusStatsOpen(true)}
            onPrint={handlePrint}
            onRequestDeletePei={handleRequestDeletePei}
          />
        )}

        {activeTab === 'pei' && (
          <PeiView
            pei={activePei}
            onUpdateMetaStatus={handleUpdateMetaStatus}
            onAddMeta={handleAddMeta}
            onOpenSolutionBank={() => setIsSolutionBankOpen(true)}
            onUpdateObservacoes={handleUpdateObservacoes}
          />
        )}

        {activeTab === 'estudo_caso' && <CaseStudyView pei={activePei} />}

        {activeTab === 'documento_oficial' && (
          <OfficialTemplateView
            pei={activePei}
            onPrint={handlePrint}
            onUpdatePei={handleUpdatePei}
          />
        )}

        {activeTab === 'painel' && (
          <PeiPainelView
            pei={activePei}
            onAddPostIt={handleAddPostIt}
            onDeletePostIt={handleDeletePostIt}
          />
        )}
      </main>

      {/* Institutional Legal Footer + Floating Help & Legislation Button */}
      <footer className="bg-white border-t border-slate-200 py-5 text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700">Ioda · NAPNE Campus Paraíso</span>
            <span aria-hidden="true">·</span>
            <span>Decreto nº 12.686/2025</span>
            <span aria-hidden="true">·</span>
            <span>Portaria MEC nº 421/2026</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCentralAjudaOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Ajuda & Legislação</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddNewStudent}
        escalaFonteAtual={escalaFonte}
        onMudarFonte={setEscalaFonte}
        modoContrasteAtual={modoContraste}
        onMudarContraste={setModoContraste}
      />

      <SolutionBankModal
        isOpen={isSolutionBankOpen}
        onClose={() => setIsSolutionBankOpen(false)}
        activePei={activePei}
        onApplySolution={handleApplySolution}
      />

      <CampusStatsModal
        isOpen={isCampusStatsOpen}
        onClose={() => setIsCampusStatsOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(peiToDelete)}
        pei={peiToDelete}
        onConfirm={handleConfirmDeletePei}
        onCancel={() => setPeiToDelete(null)}
      />

      <CentralAjudaModal
        isOpen={isCentralAjudaOpen}
        onClose={() => setIsCentralAjudaOpen(false)}
      />
    </div>
  );
}
