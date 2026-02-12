import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "@/app/components/Router";
import {
  BookOpen,
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  Newspaper,
  Cpu,
  FlaskConical,
  Building2,
  Shield,
  Wifi,
  Award,
  Stethoscope,
  Factory,
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
// Category colors
// ---------------------------------------------------------------------------
const categoryColors: Record<string, string> = {
  "Industry News": "#2563EB",
  "Technical": "#10B981",
  "Case Studies": "#D4A853",
  "Company News": "#8B5CF6",
};

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
// Article data
// ---------------------------------------------------------------------------
interface Article {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  icon: React.ElementType;
}

const articles: Article[] = [
  {
    title: "Understanding IEC 60601 Requirements for Medical Foot Controls",
    excerpt: "A comprehensive guide to the safety and performance requirements that medical footswitches must meet under the IEC 60601 family of standards, including EMC testing, risk management, and documentation.",
    date: "January 15, 2026",
    readTime: "8 min read",
    category: "Technical",
    icon: Shield,
  },
  {
    title: "Choosing the Right Foot Control for Surgical Applications",
    excerpt: "Surgeons depend on reliable foot controls for precision instrument activation. Learn what factors to consider when selecting a footswitch for electrosurgery, laser, and robotic-assisted procedures.",
    date: "December 8, 2025",
    readTime: "6 min read",
    category: "Industry News",
    icon: Stethoscope,
  },
  {
    title: "Custom vs. Standard Footswitches: When to Choose Each",
    excerpt: "Weighing the trade-offs between off-the-shelf and custom-engineered foot controls? This guide covers cost, timeline, regulatory, and performance considerations to help OEMs make the right call.",
    date: "November 20, 2025",
    readTime: "5 min read",
    category: "Technical",
    icon: FlaskConical,
  },
  {
    title: "Wireless Footswitch Technology: Cutting the Cord in the OR",
    excerpt: "Wireless foot controls are transforming surgical workflows by eliminating trip hazards and simplifying sterile field management. Explore the technology, standards, and design considerations driving adoption.",
    date: "October 12, 2025",
    readTime: "7 min read",
    category: "Industry News",
    icon: Wifi,
  },
  {
    title: "ISO 13485 and Medical Device Manufacturing: What OEMs Need to Know",
    excerpt: "An inside look at how ISO 13485:2016 certification impacts every stage of footswitch design and production, from supplier qualification and design controls to CAPA and post-market surveillance.",
    date: "September 5, 2025",
    readTime: "9 min read",
    category: "Technical",
    icon: Award,
  },
  {
    title: "SightGuard: Innovation in Operator Safety Technology",
    excerpt: "Linemaster's patented SightGuard guard ring represents a breakthrough in operator safety, preventing accidental pedal activation while maintaining ergonomic access. Learn about the engineering behind this innovation.",
    date: "August 18, 2025",
    readTime: "5 min read",
    category: "Company News",
    icon: Factory,
  },
  {
    title: "Designing Foot Controls for Harsh Industrial Environments",
    excerpt: "From oil-soaked factory floors to outdoor construction sites, industrial footswitches must withstand extreme conditions. This article covers IP ratings, material selection, and durability testing standards.",
    date: "July 22, 2025",
    readTime: "6 min read",
    category: "Case Studies",
    icon: Cpu,
  },
  {
    title: "Linemaster Expands Manufacturing Capacity with New CNC Equipment",
    excerpt: "Investing in our future: Linemaster adds state-of-the-art CNC machining centers to our Woodstock facility, increasing production capacity and enabling tighter tolerances for precision medical components.",
    date: "June 10, 2025",
    readTime: "4 min read",
    category: "Company News",
    icon: Building2,
  },
];

const categories = ["All", "Industry News", "Technical", "Case Studies", "Company News"];

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
          <BookOpen className="w-4 h-4" />
          Blog &amp; Resources
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8"
          style={{ color: WHITE }}
        >
          Insights &amp;{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${BLUE} 0%, #60A5FA 50%, ${GOLD} 100%)` }}
          >
            Resources
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: GRAY_LIGHT }}
        >
          Industry news, technical guides, and company updates from America's Foot Switch Leader.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
          <a
            href="#articles"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: BLUE, color: WHITE }}
          >
            Browse Articles
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs tracking-wide uppercase" style={{ color: GRAY }}>
          <span className="flex items-center gap-2"><Newspaper className="w-4 h-4" style={{ color: GOLD }} /> Industry News</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><FlaskConical className="w-4 h-4" style={{ color: BLUE }} /> Technical Guides</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2"><Building2 className="w-4 h-4" style={{ color: GOLD }} /> Company Updates</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. Articles Grid with Filter
// ---------------------------------------------------------------------------
function ArticlesSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <SectionWrapper className="py-14 md:py-20 max-w-7xl mx-auto" id="articles">
      <div className="text-center mb-10">
        <SectionLabel>Latest Articles</SectionLabel>
        <SectionTitle>News &amp; Technical Resources</SectionTitle>
      </div>

      {/* Category filter tabs */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            style={{
              background: activeCategory === cat ? BLUE : NAVY_LIGHTER,
              color: activeCategory === cat ? WHITE : GRAY,
              border: `1px solid ${activeCategory === cat ? BLUE : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Article cards grid */}
      <motion.div
        variants={stagger}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filtered.map((article) => {
          const catColor = categoryColors[article.category] || BLUE;
          return (
            <motion.article
              key={article.title}
              variants={fadeUp}
              layout
              className="rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col"
              style={{ background: NAVY_LIGHTER, border: `1px solid rgba(255,255,255,0.06)` }}
            >
              {/* Icon header */}
              <div
                className="h-48 flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${NAVY_LIGHTER} 0%, ${NAVY_LIGHT} 100%)` }}
              >
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${catColor}12, transparent 70%)` }} />
                <article.icon className="w-16 h-16 relative z-10" style={{ color: catColor, opacity: 0.6 }} />
                {/* Category badge */}
                <span
                  className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}30` }}
                >
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: GRAY }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-3 leading-snug" style={{ color: WHITE }}>
                  {article.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: GRAY }}>
                  {article.excerpt}
                </p>

                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                  style={{ color: BLUE }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="text-center py-16"
        >
          <Tag className="w-12 h-12 mx-auto mb-4" style={{ color: GRAY }} />
          <p className="text-base" style={{ color: GRAY }}>No articles found in this category.</p>
        </motion.div>
      )}
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// 3. Newsletter CTA
// ---------------------------------------------------------------------------
function NewsletterSection() {
  return (
    <SectionWrapper className="py-14 md:py-20 max-w-4xl mx-auto" id="newsletter">
      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-10 md:p-14 text-center"
        style={{
          background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)`,
          boxShadow: `0 20px 60px rgba(37,99,235,0.3)`,
        }}
      >
        <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: WHITE }} />
        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: WHITE }}>
          Stay Informed
        </h3>
        <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>
          Get the latest industry insights, product updates, and technical resources delivered to your inbox.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
          style={{ background: WHITE, color: BLUE }}
        >
          Contact Us to Subscribe
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// Page Export
// ---------------------------------------------------------------------------
export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      <HeroSection />
      <Divider />
      <ArticlesSection />
      <Divider />
      <NewsletterSection />
      <div className="h-10" />
    </div>
  );
}
