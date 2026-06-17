// Penman Redesign Tokens
export const inputClass =
  'w-full border border-[#E9ECEF] bg-white px-5 h-14 text-xs font-bold tracking-widest uppercase outline-none placeholder:text-[#1B1B1E]/20 focus:border-[#0B2545] transition-colors';

export const labelClass = 'block text-[9px] uppercase tracking-[0.25em] text-[#1B1B1E]/40 font-bold mb-2';

export const btnBase =
  'inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all active:scale-[0.98] cursor-pointer';

export const btnPrimary = `${btnBase} bg-[#0B2545] text-white px-10 h-14 text-[11px] hover:bg-[#133C55]`;

export const btnSecondary = `${btnBase} border border-[#E9ECEF] bg-white text-[#0B2545] px-10 h-14 text-[11px] hover:bg-[#F8F9FA]`;

export const btnSuccess = `${btnBase} bg-emerald-600 text-white px-10 h-14 text-[11px] hover:bg-emerald-500`;

export const btnDanger = `${btnBase} bg-red-600 text-white px-10 h-14 text-[11px] hover:bg-red-500`;

export const btnSm = 'px-4 py-2 h-auto text-[10px]';

export const tableWrap =
  'border border-[#E9ECEF] bg-white shadow-sm overflow-hidden';

export const tableClass = 'w-full text-left border-collapse';

export const thClass =
  'px-8 py-5 text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#1B1B1E] bg-white border-b border-[#E9ECEF]';

export const tdClass = 'px-8 py-5 border-t border-[#E9ECEF] text-sm';

export const badgeClass =
  'inline-block px-3 py-1 bg-[#0B2545] text-[#A5B4FC] text-[8px] font-extrabold uppercase tracking-[0.15em] border border-[#A5B4FC]/20';

export const statusBadge = {
  PENDING: 'bg-amber-500/10 text-amber-600 border-amber-600/20',
  APPROVED: 'bg-emerald-500/10 text-emerald-600 border-emerald-600/20',
  REJECTED: 'bg-red-500/10 text-red-600 border-red-600/20',
};

export const cardBorder = {
  blue: 'border-l-[#0B2545]',
  violet: 'border-l-[#133C55]',
  amber: 'border-l-[#F59E0B]',
  green: 'border-l-emerald-600',
  rose: 'border-l-rose-600',
};

export const pageClass = 'space-y-10';

export const toolbarClass = 'flex flex-wrap gap-4 items-center mb-6';

export const formGridClass = 'grid grid-cols-1 gap-6 sm:grid-cols-2';

export const formActionsClass = 'col-span-full flex justify-end gap-4 pt-6';
