import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import {
  Sparkles,
  Key,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Cpu,
  RefreshCw,
} from 'lucide-react';

interface AiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiConfigModal: React.FC<AiConfigModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [provider, setProvider] = useState<'gemini' | 'ollama'>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [model, setModel] = useState('gemini-2.5-flash');
  const [ollamaHost, setOllamaHost] = useState('http://localhost:11434');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const cfg = await apiService.getAiConfig();
      setProvider(cfg.provider === 'ollama' ? 'ollama' : 'gemini');
      setHasKey(cfg.hasKey);
      setMaskedKey(cfg.maskedKey || '');
      setModel(cfg.model || 'gemini-2.5-flash');
      setOllamaHost(cfg.ollamaHost || 'http://localhost:11434');
    }
    loadConfig();
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await apiService.saveAiConfig({
        apiKey: apiKey.trim() || undefined,
        provider,
        model,
        ollamaHost,
      });

      setFeedback('Configurações salvas com sucesso!');
      if (apiKey.trim()) {
        setHasKey(true);
        setMaskedKey(`${apiKey.trim().substring(0, 4)}...${apiKey.trim().slice(-4)}`);
        setApiKey('');
      }
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configuração da Inteligência Artificial (Agente Ioda)
              </h3>
              <p className="text-xs text-slate-500">
                Provedor de modelo, chaves de API e integração local do IFTO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Escolha do Provedor de IA */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-800 block">
            Selecione o Provedor da Inteligência Artificial:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opção 1: Google Gemini (Ativa para Validação) */}
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                provider === 'gemini'
                  ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">1. Google Gemini API</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Ativa (Validação)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Utiliza a API do Gemini com higienização prévia LGPD. Ideal para desenvolvimento e testes com a Reitoria.
              </p>
            </button>

            {/* Opção 2: Servidor IFTO (Llama / Ollama Local) */}
            <button
              type="button"
              onClick={() => setProvider('ollama')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                provider === 'ollama'
                  ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">2. Llama / Servidor IFTO</span>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  Futura (Local)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Modelo 100% interno rodando no servidor físico do IFTO (Ollama), sem tráfego de dados para nuvem externa.
              </p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {provider === 'gemini' && (
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chave da API do Google Gemini (GEMINI_API_KEY)</span>
                </label>
                {hasKey ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Chave Ativa: {maskedKey}
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Chave não configurada
                  </span>
                )}
              </div>

              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={hasKey ? 'Digite nova chave para alterar...' : 'Cole aqui sua chave (ex: AIzaSy...)'}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Obtenha sua chave gratuita em:</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {provider === 'ollama' && (
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Server className="w-4 h-4 text-emerald-700" />
                <span>Configuração do Servidor Local do IFTO (Ollama)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Assim que a Reitoria aprovar e conceder acesso ao servidor institucional, aponte a URL do servidor interno onde o Llama 3 estará instalado:
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Host / Endpoint do Ollama no IFTO:
                </label>
                <input
                  type="text"
                  value={ollamaHost}
                  onChange={(e) => setOllamaHost(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* Banner de Proteção LGPD Integrada */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Proteção de Dados Sensíveis (LGPD):</strong> O módulo de higienização do Ioda remove automaticamente nomes de alunos, CPFs, RGs e prontuários médicos antes de qualquer envio para o modelo de IA, em total conformidade com a Lei nº 13.709/2018 e a Portaria MEC nº 421/2026.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
