import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, Sparkles } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchFocused(false);
      searchInputRef.current?.blur();
    }
  };

  const navLinks = [
    { path: '/', label: 'Trang Chủ' },
    { path: '/danh-sach/phim-le', label: 'Phim Lẻ' },
    { path: '/danh-sach/phim-bo', label: 'Phim Bộ' },
    { path: '/danh-sach/hoat-hinh', label: 'Hoạt Hình' },
    { path: '/danh-sach/tv-shows', label: 'TV Shows' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-icon">
              <Film size={22} />
            </div>
            <span className="navbar__logo-text">
              <span className="text-gradient">CFil</span>
              <span className="navbar__logo-dot">.vn</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar__nav">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
              >
                {link.label}
                <span className="navbar__link-indicator" />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="navbar__actions">
            <form
              className={`navbar__search ${searchFocused ? 'navbar__search--focused' : ''}`}
              onSubmit={handleSearch}
            >
              <Search className="navbar__search-icon" size={18} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm phim, diễn viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="navbar__search-input"
                id="search-input"
              />
            </form>

            <button
              className="navbar__menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              id="menu-toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'mobile-overlay--active' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      
      {/* Mobile Menu */}
      <aside className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__header">
          <Link to="/" className="navbar__logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="navbar__logo-icon">
              <Film size={22} />
            </div>
            <span className="navbar__logo-text">
              <span className="text-gradient">CFil</span>
              <span className="navbar__logo-dot">.vn</span>
            </span>
          </Link>
          <button className="navbar__menu-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <form className="mobile-menu__search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm phim, diễn viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <nav className="mobile-menu__nav">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-menu__link ${isActive(link.path) ? 'mobile-menu__link--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Sparkles size={16} className="mobile-menu__link-icon" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
