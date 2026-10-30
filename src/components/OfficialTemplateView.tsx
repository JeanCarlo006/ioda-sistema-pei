import React, { useState } from 'react';
import { PEICompleto } from '../types/pei';
import { Printer, Download, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { exportOfficialPeiPdf } from '../utils/exportOfficialPdf';

interface OfficialTemplateViewProps {
  pei: PEICompleto;
  onPrint: () => void;
  onUpdatePei?: (updatedPei: PEICompleto) => void;
}

export const OfficialTemplateView: React.FC<OfficialTemplateViewProps> = ({
  pei,
  onUpdatePei,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPei, setEditedPei] = useState<PEICompleto>(pei);
  const [pdfFeedback, setPdfFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isEditing) {
      setEditedPei(pei);
    }
  }, [pei, isEditing]);

  const handleSave = () => {
    if (onUpdatePei) {
      onUpdatePei(editedPei);
    }
    setIsEditing(false);
  };

  const handleDownloadPdf = () => {
    if (isEditing && onUpdatePei) {
      onUpdatePei(editedPei);
      setIsEditing(false);
    }
    exportOfficialPeiPdf(editedPei);
    setPdfFeedback('PDF oficial gerado e baixado com sucesso!');
    setTimeout(() => setPdfFeedback(null), 4000);
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const { cabecalho, historico_napne, planejamento_pei } = editedPei;

  const textoMetodologiaCombinada = [
    `Engajamento: ${planejamento_pei.flexibilizacao_metodologica_dua.engajamento.join(' ')}`,
    `Representação: ${planejamento_pei.flexibilizacao_metodologica_dua.representacao.join(' ')}`,
    `Ação e Expressão: ${planejamento_pei.flexibilizacao_metodologica_dua.acao_e_expressao.join(' ')}`,
    planejamento_pei.guia_pratico_sala_de_aula
      ? `Passo a Passo em Aula: ${planejamento_pei.guia_pratico_sala_de_aula.passo_a_passo_explicacao} | Divisão de Tarefas: ${planejamento_pei.guia_pratico_sala_de_aula.divisao_tarefa_chunking.join(' ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const textoAvaliacaoCombinada = [
    `Formato Acessível: ${planejamento_pei.estrategias_avaliacao.formato_acessivel}`,
    `Critério de Sucesso e Avanço: ${planejamento_pei.estrategias_avaliacao.criterio_de_sucesso}`,
    `Tempo e Espaço: ${planejamento_pei.estrategias_avaliacao.tempo_e_espaco}`,
    `Recursos de Tecnologia Assistiva Utilizados: ${planejamento_pei.estrategias_avaliacao.recursos_utilizados.join(', ')}.`,
  ].join('\n');

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Modelo Oficial Institucional · IFTO / NAPNE (Processo SEI)
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            PEI - Plano de Ensino Individualizado
          </h2>
          <p className="text-xs text-slate-500">
            Documento formatado com cabeçalho oficial, tabelas padronizadas e bloco de assinaturas
          </p>
          {pdfFeedback && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{pdfFeedback}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar Campos</span>
            </button>
          )}

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PDF Oficial</span>
          </button>

          <button
            onClick={handleBrowserPrint}
            title="Disponível ao abrir o app em nova guia do navegador"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* A4 Official Printable Document Sheet */}
      <div className="official-print-sheet bg-white border border-slate-400 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto text-black font-sans print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* CABEÇALHO OFICIAL IFTO + NAPNE + IODA + FOTO DO ESTUDANTE */}
        <table className="w-full border-collapse border border-black mb-4">
          <tbody>
            <tr>
              {/* Logo Oficial IFTO (Campus Paraíso do Tocantins) */}
              <td className="border border-black p-3 w-1/4 align-middle">
                <div className="flex items-center gap-2.5">
                  {/* Símbolo Oficial IF (Grade de quadrados verdes e ponto vermelho) */}
                  <svg
                    viewBox="0 0 60 80"
                    className="w-10 h-13 shrink-0"
                    aria-label="Logo Instituto Federal do Tocantins"
                  >
                    <circle cx="10" cy="10" r="8" fill="#c8102e" />
                    <rect x="24" y="2" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="42" y="2" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="2" y="22" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="24" y="22" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="2" y="42" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="24" y="42" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="42" y="42" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="2" y="62" width="14" height="14" rx="2" fill="#00843d" />
                    <rect x="24" y="62" width="14" height="14" rx="2" fill="#00843d" />
                  </svg>
                  <div className="leading-tight">
                    <span className="block text-[10px] font-black uppercase tracking-tight text-slate-900">
                      INSTITUTO FEDERAL
                    </span>
                    <span className="block text-[10px] font-bold text-emerald-800">
                      Tocantins
                    </span>
                    <span className="block text-[9px] text-slate-600 mt-0.5">
                      Campus Paraíso do Tocantins
                    </span>
                  </div>
                </div>
              </td>

              {/* Centro: Título Institucional & NAPNE / IFTO */}
              <td className="border border-black p-3 text-center align-middle">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-0.5">
                    MINISTÉRIO DA EDUCAÇÃO · NAPNE / IFTO
                  </span>
                  <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
                    PEI - Plano de Ensino Individualizado
                  </h1>
                  <span className="text-[10px] text-slate-700 font-medium">
                    Núcleo de Atendimento às Pessoas com Necessidades Específicas
                  </span>
                </div>
              </td>

              {/* Direita: Quadro de Foto / Identificação do Estudante */}
              <td className="border border-black p-2 w-32 text-center align-middle bg-slate-50">
                <div className="flex flex-col items-center justify-center min-h-[76px]">
                  <span className="text-[9px] font-bold uppercase text-slate-600 leading-tight">
                    Foto de
                  </span>
                  <span className="text-[10px] font-extrabold text-black uppercase mt-1 leading-tight">
                    {cabecalho.estudante}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600 mt-1">
                    {cabecalho.codigo_matricula}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 1. IDENTIFICAÇÃO */}
        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black"
              >
                1. Identificação
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black py-1.5 px-3 w-1/2">
                <strong>Docente:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={cabecalho.docente_regente}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        cabecalho: { ...cabecalho, docente_regente: e.target.value },
                      })
                    }
                    className="w-full p-1 border border-slate-400 rounded mt-0.5 text-xs"
                  />
                ) : (
                  <span>{cabecalho.docente_regente}</span>
                )}
              </td>
              <td className="border border-black py-1.5 px-3 w-1/2">
                <strong>Nome do estudante:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={cabecalho.estudante}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        cabecalho: { ...cabecalho, estudante: e.target.value },
                      })
                    }
                    className="w-full p-1 border border-slate-400 rounded mt-0.5 text-xs font-bold"
                  />
                ) : (
                  <span className="font-bold">{cabecalho.estudante}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-black py-1.5 px-3">
                <strong>Matrícula:</strong> <span>{cabecalho.codigo_matricula}</span>
              </td>
              <td className="border border-black py-1.5 px-3">
                <strong>Curso:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={cabecalho.curso}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        cabecalho: { ...cabecalho, curso: e.target.value },
                      })
                    }
                    className="w-full p-1 border border-slate-400 rounded mt-0.5 text-xs"
                  />
                ) : (
                  <span>{cabecalho.curso}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-black py-1.5 px-3">
                <strong>Componente Curricular:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={cabecalho.componente_curricular}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        cabecalho: { ...cabecalho, componente_curricular: e.target.value },
                      })
                    }
                    className="w-full p-1 border border-slate-400 rounded mt-0.5 text-xs"
                  />
                ) : (
                  <span>{cabecalho.componente_curricular}</span>
                )}
              </td>
              <td className="border border-black py-1.5 px-3">
                <strong>Período / Módulo:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={cabecalho.modulo_periodo}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        cabecalho: { ...cabecalho, modulo_periodo: e.target.value },
                      })
                    }
                    className="w-full p-1 border border-slate-400 rounded mt-0.5 text-xs"
                  />
                ) : (
                  <span>{cabecalho.modulo_periodo}</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 2. HISTÓRICOS CLÍNICO E FAMILIAR DO ESTUDANTE */}
        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black">
                2. Históricos Clínico e Familiar do Estudante
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3">
                <div className="font-bold text-black mb-1">
                  Breve histórico clínico e familiar do estudante: (NAPNE)
                </div>
                {isEditing ? (
                  <textarea
                    value={historico_napne.breve_historico_clinico_familiar}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        historico_napne: {
                          ...historico_napne,
                          breve_historico_clinico_familiar: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full p-2 border border-slate-400 rounded text-xs"
                  />
                ) : (
                  <p className="text-justify leading-relaxed">
                    {historico_napne.breve_historico_clinico_familiar}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3">
                <div className="font-bold text-black mb-1">
                  Breve descrição da condição específica do estudante: (NAPNE)
                </div>
                {isEditing ? (
                  <textarea
                    value={historico_napne.descricao_condicao_especifica}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        historico_napne: {
                          ...historico_napne,
                          descricao_condicao_especifica: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full p-2 border border-slate-400 rounded text-xs"
                  />
                ) : (
                  <p className="text-justify leading-relaxed whitespace-pre-line">
                    {historico_napne.descricao_condicao_especifica}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 3. INFORMAÇÕES DOS PAIS (NAPNE) */}
        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black">
                3. Informações dos Pais (NAPNE)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3">
                {isEditing ? (
                  <textarea
                    value={historico_napne.informacoes_dos_pais}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        historico_napne: {
                          ...historico_napne,
                          informacoes_dos_pais: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full p-2 border border-slate-400 rounded text-xs"
                  />
                ) : (
                  <p className="text-justify leading-relaxed">
                    {historico_napne.informacoes_dos_pais}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 4. PLANEJAMENTO DO COMPONENTE CURRICULAR */}
        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black">
                4. Planejamento do Componente Curricular
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3">
                <div className="font-bold text-black mb-1">Conteúdo (Ementa):</div>
                {isEditing ? (
                  <textarea
                    value={planejamento_pei.conteudo_ementa_oficial}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        planejamento_pei: {
                          ...planejamento_pei,
                          conteudo_ementa_oficial: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full p-2 border border-slate-400 rounded text-xs"
                  />
                ) : (
                  <p className="text-justify leading-relaxed">
                    {planejamento_pei.conteudo_ementa_oficial}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3">
                <div className="font-bold text-black mb-1">
                  Competências e Habilidades (Ementa):
                </div>
                {isEditing ? (
                  <textarea
                    value={planejamento_pei.competencias_habilidades_ementa}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        planejamento_pei: {
                          ...planejamento_pei,
                          competencias_habilidades_ementa: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full p-2 border border-slate-400 rounded text-xs"
                  />
                ) : (
                  <p className="text-justify leading-relaxed">
                    {planejamento_pei.competencias_habilidades_ementa}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 5. ADAPTAÇÃO E FLEXIBILIZAÇÃO CURRICULAR */}
        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black">
                5. Adaptação e Flexibilização Curricular{' '}
                <span className="font-normal normal-case">
                  (descrever os conteúdos aplicados/adaptados)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3">
                {isEditing ? (
                  <textarea
                    value={planejamento_pei.adaptacao_flexibilizacao_curricular}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        planejamento_pei: {
                          ...planejamento_pei,
                          adaptacao_flexibilizacao_curricular: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full p-2 border border-slate-400 rounded text-xs"
                  />
                ) : (
                  <p className="text-justify leading-relaxed">
                    {planejamento_pei.adaptacao_flexibilizacao_curricular}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 6. ADAPTAÇÃO E FLEXIBILIZAÇÃO METODOLÓGICA */}
        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black">
                6. Adaptação e Flexibilização Metodológica{' '}
                <span className="font-normal normal-case">
                  (descrever as práticas pedagógicas aplicadas/adaptadas)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3 space-y-1.5 leading-relaxed">
                <p className="text-justify whitespace-pre-line">{textoMetodologiaCombinada}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 7. AVALIAÇÃO */}
        <table className="w-full border-collapse border border-black mb-4 text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black">
                7. Avaliação{' '}
                <span className="font-normal normal-case">
                  (onde estava; o quanto o estudante avançou):
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3 leading-relaxed">
                <p className="text-justify whitespace-pre-line">{textoAvaliacaoCombinada}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 8. OBSERVAÇÃO DO PROFESSOR / RESULTADO E OBJETIVOS ALCANÇADOS */}
        <table className="w-full border-collapse border border-black mb-8 text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-slate-200 py-1.5 px-3 text-left font-bold uppercase tracking-wide text-black">
                8. Observação do Professor — Resultado e Objetivos Alcançados
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3">
                {isEditing ? (
                  <textarea
                    value={planejamento_pei.observacoes_docente}
                    onChange={(e) =>
                      setEditedPei({
                        ...editedPei,
                        planejamento_pei: {
                          ...planejamento_pei,
                          observacoes_docente: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full p-2 border border-slate-400 rounded text-xs"
                  />
                ) : (
                  <p className="text-justify leading-relaxed">
                    {planejamento_pei.observacoes_docente}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* RODAPÉ DE ASSINATURAS LADO A LADO */}
        <div className="mt-14 pt-4">
          <div className="grid grid-cols-2 gap-12 text-center text-xs">
            <div>
              <div className="border-b border-black mb-1.5 pb-1">
                <span className="font-semibold text-black">
                  {cabecalho.docente_regente}
                </span>
              </div>
              <span className="font-bold uppercase tracking-wider text-black">
                Docente
              </span>
            </div>

            <div>
              <div className="border-b border-black mb-1.5 pb-1">
                <span className="font-semibold text-black">
                  {cabecalho.coordenacao_napne}
                </span>
              </div>
              <span className="font-bold uppercase tracking-wider text-black">
                Coordenadora NAPNE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
