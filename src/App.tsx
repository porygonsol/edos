import { useState, type ReactNode } from "react";

const Arrow = () => <span aria-hidden="true">→</span>;

function WaitlistButton({ dark = false, onClick }: { dark?: boolean; onClick?: () => void }) {
  return (
    <a
      className={`waitlist-button ${dark ? "waitlist-button--dark" : ""}`}
      href="#waitlist"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      Join the waitlist <Arrow />
    </a>
  );
}

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <a className={`brand ${dark ? "brand--dark" : ""}`} href="#top" aria-label="EdOS home">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
      </span>
      <span>EdOS</span>
    </a>
  );
}

type IconName = "book" | "network" | "chart" | "shield" | "cap" | "layers" | "calendar" | "user";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    book: (
      <>
        <path d="M4 5.5c3.2-1.1 5.4-.3 8 1.7v12c-2.6-2-4.8-2.8-8-1.7z" />
        <path d="M20 5.5c-3.2-1.1-5.4-.3-8 1.7v12c2.6-2 4.8-2.8 8-1.7z" />
      </>
    ),
    network: (
      <>
        <circle cx="12" cy="5" r="2.6" />
        <circle cx="5.5" cy="18" r="2.6" />
        <circle cx="18.5" cy="18" r="2.6" />
        <path d="m10.8 7.4-4 8M13.2 7.4l4 8M8.1 18h7.8" />
      </>
    ),
    chart: (
      <>
        <path d="M5 20v-6M12 20V9M19 20V4" />
        <path d="M3 20h18" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.7 2.8 8.1 7 10 4.2-1.9 7-5.3 7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    cap: (
      <>
        <path d="m3 10 9-5 9 5-9 5zM7 12.4V17c3 2.3 7 2.3 10 0v-4.6M21 10v6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16m-12 4h3m2 0h3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M6 20c.5-4 2.5-6 6-6s5.5 2 6 6" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      {paths[name]}
    </svg>
  );
}

const steps = [
  { number: "01", title: "Explore", text: "Bring in what you want\nto learn from anywhere." },
  { number: "02", title: "Understand", text: "Build a clear and\nconnected understanding." },
  { number: "03", title: "Connect", text: "Link ideas across\ncourses, tools, and projects." },
  { number: "04", title: "Prove", text: "Turn your learning into\na verifiable proof." },
];

const features: { icon: IconName; title: string; text: string }[] = [
  { icon: "book", title: "Learn in your own way", text: "Use videos, notes, courses, and more." },
  {
    icon: "network",
    title: "See the bigger picture",
    text: "Connect ideas across topics and tools.",
  },
  {
    icon: "chart",
    title: "Track real understanding",
    text: "A living view of what you actually know.",
  },
  {
    icon: "shield",
    title: "Build your proof",
    text: "Projects, artifacts, and verifiable evidence.",
  },
];

function PhoneMockup() {
  return (
    <div className="phone-wrap" aria-label="EdOS mobile app preview">
      <div className="phone">
        <div className="phone-screen">
          <div className="phone-island" />
          <div className="phone-brand">
            <Brand dark />
          </div>
          <p className="phone-greeting">Good morning, Sham! 👋</p>
          <div className="course-card">
            <small>Learning</small>
            <strong>Data Engineering</strong>
            <div>
              <i />
              <b>72%</b>
            </div>
          </div>
          <div className="phone-list">
            <div>
              <span>
                <Icon name="calendar" />
              </span>
              <p>
                <b>Today&apos;s Focus</b>
                <small>ETL Pipelines</small>
              </p>
            </div>
            <div>
              <span>
                <Icon name="layers" />
              </span>
              <p>
                <b>Next Up</b>
                <small>Data Modeling</small>
              </p>
            </div>
            <div>
              <span>
                <Icon name="shield" />
              </span>
              <p>
                <b>Your Proof</b>
                <small>3 artifacts</small>
              </p>
            </div>
          </div>
          <div className="phone-nav">
            <Icon name="cap" />
            <Icon name="network" />
            <Icon name="chart" />
            <Icon name="user" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterCrop({ className, variant }: { className: string; variant: "hero" | "peek" }) {
  return (
    <div className={`character-crop ${className}`} aria-hidden="true">
      <img
        className={`character-sheet character-sheet--${variant}`}
        src="/assets/characters.png"
        alt=""
      />
    </div>
  );
}

function HeroCompanions() {
  return (
    <div className="hero-companions" aria-hidden="true">
      <div className="companion companion--mastery">
        <img src="/assets/characters.png" alt="" />
      </div>
      <div className="companion companion--ediy">
        <img src="/assets/characters.png" alt="" />
      </div>
      <div className="companion companion--proof">
        <img src="/assets/characters.png" alt="" />
      </div>
    </div>
  );
}

/* ── Waitlist Page ─────────────────────────────────────────── */

function WaitlistPage({ onBack }: { onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // GA4 event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "waitlist_signup", {
          event_category: "engagement",
          event_label: form.role || "not specified",
        });
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="site waitlist-page-wrap">
      <section className="waitlist-page">
        {/* Brand using the tiny standalone Ediy character from characters.png (bottom-right) */}
        <a
          className="waitlist-brand"
          href="#top"
          aria-label="EdOS home"
          onClick={(e) => { e.preventDefault(); onBack(); }}
        >
          <span className="waitlist-brand-icon" aria-hidden="true">
            <img src="/assets/characters.png" alt="" />
          </span>
          <span>EdOS</span>
        </a>

        <div className="waitlist-card">
          {submitted ? (
            <div className="waitlist-success">
              <div className="waitlist-success-icon">🎉</div>
              <h2>You&apos;re on the list!</h2>
              <p>
                We&apos;ll reach out to <strong>{form.email}</strong> as soon as EdOS is ready for
                you.
              </p>
            </div>
          ) : (
            <>
              <p className="eyebrow">Early access</p>
              <h1>
                Join the
                <br />
                waitlist.
              </h1>
              <p>
                Be the first to experience EdOS — the AI-native learning OS built for deep,
                connected understanding.
              </p>
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoComplete="name"
                  disabled={loading}
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  aria-label="I am a..."
                  disabled={loading}
                >
                  <option value="" disabled>
                    I am a...
                  </option>
                  <option value="student">Student</option>
                  <option value="professional">Working professional</option>
                  <option value="educator">Educator</option>
                  <option value="institution">Institution / org</option>
                  <option value="other">Other</option>
                </select>
                {error && <p className="waitlist-error">{error}</p>}
                <button type="submit" className="waitlist-submit" disabled={loading}>
                  {loading ? "Saving your spot..." : <>Reserve my spot <Arrow /></>}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="waitlist-back">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
          >
            ← Back to home
          </a>
        </p>
      </section>
    </main>
  );
}

/* ── Main App ──────────────────────────────────────────────── */

export default function App() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  if (showWaitlist) {
    return <WaitlistPage onBack={() => setShowWaitlist(false)} />;
  }

  const openWaitlist = () => setShowWaitlist(true);

  return (
    <main id="top" className="site">
      <header className="header page-width">
        <Brand />
        <nav aria-label="Main navigation">
          <WaitlistButton onClick={openWaitlist} />
        </nav>
      </header>

      <section id="about" className="hero page-width">
        <div className="hero-copy">
          <p className="eyebrow">The learning OS</p>
          <h1>
            Learn deeply.
            <br />
            Know what you
            <br />
            <em>know.</em>
          </h1>
          <p className="hero-subtitle">
            An AI-native learning platform for
            <br className="desktop-break" /> independent learning, connected
            <br className="desktop-break" /> understanding, and a real proof of what you know.
          </p>
          <WaitlistButton onClick={openWaitlist} />
        </div>
        <div className="hero-visual">
          <HeroCompanions />
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <img className="floating-star star-one" src="/assets/star.png" alt="" />
          <img className="floating-star star-two" src="/assets/star.png" alt="" />
        </div>
      </section>

      <section className="flow page-width">
        <p className="eyebrow">The flow</p>
        <h2>How EdOS works.</h2>
        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.number}>
              <div className="step-number">
                <span>{step.number}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="app-section page-width">
        <div className="phone-stage">
          <PhoneMockup />
          <div className="phone-cloud phone-cloud--one" />
          <div className="phone-cloud phone-cloud--two" />
        </div>
        <div className="app-copy">
          <p className="eyebrow">The app</p>
          <h2>Your learning space.</h2>
          <div className="features">
            {features.map((feature) => (
              <div className="feature" key={feature.title}>
                <span className="feature-icon">
                  <Icon name={feature.icon} />
                </span>
                <p>
                  <strong>{feature.title}</strong>
                  <small>{feature.text}</small>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="institutions" className="proof page-width">
        <div className="proof-copy">
          <h2>Wouldn&apos;t it be cool if...</h2>
          <p>
            ... your learning could actually show
            <br />
            what you understand — not just that
            <br />
            you attended?
          </p>
        </div>
        <div className="proof-cards">
          {/* hand-drawn curved arrow — arc from above-left curving down to EdOS card */}
          <svg
            className="sketch-arrow"
            viewBox="0 0 90 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M 10 8 C 18 2, 52 8, 76 46"
              stroke="#1c1c3a"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M 76 46 L 62 44 L 68 33 Z" fill="#1c1c3a" />
          </svg>
          {/* energy / stress lines above EdOS card (reference shows 3 short diagonal lines) */}
          <svg
            className="proof-energy-lines"
            viewBox="0 0 36 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <line x1="6"  y1="30" x2="1"  y2="6"  stroke="#1c1c3a" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="18" y1="30" x2="17" y2="2"  stroke="#1c1c3a" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="30" y1="30" x2="35" y2="6"  stroke="#1c1c3a" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <div className="proof-card degree">
            <h3>
              <Icon name="cap" /> A Degree
            </h3>
            <p>✓ &nbsp;Courses attended</p>
            <p>✓ &nbsp;Exams cleared</p>
            <p>✓ &nbsp;A certificate</p>
          </div>
          <div className="proof-card edos-card">
            <h3>
              <Icon name="chart" /> With EdOS
            </h3>
            <p>✓ &nbsp;Concepts understood</p>
            <p>✓ &nbsp;Projects completed</p>
            <p>✓ &nbsp;Real proof of learning</p>
          </div>
        </div>
      </section>

      <section id="waitlist" className="final-cta page-width">
        <p className="eyebrow">Meet Ediy</p>
        <h2>Your AI learning companion.</h2>
        <p>Always with you — to explore, understand, connect, and prove your learning.</p>
        <WaitlistButton dark onClick={openWaitlist} />
        <CharacterCrop className="final-character" variant="peek" />
      </section>

      <footer>
        <span>
          Made with <b>♥</b> by{" "}
          <a href="https://www.porygonsol.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
            porygon
          </a>
        </span>
      </footer>
    </main>
  );
}
