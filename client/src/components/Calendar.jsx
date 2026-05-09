import { useState, useEffect } from 'react';
import { apiUrl } from './lib/config';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeExamSchedule, setActiveExamSchedule] = useState('quarterly'); // 'quarterly' or 'halfyearly'
  const [dynamicSchedules, setDynamicSchedules] = useState([]);

  useEffect(() => {
    fetch(apiUrl('/api/examschedules'))
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          
          const activeSchedules = d.data.filter(schedule => {
            if (schedule.status === 'Completed') return false;
            
            if (schedule.dates && schedule.dates.length > 0) {
              const hasUpcomingDate = schedule.dates.some(dt => {
                const examDate = new Date(dt.date);
                examDate.setHours(0,0,0,0);
                return examDate >= now;
              });
              return hasUpcomingDate;
            }
            return true;
          });

          setDynamicSchedules(activeSchedules);
          // Auto-select the first dynamic schedule
          if (activeSchedules.length > 0) {
            setActiveExamSchedule(activeSchedules[0]._id);
          }
        }
      })
      .catch(e => console.error("Could not fetch schedules", e));
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Academic calendar events data - UPDATED WITH HALF YEARLY DATES
  const academicEvents = {
    "2026-04-01": { title: "Session Begins", type: "school", color: "pink" },
    "2026-08-15": { title: "Independence Day", type: "holiday", color: "purple" },
    "2026-08-01": { title: "Monthly Tests Start", type: "exam", color: "green" },
    "2026-08-07": { title: "Monthly Tests End", type: "exam", color: "green" },
    "2026-10-02": { title: "Parent Meeting", type: "parent", color: "red" },
    "2026-10-03": { title: "Quarterly Exams Start", type: "exam", color: "green" },
    "2026-10-04": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2026-10-06": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2026-10-07": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2026-10-08": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2026-10-09": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2026-10-10": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2026-10-11": { title: "Quarterly Exams", type: "exam", color: "green" },
    "2026-10-13": { title: "Quarterly Exams End", type: "exam", color: "green" },
    "2026-10-19": { title: "Diwali Break Starts", type: "holiday", color: "purple" },
    "2026-10-24": { title: "Diwali Break Ends", type: "holiday", color: "purple" },
    "2026-11-01": { title: "Half-Yearly Exams Start", type: "exam", color: "green" },
    "2026-11-07": { title: "Half-Yearly Exams End", type: "exam", color: "green" },
    // HALF YEARLY EXAM DATES ADDED
    "2026-12-11": { title: "Half-Yearly: Hindi/Math/Practical", type: "exam", color: "green" },
    "2026-12-12": { title: "Half-Yearly: Hindi/Math/Science/Physics", type: "exam", color: "green" },
    "2026-12-13": { title: "Half-Yearly: Hindi/English/Practical", type: "exam", color: "green" },
    "2026-12-15": { title: "Half-Yearly: English/Drawing/SST", type: "exam", color: "green" },
    "2026-12-16": { title: "Half-Yearly: Drawing/SST/Chemistry", type: "exam", color: "green" },
    "2026-12-17": { title: "Half-Yearly: English/Hindi/Practical", type: "exam", color: "green" },
    "2026-12-18": { title: "Half-Yearly: Math/Urdu/Hindi", type: "exam", color: "green" },
    "2026-12-19": { title: "Half-Yearly: Science/Practical", type: "exam", color: "green" },
    "2026-12-20": { title: "Half-Yearly: Math/SST/Agriculture/English", type: "exam", color: "green" },
    "2026-12-22": { title: "Half-Yearly: PT/Science/Practical", type: "exam", color: "green" },
    "2026-12-23": { title: "Half-Yearly: PT/Hindi/Math", type: "exam", color: "green" },
    "2026-12-24": { title: "Half-Yearly: Urdu/Sanskrit/PT/Drawing", type: "exam", color: "green" },
    "2026-12-26": { title: "Half-Yearly: Sports/Drawing/English", type: "exam", color: "green" },
    "2027-01-10": { title: "Syllabus Completion", type: "school", color: "pink" },
    "2027-01-15": { title: "Pre-Board Exams Start", type: "exam", color: "green" },
    "2027-01-20": { title: "Pre-Board Exams End", type: "exam", color: "green" },
    "2027-01-21": { title: "Board Practicals Start", type: "exam", color: "green" },
    "2027-02-05": { title: "Board Practicals End", type: "exam", color: "green" },
    "2027-01-26": { title: "Republic Day", type: "holiday", color: "purple" },
    "2027-02-15": { title: "Board Exams Start", type: "exam", color: "green" },
    "2027-04-15": { title: "Board Exams End", type: "exam", color: "green" },
    "2027-04-30": { title: "Session Ends", type: "school", color: "pink" }
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
      setCurrentYear(2026);
    } else {
      setCurrentMonth(selectedMonth - 12);
      setCurrentYear(2027);
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
        <div key={`empty-${i}`} className="calendar-day bg-gray-50 p-1 md:p-2 min-h-[60px] md:min-h-[140px] transition-all duration-300 hover:bg-gray-100"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const event = academicEvents[dateStr];
      const currentDate = new Date(currentYear, currentMonth, day);
      const isToday = currentDate.getTime() === today.getTime();
      
      let dayClass = "calendar-day p-1 md:p-3 min-h-[60px] md:min-h-[140px] border border-gray-200 transition-all duration-300 hover:bg-gray-50 relative";
      
      if (event) {
        dayClass += " event-day";
      }
      
      if (isToday) {
        dayClass += " today bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300";
      }
      
      if (event && event.type === "holiday") {
        dayClass += " holiday bg-gradient-to-br from-purple-50 to-purple-100";
      }
      
      if (event && event.type === "exam") {
        dayClass += " exam-day bg-gradient-to-br from-green-50 to-green-100";
      }
      
      if (event && event.type === "parent") {
        dayClass += " parent-meeting bg-gradient-to-br from-red-50 to-red-100";
      }

      days.push(
        <div key={day} className={dayClass}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm md:text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
              {day}
              {isToday && <span className="ml-1 text-[8px] md:text-xs bg-blue-500 text-white px-1 md:px-2 py-0.5 md:py-1 rounded-full uppercase">Today</span>}
            </span>
            {event && (
              <span 
                className={`event-indicator w-3 h-3 rounded-full bg-${event.color}-500 shadow-sm`}
                title={event.type}
              ></span>
            )}
          </div>
          {event && (
            <div className={`mt-1 md:mt-2 p-1 md:p-2 rounded md:rounded-lg bg-white shadow-sm border-l-2 md:border-l-4 border-${event.color}-500`}>
              <div className={`text-[8px] md:text-sm font-semibold text-${event.color}-700 line-clamp-2 md:line-clamp-none`}>
                {event.title}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Event cards data - UPDATED WITH HALF YEARLY
  const upcomingEvents = [
    {
      id: 1,
      date: "03-13",
      month: "October",
      year: "2026",
      title: "Quarterly Exams",
      description: "Quarterly examinations for all classes (UKG to 12th)",
      time: "8:30 AM - 11:30 AM",
      borderColor: "border-green-500",
      headerBg: "bg-gradient-to-r from-green-500 to-green-600",
      type: "exam"
    },
    {
      id: 2,
      date: "19-24",
      month: "October",
      year: "2026",
      title: "Diwali Break",
      description: "School closed for Diwali holidays",
      time: "Full Day",
      borderColor: "border-purple-500",
      headerBg: "bg-gradient-to-r from-purple-500 to-purple-600",
      type: "holiday"
    },
    {
      id: 3,
      date: "11-26",
      month: "December",
      year: "2026",
      title: "Half-Yearly Exams",
      description: "Half-yearly examinations for all classes",
      time: "8:30 AM - 11:30 AM",
      borderColor: "border-orange-500",
      headerBg: "bg-gradient-to-r from-orange-500 to-orange-600",
      type: "exam"
    }
  ];

  // Academic year important dates - UPDATED
  const academicDates = [
    { event: "Session Begins", date: "01 April 2026", details: "First day of the academic session 2026-26" },
    { event: "Independence Day", date: "15 August 2026", details: "School holiday – Independence Day celebration" },
    { event: "Monthly Test Exams", date: "First Week of August 2026", details: "Monthly examinations for all classes" },
    { event: "त्रैमासिक परीक्षा / Quarterly Exams", date: "03-13 October 2026", details: "Quarterly examinations for all classes (UKG to 12th)", highlight: true },
    { event: "Diwali Break", date: "19 – 24 October 2026", details: "School closed for Diwali holidays" },
    { event: "अर्धवार्षिक परीक्षा / Half-Yearly Exams", date: "11 – 26 December 2026", details: "Half-yearly examinations for all classes", highlight: true },
    { event: "Syllabus Completion", date: "First or Second Week of January 2027", details: "Syllabus completion for all classes" },
    { event: "Republic Day", date: "26 January 2027", details: "School holiday – Republic Day celebration" },
    { event: "Pre-Board Exams", date: "15 January 2027 Onwards", details: "Pre-board examinations for Classes 10 & 12" },
    { event: "Board Practicals", date: "21 January – 05 February 2027", details: "Board practical examinations for Classes 10 & 12" },
    { event: "Board Exams", date: "February 2027 Onwards", details: "UP Board examinations for Classes 10 & 12" },
    { event: "Session Ends", date: "30 April 2027", details: "Last day of the academic session 2026-26" }
  ];

  // Half Yearly Exam Schedule Data
  const halfYearlyExamSchedule = [
    { date: "11-12-26", day: "Thursday", ukg_1_2: "Holiday", class_3_5: "Hindi", class_6_8: "Math", class_9_10: "Practical Papers: Science", class_11_12: "Practical Papers: Physics, Geography" },
    { date: "12-12-26", day: "Friday", ukg_1_2: "Hindi, Moral", class_3_5: "Math", class_6_8: "Holiday", class_9_10: "Science", class_11_12: "Physics, Geography" },
    { date: "13-12-26", day: "Saturday", ukg_1_2: "Hindi", class_3_5: "Moral Education", class_6_8: "English", class_9_10: "Practical, SST", class_11_12: "Practical, Chemistry, Home Science" },
    { date: "14-12-26", day: "Sunday", ukg_1_2: "Holiday", class_3_5: "Holiday", class_6_8: "Holiday", class_9_10: "Holiday", class_11_12: "Holiday", isHoliday: true },
    { date: "15-12-26", day: "Monday", ukg_1_2: "English (oral)", class_3_5: "Holiday", class_6_8: "Drawing", class_9_10: "SST", class_11_12: "Holiday" },
    { date: "16-12-26", day: "Tuesday", ukg_1_2: "Holiday", class_3_5: "Drawing", class_6_8: "SST", class_9_10: "Holiday", class_11_12: "Chemistry/Home Science" },
    { date: "17-12-26", day: "Wednesday", ukg_1_2: "English", class_3_5: "English", class_6_8: "Hindi", class_9_10: "Practical: Math/Home Science", class_11_12: "Practical: Biology" },
    { date: "18-12-26", day: "Thursday", ukg_1_2: "Math (Oral)", class_3_5: "Holiday", class_6_8: "Urdu/Sanskrit", class_9_10: "Math, Home Sc.", class_11_12: "Hindi" },
    { date: "19-12-26", day: "Friday", ukg_1_2: "Holiday", class_3_5: "Science", class_6_8: "Holiday", class_9_10: "Practical: English", class_11_12: "Drawing" },
    { date: "20-12-26", day: "Saturday", ukg_1_2: "Math", class_3_5: "SST", class_6_8: "Agriculture/ Home Sc.", class_9_10: "English", class_11_12: "Biology" },
    { date: "21-12-26", day: "Sunday", ukg_1_2: "Holiday", class_3_5: "Holiday", class_6_8: "Holiday", class_9_10: "Holiday", class_11_12: "Holiday", isHoliday: true },
    { date: "22-12-26", day: "Monday", ukg_1_2: "Holiday", class_3_5: "PT", class_6_8: "Science", class_9_10: "Practical: Hindi", class_11_12: "Holiday" },
    { date: "23-12-26", day: "Tuesday", ukg_1_2: "P.T", class_3_5: "Holiday", class_6_8: "Holiday", class_9_10: "Hindi", class_11_12: "Math" },
    { date: "24-12-26", day: "Wednesday", ukg_1_2: "Holiday", class_3_5: "Urdu, Sanskrit", class_6_8: "P.T.", class_9_10: "Drawing", class_11_12: "Holiday" },
    { date: "25-12-26", day: "Thursday", ukg_1_2: "Holiday", class_3_5: "Holiday", class_6_8: "Holiday", class_9_10: "Holiday", class_11_12: "Holiday", isHoliday: true },
    { date: "26-12-26", day: "Friday", ukg_1_2: "Holiday", class_3_5: "Holiday", class_6_8: "Sports and Edu.", class_9_10: "Drawing, English", class_11_12: "Drawing, English" }
  ];

  // Quarterly Exam Schedule Data
  const quarterlyExamSchedule = [
    { date: "03-10-2026", day: "Friday", ukg_1_2: "हिन्दी मौखिक", class_3_5: "अंग्रेजी", class_6_8: "गणित", class_9_10: "विज्ञान प्रयोगात्मक", class_11_12: "भूगोल + भौतिक विज्ञान (प्रयोगात्मक)", isSpecial: true },
    { date: "04-10-2026", day: "Saturday", ukg_1_2: "अवकाश (Holiday)", class_3_5: "संस्कृत/उर्दू", class_6_8: "चित्रकला", class_9_10: "विज्ञान", class_11_12: "भौतिक विज्ञान + भूगोल" },
    { date: "06-10-2026", day: "Monday", ukg_1_2: "हिन्दी लिखित", class_3_5: "चित्रकला", class_6_8: "हिन्दी", class_9_10: "सामाजिक विज्ञान प्रयोगात्मक", class_11_12: "रसायन + गृह विज्ञान (प्रयोगात्मक)" },
    { date: "07-10-2026", day: "Tuesday", ukg_1_2: "अवकाश (Holiday)", class_3_5: "गणित", class_6_8: "विज्ञान", class_9_10: "सामाजिक विज्ञान", class_11_12: "रसायन + गृह विज्ञान + समाज." },
    { date: "08-10-2026", day: "Wednesday", ukg_1_2: "अंग्रेजी मौखिक", class_3_5: "नैतिक शिक्षा/सामान्य ज्ञान", class_6_8: "कृषि विज्ञान/गृह विज्ञान", class_9_10: "चित्रकला", class_11_12: "हिन्दी" },
    { date: "09-10-2026", day: "Thursday", ukg_1_2: "अंग्रेजी लिखित", class_3_5: "हिन्दी", class_6_8: "सामाजिक विज्ञान", class_9_10: "हिन्दी", class_11_12: "जीव विज्ञान प्रयोगात्मक" },
    { date: "10-10-2026", day: "Friday", ukg_1_2: "गणित मौखिक", class_3_5: "सामाजिक अध्ययन", class_6_8: "संस्कृत/उर्दू", class_9_10: "अंग्रेजी", class_11_12: "जीव विज्ञान + चित्रकला" },
    { date: "11-10-2026", day: "Saturday", ukg_1_2: "गणित लिखित", class_3_5: "विज्ञान", class_6_8: "पी.टी.", class_9_10: "गणित + गृहवि. प्रयोगात्मक", class_11_12: "अंग्रेजी" },
    { date: "13-10-2026", day: "Monday", ukg_1_2: "पी.टी.", class_3_5: "पी.टी.", class_6_8: "अंग्रेजी", class_9_10: "गृह विज्ञान + गणित", class_11_12: "गणित" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header with Decorative Elements */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-r from-sricgold to-yellow-400 opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-r from-sricblue to-blue-600 opacity-20 animate-pulse"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-sricblue mb-4 relative z-10 bg-clip-text bg-gradient-to-r from-sricblue to-blue-600">Academic Calendar 2026-27</h1>
          <div className="w-32 h-2 bg-gradient-to-r from-sricblue via-sricgold to-sricblue mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto relative z-10">Stay updated with all important dates, events, and academic schedules</p>
          
          {/* Exam Schedule Toggle */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {dynamicSchedules.length > 0 ? (
              dynamicSchedules.map((schedule) => (
                <button
                  key={schedule._id}
                  onClick={() => setActiveExamSchedule(schedule._id)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${activeExamSchedule === schedule._id ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <i className="fas fa-calendar-alt mr-2"></i>
                  {schedule.title}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => setActiveExamSchedule('quarterly')}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${activeExamSchedule === 'quarterly' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Quarterly Exams
                </button>
                <button
                  onClick={() => setActiveExamSchedule('halfyearly')}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${activeExamSchedule === 'halfyearly' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  <i className="fas fa-calendar-star mr-2"></i>
                  Half-Yearly Exams
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dynamic / Special Notice Section */}
        {(() => {
          const activeDynSchedule = dynamicSchedules.find(s => s._id === activeExamSchedule);

          if (activeDynSchedule) {
            return (
              <>
                {activeDynSchedule.noticeText && (
                  <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-50 border-l-4 border-blue-500 p-6 mb-8 rounded-xl shadow-lg transform hover:scale-[1.005] transition-transform">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-500 p-3 rounded-full">
                        <i className="fas fa-bullhorn text-white text-2xl"></i>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{activeDynSchedule.title} - Special Notice</h3>
                        <div className="text-gray-700 text-lg whitespace-pre-line">
                          {activeDynSchedule.noticeText}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Exam Schedule Section */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12 border border-gray-200 transform hover:shadow-2xl transition-all duration-300">
                  <div className="p-6 text-white bg-gradient-to-r from-blue-500 to-indigo-600">
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center">
                      <i className="fas fa-calendar-alt mr-3"></i>
                      {activeDynSchedule.title} Schedule
                    </h2>
                    <p className="mt-2 opacity-90">
                      {activeDynSchedule.academicYear} | Exam Status: {activeDynSchedule.status}
                    </p>
                  </div>
                  
                  <div className="p-6">
                    {activeDynSchedule.dates && activeDynSchedule.dates.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">Date</th>
                              <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">Subject</th>
                              <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">Classes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeDynSchedule.dates.map((dt, index) => {
                              const d = new Date(dt.date);
                              return (
                                <tr key={index} className="hover:bg-gray-50 transition border-b">
                                  <td className="py-3 px-4 font-semibold">{d.toLocaleDateString()}</td>
                                  <td className="py-3 px-4">
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                                      {dt.subject}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">{dt.classes}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500 italic">No exact subject dates listed. Please refer to the downloaded PDF datesheet.</div>
                    )}
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      {activeDynSchedule.pdfUrl && (
                        <a 
                          href={activeDynSchedule.pdfUrl}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center bg-gradient-to-r from-sricblue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
                        >
                          <i className="fas fa-download mr-2"></i>
                          Download Datesheet (PDF)
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          }

          // Fallback static hardcoded JSX block
          return (
            <>
              {/* Special Notice Section */}
              <div className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50 border-l-4 border-yellow-500 p-6 mb-8 rounded-xl shadow-lg transform hover:scale-[1.005] transition-transform">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-500 p-3 rounded-full">
                    <i className="fas fa-exclamation-circle text-white text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">त्रैमासिक परीक्षा समय सारणी / Quarterly Examination Schedule</h3>
                    <div className="text-gray-700">
                      <p className="mb-4 font-semibold text-lg">विशेष सूचना / Special Notice:</p>
                      <p className="mb-2 text-lg">कक्षा 9 से 12 तक के सभी छात्र/छात्राओं को सूचित किया जाता है कि:</p>
                      <p className="mb-2 text-lg">All students from classes 9 to 12 are informed that:</p>
                      <ul className="list-disc pl-6 space-y-2 text-lg">
                        <li>सभी विद्यार्थी दिनांक 03-10-2026, शुक्रवार को अपने अभिभावकों के साथ विद्यालय में प्रातः 8 बजे उपस्थित हों।</li>
                        <li>All students must be present at school with their parents/guardians on Friday, 03-10-2026 at 8:00 AM.</li>
                        <li>उस दिन परीक्षा भी संचालित होगी; जिस विषय की परीक्षा है, वही परीक्षा आयोजित की जाएगी।</li>
                        <li>Exams will also be conducted on that day; the scheduled exam for that day will take place.</li>
                      </ul>
                      <p className="mt-4 font-semibold text-lg">धन्यवाद। / Thank you.</p>
                      <p className="mt-2">आज्ञानुसार, / Sincerely,</p>
                      <p className="font-bold text-lg">प्रधानाचार्य / Principal</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Exam Schedule Section with Toggle */}
              <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12 border border-gray-200 transform hover:shadow-2xl transition-all duration-300">
                <div className={`p-6 text-white ${activeExamSchedule === 'quarterly' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}>
                  <h2 className="text-2xl md:text-3xl font-bold flex items-center">
                    <i className={`fas ${activeExamSchedule === 'quarterly' ? 'fa-calendar-alt' : 'fa-calendar-star'} mr-3`}></i>
                    {activeExamSchedule === 'quarterly' ? 'त्रैमासिक परीक्षा समय सारणी (Quarterly Examination Schedule)' : 'अर्धवार्षिक परीक्षा समय सारणी (Half-Yearly Examination Schedule)'}
                  </h2>
                  <p className="mt-2 opacity-90">
                    {activeExamSchedule === 'quarterly' ? 'October 2026 | Time: 8:30 AM - 11:30 AM' : 'December 2026 | Time: 8:30 AM - 11:30 AM'}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="exam-table min-w-full">
                      <thead className={`${activeExamSchedule === 'quarterly' ? 'bg-green-50' : 'bg-orange-50'}`}>
                        <tr>
                          <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">Date</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">Day</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">UKG to 2nd</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">3rd to 5th</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">6th to 8th</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">9th to 10th</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-700 border-b">11th to 12th</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeExamSchedule === 'quarterly' ? (
                          <>
                            {quarterlyExamSchedule.map((exam, index) => (
                              <tr 
                                key={index} 
                                className={`hover:bg-gray-50 transition ${exam.isSpecial ? 'bg-blue-50' : ''}`}
                              >
                                <td className="py-3 px-4 border-b font-semibold">{exam.date}</td>
                                <td className="py-3 px-4 border-b">{exam.day}</td>
                                <td className="py-3 px-4 border-b">
                                  <span className={`inline-block px-3 py-1 rounded-full ${exam.ukg_1_2.includes('Holiday') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {exam.ukg_1_2}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700">
                                    {exam.class_3_5}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                                    {exam.class_6_8}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                    {exam.class_9_10}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                    {exam.class_11_12}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <>
                            {halfYearlyExamSchedule.map((exam, index) => (
                              <tr 
                                key={index} 
                                className={`hover:bg-gray-50 transition ${exam.isHoliday ? 'bg-red-50' : ''}`}
                              >
                                <td className="py-3 px-4 border-b font-semibold">{exam.date}</td>
                                <td className="py-3 px-4 border-b">{exam.day}</td>
                                <td className="py-3 px-4 border-b">
                                  <span className={`inline-block px-3 py-1 rounded-full ${exam.ukg_1_2.includes('Holiday') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {exam.ukg_1_2}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700">
                                    {exam.class_3_5}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                                    {exam.class_6_8}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                    {exam.class_9_10}
                                  </span>
                                </td>
                                <td className="py-3 px-4 border-b">
                                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                    {exam.class_11_12}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <a 
                      href={`/assets/${activeExamSchedule === 'quarterly' ? 'त्रैमासिक परीक्षा समय सारणी.pdf' : 'Half Yearly Examination Date Sheet 2026.pdf'}`}
                      className="inline-flex items-center justify-center bg-gradient-to-r from-sricblue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
                      download
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download {activeExamSchedule === 'quarterly' ? 'Quarterly' : 'Half-Yearly'} Datesheet (PDF)
                    </a>
                    <a 
                      href="#year-calendar" 
                      className="inline-flex items-center justify-center bg-gradient-to-r from-sricgold to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sricblue font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
                    >
                      <i className="fas fa-calendar mr-2"></i>
                      View Full Calendar
                    </a>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
        
        {/* Year Navigation */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-sricblue">2026-2027 Academic Year</h2>
            <p className="text-gray-600">Important dates and events at a glance</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/calendar" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium">2026-27</Link>
            <span className="px-6 py-2 bg-gradient-to-r from-sricblue to-blue-600 text-white rounded-lg font-bold shadow-lg">2026-26</span>
          </div>
        </div>
        
        {/* Calendar Navigation with Month Selector */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-3 md:p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 to-gray-50">
            <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-4">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 md:p-3 rounded-full bg-white hover:bg-gray-100 transition shadow-sm border border-gray-200"
              >
                <i className="fas fa-chevron-left text-sricblue"></i>
              </button>
              <h3 className="text-lg md:text-2xl font-bold text-sricblue whitespace-nowrap">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 md:p-3 rounded-full bg-white hover:bg-gray-100 transition shadow-sm border border-gray-200"
              >
                <i className="fas fa-chevron-right text-sricblue"></i>
              </button>
            </div>
            
            <div className="flex items-center w-full md:w-auto gap-2">
              <button 
                onClick={goToToday}
                className="flex-1 md:flex-none px-4 py-2 bg-sricblue text-white rounded-lg hover:bg-blue-800 transition font-bold shadow-md text-sm md:text-base"
              >
                Today
              </button>
            
              <div className="relative flex-1 md:flex-none">
                <select 
                  value={currentMonth + (currentYear === 2027 ? 12 : 0)}
                  onChange={handleMonthSelect}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sricblue font-medium shadow-sm text-sm md:text-base"
                >
                  <option value="0">Jan 2026</option>
                  <option value="1">Feb 2026</option>
                  <option value="2">Mar 2026</option>
                  <option value="3">Apr 2026</option>
                  <option value="4">May 2026</option>
                  <option value="5">Jun 2026</option>
                  <option value="6">Jul 2026</option>
                  <option value="7">Aug 2026</option>
                  <option value="8">Sep 2026</option>
                  <option value="9">Oct 2026</option>
                  <option value="10">Nov 2026</option>
                  <option value="11">Dec 2026</option>
                  <option value="12">Jan 2027</option>
                  <option value="13">Feb 2027</option>
                  <option value="14">Mar 2027</option>
                  <option value="15">Apr 2027</option>
                  <option value="16">May 2027</option>
                  <option value="17">Jun 2027</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12 animate-fade-in">
          <div className="calendar-grid grid grid-cols-7 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div 
                key={day} 
                className="bg-sricblue text-white p-2 md:p-3 text-center font-bold text-[10px] md:text-lg uppercase tracking-wider"
              >
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>
          <div className="calendar-grid grid grid-cols-7">
            {generateCalendar()}
          </div>
          
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 flex justify-between items-center">
            <button 
              onClick={() => navigateMonth('prev')}
              className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-lg hover:from-gray-300 hover:to-gray-400 transition font-bold shadow-md"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Previous Month
            </button>
            <button 
              onClick={() => navigateMonth('next')}
              className="px-6 py-3 bg-gradient-to-r from-sricblue to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-bold shadow-md"
            >
              Next Month
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h3 className="text-2xl font-bold text-sricblue mb-6 flex items-center">
            <i className="fas fa-key mr-3"></i>
            Calendar Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { color: 'blue', label: 'Staff Events', icon: 'fa-users' },
              { color: 'yellow', label: 'Admissions', icon: 'fa-graduation-cap' },
              { color: 'red', label: 'Parent Events', icon: 'fa-user-friends' },
              { color: 'green', label: 'Examinations', icon: 'fa-file-alt' },
              { color: 'purple', label: 'Holidays', icon: 'fa-umbrella-beach' },
              { color: 'pink', label: 'School Events', icon: 'fa-school' }
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className={`w-5 h-5 rounded-full bg-${item.color}-500 shadow-md mr-3 flex items-center justify-center`}>
                  <i className={`fas ${item.icon} text-white text-xs`}></i>
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upcoming Events Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-sricblue mb-8 flex items-center">
            <i className="fas fa-calendar-star mr-3"></i>
            Upcoming Events
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-card bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 border-l-4 ${event.borderColor} hover:scale-105 hover:shadow-2xl`}
              >
                <div className={`${event.headerBg} text-white p-5`}>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">{event.date}</div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{event.month}</div>
                      <div className="text-sm opacity-90">{event.year}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <i className={`fas ${event.type === 'exam' ? 'fa-file-alt' : event.type === 'holiday' ? 'fa-umbrella-beach' : 'fa-school'} mr-2`}></i>
                    <span className="text-sm font-medium">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <i className="far fa-clock mr-2 text-lg"></i>
                    <span className="font-medium">{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Academic Year Calendar */}
        <div id="year-calendar">
          <h2 className="text-3xl font-bold text-sricblue mb-8 flex items-center">
            <i className="fas fa-calendar-alt mr-3"></i>
            Academic Year 2026-26 Important Dates
          </h2>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 academic-table">
                <thead className="bg-gradient-to-r from-sricblue to-blue-700 text-white">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold uppercase tracking-wider">Event</th>
                    <th className="px-8 py-4 text-left text-sm font-bold uppercase tracking-wider">Date</th>
                    <th className="px-8 py-4 text-left text-sm font-bold uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {academicDates.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className={`px-8 py-5 whitespace-nowrap font-bold text-lg ${item.highlight ? 'text-blue-600' : 'text-gray-900'}`}>
                        <div className="flex items-center">
                          {item.highlight && <i className="fas fa-star text-yellow-500 mr-3"></i>}
                          {item.event}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-lg font-medium">{item.date}</td>
                      <td className="px-8 py-5 text-gray-700 text-lg">{item.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Calendar;