import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const socials = [
    {
      id: "instagram",
      label: "Instagram",
      color: "#E1306C",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      label: "Facebook",
      color: "#1877F2",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      color: "#25D366",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      id: "x",
      label: "X (Twitter)",
      color: "#FFFFFF",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      color: "#0A66C2",
      href: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/allcourses" },
    { label: "Login", path: "/login" },
    { label: "My Profile", path: "/profile" },
    { label: "About Us", path: "/about" },
  ];

  const categories = [
    "Web Development",
    "AI / Machine Learning",
    "Data Science",
    "UI/UX Design",
    "Cloud Computing",
    "Cybersecurity",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        .cs-footer * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .cs-footer {
          font-family: 'Inter', sans-serif;
          background: #0A0A0A;
          color: #C8C8C8;
          position: relative;
          overflow: hidden;
        }

        /* ── Ambient glow blobs ── */
        .cs-glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .cs-glow-blob-1 {
          width: 400px; height: 400px;
          background: rgba(255,107,0,0.08);
          top: -100px; left: -100px;
          animation: csFloat 8s ease-in-out infinite;
        }
        .cs-glow-blob-2 {
          width: 300px; height: 300px;
          background: rgba(255,154,60,0.06);
          bottom: 50px; right: -80px;
          animation: csFloat 10s ease-in-out infinite reverse;
        }

        @keyframes csFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        /* ── Newsletter banner ── */
        .cs-newsletter {
          position: relative;
          z-index: 1;
          border-bottom: 1px solid rgba(255,107,0,0.15);
          padding: 48px 40px;
        }

        .cs-newsletter-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }

        .cs-newsletter-text h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 6px;
        }

        .cs-newsletter-text p {
          font-size: 0.875rem;
          color: #888;
        }

        .cs-newsletter-form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cs-email-input {
          background: #141414;
          border: 1px solid rgba(255,107,0,0.25);
          border-radius: 8px;
          padding: 12px 18px;
          color: #F5F5F5;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          width: 260px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .cs-email-input::placeholder { color: #555; }

        .cs-email-input:focus {
          border-color: #FF6B00;
          box-shadow: 0 0 0 3px rgba(255,107,0,0.12);
        }

        .cs-subscribe-btn {
          background: linear-gradient(135deg, #FF6B00, #FF9A3C);
          color: #0A0A0A;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }

        .cs-subscribe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,107,0,0.35);
        }

        .cs-subscribe-success {
          color: #25D366;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ── Main footer grid ── */
        .cs-main {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 56px 40px 48px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.4fr;
          gap: 48px;
        }

        @media (max-width: 1024px) {
          .cs-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .cs-main {
            grid-template-columns: 1fr;
            padding: 40px 24px 32px;
          }
          .cs-newsletter { padding: 36px 24px; }
          .cs-email-input { width: 100%; }
        }

        /* ── Brand column ── */
        .cs-brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .cs-building-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cs-building-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(255,107,0,0.6);
          animation: csPulse 2.5s ease-in-out infinite;
        }

        .cs-building-ring-outer {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1px solid rgba(255,107,0,0.2);
          animation: csPulse 2.5s ease-in-out infinite 0.5s;
        }

        @keyframes csPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }

        .cs-building-emoji {
          font-size: 24px;
          filter: drop-shadow(0 0 8px rgba(255,107,0,0.7));
          animation: csGlow 3s ease-in-out infinite;
        }

        @keyframes csGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(255,107,0,0.6)); }
          50% { filter: drop-shadow(0 0 14px rgba(255,154,60,0.9)); }
        }

        .cs-brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.375rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FF6B00, #FF9A3C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .cs-brand-desc {
          font-size: 0.85rem;
          line-height: 1.7;
          color: #777;
          margin-bottom: 24px;
        }

        /* ── Social icons ── */
        .cs-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cs-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #141414;
          border: 1px solid #222;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
          color: #888;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s, color 0.25s, background 0.25s;
          position: relative;
          overflow: hidden;
        }

        .cs-social-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 9px;
        }

        .cs-social-btn:hover {
          transform: translateY(-3px) scale(1.08);
        }

        /* ── Column headings ── */
        .cs-col-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FF6B00;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cs-col-heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,107,0,0.4), transparent);
        }

        /* ── Links ── */
        .cs-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cs-link-item {
          font-size: 0.875rem;
          color: #888;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          position: relative;
          transition: color 0.25s;
          width: fit-content;
        }

        .cs-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #FF6B00, #FF9A3C);
          transition: width 0.3s ease;
        }

        .cs-link-item:hover {
          color: #F5F5F5;
        }

        .cs-link-item:hover::after {
          width: 100%;
        }

        .cs-link-arrow {
          font-size: 0.7rem;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.25s, transform 0.25s;
          color: #FF6B00;
        }

        .cs-link-item:hover .cs-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Contact box ── */
        .cs-contact-box {
          background: linear-gradient(135deg, #141414, #111);
          border: 1px solid rgba(255,107,0,0.18);
          border-radius: 14px;
          padding: 22px 20px;
          position: relative;
          overflow: hidden;
        }

        .cs-contact-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #FF6B00, #FF9A3C, transparent);
        }

        .cs-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 14px;
          font-size: 0.8rem;
          color: #888;
          line-height: 1.5;
        }

        .cs-contact-item:last-child { margin-bottom: 0; }

        .cs-contact-icon {
          font-size: 1rem;
          margin-top: 1px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 4px rgba(255,107,0,0.5));
        }

        .cs-contact-link {
          color: #888;
          text-decoration: none;
          transition: color 0.25s;
        }

        .cs-contact-link:hover { color: #FF9A3C; }

        /* ── Divider ── */
        .cs-divider-wrap {
          position: relative;
          z-index: 1;
          padding: 0 40px;
        }

        .cs-divider {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,0,0.3), rgba(255,107,0,0.15), transparent);
        }

        /* ── Copyright bar ── */
        .cs-copyright {
          position: relative;
          z-index: 1;
          padding: 20px 40px 28px;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .cs-copyright-text {
          font-size: 0.8rem;
          color: #555;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cs-heart {
          color: #FF6B00;
          animation: csHeartbeat 1.4s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes csHeartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.25); }
          28% { transform: scale(1); }
          42% { transform: scale(1.15); }
          56% { transform: scale(1); }
        }

        .cs-copyright-links {
          display: flex;
          gap: 20px;
        }

        .cs-copyright-link {
          font-size: 0.775rem;
          color: #444;
          text-decoration: none;
          transition: color 0.25s;
        }

        .cs-copyright-link:hover { color: #FF6B00; }

        @media (max-width: 640px) {
          .cs-copyright, .cs-divider-wrap { padding: 16px 24px; }
          .cs-copyright { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>

      <footer className="cs-footer">
        {/* Ambient glow blobs */}
        <div className="cs-glow-blob cs-glow-blob-1" />
        <div className="cs-glow-blob cs-glow-blob-2" />

        {/* ── Newsletter ── */}
        <div className="cs-newsletter">
          <div className="cs-newsletter-inner">
            <div className="cs-newsletter-text">
              <h3>📧 Stay ahead of the curve</h3>
              <p>Get weekly tips, new course drops &amp; exclusive offers from Code Studio.</p>
            </div>
            {subscribed ? (
              <div className="cs-subscribe-success">
                <span>✅</span> You're in! Check your inbox.
              </div>
            ) : (
              <form className="cs-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  className="cs-email-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="cs-subscribe-btn" type="submit">
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="cs-main">

          {/* Brand column */}
          <div>
            <div className="cs-brand-logo">
              <div className="cs-building-wrap">
                <div className="cs-building-ring-outer" />
                <div className="cs-building-ring" />
                <span className="cs-building-emoji">🏛️</span>
              </div>
              <span className="cs-brand-name">Code Studio</span>
            </div>
            <p className="cs-brand-desc">
              AI-powered learning platform to help you grow smarter. Master in-demand skills with expert-crafted courses — learn anything, anytime, anywhere.
            </p>

            {/* Social icons */}
            <div className="cs-socials">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  className="cs-social-btn"
                  aria-label={s.label}
                  title={s.label}
                  onMouseEnter={() => setHoveredSocial(s.id)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={
                    hoveredSocial === s.id
                      ? {
                        color: s.color,
                        borderColor: s.color + "55",
                        background: s.color + "18",
                        boxShadow: `0 4px 16px ${s.color}33`,
                      }
                      : {}
                  }
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="cs-col-heading">Quick Links</h3>
            <ul className="cs-link-list">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <span className="cs-link-item">
                    <span className="cs-link-arrow">›</span>
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="cs-col-heading">Explore</h3>
            <ul className="cs-link-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <span className="cs-link-item">
                    <span className="cs-link-arrow">›</span>
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="cs-col-heading">Contact Us</h3>
            <div className="cs-contact-box">
              <div className="cs-contact-item">
                <span className="cs-contact-icon">📍</span>
                <span>42 Konark Nagar,Clover IT Park, Viman nagar, Pune — 411014</span>
              </div>
              <div className="cs-contact-item">
                <span className="cs-contact-icon">✉️</span>
                <a className="cs-contact-link" href="mailto:hello@codestudio.dev">
                  hello@codestudio.dev
                </a>
              </div>
              <div className="cs-contact-item">
                <span className="cs-contact-icon">📞</span>
                <a className="cs-contact-link" href="tel:+918000000000">
                  +91 8483846230
                </a>
              </div>
              <div className="cs-contact-item">
                <span className="cs-contact-icon">🕐</span>
                <span>Mon – Sat, 9 AM – 6 PM IST</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="cs-divider-wrap">
          <hr className="cs-divider" />
        </div>

        {/* Copyright */}
        <div className="cs-copyright">
          <p className="cs-copyright-text">
            © {new Date().getFullYear()} Code Studio. All rights reserved by CodeStudio.&nbsp;
            Made with <span className="cs-heart">♥</span>&nbsp;for curious minds.
          </p>
          <div className="cs-copyright-links">
            <a className="cs-copyright-link" href="#">Privacy Policy</a>
            <a className="cs-copyright-link" href="#">Terms of Service</a>
            <a className="cs-copyright-link" href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;