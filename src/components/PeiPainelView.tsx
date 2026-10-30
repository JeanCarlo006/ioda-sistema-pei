import React, { useState } from 'react';
import { PEICompleto, PostItPainel } from '../types/pei';
import {
  Plus,
  Trash2,
  CheckCircle2,
  BarChart3,
  MessageSquarePlus,
  X,
} from 'lucide-react';

interface PeiPainelViewProps {
  pei: PEICompleto;
  onAddPostIt: (postIt: PostItPainel) => void;
  onDeletePostIt: (id: string) => void;
}

export const PeiPainelView: React.FC<PeiPainelViewProps> = ({
  pei,
  onAddPostIt,
  onDeletePostIt,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autor, setAutor] = useState(pei.cabecalho.docente_regente || '');
  const [papel, setPapel] = useState<PostItPainel['papel']>('Regente');
  const [categoria, setCategoria] = useState<PostItPainel['categoria']>('objetivos');
  const [conteudo, setConteudo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conteudo.trim() || !autor.trim()) return;

    const novoPostIt: PostItPainel = {
      id: `N${Date.now()}`,
      autor: autor.trim(),
      papel,
      categoria,
      conteudo: conteudo.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
      cor: 'green',
    };

    onAddPostIt(novoPostIt);
    setConteudo('');
    setIsModalOpen(false);
  };

  const columns: {
    key: PostItPainel['categoria'];
    title: string;
  }[] = [
    { key: 'objetivos', title: 'Metas e Avanços' },
    { key: 'avaliacao', title: 'Avaliação e Provas' },
    { key: 'rotina', title: 'Rotina e Laboratório' },
    { key: 'recursos_ta', title: 'Tecnologia Assistiva' },
    { key: 'apoio', title: 'Apoio e Parcerias' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Metas e Notas de Acompanhamento
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registre observações rápidas sobre o desenvolvimento de {pei.cabecalho.estudante}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Anotação</span>
        </button>
      </div>

      {/* Resumo de Evolução e Parecer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Indicadores do Período</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Metas Alcançadas</span>
                <span className="font-mono font-bold text-emerald-700">
                  {pei.metricas.percentual_metas_alcancadas}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${pei.metricas.percentual_metas_alcancadas}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Autonomia nas Atividades</span>
                <span className="font-mono font-bold text-slate-800">
                  {pei.metricas.nivel_autonomia} / 5
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${(pei.metricas.nivel_autonomia / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Participação e Engajamento</span>
                <span className="font-mono font-bold text-slate-800">
                  {pei.metricas.engajamento} / 5
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(pei.metricas.engajamento / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Parecer Pedagógico e Recomendações
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {pei.parecer_pedagogico}
          </p>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              Sugestões para as Próximas Semanas:
            </span>
            <ul className="space-y-1.5">
              {pei.sugestoes_proximo_ciclo.map((sug, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quadro de Notas Limpo */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const notes = pei.painel_notas.filter((n) => n.categoria === col.key);
          return (
            <div
              key={col.key}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col min-h-[260px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {col.title}
                </h4>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {notes.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 relative group flex flex-col justify-between"
                  >
                    <button
                      onClick={() => onDeletePostIt(note.id)}
                      className="opacity-0 group-hover:opacity-100 absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-opacity cursor-pointer"
                      title="Remover anotação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-xs text-slate-800 leading-relaxed pr-5 mb-3">
                      {note.conteudo}
                    </p>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700 truncate">
                        {note.autor} ({note.papel})
                      </span>
                      <span className="font-mono shrink-0">{note.data}</span>
                    </div>
                  </div>
                ))}

                {notes.length === 0 && (
                  <div className="h-32 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                    Sem anotações
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Nova Anotação (Digitação Tradicional) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Nova Anotação do Professor / Equipe
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Função
                  </label>
                  <select
                    value={papel}
                    onChange={(e) => setPapel(e.target.value as PostItPainel['papel'])}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="Regente">Professor(a) da Disciplina</option>
                    <option value="AEE">Equipe NAPNE / AEE</option>
                    <option value="Coordenacao">Coordenação de Curso</option>
                    <option value="Familia">Estudante / Família</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coluna do Painel
                </label>
                <select
                  value={categoria}
                  onChange={(e) =>
                    setCategoria(e.target.value as PostItPainel['categoria'])
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="objetivos">Metas e Avanços</option>
                  <option value="avaliacao">Avaliação e Provas</option>
                  <option value="rotina">Rotina e Laboratório</option>
                  <option value="recursos_ta">Tecnologia Assistiva</option>
                  <option value="apoio">Apoio e Parcerias</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Observação
                </label>
                <textarea
                  required
                  rows={4}
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  placeholder="Digite sua observação sobre o acompanhamento do estudante..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Salvar Anotação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
