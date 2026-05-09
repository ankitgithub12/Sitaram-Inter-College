import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [apiUrl] = useState('/api');

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting contact form:', formData);

      const response = await axios.post(`${apiUrl}/contact`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        showToast('✅ Your message has been sent successfully! We will respond within 24 hours.', 'success');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);

      // Handle specific error messages
      if (error.response) {
        showToast(`❌ ${error.response.data.message || 'Error sending message'}`, 'error');
      } else if (error.request) {
        showToast('❌ Network error. Please check your connection or if the server is running.', 'error');
      } else {
        showToast(`❌ ${error.message}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle FAQ
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What are the admission requirements for SRIC?",
      answer: "Admission to SRIC requires submission of previous school records, passing an entrance assessment (for certain classes), and completion of the admission form with necessary documents. Please visit our Admissions page for detailed requirements."
    },
    {
      question: "What is the school fee structure?",
      answer: "Our fee structure varies by class and program. Fees include tuition, laboratory charges (for science students), and annual charges. We offer sibling discounts and scholarships for meritorious students. Please contact our office for the detailed fee structure."
    },
    {
      question: "What transportation options are available?",
      answer: "SRIC operates school buses covering major routes in Amroha and nearby areas. We also have arrangements with local transport providers. Detailed route information and fees are available at the school office."
    },
    {
      question: "What extracurricular activities are offered?",
      answer: "We offer a wide range of extracurricular activities including sports (cricket, football, basketball, athletics), cultural programs (music, dance, drama), science clubs, debate teams, and more. These activities are an integral part of our holistic education approach."
    },
    {
      question: "How can parents get involved in school activities?",
      answer: "We encourage parent involvement through our Parent-Teacher Association (PTA), volunteering opportunities for events, and regular parent-teacher meetings. Parents can also participate in our school's advisory committees."
    }
  ];

  const stats = [
    { icon: "fas fa-clock", text: "24h Response Time" },
    { icon: "fas fa-user-check", text: "Personalized Guidance" },
    { icon: "fas fa-calendar-check", text: "Flexible Appointment Times" },
    { icon: "fas fa-headset", text: "Dedicated Support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-xl text-white font-semibold shadow-2xl transform transition-all duration-500 ${
          toast.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
            : 'bg-gradient-to-r from-red-500 to-pink-600'
        } ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'}`}>
          <div className="flex items-center">
            <i className={`mr-3 text-xl ${
              toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
            }`}></i>
            <span className="text-lg">{toast.message}</span>
          </div>
        </div>
      )}
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero text-white py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch With SRIC</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We'd love to hear from you! Reach out for inquiries, admissions, or any questions about our school.
            </p>
            <div className="mt-8 flex justify-center flex-col sm:flex-row gap-4">
              <a 
                href="#contact-form" 
                className="bg-sricgold hover:bg-yellow-500 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Send Message
              </a>
              <a 
                href="#map" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Visit Us
              </a>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Address Card */}
              <div className="contact-card bg-gradient-to-br from-sricblue to-blue-800 text-white p-8 rounded-xl shadow-lg transition duration-300 text-center hover:transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-white text-sricblue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-map-marker-alt text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Our Location</h3>
                <p className="mb-2">Sabdalpur Sharki, Mathana Road</p>
                <p>Hasanpur, Amroha 244242</p>
                <a href="#map" className="mt-4 inline-block text-sricgold font-medium hover:underline">
                  View on Map
                </a>
              </div>
              
              {/* Contact Card */}
              <div className="contact-card bg-gradient-to-br from-sricgold to-yellow-500 text-sricblue p-8 rounded-xl shadow-lg transition duration-300 text-center hover:transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-sricblue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-phone-alt text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <p className="mb-2">+91 9756517750</p>
                <p>+91 9639800912</p>
                <a href="tel:+919756517750" className="mt-4 inline-block text-sricblue font-medium hover:underline">
                  Call Now
                </a>
              </div>
              
              {/* Email Card */}
              <div className="contact-card bg-gradient-to-br from-sricblue to-blue-800 text-white p-8 rounded-xl shadow-lg transition duration-300 text-center hover:transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-white text-sricblue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-envelope text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Email Us</h3>
                <p className="mb-2">Yespalsinghsaini@gmail.com</p>
                <p>sitaramintercollege1205@gmail.com</p>
                <a href="mailto:Yespalsinghsaini@gmail.com" className="mt-4 inline-block text-sricgold font-medium hover:underline">
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-sricblue mb-4">Get In Touch</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about admissions, programs, or anything else? Fill out the form below and we'll respond as soon as possible.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div id="contact-form" className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-sricblue mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                       Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-sricblue focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-sricblue focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-sricblue focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter your phone number"
                      pattern="[0-9]{10}"
                      title="Please enter a 10-digit phone number"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-sricblue focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                    >
                      <option value="">Select a subject</option>
                      <option value="admission">Admission Inquiry</option>
                      <option value="academics">Academic Programs</option>
                      <option value="fee">Fee Structure</option>
                      <option value="transport">Transportation</option>
                      <option value="feedback">Feedback/Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-sricblue focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400 resize-none"
                      placeholder="Write your message here..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-sricblue to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold text-lg py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                    <span className="relative">
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send Message
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
              
              {/* Map and Hours */}
              <div>
                {/* Map */}
                <div id="map" className="map-container mb-8 shadow-lg rounded-xl overflow-hidden h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d779.5927398976055!2d78.40791199086254!3d28.68207662269878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390b11d935474883%3A0xa3ba85ca0d4d3ab6!2sSitaram%20Inter%20college%20sabdalpur%20SHARKI%20Amroha!5e0!3m2!1sen!2sin!4v1765224726468!5m2!1sen!2sin" 
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SRIC Location Map"
                  ></iframe>
                </div>
                
                {/* Office Hours */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-sricblue mb-6">Office Hours</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between border-b border-gray-100 pb-3">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-semibold">8:00 AM - 2:00 PM</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-3">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-semibold">9:00 AM - 1:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-semibold text-red-500">Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-sricblue mb-8">FAQ</h2>
            <div className="max-w-3xl mx-auto text-left">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-4 border-b pb-4">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full font-bold text-sricblue text-lg hover:text-blue-700 transition"
                  >
                    <span>{faq.question}</span>
                    <i className={`fas fa-chevron-${openFaq === index ? 'up' : 'down'}`}></i>
                  </button>
                  {openFaq === index && (
                    <p className="mt-4 text-gray-600 animate-fade-in">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-sricblue text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <i className={`${stat.icon} text-4xl mb-4 text-sricgold`}></i>
                  <p className="font-bold">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;