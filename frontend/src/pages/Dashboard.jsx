import { useEffect, useState } from 'react';
import { homeApi, employeeApi, managerApi, adminApi, leaveApi, dutyApi } from '../api/services';
import PageHeader from '../components/PageHeader';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { pageClass } from '../lib/ui';

export default function Dashboard() {
  const [info, setInfo] = useState(null);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [home, employees, managers, admins, leaves, duties] = await Promise.all([
          homeApi.getInfo(),
          employeeApi.getAll(),
          managerApi.getAll(),
          adminApi.getAll(),
          leaveApi.getAll(),
          dutyApi.getAll(),
        ]);
        setInfo(home);
        setCounts({
          employees: employees.length,
          managers: managers.length,
          admins: admins.length,
          leaves: leaves.length,
          duties: duties.length,
        });
      } catch (err) {
        setError(err.message || 'Could not connect to backend.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading label="Initializing System..." />;

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHeader
        title="Workforce Dashboard"
        subtitle={info?.application || 'Centralized Management System'}
      />
      
      <div className="p-10 space-y-10">
        <Alert type="error" message={error} onClose={() => setError('')} />

        {!error && (
          <>
            <section className="grid grid-cols-4 border border-[#E9ECEF] bg-white divide-x divide-[#E9ECEF]">
              <div className="p-8 flex flex-col justify-between h-48">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#1B1B1E]/40 font-bold mb-2">Total Workforce</p>
                  <p className="font-sans text-6xl font-extralight text-[#1B1B1E] tracking-tighter">
                    {counts.employees ?? 0}
                    <span className="text-[#0B2545]/20 ml-1 text-3xl font-normal">+</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <i className="ti ti-arrow-up-right text-sm"></i>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Growth Trend Stable</span>
                </div>
              </div>

              <div className="p-8 flex flex-col justify-between bg-[#F8F9FA] h-48">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#1B1B1E]/40 font-bold mb-2">Active Managers</p>
                  <p className="font-sans text-6xl font-extralight text-[#1B1B1E] tracking-tighter">
                    {counts.managers ?? 0}
                  </p>
                </div>
                <div className="text-[#1B1B1E]/30 text-[9px] uppercase tracking-[0.25em] font-bold">Global Operations</div>
              </div>

              <div className="p-8 flex flex-col justify-between h-48">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#1B1B1E]/40 font-bold mb-2">Open Roles</p>
                  <p className="font-sans text-6xl font-extralight text-[#1B1B1E] tracking-tighter">04</p>
                </div>
                <button className="text-[#0B2545] text-left text-[10px] font-bold uppercase tracking-widest underline decoration-1 underline-offset-4 hover:text-[#133C55] transition-colors">
                  Post New Opening
                </button>
              </div>

              <div className="relative overflow-hidden h-48 bg-[#E9ECEF]">
                <img 
                  src="https://images.pexels.com/photos/5511086/pexels-photo-5511086.jpeg?auto=compress&cs=tinysrgb&w=600&q=80" 
                  alt="Office" 
                  className="w-full h-full object-cover grayscale opacity-80" 
                />
                <div className="absolute inset-0 bg-[#0B2545]/5"></div>
              </div>
            </section>

            <section className="border border-[#E9ECEF] bg-white p-10">
              <h3 className="font-serif text-xl text-[#0B2545] mb-6">System & API Diagnostics</h3>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-[#1B1B1E]/40 mb-2">Application Status</span>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      {info?.status || 'CONNECTED'}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-[#1B1B1E]/40 mb-2">Service Endpoints</span>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {info?.endpoints && Object.keys(info.endpoints).map(name => (
                        <span key={name} className="px-3 py-1 bg-[#F8F9FA] border border-[#E9ECEF] text-[9px] font-bold text-[#0B2545] uppercase tracking-widest">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-l border-[#E9ECEF] pl-10">
                  <p className="text-sm text-[#1B1B1E]/60 leading-relaxed italic">
                    "The centralized management system is operating within optimal parameters. All regional nodes report stable connectivity and data synchronization."
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
