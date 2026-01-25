import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Marquee } from '@/components/effects/Marquee';

// Professional SVG Logo Components
const GoogleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 272 92" fill="currentColor">
    <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
    <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
    <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
    <path d="M225 3v65h-9.5V3h9.5z"/>
    <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
    <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
  </svg>
);

const MetaLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <path d="M449.446 0C483.971 0 512 28.03 512 62.554v386.892C512 483.97 483.97 512 449.446 512H342.978V319.085h66.6l12.672-82.621h-79.272v-53.617c0-22.603 11.073-44.636 46.58-44.636H425.6v-70.34s-32.71-5.582-63.982-5.582c-65.288 0-107.96 39.569-107.96 111.204v62.971h-72.573v82.621h72.573V512H62.554C28.03 512 0 483.97 0 449.446V62.554C0 28.03 28.029 0 62.554 0h386.892z"/>
  </svg>
);

const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 168 168" fill="currentColor">
    <path d="M84 0C37.8 0 0 37.8 0 84s37.8 84 84 84 84-37.8 84-84S130.2 0 84 0zm38.5 121.2c-1.5 2.5-4.7 3.2-7.2 1.7-19.8-12.1-44.7-14.8-74-8.1-2.8.6-5.7-1.1-6.3-3.9-.6-2.8 1.1-5.7 3.9-6.3 32-7.3 59.6-4.2 81.9 9.3 2.5 1.5 3.2 4.7 1.7 7.3zm10.3-22.9c-1.9 3.1-5.9 4-9 2.1-22.7-13.9-57.3-18-84.1-9.8-3.4 1-7-.9-8-4.3-1-3.4.9-7 4.3-8 30.6-9.3 68.6-4.8 94.7 11.2 3.1 1.9 4 5.9 2.1 8.8zm.9-23.8c-27.2-16.2-72.1-17.7-98.1-9.8-4.2 1.3-8.6-1.1-9.8-5.2-1.3-4.2 1.1-8.6 5.2-9.8 29.9-9.1 79.5-7.3 110.9 11.3 3.7 2.2 5 7.1 2.7 10.9-2.2 3.7-7 5-10.9 2.6z"/>
  </svg>
);

const SlackLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 127 127" fill="currentColor">
    <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z"/>
    <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z"/>
    <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z"/>
    <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z"/>
  </svg>
);

const NotionLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor">
    <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z"/>
    <path fill="var(--background, white)" d="M61.35 4.226l-55.333 4.087C1.553 8.7 0 11.616 0 15.113v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.437-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.873-2.847-3.443-4.733L74.167 3.463c-4.273-3.107-6.02-3.5-12.817-2.917zM25.92 19.523c-5.247.353-6.437.433-9.417-1.99L8.927 11.507c-.77-.78-.383-1.753 1.557-1.947l53.193-3.887c4.467-.39 6.793 1.167 8.54 2.527l9.123 6.61c.39.197 1.36 1.36.193 1.36l-54.933 3.307-.68.047zM19.803 88.3V30.367c0-2.53.78-3.697 3.1-3.893L81.3 22.78c2.14-.193 3.107 1.167 3.107 3.693v57.547c0 2.53-.39 4.67-3.883 4.863l-56.14 3.31c-3.497.193-5.18-1.167-5.18-3.893z"/>
  </svg>
);

const FigmaLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 38 57" fill="currentColor">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
  </svg>
);

// Israeli Tech Companies
const WixLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 80" fill="currentColor">
    <path d="M25 15l15 50 15-50h15l-22.5 65h-15L10 15h15zm60 0h15l10 35 10-35h15l10 35 10-35h15l-17.5 50h-15l-10-35-10 35h-15L85 15zm90 0h15v50h-15V15z"/>
  </svg>
);

const MondayLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 50" fill="currentColor">
    <circle cx="20" cy="25" r="15"/>
    <circle cx="55" cy="25" r="15"/>
    <circle cx="90" cy="25" r="15"/>
    <text x="115" y="33" fontSize="28" fontWeight="bold">monday</text>
  </svg>
);

const FiverrLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 89 27" fill="currentColor">
    <path d="M81.6 13.1h-3.1c-2 0-3.1 1.5-3.1 4.1v9.3h-6V13.1h-2.5c-2 0-3.1 1.5-3.1 4.1v9.3h-6V13.1H55c-2 0-3.1 1.5-3.1 4.1v9.3h-6V7.5h6v2.3c1-1.9 2.7-2.8 5.3-2.8h3.7v2.3c1-1.9 2.7-2.8 5.3-2.8h4.2v2.3c1-1.9 2.7-2.8 5.3-2.8h5.9v7.1zm-58.3.8c-.8-.6-2-1-3.4-1-2.5 0-4.3 1.4-4.3 3.6 0 2.1 1.8 3.6 4.3 3.6 1.4 0 2.6-.4 3.4-1v-5.2zm0 11.6h-6v-1.7c-1.2 1.4-3 2.2-5.2 2.2-4.4 0-8.1-3.3-8.1-8.8s3.7-8.8 8.1-8.8c2.2 0 4 .8 5.2 2.2V7.5h6v18zM11.8 18.2c0-2.5-1.7-4.3-4.1-4.3-2.4 0-4.1 1.8-4.1 4.3 0 2.5 1.7 4.3 4.1 4.3 2.4 0 4.1-1.8 4.1-4.3zm-14.3 0c0-5.5 4.4-9.4 10.2-9.4 5.8 0 10.2 3.9 10.2 9.4 0 5.5-4.4 9.4-10.2 9.4C1.9 27.6-2.5 23.7-2.5 18.2z"/>
  </svg>
);

const JFrogLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="currentColor">
    <text x="0" y="30" fontSize="28" fontWeight="bold">JFrog</text>
  </svg>
);

const ElementorLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="currentColor">
    <rect x="5" y="5" width="8" height="30"/>
    <rect x="20" y="5" width="20" height="8"/>
    <rect x="20" y="16" width="15" height="8"/>
    <rect x="20" y="27" width="20" height="8"/>
    <text x="50" y="28" fontSize="18" fontWeight="bold">lementor</text>
  </svg>
);

const LemonadeLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 140 40" fill="currentColor">
    <text x="0" y="30" fontSize="26" fontWeight="bold">lemonade</text>
  </svg>
);

interface ClientLogo {
  Logo: React.ComponentType<{ className?: string }>;
  name: string;
}

const ClientLogosMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const logosRow1: ClientLogo[] = [
    { Logo: GoogleLogo, name: 'Google' },
    { Logo: MetaLogo, name: 'Meta' },
    { Logo: SpotifyLogo, name: 'Spotify' },
    { Logo: SlackLogo, name: 'Slack' },
    { Logo: NotionLogo, name: 'Notion' },
    { Logo: FigmaLogo, name: 'Figma' },
  ];

  const logosRow2: ClientLogo[] = [
    { Logo: WixLogo, name: 'Wix' },
    { Logo: MondayLogo, name: 'Monday.com' },
    { Logo: FiverrLogo, name: 'Fiverr' },
    { Logo: JFrogLogo, name: 'JFrog' },
    { Logo: ElementorLogo, name: 'Elementor' },
    { Logo: LemonadeLogo, name: 'Lemonade' },
  ];

  const LogoItem = ({ logo }: { logo: ClientLogo }) => {
    const { Logo } = logo;
    return (
      <motion.div
        className="flex items-center justify-center px-10 md:px-14"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Logo className="h-6 md:h-8 w-auto opacity-40 hover:opacity-100 transition-all duration-500 text-muted-foreground hover:text-foreground" />
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="clients"
      dir="rtl"
      className="relative py-16 md:py-20 bg-background overflow-hidden"
    >
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Header */}
      <div className="container mx-auto px-6 mb-10">
        <motion.p
          className="text-center text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          אלפי עסקים מכל הסוגים כבר סומכים עלינו
        </motion.p>
      </div>

      {/* Marquee Row 1 - Right to Left (slow: ~75s loop) */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Marquee
          speed={8}
          pauseOnHover
          className="py-4"
        >
          {logosRow1.map((logo, index) => (
            <LogoItem key={index} logo={logo} />
          ))}
        </Marquee>
      </motion.div>

      {/* Marquee Row 2 - Left to Right (slow: ~60s loop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Marquee
          speed={10}
          pauseOnHover
          reverse
          className="py-4"
        >
          {logosRow2.map((logo, index) => (
            <LogoItem key={index} logo={logo} />
          ))}
        </Marquee>
      </motion.div>

      {/* Gradient Fade Edges */}
      <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};

export default ClientLogosMarquee;
