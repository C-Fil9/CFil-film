import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getMoviesByCategory, searchMovies, type MovieItem, type Pagination } from '../api/phimapi';
import { Search, Film, ChevronLeft, ChevronRight, Frown } from 'lucide-react';
import './Category.css';

const Category: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const navigate = useNavigate();

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        let res;
        if (keyword) {
          res = await searchMovies(keyword);
          setTitle(`Kết quả: "${keyword}"`);
        } else if (type) {
          res = await getMoviesByCategory(type, currentPage);
          setTitle(res.data?.titlePage || 'Danh sách phim');
        }

        if (res && res.data) {
          setMovies(res.data.items || []);
          setPagination(res.data.params?.pagination);
        }
      } catch (error) {
        console.error("Error fetching category", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [type, keyword, currentPage]);

  const goToPage = (page: number) => {
    if (type) {
      navigate(`/danh-sach/${type}?page=${page}`);
    }
  };

  // Generate page numbers for pagination
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
    <div className="category" id="category-page">
      <div className="container">
        {/* Header */}
        <div className="category__header">
          <div className="category__title-row">
            <div className="category__icon-wrapper">
              {keyword ? <Search size={22} /> : <Film size={22} />}
            </div>
            <div>
              <h1 className="category__title">{title}</h1>
              {pagination && (
                <p className="category__count">
                  Tìm thấy {pagination.totalItems.toLocaleString()} kết quả
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="category__loading">
            <div className="loading-spinner" />
          </div>
        ) : (
          <>
            {movies.length === 0 ? (
              <div className="category__empty glass-panel">
                <Frown size={48} className="category__empty-icon" />
                <h3>Không tìm thấy kết quả</h3>
                <p>Thử tìm kiếm với từ khóa khác hoặc duyệt danh mục phim.</p>
                <Link to="/" className="btn-primary">
                  Về Trang Chủ
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

export default Category;
