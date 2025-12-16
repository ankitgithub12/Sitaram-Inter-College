
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

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
      // Always try server authentication first
      const response = await axios.post('/api/admin/login', {
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
        // Server responded with error status
        const { status, data } = error.response;
        
        if (status === 401) {
          setErrorMessage(data.message || 'Invalid username or password');
        } else if (status === 423) {
          setErrorMessage('Account is temporarily locked. Please try again later.');
        } else if (status === 400) {
          setErrorMessage(data.message || 'Invalid input');
        } else {
          setErrorMessage('Server error. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        setConnectionError(true);
        setErrorMessage('Cannot connect to server. Please check your internet connection and try again.');
      } else {
        // Other errors
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = () => {
    setConnectionError(false);
    setErrorMessage('');
    // Retry server health check
    axios.get('/api/health')
      .then(() => {
        setConnectionError(false);
        showToast('Connected to server!', 'success');
      })
      .catch(() => {
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
            <p className="text-sricgold font-semibold">Database Authenticated Access</p>
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
                  <p className="text-sm text-blue-800 font-semibold mb-1">Secure Database Authentication</p>
                  <p className="text-sm text-blue-700">Credentials are securely stored and validated from the database.</p>
                  <p className="text-xs text-blue-600 mt-2">Default credentials are created automatically on first run</p>
                </div>
              </div>
            </div>

            {/* Admin Credentials Hint (Optional - Remove in production) */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <span className="text-yellow-800 font-bold">ℹ</span>
                </div>
                <div>
                  <p className="text-sm text-yellow-800 font-semibold mb-1">Default Admin Credentials</p>
                  <p className="text-sm text-yellow-700">Username: <span className="font-mono">221205</span></p>
                  <p className="text-sm text-yellow-700">Password: <span className="font-mono">Sitaram@2002</span></p>
                  <p className="text-xs text-yellow-600 mt-2">Stored securely in MongoDB database with bcrypt hashing</p>
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

        {/* Security Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-white/80">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-sricgold font-bold">🔐</span>
            </div>
            <p className="text-sm font-medium">Database Auth</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-sricgold font-bold">⚡</span>
            </div>
            <p className="text-sm font-medium">Bcrypt Hashed</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-sricgold font-bold">🛡️</span>
            </div>
            <p className="text-sm font-medium">Account Lock</p>
          </div>
        </div>

        {/* Server Status */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className={`w-2 h-2 rounded-full mr-2 ${connectionError ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-white/90 text-sm">
              {connectionError ? 'Server Offline' : 'Server Online'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
