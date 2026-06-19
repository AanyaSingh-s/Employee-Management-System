import { useCallback, useEffect, useState } from 'react';
import { approvalApi } from '../api/services';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import { tableClass, tableWrap, tdClass, thClass } from '../lib/ui';

function StatusBadge({ status }) {
  const styles =
    status === 'PENDING'
      ? 'bg-amber-50 text-amber-600 border-amber-200'
      : status === 'APPROVED'
        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
        : 'bg-red-50 text-red-600 border-red-200';

  return (
    <span className={`px-3 py-1 text-[8px] font-extrabold uppercase tracking-[0.15em] border ${styles}`}>
      {status}
    </span>
  );
}

export default function AdminApprovals() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [empData, leaveData] = await Promise.all([
        approvalApi.getPendingEmployees(),
        approvalApi.getPendingLeaves(),
      ]);
      setEmployees(empData);
      setLeaves(leaveData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEmployeeAction = async (id, action) => {
    setError('');
    setSuccess('');
    try {
      if (action === 'approve') {
        await approvalApi.approveEmployee(id);
        setSuccess(`Employee #${id} approved.`);
      } else {
        await approvalApi.rejectEmployee(id);
        setSuccess(`Employee #${id} rejected.`);
      }
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLeaveAction = async (id, action) => {
    setError('');
    setSuccess('');
    try {
      if (action === 'approve') {
        await approvalApi.approveLeave(id);
        setSuccess(`Leave #${id} approved.`);
      } else {
        await approvalApi.rejectLeave(id);
        setSuccess(`Leave #${id} rejected.`);
      }
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHeader
        title="Pending Approvals"
        subtitle="Review employee additions and leave requests"
      />

      <div className="p-10 space-y-10">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        {loading ? (
          <Loading />
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B2545]">
                Employee Additions ({employees.length})
              </h2>
              <div className={tableWrap}>
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>ID</th>
                      <th className={thClass}>Name</th>
                      <th className={thClass}>Department</th>
                      <th className={thClass}>Designation</th>
                      <th className={thClass}>Status</th>
                      <th className={`${thClass} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9ECEF]">
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan="6" className={`${tdClass} py-12 text-center text-[#1B1B1E]/40 font-bold uppercase tracking-widest text-[10px]`}>
                          No pending employee requests
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-[#F8F9FA] transition-colors">
                          <td className={`${tdClass} tabular-nums text-[#1B1B1E]/40 font-medium`}>#{emp.id}</td>
                          <td className={`${tdClass} font-bold text-[#1B1B1E]`}>{emp.name}</td>
                          <td className={tdClass}>{emp.department}</td>
                          <td className={`${tdClass} text-[#1B1B1E]/60`}>{emp.designation}</td>
                          <td className={tdClass}><StatusBadge status={emp.approvalStatus} /></td>
                          <td className={`${tdClass} text-right`}>
                            <div className="flex justify-end gap-4">
                              <button
                                type="button"
                                className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4"
                                onClick={() => handleEmployeeAction(emp.id, 'approve')}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4"
                                onClick={() => handleEmployeeAction(emp.id, 'reject')}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B2545]">
                Leave Requests ({leaves.length})
              </h2>
              <div className={tableWrap}>
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>ID</th>
                      <th className={thClass}>Employee</th>
                      <th className={thClass}>Duration</th>
                      <th className={thClass}>Reason</th>
                      <th className={thClass}>Status</th>
                      <th className={`${thClass} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9ECEF]">
                    {leaves.length === 0 ? (
                      <tr>
                        <td colSpan="6" className={`${tdClass} py-12 text-center text-[#1B1B1E]/40 font-bold uppercase tracking-widest text-[10px]`}>
                          No pending leave requests
                        </td>
                      </tr>
                    ) : (
                      leaves.map((leave) => (
                        <tr key={leave.id} className="hover:bg-[#F8F9FA] transition-colors">
                          <td className={`${tdClass} tabular-nums text-[#1B1B1E]/40 font-medium`}>#{leave.id}</td>
                          <td className={`${tdClass} font-bold text-[#1B1B1E]`}>{leave.employee?.name || '—'}</td>
                          <td className={tdClass}>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1B1B1E]/60">
                              {leave.startDate} <span className="mx-1 opacity-30">→</span> {leave.endDate}
                            </div>
                          </td>
                          <td className={`${tdClass} max-w-[200px] truncate italic text-[#1B1B1E]/50`}>{leave.reason}</td>
                          <td className={tdClass}><StatusBadge status={leave.status} /></td>
                          <td className={`${tdClass} text-right`}>
                            <div className="flex justify-end gap-4">
                              <button
                                type="button"
                                className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4"
                                onClick={() => handleLeaveAction(leave.id, 'approve')}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4"
                                onClick={() => handleLeaveAction(leave.id, 'reject')}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
