import { useEffect } from 'react'
import Navbar from './components/Navbar'
import ChapterRail from './components/ui/ChapterRail'
import ParallaxHero from './components/ParallaxHero'
import CharacterProfile from './components/CharacterProfile'
import TalentShowcase from './components/TalentShowcase'
import WeaponCarousel3D from './components/WeaponCarousel3D'
import ConstellationMap from './components/ConstellationMap'
import ArtifactBuilds from './components/ArtifactBuilds'
import Gallery from './components/Gallery'
import Footer, { CinematicEnding } from './components/Footer'
import { ScrollTrigger, prefersReducedMotion } from './lib/gsap'

export default function App() {
  useEffect(() => {
    // Refresh ScrollTrigger once fonts and lazy images have settled so the
    // parallax start/end positions match the final layout.
    const refresh = () => ScrollTrigger.refresh()
    const t = window.setTimeout(refresh, 400)
    document.fonts?.ready.then(refresh).catch(() => undefined)
    window.addEventListener('load', refresh)

    // Smooth anchor fallback for browsers that don't inherit scroll-behavior
    const onHashChange = () => {
      const id = window.location.hash.replace('#', '')
      const el = id ? document.getElementById(id) : null
      if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('load', refresh)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      <a
        href="#profile"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-gold/60 focus:bg-obsidian focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>

      <Navbar />
      <ChapterRail />

      <main>
        <ParallaxHero />
        <CharacterProfile />
        <TalentShowcase />
        <WeaponCarousel3D />
        <ConstellationMap />
        <ArtifactBuilds />
        <Gallery />
        <CinematicEnding />
      </main>

      <Footer />
    </div>
  )
}
