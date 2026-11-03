import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
import Publications from './pages/Publications';
import Members from './pages/Members';
import Contact from './pages/Contact';
import Teaching from './pages/Teaching';
import News from './pages/News';
import { SiteDataProvider } from './context/SiteDataContext';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    // 페이지 전환 애니메이션이 끝난 뒤 해당 섹션으로 이동
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(hash.slice(1));
      if (el || ++tries > 20) {
        clearInterval(timer);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

// 예전 주소(/publications, ?tab=presentations)로 들어와도 새 페이지로 보냄
function OldPublications() {
  const { search } = useLocation();
  return <Navigate to={/tab=presentations/.test(search) ? '/research/presentations' : '/research/papers'} replace />;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/research" element={<Navigate to="/research/areas" replace />} />
        <Route path="/research/areas" element={<PageWrapper><Research view="areas" /></PageWrapper>} />
        <Route path="/research/projects" element={<PageWrapper><Research view="projects" /></PageWrapper>} />
        <Route path="/research/papers" element={<PageWrapper><Publications view="papers" /></PageWrapper>} />
        <Route path="/research/presentations" element={<PageWrapper><Publications view="presentations" /></PageWrapper>} />
        <Route path="/publications" element={<OldPublications />} />
        <Route path="/members" element={<PageWrapper><Members /></PageWrapper>} />
        <Route path="/teaching" element={<PageWrapper><Teaching /></PageWrapper>} />
        <Route path="/news" element={<PageWrapper><News /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <SiteDataProvider>
        <ScrollToTop />
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
        </SiteDataProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
