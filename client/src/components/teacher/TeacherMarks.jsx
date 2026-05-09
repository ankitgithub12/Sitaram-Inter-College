import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Search, Plus, Trash2, Edit3, 
  Check, X, GraduationCap, Shield, User,
  Calendar, BookOpen, AlertCircle
} from 'lucide-react';

const TeacherMarks = ({ showToast }) => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMarkId, setCurrentMarkId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentUsername: '',
    subject: '',
    marksObtained: '',
    maxMarks: '',
    examType: ''
  });

  const teacherUsername = sessionStorage.getItem('userName') || 'teacher';
  const teacherName = sessionStorage.getItem('userName'); // Fallback if name not stored separately

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('teacherToken');
      // Load my students to populate the dropdown
      const studentRes = await fetch(`/api/users/manage?role=student&creator=${teacherUsername}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      if (studentData.success) {
        setStudents(studentData.data);
      }

      // Load marks entered by me
      const marksRes = await fetch(`/api/marks?teacherUsername=${teacherUsername}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const marksData = await marksRes.json();
      if (marksData.success) {
        setMarks(marksData.data);
      }
    } catch (err) {
      showToast('Error synchronizing academic records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s._id === studentId);
    if (student) {
      setFormData({
        ...formData,
        studentId: student._id,
        studentName: student.name,
        studentUsername: student.username
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode ? `/api/marks/${currentMarkId}` : '/api/marks';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        addedBy: teacherUsername,
        addedByName: teacherName
      };

      const token = localStorage.getItem('teacherToken');
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(isEditMode ? 'Marks updated successfully' : 'Marks recorded in registry');
        setIsModalOpen(false);
        resetForm();
        loadData();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to commit marks to registry', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this marks record?")) return;
    try {
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`/api/marks/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast('Marks record purged');
        loadData();
      }
    } catch (err) {
      showToast('Error purging record', 'error');
    }
  };

  const handleEdit = (mark) => {
    setIsEditMode(true);
    setCurrentMarkId(mark._id);
    setFormData({
      studentId: mark.studentId,
      studentName: mark.studentName,
      studentUsername: mark.studentUsername,
      subject: mark.subject,
      marksObtained: mark.marksObtained,
      maxMarks: mark.maxMarks,
      examType: mark.examType
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setCurrentMarkId(null);
    setFormData({
      studentId: '', studentName: '', studentUsername: '',
      subject: '', marksObtained: '', maxMarks: '', examType: ''
    });
  };

  const filteredMarks = marks.filter(m => 
    m.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.examType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 gap-6">
          <div>
            <h3 className="text-3xl font-black tracking-tighter text-gray-900 flex items-center space-x-3">
              <div className="p-2 bg-sricblue/10 rounded-xl text-sricblue">
                <BarChart2 className="w-8 h-8" />
              </div>
              <span>Academic Performance Registry</span>
            </h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[3px] mt-2">Student Merit Data Oversight</p>
          </div>
          <button 
             onClick={() => { resetForm(); setIsModalOpen(true); }}
             className="bg-sricblue text-white px-8 py-4 rounded-2xl flex items-center space-x-3 font-black text-xs uppercase tracking-[2px] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 border border-blue-400/20"
          >
            <Plus className="w-5 h-5" />
            <span>Record New Marks</span>
          </button>
        </div>

        <div className="p-10">
          <div className="mb-8 relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" placeholder="Search by student, subject or exam..."
              className="w-full bg-gray-50 border border-gray-200 pl-14 pr-6 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 ring-blue-50 transition-all font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 rounded-[2rem] border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100/50 border-b border-gray-200">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Student Entity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Academic Domain</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Merit Score</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[4px] text-right">Utility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMarks.map(mark => (
                    <tr key={mark._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-sricblue font-black shadow-sm">
                            {mark.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-gray-800">{mark.studentName}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{mark.studentUsername}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-black text-gray-800 uppercase tracking-wider text-xs">{mark.subject}</p>
                          <p className="text-[10px] font-bold text-sricblue">{mark.examType}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <div className={`px-4 py-2 rounded-xl border font-black text-lg ${
                            (mark.marksObtained / mark.maxMarks) >= 0.33 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {mark.marksObtained} <span className="text-xs text-gray-400">/ {mark.maxMarks}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(mark)} className="p-3 rounded-xl bg-gray-100 text-blue-500 hover:bg-blue-500 hover:text-white transition-all border border-gray-200"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(mark._id)} className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-gray-200"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMarks.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <BarChart2 className="w-16 h-16 text-gray-200" />
                          <p className="text-gray-400 font-black text-sm uppercase tracking-[4px]">No Academic Records Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white rounded-[3.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            <div className="bg-sricblue p-10 text-white relative">
              <h3 className="text-3xl font-black tracking-tighter">{isEditMode ? 'Update Record' : 'Merit Entry'}</h3>
              <p className="text-blue-300 text-[10px] font-black uppercase tracking-[3px] mt-1 text-sricgold">Registry Delta • Student Performance</p>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Select Student</label>
                <select 
                  required disabled={isEditMode}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-black text-sm appearance-none outline-none focus:ring-4 ring-blue-50 transition-all"
                  value={formData.studentId}
                  onChange={e => handleStudentSelect(e.target.value)}
                >
                  <option value="">Choose Node...</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.username})</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Academic Domain (Subject)</label>
                <input 
                  type="text" required placeholder="e.g. Mathematics"
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-black outline-none focus:ring-4 ring-blue-50 transition-all"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Obtained</label>
                  <input 
                    type="number" required
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-black outline-none focus:ring-4 ring-blue-50 transition-all"
                    value={formData.marksObtained}
                    onChange={e => setFormData({...formData, marksObtained: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Maximum</label>
                  <input 
                    type="number" required
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-black outline-none focus:ring-4 ring-blue-50 transition-all"
                    value={formData.maxMarks}
                    onChange={e => setFormData({...formData, maxMarks: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-sricblue uppercase tracking-[4px] ml-2">Exam Classification</label>
                <input 
                  type="text" required placeholder="e.g. Unit Test 1"
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-black outline-none focus:ring-4 ring-blue-50 transition-all"
                  value={formData.examType}
                  onChange={e => setFormData({...formData, examType: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-sricblue text-white py-6 rounded-2xl font-black uppercase tracking-[3px] shadow-2xl shadow-blue-200 hover:-translate-y-1 transition-all active:scale-95 mt-4">
                Commit to Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMarks;
