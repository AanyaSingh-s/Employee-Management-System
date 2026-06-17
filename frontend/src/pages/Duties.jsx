import { useCallback, useEffect, useState } from 'react';
import { dutyApi, employeeApi, managerApi } from '../api/services';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import {
  btnPrimary,
  btnSecondary,
  formActionsClass,
  formGridClass,
  inputClass,
  labelClass,
  tableClass,
  tableWrap,
  tdClass,
  thClass,
  toolbarClass,
} from '../lib/ui';

const emptyForm = {
  title: '',
  description: '',
  employeeId: '',
  managerId: '',
};

export default function Duties() {
  const [duties, setDuties] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dutyData, empData, mgrData] = await Promise.all([
        dutyApi.getAll(),
        employeeApi.getAll(),
        managerApi.getAll(),
      ]);
      setDuties(dutyData);
      setEmployees(empData);
      setManagers(mgrData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (duty) => {
    setEditing(duty);
    setForm({
      title: duty.title || '',
      description: duty.description || '',
      employeeId: duty.employee?.id || '',
      managerId: duty.assignedByManager?.id || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      title: form.title,
      description: form.description,
      employee: { id: Number(form.employeeId) },
      ...(form.managerId ? { assignedByManager: { id: Number(form.managerId) } } : {}),
    };

    try {
      if (editing) {
        await dutyApi.update(editing.id, payload);
        setSuccess('Duty assignment updated.');
      } else {
        await dutyApi.create(payload);
        setSuccess('Duty assigned successfully.');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this duty assignment?')) return;
    try {
      await dutyApi.delete(id);
      setSuccess('Duty deleted.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHeader
        title="Duty Assignments"
        subtitle="Coordinate and track employee task allocations"
      />

      <div className="p-10 space-y-10">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <div className="flex justify-end">
          <button type="button" className={btnPrimary} onClick={openCreate}>
            Assign Duty
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
                  <th className={thClass}>Title</th>
                  <th className={thClass}>Assignee</th>
                  <th className={thClass}>Authorized By</th>
                  <th className={thClass}>Abstract</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF]">
                {duties.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`${tdClass} py-20 text-center text-[#1B1B1E]/40 font-bold uppercase tracking-widest text-[10px]`}>
                      No duty assignments active
                    </td>
                  </tr>
                ) : (
                  duties.map((duty) => (
                    <tr key={duty.id} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className={`${tdClass} tabular-nums text-[#1B1B1E]/40 font-medium`}>#{duty.id}</td>
                      <td className={tdClass}>
                         <div className="font-bold text-[#1B1B1E] uppercase tracking-tight">{duty.title}</div>
                      </td>
                      <td className={tdClass}>{duty.employee?.name || '—'}</td>
                      <td className={tdClass}>
                         <div className="text-[10px] font-bold uppercase tracking-widest text-[#0B2545]">
                           {duty.assignedByManager?.name || duty.assignedByAdmin?.username || '—'}
                         </div>
                      </td>
                      <td className={`${tdClass} max-w-[200px] truncate text-[#1B1B1E]/50 italic`}>{duty.description}</td>
                      <td className={`${tdClass} text-right`}>
                        <div className="flex justify-end gap-4">
                          <button type="button" className="text-[#0B2545] font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4" onClick={() => openEdit(duty)}>Edit</button>
                          <button type="button" className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4" onClick={() => handleDelete(duty.id)}>Revoke</button>
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
          <Modal title={editing ? 'Modify Duty Assignment' : 'Assign New Duty'} onClose={() => setModalOpen(false)}>
            <form className={formGridClass} onSubmit={handleSubmit}>
              <label className={labelClass}>
                Duty Title
                <input className={inputClass} required value={form.title} onChange={(e) => updateField('title', e.target.value)} />
              </label>
              <label className={labelClass}>
                Assignee
                <select className={inputClass} required value={form.employeeId} onChange={(e) => updateField('employeeId', e.target.value)}>
                  <option value="">Select Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Authorizing Manager
                <select className={inputClass} value={form.managerId} onChange={(e) => updateField('managerId', e.target.value)}>
                  <option value="">System Default</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Detailed Description
                <textarea className={inputClass} rows="6" required value={form.description} onChange={(e) => updateField('description', e.target.value)} />
              </label>
              <div className={formActionsClass}>
                <button type="button" className={btnSecondary} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className={btnPrimary}>{editing ? 'Update Duty' : 'Assign Duty'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
