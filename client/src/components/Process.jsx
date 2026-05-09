import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Process = () => {
  const [openFaq, setOpenFaq] = useState(null);


  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const timelineSteps = [
    {
      step: 1,
      title: "Inquiry & Registration",
      description: "Begin by submitting an inquiry form online or visiting our campus. Our UP Board admission counselors will guide you through the process and help you register.",
      icon: "fa-search"
    },
    {
      step: 2,
      title: "Submission of Documents",
      description: "Submit required documents including previous academic records (marksheets), transfer certificate (if applicable), and identity proof as per UP Board requirements.",
      icon: "fa-file-alt"
    },
    {
      step: 3,
      title: "Interaction Session",
      description: "Students and parents meet with our academic team to discuss educational goals and assess the student's readiness for our UP Board curriculum.",
      icon: "fa-users"
    },
    {
      step: 4,
      title: "Admission Decision",
      description: "Within 7 working days of document submission and interaction, you'll receive an admission decision via email and phone.",
      icon: "fa-check-circle"
    },
    {
      step: 5,
      title: "Fee Payment",
      description: "Upon acceptance, complete the admission by paying the required UP Board fees within the stipulated time to secure your seat.",
      icon: "fa-credit-card"
    },
    {
      step: 6,
      title: "Orientation",
      description: "Attend the orientation program before the academic session begins to familiarize yourself with school policies, faculty, and UP Board requirements.",
      icon: "fa-graduation-cap"
    }
  ];

  const documents = [
    {
      title: "Academic Records",
      icon: "fa-file-alt",
      items: [
        "Original marksheet of previous class",
        "UP Board marksheet (for class 11/12)",
        "Transfer Certificate (TC) from previous school"
      ]
    },
    {
      title: "Identity Proof",
      icon: "fa-id-card",
      items: [
        "Birth Certificate (issued by Municipal Corporation)",
        "Aadhaar Card (Student & Parents)",
        "Passport size photos (4 copies, white background)"
      ]
    },
    {
      title: "Application Forms",
      icon: "fa-file-signature",
      items: [
        "Completed UP Board admission form",
        "Medical history form",
        "Transportation request (if needed)"
      ]
    },
    {
      title: "Financial Documents",
      icon: "fa-file-invoice-dollar",
      items: [
        "Fee payment receipt (UP Board registration fee included)",
        "Concession form (if applicable)",
        "Scholarship documents (if applicable)"
      ]
    }
  ];

  const faqs = [
    {
      question: "What is the age criteria for admission to different classes?",
      answer: "The age criteria for our UP Board classes are as follows: Class 9: Minimum 13 years as of March 31, 2026; Class 11: Minimum 15 years as of March 31, 2026; For other classes, the age should be appropriate for the grade level based on previous schooling."
    },
    {
      question: "Is there an entrance test for admission?",
      answer: "For classes 9 and 11, we conduct a basic aptitude test in Hindi, English, and Mathematics to assess the student's foundational knowledge. The test is designed to ensure students can successfully follow our UP Board curriculum."
    },
    {
      question: "What is the medium of instruction at SRIC?",
      answer: "We are a Hindi medium school following the UP Board curriculum. However, we place special emphasis on English language skills to prepare students for competitive exams and higher education."
    },
    {
      question: "Can I apply for a scholarship or fee concession?",
      answer: "Yes, we offer merit-based scholarships and need-based fee concessions. Merit scholarships are awarded based on previous academic performance (85%+ in board exams) and performance in our scholarship test. Need-based concessions require submission of income proof and are evaluated on a case-by-case basis."
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sricblue via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-sricgold rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-sricgold rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Admission Process</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            Join Sitaram Inter College through our simple and transparent UP Board admission procedure
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/admission-form" 
              className="bg-gradient-to-r from-sricgold to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply Now
            </Link>
            <Link 
              to="/fees" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              View Fee Structure
            </Link>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our UP Board Admission Journey</h2>
              <div className="w-20 h-1 bg-sricblue mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A step-by-step guide to joining our prestigious institution
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-sricblue to-blue-500 hidden md:block"></div>
              
              {timelineSteps.map((step, index) => (
                <div key={step.step} className="relative mb-12 md:flex items-start">
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sricblue to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      <i className={`fas ${step.icon}`}></i>
                    </div>
                    {index !== timelineSteps.length - 1 && (
                      <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-blue-300"></div>
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-8 flex-1">
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Step {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">UP Board Admission Dates</h2>
              <div className="w-20 h-1 bg-sricblue mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Important deadlines for the academic year 2026-2027
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-sricblue hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white p-3 rounded-xl mr-4">
                    <i className="fas fa-calendar-check text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-sricblue">Regular Admissions</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Application Opens</span>
                    <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-sricblue px-4 py-2 rounded-lg font-bold">January 15, 2026</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Priority Deadline</span>
                    <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-sricblue px-4 py-2 rounded-lg font-bold">March 31, 2026</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-700 font-medium">Final Deadline</span>
                    <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-sricblue px-4 py-2 rounded-lg font-bold">May 15, 2026</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-sricgold hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-sricgold to-yellow-500 text-sricblue p-3 rounded-xl mr-4">
                    <i className="fas fa-clock text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-sricblue">Late Admissions</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Late Application Period</span>
                    <span className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-sricblue px-4 py-2 rounded-lg font-bold">May 16 - June 10, 2026</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Seat Availability Basis</span>
                    <span className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-sricblue px-4 py-2 rounded-lg font-bold">Limited Seats</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-700 font-medium">Academic Session Begins</span>
                    <span className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-sricblue px-4 py-2 rounded-lg font-bold">July 1, 2026</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-6 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-yellow-500 text-2xl mt-1 mr-4"></i>
                </div>
                <div>
                  <p className="text-yellow-800 font-medium">
                    <span className="font-bold">Note:</span> Late applications may incur additional charges and are subject to seat availability. Early applications receive priority consideration for UP Board registration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Required Documents for UP Board</h2>
              <div className="w-20 h-1 bg-sricblue mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Complete checklist for a smooth admission process
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {documents.map((doc, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white p-4 rounded-xl mr-4">
                      <i className={`fas ${doc.icon} text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-sricblue">{doc.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {doc.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="fas fa-check text-green-500 text-xs"></i>
                          </div>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/admission-form" 
                className="inline-flex items-center bg-gradient-to-r from-sricblue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Begin Your Application
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <div className="w-20 h-1 bg-sricblue mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Find answers to common admission queries
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 hover:bg-gray-50 focus:outline-none flex justify-between items-center"
                  >
                    <span className="text-lg font-semibold text-sricblue">{faq.question}</span>
                    <svg 
                      className={`w-5 h-5 text-sricblue transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4 text-lg">Have more questions?</p>
              <Link 
                to="/contact" 
                className="inline-flex items-center text-sricblue font-bold text-lg hover:underline"
              >
                Contact Our Admission Team
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Process;