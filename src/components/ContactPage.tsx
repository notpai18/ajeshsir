/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Clock, Building, MapPin, CheckCircle } from 'lucide-react';

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
    <section className="bg-[#F5F5F7] py-16 md:py-20 text-[#1D1D1F]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-[#1D1D1F]">
            Contact Office
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#86868B]">
            Reach out to the department office for academic questions, curriculum queries, or technical issues with the PDF downloads.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          
          {/* Information Block */}
          <div className="space-y-6 md:col-span-5">
            <h3 className="text-lg font-display font-bold text-[#1D1D1F]">
              Faculty Directory
            </h3>

            <div className="border-2 border-[#E5E5EA] bg-[#FFFFFF] p-6 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
              <div className="space-y-5">
                
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#0071E3]">
                    <Building size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">Department</h4>
                    <p className="text-xs font-bold text-[#1D1D1F] mt-1">
                      Department of Chemistry
                    </p>
                    <p className="text-[10px] text-[#86868B] mt-0.5">
                      Science Block II, Main Campus
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#0071E3]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">Office Location</h4>
                    <p className="text-xs font-bold text-[#1D1D1F] mt-1">
                      Room 402-B, 4th Floor
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#0071E3]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">Academic Email</h4>
                    <p className="text-xs font-bold text-[#1D1D1F] mt-1 select-all">
                      ajesh.joe@university.edu
                    </p>
                    <p className="text-[10px] text-[#86868B] mt-0.5">
                      Replies are sent during standard academic days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-[#0071E3]">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-[#86868B]">Office Hours</h4>
                    <p className="text-xs font-bold text-[#1D1D1F] mt-1">
                      Mondays & Wednesdays: 2:00 PM – 4:00 PM
                    </p>
                    <p className="text-xs text-[#86868B] mt-0.5">
                      Fridays: 10:00 AM – 12:00 PM (By appointment)
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Note about commercial correspondence */}
            <div className="border-l-4 border-[#5B0E14] bg-[#FFFFFF] p-4 shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]">
              <p className="text-[11px] leading-relaxed text-[#86868B]">
                <strong className="text-[#1D1D1F]">Please Note:</strong> This office does not accept commercial marketing pitches, EdTech partnership proposals, or coaching institute sponsorships. All educational content here is strictly non-commercial.
              </p>
            </div>
          </div>

          {/* Contact Form Block */}
          <div className="md:col-span-7">
            <div className="border-2 border-[#E5E5EA] bg-[#FFFFFF] p-8 shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]">
              
              <h3 className="text-lg font-display font-bold text-[#1D1D1F] mb-6">
                Send a Message
              </h3>

              {submitted && (
                <div className="mb-6 flex items-center space-x-2.5 bg-[#0071E3] px-4 py-3 text-xs text-white border-2 border-[#005bb5]">
                  <CheckCircle size={16} className="text-[#0071E3]" />
                  <span>Your message has been sent successfully. We will respond within 48 business hours.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label htmlFor="name" className="block text-[9px] font-black text-[#86868B] uppercase tracking-[0.2em]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 block w-full border-2 border-[#E5E5EA] bg-[#F5F5F7] px-3.5 py-3 text-sm text-[#1D1D1F] transition focus:border-gray-500 focus:outline-none"
                    placeholder="e.g. Rahul Gupta"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[9px] font-black text-[#86868B] uppercase tracking-[0.2em]">
                    Academic Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 block w-full border-2 border-[#E5E5EA] bg-[#F5F5F7] px-3.5 py-3 text-sm text-[#1D1D1F] transition focus:border-gray-500 focus:outline-none"
                    placeholder="e.g. rahul@student.in"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[9px] font-black text-[#86868B] uppercase tracking-[0.2em]">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-2 block w-full border-2 border-[#E5E5EA] bg-[#F5F5F7] px-3.5 py-3 text-sm text-[#1D1D1F] transition focus:border-gray-500 focus:outline-none"
                    placeholder="e.g. Syllabus doubt in JEE Main"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[9px] font-black text-[#86868B] uppercase tracking-[0.2em]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 block w-full border-2 border-[#E5E5EA] bg-[#F5F5F7] px-3.5 py-3 text-sm text-[#1D1D1F] transition focus:border-gray-500 focus:outline-none resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#0071E3] py-3.5 text-center text-[10px] font-black uppercase tracking-wider text-white border-2 border-[#005bb5] shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] active:shadow-[inset_0_0px_0_rgba(0,0,0,0.5)] active:translate-y-1 transition-all"
                    id="contact-submit-btn"
                  >
                    Send Message
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
