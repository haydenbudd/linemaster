import { motion } from 'motion/react';
import { Link } from '@/app/components/Router';
import {
  ArrowRight,
  Shield,
  Cpu,
  Factory,
  Award,
  Zap,
  MapPin,
  Clock,
  Wrench,
  Stethoscope,
  HardHat,
  Footprints,
  Package,
  Settings,
  RefreshCw,
  Eye,
  Phone,
  ChevronRight,
  Activity,
  Layers,
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
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const stats = [
  { value: '70+', label: 'Years Experience' },
  { value: 'ISO 13485', label: 'Certified' },
  { value: '10,000+', label: 'Custom Designs' },
  { value: 'Global', label: 'OEM Partner' },
];

const capabilities = [
  {
    icon: Cpu,
    title: 'Custom OEM Solutions',
    description:
      'From concept to production. We engineer bespoke foot controls tailored to your exact specifications, performance requirements, and regulatory standards.',
    link: '/custom-solutions',
  },
  {
    icon: Shield,
    title: 'Medical-Grade Manufacturing',
    description:
      'ISO 13485 certified. IEC 60601 compliant. Built for the operating room with full traceability, validated processes, and uncompromising quality.',
    link: '/industries',
  },
  {
    icon: Factory,
    title: 'Industrial Foot Controls',
    description:
      'Rugged, reliable controls for the world\'s toughest environments — from factory floors to heavy equipment to mission-critical defense applications.',
    link: '/industries',
  },
];

const trustIndicators = [
  { icon: Shield, title: 'ISO 13485', description: 'Medical device quality management certified' },
  { icon: Wrench, title: 'In-House Engineering', description: 'Full design & development capabilities' },
  { icon: Zap, title: 'Rapid Prototyping', description: 'Concept to prototype in weeks, not months' },
  { icon: Layers, title: 'Full Traceability', description: 'Lot tracking & documentation from raw material to delivery' },
  { icon: Clock, title: '70+ Years', description: 'Proven expertise since 1952' },
  { icon: MapPin, title: 'Made in USA', description: 'Designed & manufactured in Connecticut' },
];

const industries = [
  {
    title: 'Medical',
    icon: Stethoscope,
    specialties: ['Surgery', 'Diagnostic Imaging', 'Dental', 'Ophthalmology', 'Electrosurgery', 'Patient Monitoring'],
    description: 'Precision foot controls trusted in operating rooms and clinical environments worldwide.',
    gradient: 'from-blue-600/20 to-cyan-500/10',
  },
  {
    title: 'Industrial',
    icon: HardHat,
    specialties: ['Agriculture', 'Military & Defense', 'Construction', 'Aviation', 'Material Handling', 'Metalworking'],
    description: 'Rugged, operator-ready controls built for extreme conditions and heavy-duty applications.',
    gradient: 'from-amber-600/20 to-orange-500/10',
  },
];

const productCategories = [
  {
    icon: Footprints,
    title: 'Custom Footswitches',
    description: 'Engineered to your exact specifications with full OEM customization.',
  },
  {
    icon: Package,
    title: 'Stock Footswitches',
    description: 'Ready-to-ship foot controls in a wide range of configurations.',
  },
  {
    icon: Settings,
    title: 'Parts & Accessories',
    description: 'Pedals, guards, cables, connectors, and more for any build.',
  },
  {
    icon: RefreshCw,
    title: 'Replacement Parts',
    description: 'OEM-quality replacement components to extend the life of your equipment.',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative min-h-[calc(100vh-7rem)] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0f2035] to-[#060e1a]" />
          {/* Animated orbs */}
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
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[150px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Grid overlay */}
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
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-white/70"
            >
              <Award className="w-4 h-4 text-[#D4A853]" />
              <span>Trusted OEM Partner Since 1952</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-5xl"
            >
              Precision Foot Controls for the World&apos;s{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-cyan-400 bg-clip-text text-transparent">
                Most Demanding
              </span>{' '}
              Applications
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-white/60 max-w-3xl leading-relaxed"
            >
              Trusted OEM partner delivering custom medical and industrial footswitch solutions
              backed by 70+ years of engineering excellence.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/custom-solutions"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#2563EB] text-white font-semibold text-base hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Start a Custom Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white font-semibold text-base hover:bg-white/5 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Browse Products
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats ribbon */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat) => (
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

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  CAPABILITIES SHOWCASE                                       */}
      {/* ============================================================ */}
      <section className="relative py-16 lg:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Engineering{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-cyan-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
              Three pillars of capability that set Linemaster apart as the partner of choice for the
              world's leading OEMs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  variants={fadeUp}
                  className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-[#2563EB]" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
                    <p className="text-white/50 leading-relaxed mb-6">{cap.description}</p>
                    <Link
                      href={cap.link}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-blue-400 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TRUST SECTION                                               */}
      {/* ============================================================ */}
      <section className="relative py-16 lg:py-20 px-6">
        {/* Subtle section divider gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Trusted by{' '}
              <span className="text-[#D4A853]">Industry Leaders</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
              From Fortune 500 medical device companies to specialized industrial manufacturers,
              our partners trust Linemaster to deliver.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {trustIndicators.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={scaleIn}
                  className="flex items-start gap-4 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#D4A853]/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#D4A853]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/45 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  INDUSTRIES GRID                                             */}
      {/* ============================================================ */}
      <section className="relative py-16 lg:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Industries We{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-cyan-400 bg-clip-text text-transparent">
                Serve
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
              Specialized footswitch solutions for the most critical and demanding sectors.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.title}
                  variants={fadeUp}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all duration-500 cursor-pointer"
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white/80" />
                      </div>
                      <h3 className="text-2xl font-bold">{industry.title}</h3>
                    </div>

                    <p className="text-white/50 leading-relaxed mb-6">{industry.description}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {industry.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/[0.08] bg-white/[0.04] text-white/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/${industry.title.toLowerCase()}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-blue-400 transition-colors"
                    >
                      Explore {industry.title} Solutions
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRODUCT PREVIEW                                             */}
      {/* ============================================================ */}
      <section className="relative py-16 lg:py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Our{' '}
              <span className="bg-gradient-to-r from-[#D4A853] to-amber-300 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
              From fully custom OEM designs to ready-to-ship stock models, we have the right
              footswitch solution for your application.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {productCategories.map((product) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.title}
                  variants={scaleIn}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500"
                >
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-white/[0.04] to-white/[0.01] flex items-center justify-center border-b border-white/[0.06]">
                    <Icon className="w-16 h-16 text-white/10 group-hover:text-[#2563EB]/30 transition-colors duration-500" />
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed mb-4">{product.description}</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] hover:text-blue-400 transition-colors"
                    >
                      View Products
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SIGHTGUARD SPOTLIGHT                                        */}
      {/* ============================================================ */}
      <section className="relative py-16 lg:py-20 px-6 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#2563EB]/5 blur-[150px]" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Content */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 text-sm font-medium text-[#2563EB]">
                <Eye className="w-4 h-4" />
                New Product
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                Engineered to Protect,{' '}
                <span className="bg-gradient-to-r from-[#2563EB] to-cyan-400 bg-clip-text text-transparent">
                  Designed to be Seen
                </span>
              </h2>
              <p className="mt-6 text-white/50 text-lg leading-relaxed">
                Introducing SightGuard — our latest innovation in foot control safety. Featuring
                high-visibility design elements, enhanced ergonomics, and our proprietary
                guard system that prevents accidental actuation in critical environments.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: 'Accidental Actuation Prevention' },
                  { icon: Eye, label: 'High-Visibility Design' },
                  { icon: Activity, label: 'Enhanced Ergonomics' },
                  { icon: Award, label: 'Medical-Grade Materials' },
                ].map((feature) => {
                  const FIcon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-center gap-3">
                      <FIcon className="w-5 h-5 text-[#2563EB] shrink-0" />
                      <span className="text-sm text-white/60">{feature.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#2563EB] text-white font-semibold text-base hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  Discover SightGuard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Visual placeholder */}
            <motion.div
              variants={scaleIn}
              className="relative aspect-square rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-cyan-500/5" />
              <div className="relative text-center">
                <Footprints className="w-24 h-24 text-white/[0.08] mx-auto" />
                <p className="mt-4 text-sm text-white/20 font-medium">SightGuard Product Image</p>
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-8 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-16 rounded-full border border-[#2563EB]/[0.08]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative py-16 lg:py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0d1d33] to-[#0A1628]" />
        {/* Accent glow */}
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
            Ready to Discuss Your{' '}
            <span className="bg-gradient-to-r from-[#D4A853] to-amber-300 bg-clip-text text-transparent">
              Next Project
            </span>
            ?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-white/50 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Whether you need a fully custom OEM solution or want to explore our standard product
            line, our engineering team is ready to help bring your vision to life.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            <Link
              href="/custom-solutions"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-[#2563EB] text-white font-semibold text-lg hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Request a Quote
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
