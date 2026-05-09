import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, ClipboardCheck, LayoutDashboard, LogOut, 
  BarChart2, Bell, Shield, Briefcase, ChevronRight, CheckCircle, 
  Plus, Trash2, FileText, CheckCircle2, Activity
} from 'lucide-react';
import { io } from 'socket.io-client';

// We import these subcomponents since they are complex enough
import TeacherUsers from './TeacherUsers';
import TeacherMarks from './TeacherMarks';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({ title: '', dueDate: '', className: '', description: '' });
  
  const [studentCount, setStudentCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceClass, setAttendanceClass] = useState('12-A');
  const [assignments, setAssignments] = useState([]);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const name = sessionStorage.getItem('userName');
    
    if (role !== 'teacher') {
      navigate('/admin-login');
      return;
    } 
    
    setTeacherName(name || 'Faculty');
    fetchStats();
    
    socketRef.current = io(window.location.origin);
    
    // Listen for new assignments created by this teacher
    socketRef.current.on('assignment_created', (data) => {
      if (data.teacherId === sessionStorage.getItem('userId')) {
        addNotification(`Assignment "${data.title}" deployed successfully`, 'success');
        if (activeTab === 'assignments') loadAssignments();
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate]);

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

  const showToast = (message, type = 'success') => {
    addNotification(message, type);
  };

  const fetchStats = async () => {
    try {
      const teacherUsername = sessionStorage.getItem('userName') || 'teacher';
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`/api/users/manage?role=student&creator=${teacherUsername}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`Server err: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setStudentCount(data.data.length);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err.message);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadAttendanceStudents = async () => {
    setAttendanceLoading(true);
    try {
      const teacherUsername = sessionStorage.getItem('userName') || 'teacher';
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`/api/users/manage?role=student&creator=${teacherUsername}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAttendanceData(data.data.map(student => ({
          studentId: student._id,
          name: student.name,
          username: student.username,
          status: 'present'
        })));
      }
    } catch (err) {
      showToast('Error loading students for attendance', 'error');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const loadAssignments = async () => {
    setIsAssignmentsLoading(true);
    try {
      const teacherId = sessionStorage.getItem('userId');
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`/api/assignments?teacherId=${teacherId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (err) {
      showToast('Error loading assignments', 'error');
    } finally {
      setIsAssignmentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'attendance') {
      loadAttendanceStudents();
    } else if (activeTab === 'assignments') {
      loadAssignments();
    }
  }, [activeTab]);

  const submitAttendance = async () => {
    try {
      const token = localStorage.getItem('teacherToken');
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          records: attendanceData,
          teacherId: sessionStorage.getItem('userId'),
          class: attendanceClass,
          date: new Date()
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Attendance recorded successfully', 'success');
      }
    } catch (err) {
      showToast('Error submitting attendance', 'error');
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendanceData(prev => prev.map(rec => 
      rec.studentId === studentId 
        ? { ...rec, status: rec.status === 'present' ? 'absent' : 'present' }
        : rec
    ));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const teacherId = sessionStorage.getItem('userId');
      const tName = sessionStorage.getItem('userName');
      const token = localStorage.getItem('teacherToken');
      const payload = {
        ...taskFormData,
        teacherId,
        teacherName: tName,
        status: 'Published'
      };

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsTaskModalOpen(false);
        setTaskFormData({ title: '', dueDate: '', className: '', description: '' });
        loadAssignments();
        
        // Let server emit to student via socket
        if (socketRef.current) {
           socketRef.current.emit('create_assignment', data.data);
        } else {
           showToast('Assignment deployed', 'success');
        }
      }
    } catch (err) {
      showToast('Error deploying assignment', 'error');
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`/api/assignments/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast('Assignment purged', 'success');
        loadAssignments();
      }
    } catch (err) {
      showToast('Error purging assignment', 'error');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('teacherToken');
    if (socketRef.current) socketRef.current.disconnect();
    navigate('/admin-login');
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', name: 'My Students', icon: Users },
    { id: 'attendance', name: 'Attendance', icon: ClipboardCheck },
    { id: 'marks', name: 'Grades', icon: BarChart2 },
    { id: 'assignments', name: 'Assignments', icon: Briefcase },
  ];

  if (isLoadingStats) {
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
            {!sidebarCollapsed && <span className="font-bold text-lg tracking-tight whitespace-nowrap">SRIC Faculty</span>}
          </div>
        </div>

        <div className="p-4 flex-grow space-y-2 mt-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-blue-800 text-white shadow-lg' : 'hover:bg-blue-800/50 text-blue-100/70'
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
             Faculty Portal
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
                <p className="text-sm font-bold text-gray-800 leading-tight">{teacherName}</p>
                <p className="text-xs text-gray-500">Teacher Account</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                {teacherName ? teacherName.charAt(0).toUpperCase() : 'F'}
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Faculty Hub</h1>
              </div>

              {/* Stats Grid matching Admin */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Assigned Students</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{studentCount}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Active Classes</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">1</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-emerald-500 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Tasks</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                   <Activity className="w-5 h-5 mr-3 text-blue-500"/>
                   System Readiness
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Student Portal Sync</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Assignment API</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-in fade-in duration-500">
              <TeacherUsers showToast={showToast} teacherName={teacherName} />
            </div>
          )}

          {activeTab === 'marks' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-in fade-in duration-500">
              <TeacherMarks showToast={showToast} />
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800">Assignment Management</h3>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </button>
              </div>
              <div className="p-6 space-y-4 min-h-[300px]">
                {isAssignmentsLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : assignments.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all group bg-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Class: {task.className} • Assigned: {new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs font-medium text-blue-600 mb-1">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">{task.status}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteAssignment(task._id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && !isAssignmentsLoading && (
                  <div className="py-16 text-center">
                    <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-500">No active assignments</p>
                    <p className="text-gray-400 text-xs mt-1">Click "New Task" to create one.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Attendance Registry</h3>
                  <p className="text-gray-500 text-sm mt-1">Class {attendanceClass}</p>
                </div>
                <button 
                  onClick={submitAttendance}
                  disabled={attendanceData.length === 0}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:bg-blue-400"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Attendance</span>
                </button>
              </div>
              <div className="p-6 min-h-[400px]">
                {attendanceLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attendanceData.map((rec) => (
                      <div 
                        key={rec.studentId}
                        onClick={() => toggleAttendance(rec.studentId)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          rec.status === 'present' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              rec.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {rec.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 leading-tight">{rec.name}</h4>
                              <p className="text-xs text-gray-500 uppercase">@{rec.username}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            rec.status === 'present' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                          }`}>
                            {rec.status}
                          </div>
                        </div>
                      </div>
                    ))}
                    {attendanceData.length === 0 && (
                      <div className="col-span-full py-16 text-center">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="font-medium text-gray-500">No students found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-6 text-white">
              <h3 className="text-2xl font-bold">New Assignment</h3>
              <p className="text-blue-100 text-sm mt-1">Create an academic task</p>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                <input type="text" required placeholder="Assignment title"
                  value={taskFormData.title}
                  onChange={e => setTaskFormData({...taskFormData, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-medium outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Due Date</label>
                  <input type="date" required
                    value={taskFormData.dueDate}
                    onChange={e => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-medium outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Class</label>
                  <input type="text" required placeholder="e.g. 12-A"
                    value={taskFormData.className}
                    onChange={e => setTaskFormData({...taskFormData, className: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-medium outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea rows="3" placeholder="Task description..."
                  value={taskFormData.description}
                  onChange={e => setTaskFormData({...taskFormData, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-medium outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all">
                  Deploy Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;
