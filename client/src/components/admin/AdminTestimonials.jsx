import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MessageSquare, Loader, X, Star, Eye, EyeOff, User } from 'lucide-react';
import { apiUrl } from '../../lib/config';

const AdminTestimonials = ({ showToast }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    batch: '',
    content: '',
    rating: 5
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl('/api/testimonials/all'));
      const data = await res.json();
      if (data.success) setTestimonials(data.data);
    } catch (err) {
      showToast('Error loading testimonials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      showToast('Name and testimonial content are required', 'error');
      return;
    }
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedPhoto) data.append('photo', selectedPhoto);

    try {
      const res = await fetch(apiUrl('/api/testimonials'), {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        showToast('Testimonial added successfully!', 'success');
        setModalOpen(false);
        resetForm();
        fetchTestimonials();
      } else {
        showToast(result.message || 'Failed to add testimonial', 'error');
      }
    } catch (err) {
      showToast('Failed to add testimonial', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', designation: '', batch: '', content: '', rating: 5 });
    setSelectedPhoto(null);
    setPhotoPreview('');
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/testimonials/${id}/toggle`), { method: 'PATCH' });
      const result = await res.json();
      if (result.success) {
        showToast(result.message, 'success');
        fetchTestimonials();
      }
    } catch (err) {
      showToast('Error updating testimonial', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    try {
      const res = await fetch(apiUrl(`/api/testimonials/${id}`), { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showToast('Testimonial deleted', 'success');
        fetchTestimonials();
      }
    } catch (err) {
      showToast('Error deleting testimonial', 'error');
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onRate(star) : undefined}
            className={interactive ? 'cursor-pointer focus:outline-none' : 'cursor-default'}
          >
            <Star
              className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-sricgold' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Testimonials Manager</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add and manage testimonials from students and alumni. ({testimonials.filter(t => t.isActive).length} active)
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="bg-sricblue hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-sricblue">{testimonials.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Testimonials</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-green-600">{testimonials.filter(t => t.isActive).length}</p>
          <p className="text-sm text-gray-500 mt-1">Published (Active)</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-400">{testimonials.filter(t => !t.isActive).length}</p>
          <p className="text-sm text-gray-500 mt-1">Hidden</p>
        </div>
      </div>

      {/* Testimonials List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-sricblue" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">No testimonials yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Testimonial" to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map(t => (
            <div
              key={t._id}
              className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${
                t.isActive ? 'border-gray-100' : 'border-dashed border-gray-300 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {t.photoUrl ? (
                    <img
                      src={t.photoUrl}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 shadow"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sricblue to-blue-400 flex items-center justify-center shadow">
                      <User className="w-7 h-7 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-800">{t.name}</h3>
                    {!t.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">HIDDEN</span>
                    )}
                  </div>
                  {t.designation && <p className="text-sm text-blue-600 font-medium">{t.designation}</p>}
                  {t.batch && <p className="text-xs text-gray-400 mb-2">{t.batch}</p>}
                  {renderStars(t.rating)}
                  <p className="text-gray-600 text-sm mt-3 italic leading-relaxed">"{t.content}"</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Added {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(t._id)}
                    title={t.isActive ? 'Hide testimonial' : 'Show testimonial'}
                    className={`p-2 rounded-lg transition-colors ${
                      t.isActive
                        ? 'text-green-500 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {t.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b bg-gradient-to-r from-sricblue to-blue-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                <h3 className="font-bold text-lg">Add New Testimonial</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="hover:bg-blue-800 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Photo Upload */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-blue-100 flex-shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Photo <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sricblue"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sricblue"
                  />
                </div>

                {/* Batch */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Batch / Year <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                      placeholder="e.g. Class of 2018"
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sricblue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Designation <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g. Engineer at TCS"
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sricblue"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  {renderStars(
                    parseInt(formData.rating),
                    true,
                    (star) => setFormData(prev => ({ ...prev, rating: star }))
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Testimonial Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Write the student's or alumni's testimonial here..."
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sricblue resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{formData.content.length} characters</p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-sricblue hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center transition-colors"
                >
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    'Add Testimonial'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
