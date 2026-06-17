import { useCallback, useEffect, useState } from 'react';
import { managerApi } from '../api/services';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import {
  badgeClass,
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
  id: '',
  name: '',
  username: '',
  email: '',
  password: '',
  department: '',
  contact: '',
};

export default function Managers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = deptFilter
        ? await managerApi.getByDepartment(deptFilter)
        : await managerApi.getAll();
      setManagers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [deptFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (mgr) => {
    setEditing(mgr);
    setForm({
      id: mgr.id || '',
      name: mgr.name || '',
      username: mgr.username || '',
      email: mgr.email || '',
      password: mgr.password || '',
      department: mgr.department || '',
      contact: mgr.contact || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      name: form.name,
      username: form.username,
      email: form.email,
      password: form.password,
      department: form.department,
      contact: form.contact,
    };
    if (!editing && form.id) {
      payload.id = Number(form.id);
    }

    try {
      if (editing) {
        await managerApi.update(editing.id, payload);
        setSuccess('Manager record updated.');
      } else {
        await managerApi.create(payload);
        setSuccess('New manager record created.');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this manager record?')) return;
    try {
      await managerApi.delete(id);
      setSuccess('Manager record archived.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHeader
        title="Management Directory"
        subtitle="Department leadership and operations"
      />

      <div className="p-10 space-y-10">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <div className={toolbarClass}>
          <div className="flex-1 flex items-center border border-[#E9ECEF] bg-white focus-within:border-[#0B2545] transition-colors h-14">
            <div className="px-5 text-[#1B1B1E]/30 border-r border-[#E9ECEF] h-full flex items-center">
              <i className="ti ti-filter text-lg"></i>
            </div>
            <input
              className="flex-1 px-5 text-xs font-bold tracking-widest uppercase outline-none placeholder:text-[#1B1B1E]/20"
              placeholder="FILTER BY DEPARTMENT..."
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            />
          </div>
          <button type="button" className={btnPrimary} onClick={openCreate}>
            Add Manager
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
                  <th className={thClass}>Name</th>
                  <th className={thClass}>Department</th>
                  <th className={thClass}>Username</th>
                  <th className={thClass}>Email</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF]">
                {managers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`${tdClass} py-20 text-center text-[#1B1B1E]/40 font-bold uppercase tracking-widest text-[10px]`}>
                      No management records found
                    </td>
                  </tr>
                ) : (
                  managers.map((mgr) => (
                    <tr key={mgr.id} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className={`${tdClass} tabular-nums text-[#1B1B1E]/40 font-medium`}>#{mgr.id}</td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0B2545]/5 flex items-center justify-center text-[#0B2545] font-serif font-bold text-xs uppercase">
                            {mgr.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-bold text-[#1B1B1E]">{mgr.name}</span>
                        </div>
                      </td>
                      <td className={tdClass}><span className={badgeClass}>{mgr.department}</span></td>
                      <td className={`${tdClass} text-[#1B1B1E]/60`}>{mgr.username}</td>
                      <td className={`${tdClass} text-[#1B1B1E]/60`}>{mgr.email}</td>
                      <td className={`${tdClass} text-right`}>
                        <div className="flex justify-end gap-4">
                          <button type="button" className="text-[#0B2545] font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4" onClick={() => openEdit(mgr)}>Edit</button>
                          <button type="button" className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4" onClick={() => handleDelete(mgr.id)}>Archive</button>
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
          <Modal title={editing ? 'Edit Manager Record' : 'Assign New Manager'} onClose={() => setModalOpen(false)}>
            <form className={formGridClass} onSubmit={handleSubmit}>
              {!editing && (
                <label className={labelClass}>
                  Employee ID
                  <input className={inputClass} type="number" value={form.id} onChange={(e) => updateField('id', e.target.value)} placeholder="ENTER ID..." />
                </label>
              )}
              <label className={labelClass}>
                Full Name
                <input className={inputClass} required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </label>
              <label className={labelClass}>
                Department
                <input className={inputClass} required value={form.department} onChange={(e) => updateField('department', e.target.value)} />
              </label>
              <label className={labelClass}>
                Contact
                <input className={inputClass} required value={form.contact} onChange={(e) => updateField('contact', e.target.value)} />
              </label>
              <label className={labelClass}>
                Username
                <input className={inputClass} required value={form.username} onChange={(e) => updateField('username', e.target.value)} />
              </label>
              <label className={labelClass}>
                Email
                <input className={inputClass} type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} />
              </label>
              <label className={labelClass}>
                Password
                <input className={inputClass} type="password" required value={form.password} onChange={(e) => updateField('password', e.target.value)} />
              </label>
              <div className={formActionsClass}>
                <button type="button" className={btnSecondary} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className={btnPrimary}>{editing ? 'Update Record' : 'Create Record'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
