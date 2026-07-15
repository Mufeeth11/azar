import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';
import SmoothScrolling from './components/SmoothScrolling';
// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

// Loading Fallback
const PageLoader = () => (
  <div className="w-full h-screen bg-[#020000] flex items-center justify-center">
    <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#FFC527] animate-spin"></div>
  </div>
);

function App() {
  return (
    <SmoothScrolling>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </SmoothScrolling>
  );
}

export default App;
