import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, Sparkles, Loader2, ChevronDown, Tags, Globe, MapPin } from 'lucide-react';
import { searchMovies, getImageUrl, type MovieItem } from '../api/phimapi';
import './Navbar.css';

// Genre list for dropdown
const GENRE_LIST = [
  { name: 'Hành Động', slug: 'hanh-dong' },
  { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Hài Hước', slug: 'hai-huoc' },
  { name: 'Kinh Dị', slug: 'kinh-di' },
  { name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { name: 'Tâm Lý', slug: 'tam-ly' },
  { name: 'Phiêu Lưu', slug: 'phieu-luu' },
  { name: 'Hoạt Hình', slug: 'hoat-hinh' },
  { name: 'Chính Kịch', slug: 'chinh-kich' },
  { name: 'Hình Sự', slug: 'hinh-su' },
  { name: 'Khoa Học', slug: 'khoa-hoc' },
  { name: 'Âm Nhạc', slug: 'am-nhac' },
  { name: 'Chiến Tranh', slug: 'chien-tranh' },
  { name: 'Thể Thao', slug: 'the-thao' },
  { name: 'Gia Đình', slug: 'gia-dinh' },
  { name: 'Cổ Trang', slug: 'co-trang' },
  { name: 'Bí Ẩn', slug: 'bi-an' },
  { name: 'Phim 18+', slug: 'phim-18' },
];

const COUNTRY_LIST = [
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Trung Quốc', slug: 'trung-quoc' },
  { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Thái Lan', slug: 'thai-lan' },
  { name: 'Đài Loan', slug: 'dai-loan' },
  { name: 'Hồng Kông', slug: 'hong-kong' },
  { name: 'Ấn Độ', slug: 'an-do' },
  { name: 'Anh', slug: 'anh' },
  { name: 'Pháp', slug: 'phap' },
  { name: 'Việt Nam', slug: 'viet-nam' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [liveResults, setLiveResults] = useState<MovieItem[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cdnDomain, setCdnDomain] = useState('');
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [genreMenuTab, setGenreMenuTab] = useState<'genre' | 'country'>('genre');
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const genreMenuRef = useRef<HTMLDivElement>(null);
  const genreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (genreMenuRef.current && !genreMenuRef.current.contains(e.target as Node)) {
        setShowGenreMenu(false);
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiveResults([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowDropdown(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowGenreMenu(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileGenreOpen(false);
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

  const handleGenreMouseEnter = () => {
    if (genreTimeoutRef.current) clearTimeout(genreTimeoutRef.current);
    setShowGenreMenu(true);
  };

  const handleGenreMouseLeave = () => {
    genreTimeoutRef.current = setTimeout(() => {
      setShowGenreMenu(false);
    }, 200);
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

  const isGenreActive = () => {
    return location.pathname.startsWith('/the-loai') || location.pathname.startsWith('/loc/');
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

            {/* Genre Mega Dropdown */}
            <div 
              className="navbar__genre-wrapper"
              ref={genreMenuRef}
              onMouseEnter={handleGenreMouseEnter}
              onMouseLeave={handleGenreMouseLeave}
            >
              <Link
                to="/the-loai"
                className={`navbar__link navbar__link--genre ${isGenreActive() ? 'navbar__link--active' : ''}`}
              >
                <Tags size={14} />
                Thể Loại
                <ChevronDown size={14} className={`navbar__genre-arrow ${showGenreMenu ? 'navbar__genre-arrow--open' : ''}`} />
                <span className="navbar__link-indicator" />
              </Link>

              {/* Mega Menu */}
              <div className={`navbar__mega-menu ${showGenreMenu ? 'navbar__mega-menu--open' : ''}`}>
                <div className="navbar__mega-menu-inner">
                  {/* Tab Switcher */}
                  <div className="navbar__mega-tabs">
                    <button 
                      className={`navbar__mega-tab ${genreMenuTab === 'genre' ? 'navbar__mega-tab--active' : ''}`}
                      onClick={() => setGenreMenuTab('genre')}
                    >
                      <Tags size={14} />
                      Thể Loại
                    </button>
                    <button 
                      className={`navbar__mega-tab ${genreMenuTab === 'country' ? 'navbar__mega-tab--active' : ''}`}
                      onClick={() => setGenreMenuTab('country')}
                    >
                      <MapPin size={14} />
                      Quốc Gia
                    </button>
                  </div>

                  {/* Genre Links */}
                  {genreMenuTab === 'genre' ? (
                    <div className="navbar__mega-grid">
                      {GENRE_LIST.map(genre => (
                        <Link
                          key={genre.slug}
                          to={`/loc/the-loai/${genre.slug}`}
                          className="navbar__mega-item"
                          onClick={() => setShowGenreMenu(false)}
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="navbar__mega-grid navbar__mega-grid--country">
                      {COUNTRY_LIST.map(country => (
                        <Link
                          key={country.slug}
                          to={`/loc/quoc-gia/${country.slug}`}
                          className="navbar__mega-item"
                          onClick={() => setShowGenreMenu(false)}
                        >
                          <Globe size={13} />
                          {country.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <Link 
                    to="/the-loai" 
                    className="navbar__mega-footer"
                    onClick={() => setShowGenreMenu(false)}
                  >
                    Xem tất cả thể loại →
                  </Link>
                </div>
              </div>
            </div>
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

          {/* Mobile Genre Accordion */}
          <button 
            className={`mobile-menu__link mobile-menu__genre-toggle ${isGenreActive() ? 'mobile-menu__link--active' : ''}`}
            onClick={() => setMobileGenreOpen(!mobileGenreOpen)}
            style={{ animationDelay: `${navLinks.length * 0.05}s` }}
          >
            <Tags size={16} className="mobile-menu__link-icon" />
            Thể Loại
            <ChevronDown size={16} className={`mobile-menu__genre-arrow ${mobileGenreOpen ? 'mobile-menu__genre-arrow--open' : ''}`} />
          </button>

          {mobileGenreOpen && (
            <div className="mobile-menu__genre-list">
              <div className="mobile-menu__genre-section">
                <span className="mobile-menu__genre-label">Thể loại phim</span>
                <div className="mobile-menu__genre-chips">
                  {GENRE_LIST.map(genre => (
                    <Link
                      key={genre.slug}
                      to={`/loc/the-loai/${genre.slug}`}
                      className="mobile-menu__genre-chip"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mobile-menu__genre-section">
                <span className="mobile-menu__genre-label">Quốc gia</span>
                <div className="mobile-menu__genre-chips">
                  {COUNTRY_LIST.map(country => (
                    <Link
                      key={country.slug}
                      to={`/loc/quoc-gia/${country.slug}`}
                      className="mobile-menu__genre-chip"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link 
                to="/the-loai" 
                className="mobile-menu__genre-viewall"
                onClick={() => setMobileMenuOpen(false)}
              >
                Xem tất cả →
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
