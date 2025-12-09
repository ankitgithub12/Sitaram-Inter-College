import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Curriculum = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState('class9');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

  const curriculumData = {
    class9: {
      title: "Class 9-10 Curriculum",
      description: "Foundational education with comprehensive syllabus coverage",
      subjects: {
        core: [
          { name: "Hindi & English", icon: "fa-language", description: "Comprehensive study of literature, grammar, and composition skills" },
          { name: "Mathematics", icon: "fa-square-root-alt", description: "Algebra, Geometry, Statistics and problem-solving techniques" },
          { name: "Science", icon: "fa-flask", description: "Physics, Chemistry, Biology with practical laboratory work" },
          { name: "Social Science", icon: "fa-globe-asia", description: "History, Geography, Political Science, and Economics" }
        ],
        additional: [
          { name: "Urdu", icon: "fa-language", description: "Language and literature studies" },
          { name: "Physical Education", icon: "fa-running", description: "Sports, yoga, and health education" },
          { name: "Art Education", icon: "fa-palette", description: "Creative expression through visual and performing arts" },
          { name: "Value Education", icon: "fa-hands-helping", description: "Moral and ethical development programs" }
        ]
      }
    },
    class11sci: {
      title: "Science Stream (PCM/PCB)",
      description: "Advanced science education with specialization options",
      subjects: {
        pcm: [
          { name: "Physics", icon: "fa-atom", description: "Theory and practical with modern laboratory equipment" },
          { name: "Chemistry", icon: "fa-vial", description: "Inorganic, Organic and Physical Chemistry with experiments" },
          { name: "Mathematics", icon: "fa-square-root-alt", description: "Calculus, Algebra, Vectors, and Probability" },
          { name: "English", icon: "fa-language", description: "Advanced literature and communication skills" }
        ],
        pcb: [
          { name: "Biology", icon: "fa-dna", description: "Botany and Zoology with extensive laboratory work" },
          { name: "Chemistry", icon: "fa-vial", description: "Inorganic, Organic and Physical Chemistry with experiments" },
          { name: "Physics", icon: "fa-atom", description: "Theory and practical with modern laboratory equipment" },
          { name: "English", icon: "fa-language", description: "Advanced literature and communication skills" }
        ]
      }
    },
    class11hum: {
      title: "Humanities Stream",
      description: "Comprehensive study of social sciences and arts",
      subjects: {
        core: [
          { name: "History", icon: "fa-landmark", description: "Indian and World History with focus on analytical skills" },
          { name: "Political Science", icon: "fa-balance-scale", description: "Indian Constitution, Political Theory and International Relations" },
          { name: "Economics", icon: "fa-chart-line", description: "Micro and Macro Economics with Indian Economic Development" },
          { name: "English", icon: "fa-language", description: "Advanced literature and communication skills" }
        ],
        optional: [
          { name: "Geography", icon: "fa-globe-asia", description: "Physical and Human Geography with practical work" },
          { name: "Urdu", icon: "fa-language", description: "Language and literature studies" },
          { name: "Home Science", icon: "fa-home", description: "Practical knowledge for home management and nutrition" },
          { name: "Fine Arts", icon: "fa-paint-brush", description: "Theory and practical in visual arts" }
        ]
      }
    }
  };

  const assessmentFeatures = [
    {
      title: "Periodic Tests",
      icon: "fa-clipboard-check",
      description: "Regular tests following UP Board pattern to assess understanding of concepts"
    },
    {
      title: "Practical Exams",
      icon: "fa-flask",
      description: "Hands-on experiments and project-based learning assessments"
    },
    {
      title: "Mock Board Exams",
      icon: "fa-graduation-cap",
      description: "Full-length practice exams simulating UP Board conditions"
    }
  ];

  const testimonials = [
    {
      name: "Mr. Chandarpal Singh",
      role: "Physics Teacher",
      quote: "Our curriculum aligns perfectly with UP Board requirements while providing additional practical exposure that gives our students an edge in examinations.",
      color: "from-sricblue to-blue-900",
      textColor: "text-white"
    },
    {
      name: "Mrs. Kiran",
      role: "Humanities Coordinator",
      quote: "We focus on developing strong writing skills and analytical abilities that are crucial for scoring well in UP Board humanities subjects.",
      color: "from-sricgold to-yellow-600",
      textColor: "text-sricblue"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header - Same as Home.jsx */}
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

              <li>
                <Link to="/achievements" className="nav-link text-gray-300 hover:text-white">
                  Achievements
                </Link>
              </li>

              <li>
                <Link to="/admission-form" className="nav-link text-gray-300 hover:text-white">
                  Admissions
                </Link>
              </li>

              <li className="mr-4">
                <Link to="/contact" className="nav-link text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Buttons Group */}
            <div className="hidden md:flex items-center space-x-3">
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

              <li className="mobile-menu-item">
                <Link 
                  to="/achievements" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Achievements
                </Link>
              </li>

              <li className="mobile-menu-item">
                <Link 
                  to="/admission-form" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admissions
                </Link>
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

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sricblue via-blue-800 to-purple-900 text-white py-24">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-sricgold rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating academic icons */}
        <div className="absolute top-1/4 right-1/4 opacity-20 animate-float">
          <i className="fas fa-book-open text-8xl"></i>
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-20 animate-float" style={{animationDelay: '1.5s'}}>
          <i className="fas fa-graduation-cap text-6xl"></i>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            UP Board Curriculum
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 opacity-90">
            Comprehensive academic programs designed for Classes 9-12 with focus on UP Board examination success
          </p>
          
          {/* Decorative divider */}
          <div className="flex justify-center space-x-2 mb-10">
            <div className="w-20 h-1 bg-sricgold"></div>
            <div className="w-12 h-1 bg-sricgold opacity-70"></div>
            <div className="w-6 h-1 bg-sricgold opacity-40"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="#curriculum" 
              className="group bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center justify-center">
                Explore Curriculum
                <i className="fas fa-arrow-down ml-2 group-hover:translate-y-1 transition-transform"></i>
              </span>
            </Link>
            <Link 
              to="/programs" 
              className="group bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-sricblue"
            >
              <span className="flex items-center justify-center">
                View Programs
                <i className="fas fa-external-link-alt ml-2 group-hover:translate-x-1 transition-transform"></i>
              </span>
            </Link>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            className="relative block w-full h-24" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              className="fill-white"
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              className="fill-white"
            ></path>
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Curriculum Framework
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              SRIC follows the UP Board curriculum with enhancements to provide a holistic education that balances academic rigor with practical learning experiences.
            </p>
          </div>
          
          {/* Enhanced Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 gap-4">
            {[
              { id: 'class9', label: 'Class 9-10', icon: 'fa-graduation-cap' },
              { id: 'class11sci', label: 'Science Stream', icon: 'fa-atom' },
              { id: 'class11hum', label: 'Humanities', icon: 'fa-landmark' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === tab.id
                  ? 'bg-gradient-to-r from-sricblue to-blue-700 text-white shadow-2xl transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'text-sricgold' : 'text-sricblue'}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Active Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'class9' && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-sricblue mb-2">
                    {curriculumData.class9.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {curriculumData.class9.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="subject-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <div className="flex items-center mb-8">
                      <div className="bg-gradient-to-r from-sricblue to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-5 shadow-lg">
                        <i className="fas fa-book"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-sricblue">Core Subjects</h3>
                    </div>
                    <ul className="space-y-6">
                      {curriculumData.class9.subjects.core.map((subject, index) => (
                        <li key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-start">
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-sricblue rounded-full w-12 h-12 flex items-center justify-center text-lg mr-4 shadow-sm">
                              <i className={`fas ${subject.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2 text-gray-800">{subject.name}</h4>
                              <p className="text-gray-600">{subject.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="subject-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <div className="flex items-center mb-8">
                      <div className="bg-gradient-to-r from-sricblue to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-5 shadow-lg">
                        <i className="fas fa-plus-circle"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-sricblue">Additional Components</h3>
                    </div>
                    <ul className="space-y-6">
                      {curriculumData.class9.subjects.additional.map((subject, index) => (
                        <li key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-start">
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-sricblue rounded-full w-12 h-12 flex items-center justify-center text-lg mr-4 shadow-sm">
                              <i className={`fas ${subject.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2 text-gray-800">{subject.name}</h4>
                              <p className="text-gray-600">{subject.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'class11sci' && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-sricblue mb-2">
                    {curriculumData.class11sci.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {curriculumData.class11sci.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="subject-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <div className="flex items-center mb-8">
                      <div className="bg-gradient-to-r from-sricblue to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-5 shadow-lg">
                        <i className="fas fa-atom"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-sricblue">Physics-Chemistry-Mathematics</h3>
                    </div>
                    <ul className="space-y-6">
                      {curriculumData.class11sci.subjects.pcm.map((subject, index) => (
                        <li key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-start">
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-sricblue rounded-full w-12 h-12 flex items-center justify-center text-lg mr-4 shadow-sm">
                              <i className={`fas ${subject.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2 text-gray-800">{subject.name}</h4>
                              <p className="text-gray-600">{subject.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="subject-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <div className="flex items-center mb-8">
                      <div className="bg-gradient-to-r from-sricblue to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-5 shadow-lg">
                        <i className="fas fa-dna"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-sricblue">Physics-Chemistry-Biology</h3>
                    </div>
                    <ul className="space-y-6">
                      {curriculumData.class11sci.subjects.pcb.map((subject, index) => (
                        <li key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-start">
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-sricblue rounded-full w-12 h-12 flex items-center justify-center text-lg mr-4 shadow-sm">
                              <i className={`fas ${subject.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2 text-gray-800">{subject.name}</h4>
                              <p className="text-gray-600">{subject.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'class11hum' && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-sricblue mb-2">
                    {curriculumData.class11hum.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {curriculumData.class11hum.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="subject-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <div className="flex items-center mb-8">
                      <div className="bg-gradient-to-r from-sricblue to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-5 shadow-lg">
                        <i className="fas fa-landmark"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-sricblue">Core Subjects</h3>
                    </div>
                    <ul className="space-y-6">
                      {curriculumData.class11hum.subjects.core.map((subject, index) => (
                        <li key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-start">
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-sricblue rounded-full w-12 h-12 flex items-center justify-center text-lg mr-4 shadow-sm">
                              <i className={`fas ${subject.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2 text-gray-800">{subject.name}</h4>
                              <p className="text-gray-600">{subject.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="subject-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100">
                    <div className="flex items-center mb-8">
                      <div className="bg-gradient-to-r from-sricblue to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-5 shadow-lg">
                        <i className="fas fa-ellipsis-h"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-sricblue">Optional Subjects</h3>
                    </div>
                    <ul className="space-y-6">
                      {curriculumData.class11hum.subjects.optional.map((subject, index) => (
                        <li key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-start">
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-sricblue rounded-full w-12 h-12 flex items-center justify-center text-lg mr-4 shadow-sm">
                              <i className={`fas ${subject.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2 text-gray-800">{subject.name}</h4>
                              <p className="text-gray-600">{subject.description}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Assessment Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-sricblue to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              UP Board Examination Preparation
            </h2>
            <p className="text-xl max-w-4xl mx-auto opacity-90">
              Our comprehensive assessment system ensures students are well-prepared for UP Board examinations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {assessmentFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-10 rounded-2xl text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl"
              >
                <div className="bg-gradient-to-r from-sricgold to-yellow-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-float shadow-lg">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-lg opacity-90">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Additional Info */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl">
              <h4 className="text-2xl font-bold mb-4 text-center text-sricgold">Additional Support Systems</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="text-3xl font-bold text-sricgold mb-2">Weekly</div>
                  <p className="text-lg">Revision Sessions</p>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-sricgold mb-2">24/7</div>
                  <p className="text-lg">Doubt Clearing Support</p>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-sricgold mb-2">Personalized</div>
                  <p className="text-lg">Performance Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonial Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Teachers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our educators on the SRIC curriculum approach for UP Board
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${testimonial.color} ${testimonial.textColor} p-10 rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-start mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center text-2xl mr-6">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-1">{testimonial.name}</h4>
                    <p className={`text-lg ${testimonial.textColor === 'text-sricblue' ? 'text-sricblue/90' : 'text-white/90'}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-xl italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-r from-sricgold via-yellow-500 to-yellow-400 text-sricblue">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Want Detailed Syllabus Information?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90">
              Contact us for complete UP Board curriculum documents and academic planning guidance
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/contact" 
                className="group bg-gradient-to-r from-sricblue to-blue-900 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  <i className="fas fa-envelope mr-3"></i>
                  Contact Us
                  <i className="fas fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
                </span>
              </Link>
              <Link 
                to="/programs" 
                className="group bg-white text-sricblue font-bold py-4 px-10 rounded-xl text-lg border-2 border-sricblue transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  <i className="fas fa-list-alt mr-3"></i>
                  View Programs
                  <i className="fas fa-external-link-alt ml-3 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-sricblue to-blue-900 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">SRIC</span>
                </div>
                <h3 className="text-2xl font-bold ml-4 bg-gradient-to-r from-sricgold to-yellow-300 bg-clip-text text-transparent">
                  SRIC
                </h3>
              </div>
              <p className="text-gray-400 mb-6 text-lg">Preparing students for UP Board success since 2002.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sricblue hover:text-white transition-all hover:scale-110">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all hover:scale-110">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all hover:scale-110">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-link text-sricgold mr-2"></i>
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                  Home
                </Link></li>
                <li><Link to="/mission" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                  About Us
                </Link></li>
                <li><Link to="/curriculum" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                  Curriculum
                </Link></li>
                <li><Link to="/achievements" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                  Achievements
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-graduation-cap text-sricgold mr-2"></i>
                Academic Streams
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-flask text-xs mr-2"></i>
                  Science (PCM)
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-dna text-xs mr-2"></i>
                  Science (PCB)
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-landmark text-xs mr-2"></i>
                  Humanities
                </a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-address-card text-sricgold mr-2"></i>
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-sricgold group-hover:scale-110 transition-transform"></i>
                  <span className="text-gray-400 group-hover:text-white transition-colors">
                    Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242
                  </span>
                </li>
                <li className="flex items-center group">
                  <i className="fas fa-phone-alt mr-3 text-sricgold group-hover:scale-110 transition-transform"></i>
                  <span className="text-gray-400 group-hover:text-white transition-colors">+91 9756517750</span>
                </li>
                <li className="flex items-center group">
                  <i className="fas fa-envelope mr-3 text-sricgold group-hover:scale-110 transition-transform"></i>
                  <span className="text-gray-400 group-hover:text-white transition-colors">sitaramintercollege1205@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">© 2025 SRIC Senior Secondary School. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-sricgold text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-sricgold text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-sricgold text-sm">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .subject-card {
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 35, 102, 0.2);
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Curriculum;