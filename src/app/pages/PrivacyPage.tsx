import { motion } from "motion/react";
import { Shield } from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const GOLD = "#D4A853";
const WHITE = "#FFFFFF";
const GRAY_LIGHT = "#CBD5E1";
const GRAY = "#94A3B8";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ---------------------------------------------------------------------------
// Section data
// ---------------------------------------------------------------------------
const sections = [
  {
    title: "1. Information We Collect",
    content: `We may collect the following types of information when you visit our website, request a quote, or interact with our services:

- Personal Information: Name, email address, phone number, company name, job title, and mailing address that you voluntarily provide when filling out forms or contacting us.
- Technical Information: IP address, browser type, operating system, referring URLs, pages visited, and time spent on our website, collected automatically through server logs and analytics tools.
- Cookie Data: Information collected through cookies and similar tracking technologies as described in Section 4 below.
- Transaction Information: Purchase history, order details, and payment information when you buy products or request services.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect for the following purposes:

- To respond to your inquiries, process orders, and provide customer support.
- To send you product information, technical documentation, and updates you have requested.
- To improve our website, products, and services based on usage patterns and feedback.
- To comply with applicable laws, regulations, and legal processes.
- To protect the security and integrity of our website and business operations.
- To communicate about changes to our policies, terms, or products that may affect you.`,
  },
  {
    title: "3. Information Sharing",
    content: `Linemaster Switch Corporation does not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

- With trusted service providers who assist us in operating our website, processing transactions, or servicing you, provided they agree to keep your information confidential.
- When required by law, regulation, subpoena, or court order.
- To protect the rights, property, or safety of Linemaster Switch Corporation, our customers, or the public.
- In connection with a merger, acquisition, or sale of all or a portion of our assets, with appropriate notice provided to affected users.`,
  },
  {
    title: "4. Cookies and Tracking Technologies",
    content: `Our website uses cookies and similar technologies to enhance your browsing experience. These include:

- Essential Cookies: Required for the website to function properly, such as maintaining your session and security settings.
- Analytics Cookies: Help us understand how visitors interact with our website by collecting information anonymously.
- Functional Cookies: Remember your preferences and settings to provide a more personalized experience.

You can control cookie settings through your browser preferences. Please note that disabling certain cookies may affect the functionality of our website.`,
  },
  {
    title: "5. Data Security",
    content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure server infrastructure, access controls, and regular security assessments.

However, no method of transmission over the Internet or electronic storage is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements. When personal information is no longer needed, we securely delete or anonymize it.`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your jurisdiction, you may have certain rights regarding your personal information, including:

- The right to access the personal information we hold about you.
- The right to request correction of inaccurate or incomplete information.
- The right to request deletion of your personal information.
- The right to opt out of marketing communications at any time.

To exercise any of these rights, please contact us using the information provided below.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Our website and services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected personal information from a child under 16, we will take steps to delete such information promptly.`,
  },
  {
    title: "9. Third-Party Links",
    content: `Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.`,
  },
  {
    title: "11. Contact Us",
    content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us:

Linemaster Switch Corporation
29 Plaine Hill Road
Woodstock, CT 06281

Phone: (860) 928-2533
Email: info@linemaster.com`,
  },
];

// ---------------------------------------------------------------------------
// PrivacyPage
// ---------------------------------------------------------------------------
export default function PrivacyPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="min-h-screen py-14 md:py-20"
    >
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div variants={fadeIn} className="mb-12 text-center">
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(37,99,235,0.12)" }}
          >
            <Shield size={28} style={{ color: GOLD }} />
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ color: WHITE }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: GRAY }}>
            Effective Date: January 1, 2025 &mdash; Last Updated: January 1, 2025
          </p>
        </motion.div>

        {/* Intro */}
        <motion.p
          variants={fadeIn}
          className="mb-10 leading-relaxed"
          style={{ color: GRAY_LIGHT }}
        >
          Linemaster Switch Corporation (&ldquo;Linemaster,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
          or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you visit our website or
          interact with our services. Please read this policy carefully. By using our website, you
          consent to the practices described herein.
        </motion.p>

        {/* Sections */}
        {sections.map((section) => (
          <motion.div key={section.title} variants={fadeIn} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold" style={{ color: WHITE }}>
              {section.title}
            </h2>
            <div
              className="whitespace-pre-line leading-relaxed text-[0.938rem]"
              style={{ color: GRAY_LIGHT }}
            >
              {section.content}
            </div>
          </motion.div>
        ))}

        {/* Footer rule */}
        <motion.div variants={fadeIn}>
          <hr className="my-10" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
          <p className="text-center text-xs" style={{ color: GRAY }}>
            &copy; {new Date().getFullYear()} Linemaster Switch Corporation. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
