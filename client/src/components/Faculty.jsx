import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Faculty = () => {
  const [activeDept, setActiveDept] = useState('all');
  
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

    return () => observer.disconnect();
  }, [facultyMembers, isLoading, activeDept, isProfileModalOpen]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('/api/users/faculty');
        const data = await response.json();
        if (data.success) {
          setFacultyMembers(data.data);
        }
      } catch (err) {
        console.error('Error fetching faculty:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const openProfile = (e, faculty) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedFaculty(faculty);
    setIsProfileModalOpen(true);
  };

  const handleDeptFilter = (dept) => {
    setActiveDept(dept);
  };

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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Matching Home Page Aesthetic */}
      <section className="hero relative overflow-hidden text-white py-24">
        <div className="absolute inset-0 bg-sricblue/40 backdrop-blur-[2px]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6 inline-block">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 flex items-center shadow-xl">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sricgold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sricgold"></span>
                </span>
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">Academic Excellence</span>
             </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in leading-tight">
            Meet Our <span className="text-sricgold">Expert Faculty</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 fade-in opacity-90">
            A team of dedicated educators committed to nurturing the leaders of tomorrow with wisdom, passion, and innovation since 2002.
          </p>
          
          <div className="flex justify-center space-x-3 fade-in">
            <div className="w-12 h-1 bg-sricgold rounded-full"></div>
            <div className="w-6 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Faculty Content */}
      <main className="relative z-10 -mt-16">
        <section className="container mx-auto px-4 pb-20">
          {/* Enhanced Department Tabs */}
          <div className="flex justify-center mb-12 fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-2 inline-flex flex-wrap justify-center border border-gray-100 max-w-5xl">
              {Object.entries(departmentData).map(([key, { name, count }]) => (
                <button
                  key={key}
                  onClick={() => handleDeptFilter(key)}
                  className={`department-tab px-4 sm:px-5 py-2.5 m-1 rounded-xl transition-all duration-300 flex flex-col items-center min-w-[100px] ${
                    activeDept === key 
                    ? 'bg-sricblue text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-sricblue hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold text-sm">{name}</span>
                  <span className={`text-[10px] mt-0.5 ${activeDept === key ? 'text-sricgold' : 'text-gray-400'}`}>
                    {count} {count === 1 ? 'Educator' : 'Educators'}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 fade-in">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-sricblue rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 font-medium">Loading faculty members...</p>
            </div>
          ) : filteredFaculty.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredFaculty.map((faculty, index) => (
              <div 
                key={faculty._id} 
                className="faculty-card fade-in"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={faculty.photoUrl || faculty.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=random&color=fff&size=128`} 
                      alt={faculty.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=random&color=fff&size=128`}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-sricblue px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      {departmentData[faculty.department]?.name || faculty.department}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold">{faculty.name}</h3>
                          <span className="text-xs bg-sricgold text-sricblue px-2 py-1 rounded-full">
                            {faculty.experience || 'Educator'}
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
                        <p className="text-gray-500 text-sm">{faculty.qualification}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3">{faculty.description}</p>
                  </div>
                  <div className="px-6 pb-6 mt-auto">
                    <button 
                      onClick={(e) => openProfile(e, faculty)}
                      className="w-full bg-sricblue text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-sricblue/20 flex items-center justify-center space-x-2"
                    >
                      <span>Complete Profile</span>
                      <i className="fas fa-arrow-right text-xs text-sricgold"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 fade-in">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users-slash text-3xl text-gray-300"></i>
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">No Faculty Found</h3>
             <p className="text-gray-500">We couldn't find any educators in the {activeDept} department.</p>
          </div>
        )}

          {/* Faculty Excellence Section */}
          <div className="bg-gradient-to-r from-sricblue via-blue-700 to-blue-900 rounded-3xl overflow-hidden shadow-2xl fade-in">
            <div className="grid md:grid-cols-2">
              <div className="p-12 text-white">
                <h2 className="text-3xl font-bold mb-8">Our Teaching Philosophy</h2>
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
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Faculty Profile Modal */}
      {isProfileModalOpen && selectedFaculty && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side: Photo & Basic Info */}
            <div className="md:w-1/3 bg-gradient-to-br from-sricblue to-blue-900 text-white p-8 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl mb-6 transform hover:rotate-3 transition-transform duration-500">
                <img 
                  src={selectedFaculty.photoUrl || selectedFaculty.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFaculty.name)}&background=random&color=fff&size=128`} 
                  alt={selectedFaculty.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFaculty.name)}&background=random&color=fff&size=128`}
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">{selectedFaculty.name}</h3>
              <p className="text-sricgold font-semibold mb-4">{selectedFaculty.position}</p>
              <div className="w-full h-px bg-white/20 mb-6"></div>
              
              <div className="space-y-4 w-full">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-graduation-cap text-sricgold"></i>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-200">Qualification</p>
                    <p className="text-sm font-medium">{selectedFaculty.qualification}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-history text-sricgold"></i>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-200">Experience</p>
                    <p className="text-sm font-medium">{selectedFaculty.experience || "10+ Years"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-book text-sricgold"></i>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-200">Primary Subject</p>
                    <p className="text-sm font-medium">{selectedFaculty.subject || "General"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Biography & Close */}
            <div className="md:w-2/3 p-8 md:p-12 relative overflow-y-auto">
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-sricblue p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <i className="fas fa-times text-xl"></i>
              </button>

              <div className="mb-8">
                <h4 className="text-sricblue text-sm font-bold uppercase tracking-widest mb-4 flex items-center">
                  <span className="w-8 h-1 bg-sricgold mr-3 rounded-full"></span>
                  About Educator
                </h4>
                <p className="text-gray-600 text-lg leading-relaxed text-justify">
                  {selectedFaculty.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h5 className="text-sricblue font-bold mb-2">Teaching Philosophy</h5>
                  <p className="text-sm text-gray-500 italic">"Empowering students through personalized guidance and innovative learning methods."</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h5 className="text-sricblue font-bold mb-2">Contact Info</h5>
                  <p className="text-sm text-gray-500">Professional inquiries can be directed via the school administration office.</p>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="bg-sricblue text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-sricblue/30 transition-all hover:-translate-y-1"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <style>{`
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
        
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Faculty;