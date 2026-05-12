import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, MessageCircle, Globe, Mail, Share2 } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="logo">
              <PlayCircle className="logo-icon" size={32} />
              <span className="text-gradient">Motchill<span style={{ color: 'white' }}>.Pro</span></span>
            </Link>
            <p className="footer-desc">
              Motchill.Pro - Xem phim mới miễn phí nhanh nhất, chất lượng cao. Phim Vietsub, phim thuyết minh tốt nhất.
            </p>
            <div className="social-links">
              <a href="#"><MessageCircle size={20} /></a>
              <a href="#"><Globe size={20} /></a>
              <a href="#"><Mail size={20} /></a>
              <a href="#"><Share2 size={20} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Thể Loại</h3>
            <ul>
              <li><a href="#">Hành Động</a></li>
              <li><a href="#">Tình Cảm</a></li>
              <li><a href="#">Hài Hước</a></li>
              <li><a href="#">Cổ Trang</a></li>
              <li><a href="#">Kinh Dị</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Quốc Gia</h3>
            <ul>
              <li><a href="#">Phim Trung Quốc</a></li>
              <li><a href="#">Phim Hàn Quốc</a></li>
              <li><a href="#">Phim Nhật Bản</a></li>
              <li><a href="#">Phim Thái Lan</a></li>
              <li><a href="#">Phim Âu Mỹ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Quy Định</h3>
            <ul>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Khiếu nại bản quyền</a></li>
              <li><a href="#">Liên hệ quảng cáo</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Motchill.Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
