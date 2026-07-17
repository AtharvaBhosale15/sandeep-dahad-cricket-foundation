import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", textAlign: "left", marginBottom: "30px" }}>
        <div>
          <h3 style={{ color: "var(--accent-gold)", marginBottom: "15px", fontFamily: "var(--font-heading)" }}>SANDEEP DAHAD</h3>
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", display: "block", color: "var(--text-gray)", letterSpacing: "0.05em", marginBottom: "15px" }}>Cricket Foundation</span>
          <p style={{ fontSize: "0.9rem", color: "var(--text-gray)", lineHeight: "1.6" }}>
            Transforming cricket talent into charged performance. Led by Level-3 Coach Sandeep Dahad, we provide professional pathways, elite coaching programs, and expert consultations.
          </p>
        </div>

        <div>
          <h4 style={{ color: "var(--text-white)", marginBottom: "15px", fontFamily: "var(--font-heading)", textTransform: "uppercase", fontSize: "1rem", letterSpacing: "0.05em" }}>Quick Links</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: "10px", padding: 0 }}>
            <li><a href="#home" style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>Home</a></li>
            <li><a href="#about" style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>Head Coach</a></li>
            <li><a href="#philosophy" style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>Coaching Philosophy</a></li>
            <li><a href="#programs" style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>Coaching Programs</a></li>
            <li><a href="#gallery" style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>Gallery</a></li>
            <li><a href="#contact" style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>Book Session</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "var(--text-white)", marginBottom: "15px", fontFamily: "var(--font-heading)", textTransform: "uppercase", fontSize: "1rem", letterSpacing: "0.05em" }}>Coaching Enquiries</h4>
          <ul style={{ display: "flex", flexDirection: "column", gap: "12px", padding: 0 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "var(--text-gray)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--accent-gold)", flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 91363 57333</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "var(--text-gray)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--accent-gold)", flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span style={{ wordBreak: "break-all" }}>sdcricketfoundation@gmail.com</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "var(--text-gray)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--accent-gold)", flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span style={{ wordBreak: "break-all" }}>sandeepdahad26@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto", fontSize: "0.85rem" }}>
        <p>&copy; {new Date().getFullYear()} Sandeep Dahad Cricket Foundation. All Rights Reserved.</p>
        <p>Developed with Passion | <a href="#home">Back to Top</a></p>
      </div>
    </footer>
  );
}
