import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isDropdownActive = (paths) => paths.some(path => location.pathname === path);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

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

  const navLinks = [
    { label: 'Home', path: '/' },
  ];

  const dropdowns = [
    {
      label: 'About Us',
      id: 'about',
      paths: ['/mission', '/history', '/faculty'],
      items: [
        { label: 'Mission', path: '/mission' },
        { label: 'History', path: '/history' },
        { label: 'Faculty', path: '/faculty' },
      ],
    },
    {
      label: 'Academics',
      id: 'academics',
      paths: ['/curriculum', '/programs'],
      items: [
        { label: 'Curriculum', path: '/curriculum' },
        { label: 'Programs', path: '/programs' },
      ],
    },
    {
      label: 'Admissions',
      id: 'admissions',
      paths: ['/process', '/fees'],
      items: [
        { label: 'Process', path: '/process' },
        { label: 'Fees', path: '/fees' },
      ],
    },
    {
      label: 'News & Events',
      id: 'news',
      paths: ['/calendar', '/announcements'],
      items: [
        { label: 'Calendar', path: '/calendar' },
        { label: 'Announcements', path: '/announcements' },
      ],
    },
    {
      label: 'Gallery',
      id: 'gallery',
      paths: ['/photos-videos', '/testimonials', '/achievements'],
      items: [
        { label: 'Photos/Videos', path: '/photos-videos' },
        { label: 'Achievements', path: '/achievements' },
        { label: 'Testimonials', path: '/testimonials' },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md w-full">
      <nav className="bg-sricblue py-3 px-2 sm:px-3 xl:px-4 w-full">
        <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto gap-1 sm:gap-2">

          {/* Logo + School Name */}
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0">
            <img
              src="/assets/SRIC LOGO.PNG"
              alt="SRIC Logo"
              className="h-8 w-8 sm:h-9 sm:w-9 xl:h-12 xl:w-12 rounded-full flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <Link to="/" className="text-white text-xs sm:text-sm xl:text-xl font-bold whitespace-nowrap leading-tight truncate">
                SITARAM INTER COLLEGE
              </Link>
              <span className="text-sricgold text-[8px] sm:text-[9px] xl:text-xs italic tracking-wide whitespace-nowrap truncate">
                Empowering Minds, Shaping Futures
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-8 flex-shrink min-w-0">
            <li className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className={`nav-link font-semibold transition-all duration-300 text-sm xl:text-base whitespace-nowrap ${isActive('/') ? 'text-sricgold active' : 'text-gray-200 hover:text-sricgold'}`}
              >
                Home
              </Link>
            </li>

            {dropdowns.map((dropdown) => (
              <li key={dropdown.id} className="relative dropdown-group flex items-center py-2 flex-shrink-0">
                <button
                  className={`nav-link font-semibold focus:outline-none flex items-center gap-1 transition-all duration-300 text-sm xl:text-base whitespace-nowrap ${isDropdownActive(dropdown.paths) ? 'text-sricgold active' : 'text-gray-200 hover:text-sricgold'}`}
                >
                  <span>{dropdown.label}</span>
                  <svg className="w-3 h-3 dropdown-arrow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 top-full mt-0 w-44 xl:w-48 bg-white rounded-md shadow-xl py-2 border-t-4 border-sricgold z-50">
                  {dropdown.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`block px-4 py-2 hover:bg-slate-50 transition-colors text-sm ${isActive(item.path) ? 'text-sricblue font-bold bg-slate-50 border-l-4 border-sricgold -ml-1 pl-3' : 'text-gray-800 hover:text-sricblue'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <li className="flex items-center flex-shrink-0">
              <Link
                to="/contact"
                className={`nav-link font-semibold transition-all duration-300 text-sm xl:text-base whitespace-nowrap ${isActive('/contact') ? 'text-sricgold active' : 'text-gray-200 hover:text-sricgold'}`}
              >
                Contact
              </Link>
            </li>

          </ul>

          {/* Desktop Buttons Group */}
          <div className="hidden lg:flex flex-shrink-0 items-center gap-2 xl:gap-4 pl-4 xl:pl-6">
            <Link
              to="/admission-form"
              className="bg-sricgold text-sricblue px-3 xl:px-6 py-1.5 xl:py-2 rounded-md font-bold hover:bg-sricgold transition-all transform hover:scale-105 shadow-md flex items-center gap-1.5 text-sm whitespace-nowrap"
            >
              <span>Apply Now</span>
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            id="menu-toggle"
            onClick={toggleMobileMenu}
            className="lg:hidden text-white focus:outline-none flex-shrink-0 p-1"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'} bg-sriclightblue`}
        >
          <ul className="flex flex-col space-y-1 px-2 py-3">
            {/* Home */}
            <li>
              <Link
                to="/"
                className={`block py-3 px-4 rounded-md transition-colors font-medium ${isActive('/') ? 'bg-white/10 text-sricgold font-bold' : 'text-gray-200 hover:text-white hover:bg-sricblue'}`}
              >
                Home
              </Link>
            </li>

            {/* Dropdowns */}
            {dropdowns.map((dropdown) => (
              <li key={dropdown.id}>
                <button
                  onClick={() => toggleDropdown(dropdown.id)}
                  className="w-full text-left text-gray-200 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition font-medium"
                >
                  {dropdown.label}
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 flex-shrink-0 ${openDropdown === dropdown.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className={`overflow-hidden transition-all duration-300 ${openDropdown === dropdown.id ? 'max-h-48' : 'max-h-0'}`}>
                  {dropdown.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="block text-gray-300 hover:text-white py-2.5 pl-8 pr-4 rounded-md hover:bg-sricblue transition text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            {/* Contact */}
            <li>
              <Link
                to="/contact"
                className="block text-gray-200 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition font-medium"
              >
                Contact
              </Link>
            </li>


            {/* Mobile Apply Now Button */}
            <li>
              <Link
                to="/admission-form"
                className="block pulse-button bg-sricgold text-sricblue px-4 py-3 rounded-md text-center font-bold hover:bg-yellow-500 transition"
              >
                Apply Now
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
