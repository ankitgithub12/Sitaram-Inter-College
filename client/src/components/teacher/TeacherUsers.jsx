import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Power, Search, GraduationCap, Shield, X, 
  User, Users, Trash2, Edit3, Key, Eye, EyeOff, RefreshCw,
  MoreVertical, Check, AlertCircle
} from 'lucide-react';
import { apiUrl } from '../../lib/config';

const TeacherUsers = ({ showToast, teacherName }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'student',
    subject: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const teacherUsername = sessionStorage.getItem('userName') || 'teacher';

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(apiUrl(`/api/users/manage?role=student&creator=${teacherUsername}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      showToast('Error loading students', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
    showToast('Secure password generated');
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(apiUrl(`/api/users/${id}/toggle-status`), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast(data.message);
        loadUsers();
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to terminate this student node? This action is irreversible.")) return;
    
    try {
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(apiUrl(`/api/users/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast('Student node terminated successfully');
        loadUsers();
      }
    } catch (err) {
      showToast('Error deleting account', 'error');
    }
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setCurrentUserId(user._id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      username: user.username || '',
      password: '', 
      role: user.role || 'student',
      subject: user.subject || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode 
        ? apiUrl(`/api/users/${currentUserId}`) 
        : apiUrl('/api/users/create');
      const method = isEditMode ? 'PUT' : 'POST';
      
      const payload = { ...formData, createdBy: teacherUsername, creatorName: teacherName };
      if (isEditMode && !formData.password) delete payload.password;

      const token = localStorage.getItem('teacherToken');
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        showToast(isEditMode ? 'Student updated successfully' : 'Student account created successfully');
        if (!isEditMode) {
            setLastCreated({ ...formData });
            setIsReceiptOpen(true);
        }
        setIsModalOpen(false);
        resetForm();
        loadUsers();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('System synchronization error', 'error');
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setCurrentUserId(null);
    setFormData({ username: '', password: '', name: '', email: '', role: 'student', subject: '' });
  };

  return (
    <div className="p-8 w-full group/main overflow-hidden bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center space-x-3">
             <div className="p-2 bg-sricgold/20 rounded-xl">
                <Users className="w-8 h-8 text-sricgold" />
             </div>
            <span>Student Management</span>
          </h2>
          <p className="text-sm text-blue-200/40 font-bold mt-2 tracking-wide uppercase italic">Live Cluster Oversight</p>
        </div>
        <div className="flex items-center space-x-3">
            <button 
              onClick={loadUsers}
              disabled={isLoading}
              className="p-4 rounded-2xl bg-white/5 text-sricgold border border-white/10 hover:bg-white/10 transition-all active:rotate-180 disabled:opacity-50"
              title="Sync Table Data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-sricgold hover:bg-sricgold text-sricblue px-10 py-4 rounded-2xl flex items-center space-x-3 font-black text-xs uppercase tracking-[3px] shadow-2xl shadow-sricgold/20 transition-all hover:-translate-y-1 active:scale-95 border border-white/10"
            >
              <UserPlus className="w-5 h-5" />
              <span>Provision Node</span>
            </button>
        </div>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
              type="text" placeholder="Search Entity..."
              className="w-full bg-gray-50 border border-gray-200 pl-14 pr-6 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 ring-blue-100 transition-all font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
      </div>

      <div className="bg-gray-50 rounded-[2rem] border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100/50 border-b border-gray-200">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Designation</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Credentials</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px] text-right">Oversight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group/row">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-sricblue font-black shadow-sm group-hover/row:scale-110 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-lg group-hover/row:text-sricblue transition-colors">{user.name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <span className="font-mono text-xs font-bold text-gray-700 w-20">
                         {showPasswordMap[user._id] ? (user.plainPassword || 'Hidden') : '••••••••'}
                       </span>
                       <button
                         onClick={() => setShowPasswordMap(prev => ({ ...prev, [user._id]: !prev[user._id] }))}
                         className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                         title={showPasswordMap[user._id] ? "Hide Password" : "Show Password"}
                       >
                         {showPasswordMap[user._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <div className={`w-2 h-2 rounded-full ${user.isDisabled ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`}></div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${user.isDisabled ? 'text-rose-600' : 'text-emerald-600'}`}>{user.isDisabled ? 'Offline Node' : 'Active Node'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-40 group-hover/row:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-3.5 rounded-2xl bg-gray-100 text-blue-500 hover:bg-blue-500 hover:text-white border border-gray-200 transition-all active:scale-90"
                        title="Edit Node Credentials"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user._id)}
                        className={`p-3.5 rounded-2xl border border-gray-200 transition-all active:scale-90 ${
                          user.isDisabled 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white' 
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white'
                        }`}
                        title={user.isDisabled ? "Authorize Access" : "Revoke Access"}
                      >
                        <Power className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-3.5 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-gray-200 transition-all active:scale-90"
                        title="Delete Entity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Users className="w-20 h-20 text-gray-200 mb-2" />
                      <p className="text-gray-400 font-black text-lg uppercase tracking-[8px]">Registry Empty</p>
                      <p className="text-gray-300 text-xs font-bold uppercase tracking-[2px]">Initialize a new node to begin oversight.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] max-w-xl w-full overflow-hidden border border-gray-100 relative">
            <button 
               onClick={() => setIsModalOpen(false)}
               className="absolute top-10 right-10 p-4 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all z-10 border border-gray-200"
            >
               <X className="w-6 h-6" />
            </button>

            <div className="p-8 md:p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-sricblue to-blue-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">{isEditMode ? 'Modify Entity' : 'New Provisioning'}</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-[3px]">Encryption Level: Faculty Standard</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 md:px-16 pb-12 md:pb-20 space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Display Designation</label>
                 <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      type="text" required placeholder="Full Student Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-[2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 ring-blue-100 transition-all font-black"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Access Key</label>
                   <div className="relative">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        type="text" required placeholder="ID_NODE"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-[2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 ring-blue-50 transition-all font-black"
                      />
                   </div>
                </div>
                <div className="space-y-2 relative">
                   <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Secured Pass</label>
                   <div className="relative">
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        type="password" placeholder={isEditMode ? "Leave empty if same" : "••••••••"}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 pl-16 pr-20 py-5 rounded-[2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 ring-blue-50 transition-all font-black"
                      />
                      <button 
                        type="button"
                        onClick={generatePassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-sricgold hover:bg-sricgold/10 rounded-xl transition-all"
                        title="Auto-Generate Secret"
                      >
                         <RefreshCw className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Class / Section</label>
                 <div className="relative">
                    <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                        type="text" required placeholder="e.g. 12-A, 10-B"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-[2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 ring-blue-50 transition-all font-black"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Communication Channel</label>
                 <div className="relative">
                    <RefreshCw className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                        type="email" required placeholder="student@sric.edu.in"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-[2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 ring-blue-50 transition-all font-black"
                    />
                 </div>
              </div>

              <div className="pt-10 flex space-x-4">
                <button 
                  type="submit"
                  className="flex-1 bg-sricgold text-sricblue py-6 rounded-[2.5rem] font-black uppercase tracking-[4px] text-xs shadow-2xl shadow-sricgold/20 hover:-translate-y-1 transition-all active:scale-95 group"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span>{isEditMode ? 'Commit Delta' : 'Confirm Provision'}</span>
                    <Check className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReceiptOpen && lastCreated && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-500 p-6">
          <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] max-w-md w-full p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                   <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">Provisioning Success</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[3px] mb-8">Credential Summary Ready</p>
                
                <div className="space-y-4 mb-10">
                   <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-2 text-left">Access Key (ID)</p>
                      <p className="text-2xl font-black text-gray-800 text-left">{lastCreated.username}</p>
                   </div>
                   <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-2 text-left">Assigned Class</p>
                      <p className="text-2xl font-black text-gray-800 text-left">{lastCreated.subject}</p>
                   </div>
                   <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-2 text-left">Secured Passkey</p>
                      <p className="text-2xl font-black text-sricblue tracking-widest text-left">{lastCreated.password}</p>
                   </div>
                   <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized By</span>
                      <span className="text-[10px] font-black text-sricblue uppercase tracking-widest">{sessionStorage.getItem('name') || teacherUsername}</span>
                   </div>
                </div>

                <button 
                  onClick={() => setIsReceiptOpen(false)}
                  className="w-full bg-sricblue text-white py-5 rounded-2xl font-black uppercase tracking-[3px] text-xs shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Confirm & Dismiss
                </button>
             </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,215,0,0.2); }
      ` }} />
    </div>
  );
};

export default TeacherUsers;


