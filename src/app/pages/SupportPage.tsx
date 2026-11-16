import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link } from "@/app/components/Router";
import {
  HelpCircle,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  FileText,
  Download,
  Book,
  Shield,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Search,
  MessageCircle,
  Clock,
  Zap,
  Settings,
  LifeBuoy,
  BookOpen,
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
          <LifeBuoy className="w-4 h-4" />
          Technical Support
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8"
          style={{ color: WHITE }}
        >
          How Can We{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, #60A5FA 50%, ${GOLD} 100%)` }}
          >
            Help You?
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: GRAY_LIGHT }}
        >
          Find answers, download resources, and connect with our expert support team for all your footswitch needs.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
          <a
            href="#faq"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: BLUE, color: WHITE }}
          >
            Browse FAQs
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:scale-105"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: WHITE }}
          >
            Contact Support
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs tracking-wide uppercase" style={{ color: GRAY }}>
          <span className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: GOLD }} /> (860) 974-1000</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: BLUE }} /> support@linemaster.com</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: GOLD }} /> Mon-Fri 8am-5pm ET</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. FAQ Accordion
// ---------------------------------------------------------------------------
const faqCategories = [
  {
    category: "Products & Ordering",
    items: [
      {
        q: "What types of footswitches does Linemaster manufacture?",
        a: "Linemaster manufactures over 300 standard catalog footswitch models including single and dual pedal, wireless, medical-grade, and heavy-duty industrial models. We also design and manufacture custom foot controls to meet specific OEM requirements for medical devices, industrial equipment, and other specialized applications.",
      },
      {
        q: "How do I select the right footswitch for my application?",
        a: "Start by considering your application environment (medical, industrial, wet/dry), the number of pedals needed, actuation force preferences, electrical ratings, and any regulatory requirements (IEC 60601 for medical, UL/CSA for industrial). Our engineering team provides free application consultations to help you select the optimal solution.",
      },
      {
        q: "What is the typical lead time for standard products?",
        a: "Standard catalog footswitches typically ship within 2-4 weeks from order placement. Custom-engineered products require 8-12 weeks depending on complexity, tooling requirements, and order quantity. Contact our sales team for current lead time estimates on specific part numbers.",
      },
      {
        q: "Do you offer custom footswitch solutions?",
        a: "Yes. Custom engineering is one of our core strengths. We offer end-to-end custom design services from concept through production, including custom housings, actuators, cable assemblies, wireless configurations, and application-specific features. Our engineering team works directly with your team throughout the development process.",
      },
    ],
  },
  {
    category: "Certifications & Compliance",
    items: [
      {
        q: "Is Linemaster ISO 13485 certified?",
        a: "Yes. Linemaster Switch Corporation maintains ISO 13485:2016 certification for the design and manufacture of medical foot controls and accessories. Our quality management system is independently audited annually and covers all aspects of our design, manufacturing, and post-market processes.",
      },
      {
        q: "Do your medical footswitches meet IEC 60601 requirements?",
        a: "Our medical-grade footswitches are designed and tested to comply with IEC 60601-1 (general safety), IEC 60601-1-2 (EMC), and applicable collateral and particular standards. We maintain comprehensive test reports and can provide documentation to support your regulatory submissions.",
      },
      {
        q: "Can you provide documentation for regulatory submissions?",
        a: "Yes. We provide comprehensive documentation packages including device specifications, test reports, certificates of compliance, biocompatibility data, material declarations, and risk analysis documents. Our regulatory team is experienced in supporting FDA 510(k), CE marking, and international submissions.",
      },
    ],
  },
  {
    category: "Warranty & Returns",
    items: [
      {
        q: "What warranty do Linemaster footswitches carry?",
        a: "All standard Linemaster footswitches carry a warranty against defects in materials and workmanship under normal use and service conditions. Warranty terms vary by product line. Contact our customer service team for specific warranty details for your product.",
      },
      {
        q: "How do I request a return or replacement?",
        a: "Contact our customer service team at (860) 974-1000 or support@linemaster.com with your order number and a description of the issue. We will issue an RMA number and provide shipping instructions. All returns must be authorized prior to shipment.",
      },
    ],
  },
  {
    category: "Technical Support",
    items: [
      {
        q: "My footswitch is not responding. What should I check?",
        a: "First, verify the cable connection is secure at both the footswitch and the host device. Check for visible cable damage. For wired models, test with a multimeter for continuity across the switch contacts. For wireless models, verify battery charge and re-pair with the receiver. If the issue persists, contact our technical support team.",
      },
      {
        q: "How do I clean and maintain my footswitch?",
        a: "For standard models, wipe the exterior with a damp cloth and mild detergent. For medical-grade models, follow your facility's cleaning protocols -- our sealed housings are compatible with most hospital-grade disinfectants. Avoid submerging non-waterproof models. Inspect cables periodically for wear and ensure strain reliefs remain intact.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,${open ? "0.12" : "0.06"})` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer"
      >
        <span className="text-sm font-semibold leading-relaxed" style={{ color: WHITE }}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5" style={{ color: GRAY }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-6">
              <div className="w-full h-px mb-4" style={{ background: `rgba(255,255,255,0.06)` }} />
              <p className="text-sm leading-relaxed" style={{ color: GRAY_LIGHT }}>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-4xl mx-auto" id="faq">
      <div className="text-center mb-10">
        <SectionLabel>Knowledge Base</SectionLabel>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
          Quick answers to the most common questions about our products, ordering, and support.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="space-y-10">
        {faqCategories.map((cat) => (
          <motion.div key={cat.category} variants={fadeUp}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: WHITE }}>
              <HelpCircle className="w-5 h-5" style={{ color: BLUE }} />
              {cat.category}
            </h3>
            <div className="space-y-3">
              {cat.items.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 3. Technical Resources
// ---------------------------------------------------------------------------
const resources = [
  {
    icon: Book,
    title: "Product Catalog",
    desc: "Browse our complete line of 300+ footswitch models with specifications, dimensions, and ordering information.",
    action: "View Catalog",
  },
  {
    icon: FileText,
    title: "Data Sheets",
    desc: "Download detailed technical data sheets with electrical ratings, mechanical specifications, and dimensional drawings.",
    action: "Browse Data Sheets",
  },
  {
    icon: BookOpen,
    title: "Instruction Manuals",
    desc: "Access installation guides, wiring diagrams, and user manuals for all current and legacy Linemaster products.",
    action: "Find Manuals",
  },
  {
    icon: Shield,
    title: "Compliance Documents",
    desc: "Request certificates of compliance, test reports, material declarations, and regulatory documentation.",
    action: "Request Documents",
  },
];

function ResourcesSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-7xl mx-auto" id="resources">
      <div className="text-center mb-10">
        <SectionLabel>Downloads</SectionLabel>
        <SectionTitle>Technical Resources</SectionTitle>
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
          Access product documentation, specifications, and compliance materials.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res) => (
          <motion.div
            key={res.title}
            variants={fadeUp}
            className="rounded-2xl p-8 group hover:-translate-y-1 transition-all duration-300 flex flex-col"
            style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: `${BLUE}15` }}>
              <res.icon className="w-7 h-7" style={{ color: BLUE }} />
            </div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: WHITE }}>{res.title}</h4>
            <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: GRAY }}>{res.desc}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: BLUE }}
            >
              {res.action}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 4. Troubleshooting Guide
// ---------------------------------------------------------------------------
const troubleshootingSteps = [
  {
    icon: Search,
    title: "Identify the Issue",
    desc: "Note the symptoms: no response, intermittent operation, unusual noise, or physical damage. Check if the issue occurs with specific host equipment or all connections.",
  },
  {
    icon: Settings,
    title: "Check Connections",
    desc: "Inspect cable connectors for bent pins, corrosion, or loose fits. For wireless models, verify the receiver is powered and within range. Re-seat all connections firmly.",
  },
  {
    icon: Wrench,
    title: "Basic Diagnostics",
    desc: "Use a multimeter to test switch continuity. For normally-open contacts, verify open circuit when released and closed circuit when actuated. Check cable integrity end-to-end.",
  },
  {
    icon: AlertTriangle,
    title: "Environmental Factors",
    desc: "Verify the footswitch is rated for your environment. Check for water ingress on non-waterproof models, excessive heat exposure, or chemical contact that could degrade seals.",
  },
  {
    icon: MessageCircle,
    title: "Contact Support",
    desc: "If the issue persists, contact our technical support team with your model number, serial number, and a description of the problem. We'll help diagnose and resolve the issue.",
  },
];

function TroubleshootingSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-5xl mx-auto" id="troubleshooting">
      <div className="text-center mb-10">
        <SectionLabel>Troubleshooting</SectionLabel>
        <SectionTitle>Quick Troubleshooting Guide</SectionTitle>
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: GRAY_LIGHT }}>
          Follow these steps to diagnose common footswitch issues before contacting support.
        </motion.p>
      </div>

      <motion.div variants={stagger} className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-7 top-8 bottom-8 w-px hidden md:block" style={{ background: `linear-gradient(180deg, transparent, ${BLUE}40, ${BLUE}40, transparent)` }} />

        <div className="space-y-6">
          {troubleshootingSteps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              className="flex gap-6 items-start"
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: NAVY_LIGHTER, border: `1px solid ${BLUE}30` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: BLUE }} />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: BLUE, color: WHITE }}
                >
                  {i + 1}
                </div>
              </div>
              <div
                className="flex-1 rounded-xl p-6"
                style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
              >
                <h4 className="text-base font-semibold mb-2" style={{ color: WHITE }}>{step.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 5. Contact Support CTA
// ---------------------------------------------------------------------------
function ContactSupportSection() {
  return (
    <SectionWrapper className="py-14 md:py-20" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Get Help</SectionLabel>
            <SectionTitle>Contact Our Support Team</SectionTitle>
            <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8" style={{ color: GRAY_LIGHT }}>
              Our experienced technical support team is available Monday through Friday, 8:00 AM to
              5:00 PM Eastern Time. We typically respond to email inquiries within one business day.
            </motion.p>

            <motion.div variants={stagger} className="space-y-5">
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                  <Phone className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: GRAY }}>Phone Support</div>
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
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: GRAY }}>Email Support</div>
                  <span className="text-base font-medium" style={{ color: WHITE }}>support@linemaster.com</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                  <Clock className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: GRAY }}>Hours</div>
                  <span className="text-base font-medium" style={{ color: WHITE }}>Monday - Friday, 8:00 AM - 5:00 PM ET</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${BLUE}15` }}>
                  <MapPin className="w-5 h-5" style={{ color: BLUE }} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: GRAY }}>Address</div>
                  <span className="text-base font-medium" style={{ color: WHITE }}>29 Plaine Hill Road, Woodstock, CT 06281</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp}>
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)`,
                boxShadow: `0 20px 60px rgba(37,99,235,0.3)`,
              }}
            >
              <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: WHITE }} />
              <h3 className="text-2xl font-bold mb-3" style={{ color: WHITE }}>Need Immediate Help?</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
                For urgent technical issues or production-critical support, call us directly.
                Our team is ready to assist with troubleshooting, replacements, and expedited orders.
              </p>
              <a
                href="tel:8609741000"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ background: WHITE, color: BLUE }}
              >
                <Phone className="w-4 h-4" />
                Call (860) 974-1000
              </a>
            </div>

            <div
              className="rounded-2xl p-8 mt-6"
              style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
            >
              <h4 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: WHITE }}>
                <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                When Contacting Support
              </h4>
              <ul className="space-y-3">
                {[
                  "Have your model number and serial number ready",
                  "Describe the issue and when it started",
                  "Note the host equipment being used",
                  "Mention any recent changes to the setup",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: GRAY_LIGHT }}>
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BLUE }} />
                    {item}
                  </li>
                ))}
              </ul>
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
export default function SupportPage() {
  return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      <HeroSection />
      <Divider />
      <FAQSection />
      <Divider />
      <ResourcesSection />
      <Divider />
      <TroubleshootingSection />
      <Divider />
      <ContactSupportSection />
      <div className="h-10" />
    </div>
  );
}
