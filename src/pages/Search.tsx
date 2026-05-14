import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchMovies, type MovieItem } from '../api/phimapi';
import MovieCard from '../components/MovieCard';
import './Search.css';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!keyword) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await searchMovies(keyword);
        if (res.status === 'success') {
          setMovies(res.data.items || []);
        } else {
          setError('Không tìm thấy kết quả.');
          setMovies([]);
        }
      } catch {
        setError('Có lỗi xảy ra khi tìm kiếm.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    window.scrollTo(0, 0);
  }, [keyword]);

  return (
    <div className="search-page container">
      <div className="search__header">
        <h1 className="search__title">
          Kết quả tìm kiếm cho: <span className="search__keyword">"{keyword}"</span>
        </h1>
        {loading ? (
          <p className="search__subtitle">Đang tìm kiếm...</p>
        ) : (
          <p className="search__subtitle">
            Tìm thấy {movies.length} kết quả phù hợp
          </p>
        )}
      </div>

      {loading ? (
        <div className="loading-container" style={{ minHeight: '40vh' }}>
          <div className="loading-spinner" />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : movies.length > 0 ? (
        <div className="search__grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
            />
          ))}
        </div>
      ) : (
        <div className="search__empty glass-panel">
          <SearchIcon size={48} className="search__empty-icon" />
          <h2>Không tìm thấy phim nào</h2>
          <p>Thử tìm kiếm với một từ khóa khác xem sao!</p>
        </div>
      )}
    </div>
  );
};

export default Search;
