import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, Clock, Eye, Clapperboard } from 'lucide-react';
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

  if (loading) return <div className="loading-spinner"></div>;
  if (error || !data) return <div className="error-message">{error || 'Không tìm thấy phim'}</div>;

  const { movie, episodes } = data;
  
  // Lấy tập đầu tiên để gắn link "Xem Ngay"
  const firstEpisode = episodes[0]?.server_data[0];

  return (
    <div className="movie-details-page animate-fade-in">
      {/* Backdrop */}
      <div 
        className="backdrop"
        style={{ backgroundImage: `url(${getImageUrl(movie.poster_url || movie.thumb_url)})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container">
        <div className="details-content glass-panel">
          <div className="details-poster">
            <img src={getImageUrl(movie.thumb_url)} alt={movie.name} />
            {firstEpisode ? (
              <Link to={`/xem-phim/${movie.slug}/${firstEpisode.slug}`} className="btn-primary w-full mt-4">
                <Play size={20} fill="white" /> Xem Phim
              </Link>
            ) : (
              <button className="btn-primary w-full mt-4" disabled>
                Đang cập nhật
              </button>
            )}
          </div>

          <div className="details-info">
            <h1 className="title">{movie.name}</h1>
            <h2 className="subtitle">{movie.origin_name} ({movie.year})</h2>

            <div className="meta-list">
              <span className="meta-item"><Calendar size={16}/> {movie.year}</span>
              <span className="meta-item"><Clock size={16}/> {movie.time}</span>
              <span className="meta-item"><Clapperboard size={16}/> {movie.quality} - {movie.lang}</span>
              <span className="meta-item"><Eye size={16}/> {movie.view} lượt xem</span>
            </div>

            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Trạng thái:</span>
                <span className="info-value text-accent">{movie.episode_current} / {movie.episode_total}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Đạo diễn:</span>
                <span className="info-value">{movie.director?.join(', ') || 'Đang cập nhật'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Diễn viên:</span>
                <span className="info-value">{movie.actor?.join(', ') || 'Đang cập nhật'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Thể loại:</span>
                <span className="info-value">
                  {movie.category?.map(c => c.name).join(', ') || 'Đang cập nhật'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Quốc gia:</span>
                <span className="info-value">
                  {movie.country?.map(c => c.name).join(', ') || 'Đang cập nhật'}
                </span>
              </div>
            </div>

            <div className="synopsis">
              <h3>Nội dung phim:</h3>
              <div 
                className="synopsis-content"
                dangerouslySetInnerHTML={{ __html: movie.content }}
              ></div>
            </div>
          </div>
        </div>

        {/* Danh sách tập */}
        {episodes && episodes.length > 0 && (
          <div className="episodes-section mt-8">
            <h2 className="section-title">Danh Sách Tập</h2>
            {episodes.map((server, idx) => (
              <div key={idx} className="server-group glass-panel mb-4 p-4">
                <h3 className="server-name mb-3">{server.server_name}</h3>
                <div className="episodes-grid">
                  {server.server_data.map((ep, i) => (
                    <Link 
                      key={i} 
                      to={`/xem-phim/${movie.slug}/${ep.slug}`}
                      className="ep-btn"
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
