import { Phone, Mail, MapPin, Facebook, Linkedin, Shield, ArrowRight } from 'lucide-react';
import { Link } from '@/app/components/Router';

const FOOTER_LINKS = {
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Capabilities', href: '/about#capabilities' },
      { label: 'Certifications', href: '/about#certifications' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  products: {
    title: 'Products',
    links: [
      { label: 'Medical Footswitches', href: '/products?category=medical' },
      { label: 'Industrial Footswitches', href: '/products?category=industrial' },
      { label: 'Foot Pedals', href: '/products?type=pedal' },
      { label: 'Hand Controls', href: '/products?type=hand' },
      { label: 'Custom Solutions', href: '/custom-solutions' },
    ],
  },
  industries: {
    title: 'Industries',
    links: [
      { label: 'Medical & Surgical', href: '/industries/medical' },
      { label: 'Industrial Automation', href: '/industries/industrial' },
      { label: 'Aviation & Defense', href: '/industries/aviation' },
      { label: 'Construction', href: '/industries/construction' },
      { label: 'All Industries', href: '/industries' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Request a Quote', href: '/request-quote' },
      { label: 'Product Catalog', href: '/catalog' },
      { label: 'Technical Support', href: '/support' },
      { label: 'Blog', href: '/blog' },
      { label: 'Shop Online', href: '/shop' },
    ],
  },
} as const;

export function Footer() {
  return (
    <footer className="relative bg-[#060E1A] border-t border-white/5">
      {/* CTA strip */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              Ready to engineer your custom footswitch?
            </h3>
            <p className="text-white/50 mt-1 text-sm">
              70+ years of precision manufacturing. ISO 13485 certified. Trusted by Fortune 500 OEMs.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#3B82F6] transition-all duration-300 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/40 hover:-translate-y-0.5 whitespace-nowrap"
          >
            Request a Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Company info column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-none group inline-block">
              <span className="text-lg font-bold tracking-wider text-white transition-colors group-hover:text-[#2563EB]">
                LINEMASTER
              </span>
              <span className="text-[0.55rem] font-medium tracking-[0.2em] text-white/40 uppercase">
                Switch Corporation
              </span>
            </Link>

            <p className="mt-5 text-sm text-white/40 leading-relaxed max-w-xs">
              World leader in the design and manufacture of foot-operated controls
              for medical, industrial, and commercial applications.
            </p>

            {/* ISO badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Shield className="w-4 h-4 text-[#D4A853]" />
              <span className="text-xs font-medium text-[#D4A853]">
                ISO 13485 Certified
              </span>
            </div>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a
                href="tel:8609741000"
                className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                (860) 974-1000
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/40">
                <Phone className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <span>Fax: (860) 974-0691</span>
                  <span>Toll Free Fax: (800) 974-3668 (USA Only)</span>
                </div>
              </div>
              <a
                href="mailto:info@linemaster.com"
                className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                info@linemaster.com
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/40">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                <span>29 Plaine Hill Road, Woodstock, CT 06281</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com/linemaster"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/linemaster-switch"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/35 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <p>&copy; 2026 Linemaster Switch Corporation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
