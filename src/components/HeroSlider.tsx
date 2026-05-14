import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl, type MovieItem } from '../api/phimapi';
import './HeroSlider.css';

interface HeroSliderProps {
  movies: MovieItem[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const displayMovies = movies.slice(0, 5);
  const INTERVAL = 6000;

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const handlePrev = () => {
    goToSlide((currentIndex - 1 + displayMovies.length) % displayMovies.length);
  };

  const handleNext = useCallback(() => {
    goToSlide((currentIndex + 1) % displayMovies.length);
  }, [currentIndex, displayMovies.length, goToSlide]);

  // Auto-play with progress bar
  useEffect(() => {
    if (movies.length === 0) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / (INTERVAL / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [movies, handleNext]);

  if (movies.length === 0) return null;

  return (
    <div className="hero" id="hero-slider">
      {/* Background Slides */}
      {displayMovies.map((movie, index) => (
        <div
          key={movie._id}
          className={`hero__slide ${index === currentIndex ? 'hero__slide--active' : ''}`}
        >
          <img
            src={getImageUrl(movie.poster_url || movie.thumb_url)}
            alt={movie.name}
            className="hero__slide-img"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Gradient Overlays */}
      <div className="hero__overlay" />
      <div className="hero__overlay-bottom" />

      {/* Content */}
      <div className="hero__content container">
        <div className="hero__info" key={currentIndex}>
          <div className="hero__badges">
            <span className="hero__badge hero__badge--new">
              <span className="hero__badge-dot" /> Mới Cập Nhật
            </span>
            <span className="hero__badge hero__badge--year">
              {displayMovies[currentIndex]?.year}
            </span>
          </div>
          
          <h1 className="hero__title">{displayMovies[currentIndex]?.name}</h1>
          <p className="hero__subtitle">{displayMovies[currentIndex]?.origin_name}</p>
          
          <div className="hero__actions">
            <Link to={`/phim/${displayMovies[currentIndex]?.slug}`} className="btn-primary hero__btn">
              <Play size={18} fill="white" /> Xem Ngay
            </Link>
            <Link to={`/phim/${displayMovies[currentIndex]?.slug}`} className="hero__btn-secondary">
              <Info size={18} /> Chi Tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="hero__controls container">
        <div className="hero__dots">
          {displayMovies.map((_, index) => (
            <button
              key={index}
              className={`hero__dot ${index === currentIndex ? 'hero__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex && (
                <span className="hero__dot-progress" style={{ width: `${progress}%` }} />
              )}
            </button>
          ))}
        </div>
        
        <div className="hero__arrows">
          <button className="hero__arrow" onClick={handlePrev} aria-label="Previous slide">
            <ChevronLeft size={20} />
          </button>
          <button className="hero__arrow" onClick={handleNext} aria-label="Next slide">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
