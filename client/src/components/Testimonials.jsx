import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/config';
import Header from './Header';
import Footer from './Footer';

// Static fallback testimonials (always shown)
const staticTestimonials = [
  {
    _id: 'static-1',
    name: 'Bittu Saini',
    designation: 'Chief Health Officer (CHO)',
    batch: 'Class of 2016',
    content: 'SRIC provided me with the strong foundation I needed to pursue my career in public health. The teachers\' dedication and the school\'s focus on practical knowledge were invaluable. I owe a great deal of my professional success to the values instilled in me at SRIC.',
    photoUrl: '/assets/bittu.jpeg',
    isStatic: true
  },
  {
    _id: 'static-2',
    name: 'Virendra Saini',
    designation: 'Lekhpal (Revenue Official)',
    batch: 'Class of 2017',
    content: 'The discipline and academic rigor at SRIC prepared me well for competitive exams. I\'m grateful for the guidance I received from my teachers. The environment at SRIC is truly one of a kind — nurturing, disciplined, and focused on real-world outcomes.',
    photoUrl: '/assets/virendra_saini.jpg',
    isStatic: true
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-white/20 transform hover:-translate-y-2 border border-white/20">
    {/* Header: Photo + Name */}
    <div className="flex items-center mb-4">
      <div className="relative flex-shrink-0">
        {testimonial.photoUrl ? (
          <img
            src={testimonial.photoUrl}
            alt={testimonial.name}
            className="rounded-xl w-12 h-12 object-cover border-2 border-white shadow-md"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`rounded-xl w-12 h-12 bg-gradient-to-br from-sricgold to-yellow-500 flex items-center justify-center shadow-md ${testimonial.photoUrl ? 'hidden' : 'flex'}`}
        >
          <span className="text-sricblue font-bold text-base">{testimonial.name.charAt(0)}</span>
        </div>
        {/* Gold verified badge */}
        <div className="absolute -bottom-1 -right-1 bg-sricgold rounded-full p-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-sricblue" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="ml-3">
        <h3 className="text-base font-bold text-white">{testimonial.name}</h3>
        <p className="text-sricgold text-xs font-medium">{testimonial.batch}</p>
      </div>
    </div>

    {/* Position / Designation */}
    <p className="font-semibold text-sm text-white mb-1">{testimonial.designation}</p>

    {/* Testimonial Quote */}
    <p className="text-white/80 text-xs leading-relaxed italic flex items-start">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 mt-0.5 text-sricgold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
      "{testimonial.content}"
    </p>
  </div>
);

const Testimonials = () => {
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(apiUrl('/api/testimonials'));
        const data = await res.json();
        if (data.success && data.data) {
          setDynamicTestimonials(data.data);
        }
      } catch (err) {
        // Use only static
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();

    const handleScroll = () => setShowScrollTop(window.pageYOffset > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allTestimonials = [...staticTestimonials, ...dynamicTestimonials];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Hero Section - same pattern as History page */}
      <section className="hero text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sricblue/90 to-purple-900/90 z-0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Alumni Testimonials</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
            Celebrating the voices of our students and alumni who shaped their futures at SRIC
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/admission-form"
              className="bg-sricgold hover:bg-yellow-600 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Join Our Legacy
            </Link>
            <Link
              to="/history"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Our History
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-sricblue">{allTestimonials.length}+</div>
              <div className="text-gray-500 text-sm font-medium mt-1">Alumni Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sricgold" style={{color:'#FFD700'}}>★ 5.0</div>
              <div className="text-gray-500 text-sm font-medium mt-1">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-gray-500 text-sm font-medium mt-1">Would Recommend</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">20+</div>
              <div className="text-gray-500 text-sm font-medium mt-1">Years Legacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Testimonials Section — same style as Notable Alumni in History */}
      <section className="py-20 bg-gradient-to-br from-sricblue to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-3">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Student & Alumni Voices</h2>
            <div className="w-24 h-1.5 bg-sricgold mx-auto mb-6 rounded-full"></div>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Real stories from the students and alumni who experienced SRIC's excellence first-hand
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sricgold"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {allTestimonials.map(testimonial => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          )}

          {/* Footer Badge */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <i className="fas fa-trophy text-sricgold"></i>
              <span className="font-semibold">50+ Alumni in Government Services</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — same style as History CTA */}
      <section className="py-16 bg-gradient-to-r from-sricblue to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-sricgold rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-sricgold rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Become Part of Our Story</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join our tradition of excellence and create your own legacy at SRIC
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/admission-form"
              className="bg-sricgold hover:bg-yellow-600 text-sricblue font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply for Admission
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-sricblue text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Testimonials;
