import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader, FileText, X } from 'lucide-react';
import { apiUrl } from '../../lib/config';

const AdminAchievements = ({ showToast }) => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classFilter, setClassFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    percentage: '',
    stream: '',
    rank: 1,
    classGroup: '12',
    year: new Date().getFullYear().toString(),
    highlights: '',
    isTop1Percent: false
  });
  const [certificateFile, setCertificateFile] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, [classFilter, yearFilter]);

  const fetchAchievements = async () => {
    setIsLoading(true);
    let url = '/api/achievements?';
    if (classFilter !== 'all') url += `classGroup=${classFilter}&`;
    if (yearFilter !== 'all') url += `year=${yearFilter}&`;
    
    try {
      const res = await fetch(apiUrl(url));
      const data = await res.json();
      if (data.success) {
        setAchievements(data.data);
      }
    } catch (err) {
      showToast('Failed to load achievements', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (certificateFile) data.append('certificate', certificateFile);

    try {
      const res = await fetch(apiUrl('/api/achievements'), {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        showToast('Achievement added successfully', 'success');
        setModalOpen(false);
        resetForm();
        fetchAchievements();
      } else {
        showToast(result.message || 'Failed to add achievement', 'error');
      }
    } catch (err) {
      showToast('Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this achievement?')) return;
    try {
      const res = await fetch(apiUrl(`/api/achievements/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Deleted', 'success');
        fetchAchievements();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', percentage: '', stream: '', rank: 1, classGroup: '12',
      year: new Date().getFullYear().toString(), highlights: '', isTop1Percent: false
    });
    setCertificateFile(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Achievements & Toppers</h2>
          <p className="text-sm text-gray-500 mt-1">Manage student academic performances.</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="bg-sricblue hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Topper
        </button>
      </div>

      <div className="flex gap-4">
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="all">All Classes</option>
          <option value="10">Class 10th</option>
          <option value="12">Class 12th</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center"><Loader className="w-8 h-8 animate-spin text-sricblue" /></div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No achievements found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 text-sm font-semibold text-gray-600">Student</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Performance</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Class & Year</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {achievements.map(ach => (
                  <tr key={ach._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{ach.name}</div>
                      {ach.stream && <div className="text-xs text-sricblue">{ach.stream}</div>}
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-bold text-green-600">{ach.percentage}%</span>
                        <span className="text-xs bg-gray-200 px-2 rounded-full">Rank {ach.rank}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">Class {ach.classGroup}</span>
                        <span>•</span>
                        <span>{ach.year}</span>
                      </div>
                    </td>
                    <td className="p-4 flex gap-2">
                      {ach.certificateUrl && (
                        <a href={ach.certificateUrl} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(ach._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <h3 className="font-bold text-lg text-gray-800">Add Achievement</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Student Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Percentage (%)</label>
                  <input type="text" name="percentage" value={formData.percentage} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Class Group</label>
                  <select name="classGroup" value={formData.classGroup} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue">
                    <option value="10">Class 10</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Year</label>
                  <input type="text" name="year" value={formData.year} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Stream (Optional)</label>
                  <input type="text" name="stream" value={formData.stream} onChange={handleInputChange} placeholder="e.g. Science" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Rank</label>
                  <input type="number" name="rank" value={formData.rank} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Certificate PDF (Optional)</label>
                <input type="file" accept=".pdf,image/*" onChange={e => setCertificateFile(e.target.files[0])} className="w-full border rounded-lg p-2" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-sricblue text-white rounded-lg font-bold flex justify-center mt-4">
                {isSubmitting ? <Loader className="w-5 h-5 animate-spin"/> : 'Save Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAchievements;
