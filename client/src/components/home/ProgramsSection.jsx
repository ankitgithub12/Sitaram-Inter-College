import React from 'react';

const ProgramsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Academic Programs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive education for Classes 9 to 12 with multiple streams</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500">
            <h3 className="text-xl font-bold mb-4">Science Stream</h3>
            <p className="text-gray-600 mb-4">Physics, Chemistry, Mathematics, Biology with comprehensive lab facilities</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Advanced laboratory equipment</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Competitive exam preparation</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Research projects</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-yellow-500">
            <h3 className="text-xl font-bold mb-4">Humanities Stream</h3>
            <p className="text-gray-600 mb-4">History, Political Science, Economics, Geography with practical applications</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Debate and public speaking</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Field visits and surveys</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Current affairs analysis</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-purple-500">
            <h3 className="text-xl font-bold mb-4">Secondary School (9-10)</h3>
            <p className="text-gray-600 mb-4">Strong foundation for board examinations with comprehensive syllabus coverage</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Regular assessments</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Remedial classes</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                <span>Career counseling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
