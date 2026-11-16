import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Shield,
  Award,
  Factory,
  CheckCircle2,
  Upload,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  FileText,
  ShieldCheck,
  Flag,
  Calendar,
} from 'lucide-react';
import { Link } from '@/app/components/Router';

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
          <SectionBadge>Request a Quote</SectionBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.08 }}
        >
          Start Your{' '}
          <span style={{ color: blue }}>Custom Project</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
        >
          Tell us about your project requirements and our engineering team
          will prepare a detailed quote within one business day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#quote-form"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-110"
            style={{ background: blue, boxShadow: `0 0 32px ${blueGlow}` }}
          >
            Fill Out the Form
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="tel:8609741000"
            className="inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/5 hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
          >
            <Phone className="h-4 w-4" />
            (860) 974-1000
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
            <Clock className="h-3.5 w-3.5" /> 1-Day Response
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> ISO 13485 Certified
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> NDA Available
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// 2. QUOTE FORM + TRUST SIDEBAR
// ═══════════════════════════════════════════════════
function QuoteForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    title: '',
    email: '',
    phone: '',
    industry: '',
    application: '',
    volume: '',
    timeline: '',
    additionalInfo: '',
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
    <Section id="quote-form" style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Project Details</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Tell Us About Your Project
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Provide as much detail as possible so our team can prepare an
            accurate and comprehensive quote.
          </p>
        </FadeInOnScroll>
      </div>

      <FadeInOnScroll delay={0.2}>
        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <GlassPanel className="p-8">
              {submitted ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(34,197,94,0.15)' }}
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white">
                    Quote Request Submitted
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-white/50">
                    Thank you for your interest. A Linemaster engineer will
                    review your requirements and contact you within one business
                    day with a detailed quote.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-white"
                    style={{ color: blue }}
                  >
                    Return to Contact
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider" style={{ color: gold }}>
                      Company Information
                    </h3>
                    <div className="space-y-5">
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
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider" style={{ color: gold }}>
                      Contact Details
                    </h3>
                    <div className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
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
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-white/60">
                            Job Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            placeholder="Your role"
                            value={formData.title}
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
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider" style={{ color: gold }}>
                      Project Details
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-white/60">
                          Application Description *
                        </label>
                        <textarea
                          name="application"
                          required
                          rows={4}
                          placeholder="Describe your application, requirements, operating environment, and any specific needs..."
                          value={formData.application}
                          onChange={handleChange}
                          className={`${inputClasses} resize-none`}
                          style={inputStyle}
                        />
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
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
                            <option value="prototype">Prototype only</option>
                            <option value="under-100">Under 100 units</option>
                            <option value="100-500">100 - 500 units</option>
                            <option value="500-1000">500 - 1,000 units</option>
                            <option value="1000-5000">1,000 - 5,000 units</option>
                            <option value="5000-plus">5,000+ units</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-white/60">
                            Timeline Requirements
                          </label>
                          <select
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className={inputClasses}
                            style={inputStyle}
                          >
                            <option value="">Select timeline</option>
                            <option value="urgent">Urgent (1 - 3 months)</option>
                            <option value="standard">Standard (3 - 6 months)</option>
                            <option value="flexible">Flexible (6 - 12 months)</option>
                            <option value="planning">Planning phase (12+ months)</option>
                          </select>
                        </div>
                      </div>

                      {/* File upload */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-white/60">
                          Specs / Drawings (optional)
                        </label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 text-sm text-white/40 transition-colors duration-200 hover:border-white/20 hover:text-white/60"
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
                        <p className="mt-1.5 text-xs text-white/25">
                          Accepted formats: PDF, DOC, STEP, IGES, DXF, DWG, PNG, JPG
                        </p>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-white/60">
                          Additional Information
                        </label>
                        <textarea
                          name="additionalInfo"
                          rows={3}
                          placeholder="Any other details, regulatory requirements, or special considerations..."
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          className={`${inputClasses} resize-none`}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
                    style={{
                      background: blue,
                      boxShadow: `0 0 32px ${blueGlow}`,
                    }}
                  >
                    Submit Quote Request
                  </button>
                </form>
              )}
            </GlassPanel>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Trust Badges */}
            <GlassPanel>
              <h3 className="mb-4 text-base font-semibold text-white">
                Certifications & Trust
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'ISO 13485:2016 Certified' },
                  { icon: CheckCircle2, text: 'IEC 60601-1 Compliant' },
                  { icon: Award, text: 'UL / CSA Listed' },
                  { icon: Flag, text: 'Made in USA' },
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

            {/* Quick Contact */}
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
                href="mailto:sales@linemaster.com"
                className="mt-2 flex items-center gap-2 text-sm font-medium"
                style={{ color: blue }}
              >
                <Mail className="h-3.5 w-3.5" />
                sales@linemaster.com
              </a>
            </GlassPanel>

            {/* Response Time */}
            <GlassPanel>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: blueMuted }}
                >
                  <Clock className="h-5 w-5" style={{ color: blue }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Fast Response</h3>
                  <p className="text-xs text-white/40">Within 1 business day</p>
                </div>
              </div>
            </GlassPanel>

            {/* What to Expect */}
            <GlassPanel>
              <h3 className="mb-3 text-base font-semibold text-white">
                What to Expect
              </h3>
              <div className="space-y-3">
                {[
                  'Engineer reviews your requirements',
                  'Preliminary feasibility assessment',
                  'Detailed quote with timeline',
                  'NDA available upon request',
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: blueMuted, color: blue }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-white/50">{step}</span>
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
export default function RequestQuotePage() {
  return (
    <div className="min-h-screen" style={{ background: navy }}>
      <Hero />
      <QuoteForm />
    </div>
  );
}
