import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, Sparkles, Loader2 } from 'lucide-react';
import { searchMovies, getImageUrl, type MovieItem } from '../api/phimapi';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [liveResults, setLiveResults] = useState<MovieItem[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cdnDomain, setCdnDomain] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Live Search Effect (Debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setIsSearchingLive(true);

    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies(searchQuery, 5); // Limit to 5 results
        if (res.status === 'success') {
          setLiveResults(res.data.items || []);
          setCdnDomain(res.data.APP_DOMAIN_CDN_IMAGE || '');
        } else {
          setLiveResults([]);
        }
      } catch (error) {
        console.error("Live search failed", error);
        setLiveResults([]);
      } finally {
        setIsSearchingLive(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
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
            <div className="navbar__search-wrapper" style={{ position: 'relative' }}>
              <form
                ref={searchContainerRef}
                className={`navbar__search ${searchFocused || showDropdown ? 'navbar__search--focused' : ''}`}
                onSubmit={handleSearch}
              >
                <Search className="navbar__search-icon" size={18} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm phim, diễn viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setSearchFocused(true);
                    if (searchQuery.trim()) setShowDropdown(true);
                  }}
                  onBlur={() => setSearchFocused(false)}
                  className="navbar__search-input"
                  id="search-input"
                />
                {(searchQuery && !isSearchingLive) && (
                  <button type="button" className="navbar__search-clear" onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}>
                    <X size={16} />
                  </button>
                )}
                {isSearchingLive && (
                  <Loader2 size={16} className="navbar__search-spinner" />
                )}
              </form>

              {/* Live Search Dropdown */}
              {showDropdown && searchQuery.trim().length > 0 && (
                <div className="navbar__search-dropdown">
                  <div className="navbar__search-dropdown-header">
                    Danh sách phim
                  </div>
                  <div className="navbar__search-dropdown-list">
                    {isSearchingLive && liveResults.length === 0 ? (
                      <div className="navbar__search-dropdown-empty">Đang tìm kiếm...</div>
                    ) : liveResults.length > 0 ? (
                      liveResults.map((movie) => (
                        <Link
                          key={movie._id}
                          to={`/phim/${movie.slug}`}
                          className="navbar__search-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          <img src={getImageUrl(movie.thumb_url, cdnDomain)} alt={movie.name} />
                          <div className="navbar__search-item-info">
                            <h4>{movie.name}</h4>
                            <p>{movie.origin_name}</p>
                            <span>{movie.year}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="navbar__search-dropdown-empty">Không tìm thấy kết quả.</div>
                    )}
                  </div>
                  <button className="navbar__search-dropdown-footer" onClick={() => handleSearch()}>
                    Toàn bộ kết quả
                  </button>
                </div>
              )}
            </div>

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
