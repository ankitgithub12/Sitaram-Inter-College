import React from 'react';

const StatsSection = () => {
  return (
    <section className="py-16 bg-sricblue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SRIC?</h2>
          <p className="text-xl max-w-2xl mx-auto">Our numbers speak for themselves</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">96%</div>
            <p className="font-semibold">12th Board Pass Rate</p>
          </div>
          
          <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">98%</div>
            <p className="font-semibold">10th Board Pass Rate</p>
          </div>
          
          <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">50+</div>
            <p className="font-semibold">Students in Govt Jobs Yearly</p>
          </div>
          
          <div className="stats-card bg-white text-sricblue p-6 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">20+</div>
            <p className="font-semibold">Years of Excellence</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
