export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white shadow-2xl border border-[#E9ECEF] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E9ECEF] px-8 py-6">
          <h2 className="font-serif text-xl text-[#0B2545]">{title}</h2>
          <button
            type="button"
            className="text-2xl text-[#1B1B1E]/30 hover:text-[#0B2545] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="ti ti-x"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </div>
    </div>
  );
}
