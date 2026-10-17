import { type FormEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { verifyResumePrintAccess } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowDownRight, ArrowUpRight, BriefcaseBusiness, ChevronRight, Linkedin, Mail, MapPin, Printer, Sparkles } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const linkedinProfileUrl = 'https://www.linkedin.com/in/your-profile/';

function Home() {
  const [isIntroVisible, setIsIntroVisible] = useState(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return false;
    }
    try {
      return window.sessionStorage.getItem('eg-site-intro-played') !== 'true';
    } catch {
      return true;
    }
  });
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printPassword, setPrintPassword] = useState('');
  const [printPasswordError, setPrintPasswordError] = useState('');
  const [isVerifyingPrintPassword, setIsVerifyingPrintPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [expandedProject, setExpandedProject] = useState<'climate' | 'finance' | null>(null);
  const printDialogOpenRef = useRef(false);
  const readingProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isIntroVisible) return;

    try {
      window.sessionStorage.setItem('eg-site-intro-played', 'true');
    } catch {
      // The intro still plays for this visit when storage is unavailable.
    }

    const timeoutId = window.setTimeout(() => setIsIntroVisible(false), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [isIntroVisible]);

  const openPrintDialog = () => {
    setPrintPassword('');
    setPrintPasswordError('');
    printDialogOpenRef.current = true;
    setIsPrintDialogOpen(true);
  };

  const handlePrintDialogChange = (open: boolean) => {
    printDialogOpenRef.current = open;
    setIsPrintDialogOpen(open);
    if (!open) {
      setPrintPassword('');
      setPrintPasswordError('');
    }
  };

  const handlePrintSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifyingPrintPassword(true);
    setPrintPasswordError('');

    try {
      const access = await verifyResumePrintAccess({ password: printPassword });
      if (!access.authorized) {
        setPrintPasswordError('That password was not accepted. Please try again.');
        return;
      }
      if (printDialogOpenRef.current) {
        handlePrintDialogChange(false);
        window.setTimeout(() => window.print(), 0);
      }
    } catch {
      setPrintPasswordError('Password verification failed. Please try again.');
    } finally {
      setIsVerifyingPrintPassword(false);
    }
  };

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        '',
        `${window.location.pathname}${window.location.search}`,
      );
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      readingProgressRef.current?.style.setProperty(
        '--reading-progress',
        String(Math.min(1, Math.max(0, progress))),
      );
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>('.scroll-reveal'),
    );
    const sectionItems = ['top', 'about', 'experience', 'selected-work', 'contact']
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -28px 0px' },
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const currentSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (currentSection) {
          setActiveSection(currentSection.target.id);
        }
      },
      { threshold: [0.05, 0.2, 0.4], rootMargin: '-18% 0px -66% 0px' },
    );
    sectionItems.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <main className="site-shell">
      {isIntroVisible && (
        <div className="site-intro" role="presentation">
          <div className="site-intro-orbit" aria-hidden="true" />
          <div className="site-intro-sun" aria-hidden="true" />
          <div className="site-intro-center" aria-hidden="true">
            <span className="site-intro-kicker">A PERSONAL SITE BY</span>
            <h2 className="site-intro-title"><span>Eric</span><em>Gulino.</em></h2>
            <span className="site-intro-rule"><i /></span>
            <p className="site-intro-meta">DESIGNER &amp; STRATEGIST <span>·</span> CHINO HILLS, CA</p>
          </div>
          <button
            className="site-intro-skip"
            type="button"
            aria-label="Skip welcome animation"
            onClick={() => setIsIntroVisible(false)}
          >
            Skip intro <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="reading-progress" ref={readingProgressRef} aria-hidden="true" />
      <header className="topbar" data-testid="navigation-main">
        <a className="wordmark" href="#top" aria-label="Back to top">EG<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#about" className={activeSection === 'about' ? 'is-active' : undefined} aria-current={activeSection === 'about' ? 'location' : undefined}>About</a>
          <a href="#experience" className={activeSection === 'experience' ? 'is-active' : undefined} aria-current={activeSection === 'experience' ? 'location' : undefined}>Experience</a>
          <a href="#selected-work" className={activeSection === 'selected-work' ? 'is-active' : undefined} aria-current={activeSection === 'selected-work' ? 'location' : undefined}>Selected work</a>
          <a href="#contact" className={activeSection === 'contact' ? 'is-active' : undefined} aria-current={activeSection === 'contact' ? 'location' : undefined}>Contact</a>
        </nav>
        <div className="topbar-actions">
          <a className="header-linkedin-button" href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
            <Linkedin size={15} aria-hidden="true" /> <span>LinkedIn</span>
          </a>
          <button className="print-button" onClick={openPrintDialog} data-testid="button-print-resume">
            <Printer size={15} strokeWidth={1.8} /> <span>Print résumé</span>
          </button>
        </div>
      </header>

      <Dialog open={isPrintDialogOpen} onOpenChange={handlePrintDialogChange}>
        <DialogContent className="resume-password-dialog">
          <DialogHeader className="resume-password-header">
            <DialogTitle className="resume-password-title">Print résumé</DialogTitle>
            <DialogDescription className="resume-password-description">
              Enter the password to continue to the print dialog.
            </DialogDescription>
          </DialogHeader>
          <form className="resume-password-form" onSubmit={handlePrintSubmit}>
            <label htmlFor="resume-print-password">Password</label>
            <input
              autoFocus
              autoComplete="current-password"
              id="resume-print-password"
              name="password"
              type="password"
              value={printPassword}
              onChange={(event) => setPrintPassword(event.target.value)}
              aria-invalid={Boolean(printPasswordError)}
              aria-describedby={printPasswordError ? 'resume-password-error' : undefined}
              required
            />
            {printPasswordError && (
              <p className="resume-password-error" id="resume-password-error" role="alert">
                {printPasswordError}
              </p>
            )}
            <div className="resume-password-actions">
              <button
                className="resume-password-cancel"
                disabled={isVerifyingPrintPassword}
                type="button"
                onClick={() => handlePrintDialogChange(false)}
              >
                Cancel
              </button>
              <button
                className="resume-password-submit"
                disabled={isVerifyingPrintPassword || !printPassword.trim()}
                type="submit"
              >
                {isVerifyingPrintPassword ? 'Checking…' : 'Verify & print'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="template-note" role="note">
        <Sparkles size={14} aria-hidden="true" />
        <span><strong>Editable sample profile</strong> — career, project, education, and contact details are example content. Replace them with your own.</span>
      </div>

      <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow reveal"><span className="eyebrow-line" /> DESIGNER &amp; STRATEGIST <span className="eyebrow-dot">/</span> CHINO HILLS, CA</p>
            <h1 id="hero-title" className="reveal reveal-delay">Eric<br /><em>Gulino</em><span className="hero-period">.</span></h1>
            <p className="hero-lede reveal reveal-delay">I make complicated things feel <em>clear</em> — and useful things feel a little more human.</p>
            <div className="hero-actions reveal reveal-delay">
              <a className="primary-link" href="#selected-work">Explore my work <ArrowDownRight size={16} /></a>
              <a className="text-link" href="mailto:hello@example.com">Say hello <ArrowUpRight size={15} /></a>
            </div>
          </div>
          <div className="hero-art reveal reveal-delay" aria-label="Abstract portrait illustration">
            <div className="art-note">A LITTLE<br />ABOUT ME <ArrowDown size={13} /></div>
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-sun" />
            <div className="art-figure">
              <div className="figure-hair" />
              <div className="figure-face">
                <span className="face-eye eye-left" /><span className="face-eye eye-right" />
                <span className="face-nose" /><span className="face-mouth" />
              </div>
              <div className="figure-neck" />
              <div className="figure-body"><span className="body-fold" /></div>
            </div>
            <div className="art-caption"><span>01 — 04</span><span>THE PERSON BEHIND THE PIXELS</span></div>
            <span className="art-star star-a" aria-hidden="true" /><span className="art-star star-b" aria-hidden="true" />
          </div>
        </div>
        <div className="hero-bottom scroll-reveal">
          <span>INDEPENDENT THINKER. GENEROUS COLLABORATOR.</span>
          <a href="#about" aria-label="Scroll to about section"><ArrowDown size={17} /></a>
          <span>AVAILABLE FOR THE RIGHT THING <i /></span>
        </div>
      </section>

      <section className="intro section-wrap" id="about">
        <div className="section-label"><span>01</span><span>THE SHORT VERSION</span></div>
        <div className="intro-content scroll-reveal">
          <h2 className="display-heading">Good work starts<br />with <em>good questions.</em></h2>
          <div className="intro-text">
            <p>I’m a multidisciplinary designer who likes finding the thread between what people need and what a business can make possible. Over the last decade, I’ve helped teams turn fuzzy ideas into useful products, clearer stories, and better ways of working.</p>
            <p>My sweet spot is the in-between: strategy and execution, big picture and tiny detail, a room full of opinions and the one thing we can all move forward on.</p>
            <div className="location-line"><MapPin size={15} /> Chino Hills, California <span>·</span> Working everywhere</div>
          </div>
        </div>
        <div className="principles">
          <div className="scroll-reveal"><span>01</span><strong>Stay curious</strong><p>Ask one better question before reaching for an answer.</p></div>
          <div className="scroll-reveal"><span>02</span><strong>Make it matter</strong><p>Beautiful is good. Useful, lasting, and kind is better.</p></div>
          <div className="scroll-reveal"><span>03</span><strong>Bring people along</strong><p>The best work is something a team can own together.</p></div>
        </div>
      </section>

      <section className="experience section-wrap" id="experience">
        <div className="section-label"><span>02</span><span>THE THROUGH LINE</span></div>
        <div className="section-heading-row scroll-reveal">
          <h2 className="display-heading">A few chapters<br /><em>so far.</em></h2>
          <p className="section-aside">A quick scan of the work, teams, and outcomes that shaped how I think.</p>
        </div>
        <div className="timeline">
          <article className="job-entry scroll-reveal">
            <div className="job-date">2021 — NOW <span>01</span></div>
            <div className="job-detail">
              <div className="job-title-row"><div><h3>Design Director</h3><p className="company">Fieldwork Studio <span>·</span> Independent design practice</p></div><BriefcaseBusiness size={18} /></div>
              <p className="job-summary">Partner with ambitious teams to make digital products more legible, useful, and distinctly theirs.</p>
              <ul><li>Led a four-person team through a full product rethink for a climate-tech platform, improving onboarding completion by 31%.</li><li>Built a lightweight research practice that gave a 40-person company a shared language for customer needs.</li></ul>
              <div className="tag-row"><span>Product strategy</span><span>Design leadership</span><span>Research</span></div>
            </div>
          </article>
          <article className="job-entry scroll-reveal">
            <div className="job-date">2017 — 2021 <span>02</span></div>
            <div className="job-detail">
              <div className="job-title-row"><div><h3>Senior Product Designer</h3><p className="company">Common Thread <span>·</span> Digital products for everyday life</p></div><BriefcaseBusiness size={18} /></div>
              <p className="job-summary">Made everyday financial tools easier to understand and more welcoming to use.</p>
              <ul><li>Redesigned the core account experience, cutting support requests about transfers by 24% in one quarter.</li><li>Introduced prototyping sessions that brought engineering into early decisions and shortened handoff cycles.</li></ul>
              <div className="tag-row"><span>UX / UI</span><span>Prototyping</span><span>Design systems</span></div>
            </div>
          </article>
          <article className="job-entry scroll-reveal">
            <div className="job-date">2014 — 2017 <span>03</span></div>
            <div className="job-detail">
              <div className="job-title-row"><div><h3>Visual Designer</h3><p className="company">Northstar &amp; Co. <span>·</span> Brand and experience agency</p></div><BriefcaseBusiness size={18} /></div>
              <p className="job-summary">Helped early-stage and established brands find a voice people could recognize and trust.</p>
              <ul><li>Designed brand identities and digital launches for teams across education, culture, and public health.</li></ul>
              <div className="tag-row"><span>Identity</span><span>Art direction</span><span>Digital</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="work-section section-wrap" id="selected-work">
        <div className="section-label"><span>03</span><span>SELECTED WORK</span></div>
        <div className="work-intro scroll-reveal">
          <h2 className="display-heading">A couple of things<br />I’m <em>proud of.</em></h2>
          <p>Not a portfolio parade. Just two examples of what happens when thoughtful people get in a room together.</p>
        </div>
        <div className="work-list">
          <article className="work-card work-card-one scroll-reveal">
            <div className="work-visual climate-visual"><div className="climate-ring ring-a" /><div className="climate-ring ring-b" /><span className="visual-word">A more<br /><em>livable</em><br />future.</span><span className="visual-index">FIELD NOTES / 2023</span></div>
            <div className="work-copy"><span>01 / CLIMATE TECH</span><h3>Making the invisible<br />feel actionable.</h3><p>A new way to understand a building’s energy story — and where to start.</p>
              <button className="work-arrow" type="button" aria-expanded={expandedProject === 'climate'} aria-controls="climate-project-details" onClick={() => setExpandedProject(expandedProject === 'climate' ? null : 'climate')}>
                {expandedProject === 'climate' ? 'Close case study' : 'Explore the case study'} <ArrowDown size={15} className={expandedProject === 'climate' ? 'work-arrow-icon is-open' : 'work-arrow-icon'} />
              </button>
            </div>
            <div className={expandedProject === 'climate' ? 'project-details is-open' : 'project-details'} id="climate-project-details" aria-hidden={expandedProject !== 'climate'}>
              <div className="project-details-inner">
                <p><strong>The challenge</strong><span>Make a building’s energy story clear to people who aren’t energy specialists.</span></p>
                <p><strong>The approach</strong><span>Turn dense data into a guided visual narrative with plain-language next steps.</span></p>
                <p><strong>The impact</strong><span>Give property teams a clearer place to begin reducing waste.</span></p>
              </div>
            </div>
          </article>
          <article className="work-card work-card-two scroll-reveal">
            <div className="work-visual common-visual"><div className="common-arch"><span>COMMON<br /><b>GROUND</b></span></div><span className="common-label">MONEY, WITHOUT THE MYSTERY</span><span className="coin coin-one" /><span className="coin coin-two" /></div>
            <div className="work-copy"><span>02 / FINANCIAL WELLNESS</span><h3>Less money jargon.<br />More peace of mind.</h3><p>Giving first-time savers a calmer place to build a little confidence.</p>
              <button className="work-arrow" type="button" aria-expanded={expandedProject === 'finance'} aria-controls="finance-project-details" onClick={() => setExpandedProject(expandedProject === 'finance' ? null : 'finance')}>
                {expandedProject === 'finance' ? 'Close case study' : 'Explore the case study'} <ArrowDown size={15} className={expandedProject === 'finance' ? 'work-arrow-icon is-open' : 'work-arrow-icon'} />
              </button>
            </div>
            <div className={expandedProject === 'finance' ? 'project-details is-open' : 'project-details'} id="finance-project-details" aria-hidden={expandedProject !== 'finance'}>
              <div className="project-details-inner">
                <p><strong>The challenge</strong><span>Make the first steps of saving feel understandable and non-intimidating.</span></p>
                <p><strong>The approach</strong><span>Replace financial jargon with guided prompts and calm progress cues.</span></p>
                <p><strong>The impact</strong><span>Help first-time savers feel more confident starting a habit.</span></p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="details-section section-wrap">
        <div className="section-label"><span>04</span><span>THE REST OF THE PICTURE</span></div>
        <div className="details-grid scroll-reveal">
          <div className="education-block">
            <h2 className="small-heading">Learning<br /><em>never really stops.</em></h2>
            <div className="education-item"><span>2014</span><div><strong>BFA, Communication Design</strong><p>Rhode Island School of Design</p></div></div>
            <div className="education-item"><span>2022</span><div><strong>Inclusive Design Leadership</strong><p>IDEO U · Certificate</p></div></div>
          </div>
          <div className="toolkit-block">
            <h2 className="small-heading">Things I bring<br /><em>to the table.</em></h2>
            <div className="toolkit-list"><span>Product thinking</span><span>Visual systems</span><span>Workshop facilitation</span><span>Figma &amp; prototyping</span><span>Research synthesis</span><span>Clear writing</span><span>Team mentorship</span><span>Asking why (again)</span></div>
            <p className="toolkit-footnote">The tools change. The way of thinking travels.</p>
          </div>
        </div>
          <div className="human-note scroll-reveal"><span className="note-mark">“</span><div><p>Outside of work, I’m usually rearranging the furniture, following a very specific bread recipe, or looking for a good excuse to take the long way home.</p><span>A SMALL HUMAN DETAIL — ALSO EDITABLE</span></div><span className="note-scribble" aria-hidden="true" /></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner scroll-reveal">
          <p className="eyebrow"><span className="eyebrow-line" /> NEXT CHAPTER, MAYBE?</p>
          <h2>Good things<br />start with <em>hello.</em></h2>
          <p className="contact-copy">Have a thoughtful challenge, a question, or a book I should read? My inbox is open.</p>
          <a className="contact-button" href="mailto:hello@example.com"><Mail size={17} /> hello@example.com <ArrowUpRight size={16} /></a>
          <div className="contact-foot"><span>Chino Hills, CA <span>·</span> Open to select collaborations</span><span>LINKEDIN / <a href={linkedinProfileUrl} target="_blank" rel="noopener noreferrer">LET’S CONNECT <ArrowUpRight size={12} /></a></span></div>
        </div>
        <div className="contact-side-mark" aria-hidden="true">EG.</div>
      </section>

      <footer className="footer">
        <a className="wordmark" href="#top">EG<span>.</span></a>
        <span>AN EDITABLE SAMPLE PROFILE <i /> BUILT TO BE YOURS</span>
        <a href="#top" className="back-top">BACK TO THE TOP <ChevronRight size={13} /></a>
      </footer>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
