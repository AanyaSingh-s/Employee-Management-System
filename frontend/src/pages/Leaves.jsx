import { useCallback, useEffect, useState } from 'react';
import { leaveApi, employeeApi } from '../api/services';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import {
  badgeClass,
  btnDanger,
  btnPrimary,
  btnSecondary,
  btnSuccess,
  formActionsClass,
  formGridClass,
  inputClass,
  labelClass,
  statusBadge,
  tableClass,
  tableWrap,
  tdClass,
  thClass,
  toolbarClass,
} from '../lib/ui';

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

const emptyForm = {
  startDate: '',
  endDate: '',
  reason: '',
  employeeId: '',
};

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [leaveData, empData] = await Promise.all([
        statusFilter ? leaveApi.getByStatus(statusFilter) : leaveApi.getAll(),
        employeeApi.getApproved(),
      ]);
      setLeaves(leaveData);
      setEmployees(empData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (leave) => {
    setEditing(leave);
    setForm({
      startDate: leave.startDate || '',
      endDate: leave.endDate || '',
      reason: leave.reason || '',
      employeeId: leave.employee?.id || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
      status: 'PENDING',
      employee: { id: Number(form.employeeId) },
    };

    try {
      if (editing) {
        await leaveApi.update(editing.id, payload);
        setSuccess('Leave request updated.');
      } else {
        await leaveApi.create(payload);
        setSuccess('Leave request submitted for admin approval.');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await leaveApi.delete(id);
      setSuccess('Request deleted.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHeader
        title="Leave Management"
        subtitle="Track and authorize employee time-off"
      />

      <div className="p-10 space-y-10">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <div className={toolbarClass}>
           <div className="flex-1 flex items-center border border-[#E9ECEF] bg-white focus-within:border-[#0B2545] transition-colors h-14">
            <div className="px-5 text-[#1B1B1E]/30 border-r border-[#E9ECEF] h-full flex items-center">
              <i className="ti ti-filter text-lg"></i>
            </div>
             <select
              className="flex-1 h-full px-5 text-[11px] font-bold tracking-widest uppercase outline-none bg-transparent cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter: All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="button" className={btnPrimary} onClick={openCreate}>
            New Request
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
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
                    <td colSpan="6" className={`${tdClass} py-20 text-center text-[#1B1B1E]/40 font-bold uppercase tracking-widest text-[10px]`}>
                      No pending requests found
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className={`${tdClass} tabular-nums text-[#1B1B1E]/40 font-medium`}>#{leave.id}</td>
                      <td className={tdClass}>
                        <div className="font-bold text-[#1B1B1E]">{leave.employee?.name || '—'}</div>
                      </td>
                      <td className={tdClass}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#1B1B1E]/60">
                          {leave.startDate} <span className="mx-1 opacity-30">→</span> {leave.endDate}
                        </div>
                      </td>
                      <td className={`${tdClass} max-w-[200px] truncate italic text-[#1B1B1E]/50`}>{leave.reason}</td>
                      <td className={tdClass}>
                         <span className={`px-3 py-1 text-[8px] font-extrabold uppercase tracking-[0.15em] border ${
                           leave.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                           leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                           'bg-red-50 text-red-600 border-red-200'
                         }`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className={`${tdClass} text-right`}>
                        <div className="flex justify-end gap-4">
                          <button type="button" className="text-[#0B2545] font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4" onClick={() => openEdit(leave)}>Modify</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && (
          <Modal title={editing ? 'Modify Authorization' : 'Request Time-Off'} onClose={() => setModalOpen(false)}>
            <form className={formGridClass} onSubmit={handleSubmit}>
              <label className={labelClass}>
                Employee
                <select className={inputClass} required value={form.employeeId} onChange={(e) => updateField('employeeId', e.target.value)}>
                  <option value="">Select Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Commencement Date
                <input className={inputClass} type="date" required value={form.startDate} onChange={(e) => updateField('startDate', e.target.value)} />
              </label>
              <label className={labelClass}>
                Conclusion Date
                <input className={inputClass} type="date" required value={form.endDate} onChange={(e) => updateField('endDate', e.target.value)} />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Official Justification
                <textarea className={inputClass} rows="4" required value={form.reason} onChange={(e) => updateField('reason', e.target.value)} />
              </label>
              <div className={formActionsClass}>
                <button type="button" className={btnSecondary} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className={btnPrimary}>{editing ? 'Update Record' : 'Submit Request'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
