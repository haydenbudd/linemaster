import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Award,
  Shield,
  Wrench,
  Zap,
  FileText,
  Factory,
  Phone,
  Mail,
  Upload,
  ChevronRight,
  Wifi,
  SlidersHorizontal,
  Footprints,
  Cable,
  Box,
  HeartPulse,
  Brain,
  Ear,
  Eye,
  Smile,
  Stethoscope,
  BotMessageSquare,
  BedDouble,
  ScanLine,
  Cross,
  Tractor,
  ShieldCheck,
  HardHat,
  Plug,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Microscope,
} from 'lucide-react';

// ─── Color Tokens ───
const navy = '#0A1628';
const navyLight = '#0F1D32';
const blue = '#2563EB';
const blueMuted = 'rgba(37,99,235,0.15)';
const blueGlow = 'rgba(37,99,235,0.25)';
const gold = '#D4A853';
const goldMuted = 'rgba(212,168,83,0.15)';

// ─── Reusable animation wrapper ───
function FadeInOnScroll({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section wrapper ───
function Section({
  children,
  className = '',
  id,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section id={id} className={`relative py-14 md:py-20 ${className}`} style={style}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// ─── Badge ───
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
      style={{ background: blueMuted, color: blue }}
    >
      {children}
    </span>
  );
}

// ─── Glass Card ───
function GlassPanel({
  children,
  className = '',
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 ${hover ? 'hover:border-[#2563EB]/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.12)]' : ''} ${className}`}
      style={{
        background: 'rgba(15,29,50,0.6)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 1. HERO
// ═══════════════════════════════════════════════════
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: navy }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${blueGlow} 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 40% 50% at 80% 100%, ${goldMuted} 0%, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionBadge>Custom & OEM Solutions</SectionBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.08 }}
        >
          Your Vision.{' '}
          <span style={{ color: blue }}>Our Engineering.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
        >
          From concept to certified production — we deliver custom foot control
          solutions for the world's leading medical and industrial OEMs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#quote"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-110"
            style={{ background: blue, boxShadow: `0 0 32px ${blueGlow}` }}
          >
            Start Your Project
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#process"
            className="inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/5 hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
          >
            View Our Process
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-widest text-white/30"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> ISO 13485 Certified
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" /> 70+ Years
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Trusted by Fortune 500
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// 2. WHY LINEMASTER
// ═══════════════════════════════════════════════════
const valueProps = [
  {
    icon: Clock,
    title: '70+ Years of Expertise',
    description:
      'Seven decades of foot control engineering excellence, delivering proven solutions across medical and industrial markets worldwide.',
  },
  {
    icon: Shield,
    title: 'ISO 13485 Certified QMS',
    description:
      'Our quality management system meets the most demanding regulatory requirements for medical device manufacturing.',
  },
  {
    icon: Wrench,
    title: 'In-House Design & Engineering',
    description:
      'Dedicated mechanical, electrical, and firmware engineering teams collaborate under one roof for seamless development.',
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping',
    description:
      'From 3D printing to functional prototypes in days, not months. Accelerate your development timeline and reduce risk.',
  },
  {
    icon: FileText,
    title: 'Full Documentation & Traceability',
    description:
      'Complete design history files, validation protocols, and material traceability for regulatory submissions.',
  },
  {
    icon: Factory,
    title: 'Production-Ready Manufacturing',
    description:
      'Scalable domestic manufacturing from low-volume pilots to high-volume production runs with consistent quality.',
  },
];

function WhyLinemaster() {
  return (
    <Section id="why-linemaster" style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Why Linemaster</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            The OEM Partner of Choice
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Fortune 500 medical device companies trust Linemaster for critical
            foot control subsystems. Here's why.
          </p>
        </FadeInOnScroll>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {valueProps.map((vp, i) => (
          <FadeInOnScroll key={vp.title} delay={i * 0.08}>
            <GlassPanel hover className="h-full">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: blueMuted }}
              >
                <vp.icon className="h-5 w-5" style={{ color: blue }} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{vp.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {vp.description}
              </p>
            </GlassPanel>
          </FadeInOnScroll>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 3. OUR PROCESS
// ═══════════════════════════════════════════════════
const processSteps = [
  {
    icon: Users,
    title: 'Consultation & Requirements',
    description:
      'Deep-dive into your application, environment, regulatory needs, and performance criteria.',
  },
  {
    icon: Wrench,
    title: 'Design & Engineering',
    description:
      'Our team develops custom mechanical, electrical, and firmware designs tailored to your specifications.',
  },
  {
    icon: Microscope,
    title: 'Prototyping & Testing',
    description:
      'Rapid functional prototypes with rigorous testing — lifecycle, EMC, environmental, and usability.',
  },
  {
    icon: FileText,
    title: 'Documentation & Validation',
    description:
      'Complete design history files, IQ/OQ/PQ protocols, and regulatory documentation packages.',
  },
  {
    icon: Factory,
    title: 'Production & Delivery',
    description:
      'Scalable manufacturing with incoming inspection, in-process controls, and final acceptance testing.',
  },
];

function OurProcess() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Section id="process" style={{ background: navy }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Our Process</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            From Concept to Production
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            A proven five-stage development process refined over thousands of OEM
            engagements.
          </p>
        </FadeInOnScroll>
      </div>

      {/* Desktop: Horizontal timeline */}
      <div ref={ref} className="mt-20 hidden lg:block">
        {/* Connecting line */}
        <div className="relative mx-auto" style={{ maxWidth: '900px' }}>
          <div
            className="absolute left-0 right-0 top-6 h-0.5"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <motion.div
            className="absolute left-0 top-6 h-0.5"
            style={{ background: blue }}
            initial={{ width: '0%' }}
            animate={inView ? { width: '100%' } : {}}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="relative grid grid-cols-5 gap-4">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center text-center"
              >
                {/* Dot */}
                <div
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: blue,
                    background: navy,
                    boxShadow: `0 0 20px ${blueGlow}`,
                  }}
                >
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <span
                  className="mt-3 text-xs font-bold uppercase tracking-wider"
                  style={{ color: gold }}
                >
                  Step {i + 1}
                </span>
                <h4 className="mt-2 text-sm font-semibold text-white">
                  {step.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet: Vertical timeline */}
      <div className="mt-16 lg:hidden">
        <div className="relative ml-6">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <motion.div
            className="absolute left-0 top-0 w-0.5"
            style={{ background: blue }}
            initial={{ height: '0%' }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="space-y-10">
            {processSteps.map((step, i) => (
              <FadeInOnScroll key={step.title} delay={i * 0.1}>
                <div className="relative pl-10">
                  <div
                    className="absolute -left-[18px] top-0 flex h-9 w-9 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: blue,
                      background: navy,
                      boxShadow: `0 0 16px ${blueGlow}`,
                    }}
                  >
                    <step.icon className="h-4 w-4 text-white" />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: gold }}
                  >
                    Step {i + 1}
                  </span>
                  <h4 className="mt-1 text-base font-semibold text-white">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-white/45">
                    {step.description}
                  </p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </div>

      <FadeInOnScroll delay={0.4}>
        <div className="mt-14 text-center">
          <a
            href="#quote"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
            style={{ background: blue, boxShadow: `0 0 32px ${blueGlow}` }}
          >
            Start Your Project Today
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 4. CAPABILITIES
// ═══════════════════════════════════════════════════
const capabilities = [
  {
    icon: Footprints,
    title: 'Electrical & Pneumatic Footswitches',
    description:
      'Single and multi-pedal foot controls for precision actuation in demanding environments.',
  },
  {
    icon: Wifi,
    title: 'Wireless Solutions',
    description:
      'RF and Bluetooth-enabled cordless foot controls eliminating trip hazards and enabling mobility.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Linear Controls',
    description:
      'Variable-speed and proportional foot controls for precise analog control of equipment speed and position.',
  },
  {
    icon: Box,
    title: 'Multi-Pedal Configurations',
    description:
      'Complex multi-switch assemblies for surgical systems requiring simultaneous multi-function control.',
  },
  {
    icon: HeartPulse,
    title: 'Medical-Grade (IEC 60601)',
    description:
      'Foot controls designed, tested, and documented to meet IEC 60601-1 and related medical safety standards.',
  },
  {
    icon: Cable,
    title: 'Custom Housings, Cables & Connectors',
    description:
      'Bespoke enclosures, cable assemblies, and connector solutions to match your system requirements.',
  },
];

function Capabilities() {
  return (
    <Section id="capabilities" style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Capabilities</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            What We Can Build
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Comprehensive foot control engineering capabilities for the most
            demanding OEM applications.
          </p>
        </FadeInOnScroll>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, i) => (
          <FadeInOnScroll key={cap.title} delay={i * 0.08}>
            <GlassPanel hover className="group h-full">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300"
                style={{ background: goldMuted }}
              >
                <cap.icon className="h-5 w-5" style={{ color: gold }} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{cap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {cap.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: blue }}>
                Learn more <ChevronRight className="h-3 w-3" />
              </div>
            </GlassPanel>
          </FadeInOnScroll>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 5. APPLICATIONS / CASE STUDIES
// ═══════════════════════════════════════════════════
const medicalApps = [
  { icon: Brain, label: 'Neurosurgery' },
  { icon: Ear, label: 'ENT' },
  { icon: HeartPulse, label: 'Cardiac' },
  { icon: Stethoscope, label: 'Urology' },
  { icon: Eye, label: 'Ophthalmology' },
  { icon: Smile, label: 'Cosmetic Surgery' },
  { icon: BotMessageSquare, label: 'Surgical Robots' },
  { icon: BedDouble, label: 'Medical Tables' },
  { icon: ScanLine, label: 'Imaging Systems' },
  { icon: Cross, label: 'Dental' },
];

const industrialApps = [
  { icon: Tractor, label: 'Agriculture' },
  { icon: ShieldCheck, label: 'Military & Defense' },
  { icon: HardHat, label: 'Construction' },
  { icon: Plug, label: 'Utilities' },
];

function Applications() {
  return (
    <Section id="applications" style={{ background: navy }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Applications</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Industries We Serve
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            From the operating room to the factory floor, Linemaster foot
            controls enable precision and safety.
          </p>
        </FadeInOnScroll>
      </div>

      {/* Medical */}
      <FadeInOnScroll delay={0.2}>
        <div className="mt-16">
          <h3
            className="mb-6 text-center text-sm font-bold uppercase tracking-widest"
            style={{ color: gold }}
          >
            Medical Specialties
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {medicalApps.map((app) => (
              <GlassPanel hover key={app.label} className="flex flex-col items-center py-5 text-center">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: blueMuted }}
                >
                  <app.icon className="h-5 w-5" style={{ color: blue }} />
                </div>
                <span className="mt-3 text-xs font-medium text-white/70">
                  {app.label}
                </span>
              </GlassPanel>
            ))}
          </div>
        </div>
      </FadeInOnScroll>

      {/* Industrial */}
      <FadeInOnScroll delay={0.3}>
        <div className="mt-12">
          <h3
            className="mb-6 text-center text-sm font-bold uppercase tracking-widest"
            style={{ color: gold }}
          >
            Industrial & Defense
          </h3>
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {industrialApps.map((app) => (
              <GlassPanel hover key={app.label} className="flex flex-col items-center py-5 text-center">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: goldMuted }}
                >
                  <app.icon className="h-5 w-5" style={{ color: gold }} />
                </div>
                <span className="mt-3 text-xs font-medium text-white/70">
                  {app.label}
                </span>
              </GlassPanel>
            ))}
          </div>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={0.4}>
        <div className="mt-14 text-center">
          <a
            href="#quote"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-white"
            style={{ color: blue }}
          >
            Discuss Your Application
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 6. QUOTE REQUEST
// ═══════════════════════════════════════════════════
function QuoteSection() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    application: '',
    volume: '',
  });
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClasses =
    'w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-[#2563EB]/60 focus:ring-1 focus:ring-[#2563EB]/30';
  const inputStyle = {
    background: 'rgba(10,22,40,0.8)',
    borderColor: 'rgba(255,255,255,0.08)',
  };

  return (
    <Section id="quote" style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Get Started</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Request a Quote
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Tell us about your project. Our engineering team will respond within
            one business day.
          </p>
        </FadeInOnScroll>
      </div>

      <FadeInOnScroll delay={0.2}>
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <GlassPanel className="p-8">
              {submitted ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(34,197,94,0.15)' }}
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white">
                    Request Submitted
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-white/50">
                    Thank you for your interest. A Linemaster engineer will
                    review your requirements and contact you within one business
                    day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        placeholder="Your company"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        required
                        placeholder="Full name"
                        value={formData.contactName}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="(555) 555-5555"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Industry *
                      </label>
                      <select
                        name="industry"
                        required
                        value={formData.industry}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      >
                        <option value="">Select industry</option>
                        <option value="medical">Medical</option>
                        <option value="industrial">Industrial</option>
                        <option value="defense">Military & Defense</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Est. Annual Volume
                      </label>
                      <select
                        name="volume"
                        value={formData.volume}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      >
                        <option value="">Select volume</option>
                        <option value="under-100">Under 100 units</option>
                        <option value="100-500">100 - 500 units</option>
                        <option value="500-1000">500 - 1,000 units</option>
                        <option value="1000-5000">1,000 - 5,000 units</option>
                        <option value="5000-plus">5,000+ units</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                      Application Description *
                    </label>
                    <textarea
                      name="application"
                      required
                      rows={4}
                      placeholder="Describe your application, requirements, and any specific needs..."
                      value={formData.application}
                      onChange={handleChange}
                      className={`${inputClasses} resize-none`}
                      style={inputStyle}
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                      Specs / Drawings (optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-4 text-sm text-white/40 transition-colors duration-200 hover:border-white/20 hover:text-white/60"
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <Upload className="h-4 w-4" />
                      {fileName || 'Click to upload files (PDF, CAD, images)'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.step,.stp,.iges,.igs,.dxf,.dwg,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
                    style={{
                      background: blue,
                      boxShadow: `0 0 32px ${blueGlow}`,
                    }}
                  >
                    Submit Request
                  </button>
                </form>
              )}
            </GlassPanel>
          </div>

          {/* Side panel */}
          <div className="space-y-5">
            {/* Direct contact */}
            <GlassPanel>
              <h3 className="text-base font-semibold text-white">
                Prefer to Talk?
              </h3>
              <p className="mt-2 text-sm text-white/50">
                Speak directly with an OEM solutions engineer.
              </p>
              <a
                href="tel:8609741000"
                className="mt-4 flex items-center gap-2 text-lg font-bold"
                style={{ color: gold }}
              >
                <Phone className="h-4 w-4" />
                (860) 974-1000
              </a>
              <a
                href="mailto:oem@linemaster.com"
                className="mt-2 flex items-center gap-2 text-sm font-medium"
                style={{ color: blue }}
              >
                <Mail className="h-3.5 w-3.5" />
                oem@linemaster.com
              </a>
            </GlassPanel>

            {/* Trust badges */}
            <GlassPanel>
              <h3 className="mb-4 text-base font-semibold text-white">
                Certifications & Trust
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'ISO 13485:2016 Certified' },
                  { icon: CheckCircle2, text: 'IEC 60601-1 Compliant' },
                  { icon: Award, text: 'UL / CSA Listed' },
                  { icon: ShieldCheck, text: 'ITAR Registered' },
                  { icon: Factory, text: 'Made in Woodstock, CT, USA' },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-3 text-sm text-white/60"
                  >
                    <badge.icon className="h-4 w-4 flex-shrink-0" style={{ color: gold }} />
                    {badge.text}
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* NDA */}
            <GlassPanel>
              <p className="text-xs leading-relaxed text-white/40">
                All inquiries are held in strict confidence. We execute NDAs and
                can discuss your project requirements under mutual
                non-disclosure.
              </p>
            </GlassPanel>
          </div>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════
export default function CustomSolutionsPage() {
  return (
    <div className="min-h-screen" style={{ background: navy }}>
      <Hero />
      <WhyLinemaster />
      <OurProcess />
      <Capabilities />
      <Applications />
      <QuoteSection />
    </div>
  );
}
