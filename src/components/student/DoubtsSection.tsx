/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * DoubtsSection — Doubt submission form + FAQ accordion.
 * Extracted from StudentDashboardContent (StudentDashboard.tsx).
 */

import React from 'react';
import { ChevronDown, CheckCircle2, Send } from 'lucide-react';
import { CARD, INPUT, MICRO, PRIMARY_BTN, FIELD_LABEL } from '../ui/tokens';
import { FileUpload } from '../FileUpload';
import type { DoubtsSectionProps } from './types';

export function DoubtsSection({
  currentExamInfo,
  faqs,
  doubtForm, setDoubtForm,
  doubtFile, setDoubtFile,
  doubtSubmitted,
  doubtSubmitting,
  handleDoubtSubmit,
  expandedFaqId, setExpandedFaqId,
}: DoubtsSectionProps) {
  return (
    <div>
      <div className="mt-4 mb-8">
        <p className={MICRO}>{currentExamInfo?.title} · Doubt clarification</p>
        <h2 className="dash-serif mt-1 text-2xl font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Ask a doubt</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Doubt form */}
        <div className="lg:col-span-7">
          <div className={`${CARD} p-6`}>
            <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Submit an academic doubt</h3>
            <p className="mt-1 text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">
              Explain your concept difficulty or problem blocker. Prof. Ajesh Joe will review it and provide step-by-step guidance.
            </p>

            {doubtSubmitted && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#E7D7AE] bg-[#F7EFD9] dark:bg-[#362A0D] dark:bg-[#362A0D] px-4 py-3 text-sm text-[#8A6A16]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>Doubt submitted. The professor will review it and post a step-by-step response.</span>
              </div>
            )}

            <form onSubmit={handleDoubtSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={FIELD_LABEL}>Your name</span>
                  <input type="text" required value={doubtForm.name} onChange={(e) => setDoubtForm({ ...doubtForm, name: e.target.value })} className={INPUT} placeholder="e.g. Siddharth" />
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Your email</span>
                  <input type="email" required value={doubtForm.email} onChange={(e) => setDoubtForm({ ...doubtForm, email: e.target.value })} className={INPUT} placeholder="e.g. sid@mail.com" />
                </label>
              </div>

              <label className="block">
                <span className={FIELD_LABEL}>Subject &amp; topic (or chapter)</span>
                <input type="text" required value={doubtForm.subject} onChange={(e) => setDoubtForm({ ...doubtForm, subject: e.target.value })} className={INPUT} placeholder={`e.g. ${currentExamInfo?.title || 'Chemistry'} — Rotational Dynamics`} />
              </label>

              <label className="block">
                <span className={FIELD_LABEL}>Your question details</span>
                <textarea required rows={4} value={doubtForm.question} onChange={(e) => setDoubtForm({ ...doubtForm, question: e.target.value })} className={INPUT} placeholder="State the numerical problem or concept blocker clearly…" />
              </label>

              <div>
                <span className={FIELD_LABEL}>Attachment (optional)</span>
                <FileUpload
                  value={doubtFile}
                  onFileSelect={setDoubtFile}
                  accept="image/*,.pdf"
                  placeholder="Click or drag an image / PDF to attach"
                />
              </div>

              <button type="submit" disabled={doubtSubmitting} className={`${PRIMARY_BTN} w-full`} id="student-doubt-submit-btn">
                <Send size={13} /> {doubtSubmitting ? 'Submitting…' : 'Submit academic doubt'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="lg:col-span-5">
          <h3 className="dash-serif text-lg font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">Frequently asked questions</h3>
          <p className="mt-1 text-xs text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91]">Quick references on downloads, syllabus revisions and response timelines.</p>
          <div className="mt-5 space-y-2.5">
            {faqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className="overflow-hidden rounded-xl border border-[#EAE1D2] dark:border-[#4A433E] dark:border-[#4A433E] bg-white dark:bg-[#22201F] dark:bg-[#22201F]">
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] transition-colors hover:bg-[#FBF7F0] dark:bg-[#2A2726] dark:hover:bg-[#2A2726] dark:hover:bg-[#2A2726]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={16} className={`shrink-0 text-[#8A7E6F] dark:text-[#A89F91] dark:text-[#A89F91] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#F2ECDF] dark:border-[#383330] dark:border-[#383330] px-4 py-3.5 text-sm leading-relaxed text-[#5A534B] dark:text-[#C7BCAD] dark:text-[#C7BCAD]">{faq.answer}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
