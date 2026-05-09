import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero text-white py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Admissions Open Banner */}
        <div className="mb-8 inline-block animate-bounce">
          <Link to="/admission-form" className="bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-40 rounded-full px-6 py-2 flex items-center shadow-2xl hover:bg-opacity-30 transition cursor-pointer">
            <span className="flex h-3 w-3 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sricgold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sricgold"></span>
            </span>
            <span className="text-white font-bold tracking-wider">ADMISSIONS OPEN FOR SESSION 2026-2027</span>
            <i className="fas fa-arrow-right ml-3 text-sricgold"></i>
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">Empowering Minds, Shaping Futures</h1>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          SRIC Senior Secondary School provides quality education with a focus on academic excellence and holistic development since 2002
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/admission-form"
            className="bg-sricgold hover:bg-yellow-600 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Apply Now
          </Link>
          <Link
            to="/about"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
