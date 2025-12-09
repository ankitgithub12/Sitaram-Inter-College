import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdmissionForm from './components/AdmissionForm';
import Contact from './components/Contact';
import Achievements from './components/Achievements';
import Announcements from './components/Announcements';
import Calendar from './components/Calendar';
import Mission from './components/Mission';
import History from './components/History';
import Faculty from './components/Faculty';
import Curriculum from './components/Curriculum';
import Programs from './components/Programs';
import Fees from './components/Fees';
import Process from './components/Process';
import PhotosVideos from './components/photos-videos';
import Admin from './components/admin';
import './App.css';

function App() {
  return (
    <Router>
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
          <Route path="/admin" element={<Admin />} />
          {/* Add other routes as we convert more pages */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;