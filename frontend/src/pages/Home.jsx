import { Link, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import { btnPrimary, btnSecondary } from '../lib/ui';

export default function Home() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B2545] flex flex-col">
      <header className="flex items-center justify-between px-10 py-8">
        <div className="flex items-center gap-4 text-white">
          <div className="flex h-11 w-11 items-center justify-center bg-white shadow-[4px_4px_0px_#133C55]">
            <i className="ti ti-briefcase text-xl text-[#0B2545]"></i>
          </div>
          <span className="font-serif text-2xl tracking-tight">EMS</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className={`${btnSecondary} !h-12 !px-8 !text-[10px]`}>
            Sign In
          </Link>
          <Link to="/signup" className={`${btnPrimary} !h-12 !px-8 !text-[10px]`}>
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
          Employee Management System
        </p>
        <h1 className="font-serif text-5xl text-white md:text-6xl max-w-3xl leading-tight">
          Manage your workforce with clarity and control
        </h1>
        <p className="mt-6 max-w-xl text-sm text-white/60 leading-relaxed">
          Track employees, managers, leaves, and duties from one centralized dashboard.
          Sign in to access your workspace or create a new account to get started.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/login" className={btnPrimary}>
            <i className="ti ti-login mr-2"></i>
            Sign In
          </Link>
          <Link to="/signup" className={`${btnSecondary} !text-[#0B2545]`}>
            <i className="ti ti-user-plus mr-2"></i>
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}
