import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Mail, Phone, Shield, ShieldOff, 
  Trash2, Edit, CheckCircle, XCircle, MoreVertical,
  GraduationCap, Hash, BookOpen, MapPin, User
} from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });
  
  // States for password visibility and updates
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [updatePasswordMap, setUpdatePasswordMap] = useState({});
  const [newPasswordMap, setNewPasswordMap] = useState({});

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'student',
    class: '',
    rollNo: '',
    fatherName: '',
    motherName: '',
    contact: '',
    address: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/users/manage?role=student', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (err) {
      displayToast('Error fetching students', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const displayToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${id}/toggle-status?role=student`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(students.map(s => s._id === id ? { ...s, isDisabled: data.isDisabled } : s));
        displayToast(`Student ${data.isDisabled ? 'disabled' : 'enabled'} successfully`);
      }
    } catch (err) {
      displayToast('Error toggling status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student account?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${id}?role=student`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setStudents(students.filter(s => s._id !== id));
        displayToast('Student account deleted successfully');
      }
    } catch (err) {
      displayToast('Error deleting student', 'error');
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const creator = localStorage.getItem('loginID') || 'admin';
      const creatorName = localStorage.getItem('adminName') || 'Administrator';
      
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, createdBy: creator, creatorName })
      });
      const data = await response.json();
      if (data.success) {
        displayToast('Student account created successfully');
        setIsModalOpen(false);
        fetchStudents();
        setFormData({
          username: '', password: '', name: '', email: '', role: 'student',
          class: '', rollNo: '', fatherName: '', motherName: '', contact: '', address: ''
        });
      } else {
        displayToast(data.message, 'error');
      }
    } catch (err) {
      displayToast('Error creating student', 'error');
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${selectedStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, role: 'student' })
      });
      const data = await response.json();
      if (data.success) {
        displayToast('Student account updated successfully');
        setIsEditModalOpen(false);
        fetchStudents();
      } else {
        displayToast(data.message, 'error');
      }
    } catch (err) {
      displayToast('Error updating student', 'error');
    }
  };

  const handleQuickPasswordUpdate = async (userId) => {
    const newPassword = newPasswordMap[userId];
    if (!newPassword || newPassword.length < 6) {
      displayToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword, role: 'student' })
      });

      if (response.ok) {
        displayToast('Password updated successfully');
        setUpdatePasswordMap(prev => ({ ...prev, [userId]: false }));
        setNewPasswordMap(prev => ({ ...prev, [userId]: '' }));
        fetchStudents();
      }
    } catch (err) {
      displayToast('Error updating password', 'error');
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      username: student.username || '',
      password: '',
      name: student.name || '',
      email: student.email || '',
      role: 'student',
      class: student.class || '',
      rollNo: student.rollNo || '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      contact: student.contact || '',
      address: student.address || ''
    });
    setIsEditModalOpen(true);
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {showToast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
          showToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white flex items-center space-x-3`}>
          {showToast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-bold">{showToast.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Student Management</h2>
          <p className="text-gray-500 font-medium">Create and manage student accounts and profiles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-sricblue text-white px-6 py-3 rounded-2xl flex items-center space-x-2 hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1 font-bold"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New Student</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search students by name, username, or class..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Student Info</th>
                <th className="px-8 py-5">Credentials</th>
                <th className="px-8 py-5">Class & Roll</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400 font-bold">Fetching Student Data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold">No students found</td>
                </tr>
              ) : filteredStudents.map(student => (
                <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400 font-bold">@{student.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col space-y-2">
                       <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                          <Mail className="w-3 h-3 text-blue-400" />
                          <span>{student.email || 'No email'}</span>
                       </div>
                       <div className="flex items-center space-x-2">
                          <div className="bg-gray-100 rounded-lg px-3 py-1.5 flex items-center space-x-2">
                             <Shield className="w-3 h-3 text-amber-500" />
                             <span className="text-[10px] font-black tracking-widest uppercase text-gray-600">
                                {updatePasswordMap[student._id] ? (
                                   <input 
                                      type="text" 
                                      className="bg-transparent border-none p-0 w-20 focus:ring-0" 
                                      placeholder="New password"
                                      value={newPasswordMap[student._id] || ''}
                                      onChange={(e) => setNewPasswordMap(prev => ({ ...prev, [student._id]: e.target.value }))}
                                   />
                                ) : (
                                   student.plainPassword || '••••••••'
                                )}
                             </span>
                          </div>
                          <button 
                             onClick={() => {
                                if (updatePasswordMap[student._id]) {
                                   handleQuickPasswordUpdate(student._id);
                                } else {
                                   setUpdatePasswordMap(prev => ({ ...prev, [student._id]: true }));
                                }
                             }}
                             className={`p-1.5 rounded-lg transition-colors ${updatePasswordMap[student._id] ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                          >
                             {updatePasswordMap[student._id] ? <CheckCircle className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                          </button>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-black text-gray-700">Class {student.class || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Hash className="w-3 h-3" />
                        <span className="font-bold">Roll: {student.rollNo || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      student.isDisabled 
                        ? 'bg-red-50 text-red-500 border border-red-100' 
                        : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {student.isDisabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Edit Profile"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(student._id)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${
                          student.isDisabled 
                            ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' 
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                        }`}
                        title={student.isDisabled ? "Enable Account" : "Disable Account"}
                      >
                        {student.isDisabled ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(student._id)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal (Combined logic for brevity) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                  {isEditModalOpen ? 'Edit Student Profile' : 'Create New Student'}
                </h3>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                  SRIC Academic Management System
                </p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                className="p-3 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleUpdateStudent : handleCreateStudent} className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Username (Login ID)</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="e.g. sric2024001"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                {!isEditModalOpen && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                    <input 
                      type="password"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="Student's Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Class</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="e.g. 12-A"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Roll Number</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="Roll No"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contact Number</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="Parent's Mobile"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6 flex space-x-3">
                <button 
                  type="submit"
                  className="flex-1 bg-sricblue text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-1"
                >
                  {isEditModalOpen ? 'Save Changes' : 'Create Student Account'}
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
