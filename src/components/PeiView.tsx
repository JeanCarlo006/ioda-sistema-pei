import React, { useState } from 'react';
import { PEICompleto, MetaPEI } from '../types/pei';
import { bancoDeSolucoesPedagogicas } from '../data/initialCases';
import {
  BookOpen,
  Target,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Plus,
  Wrench,
  ListChecks,
  FileCheck,
  HeartHandshake,
  GraduationCap,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';

interface PeiViewProps {
  pei: PEICompleto;
  onUpdateMetaStatus: (metaId: string, newStatus: MetaPEI['status'], newProgress: number) => void;
  onAddMeta: (newMeta: MetaPEI) => void;
  onOpenSolutionBank?: () => void;
  onUpdateObservacoes?: (novaObs: string) => void;
}

export const PeiView: React.FC<PeiViewProps> = ({
  pei,
  onUpdateMetaStatus,
  onAddMeta,
  onOpenSolutionBank,
  onUpdateObservacoes,
}) => {
  const { planejamento_pei, cabecalho, estudo_de_caso, historico_napne } = pei;
  const [showAddForm, setShowAddForm] = useState(false);
  const [modoGuiaAluno, setModoGuiaAluno] = useState(false);
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoPrazo, setNovoPrazo] = useState('Mensal (4 semanas)');
  const [novoIndicador, setNovoIndicador] = useState('');

  const handleCreateMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaDescricao.trim() || !novoIndicador.trim()) return;

    const newMeta: MetaPEI = {
      id_meta: `M${planejamento_pei.objetivos_e_metas.length + 1}`,
      descricao_meta: novaDescricao.trim(),
      prazo: novoPrazo,
      indicador_sucesso: novoIndicador.trim(),
      progresso_percentual: 0,
      status: 'em_andamento',
    };

    onAddMeta(newMeta);
    setNovaDescricao('');
    setNovoIndicador('');
    setShowAddForm(false);
  };

  const fallbackSolucao =
    bancoDeSolucoesPedagogicas.find((s) =>
      (historico_napne.categoria_neurodivergencia || '')
        .toLowerCase()
        .includes(s.titulo.split(' ')[0].toLowerCase())
    ) || bancoDeSolucoesPedagogicas[0];

  const guiaPratico =
    planejamento_pei.guia_pratico_sala_de_aula || fallbackSolucao.guiaPratico!;

  return (
    <div className="space-y-8">
      {/* Top Action Bar: Toggle Student Guide + Solution Bank */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {modoGuiaAluno
              ? `Guia de Estudos do Estudante (${cabecalho.estudante.split(' ')[0]})`
              : `Plano de Aula (PEI) — ${cabecalho.componente_curricular}`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {modoGuiaAluno
              ? 'Resumo acolhedor em formato de checklist pensado para leitura direta pelo estudante'
              : 'Orientações diretas de sala de aula, divisão de atividades e avaliação adaptada'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setModoGuiaAluno(!modoGuiaAluno)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              modoGuiaAluno
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{modoGuiaAluno ? 'Voltar à Visão do Professor' : 'Ver Guia do Aluno'}</span>
          </button>

          {!modoGuiaAluno && onOpenSolutionBank && (
            <button
              type="button"
              onClick={onOpenSolutionBank}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-700" />
              <span>Outras Metodologias</span>
            </button>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* VISÃO DO ESTUDANTE (APOIO DIRETO AO ALUNO)                          */}
      {/* =================================================================== */}
      {modoGuiaAluno ? (
        <div className="space-y-6">
          {/* Boas-vindas e Pontos Fortes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Olá, {cabecalho.estudante.split(' ')[0]}! Seus Pontos Fortes e Interesses
                </h3>
                <p className="text-xs text-slate-500">
                  Seu plano na disciplina <strong>{cabecalho.componente_curricular}</strong> foi construído valorizando o que você faz de melhor:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {estudo_de_caso.potencialidades.map((pot) => (
                <div
                  key={pot.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <span className="text-xs font-bold text-emerald-800 block mb-1">
                    {pot.area}
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {pot.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist de Metas do Estudante */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Meu Checklist de Metas na Disciplina
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Clique em uma meta quando concluir cada etapa
              </span>
            </div>

            <div className="space-y-3">
              {planejamento_pei.objetivos_e_metas.map((meta) => {
                const concluida = meta.status === 'alcancada' || meta.progresso_percentual >= 100;
                return (
                  <button
                    key={meta.id_meta}
                    type="button"
                    onClick={() =>
                      onUpdateMetaStatus(
                        meta.id_meta,
                        concluida ? 'em_andamento' : 'alcancada',
                        concluida ? 50 : 100
                      )
                    }
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      concluida
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-700 shrink-0">
                      {concluida ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-bold ${
                          concluida ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {meta.descricao_meta}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>Como saber que consegui:</strong> {meta.indicador_sucesso} ({meta.prazo})
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dicas Práticas de Estudo e Direitos em Aula */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Como dividir suas atividades (Passo a Passo)
              </h3>
              <ul className="space-y-2">
                {guiaPratico.divisao_tarefa_chunking.map((etapa, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200"
                  >
                    {etapa}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Seus Apoios Garantidos no Laboratório e nas Provas
              </h3>
              <ul className="space-y-2">
                {estudo_de_caso.recursos_ta.map((recurso, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{recurso}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* VISÃO DO PROFESSOR (LIMPA, COM ESPAÇO EM BRANCO E GUIA PRÁTICO)     */
        /* =================================================================== */
        <div className="space-y-8">
          {/* BLOCO 1: GUIA PRÁTICO DE SALA DE AULA (4 PILARES) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  1. Guia Prático de Sala de Aula
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Como conduzir a aula, fracionar exercícios e avaliar o estudante na prática
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                {historico_napne.categoria_neurodivergencia || 'Atendimento Individualizado'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Passo a Passo na Prática */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Passo a Passo na Prática (Explicação)</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {guiaPratico.passo_a_passo_explicacao}
                </p>
              </div>

              {/* 2. Divisão da Tarefa (Chunking) */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <ListChecks className="w-4 h-4 text-emerald-600" />
                  <span>Divisão da Tarefa em 3 Etapas (Chunking)</span>
                </div>
                <ul className="space-y-1.5">
                  {guiaPratico.divisao_tarefa_chunking.map((etapa, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      • {etapa}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Como Avaliar na Prática */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Como Avaliar na Prática</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {guiaPratico.avaliacao_pratica}
                </p>
              </div>

              {/* 4. Manejo e Acolhimento */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Manejo e Acolhimento em Sala</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {guiaPratico.manejo_e_acolhimento}
                </p>
              </div>
            </div>

            {/* Sub-bloco Prático: Roteiro de Aula de Laboratório (100 min) & Manejo de Crises */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Roteiro de Bolso para o Professor · Laboratório de TI (100 Minutos)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 block">
                    00 - 15 min · Ancoragem
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    Exibir o software ou projeto funcionando antes de falar de sintaxe de código.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-800 block">
                    15 - 55 min · Prática Guiada
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    Atividades em blocos de 20 min com pausa sensorial de 5 min (descanso visual).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-800 block">
                    55 - 80 min · Programação em Pares
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    Pair programming com papéis claros (um digita, outro pesquisa documentação).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold uppercase text-slate-800 block">
                    80 - 100 min · Fechamento
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    Checagem individual na bancada, sem constrangimento ou exposição pública.
                  </p>
                </div>
              </div>

              {/* Protocolo do Cartão de Pausa Discreta & Ferramentas de TI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900 mb-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Protocolo do "Cartão de Pausa Discreta"</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Acordo prévio: o estudante pode colocar um cartão discreto na bancada e retirar-se por até 5 minutos para regular a sobrecarga sensorial no corredor ou bebedouro, sem precisar pedir autorização em voz alta.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
                    <Wrench className="w-4 h-4 text-emerald-700" />
                    <span>Kit de TI Acessível no Laboratório</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Configurações sugeridas no VS Code do aluno: Fonte <strong>OpenDyslexic</strong>, tema Dark High Contrast, extensão <strong>CodeSpell</strong> e ativação do leitor de tela nativo (NVDA / Narrador).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BLOCO 2: DETALHAMENTO DO COMPONENTE CURRICULAR (EMENTA, PPC/BNCC E DIFICULDADES ESPECÍFICAS) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                2. Detalhamento do Componente Curricular (PPC / BNCC) e Flexibilização
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ementa oficial, habilidades PPC/BNCC, dificuldades específicas na disciplina e adaptação sem empobrecimento curricular
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-800 block mb-1.5">
                  Ementa Oficial & Conteúdos do Módulo/Semestre
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {planejamento_pei.conteudo_ementa_oficial}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-800 block mb-1.5">
                  Habilidades e Competências Exigidas (PPC / BNCC)
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {planejamento_pei.competencias_habilidades_ementa}
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                <span className="text-xs font-bold text-amber-900 block mb-1.5">
                  Dificuldades Específicas Observadas nesta Disciplina
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {planejamento_pei.dificuldades_especificas_na_disciplina ||
                    historico_napne.descricao_condicao_especifica}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <span className="text-xs font-bold text-emerald-800 block mb-1.5">
                  Adaptação e Flexibilização Curricular na Disciplina
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {planejamento_pei.adaptacao_flexibilizacao_curricular}
                </p>
              </div>
            </div>
          </section>

          {/* BLOCO 3: ESTRATÉGIAS PREVENTIVAS E DUA 3.0 (ENGAJAMENTO E AUTORREGULAÇÃO, REPRESENTAÇÃO E AÇÃO/TA-CAA) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Layers className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  3. Estratégias Preventivas e DUA 3.0 (Desenho Universal para a Aprendizagem)
                </h3>
                <p className="text-xs text-slate-500">
                  Prevenção de gatilhos e autorregulação, materiais multissensoriais acessíveis e múltiplas vias de expressão com Recursos de TA/CAA
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Engajamento e Autorregulação (Prevenção de Gatilhos)
                </h4>
                <ul className="space-y-2">
                  {planejamento_pei.flexibilizacao_metodologica_dua.engajamento.map((item, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Representação Multissensorial
                </h4>
                <ul className="space-y-2">
                  {planejamento_pei.flexibilizacao_metodologica_dua.representacao.map((item, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ação e Expressão (TA / CAA)
                </h4>
                <ul className="space-y-2">
                  {planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao.map(
                    (item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        • {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* Bento Grid: Mapeamento de Gatilhos (Análise Funcional) + Histórico ETEP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                  Mapeamento de Gatilhos e Crises (Análise Funcional)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {(estudo_de_caso.mapeamento_de_gatilhos_e_crises &&
                  estudo_de_caso.mapeamento_de_gatilhos_e_crises.length > 0
                    ? estudo_de_caso.mapeamento_de_gatilhos_e_crises
                    : [
                        'Ruídos altos no laboratório e instruções verbais longas sem apoio visual.',
                        'Mudanças bruscas de rotina ou prazos sem antecipação.',
                      ]
                  ).map((g, idx) => (
                    <li key={idx} className="leading-relaxed">
                      • {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                  Histórico ETEP / Boas Práticas Anteriores
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {(estudo_de_caso.historico_boas_praticas_etep &&
                  estudo_de_caso.historico_boas_praticas_etep.length > 0
                    ? estudo_de_caso.historico_boas_praticas_etep
                    : [
                        'Fracionamento de atividades práticas em entregas curtas (chunking).',
                        'Roteiros estruturados antecipados no Moodle e tempo adicional (+50%).',
                      ]
                  ).map((h, idx) => (
                    <li key={idx} className="leading-relaxed">
                      • {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* BLOCO 4: METAS DO ESTUDANTE */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    4. Metas de Aprendizagem ({planejamento_pei.objetivos_e_metas.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Acompanhe a evolução do estudante em cada meta definida para o período
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Meta</span>
              </button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleCreateMeta}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4"
              >
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  Adicionar Nova Meta ao PEI
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Objetivo / Meta
                    </label>
                    <input
                      type="text"
                      value={novaDescricao}
                      onChange={(e) => setNovaDescricao(e.target.value)}
                      placeholder="Ex: Implementar consultas SQL com apoio de script guia..."
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Prazo
                    </label>
                    <select
                      value={novoPrazo}
                      onChange={(e) => setNovoPrazo(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="Curto Prazo (2 semanas)">Curto Prazo (2 semanas)</option>
                      <option value="Mensal (4 semanas)">Mensal (4 semanas)</option>
                      <option value="Bimestral (8 semanas)">Bimestral (8 semanas)</option>
                      <option value="Semestral (12 semanas)">Semestral (12 semanas)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Indicador de Sucesso
                  </label>
                  <input
                    type="text"
                    value={novoIndicador}
                    onChange={(e) => setNovoIndicador(e.target.value)}
                    placeholder="Ex: Entrega do script validado em laboratório"
                    className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 cursor-pointer"
                  >
                    Salvar Meta
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {planejamento_pei.objetivos_e_metas.map((meta) => (
                <div
                  key={meta.id_meta}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded">
                        {meta.id_meta}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {meta.prazo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={meta.status}
                        onChange={(e) =>
                          onUpdateMetaStatus(
                            meta.id_meta,
                            e.target.value as MetaPEI['status'],
                            e.target.value === 'alcancada' ? 100 : meta.progresso_percentual
                          )
                        }
                        className="text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1 bg-white text-slate-700 cursor-pointer"
                      >
                        <option value="em_andamento">Em Andamento</option>
                        <option value="alcancada">Concluída</option>
                        <option value="superada">Superada</option>
                        <option value="em_revisao">Em Revisão</option>
                      </select>

                      <span className="text-xs font-mono font-bold text-emerald-700 min-w-[3rem] text-right">
                        {meta.progresso_percentual}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900">{meta.descricao_meta}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Evidência:</strong> {meta.indicador_sucesso}
                      </span>
                    </p>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-500">Progresso:</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={meta.progresso_percentual}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          onUpdateMetaStatus(
                            meta.id_meta,
                            val === 100 ? 'alcancada' : 'em_andamento',
                            val
                          );
                        }}
                        className="w-28 accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BLOCO 5: AVALIAÇÃO E OBSERVAÇÕES DO PROFESSOR (DIGITAÇÃO TRADICIONAL) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  5. Condições de Avaliação
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    Formato da Prova / Trabalho
                  </span>
                  <p className="text-slate-800 mt-0.5">
                    {planejamento_pei.estrategias_avaliacao.formato_acessivel}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    Tempo e Local
                  </span>
                  <p className="text-slate-800 mt-0.5">
                    {planejamento_pei.estrategias_avaliacao.tempo_e_espaco}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Recursos Permitidos
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {planejamento_pei.estrategias_avaliacao.recursos_utilizados.map((rec, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Observações do Professor (Digitação Tradicional Limpa) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  6. Observações do Professor
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registre resultados e objetivos alcançados pelo estudante no período
                </p>
              </div>

              <textarea
                value={planejamento_pei.observacoes_docente}
                onChange={(e) => onUpdateObservacoes?.(e.target.value)}
                rows={5}
                placeholder="Digite observações sobre a participação, avanços e resultados do estudante..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
