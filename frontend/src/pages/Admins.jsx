import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../api/services';
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
} from '../lib/ui';

const emptyForm = { username: '', email: '', password: '' };

export default function Admins() {
  const [admins, setAdmins] = useState([]);
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
      setAdmins(await adminApi.getAll());
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

  const openEdit = (admin) => {
    setEditing(admin);
    setForm({
      username: admin.username || '',
      email: admin.email || '',
      password: admin.password || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editing) {
        await adminApi.update(editing.id, form);
        setSuccess('Admin account updated.');
      } else {
        await adminApi.create(form);
        setSuccess('New administrator account created.');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Revoke administrator access?')) return;
    try {
      await adminApi.delete(id);
      setSuccess('Admin access revoked.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHeader
        title="Security & Access"
        subtitle="System administrator privilege management"
      />

      <div className="p-10 space-y-10">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <div className="flex justify-end">
          <button type="button" className={btnPrimary} onClick={openCreate}>
            Add Admin
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
                  <th className={thClass}>Username</th>
                  <th className={thClass}>Email Address</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF]">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={`${tdClass} py-20 text-center text-[#1B1B1E]/40 font-bold uppercase tracking-widest text-[10px]`}>
                      No admin accounts registered
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className={`${tdClass} tabular-nums text-[#1B1B1E]/40 font-medium`}>#{admin.id}</td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-3">
                           <div className="flex h-8 w-8 items-center justify-center bg-[#0B2545]/5 text-[#0B2545]">
                            <i className="ti ti-shield-lock"></i>
                          </div>
                          <span className="font-bold text-[#1B1B1E]">{admin.username}</span>
                        </div>
                      </td>
                      <td className={`${tdClass} text-[#1B1B1E]/60`}>{admin.email}</td>
                      <td className={`${tdClass} text-right`}>
                         <div className="flex justify-end gap-4">
                          <button type="button" className="text-[#0B2545] font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4" onClick={() => openEdit(admin)}>Modify</button>
                          <button type="button" className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4" onClick={() => handleDelete(admin.id)}>Revoke</button>
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
          <Modal title={editing ? 'Modify Admin Access' : 'Create Admin Account'} onClose={() => setModalOpen(false)}>
            <form className={formGridClass} onSubmit={handleSubmit}>
              <label className={labelClass}>
                Username
                <input className={inputClass} required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </label>
              <label className={labelClass}>
                Email Address
                <input className={inputClass} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Security Password
                <input className={inputClass} type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
              <div className={formActionsClass}>
                <button type="button" className={btnSecondary} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className={btnPrimary}>{editing ? 'Update Access' : 'Grant Access'}</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
