import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader, Plus, X } from 'lucide-react';
import { apiUrl } from '../../lib/config';

const AdminGallery = ({ showToast }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState('all');
  
  const [uploadModal, setUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('general');
  const [album, setAlbum] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, [category]);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const endpoint = category === 'all' ? '/api/gallery' : `/api/gallery?category=${category}`;
      const res = await fetch(apiUrl(endpoint));
      const data = await res.json();
      if (data.success) {
        setPhotos(data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load gallery', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a file', 'error');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', uploadCategory);
    formData.append('album', album);

    try {
      const res = await fetch(apiUrl('/api/gallery/upload'), {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast('Photo uploaded successfully', 'success');
        setUploadModal(false);
        setFile(null);
        setTitle('');
        setDescription('');
        setAlbum('');
        fetchPhotos();
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const res = await fetch(apiUrl(`/api/gallery/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Photo deleted', 'success');
        fetchPhotos();
      } else {
        showToast('Delete failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gallery Manager</h2>
          <p className="text-sm text-gray-500">Manage photos for the Photos & Videos section.</p>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="bg-sricblue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photo</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 overflow-x-auto">
        {['all', 'events', 'achievements', 'cultural', 'competitions', 'general'].map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-colors ${
              category === c ? 'bg-sricblue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 text-sricblue animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No photos found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map(photo => (
            <div key={photo._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
              <div className="relative h-48 bg-gray-100">
                <img src={photo.secureUrl} alt={photo.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDelete(photo._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-bold text-sricblue uppercase inline-block mb-1 bg-blue-50 px-2 py-0.5 rounded">{photo.category}</span>
                <h3 className="font-bold text-gray-800 line-clamp-1">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Upload New Photo</h3>
              <button onClick={() => setUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image File</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Annual Sports Day 2025"
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 ring-sricblue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 ring-sricblue"
                >
                  <option value="events">Events</option>
                  <option value="achievements">Achievements</option>
                  <option value="cultural">Cultural</option>
                  <option value="competitions">Competitions</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Album (Optional)</label>
                <select
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 ring-sricblue"
                >
                  <option value="">No Album (General Gallery)</option>
                  <option value="farewell-album">Farewell 2026</option>
                  <option value="prize-album">Prize Day 2026</option>
                  <option value="independence-album">Independence Day</option>
                  <option value="teacher-album">Teacher Recognition</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full py-3 mt-4 bg-sricblue text-white rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2"
              >
                {isUploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading ? 'Uploading...' : 'Upload Now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
