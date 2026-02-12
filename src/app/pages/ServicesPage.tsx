import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from '@/app/components/Router';
import {
  ArrowRight,
  Award,
  BookOpen,
  Box,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Cog,
  Factory,
  FileCheck,
  FileText,
  GraduationCap,
  Hammer,
  Layers,
  Lightbulb,
  MapPin,
  Microscope,
  Package,
  PenTool,
  Phone,
  Printer,
  Rocket,
  ScanLine,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  TestTube,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

// ─── Color Tokens ───
const navy = '#0A1628';
const navyLight = '#0F1D32';
const blue = '#2563EB';
const blueMuted = 'rgba(37,99,235,0.15)';
const blueGlow = 'rgba(37,99,235,0.25)';
const gold = '#D4A853';
const goldMuted = 'rgba(212,168,83,0.15)';
const green = '#10B981';
const greenMuted = 'rgba(16,185,129,0.15)';

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
    <section id={id} className={`relative py-20 md:py-28 ${className}`} style={style}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// ─── Badge ───
function SectionBadge({
  children,
  color = blue,
  bg = blueMuted,
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
      style={{ background: bg, color }}
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

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionBadge>Engineering Services</SectionBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.08 }}
        >
          Engineering Excellence,{' '}
          <span style={{ color: blue }}>End to End</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
        >
          From initial concept through certified production, Linemaster provides
          comprehensive engineering services to bring your foot control solution
          to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            to="/custom-solutions"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-110"
            style={{ background: blue, boxShadow: `0 0 32px ${blueGlow}` }}
          >
            Start Your Project
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#services-overview"
            className="inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/5 hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
          >
            Explore Our Services
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
            <Factory className="h-3.5 w-3.5" /> Full In-House Manufacturing
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// 2. SERVICES OVERVIEW — Three Pillars
// ═══════════════════════════════════════════════════
const servicePillars = [
  {
    icon: Cog,
    title: 'Design & Production',
    accent: blue,
    accentBg: blueMuted,
    description:
      'From concept development and 3D CAD engineering through tooling, manufacturing, and quality control — all under one roof.',
    anchor: '#design-production',
  },
  {
    icon: FileCheck,
    title: 'Documentation, Traceability & Design Validation',
    accent: gold,
    accentBg: goldMuted,
    description:
      'Rigorous documentation systems meeting the most demanding regulatory requirements, including ISO 14971 risk management and IEC 60601 compliance.',
    anchor: '#documentation',
  },
  {
    icon: GraduationCap,
    title: 'On-Site Technical Training',
    accent: green,
    accentBg: greenMuted,
    description:
      'Hands-on facility visits that walk your team through our design, testing, engineering, and control technologies.',
    anchor: '#training',
  },
];

function ServicesOverview() {
  return (
    <Section id="services-overview" style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Our Services</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Comprehensive Engineering Services
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Three integrated service pillars that take your project from initial
            idea to certified, production-ready foot control solutions.
          </p>
        </FadeInOnScroll>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {servicePillars.map((pillar, i) => (
          <FadeInOnScroll key={pillar.title} delay={i * 0.1}>
            <GlassPanel hover className="group flex h-full flex-col">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: pillar.accentBg }}
              >
                <pillar.icon className="h-6 w-6" style={{ color: pillar.accent }} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                {pillar.description}
              </p>
              <a
                href={pillar.anchor}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-white"
                style={{ color: pillar.accent }}
              >
                Learn More
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </GlassPanel>
          </FadeInOnScroll>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 3. DESIGN & PRODUCTION — Detailed Section
// ═══════════════════════════════════════════════════
const designCapabilities = [
  { icon: Lightbulb, label: 'Concept Development & Feasibility Analysis' },
  { icon: PenTool, label: '3D CAD Design & Engineering' },
  { icon: Zap, label: 'Electrical & Mechanical Engineering' },
  { icon: Rocket, label: 'Prototype Development & Iteration' },
  { icon: Settings, label: 'DFM (Design for Manufacturability) Optimization' },
  { icon: Hammer, label: 'Tooling Design & Fabrication' },
  { icon: Factory, label: 'Production Line Setup & Scaling' },
  { icon: ScanLine, label: 'Quality Control & Statistical Process Control' },
];

const manufacturingCapabilities = [
  {
    icon: Box,
    title: 'Injection Molding',
    description: 'Custom enclosures and components with tight tolerances and high repeatability.',
  },
  {
    icon: Wrench,
    title: 'Cable Assembly',
    description: 'Complete cable and harness manufacturing with in-line testing and verification.',
  },
  {
    icon: Layers,
    title: 'PCB Assembly',
    description: 'Surface mount and through-hole PCB assembly with automated optical inspection.',
  },
  {
    icon: Cog,
    title: 'Mechanical Assembly',
    description: 'Multi-stage assembly operations with integrated quality checkpoints.',
  },
  {
    icon: Printer,
    title: 'Pad Printing & Labeling',
    description: 'Durable marking and labeling for regulatory compliance and brand identification.',
  },
  {
    icon: Microscope,
    title: 'Testing & Inspection',
    description: 'Functional testing, hi-pot, continuity, and final acceptance testing protocols.',
  },
];

function DesignProduction() {
  return (
    <Section id="design-production" style={{ background: navy }}>
      {/* Two-column layout */}
      <div className="grid items-start gap-12 lg:grid-cols-2">
        {/* Content left */}
        <div>
          <FadeInOnScroll>
            <SectionBadge>
              <Cog className="h-3.5 w-3.5" /> Design & Production
            </SectionBadge>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1}>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Design & Production
            </h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.15}>
            <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
              Our in-house engineering team works directly with your team from
              concept through production-ready manufacturing. Every step of the
              process is managed under one roof, ensuring seamless communication
              and faster time to market.
            </p>
          </FadeInOnScroll>

          {/* Capability bullets */}
          <div className="mt-8 space-y-3">
            {designCapabilities.map((cap, i) => (
              <FadeInOnScroll key={cap.label} delay={0.2 + i * 0.05}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: blueMuted }}
                  >
                    <cap.icon className="h-4 w-4" style={{ color: blue }} />
                  </div>
                  <span className="text-sm font-medium text-white/70">
                    {cap.label}
                  </span>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>

        {/* Visual placeholder right */}
        <FadeInOnScroll delay={0.2}>
          <div
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border"
            style={{
              background: `linear-gradient(135deg, ${blueMuted} 0%, rgba(15,29,50,0.8) 50%, ${goldMuted} 100%)`,
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div className="text-center">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{ background: blueMuted }}
              >
                <Cog className="h-10 w-10" style={{ color: blue }} />
              </div>
              <p className="mt-4 text-sm font-medium text-white/40">
                Full-Service Engineering
              </p>
              <p className="mt-1 text-xs text-white/25">
                Concept to Production Under One Roof
              </p>
            </div>
            {/* Decorative grid pattern */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>
        </FadeInOnScroll>
      </div>

      {/* Manufacturing Capabilities Sub-section */}
      <div className="mt-20">
        <FadeInOnScroll>
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Manufacturing Capabilities
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/45">
              Vertically integrated manufacturing ensures quality and
              consistency from raw materials to finished product.
            </p>
          </div>
        </FadeInOnScroll>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {manufacturingCapabilities.map((cap, i) => (
            <FadeInOnScroll key={cap.title} delay={i * 0.08}>
              <GlassPanel hover className="h-full">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: blueMuted }}
                >
                  <cap.icon className="h-5 w-5" style={{ color: blue }} />
                </div>
                <h4 className="mt-4 text-base font-semibold text-white">
                  {cap.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-white/45">
                  {cap.description}
                </p>
              </GlassPanel>
            </FadeInOnScroll>
          ))}
        </div>
      </div>

      {/* CTA */}
      <FadeInOnScroll delay={0.3}>
        <div className="mt-14 text-center">
          <Link
            to="/custom-solutions"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
            style={{ background: blue, boxShadow: `0 0 32px ${blueGlow}` }}
          >
            Discuss Your Design
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 4. DOCUMENTATION, TRACEABILITY & DESIGN VALIDATION
// ═══════════════════════════════════════════════════
const documentationCapabilities = [
  {
    icon: FileText,
    title: 'Design History File (DHF)',
    description:
      'Complete design documentation from requirements through verification and validation.',
  },
  {
    icon: ClipboardCheck,
    title: 'Device Master Record (DMR)',
    description:
      'Comprehensive production documentation ensuring consistency and compliance.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk Management (ISO 14971)',
    description:
      'Systematic risk analysis, evaluation, and control throughout the product lifecycle.',
  },
  {
    icon: TestTube,
    title: 'Design Verification & Validation',
    description:
      'Rigorous testing protocols including environmental, mechanical, and electrical testing.',
  },
  {
    icon: Shield,
    title: 'IEC 60601 Compliance',
    description:
      'Full compliance testing and documentation for medical electrical equipment safety.',
  },
  {
    icon: Award,
    title: 'UL/CSA Certification Support',
    description:
      'Support through the complete UL and CSA certification process.',
  },
  {
    icon: Package,
    title: 'Component Traceability',
    description:
      'Lot-level traceability from raw materials through finished product.',
  },
  {
    icon: Settings,
    title: 'Change Control',
    description:
      'Formal change management ensuring design integrity throughout production.',
  },
];

const certifications = [
  { label: 'ISO 13485:2016', icon: Shield },
  { label: 'IEC 60601-1', icon: ShieldCheck },
  { label: 'UL Listed', icon: Award },
  { label: 'CSA Certified', icon: CheckCircle2 },
];

function Documentation() {
  return (
    <Section id="documentation" style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge color={gold} bg={goldMuted}>
            <FileCheck className="h-3.5 w-3.5" /> Documentation & Validation
          </SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Documentation, Traceability &{' '}
            <span style={{ color: gold }}>Design Validation</span>
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/50 sm:text-lg">
            Linemaster maintains rigorous documentation and traceability systems
            that meet the most demanding regulatory requirements in the medical
            device industry.
          </p>
        </FadeInOnScroll>
      </div>

      {/* Capabilities grid */}
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {documentationCapabilities.map((cap, i) => (
          <FadeInOnScroll key={cap.title} delay={i * 0.06}>
            <GlassPanel hover className="h-full">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: goldMuted }}
              >
                <cap.icon className="h-5 w-5" style={{ color: gold }} />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-white">
                {cap.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-white/45">
                {cap.description}
              </p>
            </GlassPanel>
          </FadeInOnScroll>
        ))}
      </div>

      {/* Certifications display */}
      <FadeInOnScroll delay={0.3}>
        <div className="mt-14">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">
              Certifications & Compliance
            </h3>
            <p className="mt-2 text-sm text-white/40">
              Our quality system meets the highest standards in the industry
            </p>
          </div>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.label}
                className="flex items-center gap-2.5 rounded-full border px-5 py-2.5"
                style={{
                  borderColor: 'rgba(212,168,83,0.2)',
                  background: 'rgba(212,168,83,0.05)',
                }}
              >
                <cert.icon className="h-4 w-4" style={{ color: gold }} />
                <span className="text-sm font-semibold text-white/80">
                  {cert.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeInOnScroll>

      {/* CTA */}
      <FadeInOnScroll delay={0.4}>
        <div className="mt-14 text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-white/5"
            style={{ borderColor: 'rgba(212,168,83,0.3)', color: gold }}
          >
            Learn About Our Quality System
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 5. ON-SITE TECHNICAL TRAINING
// ═══════════════════════════════════════════════════
const trainingIncludes = [
  {
    icon: BookOpen,
    title: 'Product Technology Deep Dive',
    description:
      'Detailed overview of footswitch technologies, configurations, and applications.',
  },
  {
    icon: Users,
    title: 'Engineering Consultation',
    description:
      'Direct access to our engineering team to discuss your specific requirements.',
  },
  {
    icon: MapPin,
    title: 'Facility Tour',
    description:
      'Walk through our manufacturing facility and see our capabilities firsthand.',
  },
  {
    icon: Microscope,
    title: 'Application Review',
    description:
      'Analyze your current and future foot control needs with our experts.',
  },
  {
    icon: Sparkles,
    title: 'Custom Solution Workshop',
    description:
      'Collaborative session to explore custom solutions for your applications.',
  },
];

const trainingBenefits = [
  'Accelerate your product development timeline',
  'Reduce design iterations with upfront engineering collaboration',
  'Gain confidence in supplier capabilities and quality systems',
  'Build stronger engineering partnerships',
];

function Training() {
  return (
    <Section id="training" style={{ background: navy }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge color={green} bg={greenMuted}>
            <GraduationCap className="h-3.5 w-3.5" /> Technical Training
          </SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            On-Site{' '}
            <span style={{ color: green }}>Technical Training</span>
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            A hands-on visit that walks your team through our design, testing,
            engineering, and control technologies.
          </p>
        </FadeInOnScroll>
      </div>

      {/* What's included */}
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trainingIncludes.map((item, i) => (
          <FadeInOnScroll key={item.title} delay={i * 0.08}>
            <GlassPanel hover className="h-full">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: greenMuted }}
              >
                <item.icon className="h-5 w-5" style={{ color: green }} />
              </div>
              <h4 className="mt-4 text-base font-semibold text-white">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                {item.description}
              </p>
            </GlassPanel>
          </FadeInOnScroll>
        ))}
      </div>

      {/* Benefits */}
      <FadeInOnScroll delay={0.3}>
        <div className="mx-auto mt-16 max-w-2xl">
          <GlassPanel className="p-8">
            <h3 className="text-center text-xl font-bold text-white">
              Why Schedule a Training Visit?
            </h3>
            <div className="mt-6 space-y-4">
              {trainingBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 flex-shrink-0"
                    style={{ color: green }}
                  />
                  <span className="text-sm leading-relaxed text-white/60">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </FadeInOnScroll>

      {/* CTA */}
      <FadeInOnScroll delay={0.4}>
        <div className="mt-14 text-center">
          <Link
            to="/custom-solutions"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
            style={{ background: green, boxShadow: `0 0 32px ${greenMuted}` }}
          >
            Schedule a Visit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-white/35">
            Contact our sales team to arrange an on-site visit tailored to your
            team's needs.
          </p>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 6. PROCESS TIMELINE
// ═══════════════════════════════════════════════════
const timelineSteps = [
  {
    icon: Users,
    title: 'Initial Consultation',
    description:
      'Deep-dive discovery session to understand your application, environment, and performance requirements.',
  },
  {
    icon: FileText,
    title: 'Requirements & Specifications',
    description:
      'Formal documentation of technical requirements, regulatory needs, and acceptance criteria.',
  },
  {
    icon: PenTool,
    title: 'Design & Engineering',
    description:
      'Custom mechanical, electrical, and firmware design by our dedicated engineering team.',
  },
  {
    icon: TestTube,
    title: 'Prototyping & Testing',
    description:
      'Rapid functional prototypes with lifecycle, EMC, environmental, and usability testing.',
  },
  {
    icon: ClipboardCheck,
    title: 'Documentation & Validation',
    description:
      'Complete design history files, verification/validation protocols, and regulatory packages.',
  },
  {
    icon: Factory,
    title: 'Production & Delivery',
    description:
      'Scalable manufacturing with in-process controls, final acceptance testing, and on-time delivery.',
  },
  {
    icon: Wrench,
    title: 'Ongoing Support',
    description:
      'Continuous engineering support, design updates, and supply chain management for the product lifecycle.',
  },
];

function ProcessTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Section id="process" style={{ background: navyLight }}>
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
            A proven seven-stage development process refined over thousands of
            OEM engagements and 70+ years of engineering excellence.
          </p>
        </FadeInOnScroll>
      </div>

      {/* Desktop: Horizontal timeline */}
      <div ref={ref} className="mt-20 hidden xl:block">
        <div className="relative mx-auto" style={{ maxWidth: '1100px' }}>
          {/* Connecting line background */}
          <div
            className="absolute left-0 right-0 top-6 h-0.5"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          {/* Animated connecting line */}
          <motion.div
            className="absolute left-0 top-6 h-0.5"
            style={{ background: blue }}
            initial={{ width: '0%' }}
            animate={inView ? { width: '100%' } : {}}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="relative grid grid-cols-7 gap-3">
            {timelineSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center text-center"
              >
                {/* Dot */}
                <div
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: blue,
                    background: navyLight,
                    boxShadow: `0 0 20px ${blueGlow}`,
                  }}
                >
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <span
                  className="mt-3 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: gold }}
                >
                  Step {i + 1}
                </span>
                <h4 className="mt-2 text-xs font-semibold leading-snug text-white">
                  {step.title}
                </h4>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/40">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet: Two-row layout */}
      <div className="mt-16 hidden md:block xl:hidden">
        <div className="relative">
          <div className="grid grid-cols-4 gap-5">
            {timelineSteps.slice(0, 4).map((step, i) => (
              <FadeInOnScroll key={step.title} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: blue,
                      background: navyLight,
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
                </div>
              </FadeInOnScroll>
            ))}
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-5">
            {timelineSteps.slice(4).map((step, i) => (
              <FadeInOnScroll key={step.title} delay={(i + 4) * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: blue,
                      background: navyLight,
                      boxShadow: `0 0 20px ${blueGlow}`,
                    }}
                  >
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <span
                    className="mt-3 text-xs font-bold uppercase tracking-wider"
                    style={{ color: gold }}
                  >
                    Step {i + 5}
                  </span>
                  <h4 className="mt-2 text-sm font-semibold text-white">
                    {step.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                    {step.description}
                  </p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="mt-16 md:hidden">
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
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="space-y-10">
            {timelineSteps.map((step, i) => (
              <FadeInOnScroll key={step.title} delay={i * 0.08}>
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
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 7. FINAL CTA SECTION
// ═══════════════════════════════════════════════════
function CTASection() {
  return (
    <Section style={{ background: navy }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${blueGlow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative text-center">
        <FadeInOnScroll>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Ready to Get Started?
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50 sm:text-lg">
            Our engineering team is ready to discuss your next project.
          </p>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/custom-solutions"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-110"
              style={{ background: blue, boxShadow: `0 0 32px ${blueGlow}` }}
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:8609741000"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: gold }}
            >
              <Phone className="h-4 w-4" />
              Call Us: (860) 974-1000
            </a>
          </div>
        </FadeInOnScroll>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════
export default function ServicesPage() {
  return (
    <div className="min-h-screen" style={{ background: navy }}>
      <Hero />
      <ServicesOverview />
      <DesignProduction />
      <Documentation />
      <Training />
      <ProcessTimeline />
      <CTASection />
    </div>
  );
}
