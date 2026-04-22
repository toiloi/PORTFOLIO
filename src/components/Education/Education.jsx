import React from 'react';
import './Education.scss';
// Thay đường dẫn này bằng logo trường hoặc chèn icon tuỳ ý bạn
import uniLogo from '../../assets/images/logo-uni.png';

export default function Education() {
  return (
    <section id="education" className="education-container">
      <h1 className="education-title">Education</h1>

      <div className="edu-card">
        <div className="edu-logo slide-from-left">
          <img src={uniLogo} alt="University Logo" onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=UT&size=150&background=random"} />
        </div>

        <div className="edu-details slide-from-right">
          <h2 className="uni-name">University of Transport Ho Chi Minh City</h2>
          <h3 className="degree">Bachelor of Information Technology - Software Engineering</h3>
          <p className="duration">September, 2023 - Present</p>

          <ul className="edu-list">
            <li>GPA: 3.63/4.0</li>
            <li>Academic Encouragement Scholarship 2023-2024</li>
            <li>Academic Encouragement Scholarship 2024-2025</li>
          </ul>
        </div>
      </div>
    </section>
  );
}