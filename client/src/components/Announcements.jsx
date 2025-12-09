import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Announcements = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const announcementsData = [
    {
      id: 1,
      title: "UP Board Practical Dates",
      date: "10 April 2025",
      day: "10",
      month: "April",
      category: "academic",
      isNew: true,
      isUrgent: false,
      content: "Practical examinations for Class 10 and 12 will be conducted from January 5-15, 2026. Preparation classes start November 2025.",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Monthly Test Schedule",
      date: "05 April 2025",
      day: "05",
      month: "April",
      category: "academic urgent",
      isNew: false,
      isUrgent: true,
      content: "Monthly tests for all classes will be conducted in the first week of August 2025. Syllabus will be shared soon.",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Summer Vacation Notice",
      date: "28 March 2025",
      day: "28",
      month: "March",
      category: "general",
      isNew: false,
      isUrgent: false,
      content: "Summer vacation will be from May 15 to June 30, 2025. School will reopen on July 1, 2025. All students must clear their dues before vacation.",
      posted: "3 weeks ago"
    },
    {
      id: 4,
      title: "Quarterly Exam Schedule",
      date: "25 March 2025",
      day: "25",
      month: "March",
      category: "academic",
      isNew: false,
      isUrgent: false,
      content: "Quarterly examinations will be held in the last week of September 2025 for all classes. Detailed timetable will be announced soon.",
      posted: "4 weeks ago"
    },
    {
      id: 5,
      title: "Independence Day Celebration",
      date: "20 March 2025",
      day: "20",
      month: "March",
      category: "events",
      isNew: false,
      isUrgent: false,
      content: "Independence Day will be celebrated on August 15, 2025. Cultural programs and flag hoisting ceremony. Students can participate in various competitions.",
      posted: "1 month ago"
    },
    {
      id: 6,
      title: "Annual Sports Day",
      date: "15 March 2025",
      day: "15",
      month: "March",
      category: "events",
      isNew: false,
      isUrgent: false,
      content: "Annual Sports Day will be held on December 15, 2025. Registrations open for various sports competitions.",
      posted: "1 month ago"
    }
  ];

  const archivedAnnouncements = [
    {
      date: "March 15, 2025",
      title: "UP Board Result Analysis 2024-25",
      category: "Academic"
    },
    {
      date: "February 28, 2025",
      title: "Summer Vacation Schedule",
      category: "General"
    },
    {
      date: "February 15, 2025",
      title: "Annual Day Celebration Winners",
      category: "Event"
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const filteredAnnouncements = announcementsData.filter(announcement => {
    const matchesFilter = filter === 'all' || announcement.category.includes(filter);
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const visibleAnnouncements = filteredAnnouncements.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCategoryBadge = (category) => {
    if (category.includes('urgent')) {
      return { text: 'Important', class: 'bg-yellow-100 text-yellow-800', icon: 'exclamation-triangle' };
    }
    if (category.includes('academic')) {
      return { text: 'Academic', class: 'bg-green-100 text-green-800', icon: 'book' };
    }
    if (category.includes('events')) {
      return { text: 'Event', class: 'bg-blue-100 text-blue-800', icon: 'calendar' };
    }
    return { text: 'General', class: 'bg-purple-100 text-purple-800', icon: 'info-circle' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md">
        <nav className="bg-sricblue p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/assets/SRIC LOGO.PNG" alt="SRIC Logo" className="h-10 w-10 rounded-full" />
              <Link to="/" className="text-white text-xl font-bold">SITARAM INTER COLLEGE</Link>
              <span className="hidden sm:inline text-sricgold text-sm">Empowering Minds, Shaping Futures</span>
            </div>
            
            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
              <li><Link to="/" className="text-gray-300 hover:text-white hover:underline">Home</Link></li>
              
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center">
                  About Us <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/mission" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Mission</Link></li>
                  <li><Link to="/history" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">History</Link></li>
                  <li><Link to="/faculty" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Faculty</Link></li>
                </ul>
              </li>
              
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Academics <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">UP Board Curriculum</Link></li>
                  <li><Link to="/programs" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Programs</Link></li>
                </ul>
              </li>
              
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Admissions <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/process" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Process</Link></li>
                  <li><Link to="/fees" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Fees</Link></li>
                </ul>
              </li>
              
              <li className="relative group">
                <button className="text-white focus:outline-none flex items-center font-semibold">
                  News & Events <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li><Link to="/calendar" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Calendar</Link></li>
                  <li><Link to="/announcements" className="block px-4 py-2 bg-sricblue text-white">Announcements</Link></li>
                </ul>
              </li>
              
              <li><Link to="/contact" className="text-gray-300 hover:text-white hover:underline">Contact</Link></li>
            </ul>

            <Link to="/admission-form" className="hidden md:block bg-sricgold text-sricblue px-4 py-2 rounded-md font-semibold hover:bg-yellow-600 transition">Apply Now</Link>

            <button 
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
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-sricblue pb-4 px-4`}>
            <ul className="flex flex-col space-y-2">
              <li><Link to="/" className="block text-gray-300 hover:text-white py-2">Home</Link></li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
                >
                  About Us <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'about' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/mission" className="block text-gray-400 hover:text-white py-1 text-sm">Mission</Link></li>
                  <li><Link to="/history" className="block text-gray-400 hover:text-white py-1 text-sm">History</Link></li>
                  <li><Link to="/faculty" className="block text-gray-400 hover:text-white py-1 text-sm">Faculty</Link></li>
                </div>
              </li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('academics')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
                >
                  Academics <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'academics' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'academics' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/curriculum" className="block text-gray-400 hover:text-white py-1 text-sm">UP Board Curriculum</Link></li>
                  <li><Link to="/programs" className="block text-gray-400 hover:text-white py-1 text-sm">Programs</Link></li>
                </div>
              </li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('admissions')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
                >
                  Admissions <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'admissions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'admissions' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/process" className="block text-gray-400 hover:text-white py-1 text-sm">Process</Link></li>
                  <li><Link to="/fees" className="block text-gray-400 hover:text-white py-1 text-sm">Fees</Link></li>
                </div>
              </li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('news')}
                  className="dropdown-btn w-full text-left text-white py-2 flex justify-between items-center font-semibold"
                >
                  News & Events <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'news' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'news' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/calendar" className="block text-gray-400 hover:text-white py-1 text-sm">Calendar</Link></li>
                  <li><Link to="/announcements" className="block text-white py-1 text-sm">Announcements</Link></li>
                </div>
              </li>
              
              <li><Link to="/contact" className="block text-gray-300 hover:text-white py-2">Contact</Link></li>
              <li><Link to="/admission-form" className="block bg-sricgold text-sricblue px-4 py-2 rounded-md text-center font-semibold mt-2">Apply Now</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-sricgold opacity-20"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-sricblue opacity-20"></div>
          <h1 className="text-3xl md:text-4xl font-bold text-sricblue mb-3 relative z-10 animate-fade-in-down">
            UP Board Announcements 2025-26
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-sricblue to-sricgold mx-auto mb-4 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto relative z-10">
            Stay updated with the latest news and important notices for the 2025-26 academic session
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto">
              <div className="search-box flex items-center">
                <i className="fas fa-search text-gray-400 mr-2"></i>
                <input 
                  type="text" 
                  placeholder="Search announcements..." 
                  className="w-full focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['all', 'academic', 'events', 'general', 'urgent'].map((filterType) => (
                <button
                  key={filterType}
                  className={`filter-btn px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base transition ${
                    filter === filterType 
                      ? 'bg-sricblue text-white shadow-md' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setFilter(filterType)}
                >
                  {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Highlight Announcement */}
        <div className="mb-12 animate-fade-in-up">
          <div className="highlight-card text-white rounded-2xl shadow-xl p-6 md:p-8 transition duration-300 relative overflow-hidden pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-r from-sricblue to-blue-900 opacity-90"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-sricgold opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-sricgold opacity-20 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div className="flex items-center">
                  <span className="bg-sricgold text-sricblue px-3 py-1 rounded-full text-sm font-bold mr-3 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> URGENT
                  </span>
                  <span className="text-white text-sm">April 15, 2025</span>
                </div>
                <div className="flex items-center text-sricgold cursor-pointer hover:opacity-80 transition">
                  <i className="fas fa-share-alt mr-2"></i>
                  <span className="text-sm">Share this announcement</span>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">UP Board Exam Preparation Schedule</h2>
              <p className="mb-6 opacity-90">
                Special classes for Class 10 and 12 students will begin from May 1, 2025. Attendance is mandatory for all students. Detailed schedule will be shared in classrooms and via student portal.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-sricgold hover:bg-yellow-600 text-sricblue font-semibold py-2 px-4 md:px-6 rounded-lg transition duration-300 flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i> View Schedule
                </button>
                <button className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-2 px-4 md:px-6 rounded-lg transition duration-300 flex items-center">
                  <i className="fas fa-download mr-2"></i> Download Syllabus
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Announcements Grid */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-sricblue flex items-center">
              <i className="fas fa-bullhorn mr-2 text-sricgold"></i> Recent Announcements
            </h2>
            <div className="text-gray-500 text-sm">
              {visibleAnnouncements.length} announcements found
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {visibleAnnouncements.map((announcement) => {
              const badge = getCategoryBadge(announcement.category);
              return (
                <div 
                  key={announcement.id}
                  className={`announcement-card bg-white rounded-xl shadow-md overflow-hidden transition duration-300 relative animate-fade-in-up gradient-border ${
                    announcement.isNew ? 'new-announcement' : ''
                  } ${announcement.isUrgent ? 'urgent-announcement' : ''}`}
                  data-category={announcement.category}
                >
                  <span className={`category-badge ${badge.class} flex items-center`}>
                    <i className={`fas fa-${badge.icon} mr-1`}></i> {badge.text}
                  </span>
                  <div className="p-4 md:p-6">
                    <div className="flex items-start mb-4">
                      <div className="announcement-date mr-4">
                        <span className="text-lg font-bold">{announcement.day}</span>
                        <span className="text-xs">{announcement.month}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg md:text-xl mb-1">{announcement.title}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <i className="far fa-clock mr-1"></i>
                          <span>{announcement.posted}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-4">{announcement.content}</p>
                    <div className="flex justify-between items-center">
                      <button className="text-sricblue font-semibold hover:underline flex items-center text-sm md:text-base">
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </button>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-sricblue transition">
                          <i className="far fa-bookmark"></i>
                        </button>
                        <button className="text-gray-400 hover:text-sricblue transition">
                          <i className="far fa-share-square"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Load More Button */}
          {visibleCount < filteredAnnouncements.length && (
            <div className="text-center mt-8">
              <button 
                onClick={loadMore}
                className="bg-sricblue hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
              >
                Load More Announcements
              </button>
            </div>
          )}
        </div>
        
        {/* Archived Announcements */}
        <div className="mt-12 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-sricblue flex items-center">
              <i className="fas fa-archive mr-2 text-sricgold"></i> Previous Announcements (2024-25)
            </h2>
            <button className="text-sricblue hover:underline text-sm md:text-base flex items-center">
              View All Archived
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 announcement-table">
                <thead className="bg-gradient-to-r from-sricblue to-blue-800 text-white">
                  <tr>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-bold uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-bold uppercase tracking-wider">Title</th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-bold uppercase tracking-wider">Category</th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {archivedAnnouncements.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm md:text-base">{item.date}</td>
                      <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base">{item.title}</td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.category === 'Academic' ? 'bg-green-100 text-green-800' :
                          item.category === 'General' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 md:px-6 md:py-4 whitespace-nowrap">
                        <button className="text-sricblue hover:underline text-sm md:text-base flex items-center">
                          <i className="fas fa-eye mr-1"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      {showScrollTop && (
        <div 
          className="floating-action"
          onClick={scrollToTop}
        >
          <i className="fas fa-arrow-up"></i>
        </div>
      )}

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
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/academics" className="text-gray-400 hover:text-white">Academics</Link></li>
                <li><Link to="/admission-form" className="text-gray-400 hover:text-white">Admissions</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">News & Events</h4>
              <ul className="space-y-2">
                <li><Link to="/calendar" className="text-gray-400 hover:text-white">School Calendar</Link></li>
                <li><Link to="/announcements" className="text-gray-400 hover:text-white">Announcements</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Latest News</a></li>
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

export default Announcements;