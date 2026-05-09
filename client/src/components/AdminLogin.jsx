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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  // Hardcoded admin credentials (NOT displayed on screen)
  const adminCredentials = {
    username: '221205',
    password: 'Sitaram@2002',
    email: 'sitaramintercollege1205@gmail.com'
  };

  // Check if already logged in
  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'teacher') navigate('/teacher-dashboard');
    else if (role === 'student') navigate('/student-dashboard');
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

    try {
      // Use universal login endpoint
      const response = await axios.post('/api/login', {
        username: formData.username,
        password: formData.password
      });
      
      if (response.data.success) {
        const { role, token, name, userId } = response.data;
        
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('userName', name || formData.username);
        sessionStorage.setItem('loginID', formData.username);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('adminAuth', 'true');
        
        // Also store in localStorage for components that use it (like StudentDashboard)
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', name || formData.username);
        
        showToast(`Welcome back, ${name || formData.username}!`, 'success');
        
        // Redirect based on role
        setTimeout(() => {
          if (role === 'admin') {
            localStorage.setItem('adminToken', token);
            navigate('/admin');
          } else if (role === 'teacher') {
            localStorage.setItem('teacherToken', token);
            navigate('/teacher-dashboard');
          } else if (role === 'student') {
            localStorage.setItem('studentToken', token);
            navigate('/student-dashboard');
          }
        }, 1000);
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 401) {
          setErrorMessage('Access Denied: Invalid credentials. Cross-check your username and passkey.');
        } else if (status === 403) {
          setErrorMessage(message || 'Access Forbidden: This account has been disabled by a system administrator.');
        } else if (status === 404) {
          setErrorMessage('System Error: Login node not found. Please contact support.');
        } else {
          setErrorMessage(message || 'An unexpected error occurred during authentication.');
        }
      } else {
        setErrorMessage('Network Error: Unable to reach the authentication server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setErrorMessage('Please enter your email');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (forgotPasswordEmail === adminCredentials.email) {
        showToast('Password reset link sent to your email', 'success');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        setErrorMessage('Email not found in our system');
      }
    } catch (error) {
      setErrorMessage('Error sending reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative font-['Inter',_sans-serif]">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-64 bg-sricblue z-0"></div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full border-t-4 border-sricgold relative z-10">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`absolute -top-16 left-0 right-0 p-4 rounded-lg shadow-md animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'
          } flex items-center justify-center space-x-3 z-50`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="bg-sricblue w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md mb-4 border-4 border-white">
            <svg className="w-10 h-10 text-sricgold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Admin <span className="text-sricblue">Portal</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to manage Sitaram Inter College</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          {!showForgotPassword ? (
            <>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-semibold text-sricblue hover:text-blue-800 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition-all"
                  placeholder="admin@sric.edu.in"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full bg-sricblue text-white py-3 rounded-lg font-bold hover:bg-sricblue transition-colors shadow-md"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm flex items-start space-x-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sricgold text-sricblue py-3 rounded-lg font-bold hover:bg-sricgold transition-colors shadow-md flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-sricblue" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
              </>
            )}
          </button>

          <div className="pt-6 mt-4 border-t border-gray-200 text-center">
             <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-sricblue transition-colors group">
               <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
               </svg>
               Back to Home
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;