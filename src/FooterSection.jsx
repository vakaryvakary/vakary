import { useEffect, useRef, useState } from 'react';
import './Homepage.css';
import Grainient from './components/Grainient.jsx';
import waves from './assets/waves (9).svg';
import footerLeft from './assets/footer-left.png';
import footerRight from './assets/footer-right.png';
import SlideFillButton from './components/SlideFillButton.jsx';

export default function FooterSection() {
  const [showForm, setShowForm] = useState(false);
  const topWaveTrackRef = useRef(null);

  useEffect(() => {
    const tracks = [topWaveTrackRef.current].filter(Boolean);
  
      if (!tracks.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return undefined;
      }
  
      const handleTrack = (track, direction) => {
        if (!track) return undefined;
  
        let animationFrame = null;
        let lastScrollY = window.scrollY;
        let tileWidth = track.children[0]?.offsetWidth || window.innerWidth;
  
        const updateTileWidth = () => {
          tileWidth = track.children[0]?.offsetWidth || window.innerWidth;
        };
  
        const updateWave = () => {
          animationFrame = null;
          const scrollDelta = window.scrollY - lastScrollY;
          lastScrollY = window.scrollY;
  
          const currentOffset = Number(track.dataset.offset || 0);
          let nextOffset = (currentOffset - scrollDelta * 0.80 * direction) % tileWidth;
  
          if (nextOffset > 0) nextOffset -= tileWidth;
  
          track.dataset.offset = String(nextOffset);
          track.style.setProperty('--wave-offset', `${nextOffset}px`);
        };
  
        const handleScroll = () => {
          if (animationFrame === null) {
            animationFrame = window.requestAnimationFrame(updateWave);
          }
        };
  
        window.addEventListener('resize', updateTileWidth);
        window.addEventListener('scroll', handleScroll, { passive: true });
  
        return () => {
          window.removeEventListener('resize', updateTileWidth);
          window.removeEventListener('scroll', handleScroll);
          if (animationFrame !== null) {
            window.cancelAnimationFrame(animationFrame);
          }
        };
      };
  
      const cleanups = [
        handleTrack(topWaveTrackRef.current, -1),
      ].filter(Boolean);

      return () => cleanups.forEach((cleanup) => cleanup());
    }, []);

  const handleFormToggle = () => {
    setShowForm((current) => !current);
  };


  return (
    <footer className="member-section footer-section" aria-label="Site footer">
      <div className="member-section__wave member-section__wave--top" aria-hidden="true">
        <div className="member-wave-track" ref={topWaveTrackRef}>
          {Array.from({ length: 12 }, (_, index) => (
            <img key={`footer-top-${index}`} src={waves} alt="" />
          ))}
        </div>
      </div>

      <div className="member-section__grainient" aria-hidden="true">
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
          zoom={0.9}
        />
      </div>

      <div className="home-section__texture member-section__texture" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-content footer-left">
          <img src={footerLeft} alt="" className="footer-side-image footer-side-image--left" />
        </div>
        <div className="footer-content center-content">
          <div className="footer-links footer-links--association">
            <p>Association</p>
            <a href="#">Vesijärven Academic Kippistely Association Vaka ry</a>
            <a href="#">Mukkulankatu 19, <br></br> 15240 Lahti</a>
          </div>
          
          <div className="footer-links">
            <p>Notice</p>
            <a href="https://drive.google.com/file/d/1sS5Gt3nqaSs6pv-ALUUT2Tu43uUxC-US/view?usp=sharing" target="_blank" rel="noreferrer">privacy policy</a>
            <a>Business ID: <br></br> 3606341-7
            </a>
          </div>

          <div className="footer-links">
            <p>Contact us</p>
            <a href="mailto:board@vakary.fi">board@vakary.fi</a>
            <a href="https://www.instagram.com/vaka.ry/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a id="surprise-link" onClick={handleFormToggle}>
              click for a surprise
            </a>
          </div>
        </div>
        <div className="footer-content footer-right">
          <img src={footerRight} alt="" className="footer-side-image footer-side-image--right" />
        </div>
      </div>
    </footer>
  );
}
