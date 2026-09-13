import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { cn } from './lib/utils.js';
import './Navbar.css';

const defaultItems = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Members', href: '#members' },
  { label: 'Contact us', href: '#join' },
];

function Navbar({
  items = defaultItems,
  className = '',
  onItemClick,
  defaultActiveIndex = 0,
}) {
  const navRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navRef.current) return undefined;

    const nav = navRef.current;

    const handleMouseMove = (event) => {
      const rect = nav.getBoundingClientRect();
      const x = event.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty('--spotlight-x', `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    };

    nav.addEventListener('mousemove', handleMouseMove);
    nav.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      nav.removeEventListener('mousemove', handleMouseMove);
      nav.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!navRef.current) return undefined;

    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        onUpdate: (value) => {
          ambienceX.current = value;
          nav.style.setProperty('--ambience-x', `${value}px`);
        },
      });
    }

    return undefined;
  }, [activeIndex]);

  const handleItemClick = (item, index) => {
    setActiveIndex(index);
    setMobileMenuOpen(false);
    onItemClick?.(item, index);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open);
  };

  return (
    <header className={cn('navbar-shell', className)}>
      <nav
        ref={navRef}
        className={cn(
          'spotlight-nav home-fade-in',
          isDark && 'spotlight-nav--dark'
        )}
        aria-label="Main navigation"
      >
        <ul className="spotlight-nav__list">
          {items.map((item, index) => (
            <li key={item.label} className="spotlight-nav__item">
              <a
                href={item.href}
                data-index={index}
                onClick={() => handleItemClick(item, index)}
                className={cn(
                  'spotlight-nav__link',
                  activeIndex === index && 'spotlight-nav__link--active'
                )}
                aria-current={activeIndex === index ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div
          className="spotlight-nav__spotlight"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `radial-gradient(120px circle at var(--spotlight-x, 50%) 100%, var(--spotlight-color, rgba(17, 24, 39, 0.1)) 0%, transparent 50%)`,
          }}
        />

        <div
          className="spotlight-nav__ambience"
          style={{
            background: `radial-gradient(60px circle at var(--ambience-x, 50%) 0%, var(--ambience-color, rgba(17, 24, 39, 0.8)) 0%, transparent 100%)`,
          }}
        />
      </nav>

      <button
        type="button"
        className={cn('mobile-nav-toggle', mobileMenuOpen && 'mobile-nav-toggle--open')}
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        <span className="mobile-nav-toggle__bar" />
        <span className="mobile-nav-toggle__bar" />
        <span className="mobile-nav-toggle__bar" />
      </button>

      <div
        className={cn('mobile-nav-backdrop', mobileMenuOpen && 'mobile-nav-backdrop--open')}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      <aside
        className={cn('mobile-nav-panel', mobileMenuOpen && 'mobile-nav-panel--open')}
        aria-label="Mobile navigation"
      >
        <ul className="mobile-nav-panel__list">
          {items.map((item, index) => (
            <li key={item.label} className="mobile-nav-panel__item">
              <a
                href={item.href}
                data-index={index}
                onClick={() => handleItemClick(item, index)}
                className={cn(
                  'mobile-nav-panel__link',
                  activeIndex === index && 'mobile-nav-panel__link--active'
                )}
                aria-current={activeIndex === index ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </header>
  );
}

export default Navbar;
