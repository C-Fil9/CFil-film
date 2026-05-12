import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { getImageUrl, type MovieItem } from '../api/phimapi';
import './MovieCard.css';

interface MovieCardProps {
  movie: MovieItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link to={`/phim/${movie.slug}`} className="movie-card animate-fade-in">
      <div className="card-image-wrapper">
        <img
          src={getImageUrl(movie.thumb_url)}
          alt={movie.name}
          loading="lazy"
          className="card-image"
        />
        <div className="card-overlay">
          <div className="play-btn">
            <Play fill="white" size={24} />
          </div>
        </div>
        <div className="card-badge">{movie.year}</div>
      </div>
      <div className="card-content">
        <h3 className="card-title" title={movie.name}>{movie.name}</h3>
        <p className="card-subtitle" title={movie.origin_name}>{movie.origin_name}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
