import React, { useEffect, useState } from "react";
import logo from "../../../assets/trendskart/home/Logocrop.png";

/* ─── Particle ─── */
function Particle({ style }) {
  return <span className="cs-particle" style={style} />;
}

export default function ComingSoon() {
  const [particles, setParticles] = useState([]);

  /* generate floating particles once */
  useEffect(() => {
    const arr = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 10}s`,
      size: `${4 + Math.random() * 10}px`,
      opacity: 0.15 + Math.random() * 0.35,
    }));
    setParticles(arr);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .cs-root {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
        }

        /* Radial glow blobs */
        .cs-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .cs-blob-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%);
          top: -150px; left: -150px;
          animation: blobPulse1 8s ease-in-out infinite;
        }
        .cs-blob-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%);
          bottom: -100px; right: -100px;
          animation: blobPulse2 11s ease-in-out infinite;
        }
        .cs-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          animation: blobPulse1 14s ease-in-out infinite reverse;
        }

        @keyframes blobPulse1 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50%       { transform: scale(1.15) translate(30px, 20px); }
        }
        @keyframes blobPulse2 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50%       { transform: scale(1.1) translate(-20px, -30px); }
        }

        /* Particles */
        .cs-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(220,38,38,0.6);
          pointer-events: none;
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          0%   { transform: translateY(110vh) scale(0.5); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }

        /* Inner card */
        .cs-card {
          position: relative;
          z-index: 10;
          max-width: 700px;
          width: 100%;
          text-align: center;
        }

        /* Logo */
        .cs-logo {
          height: 52px;
          object-fit: contain;
          display: block;
          margin: 0 auto 2.5rem;
          filter: brightness(0) invert(1);
        }

        /* Badge */
        .cs-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(220,38,38,0.12);
          border: 1px solid rgba(220,38,38,0.35);
          color: #f87171;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 1.75rem;
        }
        .cs-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 0 0 rgba(239,68,68,0.6);
          animation: pulse 1.8s ease-out infinite;
        }
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          70%  { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }

        /* Headline */
        .cs-headline {
          font-size: clamp(2.6rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          color: #fff;
          margin-bottom: 1.25rem;
          letter-spacing: -0.03em;
        }
        .cs-headline span {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sub */
        .cs-sub {
          color: #9ca3af;
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 480px;
          margin: 0 auto 3rem;
          font-weight: 400;
        }

        /* Divider line */
        .cs-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin-bottom: 2rem;
        }

        /* Social icons */
        .cs-socials {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .cs-social {
          width: 42px; height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: #6b7280;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
          font-size: 1rem;
        }
        .cs-social:hover {
          border-color: #ef4444;
          color: #ef4444;
          transform: translateY(-2px);
        }

        /* Footer note */
        .cs-footer {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.72rem;
          color: #374151;
          letter-spacing: 0.05em;
          z-index: 10;
          white-space: nowrap;
        }
      `}</style>

      <div className="cs-root">
        {/* Background blobs */}
        <div className="cs-blob cs-blob-1" />
        <div className="cs-blob cs-blob-2" />
        <div className="cs-blob cs-blob-3" />

        {/* Floating particles */}
        {particles.map((p) => (
          <Particle
            key={p.id}
            style={{
              left: p.left,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}

        <div className="cs-card">
          {/* Logo */}
          <img src={logo} alt="Logo" className="cs-logo" />

          {/* Badge */}
          <div className="cs-badge">
            <span className="cs-badge-dot" />
            Something Big Is Coming
          </div>

          {/* Headline */}
          <h1 className="cs-headline">
            We're <span>Launching</span>
            <br />
            Very Soon
          </h1>

          {/* Subtext */}
          <p className="cs-sub">
            We're crafting an extraordinary experience just for you.
            Sign up to be the first to know when we go live — and get
            exclusive early-access perks.
          </p>

          {/* Divider */}
          <div className="cs-line" />

          {/* Social icons */}
          <div className="cs-socials">
            {/* Instagram */}
            <a href="#" className="cs-social" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="#" className="cs-social" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        <p className="cs-footer">© {new Date().getFullYear()} MrFone · All rights reserved</p>
      </div>
    </>
  );
}
