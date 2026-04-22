import React from 'react';
import './Project.scss';
import { VscRepo, VscRepoForked, VscStarFull } from 'react-icons/vsc'; // Import các icon chuẩn của GitHub

// Dữ liệu mẫu (mảng 6 dự án) để bạn dễ chỉnh sửa nội dung và gắn link
const projectData = [
    {
        id: 1,
        title: "S-DCRMS-Self-driving-car",
        desc: "The S-DCRMS project helps people rent cars easily",
        lang: "C#",
        langColor: "#178600", // Màu xanh lá chuẩn C#
        forks: 1,
        stars: 2,
        size: "15.2 MB",
        link: "https://github.com/DuYB4ng/S-DCRMS-Self-driving-car-rental-management-system-"
    },
    {
        id: 2,
        title: "UTHTeamMatching",
        desc: "Networking platform for UTH students",
        lang: "HTML",
        langColor: "#e34c26", // Màu cam chuẩn HTML
        forks: 0,
        stars: 0,
        size: "4.5 MB",
        link: "https://github.com/toiloi/UTHTeamMatching"
    },
    {
        id: 3,
        title: "BadmintonManage",
        desc: "Badminton court rental management project",
        lang: "SCSS",
        langColor: "#c6538c", // Màu hồng chuẩn SCSS
        forks: 0,
        stars: 3,
        size: "2.1 MB",
        link: "https://github.com/toiloi/BadmintonManage"
    },
    {
        id: 4,
        title: "HMCDOP_Project",
        desc: "Deployment Automation Platform",
        lang: "Java",
        langColor: "#b07219", // Màu nâu chuẩn Java
        forks: 0,
        stars: 0,
        size: "18.3 MB",
        link: "https://github.com/toiloi/HMCDOP_Project"
    },
    {
        id: 5,
        title: "MasterPortfolio",
        desc: "My self coded personal website build with React.js",
        lang: "JavaScript",
        langColor: "#f1e05a", // Vàng chuẩn JS
        forks: 0,
        stars: 0,
        size: "8.7 MB",
        link: "https://github.com/toiloi/MasterPortfolio"
    },
    {
        id: 6,
        title: "WebBookRate",
        desc: "A web platform for rating and reviewing books built with Chaos team.",
        lang: "CSS",
        langColor: "#563d7c", // Tím chuẩn CSS
        forks: 0,
        stars: 1,
        size: "3.4 MB",
        link: "https://github.com/HadesXChaos/WebBookRate"
    }
];

export default function Project() {
    return (
        <section id="project" className="project-container">
            <h1 className="project-title slide-from-left">Open Source Projects</h1>

            <div className="project-grid slide-from-right">
                {/* Dùng vòng lặp map để in tự động 6 thẻ bài ra thay vì copy paste */}
                {projectData.map((proj) => (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="project-card" key={proj.id}>
                        <div className="project-header">
                            <VscRepo className="repo-icon" />
                            <h2 className="repo-title">{proj.title}</h2>
                        </div>

                        <p className="project-desc">{proj.desc}</p>

                        <div className="project-footer">
                            <div className="footer-left">
                                <span className="lang-dot" style={{ backgroundColor: proj.langColor }}></span>
                                <span className="lang-text">{proj.lang}</span>

                                <VscRepoForked className="stat-icon" />
                                <span className="stat-text">{proj.forks}</span>

                                <VscStarFull className="stat-icon" />
                                <span className="stat-text">{proj.stars}</span>
                            </div>
                            <div className="footer-right">
                                <span className="size-text">{proj.size}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Nút xem thêm kết nối thẳng tới trang GitHub cá nhân */}
            <div className="more-btn-container slide-from-bottom">
                <a href="https://github.com/toiloi" target="_blank" rel="noopener noreferrer" className="more-btn">
                    MORE PROJECTS
                </a>
            </div>
        </section>
    );
}