'use client';

import { useConfig } from '@/context/ConfigContext';
import Link from 'next/link';

export default function TermsAndConditions() {
  const config = useConfig();

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.menuBackground || '#ffffff' }}>
      {/* Header Spacing */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${config.primaryColor || '#3b82f6'} 0%, ${config.primaryColor || '#3b82f6'}cc 100%)` }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Please read these terms carefully before using our services
            </p>
            <div className="mt-6 text-white/80 text-sm">
              Last updated: {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-gray-800">
          
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg leading-relaxed mb-4">
              Welcome to {config.siteTitle}. These Terms and Conditions (&quot;Terms&quot;) govern your use of our website and participation in our motorsport events. By accessing our website or participating in our events, you agree to be bound by these Terms.
            </p>
            <p className="text-lg leading-relaxed">
              Please read these Terms carefully. If you do not agree with these Terms, you must not use our website or participate in our events.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              1. Acceptance of Terms
            </h2>
            
            <p className="leading-relaxed mb-4">
              By using our website or registering for any of our events, you acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You have read and understood these Terms</li>
              <li>You agree to comply with all applicable laws and regulations</li>
              <li>You are at least 18 years old, or have parental/guardian consent</li>
              <li>All information you provide is accurate and complete</li>
              <li>You will notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* Event Registration & Participation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              2. Event Registration & Participation
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">2.1 Registration Requirements</h3>
                <p className="leading-relaxed">
                  To participate in our events, you must complete the registration process, provide accurate information, hold valid racing licenses (where required), meet vehicle technical requirements, and pay all applicable fees.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2.2 Entry Fees</h3>
                <p className="leading-relaxed">
                  All entry fees must be paid in full before participation. Entry fees are non-refundable unless the event is cancelled by the organizer. We reserve the right to refuse entry if fees are not paid.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2.3 Eligibility</h3>
                <p className="leading-relaxed">
                  Participants must hold appropriate racing licenses, have valid insurance coverage, meet age requirements (typically 18+ or with parental consent), comply with vehicle technical regulations, and pass all safety inspections.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2.4 Code of Conduct</h3>
                <p className="leading-relaxed mb-2">
                  All participants must:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Conduct themselves in a professional and sportsmanlike manner</li>
                  <li>Follow all safety regulations and officials&apos; instructions</li>
                  <li>Respect other participants, officials, and spectators</li>
                  <li>Refrain from dangerous or reckless driving</li>
                  <li>Not use alcohol or prohibited substances before or during events</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety & Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              3. Safety & Liability
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">3.1 Assumption of Risk</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="font-semibold text-yellow-800 mb-2">IMPORTANT NOTICE</p>
                  <p className="text-yellow-700 leading-relaxed">
                    Motorsport is inherently dangerous. By participating in our events, you acknowledge and accept all risks associated with motorsport activities, including but not limited to: collision, mechanical failure, serious injury, death, and property damage.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3.2 Waiver of Liability</h3>
                <p className="leading-relaxed mb-4">
                  To the fullest extent permitted by law, you agree to release, indemnify, and hold harmless {config.siteTitle}, its organizers, officials, sponsors, staff, volunteers, and affiliated organizations from any and all claims, liabilities, damages, and expenses arising from your participation in events.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3.3 Insurance</h3>
                <p className="leading-relaxed">
                  Participants must maintain adequate personal accident and public liability insurance. {config.siteTitle} is not responsible for participants&apos; insurance coverage. You are solely responsible for ensuring you have appropriate insurance.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">3.4 Medical Fitness</h3>
                <p className="leading-relaxed">
                  You declare that you are medically fit to participate and will immediately notify officials of any medical conditions that may affect your participation. We reserve the right to require medical clearance certificates.
                </p>
              </div>
            </div>
          </section>

          {/* Rules & Regulations */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              4. Rules & Regulations
            </h2>
            
            <div className="space-y-4">
              <p className="leading-relaxed">
                All participants must comply with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Event-specific supplementary regulations</li>
                <li>Motorsport Australia regulations and guidelines</li>
                <li>Circuit-specific rules and safety requirements</li>
                <li>Technical regulations for your category</li>
                <li>Flag signals and race control instructions</li>
                <li>Pit lane and paddock procedures</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Officials&apos; decisions are final. Protests and appeals must follow the procedures outlined in the event supplementary regulations.
              </p>
            </div>
          </section>

          {/* Vehicle Requirements */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              5. Vehicle Requirements
            </h2>
            
            <p className="leading-relaxed mb-4">
              All vehicles must:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pass pre-event technical inspection</li>
              <li>Comply with category-specific technical regulations</li>
              <li>Display correct signage and race numbers</li>
              <li>Have valid logbooks (where required)</li>
              <li>Meet safety equipment requirements (roll cage, fire extinguisher, etc.)</li>
              <li>Be in safe mechanical condition</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Vehicles that fail technical inspection will not be permitted to participate until defects are rectified.
            </p>
          </section>

          {/* Cancellations & Refunds */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              6. Cancellations & Refunds
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">6.1 Event Cancellation</h3>
                <p className="leading-relaxed">
                  We reserve the right to cancel, postpone, or modify events due to weather, safety concerns, insufficient entries, or force majeure. In case of cancellation, participants will receive a full or partial refund as determined by the circumstances.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">6.2 Participant Withdrawal</h3>
                <p className="leading-relaxed">
                  Entry fees are generally non-refundable. Withdrawal requests must be submitted in writing. Refunds may be considered on a case-by-case basis at our discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              7. Intellectual Property & Media Rights
            </h2>
            
            <p className="leading-relaxed mb-4">
              By participating in our events, you grant {config.siteTitle} the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use your name, image, and likeness in promotional materials</li>
              <li>Record and broadcast your participation</li>
              <li>Publish photographs and videos on our website and social media</li>
              <li>Use timing and results data</li>
            </ul>
            <p className="leading-relaxed mt-4">
              All event logos, branding, and content on this website are protected by copyright and may not be used without permission.
            </p>
          </section>

          {/* Website Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              8. Website Use
            </h2>
            
            <p className="leading-relaxed mb-4">
              When using our website, you agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to systems</li>
              <li>Transmit viruses or malicious code</li>
              <li>Scrape or harvest data without permission</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Interfere with the proper functioning of the website</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              9. Limitation of Liability
            </h2>
            
            <p className="leading-relaxed mb-4">
              To the maximum extent permitted by law, {config.siteTitle} shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Personal injury, death, or property damage arising from event participation</li>
              <li>Loss of data, profits, or business opportunities</li>
              <li>Indirect, consequential, or punitive damages</li>
              <li>Events beyond our reasonable control (force majeure)</li>
              <li>Actions or omissions of third parties</li>
            </ul>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              10. Privacy
            </h2>
            
            <p className="leading-relaxed">
              Your use of our website and services is also governed by our{' '}
              <Link href="/privacy" className="underline font-semibold" style={{ color: config.primaryColor || '#3b82f6' }}>
                Privacy Policy
              </Link>
              . Please review it to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              11. Changes to Terms
            </h2>
            
            <p className="leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of our services after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              12. Governing Law
            </h2>
            
            <p className="leading-relaxed">
              These Terms are governed by the laws of Australia. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Australia.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              13. Contact Information
            </h2>
            
            <p className="leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p className="font-semibold">{config.siteTitle}</p>
              {config.socials?.email && (
                <p>Email: {config.socials.email}</p>
              )}
              {config.socials?.phone && (
                <p>Phone: {config.socials.phone}</p>
              )}
              {config.socials?.location && (
                <p>Location: {config.socials.location}</p>
              )}
            </div>
          </section>

          {/* Acknowledgment */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <p className="font-semibold text-blue-800 mb-2">Acknowledgment</p>
            <p className="text-blue-700 leading-relaxed">
              By using our website or participating in our events, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>

          {/* Back to Home */}
          <div className="pt-8 border-t">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 font-semibold hover:underline transition-colors"
              style={{ color: config.primaryColor || '#3b82f6' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

