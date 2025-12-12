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
  Archive, Image as ImageIcon, ExternalLink, File
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
  
  // Notification counts
  const [notificationCounts, setNotificationCounts] = useState({
    admissions: 0,
    fees: 0,
    contacts: 0,
    total: 0
  });

  const API_BASE_URL = 'http://localhost:5000'; // Change this to your backend URL

  const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    console.log(`📡 Fetching: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
    
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      navigate('/admin-login');
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    if (error.message.includes('401')) {
      localStorage.removeItem('adminToken');
      navigate('/admin-login');
    }
    return null;
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
    let endpoint = '';
    let body = { status };
    
    if (type === 'admission') {
      endpoint = `/api/admissions/status/${id}`;
      if (notes) body.adminNotes = notes;
    } else if (type === 'fee') {
      endpoint = `/api/fee-payments/${id}/status`;
      if (notes) body.verificationNotes = notes;
    } else if (type === 'contact') {
      endpoint = `/api/contacts/${id}/status`;
      if (notes) body.responseMessage = notes;
    }
    
    const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
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
      throw new Error(response?.message || 'Failed to update status');
    }
  } catch (error) {
    console.error('❌ Error updating status:', error);
    showToast('Error updating status', 'error');
  }
};

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
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
        throw new Error(response?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Error deleting item', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminOTP');
    localStorage.removeItem('otpEmail');
    navigate('/admin-login');
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
      
      {payment.cloudinaryFile ? (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-3">Receipt (Cloudinary)</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {payment.cloudinaryFile.resource_type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <File className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{payment.cloudinaryFile.original_filename || 'Cloudinary file'}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(payment.cloudinaryFile.bytes)} • 
                    {payment.cloudinaryFile.format ? ` ${payment.cloudinaryFile.format.toUpperCase()} • ` : ' '}
                    {payment.cloudinaryFile.resource_type === 'image' ? 'Image' : 'PDF'}
                  </p>
                </div>
              </div>
              <a
                href={payment.cloudinaryFile.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>View</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            {/* Show image preview for image files */}
            {payment.cloudinaryFile.resource_type === 'image' && (
              <div className="mt-4">
                <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={payment.cloudinaryFile.secure_url}
                    alt={`Receipt for ${payment.studentName}`}
                    className="w-full h-full object-contain bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                    }}
                  />
                </div>
                {payment.cloudinaryFile.width && payment.cloudinaryFile.height && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Dimensions: {payment.cloudinaryFile.width} × {payment.cloudinaryFile.height}px
                  </p>
                )}
              </div>
            )}
            
            {/* Show PDF info for PDF files */}
            {payment.cloudinaryFile.resource_type === 'pdf' && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">PDF Document</p>
                    <p className="text-sm text-red-600">
                      Click the "View" button above to open this PDF document in a new tab.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cloudinary ID for reference */}
            <div className="mt-2">
              <p className="text-xs text-gray-400">
                Cloudinary ID: {payment.cloudinaryFile.public_id}
              </p>
            </div>
          </div>
        </div>
      ) : payment.receiptFile ? (
        // Fallback for older local storage files
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-3">Receipt (Local Storage)</h4>
          <a
            href={payment.receiptFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Receipt ({payment.receiptFile.originalName})
          </a>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-700">No receipt file attached to this payment.</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Submitted on {formatDateTime(payment.submittedAt)}</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => handleUpdateStatus('fee', payment._id, 'verified')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Verify
            </button>
            <button
              onClick={() => handleUpdateStatus('fee', payment._id, 'rejected')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => handleDelete('fee', payment._id)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Delete
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