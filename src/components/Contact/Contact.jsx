import React from 'react';
import './Contact.scss';
import profilePic from '../../assets/images/profile.jpg'; // Bạn tải 1 tấm hình cá nhân đặt tên profile.jpg nhé
import { FaGithub, FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';

export default function Contact() {
    return (
        <section id="contact" className="contact-container">
            <div className="contact-card">
                {/* Khối bên trái: Chữ giống mẫu */}
                <div className="contact-content">
                    <h1 className="contact-title">Reach Out to me!</h1>
                    <p className="contact-subtitle">
                        DISCUSS A PROJECT OR JUST WANT TO SAY HI? MY INBOX IS OPEN FOR ALL.
                    </p>

                    <p className="contact-quote">
                        "Software Engineer | Student at University of Transport Ho Chi Minh City"
                    </p>

                    <div className="contact-location">
                        <IoLocationOutline className="loc-icon" />
                        <span>Ho Chi Minh City, Vietnam</span>
                    </div>

                    {/* Dàn icon mạng xã hội hình tròn */}
                    <div className="social-icons">
                        <a href="https://github.com/TOAINA" target="_blank" rel="noreferrer" className="icon-btn github"><FaGithub /></a>
                        <a href="#" className="icon-btn linkedin"><FaLinkedinIn /></a>
                        <a href="#" className="icon-btn facebook"><FaFacebookF /></a>
                        <a href="https://instagram.com/..." target="_blank" className="icon-btn instagram"><FaInstagram /></a>
                    </div>
                </div>

                {/* Khối bên phải: Avatar khung viền */}
                <div className="contact-avatar">
                    <img
                        src={profilePic}
                        alt="Profile"
                        onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=Toai+Nguyen&size=300"}
                    />
                </div>
            </div>
        </section>
    );
}