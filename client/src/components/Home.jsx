import React from 'react';
import Header from './Header';
import Footer from './Footer';
import HeroSection from './home/HeroSection';
import AboutIntro from './home/AboutIntro';
import StatsSection from './home/StatsSection';
import ExamSchedules from './home/ExamSchedules';
import ToppersSection from './home/ToppersSection';
import ProgramsSection from './home/ProgramsSection';
import TestimonialsSection from './home/TestimonialsSection';
import CtaSection from './home/CtaSection';

const Home = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <HeroSection />
      <AboutIntro />
      <StatsSection />
      <ExamSchedules />
      <ToppersSection />
      <ProgramsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Home;