// Calendar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    about: false,
    academics: false,
    news: true
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Academic calendar events data
  const academicEvents = {
    "2025-04-01": { title: "Session Begins", type: "school", color: "pink" },
    "2025-08-15": { title: "Independence Day", type: "holiday", color: "purple" },
    "2025-08-01": { title: "Monthly Tests Start", type: "exam", color: "green" },
    "2025-08-07": { title: "Monthly Tests End", type: "exam", color: "green" },
    "2025-10-03": { title: "Parent Meeting", type: "parent", color: "red" },
    "2025-10-03": { title: "Quarterly Exams Start", type: "exam", color: "green" },
    "2025-10-04": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2025-10-06": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2025-10-07": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2025-10-08": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2025-10-09": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2025-10-10": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2025-10-11": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2025-10-13": { title: "Quarterly Exams End", type: "exam", color: "green" },
    "2025-10-19": { title: "Diwali Break Starts", type: "holiday", color: "purple" },
    "2025-10-24": { title: "Diwali Break Ends", type: "holiday", color: "purple" },
    "2025-11-01": { title: "Half-Yearly Exams Start", type: "exam", color: "green" },
    "2025-11-07": { title: "Half-Yearly Exams End", type: "exam", color: "green" },
    "2026-01-10": { title: "Syllabus Completion", type: "school", color: "pink" },
    "2026-01-15": { title: "Pre-Board Exams Start", type: "exam", color: "green" },
    "2026-01-20": { title: "Pre-Board Exams End", type: "exam", color: "green" },
    "2026-01-21": { title: "Board Practicals Start", type: "exam", color: "green" },
    "2026-02-05": { title: "Board Practicals End", type: "exam", color: "green" },
    "2026-01-26": { title: "Republic Day", type: "holiday", color: "purple" },
    "2026-02-15": { title: "Board Exams Start", type: "exam", color: "green" },
    "2026-04-15": { title: "Board Exams End", type: "exam", color: "green" },
    "2026-04-30": { title: "Session Ends", type: "school", color: "pink" }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleMonthSelect = (e) => {
    const selectedMonth = parseInt(e.target.value);
    if (selectedMonth < 12) {
      setCurrentMonth(selectedMonth);
      setCurrentYear(2025);
    } else {
      setCurrentMonth(selectedMonth - 12);
      setCurrentYear(2026);
    }
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day bg-gray-100 p-2 min-h-[80px] md:min-h-[120px]"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const event = academicEvents[dateStr];
      const currentDate = new Date(currentYear, currentMonth, day);
      const isToday = currentDate.getTime() === today.getTime();
      
      let dayClass = "calendar-day p-2 min-h-[80px] md:min-h-[120px] border border-gray-200";
      
      if (event) {
        dayClass += " event-day";
      }
      
      if (isToday) {
        dayClass += " today bg-blue-50";
      }
      
      if (event && event.type === "holiday") {
        dayClass += " holiday";
      }
      
      if (event && event.type === "exam") {
        dayClass += " exam-day";
      }
      
      if (event && event.type === "parent") {
        dayClass += " parent-meeting";
      }

      days.push(
        <div key={day} className={dayClass}>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{day}</span>
            {event && <span className={`event-indicator bg-${event.color}-300`}></span>}
          </div>
          {event && (
            <div className={`mt-1 text-xs md:text-sm text-${event.color}-700 font-medium`}>
              {event.title}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Event cards data
  const upcomingEvents = [
    {
      id: 1,
      date: "01",
      month: "April",
      year: "2025",
      title: "Session Begins",
      description: "First day of academic session 2025-26 for all classes",
      time: "8:00 AM - 2:00 PM",
      borderColor: "border-sricblue",
      headerBg: "bg-sricblue"
    },
    {
      id: 2,
      date: "15",
      month: "August",
      year: "2025",
      title: "Independence Day",
      description: "Celebration and cultural program",
      time: "8:00 AM - 11:00 AM",
      borderColor: "border-sricgold",
      headerBg: "bg-sricgold"
    },
    {
      id: 3,
      date: "03-13",
      month: "October",
      year: "2025",
      title: "Quarterly Exams",
      description: "Quarterly examinations for all classes",
      time: "8:30 AM - 11:30 AM",
      borderColor: "border-green-500",
      headerBg: "bg-green-500"
    }
  ];

  // Academic year important dates
  const academicDates = [
    { event: "Session Begins", date: "01 April 2025", details: "First day of the academic session 2025-26" },
    { event: "Independence Day", date: "15 August 2025", details: "School holiday – Independence Day celebration" },
    { event: "Monthly Test Exams", date: "First Week of August 2025", details: "Monthly examinations for all classes" },
    { event: "त्रैमासिक परीक्षा / Quarterly Exams", date: "03-13 October 2025", details: "Quarterly examinations for all classes (UKG to 12th)", highlight: true },
    { event: "Diwali Break", date: "19 – 24 October 2025", details: "School closed for Diwali holidays" },
    { event: "Half-Yearly Exams", date: "Last Week of November 2025", details: "Half-yearly examinations for all classes" },
    { event: "Syllabus Completion", date: "First or Second Week of January 2026", details: "Syllabus completion for all classes" },
    { event: "Republic Day", date: "26 January 2026", details: "School holiday – Republic Day celebration" },
    { event: "Pre-Board Exams", date: "15 January 2026 Onwards", details: "Pre-board examinations for Classes 10 & 12" },
    { event: "Board Practicals", date: "21 January – 05 February 2026", details: "Board practical examinations for Classes 10 & 12" },
    { event: "Board Exams", date: "February 2026 Onwards", details: "UP Board examinations for Classes 10 & 12" },
    { event: "Session Ends", date: "30 April 2026", details: "Last day of the academic session 2025-26" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md">
        <nav className="bg-sricblue p-4">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo + School Name */}
            <div className="flex items-center space-x-2">
              <img src="assets/SRIC LOGO.PNG" alt="SRIC Logo" className="h-10 w-10 rounded-full" />
              <Link to="/" className="text-white text-xl font-bold">SITARAM INTER COLLEGE</Link>
              <span className="hidden sm:inline text-sricgold text-sm">Empowering Minds, Shaping Futures</span>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
              <li><Link to="/" className="text-gray-300 hover:text-white hover:underline">Home</Link></li>
              
              {/* About Us Dropdown */}
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
              
              {/* Academics Dropdown */}
              <li className="relative group">
                <button className="text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Academics <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <li><Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Curriculum</Link></li>
                  <li><Link to="/programs" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Programs</Link></li>
                </ul>
              </li>
              
              {/* News & Events Active */}
              <li className="relative group">
                <button className="text-white flex items-center">
                  News & Events <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li><Link to="/calendar" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white font-semibold">Calendar</Link></li>
                  <li><Link to="/announcements" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">Announcements</Link></li>
                </ul>
              </li>
              
              {/* Other Links */}
              <li><Link to="/contact" className="text-gray-300 hover:text-white hover:underline">Contact</Link></li>
            </ul>

            {/* CTA Button (Desktop) */}
            <Link to="/admission-form" className="hidden md:block bg-sricgold text-sricblue px-4 py-2 rounded-md font-semibold hover:bg-yellow-600 transition">Apply Now</Link>

            {/* Mobile Hamburger Menu */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-white focus:outline-none" 
              aria-expanded={mobileMenuOpen} 
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-sricblue pb-4 px-4 transition-all duration-300`}>
            <ul className="flex flex-col space-y-2">
              <li><Link to="/" className="block text-gray-300 hover:text-white py-2">Home</Link></li>
              
              {/* About Us Dropdown */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleMobileDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
                >
                  About Us <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${mobileDropdowns.about ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${mobileDropdowns.about ? 'max-h-32' : 'max-h-0'}`}>
                  <Link to="/mission" className="block text-gray-400 hover:text-white py-1 text-sm">Mission</Link>
                  <Link to="/history" className="block text-gray-400 hover:text-white py-1 text-sm">History</Link>
                  <Link to="/faculty" className="block text-gray-400 hover:text-white py-1 text-sm">Faculty</Link>
                </div>
              </li>
              
              {/* Academics Dropdown */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleMobileDropdown('academics')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-2 flex justify-between items-center"
                >
                  Academics <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${mobileDropdowns.academics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${mobileDropdowns.academics ? 'max-h-32' : 'max-h-0'}`}>
                  <Link to="/curriculum" className="block text-gray-400 hover:text-white py-1 text-sm">Curriculum</Link>
                  <Link to="/programs" className="block text-gray-400 hover:text-white py-1 text-sm">Programs</Link>
                </div>
              </li>
              
              {/* News & Events Active */}
              <li className="dropdown-container">
                <button 
                  onClick={() => toggleMobileDropdown('news')}
                  className="dropdown-btn w-full text-left text-white py-2 flex justify-between items-center"
                >
                  News & Events <svg className={`dropdown-icon w-4 h-4 transform transition-transform ${mobileDropdowns.news ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${mobileDropdowns.news ? 'max-h-32' : 'max-h-0'}`}>
                  <Link to="/calendar" className="block text-white py-1 text-sm font-medium">Calendar</Link>
                  <Link to="/announcements" className="block text-gray-400 hover:text-white py-1 text-sm">Announcements</Link>
                </div>
              </li>
              
              <li><Link to="/contact" className="block text-gray-300 hover:text-white py-2">Contact</Link></li>
              <li><Link to="/admission-form" className="block bg-sricgold text-sricblue px-4 py-2 rounded-md text-center font-semibold mt-2">Apply Now</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Page Header with Decorative Elements */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-sricgold opacity-20"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-sricblue opacity-20"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-sricblue mb-4 relative z-10">Academic Calendar 2025-26</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-sricblue to-sricgold mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto relative z-10">Stay updated with all important dates, events, and academic schedules</p>
        </div>
        
        {/* Special Notice Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-6 mb-8 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-yellow-500 text-2xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">त्रैमासिक परीक्षा समय सारणी / Quarterly Examination Schedule</h3>
              <div className="text-gray-700">
                <p className="mb-4 font-semibold">विशेष सूचना / Special Notice:</p>
                <p className="mb-2">कक्षा 9 से 12 तक के सभी छात्र/छात्राओं को सूचित किया जाता है कि:</p>
                <p className="mb-2">All students from classes 9 to 12 are informed that:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>सभी विद्यार्थी दिनांक 03-10-2025, शुक्रवार को अपने अभिभावकों के साथ विद्यालय में प्रातः 8 बजे उपस्थित हों।</li>
                  <li>All students must be present at school with their parents/guardians on Friday, 03-10-2025 at 8:00 AM.</li>
                  <li>उस दिन परीक्षा भी संचालित होगी; जिस विषय की परीक्षा है, वही परीक्षा आयोजित की जाएगी।</li>
                  <li>Exams will also be conducted on that day; the scheduled exam for that day will take place.</li>
                  <li>प्रत्येक विद्यार्थी के लिए यह अनिवार्य है कि वे अपने अभिभावक (माता/पिता/बड़े भाई/बहन) को शुक्रवार को विद्यालय में लाएं।</li>
                  <li>It is mandatory for every student to bring their parent/guardian to school on Friday.</li>
                </ul>
                <p className="mt-3 font-semibold">धन्यवाद। / Thank you.</p>
                <p className="mt-2">आज्ञानुसार, / Sincerely,</p>
                <p className="font-bold">प्रधानाचार्य / Principal</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exam Schedule Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-sricblue to-blue-800 text-white p-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center">
              <i className="fas fa-calendar-alt mr-3"></i>
              त्रैमासिक परीक्षा समय सारणी (Quarterly Examination Schedule)
            </h2>
            <p className="mt-2 opacity-90">October 2025 | Time: 8:30 AM - 11:30 AM</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="exam-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>UKG to 1st</th>
                    <th>2nd to 5th</th>
                    <th>6th to 8th</th>
                    <th>9th to 10th</th>
                    <th>11th to 12th</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="parent-meeting">
                    <td className="font-semibold">03-10-2025</td>
                    <td>Friday</td>
                    <td colSpan="5" className="text-center font-semibold">
                      <i className="fas fa-users mr-2 text-green-600"></i>
                      Parent Meeting - All students must attend with parents at 8:00 AM
                    </td>
                  </tr>

                  <tr>
                    <td>03-10-2025</td>
                    <td>Friday</td>
                    <td><span className="class-badge ukg">हिन्दी मौखिक</span></td>
                    <td><span className="class-badge primary">अंग्रेजी</span></td>
                    <td><span className="class-badge middle">गणित</span></td>
                    <td><span className="class-badge secondary">विज्ञान प्रयोगात्मक</span></td>
                    <td><span className="class-badge senior">भूगोल + भौतिक विज्ञान (प्रयोगात्मक)</span></td>
                  </tr>

                  <tr>
                    <td>04-10-2025</td>
                    <td>Saturday</td>
                    <td><span className="class-badge ukg">अवकाश (Holiday)</span></td>
                    <td><span className="class-badge primary">संस्कृत/उर्दू</span></td>
                    <td><span className="class-badge middle">चित्रकला</span></td>
                    <td><span className="class-badge secondary">विज्ञान</span></td>
                    <td><span className="class-badge senior">भौतिक विज्ञान + भूगोल</span></td>
                  </tr>

                  <tr>
                    <td>06-10-2025</td>
                    <td>Monday</td>
                    <td><span className="class-badge ukg">हिन्दी लिखित</span></td>
                    <td><span className="class-badge primary">चित्रकला</span></td>
                    <td><span className="class-badge middle">हिन्दी</span></td>
                    <td><span className="class-badge secondary">सामाजिक विज्ञान प्रयोगात्मक</span></td>
                    <td><span className="class-badge senior">रसायन + गृह विज्ञान (प्रयोगात्मक)</span></td>
                  </tr>

                  <tr>
                    <td>07-10-2025</td>
                    <td>Tuesday</td>
                    <td><span className="class-badge ukg">अवकाश (Holiday)</span></td>
                    <td><span className="class-badge primary">गणित</span></td>
                    <td><span className="class-badge middle">विज्ञान</span></td>
                    <td><span className="class-badge secondary">सामाजिक विज्ञान</span></td>
                    <td><span className="class-badge senior">रसायन + गृह विज्ञान + समाज.</span></td>
                  </tr>

                  <tr>
                    <td>08-10-2025</td>
                    <td>Wednesday</td>
                    <td><span className="class-badge ukg">अंग्रेजी मौखिक</span></td>
                    <td><span className="class-badge primary">नैतिक शिक्षा/सामान्य ज्ञान</span></td>
                    <td><span className="class-badge middle">कृषि विज्ञान/गृह विज्ञान</span></td>
                    <td><span className="class-badge secondary">चित्रकला</span></td>
                    <td><span className="class-badge senior">हिन्दी</span></td>
                  </tr>

                  <tr>
                    <td>09-10-2025</td>
                    <td>Thursday</td>
                    <td><span className="class-badge ukg">अंग्रेजी लिखित</span></td>
                    <td><span className="class-badge primary">हिन्दी</span></td>
                    <td><span className="class-badge middle">सामाजिक विज्ञान</span></td>
                    <td><span className="class-badge secondary">हिन्दी</span></td>
                    <td><span className="class-badge senior">जीव विज्ञान प्रयोगात्मक</span></td>
                  </tr>

                  <tr>
                    <td>10-10-2025</td>
                    <td>Friday</td>
                    <td><span className="class-badge ukg">गणित मौखिक</span></td>
                    <td><span className="class-badge primary">सामाजिक अध्ययन</span></td>
                    <td><span className="class-badge middle">संस्कृत/उर्दू</span></td>
                    <td><span className="class-badge secondary">अंग्रेजी</span></td>
                    <td><span className="class-badge senior">जीव विज्ञान + चित्रकला</span></td>
                  </tr>

                  <tr>
                    <td>11-10-2025</td>
                    <td>Saturday</td>
                    <td><span className="class-badge ukg">गणित लिखित</span></td>
                    <td><span className="class-badge primary">विज्ञान</span></td>
                    <td><span className="class-badge middle">पी.टी.</span></td>
                    <td><span className="class-badge secondary">गणित + गृहवि. प्रयोगात्मक</span></td>
                    <td><span className="class-badge senior">अंग्रेजी</span></td>
                  </tr>

                  <tr>
                    <td>13-10-2025</td>
                    <td>Monday</td>
                    <td><span className="class-badge ukg">पी.टी.</span></td>
                    <td><span className="class-badge primary">पी.टी.</span></td>
                    <td><span className="class-badge middle">अंग्रेजी</span></td>
                    <td><span className="class-badge secondary">गृह विज्ञान + गणित</span></td>
                    <td><span className="class-badge senior">गणित</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a 
                href="assets/त्रैमासिक परीक्षा समय सारणी.pdf" 
                className="inline-flex items-center justify-center bg-sricblue hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                <i className="fas fa-download mr-2"></i>
                Download Datesheet (PDF)
              </a>
              <a 
                href="#year-calendar" 
                className="inline-flex items-center justify-center bg-sricgold hover:bg-yellow-600 text-sricblue font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                <i className="fas fa-calendar mr-2"></i>
                View Full Calendar
              </a>
            </div>
          </div>
        </div>
        
        {/* Year Navigation */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-sricblue">2025-2026 Academic Year</h2>
          <div className="flex items-center gap-4">
            <Link to="/calendar" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition">2024-25</Link>
            <span className="px-4 py-2 bg-sricblue text-white rounded-lg font-medium">2025-26</span>
          </div>
        </div>
        
        {/* Calendar Navigation with Month Selector */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <h3 className="text-xl font-bold text-sricblue">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              <button 
                onClick={goToToday}
                className="px-4 py-2 bg-sricblue text-white rounded-lg hover:bg-blue-900 transition"
              >
                Today
              </button>
            </div>
            
            <div className="relative">
              <select 
                value={currentMonth + (currentYear === 2026 ? 12 : 0)}
                onChange={handleMonthSelect}
                className="appearance-none bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent"
              >
                <option value="0">January 2025</option>
                <option value="1">February 2025</option>
                <option value="2">March 2025</option>
                <option value="3">April 2025</option>
                <option value="4">May 2025</option>
                <option value="5">June 2025</option>
                <option value="6">July 2025</option>
                <option value="7">August 2025</option>
                <option value="8">September 2025</option>
                <option value="9">October 2025</option>
                <option value="10">November 2025</option>
                <option value="11">December 2025</option>
                <option value="12">January 2026</option>
                <option value="13">February 2026</option>
                <option value="14">March 2026</option>
                <option value="15">April 2026</option>
                <option value="16">May 2026</option>
                <option value="17">June 2026</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12 fade-in">
          <div className="calendar-grid">
            <div className="bg-sricblue text-white p-2 text-center font-semibold">Sun</div>
            <div className="bg-sricblue text-white p-2 text-center font-semibold">Mon</div>
            <div className="bg-sricblue text-white p-2 text-center font-semibold">Tue</div>
            <div className="bg-sricblue text-white p-2 text-center font-semibold">Wed</div>
            <div className="bg-sricblue text-white p-2 text-center font-semibold">Thu</div>
            <div className="bg-sricblue text-white p-2 text-center font-semibold">Fri</div>
            <div className="bg-sricblue text-white p-2 text-center font-semibold">Sat</div>
            {generateCalendar()}
          </div>
          
          <div className="p-4 bg-gray-50 flex justify-between items-center">
            <button 
              onClick={() => navigateMonth('prev')}
              className="px-4 py-2 bg-sricblue text-white rounded-lg hover:bg-blue-900 transition"
            >
              Previous Month
            </button>
            <button 
              onClick={() => navigateMonth('next')}
              className="px-4 py-2 bg-sricblue text-white rounded-lg hover:bg-blue-900 transition"
            >
              Next Month
            </button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-12">
          <h3 className="text-lg font-bold text-sricblue mb-3">Calendar Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300 mr-2"></div>
              <span className="text-sm">Staff Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-300 mr-2"></div>
              <span className="text-sm">Admissions</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
              <span className="text-sm">Parent Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
              <span className="text-sm">Examinations</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-100 border border-purple-300 mr-2"></div>
              <span className="text-sm">Holidays</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-pink-100 border border-pink-300 mr-2"></div>
              <span className="text-sm">School Events</span>
            </div>
          </div>
        </div>
        
        {/* Upcoming Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-sricblue mb-6">Upcoming Events</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-card bg-white rounded-lg shadow-md overflow-hidden transition duration-300 border-l-4 ${event.borderColor}`}
              >
                <div className={`${event.headerBg} text-white p-4`}>
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">{event.date}</div>
                    <div className="text-right">
                      <div className="font-semibold">{event.month}</div>
                      <div className="text-sm">{event.year}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="far fa-clock mr-2"></i>
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Academic Year Calendar */}
        <div id="year-calendar">
          <h2 className="text-2xl font-bold text-sricblue mb-6">Academic Year 2025-26 Important Dates</h2>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 academic-table">
                <thead className="bg-gradient-to-r from-sricblue to-blue-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {academicDates.map((item, index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${item.highlight ? 'exam-highlight' : ''}`}>
                        {item.event}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4">{item.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

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
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Academics</a></li>
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
                  <span className="text-gray-400">info@sricschool.edu.in</span>
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

export default Calendar;