import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from '@/app/components/Router';
import {
  Download, FileText, Activity, Wifi, Shield, Cog,
  BookOpen, ArrowRight, Mail, Phone, MapPin, Send,
  ChevronRight
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Catalog Data                                                       */
/* ------------------------------------------------------------------ */

interface CatalogItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  fileSize: string;
  pages: number;
  category: string;
}

const catalogItems: CatalogItem[] = [
  {
    id: 'full-catalog',
    icon: BookOpen,
    title: 'Full Product Catalog',
    description:
      'Complete catalog featuring all Linemaster stock and configurable footswitches with full specifications, dimensions, and ordering information.',
    fileSize: '18.4 MB',
    pages: 96,
    category: 'Catalog',
  },
  {
    id: 'medical-catalog',
    icon: Activity,
    title: 'Medical Footswitch Catalog',
    description:
      'Dedicated catalog for medical-grade foot controls including autoclavable, IP-rated, and wireless options for surgical and clinical use.',
    fileSize: '8.2 MB',
    pages: 44,
    category: 'Catalog',
  },
  {
    id: 'industrial-catalog',
    icon: Cog,
    title: 'Industrial Footswitch Catalog',
    description:
      'Heavy-duty industrial foot controls for manufacturing, metalworking, woodworking, and automation applications.',
    fileSize: '9.6 MB',
    pages: 52,
    category: 'Catalog',
  },
  {
    id: 'sightguard-datasheet',
    icon: Shield,
    title: 'SightGuard Data Sheet',
    description:
      'Technical data sheet for the SightGuard foot switch guard, including dimensions, materials, compatibility chart, and installation instructions.',
    fileSize: '2.1 MB',
    pages: 4,
    category: 'Data Sheet',
  },
  {
    id: 'wireless-brochure',
    icon: Wifi,
    title: 'Wireless Solutions Brochure',
    description:
      'Overview of Linemaster wireless footswitch technology featuring the T-91 and Treadlite II Wireless series with range specs and pairing information.',
    fileSize: '3.8 MB',
    pages: 12,
    category: 'Brochure',
  },
  {
    id: 'oem-brochure',
    icon: FileText,
    title: 'Custom OEM Capabilities Overview',
    description:
      'Learn about Linemaster\'s custom design and OEM manufacturing capabilities, from concept through production, including case studies and lead times.',
    fileSize: '5.4 MB',
    pages: 16,
    category: 'Brochure',
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Catalog: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  'Data Sheet': { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  Brochure: { bg: 'bg-amber-500/20', text: 'text-amber-300' },
};

/* ------------------------------------------------------------------ */
/*  Download Card                                                      */
/* ------------------------------------------------------------------ */

function DownloadCard({ item, index }: { item: CatalogItem; index: number }) {
  const Icon = item.icon;
  const colors = categoryColors[item.category] || categoryColors['Catalog'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="relative bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group h-full flex flex-col">
        {/* Category badge */}
        <span
          className={`absolute top-4 right-4 ${colors.bg} ${colors.text} text-xs font-medium px-2.5 py-0.5 rounded-full`}
        >
          {item.category}
        </span>

        {/* Icon */}
        <div className="w-14 h-14 bg-[#2563EB]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#2563EB]/20 transition-colors duration-300">
          <Icon className="w-7 h-7 text-[#2563EB]" />
        </div>

        {/* Content */}
        <h3 className="text-white font-semibold text-lg leading-tight mb-2">
          {item.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-white/40 mb-5">
          <span className="bg-white/5 px-2 py-0.5 rounded-md">PDF</span>
          <span>{item.fileSize}</span>
          <span>{item.pages} pages</span>
        </div>

        {/* Download button */}
        <button className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white text-sm font-medium py-2.5 rounded-lg transition-colors duration-200">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Request Form                                                       */
/* ------------------------------------------------------------------ */

function RequestCatalogForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-white font-semibold text-xl mb-2">
          Request Submitted
        </h3>
        <p className="text-white/50 max-w-md mx-auto">
          Thank you for your interest. Our team will process your catalog
          request and ship it within 3-5 business days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-white/60 text-sm mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-white/60 text-sm mb-1.5">
          Company
        </label>
        <input
          type="text"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all"
          placeholder="Acme Corp"
        />
      </div>
      <div>
        <label className="block text-white/60 text-sm mb-1.5">
          Email *
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all"
          placeholder="john@company.com"
        />
      </div>
      <div>
        <label className="block text-white/60 text-sm mb-1.5">
          Phone
        </label>
        <input
          type="tel"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all"
          placeholder="(555) 123-4567"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-white/60 text-sm mb-1.5">
          Mailing Address *
        </label>
        <textarea
          required
          rows={3}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all resize-none"
          placeholder="123 Main St, Suite 100, City, State ZIP"
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#c49a48] text-[#0A1628] font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
        >
          <Send className="w-4 h-4" />
          Request Physical Catalog
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Downloads & Resources
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Product Catalog
            <br />
            <span className="text-[#2563EB]">& Literature</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Download our latest catalogs, data sheets, and brochures. All
            resources are available as free PDF downloads.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  DOWNLOADABLE RESOURCES GRID                                  */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4">
              Digital Downloads
            </h2>
            <p className="text-white/50 text-lg max-w-xl">
              Browse and download our complete library of product literature.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalogItems.map((item, i) => (
              <DownloadCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  REQUEST PHYSICAL CATALOG                                     */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Left content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 bg-[#D4A853]/15 text-[#D4A853] text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                  <Mail className="w-4 h-4" />
                  Free Shipping
                </span>
                <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4">
                  Request a Physical Catalog
                </h2>
                <p className="text-white/50 text-lg leading-relaxed mb-8">
                  Prefer a printed catalog? Fill out the form and we will mail
                  you our latest full-line product catalog at no charge.
                </p>

                <div className="space-y-4 text-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-white/70 font-medium text-sm">Phone</p>
                      <p className="text-sm">(800) 223-7609</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-white/70 font-medium text-sm">Email</p>
                      <p className="text-sm">info@linemaster.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-white/70 font-medium text-sm">Headquarters</p>
                      <p className="text-sm">Woodstock, CT</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8"
            >
              <RequestCatalogForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                          */}
      {/* ============================================================ */}
      <section className="py-14 md:py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#101c33] to-[#162240] rounded-3xl px-8 sm:px-12 py-12 sm:py-16 text-center overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#2563EB]/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#D4A853]/10 rounded-full blur-[80px]" />

            <div className="relative">
              <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4">
                Need help finding the right product?
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Our Switch Wizard helps you find the perfect footswitch based on
                your application requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/switch-wizard"
                  className="inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors duration-200 shadow-lg shadow-[#2563EB]/20"
                >
                  Launch Switch Wizard <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors duration-200 border border-white/20"
                >
                  Browse All Products <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
