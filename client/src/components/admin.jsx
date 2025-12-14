import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Home, Users, GraduationCap, DollarSign, Mail, Settings, 
  BarChart3, Calendar, Bell, Search, Download, Filter,
  LogOut, ChevronLeft, ChevronRight, Eye, CheckCircle, 
  XCircle, RefreshCw, FileText, UserCheck, UserX, Clock,
  TrendingUp, TrendingDown, MoreVertical, Shield,
  Trash2, Edit, EyeIcon, Check, X, MessageSquare,
  Phone, MapPin, Calendar as CalendarIcon, BookOpen,
  Archive, Image as ImageIcon, ExternalLink, File, Maximize2,
  ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [admissionsData, setAdmissionsData] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [contactsData, setContactsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: null,
    fileName: null,
    zoom: 1
  });
  
  // Notification counts
  const [notificationCounts, setNotificationCounts] = useState({
    admissions: 0,
    fees: 0,
    contacts: 0,
    total: 0
  });

  const API_BASE_URL = 'https://sitaram-inter-college.onrender.com/';

  // Image Modal Functions
  const handleViewImage = (imageUrl, fileName) => {
    const url = imageUrl;
    if (!url) {
      showToast('Image URL not available', 'error');
      return;
    }

    setImageModal({
      isOpen: true,
      imageUrl: url,
      fileName,
      zoom: 1
    });
  };

  const handleZoomIn = () => {
    setImageModal(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.25, 3)
    }));
  };

  const handleZoomOut = () => {
    setImageModal(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.25, 0.5)
    }));
  };

  const handleResetZoom = () => {
    setImageModal(prev => ({
      ...prev,
      zoom: 1
    }));
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    const isFormData = options && options.body && typeof options.body !== 'string' && options.body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      console.log(`📡 Fetching: ${url}`, { method: options.method || 'GET' });

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      // Check for 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
        return null;
      }

      // For 404 or other non-OK responses, try to parse body to show server message
      if (!response.ok) {
        let errorBody = null;
        try {
          const text = await response.text();
          errorBody = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          errorBody = { message: 'Unable to parse error response' };
        }

        if (response.status === 404) {
          console.error(`❌ Endpoint not found: ${url}`, errorBody || 'No body');
          const serverMsg = errorBody?.message || errorBody?.error || `Endpoint not found: ${url}`;
          throw new Error(serverMsg);
        }

        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          url,
          error: errorBody
        });

        const serverMsg = errorBody?.message || errorBody?.error || `HTTP error ${response.status}`;
        throw new Error(serverMsg);
      }

      // Try to parse JSON response
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('❌ Error parsing JSON response:', parseError);
        data = { success: false, message: 'Invalid JSON response' };
      }

      console.log(`✅ Response from ${url}:`, data.success ? 'Success' : 'Failed');
      return data;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      if (error.message && error.message.toLowerCase().includes('unauthorized')) {
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
      }
      throw error;
    }
  };

  const handleUploadReceipt = async (paymentId, file) => {
    if (!file) {
      showToast('Please choose a file to upload', 'error');
      return;
    }

    try {
      const form = new FormData();
      form.append('receipt', file);

      const res = await fetchWithAuth(`${API_BASE_URL}/api/fee-payments/${paymentId}/receipt`, {
        method: 'POST',
        body: form
      });

      if (res?.success && res.data) {
        showToast('Receipt uploaded successfully', 'success');
        // Update local state
        setFeesData(prev => prev.map(p => (String(p._id) === String(res.data.id) ? { ...p, cloudinaryFile: { secure_url: res.data.receiptUrl, public_id: res.data.cloudinaryId }, receiptFile: p.receiptFile } : p)));
        // Refresh the current payment details if open
        if (viewDetails && String(viewDetails._id) === String(paymentId)) {
          const updated = await fetchWithAuth(`${API_BASE_URL}/api/fee-payments/${paymentId}`);
          if (updated?.success && updated.data) setViewDetails(updated.data);
        }
      } else {
        const msg = res?.message || 'Upload failed';
        throw new Error(msg);
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.message || 'Error uploading receipt', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }
    
    // Load data based on current tab
    loadData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, [navigate, currentTab, searchTerm, statusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin-login');
        return;
      }

      switch (currentTab) {
        case 'dashboard':
          await loadDashboardData();
          break;
        case 'admissions':
          await loadAdmissions();
          break;
        case 'fees':
          await loadFeePayments();
          break;
        case 'contacts':
          await loadContacts();
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error loading data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard`);
      
      if (data?.success) {
        setStats(data.data);
        
        // Update notification counts
        const pendingAdmissions = data.data.admissionsByStatus?.find(s => s._id === 'pending')?.count || 0;
        const pendingPayments = data.data.paymentsByStatus?.find(s => s._id === 'pending')?.count || 0;
        const unreadContacts = data.data.counts?.unreadContacts || 0;
        
        setNotificationCounts({
          admissions: pendingAdmissions,
          fees: pendingPayments,
          contacts: unreadContacts,
          total: pendingAdmissions + pendingPayments + unreadContacts
        });
      }
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    }
  };

  const loadAdmissions = async () => {
    try {
      const url = new URL(`${API_BASE_URL}/api/admissions`);
      if (searchTerm) url.searchParams.append('search', searchTerm);
      if (statusFilter !== 'all') url.searchParams.append('status', statusFilter);
      
      const data = await fetchWithAuth(url.toString());
      if (data?.success) {
        setAdmissionsData(data.data);
      }
    } catch (error) {
      console.error('Error loading admissions:', error);
    }
  };

  const loadFeePayments = async () => {
    try {
      const url = new URL(`${API_BASE_URL}/api/fee-payments`);
      if (searchTerm) url.searchParams.append('search', searchTerm);
      if (statusFilter !== 'all') url.searchParams.append('status', statusFilter);
      
      const data = await fetchWithAuth(url.toString());
      if (data?.success) {
        setFeesData(data.data);
      }
    } catch (error) {
      console.error('Error loading fee payments:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const url = new URL(`${API_BASE_URL}/api/contacts`);
      if (searchTerm) url.searchParams.append('search', searchTerm);
      if (statusFilter !== 'all') url.searchParams.append('status', statusFilter);
      
      const data = await fetchWithAuth(url.toString());
      if (data?.success) {
        setContactsData(data.data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleUpdateStatus = async (type, id, status, notes = '') => {
    try {
      // Guard: ensure the item exists locally before calling server
      if (type === 'admission') {
        const exists = admissionsData.some(a => String(a._id) === String(id));
        if (!exists) {
          showToast('Admission not found locally. Refreshing list...', 'error');
          await loadAdmissions();
          return;
        }
      } else if (type === 'fee') {
        const exists = feesData.some(f => String(f._id) === String(id));
        if (!exists) {
          showToast('Fee payment not found locally. Refreshing list...', 'error');
          await loadFeePayments();
          return;
        }
      } else if (type === 'contact') {
        const exists = contactsData.some(c => String(c._id) === String(id));
        if (!exists) {
          showToast('Contact not found locally. Refreshing list...', 'error');
          await loadContacts();
          return;
        }
      }

      let endpoint = '';
      let body = { status };
      
      if (type === 'admission') {
        endpoint = `/api/admissions/${id}/status`;
        if (notes) body.adminNotes = notes;
      } else if (type === 'fee') {
        endpoint = `/api/fee-payments/${id}/status`;
        if (notes) body.verificationNotes = notes;
      } else if (type === 'contact') {
        endpoint = `/api/contacts/${id}/status`;
        if (notes) body.responseMessage = notes;
      }
      
      console.log(`📡 Updating ${type} status: ${endpoint}`, body);
      
      const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (response?.success) {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} status updated to ${status}`, 'success');
        
        // Refresh the current data
        switch (currentTab) {
          case 'admissions':
            await loadAdmissions();
            break;
          case 'fees':
            await loadFeePayments();
            break;
          case 'contacts':
            await loadContacts();
            break;
          default:
            await loadDashboardData();
        }
        
        setViewDetails(null); // Close details view if open
      } else {
        // Surface server message when available
        const msg = response?.message || response?.error || 'Failed to update status';
        throw new Error(msg);
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      // If server returned not-found, show that message
      if (error.message && /not found/i.test(error.message)) {
        showToast(error.message, 'error');
        // Refresh current list to reflect latest server state
        if (currentTab === 'admissions') await loadAdmissions();
        if (currentTab === 'fees') await loadFeePayments();
        if (currentTab === 'contacts') await loadContacts();
        return;
      }
      showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      // Guard: ensure the item exists locally before calling server
      if (type === 'admission') {
        const exists = admissionsData.some(a => String(a._id) === String(id));
        if (!exists) {
          showToast('Admission not found locally. Refreshing list...', 'error');
          await loadAdmissions();
          return;
        }
      } else if (type === 'fee') {
        const exists = feesData.some(f => String(f._id) === String(id));
        if (!exists) {
          showToast('Fee payment not found locally. Refreshing list...', 'error');
          await loadFeePayments();
          return;
        }
      } else if (type === 'contact') {
        const exists = contactsData.some(c => String(c._id) === String(id));
        if (!exists) {
          showToast('Contact not found locally. Refreshing list...', 'error');
          await loadContacts();
          return;
        }
      }

      let endpoint = '';
      
      if (type === 'admission') {
        endpoint = `/api/admissions/${id}`;
      } else if (type === 'fee') {
        endpoint = `/api/fee-payments/${id}`;
      } else if (type === 'contact') {
        endpoint = `/api/contacts/${id}`;
      }
      
      const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE'
      });
      
      if (response?.success) {
        showToast(`${type} deleted successfully`, 'success');
        loadData(); // Refresh data
      } else {
        const msg = response?.message || response?.error || 'Failed to delete';
        throw new Error(msg);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      if (error.message && /not found/i.test(error.message)) {
        showToast(error.message, 'error');
        // Refresh list
        loadData();
        return;
      }
      showToast('Error deleting item', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminOTP');
    localStorage.removeItem('otpEmail');
    navigate('/admin-login');
  };

  const openExternal = async (input) => {
    // input can be a URL string or a payment object (or cloudinaryFile object)
    let url = typeof input === 'string' ? input : getFileUrl(input);

    // If URL not found locally, try to fetch latest payment record from server (by id)
    if (!url && input && input._id) {
      try {
          const res = await fetchWithAuth(`${API_BASE_URL}/api/fee-payments/${input._id}`);
          if (res) {
            // server may return receiptUrl at top-level or inside data
            url = res.receiptUrl || (res.data && (getFileUrl(res.data) || res.data.cloudinaryFile?.secure_url || res.data.receiptFile?.url));
          // Update local state for that payment if present
            if (res.data) setFeesData(prev => prev.map(p => (String(p._id) === String(res.data._id) ? res.data : p)));
        }
      } catch (err) {
        console.error('Error fetching payment for URL fallback:', err);
      }
    }

    if (!url) {
      showToast('File URL is not available', 'error');
      console.debug('openExternal: no URL found for input:', input);
      return;
    }

    // Normalize protocol-relative URLs
    if (url.startsWith('//')) url = 'https:' + url;

    // First try to open directly
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWindow) throw new Error('Popup blocked or window.open returned null');
      return;
    } catch (err) {
      console.warn('Direct open failed, attempting blob fallback:', err);
    }

    // Blob fallback: fetch the file and open as blob URL
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch file: ${resp.status}`);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
      // release after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000);
      return;
    } catch (err) {
      console.error('openExternal blob fallback failed:', err);
      showToast('Unable to open file. Check console for details.', 'error');
    }
  };

  const getFileUrl = (paymentOrCloudinary) => {
    if (!paymentOrCloudinary) return null;

    // Accept either the payment object or the cloudinaryFile object
    // Determine payment object vs cloudinaryFile object
    const payment = paymentOrCloudinary;
    let cf = payment && payment.cloudinaryFile ? payment.cloudinaryFile : paymentOrCloudinary;

    if (!cf) cf = paymentOrCloudinary;

    // If stored as string, try to parse
    if (typeof cf === 'string') {
      try {
        cf = JSON.parse(cf);
      } catch (e) {
        // not JSON, continue
      }
    }

    // Helper to test URL-like strings and normalize
    const isUrlString = (s) => typeof s === 'string' && (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//'));

    // Common candidate properties on cloudinaryFile
    const candidates = [
      cf?.secure_url, cf?.secureUrl, cf?.url, cf?.path, cf?.original_url, cf?.public_url, cf?.secureUrl
    ];
    for (const c of candidates) {
      if (isUrlString(c)) return c;
    }

    // Also check top-level payment fields (receiptUrl, receiptFile.url, etc.)
    if (payment) {
      if (isUrlString(payment.receiptUrl)) return payment.receiptUrl;
      if (payment.receiptFile && isUrlString(payment.receiptFile.url)) return payment.receiptFile.url;
      if (isUrlString(payment.cloudinaryUrl)) return payment.cloudinaryUrl;
    }

    // Recursively search for first URL string
    const findUrl = (obj, seen = new Set()) => {
      if (!obj || typeof obj !== 'object') return null;
      if (seen.has(obj)) return null;
      seen.add(obj);
      for (const key of Object.keys(obj)) {
        try {
          const val = obj[key];
          if (isUrlString(val)) return val;
          if (typeof val === 'object') {
            const found = findUrl(val, seen);
            if (found) return found;
          }
        } catch (e) {
          // ignore
        }
      }
      return null;
    };

    return findUrl(cf) || null;
  };

  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: XCircle },
      verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verified', icon: CheckCircle },
      unverified: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Verification', icon: Clock },
      unread: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Unread', icon: Mail },
      read: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Read', icon: Mail },
      replied: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Replied', icon: MessageSquare },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived', icon: Archive }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const renderAdmissionDetails = (admission) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{admission.name}</h3>
          <p className="text-gray-600">{admission.email}</p>
          <div className="mt-2">{renderStatusBadge(admission.status)}</div>
        </div>
        <button
          onClick={() => setViewDetails(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Student Information</h4>
          <div className="space-y-2">
            <p><span className="text-gray-500">Date of Birth:</span> {formatDate(admission.dob)}</p>
            <p><span className="text-gray-500">Mother Tongue:</span> {admission.motherTongue}</p>
            <p><span className="text-gray-500">Caste:</span> {admission.caste}</p>
            <p><span className="text-gray-500">Religion:</span> {admission.religion}</p>
            <p><span className="text-gray-500">Previous Class:</span> {admission.previousClass}</p>
            <p><span className="text-gray-500">Admission Class:</span> {admission.admissionClass}</p>
            <p><span className="text-gray-500">Previous School:</span> {admission.previousSchool}</p>
            <p><span className="text-gray-500">Admission Date:</span> {formatDate(admission.admissionDate)}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Parent Information</h4>
          <div className="space-y-2">
            <p><span className="text-gray-500">Father's Name:</span> {admission.fatherName}</p>
            <p><span className="text-gray-500">Mother's Name:</span> {admission.motherName}</p>
            <p><span className="text-gray-500">Father's Contact:</span> {admission.fatherContact}</p>
            <p><span className="text-gray-500">Mother's Contact:</span> {admission.motherContact || 'N/A'}</p>
            <p><span className="text-gray-500">Occupation:</span> {admission.occupation}</p>
            <p><span className="text-gray-500">Mother's Occupation:</span> {admission.motherOccupation || 'N/A'}</p>
          </div>
          
          <h4 className="font-semibold text-gray-700 mt-6 mb-3">Address</h4>
          <p className="text-gray-600">{admission.address}</p>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Submitted on {formatDateTime(admission.submittedAt)}</p>
            {admission.applicationNumber && (
              <p className="text-sm text-gray-500">Application #: {admission.applicationNumber}</p>
            )}
          </div>
          <div className="space-x-3">
            <button
              onClick={() => handleUpdateStatus('admission', admission._id, 'approved')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleUpdateStatus('admission', admission._id, 'rejected')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => handleDelete('admission', admission._id)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeePaymentDetails = (payment) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{payment.studentName}</h3>
          <p className="text-gray-600">{payment.email}</p>
          <div className="mt-2">{renderStatusBadge(payment.status)}</div>
        </div>
        <button
          onClick={() => setViewDetails(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Student Information</h4>
          <div className="space-y-2">
            <p><span className="text-gray-500">Father's Name:</span> {payment.fatherName}</p>
            <p><span className="text-gray-500">Mobile:</span> {payment.mobile}</p>
            <p><span className="text-gray-500">Class:</span> {payment.className}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Payment Information</h4>
          <div className="space-y-2">
            <p><span className="text-gray-500">Amount:</span> ₹{payment.amount?.toLocaleString('en-IN') || '0'}</p>
            <p><span className="text-gray-500">Payment Method:</span> {payment.paymentMethod}</p>
            <p><span className="text-gray-500">Transaction ID:</span> {payment.transactionId}</p>
            <p><span className="text-gray-500">Receipt Number:</span> {payment.receiptNumber}</p>
            <p><span className="text-gray-500">Receipt Date:</span> {formatDate(payment.receiptDate)}</p>
          </div>
        </div>
      </div>
      
      {/* Receipt File Section */}
      <div className="mt-8">
        <h4 className="font-semibold text-gray-700 mb-4">Payment Receipt</h4>
        
        {payment.cloudinaryFile ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  {payment.cloudinaryFile.resource_type === 'image' ? (
                    <ImageIcon className="w-8 h-8 text-green-600" />
                  ) : (
                    <File className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {payment.cloudinaryFile.original_filename || 'Payment Receipt'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{formatFileSize(payment.cloudinaryFile.bytes)}</span>
                    <span>•</span>
                    <span>{payment.cloudinaryFile.format?.toUpperCase() || 'Unknown Format'}</span>
                    <span>•</span>
                    <span>{payment.cloudinaryFile.resource_type === 'image' ? 'Image' : 'PDF'}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Primary View Button */}
                {payment.cloudinaryFile.resource_type === 'image' ? (
                  <button
                    onClick={() => handleViewImage(
                      getFileUrl(payment),
                      payment.cloudinaryFile?.original_filename || 'Receipt'
                    )}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                  >
                    <EyeIcon className="w-5 h-5" />
                    <span>View Screenshot</span>
                  </button>
                  ) : (
                  <button
                    onClick={() => openExternal(payment)}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                  >
                    <File className="w-5 h-5" />
                    <span>Open PDF</span>
                  </button>
                )}
                
                {/* External Link Button */}
                <button
                  onClick={() => openExternal(payment)}
                  className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300 flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Open New Tab</span>
                </button>
              </div>
            </div>
            
            {/* Image Preview Thumbnail */}
            {payment.cloudinaryFile.resource_type === 'image' && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-700">Screenshot Preview</h5>
                  <button
                    onClick={() => handleViewImage(
                      getFileUrl(payment),
                      payment.cloudinaryFile?.original_filename || 'Receipt'
                    )}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>Full Screen</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div 
                  className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleViewImage(
                      getFileUrl(payment),
                      payment.cloudinaryFile?.original_filename || 'Receipt'
                    )}
                >
                  <img
                    src={getFileUrl(payment)}
                    alt={`Receipt screenshot for ${payment.studentName}`}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <EyeIcon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
                {payment.cloudinaryFile.width && payment.cloudinaryFile.height && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Original Resolution: {payment.cloudinaryFile.width} × {payment.cloudinaryFile.height}px
                  </p>
                )}
              </div>
            )}
          </div>
        ) : payment.receiptFile ? (
          // Fallback for older local storage files
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="font-bold text-gray-900">Legacy Receipt File</p>
                  <p className="text-sm text-gray-600 mt-1">{payment.receiptFile.originalName}</p>
                </div>
              </div>
              <a
                href={payment.receiptFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-5 py-2.5 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>View File</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
            <div className="flex items-start space-x-4">
              <FileText className="w-8 h-8 text-red-600" />
              <div className="flex-1">
                <p className="font-bold text-red-800">No receipt file attached to this payment.</p>
                <p className="text-sm text-red-600 mt-1">The user did not upload any payment screenshot.</p>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Upload Receipt (admin)</label>
                  <div className="mt-2 flex items-center space-x-2">
                    <input id={`receipt-input-${payment._id}`} type="file" accept="image/*,application/pdf" className="text-sm" />
                    <button
                      onClick={async () => {
                        const input = document.getElementById(`receipt-input-${payment._id}`);
                        if (!input || !input.files || input.files.length === 0) {
                          showToast('Please select a file first', 'error');
                          return;
                        }
                        const file = input.files[0];
                        await handleUploadReceipt(payment._id, file);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Upload Receipt
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Accepted: JPG, PNG, WebP, GIF, PDF. Max 10MB.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Submitted on {formatDateTime(payment.submittedAt)}</p>
            {payment.verifiedAt && (
              <p className="text-sm text-gray-500">
                Verified on {formatDateTime(payment.verifiedAt)} by {payment.verifiedBy || 'Admin'}
              </p>
            )}
          </div>
          <div className="space-x-3">
            <button
              onClick={() => handleUpdateStatus('fee', payment._id, 'verified')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Verify</span>
            </button>
            <button
              onClick={() => handleUpdateStatus('fee', payment._id, 'rejected')}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => handleDelete('fee', payment._id)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactDetails = (contact) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
          <p className="text-gray-600">{contact.email}</p>
          <div className="mt-2">{renderStatusBadge(contact.status)}</div>
        </div>
        <button
          onClick={() => setViewDetails(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
          <div className="space-y-2">
            {contact.phone && <p><span className="text-gray-500">Phone:</span> {contact.phone}</p>}
            <p><span className="text-gray-500">Subject:</span> {contact.subject || 'General Inquiry'}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{contact.message}</p>
        </div>
        
        {contact.responseMessage && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Response</h4>
            <p className="text-gray-600 bg-blue-50 p-4 rounded-lg">{contact.responseMessage}</p>
            <p className="text-sm text-gray-500 mt-2">
              Responded on {formatDateTime(contact.respondedAt)} by {contact.respondedBy}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Submitted on {formatDateTime(contact.submittedAt)}</p>
          </div>
          <div className="space-x-3">
            {contact.status !== 'replied' && (
              <button
                onClick={() => {
                  const response = prompt('Enter your response:');
                  if (response) {
                    handleUpdateStatus('contact', contact._id, 'replied', response);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reply
              </button>
            )}
            <button
              onClick={() => handleUpdateStatus('contact', contact._id, 'archived')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Archive
            </button>
            <button
              onClick={() => handleDelete('contact', contact._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard charts data
  const applicationsByClass = stats?.monthlyAdmissions?.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    applications: item.count
  })) || [];

  const paymentStatusData = stats?.paymentsByStatus?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
  })) || [];

  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white flex items-center space-x-2`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Image View Modal */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-sricblue to-blue-800 text-white">
              <div className="flex items-center space-x-3">
                <ImageIcon className="w-6 h-6" />
                <div>
                  <h3 className="text-lg font-bold">{imageModal.fileName || 'Payment Receipt Screenshot'}</h3>
                  <p className="text-sm text-blue-200">Uploaded by user</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-900/30 px-3 py-1 rounded-lg">
                  <button
                    onClick={handleZoomOut}
                    className="p-1 hover:bg-blue-800 rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium">{(imageModal.zoom * 100).toFixed(0)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 hover:bg-blue-800 rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-1 hover:bg-blue-800 rounded transition-colors ml-2"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setImageModal({ isOpen: false, imageUrl: null, fileName: null, zoom: 1 })}
                  className="p-2 hover:bg-blue-800 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Image Container */}
            <div className="flex-1 overflow-auto bg-gray-900 p-4">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={imageModal.imageUrl}
                  alt="Payment receipt screenshot"
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${imageModal.zoom})` }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Tip:</span> Use zoom controls or scroll wheel to inspect transaction details</p>
                </div>
                <div className="flex space-x-3">
                  <a
                    href={imageModal.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in New Tab</span>
                  </a>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = imageModal.imageUrl;
                      link.download = imageModal.fileName || 'receipt-screenshot.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setImageModal({ isOpen: false, imageUrl: null, fileName: null, zoom: 1 })}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-sricblue to-blue-900 text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-xl">
                <Shield className="w-6 h-6 text-sricblue" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-lg tracking-tight">SRIC Admin</span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Main Section */}
          <div className="mb-8">
            <p className={`text-xs uppercase tracking-wider text-blue-300 mb-3 ${
              sidebarCollapsed ? 'text-center' : 'px-3'
            }`}>Main</p>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-blue-800 text-white shadow-lg'
                  : 'hover:bg-blue-800/50'
              }`}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>
          </div>

          {/* Applications Section */}
          <div className="mb-8">
            <p className={`text-xs uppercase tracking-wider text-blue-300 mb-3 ${
              sidebarCollapsed ? 'text-center' : 'px-3'
            }`}>Applications</p>
            
            <button
              onClick={() => setCurrentTab('admissions')}
              className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all ${
                currentTab === 'admissions'
                  ? 'bg-blue-800 text-white shadow-lg'
                  : 'hover:bg-blue-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Admissions</span>}
              </div>
              {notificationCounts.admissions > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCounts.admissions}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('fees')}
              className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all ${
                currentTab === 'fees'
                  ? 'bg-blue-800 text-white shadow-lg'
                  : 'hover:bg-blue-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Fee Payments</span>}
              </div>
              {notificationCounts.fees > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCounts.fees}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('contacts')}
              className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all ${
                currentTab === 'contacts'
                  ? 'bg-blue-800 text-white shadow-lg'
                  : 'hover:bg-blue-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Contact Forms</span>}
              </div>
              {notificationCounts.contacts > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCounts.contacts}
                </span>
              )}
            </button>
          </div>

          {/* Management Section */}
          <div className="mb-8">
            <p className={`text-xs uppercase tracking-wider text-blue-300 mb-3 ${
              sidebarCollapsed ? 'text-center' : 'px-3'
            }`}>Management</p>
            
            <button
              onClick={() => setCurrentTab('reports')}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
                currentTab === 'reports'
                  ? 'bg-blue-800 text-white shadow-lg'
                  : 'hover:bg-blue-800/50'
              }`}
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Reports</span>}
            </button>

            <button
              onClick={() => setCurrentTab('settings')}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
                currentTab === 'settings'
                  ? 'bg-blue-800 text-white shadow-lg'
                  : 'hover:bg-blue-800/50'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Settings</span>}
            </button>
          </div>

          {/* Bottom Links */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
            <Link
              to="/"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-800/50 transition-all mb-2"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              {!sidebarCollapsed && <span>View Website</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                {currentTab === 'dashboard' && 'Dashboard'}
                {currentTab === 'admissions' && 'Admission Applications'}
                {currentTab === 'fees' && 'Fee Payments'}
                {currentTab === 'contacts' && 'Contact Messages'}
                {currentTab === 'reports' && 'Reports & Analytics'}
                {currentTab === 'settings' && 'Settings'}
              </h1>
              
              <div className="flex items-center space-x-4">
                {currentTab !== 'dashboard' && (
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      {currentTab === 'admissions' && (
                        <>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </>
                      )}
                      {currentTab === 'fees' && (
                        <>
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </>
                      )}
                      {currentTab === 'contacts' && (
                        <>
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </>
                      )}
                    </select>
                    <button
                      onClick={loadData}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Notifications */}
                <div className="relative">
                  <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notificationCounts.total > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCounts.total}
                      </span>
                    )}
                  </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src="https://ui-avatars.com/api/?name=Admin+User&background=002366&color=fff"
                      alt="Admin User"
                      className="w-10 h-10 rounded-full border-2 border-blue-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">Super Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : viewDetails ? (
            <div className="space-y-6">
              {currentTab === 'admissions' && renderAdmissionDetails(viewDetails)}
              {currentTab === 'fees' && renderFeePaymentDetails(viewDetails)}
              {currentTab === 'contacts' && renderContactDetails(viewDetails)}
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {currentTab === 'dashboard' && stats && (
                <div className="space-y-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Admissions</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.counts?.admissions || 0}</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500 text-sm">+12%</span>
                            <span className="text-gray-400 text-sm ml-2">from last month</span>
                          </div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Fee Payments</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.counts?.feePayments || 0}</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500 text-sm">+8%</span>
                            <span className="text-gray-400 text-sm ml-2">from last month</span>
                          </div>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Contact Messages</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.counts?.contacts || 0}</p>
                          <div className="flex items-center mt-2">
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-red-500 text-sm">-3%</span>
                            <span className="text-gray-400 text-sm ml-2">from last month</span>
                          </div>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <Mail className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Approved Students</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.counts?.approvedAdmissions || 0}</p>
                          <div className="flex items-center mt-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500 text-sm">{stats.counts?.admissions ? Math.round((stats.counts.approvedAdmissions / stats.counts.admissions) * 100) : 0}%</span>
                            <span className="text-gray-400 text-sm ml-2">approval rate</span>
                          </div>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-xl">
                          <Users className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Applications Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Monthly Applications</h3>
                        <div className="text-sm text-gray-500">Last 6 months</div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={applicationsByClass}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar 
                              dataKey="applications" 
                              fill="#002366" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Payment Status Chart */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Payment Status</h3>
                        <div className="text-sm text-gray-500">Total: {stats.counts?.feePayments || 0} payments</div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={paymentStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {paymentStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Admissions */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Admissions</h3>
                        <button 
                          onClick={() => setCurrentTab('admissions')}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-4">
                        {stats.recentAdmissions?.slice(0, 5).map((admission) => (
                          <div key={admission._id} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="p-3 rounded-xl mr-4 bg-blue-100 text-blue-600">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-800">{admission.name}</h4>
                                  <p className="text-gray-600 text-sm mt-1">{admission.admissionClass}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {renderStatusBadge(admission.status)}
                                  <span className="text-gray-400 text-sm">{formatDate(admission.submittedAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Payments</h3>
                        <button 
                          onClick={() => setCurrentTab('fees')}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-4">
                        {stats.recentFeePayments?.slice(0, 5).map((payment) => (
                          <div key={payment._id} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className={`p-3 rounded-xl mr-4 ${
                              payment.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              <DollarSign className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-800">{payment.studentName}</h4>
                                  <p className="text-gray-600 text-sm mt-1">₹{payment.amount?.toLocaleString('en-IN') || '0'} - {payment.className}</p>
                                  {payment.cloudinaryFile && (
                                    <div className="flex items-center mt-1">
                                      {payment.cloudinaryFile.resource_type === 'image' ? (
                                        <ImageIcon className="w-3 h-3 text-green-500 mr-1" />
                                      ) : (
                                        <File className="w-3 h-3 text-red-500 mr-1" />
                                      )}
                                      <span className="text-xs text-gray-500">Cloudinary</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  {renderStatusBadge(payment.status)}
                                  <span className="text-gray-400 text-sm">{formatDate(payment.submittedAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Tab - No Stats */}
              {currentTab === 'dashboard' && !stats && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard</h3>
                    <p className="text-gray-500">Fetching dashboard data...</p>
                    <button 
                      onClick={loadDashboardData}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Retry Loading
                    </button>
                  </div>
                </div>
              )}

              {/* Admissions Tab */}
              {currentTab === 'admissions' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                      <h2 className="text-2xl font-bold text-gray-800">Admission Applications ({admissionsData.length})</h2>
                      <div className="flex items-center space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    {admissionsData.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Admissions Found</h3>
                        <p className="text-gray-500">No admission applications match your search criteria.</p>
                        <button 
                          onClick={loadAdmissions}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Refresh Data
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Father's Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {admissionsData.map((admission) => (
                              <tr key={admission._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={`https://ui-avatars.com/api/?name=${admission.name}&background=002366&color=fff`}
                                      alt={admission.name}
                                    />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{admission.name}</div>
                                      <div className="text-sm text-gray-500">{admission.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{admission.admissionClass}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{admission.fatherName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {admission.fatherContact}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(admission.submittedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {renderStatusBadge(admission.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <button 
                                    onClick={() => setViewDetails(admission)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <EyeIcon className="w-4 h-4 inline mr-1" /> View
                                  </button>
                                  {admission.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={() => handleUpdateStatus('admission', admission._id, 'approved')}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        <CheckCircle className="w-4 h-4 inline mr-1" /> Approve
                                      </button>
                                      <button 
                                        onClick={() => handleUpdateStatus('admission', admission._id, 'rejected')}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <XCircle className="w-4 h-4 inline mr-1" /> Reject
                                      </button>
                                    </>
                                  )}
                                  <button 
                                    onClick={() => handleDelete('admission', admission._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fees Tab */}
              {currentTab === 'fees' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                      <h2 className="text-2xl font-bold text-gray-800">Fee Payments ({feesData.length})</h2>
                      <div className="flex items-center space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    {feesData.length === 0 ? (
                      <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Fee Payments Found</h3>
                        <p className="text-gray-500">No fee payments match your search criteria.</p>
                        <button 
                          onClick={loadFeePayments}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Refresh Data
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Class
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Receipt #
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {feesData.map((payment) => (
                              <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={`https://ui-avatars.com/api/?name=${payment.studentName}&background=002366&color=fff`}
                                      alt={payment.studentName}
                                    />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                                      <div className="text-sm text-gray-500">{payment.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{payment.className}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-gray-900">₹{payment.amount?.toLocaleString('en-IN') || '0'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {payment.receiptNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {payment.cloudinaryFile ? (
                                    <div className="flex items-center space-x-1">
                                      {payment.cloudinaryFile.resource_type === 'image' ? (
                                        <>
                                          <ImageIcon className="w-4 h-4 text-green-600" />
                                          <span className="text-xs text-gray-600">Image</span>
                                        </>
                                      ) : (
                                        <>
                                          <File className="w-4 h-4 text-red-600" />
                                          <span className="text-xs text-gray-600">PDF</span>
                                        </>
                                      )}
                                      <span className="text-xs text-gray-400 ml-1">☁️</span>
                                    </div>
                                  ) : payment.receiptFile ? (
                                    <div className="flex items-center space-x-1">
                                      <FileText className="w-4 h-4 text-blue-600" />
                                      <span className="text-xs text-gray-600">File</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-400">No file</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(payment.receiptDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {renderStatusBadge(payment.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <button 
                                    onClick={() => setViewDetails(payment)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <EyeIcon className="w-4 h-4 inline mr-1" /> View
                                  </button>
                                  {payment.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={() => handleUpdateStatus('fee', payment._id, 'verified')}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        <Check className="w-4 h-4 inline mr-1" /> Verify
                                      </button>
                                      <button 
                                        onClick={() => handleUpdateStatus('fee', payment._id, 'rejected')}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <X className="w-4 h-4 inline mr-1" /> Reject
                                      </button>
                                    </>
                                  )}
                                  <button 
                                    onClick={() => handleDelete('fee', payment._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contacts Tab */}
              {currentTab === 'contacts' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                      <h2 className="text-2xl font-bold text-gray-800">Contact Messages ({contactsData.length})</h2>
                      <div className="flex items-center space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    {contactsData.length === 0 ? (
                      <div className="text-center py-12">
                        <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Contact Messages Found</h3>
                        <p className="text-gray-500">No contact messages match your search criteria.</p>
                        <button 
                          onClick={loadContacts}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Refresh Data
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subject
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Message Preview
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {contactsData.map((contact) => (
                              <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={`https://ui-avatars.com/api/?name=${contact.name}&background=002366&color=fff`}
                                      alt={contact.name}
                                    />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                      {contact.phone && (
                                        <div className="text-sm text-gray-500">{contact.phone}</div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {contact.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{contact.subject || 'General Inquiry'}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {contact.message}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(contact.submittedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {renderStatusBadge(contact.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <button 
                                    onClick={() => setViewDetails(contact)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <EyeIcon className="w-4 h-4 inline mr-1" /> View
                                  </button>
                                  {contact.status === 'unread' && (
                                    <button 
                                      onClick={() => handleUpdateStatus('contact', contact._id, 'read')}
                                      className="text-gray-600 hover:text-gray-900"
                                    >
                                      <Mail className="w-4 h-4 inline mr-1" /> Mark Read
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleDelete('contact', contact._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {currentTab === 'reports' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {/* Applications Chart */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Applications by Class</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={applicationsByClass}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="name" stroke="#666" />
                              <YAxis stroke="#666" />
                              <Tooltip />
                              <Bar dataKey="applications" fill="#002366" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Payment Status Chart */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Status Distribution</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={paymentStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {paymentStatusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats?.counts?.admissions || 0}</div>
                          <div className="text-sm text-gray-500">Total Admissions</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">{stats?.counts?.feePayments || 0}</div>
                          <div className="text-sm text-gray-500">Total Payments</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats?.counts?.contacts || 0}</div>
                          <div className="text-sm text-gray-500">Total Contacts</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {stats?.counts?.admissions ? Math.round((stats.counts.approvedAdmissions / stats.counts.admissions) * 100) : 0}%
                          </div>
                          <div className="text-sm text-gray-500">Approval Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {currentTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="text-center py-12">
                      <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Admin Settings</h3>
                      <p className="text-gray-500">Configure system preferences and user permissions</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
