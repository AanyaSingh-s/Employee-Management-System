const styles = {
  error: 'border-red-100 bg-red-50 text-red-700',
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
};

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`mb-6 flex items-center justify-between border px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${styles[type]}`}>
      <div className="flex items-center gap-3">
        <i className={`ti ${type === 'error' ? 'ti-alert-circle' : 'ti-circle-check'}`}></i>
        <span>{message}</span>
      </div>
      {onClose && (
        <button type="button" className="ml-4 text-lg opacity-40 hover:opacity-100 transition-opacity" onClick={onClose}>
          <i className="ti ti-x"></i>
        </button>
      )}
    </div>
  );
}
