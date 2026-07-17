"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine active section based on scroll position
      const sections = ["home", "about", "philosophy", "achievements", "legends", "programs", "gallery", "contact"];
      const scrollPosition = window.scrollY + 120; // offset for sticky nav

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileActive(!mobileActive);
  };

  const closeMobileMenu = () => {
    setMobileActive(false);
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "Head Coach" },
    { id: "philosophy", label: "Philosophy" },
    { id: "achievements", label: "Achievements" },
    { id: "programs", label: "Programs" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact Us" }
  ];

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="nav-container">
        <a href="#home" className="logo" onClick={closeMobileMenu}>
          <Image 
            src="/assets/logo.png" 
            alt="Sandeep Dahad Cricket Foundation Logo" 
            width={48} 
            height={48} 
            priority
          />
          <div className="logo-text">
            <h1>SANDEEP DAHAD</h1>
            <span>Cricket Foundation</span>
          </div>
        </a>

        <button 
          className="mobile-nav-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {mobileActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <nav className={`nav-links ${mobileActive ? "mobile-active" : ""}`}>
          {navLinks.map((link) => (
            <a 
              key={link.id} 
              href={`#${link.id}`} 
              className={activeSection === link.id ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {link.label}
            </a>
          ))}
          {/* Mobile CTA */}
          {mobileActive && (
            <a 
              href="#contact" 
              className="btn btn-primary" 
              onClick={closeMobileMenu}
              style={{ marginTop: "15px", width: "100%" }}
            >
              Book a Session
            </a>
          )}
        </nav>

        <div className="nav-cta">
          <a href="#contact" className="btn btn-primary">
            Book a Session
          </a>
        </div>
      </div>
    </header>
  );
}
