import React from 'react';

type DocumentType = 'privacy' | 'terms' | 'accessibility';

interface LegalPageProps {
  documentType: DocumentType;
}

const CARD =
  'rounded-2xl border border-[#22201F]/15 dark:border-[#F6F2EA]/10 dark:border-[#383330] bg-white dark:bg-[#22201F] shadow-[0_1px_2px_rgba(34,32,31,0.04),0_18px_36px_-26px_rgba(34,32,31,0.35)]';
const MICRO = 'text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#8A7E6F] dark:text-[#A89F91]';

export default function LegalPage({ documentType }: LegalPageProps) {
  const getDocumentContent = () => {
    switch (documentType) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          updated: 'August 10, 2024',
          sections: [
            {
              heading: '1. Information We Collect',
              body: 'We collect minimal information necessary to provide you with the best educational experience. This includes academic inquiries submitted through the contact form, optional profile creation data, and standard analytics data to improve portal performance.'
            },
            {
              heading: '2. Use of Information',
              body: 'Your information is used solely for the purpose of educational communication, doubt resolution, and providing access to academic resources. We do not sell, rent, or share your personal information with third parties for marketing purposes.'
            },
            {
              heading: '3. Data Security',
              body: 'We implement industry-standard security measures to protect your data. All communication through the portal is encrypted, and academic records are stored securely.'
            },
            {
              heading: '4. Cookies & Analytics',
              body: 'We use essential cookies to maintain session state and preferences. Non-essential cookies for analytics help us understand how students use the portal, allowing us to optimize study materials.'
            }
          ]
        };
      case 'terms':
        return {
          title: 'Terms of Use',
          updated: 'August 10, 2024',
          sections: [
            {
              heading: '1. Acceptance of Terms',
              body: 'By accessing this academic portal, you agree to abide by these Terms of Use. The resources provided are intended strictly for educational purposes and personal study.'
            },
            {
              heading: '2. Intellectual Property',
              body: 'All study materials, lecture notes, question banks, and structural diagrams provided on this portal are the intellectual property of Prof. Ajesh Joe and Brilliant Study Centre. Unauthorized commercial redistribution is strictly prohibited.'
            },
            {
              heading: '3. User Conduct',
              body: 'Students are expected to maintain academic integrity. Do not submit spam, inappropriate content, or malicious links through the contact forms or doubt portals.'
            },
            {
              heading: '4. Limitation of Liability',
              body: 'While every effort is made to ensure the accuracy of chemical equations, formulas, and solutions, the portal is provided "as is". We are not liable for examination outcomes resulting from the use of these materials.'
            }
          ]
        };
      case 'accessibility':
        return {
          title: 'Accessibility Statement',
          updated: 'August 10, 2024',
          sections: [
            {
              heading: '1. Commitment to Accessibility',
              body: 'We are committed to ensuring digital accessibility for all students, including those with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.'
            },
            {
              heading: '2. Supported Technologies',
              body: 'This portal is designed to be compatible with standard assistive technologies. We support keyboard navigation, screen reader compatibility for text-based resources, and high-contrast dark modes.'
            },
            {
              heading: '3. Ongoing Efforts',
              body: 'Our development team regularly audits the portal against WCAG guidelines. Specifically, we focus on semantic HTML structure, ARIA labels for interactive elements, and accessible color palettes.'
            },
            {
              heading: '4. Feedback',
              body: 'If you encounter any accessibility barriers while using this academic portal, please use the Contact Office form to let us know. We aim to address accessibility issues promptly.'
            }
          ]
        };
    }
  };

  const content = getDocumentContent();

  return (
    <div className="dash-root min-h-screen bg-[#F6F2EA] dark:bg-[#1A1817] text-[#22201F] dark:text-[#F6F2EA]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <p className={MICRO}>Legal Documents</p>
          <h1 className="dash-serif mt-2 text-3xl font-semibold sm:text-4xl text-[#22201F] dark:text-[#F6F2EA]">
            {content.title}
          </h1>
          <p className="mt-3 text-[13px] font-medium text-[#8A7E6F] dark:text-[#A89F91]">
            Last Updated: {content.updated}
          </p>
        </div>

        {/* Content Card */}
        <div className={`${CARD} p-7 sm:p-10 space-y-8`}>
          {content.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="dash-serif text-xl font-semibold text-[#4A0E1B] dark:text-[#E8CD82]">
                {section.heading}
              </h3>
              <p className="text-[15px] leading-relaxed text-[#5A534B] dark:text-[#C7BCAD]">
                {section.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
