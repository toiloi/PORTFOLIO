import './Navbar.scss';

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="nav-logo">
                <a href="/" onClick={() => window.scrollTo(0,0)}>Nguyen Anh <span>Toai</span></a>
            </div>

            <nav className="nav-links">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#service">Service</a></li>
                    <li><a href="#education">Education</a></li>
                    <li><a href="#project">Project</a></li>
                    <li><a href="#contact">Contact Me</a></li>
                </ul>
            </nav>
        </header>
    );
}