import React, { useState } from 'react';
import { 
  User, Mail, Lock, Shield, Check, 
  Settings, Save, BookOpen, AlertCircle
} from 'lucide-react';

const TeacherSettings = ({ showToast, teacherName, setTeacherName }) => {
  const [formData, setFormData] = useState({
    name: teacherName || '',
    email: sessionStorage.getItem('email') || '',
    subject: sessionStorage.getItem('subject') || '',
    username: sessionStorage.getItem('userName') || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userId = sessionStorage.getItem('userId');
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        username: formData.username
      };

      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('Profile updated successfully');
        sessionStorage.setItem('name', formData.name);
        sessionStorage.setItem('email', formData.email);
        sessionStorage.setItem('subject', formData.subject);
        setTeacherName(formData.name);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error updating profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }
    
    setIsLoading(true);
    try {
      const userId = sessionStorage.getItem('userId');
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: formData.newPassword })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('Password updated successfully');
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Error updating password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center space-x-4">
             <div className="p-3 bg-sricblue/10 rounded-2xl text-sricblue">
                <Settings className="w-8 h-8" />
             </div>
            <span>Profile Settings</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[4px] mt-2">Personal Node Configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Profile Form */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
               <h3 className="font-black text-xl text-gray-800 tracking-tight">Identity Information</h3>
               <div className="px-3 py-1 rounded-full bg-blue-100 text-sricblue text-[10px] font-black uppercase tracking-widest">Global Account</div>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-10 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Display Name</label>
                    <div className="relative">
                       <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input 
                         type="text" name="name" required
                         className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50 transition-all"
                         value={formData.name}
                         onChange={handleChange}
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input 
                         type="email" name="email" required
                         className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50 transition-all"
                         value={formData.email}
                         onChange={handleChange}
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Access Username</label>
                    <div className="relative">
                       <Shield className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input 
                         type="text" name="username" required
                         className="w-full bg-gray-100 border border-gray-200 pl-16 pr-6 py-5 rounded-2xl font-bold text-gray-400"
                         value={formData.username}
                         readOnly
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Academic Domain</label>
                    <div className="relative">
                       <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input 
                         type="text" name="subject" required
                         className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50 transition-all"
                         value={formData.subject}
                         onChange={handleChange}
                         placeholder="e.g. Physics"
                       />
                    </div>
                  </div>
               </div>
               <button 
                 type="submit" disabled={isLoading}
                 className="bg-sricblue text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[3px] text-xs shadow-xl shadow-blue-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center space-x-3 disabled:opacity-50"
               >
                 <Save className="w-5 h-5" />
                 <span>Update Global Identity</span>
               </button>
            </form>
          </div>

          {/* Security Form */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
               <h3 className="font-black text-xl text-gray-800 tracking-tight">Security Credentials</h3>
               <div className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</div>
            </div>
            <form onSubmit={handleUpdatePassword} className="p-10 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">New Password Key</label>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input 
                         type="password" name="newPassword" required
                         className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50 transition-all"
                         placeholder="••••••••"
                         value={formData.newPassword}
                         onChange={handleChange}
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Confirm Key</label>
                    <div className="relative">
                       <Check className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                       <input 
                         type="password" name="confirmPassword" required
                         className="w-full bg-gray-50 border border-gray-200 pl-16 pr-6 py-5 rounded-2xl font-bold outline-none focus:ring-4 ring-blue-50 transition-all"
                         placeholder="••••••••"
                         value={formData.confirmPassword}
                         onChange={handleChange}
                       />
                    </div>
                  </div>
               </div>
               <button 
                 type="submit" disabled={isLoading}
                 className="bg-sricgold text-sricblue px-10 py-5 rounded-2xl font-black uppercase tracking-[3px] text-xs shadow-xl shadow-sricgold/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center space-x-3 disabled:opacity-50"
               >
                 <Shield className="w-5 h-5" />
                 <span>Revoke & Re-issue Keys</span>
               </button>
            </form>
          </div>
        </div>

        <div className="space-y-10">
           <div className="bg-gradient-to-br from-[#002366] to-[#001533] p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/20">
                    <Shield className="w-10 h-10 text-sricgold" />
                 </div>
                 <h3 className="text-3xl font-black tracking-tighter mb-4">Account Oversight</h3>
                 <p className="text-blue-200/60 font-medium mb-10 leading-relaxed text-sm">Your account is secured with Faculty Standard Encryption. Identity modifications are recorded in the system audit log.</p>
                 <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-emerald-400">
                       <Check className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Two-Factor Enabled</span>
                    </div>
                    <div className="flex items-center space-x-3 text-emerald-400">
                       <Check className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Biometric Sync Ready</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
              <h4 className="font-black text-xs uppercase tracking-[4px] text-gray-400 mb-6 flex items-center space-x-2">
                 <AlertCircle className="w-4 h-4 text-sricblue" />
                 <span>System Notice</span>
              </h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">Identity changes may require session re-validation. Please ensure all unsaved academic data is pushed to the cluster before committing changes.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;
