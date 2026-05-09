import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader, FileText, X, AlertTriangle } from 'lucide-react';
import { apiUrl } from '../../lib/config';

const AdminExamSchedules = ({ showToast }) => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    examType: 'Quarterly',
    academicYear: '2026-27',
    status: 'Upcoming',
    noticeText: '',
    colorTheme: 'blue'
  });
  
  const [datesList, setDatesList] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl('/api/examschedules'));
      const data = await res.json();
      if (data.success) {
        setSchedules(data.data);
      }
    } catch (err) {
      showToast('Failed to load exam schedules', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDateRow = () => {
    setDatesList([...datesList, { date: '', subject: '', classes: '9-12' }]);
  };

  const removeDateRow = (idx) => {
    setDatesList(datesList.filter((_, i) => i !== idx));
  };

  const handleDateChange = (idx, field, value) => {
    const newDates = [...datesList];
    newDates[idx][field] = value;
    setDatesList(newDates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('dates', JSON.stringify(datesList));
    if (pdfFile) data.append('pdfFile', pdfFile);

    try {
      const res = await fetch(apiUrl('/api/examschedules'), {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        showToast('Exam schedule added successfully', 'success');
        setModalOpen(false);
        resetForm();
        fetchSchedules();
      } else {
        showToast(result.message || 'Failed to add schedule', 'error');
      }
    } catch (err) {
      showToast('Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this exam schedule?')) return;
    try {
      const res = await fetch(apiUrl(`/api/examschedules/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Deleted schedule successfully', 'success');
        fetchSchedules();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', examType: 'Quarterly', academicYear: '2026-27',
      status: 'Upcoming', noticeText: '', colorTheme: 'blue'
    });
    setDatesList([]);
    setPdfFile(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Exam Schedules</h2>
          <p className="text-sm text-gray-500 mt-1">Manage exam timetables and announcements.</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="bg-sricblue hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Schedule
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center"><Loader className="w-8 h-8 animate-spin text-sricblue" /></div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <AlertTriangle className="w-12 h-12 text-sricgold mx-auto mb-3" />
          <p className="text-gray-500">No exam schedules found. Add one to display it on the Home Page and Calendar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 text-sm font-semibold text-gray-600">Exam Title</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Type & Year</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Dates Info</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schedules.map(schedule => (
                  <tr key={schedule._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{schedule.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{schedule.noticeText}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{schedule.examType}</div>
                      <div className="text-xs text-sricblue">{schedule.academicYear}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        schedule.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' :
                        schedule.status === 'Ongoing' ? 'bg-red-100 text-red-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {schedule.dates && schedule.dates.length > 0 
                          ? `${schedule.dates.length} Subject(s) configured` 
                          : 'No subjects listed'}
                      </div>
                    </td>
                    <td className="p-4 flex gap-2">
                      {schedule.pdfUrl && (
                        <a href={schedule.pdfUrl} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View PDF">
                          <FileText className="w-5 h-5" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(schedule._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
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

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-white border-b p-4 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg text-gray-800">Add Exam Schedule</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-gray-500 hover:text-red-500" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grow space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Schedule Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue" placeholder="e.g. Quarterly Examination Schedule 2026-27"/>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Exam Type <span className="text-red-500">*</span></label>
                  <select name="examType" value={formData.examType} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue">
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Pre-Board">Pre-Board</option>
                    <option value="Annual">Annual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Academic Year</label>
                  <input type="text" name="academicYear" value={formData.academicYear} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue"/>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Background Theme</label>
                  <select name="colorTheme" value={formData.colorTheme} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue">
                    <option value="blue">Blue Gradient</option>
                    <option value="red">Red/Orange Gradient</option>
                    <option value="green">Green Gradient</option>
                    <option value="purple">Purple Gradient</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Special Notice Text (Optional)</label>
                  <textarea name="noticeText" rows="2" value={formData.noticeText} onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-sricblue" placeholder="e.g. All students must be present at 8:00 AM"></textarea>
                </div>
              </div>

              {/* Subject Configurator */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-700">Subject Preview Grid (Optional)</h4>
                  <button type="button" onClick={addDateRow} className="text-sricblue text-sm font-bold flex items-center gap-1 hover:underline">
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </div>
                <div className="space-y-3">
                  {datesList.map((dt, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-lg border shadow-sm">
                      <input type="date" value={dt.date.substring(0, 10)} onChange={(e) => handleDateChange(idx, 'date', e.target.value)} required className="border rounded-md p-1.5 focus:outline-none focus:ring-1 text-sm"/>
                      <input type="text" placeholder="Subject (e.g. English)" value={dt.subject} onChange={(e) => handleDateChange(idx, 'subject', e.target.value)} required className="border rounded-md p-1.5 focus:outline-none focus:ring-1 flex-1 text-sm"/>
                      <input type="text" placeholder="Classes (e.g. 9-10)" value={dt.classes} onChange={(e) => handleDateChange(idx, 'classes', e.target.value)} required className="border rounded-md p-1.5 focus:outline-none focus:ring-1 w-24 text-sm"/>
                      <button type="button" onClick={() => removeDateRow(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                  {datesList.length === 0 && <p className="text-xs text-gray-500 italic">No subject dates added. Will use default fallback display or just PDF.</p>}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Official Datesheet PDF (Required for Download)</label>
                <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} className="w-full border rounded-lg p-2" />
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-sricblue text-white rounded-xl font-bold flex justify-center mt-4 text-lg hover:bg-blue-800 transition-colors shadow-lg">
                {isSubmitting ? <Loader className="w-6 h-6 animate-spin"/> : 'Publish Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExamSchedules;
