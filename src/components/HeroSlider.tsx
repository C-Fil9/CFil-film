import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl, type MovieItem } from '../api/phimapi';
import './HeroSlider.css';

interface HeroSliderProps {
  movies: MovieItem[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const displayMovies = movies.slice(0, 5);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayMovies.length) % displayMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayMovies.length);
  };

  return (
    <div className="hero-slider">
      {displayMovies.map((movie, index) => (
        <div 
          key={movie._id}
          className={`slider-item ${index === currentIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${getImageUrl(movie.poster_url || movie.thumb_url)})`
          }}
        >
          <div className="slider-overlay">
            <div className="container slider-content">
              <span className="badge">Mới Cập Nhật</span>
              <h1 className="movie-title">{movie.name}</h1>
              <p className="movie-origin">{movie.origin_name} ({movie.year})</p>
              
              <div className="slider-actions">
                <Link to={`/phim/${movie.slug}`} className="btn-primary">
                  <Play size={20} fill="white" /> Xem Ngay
                </Link>
                <Link to={`/phim/${movie.slug}`} className="btn-secondary">
                  <Info size={20} /> Chi Tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="slider-controls container">
        <div className="dots">
          {displayMovies.map((_, index) => (
            <button 
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        <div className="arrows">
          <button onClick={handlePrev}><ChevronLeft size={24} /></button>
          <button onClick={handleNext}><ChevronRight size={24} /></button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
