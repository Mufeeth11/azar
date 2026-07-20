import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ServiceDetail from './pages/ServiceDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PageTransition><Home /></PageTransition>} />
        <Route path="about" element={<PageTransition><About /></PageTransition>} />
        <Route path="services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />
        <Route path="contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="signup" element={<PageTransition><SignUp /></PageTransition>} />
      </Route>
    </Routes>
  );
}

export default App;
