import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const History = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState(null);

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

  // Timeline data
  const timelineData = [
    {
      year: "2002",
      title: "School Establishment",
      description: "Founded as a primary school with UP Board affiliation, starting with classes 1-5 in a modest building.",
      image: "/assets/2002image.jpeg",
      alignment: "left"
    },
    {
      year: "2005",
      title: "New School Building",
      description: "Moved to our permanent campus with proper classrooms and UP Board approved facilities.",
      image: "/assets/2005image.jpeg",
      alignment: "right"
    },
    {
      year: "2008",
      title: "High School Recognition",
      description: "Received UP Board recognition for classes 6-8, expanding our academic offerings.",
      image: "/assets/2002image1.jpeg",
      alignment: "left"
    },
    {
      year: "2012",
      title: "First High School Batch",
      description: "Our first class 10 students appeared for UP Board examinations with excellent results.",
      image: "/assets/intoduce class 10th.png",
      alignment: "right"
    },
    {
      year: "2015",
      title: "Intermediate Classes Added",
      description: "Started classes 11-12 with Arts and Science(PCB) streams under UP Board.",
      image: "/assets/12th added.png",
      alignment: "left"
    },
    {
      year: "2018",
      title: "Science Stream Introduced",
      description: "Added Science stream with well-equipped labs meeting UP Board standards.",
      image: "/assets/12th science stream2.png",
      alignment: "right"
    },
    {
      year: "Today",
      title: "Premier UP Board Institution",
      description: "Now a well-established UP Board school with 800+ students and consistent academic excellence.",
      image: "/assets/latest image of the school.png",
      alignment: "left"
    }
  ];

  // Founders data
  const foundersData = [
    {
      name: "Mr. Horam Singh",
      role: "Founder (2002-Present)",
      description: "A visionary educator who established SRIC with the philosophy that 'Education should empower students to think critically and serve society.' He laid the foundation for our academic excellence.",
      image: "/assets/founder.jpeg",
      borderColor: "border-sricblue"
    },
    {
      name: "Mr. Yespal Singh",
      role: "Co-Founder & Educator (2002-Present)",
      description: "Instrumental in developing our science programs and laboratories. His dedication to practical learning shaped our hands-on approach to science education.",
      image: "/assets/yespal singh.jpeg",
      borderColor: "border-sricgold"
    },
    {
      name: "Mr. Khempal Singh",
      role: "Principal (2005-Present)",
      description: "Led the expansion to senior secondary education and established our scholarship program to make quality education accessible to all deserving students.",
      image: "/assets/khempal singh.jpg",
      borderColor: "border-green-500"
    }
  ];

  // Alumni data
  const alumniData = [
    {
      name: "Bittu Saini",
      class: "Class of 2016",
      position: "Chief Health Officer (CHO)",
      details: "Public Health Specialist | 5+ years experience",
      achievement: "Led multiple community health initiatives",
      image: "/assets/bittu.jpeg"
    },
    {
      name: "Virendra Saini",
      class: "Class of 2018",
      position: "Lekhpal (Revenue Official)",
      details: "Former Railway Employee | Land Records Specialist",
      achievement: "Known for efficient public service delivery",
      image: "/assets/virendra_saini.jpg"
    },
    {
      name: "Kapil Kumar",
      class: "Class of 2012",
      position: "Junior Engineer (JEE)",
      details: "Power Grid Corporation | Junior Engineering",
      achievement: "Specializes in power transmission systems",
      image: "/assets/Kapil.jpg"
    },
    {
      name: "Ajay Kumar",
      class: "Class of 2019",
      position: "SSF (State Security Force) AIR 631",
      details: "Security Specialist",
      achievement: "Recognized for exceptional service in state security",
      image: "/assets/Ajay.jpeg"
    },
    {
      name: "Sachin Kumar",
      class: "Class of 2015",
      position: "Uttar Pardesh Police",
      details: "2023 Batch | Aligarh Posting",
      achievement: "Scored 98% in physical efficiency test",
      image: "/assets/sachin kumar.jfif"
    },
    {
      name: "Anil Kumar",
      class: "Class of 2018",
      position: "Uttar Pardesh Police",
      details: "Selected as Constable (2023 Batch)",
      achievement: "Achieved top 1% ranking in physical efficiency test",
      image: "/assets/Anil Kumar.jfif"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
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

              <li>
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
      <section className="hero text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sricblue/90 to-purple-900/90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center z-0 opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair animate-fade-in">Our School History</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">Celebrating over two decades of academic excellence and community impact</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#timeline" 
              className="bg-sricgold hover:bg-yellow-600 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Explore Our Journey
            </a>
            <a 
              href="#founders" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Meet Our Founders
            </a>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-800 font-playfair relative inline-block">
              Our Humble Beginnings
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-sricgold rounded-full"></div>
            </h2>
            
            <div className="flex flex-col md:flex-row items-center mt-16">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 transform transition-transform duration-500 hover:scale-105">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/assets/2002image.jpeg" 
                    alt="SRIC School in 2002" 
                    className="w-full h-auto rounded-2xl transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                </div>
              </div>
              
              <div className="md:w-1/2 text-left">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Founded in 2002 by visionary educators, SRIC began as a small neighborhood school with just 280 students and 7 dedicated teachers. Our founders believed in creating an institution that would provide quality education accessible to all sections of society.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  From our modest single-building campus, we have grown into one of Amroha's most respected senior secondary schools, serving over 800+ students today while maintaining our commitment to academic excellence and character development.
                </p>
                
                <div className="mt-8 flex items-center space-x-4">
                  <div className="bg-sricblue text-white px-4 py-2 rounded-lg text-center">
                    <div className="text-2xl font-bold">2002</div>
                    <div className="text-sm">Founded</div>
                  </div>
                  <div className="bg-sricgold text-sricblue px-4 py-2 rounded-lg text-center">
                    <div className="text-2xl font-bold">800+</div>
                    <div className="text-sm">Students Today</div>
                  </div>
                  <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-center">
                    <div className="text-2xl font-bold">20+</div>
                    <div className="text-sm">Years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-sricblue text-white rounded-full text-sm font-semibold mb-4">
              Our Legacy
            </span>
            <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-800 font-playfair relative inline-block">
              Our Founding Visionaries
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-sricgold rounded-full"></div>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg">The pioneers who laid the foundation for our institution</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {foundersData.map((founder, index) => (
              <div 
                key={index}
                className="founder-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-t-4 transform hover:-translate-y-2"
                style={{ borderTopColor: founder.borderColor.split('-')[1] === 'sricblue' ? '#002366' : 
                        founder.borderColor.split('-')[1] === 'sricgold' ? '#FFD700' : '#10B981' }}
              >
                <div className="relative">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 shadow-lg"
                    style={{ borderColor: founder.borderColor.split('-')[1] === 'sricblue' ? '#002366' : 
                            founder.borderColor.split('-')[1] === 'sricgold' ? '#FFD700' : '#10B981' }}>
                    <img 
                      src={founder.image} 
                      alt={founder.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: founder.borderColor.split('-')[1] === 'sricblue' ? '#002366' : 
                              founder.borderColor.split('-')[1] === 'sricgold' ? '#FFD700' : '#10B981' }}>
                      <i className="fas fa-award text-sm"></i>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-center font-playfair">{founder.name}</h3>
                <p className="text-center mb-4 font-semibold"
                  style={{ color: founder.borderColor.split('-')[1] === 'sricblue' ? '#002366' : 
                          founder.borderColor.split('-')[1] === 'sricgold' ? '#FFD700' : '#10B981' }}>
                  {founder.role}
                </p>
                <p className="text-gray-600 text-center leading-relaxed">{founder.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sricgold/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-3">
              Our Heritage
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">The SRIC Story</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Milestones in our journey as a premier UP Board affiliated school</p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-sricblue to-sricgold transform -translate-x-1/2 z-0"></div>
            
            {/* Timeline items */}
            <div className="space-y-24">
              {timelineData.map((item, index) => (
                <div key={index} className="relative group">
                  <div className={`md:flex justify-center items-stretch ${item.alignment === 'right' ? 'flex-row-reverse' : ''}`}>
                    {/* Year marker */}
                    <div className={`hidden md:flex md:w-1/2 ${item.alignment === 'right' ? 'pl-12 justify-start' : 'pr-12 justify-end'}`}>
                      <div className="relative h-full">
                        <div className={`absolute ${item.alignment === 'right' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} top-1/2 transform -translate-y-1/2 w-8 h-8 bg-sricblue rounded-full border-4 border-white shadow-xl z-10 group-hover:scale-110 group-hover:bg-sricgold transition-all duration-300`}></div>
                        <div className={`text-${item.alignment === 'right' ? 'left pl-12' : 'right pr-12'} pt-1`}>
                          <span className="inline-block px-4 py-2 bg-sricblue text-white text-sm font-bold rounded-full shadow-lg transform group-hover:scale-110 group-hover:bg-sricgold transition-all duration-300">
                            {item.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`md:w-1/2 ${item.alignment === 'right' ? 'pr-0 md:pr-12' : 'pl-0 md:pl-12'}`}>
                      <div className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative group-hover:-translate-y-2 border-${item.alignment === 'right' ? 'r-4' : 'l-4'} border-sricblue`}>
                        {/* Image with overlay */}
                        <div className="w-full h-64 overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <div className="absolute bottom-4 left-4">
                            <span className="inline-block md:hidden px-3 py-1 bg-sricblue text-white text-xs font-semibold rounded-full shadow-sm">
                              {item.year}
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">{item.title}</h3>
                          <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                        
                        {/* Decorative corner */}
                        <div className={`absolute ${item.alignment === 'right' ? 'left-0' : 'right-0'} top-0 w-8 h-8 bg-sricgold transform ${item.alignment === 'right' ? '-translate-x-1/2 -translate-y-1/2' : 'translate-x-1/2 -translate-y-1/2'} rotate-45`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-sricblue to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-3">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Notable Alumni Achievements</h2>
            <div className="w-24 h-1.5 bg-sricgold mx-auto mb-6 rounded-full"></div>
            <p className="text-xl max-w-2xl mx-auto opacity-90">Our former students making a difference in the world</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {alumniData.map((alumni, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-white/20 transform hover:-translate-y-2 border border-white/20"
              >
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img 
                      src={alumni.image} 
                      alt={alumni.name} 
                      className="rounded-xl w-16 h-16 object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-sricgold rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sricblue" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold">{alumni.name}</h3>
                    <p className="text-sricgold text-sm font-medium">{alumni.class}</p>
                  </div>
                </div>
                
                <p className="font-semibold text-lg mb-1">{alumni.position}</p>
                <p className="text-white/80 text-sm mb-3">{alumni.details}</p>
                <p className="text-white/70 text-xs italic flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sricgold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {alumni.achievement}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <i className="fas fa-trophy text-sricgold"></i>
              <span className="font-semibold">50+ Alumni in Government Services</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-sricblue to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-sricgold rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-sricgold rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">Become Part of Our History</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">Join our tradition of excellence and create your own legacy at SRIC</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/admission-form" 
              className="bg-sricgold hover:bg-yellow-600 text-sricblue font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply for Admission
            </Link>
            <Link 
              to="/visit" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Schedule a School Tour
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
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="/mission" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link to="/curriculum" className="text-gray-400 hover:text-white transition">Academics</Link></li>
                <li><Link to="/admission-form" className="text-gray-400 hover:text-white transition">Admissions</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Academic Streams</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Science (PCMB)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Humanities</a></li>
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

export default History;