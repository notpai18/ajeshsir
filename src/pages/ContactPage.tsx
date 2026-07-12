import React, { useState } from 'react';
import { CheckCircle, Send, MessageSquare, GraduationCap, LifeBuoy, Sparkles } from 'lucide-react';

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
    
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };
  return (
    <section className="relative bg-[#F7F3EC] dark:bg-[#1A1817] pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4A0E1B]/5 dark:bg-[#4A0E1B]/20 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A13B]/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
        


        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-stretch">
          
          {/* Left Column - Purpose (Maroon) */}
          <div className="lg:col-span-5 h-full">
            <div className="bg-[#4A0E1B] rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_rgba(34,32,31,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden h-full border border-[#7C2532]/30 flex flex-col justify-between">
              
              {/* Internal Gradient/Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8CD82]/10 blur-[40px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#2D0710] blur-[40px] rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#F7F3EC] leading-tight mb-12">
                  Have a question? <br/>
                  <span className="text-[#E8CD82] italic font-serif">Let's get in touch.</span>
                </h2>
                
                <div className="space-y-8">
                  <div className="flex flex-col space-y-1.5 group">
                    <span className="flex items-center space-x-2 text-[#E8CD82] mb-1">
                      <span className="text-xl">🎓</span>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E8CD82]/80">Academic Guidance</span>
                    </span>
                    <p className="text-[13px] text-[#F7F3EC]/80 pl-[34px] leading-relaxed">For students stuck on complex chemistry concepts or numerical problems who need step-by-step clarity.</p>
                  </div>

                  <div className="flex flex-col space-y-1.5 group">
                    <span className="flex items-center space-x-2 text-[#E8CD82] mb-1">
                      <span className="text-xl">🛟</span>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E8CD82]/80">Technical Support</span>
                    </span>
                    <p className="text-[13px] text-[#F7F3EC]/80 pl-[34px] leading-relaxed">For issues related to downloading study materials or streaming video lectures.</p>
                  </div>

                  <div className="flex flex-col space-y-1.5 group">
                    <span className="flex items-center space-x-2 text-[#E8CD82] mb-1">
                      <span className="text-xl">✨</span>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E8CD82]/80">General Inquiry</span>
                    </span>
                    <p className="text-[13px] text-[#F7F3EC]/80 pl-[34px] leading-relaxed">For platform feedback, curriculum requests, or non-academic questions.</p>
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Right Column - Form (Light Cream/White in light mode, Charcoal in dark mode) */}
          <div className="lg:col-span-7 h-full">
            <div className="bg-white dark:bg-[#252321] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-2xl border border-[#22201F]/20 dark:border-white/5 relative h-full flex flex-col justify-center transition-colors duration-300">
              
              <div className="mb-8">
                <h3 className="text-xl font-sans font-bold text-[#22201F] dark:text-[#F7F3EC] mb-2">Send a Direct Message</h3>
                <p className="text-sm text-[#8A7E6F] dark:text-[#A89F91]">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              {submitted && (
                <div className="mb-8 flex items-start space-x-3 bg-[#4A0E1B]/10 dark:bg-[#4A0E1B]/20 border border-[#4A0E1B]/30 dark:border-[#4A0E1B]/50 p-4 rounded-2xl animate-[fadeIn_0.3s_ease-out]">
                  <CheckCircle size={20} className="text-[#4A0E1B] dark:text-[#E8CD82] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#22201F] dark:text-[#F7F3EC]">
                    <strong className="block text-[#4A0E1B] dark:text-[#E8CD82] mb-0.5">Message Sent!</strong>
                    Your inquiry has been successfully forwarded to the office.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label htmlFor="name" className="block text-[11px] font-extrabold text-[#8A7E6F] dark:text-[#A89F91] uppercase tracking-[0.15em] ml-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FBF7F0] dark:bg-[#1A1817] border border-[#22201F]/20 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#22201F] dark:text-[#F7F3EC] outline-none focus:border-[#4A0E1B] focus:ring-2 focus:ring-[#4A0E1B]/10 dark:focus:ring-[#4A0E1B]/50 transition-all placeholder:text-[#8A7E6F]/70 dark:placeholder:text-[#F7F3EC]/50 shadow-inner"
                      placeholder="e.g. Rahul Gupta"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="email" className="block text-[11px] font-extrabold text-[#8A7E6F] dark:text-[#A89F91] uppercase tracking-[0.15em] ml-1">Academic Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FBF7F0] dark:bg-[#1A1817] border border-[#22201F]/20 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#22201F] dark:text-[#F7F3EC] outline-none focus:border-[#4A0E1B] focus:ring-2 focus:ring-[#4A0E1B]/10 dark:focus:ring-[#4A0E1B]/50 transition-all placeholder:text-[#8A7E6F]/70 dark:placeholder:text-[#F7F3EC]/50 shadow-inner"
                      placeholder="e.g. rahul@student.in"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label htmlFor="subject" className="block text-[11px] font-extrabold text-[#8A7E6F] dark:text-[#A89F91] uppercase tracking-[0.15em] ml-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FBF7F0] dark:bg-[#1A1817] border border-[#22201F]/20 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#22201F] dark:text-[#F7F3EC] outline-none focus:border-[#4A0E1B] focus:ring-2 focus:ring-[#4A0E1B]/10 dark:focus:ring-[#4A0E1B]/50 transition-all placeholder:text-[#8A7E6F]/50 dark:placeholder:text-[#F7F3EC]/20 shadow-inner"
                    placeholder="e.g. Syllabus doubt in Organic Chemistry"
                  />
                </div>

                <div className="space-y-2.5">
                  <label htmlFor="message" className="block text-[11px] font-extrabold text-[#8A7E6F] dark:text-[#A89F91] uppercase tracking-[0.15em] ml-1">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FBF7F0] dark:bg-[#1A1817] border border-[#22201F]/20 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#22201F] dark:text-[#F7F3EC] outline-none focus:border-[#4A0E1B] focus:ring-2 focus:ring-[#4A0E1B]/10 dark:focus:ring-[#4A0E1B]/50 transition-all placeholder:text-[#8A7E6F]/70 dark:placeholder:text-[#F7F3EC]/50 resize-none shadow-inner"
                    placeholder="How can we help you today?"
                  />
                </div>

                <button
                  type="submit"
                  className="group flex items-center justify-center space-x-2 w-full bg-[#4A0E1B] hover:bg-[#7C2532] dark:bg-[#E8CD82] dark:hover:bg-[#D9C2A2] text-white dark:text-[#2D0710] py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_4px_15px_rgba(34,32,31,0.15)] dark:shadow-[0_4px_20px_rgba(232,205,130,0.15)] hover:-translate-y-0.5 mt-2"
                >
                  <span>Send Message</span>
                  <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
