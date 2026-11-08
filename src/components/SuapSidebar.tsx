import React from 'react';
import {
  Home,
  FileText,
  GraduationCap,
  Search,
  Share2,
  Monitor,
  Headphones,
  UserCheck,
  MessageSquare,
  Building,
  LogOut,
  Bell,
  ChevronDown,
  Layers,
  BookOpen,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

interface SuapSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenAiConfig?: () => void;
}

export const SuapSidebar: React.FC<SuapSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenAiConfig,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#121417] border-r border-[#22262b] flex flex-col font-sans transition-transform duration-200 lg:static lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* 1. Header do Sidebar: Logo SUAP + Notificações */}
      <div className="p-4 flex items-center justify-between border-b border-[#1f2328]">
        <div className="flex items-center gap-2">
          {/* Logo suap em minúsculo ciano */}
          <span className="text-[#00d284] text-2xl font-black tracking-tight lowercase select-none">
            suap
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1d21] transition-colors cursor-pointer"
            title="Notificações do SUAP"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-[#00d284] text-[#121417] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              17
            </span>
          </button>
        </div>
      </div>

      {/* 2. Usuário Autenticado no SUAP: Jean Oliveira */}
      <div className="px-3 py-3 border-b border-[#1f2328]">
        <div className="bg-[#1c1f24] hover:bg-[#23272d] border border-[#282d34] rounded-lg p-2 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#2a2f36] border border-[#373d47] flex items-center justify-center text-slate-300 font-bold text-xs shrink-0">
              JO
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">Jean Oliveira</div>
              <div className="text-[10px] text-slate-400 truncate">Matrícula: 202510630025</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Campo de Busca de Menu (Buscar menu) */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar menu"
            className="w-full pl-8 pr-3 py-1.5 bg-[#171a1e] border border-[#242930] rounded-md text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-[#00d284] transition-colors"
          />
        </div>
      </div>

      {/* 4. Lista de Menus do SUAP */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 text-xs text-slate-300">
        {/* Início */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('hub');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-left cursor-pointer ${
            activeTab === 'hub'
              ? 'bg-[#1b2026] text-white font-semibold border-r-2 border-[#00d284]'
              : 'hover:bg-[#181b20] hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Início</span>
        </button>

        {/* Documentos/Processos */}
        <div className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[#181b20] hover:text-white transition-colors cursor-pointer text-slate-400">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Documentos/Processos</span>
        </div>

        {/* Menu Ensino (Expandido - Módulo Ativo) */}
        <div className="space-y-0.5 pt-1">
          <div className="w-full flex items-center justify-between px-3 py-2 text-[#00d284] font-bold text-xs select-none">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#00d284] shrink-0" />
              <span>Ensino</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#00d284]" />
          </div>

          {/* Submenus Oficiais do Ensino */}
          <div className="pl-6 space-y-0.5 text-[11px] text-slate-400 border-l border-[#20252c] ml-4 my-1">
            <div className="px-2.5 py-1.5 hover:text-white hover:bg-[#181b20] rounded cursor-pointer">
              Dados do Aluno (202510630025)
            </div>
            <div className="px-2.5 py-1.5 hover:text-white hover:bg-[#181b20] rounded cursor-pointer">
              Minhas disciplinas
            </div>
            <div className="px-2.5 py-1.5 hover:text-white hover:bg-[#181b20] rounded cursor-pointer">
              Boletins & Avaliações
            </div>

            {/* Módulo Especial: Gestão de PEI / NAPNE */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('hub');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-left cursor-pointer ${
                activeTab === 'hub' || activeTab === 'pei' || activeTab === 'estudo_caso' || activeTab === 'painel' || activeTab === 'documento_oficial'
                  ? 'bg-[#162a22] text-[#00d284] font-bold border-r-2 border-[#00d284]'
                  : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-[#181b20]'
              }`}
            >
              <span>Módulo NAPNE · Gestão PEI</span>
              <span className="text-[9px] bg-[#00d284]/20 text-[#00d284] px-1.5 py-0.2 rounded font-black">
                NOVO
              </span>
            </button>

            {/* Base Normativa 14 Cadernos MEC */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('normas');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-left cursor-pointer ${
                activeTab === 'normas'
                  ? 'bg-[#162a22] text-[#00d284] font-bold border-r-2 border-[#00d284]'
                  : 'hover:text-white hover:bg-[#181b20]'
              }`}
            >
              <span>14 Cadernos MEC (RAG)</span>
            </button>
          </div>
        </div>

        {/* Demais menus institucionais do SUAP */}
        <div className="pt-1 space-y-0.5 text-slate-400">
          <div className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#181b20] hover:text-white rounded cursor-pointer">
            <Search className="w-4 h-4 shrink-0" />
            <span>Pesquisa</span>
          </div>
          <div className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#181b20] hover:text-white rounded cursor-pointer">
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Extensão</span>
          </div>
          <div className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#181b20] hover:text-white rounded cursor-pointer">
            <Monitor className="w-4 h-4 shrink-0" />
            <span>Tec. da Informação</span>
          </div>
          <div className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#181b20] hover:text-white rounded cursor-pointer">
            <Headphones className="w-4 h-4 shrink-0" />
            <span>Central de Serviços</span>
          </div>
          <div className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#181b20] hover:text-white rounded cursor-pointer">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Atividades Estudantis</span>
          </div>
          <div className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#181b20] hover:text-white rounded cursor-pointer">
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Comunicação Social</span>
          </div>
          <div className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#181b20] hover:text-white rounded cursor-pointer">
            <Building className="w-4 h-4 shrink-0" />
            <span>Des. Institucional</span>
          </div>
        </div>
      </nav>

      {/* 5. Rodapé do Sidebar: Configuração IA & Botão Sair */}
      <div className="p-3 border-t border-[#1f2328] space-y-1">
        {onOpenAiConfig && (
          <button
            type="button"
            onClick={onOpenAiConfig}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-[#1a1d22] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Configurar IA (Gemini / DUA)</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-[#1a1d22] rounded cursor-pointer transition-colors">
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair</span>
        </div>
      </div>
    </aside>
  );
};
