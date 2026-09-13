import './Homepage.css'
import { useState, useRef } from 'react';
import LandingHero from './LandingHero.jsx';
import  HoverExpand  from "./components/hover-expand.jsx";
import eventBg from './assets/wappu-bg.jpg';
import kyykkaBg from './assets/kyykka-bg.jpg';
import podcastBg from './assets/podcast-bg.jpg';
import sitzBg from './assets/sitz-bg.jpg';
import magazineBg from './assets/magazine-bg.jpg';
import museumBg from './assets/museum-bg.jpg';
import { MotionAccordion } from './components/motion-faqs-accordion.jsx';
import MemberSection from './MemberSection.jsx';
import FooterSection from './FooterSection.jsx';

const items = [
  {
    label: "Kyykkä Events",
    sublabel: "Training, tournaments, and events",
    description: "Kyykkä is a traditional Finnish sport that involves throwing wooden bats (Karttu) at a set of skittles (kyykkä). Vaka organizes kyykkä events, including training sessions, tournaments, and other related activities, to promote and preserve this unique Finnish sport amongst the diverse community of LUT & LAB students in Lahti. Vaka also sends a team to compete in the kyykkä championships hosted by other cities. Send us a message or email for collaborations and invitations!",
    linkText: "More information about Kyykkä",
    href: "https://en.wikipedia.org/wiki/Finnish_skittles",
    image: kyykkaBg,
  },
  {
    label: "Vaka Podcast",
    sublabel: "Discussions and interviews",
    description: "Discussions and interviews with students, alumni, and professionals, sharing their experiences and insights about the student culture and life.",
    linkText: "Podcast link",
    href: "https://www.youtube.com/@Vaka-ry",
    image: podcastBg,
  },
  {
    label: "Sitz Toastmasters",
    sublabel: "Training and support",
    description: "Sitz, or Sitsit, is an integral part of the Finnish student culture. Vaka ry provides training for sitz toastmasters, as well as providing trained toastmaster with songbooks customized for the theme as services for any association planning to organize a sitz party. Feel free to reach out to us for collaborations or training requests!",
    linkText: "More information about Sitz",
    href: "https://en.wikipedia.org/wiki/Sitsit",
    image: sitzBg,
  },
  {
    label: "Student Museum",
    sublabel: "Maintenance and operations",
    description: "How can we preserve the history and culture of student life in Lahti? Vaka ry maintains a student museum that showcases the history and traditions of student life in Lahti, as well as in other parts of Finland.",
    linkText: "More information about the Student Museum coming soon!",
    href: "#",
    image: museumBg,
  },
  {
    label: "Cultural Events",
    sublabel: "Wappu and fresher events",
    description: "Vaka ry organizes various events and activities for students, including Wappu celebrations, fresher events, and other cultural activities. These events provide opportunities for students to socialize, network, and engage with the student community in Lahti.",
    linkText: "Send us a message for collaborations and invitations!",
    href: "mailto:projects@vakary.fi",
    image: eventBg,
  },
  {
    label: "Wappu Magazine",
    sublabel: "Magazine and publication",
    description: "More information about the Wappu Magazine coming soon!",
    image: magazineBg,
  },

];

const contactSections = [
  {
    question: "Contact information",
    answer: (
      <>
        For any queries related to events, membership, or general inquiries,
        please contact us at{" "}
        <a href="mailto:board@vakary.fi" className="email-link">
         board@vakary.fi
        </a>
        .
        <br />
        We'll get back to you as soon as possible!
      </>
    ),
  },
  {
    question: "Invoicing information",
    answer: (
      <>
        For invoicing and billing-related questions, reach out to{" "}
        <a href="mailto:board@vakary.fi" className="email-link">
          board@vakary.fi
        </a>
        {" "}with your invoice details.
      </>
    ),
  },
  {
    question: "Sponsorships and media",
    answer: (
      <>
        Interested in sponsoring VAKA ry or covering our events? Contact us
        at{" "}
        <a href="mailto:board@vakary.fi" className="email-link">
          board@vakary.fi
        </a>
        {" "}for media and partnership inquiries.
      </>
    ),
  },
];



function Homepage() {

  const [showForm, setShowForm] = useState(false);
  const [mobileAccordionOpenHeight, setMobileAccordionOpenHeight] = useState(0);
  const nodeRef = useRef(null);

  const handleFormToggle = () => {
    setShowForm(!showForm);
  }

  return (
    <main className="homepage">
        <LandingHero />

      <section className="home-section home-section--projects" id="projects">
        <div className="home-section__texture" aria-hidden="true" />
        <div className="project-header mb-10">
          <h1><span className="px-4">Projects</span></h1>
        </div>
        <div className="home-section__mission-grid">
        <HoverExpand items={items} />
        </div>
      </section>

      <MemberSection />

      <section
        className="home-section contact-us"
        id="join"
        style={{ "--mobile-accordion-open-height": `${mobileAccordionOpenHeight}px` }}
      >
        <div className="home-section__texture" aria-hidden="true" />
        <div className="contact-us-header px-4">
          <h1>Contact Us</h1>
        </div>
        <div className="contact-us-content flex flex-column gap-6">
          <div className="contact-us-content-left">
            <MotionAccordion
              items={contactSections}
              gap={10}
              onAccordionHeightChange={setMobileAccordionOpenHeight}
            />
          </div>
          <div className="contact-us-content-right">
            <div className="home-instagram-embed" aria-label="VAKA ry Instagram profile">
            <iframe
              title="VAKA ry Instagram profile"
              src="https://www.instagram.com/vaka.ry/embed"
              loading="lazy"
              className="home-instagram-embed__frame"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a
              className="home-instagram-embed__link"
              href="https://www.instagram.com/vaka.ry/"
              target="_blank"
              rel="noopener noreferrer"
            >
            </a>
          </div>    
          </div>
        </div>
      </section>
      <FooterSection />
    </main>
  )
}

export default Homepage
