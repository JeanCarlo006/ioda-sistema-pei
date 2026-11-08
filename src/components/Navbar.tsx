import React, { useState } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  LayoutDashboard,
  UserPlus,
  Sparkles,
  Compass,
  ShieldCheck,
  Shield,
  Settings,
  Eye,
  Type,
  Sun,
  Moon,
  X,
  Building2,
  Bell,
  HelpCircle,
  User,
  GraduationCap,
} from 'lucide-react';
import { EscalaFonte, ModoContraste } from '../types/pei';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddStudent: () => void;
  onOpenSolutionBank: () => void;
  onOpenCampusStats: () => void;
  onPrint: () => void;
  escalaFonte: EscalaFonte;
  onMudarFonte: (escala: EscalaFonte) => void;
  modoContraste: ModoContraste;
  onMudarContraste: (modo: ModoContraste) => void;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  onOpenPpcAnalyzer: () => void;
  onOpenSusResearch: () => void;
  onResetToDefault?: () => void;
  onOpenOnboardingTour?: () => void;
  onOpenAiConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddStudent,
  onOpenCampusStats,
  onPrint,
  escalaFonte,
  onMudarFonte,
  modoContraste,
  onMudarContraste,
  isPresentationMode,
  onTogglePresentationMode,
  onOpenOnboardingTour,
  onOpenAiConfig,
}) => {
  const [showSupportMenu, setShowSupportMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'hub', label: 'Diários & Turmas (2026/1)', icon: Building2 },
    { id: 'pei', label: 'Plano de Ensino (PEI)', icon: FileText },
    { id: 'estudo_caso', label: 'Estudo de Caso & Gatilhos', icon: Search },
    { id: 'painel', label: 'Metas DUA & Acompanhamento', icon: LayoutDashboard },
    { id: 'documento_oficial', label: 'Documento Oficial SEI', icon: BookOpen },
    { id: 'normas', label: 'Base Normativa (14 Cadernos MEC)', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-30 shadow-md no-print font-sans">
      {/* 1. BARRA SUPERIOR INSTITUCIONAL SUAP (VERDE OFICIAL #006633) */}
      <div className="bg-[#006633] text-white border-b border-[#005026]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
            {/* Lado Esquerdo: Logo e Identidade do SUAP */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('hub')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
              >
                {/* Logo SUAP estilizado */}
                <div className="flex items-center bg-white text-[#006633] font-black text-base px-2.5 py-1 rounded shadow-inner tracking-wider">
                  <span>SUAP</span>
                  <span className="w-2 h-2 rounded-full bg-[#006633] ml-1"></span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-black tracking-tight leading-tight text-white uppercase">
                    IFTO · Instituto Federal do Tocantins
                  </span>
                  <span className="text-[10px] text-emerald-200 leading-tight">
                    Campus Paraíso do Tocantins · Módulo NAPNE / PEI
                  </span>
                </div>
              </button>
            </div>

            {/* Centro: Barra de Busca Rápida do SUAP */}
            <div className="hidden md:flex flex-1 max-w-md mx-2">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-emerald-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar diários, turmas, alunos, PPC no SUAP..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#005026] text-white placeholder-emerald-300/70 border border-[#007a3d] rounded text-xs focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
            </div>

            {/* Lado Direito: Perfil do Professor Autenticado & Ações */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Botão de Configuração de IA (Gemini / IFTO Local) */}
              {onOpenAiConfig && (
                <button
                  type="button"
                  onClick={onOpenAiConfig}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#005026] hover:bg-[#00401e] border border-[#007a3d] rounded text-xs font-bold text-white transition-colors cursor-pointer"
                  title="Configurar Inteligência Artificial (Google Gemini / Servidor Local IFTO)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Configurar IA</span>
                </button>
              )}

              {/* Botão de Modo Apresentação LGPD */}
              <button
                type="button"
                onClick={onTogglePresentationMode}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                  isPresentationMode
                    ? 'bg-blue-900 border-blue-400 text-white'
                    : 'bg-[#005026] hover:bg-[#00401e] border-[#007a3d] text-emerald-100'
                }`}
                title="Modo Apresentação (LGPD): Oculta dados nominais de alunos para bancas e apresentações"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden lg:inline">{isPresentationMode ? 'LGPD Ativo' : 'LGPD'}</span>
              </button>

              {/* Menu de Acessibilidade */}
              <button
                type="button"
                onClick={() => setShowSupportMenu(!showSupportMenu)}
                className="p-1.5 bg-[#005026] hover:bg-[#00401e] border border-[#007a3d] rounded text-white cursor-pointer"
                title="Acessibilidade e Ajustes de Visualização"
              >
                <Type className="w-3.5 h-3.5" />
              </button>

              {/* Dados do Usuário Docente */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#005026]">
                <div className="w-7 h-7 rounded-full bg-emerald-800 border border-emerald-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white leading-tight">
                    Docente / NAPNE
                  </span>
                  <span className="text-[9px] text-emerald-200 leading-tight">
                    Servidor · IFTO Campus Paraíso
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TRILHA DE MIGALHAS DE PÃO (BREADCRUMB OFICIAL DO SUAP) */}
      <div className="bg-[#f0f2f5] border-b border-slate-300 px-3 sm:px-6 py-1.5 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto whitespace-nowrap">
            <span className="text-[#006633] font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('hub')}>
              Início
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">Ensino</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">Meus Diários</span>
            <span className="text-slate-400">/</span>
            <span className="text-[#006633] font-bold">Módulo NAPNE · Gestão de PEIs</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
            <span>Ano Letivo: <strong>2026/1</strong></span>
            <span>·</span>
            <span>Portaria MEC nº 421/2026</span>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE ABAS DO MÓDULO (ESTILO SUAP nav-tabs) */}
      <nav className="bg-white border-b border-slate-300 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#006633] text-[#006633] bg-emerald-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#006633]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Painel Flutuante de Acessibilidade */}
      {showSupportMenu && (
        <div className="absolute right-4 top-16 z-50 w-72 bg-white rounded-lg shadow-xl border border-slate-300 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold text-slate-900">Acessibilidade e Visualização</span>
            <button
              onClick={() => setShowSupportMenu(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block">Tamanho da Fonte:</label>
            <div className="grid grid-cols-3 gap-1">
              {(['normal', 'ampliada', 'grande'] as EscalaFonte[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onMudarFonte(f)}
                  className={`py-1 text-xs rounded border cursor-pointer font-bold capitalize ${
                    escalaFonte === f ? 'bg-[#006633] text-white border-[#006633]' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block">Modo de Contraste:</label>
            <div className="grid grid-cols-3 gap-1">
              {(['padrao', 'alto-contraste', 'conforto'] as ModoContraste[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onMudarContraste(c)}
                  className={`py-1 text-[11px] rounded border cursor-pointer font-bold capitalize ${
                    modoContraste === c ? 'bg-[#006633] text-white border-[#006633]' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {c.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
