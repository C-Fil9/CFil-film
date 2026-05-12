import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, PlayCircle } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <PlayCircle className="logo-icon" size={32} />
          <span className="text-gradient">Motchill<span style={{color: 'white'}}>.Pro</span></span>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'open glass-panel' : ''}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang Chủ</Link>
          <Link to="/danh-sach/phim-le" onClick={() => setMobileMenuOpen(false)}>Phim Lẻ</Link>
          <Link to="/danh-sach/phim-bo" onClick={() => setMobileMenuOpen(false)}>Phim Bộ</Link>
          <Link to="/danh-sach/hoat-hinh" onClick={() => setMobileMenuOpen(false)}>Hoạt Hình</Link>
          <Link to="/danh-sach/tv-shows" onClick={() => setMobileMenuOpen(false)}>TV Shows</Link>
          
          <form className="search-form mobile-only" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Tìm kiếm phim..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><Search size={20} /></button>
          </form>
        </nav>

        <div className="navbar-right">
          <form className="search-form desktop-only" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Tìm kiếm phim..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><Search size={20} /></button>
          </form>
          
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
