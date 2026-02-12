import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  Printer,
  Building2,
  User,
  MessageSquare,
  ArrowRight,
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
          <SectionBadge>Contact Us</SectionBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ lineHeight: 1.08 }}
        >
          Let's{' '}
          <span style={{ color: blue }}>Connect</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
        >
          Whether you need technical support, sales assistance, or want to discuss
          a custom project, our team is ready to help.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#inquiry-form"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-110"
            style={{ background: blue, boxShadow: `0 0 32px ${blueGlow}` }}
          >
            Send a Message
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="tel:8609741000"
            className="inline-flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/5 hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
          >
            <Phone className="h-4 w-4" />
            Call Us Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════
// 2. CONTACT INFO CARDS
// ═══════════════════════════════════════════════════
const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    primary: '(860) 974-1000',
    href: 'tel:8609741000',
    details: 'Mon - Fri, 8:00 AM - 5:00 PM EST',
  },
  {
    icon: Printer,
    title: 'Fax',
    primary: '(860) 974-0691',
    href: undefined,
    details: 'Toll Free Fax: (800) 974-3668',
  },
  {
    icon: Mail,
    title: 'Email',
    primary: 'sales@linemaster.com',
    href: 'mailto:sales@linemaster.com',
    details: 'We respond within one business day',
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    primary: '29 Plaine Hill Road',
    href: undefined,
    details: 'P.O. Box 238, Woodstock, CT 06281-0238',
  },
];

function ContactInfo() {
  return (
    <Section style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Get In Touch</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Contact Information
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Reach us by phone, email, or visit our headquarters in Woodstock, Connecticut.
          </p>
        </FadeInOnScroll>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {contactMethods.map((method, i) => (
          <FadeInOnScroll key={method.title} delay={i * 0.08}>
            <GlassPanel hover className="h-full text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: blueMuted }}
              >
                <method.icon className="h-5 w-5" style={{ color: blue }} />
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-white/40">
                {method.title}
              </h3>
              {method.href ? (
                <a
                  href={method.href}
                  className="mt-2 block text-lg font-semibold transition-colors duration-200 hover:text-white"
                  style={{ color: gold }}
                >
                  {method.primary}
                </a>
              ) : (
                <p className="mt-2 text-lg font-semibold" style={{ color: gold }}>
                  {method.primary}
                </p>
              )}
              <p className="mt-1.5 text-xs text-white/40">{method.details}</p>
            </GlassPanel>
          </FadeInOnScroll>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 3. INQUIRY FORM + MAP
// ═══════════════════════════════════════════════════
function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <Section id="inquiry-form" style={{ background: navy }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Send a Message</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            General Inquiry
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Have a question or need information? Fill out the form below and our
            team will get back to you promptly.
          </p>
        </FadeInOnScroll>
      </div>

      <FadeInOnScroll delay={0.2}>
        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <GlassPanel className="p-8">
              {submitted ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(34,197,94,0.15)' }}
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white">
                    Message Sent
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-white/50">
                    Thank you for reaching out. A member of our team will respond
                    within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
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
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
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
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={handleChange}
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClasses}
                      style={inputStyle}
                    >
                      <option value="">Select a topic</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="custom">Custom / OEM Solutions</option>
                      <option value="distributor">Distributor Information</option>
                      <option value="careers">Careers</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClasses} resize-none`}
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
                    style={{
                      background: blue,
                      boxShadow: `0 0 32px ${blueGlow}`,
                    }}
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </GlassPanel>
          </div>

          {/* Map / Location */}
          <div className="space-y-5 lg:col-span-2">
            <GlassPanel>
              <div
                className="flex h-48 items-center justify-center rounded-xl"
                style={{ background: 'rgba(10,22,40,0.6)' }}
              >
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-white/20" />
                  <p className="mt-3 text-sm font-medium text-white/40">
                    29 Plaine Hill Road
                  </p>
                  <p className="text-xs text-white/30">
                    Woodstock, CT 06281
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-start gap-3 text-sm text-white/60">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: gold }} />
                  <div>
                    <p className="font-medium text-white/80">Linemaster Switch Corporation</p>
                    <p>29 Plaine Hill Road</p>
                    <p>P.O. Box 238</p>
                    <p>Woodstock, CT 06281-0238</p>
                  </div>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-base font-semibold text-white">
                Need a Quote?
              </h3>
              <p className="mt-2 text-sm text-white/50">
                For custom or OEM project quotes, use our dedicated quote request form.
              </p>
              <Link
                href="/request-quote"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-white"
                style={{ color: blue }}
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassPanel>
          </div>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 4. BUSINESS HOURS
// ═══════════════════════════════════════════════════
function BusinessHours() {
  const hours = [
    { day: 'Monday', time: '8:00 AM - 5:00 PM' },
    { day: 'Tuesday', time: '8:00 AM - 5:00 PM' },
    { day: 'Wednesday', time: '8:00 AM - 5:00 PM' },
    { day: 'Thursday', time: '8:00 AM - 5:00 PM' },
    { day: 'Friday', time: '8:00 AM - 5:00 PM' },
    { day: 'Saturday', time: 'Closed' },
    { day: 'Sunday', time: 'Closed' },
  ];

  return (
    <Section style={{ background: navyLight }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Hours & Location</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Business Hours
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            All times are Eastern Standard Time (EST).
          </p>
        </FadeInOnScroll>
      </div>

      <FadeInOnScroll delay={0.2}>
        <div className="mx-auto mt-10 max-w-lg">
          <GlassPanel className="p-8">
            <div className="mb-6 flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" style={{ color: gold }} />
              <h3 className="text-lg font-semibold text-white">Office Hours</h3>
            </div>
            <div className="space-y-3">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className="flex items-center justify-between border-b py-2 text-sm"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <span className="font-medium text-white/70">{h.day}</span>
                  <span
                    className={
                      h.time === 'Closed'
                        ? 'text-white/30'
                        : 'font-medium text-white/90'
                    }
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-white/30">
              Closed on major US holidays
            </p>
          </GlassPanel>
        </div>
      </FadeInOnScroll>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// 5. REGIONAL SALES CONTACTS
// ═══════════════════════════════════════════════════
const salesRegions = [
  {
    region: 'Northeast',
    contact: 'Inside Sales Team',
    phone: '(860) 974-1000',
    email: 'sales@linemaster.com',
    territories: 'CT, MA, ME, NH, NJ, NY, PA, RI, VT',
  },
  {
    region: 'Southeast',
    contact: 'Inside Sales Team',
    phone: '(860) 974-1000',
    email: 'sales@linemaster.com',
    territories: 'AL, FL, GA, KY, MD, NC, SC, TN, VA, WV',
  },
  {
    region: 'Midwest',
    contact: 'Inside Sales Team',
    phone: '(860) 974-1000',
    email: 'sales@linemaster.com',
    territories: 'IA, IL, IN, MI, MN, MO, OH, WI',
  },
  {
    region: 'West',
    contact: 'Inside Sales Team',
    phone: '(860) 974-1000',
    email: 'sales@linemaster.com',
    territories: 'AZ, CA, CO, NV, OR, TX, UT, WA',
  },
  {
    region: 'International',
    contact: 'International Sales',
    phone: '(860) 974-1000',
    email: 'sales@linemaster.com',
    territories: 'Europe, Asia, Americas, Rest of World',
  },
  {
    region: 'OEM / Custom',
    contact: 'OEM Solutions Team',
    phone: '(860) 974-1000',
    email: 'sales@linemaster.com',
    territories: 'Medical, Industrial, Defense OEM programs',
  },
];

function RegionalSales() {
  return (
    <Section style={{ background: navy }}>
      <div className="text-center">
        <FadeInOnScroll>
          <SectionBadge>Sales Network</SectionBadge>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Regional Sales Contacts
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            Connect with the right sales representative for your region or application.
          </p>
        </FadeInOnScroll>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {salesRegions.map((region, i) => (
          <FadeInOnScroll key={region.region} delay={i * 0.08}>
            <GlassPanel hover className="h-full">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: i === 5 ? goldMuted : blueMuted }}
                >
                  {i === 4 ? (
                    <Globe className="h-5 w-5" style={{ color: blue }} />
                  ) : i === 5 ? (
                    <Building2 className="h-5 w-5" style={{ color: gold }} />
                  ) : (
                    <User className="h-5 w-5" style={{ color: blue }} />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{region.region}</h3>
                  <p className="text-xs text-white/40">{region.contact}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${region.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white/80"
                >
                  <Phone className="h-3.5 w-3.5" style={{ color: gold }} />
                  {region.phone}
                </a>
                <a
                  href={`mailto:${region.email}`}
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white/80"
                  style={{ color: blue }}
                >
                  <Mail className="h-3.5 w-3.5" />
                  {region.email}
                </a>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/30">
                {region.territories}
              </p>
            </GlassPanel>
          </FadeInOnScroll>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════
export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: navy }}>
      <Hero />
      <ContactInfo />
      <InquiryForm />
      <BusinessHours />
      <RegionalSales />
    </div>
  );
}
