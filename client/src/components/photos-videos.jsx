import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PhotosVideos = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#mobile-menu') && !event.target.closest('#menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: 'fas fa-layer-group', count: 24 },
    { id: 'events', name: 'Events', icon: 'fas fa-calendar-alt', count: 16 },
    { id: 'achievements', name: 'Achievements', icon: 'fas fa-trophy', count: 12 },
    { id: 'cultural', name: 'Cultural', icon: 'fas fa-music', count: 8 },
    { id: 'competitions', name: 'Competitions', icon: 'fas fa-gamepad', count: 6 },
  ];

  const photoGalleryItems = [
    // Farewell Photos
    { id: 1, category: 'events', src: '/assets/farewell1.jpeg', title: 'Farewell 2025', description: 'Graduating Students' },
    { id: 2, category: 'events', src: '/assets/farewell2.jpeg', title: 'Farewell 2025', description: 'Gift Distribution' },
    { id: 3, category: 'events', src: '/assets/farewell3.jpeg', title: 'Farewell 2025', description: 'Group Photos' },
    { id: 4, category: 'events', src: '/assets/farewell4.jpeg', title: 'Farewell 2025', description: 'Cultural Performances' },
    { id: 5, category: 'events', src: '/assets/farewell5.jpeg', title: 'Farewell 2025', description: 'Cultural Performances' },
    { id: 6, category: 'events', src: '/assets/farewell6.jpeg', title: 'Farewell 2025', description: 'Certificate Distribution' },
    { id: 7, category: 'events', src: '/assets/farewell7.jpeg', title: 'Farewell 2025', description: 'Farewell Party' },
    { id: 8, category: 'events', src: '/assets/farewell8.jpeg', title: 'Farewell 2024', description: 'Final Memories' },
    { id: 9, category: 'events', src: '/assets/2018 farewell.jpeg', title: 'Farewell 2018', description: 'Nostalgic Memories' },
    
    // Prize Distribution Photos
    { id: 10, category: 'achievements', src: '/assets/prize1.jpeg', title: 'Prize Day 2025', description: 'Top Performers' },
    { id: 11, category: 'achievements', src: '/assets/prize3.jpeg', title: 'Prize Day 2025', description: 'Award Winners' },
    { id: 12, category: 'achievements', src: '/assets/prize4.jpeg', title: 'Prize Day 2025', description: 'Certificate Distribution' },
    { id: 13, category: 'achievements', src: '/assets/prize5.jpeg', title: 'Prize Day 2025', description: 'Sports Achievements' },
    { id: 14, category: 'achievements', src: '/assets/prize6.jpeg', title: 'Prize Day 2025', description: 'Special Achievements' },
    { id: 15, category: 'achievements', src: '/assets/prize7.jpeg', title: 'Prize Day 2025', description: 'Perfect Attendance' },
    { id: 16, category: 'achievements', src: '/assets/prize8.jpeg', title: 'Glory Moment', description: 'Recognition Day' },
    { id: 17, category: 'achievements', src: '/assets/prize9.jpeg', title: 'Prize Day 2025', description: 'Winners with Teachers' },
    
    // Competition Photos
    { id: 18, category: 'competitions', src: '/assets/competition1.jpeg', title: 'GK Quiz Championship', description: 'Battle of Wits' },
    { id: 19, category: 'competitions', src: '/assets/competition2.jpeg', title: 'Quiz Masters', description: 'Battle of Brilliance' },
    
    // Cultural Photos
    { id: 20, category: 'cultural', src: '/assets/rangoli.jpeg', title: 'Rangoli Competition', description: 'Artistic Skills' },
    { id: 21, category: 'cultural', src: '/assets/mehandi.jpeg', title: 'Mehandi Competition', description: 'Artistic Designs' },
    { id: 22, category: 'cultural', src: '/assets/Mehandi 2025.jpeg', title: 'Mehandi 2025', description: 'Creative Patterns' },
    { id: 23, category: 'cultural', src: '/assets/independence_day.jpeg', title: 'Independence Day', description: 'Patriotic Celebration' },
    { id: 24, category: 'events', src: '/assets/tour_photo.jpeg', title: 'School Excursion', description: 'Learning Beyond Classroom' },
  ];

  const albums = [
    { id: 'farewell-album', title: 'Farewell 2025', description: 'Graduation ceremony', count: 24, cover: '/assets/farewell2.jpeg' },
    { id: 'prize-album', title: 'Prize Day 2025', description: 'Academic excellence', count: 32, cover: '/assets/prize4.jpeg' },
    { id: 'independence-album', title: 'Independence Day', description: 'Patriotic celebrations', count: 15, cover: '/assets/independence_day.jpeg' },
    { id: 'teacher-album', title: 'Teacher Recognition', description: 'Honoring our educators', count: 12, cover: '/assets/teachers1.jpeg' },
  ];

  const videos = [
    { id: 1, youtubeId: 'Yq_Edmb3hi8', title: 'Prize Distribution 2025', description: 'Highlights from our prize distribution event celebrating student achievements', date: 'July 15, 2025' },
    { id: 2, youtubeId: 'ZcQkTWSuDC0', title: 'Patriotic Drama', description: 'Student performance of a patriotic drama on Republic Day', date: 'January 26, 2025' },
    { id: 3, youtubeId: 'lNukl6lkgcg', title: 'Mehandi Competition', description: 'Creative showcase from our annual Mehandi competition', date: 'August 20, 2024' },
  ];

  const featuredEvents = [
    { id: 1, title: 'Annual Farewell 2025', description: 'An emotional farewell ceremony for our graduating students, celebrating their journey at SRIC with speeches, awards, and performances.', date: 'May 15, 2025', image: '/assets/farewell2.jpeg', albumId: 'farewell-album' },
    { id: 2, title: 'Prize Distribution 2025', description: 'Celebrating academic excellence and special achievements of our students with certificate distribution and honors.', date: 'April 10, 2025', image: '/assets/prize4.jpeg', albumId: 'prize-album' },
  ];

  const filteredItems = photoGalleryItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAlbumModal = (albumId) => {
    setSelectedAlbum(albumId);
    setIsAlbumModalOpen(true);
  };

  const closeAlbumModal = () => {
    setIsAlbumModalOpen(false);
    setSelectedAlbum(null);
  };

  const openImageModal = (item) => {
    setSelectedImage(item);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const getAlbumImages = (albumId) => {
    const albumMap = {
      'farewell-album': [
        { src: '/assets/farewell1.jpeg', title: 'Farewell 2025' },
        { src: '/assets/farewell2.jpeg', title: 'Farewell 2025' },
        { src: '/assets/farewell3.jpeg', title: 'Farewell 2025' },
        { src: '/assets/farewell4.jpeg', title: 'Farewell 2025' },
        { src: '/assets/farewell5.jpeg', title: 'Farewell 2025' },
        { src: '/assets/farewell6.jpeg', title: 'Farewell 2025' },
        { src: '/assets/farewell7.jpeg', title: 'Farewell 2025' },
        { src: '/assets/farewell8.jpeg', title: 'Farewell 2024' },
      ],
      'prize-album': [
        { src: '/assets/prize1.jpeg', title: 'Prize Day 2025' },
        { src: '/assets/prize3.jpeg', title: 'Prize Day 2025' },
        { src: '/assets/prize4.jpeg', title: 'Prize Day 2025' },
        { src: '/assets/prize5.jpeg', title: 'Prize Day 2025' },
        { src: '/assets/prize6.jpeg', title: 'Prize Day 2025' },
        { src: '/assets/prize7.jpeg', title: 'Prize Day 2025' },
        { src: '/assets/prize8.jpeg', title: 'Prize Day 2025' },
        { src: '/assets/prize9.jpeg', title: 'Prize Day 2025' },
      ],
      'independence-album': [
        { src: '/assets/independence_day.jpeg', title: 'Independence Day' },
      ],
      'teacher-album': [
        { src: '/assets/teachers1.jpeg', title: 'Teacher Recognition' },
      ],
    };
    return albumMap[albumId] || [];
  };

  const getAlbumTitle = (albumId) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.title : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                <Link to="/" className="text-gray-300 hover:text-white hover:underline transition duration-300">
                  Home
                </Link>
              </li>
              
              {/* About Us Dropdown */}
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  About Us <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/mission" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Mission</Link></li>
                  <li><Link to="/history" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">History</Link></li>
                  <li><Link to="/faculty" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Faculty</Link></li>
                </ul>
              </li>
              
              {/* Academics Dropdown */}
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  Academics <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Curriculum</Link></li>
                  <li><Link to="/programs" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Programs</Link></li>
                </ul>
              </li>

              {/* Admissions Dropdown */}
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  Admissions <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/process" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Process</Link></li>
                  <li><Link to="/fees" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Fees</Link></li>
                </ul>
              </li>

              {/* News & Events Dropdown */}
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center transition duration-300">
                  News & Events <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/calendar" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Calendar</Link></li>
                  <li><Link to="/announcements" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Announcements</Link></li>
                </ul>
              </li>

              {/* Gallery Dropdown */}
              <li className="relative group">
                <button className="text-white font-medium focus:outline-none flex items-center">
                  Gallery <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li><Link to="/photos-videos" className="block px-4 py-2 text-gray-800 bg-sricblue text-white">Photos/Videos</Link></li>
                </ul>
              </li>

              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white hover:underline transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Buttons Group */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Admin Button */}
              <Link 
                to="/admin-login" 
                className="px-4 py-2.5 bg-sricgold text-sricblue rounded-md font-bold flex items-center space-x-2 hover:bg-yellow-500 transition"
              >
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </Link>
              
              {/* CTA Button */}
              <Link 
                to="/adm" 
                className="bg-sricgold text-sricblue px-5 py-2.5 rounded-md font-bold hover:bg-yellow-500 transition transform hover:scale-105"
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
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-sricblue pb-4 px-4`}
          >
            <ul className="flex flex-col space-y-2">
              <li>
                <Link to="/" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              
              {/* About Us Mobile Dropdown */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
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
                  <li><Link to="/mission" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Mission</Link></li>
                  <li><Link to="/history" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>History</Link></li>
                  <li><Link to="/faculty" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Faculty</Link></li>
                </ul>
              </li>

              {/* Academics Mobile Dropdown */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('academics')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
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
                  <li><Link to="/curriculum" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Curriculum</Link></li>
                  <li><Link to="/programs" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Programs</Link></li>
                </ul>
              </li>

              {/* Admissions Mobile Dropdown */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('admissions')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
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
                  <li><Link to="/process" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Process</Link></li>
                  <li><Link to="/fees" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Fees</Link></li>
                </ul>
              </li>

              {/* News & Events Mobile Dropdown */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('news')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
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
                  <li><Link to="/calendar" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Calendar</Link></li>
                  <li><Link to="/announcements" className="block text-gray-400 hover:text-white py-1 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Announcements</Link></li>
                </ul>
              </li>

              {/* Gallery Mobile Dropdown */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleDropdown('gallery')}
                  className="dropdown-btn w-full text-left text-white py-2 flex justify-between items-center"
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
                  <li><Link to="/photos-videos" className="block text-white py-1 text-sm bg-sricblue" onClick={() => setIsMobileMenuOpen(false)}>Photos/Videos</Link></li>
                </ul>
              </li>

              <li>
                <Link to="/contact" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              
              {/* Mobile Admin Button */}
              <li>
                <Link 
                  to="/admin-login" 
                  className="block bg-sricgold text-sricblue px-4 py-2 rounded-md text-center font-bold mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-user-shield mr-2"></i>Admin Login
                </Link>
              </li>
              
              {/* Mobile Apply Now Button */}
              <li>
                <Link 
                  to="/admission-form" 
                  className="block bg-sricgold text-sricblue px-4 py-2 rounded-md text-center font-bold mt-2"
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
      <section className="bg-gradient-to-r from-sricblue to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">SRIC Memories Gallery</h1>
          <div className="w-24 h-1.5 bg-sricgold mx-auto mb-6 rounded-full"></div>
          <p className="text-xl max-w-3xl mx-auto">Relive the memorable moments, achievements, and celebrations that make SRIC special</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Featured Events Section */}
        <div className="bg-gradient-to-br from-sriclightblue/30 via-white to-sriclightblue/10 rounded-2xl p-8 mb-12 border border-sricblue/10 shadow-lg">
          <div className="event-header mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-10 bg-sricgold mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-sricblue">Featured Events</h2>
                <p className="text-gray-600">Highlights from our most memorable school events</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition duration-500 hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-8 bg-sricgold mr-3 rounded-full"></div>
                    <h3 className="text-xl font-bold text-sricblue">{event.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span><i className="far fa-calendar mr-1 text-sricblue"></i> {event.date}</span>
                    <button 
                      onClick={() => openAlbumModal(event.albumId)}
                      className="text-sricblue hover:text-blue-900 font-medium transition duration-300 flex items-center"
                    >
                      View More <i className="fas fa-arrow-right ml-1 text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gallery Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition duration-300 flex items-center ${
                  activeCategory === category.id
                    ? 'bg-sricblue text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Search Box */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search gallery by event name, date or keyword..."
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent shadow-sm pl-12"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Photo Gallery */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-sricblue">
              {activeCategory === 'all' ? 'All Photos' : `${categories.find(c => c.id === activeCategory)?.name} Photos`}
              <span className="ml-2 text-gray-500 text-lg">({filteredItems.length})</span>
            </h3>
            <p className="text-sm text-gray-500">Click any photo to view in full size</p>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-gray-400 text-6xl mb-4">
                <i className="fas fa-images"></i>
              </div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h4>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openImageModal(item)}
                  className="gallery-item group relative block h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sricblue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                      <i className="fas fa-image mr-1"></i> Photo
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-sricblue/90 text-white px-2 py-1 rounded-full text-xs capitalize">
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Photo Albums Section */}
        <div className="bg-gradient-to-br from-sriclightblue/30 via-white to-sriclightblue/10 rounded-2xl p-8 mb-12 border border-sricblue/10 shadow-lg">
          <div className="event-header mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-10 bg-sricgold mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-sricblue">Photo Albums</h2>
                <p className="text-gray-600">Browse our curated collections of memorable moments</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {albums.map((album, index) => (
              <div
                key={album.id}
                onClick={() => openAlbumModal(album.id)}
                className={`polaroid cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  index % 2 === 0 ? '-rotate-2' : 'rotate-2'
                }`}
              >
                <div className="relative overflow-hidden rounded-xl h-52 mb-4">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <h3 className="text-white font-bold">View Album</h3>
                  </div>
                </div>
                <div className="text-center px-2">
                  <h3 className="font-semibold text-sricblue">{album.title}</h3>
                  <p className="text-sm text-gray-600">{album.description}</p>
                  <div className="text-xs text-sricgold mt-1">
                    <i className="fas fa-images mr-1"></i> {album.count} photos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Video Gallery Section */}
        <div className="bg-gradient-to-br from-sriclightblue/30 via-white to-sriclightblue/10 rounded-2xl p-8 border border-sricblue/10 shadow-lg">
          <div className="event-header mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-10 bg-sricgold mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-sricblue">Featured Videos</h2>
                <p className="text-gray-600">Relive the excitement through our video collection</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="video-card bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                <div className="relative pt-[56.25%]">
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg md:text-xl mb-3 text-sricblue">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="far fa-calendar-alt mr-2 text-sricblue"></i>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
            >
              <i className="fab fa-youtube mr-3 text-xl"></i>
              Visit Our YouTube Channel
              <i className="fas fa-external-link-alt ml-2"></i>
            </a>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-sricgold transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Album Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-sricblue text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl md:text-3xl font-bold">
                {getAlbumTitle(selectedAlbum)} Album
              </h3>
              <button
                onClick={closeAlbumModal}
                className="text-white hover:text-sricgold text-3xl transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getAlbumImages(selectedAlbum).map((image, index) => (
                  <div 
                    key={index} 
                    onClick={() => openImageModal({ src: image.src, title: image.title, description: '' })}
                    className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-sm font-medium">View Image</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {getAlbumImages(selectedAlbum).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">
                    <i className="fas fa-images"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">Album under construction</h4>
                  <p className="text-gray-500">More photos coming soon!</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  <i className="fas fa-images mr-2"></i>
                  {getAlbumImages(selectedAlbum).length} photos in this album
                </div>
                <button
                  onClick={closeAlbumModal}
                  className="px-6 py-2 bg-sricblue text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Close Album
                </button>
              </div>
            </div>
          </div>
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
                <li><Link to="/history" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/curriculum" className="text-gray-400 hover:text-white">Academics</Link></li>
                <li><Link to="/admission-form" className="text-gray-400 hover:text-white">Admissions</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Gallery</h4>
              <ul className="space-y-2">
                <li><Link to="/photos-videos" className="text-gray-400 hover:text-white">Photos</Link></li>
                <li><Link to="/photos-videos" className="text-gray-400 hover:text-white">Videos</Link></li>
                <li><Link to="/photos-videos" className="text-gray-400 hover:text-white">Events</Link></li>
                <li><Link to="/photos-videos" className="text-gray-400 hover:text-white">Achievements</Link></li>
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
                  <span className="text-gray-400">info@sricschool.edu.in</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
            <p>© 2025-26 SRIC Senior Secondary School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PhotosVideos;