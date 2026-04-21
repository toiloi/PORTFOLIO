import heroImg from '../assets/images/hero.svg'

export default function Home() {
    return (
        <section id="home">
            <div>
                <h1>Hi, I'm Toai 👋</h1>
                <p>A passionate Full Stack Software Developer 🚀 having an experience of building Web applications with Spring Boot, JavaScript, Reactjs and some other cool libraries and frameworks.</p>
                <button href="#contact">Contact Me</button>
            </div>
            <div>
                <img src={heroImg} alt="Hero Illustration" />
            </div>
        </section>
    );
}

