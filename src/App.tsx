import './App.css'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Home from './Home/Home'
import { usePremiumReveal } from './hooks/usePremiumReveal'
import { useSiteSeo } from './seo/useSiteSeo'

function App() {
  useSiteSeo()
  usePremiumReveal()

  return (
    <div className="min-h-screen bg-[#07090D] text-white">
      <Navbar />
      <main className="min-h-[35vh]">
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App
