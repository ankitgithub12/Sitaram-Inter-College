import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Curriculum = () => {
  const [activeTab, setActiveTab] = useState('class9');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const curriculumData = {
    class9: {
      title: "Class 9-10 Curriculum",
      description: "Foundational education with comprehensive syllabus coverage following UP Board guidelines.",
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
      description: "Advanced science education with specialization options for engineering and medical aspirants.",
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
      description: "Comprehensive study of social sciences and arts for a deep understanding of society.",
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Matching Home Aesthetics */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sricblue via-blue-900 to-indigo-950 text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sricgold rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6 inline-block animate-bounce-slow">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest text-sricgold shadow-xl">
              Academic Excellence
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight animate-fade-in-up">
            UP Board <span className="text-sricgold underline decoration-white/20 underline-offset-8">Curriculum</span>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-200 leading-relaxed font-medium">
            A comprehensive academic framework designed for Classes 9-12, blending traditional wisdom with modern pedagogical approaches for examination success.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <a 
              href="#curriculum" 
              className="bg-sricgold text-sricblue font-black py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,215,0,0.3)] flex items-center justify-center group"
            >
              Explore Subjects
              <i className="fas fa-arrow-down ml-3 group-hover:translate-y-1 transition-transform"></i>
            </a>
            <Link 
              to="/programs" 
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-black py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-sricblue flex items-center justify-center group"
            >
              Academic Streams
              <i className="fas fa-external-link-alt ml-3 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Curriculum Main Section */}
      <section id="curriculum" className="py-20 lg:py-32 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
               <div className="w-10 h-1 bg-sricgold rounded-full"></div>
               <span className="text-sricblue font-black uppercase tracking-widest text-sm">Framework</span>
               <div className="w-10 h-1 bg-sricgold rounded-full"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-sricblue mb-6">
              Our Educational Journey
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We provide a structured learning path that ensures every student achieves their highest potential through specialized streams and core foundational subjects.
            </p>
          </div>
          
          {/* Tab Navigation - Responsive & Premium */}
          <div className="flex overflow-x-auto pb-4 md:pb-0 md:justify-center mb-16 gap-4 no-scrollbar px-4">
            {[
              { id: 'class9', label: 'Class 9-10', icon: 'fa-graduation-cap' },
              { id: 'class11sci', label: 'Science Stream', icon: 'fa-atom' },
              { id: 'class11hum', label: 'Humanities', icon: 'fa-landmark' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 px-6 md:px-10 py-5 rounded-2xl font-black text-base md:text-lg transition-all duration-500 flex items-center gap-4 shadow-sm border-2 ${
                  activeTab === tab.id
                  ? 'bg-sricblue border-sricblue text-white shadow-xl transform -translate-y-1 scale-105'
                  : 'bg-white border-transparent text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'text-sricgold' : 'text-sricblue'}`}></i>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Tab Content Area */}
          <div className="max-w-7xl mx-auto">
            {Object.keys(curriculumData).map((key) => (
              <div key={key} className={`${activeTab === key ? 'block' : 'hidden'} animate-fade-in`}>
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-sricblue/5 border border-gray-100 overflow-hidden relative">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sricgold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-12">
                      <h3 className="text-3xl md:text-4xl font-black text-sricblue mb-4">
                        {curriculumData[key].title}
                      </h3>
                      <p className="text-xl text-gray-500 max-w-3xl">
                        {curriculumData[key].description}
                      </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                      {Object.entries(curriculumData[key].subjects).map(([group, subjects], gIdx) => (
                        <div key={group} className="space-y-6">
                          <h4 className="text-xl font-black text-sricblue uppercase tracking-widest flex items-center">
                            <span className="w-8 h-1 bg-sricgold mr-4 rounded-full"></span>
                            {group === 'core' ? 'Core Subjects' : group === 'additional' ? 'Complementary' : group === 'pcm' ? 'PCM Specialization' : 'PCB Specialization'}
                          </h4>
                          
                          <div className="grid gap-4 md:gap-6">
                            {subjects.map((subject, sIdx) => (
                              <div key={sIdx} className="subject-card group p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white transition-all duration-300">
                                <div className="flex items-start gap-5">
                                  <div className="w-14 h-14 rounded-2xl bg-white text-sricblue flex items-center justify-center text-xl shadow-lg group-hover:bg-sricblue group-hover:text-white transition-all duration-500">
                                    <i className={`fas ${subject.icon}`}></i>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-black text-gray-800 mb-1 group-hover:text-sricblue transition-colors">{subject.name}</h5>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                      {subject.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Section - Premium Gradient */}
      <section className="py-24 bg-gradient-to-r from-sricblue via-blue-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              UP Board Examination <span className="text-sricgold">Preparation</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Our rigorous assessment systems are tailored to ensure every student is mentally and academically prepared for the state board challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {assessmentFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-[2.5rem] text-center transition-all duration-500 hover:bg-white hover:-translate-y-4 shadow-2xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-sricgold to-yellow-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl transform group-hover:rotate-6 transition-transform">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black mb-4 text-white group-hover:text-sricblue transition-colors">{feature.title}</h3>
                <p className="text-gray-300 group-hover:text-gray-600 transition-colors leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-gray-100 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-sricgold rounded-3xl flex items-center justify-center shadow-2xl rotate-12">
                <i className="fas fa-question-circle text-4xl text-sricblue"></i>
             </div>
             
             <h2 className="text-3xl md:text-5xl font-black text-sricblue mb-8">
               Need Further Details?
             </h2>
             <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium">
               Get a copy of the detailed syllabus, academic calendar, and stream specializations from our office or contact us digitally.
             </p>
             
             <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link 
                  to="/contact" 
                  className="bg-sricblue text-white font-black py-5 px-12 rounded-2xl text-lg shadow-xl hover:shadow-sricblue/30 transform hover:-translate-y-1 transition-all flex items-center justify-center group"
                >
                  Contact Admissions
                  <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
                <Link 
                  to="/programs" 
                  className="bg-white text-sricblue border-2 border-sricblue font-black py-5 px-12 rounded-2xl text-lg transform hover:-translate-y-1 transition-all hover:bg-sricblue hover:text-white flex items-center justify-center"
                >
                  View All Streams
                </Link>
             </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .subject-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .subject-card:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 40px -10px rgba(0, 51, 102, 0.1);
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 768px) {
          .subject-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Curriculum;