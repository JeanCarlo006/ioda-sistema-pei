import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  GraduationCap,
  Link,
  MessageSquare,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

interface SusResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_FORMS_URL = 'ioda_google_forms_url_v1';

export const SusResearchModal: React.FC<SusResearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formsUrl, setFormsUrl] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEY_FORMS_URL) ||
      'https://docs.google.com/forms'
    );
  });
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [copiadoPerguntas, setCopiadoPerguntas] = useState(false);
  const [copiadoMetodologia, setCopiadoMetodologia] = useState(false);

  const handleSaveFormsUrl = (newUrl: string) => {
    setFormsUrl(newUrl);
    localStorage.setItem(STORAGE_KEY_FORMS_URL, newUrl);
    setIsEditingUrl(false);
  };

  const roteiroPerguntasForms = `QUESTIONÁRIO DE AVALIAÇÃO DE USABILIDADE DO IODA (JICE 2026 / IFTO)
Instrução: Escala linear de 1 a 5 (onde 1 = Péssimo / Discordo Totalmente e 5 = Excelente / Concordo Totalmente).

PERGUNTAS FECHADAS (1 a 5):
1. [Facilidade de Uso] O sistema Ioda é intuitivo e fácil de navegar sem necessidade de treinamento técnico prévio?
2. [Redução de Carga Cognitiva] A visualização limpa do PEI (sem textos excessivos na tela) facilita a consulta no dia a dia?
3. [Guia Prático de Aula] O Roteiro de 100 minutos e as 3 etapas de divisão da tarefa (chunking) são aplicáveis à sua disciplina?
4. [Apoio ao Estudante] O checklist de metas simplificado e os recursos de acessibilidade atendem às necessidades reais dos estudantes?
5. [Exportação Oficial] A geração direta do PDF no padrão oficial do IFTO/NAPNE agiliza o processo no SEI?
6. [Integração e DUA] As estratégias DUA 3.0 (Engajamento, Representação, Ação e Expressão) são claras e viáveis na prática?

PERGUNTAS ABERTAS (Qualitativas):
7. Qual funcionalidade do Ioda você achou mais relevante para o seu planejamento docente?
8. Quais sugestões ou melhorias você recomenda para as próximas versões do sistema?`;

  const textoMetodologiaJice = `METODOLOGIA DE VALIDAÇÃO COM DOCENTES E NAPNE (JICE 2026):
A avaliação de usabilidade e aplicabilidade prática do sistema Ioda foi realizada por meio de pesquisa empírica com docentes e profissionais do Núcleo de Atendimento às Pessoas com Necessidades Específicas (NAPNE) do IFTO Campus Paraíso do Tocantins.
Os participantes tiveram acesso ao protótipo funcional em ambiente web e avaliaram o sistema por meio de questionário estruturado no Google Forms, composto por itens em escala Likert de 5 pontos (1 = Discordo Totalmente a 5 = Concordo Totalmente) e questões abertas de retorno qualitativo.
As respostas foram consolidadas em planilha automatizada, permitindo a análise da taxa de aceitação, tempo economizado na redação do PEI e alinhamento com as diretrizes do DUA 3.0 (CAST 2024) e da Portaria MEC nº 421/2026.`;

  const handleCopiarPerguntas = () => {
    navigator.clipboard.writeText(roteiroPerguntasForms);
    setCopiadoPerguntas(true);
    setTimeout(() => setCopiadoPerguntas(false), 3000);
  };

  const handleCopiarMetodologia = () => {
    navigator.clipboard.writeText(textoMetodologiaJice);
    setCopiadoMetodologia(true);
    setTimeout(() => setCopiadoMetodologia(false), 3000);
  };

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
                Pesquisa & Validação Docente (Google Forms)
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

        {/* Action Header Card */}
        <div className="bg-emerald-50/70 border-b border-emerald-200/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Coleta de Dados Centralizada para o Artigo
            </h3>
            <p className="text-slate-600 mt-0.5">
              Envie o link do app para os professores e colete as notas em um Google Forms oficial.
            </p>
          </div>

          <a
            href={formsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-800 hover:bg-emerald-900 text-white transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4 text-emerald-300" />
            <span>Abrir Formulário no Google Forms</span>
          </a>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Configurar Link do Google Forms */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Link className="w-4 h-4 text-emerald-700" />
                <span>Link do seu Google Forms da Pesquisa:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditingUrl(!isEditingUrl)}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                {isEditingUrl ? 'Cancelar' : 'Alterar Link'}
              </button>
            </div>

            {isEditingUrl ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="url"
                  defaultValue={formsUrl}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  id="input-forms-url"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('input-forms-url') as HTMLInputElement;
                    if (el) handleSaveFormsUrl(el.value);
                  }}
                  className="px-4 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <p className="text-slate-600 font-mono text-[11px] truncate bg-white p-2 rounded-lg border border-slate-200">
                {formsUrl}
              </p>
            )}
          </div>

          {/* Roteiro de Perguntas Pronto */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Modelo de Perguntas Pronto para Copiar e Colar</span>
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Todas as notas são diretas de 1 a 5 (onde 5 é sempre o melhor e 1 é o menor).
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopiarPerguntas}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                {copiadoPerguntas ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>{copiadoPerguntas ? 'Copiado!' : 'Copiar Perguntas'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-slate-700 font-sans leading-relaxed">
              <div className="font-semibold text-slate-900 pb-1 border-b border-slate-200">
                Perguntas de Escala Linear (1 = Discordo Totalmente / 5 = Concordo Totalmente):
              </div>
              <p>• <strong>1. Facilidade de Uso:</strong> O sistema Ioda é intuitivo e fácil de navegar sem necessidade de treinamento técnico prévio?</p>
              <p>• <strong>2. Redução de Carga Cognitiva:</strong> A visualização limpa do PEI (sem textos excessivos na tela) facilita a consulta no dia a dia?</p>
              <p>• <strong>3. Guia Prático de Aula:</strong> O Roteiro de 100 minutos e as 3 etapas de divisão da tarefa (chunking) são aplicáveis à sua disciplina?</p>
              <p>• <strong>4. Apoio ao Estudante:</strong> O checklist de metas simplificado e os recursos de acessibilidade atendem às necessidades reais dos estudantes?</p>
              <p>• <strong>5. Exportação Oficial:</strong> A geração direta do PDF no padrão oficial do IFTO/NAPNE agiliza o processo no SEI?</p>
              <p>• <strong>6. Integração e DUA:</strong> As estratégias DUA 3.0 (Engajamento, Representação, Ação e Expressão) são claras e viáveis na prática?</p>

              <div className="font-semibold text-slate-900 pt-2 pb-1 border-b border-slate-200">
                Perguntas Abertas (Qualitativas):
              </div>
              <p>• <strong>7. Relevância:</strong> Qual funcionalidade do Ioda você achou mais relevante para o seu planejamento docente?</p>
              <p>• <strong>8. Sugestões:</strong> Quais melhorias você recomenda para as próximas versões do sistema?</p>
            </div>
          </div>

          {/* Texto de Metodologia para o Artigo da JICE */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-800" />
                <span>Texto Pronto para a Metodologia do Artigo / Banner:</span>
              </span>

              <button
                type="button"
                onClick={handleCopiarMetodologia}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] text-blue-900 bg-white border border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {copiadoMetodologia ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-blue-700" />
                )}
                <span>{copiadoMetodologia ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {textoMetodologiaJice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
