
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ Backend API base URL - DIRECTLY IN THE FILE
const API_BASE_URL = 'https://sitaram-inter-college.onrender.com';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  
  const navigate = useNavigate();

  // Check server health on component mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const checkServerHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
      if (response.data.success) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      console.error('Health check error:', error);
      setServerStatus('offline');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
    if (connectionError) {
      setConnectionError(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setConnectionError(false);

    try {
      // ✅ Using correct backend URL
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username: formData.username,
        password: formData.password
      });
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        showToast('Login successful!', 'success');
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        setErrorMessage(response.data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          setErrorMessage('Invalid username or password');
        } else if (status === 423) {
          setErrorMessage('Account is temporarily locked. Please try again later.');
        } else if (status === 400) {
          setErrorMessage(data.message || 'Invalid input');
        } else {
          setErrorMessage('Server error. Please try again.');
        }
      } else if (error.request) {
        setConnectionError(true);
        setErrorMessage('Cannot connect to server. Please check your internet connection and try again.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = () => {
    setConnectionError(false);
    setErrorMessage('');
    setServerStatus('checking');
    
    axios.get(`${API_BASE_URL}/api/health`)
      .then((response) => {
        if (response.data.success) {
          setServerStatus('online');
          setConnectionError(false);
          showToast('Connected to server!', 'success');
        } else {
          setServerStatus('offline');
          setErrorMessage('Server is not responding properly.');
        }
      })
      .catch(() => {
        setServerStatus('offline');
        setErrorMessage('Still cannot connect to server. Please contact administrator.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sricblue via-blue-800 to-purple-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-sricgold rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`absolute top-4 right-4 left-4 md:left-auto md:right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-white">
                  {toast.type === 'success' ? '✓' : '✗'}
                </span>
                <span className="font-medium">{toast.message}</span>
              </div>
              <button 
                onClick={() => setToast({ show: false, message: '', type: '' })}
                className="ml-4 text-white hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-sricblue to-blue-800 text-white p-8 text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sricgold to-yellow-400"></div>
            
            {/* Logo */}
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-sricgold rounded-full animate-ping opacity-20"></div>
              <img 
                src="/assets/SRIC LOGO.PNG" 
                alt="SRIC Logo" 
                className="h-20 w-20 mx-auto rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">SRIC Admin Portal</h1>
            <p className="text-sricgold font-semibold">Secure Database Authentication</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Connection Error */}
              {connectionError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-lg mr-3">
                      <span className="text-red-800 font-bold">⚠</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-700 font-medium mb-2">Connection Error</p>
                      <p className="text-red-600 text-sm mb-3">Cannot connect to the authentication server.</p>
                      <button
                        type="button"
                        onClick={handleRetryConnection}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Retry Connection
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && !connectionError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-lg mr-3">
                      <span className="text-red-800 font-bold">!</span>
                    </div>
                    <p className="text-red-700 font-medium">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Username Field */}
              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">
                  Admin Username
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sricblue focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    placeholder="Enter admin username"
                    required
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-sricblue focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sricblue transition-colors px-2 py-1 rounded text-sm font-medium"
                    disabled={isLoading}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-sricblue focus:ring-sricblue mr-2" 
                  />
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sricblue to-blue-700 hover:from-blue-700 hover:to-sricblue text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-3">⟳</span>
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <span className="text-blue-800 font-bold">🔐</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-semibold mb-1">Secure Authentication System</p>
                  <p className="text-sm text-blue-700">Credentials are securely stored with bcrypt encryption in the database.</p>
                  <p className="text-xs text-blue-600 mt-2">Contact system administrator for access credentials</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact Info */}
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <span className="text-green-800 font-bold">📞</span>
                </div>
                <div>
                  <p className="text-sm text-green-800 font-semibold mb-1">Need Access?</p>
                  <p className="text-sm text-green-700">Contact the system administrator at:</p>
                  <p className="text-sm text-green-700 font-mono mt-1">sitaramintercollege1205@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-sricblue transition-colors font-medium"
              >
                <span className="mr-2">←</span>
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Server Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              serverStatus === 'online' ? 'bg-green-500' : 
              serverStatus === 'offline' ? 'bg-red-500 animate-pulse' : 
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-white/90 text-sm">
              {serverStatus === 'online' ? 'Backend Server Online' : 
               serverStatus === 'offline' ? 'Backend Server Offline' : 
               'Checking Server...'}
            </span>
          </div>
          
          <div className="text-white/70 text-xs">
            Backend: sitaram-inter-college.onrender.com
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-4 text-center text-white/60 text-xs">
          Secure Admin Portal • Database Authentication v1.0
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

