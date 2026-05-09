import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdmissionForm from './components/student/AdmissionForm';
import Contact from './components/Contact';
import Achievements from './components/Achievements';
import Announcements from './components/Announcements';
import Calendar from './components/Calendar';
import Mission from './components/Mission';
import History from './components/History';
import Faculty from './components/Faculty';
import Curriculum from './components/Curriculum';
import Programs from './components/Programs';
import Fees from './components/student/Fees';
import Process from './components/Process';
import PhotosVideos from './components/photos-videos';
import Admin from './components/admin';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import Chatbot from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';
import Testimonials from './components/Testimonials';
import MobileBottomNav from './components/MobileBottomNav';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admission-form" element={<AdmissionForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/achievements" element={<Achievements/>}/>
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/mission" element={<Mission/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path ="/faculty" element={<Faculty/>}/>
          <Route path ="/curriculum" element={<Curriculum/>}/>
          <Route path ="/programs" element={<Programs/>}/>
          <Route path ="/fees" element={<Fees/>}/>
          <Route path ="/process" element={<Process/>}/>
          <Route path="/photos-videos" element={<PhotosVideos/>}/>
          <Route path="/testimonials" element={<Testimonials/>}/>
          <Route path="/admin" element={<Admin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        </Routes>
        {/* Global Chatbot Component */}
        <Chatbot />
        {/* Mobile App-style Navigation */}
        <MobileBottomNav />
      </div>
    </Router>
  );
}

export default App;