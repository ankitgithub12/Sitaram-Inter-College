import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Achievements = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const openLightbox = (src) => {
    setLightboxImage(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage('');
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#mobile-menu') && !event.target.closest('#menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close lightbox with ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    if (lightboxOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [lightboxOpen]);

  // Achievement data with ALL toppers included
  const achievementsData = {
    '2025': {
      class12: [
        { name: 'ANUSHKA', percentage: '86.8%', stream: 'Science (PCM)', highlights: '90+ in Mathematics and Chemistry', rank: 1, certificate: '/assets/Anushka Merit certificate.pdf' },
        { name: 'NITIKA SAINI', percentage: '85.8%', stream: 'Science (PCM)', highlights: '95 in Mathematics - School Highest', rank: 2, certificate: '/assets/NITIKA merit certificate.pdf' },
        { name: 'DIVESH SAINI', percentage: '83%', stream: 'Science (PCB)', highlights: '90+ in English - Exceptional Performance', rank: 3, certificate: '/assets/Divesh Merit Certificate.pdf' }
      ],
      class10: [
        { name: 'MOHANE SAINI', percentage: '85.11%', stream: 'School Topper', highlights: 'Consistent Academic Excellence', rank: 1 },
        { name: 'SHIVANSHI', percentage: '83.83%', stream: '', highlights: '90+ in Hindi and English', rank: 2 },
        { name: 'PINKI', percentage: '83.66%', stream: '', highlights: '80+ in All Subjects - Well-Rounded Performance', rank: 3 },
        { name: 'TARANA', percentage: '83%', stream: '', highlights: 'Excellent in Language Subjects', rank: 4 },
        { name: 'HIMANSHI SAINI', percentage: '82.5%', stream: '', highlights: 'Strong in Science and Mathematics', rank: 5 }
      ]
    },
    '2024': {
      class12: [
        { name: 'SARIKA', percentage: '87.8%', stream: 'Science (PCB)', highlights: '95+ in Biology - Outstanding Achievement', rank: 1, top1Percent: true, certificate: '/assets/Sarika_merit Certificate.pdf' },
        { name: 'SEJAL', percentage: '86.6%', stream: 'Science (PCB)', highlights: '95+ in Hindi - Exceptional Language Skills', rank: 2 },
        { name: 'YUSUF', percentage: '86.8%', stream: 'Science (PCB)', highlights: '95+ in Biology - Excellent Performance', rank: 3 },
        { name: 'NAJUK', percentage: '84.2%', stream: 'Arts (HGH)', highlights: '90+ in Geography - Exceptional Understanding', rank: 4 },
        { name: 'ROSHNI', percentage: '83.2%', stream: 'Science (PCM)', highlights: '95+ in Physics and Hindi', rank: 5 }
      ],
      class10: [
        { name: 'DEEPANSHI', percentage: '91%', stream: 'School Topper', highlights: 'Exceptional All-Round Performance', rank: 1 },
        { name: 'PAYAL', percentage: '89%', stream: '', highlights: '95+ in Mathematics and Science', rank: 2 },
        { name: 'NONAHIAL', percentage: '86%', stream: '', highlights: '90 in Social Science - Outstanding Achievement', rank: 3 },
        { name: 'HIMANSHI SAINI', percentage: '85%', stream: '', highlights: '90 in Science - Excellent Performance', rank: 4 },
        { name: 'TARANA', percentage: '85%', stream: '', highlights: '90 in English - Exceptional Language Skills', rank: 5 }
      ]
    },
    '2023': {
      class12: [
        { name: 'NEHA', percentage: '88.4%', stream: 'Science (PCB)', highlights: '95+ in Biology - Exceptional Performance', rank: 1 },
        { name: 'ROHIT', percentage: '86.2%', stream: 'Science (PCM)', highlights: '95+ in Mathematics - Outstanding Achievement', rank: 2 },
        { name: 'HIMANSHI SAINI', percentage: '84.6%', stream: 'Science (PCB)', highlights: 'Consistent Academic Excellence', rank: 3 },
        { name: 'SADHANA', percentage: '80.6%', stream: 'Humanities', highlights: '90+ in Hindi - Excellent Language Skills', rank: 4 }
      ],
      class10: [
        { name: 'RITIKA', percentage: '89.6%', stream: 'School Topper', highlights: 'Outstanding Academic Performance', rank: 1 },
        { name: 'ANUSHKA', percentage: '84.5%', stream: '', highlights: '90+ in Hindi - Excellent Language Skills', rank: 2 },
        { name: 'DHARMENDRA', percentage: '84.5%', stream: '', highlights: '90+ in Mathematics - Exceptional Problem Solving', rank: 3 },
        { name: 'DIVYANSHI', percentage: '81.33%', stream: '', highlights: '80+ in All Subjects - Well-Rounded Performance', rank: 4 }
      ]
    }
  };

  const subjectToppers = [
    { subject: 'Mathematics', score: '95/100', icon: 'fa-square-root-alt', toppers: ['MOHANE SAINI (10th)', 'NITIKA SAINI (12th)', 'PAYAL (10th)', 'ROHIT (12th)'] },
    { subject: 'Science', score: '95+/100', icon: 'fa-flask', toppers: ['PAYAL (10th)', 'ROSHNI (12th PCM) Physics 97', 'SARIKA (12th) Biology 95+', 'NEHA (12th) Biology 95+'] },
    { subject: 'Social Science', score: '95/100', icon: 'fa-book', toppers: ['RITIKA (10th)', 'NONAHIAL (10th)', 'DEEPANSHI (10th)', 'NAJUK (12th) Geography 90+'] },
    { subject: 'English', score: '90+/100', icon: 'fa-language', toppers: ['SHIVANSHI (10th)', 'DIVESH (12th)', 'TARANA (10th)', 'SEJAL (12th)'] },
    { subject: 'Hindi', score: '95+/100', icon: 'fa-font', toppers: ['SEJAL (12th)', 'ANUSHKA (10th)', 'ROSHNI (12th)', 'SHIVANSHI (10th)'] }
  ];

  const galleryImages = [
    '/assets/Selection1.jpeg',
    '/assets/teachers1.jpeg',
    '/assets/teachers2.jpeg',
    '/assets/prize6.jpeg',
    '/assets/success.jpeg'
  ];

  const stats = [
    { number: '96%', label: '12th Board Pass Rate', icon: 'fa-graduation-cap' },
    { number: '98%', label: '10th Board Pass Rate', icon: 'fa-award' },
    { number: 'TOP 1%', label: 'State Rank Holders', icon: 'fa-trophy' },
    { number: '50+', label: 'Govt Job Selections Yearly', icon: 'fa-user-tie' },
    { number: '1000+', label: 'Successful Alumni', icon: 'fa-users' },
    { number: '20+', label: 'Years of Excellence', icon: 'fa-history' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <span 
            className="absolute top-6 right-6 text-white text-4xl cursor-pointer z-10 hover:text-sricgold transition-colors"
            onClick={closeLightbox}
          >
            &times;
          </span>
          <img 
            src={lightboxImage} 
            alt="Achievement" 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header - Same as Home.jsx */}
      <header className="sticky top-0 z-50 shadow-lg backdrop-blur-lg bg-sricblue/95">
        <nav className="bg-sricblue p-4">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo + School Name */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/SRIC LOGO.PNG" 
                alt="SRIC Logo" 
                className="h-10 w-10 rounded-full border-2 border-sricgold"
              />
              <Link to="/" className="text-white text-xl font-bold hover:text-sricgold transition-colors">
                SITARAM INTER COLLEGE
              </Link>
              <span className="hidden sm:inline text-sricgold text-sm">
                Empowering Minds, Shaping Futures
              </span>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
              <li>
                <Link to="/" className="nav-link text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              
              {/* About Us Dropdown */}
              <li className="relative group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition-colors">
                  About Us 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                  <li>
                    <Link to="/mission" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link to="/history" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      History
                    </Link>
                  </li>
                  <li>
                    <Link to="/faculty" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Faculty
                    </Link>
                  </li>
                </ul>
              </li>
              
              {/* Academics Dropdown */}
              <li className="relative group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition-colors">
                  Academics 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                  <li>
                    <Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Achievements Link - Active */}
              <li>
                <Link to="/achievements" className="nav-link text-sricgold font-bold hover:text-yellow-200 transition-colors border-b-2 border-sricgold">
                  Achievements
                </Link>
              </li>

              {/* Admissions Dropdown */}
              <li className="relative group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition-colors">
                  Admissions 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                  <li>
                    <Link to="/process" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link to="/fees" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Fees
                    </Link>
                  </li>
                  <li>
                    <Link to="/admission-form" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Apply Now
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/contact" className="nav-link text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Buttons Group */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Admin Button */}
              <Link 
                to="/admin-login" 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2.5 rounded-lg font-bold flex items-center space-x-2 transition-all duration-300 hover:shadow-lg"
              >
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </Link>
              
              {/* CTA Button */}
              <Link 
                to="/admission-form" 
                className="bg-sricgold hover:bg-yellow-500 text-sricblue px-5 py-2.5 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <button 
              id="menu-toggle"
              onClick={toggleMobileMenu}
              className="md:hidden text-white focus:outline-none transition-transform hover:scale-110"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            id="mobile-menu" 
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-sricblue/95 backdrop-blur-lg pb-4 px-4 transition-all duration-300`}
          >
            <ul className="flex flex-col space-y-2">
              <li className="mobile-menu-item">
                <Link 
                  to="/" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-sricblue/50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              
              {/* About Us Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-sricblue/50 flex justify-between items-center transition-all"
                >
                  About Us 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'about' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/mission" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/history" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      History
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/faculty" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Faculty
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Academics Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('academics')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-sricblue/50 flex justify-between items-center transition-all"
                >
                  Academics 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'academics' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'academics' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/curriculum" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/programs" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Achievements Link - Active */}
              <li className="mobile-menu-item">
                <Link 
                  to="/achievements" 
                  className="block text-sricgold font-bold py-3 px-4 rounded-lg bg-sricblue/50 transition-all border-l-4 border-sricgold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Achievements
                </Link>
              </li>

              {/* Admissions Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('admissions')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-sricblue/50 flex justify-between items-center transition-all"
                >
                  Admissions 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'admissions' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'admissions' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/process" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/fees" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Fees
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admission-form" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-sricblue/50 transition-all text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Apply Now
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="mobile-menu-item">
                <Link 
                  to="/contact" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-sricblue/50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              
              {/* Mobile Admin Button */}
              <li className="mobile-menu-item">
                <Link 
                  to="/admin-login" 
                  className="bg-white bg-opacity-20 text-white py-3 px-4 rounded-lg text-center font-bold flex items-center justify-center space-x-2 transition-all hover:bg-opacity-30"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-user-shield"></i>
                  <span>Admin Login</span>
                </Link>
              </li>
              
              {/* Mobile Apply Now Button */}
              <li className="mobile-menu-item">
                <Link 
                  to="/admission-form" 
                  className="block bg-sricgold text-sricblue px-4 py-3 rounded-lg text-center font-bold hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-sricblue via-blue-800 to-purple-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 bg-sricgold rounded-full animate-pulse"></div>
          <div className="absolute bottom-16 right-16 w-20 h-20 bg-sricgold rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-sricgold rounded-full"></div>
        </div>
        
        {/* Floating Achievement Icons */}
        <div className="absolute top-8 right-8 opacity-20 animate-float">
          <i className="fas fa-trophy text-7xl"></i>
        </div>
        <div className="absolute bottom-8 left-8 opacity-20 animate-float delay-1000">
          <i className="fas fa-award text-6xl"></i>
        </div>
        <div className="absolute top-1/2 left-8 opacity-20 animate-float delay-500">
          <i className="fas fa-medal text-5xl"></i>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-sricgold to-yellow-200 rounded-full blur-2xl opacity-30"></div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sricgold to-yellow-200 relative">
              Academic Excellence
            </h1>
            <div className="h-2 w-32 bg-gradient-to-r from-sricgold to-yellow-200 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-8 opacity-90 font-light">
            Celebrating the Brilliant Minds Who Define Success at SRIC
          </p>
          
          {/* Animated Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] transform hover:scale-110 transition-all duration-300 border border-white/20 hover:border-sricgold"
              >
                <i className={`fas ${stat.icon} text-2xl text-sricgold mb-2`}></i>
                <div className="text-2xl font-bold text-sricgold">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-sricgold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-sricgold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Special Recognition Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="mb-8 lg:mb-0 lg:mr-10">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <i className="fas fa-crown text-4xl text-purple-700"></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="text-center lg:text-left flex-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">🏆 State-Level Excellence Achievers 🏆</h3>
                <p className="text-xl mb-8 leading-relaxed">
                  Our exceptional students consistently rank in the <span className="font-bold text-yellow-300 text-2xl">TOP 1%</span> of 
                  Uttar Pradesh Board examinations, setting new benchmarks of academic excellence year after year.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <span className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-medium border border-white/30 hover:scale-105 transition-transform">
                    🥇 Sarika - 87.8% (2023-24)
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-medium border border-white/30 hover:scale-105 transition-transform">
                    🥈 Anushka - 86.8% (2024-25)
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-medium border border-white/30 hover:scale-105 transition-transform">
                    🥉 Nitika Saini - 85.8% (2024-25)
                  </span>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 lg:ml-auto">
                <a 
                  href="/assets/top_performers_certificates1.pdf" 
                  className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                >
                  <i className="fas fa-certificate text-xl mr-3"></i>
                  View All Certificates
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Toppers Section - UNIQUE AND ATTRACTIVE */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-sricblue to-purple-600 bg-clip-text text-transparent">
                Our Academic Champions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet the brilliant minds who have carved their names in the annals of SRIC's academic excellence with their outstanding performances
            </p>
          </div>

          {/* Enhanced Year Selection */}
          <div className="flex justify-center mb-16">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 inline-flex shadow-lg">
              {['2025', '2024', '2023'].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                    selectedYear === year
                      ? 'bg-gradient-to-r from-sricblue to-purple-600 text-white shadow-2xl scale-105'
                      : 'text-gray-600 hover:text-sricblue hover:bg-white hover:scale-105'
                  }`}
                >
                  {year === '2025' ? '2024-25' : year === '2024' ? '2023-24' : '2022-23'}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Toppers Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Class 12 Toppers - Enhanced Design */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-sricblue to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500">
                {/* Header */}
                <div className="flex items-center mb-10">
                  <div className="bg-gradient-to-br from-sricblue to-blue-800 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-3xl font-bold text-sricblue">CLASS 12 TOPPERS</h3>
                    <p className="text-gray-500 text-sm mt-1">Senior Secondary Excellence</p>
                  </div>
                  <div className="ml-auto bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-bold">
                    {achievementsData[selectedYear].class12.length} Achievers
                  </div>
                </div>
                
                {/* Toppers List */}
                <div className="space-y-6">
                  {achievementsData[selectedYear].class12.map((topper, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 group/item hover:scale-[1.02] relative overflow-hidden"
                    >
                      {/* Top 1% Badge */}
                      {topper.top1Percent && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-sricblue text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                          🏆 TOP 1% IN UP
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        {/* Rank Badge */}
                        <div className={`relative ${
                          topper.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-sricblue' : 
                          topper.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : 
                          'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                        } w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg`}>
                          {topper.rank}
                          {topper.rank === 1 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                          )}
                        </div>
                        
                        {/* Topper Details */}
                        <div className="ml-6 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-xl text-gray-800 group-hover/item:text-sricblue transition-colors">
                                {topper.name}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">{topper.stream}</p>
                            </div>
                            <span className="bg-sricblue text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover/item:scale-110 transition-transform">
                              {topper.percentage}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">{topper.highlights}</p>
                          
                          {/* Certificate Link */}
                          {topper.certificate && (
                            <div className="mt-3">
                              <a 
                                href={topper.certificate} 
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <i className="fas fa-certificate mr-1"></i> View Merit Certificate
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Class 10 Toppers - Enhanced Design */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-sricgold to-yellow-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500">
                {/* Header */}
                <div className="flex items-center mb-10">
                  <div className="bg-gradient-to-br from-sricgold to-yellow-500 text-sricblue w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    <i className="fas fa-award"></i>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-3xl font-bold text-sricblue">CLASS 10 TOPPERS</h3>
                    <p className="text-gray-500 text-sm mt-1">Secondary School Excellence</p>
                  </div>
                  <div className="ml-auto bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-bold">
                    {achievementsData[selectedYear].class10.length} Achievers
                  </div>
                </div>
                
                {/* Toppers List */}
                <div className="space-y-6">
                  {achievementsData[selectedYear].class10.map((topper, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-100 hover:shadow-lg transition-all duration-300 group/item hover:scale-[1.02]"
                    >
                      <div className="flex items-center">
                        {/* Rank Badge */}
                        <div className={`relative ${
                          topper.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-sricblue' : 
                          topper.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : 
                          'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                        } w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg`}>
                          {topper.rank}
                          {topper.rank === 1 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                          )}
                        </div>
                        
                        {/* Topper Details */}
                        <div className="ml-6 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-xl text-gray-800 group-hover/item:text-sricblue transition-colors">
                                {topper.name}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">{topper.stream}</p>
                            </div>
                            <span className="bg-sricgold text-sricblue px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover/item:scale-110 transition-transform">
                              {topper.percentage}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">{topper.highlights}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-sricblue to-purple-600 text-white font-bold py-4 px-12 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center group">
              <span>View Complete Toppers List</span>
              <i className="fas fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Subject Excellence Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-sricblue to-purple-600 bg-clip-text text-transparent">
                Subject Mastery
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exceptional performance across all academic disciplines showcasing comprehensive excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {subjectToppers.map((subject, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 group"
              >
                <div className="bg-gradient-to-br from-sricblue to-blue-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <i className={`fas ${subject.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-800 group-hover:text-sricblue transition-colors">
                  {subject.subject}
                </h3>
                <p className="text-sricblue text-center font-bold text-2xl mb-6 bg-blue-50 py-2 rounded-xl">
                  {subject.score}
                </p>
                <div className="space-y-3">
                  {subject.toppers.map((topper, idx) => (
                    <p 
                      key={idx} 
                      className="text-sm text-gray-600 text-center font-medium bg-gray-50 py-2 rounded-lg hover:bg-blue-50 hover:text-sricblue transition-all duration-300"
                    >
                      {topper}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-sricblue to-purple-600 bg-clip-text text-transparent">
                Moments of Pride
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Capturing the joy and celebration of our students' remarkable achievements
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="relative rounded-3xl overflow-hidden group cursor-pointer aspect-square transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image} 
                  alt={`Achievement ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
                  <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <i className="fas fa-search-plus text-2xl mb-2"></i>
                    <p className="text-sm font-medium">View Image</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Enhanced Placeholder Cards */}
            {[5,6,7,8,9].map((item) => (
              <div 
                key={item}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl aspect-square flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:scale-105 group"
              >
                <div className="text-center">
                  <i className="fas fa-trophy text-4xl text-gray-300 group-hover:text-sricgold transition-colors duration-500"></i>
                  <p className="text-gray-400 text-sm mt-3 font-medium">More Achievements</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/gallery" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-sricblue to-purple-600 text-white font-bold py-4 px-12 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
            >
              <i className="fas fa-images text-xl mr-4 group-hover:scale-110 transition-transform"></i>
              Explore Full Achievement Gallery
              <i className="fas fa-arrow-right text-xl ml-4 group-hover:translate-x-2 transition-transform"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Inspirational Call to Action */}
      <section className="py-24 bg-gradient-to-r from-sricgold via-yellow-400 to-amber-400 text-sricblue relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-sricblue rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-sricblue rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-sricblue rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to Write Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-sricblue to-purple-600">Success Story</span>?
          </h2>
          <p className="text-2xl max-w-3xl mx-auto mb-12 font-semibold leading-relaxed">
            Join the legacy of academic excellence and become our next proud achiever at SRIC Senior Secondary School
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link 
              to="/admission-form" 
              className="bg-sricblue hover:bg-blue-900 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl inline-flex items-center justify-center text-lg group"
            >
              <i className="fas fa-user-graduate text-2xl mr-4 group-hover:scale-110 transition-transform"></i>
              Start Your Academic Journey
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-3 border-sricblue hover:bg-sricblue hover:text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center text-lg group"
            >
              <i className="fas fa-phone-alt text-2xl mr-4 group-hover:scale-110 transition-transform"></i>
              Schedule a Visit
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-sricblue to-blue-900 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">SRIC</span>
                </div>
                <h3 className="text-2xl font-bold ml-4">SRIC</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">Preparing students for board success and life achievements since 2002.</p>
              <div className="flex space-x-4">
                {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((platform, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="text-gray-400 hover:text-sricgold transition-colors duration-300 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sricblue"
                  >
                    <i className={`fab fa-${platform}`}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-sricgold">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'About Us', 'Academics', 'Achievements', 'Admissions'].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} 
                      className="text-gray-400 hover:text-sricgold transition-colors duration-300 flex items-center group"
                    >
                      <i className="fas fa-chevron-right text-xs mr-3 group-hover:translate-x-1 transition-transform"></i>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-sricgold">Academic Streams</h4>
              <ul className="space-y-3">
                {['Science (PCMB)', 'Humanities', 'Commerce', 'Vocational Courses'].map((stream, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-sricgold transition-colors duration-300 flex items-center group">
                      <i className="fas fa-bookmark text-xs mr-3 text-sricgold"></i>
                      {stream}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-sricgold">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-4 text-sricgold text-lg"></i>
                  <span className="text-gray-400 leading-relaxed">Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-4 text-sricgold text-lg"></i>
                  <span className="text-gray-400">+91 9756517750</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-4 text-sricgold text-lg"></i>
                  <span className="text-gray-400">sitaramintercollege1205@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">© 2025 SRIC Senior Secondary School. All rights reserved. | Empowering Minds, Shaping Futures</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Achievements;