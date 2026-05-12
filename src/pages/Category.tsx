import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getMoviesByCategory, searchMovies, type MovieItem, type Pagination } from '../api/phimapi';
import { Search } from 'lucide-react';
import './Category.css';

const Category: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

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
          setTitle(`Kết quả tìm kiếm: "${keyword}"`);
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

  return (
    <div className="category-page container animate-fade-in">
      <div className="category-header">
        <h1 className="section-title">
          {keyword && <Search size={24} style={{ marginRight: '10px' }} />}
          {title}
        </h1>
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          {movies.length === 0 ? (
            <div className="empty-state glass-panel">
              <p>Không tìm thấy phim nào phù hợp.</p>
            </div>
          ) : (
            <div className="movie-grid">
              {movies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}

          {/* Phân trang (Đơn giản hóa) */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination glass-panel">
              <span className="page-info">Trang {pagination.currentPage} / {pagination.totalPages}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Category;
