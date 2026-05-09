import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Megaphone, Loader, X, FileText } from 'lucide-react';

const AdminAnnouncements = ({ showToast }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'general',
    isUrgent: false, isNew: true
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success) setAnnouncements(data.data);
    } catch (err) {
      showToast('Error loading announcements', 'error');
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
    for (let i=0; i<files.length; i++) {
        data.append('attachments', files[i]);
    }

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if(result.success) {
        showToast('Announcement posted', 'success');
        setModalOpen(false);
        setFormData({ title: '', content: '', category: 'general', isUrgent: false, isNew: true });
        setFiles([]);
        fetchAnnouncements();
      }
    } catch (err) {
      showToast('Failed to post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if(res.ok) {
        showToast('Deleted successfully', 'success');
        fetchAnnouncements();
      }
    } catch (err) {
      showToast('Error deleting', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notice Board</h2>
          <p className="text-sm text-gray-500 mt-1">Manage announcements and notices.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-sricblue hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold">
          <Plus className="w-5 h-5"/> New Notice
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center"><Loader className="w-8 h-8 animate-spin text-sricblue" /></div>
      ) : (
        <div className="grid gap-4">
          {announcements.map(anc => (
            <div key={anc._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-start">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-gray-800">{anc.title}</h3>
                  {anc.isNew && <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">NEW</span>}
                  {anc.isUrgent && <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full pulse">URGENT</span>}
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-line">{anc.content}</p>
                <div className="text-xs text-gray-400 font-semibold">{new Date(anc.publishedAt).toLocaleDateString()}</div>
                
                {anc.attachments?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {anc.attachments.map((att, i) => (
                      <a key={i} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-sricblue bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                        <FileText className="w-3.5 h-3.5"/> {att.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0">
                <button onClick={() => handleDelete(anc._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
         <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
           <div className="p-4 border-b flex justify-between items-center">
             <h3 className="font-bold text-lg">Create Announcement</h3>
             <button onClick={() => setModalOpen(false)}><X className="w-5 h-5"/></button>
           </div>
           <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div>
               <label className="block text-sm font-semibold mb-1">Title</label>
               <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full border rounded-lg p-2.5"/>
             </div>
             <div>
               <label className="block text-sm font-semibold mb-1">Content</label>
               <textarea name="content" value={formData.content} onChange={handleInputChange} required rows="4" className="w-full border rounded-lg p-2.5"></textarea>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold mb-1">Category</label>
                 <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border rounded-lg p-2.5">
                   <option value="general">General</option>
                   <option value="academic">Academic</option>
                   <option value="events">Events</option>
                   <option value="holiday">Holiday</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1">Attachments (Max 5)</label>
                 <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="w-full border rounded-lg p-2 text-sm"/>
               </div>
             </div>
             <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                  <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleInputChange} className="w-4 h-4 text-sricblue"/>
                  Mark as Urgent
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                  <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleInputChange} className="w-4 h-4 text-sricblue"/>
                  Show 'New' Badge
                </label>
             </div>
             <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-3 bg-sricblue text-white rounded-lg font-bold flex justify-center">
               {isSubmitting ? <Loader className="w-5 h-5 animate-spin"/> : 'Post Announcement'}
             </button>
           </form>
         </div>
       </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
