import './Service.scss';
// Giả định bạn có hình tên là 'what-i-do.svg' hoặc đuôi .png trong thư mục assets
import whatIDoImg from '../../assets/images/what-i-do.svg'; 

import { FaHtml5, FaCss3Alt, FaReact, FaJava, FaDocker } from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiSpringboot } from 'react-icons/si';

export default function Service() {
    return (
        <section id="service" className="service-container">
            <div className="service-image slide-from-left">
                <img src={whatIDoImg} alt="What I do Illustration" />
            </div>

            <div className="service-content slide-from-right">
                <h1 className="service-title">What I do</h1>
                <p className="service-subtitle">
                    CRAZY FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK
                </p>

                <div className="tech-icons">
                    <FaHtml5 title="HTML5" />
                    <FaCss3Alt title="CSS3" />
                    <IoLogoJavascript title="JavaScript" />
                    <FaReact title="ReactJS" />
                    <FaJava title="Java" />
                    <SiSpringboot title="Spring Boot" />
                    <FaDocker title="Docker" />
                </div>

                <ul className="service-list">
                    <li>⚡ Develop highly interactive Front end / User Interfaces for your web applications with React.</li>
                    <li>⚡ Build robust APIs and Backend services with Java & Spring Boot.</li>
                    <li>⚡ Containerize applications using Docker for easy deployment.</li>
                </ul>
            </div>
        </section>
    );
}