import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Globe, Mail, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Decorative top border */}
      <div className="footer__border" />

      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <Film size={20} />
              </div>
              <span className="footer__logo-text">
                <span className="text-gradient">CFil</span>
                <span className="footer__logo-dot">.vn</span>
              </span>
            </Link>
            <p className="footer__desc">
              CFil.vn - Nền tảng xem phim trực tuyến miễn phí với chất lượng cao nhất. 
              Phim Vietsub, thuyết minh cập nhật nhanh nhất.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Website">
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="footer__col">
            <h3 className="footer__heading">Danh Mục</h3>
            <ul className="footer__list">
              <li><Link to="/danh-sach/phim-le">Phim Lẻ</Link></li>
              <li><Link to="/danh-sach/phim-bo">Phim Bộ</Link></li>
              <li><Link to="/danh-sach/hoat-hinh">Hoạt Hình</Link></li>
              <li><Link to="/danh-sach/tv-shows">TV Shows</Link></li>
            </ul>
          </div>

          {/* Genres */}
          <div className="footer__col">
            <h3 className="footer__heading">Thể Loại</h3>
            <ul className="footer__list">
              <li><a href="#">Hành Động</a></li>
              <li><a href="#">Tình Cảm</a></li>
              <li><a href="#">Hài Hước</a></li>
              <li><a href="#">Kinh Dị</a></li>
              <li><a href="#">Cổ Trang</a></li>
            </ul>
          </div>

          {/* Info */}
          <div className="footer__col">
            <h3 className="footer__heading">Thông Tin</h3>
            <ul className="footer__list">
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} CFil.vn — Made with <Heart size={14} className="footer__heart" /> in Vietnam
          </p>
          <p className="footer__disclaimer">
            Tất cả nội dung phim được cung cấp bởi bên thứ ba. CFil không lưu trữ bất kỳ dữ liệu phim nào.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
