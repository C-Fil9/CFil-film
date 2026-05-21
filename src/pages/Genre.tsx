import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getMoviesByGenre, getMoviesByCountry, type MovieItem, type Pagination } from '../api/phimapi';
import { 
  Swords, Heart, Laugh, Ghost, Sparkles, Brain, Compass, Baby, 
  Drama, Microscope, Rocket, Music2, Shield, Users,
  Globe, ChevronLeft, ChevronRight, Frown, Tags, Film, MapPin,
  Flame, Crown, Star
} from 'lucide-react';
import './Genre.css';

// Danh sách thể loại phim
const GENRES = [
  { name: 'Hành Động', slug: 'hanh-dong', icon: Swords, color: '#ff4d6d' },
  { name: 'Tình Cảm', slug: 'tinh-cam', icon: Heart, color: '#ff6b9d' },
  { name: 'Hài Hước', slug: 'hai-huoc', icon: Laugh, color: '#ffd93d' },
  { name: 'Kinh Dị', slug: 'kinh-di', icon: Ghost, color: '#6c5ce7' },
  { name: 'Viễn Tưởng', slug: 'vien-tuong', icon: Rocket, color: '#00b4d8' },
  { name: 'Tâm Lý', slug: 'tam-ly', icon: Brain, color: '#e17055' },
  { name: 'Phiêu Lưu', slug: 'phieu-luu', icon: Compass, color: '#00cec9' },
  { name: 'Hoạt Hình', slug: 'hoat-hinh', icon: Baby, color: '#fdcb6e' },
  { name: 'Chính Kịch', slug: 'chinh-kich', icon: Drama, color: '#a29bfe' },
  { name: 'Hình Sự', slug: 'hinh-su', icon: Shield, color: '#636e72' },
  { name: 'Khoa Học', slug: 'khoa-hoc', icon: Microscope, color: '#0984e3' },
  { name: 'Âm Nhạc', slug: 'am-nhac', icon: Music2, color: '#e84393' },
  { name: 'Chiến Tranh', slug: 'chien-tranh', icon: Flame, color: '#d63031' },
  { name: 'Thể Thao', slug: 'the-thao', icon: Crown, color: '#27ae60' },
  { name: 'Gia Đình', slug: 'gia-dinh', icon: Users, color: '#74b9ff' },
  { name: 'Cổ Trang', slug: 'co-trang', icon: Star, color: '#fab1a0' },
  { name: 'Phim 18+', slug: 'phim-18', icon: Flame, color: '#e74c3c' },
  { name: 'Bí Ẩn', slug: 'bi-an', icon: Sparkles, color: '#8e44ad' },
];

// Danh sách quốc gia
const COUNTRIES = [
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
  { name: 'Philippin', slug: 'philippines' },
];

type FilterType = 'the-loai' | 'quoc-gia';

const Genre: React.FC = () => {
  const { filterType, slug } = useParams<{ filterType: string; slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState<FilterType>('the-loai');

  const currentPage = parseInt(searchParams.get('page') || '1');

  // Determine current state
  const isShowingMovies = !!slug && !!filterType;

  useEffect(() => {
    if (filterType === 'quoc-gia') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('quoc-gia');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('the-loai');
    }
  }, [filterType]);

  useEffect(() => {
    if (!slug || !filterType) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        let res;
        if (filterType === 'the-loai') {
          res = await getMoviesByGenre(slug, currentPage);
        } else {
          res = await getMoviesByCountry(slug, currentPage);
        }

        if (res && res.data) {
          setMovies(res.data.items || []);
          setPagination(res.data.params?.pagination || null);
          setTitle(res.data.titlePage || '');
        }
      } catch (error) {
        console.error("Error fetching genre movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filterType, slug, currentPage]);

  const goToPage = (page: number) => {
    navigate(`/loc/${filterType}/${slug}?page=${page}`);
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const pages: (number | string)[] = [];
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  };

  return (
    <div className="genre-page" id="genre-page">
      <div className="container">
        {/* Page Header */}
        <div className="genre-page__header">
          <div className="genre-page__header-content">
            <div className="genre-page__icon-wrapper">
              <Tags size={24} />
            </div>
            <div>
              <h1 className="genre-page__title">
                {isShowingMovies 
                  ? title 
                  : 'Khám Phá Theo Thể Loại'}
              </h1>
              <p className="genre-page__subtitle">
                {isShowingMovies 
                  ? `${pagination?.totalItems?.toLocaleString() || 0} phim` 
                  : 'Tìm phim yêu thích theo thể loại và quốc gia'}
              </p>
            </div>
          </div>

          {/* Back button when viewing movies */}
          {isShowingMovies && (
            <Link to="/the-loai" className="genre-page__back-btn">
              <ChevronLeft size={18} />
              Tất cả thể loại
            </Link>
          )}
        </div>

        {/* Tab Switcher - always visible */}
        <div className="genre-page__tabs">
          <button 
            className={`genre-page__tab ${activeTab === 'the-loai' ? 'genre-page__tab--active' : ''}`}
            onClick={() => {
              setActiveTab('the-loai');
              if (isShowingMovies) navigate('/the-loai');
            }}
          >
            <Film size={16} />
            Thể Loại
          </button>
          <button 
            className={`genre-page__tab ${activeTab === 'quoc-gia' ? 'genre-page__tab--active' : ''}`}
            onClick={() => {
              setActiveTab('quoc-gia');
              if (isShowingMovies) navigate('/the-loai');
            }}
          >
            <MapPin size={16} />
            Quốc Gia
          </button>
        </div>

        {/* Content */}
        {!isShowingMovies ? (
          <>
            {/* Genre/Country Grid */}
            {activeTab === 'the-loai' ? (
              <div className="genre-grid">
                {GENRES.map((genre, index) => {
                  const IconComp = genre.icon;
                  return (
                    <Link
                      key={genre.slug}
                      to={`/loc/the-loai/${genre.slug}`}
                      className="genre-card"
                      style={{ 
                        animationDelay: `${index * 0.04}s`,
                        '--genre-color': genre.color
                      } as React.CSSProperties}
                      id={`genre-${genre.slug}`}
                    >
                      <div className="genre-card__icon">
                        <IconComp size={28} />
                      </div>
                      <span className="genre-card__name">{genre.name}</span>
                      <div className="genre-card__glow" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="country-grid">
                {COUNTRIES.map((country, index) => (
                  <Link
                    key={country.slug}
                    to={`/loc/quoc-gia/${country.slug}`}
                    className="country-card"
                    style={{ animationDelay: `${index * 0.04}s` }}
                    id={`country-${country.slug}`}
                  >
                    <Globe size={20} className="country-card__icon" />
                    <span className="country-card__name">{country.name}</span>
                    <ChevronRight size={16} className="country-card__arrow" />
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Active Genre/Country Pills */}
            <div className="genre-page__filter-row">
              {activeTab === 'the-loai' ? (
                <div className="genre-pills">
                  {GENRES.map(genre => (
                    <Link
                      key={genre.slug}
                      to={`/loc/the-loai/${genre.slug}`}
                      className={`genre-pill ${genre.slug === slug ? 'genre-pill--active' : ''}`}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="genre-pills">
                  {COUNTRIES.map(country => (
                    <Link
                      key={country.slug}
                      to={`/loc/quoc-gia/${country.slug}`}
                      className={`genre-pill ${country.slug === slug ? 'genre-pill--active' : ''}`}
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Movie Grid */}
            {loading ? (
              <div className="genre-page__loading">
                <div className="loading-spinner" />
              </div>
            ) : movies.length === 0 ? (
              <div className="genre-page__empty glass-panel">
                <Frown size={48} className="genre-page__empty-icon" />
                <h3>Không tìm thấy phim</h3>
                <p>Thể loại này chưa có phim nào hoặc đang được cập nhật.</p>
                <Link to="/the-loai" className="btn-primary">
                  Quay lại
                </Link>
              </div>
            ) : (
              <div className="movie-grid">
                {movies.map((movie, index) => (
                  <MovieCard key={movie._id} movie={movie} index={index} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="category__pagination">
                <button
                  className="category__page-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {getPageNumbers().map((page, idx) => (
                  typeof page === 'number' ? (
                    <button
                      key={idx}
                      className={`category__page-btn ${page === currentPage ? 'category__page-btn--active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="category__page-dots">...</span>
                  )
                ))}

                <button
                  className="category__page-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Genre;
