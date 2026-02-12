import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Shield,
  Award,
  Target,
  Eye,
  Heart,
  Lightbulb,
  Handshake,
  CheckCircle,
  Cog,
  FlaskConical,
  Factory,
  ClipboardCheck,
  Package,
  Wrench,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  FileCheck,
  GraduationCap,
  Stethoscope,
  Microscope,
  MonitorSmartphone,
  Tractor,
  Radio,
  HardHat,
  UtensilsCrossed,
  Swords,
  Trash2,
  Zap,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Activity,
  Bone,
  Ear,
  ScanEye,
  Bot,
  BedDouble,
  Droplets,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const NAVY = "#0A1628";
const NAVY_LIGHT = "#0F2038";
const NAVY_LIGHTER = "#162A4A";
const BLUE = "#2563EB";
const BLUE_GLOW = "rgba(37,99,235,0.35)";
const GOLD = "#D4A853";
const GOLD_DIM = "rgba(212,168,83,0.15)";
const WHITE = "#FFFFFF";
const GRAY = "#94A3B8";
const GRAY_LIGHT = "#CBD5E1";

// ---------------------------------------------------------------------------
// Shared animation helpers
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function SectionWrapper({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={`relative px-6 md:px-12 lg:px-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      variants={fadeUp}
      className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-4"
      style={{ color: GOLD }}
    >
      <span className="inline-block w-8 h-px" style={{ background: GOLD }} />
      {children}
    </motion.span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeUp}
      className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6"
      style={{ color: WHITE }}
    >
      {children}
    </motion.h2>
  );
}

function Divider() {
  return (
    <div className="w-full flex justify-center py-2">
      <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)` }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. Hero
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden"
      style={{ background: `linear-gradient(170deg, ${NAVY} 0%, #0E1E3A 50%, ${NAVY_LIGHT} 100%)` }}
    >
      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${BLUE} 1px, transparent 1px), linear-gradient(90deg, ${BLUE} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      {/* Radial glow */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${BLUE_GLOW} 0%, transparent 60%)` }} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 max-w-4xl mx-auto px-6 py-32"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase mb-6"
          style={{ color: GOLD }}
        >
          <Shield className="w-4 h-4" />
          About Linemaster Switch
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8"
          style={{ color: WHITE }}
        >
          70+ Years of{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, #60A5FA 50%, ${GOLD} 100%)` }}
          >
            Engineering Excellence
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: GRAY_LIGHT }}
        >
          Since our founding, Linemaster Switch Corporation has been the trusted partner for the
          world's most demanding medical and industrial applications.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
          <a
            href="#certifications"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: BLUE, color: WHITE }}
          >
            Our Certifications
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#capabilities"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: WHITE }}
          >
            Manufacturing Capabilities
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div variants={fadeUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs tracking-wide uppercase" style={{ color: GRAY }}>
          <span className="flex items-center gap-2"><Award className="w-4 h-4" style={{ color: GOLD }} /> ISO 13485 Certified</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><Shield className="w-4 h-4" style={{ color: BLUE }} /> IEC 60601 Compliant</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><Star className="w-4 h-4" style={{ color: GOLD }} /> Fortune 500 OEM Partner</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. Company Story
// ---------------------------------------------------------------------------
function CompanyStorySection() {
  return (
    <SectionWrapper className="py-24 lg:py-32 max-w-7xl mx-auto" id="story">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <div>
          <SectionLabel>Our Story</SectionLabel>
          <SectionTitle>From Industrial Roots to Medical-Grade Precision</SectionTitle>

          <motion.div variants={fadeUp} className="space-y-5 text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
            <p>
              Linemaster Switch Corporation began as a pioneer in industrial foot control
              manufacturing, building rugged, reliable foot switches for factories and heavy-duty
              applications across the United States. Over the decades, our relentless pursuit of
              engineering excellence led us to an entirely new frontier: medical-grade precision.
            </p>
            <p>
              Today, we are an <strong className="font-semibold" style={{ color: WHITE }}>ISO 13485:2016 certified</strong> medical
              device component supplier, trusted by the world's leading OEMs&mdash;including{" "}
              <strong className="font-semibold" style={{ color: WHITE }}>Johnson &amp; Johnson</strong>,{" "}
              <strong className="font-semibold" style={{ color: WHITE }}>Stryker</strong>, and other Fortune 500
              multinationals&mdash;to deliver foot control solutions that meet the most stringent
              regulatory and quality standards.
            </p>
            <p>
              Our evolution from industrial workhorse to certified medical partner is a testament to
              our culture of continuous improvement, deep engineering expertise, and an unwavering
              commitment to the safety and performance our customers demand.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 mt-10">
            {[
              { value: "70+", label: "Years" },
              { value: "500+", label: "OEM Partners" },
              { value: "1M+", label: "Units Shipped" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold" style={{ color: BLUE }}>{stat.value}</div>
                <div className="text-xs uppercase tracking-wider mt-1" style={{ color: GRAY }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — image placeholder */}
        <motion.div
          variants={fadeUp}
          className="relative rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center"
          style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
        >
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${BLUE_GLOW} 0%, transparent 70%)` }} />
          <div className="relative text-center p-8">
            <Factory className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: BLUE }} />
            <p className="text-sm" style={{ color: GRAY }}>Company Heritage Photo</p>
            <p className="text-xs mt-1" style={{ color: GRAY }}>800 x 600 recommended</p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 3. Mission, Vision & Values
// ---------------------------------------------------------------------------
const missionCards = [
  {
    icon: Target,
    title: "Our Mission",
    body: "Deliver precision-engineered foot control solutions that empower medical professionals and industrial operators to perform at their best, with uncompromising safety, reliability, and innovation.",
    accent: BLUE,
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "Be the global standard for medical and industrial foot controls, recognized worldwide as the partner of choice for innovation, quality, and customer-centric engineering.",
    accent: GOLD,
  },
  {
    icon: Heart,
    title: "Our Values",
    body: "",
    accent: BLUE,
    values: [
      { icon: Award, label: "Quality" },
      { icon: Lightbulb, label: "Innovation" },
      { icon: Handshake, label: "Partnership" },
      { icon: Shield, label: "Integrity" },
    ],
  },
];

function MissionSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32 max-w-7xl mx-auto" id="mission">
      <div className="text-center mb-16">
        <SectionLabel>Who We Are</SectionLabel>
        <SectionTitle>Mission, Vision &amp; Values</SectionTitle>
      </div>

      <motion.div variants={stagger} className="grid md:grid-cols-3 gap-8">
        {missionCards.map((card) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 group"
            style={{
              background: NAVY_LIGHTER,
              border: `1px solid rgba(255,255,255,0.06)`,
            }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
              style={{ background: `${card.accent}15` }}
            >
              <card.icon className="w-7 h-7" style={{ color: card.accent }} />
            </div>
            <h3 className="text-xl font-bold mb-4" style={{ color: WHITE }}>
              {card.title}
            </h3>
            {card.body && (
              <p className="text-sm leading-relaxed" style={{ color: GRAY_LIGHT }}>
                {card.body}
              </p>
            )}
            {card.values && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                {card.values.map((v) => (
                  <div key={v.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                      <v.icon className="w-4 h-4" style={{ color: BLUE }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: GRAY_LIGHT }}>
                      {v.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ boxShadow: `inset 0 0 40px ${card.accent}08, 0 0 30px ${card.accent}06` }}
            />
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 4. Certifications & Quality
// ---------------------------------------------------------------------------
const qualityHighlights = [
  { icon: FileCheck, title: "Documentation & Traceability", desc: "Full device history records, lot traceability, and comprehensive documentation for every product shipped." },
  { icon: ClipboardCheck, title: "Design Validation Services", desc: "DFMEA, PFMEA, verification and validation protocols aligned with FDA 21 CFR 820 and ISO 13485." },
  { icon: Shield, title: "Regulatory Compliance", desc: "Deep expertise in IEC 60601, IEC 62304, UL/CSA standards, and global regulatory requirements." },
  { icon: Activity, title: "Continuous Improvement", desc: "CAPA systems, management reviews, internal audits, and data-driven process optimization." },
];

function CertificationsSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32" id="certifications">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>Quality Assurance</SectionLabel>
          <SectionTitle>Certifications &amp; Quality Systems</SectionTitle>
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
            Quality isn't a department at Linemaster&mdash;it's the foundation of everything we
            design, manufacture, and deliver.
          </motion.p>
        </div>

        {/* ISO Badge — prominent */}
        <motion.div variants={fadeUp} className="flex justify-center mb-16">
          <div
            className="relative rounded-2xl p-10 md:p-14 text-center max-w-lg w-full"
            style={{
              background: `linear-gradient(135deg, ${NAVY_LIGHTER} 0%, ${NAVY_LIGHT} 100%)`,
              border: `2px solid ${GOLD}40`,
              boxShadow: `0 0 60px ${GOLD_DIM}, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <Award className="w-16 h-16 mx-auto mb-4" style={{ color: GOLD }} />
            <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: WHITE }}>
              ISO 13485:2016
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: GOLD }}>
              Certified Quality Management System
            </div>
            <p className="text-sm leading-relaxed" style={{ color: GRAY_LIGHT }}>
              Our quality management system meets the rigorous requirements of ISO 13485:2016
              for the design and manufacture of medical devices and components, ensuring every
              product meets the highest standards of safety and performance.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-xs uppercase tracking-wider" style={{ color: GRAY }}>
                Independently Audited &amp; Verified
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quality highlights grid */}
        <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityHighlights.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="rounded-xl p-6 group hover:-translate-y-1 transition-all duration-300"
              style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: `${BLUE}15` }}>
                <item.icon className="w-6 h-6" style={{ color: BLUE }} />
              </div>
              <h4 className="text-base font-semibold mb-2" style={{ color: WHITE }}>{item.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 5. Manufacturing Capabilities
// ---------------------------------------------------------------------------
const capabilities = [
  { icon: Cog, title: "In-House Design & Engineering", desc: "Full-service design team with CAD/CAM, electrical, and mechanical engineering expertise for custom foot control solutions." },
  { icon: FlaskConical, title: "Prototyping Lab", desc: "Rapid prototyping capabilities to accelerate development cycles and validate designs before production commitment." },
  { icon: Factory, title: "Production Facilities", desc: "State-of-the-art manufacturing with injection molding, die casting, stamping, and CNC machining capabilities." },
  { icon: ClipboardCheck, title: "Testing & Quality Assurance", desc: "Comprehensive testing including dielectric, life-cycle, environmental, and EMC testing to ensure regulatory compliance." },
  { icon: Package, title: "Assembly & Packaging", desc: "Cleanroom-capable assembly, custom labeling, sterile packaging, and drop-ship fulfillment services." },
  { icon: Wrench, title: "Tooling & Fixtures", desc: "In-house tool and die shop for rapid tooling, custom fixtures, and production line optimization." },
];

function CapabilitiesSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32 max-w-7xl mx-auto" id="capabilities">
      <div className="text-center mb-16">
        <SectionLabel>What We Do</SectionLabel>
        <SectionTitle>Manufacturing Capabilities</SectionTitle>
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
          Vertically integrated manufacturing under one roof gives us complete control over
          quality, cost, and lead times.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {capabilities.map((cap) => (
          <motion.div
            key={cap.title}
            variants={fadeUp}
            className="relative rounded-2xl p-8 group overflow-hidden hover:-translate-y-1 transition-all duration-300"
            style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
          >
            {/* Subtle top-accent line */}
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}40, transparent)` }} />
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors"
              style={{ background: `${BLUE}12` }}
            >
              <cap.icon className="w-7 h-7" style={{ color: BLUE }} />
            </div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: WHITE }}>{cap.title}</h4>
            <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{cap.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 6. Industries Served
// ---------------------------------------------------------------------------
const surgerySubSpecialties = [
  "Neuro",
  "ENT",
  "Electrosurgery",
  "Cardiac",
  "Soft Tissue Ablation",
  "Bone Shaver & Irrigation",
  "Urology",
  "Ophthalmology",
  "Cosmetic",
  "Surgical Robots",
  "Surgical / Medical Tables",
];

const medicalIndustries = [
  { icon: Stethoscope, title: "Surgery", sub: surgerySubSpecialties },
  { icon: Microscope, title: "Medical Imaging", sub: null },
  { icon: Sparkles, title: "Dental", sub: null },
];

const industrialIndustries = [
  { icon: Tractor, title: "Agriculture" },
  { icon: Radio, title: "Communication Devices" },
  { icon: HardHat, title: "Construction" },
  { icon: UtensilsCrossed, title: "Food Services" },
  { icon: Swords, title: "Military & Defense" },
  { icon: Trash2, title: "Sewer & Waste" },
  { icon: Zap, title: "Utility" },
];

function IndustriesSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32 max-w-7xl mx-auto" id="industries">
      <div className="text-center mb-16">
        <SectionLabel>Industries We Serve</SectionLabel>
        <SectionTitle>Trusted Across Critical Markets</SectionTitle>
      </div>

      {/* Medical */}
      <motion.div variants={fadeUp} className="mb-14">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: WHITE }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}20` }}>
            <Stethoscope className="w-4 h-4" style={{ color: BLUE }} />
          </div>
          Medical
        </h3>
        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
          {medicalIndustries.map((ind) => (
            <motion.div
              key={ind.title}
              variants={fadeUp}
              className="rounded-xl p-6 hover:-translate-y-1 transition-all duration-300"
              style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                  <ind.icon className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <h4 className="text-base font-semibold" style={{ color: WHITE }}>{ind.title}</h4>
              </div>
              {ind.sub && (
                <div className="flex flex-wrap gap-2">
                  {ind.sub.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: `${BLUE}10`, color: GRAY_LIGHT, border: `1px solid ${BLUE}20` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Industrial */}
      <motion.div variants={fadeUp}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: WHITE }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}20` }}>
            <Factory className="w-4 h-4" style={{ color: GOLD }} />
          </div>
          Industrial
        </h3>
        <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {industrialIndustries.map((ind) => (
            <motion.div
              key={ind.title}
              variants={fadeUp}
              className="rounded-xl p-5 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300"
              style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: `${GOLD}12` }}>
                <ind.icon className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <span className="text-sm font-medium" style={{ color: GRAY_LIGHT }}>{ind.title}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 7. Services
// ---------------------------------------------------------------------------
const services = [
  {
    icon: Cog,
    title: "Design & Production",
    items: [
      "Custom foot control design from concept to production",
      "DFM & DFA engineering optimization",
      "Rapid prototyping & iterative development",
      "Full-scale manufacturing & fulfillment",
    ],
  },
  {
    icon: FileCheck,
    title: "Documentation, Traceability & Design Validation",
    items: [
      "Device History Records (DHR)",
      "Full lot & serial number traceability",
      "DFMEA, PFMEA, V&V protocols",
      "IQ/OQ/PQ qualification support",
    ],
  },
  {
    icon: GraduationCap,
    title: "On-Site Technical Training",
    items: [
      "Product-specific training programs",
      "Installation & maintenance workshops",
      "Regulatory & compliance education",
      "Ongoing technical support & consultation",
    ],
  },
];

function ServicesSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32 max-w-7xl mx-auto" id="services">
      <div className="text-center mb-16">
        <SectionLabel>How We Help</SectionLabel>
        <SectionTitle>End-to-End Services</SectionTitle>
      </div>

      <motion.div variants={stagger} className="grid md:grid-cols-3 gap-8">
        {services.map((svc) => (
          <motion.div
            key={svc.title}
            variants={fadeUp}
            className="rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
            style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: `${BLUE}15` }}>
              <svc.icon className="w-7 h-7" style={{ color: BLUE }} />
            </div>
            <h4 className="text-lg font-semibold mb-5" style={{ color: WHITE }}>{svc.title}</h4>
            <ul className="space-y-3">
              {svc.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: GRAY_LIGHT }}>
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BLUE }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 8. Company Timeline
// ---------------------------------------------------------------------------
const timelineEvents = [
  { year: "1952", title: "Founded", desc: "Linemaster Switch Corporation established as a manufacturer of industrial foot controls." },
  { year: "1960s", title: "Market Expansion", desc: "Expanded product line to serve growing automotive, manufacturing, and defense industries." },
  { year: "1970s", title: "Engineering Innovation", desc: "Introduced sealed and heavy-duty foot switches, setting new standards for durability and reliability." },
  { year: "1980s", title: "Medical Market Entry", desc: "Began developing foot controls for medical device OEMs, entering operating room and imaging markets." },
  { year: "1990s", title: "Facility Modernization", desc: "Major investment in modern production equipment, CAD/CAM design tools, and quality testing infrastructure." },
  { year: "2000s", title: "ISO 13485 Certification", desc: "Achieved ISO 13485 certification, formalizing our commitment to medical device quality management." },
  { year: "2010s", title: "Global OEM Partnerships", desc: "Became trusted supplier to Johnson & Johnson, Stryker, and other Fortune 500 medical device manufacturers." },
  { year: "2020s", title: "Next-Generation Innovation", desc: "Advancing wireless, programmable, and ergonomic foot control technologies for the future of surgery and industry." },
];

function TimelineSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32 max-w-7xl mx-auto" id="timeline">
      <div className="text-center mb-16">
        <SectionLabel>Our Journey</SectionLabel>
        <SectionTitle>A Legacy of Innovation</SectionTitle>
      </div>

      {/* Desktop: horizontal scrollable */}
      <motion.div variants={fadeUp} className="hidden lg:block">
        <div className="relative">
          {/* Center line */}
          <div className="absolute top-8 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${BLUE}40, ${BLUE}40, transparent)` }} />

          <div className="flex overflow-x-auto gap-0 pb-4 scrollbar-hide">
            {timelineEvents.map((evt, i) => (
              <motion.div
                key={evt.year}
                variants={fadeUp}
                className="flex-shrink-0 w-56 relative pt-16 px-4"
              >
                {/* Dot */}
                <div
                  className="absolute top-[26px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: i === timelineEvents.length - 1 ? GOLD : BLUE,
                    background: i === timelineEvents.length - 1 ? GOLD : BLUE,
                    boxShadow: `0 0 12px ${i === timelineEvents.length - 1 ? GOLD : BLUE}60`,
                  }}
                />
                <div className="text-lg font-bold mb-2" style={{ color: i === timelineEvents.length - 1 ? GOLD : BLUE }}>
                  {evt.year}
                </div>
                <div className="text-sm font-semibold mb-1" style={{ color: WHITE }}>
                  {evt.title}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: GRAY }}>
                  {evt.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile / tablet: vertical stepped */}
      <motion.div variants={stagger} className="lg:hidden relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: `linear-gradient(180deg, transparent, ${BLUE}40, ${BLUE}40, transparent)` }} />

        {timelineEvents.map((evt, i) => (
          <motion.div key={evt.year} variants={fadeUp} className="relative mb-10 last:mb-0">
            {/* Dot */}
            <div
              className="absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2"
              style={{
                borderColor: i === timelineEvents.length - 1 ? GOLD : BLUE,
                background: i === timelineEvents.length - 1 ? GOLD : BLUE,
                boxShadow: `0 0 10px ${i === timelineEvents.length - 1 ? GOLD : BLUE}60`,
              }}
            />
            <div className="text-base font-bold" style={{ color: i === timelineEvents.length - 1 ? GOLD : BLUE }}>
              {evt.year}
            </div>
            <div className="text-sm font-semibold mt-1" style={{ color: WHITE }}>{evt.title}</div>
            <p className="text-sm leading-relaxed mt-1" style={{ color: GRAY }}>{evt.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 9. Contact / Sales Directory
// ---------------------------------------------------------------------------
function ContactSection() {
  return (
    <SectionWrapper className="py-24 lg:py-32" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: info */}
          <div>
            <SectionLabel>Get in Touch</SectionLabel>
            <SectionTitle>Ready to Start a Conversation?</SectionTitle>
            <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8" style={{ color: GRAY_LIGHT }}>
              Whether you need a custom foot control solution, technical consultation, or a
              competitive quote, our team is ready to help.
            </motion.p>

            <motion.div variants={stagger} className="space-y-5">
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                  <Phone className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: GRAY }}>Call Us</div>
                  <a href="tel:8609741000" className="text-lg font-semibold hover:underline" style={{ color: WHITE }}>
                    (860) 974-1000
                  </a>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                  <Mail className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: GRAY }}>Email</div>
                  <span className="text-base font-medium" style={{ color: WHITE }}>sales@linemaster.com</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                  <MapPin className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: GRAY }}>Headquarters</div>
                  <span className="text-base font-medium" style={{ color: WHITE }}>29 Plaine Hill Road, Woodstock, CT 06281</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: CTA card + regional sales placeholder */}
          <motion.div variants={fadeUp} className="space-y-6">
            {/* Request Quote CTA */}
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)`,
                boxShadow: `0 20px 60px rgba(37,99,235,0.3)`,
              }}
            >
              <h3 className="text-2xl font-bold mb-3" style={{ color: WHITE }}>Request a Quote</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
                Tell us about your application and we'll provide a detailed proposal with pricing,
                lead times, and engineering recommendations.
              </p>
              <button
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ background: WHITE, color: BLUE }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Regional sales placeholder */}
            <div
              className="rounded-2xl p-8"
              style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <h4 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: WHITE }}>
                <MapPin className="w-4 h-4" style={{ color: GOLD }} />
                Regional Sales Contacts
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {["Northeast", "Southeast", "Midwest", "West Coast", "International", "OEM / Strategic"].map(
                  (region) => (
                    <div key={region} className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" style={{ color: BLUE }} />
                      <span className="text-sm" style={{ color: GRAY_LIGHT }}>
                        {region}
                      </span>
                    </div>
                  )
                )}
              </div>
              <p className="text-xs mt-4" style={{ color: GRAY }}>
                Contact us for your regional representative's direct line.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// Page Export
// ---------------------------------------------------------------------------
export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      <HeroSection />
      <Divider />
      <CompanyStorySection />
      <Divider />
      <MissionSection />
      <Divider />
      <CertificationsSection />
      <Divider />
      <CapabilitiesSection />
      <Divider />
      <IndustriesSection />
      <Divider />
      <ServicesSection />
      <Divider />
      <TimelineSection />
      <Divider />
      <ContactSection />
      {/* Bottom spacer for footer */}
      <div className="h-20" />
    </div>
  );
}
