import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Service from './components/Service/Service';
import Education from './components/Education/Education';
import Project from './components/Project/Project';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import './App.css';
import './SetupConfigs.css';

export default function App() {
  // splashState: 'entering' → 'entered' → 'exiting' → 'done'
  const [splashState, setSplashState] = useState('entering');
  // contentVisible: kiểm soát riêng hiệu ứng fade-in của toàn bộ nội dung trang
  const [contentVisible, setContentVisible] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    // B1: Ngay lập tức flip sang 'entered' (1 tick để browser paint trước)
    const t1 = setTimeout(() => setSplashState('entered'), 50);

    // B2: Sau 2.5s bắt đầu văng RA
    const t2 = setTimeout(() => setSplashState('exiting'), 2500);

    // B3: Sau khi văng ra xong (2.5s + 1.2s transition), ẩn overlay
    const t3 = setTimeout(() => {
      setSplashState('done');
    }, 2500 + 1200);

    // B4: Thêm 200ms sau khi overlay biến mất → nền trắng flash → rồi mới fade-in nội dung
    const t4 = setTimeout(() => {
      setContentVisible(true);

      // B5: Kích hoạt radar section sau khi content đã bắt đầu hiện
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2,      // Kích hoạt khi đã thấy 20% section → đủ muộn để thấy hiệu ứng
        rootMargin: '0px'    // Không đặc quyền khoảng cách
      });

      // Bỏ qua #home vì nó luôn hiện ngay, chỉ track các section còn lại
      document.querySelectorAll('section:not(#home)').forEach((sec) => observer.observe(sec));
    }, 2500 + 1200 + 200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div>
      {/* Overlay splash – chỉ render khi chưa 'done' */}
      {splashState !== 'done' && (
        <div className={`splash-overlay splash-${splashState}`}>
          <div className="splash-half splash-left"></div>
          <div className="splash-half splash-right"></div>

          <div className="splash-logo-container">
            <svg className="splash-hexagon hex-1" viewBox="0 0 100 100">
              <polygon points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25" />
            </svg>
            <svg className="splash-hexagon hex-2" viewBox="0 0 100 100">
              <polygon points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25" />
            </svg>
            <h1 className="splash-logo-text"><span>TOAI</span></h1>
          </div>
        </div>
      )}

      {/* Toàn bộ nội dung trang bọc trong wrapper có hiệu ứng fade-in */}
      <div className={`page-content ${contentVisible ? 'content-visible' : ''}`}>
        <Navbar />
        <main>
          <Home />
          <Service />
          <Education />
          <Project />
          <Contact />
        </main>
        <Footer />
      </div>

      <button
        className={`scroll-top-btn ${showScrollBtn ? 'show' : ''}`}
        onClick={scrollToTop}
        title="Lên đầu trang"
      >
        ↑
      </button>
    </div>
  );
}
