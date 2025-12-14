import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Announcements = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Function to handle PDF download
  const handleDownload = (fileName) => {
    // Create a temporary link element
    const link = document.createElement('a');
    
    // Map file names to actual file paths
    const fileMap = {
      'Practical Schedule.pdf': 'assets/Board Practical Schedule 2025-26.pdf',
      'Syllabus.pdf': 'assets/UP Board Syllabus 2025-26.pdf',
      'Quarterly Datesheet.pdf': '/assets/त्रैमासिक परीक्षा समय सारणी.pdf',
      'Half Yearly Datesheet.pdf': '/assets/Half Yearly Examination Date Sheet 2025.pdf',
      'Holiday Schedule.pdf': 'assets/Holiday Schedule 2025-26.pdf',
      'Event Schedule.pdf': 'assets/Event Schedule 2025-26.pdf',
      'Academic Calendar.pdf': 'assets/Academic Calendar 2025-26.pdf',
      'PTM Schedule.pdf': 'assets/Parent Teacher Meeting Schedule.pdf'
    };

    // Set the href to the file path
    link.href = fileMap[fileName] || `assets/${fileName}`;
    link.download = fileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const announcementsData = [
    {
      id: 1,
      title: "UP Board Practical Examination Schedule",
      date: "15 April 2025",
      day: "15",
      month: "April",
      category: "academic urgent",
      isNew: true,
      isUrgent: true,
      content: "Practical examinations for Class 10 and 12 will be conducted from January 5-15, 2026. Special preparation classes will commence from November 1, 2025. All students must attend regularly.",
      posted: "2 days ago",
      author: "Examination Department",
      attachments: ["Practical Schedule.pdf", "Syllabus.pdf"]
    },
    {
      id: 2,
      title: "Quarterly Examination Date Sheet Released",
      date: "10 April 2025",
      day: "10",
      month: "April",
      category: "academic",
      isNew: true,
      isUrgent: false,
      content: "Quarterly examinations for all classes (UKG to 12th) will be held from October 3-13, 2025. Detailed timetable is available for download. Students should begin preparation immediately.",
      posted: "1 week ago",
      author: "Principal's Office",
      attachments: ["Quarterly Datesheet.pdf"]
    },
    {
      id: 3,
      title: "Half-Yearly Examination Schedule Announcement",
      date: "05 April 2025",
      day: "05",
      month: "April",
      category: "academic urgent",
      isNew: false,
      isUrgent: true,
      content: "Half-Yearly examinations for all classes will be conducted from December 11-26, 2025. This includes practical exams for science and other subjects. Detailed schedule attached.",
      posted: "2 weeks ago",
      author: "Examination Department",
      attachments: ["Half Yearly Datesheet.pdf"]
    },
    {
      id: 4,
      title: "Diwali Holiday Schedule 2025",
      date: "28 March 2025",
      day: "28",
      month: "March",
      category: "holiday",
      isNew: false,
      isUrgent: false,
      content: "School will remain closed for Diwali holidays from October 19 to October 24, 2025. Regular classes will resume from October 25, 2025. Students must complete pending assignments.",
      posted: "3 weeks ago",
      author: "Administration",
      attachments: ["Holiday Schedule.pdf"]
    },
    {
      id: 5,
      title: "Independence Day Celebration Program",
      date: "20 March 2025",
      day: "20",
      month: "March",
      category: "events",
      isNew: false,
      isUrgent: false,
      content: "Independence Day will be celebrated on August 15, 2025 with flag hoisting ceremony at 8:00 AM. Cultural programs and patriotic song competitions. Participation certificates will be awarded.",
      posted: "1 month ago",
      author: "Cultural Committee",
      attachments: ["Event Schedule.pdf"]
    },
    {
      id: 6,
      title: "New Session Begins - Academic Year 2025-26",
      date: "01 April 2025",
      day: "01",
      month: "April",
      category: "academic",
      isNew: false,
      isUrgent: false,
      content: "Academic session 2025-26 begins for all classes. All students must collect their new books and syllabus. Timetable for the new session is displayed on notice boards.",
      posted: "1 month ago",
      author: "Principal's Office",
      attachments: ["Academic Calendar.pdf", "Syllabus.pdf"]
    },
    {
      id: 7,
      title: "Republic Day Celebration & Holiday",
      date: "15 March 2025",
      day: "15",
      month: "March",
      category: "holiday",
      isNew: false,
      isUrgent: false,
      content: "Republic Day will be celebrated on January 26, 2026. School will remain closed. Patriotic programs will be organized on January 25, 2026.",
      posted: "1 month ago",
      author: "Administration",
      attachments: []
    },
    {
      id: 8,
      title: "Parent-Teacher Meeting Schedule",
      date: "10 March 2025",
      day: "10",
      month: "March",
      category: "events",
      isNew: false,
      isUrgent: false,
      content: "Quarterly Parent-Teacher meeting will be held on October 3, 2025. All parents/guardians must attend with their wards. Academic progress will be discussed.",
      posted: "1 month ago",
      author: "Principal's Office",
      attachments: ["PTM Schedule.pdf"]
    }
  ];

  const archivedAnnouncements = [
    {
      date: "March 15, 2025",
      title: "UP Board Result Analysis 2024-25",
      category: "Academic",
      author: "Examination Department",
      attachments: ["Result Analysis.pdf"]
    },
    {
      date: "February 28, 2025",
      title: "Summer Vacation Schedule 2024",
      category: "General",
      author: "Administration",
      attachments: ["Summer Schedule.pdf"]
    },
    {
      date: "February 15, 2025",
      title: "Science Exhibition Winners 2024",
      category: "Event",
      author: "Science Department",
      attachments: ["Winners List.pdf"]
    },
    {
      date: "January 30, 2025",
      title: "Board Exam Preparation Schedule",
      category: "Academic",
      author: "Principal's Office",
      attachments: ["Preparation Schedule.pdf"]
    },
    {
      date: "January 15, 2025",
      title: "Republic Day Celebration Guidelines",
      category: "Event",
      author: "Cultural Committee",
      attachments: ["Guidelines.pdf"]
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
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const visibleAnnouncements = filteredAnnouncements.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewAnnouncementDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const closeAnnouncementDetails = () => {
    setSelectedAnnouncement(null);
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
      return { 
        text: 'Important', 
        class: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200', 
        icon: 'exclamation-triangle',
        color: 'red'
      };
    }
    if (category.includes('academic')) {
      return { 
        text: 'Academic', 
        class: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200', 
        icon: 'book',
        color: 'green'
      };
    }
    if (category.includes('events')) {
      return { 
        text: 'Event', 
        class: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200', 
        icon: 'calendar',
        color: 'blue'
      };
    }
    if (category.includes('holiday')) {
      return { 
        text: 'Holiday', 
        class: 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200', 
        icon: 'umbrella-beach',
        color: 'purple'
      };
    }
    return { 
      text: 'General', 
      class: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200', 
      icon: 'info-circle',
      color: 'gray'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Announcement Details Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className={`p-6 text-white ${selectedAnnouncement.isUrgent ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-sricblue to-blue-600'}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
                <button 
                  onClick={closeAnnouncementDetails}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt text-sricblue mr-2"></i>
                  <span className="font-medium">{selectedAnnouncement.date}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-user text-sricblue mr-2"></i>
                  <span className="font-medium">{selectedAnnouncement.author}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-clock text-sricblue mr-2"></i>
                  <span className="font-medium">{selectedAnnouncement.posted}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Announcement Details</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{selectedAnnouncement.content}</p>
              </div>
              
              {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <i className="fas fa-paperclip mr-2"></i> Attachments
                  </h4>
                  <div className="space-y-2">
                    {selectedAnnouncement.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center">
                          <i className="fas fa-file-pdf text-red-500 mr-3 text-xl"></i>
                          <span className="font-medium">{attachment}</span>
                        </div>
                        <button 
                          onClick={() => handleDownload(attachment)}
                          className="text-sricblue hover:text-blue-700 font-medium px-3 py-1 rounded hover:bg-blue-50 transition"
                        >
                          <i className="fas fa-download mr-1"></i> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  onClick={closeAnnouncementDetails}
                  className="px-6 py-2 border-2 border-sricblue text-sricblue rounded-lg font-bold hover:bg-sricblue hover:text-white transition"
                >
                  Close
                </button>
                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                  <button 
                    onClick={() => handleDownload(selectedAnnouncement.attachments[0])}
                    className="px-6 py-2 bg-gradient-to-r from-sricblue to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition"
                  >
                    <i className="fas fa-download mr-2"></i> Download All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 shadow-lg">
        <nav className="bg-gradient-to-r from-sricblue to-blue-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <img src="/assets/SRIC LOGO.PNG" alt="SRIC Logo" className="h-10 w-10 rounded-full" />
              </div>
              <Link to="/" className="text-white text-xl font-bold tracking-tight">SITARAM INTER COLLEGE</Link>
              <span className="hidden sm:inline text-sricgold text-sm font-medium bg-white/10 px-2 py-1 rounded">Empowering Minds, Shaping Futures</span>
            </div>
            
            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
              <li><Link to="/" className="text-gray-300 hover:text-white hover:underline transition">Home</Link></li>
              
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center transition">
                  About Us <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/mission" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">Mission</Link></li>
                  <li><Link to="/history" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">History</Link></li>
                  <li><Link to="/faculty" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">Faculty</Link></li>
                </ul>
              </li>
              
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center transition">
                  Academics <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">UP Board Curriculum</Link></li>
                  <li><Link to="/programs" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">Programs</Link></li>
                </ul>
              </li>
              
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center transition">
                  Admissions <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/process" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">Process</Link></li>
                  <li><Link to="/fees" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">Fees</Link></li>
                </ul>
              </li>
              
              <li className="relative group">
                <button className="text-white focus:outline-none flex items-center font-bold">
                  News & Events <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1">
                  <li><Link to="/calendar" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white transition">Calendar</Link></li>
                  <li><Link to="/announcements" className="block px-4 py-2 bg-blue-50 text-sricblue font-bold">Announcements</Link></li>
                </ul>
              </li>
              
              <li><Link to="/contact" className="text-gray-300 hover:text-white hover:underline transition">Contact</Link></li>
            </ul>

            <Link to="/admission-form" className="hidden md:block bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition transform">Apply Now</Link>

            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-white focus:outline-none hover:bg-white/10 p-2 rounded-lg" 
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-sricblue/95 backdrop-blur-sm pb-4 px-4 transition-all duration-300 rounded-b-lg`}>
            <ul className="flex flex-col space-y-2">
              <li><Link to="/" className="block text-gray-300 hover:text-white py-2 transition">Home</Link></li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center transition"
                >
                  About Us <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'about' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/mission" className="block text-gray-400 hover:text-white py-1 text-sm transition">Mission</Link></li>
                  <li><Link to="/history" className="block text-gray-400 hover:text-white py-1 text-sm transition">History</Link></li>
                  <li><Link to="/faculty" className="block text-gray-400 hover:text-white py-1 text-sm transition">Faculty</Link></li>
                </div>
              </li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('academics')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center transition"
                >
                  Academics <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'academics' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'academics' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/curriculum" className="block text-gray-400 hover:text-white py-1 text-sm transition">UP Board Curriculum</Link></li>
                  <li><Link to="/programs" className="block text-gray-400 hover:text-white py-1 text-sm transition">Programs</Link></li>
                </div>
              </li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('admissions')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center transition"
                >
                  Admissions <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'admissions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'admissions' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/process" className="block text-gray-400 hover:text-white py-1 text-sm transition">Process</Link></li>
                  <li><Link to="/fees" className="block text-gray-400 hover:text-white py-1 text-sm transition">Fees</Link></li>
                </div>
              </li>
              
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('news')}
                  className="dropdown-btn w-full text-left text-white py-2 flex justify-between items-center font-bold"
                >
                  News & Events <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'news' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'news' ? 'max-h-40' : 'max-h-0'}`}>
                  <li><Link to="/calendar" className="block text-gray-400 hover:text-white py-1 text-sm transition">Calendar</Link></li>
                  <li><Link to="/announcements" className="block text-white py-1 text-sm font-bold">Announcements</Link></li>
                </div>
              </li>
              
              <li><Link to="/contact" className="block text-gray-300 hover:text-white py-2 transition">Contact</Link></li>
              <li><Link to="/admission-form" className="block bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue px-4 py-3 rounded-lg text-center font-bold mt-2 hover:shadow-lg transition">Apply Now</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-r from-sricgold to-yellow-400 opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-r from-sricblue to-blue-600 opacity-20 animate-pulse"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-sricblue mb-4 relative z-10 bg-clip-text bg-gradient-to-r from-sricblue to-blue-600">
            UP Board Announcements 2025-26
          </h1>
          <div className="w-32 h-2 bg-gradient-to-r from-sricblue via-sricgold to-sricblue mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto relative z-10">
            Stay updated with the latest academic news, examination schedules, and important notices
          </p>
          
          {/* Stats Bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="bg-white p-4 rounded-xl shadow-lg min-w-[120px] text-center">
              <div className="text-2xl font-bold text-sricblue">{announcementsData.length}</div>
              <div className="text-gray-600 text-sm">Total Announcements</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg min-w-[120px] text-center">
              <div className="text-2xl font-bold text-green-600">{announcementsData.filter(a => a.isUrgent).length}</div>
              <div className="text-gray-600 text-sm">Important</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg min-w-[120px] text-center">
              <div className="text-2xl font-bold text-red-600">{announcementsData.filter(a => a.isNew).length}</div>
              <div className="text-gray-600 text-sm">New</div>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-xl p-6 mb-8 animate-fade-in-up border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="w-full md:w-96">
              <div className="search-box relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  placeholder="Search announcements by title, content or author..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', icon: 'list' },
                { key: 'academic', label: 'Academic', icon: 'book' },
                { key: 'events', label: 'Events', icon: 'calendar' },
                { key: 'holiday', label: 'Holidays', icon: 'umbrella-beach' },
                { key: 'urgent', label: 'Important', icon: 'exclamation-circle' }
              ].map((filterType) => {
                const badge = getCategoryBadge(filterType.key);
                return (
                  <button
                    key={filterType.key}
                    className={`filter-btn px-4 py-2 rounded-lg font-medium transition flex items-center ${filter === filterType.key 
                      ? `bg-gradient-to-r from-${badge.color}-500 to-${badge.color}-600 text-white shadow-lg` 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter(filterType.key)}
                  >
                    <i className={`fas fa-${filterType.icon} mr-2`}></i>
                    {filterType.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Highlight Announcement */}
        <div className="mb-12 animate-fade-in-up">
          <div className="highlight-card text-white rounded-2xl shadow-2xl p-8 transition duration-300 relative overflow-hidden hover:shadow-3xl transform hover:scale-[1.005]">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 opacity-90"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300 opacity-20 rounded-full translate-y-16 -translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-red-700 px-4 py-2 rounded-full text-sm font-bold mr-4 flex items-center shadow-md">
                    <i className="fas fa-bullhorn mr-2"></i> URGENT NOTICE
                  </span>
                  <span className="text-white/90 text-sm bg-white/10 px-3 py-1 rounded-lg">April 15, 2025</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-white hover:text-yellow-200 transition flex items-center">
                    <i className="fas fa-print mr-2"></i>
                    <span className="text-sm">Print</span>
                  </button>
                  <button className="text-white hover:text-yellow-200 transition flex items-center">
                    <i className="fas fa-share-alt mr-2"></i>
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">UP Board Practical Exam Preparation Classes</h2>
              <p className="mb-6 opacity-95 text-lg">
                Special preparatory classes for Class 10 and 12 board practical examinations will commence from November 1, 2025. Attendance is mandatory for all students. Detailed schedule and syllabus available for download.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleDownload('Practical Schedule.pdf')}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-red-700 font-bold py-3 px-6 rounded-xl transition duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-download mr-2"></i> Download Schedule
                </button>
                <button 
                  onClick={() => handleDownload('Syllabus.pdf')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white text-white font-bold py-3 px-6 rounded-xl transition duration-300 flex items-center"
                >
                  <i className="fas fa-file-pdf mr-2"></i> Download Syllabus
                </button>
                <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-3 px-6 rounded-xl transition duration-300 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i> More Details
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Announcements Grid */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-sricblue flex items-center">
              <i className="fas fa-newspaper mr-3 text-sricgold text-2xl"></i> Recent Announcements
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-gray-600 font-medium bg-white px-4 py-2 rounded-xl shadow-sm">
                Showing {visibleAnnouncements.length} of {filteredAnnouncements.length} announcements
              </div>
              <button className="text-sricblue hover:text-blue-700 font-medium flex items-center">
                <i className="fas fa-bell mr-2"></i>
                Subscribe
              </button>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAnnouncements.map((announcement) => {
              const badge = getCategoryBadge(announcement.category);
              return (
                <div 
                  key={announcement.id}
                  className={`announcement-card bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 relative animate-fade-in-up hover:shadow-2xl hover:scale-[1.02] transform border-l-4 border-${badge.color}-500 ${announcement.isNew ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  {announcement.isNew && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-red-700 px-3 py-1 rounded-full text-xs font-bold z-10">
                      <i className="fas fa-star mr-1"></i> NEW
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="announcement-date mr-4 flex-shrink-0">
                        <div className="text-center bg-gradient-to-b from-gray-100 to-gray-50 p-3 rounded-xl border border-gray-200">
                          <span className="text-2xl font-bold text-sricblue block">{announcement.day}</span>
                          <span className="text-sm text-gray-600">{announcement.month}</span>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-gray-800 line-clamp-2">{announcement.title}</h3>
                        </div>
                        <div className={`${badge.class} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                          <i className={`fas fa-${badge.icon} mr-2`}></i> {badge.text}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-user-circle mr-2"></i>
                          <span className="mr-4">{announcement.author}</span>
                          <i className="far fa-clock mr-2"></i>
                          <span>{announcement.posted}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">{announcement.content}</p>
                    
                    {/* Attachment Links */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <i className="fas fa-paperclip mr-2"></i> Attachments:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {announcement.attachments.map((attachment, index) => (
                            <button
                              key={index}
                              onClick={() => handleDownload(attachment)}
                              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center transition"
                            >
                              <i className="fas fa-file-pdf mr-1 text-red-500"></i>
                              {attachment}
                              <i className="fas fa-download ml-2 text-xs"></i>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => viewAnnouncementDetails(announcement)}
                        className="text-sricblue font-bold hover:text-blue-700 flex items-center group"
                      >
                        Read Full Notice
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </button>
                      <div className="flex space-x-3">
                        {announcement.attachments && announcement.attachments.length > 0 && (
                          <span className="text-gray-400 flex items-center">
                            <i className="fas fa-paperclip mr-1"></i>
                            <span className="text-xs">{announcement.attachments.length}</span>
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-sricblue transition" title="Bookmark">
                          <i className="far fa-bookmark"></i>
                        </button>
                        <button className="text-gray-400 hover:text-sricblue transition" title="Share">
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
            <div className="text-center mt-12">
              <button 
                onClick={loadMore}
                className="bg-gradient-to-r from-sricblue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Load More Announcements ({filteredAnnouncements.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
        
        {/* Archived Announcements */}
        <div className="mt-12 animate-fade-in-up">
          <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <i className="fas fa-archive text-2xl mr-3"></i>
                <div>
                  <h2 className="text-2xl font-bold">Previous Announcements (2024-25)</h2>
                  <p className="opacity-90">Access archived notices from previous academic year</p>
                </div>
              </div>
              <button className="bg-white hover:bg-gray-100 text-sricblue font-bold py-2 px-6 rounded-lg transition">
                View All Archived
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 announcement-table">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Downloads</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {archivedAnnouncements.map((item, index) => (
                    <tr key={index} className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-800 font-medium">{item.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.category === 'Academic' ? 'bg-green-100 text-green-800' :
                          item.category === 'General' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600">{item.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          {item.attachments && item.attachments.length > 0 ? (
                            item.attachments.map((attachment, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleDownload(attachment)}
                                className="text-sricblue hover:text-blue-700 font-medium flex items-center text-sm"
                              >
                                <i className="fas fa-download mr-1"></i> PDF
                              </button>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No files</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="text-center text-gray-600">
                Showing 5 of 48 archived announcements
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      {showScrollTop && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-sricblue to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-110"
          onClick={scrollToTop}
        >
          <i className="fas fa-arrow-up text-lg"></i>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-sricblue text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-white to-gray-200 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-sricblue text-2xl font-bold">SRIC</span>
                </div>
                <h3 className="text-2xl font-bold ml-4 bg-clip-text bg-gradient-to-r from-white to-gray-300">SRIC</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg">Preparing students for UP Board success since 2002.</p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-sricblue w-10 h-10 rounded-full flex items-center justify-center transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-sricblue w-10 h-10 rounded-full flex items-center justify-center transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-sricblue w-10 h-10 rounded-full flex items-center justify-center transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-sricblue w-10 h-10 rounded-full flex items-center justify-center transition">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-link mr-2"></i>
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-300 hover:text-white transition flex items-center">
                  <i className="fas fa-home mr-2"></i> Home
                </Link></li>
                <li><Link to="/mission" className="text-gray-300 hover:text-white transition flex items-center">
                  <i className="fas fa-info-circle mr-2"></i> About Us
                </Link></li>
                <li><Link to="/curriculum" className="text-gray-300 hover:text-white transition flex items-center">
                  <i className="fas fa-book mr-2"></i> Academics
                </Link></li>
                <li><Link to="/admission-form" className="text-gray-300 hover:text-white transition flex items-center">
                  <i className="fas fa-user-graduate mr-2"></i> Admissions
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-newspaper mr-2"></i>
                News & Events
              </h4>
              <ul className="space-y-3">
                <li><Link to="/calendar" className="text-gray-300 hover:text-white transition flex items-center font-medium">
                  <i className="fas fa-calendar-check mr-2"></i> Academic Calendar
                </Link></li>
                <li><Link to="/announcements" className="text-gray-300 hover:text-white transition flex items-center font-medium">
                  <i className="fas fa-bullhorn mr-2"></i> Announcements
                </Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition flex items-center">
                  <i className="fas fa-newspaper mr-2"></i> Latest News
                </a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-address-book mr-2"></i>
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-4 text-sricgold text-xl"></i>
                  <span className="text-gray-300">Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-4 text-sricgold text-xl"></i>
                  <span className="text-gray-300">+91 9756517750</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-4 text-sricgold text-xl"></i>
                  <span className="text-gray-300">sitaramintercollege1205@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 text-center">
            <p className="text-gray-400">© 2025 SRIC Senior Secondary School. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-2">Affiliated to UP Board, Allahabad | Est. 2002</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Announcements;