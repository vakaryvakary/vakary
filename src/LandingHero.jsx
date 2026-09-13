  import { useEffect, useRef, useState } from 'react';
  import './Homepage.css'
  import StrokeText from './components/StrokeText.jsx';
  import vakaLogo from './assets/final-logo.png';
  import waves from './assets/waves (9).svg';
  import instagram from './assets/icons8-instagram.svg';
  import youtube from './assets/icons8-youtube.svg';
  import Navbar from './Navbar.jsx';
  import Globe, { preloadGlobeData } from "./components/originkit/ui/globe.jsx";
  import Grainient from './components/Grainient.jsx';


  function LandingHero() {
    const waveTrackRef = useRef(null);
    const [showGlobe, setShowGlobe] = useState(false);

    useEffect(() => {
      const track = waveTrackRef.current;
      preloadGlobeData();
      if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

      let animationFrame = null;
      let lastScrollY = window.scrollY;

      // Wrap the offset based on the width of ONE wave tile (the actual
      // repeating unit), not window.innerWidth — these widths rarely match,
      // which let the offset drift past the point where tiles line up.
      let tileWidth = track.children[0]?.offsetWidth || window.innerWidth;

      const timer = setTimeout(() => setShowGlobe(true), 2000); // match StrokeText's duration

      const updateTileWidth = () => {
        tileWidth = track.children[0]?.offsetWidth || window.innerWidth;
      };
      window.addEventListener('resize', updateTileWidth);

      const updateWave = () => {
        animationFrame = null;
        const scrollDelta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;

        // Scroll down moves the ribbon left; scrolling back reverses its direction.
        const currentOffset = Number(track.dataset.offset || 0);
        let nextOffset = (currentOffset - scrollDelta * 0.80) % tileWidth;

        // FIXED: keep the offset in the range (-tileWidth, 0], NOT [0, tileWidth).
        // The track moves left via negative translateX, so the "reset point"
        // for a clean loop is 0 (start) down to -tileWidth (one full tile
        // scrolled past) — not a positive range. My previous fix flipped this
        // sign, which is why the strip jumped to start from the right instead
        // of the left.
        if (nextOffset > 0) nextOffset -= tileWidth;

        track.dataset.offset = String(nextOffset);
        track.style.setProperty('--wave-offset', `${nextOffset}px`);
      };

      const handleScroll = () => {
        if (animationFrame === null) {
          animationFrame = window.requestAnimationFrame(updateWave);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateTileWidth);
        if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      };
    }, []);

    return (
    <main className="homepage">
        <Navbar />    
      <section className="hero-landing" id="home">
        <div className="home-section--navy__grainient" aria-hidden="true">
          <Grainient
            color1="#050c19"
            color2="#1c63d5"
            color3="#050a14"
            timeSpeed={1.05}
            colorBalance={0}
            warpStrength={1.35}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.76}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.05}
            grainScale={3.2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9} />
        </div>
        <div className="home-section-content">
          <div className="home-section__texture" aria-hidden="true" />
          <div className="home-section__center">
            <div className="home-section_left">
              <p className="home-text-top home-fade-in">
                Vesijärven Academic Kippistely Association
              </p>
              <StrokeText />
              {/* CHANGED: added "home-fade-in" */}
              <p className="home-copy home-fade-in">
                Building community, culture, and unforgettable student experiences for LUT and LAB students in Lahti
              </p>
              {/* CHANGED: added "home-fade-in" */}
              <div className="home-section__socials home-fade-in">
                <a href="https://www.instagram.com/vaka.ry/" target="_blank" rel="noopener noreferrer">
                  <img src={instagram} alt="Instagram logo" />
                </a>
                <a href="https://www.youtube.com/@Vaka-ry" target="_blank" rel="noopener noreferrer">
                  <img src={youtube} alt="YouTube logo" />
                </a>
              </div>
            </div>
            <div className="logo-graphic home-fade-in">
              {showGlobe && <Globe className="globe" />}
              <img className="logo" src={vakaLogo} alt="Vaka ry logo" />
            </div>
          </div>
        </div>

        <div className="home-section-wave" aria-hidden="true">
          <div className="home-wave-track" ref={waveTrackRef}>
            {Array.from({ length: 12 }, (_, index) => <img key={index} src={waves} alt="" />)}
          </div>
        </div>
      </section>
    </main>
  );
  }
  export default LandingHero;