import React, { useState, useEffect } from 'react';
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
import { PpcAnalyzerModal } from './components/PpcAnalyzerModal';
import { SusResearchModal } from './components/SusResearchModal';
import { ILovePeiHub } from './components/ILovePeiHub';
import { OfficialKnowledgeBaseView } from './components/OfficialKnowledgeBaseView';
import { OnboardingTourModal } from './components/OnboardingTourModal';
import { AiConfigModal } from './components/AiConfigModal';
import { CheckCircle2, ExternalLink, HelpCircle, ShieldAlert, ShieldCheck, FileText, Search, BookOpen, LayoutDashboard } from 'lucide-react';
import { exportOfficialPeiPdf } from './utils/exportOfficialPdf';
import { apiService } from './services/apiService';

const STORAGE_KEY_STUDENTS = 'ioda_students_list_v1';
const STORAGE_KEY_ACTIVE_ID = 'ioda_active_student_id_v1';
const STORAGE_KEY_ONBOARDING_DONE = 'ioda_onboarding_tour_done_v1';

export default function App() {
  const [studentsList, setStudentsList] = useState<PEICompleto[]>([]);
  const [activePei, setActivePei] = useState<PEICompleto | null>(null);
  const [activeTab, setActiveTab] = useState<string>('hub');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isSolutionBankOpen, setIsSolutionBankOpen] = useState<boolean>(false);
  const [isCampusStatsOpen, setIsCampusStatsOpen] = useState<boolean>(false);
  const [isCentralAjudaOpen, setIsCentralAjudaOpen] = useState<boolean>(false);
  const [isPpcAnalyzerOpen, setIsPpcAnalyzerOpen] = useState<boolean>(false);
  const [isSusResearchOpen, setIsSusResearchOpen] = useState<boolean>(false);
  const [isOnboardingTourOpen, setIsOnboardingTourOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY_ONBOARDING_DONE);
    } catch {
      return false;
    }
  });
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [peiToDelete, setPeiToDelete] = useState<PEICompleto | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  const [filtroDocente, setFiltroDocente] = useState<string>('todos');
  const [isAiConfigOpen, setIsAiConfigOpen] = useState<boolean>(false);

  const [escalaFonte, setEscalaFonte] = useState<EscalaFonte>('normal');
  const [modoContraste, setModoContraste] = useState<ModoContraste>('padrao');

  // Carrega lista de PEIs diretamente do banco de dados SQLite persistente
  useEffect(() => {
    let isMounted = true;
    async function loadFromDb() {
      try {
        const peis = await apiService.getPeis();
        if (isMounted && peis && peis.length > 0) {
          setStudentsList(peis);
          const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
          const current = peis.find((p) => p.id === savedId) || peis[0];
          setActivePei(current);
        }
      } catch (err) {
        console.error('Falha ao conectar ao banco de dados SQLite:', err);
      }
    }
    loadFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persiste ID do estudante ativo na sessão
  useEffect(() => {
    try {
      if (activePei) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activePei.id);
      }
    } catch {
      // ignore
    }
  }, [activePei]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-ampliada', 'font-scale-grande');
    root.classList.add(`font-scale-${escalaFonte}`);

    const body = document.body;
    body.classList.remove('theme-padrao', 'theme-alto-contraste', 'theme-conforto');
    body.classList.add(`theme-${modoContraste}`);
  }, [escalaFonte, modoContraste]);

  // Modo Apresentação (apenas para bancas/apresentações públicas em congressos/JICE)
  const anonymizePei = (pei: PEICompleto, index: number): PEICompleto => {
    const letter = String.fromCharCode(65 + (index % 26));
    const neuro = pei.historico_napne.categoria_neurodivergencia || 'Neurodivergência';
    return {
      ...pei,
      cabecalho: {
        ...pei.cabecalho,
        estudante: `Estudante ${letter} (${neuro})`,
        codigo_matricula: `2024****${(index + 1).toString().padStart(2, '0')}`,
        docente_regente: 'Prof. Regente (TI)',
        coordenacao_napne: 'Coordenação NAPNE (Campus Paraíso)',
      },
      historico_napne: {
        ...pei.historico_napne,
        informacoes_dos_pais:
          'Informações familiares e contatos sob sigilo institucional e guarda do NAPNE (Dados anonimizados para apresentação científica).',
      },
    };
  };

  const activeIndex = activePei ? studentsList.findIndex((s) => s.id === activePei.id) : -1;
  const displayedActivePei = activePei
    ? isPresentationMode
      ? anonymizePei(activePei, activeIndex >= 0 ? activeIndex : 0)
      : activePei
    : null;

  const baseStudents = isPresentationMode
    ? studentsList.map((s, idx) => anonymizePei(s, idx))
    : studentsList;

  const displayedStudents = filtroDocente === 'todos'
    ? baseStudents
    : baseStudents.filter((s) => {
        const query = filtroDocente.toLowerCase();
        const docName = s.cabecalho.docente_regente.toLowerCase();
        const discName = s.cabecalho.componente_curricular.toLowerCase();
        return docName.includes(query) || discName.includes(query);
      });

  const handleMudarFiltroDocente = (filtro: string) => {
    setFiltroDocente(filtro);
    if (filtro !== 'todos') {
      const query = filtro.toLowerCase();
      const matching = studentsList.find((s) => {
        const docName = s.cabecalho.docente_regente.toLowerCase();
        const discName = s.cabecalho.componente_curricular.toLowerCase();
        return docName.includes(query) || discName.includes(query);
      });
      if (matching) {
        setActivePei(matching);
      }
    }
  };

  const handleAddNewStudent = async (newStudent: PEICompleto) => {
    try {
      await apiService.savePei(newStudent);
    } catch (err) {
      console.error('Erro ao salvar no banco SQLite:', err);
    }
    setStudentsList((prev) => [newStudent, ...prev.filter((s) => s.id !== newStudent.id)]);
    setActivePei(newStudent);
    setActiveTab('pei');
  };

  const handleSelectStudent = (student: PEICompleto) => {
    const realStudent = studentsList.find((s) => s.id === student.id) || student;
    setActivePei(realStudent);
  };

  const handleRequestDeletePei = (pei: PEICompleto) => {
    const realStudent = studentsList.find((s) => s.id === pei.id) || pei;
    setPeiToDelete(realStudent);
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Deseja limpar todos os PEIs cadastrados no banco de dados para reiniciar o semestre letivo?')) {
      for (const s of studentsList) {
        try {
          await apiService.deletePei(s.id);
        } catch (e) {
          console.error(e);
        }
      }
      setStudentsList([]);
      setActivePei(null);
    }
  };

  const handleConfirmDeletePei = async () => {
    if (!peiToDelete) return;

    const peiId = peiToDelete.id;
    const codigo = peiToDelete.cabecalho.codigo_matricula || peiToDelete.id;
    const nomeEstudante = peiToDelete.cabecalho.estudante;

    try {
      await apiService.deletePei(peiId);
    } catch (err) {
      console.error('Erro ao excluir do banco SQLite:', err);
    }

    setStudentsList((prev) => {
      const remaining = prev.filter((s) => s.id !== peiId);
      if (activePei && activePei.id === peiId) {
        setActivePei(remaining.length > 0 ? remaining[0] : null);
      }
      return remaining;
    });

    setPeiToDelete(null);
    setDeleteNotice(`O PEI Nº ${codigo} do estudante ${nomeEstudante} foi excluído do banco com sucesso.`);
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
      if (!prev) return null;
      const updatedMetas = prev.planejamento_pei.objetivos_e_metas.map((m) =>
        m.id_meta === metaId
          ? { ...m, status: newStatus, progresso_percentual: newProgress }
          : m
      );

      const totalMetas = updatedMetas.length;
      const avgProgress = Math.round(
        updatedMetas.reduce((acc, curr) => acc + curr.progresso_percentual, 0) / (totalMetas || 1)
      );

      const updatedPei: PEICompleto = {
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
      if (!prev) return null;
      const updated: PEICompleto = {
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
      if (!prev) return null;
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
      if (!prev) return null;
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

  const handleApplyPpcAdaptations = (adaptacoes: {
    disciplina: string;
    ementa: string;
    competencias: string;
    adaptacaoCurricular: string;
    engajamento: string;
    representacao: string;
    acaoExpressao: string;
    barreirasTi: string[];
  }) => {
    setActivePei((prev) => {
      if (!prev) return null;
      const updated: PEICompleto = {
        ...prev,
        cabecalho: {
          ...prev.cabecalho,
          componente_curricular: adaptacoes.disciplina,
        },
        planejamento_pei: {
          ...prev.planejamento_pei,
          conteudo_ementa_oficial: adaptacoes.ementa,
          competencias_habilidades_ementa: adaptacoes.competencias,
          adaptacao_flexibilizacao_curricular: adaptacoes.adaptacaoCurricular,
          flexibilizacao_metodologica_dua: {
            engajamento: [
              adaptacoes.engajamento,
              ...prev.planejamento_pei.flexibilizacao_metodologica_dua.engajamento,
            ],
            representacao: [
              adaptacoes.representacao,
              ...prev.planejamento_pei.flexibilizacao_metodologica_dua.representacao,
            ],
            acao_e_expressao: [
              adaptacoes.acaoExpressao,
              ...prev.planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao,
            ],
          },
        },
        painel_notas: [
          {
            id: `N_PPC_${Date.now()}`,
            autor: 'COTEC / NAPNE',
            papel: 'Regente',
            categoria: 'objetivos',
            conteudo: `Adaptações curriculares do PPC integradas para a disciplina ${adaptacoes.disciplina}.`,
            data: new Date().toLocaleDateString('pt-BR'),
            cor: 'blue',
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

  const handleUpdatePei = async (updated: PEICompleto) => {
    setActivePei(updated);
    setStudentsList((list) =>
      list.map((s) => (s.id === updated.id ? updated : s))
    );
    try {
      await apiService.savePei(updated);
    } catch (err) {
      console.error('Erro ao atualizar PEI no banco SQLite:', err);
    }
  };

  const handleAddPostIt = async (postIt: PostItPainel) => {
    if (!activePei) return;
    setActivePei((prev) => {
      if (!prev) return null;
      const updated: PEICompleto = {
        ...prev,
        painel_notas: [postIt, ...prev.painel_notas],
      };
      setStudentsList((list) =>
        list.map((s) => (s.id === updated.id ? updated : s))
      );
      return updated;
    });
    try {
      await apiService.addNote(activePei.id, postIt);
    } catch (err) {
      console.error('Erro ao salvar nota no banco SQLite:', err);
    }
  };

  const handleDeletePostIt = async (id: string) => {
    if (!activePei) return;
    setActivePei((prev) => {
      if (!prev) return null;
      const updated: PEICompleto = {
        ...prev,
        painel_notas: prev.painel_notas.filter((n) => n.id !== id),
      };
      setStudentsList((list) =>
        list.map((s) => (s.id === updated.id ? updated : s))
      );
      return updated;
    });
    try {
      await apiService.deleteNote(activePei.id, id);
    } catch (err) {
      console.error('Erro ao excluir nota do banco SQLite:', err);
    }
  };

  const handlePrint = () => {
    if (!displayedActivePei) return;
    if (activeTab !== 'documento_oficial') {
      setActiveTab('documento_oficial');
    }
    exportOfficialPeiPdf(displayedActivePei);
  };

  const handleCloseOnboardingTour = () => {
    setIsOnboardingTourOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING_DONE, 'true');
    } catch {
      // ignore
    }
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
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        onOpenPpcAnalyzer={() => setIsPpcAnalyzerOpen(true)}
        onOpenSusResearch={() => setIsSusResearchOpen(true)}
        onResetToDefault={handleResetToDefault}
        onOpenOnboardingTour={() => setIsOnboardingTourOpen(true)}
        onOpenAiConfig={() => setIsAiConfigOpen(true)}
      />

      {/* Presentation Mode Alert Banner */}
      {isPresentationMode && (
        <div className="bg-blue-900 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between no-print border-b border-blue-800">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
            <span>
              <strong>Modo Apresentação Ativo (LGPD / CEP):</strong> Nomes reais, matrículas e contatos foram anonimizados para exibição em bancas, eventos científicos (JICE) ou projeções públicas.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPresentationMode(false)}
            className="text-blue-200 hover:text-white underline text-[11px] shrink-0 cursor-pointer ml-2"
          >
            Desativar
          </button>
        </div>
      )}

      {/* Single Clean Student Header when viewing a PEI tab */}
      {activeTab !== 'hub' && activeTab !== 'normas' && displayedActivePei && (
        <div className="no-print">
          <StudentHeader
            pei={displayedActivePei}
            allStudents={displayedStudents}
            onSelectCase={handleSelectStudent}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenCampusStats={() => setIsCampusStatsOpen(true)}
            onRequestDeletePei={handleRequestDeletePei}
            filtroDocente={filtroDocente}
            onMudarFiltroDocente={handleMudarFiltroDocente}
          />
        </div>
      )}

      {/* Notification Banner on PEI Deletion */}
      {deleteNotice && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 no-print">
          <div className="p-3 bg-[#006633] text-white rounded shadow-sm flex items-center justify-between gap-3 text-xs">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'hub' && (
          <ILovePeiHub
            activePei={displayedActivePei}
            allStudents={displayedStudents}
            onSelectStudent={handleSelectStudent}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenSolutionBank={() => setIsSolutionBankOpen(true)}
            onOpenCampusStats={() => setIsCampusStatsOpen(true)}
            onPrint={handlePrint}
            onRequestDeletePei={handleRequestDeletePei}
            onOpenOnboardingTour={() => setIsOnboardingTourOpen(true)}
            filtroDocente={filtroDocente}
            onMudarFiltroDocente={handleMudarFiltroDocente}
          />
        )}

        {activeTab === 'normas' && <OfficialKnowledgeBaseView />}

        {activeTab === 'pei' && (
          displayedActivePei ? (
            <PeiView
              pei={displayedActivePei}
              onUpdateMetaStatus={handleUpdateMetaStatus}
              onAddMeta={handleAddMeta}
              onOpenSolutionBank={() => setIsSolutionBankOpen(true)}
              onUpdateObservacoes={handleUpdateObservacoes}
            />
          ) : (
            <div className="bg-white border border-slate-300 rounded p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-[#006633] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Nenhum PEI selecionado para visualização</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                O banco de dados SQLite está limpo e pronto para receber os dados reais da sua matéria. Acesse a aba <strong>Diários & Turmas</strong> ou clique no botão abaixo para elaborar seu primeiro PEI com auxílio do Agente Ioda.
              </p>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="px-4 py-2 bg-[#006633] hover:bg-[#005026] text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                + Cadastrar Primeiro PEI do Diário
              </button>
            </div>
          )
        )}

        {activeTab === 'estudo_caso' && (
          displayedActivePei ? (
            <CaseStudyView pei={displayedActivePei} />
          ) : (
            <div className="bg-white border border-slate-300 rounded p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-[#006633] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Estudo de Caso Indisponível</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Cadastre um estudante no diário para visualizar seu estudo de caso, histórico ETEP e mapeamento situacional de gatilhos.
              </p>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="px-4 py-2 bg-[#006633] hover:bg-[#005026] text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                + Cadastrar Novo PEI
              </button>
            </div>
          )
        )}

        {activeTab === 'documento_oficial' && (
          displayedActivePei ? (
            <OfficialTemplateView
              pei={displayedActivePei}
              onPrint={handlePrint}
              onUpdatePei={handleUpdatePei}
            />
          ) : (
            <div className="bg-white border border-slate-300 rounded p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-[#006633] flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Nenhum Documento para Impressão</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Cadastre um estudante para gerar o documento formatado nos padrões institucionais de envio ao SEI.
              </p>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="px-4 py-2 bg-[#006633] hover:bg-[#005026] text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                + Cadastrar Novo PEI
              </button>
            </div>
          )
        )}

        {activeTab === 'painel' && (
          displayedActivePei ? (
            <PeiPainelView
              pei={displayedActivePei}
              onAddPostIt={handleAddPostIt}
              onDeletePostIt={handleDeletePostIt}
            />
          ) : (
            <div className="bg-white border border-slate-300 rounded p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-[#006633] flex items-center justify-center mx-auto">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Painel de Metas DUA Indisponível</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Cadastre um estudante para acompanhar o alcance de metas curriculares e registrar observações colaborativas.
              </p>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(true)}
                className="px-4 py-2 bg-[#006633] hover:bg-[#005026] text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                + Cadastrar Novo PEI
              </button>
            </div>
          )
        )}
      </main>

      {/* Institutional SUAP Footer */}
      <footer className="bg-[#f0f2f5] border-t border-slate-300 py-4 text-xs text-slate-600 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800">
              SUAP · Sistema Unificado de Administração Pública
            </span>
            <div className="text-[11px] text-slate-500">
              Instituto Federal do Tocantins · Campus Paraíso do Tocantins · Resolução CONSUP/IFTO nº 48/2021 & Portaria MEC nº 421/2026
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCentralAjudaOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#006633]" />
              <span>Manuais & Legislação</span>
            </button>
          </div>
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

      {displayedActivePei && (
        <SolutionBankModal
          isOpen={isSolutionBankOpen}
          onClose={() => setIsSolutionBankOpen(false)}
          activePei={displayedActivePei}
          onApplySolution={handleApplySolution}
        />
      )}

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

      {displayedActivePei && (
        <PpcAnalyzerModal
          isOpen={isPpcAnalyzerOpen}
          onClose={() => setIsPpcAnalyzerOpen(false)}
          activePei={displayedActivePei}
          onApplyPpcAdaptations={handleApplyPpcAdaptations}
        />
      )}

      <SusResearchModal
        isOpen={isSusResearchOpen}
        onClose={() => setIsSusResearchOpen(false)}
      />

      <OnboardingTourModal
        isOpen={isOnboardingTourOpen}
        onClose={handleCloseOnboardingTour}
        onStartCreatePei={() => setIsAddStudentOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <AiConfigModal
        isOpen={isAiConfigOpen}
        onClose={() => setIsAiConfigOpen(false)}
      />
    </div>
  );
}
