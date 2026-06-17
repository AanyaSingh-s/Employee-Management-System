import { useCallback, useEffect, useState } from 'react';
import { employeeApi, managerApi } from '../api/services';
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
  name: '',
  gender: 'Male',
  age: '',
  designation: '',
  department: '',
  salary: '',
  username: '',
  email: '',
  password: '',
  contact: '',
  managerId: '',
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [empData, mgrData] = await Promise.all([
        search
          ? employeeApi.search(search)
          : deptFilter
            ? employeeApi.getByDepartment(deptFilter)
            : employeeApi.getAll(),
        managerApi.getAll(),
      ]);
      setEmployees(empData);
      setManagers(mgrData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({
      name: emp.name || '',
      gender: emp.gender || 'Male',
      age: emp.age || '',
      designation: emp.designation || '',
      department: emp.department || '',
      salary: emp.salary || '',
      username: emp.username || '',
      email: emp.email || '',
      password: emp.password || '',
      contact: emp.contact || '',
      managerId: emp.manager?.id || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      name: form.name,
      gender: form.gender,
      age: Number(form.age),
      designation: form.designation,
      department: form.department,
      salary: Number(form.salary),
      username: form.username,
      email: form.email,
      password: form.password,
      contact: form.contact,
      ...(form.managerId ? { manager: { id: Number(form.managerId) } } : {}),
    };

    try {
      if (editing) {
        await employeeApi.update(editing.id, payload);
        setSuccess('Employee record updated.');
      } else {
        await employeeApi.create(payload);
        setSuccess('New employee record created.');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this record?')) return;
    try {
      await employeeApi.delete(id);
      setSuccess('Record archived.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHeader
        title="Workforce Directory"
        subtitle="Manage centralized employee records"
      />

      <div className="p-10 space-y-10">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <div className={toolbarClass}>
          <div className="flex-1 flex items-center border border-[#E9ECEF] bg-white focus-within:border-[#0B2545] transition-colors h-14">
            <div className="px-5 text-[#1B1B1E]/30 border-r border-[#E9ECEF] h-full flex items-center">
              <i className="ti ti-search text-lg"></i>
            </div>
            <input
              className="flex-1 px-5 text-xs font-bold tracking-widest uppercase outline-none placeholder:text-[#1B1B1E]/20"
              placeholder="SEARCH DIRECTORY BY NAME, ID, OR DEPT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="w-64 border border-[#E9ECEF] bg-white h-14 relative">
            <select
              className="w-full h-full px-5 text-[11px] font-bold tracking-widest uppercase outline-none bg-transparent appearance-none cursor-pointer"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">Filter: All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#1B1B1E]/40">
              <i className="ti ti-chevron-down"></i>
            </div>
          </div>

          <button type="button" className={btnPrimary} onClick={openCreate}>
            Add Employee
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
                  <th className={thClass}>Full Name</th>
                  <th className={thClass}>Department</th>
                  <th className={thClass}>Designation</th>
                  <th className={thClass}>Manager</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9ECEF]">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`${tdClass} py-20 text-center text-[#1B1B1E]/40 font-bold uppercase tracking-widest text-[10px]`}>
                      No records found in directory
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#F8F9FA] transition-colors group">
                      <td className={`${tdClass} tabular-nums text-[#1B1B1E]/40 font-medium`}>#{emp.id}</td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0B2545]/5 flex items-center justify-center text-[#0B2545] font-serif font-bold text-xs uppercase">
                            {emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-bold text-[#1B1B1E]">{emp.name}</span>
                        </div>
                      </td>
                      <td className={tdClass}>
                        <span className={badgeClass}>{emp.department}</span>
                      </td>
                      <td className={`${tdClass} text-[#1B1B1E]/60`}>{emp.designation}</td>
                      <td className={`${tdClass} text-[#1B1B1E]/60`}>{emp.manager?.name || '—'}</td>
                      <td className={`${tdClass} text-right`}>
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            className="text-[#0B2545] font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4"
                            onClick={() => openEdit(emp)}
                          >
                            Edit Record
                          </button>
                          <button
                            type="button"
                            className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4"
                            onClick={() => handleDelete(emp.id)}
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="bg-[#F8F9FA] border-t border-[#E9ECEF] px-8 py-4 flex items-center justify-between">
              <p className="text-[10px] font-bold text-[#1B1B1E]/40 uppercase tracking-widest">
                Showing {employees.length} Records
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#E9ECEF] text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer">Previous</button>
                <button className="px-4 py-2 border border-[#E9ECEF] text-[10px] font-bold uppercase tracking-widest bg-white transition-colors cursor-pointer">Next</button>
              </div>
            </div>
          </div>
        )}

        {modalOpen && (
          <Modal title={editing ? 'Edit Employee Record' : 'Create New Record'} onClose={() => setModalOpen(false)}>
            <form className={formGridClass} onSubmit={handleSubmit}>
              <div className="col-span-full mb-4 border-b border-[#E9ECEF] pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B2545]">Personal Information</p>
              </div>
              <label className={labelClass}>
                Full Name
                <input className={inputClass} required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </label>
              <label className={labelClass}>
                Gender
                <select className={inputClass} value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label className={labelClass}>
                Age
                <input className={inputClass} type="number" required value={form.age} onChange={(e) => updateField('age', e.target.value)} />
              </label>
              <label className={labelClass}>
                Contact Number
                <input className={inputClass} required value={form.contact} onChange={(e) => updateField('contact', e.target.value)} />
              </label>

              <div className="col-span-full mt-6 mb-4 border-b border-[#E9ECEF] pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B2545]">Professional Details</p>
              </div>
              <label className={labelClass}>
                Designation
                <input className={inputClass} required value={form.designation} onChange={(e) => updateField('designation', e.target.value)} />
              </label>
              <label className={labelClass}>
                Department
                <input className={inputClass} required value={form.department} onChange={(e) => updateField('department', e.target.value)} />
              </label>
              <label className={labelClass}>
                Salary (USD)
                <input className={inputClass} type="number" required value={form.salary} onChange={(e) => updateField('salary', e.target.value)} />
              </label>
              <label className={labelClass}>
                Reporting Manager
                <select className={inputClass} value={form.managerId} onChange={(e) => updateField('managerId', e.target.value)}>
                  <option value="">None</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.department})</option>
                  ))}
                </select>
              </label>

              <div className="col-span-full mt-6 mb-4 border-b border-[#E9ECEF] pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B2545]">Account Credentials</p>
              </div>
              <label className={labelClass}>
                Username
                <input className={inputClass} required value={form.username} onChange={(e) => updateField('username', e.target.value)} />
              </label>
              <label className={labelClass}>
                Email Address
                <input className={inputClass} type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} />
              </label>
              {!editing && (
                <label className={labelClass}>
                  Password
                  <input className={inputClass} type="password" required value={form.password} onChange={(e) => updateField('password', e.target.value)} />
                </label>
              )}
              
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
