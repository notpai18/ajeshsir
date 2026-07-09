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
    <section className="bg-gray-50/50 py-16 dark:bg-slate-900/50 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Contact Office
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 dark:text-slate-400">
            Reach out to the department office for academic questions, curriculum queries, or technical issues with the PDF downloads.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          
          {/* Information Block */}
          <div className="space-y-6 md:col-span-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Faculty Directory
            </h3>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-5">
                
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-blue-500">
                    <Building size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200">Department</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      Department of Physics & Applied Mathematics
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">
                      Science Block II, Main Campus
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-blue-500">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200">Office Location</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      Room 402-B, 4th Floor
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-blue-500">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200">Academic Email</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 select-all">
                      anand.sen@university.edu
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">
                      Replies are sent during standard academic days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 text-blue-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200">Office Hours</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      Mondays & Wednesdays: 2:00 PM – 4:00 PM
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Fridays: 10:00 AM – 12:00 PM (By appointment)
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Note about commercial correspondence */}
            <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100/50 dark:bg-blue-950/20 dark:border-blue-900/30">
              <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                <strong>Please Note:</strong> This office does not accept commercial marketing pitches, EdTech partnership proposals, or coaching institute sponsorships. All educational content here is strictly non-commercial.
              </p>
            </div>
          </div>

          {/* Contact Form Block */}
          <div className="md:col-span-7">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Send a Message
              </h3>

              {submitted && (
                <div className="mb-6 flex items-center space-x-2.5 rounded-xl bg-green-50 px-4 py-3 text-xs text-green-800 border border-green-150 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900/40">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  <span>Your message has been sent successfully. We will respond within 48 business hours.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3.5 py-2.5 text-sm transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/30 dark:focus:border-blue-400 dark:focus:bg-slate-950"
                    placeholder="e.g. Rahul Gupta"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Academic Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3.5 py-2.5 text-sm transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/30 dark:focus:border-blue-400 dark:focus:bg-slate-950"
                    placeholder="e.g. rahul@student.in"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3.5 py-2.5 text-sm transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/30 dark:focus:border-blue-400 dark:focus:bg-slate-950"
                    placeholder="e.g. Syllabus doubt in JEE Main Wave Optics"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3.5 py-2.5 text-sm transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/30 dark:focus:border-blue-400 dark:focus:bg-slate-950"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gray-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-98 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
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
