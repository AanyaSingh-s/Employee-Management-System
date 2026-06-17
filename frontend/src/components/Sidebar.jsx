import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { to: '/employees', label: 'Employees', icon: 'ti-users' },
  { to: '/managers', label: 'Managers', icon: 'ti-briefcase' },
  { to: '/admins', label: 'Admins', icon: 'ti-shield-lock' },
  { to: '/leaves', label: 'Leaves', icon: 'ti-calendar-off' },
  { to: '/duties', label: 'Duties', icon: 'ti-clipboard-list' },
];

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 flex-col border-r border-[#E9ECEF] bg-[#2c4564] md:sticky md:top-0 md:h-screen md:w-64 flex">
      <div className="p-8 pb-14">
        <div className="flex items-center gap-4 text-white">
          <div className="flex h-11 w-11 items-center justify-center bg-white shadow-[4px_4px_0px_#133C55]">
            <i className="ti ti-briefcase text-xl text-[#0B2545]"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl leading-none tracking-tight">EMS</span>
            <span className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.4em] text-white/40">
              
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        <p className="mb-6 px-8 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
          Core Navigation
        </p>

        {navItems.map((item) => (
          <div key={item.to} className="relative">
            <NavLink
              to={item.to}
              end={item.to === '/dashboard'}
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
                  <i className={`ti ${item.icon} text-lg`} />
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </div>
        ))}
      </nav>

    </aside>
  );
}
