import { useEffect, useRef, useState } from 'react';
import './Homepage.css';
import SlideFillButton from './components/SlideFillButton.jsx';
import Grainient from './components/Grainient.jsx';
import waves from './assets/waves (9).svg';
import { CSSTransition } from 'react-transition-group';

export default function MemberSection() {
  const formLink = 'https://docs.google.com/forms/d/1ZiPLqjR0MO_jCP6f7ZqurGi4SjjttGg4RE7i77ZF6J0/viewform?edit_requested=true';
  const [showForm, setShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 500px)').matches);
  const nodeRef = useRef(null);
  const topWaveTrackRef = useRef(null);
  const bottomWaveTrackRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    const handleMediaChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const tracks = [topWaveTrackRef.current, bottomWaveTrackRef.current].filter(Boolean);

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
      handleTrack(bottomWaveTrackRef.current, 1),
    ].filter(Boolean);

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowForm(false);
    }
  }, [isMobile]);

  const handleMobileFormOpen = (event) => {
    event.preventDefault();
    window.open(formLink, '_blank', 'noopener,noreferrer');
  };

  const handleDesktopFormToggle = () => {
    setShowForm((current) => !current);
  };

  return (
    <section className="member-section" id="members">
      <div className="member-section__wave member-section__wave--top" aria-hidden="true">
        <div className="member-wave-track" ref={topWaveTrackRef}>
          {Array.from({ length: 12 }, (_, index) => (
            <img key={`top-${index}`} src={waves} alt="" />
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
      <div className="member-section-header ">
        <h1 className="font-display px-3">Members</h1>
      </div>
      <div className="member-section__inner flex flex-column gap-6">
        <p className="member-para px-4 @media (max-width: 400px) text-justify padding-0">
          We're always looking for new members to join our association!
          <br /><br />
          Ideally, the member should be at least in the 2nd year of their studies, with some strong experience at their student guilds/union/associations from board work.
          We value experience and achievements the most, irrespective of the board position, as well as the knowledge about the student culture and traditions.
          <br /><br />
          If this describes you, please fill out the registration form by clicking the button below.
        </p>
        <div className="button-corner ">
          <div className="form-button">
            <SlideFillButton
              label={showForm ? 'Hide Form' : 'Membership Form'}
              onClick={isMobile ? handleMobileFormOpen : handleDesktopFormToggle}
              width="100%"
              height="100%"
              rounded={40}
              padding={0}
              font={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: 18,
                lineHeight: '0.2em',
                textAlign: 'left',
              }}
              water={{ color: '#0d1466', direction: 'up', textColor: '#FFFFFF', waveSpeed: 100, defaultFill: 0 }}
              colors={{ fill: '#f2f5f6', textColor: '#141212' }}
              border={{ borderWidth: 2, borderStyle: 'solid', borderColor: '#00000030' }}
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
            />
          </div>
        </div>

        {!isMobile && (
          <CSSTransition
            in={showForm}
            timeout={300}
            classNames="registration-form"
            unmountOnExit
            nodeRef={nodeRef}
          >
            <div className="registration-form" ref={nodeRef}>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScK0oUf5fOAoolFihr802107wgenbFER7D-bCTf-FCNwVo-Tw/viewform?embedded=true"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="VAKA ry registration form"
                className="registration-form__iframe"
              />
            </div>
          </CSSTransition>
        )}
      </div>
      <div className="member-section__wave member-section__wave--bottom" aria-hidden="true">
        <div className="member-wave-track" ref={bottomWaveTrackRef}>
          {Array.from({ length: 12 }, (_, index) => (
            <img key={`bottom-${index}`} src={waves} alt="" />
          ))}
        </div>
      </div>
    </section>
  );
}