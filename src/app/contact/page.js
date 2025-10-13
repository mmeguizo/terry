'use client';

import { useConfig } from '@/context/ConfigContext';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const config = useConfig();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to an API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 5000);
  };

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
              Contact Us
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Get in touch with our team - we&apos;re here to help
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-gray-800">
            <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
              Send us a Message
            </h2>
            
            {submitted ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-800">Message Sent!</p>
                    <p className="text-green-700 text-sm mt-1">
                      Thank you for contacting us. We&apos;ll get back to you soon.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-800">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ 
                      focusRing: `2px solid ${config.primaryColor || '#3b82f6'}`,
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = config.primaryColor || '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-800">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    onFocus={(e) => e.target.style.borderColor = config.primaryColor || '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-800">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    onFocus={(e) => e.target.style.borderColor = config.primaryColor || '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2 text-gray-800">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    onFocus={(e) => e.target.style.borderColor = config.primaryColor || '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    <option value="">Select a subject</option>
                    <option value="event_registration">Event Registration</option>
                    <option value="general_inquiry">General Inquiry</option>
                    <option value="technical_support">Technical Support</option>
                    <option value="sponsorship">Sponsorship Opportunities</option>
                    <option value="media">Media Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-800">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                    onFocus={(e) => e.target.style.borderColor = config.primaryColor || '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-gray-800">
              <h2 className="text-3xl font-bold mb-6" style={{ color: config.primaryColor || '#3b82f6' }}>
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                {config.socials?.email && (
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${config.primaryColor || '#3b82f6'}20` }}
                    >
                      <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: config.primaryColor || '#3b82f6' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">
                        Email
                      </h3>
                      <a 
                        href={`mailto:${config.socials.email}`} 
                        className="text-gray-600 hover:underline"
                      >
                        {config.socials.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {config.socials?.phone && (
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${config.primaryColor || '#3b82f6'}20` }}
                    >
                      <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: config.primaryColor || '#3b82f6' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">
                        Phone
                      </h3>
                      <a 
                        href={`tel:${config.socials.phone}`} 
                        className="text-gray-600 hover:underline"
                      >
                        {config.socials.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Location */}
                {config.socials?.location && (
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${config.primaryColor || '#3b82f6'}20` }}
                    >
                      <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: config.primaryColor || '#3b82f6' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-800">
                        Location
                      </h3>
                      <p className="text-gray-600">
                        {config.socials.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4 text-gray-800">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    {config.socials?.facebook && (
                      <a
                        href={config.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: `${config.primaryColor || '#3b82f6'}20` }}
                        aria-label="Facebook"
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: config.primaryColor || '#3b82f6' }}
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    {config.socials?.instagram && (
                      <a
                        href={config.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: `${config.primaryColor || '#3b82f6'}20` }}
                        aria-label="Instagram"
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: config.primaryColor || '#3b82f6' }}
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-gray-800">
              <h2 className="text-2xl font-bold mb-4" style={{ color: config.primaryColor || '#3b82f6' }}>
                Office Hours
              </h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-semibold">Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sunday</span>
                  <span>Closed</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-500">
                    Response time: Within 24-48 hours on business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 font-semibold hover:underline transition-colors text-lg"
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
  );
}

