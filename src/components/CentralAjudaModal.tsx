import React from 'react';
import { X, CheckCircle2, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

interface CentralAjudaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CentralAjudaModal: React.FC<CentralAjudaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const checklistProfessor = [
    {
      passo: '1. Conhecer o Estudante antes do Rótulo',
      descricao:
        'Identifique primeiro os interesses, talentos e o que motiva o estudante (ex: jogos, música, programação visual). O ensino funciona melhor quando parte do que ele já domina.',
    },
    {
      passo: '2. Fracionar Atividades (Chunking) e DUA',
      descricao:
        'Divida tarefas e projetos extensos em 3 etapas curtas com entregas parciais. Combine explicações faladas com esquemas visuais ou exemplos práticos no laboratório.',
    },
    {
      passo: '3. Avaliar pelo Domínio Prático (Equidade)',
      descricao:
        'Adapte o formato da prova (tempo adicional de 25% a 50%, questões diretas sem pegadinhas, defesa oral ou entrega prática comentada) mantendo o objetivo central da disciplina.',
    },
  ];

  const glossarioNapne = [
    {
      sigla: 'PEI',
      termo: 'Plano Educacional Individualizado',
      definicao:
        'Instrumento pedagógico construído com o professor para adaptar o ensino, as atividades e as avaliações de uma disciplina às necessidades do estudante.',
    },
    {
      sigla: 'PAEE',
      termo: 'Plano de Atendimento Educacional Especializado',
      definicao:
        'Plano elaborado pela equipe multiprofissional/NAPNE para organizar os suportes, recursos de tecnologia assistiva e atendimentos no contraturno.',
    },
    {
      sigla: 'DUA',
      termo: 'Desenho Universal para a Aprendizagem (CAST 3.0)',
      definicao:
        'Abordagem que planeja aulas acessíveis a todos desde o início, oferecendo múltiplas formas de engajar, apresentar o conteúdo e avaliar o aprendizado.',
    },
    {
      sigla: 'PNEEI',
      termo: 'Política Nacional de Educação Especial Inclusiva',
      definicao:
        'Diretriz nacional atualizada pelo Decreto nº 12.686/2025 que assegura a inclusão escolar, proibindo a exigência de laudo médico para iniciar o apoio pedagógico.',
    },
    {
      sigla: 'TA',
      termo: 'Tecnologia Assistiva',
      definicao:
        'Qualquer recurso, software ou equipamento (leitores de tela, fontes adaptadas, mapas mentais, abafadores de ruído) que amplia a autonomia do estudante.',
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="central-ajuda-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
        {/* Cabeçalho */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="central-ajuda-title" className="text-lg font-bold">
                Central de Ajuda & Legislação
              </h2>
              <p className="text-xs text-slate-300">
                Guia rápido de bolso para professores e equipe NAPNE — Consulta instantânea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar janela de ajuda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. Checklist Rápido do Professor */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Checklist Rápido do Professor (3 Passos Práticos)
            </h3>
            <div className="space-y-3">
              {checklistProfessor.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                >
                  <p className="font-bold text-slate-900 text-sm mb-1">{item.passo}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.descricao}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Glossário do NAPNE */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Glossário Rápido do NAPNE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {glossarioNapne.map((item) => (
                <div
                  key={item.sigla}
                  className="bg-white border border-slate-200 rounded-xl p-3.5"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded border border-emerald-200">
                      {item.sigla}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{item.termo}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.definicao}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Links Oficiais Institucionais */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              Legislação Oficial (Íntegra no Portal Gov.br / DOU)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://www.in.gov.br/web/dou"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors group"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                    Decreto nº 12.686/2025
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Institui a Política Nacional de Educação Especial Inclusiva (PNEEI) e veda a exigência de laudo médico.
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
              </a>

              <a
                href="https://www.gov.br/mec/pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors group"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                    Portaria MEC nº 421/2026
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Regulamenta a Rede Nacional de Educação Especial Inclusiva, o PAEE e o atendimento nos Institutos Federais.
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
              </a>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
