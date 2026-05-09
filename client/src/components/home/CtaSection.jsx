import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-16 bg-sricgold text-sricblue">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">Applications for the 2026-2027 academic year are now open</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/admission-form" 
            className="bg-sricblue hover:bg-sricblue text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Apply Now
          </Link>
          <Link 
            to="/contact" 
            className="bg-transparent border-2 border-sricblue hover:bg-sricblue hover:text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Schedule a Visit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
