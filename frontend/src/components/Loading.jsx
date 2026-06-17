export default function Loading({ label = 'Initializing...' }) {
  return (
    <div className="flex flex-col items-center gap-6 py-24">
      <div className="h-10 w-10 animate-spin border-2 border-[#0B2545]/10 border-t-[#0B2545]" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#0B2545]/40">{label}</p>
    </div>
  );
}
