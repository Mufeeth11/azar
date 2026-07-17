import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import SmoothScrolling from './components/SmoothScrolling';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ServiceDetail from './pages/ServiceDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Admin imports
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminMessages from './pages/admin/AdminMessages';
import AdminActivities from './pages/admin/AdminActivities';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);
  
  return (
    <SmoothScrolling>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PageTransition><Home /></PageTransition>} />
          <Route path="about" element={<PageTransition><About /></PageTransition>} />
          <Route path="services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />
          <Route path="contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        </Route>

        {/* Admin Routes (Separate Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default to activities or messages */}
          <Route index element={<AdminActivities />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="activities" element={<AdminActivities />} />
        </Route>
      </Routes>
    </SmoothScrolling>
  );
}

export default App;
