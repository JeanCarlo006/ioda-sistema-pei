import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';

interface CuradoriaDocenteBannerProps {
  variant?: 'compact' | 'default';
  showLgpdBadge?: boolean;
}

export const CuradoriaDocenteBanner: React.FC<CuradoriaDocenteBannerProps> = ({
  variant = 'default',
  showLgpdBadge = true,
}) => {
  return (
    <div
      role="region"
      aria-label="Aviso Institucional de Curadoria Docente"
      className={`rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 via-amber-50/60 to-emerald-50/60 text-slate-800 shadow-2xs no-print ${
        variant === 'compact' ? 'px-3.5 py-2.5' : 'px-4 py-3.5 sm:px-5'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
              Curadoria Docente & Equipe Pedagógica (Human-in-the-Loop)
            </span>
            <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-medium italic">
              &ldquo;O Agente Ioda é uma ferramenta de auxílio pedagógico para redução da sobrecarga burocrática. Ele{' '}
              <strong className="font-extrabold text-amber-950 not-italic">NÃO substitui o professor</strong>. Todas as sugestões geradas devem ser revisadas, editadas e validadas pelo docente e pela equipe pedagógica.&rdquo;
            </p>
          </div>
        </div>

        {showLgpdBadge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-emerald-200 text-[11px] font-bold text-emerald-900 shrink-0 self-start sm:self-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>LGPD · Decreto 12.686/2025</span>
          </div>
        )}
      </div>
    </div>
  );
};
