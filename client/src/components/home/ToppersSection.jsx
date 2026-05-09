import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ToppersSection = () => {
  const defaultToppers = {
    class12: [
      { 
        name: 'ANUSHKA', 
        percentage: '86.8%', 
        stream: 'Science Stream', 
        certificateUrl: '/assets/Anushka Merit certificate.pdf' 
      },
      { 
        name: 'NITIKA SAINI', 
        percentage: '85.8%', 
        stream: 'Science Stream', 
        certificateUrl: '/assets/NITIKA merit certificate.pdf' 
      },
      { 
        name: 'DIVESH SAINI', 
        percentage: '83%', 
        stream: 'Science Stream', 
        certificateUrl: '/assets/Divesh Merit Certificate.pdf' 
      }
    ],
    class10: [
      { name: 'MOHANE SAINI', percentage: '85.11%', highlights: 'School Topper' },
      { name: 'SHIVANSHI', percentage: '83.83%', highlights: '90+ marks in Hindi and English' },
      { name: 'PINKI', percentage: '83.66%', highlights: '80+ marks in Every Subject' }
    ]
  };

  const [toppers, setToppers] = useState(defaultToppers);
  const [yearTitle, setYearTitle] = useState('2024-25');

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        const res = await fetch('/api/achievements');
        const data = await res.json();
        
        if (data.success && data.data && data.data.length > 0) {
           // Find the max year
           const maxYear = Math.max(...data.data.map(d => parseInt(d.year) || 2026));
           const latestAch = data.data.filter(d => (parseInt(d.year) || 2026) === maxYear);

           const formatAch12 = (t) => ({
               name: t.name,
               percentage: t.percentage + (String(t.percentage).includes('%') ? '' : '%'),
               stream: t.stream || 'Science Stream',
               certificateUrl: t.certificateUrl
           });

           const formatAch10 = (t) => ({
               name: t.name,
               percentage: t.percentage + (String(t.percentage).includes('%') ? '' : '%'),
               highlights: t.highlights || 'School Topper',
               certificateUrl: t.certificateUrl
           });

           const db12 = latestAch.filter(t => t.classGroup === '12').sort((a,b) => (a.rank||99)-(b.rank||99)).slice(0,3).map(formatAch12);
           const db10 = latestAch.filter(t => t.classGroup === '10').sort((a,b) => (a.rank||99)-(b.rank||99)).slice(0,3).map(formatAch10);

           // If there is newer data from admin panel, replace the default ones
           // Also, if the admin specifically overrides 2026 data, we should also replace it.
           if (db12.length > 0 || db10.length > 0) {
               setToppers({
                 class12: db12.length > 0 ? db12 : defaultToppers.class12,
                 class10: db10.length > 0 ? db10 : defaultToppers.class10
               });
               setYearTitle(`${maxYear-1}-${maxYear.toString().slice(-2)}`);
           }
        }
      } catch (err) {
        console.error('Error fetching toppers:', err);
      }
    };
    fetchToppers();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Academic Toppers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Celebrating the outstanding achievements of our students in board examinations</p>
        </div>

        {/* Special Recognition for Top 1% Achievers */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 mb-10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center">
                <i className="fas fa-trophy text-3xl text-yellow-300"></i>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">State-Level Excellence</h3>
              <p className="text-lg mb-3">Our Class 12 students have achieved remarkable success by ranking in the <span className="font-bold text-yellow-300">TOP 1%</span> of the entire Uttar Pradesh Board!</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Anushka - 86.8%</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Nitika Saini - 85.8%</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Divesh Saini - 83%</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-auto">
              <a 
                href="/assets/top_performers_certificates.pdf" 
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
              >
                <i className="fas fa-certificate mr-2"></i> View All Certificates
              </a>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* 12th Toppers */}
          <div className="bg-gradient-to-br from-sricblue to-blue-900 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-white text-sricblue w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
                <i className="fas fa-medal"></i>
              </div>
              <h3 className="text-2xl font-bold ml-4">Class 12 Toppers ({yearTitle})</h3>
            </div>
            
            <div className="space-y-4">
              {toppers.class12.map((t, i) => (
                <div key={i} className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold uppercase">{t.name}</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">{t.percentage}</span>
                  </div>
                  <p className="text-sm opacity-90">{t.stream || 'Science Stream'}</p>
                  {t.certificateUrl && (
                    <div className="mt-2">
                      <a 
                        href={t.certificateUrl} 
                        className="text-xs text-blue-200 hover:text-white underline flex items-center" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-certificate mr-1"></i> View Certificate
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 10th Toppers */}
          <div className="bg-gradient-to-br from-sricgold to-yellow-600 text-sricblue p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-white text-sricblue w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
                <i className="fas fa-award"></i>
              </div>
              <h3 className="text-2xl font-bold ml-4">Class 10 Toppers ({yearTitle})</h3>
            </div>
            
            <div className="space-y-4">
              {toppers.class10.map((t, i) => (
                <div key={i} className="bg-white bg-opacity-30 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold uppercase">{t.name}</h4>
                    <span className="bg-white text-sricblue px-3 py-1 rounded-full text-sm font-bold">{t.percentage}</span>
                  </div>
                  <p className="text-sm opacity-90">{t.highlights || 'School Topper'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/achievements" 
            className="inline-flex items-center text-sricblue font-semibold hover:underline"
          >
            View All Toppers
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ToppersSection;
