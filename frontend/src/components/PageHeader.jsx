import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../lib/auth';

export default function PageHeader({ title, subtitle, action }) {
  const navigate = useNavigate();
  const user = getUser();
  const username = user?.username || 'Guest';
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#E9ECEF] bg-white px-10">
      <div>
        <h1 className="font-serif text-2xl text-[#1B1B1E]">{title}</h1>
        {subtitle && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#1B1B1E]/40">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-8">
        {action}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-[#1B1B1E]">{username}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#1B1B1E]/50">
              Member
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center bg-[#E9ECEF] font-serif text-lg text-[#1B1B1E]">
            {initial}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[9px] font-bold uppercase tracking-widest text-[#1B1B1E]/40 hover:text-[#0B2545] transition-colors"
            title="Logout"
          >
            <i className="ti ti-logout text-base"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
