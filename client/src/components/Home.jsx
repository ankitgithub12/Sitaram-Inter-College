import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md">
        <nav className="bg-sricblue p-4">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo + School Name */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/SRIC LOGO.PNG" 
                alt="SRIC Logo" 
                className="h-10 w-10 rounded-full"
              />
              <Link to="/" className="text-white text-xl font-bold">
                SITARAM INTER COLLEGE
              </Link>
              <span className="hidden sm:inline text-sricgold text-sm">
                Empowering Minds, Shaping Futures
              </span>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
              <li>
                <Link to="/" className="nav-link text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              
              {/* About Us Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  About Us 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/mission" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link to="/history" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      History
                    </Link>
                  </li>
                  <li>
                    <Link to="/faculty" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Faculty
                    </Link>
                  </li>
                </ul>
              </li>
              
              {/* Academics Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Academics 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admissions Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Admissions 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/process" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link to="/fees" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Fees
                    </Link>
                  </li>
                </ul>
              </li>

              {/* News & Events Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  News & Events 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/calendar" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link to="/announcements" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Announcements
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gallery Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Gallery 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/photos-videos" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Photos/Videos
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="mr-4">
                <Link to="/contact" className="nav-link text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Buttons Group */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Admin Button */}
              <Link 
                to="/admin-login" 
                className="admin-button px-4 py-2.5 rounded-md font-bold flex items-center space-x-2"
              >
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </Link>
              
              {/* CTA Button */}
              <Link 
                to="/admission-form" 
                className="pulse-button bg-sricgold text-sricblue px-5 py-2.5 rounded-md font-bold hover:bg-yellow-500 transition transform hover:scale-105"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <button 
              id="menu-toggle"
              onClick={toggleMobileMenu}
              className="md:hidden text-white focus:outline-none"
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
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-sriclightblue pb-4 px-4`}
          >
            <ul className="flex flex-col space-y-2">
              <li className="mobile-menu-item">
                <Link 
                  to="/" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              
              {/* About Us Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/history" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      History
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/faculty" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
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
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/programs" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admissions Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('admissions')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/fees" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Fees
                    </Link>
                  </li>
                </ul>
              </li>

              {/* News & Events Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('news')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
                >
                  News & Events 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'news' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'news' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/calendar" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/announcements" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Announcements
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gallery Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('gallery')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
                >
                  Gallery 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'gallery' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'gallery' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/photos-videos" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Photos/Videos
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="mobile-menu-item">
                <Link 
                  to="/contact" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              
              {/* Mobile Admin Button */}
              <li className="mobile-menu-item">
                <Link 
                  to="/admin-login" 
                  className="admin-button flex text-white py-3 px-4 rounded-md text-center font-bold items-center justify-center space-x-2"
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
                  className="block pulse-button bg-sricgold text-sricblue px-4 py-3 rounded-md text-center font-bold hover:bg-yellow-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Empowering Minds, Shaping Futures</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            SRIC Senior Secondary School provides quality education with a focus on academic excellence and holistic development since 2002
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/admission-form" 
              className="bg-sricgold hover:bg-yellow-600 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Apply Now
            </Link>
            <Link 
              to="/mission" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Welcome to SRIC Senior Secondary School
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Established in 2002, SRIC Senior Secondary School has been a beacon of quality education in Amroha, providing students with a nurturing environment that fosters academic excellence, character development, and holistic growth.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card bg-gray-50 p-8 rounded-lg shadow-md transition duration-300">
                <div className="text-sricblue text-4xl mb-4">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Academic Excellence</h3>
                <p className="text-gray-600">Consistent 95%+ board results with specialized coaching for 10th and 12th standard examinations.</p>
              </div>
              
              <div className="feature-card bg-gray-50 p-8 rounded-lg shadow-md transition duration-300">
                <div className="text-sricblue text-4xl mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Experienced Faculty</h3>
                <p className="text-gray-600">Our dedicated teachers provide personalized attention and mentorship to every student.</p>
              </div>
              
              <div className="feature-card bg-gray-50 p-8 rounded-lg shadow-md transition duration-300">
                <div className="text-sricblue text-4xl mb-4">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Modern Facilities</h3>
                <p className="text-gray-600">Smart classrooms, well-equipped labs, and a digital library enhance the learning experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-sricblue text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SRIC?</h2>
            <p className="text-xl max-w-2xl mx-auto">Our numbers speak for themselves</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
              <div className="text-4xl font-bold mb-2">96%</div>
              <p className="font-semibold">12th Board Pass Rate</p>
            </div>
            
            <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="font-semibold">10th Board Pass Rate</p>
            </div>
            
            <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="font-semibold">Students in Govt Jobs Yearly</p>
            </div>
            
            <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
              <div className="text-4xl font-bold mb-2">20+</div>
              <p className="font-semibold">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Exam Datesheet Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-sricblue via-blue-800 to-purple-900 text-white">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-sricgold rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-sricgold rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        {/* Floating academic icons */}
        <div className="absolute top-5 right-5 opacity-20">
          <i className="fas fa-graduation-cap text-6xl"></i>
        </div>
        <div className="absolute bottom-5 left-5 opacity-20">
          <i className="fas fa-book-open text-5xl"></i>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header with animated decoration */}
            <div className="text-center mb-12">
              <div className="inline-block relative mb-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sricgold to-yellow-200">
                  त्रैमासिक परीक्षा समय सारणी
                </h2>
                <div className="h-1 w-24 bg-sricgold mx-auto mt-2 rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-sricgold rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full"></div>
              </div>
              <p className="text-xl md:text-2xl opacity-90">Quarterly Examination Schedule 2025-26</p>
              
              {/* Animated badge */}
              <div className="inline-flex items-center mt-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 border border-white border-opacity-30">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium">Latest Schedule Published</span>
              </div>
            </div>
            
            {/* Notice Card with enhanced design */}
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-8 mb-10 border border-white border-opacity-20 shadow-2xl transform transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-sricgold bg-opacity-20 p-3 rounded-full mr-4">
                  <i className="fas fa-bullhorn text-sricgold text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center">
                    विशेष सूचना / Special Notice
                    <span className="ml-3 px-2 py-1 bg-red-500 text-xs rounded-full animate-pulse">Important</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Notice in Hindi */}
                    <div className="bg-white bg-opacity-10 rounded-xl p-5 border-l-4 border-sricgold">
                      <h4 className="font-bold text-lg mb-3 text-sricgold">हिंदी में सूचना</h4>
                      <p className="mb-4">कक्षा 9 से 12 तक के सभी छात्र/छात्राओं को सूचित किया जाता है कि:</p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <i className="fas fa-check-circle mt-1 mr-3 text-green-400"></i>
                          <span>सभी विद्यार्थी दिनांक 03-10-2025, शुक्रवार को अपने अभिभावकों के साथ विद्यालय में प्रातः 8 बजे उपस्थित हों।</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle mt-1 mr-3 text-green-400"></i>
                          <span>उस दिन परीक्षा भी संचालित होगी; जिस विषय की परीक्षा है, वही परीक्षा आयोजित की जाएगी।</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle mt-1 mr-3 text-green-400"></i>
                          <span>प्रत्येक विद्यार्थी के लिए यह अनिवार्य है कि वे अपने अभिभावक (माता/पिता/बड़े भाई/बहन) को शुक्रवार को विद्यालय में लाएं।</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Notice in English */}
                    <div className="bg-white bg-opacity-10 rounded-xl p-5 border-l-4 border-blue-400">
                      <h4 className="font-bold text-lg mb-3 text-blue-300">Information in English</h4>
                      <p className="mb-4">All students from classes 9 to 12 are informed that:</p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <i className="fas fa-check-circle mt-1 mr-3 text-green-400"></i>
                          <span>All students must be present at school with their parents/guardians on Friday, 03-10-2025 at 8:00 AM.</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle mt-1 mr-3 text-green-400"></i>
                          <span>Exams will also be conducted on that day; the scheduled exam for that day will take place.</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle mt-1 mr-3 text-green-400"></i>
                          <span>It is mandatory for every student to bring their parent/guardian to school on Friday.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Signature section */}
                  <div className="mt-8 pt-6 border-t border-white border-opacity-20 text-center">
                    <p className="font-semibold text-sricgold">धन्यवाद। / Thank you.</p>
                    <div className="mt-4 flex justify-center items-center">
                      <div className="h-px w-16 bg-sricgold mx-2"></div>
                      <p className="text-lg">आज्ञानुसार, / Sincerely,</p>
                      <div className="h-px w-16 bg-sricgold mx-2"></div>
                    </div>
                    <p className="text-xl font-bold mt-2">प्रधानाचार्य / Principal</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Preview of Schedule */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-6 text-center">Exam Schedule Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div className="text-sricgold text-2xl font-bold">04</div>
                  <div className="text-sm">October</div>
                  <div className="text-xs mt-2">हिंदी / Hindi</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div className="text-sricgold text-2xl font-bold">06</div>
                  <div className="text-sm">October</div>
                  <div className="text-xs mt-2">अंग्रेजी / English</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div className="text-sricgold text-2xl font-bold">07</div>
                  <div className="text-sm">October</div>
                  <div className="text-xs mt-2">गणित / Mathematics</div>
                </div>
              </div>
              <p className="text-center mt-4 text-sm opacity-80">Time: 8:30 AM - 11:30 AM for all exams</p>
            </div>
            
            {/* Action Buttons with enhanced design */}
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link 
                to="/calendar" 
                className="group relative bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <i className="fas fa-calendar-alt mr-3 text-xl"></i>
                  View Full Schedule
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </Link>
              
              <a 
                href="/assets/त्रैमासिक परीक्षा समय सारणी.pdf" 
                className="group relative bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-sricblue overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <i className="fas fa-download mr-3 text-xl"></i>
                  Download Datesheet
                  <i className="fas fa-external-link-alt ml-2 group-hover:translate-y-1 transition-transform duration-300"></i>
                </div>
              </a>
            </div>
            
            {/* Additional info */}
            <div className="text-center mt-8 opacity-80">
              <p className="text-sm flex items-center justify-center">
                <i className="fas fa-info-circle mr-2"></i>
                For any queries, contact school administration
              </p>
            </div>
          </div>
        </div>
      </section>
       <section className="py-20 relative overflow-hidden bg-gradient-to-br from-red-900 via-red-700 to-orange-800 text-white">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        {/* Floating exam icons */}
        <div className="absolute top-5 right-5 opacity-20">
          <i className="fas fa-clock text-6xl"></i>
        </div>
        <div className="absolute bottom-5 left-5 opacity-20">
          <i className="fas fa-calendar-check text-5xl"></i>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header with animated decoration */}
            <div className="text-center mb-12">
              <div className="inline-block relative mb-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                  अर्धवार्षिक परीक्षा समय सारणी
                </h2>
                <div className="h-1 w-24 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full"></div>
              </div>
              <p className="text-xl md:text-2xl opacity-90">Half Yearly Examination Schedule 2025-26</p>
              
              {/* Live Status Badge */}
              <div className="inline-flex items-center mt-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 border border-white border-opacity-30">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium">Exams Currently Ongoing</span>
              </div>
            </div>
            
            {/* Notice Card with enhanced design */}
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-8 mb-10 border border-white border-opacity-20 shadow-2xl transform transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-yellow-400 bg-opacity-20 p-3 rounded-full mr-4">
                  <i className="fas fa-exclamation-triangle text-yellow-400 text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center">
                    परीक्षा जारी है / Exams in Progress
                    <span className="ml-3 px-2 py-1 bg-red-500 text-xs rounded-full animate-pulse">Live</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Notice in Hindi */}
                    <div className="bg-white bg-opacity-10 rounded-xl p-5 border-l-4 border-yellow-400">
                      <h4 className="font-bold text-lg mb-3 text-yellow-300">हिंदी में सूचना</h4>
                      <p className="mb-4">सभी विद्यार्थियों को सूचित किया जाता है कि अर्धवार्षिक परीक्षाएं चल रही हैं।</p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <i className="fas fa-calendar-day mt-1 mr-3 text-green-400"></i>
                          <span>परीक्षा दिनांक: 11 दिसंबर 2025 - 26 दिसंबर 2025</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-clock mt-1 mr-3 text-green-400"></i>
                          <span>समय: प्रातः 8:30 बजे से 11:30 बजे तक</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-map-marker-alt mt-1 mr-3 text-green-400"></i>
                          <span>स्थान: संबंधित कक्षा कक्षों में</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-exclamation-circle mt-1 mr-3 text-red-400"></i>
                          <span className="font-semibold">नोट: नियमित रूप से उपस्थिति अनिवार्य है।</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Notice in English */}
                    <div className="bg-white bg-opacity-10 rounded-xl p-5 border-l-4 border-red-400">
                      <h4 className="font-bold text-lg mb-3 text-red-300">Information in English</h4>
                      <p className="mb-4">All students are informed that Half Yearly Examinations are currently underway.</p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <i className="fas fa-calendar-day mt-1 mr-3 text-green-400"></i>
                          <span>Exam Dates: 11th December 2025 - 26th December 2025</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-clock mt-1 mr-3 text-green-400"></i>
                          <span>Time: 8:30 AM to 11:30 AM</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-map-marker-alt mt-1 mr-3 text-green-400"></i>
                          <span>Venue: Respective Classrooms</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-exclamation-circle mt-1 mr-3 text-red-400"></i>
                          <span className="font-semibold">Note: Regular attendance is mandatory.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fees Payment Button */}
              <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-lg font-bold mb-2">PENDING FEES PAYMENT?</h4>
                    <p className="text-sm opacity-90">Ensure your fees are paid to avoid any inconvenience during exams.</p>
                  </div>
                  <Link 
                    to="/fees" 
                    className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      <i className="fas fa-rupee-sign mr-3 text-xl"></i>
                      Pay Fees Now
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Quick Preview of Schedule */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-6 text-center">Upcoming Exam Schedule</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div className="text-yellow-300 text-2xl font-bold">20</div>
                  <div className="text-sm">December</div>
                  <div className="text-xs mt-2">गणित / Mathematics</div>
                  <div className="text-xs text-yellow-300 mt-1">Class 9-12</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div className="text-yellow-300 text-2xl font-bold">12</div>
                  <div className="text-sm">December</div>
                  <div className="text-xs mt-2">विज्ञान / Science</div>
                  <div className="text-xs text-yellow-300 mt-1">Class 9-10</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div className="text-yellow-300 text-2xl font-bold">12</div>
                  <div className="text-sm">December</div>
                  <div className="text-xs mt-2">भौतिकी / Physics</div>
                  <div className="text-xs text-yellow-300 mt-1">Class 11-12</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                  <div className="text-yellow-300 text-2xl font-bold">16</div>
                  <div className="text-sm">December</div>
                  <div className="text-xs mt-2">रसायन / Chemistry</div>
                  <div className="text-xs text-yellow-300 mt-1">Class 11-12</div>
                </div>
              </div>
              <p className="text-center mt-4 text-sm opacity-80">Time: 8:30 AM - 11:30 AM for all exams</p>
            </div>
            
            {/* Action Buttons with enhanced design */}
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link 
                to="/calendar" 
                className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <i className="fas fa-calendar-alt mr-3 text-xl"></i>
                  View Full Schedule
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </Link>
              
              <a 
                href="assets\Half Yearly Examination Date Sheet 2025.pdf" 
                className="group relative bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-red-700 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <i className="fas fa-download mr-3 text-xl"></i>
                  Download Datesheet
                  <i className="fas fa-external-link-alt ml-2 group-hover:translate-y-1 transition-transform duration-300"></i>
                </div>
              </a>
              
              {/* Fees Button */}
              <Link 
                to="/fees" 
                className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <i className="fas fa-rupee-sign mr-3 text-xl"></i>
                  Pay Exam Fees
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </Link>
            </div>
            
            {/* Additional info */}
            <div className="text-center mt-8 opacity-80">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-sm flex items-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  For exam-related queries, contact exam cell
                </p>
                <p className="text-sm flex items-center">
                  <i className="fas fa-phone-alt mr-2"></i>
                  Contact: +91 9756517750
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* Toppers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Academic Toppers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Celebrating the outstanding achievements of our students in board examinations</p>
          </div>

          {/* Special Recognition for Top 1% Achievers */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 mb-10 shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center">
                  <i className="fas fa-trophy text-3xl text-yellow-300"></i>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">State-Level Excellence</h3>
                <p className="text-lg mb-3">Our Class 12 students have achieved remarkable success by ranking in the <span className="font-bold text-yellow-300">TOP 1%</span> of the entire Uttar Pradesh Board!</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Anushka - 86.8%</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Nitika Saini - 85.8%</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Divesh Saini - 83%</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-auto">
                <a 
                  href="/assets/top_performers_certificates.pdf" 
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
                >
                  <i className="fas fa-certificate mr-2"></i> View All Certificates
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 12th Toppers */}
            <div className="bg-gradient-to-br from-sricblue to-blue-900 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-white text-sricblue w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
                  <i className="fas fa-medal"></i>
                </div>
                <h3 className="text-2xl font-bold ml-4">Class 12 Toppers (2024-25)</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">ANUSHKA</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">86.8%</span>
                  </div>
                  <p className="text-sm opacity-90">Science Stream</p>
                  <div className="mt-2">
                    <a 
                      href="/assets/Anushka Merit certificate.pdf" 
                      className="text-xs text-blue-200 hover:text-white underline flex items-center" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-certificate mr-1"></i> View Certificate
                    </a>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">NITIKA SAINI</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">85.8%</span>
                  </div>
                  <p className="text-sm opacity-90">Science Stream</p>
                  <div className="mt-2">
                    <a 
                      href="/assets/NITIKA merit certificate.pdf" 
                      className="text-xs text-blue-200 hover:text-white underline flex items-center" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-certificate mr-1"></i> View Certificate
                    </a>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">DIVESH SAINI</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">83%</span>
                  </div>
                  <p className="text-sm opacity-90">Science Stream</p>
                  <div className="mt-2">
                    <a 
                      href="/assets/Divesh Merit Certificate.pdf" 
                      className="text-xs text-blue-200 hover:text-white underline flex items-center" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-certificate mr-1"></i> View Certificate
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 10th Toppers */}
            <div className="bg-gradient-to-br from-sricgold to-yellow-600 text-sricblue p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-white text-sricblue w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
                  <i className="fas fa-award"></i>
                </div>
                <h3 className="text-2xl font-bold ml-4">Class 10 Toppers (2024-25)</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white bg-opacity-30 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">MOHANE SAINI</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">85.11%</span>
                  </div>
                  <p className="text-sm opacity-90">School Topper</p>
                </div>
                
                <div className="bg-white bg-opacity-30 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">SHIVANSHI</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">83.83%</span>
                  </div>
                  <p className="text-sm opacity-90">90+ marks in Hindi and English</p>
                </div>
                
                <div className="bg-white bg-opacity-30 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">PINKI</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">83.66%</span>
                  </div>
                  <p className="text-sm opacity-90">80+ marks in Every Subject</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/achievements" 
              className="inline-flex items-center text-sricblue font-semibold hover:underline"
            >
              View All Toppers
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Academic Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive education for Classes 9 to 12 with multiple streams</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-4">Science Stream</h3>
              <p className="text-gray-600 mb-4">Physics, Chemistry, Mathematics, Biology with comprehensive lab facilities</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Advanced laboratory equipment</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Competitive exam preparation</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Research projects</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-yellow-500">
              <h3 className="text-xl font-bold mb-4">Humanities Stream</h3>
              <p className="text-gray-600 mb-4">History, Political Science, Economics, Geography with practical applications</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Debate and public speaking</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Field visits and surveys</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Current affairs analysis</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-purple-500">
              <h3 className="text-xl font-bold mb-4">Secondary School (9-10)</h3>
              <p className="text-gray-600 mb-4">Strong foundation for board examinations with comprehensive syllabus coverage</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Regular assessments</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Remedial classes</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  <span>Career counseling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Hear from our alumni about their SRIC experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-600">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img src="/assets/bittu.jpeg" alt="Bittu Saini" className="rounded-full w-16 h-16 object-cover border-4 border-white shadow-md" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <h4 className="font-bold text-lg text-gray-900">Bittu Saini</h4>
                  <p className="text-sm text-blue-600 font-medium">Chief Health Officer | Class of 2016</p>
                </div>
              </div>
              <p className={`text-gray-700 text-lg italic relative pl-6 before:content-['"'] before:text-4xl before:text-gray-300 before:absolute before:left-0 before:top-0 before:font-serif`}>
                SRIC provided me with the strong foundation I needed to pursue my career in public health. The teachers' dedication and the school's focus on practical knowledge were invaluable.
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-600">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img src="/assets/virendra_saini.jpg" alt="Virendra Saini" className="rounded-full w-16 h-16 object-cover border-4 border-white shadow-md" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <h4 className="font-bold text-lg text-gray-900">Virendra Saini</h4>
                  <p className="text-sm text-blue-600 font-medium">Lekhpal | Class of 2017</p>
                </div>
              </div>
              <p className={`text-gray-700 text-lg italic relative pl-6 before:content-['"'] before:text-4xl before:text-gray-300 before:absolute before:left-0 before:top-0 before:font-serif`}>
                The discipline and academic rigor at SRIC prepared me well for competitive exams. I'm grateful for the guidance I received from my teachers.
              </p>
            </div>
          </div>
          
          {/* View more button */}
          <div className="text-center mt-12">
            <Link 
              to="/testimonials" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              View More Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sricgold text-sricblue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">Applications for the 2025-26 academic year are now open</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/admission-form" 
              className="bg-sricblue hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Apply Now
            </Link>
            <Link 
              to="/visit" 
              className="bg-transparent border-2 border-sricblue hover:bg-sricblue hover:text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Schedule a Visit
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-sricblue to-blue-900 w-12 h-12 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">SRIC</span>
                </div>
                <h3 className="text-xl font-bold ml-3">SRIC</h3>
              </div>
              <p className="text-gray-400 mb-4">Preparing students for board success since 2002.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/history" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/curriculum" className="text-gray-400 hover:text-white">Academics</Link></li>
                <li><Link to="/admission-form" className="text-gray-400 hover:text-white">Admissions</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Academic Streams</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Science (PCMB)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Humanities</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-400"></i>
                  <span className="text-gray-400">Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-3 text-gray-400"></i>
                  <span className="text-gray-400">+91 9756517750</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-3 text-gray-400"></i>
                  <span className="text-gray-400">sitaramintercollege1205@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
            <p>© 2025 SRIC Senior Secondary School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
