import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
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
              <li><Link to="/history" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/curriculum" className="text-gray-400 hover:text-white">Academics</Link></li>
              <li><Link to="/admission-form" className="text-gray-400 hover:text-white">Admissions</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/admin-login" className="text-gray-400 hover:text-white">Admin Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Academic Streams</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Science (PCMB)</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Humanities</a></li>
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
                <span className="text-gray-400 break-long-text">sitaramintercollege1205@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>© 2026 SRIC Senior Secondary School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
