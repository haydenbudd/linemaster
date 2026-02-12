import { motion } from 'motion/react';
import { Link } from '@/app/components/Router';
import {
  ArrowRight,
  Shield,
  Zap,
  Phone,
  ChevronRight,
  Activity,
  Layers,
  Stethoscope,
  Factory,
  Brain,
  Heart,
  Flame,
  Bone,
  Droplets,
  Eye,
  Sparkles,
  Bot,
  BedDouble,
  ScanLine,
  SmilePlus,
  Wheat,
  Radio,
  HardHat,
  UtensilsCrossed,
  Swords,
  Pipette,
  Plug,
  Wrench,
  FileCheck,
  Scale,
  Rocket,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const heroStats = [
  { value: '11+', label: 'Medical Specialties' },
  { value: '7+', label: 'Industrial Sectors' },
  { value: '70+', label: 'Years Experience' },
];

const surgerySpecialties = [
  {
    icon: Brain,
    title: 'Neurosurgery & ENT',
    description: 'Precise foot-activated control for microsurgical instruments, nerve stimulators, and ENT devices',
  },
  {
    icon: Heart,
    title: 'Electrosurgery & Cardiac',
    description: 'Foot controls for electrosurgical units, ablation systems, and cardiac mapping equipment',
  },
  {
    icon: Flame,
    title: 'Soft Tissue Ablation',
    description: 'Precision activation for RF ablation, laser systems, and tissue removal devices',
  },
  {
    icon: Bone,
    title: 'Bone Shaver & Irrigation Pump',
    description: 'Reliable foot control for orthopedic power tools and fluid management systems',
  },
  {
    icon: Droplets,
    title: 'Urology',
    description: 'Sterile-compatible foot switches for lithotripsy, laser, and endoscopic procedures',
  },
  {
    icon: Eye,
    title: 'Ophthalmology',
    description: 'Ultra-precise foot controls for phacoemulsification, vitrectomy, and laser vision systems',
  },
  {
    icon: Sparkles,
    title: 'Cosmetic Surgery',
    description: 'Foot-activated controls for liposuction, laser skin, and body contouring equipment',
  },
  {
    icon: Bot,
    title: 'Surgical Robots',
    description: 'Integration-ready foot interfaces for robotic surgical platforms',
  },
  {
    icon: BedDouble,
    title: 'Surgical/Medical Tables',
    description: 'Position control foot switches for operating tables and patient positioning systems',
  },
];

const medicalAdditional = [
  {
    icon: ScanLine,
    title: 'Diagnostic Imaging',
    description: 'Foot controls for X-ray, fluoroscopy, CT, MRI, and ultrasound activation',
  },
  {
    icon: SmilePlus,
    title: 'Dental',
    description: 'Precision foot pedals for dental drills, scalers, curing lights, and chair controls',
  },
];

const industrialSectors = [
  {
    icon: Wheat,
    title: 'Agriculture',
    description: 'Foot controls for harvesting equipment, irrigation systems, and agricultural machinery',
  },
  {
    icon: Radio,
    title: 'Communication Devices',
    description: 'Hands-free activation for radio systems, dispatch consoles, and communication equipment',
  },
  {
    icon: HardHat,
    title: 'Construction',
    description: 'Heavy-duty foot switches for concrete equipment, welding, and construction machinery',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food Services',
    description: 'Sanitary foot controls for food processing, packaging, and commercial kitchen equipment',
  },
  {
    icon: Swords,
    title: 'Military & Defense',
    description: 'Mission-critical foot switches meeting MIL-SPEC requirements for defense applications',
  },
  {
    icon: Pipette,
    title: 'Sewer & Waste',
    description: 'Durable foot controls for sewer inspection, waste processing, and environmental equipment',
  },
  {
    icon: Plug,
    title: 'Utility',
    description: 'Reliable foot switches for power generation, line maintenance, and utility infrastructure',
  },
];

const capabilities = [
  {
    icon: Wrench,
    title: 'Custom Engineering',
    description: 'Bespoke foot control designs tailored to your exact specifications and application requirements.',
  },
  {
    icon: Rocket,
    title: 'Rapid Prototyping',
    description: 'From concept to functional prototype in weeks, accelerating your product development timeline.',
  },
  {
    icon: Shield,
    title: 'ISO 13485 QMS',
    description: 'Certified quality management system ensuring every product meets the highest standards.',
  },
  {
    icon: Layers,
    title: 'Full Traceability',
    description: 'Complete lot tracking and documentation from raw materials through final delivery.',
  },
  {
    icon: FileCheck,
    title: 'Regulatory Expertise',
    description: 'Deep experience with IEC 60601, MIL-SPEC, UL, and global compliance requirements.',
  },
  {
    icon: Scale,
    title: 'Production Scale',
    description: 'Seamless transition from prototype to full-volume production with consistent quality.',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0f2035] to-[#060e1a]" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]"
            animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#D4A853]/6 blur-[100px]"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            {/* Track badges */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 text-sm font-medium text-[#2563EB]">
                <Stethoscope className="w-4 h-4" />
                Medical
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A853]/30 bg-[#D4A853]/10 text-sm font-medium text-[#D4A853]">
                <Factory className="w-4 h-4" />
                Industrial
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-5xl"
            >
              Industries We{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-cyan-400 bg-clip-text text-transparent">
                Serve
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-white/60 max-w-3xl leading-relaxed"
            >
              From the operating room to the factory floor — Linemaster foot controls power critical
              applications across the world&apos;s most demanding industries.
            </motion.p>
          </motion.div>

          {/* Stats ribbon */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mt-16 grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto"
          >
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="flex flex-col items-center p-6 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
              >
                <span className="text-2xl sm:text-3xl font-bold text-[#D4A853]">{stat.value}</span>
                <span className="mt-1 text-sm text-white/50">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MEDICAL & HEALTHCARE                                        */}
      {/* ============================================================ */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-[#2563EB]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Medical &{' '}
                <span className="bg-gradient-to-r from-[#2563EB] to-cyan-400 bg-clip-text text-transparent">
                  Healthcare
                </span>
              </h2>
            </div>
            <p className="text-white/50 text-lg max-w-3xl leading-relaxed">
              ISO 13485 certified. IEC 60601 compliant. Trusted by Fortune 500 OEMs to deliver
              precision foot controls for the most critical medical applications worldwide.
            </p>
          </motion.div>

          {/* Surgery sub-header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-white/90">Surgical Specialties</h3>
            <p className="mt-2 text-white/40 text-sm">Our largest medical vertical — covering 9 surgical disciplines</p>
          </motion.div>

          {/* Surgery specialty grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
          >
            {surgerySpecialties.map((spec) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={spec.title}
                  variants={scaleIn}
                  className="group relative p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#2563EB]/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <h4 className="font-bold text-base mb-2">{spec.title}</h4>
                    <p className="text-sm text-white/45 leading-relaxed">{spec.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Imaging & Dental cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-5 mb-12"
          >
            {medicalAdditional.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#2563EB]/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
                  <div className="relative z-10 flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-white/50 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Medical CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <Link
              href="/custom-solutions"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#2563EB] text-white font-semibold text-base hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Explore Medical Solutions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  INDUSTRIAL & COMMERCIAL                                     */}
      {/* ============================================================ */}
      <section className="relative py-28 px-6">
        <div className="relative max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center">
                <Factory className="w-7 h-7 text-[#D4A853]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Industrial &{' '}
                <span className="bg-gradient-to-r from-[#D4A853] to-amber-300 bg-clip-text text-transparent">
                  Commercial
                </span>
              </h2>
            </div>
            <p className="text-white/50 text-lg max-w-3xl leading-relaxed">
              Rugged, reliable foot controls built for the toughest environments. Engineered to
              withstand extreme conditions while delivering precise, consistent performance.
            </p>
          </motion.div>

          {/* Industrial cards grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {industrialSectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <motion.div
                  key={sector.title}
                  variants={fadeUp}
                  className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#D4A853]/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-600/0 to-orange-500/0 group-hover:from-amber-600/5 group-hover:to-orange-500/5 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-[#D4A853]" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{sector.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{sector.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Industrial CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <Link
              href="/custom-solutions"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-[#D4A853]/40 bg-[#D4A853]/10 text-[#D4A853] font-semibold text-base hover:bg-[#D4A853]/20 hover:border-[#D4A853]/60 transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Industrial Solutions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CROSS-INDUSTRY CAPABILITIES                                 */}
      {/* ============================================================ */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Cross-Industry{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-cyan-400 bg-clip-text text-transparent">
                Capabilities
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
              No matter the industry, Linemaster delivers the engineering depth and manufacturing
              excellence your application demands.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  variants={scaleIn}
                  className="flex items-start gap-4 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{cap.title}</h3>
                    <p className="mt-1 text-sm text-white/45 leading-relaxed">{cap.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0d1d33] to-[#0A1628]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#2563EB]/8 blur-[120px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold"
          >
            Don&apos;t See Your{' '}
            <span className="bg-gradient-to-r from-[#D4A853] to-amber-300 bg-clip-text text-transparent">
              Industry
            </span>
            ?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-white/50 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            We engineer custom foot control solutions for virtually any application. Tell us about
            your project and our team will design the perfect solution.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            <Link
              href="/custom-solutions"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-[#2563EB] text-white font-semibold text-lg hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Start a Conversation
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="tel:8609741000"
              className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors"
            >
              <div className="w-12 h-12 rounded-full border border-white/[0.12] bg-white/[0.04] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs text-white/40 uppercase tracking-wider">Call Us</span>
                <span className="block text-lg font-semibold text-white">(860) 974-1000</span>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
