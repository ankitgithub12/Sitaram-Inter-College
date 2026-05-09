import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart2, Users, BookOpen, ClipboardCheck, 
  GraduationCap, LayoutDashboard, LogOut, Clock, 
  Activity, ChevronRight, Calendar, AlertCircle, 
  Shield, FileText, CreditCard, User, Bell, Briefcase, Info, 
  CheckCircle, IndianRupee, File, UploadCloud, TrendingUp
} from 'lucide-react';
import { io } from 'socket.io-client';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [feeHistory, setFeeHistory] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('overview');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem('studentToken')) {
      navigate('/login');
      return;
    }
    
    loadStudentData(userId);
    
    // Initialize Socket.io connection for real-time updates
    socketRef.current = io(window.location.origin);
    
    socketRef.current.on('connect', () => {
      console.log('Connected to real-time server');
    });

    socketRef.current.on('fee_status_updated', (data) => {
      // If the update is for this student's email, update history and notify
      if (profile && data.email === profile.email) {
        addNotification(`Your payment of ₹${data.amount} is now ${data.status.toUpperCase()}`, 'success');
        loadStudentData(userId); // reload data
      }
    });

    socketRef.current.on('new_assignment', (data) => {
      if (profile && data.className === profile.subject) {
        addNotification(`New Assignment: ${data.title}`, 'info');
        loadStudentData(userId);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate, userId, profile?.email, profile?.subject]);

  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: type === 'success' ? 'Update' : 'Notice',
      message,
      time: 'Just now',
      type,
      read: false
    }, ...prev]);
  };

  const loadStudentData = async (userId) => {
    if (!userId) return;
    try {
      const token = localStorage.getItem('studentToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Profile
      const resProfile = await fetch(`/api/users/${userId}`, { headers });
      const dataProfile = await resProfile.json();
      let email = '';
      let className = '';
      if (dataProfile.success) {
        setProfile(dataProfile.data);
        email = dataProfile.data.email || '';
        className = dataProfile.data.subject || '';
      }

      // Attendance
      const resAttendance = await fetch(`/api/attendance/student/${userId}`, { headers });
      if (resAttendance.ok) {
        const dataAtt = await resAttendance.json();
        if (dataAtt.success) setAttendance(dataAtt.data);
      }

      // Marks
      const resMarks = await fetch(`/api/marks/student/${userId}`, { headers });
      if (resMarks.ok) {
        const dataMarks = await resMarks.json();
        if (dataMarks.success) setMarks(dataMarks.data);
      }

      // Fees
      if (email) {
        const resFees = await fetch(`/api/fee-payments/email/${email}`);
        if (resFees.ok) {
          const dataFees = await resFees.json();
          if (dataFees.success) {
            setFeeHistory(dataFees.data);
          }
        }
      }

      // Assignments
      if (className) {
        const resAssign = await fetch(`/api/assignments/student/${className}`);
        if (resAssign.ok) {
          const dataAssign = await resAssign.json();
          if (dataAssign.success) setAssignments(dataAssign.data);
        }
      }

    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    if (socketRef.current) socketRef.current.disconnect();
    navigate('/login');
  };

  const attendancePercentage = attendance.length > 0 
    ? ((attendance.filter(a => a.status === 'present').length / attendance.length) * 100).toFixed(1)
    : 0;

  const avgMarks = marks.length > 0
    ? (marks.reduce((acc, curr) => acc + (curr.marksObtained / curr.maxMarks) * 100, 0) / marks.length).toFixed(1)
    : 0;
    
  // Most recent fee payment
  const recentFee = feeHistory.length > 0 ? feeHistory[0] : null;

  const navItems = [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', name: 'Attendance', icon: ClipboardCheck },
    { id: 'marks', name: 'My Grades', icon: BarChart2 },
    { id: 'tasks', name: 'Assignments', icon: Briefcase },
    { id: 'fees', name: 'Fee Portal', icon: CreditCard },
  ];

  const renderStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === 'verified') return <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">Verified</span>;
    if (s === 'rejected') return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">Rejected</span>;
    return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">Pending</span>;
  };

  // Fees View Component logic
  const FeesView = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
      amount: '',
      paymentMethod: 'UPI Payment',
      transactionId: ''
    });
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) {
        alert('Please select a receipt file to upload');
        return;
      }
      setIsSubmitting(true);
      
      const now = new Date();
      const receiptNumber = `SRIC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const submitData = new FormData();
      submitData.append('studentName', profile.name);
      submitData.append('fatherName', profile.createdBy || 'Parent'); // fallback
      submitData.append('mobile', '0000000000'); // Normally would ask, bypassing for simplified view
      submitData.append('email', profile.email);
      submitData.append('className', profile.subject || 'General');
      submitData.append('amount', formData.amount);
      submitData.append('paymentMethod', formData.paymentMethod);
      submitData.append('transactionId', formData.transactionId);
      submitData.append('receiptNumber', receiptNumber);
      submitData.append('receiptFile', file);

      try {
        const response = await fetch('/api/fee-payments/upload', {
          method: 'POST',
          body: submitData
        });
        const result = await response.json();
        if (result.success) {
          alert('Payment submitted successfully! Waiting for admin verification.');
          // Emit socket event if desired, or just wait for standard poll
          if (socketRef.current) {
            socketRef.current.emit('new_fee_payment', result.data);
          }
          setFormData({ amount: '', paymentMethod: 'UPI Payment', transactionId: '' });
          setFile(null);
          loadStudentData(userId); // refresh history
        } else {
          alert(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Submit error:', err);
        alert('An error occurred during submission.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Fee Payments</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Payment Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <UploadCloud className="w-5 h-5 text-blue-600 mr-2" />
              Submit New Payment
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                <input type="email" value={profile?.email} readOnly className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} min="100" className="w-full p-3 border border-gray-200 rounded-lg" placeholder="e.g. 5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select required value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg">
                    <option value="UPI Payment">UPI / Online</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction / UTR ID</label>
                <input type="text" required value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg" placeholder="Enter reference number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Receipt (Image/PDF)</label>
                <input type="file" required onChange={e => setFile(e.target.files[0])} accept="image/*,application/pdf" className="w-full p-2 border border-gray-200 border-dashed rounded-lg bg-gray-50 text-sm" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md mt-2 disabled:bg-blue-400 flex justify-center">
                {isSubmitting ? <span className="animate-pulse">Submitting...</span> : 'Submit Payment for Verification'}
              </button>
            </form>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 text-green-600 mr-2" />
              Payment History
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {feeHistory.length > 0 ? feeHistory.map(fee => (
                <div key={fee._id} className="p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">₹{fee.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(fee.submittedAt).toLocaleDateString()} • {fee.paymentMethod}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Txn: {fee.transactionId}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center space-x-3">
                    {renderStatusBadge(fee.status)}
                    {fee.cloudinaryFile?.secure_url && (
                      <a href={fee.cloudinaryFile.secure_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                        <File className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <CreditCard className="w-12 h-12 text-gray-200 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">No payments submitted yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar matching Admin */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#002366] to-blue-900 text-white transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 border-b border-blue-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-white p-2 rounded-xl flex-shrink-0">
              <Shield className="w-6 h-6 text-[#002366]" />
            </div>
            {!sidebarCollapsed && <span className="font-bold text-lg tracking-tight whitespace-nowrap">SRIC Student</span>}
          </div>
        </div>

        <div className="p-4 flex-grow space-y-2 mt-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                currentTab === item.id ? 'bg-blue-800 text-white shadow-lg' : 'hover:bg-blue-800/50 text-blue-100/70'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-red-300 transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header matching Admin topbar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 px-8 py-4 flex justify-between items-center h-20">
          <div className="flex items-center text-sm font-medium text-gray-500 uppercase tracking-wider">
             Academic Portal
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Bell className="w-6 h-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 flex justify-between">
                    Alerts
                    <button onClick={() => setNotifications(n => n.map(x => ({...x, read: true})))} className="text-xs text-blue-600 font-normal hover:underline">Mark read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b text-sm ${n.read ? 'bg-white text-gray-600' : 'bg-blue-50/50 text-gray-800 font-medium'}`}>
                        {n.message}
                      </div>
                    )) : <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">{profile?.name || 'Student'}</p>
                <p className="text-xs text-gray-500">{profile?.subject || 'Class'}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sricblue font-bold">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto space-y-6">
          {currentTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              </div>

              {/* Stats Grid matching Admin */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Attendance</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{attendancePercentage}%</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <ClipboardCheck className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">My Average Grade</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{avgMarks}%</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl">
                      <BarChart2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-emerald-500 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Tasks Due</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{assignments.length}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl">
                      <Briefcase className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 border border-gray-100 ${
                  recentFee?.status === 'verified' ? 'border-emerald-500' : 
                  (recentFee?.status === 'pending' ? 'border-yellow-500' : 'border-red-500')
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Fee Status</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2 truncate">
                        {recentFee ? recentFee.status.charAt(0).toUpperCase() + recentFee.status.slice(1) : 'No Records'}
                      </p>
                    </div>
                    <div className={`${recentFee?.status === 'verified' ? 'bg-emerald-50' : 'bg-red-50'} p-3 rounded-xl`}>
                      <CreditCard className={`w-6 h-6 ${recentFee?.status === 'verified' ? 'text-emerald-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lists section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assignments Simple Table matching Admin Tables */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Recent Assignments</h3>
                    <button onClick={() => setCurrentTab('tasks')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
                  </div>
                  <div className="space-y-4">
                    {assignments.slice(0, 5).map(task => (
                      <div key={task._id} className="flex items-start p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-4"><BookOpen className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{task.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {assignments.length === 0 && <p className="text-sm text-gray-500">No active assignments.</p>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Recent Marks</h3>
                    <button onClick={() => setCurrentTab('marks')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
                  </div>
                  <div className="space-y-4">
                    {marks.slice(0, 5).map(mark => (
                      <div key={mark._id} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="flex items-start">
                          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mr-4"><BarChart2 className="w-5 h-5" /></div>
                          <div>
                            <h4 className="font-bold text-gray-800">{mark.subject}</h4>
                            <p className="text-xs text-gray-500 mt-1">{mark.examType}</p>
                          </div>
                        </div>
                        <div className="font-bold text-lg text-gray-800">
                          {mark.marksObtained}/{mark.maxMarks}
                        </div>
                      </div>
                    ))}
                    {marks.length === 0 && <p className="text-sm text-gray-500">No marks recorded recently.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'fees' && <FeesView />}

          {currentTab === 'tasks' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-indigo-500" /> Assignments
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {assignments.map(task => (
                  <div key={task._id} className="p-5 border border-gray-200 rounded-2xl hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">{task.status}</span>
                      <span className="text-xs text-gray-500 font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                    <div className="text-xs font-medium text-gray-400">Assigned by: {task.teacherName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simple tables for Attendance and Marks omitted for brevity, but matches the clean UI */}
          {currentTab === 'attendance' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
               <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ClipboardCheck className="w-6 h-6 mr-3 text-emerald-500" /> Attendance History
              </h2>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4 rounded-tl-lg">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendance.map(a => (
                    <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-800">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${a.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentTab === 'marks' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
               <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <BarChart2 className="w-6 h-6 mr-3 text-purple-500" /> My Academic Grades
              </h2>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4 rounded-tl-lg">Subject</th>
                    <th className="p-4">Exam Type</th>
                    <th className="p-4">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {marks.map(m => (
                    <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-800">{m.subject}</td>
                      <td className="p-4 text-sm text-gray-500">{m.examType}</td>
                      <td className="p-4 text-sm text-gray-800 font-bold">{m.marksObtained} / {m.maxMarks} ({((m.marksObtained/m.maxMarks)*100).toFixed(0)}%)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
