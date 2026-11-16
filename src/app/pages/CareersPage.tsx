import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "@/app/components/Router";
import {
  Shield,
  Award,
  Users,
  Heart,
  Lightbulb,
  MapPin,
  ArrowRight,
  CheckCircle,
  Clock,
  Briefcase,
  GraduationCap,
  HeartPulse,
  PiggyBank,
  Calendar,
  TreePine,
  Factory,
  Wrench,
  Cpu,
  Zap,
  TrendingUp,
  Phone,
  Mail,
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
    <div className="w-full flex justify-center">
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
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${BLUE} 1px, transparent 1px), linear-gradient(90deg, ${BLUE} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
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
          <Users className="w-4 h-4" />
          Join Our Team
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8"
          style={{ color: WHITE }}
        >
          Build Your Career at{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, #60A5FA 50%, ${GOLD} 100%)` }}
          >
            Linemaster
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: GRAY_LIGHT }}
        >
          Family-owned since 1952. Join a team where precision engineering meets purpose-driven work in Woodstock, Connecticut.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
          <a
            href="#openings"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: BLUE, color: WHITE }}
          >
            View Open Positions
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#culture"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: WHITE }}
          >
            Why Linemaster?
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs tracking-wide uppercase" style={{ color: GRAY }}>
          <span className="flex items-center gap-2"><Factory className="w-4 h-4" style={{ color: GOLD }} /> Woodstock, CT</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: BLUE }} /> 70+ Years Strong</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><Heart className="w-4 h-4" style={{ color: GOLD }} /> Family-Owned</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. Company Culture
// ---------------------------------------------------------------------------
function CultureSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-7xl mx-auto" id="culture">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <SectionLabel>Our Culture</SectionLabel>
          <SectionTitle>Small Team, Big Impact</SectionTitle>
          <motion.div variants={fadeUp} className="space-y-5 text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
            <p>
              At Linemaster, you're not just an employee number. As a{" "}
              <strong className="font-semibold" style={{ color: WHITE }}>family-owned company</strong> operating
              from our original Woodstock, Connecticut campus since 1952, every team member plays a vital role
              in our mission to deliver the world's finest foot control solutions.
            </p>
            <p>
              Our products save lives in operating rooms, power critical industrial processes, and push
              the boundaries of hands-free control technology. When you work at Linemaster, your
              contributions have a{" "}
              <strong className="font-semibold" style={{ color: WHITE }}>direct, measurable impact</strong> on
              the quality and innovation that our Fortune 500 customers depend on.
            </p>
            <p>
              We foster a culture of{" "}
              <strong className="font-semibold" style={{ color: WHITE }}>craftsmanship, collaboration, and
              continuous improvement</strong>. Whether you're on the manufacturing floor, in the
              engineering lab, or working with customers, you'll be part of a team that takes
              pride in building things that matter.
            </p>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-6">
          {[
            { value: "70+", label: "Years in Business", icon: Clock },
            { value: "91", label: "Acre Campus", icon: TreePine },
            { value: "300+", label: "Catalog Products", icon: Wrench },
            { value: "ISO", label: "13485 Certified", icon: Award },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-6 text-center"
              style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${BLUE}15` }}>
                <stat.icon className="w-6 h-6" style={{ color: BLUE }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: WHITE }}>{stat.value}</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: GRAY }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 3. Why Work Here — Values
// ---------------------------------------------------------------------------
const whyCards = [
  {
    icon: Lightbulb,
    title: "Meaningful Work",
    desc: "Your engineering and manufacturing expertise directly supports life-saving medical devices and critical industrial equipment used worldwide.",
    accent: BLUE,
  },
  {
    icon: Users,
    title: "Close-Knit Team",
    desc: "Collaborate directly with leadership and cross-functional teams. Your ideas are heard and your contributions are recognized from day one.",
    accent: GOLD,
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    desc: "Develop your career with hands-on experience across design, manufacturing, quality, and compliance in a vertically integrated operation.",
    accent: BLUE,
  },
  {
    icon: Shield,
    title: "Stability & Legacy",
    desc: "Join a family-owned company with over 70 years of continuous operation, consistent growth, and a proven track record of market leadership.",
    accent: GOLD,
  },
  {
    icon: MapPin,
    title: "Beautiful Location",
    desc: "Work on our 91-acre campus in the scenic Quiet Corner of Connecticut, surrounded by New England countryside with easy access to major cities.",
    accent: BLUE,
  },
  {
    icon: Award,
    title: "Quality Culture",
    desc: "Be part of an ISO 13485-certified team that sets the standard for precision, safety, and regulatory compliance in foot control manufacturing.",
    accent: GOLD,
  },
];

function WhyWorkHereSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-7xl mx-auto" id="why">
      <div className="text-center mb-10">
        <SectionLabel>Why Linemaster</SectionLabel>
        <SectionTitle>Why Build Your Career Here</SectionTitle>
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
          More than a job -- a place where your skills shape products that make a difference.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {whyCards.map((card) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            className="relative rounded-2xl p-8 group overflow-hidden hover:-translate-y-1 transition-all duration-300"
            style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
          >
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${card.accent}40, transparent)` }} />
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
              style={{ background: `${card.accent}15` }}
            >
              <card.icon className="w-7 h-7" style={{ color: card.accent }} />
            </div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: WHITE }}>{card.title}</h4>
            <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 4. Benefits
// ---------------------------------------------------------------------------
const benefits = [
  { icon: HeartPulse, title: "Health Insurance", desc: "Comprehensive medical, dental, and vision coverage for you and your family." },
  { icon: PiggyBank, title: "401(k) Retirement", desc: "Company-matched 401(k) plan to help you build long-term financial security." },
  { icon: Calendar, title: "Paid Time Off", desc: "Generous PTO policy including vacation, personal days, and paid holidays." },
  { icon: GraduationCap, title: "Professional Development", desc: "Tuition assistance, training programs, and conference attendance for career growth." },
  { icon: Shield, title: "Life & Disability", desc: "Company-paid life insurance and short/long-term disability coverage." },
  { icon: TreePine, title: "Work-Life Balance", desc: "Stable schedules, a supportive environment, and a campus surrounded by nature." },
];

function BenefitsSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-7xl mx-auto" id="benefits">
      <div className="text-center mb-10">
        <SectionLabel>Compensation</SectionLabel>
        <SectionTitle>Benefits &amp; Perks</SectionTitle>
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
          We invest in our people with competitive compensation and comprehensive benefits.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((item) => (
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
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 5. Current Openings
// ---------------------------------------------------------------------------
const openings = [
  {
    title: "Manufacturing Technician",
    department: "Production",
    type: "Full-Time",
    icon: Factory,
    desc: "Assemble, test, and inspect footswitch products on the production floor. Operate manufacturing equipment and follow work instructions per ISO 13485 quality standards.",
    requirements: [
      "High school diploma or equivalent",
      "1-3 years manufacturing experience preferred",
      "Ability to read technical drawings and schematics",
      "Detail-oriented with strong quality mindset",
    ],
  },
  {
    title: "Quality Engineer",
    department: "Quality Assurance",
    type: "Full-Time",
    icon: Shield,
    desc: "Support the quality management system, conduct internal audits, manage CAPAs, and ensure compliance with ISO 13485, IEC 60601, and FDA 21 CFR 820 requirements.",
    requirements: [
      "B.S. in Engineering or related field",
      "3+ years in quality engineering for medical devices",
      "Knowledge of ISO 13485 and IEC 60601 standards",
      "Experience with DFMEA, PFMEA, and V&V protocols",
    ],
  },
  {
    title: "CNC Machinist",
    department: "Manufacturing",
    type: "Full-Time",
    icon: Wrench,
    desc: "Set up, program, and operate CNC milling and turning equipment to produce precision components for footswitch assemblies. Maintain tight tolerances per engineering specifications.",
    requirements: [
      "Trade school certificate or equivalent experience",
      "3+ years CNC machining experience",
      "Proficiency reading GD&T drawings",
      "Experience with Fanuc or Haas controllers preferred",
    ],
  },
  {
    title: "Electrical Engineer",
    department: "Engineering",
    type: "Full-Time",
    icon: Cpu,
    desc: "Design electrical circuits, PCB layouts, and wiring harnesses for medical and industrial footswitch products. Collaborate with mechanical engineering and quality teams.",
    requirements: [
      "B.S. in Electrical Engineering",
      "3-5 years product design experience",
      "Experience with IEC 60601 or UL/CSA standards",
      "Proficiency in Altium, OrCAD, or equivalent EDA tools",
    ],
  },
  {
    title: "Sales Representative",
    department: "Sales",
    type: "Full-Time",
    icon: Briefcase,
    desc: "Manage OEM customer relationships, develop new business opportunities, and provide technical sales support for custom and standard footswitch solutions.",
    requirements: [
      "Bachelor's degree in business or engineering",
      "3+ years B2B or technical sales experience",
      "Strong communication and presentation skills",
      "Willingness to travel 25-40%",
    ],
  },
];

function OpeningsSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-7xl mx-auto" id="openings">
      <div className="text-center mb-10">
        <SectionLabel>Open Positions</SectionLabel>
        <SectionTitle>Current Opportunities</SectionTitle>
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
          Explore our open roles and find your next opportunity at Linemaster Switch.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="space-y-6">
        {openings.map((job) => (
          <motion.div
            key={job.title}
            variants={fadeUp}
            className="rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300"
            style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${BLUE}15` }}>
                <job.icon className="w-7 h-7" style={{ color: BLUE }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h4 className="text-xl font-semibold" style={{ color: WHITE }}>{job.title}</h4>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}
                  >
                    {job.department}
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}
                  >
                    {job.type}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: GRAY_LIGHT }}>{job.desc}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {job.requirements.map((req) => (
                    <div key={req} className="flex items-start gap-2 text-sm" style={{ color: GRAY }}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BLUE }} />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 6. Apply CTA
// ---------------------------------------------------------------------------
function ApplyCTA() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-4xl mx-auto" id="apply">
      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-10 md:p-14 text-center"
        style={{
          background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)`,
          boxShadow: `0 20px 60px rgba(37,99,235,0.3)`,
        }}
      >
        <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: WHITE }} />
        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: WHITE }}>
          Ready to Join the Team?
        </h3>
        <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
          Send your resume and a brief introduction to our HR team. We review every application
          and respond within 5 business days.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="mailto:careers@linemaster.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: WHITE, color: BLUE }}
          >
            <Mail className="w-4 h-4" />
            careers@linemaster.com
          </a>
          <a
            href="tel:8609741000"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105"
            style={{ borderColor: "rgba(255,255,255,0.3)", color: WHITE }}
          >
            <Phone className="w-4 h-4" />
            (860) 974-1000
          </a>
        </div>

        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: "rgba(255,255,255,0.7)" }} />
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            29 Plaine Hill Road, Woodstock, CT 06281
          </span>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// Page Export
// ---------------------------------------------------------------------------
export default function CareersPage() {
  return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      <HeroSection />
      <Divider />
      <CultureSection />
      <Divider />
      <WhyWorkHereSection />
      <Divider />
      <BenefitsSection />
      <Divider />
      <OpeningsSection />
      <Divider />
      <ApplyCTA />
      <div className="h-10" />
    </div>
  );
}
