/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Clock, Building, MapPin, CheckCircle } from 'lucide-react';
import { PremiumCard } from './PremiumCard';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API request
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section className="bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] py-16 md:py-20 text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center">
          <h2 className="text-3xl font-serif font-extrabold tracking-tight text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">
            Contact Office
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">
            Reach out to the department office for academic questions, curriculum queries, or technical issues with the PDF downloads.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          
          {/* Information Block */}
          <div className="space-y-6 md:col-span-5">
            <h3 className="text-lg font-serif font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">
              Faculty Directory
            </h3>

            <PremiumCard padding="large" accentLine>
              <div className="space-y-5">
                
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#4A0E1B] dark:text-[#F4E7E5]">
                    <Building size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">Department</h4>
                    <p className="text-xs font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] mt-1">
                      Department of Chemistry
                    </p>
                    <p className="text-[10px] text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 mt-0.5">
                      Science Block II, Main Campus
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#4A0E1B] dark:text-[#F4E7E5]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">Office Location</h4>
                    <p className="text-xs font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] mt-1">
                      Room 402-B, 4th Floor
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#4A0E1B] dark:text-[#F4E7E5]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">Academic Email</h4>
                    <p className="text-xs font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] mt-1 select-all">
                      ajesh.joe@university.edu
                    </p>
                    <p className="text-[10px] text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 mt-0.5">
                      Replies are sent during standard academic days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#4A0E1B] dark:text-[#F4E7E5]">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">Office Hours</h4>
                    <p className="text-xs font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] mt-1">
                      Mondays & Wednesdays: 2:00 PM – 4:00 PM
                    </p>
                    <p className="text-xs text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 mt-0.5">
                      Fridays: 10:00 AM – 12:00 PM (By appointment)
                    </p>
                  </div>
                </div>

              </div>
            </PremiumCard>

            {/* Note about commercial correspondence */}
            <div className="border-l-4 border-[#4A0E1B] bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] p-4 rounded-r-xl border-y border-r border-[#D9C2A2]/30 shadow-soft-sm">
              <p className="text-[11px] leading-relaxed text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60">
                <strong className="text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Please Note:</strong> This office does not accept commercial marketing pitches, EdTech partnership proposals, or coaching institute sponsorships. All educational content here is strictly non-commercial.
              </p>
            </div>
          </div>

          {/* Contact Form Block */}
          <div className="md:col-span-7">
            <PremiumCard padding="large" accentLine>
              
              <h3 className="text-lg font-serif font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] mb-6">
                Send a Message
              </h3>

              {submitted && (
                <div className="mb-6 flex items-center space-x-2.5 bg-[#4A0E1B] px-4 py-3 text-xs text-white border border-[#4A0E1B]/20 rounded-xl animate-fade-in shadow-soft-sm">
                  <CheckCircle size={16} className="text-[#C9A13B]" />
                  <span>Your message has been sent successfully. We will respond within 48 business hours.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label htmlFor="name" className="block text-[9px] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 uppercase tracking-[0.2em]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 block w-full border border-[#D9C2A2]/40 bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] px-3.5 py-3 text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] rounded-input outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/30"
                    placeholder="e.g. Rahul Gupta"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[9px] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 uppercase tracking-[0.2em]">
                    Academic Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 block w-full border border-[#D9C2A2]/40 bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] px-3.5 py-3 text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] rounded-input outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/30"
                    placeholder="e.g. rahul@student.in"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[9px] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 uppercase tracking-[0.2em]">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-2 block w-full border border-[#D9C2A2]/40 bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] px-3.5 py-3 text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] rounded-input outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/30"
                    placeholder="e.g. Syllabus doubt in JEE Main"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[9px] font-bold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/80 uppercase tracking-[0.2em]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 block w-full border border-[#D9C2A2]/40 bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] px-3.5 py-3 text-sm text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] rounded-input outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/30 resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#4A0E1B] hover:bg-[#7C2532] text-white py-3.5 text-center text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_4px_12px_rgba(74,14,27,0.1)] hover:shadow-[0_6px_16px_rgba(74,14,27,0.18)] hover:-translate-y-0.5 duration-200 transition-all border border-transparent"
                    id="contact-submit-btn"
                  >
                    Send Message
                  </button>
                </div>

              </form>

            </PremiumCard>
          </div>

        </div>

      </div>
    </section>
  );
}
