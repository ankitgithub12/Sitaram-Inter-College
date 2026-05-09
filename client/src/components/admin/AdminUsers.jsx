import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Power, Info, Search, Shield, Mail, 
  Trash2, Key, RefreshCw, Eye, EyeOff, Check, X
} from 'lucide-react';

const AdminUsers = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'teacher',
    subject: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [updatePasswordMap, setUpdatePasswordMap] = useState({});
  const [newPasswordMap, setNewPasswordMap] = useState({});
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const adminUsername = sessionStorage.getItem('userName') || '221205';
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/manage?role=teacher&creator=${adminUsername}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      showToast('Error loading teachers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 10; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
    showToast('Secure password generated');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher? This action is irreversible.")) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast('Teacher account deleted successfully');
        loadUsers();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error deleting account', 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${id}/toggle-status`, {
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

  const handleUpdatePassword = async (id) => {
    const newPassword = newPasswordMap[id];
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Password updated successfully');
        setUpdatePasswordMap(prev => ({ ...prev, [id]: false }));
        loadUsers();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error updating password', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminUsername = sessionStorage.getItem('userName') || 'admin';
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, createdBy: adminUsername })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Teacher account created successfully');
        setLastCreated({ ...formData });
        setIsReceiptOpen(true);
        setIsModalOpen(false);
        setFormData({ username: '', password: '', name: '', email: '', role: 'teacher', subject: '' });
        loadUsers();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error creating account', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Teacher Management</h2>
          <p className="text-gray-500">Create and manage teacher credentials and access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest border-b">
            <tr>
              <th className="px-6 py-4">Name / Username</th>
              <th className="px-6 py-4">Credentials</th>
              <th className="px-6 py-4">Department / Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {updatePasswordMap[user._id] ? (
                      <div className="flex items-center space-x-2 animate-in slide-in-from-right-2 duration-300">
                        <div className="relative">
                          <input 
                            type={showPasswordMap[user._id] ? "text" : "password"}
                            className="w-36 bg-gray-50 border-2 border-amber-200 rounded-xl px-4 py-2 text-xs font-black focus:outline-none focus:ring-4 ring-amber-50 transition-all"
                            placeholder="New Secret..."
                            value={newPasswordMap[user._id] || ''}
                            onChange={(e) => setNewPasswordMap(prev => ({ ...prev, [user._id]: e.target.value }))}
                          />
                        </div>
                        <button 
                          onClick={() => handleUpdatePassword(user._id)} 
                          className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-90"
                          title="Save Credentials"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setUpdatePasswordMap(prev => ({ ...prev, [user._id]: false }))} 
                          className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-90"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center space-x-2 group/pass">
                          <span className="font-mono text-xs font-black text-gray-700 w-20">
                            {showPasswordMap[user._id] ? (user.plainPassword || 'Hidden') : '••••••••'}
                          </span>
                          <button
                            onClick={() => setShowPasswordMap(prev => ({ ...prev, [user._id]: !prev[user._id] }))}
                            className="p-1.5 text-gray-400 hover:text-sricblue rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            {showPasswordMap[user._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setUpdatePasswordMap(prev => ({ ...prev, [user._id]: true }));
                            setNewPasswordMap(prev => ({ ...prev, [user._id]: '' }));
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-amber-50 text-amber-600 hover:bg-sricgold hover:text-sricblue rounded-xl transition-all border border-amber-200 font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md active:scale-95"
                          title="Update Teacher Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-sricblue px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-200">
                      {user.subject || 'General'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.isDisabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.isDisabled ? 'Disabled' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleToggleStatus(user._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isDisabled ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'
                      }`}
                      title={user.isDisabled ? 'Enable Account' : 'Disable Account'}
                    >
                      <Power className="w-5 h-5" />
                    </button>
                    <button 
                       onClick={() => handleDelete(user._id)}
                       className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                       title="Delete Teacher"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && !isLoading && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No teachers found. Click "Add New Teacher" to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-blue-600 p-6 text-white">
              <h3 className="text-xl font-bold">Register New Teacher</h3>
              <p className="text-blue-100 text-sm">Create credentials for a new educator.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border p-2 rounded-lg" placeholder="Mr. John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Username</label>
                  <input 
                    type="text" required
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full border p-2 rounded-lg" placeholder="teacher_01"
                  />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full border p-2 rounded-lg pr-20" placeholder="••••••••"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        type="button"
                        onClick={generatePassword}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Auto-Generate"
                      >
                         <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Primary Subject / Department</label>
                <input 
                   type="text" required
                   value={formData.subject}
                   onChange={e => setFormData({...formData, subject: e.target.value})}
                   className="w-full border p-2 rounded-lg" placeholder="e.g. Mathematics, Physics..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <input 
                   type="email" required
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full border p-2 rounded-lg" placeholder="john@sric.edu.in"
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Success Receipt Modal */}
      {isReceiptOpen && lastCreated && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Teacher Registered</h3>
            <p className="text-gray-500 text-sm mb-6">Credentials have been generated successfully.</p>
            
            <div className="space-y-3 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 border text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Username</p>
                <p className="text-lg font-bold text-gray-800">{lastCreated.username}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Password</p>
                <p className="text-lg font-bold text-blue-600 font-mono">{lastCreated.password}</p>
              </div>
            </div>

            <button 
              onClick={() => setIsReceiptOpen(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
