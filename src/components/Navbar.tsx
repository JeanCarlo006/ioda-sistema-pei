import React, { useState } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  LayoutDashboard,
  UserPlus,
  Wrench,
  Printer,
  Type,
  Sun,
  Moon,
  Eye,
  Home,
  Settings,
  BarChart3,
  X,
  Shield,
  ShieldCheck,
  FileCode,
  Award,
  RotateCcw,
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
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddStudent,
  onOpenSolutionBank,
  onOpenCampusStats,
  onPrint,
  escalaFonte,
  onMudarFonte,
  modoContraste,
  onMudarContraste,
  isPresentationMode,
  onTogglePresentationMode,
  onOpenPpcAnalyzer,
  onOpenSusResearch,
  onResetToDefault,
}) => {
  const [showSupportMenu, setShowSupportMenu] = useState(false);

  const navItems = [
    { id: 'hub', label: 'Início', icon: Home },
    { id: 'pei', label: 'Plano de Aula (PEI)', icon: FileText },
    { id: 'estudo_caso', label: 'Estudo de Caso', icon: Search },
    { id: 'painel', label: 'Metas e Notas', icon: LayoutDashboard },
    { id: 'documento_oficial', label: 'Imprimir p/ SEI', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <button
            type="button"
            onClick={() => setActiveTab('hub')}
            className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-2xs group-hover:bg-emerald-800 transition-colors">
              PEI
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                Ioda - Sistema de PEI
              </span>
              <span className="text-[11px] font-medium text-emerald-700 leading-tight">
                NAPNE · IFTO Campus Paraíso
              </span>
            </div>
          </button>

          {/* Simple Navigation Labels with Icons + Clear Text */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação Principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Presentation Mode (LGPD / Scientific Fair) Button */}
            <button
              type="button"
              onClick={onTogglePresentationMode}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isPresentationMode
                  ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Modo Apresentação: Oculta nomes e matrículas para proteger dados sensíveis na JICE / CEP"
            >
              {isPresentationMode ? (
                <ShieldCheck className="w-4 h-4 text-blue-300" />
              ) : (
                <Shield className="w-4 h-4 text-slate-500" />
              )}
              <span className="hidden sm:inline">
                {isPresentationMode ? 'LGPD Ativo' : 'Apresentação'}
              </span>
            </button>

            {/* Support & Accessibility Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSupportMenu(!showSupportMenu)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  showSupportMenu
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Opções de Fonte, Contraste, PPC e Pesquisa JICE"
              >
                <Settings className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Opções e Apoio</span>
              </button>

              {showSupportMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">
                      Acessibilidade e Apoio
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSupportMenu(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Recursos de Apoio */}
                  <div className="space-y-1.5">
                    {/* Ementas & PPC TI */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSupportMenu(false);
                        onOpenPpcAnalyzer();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                    >
                      <FileCode className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Analisador de Ementas (PPC TI)
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Cruzar matérias do IFTO com neurodivergências
                        </span>
                      </div>
                    </button>

                    {/* Pesquisa & Google Forms (JICE 2026) */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSupportMenu(false);
                        onOpenSusResearch();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Pesquisa & Forms (JICE 2026)
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Coleta de dados com docentes via Google Forms
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowSupportMenu(false);
                        onOpenSolutionBank();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Guia de Metodologias Práticas
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Passo a passo de aula e avaliação por condição
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowSupportMenu(false);
                        onOpenCampusStats();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Panorama do Campus Paraíso
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Estatísticas oficiais de atendimento do NAPNE
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowSupportMenu(false);
                        onPrint();
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-700 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Imprimir / Salvar PDF
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Gerar documento para processo SEI
                        </span>
                      </div>
                    </button>

                    {onResetToDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSupportMenu(false);
                          onResetToDefault();
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Restaurar Casos Iniciais
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Voltar dados demonstrativos padrão do NAPNE
                          </span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Tamanho da Fonte */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <Type className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Tamanho da Letra:</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'normal', label: 'Normal (A)' },
                        { id: 'ampliada', label: 'Média (A+)' },
                        { id: 'grande', label: 'Grande (A++)' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => onMudarFonte(f.id as EscalaFonte)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            escalaFonte === f.id
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contraste */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Cor de Fundo / Contraste:</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onMudarContraste('padrao')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 cursor-pointer ${
                          modoContraste === 'padrao'
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Sun className="w-3 h-3" />
                        <span>Padrão</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onMudarContraste('conforto')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 cursor-pointer ${
                          modoContraste === 'conforto'
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-amber-50/60 text-amber-900 border-amber-200'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Suave</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onMudarContraste('alto-contraste')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 cursor-pointer ${
                          modoContraste === 'alto-contraste'
                            ? 'bg-slate-950 text-amber-300 border-amber-400'
                            : 'bg-slate-900 text-white border-slate-800'
                        }`}
                      >
                        <Moon className="w-3 h-3" />
                        <span>Escuro</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Novo PEI Button */}
            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Novo PEI</span>
            </button>
          </div>
        </div>

        {/* Mobile Bottom-row Navigation */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
