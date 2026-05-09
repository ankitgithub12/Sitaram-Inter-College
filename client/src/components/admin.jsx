import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell, Search, Menu, Settings, LogOut, CheckCircle, XCircle, RotateCcw,
  RefreshCw, ChevronLeft, Shield, ZoomIn, ZoomOut, Download, ExternalLink,
  X, ImageIcon, Users, GraduationCap, DollarSign
} from 'lucide-react';
import { io } from 'socket.io-client';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboardOverview from './admin/AdminDashboardOverview';
import AdminAdmissions from './admin/AdminAdmissions';
import AdminFees from './admin/AdminFees';
import AdminContacts from './admin/AdminContacts';
import AdminUsers from './admin/AdminUsers';
import AdminStudents from './admin/AdminStudents';
import AdminGallery from './admin/AdminGallery';
import AdminAchievements from './admin/AdminAchievements';
import AdminAnnouncements from './admin/AdminAnnouncements';
import AdminExamSchedules from './admin/AdminExamSchedules';
import AdminTestimonials from './admin/AdminTestimonials';
import { apiUrl } from '../lib/config';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [admissionsData, setAdmissionsData] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [contactsData, setContactsData] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewDetails, setViewDetails] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState({
    admissions: 0,
    fees: 0,
    contacts: 0,
    total: 0
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [settingsActiveSection, setSettingsActiveSection] = useState('Account');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [imageModal, setImageModal] = useState({ 
    isOpen: false, 
    imageUrl: null, 
    fileName: null,
    zoom: 1 
  });
  
  const socketRef = React.useRef(null);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    const token = localStorage.getItem('adminToken');
    if (authStatus === 'true' || token) {
      const storedName = sessionStorage.getItem('userName') || sessionStorage.getItem('adminName');
      const storedID = sessionStorage.getItem('loginID');
      if (storedName) setUserName(storedName);
      if (storedID) setLoginID(storedID);
      setIsAuthenticated(true);
      loadDashboardData();
      
      // Initialize Socket.io connection for Admin
      socketRef.current = io(window.location.origin);
      
      socketRef.current.on('new_fee_payment', (data) => {
        showToast('New fee payment submitted', 'info');
        loadDashboardData(true);
      });
      
      socketRef.current.on('fee_status_updated', (data) => {
        // Only react if we are the ones listening. Usually admin triggers this, but multiple admins could be on.
        loadDashboardData(true);
      });
      
    } else {
      navigate('/admin-login');
    }
    
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate]);

  // Update effect to reload data when filters change
  useEffect(() => {
    if (isAuthenticated) {
      if (currentTab === 'admissions') loadAdmissions();
      if (currentTab === 'fees') loadFeePayments();
      if (currentTab === 'contacts') loadContacts();
    }
  }, [searchTerm, statusFilter, currentTab]); // Re-fetch when search or filter changes

  // Auto-refresh notifications periodically
  useEffect(() => {
    if (isAuthenticated && stats) {
      const interval = setInterval(() => {
        loadDashboardData(true); // silent refresh
      }, 30000); // Check every 30 seconds for real-time feel
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, stats]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please enter a username');
      return;
    }
    if (password === 'SRIC@123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('userName', userName);
      sessionStorage.setItem('loginID', userName); // In dummy login, use the same as id
      setLoginID(userName);
      setError('');
      loadDashboardData();
      showToast(`Welcome back, ${userName}!`);
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('loginID');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUserName('');
    setLoginID('');
    showToast('Logged out successfully');
    navigate('/');
  };

  const loadDashboardData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/admin-login');
      const response = await fetch(apiUrl('/api/dashboard-stats'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
        
        // Use actual pending/unread counts from backend stats
        const counts = {
            admissions: result.data.pendingAdmissions || 0,
            fees: result.data.pendingFees || 0, // FIXED: Corrected field name from pendingFeePayments to pendingFees
            contacts: result.data.unreadContacts || 0,
            total: (result.data.pendingAdmissions || 0) + 
                   (result.data.pendingFees || 0) + 
                   (result.data.unreadContacts || 0)
        };
        
        setNotificationCounts(counts);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      if (!silent) showToast('Failed to load dashboard data', 'error');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const loadData = () => {
    if (currentTab === 'admissions') loadAdmissions();
    if (currentTab === 'fees') loadFeePayments();
    if (currentTab === 'contacts') loadContacts();
    if (currentTab === 'dashboard') loadDashboardData();
    // Close mobile menu on tab change
    setIsMobileMenuOpen(false);
  };

  const loadAdmissions = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiUrl(`/api/admissions?${queryParams}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setAdmissionsData(data);
      } else if (data && Array.isArray(data.data)) {
        setAdmissionsData(data.data);
      } else {
        setAdmissionsData([]);
      }
    } catch (err) {
      console.error('Error fetching admissions:', err);
      showToast('Failed to load admissions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeePayments = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiUrl(`/api/fee-payments?${queryParams}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      console.log('Fee payments received:', Array.isArray(data) ? data.length : 'not an array');
      if (Array.isArray(data)) {
        setFeesData(data);
      } else if (data && Array.isArray(data.data)) {
        setFeesData(data.data);
      } else {
        setFeesData([]);
      }
    } catch (err) {
      console.error('Error fetching fee payments:', err);
      showToast('Failed to load fee payments', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiUrl(`/api/contacts?${queryParams}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setContactsData(data);
      } else if (data && Array.isArray(data.data)) {
        setContactsData(data.data);
      } else {
        setContactsData([]);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      showToast('Failed to load contacts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (type, id, newStatus, responseMessage = '') => {
    try {
      let endpoint = '';
      let body = { status: newStatus };

      if (type === 'admission') endpoint = `/api/admissions/${id}/status`;
      else if (type === 'fee') endpoint = `/api/fee-payments/${id}/status`;
      else if (type === 'contact') {
        endpoint = `/api/contacts/${id}/status`;
        if (responseMessage) body.responseMessage = responseMessage;
      }

      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        showToast(`Status updated successfully to ${newStatus}`);
        loadData(); // Refresh current tab data
        loadDashboardData(true); // Silently refresh dashboard stats
        setViewDetails(null); // Close detailed view mode
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} record? This action cannot be undone.`)) {
      return;
    }

    try {
      let endpoint = '';
      if (type === 'admission') endpoint = `/api/admissions/${id}`;
      else if (type === 'fee') endpoint = `/api/fee-payments/${id}`;
      else if (type === 'contact') endpoint = `/api/contacts/${id}`;

      const token = localStorage.getItem('adminToken');
      const response = await fetch(apiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showToast(`${type} record deleted successfully`);
        loadData(); // Refresh current tab data
        loadDashboardData(true); // Silently refresh dashboard stats
        setViewDetails(null); // Close detail view if open
      } else {
        showToast('Failed to delete record', 'error');
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      showToast('Error deleting record', 'error');
    }
  };

  const handleUploadReceipt = async (paymentId, file) => {
    if (!file) return;

    // Show loading toast
    showToast('Uploading receipt... please wait', 'info');
    
    // Create form data
    const formData = new FormData();
    formData.append('receiptFile', file);
    formData.append('studentName', 'Admin Upload'); // Required by the fallback api

    try {
      const token = localStorage.getItem('adminToken');
      // First try to upload the file to Cloudinary if our endpoint supports it
      const response = await fetch(`/api/fee-payments/${paymentId}/receipt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData, // Don't set content-type, let browser set it with boundary
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        showToast('Receipt uploaded successfully!', 'success');
        loadFeePayments(); // Refresh list to show new file
        
        // Update current view details if it's the one being viewed
        if (viewDetails && viewDetails._id === paymentId) {
          // Re-fetch this single payment
          const paymentRes = await fetch(`/api/fee-payments/${paymentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (paymentRes.ok) {
            const updatedPayment = await paymentRes.json();
            setViewDetails(updatedPayment.data);
          }
        }
      } else {
        throw new Error(data.message || 'Failed to upload receipt');
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      showToast(`Upload failed: ${error.message}`, 'error');
    }
  };

  const handleViewImage = (url, fileName) => {
    setImageModal({
      isOpen: true,
      imageUrl: url,
      fileName: fileName,
      zoom: 1
    });
  };

  const handleZoomIn = () => {
    setImageModal(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 3) }));
  };

  const handleZoomOut = () => {
    setImageModal(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 0.5) }));
  };

  const handleResetZoom = () => {
    setImageModal(prev => ({ ...prev, zoom: 1 }));
  };

  // Helper to open PDF or external files securely
  const openExternal = (payment) => {
    if (payment.cloudinaryFile?.secure_url) {
      window.open(payment.cloudinaryFile.secure_url, '_blank', 'noopener,noreferrer');
    } else if (payment.receiptFile?.url) {
      window.open(payment.receiptFile.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Helper to get exact file URL (prioritize cloudinary)
  const getFileUrl = (payment) => {
    if (payment.cloudinaryFile?.secure_url) return payment.cloudinaryFile.secure_url;
    if (payment.receiptFile?.url) return payment.receiptFile.url;
    return null;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                <div className="flex items-center space-x-2 bg-sricblue/30 px-3 py-1 rounded-lg">
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

      {/* Sidebar Component */}
      <AdminSidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setViewDetails(null); // Reset view details when switching tabs
          setIsMobileMenuOpen(false); // Close mobile menu
        }}
        notificationCounts={notificationCounts}
        handleLogout={handleLogout}
        adminName={userName}
        loginID={loginID}
      />

      {/* Main Content */}
    <div className={`transition-all duration-300 min-h-screen flex flex-col ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} ${isMobileMenuOpen ? 'overflow-hidden' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 mr-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate max-w-[150px] md:max-w-none">
                  {currentTab === 'dashboard' && 'Dashboard'}
                  {currentTab === 'admissions' && 'Admissions'}
                  {currentTab === 'fees' && 'Fees'}
                  {currentTab === 'contacts' && 'Messages'}
                  {currentTab === 'users' && 'Teacher Management'}
                  {currentTab === 'students' && 'Student Management'}
                  {currentTab === 'gallery' && 'Gallery Manager'}
                  {currentTab === 'achievements' && 'Achievements'}
                  {currentTab === 'announcements' && 'Announcements'}
                  {currentTab === 'examschedules' && 'Exam Schedules'}
                  {currentTab === 'testimonials' && 'Testimonials'}
                  {currentTab === 'reports' && 'Reports'}
                  {currentTab === 'settings' && 'Settings'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Search and Filters - Hidden on small mobile */}
                {currentTab !== 'dashboard' && (
                  <div className="hidden lg:flex items-center space-x-3">
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
                  <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className={`relative p-2 rounded-full transition-colors ${isNotificationOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCounts.total > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        {notificationCounts.total}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsNotificationOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                        <div className="p-4 border-b bg-gradient-to-r from-sricblue to-blue-800 text-white flex justify-between items-center">
                          <h3 className="font-bold">Notifications</h3>
                          <span className="text-xs bg-white text-sricblue px-2 py-0.5 rounded-full font-bold">
                            {notificationCounts.total} New
                          </span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notificationCounts.total === 0 ? (
                            <div className="p-8 text-center">
                              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm">All caught up! No new notifications.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-50">
                              {stats?.recentAdmissions?.filter(a => a.status === 'pending').slice(0, 5).map(item => (
                                <div 
                                  key={item._id} 
                                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                                  onClick={() => {
                                    setCurrentTab('admissions');
                                    setIsNotificationOpen(false);
                                  }}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                      <GraduationCap className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">New Admission Application</p>
                                      <p className="text-xs text-gray-600 mt-0.5">{item.name} applied for {item.admissionClass}</p>
                                      <p className="text-[10px] text-gray-400 mt-1">{new Date(item.submittedAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {stats?.recentFeePayments?.filter(f => f.status === 'pending').slice(0, 5).map(item => (
                                <div 
                                  key={item._id} 
                                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                                  onClick={() => {
                                    setCurrentTab('fees');
                                    setIsNotificationOpen(false);
                                  }}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                                      <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">New Fee Payment</p>
                                      <p className="text-xs text-gray-600 mt-0.5">{item.studentName} paid ₹{item.amount}</p>
                                      <p className="text-[10px] text-gray-400 mt-1">{new Date(item.submittedAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {notificationCounts.total > 0 && (
                          <div className="p-3 bg-gray-50 border-t text-center">
                            <button 
                              onClick={() => {
                                setIsNotificationOpen(false);
                                setCurrentTab('dashboard');
                              }}
                              className="text-xs font-bold text-sricblue hover:text-blue-800 transition-colors"
                            >
                              View All Activity
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-2 md:space-x-3 border-l pl-2 md:pl-4">
                  <div 
                    className="relative cursor-pointer group" 
                    onClick={() => setCurrentTab('settings')}
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-sricblue to-blue-800 flex items-center justify-center border-2 border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-bold text-gray-800 text-sm leading-tight">{userName || 'Admin Account'}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Super Admin</p>
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
          ) : (
             <>
                {currentTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border-b border-gray-100 mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Welcome back, <span className="text-sricblue">{userName || 'Administrator'}</span></h2>
                      <p className="text-gray-500 font-medium mt-1">Here's what's happening today at Sitaram Inter College.</p>
                    </div>
                    <AdminDashboardOverview 
                       stats={stats} 
                       setCurrentTab={setCurrentTab} 
                       loadDashboardData={loadDashboardData} 
                    />
                  </div>
                )}

               {currentTab === 'admissions' && (
                 <AdminAdmissions 
                    admissionsData={admissionsData}
                    loadAdmissions={loadAdmissions}
                    handleUpdateStatus={handleUpdateStatus}
                    handleDelete={handleDelete}
                    viewDetails={viewDetails}
                    setViewDetails={setViewDetails}
                 />
               )}

               {currentTab === 'fees' && (
                 <AdminFees 
                    feesData={feesData}
                    loadFeePayments={loadFeePayments}
                    handleUpdateStatus={handleUpdateStatus}
                    handleDelete={handleDelete}
                    viewDetails={viewDetails}
                    setViewDetails={setViewDetails}
                    handleViewImage={handleViewImage}
                    openExternal={openExternal}
                    getFileUrl={getFileUrl}
                    handleUploadReceipt={handleUploadReceipt}
                 />
               )}

               {currentTab === 'contacts' && (
                <AdminContacts 
                  contactsData={contactsData} 
                  loadContacts={loadContacts}
                  handleUpdateStatus={handleUpdateStatus}
                  handleDelete={handleDelete}
                  viewDetails={viewDetails}
                  setViewDetails={setViewDetails}
                  showToast={showToast}
                />
              )}

              {currentTab === 'users' && (
                <AdminUsers showToast={showToast} />
              )}

              {currentTab === 'students' && (
                <AdminStudents showToast={showToast} />
              )}

              {currentTab === 'gallery' && (
                <AdminGallery showToast={showToast} />
              )}

              {currentTab === 'achievements' && (
                <AdminAchievements showToast={showToast} />
              )}

              {currentTab === 'announcements' && (
                <AdminAnnouncements showToast={showToast} />
              )}

              {currentTab === 'examschedules' && (
                <AdminExamSchedules showToast={showToast} />
              )}

              {currentTab === 'testimonials' && (
                <AdminTestimonials showToast={showToast} />
              )}

               {currentTab === 'reports' && (
                 <div className="bg-white rounded-2xl shadow-lg p-6">
                   <div className="text-center py-12">
                     <h3 className="text-xl font-semibold text-gray-700 mb-2">Reports and Analytics</h3>
                     <p className="text-gray-500">Use the dashboard for statistics graphs.</p>
                   </div>
                 </div>
               )}                {currentTab === 'settings' && (
                  <div className="space-y-6 max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-sricblue to-blue-800 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center space-x-6">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                            <Shield className="w-10 h-10 md:w-12 md:h-12 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Admin Settings</h2>
                            <p className="text-blue-100 mt-1">Manage administrative preferences</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Settings Sidebar */}
                          <div className="lg:col-span-1 space-y-2">
                            {['Account', 'Security', 'Notifications', 'System'].map((sec) => (
                              <button
                                key={sec}
                                onClick={() => setSettingsActiveSection(sec)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold flex items-center space-x-3 ${
                                  settingsActiveSection === sec ? 'bg-blue-50 text-sricblue' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${settingsActiveSection === sec ? 'bg-sricblue' : 'bg-transparent'}`}></div>
                                <span>{sec}</span>
                              </button>
                            ))}
                          </div>

                          {/* Settings Tab Content */}
                          <div className="lg:col-span-2 space-y-8 min-h-[400px]">
                            {settingsActiveSection === 'Account' && (
                              <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                                  <Users className="w-5 h-5 mr-2 text-sricblue" />
                                  Account Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logged In As</label>
                                    <div className="w-full bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg text-sricblue font-bold flex items-center">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                      {userName}
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Role</label>
                                    <div className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-gray-700 font-bold">Super Administrator</div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Session ID</label>
                                    <div className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-gray-500 font-mono text-xs">
                                      {Math.random().toString(36).substring(2, 10).toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                              </section>
                            )}

                            {settingsActiveSection === 'Security' && (
                              <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                                  <Shield className="w-5 h-5 mr-2 text-sricblue" />
                                  Password & Security
                                </h3>
                                <div className="space-y-4">
                                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <div className="p-3 bg-white rounded-xl shadow-sm">
                                        <Settings className="w-6 h-6 text-sricblue" />
                                      </div>
                                      <div>
                                        <p className="font-bold text-gray-800">Master Password</p>
                                        <p className="text-xs text-gray-500">Security Level: High</p>
                                      </div>
                                    </div>
                                    <button className="bg-white text-sricblue px-4 py-2 rounded-lg border border-blue-200 font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                      Update
                                    </button>
                                  </div>
                                  
                                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 opacity-60">
                                    <div className="flex justify-between items-center opacity-50">
                                      <span className="text-sm font-bold text-gray-700">Two-Factor Authentication</span>
                                      <span className="text-xs font-bold text-gray-400 italic">Coming Soon</span>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            )}

                            {settingsActiveSection === 'Notifications' && (
                              <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                                  <Bell className="w-5 h-5 mr-2 text-sricblue" />
                                  Notification Alerts
                                </h3>
                                <div className="space-y-3">
                                  {[
                                    { label: 'Email for new admissions', active: true },
                                    { label: 'Daily summary report', active: true },
                                    { label: 'Security alert emails', active: true }
                                  ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                      <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                                      <div className={`w-10 h-5 rounded-full relative ${item.active ? 'bg-sricblue' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}

                            {settingsActiveSection === 'System' && (
                              <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                                  <Settings className="w-5 h-5 mr-2 text-sricblue" />
                                  System Preferences
                                </h3>
                                <div className="p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                                  <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                  <p className="text-gray-500 font-medium">Core system settings are managed by the database administrator.</p>
                                </div>
                              </section>
                            )}
                          </div>
                        </div>
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