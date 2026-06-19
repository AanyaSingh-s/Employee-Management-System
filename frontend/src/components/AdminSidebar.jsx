import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 flex-col border-r border-[#E9ECEF] bg-[#1B1B1E] md:sticky md:top-0 md:h-screen md:w-64 flex">
      <div className="p-8 pb-14">
        <div className="flex items-center gap-4 text-white">
          <div className="flex h-11 w-11 items-center justify-center bg-white shadow-[4px_4px_0px_#0B2545]">
            <i className="ti ti-shield-lock text-xl text-[#0B2545]"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl leading-none tracking-tight">EMS</span>
            <span className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.4em] text-white/40">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        <div className="relative">
          <NavLink
            to="/admin/approvals"
            className={({ isActive }) =>
              `group flex items-center gap-4 px-8 py-4 transition-colors ${
                isActive ? 'bg-[#E9ECEF] text-[#1B1B1E]' : 'text-white/60 hover:bg-[#E9ECEF] hover:text-[#1B1B1E]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-[#0B2545]" />
                )}
                <i className="ti ti-checkbox text-lg" />
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  Pending Approvals
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
