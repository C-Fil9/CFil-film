import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, Clock, Eye, Clapperboard, ArrowLeft } from 'lucide-react';
import { getMovieDetails, getImageUrl, type MovieDetailResponse } from '../api/phimapi';
import './MovieDetails.css';

const MovieDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<MovieDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await getMovieDetails(slug);
        if (res.status) {
          setData(res);
        } else {
          setError('Không tìm thấy thông tin phim.');
        }
      } catch {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="error-message container" style={{ marginTop: '120px' }}>{error || 'Không tìm thấy phim'}</div>;
  }

  const { movie, episodes } = data;
  const firstEpisode = episodes[0]?.server_data[0];

  const metaItems = [
    { icon: <Calendar size={15} />, value: movie.year },
    { icon: <Clock size={15} />, value: movie.time },
    { icon: <Clapperboard size={15} />, value: `${movie.quality} - ${movie.lang}` },
    { icon: <Eye size={15} />, value: `${movie.view?.toLocaleString()} lượt xem` },
  ].filter(item => item.value);

  const infoItems = [
    { label: 'Trạng thái', value: `${movie.episode_current} / ${movie.episode_total || '?'}`, accent: true },
    { label: 'Đạo diễn', value: movie.director?.join(', ') || 'Đang cập nhật' },
    { label: 'Diễn viên', value: movie.actor?.join(', ') || 'Đang cập nhật' },
    { label: 'Thể loại', value: movie.category?.map(c => c.name).join(', ') || 'Đang cập nhật' },
    { label: 'Quốc gia', value: movie.country?.map(c => c.name).join(', ') || 'Đang cập nhật' },
  ];

  return (
    <div className="details" id="movie-details">
      {/* Backdrop */}
      <div className="details__backdrop">
        <img
          src={getImageUrl(movie.poster_url || movie.thumb_url)}
          alt=""
          className="details__backdrop-img"
        />
        <div className="details__backdrop-overlay" />
      </div>

      <div className="container details__container">
        {/* Back button */}
        <button className="details__back" onClick={() => window.history.back()}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        {/* Main Content */}
        <div className="details__main glass-panel">
          {/* Poster */}
          <div className="details__poster-wrapper">
            <div className="details__poster">
              <img src={getImageUrl(movie.thumb_url)} alt={movie.name} />
              <div className="details__poster-glow" />
            </div>
            
            {/* Action Buttons */}
            <div className="details__actions">
              {firstEpisode ? (
                <Link to={`/xem-phim/${movie.slug}/${firstEpisode.slug}`} className="btn-primary details__play-btn">
                  <Play size={20} fill="white" /> Xem Phim
                </Link>
              ) : (
                <button className="btn-primary details__play-btn" disabled>
                  Đang cập nhật
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="details__info">
            <h1 className="details__title">{movie.name}</h1>
            <h2 className="details__subtitle">{movie.origin_name} ({movie.year})</h2>

            {/* Meta tags */}
            <div className="details__meta">
              {metaItems.map((item, i) => (
                <span key={i} className="details__meta-tag">
                  {item.icon} {item.value}
                </span>
              ))}
            </div>

            {/* Info grid */}
            <div className="details__info-grid">
              {infoItems.map((item, i) => (
                <div key={i} className="details__info-row">
                  <span className="details__info-label">{item.label}</span>
                  <span className={`details__info-value ${item.accent ? 'details__info-value--accent' : ''}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Synopsis */}
            {movie.content && (
              <div className="details__synopsis">
                <h3 className="details__synopsis-title">Nội dung phim</h3>
                <div
                  className="details__synopsis-text"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Episodes */}
        {episodes && episodes.length > 0 && (
          <div className="details__episodes">
            <h2 className="section-title">Danh Sách Tập</h2>
            {episodes.map((server, idx) => (
              <div key={idx} className="details__server glass-panel">
                <h3 className="details__server-name">{server.server_name}</h3>
                <div className="details__episodes-grid">
                  {server.server_data.map((ep, i) => (
                    <Link
                      key={i}
                      to={`/xem-phim/${movie.slug}/${ep.slug}`}
                      className="details__ep-btn"
                    >
                      {ep.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
