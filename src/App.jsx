import Navbar from './components/Navbar'
import Home from './components/Home'
import Service from './components/Service'
import Education from './components/Education'
import Project from './components/Project'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div>
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
  )
}

export default App
