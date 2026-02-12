import { motion } from "motion/react";
import { FileText } from "lucide-react";

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
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Linemaster Switch Corporation website (the "Site"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this Site.

These Terms of Use constitute a legally binding agreement between you and Linemaster Switch Corporation. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting on this page.`,
  },
  {
    title: "2. Use of the Site",
    content: `You agree to use the Site only for lawful purposes and in a manner that does not infringe upon the rights of, restrict, or inhibit anyone else's use of the Site. Prohibited conduct includes but is not limited to:

- Engaging in any activity that disrupts or interferes with the Site's functionality or security.
- Attempting to gain unauthorized access to any portion of the Site, other accounts, or computer systems.
- Using any automated means, including robots, spiders, or scrapers, to access the Site or collect data without our express written permission.
- Transmitting any viruses, malware, or other harmful code.
- Using the Site to transmit unsolicited commercial communications.`,
  },
  {
    title: "3. Intellectual Property",
    content: `All content on this Site, including but not limited to text, graphics, logos, images, product designs, technical drawings, photographs, software, and the compilation thereof, is the property of Linemaster Switch Corporation or its licensors and is protected by United States and international copyright, trademark, and other intellectual property laws.

The Linemaster name, logo, and all related product names, design marks, and slogans are trademarks or registered trademarks of Linemaster Switch Corporation. You may not use, reproduce, or distribute any trademarks without our prior written consent.

You are granted a limited, non-exclusive, revocable license to access and make personal, non-commercial use of the Site. This license does not include the right to modify, reproduce, distribute, or create derivative works from any content on the Site.`,
  },
  {
    title: "4. Product Information and Specifications",
    content: `While we strive to provide accurate and up-to-date product information, specifications, and pricing on our Site, Linemaster Switch Corporation does not warrant that product descriptions, specifications, pricing, or other content is accurate, complete, reliable, current, or error-free.

All products are subject to availability. We reserve the right to discontinue any product at any time and to modify specifications and pricing without prior notice. Product images are for illustrative purposes and may not exactly represent the actual product.

For the most current and accurate product information, please contact our sales team directly.`,
  },
  {
    title: "5. Disclaimer of Warranties",
    content: `THE SITE AND ALL CONTENT, MATERIALS, AND SERVICES PROVIDED ON OR THROUGH THE SITE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

TO THE FULLEST EXTENT PERMITTED BY LAW, LINEMASTER SWITCH CORPORATION DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

LINEMASTER SWITCH CORPORATION DOES NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, SECURE, OR FREE OF ERRORS OR VIRUSES.`,
  },
  {
    title: "6. Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LINEMASTER SWITCH CORPORATION, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO:

- Your use or inability to use the Site.
- Any content obtained from the Site.
- Unauthorized access to or alteration of your transmissions or data.
- Any other matter relating to the Site.

IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE SITE DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.`,
  },
  {
    title: "7. Indemnification",
    content: `You agree to indemnify, defend, and hold harmless Linemaster Switch Corporation, its officers, directors, employees, agents, licensors, and suppliers from and against all claims, losses, expenses, damages, and costs, including reasonable attorneys' fees, arising out of or relating to your violation of these Terms of Use, your use of the Site, or your violation of any rights of a third party.`,
  },
  {
    title: "8. Third-Party Links",
    content: `The Site may contain links to third-party websites or resources. These links are provided for your convenience only. Linemaster Switch Corporation has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites. Your use of third-party websites is at your own risk and subject to the terms and conditions of use for such websites.`,
  },
  {
    title: "9. Governing Law and Jurisdiction",
    content: `These Terms of Use shall be governed by and construed in accordance with the laws of the State of Connecticut, United States, without regard to its conflict of law principles.

Any legal action or proceeding arising out of or relating to these Terms of Use or your use of the Site shall be brought exclusively in the state or federal courts located in the State of Connecticut. You hereby consent to the personal jurisdiction of such courts and waive any objection to the laying of venue in such courts.`,
  },
  {
    title: "10. Severability",
    content: `If any provision of these Terms of Use is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity, illegality, or unenforceability shall not affect the remaining provisions, which shall continue in full force and effect.`,
  },
  {
    title: "11. Entire Agreement",
    content: `These Terms of Use, together with our Privacy Policy and any other legal notices or agreements published by us on the Site, constitute the entire agreement between you and Linemaster Switch Corporation concerning your use of the Site. No waiver of any term shall be deemed a further or continuing waiver of such term or any other term.`,
  },
  {
    title: "12. Contact Information",
    content: `If you have questions about these Terms of Use, please contact us:

Linemaster Switch Corporation
29 Plaine Hill Road
Woodstock, CT 06281

Phone: (860) 928-2533
Email: info@linemaster.com`,
  },
];

// ---------------------------------------------------------------------------
// TermsPage
// ---------------------------------------------------------------------------
export default function TermsPage() {
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
            <FileText size={28} style={{ color: GOLD }} />
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl" style={{ color: WHITE }}>
            Terms of Use
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
          Welcome to the Linemaster Switch Corporation website. Please read these Terms of Use
          carefully before using our website. These terms govern your access to and use of the Site
          and all content, services, and products available through the Site.
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
