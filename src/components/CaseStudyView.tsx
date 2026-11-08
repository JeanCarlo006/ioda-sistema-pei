import React from 'react';
import { PEICompleto } from '../types/pei';
import {
  AlertTriangle,
  Sparkles,
  Cpu,
  Eye,
  FileText,
  Users,
  History,
  Layers,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface CaseStudyViewProps {
  pei: PEICompleto;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({ pei }) => {
  const { estudo_de_caso, historico_napne } = pei;

  const gatilhosList =
    estudo_de_caso.mapeamento_de_gatilhos_e_crises &&
    estudo_de_caso.mapeamento_de_gatilhos_e_crises.length > 0
      ? estudo_de_caso.mapeamento_de_gatilhos_e_crises
      : [
          'Ruídos altos e estímulos sensoriais concorrentes no ambiente de aula/laboratório sem apoio de abafador.',
          'Instruções verbais longas sem apoio visual ou roteiro passo a passo.',
          'Mudanças bruscas de rotina ou cobrança sob pressão temporal restrita.',
        ];

  const historicoEtepList =
    estudo_de_caso.historico_boas_praticas_etep &&
    estudo_de_caso.historico_boas_praticas_etep.length > 0
      ? estudo_de_caso.historico_boas_praticas_etep
      : [
          'Fracionamento de atividades práticas em entregas curtas (chunking) validado nos semestres anteriores.',
          'Disponibilização antecipada de roteiros no AVA/Moodle e tempo adicional (+50%) em avaliações.',
          'Trabalho colaborativo em duplas com papéis pedagógicos bem definidos.',
        ];

  const condicoesInterseccao =
    estudo_de_caso.interseccao_condicoes && estudo_de_caso.interseccao_condicoes.length > 0
      ? estudo_de_caso.interseccao_condicoes
      : (historico_napne.categoria_neurodivergencia || 'Acompanhamento Pedagógico Individualizado')
          .split('+')
          .map((s) => s.trim())
          .filter(Boolean);

  const especificidadesList =
    estudo_de_caso.especificidades_transtorno_e_interseccoes &&
    estudo_de_caso.especificidades_transtorno_e_interseccoes.length > 0
      ? estudo_de_caso.especificidades_transtorno_e_interseccoes
      : [historico_napne.descricao_condicao_especifica];

  return (
    <div className="space-y-8">
      {/* Clean Page Title + Intersection Badges */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Estudo de Caso Sintetizado (Análise Funcional & Histórico ETEP)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visão holística e biopsicossocial das especificidades por neurodivergência, gatilhos, potencialidades e boas práticas anteriores
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Intersecção:
          </span>
          {condicoesInterseccao.map((cond, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold"
            >
              {cond}
            </span>
          ))}
        </div>
      </div>

      {/* BLOCO DE ESPECIFICIDADES POR TRANSTORNO / NEURODIVERGÊNCIA E INTERSECÇÕES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Especificidades por Transtorno / Neurodivergência e Intersecções
            </h3>
            <p className="text-xs text-slate-500">
              Características individuais observadas no estudante (evitando generalizações padronizadas)
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {especificidadesList.map((esp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed"
            >
              {esp}
            </div>
          ))}
        </div>
      </div>

      {/* BENTO GRID NOVO: MAPEAMENTO DE GATILHOS (ANÁLISE FUNCIONAL) + HISTÓRICO ETEP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapeamento de Gatilhos e Comportamento */}
        <div className="bg-white border border-amber-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Mapeamento de Gatilhos e Comportamento (Análise Funcional)
              </h3>
              <p className="text-xs text-slate-500">
                Fatores sensoriais, ambientais ou rotineiros a prevenir para evitar sobrecarga ou ansiedade
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {gatilhosList.map((gatilho, idx) => (
              <li
                key={idx}
                className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 leading-relaxed"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{gatilho}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Histórico ETEP / Boas Práticas Anteriores */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Histórico ETEP / Boas Práticas Anteriores
              </h3>
              <p className="text-xs text-slate-500">
                Estratégias e adaptações validadas em ciclos anteriores pela equipe pedagógica
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {historicoEtepList.map((pratica, idx) => (
              <li
                key={idx}
                className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{pratica}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bloco 1: Contexto e Parceria Familiar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h3>Histórico Pedagógico e Contextual</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {historico_napne.breve_historico_clinico_familiar}
          </p>
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Especificidades Observadas em Aula:
            </span>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {historico_napne.descricao_condicao_especifica}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3>Diálogo com o Estudante, Família e ETEP</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {historico_napne.informacoes_dos_pais}
          </p>
        </div>
      </div>

      {/* Bloco 2: Barreiras Contextuais vs Potencialidades e Interesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barreiras */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Barreiras Contextuais Identificadas
              </h3>
              <p className="text-xs text-slate-500">
                Obstáculos que dificultam o aprendizado e como superá-los
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {estudo_de_caso.barreiras.map((barreira) => (
              <div
                key={barreira.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Barreira {barreira.categoria}
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {barreira.descricao}
                </p>
                <p className="text-xs text-emerald-800 font-medium pt-1 border-t border-slate-200">
                  <strong>Ação prática:</strong> {barreira.estrategia_enfrentamento}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Potencialidades */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Potencialidades e Interesses
              </h3>
              <p className="text-xs text-slate-500">
                Habilidades e interesses do estudante para apoiar o ensino
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {estudo_de_caso.potencialidades.map((pot) => (
              <div
                key={pot.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <span className="text-xs font-bold text-emerald-800 block">
                  {pot.area}
                </span>
                <p className="text-sm text-slate-900 font-medium">
                  {pot.descricao}
                </p>
                <p className="text-xs text-slate-600 pt-1 border-t border-slate-200">
                  <strong>Como aproveitar em aula:</strong> {pot.apoio_demandado}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco 3: Recursos de Apoio e Observação em Sala */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Recursos de TA / CAA e Tecnologias de Apoio
            </h3>
          </div>

          <ul className="space-y-2">
            {estudo_de_caso.recursos_ta.map((recurso, idx) => (
              <li
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium"
              >
                • {recurso}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Eye className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Observação em Sala e Laboratório
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">
                Relação com Professores
              </span>
              <p className="text-slate-600 leading-relaxed">
                {estudo_de_caso.sintese_observacao.interacao_professores}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">
                Interação com Colegas
              </span>
              <p className="text-slate-600 leading-relaxed">
                {estudo_de_caso.sintese_observacao.interacao_colegas}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">
                Atividades em Grupo
              </span>
              <p className="text-slate-600 leading-relaxed">
                {estudo_de_caso.sintese_observacao.tarefas_coletivas}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">
                Autonomia na Rotina
              </span>
              <p className="text-slate-600 leading-relaxed">
                {estudo_de_caso.sintese_observacao.autonomia_rotina}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
