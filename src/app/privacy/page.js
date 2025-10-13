'use client';

import { useConfig } from '@/context/ConfigContext';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your privacy is important to us
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
              {config.siteTitle} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and participate in our motorsport events.
            </p>
            <p className="text-lg leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <p className="leading-relaxed mb-2">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Register for events</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Fill out forms on our website</li>
                  <li>Contact us via email or phone</li>
                  <li>Create an account on our platform</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  This information may include: name, email address, phone number, mailing address, emergency contact information, vehicle details, racing license information, and payment information.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
                <p className="leading-relaxed">
                  When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies installed on your device. We may also collect information about your browsing activity, such as pages viewed and links clicked.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Cookies and Tracking Technologies</h3>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              How We Use Your Information
            </h2>
            
            <p className="leading-relaxed mb-4">
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To process event registrations and entries</li>
              <li>To communicate with you about events, schedules, and results</li>
              <li>To send you newsletters and promotional materials (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To comply with legal obligations and safety requirements</li>
              <li>To prevent fraud and enhance security</li>
              <li>To analyze website usage and optimize user experience</li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Sharing Your Information
            </h2>
            
            <p className="leading-relaxed mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>With Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf (payment processing, email delivery, hosting services)</li>
              <li><strong>With Event Partners:</strong> Information may be shared with racing circuits, timing companies, and other event partners necessary for event operations</li>
              <li><strong>With Regulatory Bodies:</strong> We may share information with motorsport governing bodies and regulatory authorities as required</li>
              <li><strong>For Legal Purposes:</strong> We may disclose your information if required by law or to protect our rights, property, or safety</li>
              <li><strong>With Your Consent:</strong> We may share your information for any other purpose with your explicit consent</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Data Security
            </h2>
            
            <p className="leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Your Privacy Rights
            </h2>
            
            <p className="leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to the processing of your personal information</li>
              <li><strong>Data Portability:</strong> Request transfer of your personal information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time (where processing is based on consent)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Children&apos;s Privacy
            </h2>
            
            <p className="leading-relaxed">
              Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information. For participants under 18, we require parental or guardian consent for event participation.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Changes to This Privacy Policy
            </h2>
            
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Contact Us
            </h2>
            
            <p className="leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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

