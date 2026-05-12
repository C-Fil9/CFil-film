import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import MovieCard from '../components/MovieCard';
import { getLatestMovies, getMoviesByCategory, type MovieItem } from '../api/phimapi';
import './Home.css';

const Home: React.FC = () => {
  const [latestMovies, setLatestMovies] = useState<MovieItem[]>([]);
  const [phimLe, setPhimLe] = useState<MovieItem[]>([]);
  const [phimBo, setPhimBo] = useState<MovieItem[]>([]);
  const [hoatHinh, setHoatHinh] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [latestRes, phimLeRes, phimBoRes, hoatHinhRes] = await Promise.all([
          getLatestMovies(1),
          getMoviesByCategory('phim-le', 1),
          getMoviesByCategory('phim-bo', 1),
          getMoviesByCategory('hoat-hinh', 1)
        ]);

        setLatestMovies(latestRes.items || []);
        setPhimLe(phimLeRes.data?.items?.slice(0, 12) || []);
        setPhimBo(phimBoRes.data?.items?.slice(0, 12) || []);
        setHoatHinh(hoatHinhRes.data?.items?.slice(0, 12) || []);
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="home-page animate-fade-in">
      <HeroSlider movies={latestMovies} />
      
      <div className="container content-section">
        {/* Phim Mới */}
        <section className="movie-section">
          <div className="section-header">
            <h2 className="section-title">Phim Mới Cập Nhật</h2>
          </div>
          <div className="movie-grid">
            {latestMovies.slice(5, 17).map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Phim Lẻ */}
        <section className="movie-section">
          <div className="section-header">
            <h2 className="section-title">Phim Lẻ Mới</h2>
            <Link to="/danh-sach/phim-le" className="view-more">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="movie-grid">
            {phimLe.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Phim Bộ */}
        <section className="movie-section">
          <div className="section-header">
            <h2 className="section-title">Phim Bộ Mới</h2>
            <Link to="/danh-sach/phim-bo" className="view-more">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="movie-grid">
            {phimBo.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Hoạt Hình */}
        <section className="movie-section">
          <div className="section-header">
            <h2 className="section-title">Hoạt Hình</h2>
            <Link to="/danh-sach/hoat-hinh" className="view-more">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="movie-grid">
            {hoatHinh.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
