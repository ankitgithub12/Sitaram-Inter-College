import { useState, useEffect, useRef } from 'react';
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
  const [loginStep, setLoginStep] = useState(1); // 1: Credentials, 2: OTP
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);

  // Hardcoded admin credentials for testing
  const adminCredentials = {
    username: '221205',
    password: 'Sitaram@2002',
    email: 'sitaramintercollege1205@gmail.com'
  };

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const sendOtp = async (email) => {
    try {
      setIsLoading(true);
      console.log('Sending OTP to:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      
      // For testing - log OTP to console
      console.log('OTP for testing:', generatedOtp);
      
      // Store OTP in localStorage for verification
      localStorage.setItem('adminOTP', generatedOtp.toString());
      localStorage.setItem('otpEmail', email);
      
      // Set timer for 2 minutes
      setTimer(120);
      setOtpSent(true);
      setUserEmail(email);
      showToast('OTP sent to your email', 'success');
      
    } catch (error) {
      showToast('Failed to send OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      showToast('Please enter 6-digit OTP', 'error');
      return;
    }

    const storedOtp = localStorage.getItem('adminOTP');
    const storedEmail = localStorage.getItem('otpEmail');

    if (storedOtp === otp && storedEmail === userEmail) {
      // Get actual token from server
      try {
        const response = await axios.post('/api/admin/login', {
          username: formData.username,
          password: formData.password
        });
        
        if (response.data.success && response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
          showToast('Login successful! Redirecting...', 'success');
          setTimeout(() => navigate('/admin'), 1000);
        } else {
          showToast('Login failed', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
      }
    } else {
      showToast('Invalid OTP. Please try again.', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate credentials
      if (formData.username === adminCredentials.username && 
          formData.password === adminCredentials.password) {
        
        // Send OTP to registered email
        await sendOtp(adminCredentials.email);
        setLoginStep(2);
        
      } else {
        showToast('Invalid username or password', 'error');
      }
    } catch (error) {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      showToast('Please enter your email', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (forgotPasswordEmail === adminCredentials.email) {
        showToast('Password reset link sent to your email', 'success');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        showToast('Email not found in our system', 'error');
      }
    } catch (error) {
      showToast('Error sending reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    if (timer > 0) {
      showToast(`Please wait ${timer} seconds before resending`, 'error');
      return;
    }
    sendOtp(userEmail);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                <span className={`mr-3 ${toast.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
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
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center mb-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${loginStep >= 1 ? 'bg-sricgold text-white' : 'bg-white/20 text-white'}`}>
                1
              </div>
              <div className={`w-16 h-1 mx-2 ${loginStep >= 2 ? 'bg-sricgold' : 'bg-white/20'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${loginStep >= 2 ? 'bg-sricgold text-white' : 'bg-white/20 text-white'}`}>
                2
              </div>
            </div>
            
            {/* Animated Logo */}
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-sricgold rounded-full animate-ping opacity-20"></div>
              <img 
                src="/assets/SRIC LOGO.PNG" 
                alt="SRIC Logo" 
                className="h-20 w-20 mx-auto rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">SRIC Admin Portal</h1>
            <p className="text-sricgold font-semibold flex items-center justify-center">
              <span className="mr-2">🛡️</span>
              {loginStep === 1 ? 'Secure Login' : 'OTP Verification'}
            </p>
          </div>

          {/* Step 1: Login Form */}
          {!showForgotPassword && loginStep === 1 && (
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Username Field */}
                <div className="form-group">
                  <label className="flex text-gray-700 font-semibold mb-3 items-center">
                    <span className="mr-2 text-sricblue">👤</span>
                    Username
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-sricblue focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Enter admin username"
                      required
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="flex text-gray-700 font-semibold mb-3 items-center">
                    <span className="mr-2 text-sricblue">🔒</span>
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-sricblue focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Enter your password"
                      required
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sricblue transition-colors"
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-sricblue focus:ring-sricblue mr-2" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sricblue hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span className="mr-3">🔐</span>
                      Login & Send OTP
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials Note */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-start">
                  <span className="text-yellow-500 mt-1 mr-3">ℹ️</span>
                  <div>
                    <p className="text-sm text-yellow-800 font-semibold mb-1">Demo Credentials:</p>
                    <p className="text-sm text-yellow-700">Username: <strong>221205</strong></p>
                    <p className="text-sm text-yellow-700">Password: <strong>Sitaram@2002</strong></p>
                    <p className="text-sm text-yellow-700 mt-1">OTP will be sent to: <strong>sitaramintercollege1205@gmail.com</strong></p>
                    <p className="text-xs text-yellow-600 mt-2">Check browser console for OTP during development</p>
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
          )}

          {/* Step 2: OTP Verification */}
          {!showForgotPassword && loginStep === 2 && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-sricblue">📱</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
                <p className="text-gray-600 mb-4">
                  We've sent a 6-digit OTP to <span className="font-semibold text-sricblue">{userEmail || adminCredentials.email}</span>
                </p>
                
                {/* OTP Input Boxes */}
                <div className="flex justify-center space-x-2 mb-6">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => otpInputRefs.current[index] = el}
                      type="text"
                      maxLength="1"
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-sricblue focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                
                {/* Timer and Resend */}
                <div className="mb-6">
                  {timer > 0 ? (
                    <p className="text-gray-600">
                      OTP valid for: <span className="font-bold text-sricblue">{formatTime(timer)}</span>
                    </p>
                  ) : (
                    <button
                      onClick={resendOtp}
                      className="text-sricblue hover:text-blue-700 font-medium transition-colors"
                    >
                      <span className="mr-2">↻</span>
                      Resend OTP
                    </button>
                  )}
                </div>
                
                {/* Verify Button */}
                <button
                  onClick={verifyOtp}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block animate-spin mr-3">⟳</span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span className="mr-3">✓</span>
                      Verify OTP
                    </>
                  )}
                </button>
                
                {/* Back to Login */}
                <button
                  onClick={() => setLoginStep(1)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-all duration-300"
                >
                  <span className="mr-2">←</span>
                  Back to Login
                </button>
              </div>
              
              {/* OTP Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                  <span className="text-blue-500 mt-1 mr-3">ℹ️</span>
                  <div>
                    <p className="text-sm text-blue-800 font-semibold mb-1">For Development:</p>
                    <p className="text-sm text-blue-700">Check browser console for the OTP code</p>
                    <p className="text-xs text-blue-600 mt-2">
                      <span className="mr-1">💻</span>
                      Press F12 → Console tab to see OTP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forgot Password Form */}
          {showForgotPassword && (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-orange-500">🔑</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="form-group">
                  <label className="flex text-gray-700 font-semibold mb-3 items-center">
                    <span className="mr-2 text-sricblue">✉️</span>
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-sricblue focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Enter your registered email"
                      required
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setLoginStep(1);
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
                  >
                    <span className="mr-2">←</span>
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⟳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">✈️</span>
                        Send Reset Link
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Additional Help */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                  <span className="text-blue-500 mt-1 mr-3">ℹ️</span>
                  <div>
                    <p className="text-sm text-blue-800">
                      If you don't receive the email within 5 minutes, check your spam folder or contact system administrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-white/80">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-sricgold">🛡️</span>
            </div>
            <p className="text-sm">Two-Factor Auth</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-sricgold">✉️</span>
            </div>
            <p className="text-sm">Email OTP</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-sricgold">📊</span>
            </div>
            <p className="text-sm">Activity Logging</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;