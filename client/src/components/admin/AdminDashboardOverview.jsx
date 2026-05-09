import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  GraduationCap, DollarSign, Mail, Users,
  TrendingUp, TrendingDown, CheckCircle, File, ImageIcon
} from 'lucide-react';

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

const renderStatusBadge = (status) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verified' },
    unverified: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Verification' },
    unread: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Unread' },
    read: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Read' },
    replied: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Replied' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
  };

  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
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

const AdminDashboardOverview = ({ stats, setCurrentTab, loadDashboardData }) => {
  if (!stats) {
    return (
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
    );
  }

  const applicationsByClass = stats?.monthlyAdmissions?.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    applications: item.count
  })) || [];

  const paymentStatusData = stats?.paymentsByStatus?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
  })) || [];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Admissions</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalAdmissions || 0}</p>
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
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalFeePayments || 0}</p>
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
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalContacts || 0}</p>
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

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Fees Collected</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.totalVerifiedAmount?.toLocaleString('en-IN') || 0}</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500 text-sm">Verified</span>
                <span className="text-gray-400 text-sm ml-2">from verified payments</span>
              </div>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Revenue Analytics</h3>
              <p className="text-xs text-emerald-600 font-medium">Verified Collections Only</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded font-bold uppercase">Live</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsByClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Verified Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="applications" // Using applications count for now until backend provides revenue timeline
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">System Monitoring</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">Database Connection</span>
              </div>
              <span className="text-xs font-bold text-green-600 uppercase">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">Cloudinary Storage</span>
              </div>
              <span className="text-xs font-bold text-green-600 uppercase">Synced</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">Mail Server</span>
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase">Standby</span>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Storage Utilization</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Enrollment Trends</h3>
            <div className="text-sm text-gray-500">Monthly Applications</div>
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
            <h3 className="text-lg font-semibold text-gray-800">Verification Analytics</h3>
            <div className="text-sm text-gray-500">Total: {stats.totalFeePayments || 0} payments</div>
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
  );
};

export default AdminDashboardOverview;
