import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Programs = () => {
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

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-lg">
        <nav className="bg-gradient-to-r from-sricblue to-blue-900 p-4">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo + School Name */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/SRIC LOGO.PNG" 
                alt="SRIC Logo" 
                className="h-10 w-10 rounded-full border-2 border-white"
              />
              <Link to="/" className="text-white text-xl font-bold tracking-tight">
                SITARAM INTER COLLEGE
              </Link>
              <span className="hidden sm:inline text-sricgold text-sm font-medium">
                Empowering Minds, Shaping Futures
              </span>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
              <li>
                <Link to="/" className="nav-link text-gray-200 hover:text-white hover:underline decoration-sricgold decoration-2">
                  Home
                </Link>
              </li>
              
              {/* About Us Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-200 hover:text-white focus:outline-none flex items-center">
                  About Us 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 border border-gray-200">
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
              
              {/* Academics Dropdown - Active */}
              <li className="relative dropdown-group">
                <button className="nav-link text-white font-semibold focus:outline-none flex items-center">
                  Academics 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 border border-gray-200">
                  <li>
                    <Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition-colors">
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="block px-4 py-2 bg-sricblue text-white font-semibold">
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/achievements" className="nav-link text-gray-200 hover:text-white hover:underline decoration-sricgold decoration-2">
                  Achievements
                </Link>
              </li>
              
              <li>
                <Link to="/admission-form" className="nav-link text-gray-200 hover:text-white hover:underline decoration-sricgold decoration-2">
                  Admissions
                </Link>
              </li>
              
              <li>
                <Link to="/contact" className="nav-link text-gray-200 hover:text-white hover:underline decoration-sricgold decoration-2">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Buttons Group */}
            <div className="hidden md:flex items-center space-x-3">
              {/* CTA Button */}
              <Link 
                to="/admission-form" 
                className="relative overflow-hidden bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue px-5 py-2.5 rounded-lg font-bold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <span className="relative z-10 flex items-center">
                  <i className="fas fa-pen-to-square mr-2"></i>
                  Apply Now
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-blue-900 pb-4 px-4 transition-all duration-300`}
          >
            <ul className="flex flex-col space-y-1">
              <li className="mobile-menu-item">
                <Link 
                  to="/" 
                  className="block text-gray-200 hover:text-white py-3 px-4 rounded-md hover:bg-blue-800 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              
              {/* About Us Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-200 hover:text-white py-3 px-4 rounded-md hover:bg-blue-800 flex justify-between items-center transition"
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
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'about' ? 'max-h-40' : 'max-h-0'}`}
                >
                  <li>
                    <Link 
                      to="/mission" 
                      className="block text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-blue-800 transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/history" 
                      className="block text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-blue-800 transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      History
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/faculty" 
                      className="block text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-blue-800 transition text-sm"
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
                  className="dropdown-btn w-full text-left text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-800 flex justify-between items-center transition"
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
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'academics' ? 'max-h-40' : 'max-h-0'}`}
                >
                  <li>
                    <Link 
                      to="/curriculum" 
                      className="block text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-blue-800 transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/programs" 
                      className="block text-white bg-blue-700 py-2 px-4 rounded-md transition text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="mobile-menu-item">
                <Link 
                  to="/achievements" 
                  className="block text-gray-200 hover:text-white py-3 px-4 rounded-md hover:bg-blue-800 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Achievements
                </Link>
              </li>
              
              <li className="mobile-menu-item">
                <Link 
                  to="/admission-form" 
                  className="block text-gray-200 hover:text-white py-3 px-4 rounded-md hover:bg-blue-800 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admissions
                </Link>
              </li>
              
              <li className="mobile-menu-item">
                <Link 
                  to="/contact" 
                  className="block text-gray-200 hover:text-white py-3 px-4 rounded-md hover:bg-blue-800 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              
              {/* Mobile Apply Now Button */}
              <li className="mobile-menu-item mt-2">
                <Link 
                  to="/admission-form" 
                  className="block bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue px-4 py-3 rounded-md text-center font-bold hover:shadow-lg transition"
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
      <section className="hero text-white py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-sricblue/90 to-blue-900/90">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sricgold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating Icons */}
        <div className="absolute top-10 right-10 text-white/10">
          <i className="fas fa-graduation-cap text-7xl floating-animation"></i>
        </div>
        <div className="absolute bottom-10 left-10 text-white/10">
          <i className="fas fa-book-open text-6xl floating-animation-delayed"></i>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 inline-flex items-center mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">UP Board Programs</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-sricgold leading-tight">
            Academic Programs
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-100">
            Structured educational pathways designed for UP Board examination success and holistic development
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => scrollToSection('programs')}
              className="bg-gradient-to-r from-sricgold to-yellow-500 hover:from-yellow-500 hover:to-sricgold text-sricblue font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <span className="flex items-center justify-center">
                Explore Programs
                <i className="fas fa-arrow-down ml-2 group-hover:translate-y-1 transition-transform"></i>
              </span>
            </button>
            <Link 
              to="/admission-form" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center">
                Apply Now
                <i className="fas fa-external-link-alt ml-2"></i>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section id="programs" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              Our Academic Programs
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-8">
              SRIC provides structured UP Board programs from Class 9 to 12 with multiple streams to prepare students for board examinations and beyond
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Secondary Program Card */}
            <div className="group program-card bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-3xl shadow-lg">
                  <i className="fas fa-school"></i>
                </div>
                <div className="ml-16 mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Secondary School (9-10)</h3>
                  <p className="text-blue-600 font-medium">UP Board High School</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Foundation program for UP Board High School examination with comprehensive syllabus coverage</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-blue-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Comprehensive UP Board syllabus coverage</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-blue-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Regular assessments and mock tests</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-blue-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Remedial classes for weaker students</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-blue-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Stream selection guidance</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link 
                  to="/curriculum#class9" 
                  className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors"
                >
                  View Curriculum
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>
            
            {/* Science Program Card */}
            <div className="group program-card bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-3xl shadow-lg">
                  <i className="fas fa-atom"></i>
                </div>
                <div className="ml-16 mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Science Stream</h3>
                  <p className="text-green-600 font-medium">Classes 11-12 (PCM/PCB)</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Classes 11-12 with PCM or PCB options for UP Board Intermediate examination</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Advanced laboratory facilities</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Board exam focused teaching</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Practical work and experiments</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Medical/engineering guidance</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link 
                  to="/curriculum#class11sci" 
                  className="inline-flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors"
                >
                  View Curriculum
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>
            
            {/* Humanities Program Card */}
            <div className="group program-card bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-3xl shadow-lg">
                  <i className="fas fa-landmark"></i>
                </div>
                <div className="ml-16 mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Humanities Stream</h3>
                  <p className="text-purple-600 font-medium">Classes 11-12 Arts</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Classes 11-12 with arts and social science subjects for UP Board Intermediate examination</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-purple-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Focus on UP Board exam patterns</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-purple-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Answer writing practice</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-purple-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Current affairs integration</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <i className="fas fa-check text-purple-600 text-xs"></i>
                  </div>
                  <span className="text-gray-700">Government job preparation</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link 
                  to="/curriculum#class11hum" 
                  className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors"
                >
                  View Curriculum
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              Special Support Programs
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-sricgold to-orange-500 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-8">
              Enhancing UP Board preparation with additional support programs for comprehensive development
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Board Exam Excellence */}
            <div className="group special-program-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-blue-500">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-medal"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Board Exam Excellence</h3>
                  <p className="text-gray-600">Special coaching for 10th and 12th UP Board students</p>
                </div>
              </div>
              <ul className="space-y-3">
                {['Weekly mock tests with UP Board pattern', 'Chapter-wise revision modules', 'Answer writing practice sessions', 'Previous year paper analysis'].map((item, index) => (
                  <li key={index} className="flex items-start group-hover-item">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-check text-blue-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Career Guidance */}
            <div className="group special-program-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-green-500">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-user-tie"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Career Guidance</h3>
                  <p className="text-gray-600">Support for career planning after UP Board examinations</p>
                </div>
              </div>
              <ul className="space-y-3">
                {['Higher education options', 'Government job opportunities', 'Scholarship information', 'Alumni mentorship'].map((item, index) => (
                  <li key={index} className="flex items-start group-hover-item">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-check text-green-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Remedial Classes */}
            <div className="group special-program-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-purple-500">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-book-open"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Remedial Classes</h3>
                  <p className="text-gray-600">Extra support for students needing academic assistance</p>
                </div>
              </div>
              <ul className="space-y-3">
                {['Subject-specific support', 'Small group instruction', 'Individual attention', 'Progress tracking'].map((item, index) => (
                  <li key={index} className="flex items-start group-hover-item">
                    <div className="flex-shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-check text-purple-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Student Wellness */}
            <div className="group special-program-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-pink-500">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-heart"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Student Wellness</h3>
                  <p className="text-gray-600">Supporting mental and physical health of students</p>
                </div>
              </div>
              <ul className="space-y-3">
                {['Yoga and meditation sessions', 'Exam stress management', 'Health education workshops', 'Counseling services'].map((item, index) => (
                  <li key={index} className="flex items-start group-hover-item">
                    <div className="flex-shrink-0 w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-check text-pink-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              Why Choose SRIC Programs?
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-sricblue to-sricgold rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-8">
              Key features that make our UP Board programs stand out for academic excellence
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: 'fas fa-chalkboard-teacher', title: 'Experienced Faculty', desc: 'Teachers specialized in UP Board curriculum' },
              { icon: 'fas fa-book-open', title: 'Exam Focused', desc: 'Strictly follows UP Board syllabus and patterns' },
              { icon: 'fas fa-flask', title: 'Practical Learning', desc: 'Hands-on experiments and projects' },
              { icon: 'fas fa-user-friends', title: 'Personal Attention', desc: 'Small class sizes for better learning' },
              { icon: 'fas fa-chart-line', title: 'Performance Tracking', desc: 'Regular tests and progress reports' },
              { icon: 'fas fa-trophy', title: 'Proven Results', desc: 'Consistent high board exam scores' },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group highlight-card bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-sricblue to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl mx-auto shadow-md group-hover:scale-110 transition-transform duration-300">
                    <i className={feature.icon}></i>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-sricgold rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-sricblue to-blue-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/4 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-1/4 w-40 h-40 border-4 border-sricgold rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center mb-6 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Admissions Open 2025-26</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-10 text-gray-200">
              Join SRIC and experience quality education designed for UP Board success and holistic development
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/admission-form" 
                className="group relative bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <i className="fas fa-pen-to-square mr-3"></i>
                  Apply Now
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </Link>
              
              <Link 
                to="/contact" 
                className="group relative bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-sricblue transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <i className="fas fa-phone-alt mr-3"></i>
                  Contact Us
                  <i className="fas fa-external-link-alt ml-2 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm">Classes 9-12</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm">Science & Humanities</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm">UP Board Syllabus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-sricblue to-blue-900 w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-xl font-bold">SRIC</span>
                </div>
                <h3 className="text-xl font-bold ml-3">SRIC</h3>
              </div>
              <p className="text-gray-400 mb-4">Preparing students for UP Board success since 2002.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-sricblue hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-sricblue hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-sricblue hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-sricblue hover:text-white transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/history" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/curriculum" className="text-gray-400 hover:text-white transition-colors">Curriculum</Link></li>
                <li><Link to="/achievements" className="text-gray-400 hover:text-white transition-colors">Achievements</Link></li>
                <li><Link to="/admission-form" className="text-gray-400 hover:text-white transition-colors">Admissions</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Academic Streams</h4>
              <ul className="space-y-2">
                <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">Science (PCM)</Link></li>
                <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">Science (PCB)</Link></li>
                <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">Humanities</Link></li>
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

      {/* Add custom styles for animations */}
      <style>{`
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-animation-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .hero {
          background: linear-gradient(rgba(0, 35, 102, 0.85), rgba(0, 35, 102, 0.95)), 
                      url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        
        .program-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .group-hover-item {
          transition: transform 0.3s ease;
        }
        
        .group:hover .group-hover-item {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

export default Programs;