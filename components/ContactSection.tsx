import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Define types for analytics libraries
interface Plausible {
  (event: string, options?: { props?: Record<string, string> }): void;
}

interface Umami {
  track(event: string, meta?: Record<string, string>): void;
}

// Extend Window interface
declare global {
  interface Window {
    plausible?: Plausible;
    umami?: Umami;
    gtag?: (command: string, action: string, params: any) => void;
  }
}

// EmailButton component with robust handling
function EmailButton({
  email = "yitshacbw@gmail.com",
  subject = "Opportunity for Yitshac",
  body = "Hi Yitshac,\n\nI came across your portfolio and would like to discuss...",
}: {
  email?: string;
  subject?: string;
  body?: string;
}) {
  // Build a *fully encoded* mailto
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  function track(event: string) {
    if (typeof window === "undefined") return;
    window.plausible?.(event);
    window.umami?.track?.(event);
    window.gtag?.("event", "click", {
      event_category: "Contact",
      event_label: event,
    });
  }

  function handleClick() {
    // Fire analytics but DO NOT prevent navigation
    track("Contact — Email Click");

    // Belt-and-suspenders: force navigation after a tick
    // (lets analytics queue, still a user gesture → not a popup)
    setTimeout(() => {
      try {
        // Prefer direct navigation
        window.location.href = mailto;
      } catch {
        // Fallback
        window.open(mailto);
      }
    }, 0);
  }

  return (
    <a
      href={mailto}                         // keep native navigation
      onClick={handleClick}                 // plus manual fallback
      className="group inline-flex w-full items-center justify-center sm:w-auto z-20
                 relative isolation-auto    /* creates stacking context for z-index */
                 rounded-[40px] px-8 py-4 font-medium text-white
                 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]
                 shadow-[0_8px_24px_rgba(59,130,246,0.35)]
                 transition will-change-transform cursor-pointer
                 hover:translate-y-[-2px] hover:shadow-[0_10px_28px_rgba(59,130,246,0.45)]
                 active:translate-y-0 active:scale-[0.98] touch-action-manipulation
                 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
      aria-label={`Email ${email}`}
      data-umami-event="contact_email"
      style={{ WebkitTapHighlightColor: "rgba(0,0,0,0)" }}
    >
      <svg 
        aria-hidden="true" 
        className="mr-2 h-5 w-5" 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      Email
      <span aria-hidden className="ml-2 transition-transform group-hover:translate-x-1">→</span>
    </a>
  );
}

type Props = {
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
};

export default function Contact({
  email = "yitshacbw@gmail.com",
  linkedinUrl = "https://www.linkedin.com/in/yitshac-brody",
  githubUrl = "https://github.com/diy-code",
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  
  // Animation variants with reduced motion support
  const containerAnimation = {
    hidden: {},
    show: {
      transition: { 
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const fade = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full scroll-mt-24 px-6 sm:px-8 md:px-12 py-24 sm:py-28 md:py-32 text-center"
    >
      {/* Enhanced glow effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10
        [background:radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.15),rgba(0,0,0,0)_60%)]
        bg-transparent"
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={containerAnimation}
        className="mx-auto max-w-5xl pointer-events-auto" // Added pointer-events-auto
      >
        <motion.h2
          variants={fade}
          id="contact-heading"
          className="text-white/95 font-black tracking-tight text-4xl sm:text-5xl md:text-6xl"
        >
          Let&apos;s Build the{" "}
          <span className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">
            Future
          </span>
        </motion.h2>

        <motion.p 
            variants={fade}
            className="mx-auto mt-5 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-zinc-300"
        >
            I&apos;m a CS student who treats puzzles like gym reps: backend code,
             data crunching, or even a shot at entrepreneurship—it&apos;s all training for bigger challenges.
            Got a role, a project, or something bizarre you think I&apos;ll enjoy? Send it over. I answer faster than flaky tests 
            (and with 90% fewer runtime errors).
            <br />
            <strong>Email:{email}</strong>
        </motion.p>

        {/* CTAs with enhanced styling - REVERSED ORDER */}
        <motion.div 
          variants={fade}
          className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-4 sm:flex-row sm:justify-center pointer-events-auto z-20" // Added pointer-events-auto and z-20
        >
          {/* GitHub now first */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Don't stop propagation
              if (typeof window !== "undefined") {
                window.plausible?.("Contact — GitHub Click");
                window.umami?.track?.("Contact — GitHub Click");
              }
            }}
            className="inline-flex w-full items-center justify-center sm:w-auto z-20
              relative isolation-auto
              rounded-[40px] px-6 py-3 font-medium cursor-pointer
              text-zinc-200 border border-white/15 bg-white/[0.03] backdrop-blur
              transition hover:border-white/25 hover:bg-white/[0.06] 
              active:scale-[0.98] touch-action-manipulation
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            aria-label="View code on GitHub"
            data-umami-event="contact_github"
            style={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)' }}
          >
            <svg 
              aria-hidden="true"
              className="mr-2 h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M12 2C6.475 2 2 6.475 2 12C2 16.425 4.8625 20.1625 8.8375 21.4875C9.3375 21.575 9.525 21.275 9.525 21.0125C9.525 20.775 9.5125 19.9875 9.5125 19.15C7 19.6125 6.35 18.5375 6.15 17.975C6.0375 17.6875 5.55 16.8 5.125 16.5625C4.775 16.375 4.275 15.9125 5.1125 15.9C5.9 15.8875 6.4625 16.625 6.65 16.925C7.55 18.4375 8.9875 18.0125 9.5625 17.75C9.65 17.1 9.9125 16.6625 10.2 16.4125C7.975 16.1625 5.65 15.3 5.65 11.475C5.65 10.3875 6.0375 9.4875 6.675 8.7875C6.575 8.5375 6.225 7.5125 6.775 6.1375C6.775 6.1375 7.6125 5.875 9.525 7.1625C10.325 6.9375 11.175 6.825 12.025 6.825C12.875 6.825 13.725 6.9375 14.525 7.1625C16.4375 5.8625 17.275 6.1375 17.275 6.1375C17.825 7.5125 17.475 8.5375 17.375 8.7875C18.0125 9.4875 18.4 10.375 18.4 11.475C18.4 15.3125 16.0625 16.1625 13.8375 16.4125C14.2 16.725 14.5125 17.325 14.5125 18.2625C14.5125 19.6 14.5 20.675 14.5 21.0125C14.5 21.275 14.6875 21.5875 15.1875 21.4875C19.1375 20.1625 22 16.4125 22 12C22 6.475 17.525 2 12 2Z"
              />
            </svg>
            GitHub
          </a>

          {/* LinkedIn now second */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Don't stop propagation
              if (typeof window !== "undefined") {
                window.plausible?.("Contact — LinkedIn Click");
                window.umami?.track?.("Contact — LinkedIn Click");
              }
            }}
            className="inline-flex w-full items-center justify-center sm:w-auto z-20
              relative isolation-auto
              rounded-[40px] px-6 py-3 font-medium cursor-pointer
              text-zinc-200 border border-white/15 bg-white/[0.03] backdrop-blur
              transition hover:border-white/25 hover:bg-white/[0.06]
              active:scale-[0.98] touch-action-manipulation
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            aria-label="Connect on LinkedIn"
            data-umami-event="contact_linkedin"
            style={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)' }}
          >
            <svg 
              aria-hidden="true"
              className="mr-2 h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M20.47 2H3.53C2.69 2 2 2.69 2 3.53V20.47C2 21.31 2.69 22 3.53 22H20.47C21.31 22 22 21.31 22 20.47V3.53C22 2.69 21.31 2 20.47 2ZM8.09 18.74H5.07V9.24H8.09V18.74ZM6.58 7.98C5.56 7.98 4.74 7.15 4.74 6.13C4.74 5.11 5.56 4.28 6.58 4.28C7.61 4.28 8.43 5.11 8.43 6.13C8.43 7.15 7.61 7.98 6.58 7.98ZM18.91 18.74H15.89V14.13C15.89 12.98 15.87 11.49 14.27 11.49C12.65 11.49 12.38 12.74 12.38 14.04V18.74H9.36V9.24H12.27V10.51H12.31C12.72 9.77 13.7 8.99 15.18 8.99C18.24 8.99 18.91 11.07 18.91 13.77V18.74Z"
              />
            </svg>
            LinkedIn
          </a>

          {/* Email now last - REPLACED WITH IMPROVED COMPONENT */}
          <EmailButton email={email} />
        </motion.div>

        {/* Trust indicators with SVG icons */}
        <motion.div
          variants={fade}
          className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center gap-4 text-sm text-zinc-400"
        >
          <span className="flex items-center">
            <svg 
              aria-hidden="true"
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M21 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H21C22.1046 19 23 18.1046 23 17V7C23 5.89543 22.1046 5 21 5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M1 9H23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Response time: &lt; 24 hours
          </span>
          <span className="hidden sm:inline text-zinc-500">•</span>
          <span className="flex items-center">
            <svg 
              aria-hidden="true"
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M2 12H22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            IL/US timezones • Available immediately
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
