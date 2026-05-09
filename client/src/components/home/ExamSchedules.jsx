import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ExamSchedules = () => {
  const [dynamicSchedules, setDynamicSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/examschedules');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          
          const activeSchedules = data.data.filter(schedule => {
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
        }
      } catch (err) {
        console.error('Failed to fetch exam schedules:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const renderDynamicSchedules = () => {
    return dynamicSchedules.map((schedule, index) => {
      // Choose gradient based on colorTheme
      let gradientClass = "bg-gradient-to-br from-sricblue via-blue-800 to-purple-900";
      let accentClass = "text-sricgold bg-sricgold";
      let textAccentClass = "text-yellow-200";
      let statusPing = "bg-green-400";
      
      if (schedule.colorTheme === 'red') {
        gradientClass = "bg-gradient-to-br from-red-900 via-red-700 to-orange-800";
        accentClass = "text-sricgold bg-sricgold";
        statusPing = "bg-red-400";
      } else if (schedule.colorTheme === 'green') {
        gradientClass = "bg-gradient-to-br from-green-900 via-green-700 to-teal-800";
        accentClass = "text-yellow-300 bg-yellow-300";
        statusPing = "bg-blue-400";
      } else if (schedule.colorTheme === 'purple') {
        gradientClass = "bg-gradient-to-br from-purple-900 via-purple-700 to-fuchsia-800";
        accentClass = "text-pink-300 bg-pink-300";
        statusPing = "bg-green-400";
      }

      return (
        <section key={schedule._id} className={`py-20 relative overflow-hidden ${gradientClass} text-white`}>
          <div className="absolute inset-0 opacity-10">
            <div className={`absolute top-10 left-10 w-20 h-20 rounded-full ${accentClass.split(' ')[1]}`}></div>
            <div className={`absolute bottom-10 right-10 w-16 h-16 rounded-full ${accentClass.split(' ')[1]}`}></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block relative mb-4">
                  <h2 className={`text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 ${textAccentClass}`}>
                    {schedule.title}
                  </h2>
                  <div className={`h-1 w-24 mx-auto mt-2 rounded-full ${accentClass.split(' ')[1]}`}></div>
                </div>
                <p className="text-xl md:text-2xl opacity-90">{schedule.examType} Examination {schedule.academicYear}</p>
                
                <div className="inline-flex items-center mt-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 border border-white border-opacity-30">
                  <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${statusPing}`}></span>
                  <span className="text-sm font-medium">Status: {schedule.status}</span>
                </div>
              </div>
              
              {schedule.noticeText && (
                <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-8 mb-10 border border-white border-opacity-20 shadow-2xl">
                  <div className="flex items-start mb-6">
                    <div className={`flex-shrink-0 bg-opacity-20 p-3 rounded-full mr-4 ${accentClass.split(' ')[1]}`}>
                      <i className={`fas fa-bullhorn text-2xl ${accentClass.split(' ')[0]}`}></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center">
                        Special Notice
                        <span className="ml-3 px-2 py-1 bg-red-500 text-xs rounded-full animate-pulse">Important</span>
                      </h3>
                      <div className="bg-white bg-opacity-10 rounded-xl p-5 border-l-4 border-yellow-400">
                        <p className="mb-0 whitespace-pre-line">{schedule.noticeText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {schedule.dates && schedule.dates.length > 0 && (
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-white border-opacity-20">
                  <h3 className="text-2xl font-bold mb-6 text-center">Exam Schedule Preview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {schedule.dates.map((dt, idx) => {
                      const d = new Date(dt.date);
                      return (
                        <div key={idx} className="bg-white bg-opacity-15 rounded-xl p-4 text-center transform transition-transform hover:scale-105">
                          <div className={`text-2xl font-bold ${accentClass.split(' ')[0]}`}>{d.getDate()}</div>
                          <div className="text-sm">{d.toLocaleString('default', { month: 'short' })}</div>
                          <div className="text-xs mt-2 font-bold">{dt.subject}</div>
                          <div className={`text-xs mt-1 ${accentClass.split(' ')[0]}`}>Class {dt.classes}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <Link 
                  to="/calendar" 
                  className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center">
                    <i className="fas fa-calendar-alt mr-3 text-xl"></i>
                    View Full Calendar
                    <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </Link>
                
                {schedule.pdfUrl && (
                  <a 
                    href={schedule.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-red-700 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      <i className="fas fa-download mr-3 text-xl"></i>
                      Download Datesheet
                      <i className="fas fa-external-link-alt ml-2 group-hover:translate-y-1 transition-transform duration-300"></i>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    });
  };

  if (isLoading) {
    return <div className="py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div></div>;
  }

  // Fallback to hardcoded if no valid dynamic schedules found
  if (dynamicSchedules.length === 0) {
    return null;
  }

  return (
    <>
      {renderDynamicSchedules()}
    </>
  );
};

export default ExamSchedules;
