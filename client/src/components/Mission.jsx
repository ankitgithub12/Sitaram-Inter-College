import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Mission = () => {
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

  // Animation for elements when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    const animatedElements = document.querySelectorAll('.mission-card, .stat-card, .timeline-item, .value-icon, .fade-in-up');
    animatedElements.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - Same as Home.jsx */}
      <header className="sticky top-0 z-50 shadow-lg">
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
                <Link to="/" className="nav-link text-gray-300 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              
              {/* About Us Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  About Us 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <li>
                    <Link to="/mission" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300 border-b border-gray-100">
                      Mission & Vision
                    </Link>
                  </li>
                  <li>
                    <Link to="/history" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300 border-b border-gray-100">
                      History
                    </Link>
                  </li>
                  <li>
                    <Link to="/faculty" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300">
                      Faculty
                    </Link>
                  </li>
                </ul>
              </li>
              
              {/* Academics Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  Academics 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <li>
                    <Link to="/curriculum" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300 border-b border-gray-100">
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300">
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admissions Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  Admissions 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <li>
                    <Link to="/process" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300 border-b border-gray-100">
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link to="/fees" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300">
                      Fees
                    </Link>
                  </li>
                </ul>
              </li>

              {/* News & Events Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  News & Events 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <li>
                    <Link to="/calendar" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300 border-b border-gray-100">
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link to="/announcements" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300">
                      Announcements
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gallery Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  Gallery 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <li>
                    <Link to="/photos-videos" className="block px-4 py-3 text-gray-800 hover:bg-sricblue hover:text-white transition duration-300">
                      Photos/Videos
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/contact" className="nav-link text-gray-300 hover:text-white transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Buttons Group */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Admin Button */}
              <Link 
                to="/admin-login" 
                className="admin-button px-4 py-2.5 rounded-md font-bold flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition duration-300"
              >
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </Link>
              
              {/* CTA Button */}
              <Link 
                to="/admission-form" 
                className="pulse-button bg-sricgold text-sricblue px-5 py-2.5 rounded-md font-bold hover:bg-yellow-500 transition transform hover:scale-105 shadow-lg"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <button 
              id="menu-toggle"
              onClick={toggleMobileMenu}
              className="md:hidden text-white focus:outline-none transition duration-300"
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
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-sriclightblue pb-4 px-4 transition-all duration-300`}
          >
            <ul className="flex flex-col space-y-2">
              <li className="mobile-menu-item">
                <Link 
                  to="/" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              
              {/* About Us Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition duration-300"
                >
                  About Us 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform duration-300 ${openDropdown === 'about' ? 'rotate-180' : ''}`} 
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mission & Vision
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/history" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      History
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/faculty" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
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
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition duration-300"
                >
                  Academics 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform duration-300 ${openDropdown === 'academics' ? 'rotate-180' : ''}`} 
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/programs" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
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
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition duration-300"
                >
                  Admissions 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform duration-300 ${openDropdown === 'admissions' ? 'rotate-180' : ''}`} 
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/fees" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
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
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition duration-300"
                >
                  News & Events 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform duration-300 ${openDropdown === 'news' ? 'rotate-180' : ''}`} 
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/announcements" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
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
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition duration-300"
                >
                  Gallery 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform duration-300 ${openDropdown === 'gallery' ? 'rotate-180' : ''}`} 
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
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition duration-300 text-sm"
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
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              
              {/* Mobile Admin Button */}
              <li className="mobile-menu-item">
                <Link 
                  to="/admin-login" 
                  className="flex admin-button text-white py-3 px-4 rounded-md text-center font-bold items-center justify-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300"
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
                  className="block pulse-button bg-sricgold text-sricblue px-4 py-3 rounded-md text-center font-bold hover:bg-yellow-500 transition duration-300 shadow-lg"
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
      <section className="relative hero text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sricblue via-blue-800 to-purple-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-sricgold rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-sricgold rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-lg"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-playfair bg-clip-text text-transparent bg-gradient-to-r from-sricgold to-yellow-200">
            Our Mission & Values
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Shaping Future Leaders Through Academic Excellence and Character Building
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#mission" className="bg-sricgold hover:bg-yellow-600 text-sricblue font-semibold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg">
              Discover Our Mission
            </a>
            <a href="#values" className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105">
              Core Values
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section id="mission" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sricblue to-sricgold"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-playfair mb-6">
              Our <span className="text-sricblue">Mission</span> & <span className="text-sricgold">Vision</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-sricblue to-sricgold mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At SRIC Senior Secondary, we are committed to empowering students to achieve academic excellence 
              in board examinations while nurturing critical thinking, ethical values, and leadership qualities 
              essential for lifelong success and meaningful contributions to society.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="mission-card bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border-l-4 border-sricblue transform hover:-translate-y-2 transition-all duration-500">
              <div className="text-sricblue text-5xl mb-6 relative">
                <i className="fas fa-graduation-cap"></i>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-sricblue rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Academic Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We provide rigorous State Board preparation with specialized coaching, personalized attention, 
                and comprehensive support for 10th and 12th standard examinations.
              </p>
            </div>
            
            <div className="mission-card bg-gradient-to-br from-white to-yellow-50 p-8 rounded-2xl shadow-xl border-l-4 border-sricgold transform hover:-translate-y-2 transition-all duration-500">
              <div className="text-sricgold text-5xl mb-6 relative">
                <i className="fas fa-brain"></i>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-sricgold rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Holistic Development</h3>
              <p className="text-gray-600 leading-relaxed">
                Our balanced approach develops both academic prowess and essential life skills, ensuring 
                students' all-round growth as confident, responsible, and compassionate individuals.
              </p>
            </div>
            
            <div className="mission-card bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-xl border-l-4 border-green-500 transform hover:-translate-y-2 transition-all duration-500">
              <div className="text-green-500 text-5xl mb-6 relative">
                <i className="fas fa-user-graduate"></i>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Career Preparation</h3>
              <p className="text-gray-600 leading-relaxed">
                We guide students in making informed choices about higher education and career paths, 
                providing mentorship and resources for success beyond 12th standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 text-9xl text-sricblue">
            <i className="fas fa-eye"></i>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-playfair mb-6">
                Our Vision for <span className="text-sricblue">Students</span>
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-sricblue to-sricgold mx-auto mb-6 rounded-full"></div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20 fade-in-up">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-sricblue to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className="fas fa-quote-left text-white text-2xl"></i>
                </div>
                <p className="quote text-3xl md:text-4xl text-gray-800 italic leading-relaxed font-playfair">
                  "To be Amroha's premier senior secondary institution that transforms students into academically 
                  excellent, ethically grounded individuals ready for university and meaningful contributions to society."
                </p>
              </div>
              
              <div className="flex items-center justify-center bg-gradient-to-r from-sricblue to-blue-800 p-6 rounded-2xl shadow-lg">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-lg mr-6">
                  <span className="text-sricblue text-2xl font-bold">KS</span>
                </div>
                <div className="text-white">
                  <h4 className="font-bold text-xl">Mr. Khempal Singh</h4>
                  <p className="text-blue-200">Principal, SRIC Senior Secondary School</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <div className="stat-card text-white text-center p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500">
                <div className="text-5xl font-bold mb-2 relative">
                  96%
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-lg font-semibold">12th Board Pass Rate</p>
              </div>
              <div className="stat-card text-white text-center p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500">
                <div className="text-5xl font-bold mb-2 relative">
                  98%
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-lg font-semibold">10th Board Pass Rate</p>
              </div>
              <div className="stat-card text-white text-center p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500">
                <div className="text-5xl font-bold mb-2 relative">
                  1%
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-lg font-semibold">State Top Rankers</p>
              </div>
              <div className="stat-card text-white text-center p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500">
                <div className="text-5xl font-bold mb-2 relative">
                  50+
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
                </div>
                <p className="text-lg font-semibold">Govt Job Selections Yearly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Core Values */}
       <section id="values" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sricblue rounded-full -translate-y-32 translate-x-32 opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sricgold rounded-full translate-y-32 -translate-x-32 opacity-5"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-playfair mb-6">
              Our Core <span className="text-sricblue">Values</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-sricblue to-sricgold mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Principles that guide our educational approach and shape the character of every student
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { icon: 'book-open', title: 'Academic Integrity', desc: 'Maintaining highest standards of honesty in examinations and assignments.' },
              { icon: 'users', title: 'Peer Collaboration', desc: 'Encouraging study groups and peer learning for board exam preparation.' },
              { icon: 'chalkboard-teacher', title: 'Teacher Guidance', desc: 'Personalized mentorship for academic improvement and career guidance.' },
              { icon: 'clock', title: 'Time Management', desc: 'Developing crucial skills for balancing studies and extracurriculars.' },
              { icon: 'brain', title: 'Critical Thinking', desc: 'Encouraging analysis and evaluation beyond textbook knowledge.' },
              { icon: 'handshake', title: 'Responsibility', desc: 'Taking ownership of academic performance and personal growth.' },
              { icon: 'globe-asia', title: 'Global Awareness', desc: 'Understanding world perspectives while preparing for local boards.' },
              { icon: 'graduation-cap', title: 'Lifelong Learning', desc: 'Fostering curiosity that extends beyond board examinations.' }
            ].map((value, index) => (
              <div key={index} className="value-icon bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition duration-500 fade-in-up">
                <div className="w-20 h-20 bg-gradient-to-br from-sricblue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <i className={`fas fa-${value.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800">{value.title}</h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced History Section */}
      <section className="py-20 bg-gradient-to-br from-sricblue to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">
            <i className="fas fa-history"></i>
          </div>
          <div className="absolute bottom-10 right-10 text-6xl">
            <i className="fas fa-school"></i>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
                Our School's <span className="text-sricgold">Journey</span>
              </h2>
              <div className="w-24 h-2 bg-sricgold mx-auto mb-6 rounded-full"></div>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                From humble beginnings to senior secondary excellence
              </p>
            </div>
            
            <div className="relative">
              {[
                { year: '2002', title: 'Founding', desc: 'Established as a primary school with 280 students and 7 teachers.' },
                { year: '2005', title: 'Secondary Expansion', desc: 'Introduced classes 6th-8th, transforming the institution into a full-fledged high school.' },
                { year: '2010', title: 'Higher Secondary', desc: 'Launched classes 9th-10th with a focus on Science, marking the beginning of the Higher Secondary section.' },
                { year: '2013', title: 'Senior Secondary (Humanities)', desc: 'Commenced senior secondary education by offering Classes 11 and 12 with a dedicated focus on Humanities.' },
                { year: '2015', title: 'Science Stream Expansion', desc: 'Expanded academic offerings by introducing the Science stream for Classes 11 and 12.' },
                { year: '2018', title: 'Academic Excellence', desc: 'Achieved a remarkable milestone with a 98% pass rate in the Class 12 board examinations.' },
                { year: '2020', title: 'Solidified Institutional Standing', desc: 'Building on the strong foundation, the institution solidified its reputation as a leading provider of quality Higher Secondary education.' },
                { year: 'Today', title: 'Premier Institution', desc: 'Recognized as a leading educational institution offering comprehensive learning environment across all major streams.' }
              ].map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
                    <div className="flex items-start">
                      <div className="bg-sricgold text-sricblue w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 mr-4 shadow-lg">
                        <span className="font-bold text-sm">{item.year}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-sricgold">{item.title}</h3>
                        <p className="text-white/90 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-white"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">
            Ready to Join Our <span className="text-sricblue">Mission</span>?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 font-semibold">
            Discover how SRIC prepares students for 12th board exams and shapes future leaders
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/admission-form" 
              className="bg-sricblue hover:bg-blue-900 text-white font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </Link>
            <Link 
              to="/visit" 
              className="bg-transparent border-2 border-sricblue hover:bg-sricblue hover:text-white font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105"
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
                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
                <li><Link to="/mission" className="text-gray-400 hover:text-white transition duration-300">About Us</Link></li>
                <li><Link to="/curriculum" className="text-gray-400 hover:text-white transition duration-300">Academics</Link></li>
                <li><Link to="/admission-form" className="text-gray-400 hover:text-white transition duration-300">Admissions</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Academic Streams</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Science (PCMB)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Humanities</a></li>
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

      <style>{`
        .hero {
          background: linear-gradient(rgba(0, 35, 102, 0.85), rgba(0, 35, 102, 0.9)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        
        .mission-card {
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }
        
        .mission-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .section-title {
          position: relative;
          display: inline-block;
        }
        
        .section-title:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: #f59e0b;
          border-radius: 2px;
        }
        
        .value-icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(0, 35, 102, 0.1);
          margin: 0 auto 20px;
          color: #002366;
          font-size: 28px;
        }
        
        .quote {
          position: relative;
        }
        
        .quote:before {
          content: """;
          position: absolute;
          top: -30px;
          left: -20px;
          font-size: 120px;
          color: rgba(0, 35, 102, 0.1);
          font-family: serif;
          line-height: 1;
        }
        
        .timeline-item {
          position: relative;
          padding-left: 40px;
          margin-bottom: 40px;
        }
        
        .timeline-item:before {
          content: '';
          position: absolute;
          left: 0;
          top: 20px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f59e0b;
          border: 4px solid white;
          box-shadow: 0 0 0 3px #f59e0b;
          z-index: 2;
        }
        
        .timeline-item:after {
          content: '';
          position: absolute;
          left: 9px;
          top: 46px;
          height: calc(100% - 20px);
          width: 3px;
          background: #f59e0b;
          z-index: 1;
        }
        
        .timeline-item:last-child:after {
          display: none;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #002366 0%, #0e2a53 100%);
          border-radius: 16px;
          transition: all 0.5s ease;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card:before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s ease;
        }
        
        .stat-card:hover:before {
          transform: rotate(45deg) translate(50%, 50%);
        }
        
        .stat-card:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 40px -10px rgba(0, 35, 102, 0.4);
        }
        
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        
        .dropdown-group:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .dropdown-menu {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Mission;