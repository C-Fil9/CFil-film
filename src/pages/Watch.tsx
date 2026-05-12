import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, type MovieDetailResponse } from '../api/phimapi';
import './Watch.css';

const Watch: React.FC = () => {
  const { slug, episode } = useParams<{ slug: string, episode: string }>();
  const [data, setData] = useState<MovieDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    
    const fetchMovie = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
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
  
  // Tìm link iframe của tập phim hiện tại
  let currentEmbedLink = '';
  let currentEpName = '';

  episodes.forEach(server => {
    const ep = server.server_data.find(e => e.slug === episode);
    if (ep) {
      currentEmbedLink = ep.link_embed;
      currentEpName = ep.name;
    }
  });

  // Nếu không tìm thấy (URL sai hoặc tự gõ), lấy tập đầu tiên
  if (!currentEmbedLink && episodes.length > 0 && episodes[0].server_data.length > 0) {
    currentEmbedLink = episodes[0].server_data[0].link_embed;
    currentEpName = episodes[0].server_data[0].name;
  }

  return (
    <div className="watch-page container animate-fade-in">
      <div className="player-container glass-panel">
        <div className="player-wrapper">
          {currentEmbedLink ? (
            <iframe 
              src={currentEmbedLink} 
              allowFullScreen 
              frameBorder="0" 
              title={`Đang xem ${movie.name} - ${currentEpName}`}
            ></iframe>
          ) : (
            <div className="error-message">Không tìm thấy link video cho tập này.</div>
          )}
        </div>
        <div className="player-info">
          <h1 className="watch-title">{movie.name}</h1>
          <p className="watch-subtitle">Đang phát: {currentEpName}</p>
        </div>
      </div>

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
                    className={`ep-btn ${ep.slug === episode ? 'active' : ''}`}
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
  );
};

export default Watch;
