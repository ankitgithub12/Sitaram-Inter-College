import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Home', icon: 'fas fa-home', path: '/' },
    { label: 'Academic', icon: 'fas fa-book', path: '/curriculum' },
    { label: 'Apply', icon: 'fas fa-plus-circle', path: '/admission-form', highlight: true },
    { label: 'Events', icon: 'fas fa-calendar-alt', path: '/calendar' },
    { label: 'Menu', icon: 'fas fa-bars', path: '#', isMenu: true }
  ];

  const menuItems = [
    { label: 'History', icon: 'fas fa-history', path: '/history' },
    { label: 'Mission', icon: 'fas fa-bullseye', path: '/mission' },
    { label: 'Faculty', icon: 'fas fa-users', path: '/faculty' },
    { label: 'Programs', icon: 'fas fa-graduation-cap', path: '/programs' },
    { label: 'Fees', icon: 'fas fa-money-bill-wave', path: '/fees' },
    { label: 'Process', icon: 'fas fa-info-circle', path: '/process' },
    { label: 'Announcements', icon: 'fas fa-bullhorn', path: '/announcements' },
    { label: 'Gallery', icon: 'fas fa-images', path: '/photos-videos' },
    { label: 'Achievements', icon: 'fas fa-trophy', path: '/achievements' },
    { label: 'Testimonials', icon: 'fas fa-comment-dots', path: '/testimonials' },
    { label: 'Contact', icon: 'fas fa-envelope', path: '/contact' },
    { label: 'Admin', icon: 'fas fa-user-shield', path: '/admin-login' }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] px-2 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              {item.isMenu ? (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex flex-col items-center justify-center space-y-1 w-full transition-all duration-300 ${isMenuOpen ? 'text-sricblue' : 'text-gray-500'}`}
                >
                  <i className={`${item.icon} text-xl`}></i>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                </button>
              ) : item.highlight ? (
                <Link
                  to={item.path}
                  className="relative -top-6"
                >
                  <div className="bg-gradient-to-tr from-sricblue to-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white transform transition-transform hover:scale-110 active:scale-95">
                    <i className={`${item.icon} text-white text-2xl`}></i>
                  </div>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-sricblue uppercase whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center space-y-1 w-full transition-all duration-300 ${isActive(item.path) ? 'text-sricblue' : 'text-gray-400 hover:text-sricblue'}`}
                >
                  <div className={`transition-all duration-300 ${isActive(item.path) ? 'transform -translate-y-1' : ''}`}>
                    <i className={`${item.icon} text-xl`}></i>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive(item.path) ? 'opacity-100' : 'opacity-80'}`}>
                    {item.label}
                  </span>
                  {isActive(item.path) && (
                    <div className="w-1 h-1 bg-sricblue rounded-full absolute bottom-1"></div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-[99] bg-sricblue/95 backdrop-blur-md transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="container mx-auto px-6 pt-10 pb-24 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-3">
              <img src="/assets/SRIC LOGO.PNG" alt="Logo" className="w-10 h-10 rounded-full border-2 border-sricgold shadow-lg" />
              <div>
                <h2 className="text-white font-black text-xl tracking-tight leading-none uppercase">SRIC Menu</h2>
                <span className="text-sricgold text-[10px] uppercase font-bold tracking-widest">Explore Our School</span>
              </div>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center p-4 rounded-2xl border transition-all duration-300 ${isActive(item.path) ? 'bg-sricgold text-sricblue border-sricgold shadow-xl scale-105' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${isActive(item.path) ? 'bg-sricblue text-white' : 'bg-white/10 text-sricgold'}`}>
                  <i className={`${item.icon} text-lg`}></i>
                </div>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-sricgold to-yellow-500 text-sricblue relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-2 uppercase italic">Need Help?</h3>
              <p className="text-sm font-bold opacity-80 mb-4">Our support team is available during school hours.</p>
              <a href="tel:+919756517750" className="inline-flex items-center bg-sricblue text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">
                <i className="fas fa-phone-alt mr-2"></i>
                Call Office
              </a>
            </div>
            <i className="fas fa-graduation-cap absolute -right-4 -bottom-4 text-7xl opacity-10 transform rotate-12 group-hover:scale-110 transition-transform"></i>
          </div>
        </div>
      </div>

      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
        @keyframes pulse-gold {
          0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }
      `}</style>
    </>
  );
};

export default MobileBottomNav;
