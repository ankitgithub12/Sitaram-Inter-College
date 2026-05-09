import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Users, GraduationCap, DollarSign, Mail, Settings,
  BarChart3, LogOut, ChevronLeft, Shield, Image, Trophy, Megaphone, Calendar, MessageSquare
} from 'lucide-react';

const AdminSidebar = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentTab,
  setCurrentTab,
  notificationCounts,
  handleLogout,
  adminName,
  loginID
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-sricblue to-blue-900 text-white transition-all duration-300 transform flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64 w-64'}
      `}>
      {/* Logo */}
      <div className="p-6 border-b border-blue-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl">
              <Shield className="w-6 h-6 text-sricblue" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-lg tracking-tight">SRIC Admin</span>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${
              sidebarCollapsed ? 'rotate-180' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 overflow-y-auto flex-grow">
        {/* Main Section */}
        <div className="mb-8">
          <p className={`text-xs uppercase tracking-wider text-blue-300 mb-3 ${
            sidebarCollapsed ? 'text-center' : 'px-3'
          }`}>Main</p>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'dashboard'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>
        </div>

        {/* Applications Section */}
        <div className="mb-8">
          <p className={`text-xs uppercase tracking-wider text-blue-300 mb-3 ${
            sidebarCollapsed ? 'text-center' : 'px-3'
          }`}>Applications</p>
          
          <button
            onClick={() => setCurrentTab('admissions')}
            className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'admissions'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Admissions</span>}
            </div>
            {notificationCounts.admissions > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCounts.admissions}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('fees')}
            className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'fees'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Fee Payments</span>}
            </div>
            {notificationCounts.fees > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCounts.fees}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('contacts')}
            className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'contacts'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Contact Forms</span>}
            </div>
            {notificationCounts.contacts > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCounts.contacts}
              </span>
            )}
          </button>
        </div>

        {/* Content Management Section */}
        <div className="mb-8">
          <p className={`text-xs uppercase tracking-wider text-blue-300 mb-3 ${
            sidebarCollapsed ? 'text-center' : 'px-3'
          }`}>Content</p>
          
          <button
            onClick={() => setCurrentTab('gallery')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'gallery'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <Image className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Gallery Manager</span>}
          </button>

          <button
            onClick={() => setCurrentTab('achievements')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'achievements'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <Trophy className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Achievements</span>}
          </button>

          <button
            onClick={() => setCurrentTab('announcements')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'announcements'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <Megaphone className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Announcements</span>}
          </button>

          <button
            onClick={() => setCurrentTab('examschedules')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'examschedules'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Exam Schedules</span>}
          </button>

          <button
            onClick={() => setCurrentTab('testimonials')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'testimonials'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Testimonials</span>}
          </button>
        </div>

        {/* Management Section */}
        <div className="mb-8">
          <p className={`text-xs uppercase tracking-wider text-blue-300 mb-3 ${
            sidebarCollapsed ? 'text-center' : 'px-3'
          }`}>Management</p>
          
          <button
            onClick={() => setCurrentTab('reports')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'reports'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Reports</span>}
          </button>

          <button
            onClick={() => setCurrentTab('users')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'users'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Manage Teachers</span>}
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl mb-2 transition-all ${
              currentTab === 'settings'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'hover:bg-blue-800/50'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="p-4 border-t border-blue-800 flex-shrink-0">
        <Link
          to="/"
          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-800/50 transition-all mb-2"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          {!sidebarCollapsed && <span>View Website</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>

        {/* Admin Profile Section */}
        <div className={`mt-6 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{adminName || 'Administrator'}</p>
                <div className="flex items-center space-x-1">
                  <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    {loginID ? `@${loginID}` : ''}
                  </p>
                  <span className="text-[10px] text-blue-400">•</span>
                  <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    {loginID === '221205' ? 'System Admin' : 'Staff'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default AdminSidebar;
