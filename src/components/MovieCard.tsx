import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { getImageUrl, type MovieItem } from '../api/phimapi';
import './MovieCard.css';

interface MovieCardProps {
  movie: MovieItem;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/phim/${movie.slug}`}
      className="card"
      style={{ animationDelay: `${index * 0.05}s` }}
      id={`movie-card-${movie.slug}`}
    >
      <div className="card__poster">
        {/* Skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="card__skeleton skeleton" />
        )}
        <img
          src={getImageUrl(movie.thumb_url)}
          alt={movie.name}
          loading="lazy"
          className={`card__img ${imageLoaded ? 'card__img--loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/* Hover Overlay */}
        <div className="card__overlay">
          <div className="card__play">
            <Play fill="white" size={22} />
          </div>
          <span className="card__play-text">Xem Ngay</span>
        </div>

        {/* Badge */}
        <div className="card__badges">
          {movie.year && (
            <span className="card__badge">{movie.year}</span>
          )}
        </div>

        {/* Bottom gradient */}
        <div className="card__gradient" />
      </div>
      
      <div className="card__body">
        <h3 className="card__title" title={movie.name}>{movie.name}</h3>
        <p className="card__subtitle" title={movie.origin_name}>{movie.origin_name}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
