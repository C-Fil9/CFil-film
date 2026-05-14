import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import MovieDetails from './pages/MovieDetails';
import Watch from './pages/Watch';
import Search from './pages/Search';
import './App.css';

// Component để cuộn lên đầu trang khi chuyển route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/danh-sach/:type" element={<Category />} />
            <Route path="/search" element={<Search />} />
            <Route path="/phim/:slug" element={<MovieDetails />} />
            <Route path="/xem-phim/:slug/:episode" element={<Watch />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
