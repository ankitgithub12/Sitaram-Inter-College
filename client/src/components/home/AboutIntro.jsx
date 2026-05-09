import React from 'react';

const AboutIntro = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Welcome to SRIC Senior Secondary School
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Established in 2002, SRIC Senior Secondary School has been a beacon of quality education in Amroha, providing students with a nurturing environment that fosters academic excellence, character development, and holistic growth.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card bg-gray-50 p-8 rounded-lg shadow-md transition duration-300">
              <div className="text-sricblue text-4xl mb-4">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Academic Excellence</h3>
              <p className="text-gray-600">Consistent 95%+ board results with specialized coaching for 10th and 12th standard examinations.</p>
            </div>
            
            <div className="feature-card bg-gray-50 p-8 rounded-lg shadow-md transition duration-300">
              <div className="text-sricblue text-4xl mb-4">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Experienced Faculty</h3>
              <p className="text-gray-600">Our dedicated teachers provide personalized attention and mentorship to every student.</p>
            </div>
            
            <div className="feature-card bg-gray-50 p-8 rounded-lg shadow-md transition duration-300">
              <div className="text-sricblue text-4xl mb-4">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Facilities</h3>
              <p className="text-gray-600">Smart classrooms, well-equipped labs, and a digital library enhance the learning experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
