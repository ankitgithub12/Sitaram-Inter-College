import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Faculty = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeDept, setActiveDept] = useState('all');
  const [animatedElements, setAnimatedElements] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleDeptFilter = (dept) => {
    setActiveDept(dept);
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

  // Animation for when elements come into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }, []);

  const facultyMembers = [
    {
      id: 1,
      name: "Mrs. Renu Saini",
      position: "Senior Science Teacher",
      qualification: "M.Sc (Physics), B.Ed | 12 Years Experience",
      description: "Dedicated science educator with expertise in experimental physics and science pedagogy. She inspires curiosity through hands-on learning and is passionate about making science engaging and accessible for every student.",
      department: "science",
      image: "/assets/faculty/renu-saini.jpg"
    },
    {
      id: 2,
      name: "Mrs. Kiran",
      position: "Senior History Teacher",
      qualification: "M.A. (History), B.Ed | 15 Years Experience",
      description: "A specialist in Indian history and cultural studies, she connects the past with the present to help students understand contemporary issues. She believes in nurturing critical thinking through historical perspectives.",
      department: "humanities",
      image: "/assets/kiran.png"
    },
    {
      id: 3,
      name: "Mrs. Kamlesh",
      position: "Senior Home Science Teacher",
      qualification: "M.Sc. (Home Science), B.Ed | 10+ Years Experience",
      description: "A specialist in nutritional sciences and human development, she teaches students essential life skills, blending theory with practical application in areas like dietetics, textile design, and resource management.",
      department: "home-science",
      image: "/assets/placeholder-female-avatar.png"
    },
    {
      id: 4,
      name: "Mr. Khempal Singh",
      position: "Senior Hindi Teacher",
      qualification: "M.A. (Hindi), B.Ed | 20 Years Experience",
      description: "With deep expertise in Hindi literature and pedagogy, he focuses on strengthening students' language proficiency and communication skills. His teaching combines tradition with modern methods of learning.",
      department: "language",
      image: "/assets/khempal singh.jpg"
    },
    {
      id: 5,
      name: "Mr. Ammar Haider",
      position: "Senior English Teacher",
      qualification: "M.A. (English), B.Ed | 11 Years Experience",
      description: "An expert in British literature and creative writing, he encourages students to express themselves confidently while enhancing critical and analytical skills through literature and language learning.",
      department: "english",
      image: "/assets/Ammar Haider.jpeg"
    },
    {
      id: 6,
      name: "Mr. Narotam Singh",
      position: "Urdu Language Teacher",
      qualification: "M.A. (Urdu), B.Ed | 14 Years Experience",
      description: "Passionate about Urdu literature and poetry, he works to preserve the beauty of the language while helping students develop strong reading, writing, and interpretative skills in Urdu.",
      department: "urdu",
      image: "/assets/Narotam singh.png"
    },
    {
      id: 7,
      name: "Mr. Chanderpal Singh",
      position: "Senior Mathematics Teacher",
      qualification: "M.Sc (Mathematics), B.Ed | 15 Years Experience",
      description: "A specialist in applied mathematics, he emphasizes logical thinking and problem-solving. His innovative methods make mathematics practical, engaging, and enjoyable for learners.",
      department: "math",
      image: "/assets/chandarpal singh.jpeg"
    },
    {
      id: 8,
      name: "Mr. Bablu Saini",
      position: "Chemistry Teacher",
      qualification: "M.Sc (Chemistry), B.Ed | 10 Years Experience",
      description: "Expert in Physical and Organic Chemistry, he focuses on practical applications of chemical concepts. His teaching bridges theoretical knowledge with real-life experiments, sparking curiosity in learners.",
      department: "science",
      image: "/assets/faculty/Bablu Saini.jpg"
    },
    {
      id: 9,
      name: "Mr. Rajpal Singh",
      position: "Senior Biology Teacher",
      qualification: "M.Sc (Biology), B.Ed | 8 Years Experience",
      description: "Specializes in life sciences and holistic development. He blends biological knowledge with fitness education, ensuring students understand both the science of life and healthy living.",
      department: "physical",
      image: "/assets/rajpal singh.jpeg"
    },
    {
      id: 10,
      name: "Mr. Keshav Kumar",
      position: "Art Teacher",
      qualification: "B.F.A | 5 Years Experience",
      description: "A creative professional specializing in traditional Indian art forms, he motivates students to express their imagination freely. His classes encourage artistic skills, innovation, and appreciation of cultural heritage.",
      department: "arts",
      image: "/assets/faculty/keshav-kumar.jpg"
    },
    {
      id: 11,
      name: "Mrs. Kapil Kumar",
      position: "Social Studies Teacher",
      qualification: "M.A. (Political Science), B.Ed | 12 Years Experience",
      description: "An expert in civics and political science, she guides students in understanding society, governance, and global perspectives. Her teaching emphasizes responsibility, awareness, and active citizenship.",
      department: "humanities",
      image: "/assets/kapil kumar staff.jpeg"
    }
  ];

  const filteredFaculty = activeDept === 'all' 
    ? facultyMembers 
    : facultyMembers.filter(member => member.department === activeDept);

  const departmentData = {
    all: { name: "All Faculty", count: facultyMembers.length },
    science: { name: "Science", count: facultyMembers.filter(f => f.department === 'science').length },
    humanities: { name: "Humanities", count: facultyMembers.filter(f => f.department === 'humanities').length },
    language: { name: "Languages", count: facultyMembers.filter(f => f.department === 'language').length },
    english: { name: "English", count: facultyMembers.filter(f => f.department === 'english').length },
    urdu: { name: "Urdu", count: facultyMembers.filter(f => f.department === 'urdu').length },
    math: { name: "Mathematics", count: facultyMembers.filter(f => f.department === 'math').length },
    arts: { name: "Arts", count: facultyMembers.filter(f => f.department === 'arts').length },
    'home-science': { name: "Home Science", count: facultyMembers.filter(f => f.department === 'home-science').length },
    physical: { name: "Biology", count: facultyMembers.filter(f => f.department === 'physical').length }
  };

  const getDeptColor = (dept) => {
    const colors = {
      science: 'dept-science',
      humanities: 'dept-humanities',
      language: 'dept-language',
      arts: 'dept-arts',
      english: 'dept-english',
      urdu: 'dept-urdu',
      math: 'dept-math',
      'home-science': 'dept-home-science',
      physical: 'dept-physical'
    };
    return colors[dept] || 'bg-gray-100';
  };

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
      <section className="relative overflow-hidden bg-gradient-to-br from-sricblue via-blue-800 to-purple-900 text-white py-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-black/30 to-transparent"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sricgold rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 fade-in">
            Our Esteemed Faculty
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 fade-in">
            Dedicated educators shaping futures since 2002
          </p>
          
          {/* Decorative divider */}
          <div className="mt-10 flex justify-center space-x-2 fade-in">
            <div className="w-16 h-1 bg-sricgold"></div>
            <div className="w-8 h-1 bg-sricgold opacity-70"></div>
            <div className="w-4 h-1 bg-sricgold opacity-40"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-8 h-8 bg-sricgold rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-10 right-10 w-6 h-6 bg-white rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            className="relative block w-full h-20" 
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

      {/* Faculty Content */}
      <main className="relative z-10 -mt-16">
        <section className="container mx-auto px-4 pb-20">
          {/* Enhanced Department Tabs */}
          <div className="flex justify-center mb-16 fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-2 inline-flex flex-wrap justify-center border border-gray-100">
              {Object.entries(departmentData).map(([key, { name, count }], index) => (
                <button
                  key={key}
                  onClick={() => handleDeptFilter(key)}
                  className={`department-tab px-4 sm:px-6 py-3 m-1 rounded-xl transition-all duration-300 flex flex-col items-center ${
                    activeDept === key 
                    ? 'bg-gradient-to-r from-sricblue to-blue-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-sricblue hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold">{name}</span>
                  <span className={`text-xs mt-1 ${activeDept === key ? 'text-sricgold' : 'text-gray-400'}`}>
                    {count} {count === 1 ? 'Teacher' : 'Teachers'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Stats Bar */}
          <div className="bg-gradient-to-r from-sricblue to-blue-700 text-white rounded-2xl p-6 mb-12 shadow-xl fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">20+</div>
                <div className="text-sricgold font-medium">Qualified Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15</div>
                <div className="text-sricgold font-medium">Avg. Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sricgold font-medium">B.Ed Qualified</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{Object.keys(departmentData).length - 1}</div>
                <div className="text-sricgold font-medium">Departments</div>
              </div>
            </div>
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredFaculty.map((faculty, index) => (
              <div 
                key={faculty.id} 
                className="faculty-card fade-in"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={faculty.image} 
                      alt={faculty.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-sricblue px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      {departmentData[faculty.department]?.name || faculty.department}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold">{faculty.name}</h3>
                          <span className="text-xs bg-sricgold text-sricblue px-2 py-1 rounded-full">
                            {faculty.qualification.split('|')[1].trim()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sricblue to-blue-600 flex items-center justify-center text-white mr-3">
                        <i className="fas fa-user-graduate"></i>
                      </div>
                      <div>
                        <p className="text-sricgold font-bold text-lg">{faculty.position}</p>
                        <p className="text-gray-500 text-sm">{faculty.qualification.split('|')[0].trim()}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{faculty.description}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <button className="w-full bg-gradient-to-r from-sricblue to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-sricblue transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg">
                      <div className="flex items-center justify-center">
                        <span>View Complete Profile</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Faculty Excellence Section */}
          <div className="bg-gradient-to-r from-sricblue via-blue-700 to-blue-900 rounded-3xl overflow-hidden shadow-2xl fade-in">
            <div className="grid md:grid-cols-2">
              <div className="p-12 text-white">
                <h2 className="text-3xl font-bold mb-8 font-playfair">Our Teaching Philosophy</h2>
                <p className="text-lg mb-8 opacity-90">At SRIC, we believe in holistic education that nurtures both academic excellence and character development through our dedicated faculty.</p>
                
                <div className="space-y-6">
                  {[
                    "Student-centered learning approaches tailored to individual needs",
                    "Regular professional development programs for faculty",
                    "Innovative teaching methodologies for better engagement",
                    "Mentorship programs for personalized guidance",
                    "Technology integration in modern classrooms",
                    "Focus on practical and experiential learning"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start group">
                      <div className="flex-shrink-0 mt-1 text-sricgold transform group-hover:scale-110 transition-transform">
                        <i className="fas fa-check-circle text-xl"></i>
                      </div>
                      <p className="ml-4 text-lg group-hover:translate-x-2 transition-transform">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-12">
                <h3 className="text-2xl font-bold text-sricblue mb-8 text-center">Faculty Excellence</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <div className="text-5xl font-bold text-sricblue mb-2">500+</div>
                    <div className="text-gray-600 font-semibold">Students Mentored</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <div className="text-5xl font-bold text-sricblue mb-2">50+</div>
                    <div className="text-gray-600 font-semibold">Training Workshops</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <div className="text-5xl font-bold text-sricblue mb-2">95%</div>
                    <div className="text-gray-600 font-semibold">Student Satisfaction</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <div className="text-5xl font-bold text-sricblue mb-2">24/7</div>
                    <div className="text-gray-600 font-semibold">Academic Support</div>
                  </div>
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-sricgold to-yellow-500 rounded-xl p-6 text-center">
                  <h4 className="text-xl font-bold text-sricblue mb-2">Continuous Learning</h4>
                  <p className="text-sricblue">Our faculty regularly participates in national and international educational conferences</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
              <p className="text-gray-400 mb-6 text-lg">Preparing students for board success since 2002.</p>
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
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all hover:scale-110">
                  <i className="fab fa-linkedin-in"></i>
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
                  Academics
                </Link></li>
                <li><Link to="/admission-form" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                  Admissions
                </Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                  Contact
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
                  Science (PCMB)
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-book text-xs mr-2"></i>
                  Humanities
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-calculator text-xs mr-2"></i>
                  Mathematics
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-sricgold hover:underline transition-all flex items-center group">
                  <i className="fas fa-language text-xs mr-2"></i>
                  Languages
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
              
              <div className="mt-8 bg-gradient-to-r from-sricblue/20 to-blue-900/20 p-4 rounded-xl border border-gray-800">
                <p className="text-sm text-gray-400">
                  <i className="fas fa-clock text-sricgold mr-2"></i>
                  Office Hours: 8:00 AM - 4:00 PM
                </p>
              </div>
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
        .faculty-card {
          transition: all 0.3s ease;
          perspective: 1000px;
        }
        
        .faculty-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .department-tab {
          transition: all 0.3s ease;
          position: relative;
        }
        
        .department-tab.active {
          color: #002366;
          font-weight: 600;
        }
        
        .department-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 3px;
          background: #FFD700;
          border-radius: 3px;
        }
        
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Department-specific colors */
        .dept-science { background-color: #E1F5FE; }
        .dept-humanities { background-color: #E8F5E9; }
        .dept-language { background-color: #FFF3E0; }
        .dept-arts { background-color: #F3E5F5; }
        .dept-english { background-color: #E8EAF6; }
        .dept-urdu { background-color: #F1F8E9; }
        .dept-math { background-color: #E0F7FA; }
        .dept-computer { background-color: #FFF8E1; }
        .dept-physical { background-color: #E0F2F1; }
        .dept-home-science { background-color: #FFE8E8; }
      `}</style>
    </div>
  );
};

export default Faculty;