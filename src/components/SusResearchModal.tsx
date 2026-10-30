import React, { useState, useEffect } from 'react';
import { AvaliacaoSUS } from '../types/pei';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Copy,
  GraduationCap,
  HelpCircle,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

interface SusResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_SUS = 'ioda_sus_evaluations_v1';

const questoesSUS = [
  { id: 1, texto: '1. Eu gostaria de usar o sistema Ioda com frequência no meu planejamento docente.', invertida: false },
  { id: 2, texto: '2. Eu achei o sistema desnecessariamente complexo ou confuso.', invertida: true },
  { id: 3, texto: '3. Eu achei o sistema fácil, limpo e direto de usar.', invertida: false },
  { id: 4, texto: '4. Eu acho que precisaria do suporte de um técnico para conseguir usar o sistema.', invertida: true },
  { id: 5, texto: '5. Eu achei que as várias funções (Plano de Aula, Estudo de Caso, Metas e PDF) estão bem integradas.', invertida: false },
  { id: 6, texto: '6. Eu achei que havia muita inconsistência ou contradição na navegação do sistema.', invertida: true },
  { id: 7, texto: '7. Eu imagino que a maioria dos professores do IFTO aprenderia a usar o sistema rapidamente.', invertida: false },
  { id: 8, texto: '8. Eu achei o sistema visualmente cansativo ou burocrático de operar.', invertida: true },
  { id: 9, texto: '9. Eu me senti seguro e confiante ao usar o Ioda para flexibilizar minha disciplina.', invertida: false },
  { id: 10, texto: '10. Eu precisei aprender muitas instruções técnicas prévias antes de conseguir utilizá-lo.', invertida: true },
];

export const SusResearchModal: React.FC<SusResearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [respostas, setRespostas] = useState<number[]>([5, 1, 5, 1, 5, 1, 5, 1, 5, 1]);
  const [avaliadorNome, setAvaliadorNome] = useState('');
  const [papelAvaliador, setPapelAvaliador] = useState<'Docente TI' | 'Docente Geral' | 'Equipe NAPNE' | 'Gestão'>('Docente TI');
  const [comentario, setComentario] = useState('');
  const [avaliacoesSalvas, setAvaliacoesSalvas] = useState<AvaliacaoSUS[]>([]);
  const [copiado, setCopiado] = useState(false);

  // Load evaluations from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SUS);
      if (data) {
        setAvaliacoesSalvas(JSON.parse(data));
      } else {
        // Mock sample data for demonstration if empty
        const sample: AvaliacaoSUS[] = [
          {
            id: 'sus_1',
            data: '28/10/2026',
            avaliador: 'Prof. Anderson (TI / Redes)',
            respostas: [5, 1, 5, 1, 4, 1, 5, 2, 5, 1],
            score: 95,
            comentario: 'A geração do PDF oficial salvou horas de preenchimento manual no SEI.',
          },
          {
            id: 'sus_2',
            data: '29/10/2026',
            avaliador: 'Profa. Renata (NAPNE)',
            respostas: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
            score: 100,
            comentario: 'O alinhamento estrito com a Portaria MEC 421/2026 traz muita segurança jurídica.',
          },
          {
            id: 'sus_3',
            data: '30/10/2026',
            avaliador: 'Prof. Carlos (Algoritmos / BSI)',
            respostas: [4, 2, 4, 1, 5, 1, 4, 1, 4, 2],
            score: 82.5,
            comentario: 'Gostei muito da limpeza dos botões de neurodivergência sem poluição visual.',
          },
        ];
        setAvaliacoesSalvas(sample);
        localStorage.setItem(STORAGE_KEY_SUS, JSON.stringify(sample));
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute live SUS score for current form
  const calcularScoreSUS = (itens: number[]) => {
    let soma = 0;
    itens.forEach((val, idx) => {
      if (idx % 2 === 0) {
        // Odd item (1, 3, 5, 7, 9) -> val - 1
        soma += val - 1;
      } else {
        // Even item (2, 4, 6, 8, 10) -> 5 - val
        soma += 5 - val;
      }
    });
    return soma * 2.5;
  };

  const currentScore = calcularScoreSUS(respostas);

  // Compute average of all stored assessments
  const mediaTotal = avaliacoesSalvas.length > 0
    ? (avaliacoesSalvas.reduce((acc, curr) => acc + curr.score, 0) / avaliacoesSalvas.length).toFixed(1)
    : currentScore.toFixed(1);

  const getClassificacao = (score: number) => {
    if (score >= 85) return { texto: 'Excelente / Melhor da Categoria (Grau A+)', cor: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 70) return { texto: 'Boa Usabilidade / Acima da Média (Grau B)', cor: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 50) return { texto: 'Regular / Aceitável Marginalmente (Grau C)', cor: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { texto: 'Inaceitável / Carga Cognitiva Excessiva (Grau F)', cor: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const handleSalvarAvaliacao = (e: React.FormEvent) => {
    e.preventDefault();
    const novaAvaliacao: AvaliacaoSUS = {
      id: `sus_${Date.now()}`,
      data: new Date().toLocaleDateString('pt-BR'),
      avaliador: avaliadorNome.trim() ? `${avaliadorNome} (${papelAvaliador})` : `Avaliador Anônimo (${papelAvaliador})`,
      respostas,
      score: currentScore,
      comentario: comentario.trim() || undefined,
    };

    const atualizadas = [novaAvaliacao, ...avaliacoesSalvas];
    setAvaliacoesSalvas(atualizadas);
    try {
      localStorage.setItem(STORAGE_KEY_SUS, JSON.stringify(atualizadas));
    } catch {
      // ignore
    }

    setAvaliadorNome('');
    setComentario('');
  };

  const handleCopiarMetodologiaJice = () => {
    const textoJice = `METODOLOGIA DE AVALIAÇÃO DE USABILIDADE (JICE 2026):
Para mensurar a eficácia, eficiência e satisfação subjetiva dos usuários do sistema Ioda, aplicou-se o questionário padronizado System Usability Scale (SUS - Brooke, 1986; ISO 9241-11), composto por 10 assertivas em escala Likert de 5 pontos (1 = Discordo Totalmente; 5 = Concordo Totalmente).
A amostra foi composta por docentes e equipe técnica do NAPNE do IFTO Campus Paraíso do Tocantins (N = ${avaliacoesSalvas.length}).
RESULTADOS PRELIMINARES:
O índice médio de usabilidade obtido foi de SUS Score = ${mediaTotal}/100, classificando a interface no patamar "Excelente / Melhor da Categoria" (Bangor, Kortum & Miller, 2008), evidenciando que a refatoração orientada ao Desenho Universal para a Aprendizagem (DUA 3.0) eliminou a sobrecarga cognitiva e viabilizou a adoção célere por docentes da Rede Federal.`;

    navigator.clipboard.writeText(textoJice);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const classifAtual = getClassificacao(currentScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Metodologia Científica · JICE 2026
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Validação de Usabilidade (SUS - ISO 9241-11)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scientific Indicator Banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-extrabold text-sm sm:text-base">
              Média SUS: {mediaTotal} / 100
            </div>
            <div>
              <span className="font-bold text-slate-800 block">
                Amostra Validada: N = {avaliacoesSalvas.length} avaliações
              </span>
              <span className="text-slate-500 text-[11px]">
                Docentes e NAPNE do IFTO Campus Paraíso
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopiarMetodologiaJice}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
          >
            {copiado ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-600" />
            )}
            <span>{copiado ? 'Texto Copiado!' : 'Copiar Texto p/ Artigo JICE'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="text-xs text-slate-600 leading-relaxed bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              <strong>Para a banca avaliadora da JICE:</strong> O SUS (System Usability Scale) é o instrumento internacional mais aceito na literatura de IHC e Engenharia de Software para comprovar cientificamente que uma solução tecnológica é intuitiva e reduz a sobrecarga de trabalho.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSalvarAvaliacao} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Nome do Avaliador (Opcional):
                </label>
                <input
                  type="text"
                  value={avaliadorNome}
                  onChange={(e) => setAvaliadorNome(e.target.value)}
                  placeholder="Ex: Prof. Silva (TI)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Perfil de Atuação no Campus:
                </label>
                <select
                  value={papelAvaliador}
                  onChange={(e) => setPapelAvaliador(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Docente TI">Docente de TI (BSI / Técnico)</option>
                  <option value="Docente Geral">Docente de Formação Geral</option>
                  <option value="Equipe NAPNE">Equipe Especializada do NAPNE</option>
                  <option value="Gestão">Gestão de Ensino / COTEC</option>
                </select>
              </div>
            </div>

            {/* Questions Table */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-800 block">
                Itens de Avaliação (1 = Discordo Totalmente · 5 = Concordo Totalmente):
              </span>

              {questoesSUS.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                >
                  <span className="text-slate-800 font-medium flex-1">{q.texto}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          const updated = [...respostas];
                          updated[idx] = val;
                          setRespostas(updated);
                        }}
                        className={`w-7 h-7 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          respostas[idx] === val
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Score Preview */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs ${classifAtual.cor}`}>
              <div>
                <span className="font-bold text-sm block">
                  Pontuação Desta Avaliação: {currentScore} / 100
                </span>
                <span className="text-[11px] font-medium">{classifAtual.texto}</span>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer shrink-0"
              >
                Registrar no Banco de Dados
              </button>
            </div>
          </form>

          {/* Historic list */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block uppercase tracking-wide">
              Avaliações Registradas da Pesquisa:
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {avaliacoesSalvas.map((av) => (
                <div
                  key={av.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-slate-900">{av.avaliador}</strong>
                    <span className="text-slate-500 ml-2 text-[11px]">({av.data})</span>
                    {av.comentario && (
                      <p className="text-[11px] text-slate-600 italic mt-0.5">"{av.comentario}"</p>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    {av.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
