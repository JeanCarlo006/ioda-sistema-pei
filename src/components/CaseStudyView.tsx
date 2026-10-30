import React from 'react';
import { PEICompleto } from '../types/pei';
import {
  AlertTriangle,
  Sparkles,
  Cpu,
  Eye,
  FileText,
  Users,
} from 'lucide-react';

interface CaseStudyViewProps {
  pei: PEICompleto;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({ pei }) => {
  const { estudo_de_caso, historico_napne } = pei;

  return (
    <div className="space-y-8">
      {/* Clean Page Title */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-slate-900">
          Estudo de Caso do Estudante
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Resumo pedagógico das dificuldades observadas, pontos fortes e recursos de apoio utilizados
        </p>
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
            <h3>Diálogo com o Estudante e Família</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {historico_napne.informacoes_dos_pais}
          </p>
        </div>
      </div>

      {/* Bloco 2: Dificuldades Observadas vs Pontos Fortes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barreiras */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Barreiras Identificadas na Escola
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
                Pontos Fortes e Interesses
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
              Recursos e Tecnologias de Apoio
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
