import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './views/layouts/MainLayout';
import Dashboard from './views/pages/Dashboard';
import Members from './views/pages/Members';
import Tutors from './views/pages/Tutors';
import TutorDetails from './views/pages/TutorDetails';
import ProSel from './views/pages/ProSel';
import Newsletter from './views/pages/Newsletter';
import ArticleDetails from './views/pages/ArticleDetails';
import Projects from './views/pages/Projects';
import ProjectDetails from './views/pages/ProjectDetails';
import Login from './views/pages/Login';
import Admin from './views/pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

import About from './views/pages/About';
import Partnerships from './views/pages/Partnerships';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="tutors" element={<Tutors />} />
          <Route path="tutors/:id" element={<TutorDetails />} />
          <Route path="prosel" element={<ProSel />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="newsletter/:id" element={<ArticleDetails />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="partnerships" element={<Partnerships />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
