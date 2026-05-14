import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tv, Server, AlertCircle, List } from 'lucide-react';
import { getMovieDetails, type MovieDetailResponse } from '../api/phimapi';
import './Watch.css';

const Watch: React.FC = () => {
  const { slug, episode } = useParams<{ slug: string, episode: string }>();
  const [data, setData] = useState<MovieDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEpisodes, setShowEpisodes] = useState(true);

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
  
  // Find current episode link
  let currentEmbedLink = '';
  let currentEpName = '';

  episodes.forEach(server => {
    const ep = server.server_data.find(e => e.slug === episode);
    if (ep) {
      currentEmbedLink = ep.link_embed;
      currentEpName = ep.name;
    }
  });

  // Fallback to first episode
  if (!currentEmbedLink && episodes.length > 0 && episodes[0].server_data.length > 0) {
    currentEmbedLink = episodes[0].server_data[0].link_embed;
    currentEpName = episodes[0].server_data[0].name;
  }

  return (
    <div className="watch" id="watch-page">
      <div className="container">
        {/* Navigation */}
        <div className="watch__nav">
          <button className="watch__back" onClick={() => window.history.back()}>
            <ArrowLeft size={18} /> Quay lại
          </button>
          <Link to={`/phim/${movie.slug}`} className="watch__details-link">
            Chi tiết phim
          </Link>
        </div>

        {/* Player */}
        <div className="watch__player glass-panel">
          <div className="watch__player-wrapper">
            {currentEmbedLink ? (
              <iframe
                src={currentEmbedLink}
                allowFullScreen
                frameBorder="0"
                title={`Đang xem ${movie.name} - ${currentEpName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="watch__player-error">
                <AlertCircle size={48} />
                <p>Không tìm thấy link video cho tập này.</p>
              </div>
            )}
          </div>

          {/* Player Info Bar */}
          <div className="watch__info-bar">
            <div className="watch__info-left">
              <Tv size={18} className="watch__info-icon" />
              <div>
                <h1 className="watch__title">{movie.name}</h1>
                <p className="watch__current-ep">Đang phát: <span>{currentEpName}</span></p>
              </div>
            </div>
            <button
              className="watch__toggle-episodes"
              onClick={() => setShowEpisodes(!showEpisodes)}
            >
              <List size={18} />
              {showEpisodes ? 'Ẩn tập' : 'Danh sách tập'}
            </button>
          </div>
        </div>

        {/* Episodes */}
        {showEpisodes && episodes && episodes.length > 0 && (
          <div className="watch__episodes">
            <h2 className="section-title">Danh Sách Tập</h2>
            {episodes.map((server, idx) => (
              <div key={idx} className="watch__server glass-panel">
                <h3 className="watch__server-name">
                  <Server size={16} /> {server.server_name}
                </h3>
                <div className="watch__episodes-grid">
                  {server.server_data.map((ep, i) => (
                    <Link
                      key={i}
                      to={`/xem-phim/${movie.slug}/${ep.slug}`}
                      className={`watch__ep-btn ${ep.slug === episode ? 'watch__ep-btn--active' : ''}`}
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

export default Watch;
