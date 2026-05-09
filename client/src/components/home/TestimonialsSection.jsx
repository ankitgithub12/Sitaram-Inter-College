import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Static fallback testimonials (always shown)
const staticTestimonials = [
  {
    _id: 'static-1',
    name: 'Bittu Saini',
    designation: 'Chief Health Officer (CHO)',
    batch: 'Class of 2016',
    content: 'SRIC provided me with the strong foundation I needed to pursue my career in public health. The teachers\' dedication and the school\'s focus on practical knowledge were invaluable.',
    rating: 5,
    photoUrl: '/assets/bittu.jpeg',
    isStatic: true
  },
  {
    _id: 'static-2',
    name: 'Virendra Saini',
    designation: 'Lekhpal',
    batch: 'Class of 2017',
    content: 'The discipline and academic rigor at SRIC prepared me well for competitive exams. I\'m grateful for the guidance I received from my teachers.',
    rating: 5,
    photoUrl: '/assets/virendra_saini.jpg',
    isStatic: true
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-white/20 transform hover:-translate-y-2 border border-white/20">
    {/* Header: Photo + Name */}
    <div className="flex items-center mb-5">
      <div className="relative flex-shrink-0">
        {testimonial.photoUrl ? (
          <img
            src={testimonial.photoUrl}
            alt={testimonial.name}
            className="rounded-xl w-16 h-16 object-cover border-2 border-white shadow-md"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`rounded-xl w-16 h-16 bg-gradient-to-br from-sricgold to-yellow-500 flex items-center justify-center shadow-md ${testimonial.photoUrl ? 'hidden' : 'flex'}`}
        >
          <span className="text-sricblue font-bold text-xl">{testimonial.name.charAt(0)}</span>
        </div>
        {/* Gold verified badge */}
        <div className="absolute -bottom-1 -right-1 bg-sricgold rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sricblue" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="ml-5">
        <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
        <p className="text-sricgold text-sm font-medium">{testimonial.batch}</p>
      </div>
    </div>

    {/* Position / Designation */}
    <p className="font-semibold text-base text-white mb-1">{testimonial.designation}</p>

    {/* Testimonial Quote */}
    <p className="text-white/80 text-sm leading-relaxed italic flex items-start">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-sricgold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
      "{testimonial.content}"
    </p>
  </div>
);

const TestimonialsSection = () => {
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setDynamicTestimonials(data.data.slice(0, 4));
        }
      } catch (err) {
        // Use only static testimonials
      }
    };
    fetchTestimonials();
  }, []);

  // Combine: static first, then dynamic admin ones (max 6 shown)
  const allTestimonials = [...staticTestimonials, ...dynamicTestimonials].slice(0, 6);

  return (
    <section className="py-20 bg-gradient-to-br from-sricblue to-purple-900 text-white">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-3">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Students Say</h2>
          <div className="w-24 h-1.5 bg-sricgold mx-auto mb-6 rounded-full"></div>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Hear from our alumni about their SRIC experience
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {allTestimonials.map(testimonial => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </div>

        {/* Footer Badge + View More */}
        <div className="text-center mt-12 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <i className="fas fa-quote-left text-sricgold"></i>
            <span className="font-semibold">Voices of Our SRIC Family</span>
          </div>
          <div className="block">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 mt-4 px-8 py-3 bg-sricgold text-sricblue font-bold rounded-lg hover:bg-sricgold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Testimonials
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
