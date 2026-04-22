import './Home.scss';
import heroImg from '../../assets/images/hero.svg';
import { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Home() {
    return (
        <section id="home" className="home-container">
            {/* cột trái */}
            <div className="home-content slide-from-left">
                <h1 className="home-title">
                    Hi all, I'm Toai <span className="wave-emoji">👋</span>
                </h1>

                <p className="home-description">
                    A passionate Full Stack Software Developer 🚀 having an experience
                    of building Web applications with JavaScript / Reactjs /
                    Nodejs and some other cool libraries and frameworks.
                </p>

                <div className="social-icons">
                    <a href="https://github.com/..." target="_blank" className="icon-btn github"><FaGithub /></a>
                    <a href="https://linkedin.com/in/..." target="_blank" className="icon-btn linkedin"><FaLinkedinIn /></a>
                    <a href="https://facebook.com/..." target="_blank" className="icon-btn facebook"><FaFacebookF /></a>
                    <a href="https://instagram.com/..." target="_blank" className="icon-btn instagram"><FaInstagram /></a>
                </div>
            </div>
            {/* cột phải */}
            <div className="home-image slide-from-right">
                <img src={heroImg} alt="Toai's Illustration" />
            </div>
        </section>
    );
}
