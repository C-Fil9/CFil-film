import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Clapperboard, Tv, Sparkles } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import MovieCard from '../components/MovieCard';
import { getLatestMovies, getMoviesByCategory, type MovieItem } from '../api/phimapi';
import './Home.css';

interface MovieSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  link: string;
  movies: MovieItem[];
}

const Home: React.FC = () => {
  const [latestMovies, setLatestMovies] = useState<MovieItem[]>([]);
  const [sections, setSections] = useState<MovieSection[]>([]);
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
        setSections([
          {
            id: 'phim-le',
            title: 'Phim Lẻ Mới',
            icon: <Clapperboard size={20} />,
            link: '/danh-sach/phim-le',
            movies: phimLeRes.data?.items?.slice(0, 12) || []
          },
          {
            id: 'phim-bo',
            title: 'Phim Bộ Hot',
            icon: <Tv size={20} />,
            link: '/danh-sach/phim-bo',
            movies: phimBoRes.data?.items?.slice(0, 12) || []
          },
          {
            id: 'hoat-hinh',
            title: 'Hoạt Hình',
            icon: <Sparkles size={20} />,
            link: '/danh-sach/hoat-hinh',
            movies: hoatHinhRes.data?.items?.slice(0, 12) || []
          }
        ]);
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="home" id="home-page">
      <HeroSlider movies={latestMovies} />
      
      <div className="container home__content">
        {/* Latest Movies Section */}
        <section className="home__section" id="latest-movies">
          <div className="home__section-header">
            <h2 className="section-title">
              <TrendingUp size={20} className="home__section-icon" />
              Mới Cập Nhật
            </h2>
          </div>
          <div className="movie-grid">
            {latestMovies.slice(5, 17).map((movie, index) => (
              <MovieCard key={movie._id} movie={movie} index={index} />
            ))}
          </div>
        </section>

        {/* Category Sections */}
        {sections.map(section => (
          <section key={section.id} className="home__section" id={`section-${section.id}`}>
            <div className="home__section-header">
              <h2 className="section-title">
                {section.icon}
                {section.title}
              </h2>
              <Link to={section.link} className="home__view-all">
                Xem tất cả <ChevronRight size={16} />
              </Link>
            </div>
            <div className="movie-grid">
              {section.movies.map((movie, index) => (
                <MovieCard key={movie._id} movie={movie} index={index} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Home;
