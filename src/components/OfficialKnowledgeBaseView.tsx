import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import {
  BookOpen,
  Search,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface KnowledgeDoc {
  id: string;
  categoria: string;
  titulo: string;
  conteudo: string;
  tags?: string[] | string;
}

export const OfficialKnowledgeBaseView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadDocs() {
      setIsLoading(true);
      try {
        const results = await apiService.searchKnowledgeBase(query);
        setDocs(results);
        if (results.length > 0 && !selectedDoc) {
          setSelectedDoc(results[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar documentos da base RAG:', err);
      } finally {
        setIsLoading(false);
      }
    }
    const timer = setTimeout(loadDocs, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Cabeçalho Oficial SUAP */}
      <div className="bg-white border border-slate-300 rounded p-4 sm:p-5 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#006633] text-white flex items-center justify-center font-bold text-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Base Normativa Institucional & RAG do Agente Ioda
              </h2>
              <p className="text-xs text-slate-500">
                14 Cadernos Pedagógicos da PNEEII/MEC, Resolução CONSUP/IFTO nº 48/2021 e Diretrizes DUA 3.0 (CAST 2024)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Consultado em tempo real pela IA</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Esta base de conhecimento está persistida no banco SQLite institucional (`knowledge_base_docs`).
          Ao elaborar um PEI, o Agente Ioda consulta esses documentos oficiais automaticamente para embasar cada meta,
          estratégia DUA e critério avaliativo, eliminando alucinações e garantindo total conformidade legal com o MEC e o IFTO.
        </p>
      </div>

      {/* Barra de Pesquisa RAG */}
      <div className="bg-white border border-slate-300 rounded p-3 shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar nos 14 cadernos do MEC, normas do IFTO ou diretrizes DUA... (ex: autismo, tempo estendido, sem laudo)"
          className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Grid de Documentos e Conteúdo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lista de Documentos */}
        <div className="bg-white border border-slate-300 rounded divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-xs text-slate-500">
              Consultando base de documentos...
            </div>
          )}

          {!isLoading && docs.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              Nenhum documento encontrado para a busca "{query}".
            </div>
          )}

          {docs.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-3 text-xs transition-colors cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-emerald-50/80 border-l-4 border-l-[#006633]'
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {doc.categoria.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                    RAG
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug">
                  {doc.titulo}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Detalhes do Documento Selecionado */}
        <div className="md:col-span-2 bg-white border border-slate-300 rounded p-5 shadow-2xs space-y-4">
          {selectedDoc ? (
            <div className="space-y-3">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {selectedDoc.categoria.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {selectedDoc.titulo}
                </h3>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-4 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedDoc.conteudo}
              </div>

              {selectedDoc.tags && (
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Tags indexadas no RAG:</span>
                  {(Array.isArray(selectedDoc.tags) ? selectedDoc.tags : JSON.parse(selectedDoc.tags || '[]')).map(
                    (tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Selecione um documento oficial à esquerda para visualizar suas diretrizes pedagógicas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
