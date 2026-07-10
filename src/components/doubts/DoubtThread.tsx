import React, { useState } from 'react';
import { CheckCircle2, Clock, Edit2, Trash2, Copy, Download, FileText, ArrowRight, CornerDownRight } from 'lucide-react';
import { Doubt } from '../../types';
import { ClickableImage, type LightboxImage } from '../ImageLightbox';

interface DoubtThreadProps {
  doubt: Doubt;
  onReply?: (doubtId: string) => void;
  onDeleteDoubt?: (doubtId: string) => void;
  openLightbox?: (images: LightboxImage[], index: number) => void;
  isProfessorView?: boolean;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function DoubtThread({ doubt, onReply, onDeleteDoubt, openLightbox, isProfessorView }: DoubtThreadProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copying, setCopying] = useState(false);

  const handleCopyLink = () => {
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const fadeUp = "animate-[fadeInUp_0.4s_ease-out_forwards]";

  return (
    <article className={`relative mb-12 w-full mx-auto max-w-[1000px] overflow-hidden rounded-3xl bg-white dark:bg-[#22201F] p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#F2ECDF] dark:border-[#383330] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.05)] ${fadeUp}`}>
      
      {/* ───────────────────────────────────────────────────────── */}
      {/* META & TAGS */}
      {/* ───────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Tag */}
            <span className="flex h-[24px] items-center rounded-full bg-[#EFE7D8] px-[10px] text-[11px] font-semibold uppercase tracking-widest text-[#5A534B] dark:text-[#C7BCAD]">
              JEE Advanced
            </span>
            {/* Secondary Tag */}
            <span className="flex h-[24px] items-center rounded-full border border-[#EAE1D2] dark:border-[#4A433E] bg-[#FBF9F6] px-[10px] text-[11px] font-medium uppercase tracking-widest text-[#8A7E6F] dark:text-[#A89F91]">
              {doubt.subject}
            </span>
          </div>

          {/* Status Badge */}
          {!doubt.isAnswered ? (
            <span className="flex h-[22px] items-center gap-1.5 rounded-full bg-[#F4E4E4] px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#4A0E1B]">
              <Clock size={10} /> Awaiting Reply
            </span>
          ) : (
            <span className="flex h-[22px] items-center gap-1 rounded-full bg-[#E8F3EA]/50 border border-[#1E7B35]/10 px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#1E7B35]">
              <CheckCircle2 size={10} /> Answered
            </span>
          )}
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* TITLE & STUDENT INFO */}
        {/* ───────────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold leading-[1.2] text-[#111]">
            {doubt.question.length > 90 ? doubt.question.substring(0, 90) + '...' : doubt.question}
          </h1>
          
          <div className="mt-4 flex items-center gap-2 text-[13px] text-[#8A7E6F] dark:text-[#A89F91]">
            <span className="font-semibold text-[#5A534B] dark:text-[#C7BCAD]">{doubt.name}</span>
            <span>·</span>
            <span>{fmtDate(doubt.createdAt)}</span>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────── */}
      {/* QUESTION BODY */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="text-[18px] leading-[1.8] text-[#333] whitespace-pre-wrap font-medium">
          {doubt.question}
        </p>

        {/* Attachments */}
        {doubt.attachmentDataUrl && (
          <div className="mt-8">
            {doubt.attachmentDataUrl.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(doubt.attachmentName || '') ? (
              <div className="group relative overflow-hidden rounded-2xl inline-block max-w-full">
                <ClickableImage
                  src={doubt.attachmentDataUrl}
                  alt={doubt.attachmentName || 'Attachment'}
                  className="max-h-[450px] w-auto object-contain transition-transform duration-700 group-hover:scale-[1.02] cursor-zoom-in"
                  onLightboxOpen={openLightbox ? () => openLightbox([{src: doubt.attachmentDataUrl!}], 0) : undefined}
                />
              </div>
            ) : (
              <a href={doubt.attachmentDataUrl} download={doubt.attachmentName} className="group inline-flex items-center gap-4 rounded-2xl border border-[#F2ECDF] dark:border-[#383330] bg-white dark:bg-[#22201F] px-5 py-4 transition-all hover:border-[#EAE1D2] dark:border-[#4A433E] dark:hover:border-[#4A433E] hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBF9F6] text-[#8A6A16] group-hover:bg-[#F7F3EC] dark:bg-[#1A1817] transition-colors">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] truncate max-w-[300px]">{doubt.attachmentName}</span>
                  <span className="text-[11px] font-medium text-[#8A7E6F] dark:text-[#A89F91] uppercase tracking-wider mt-0.5">Attached Document</span>
                </div>
                <Download size={16} className="ml-4 text-[#A79A88] group-hover:text-[#8A6A16] transition-colors" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* PROFESSOR ANSWER SECTION */}
      {/* ───────────────────────────────────────────────────────── */}
      {((doubt.replies && doubt.replies.length > 0) || doubt.answerText) && (
        <div className="pt-2">
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-2 text-[14px] font-semibold text-[#8A6A16] hover:text-[#4A0E1B] transition-colors mb-6"
          >
            {isExpanded ? 'Hide Professor\'s Answer' : 'Read Professor\'s Answer'}
            <ArrowRight size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
          </button>

          <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="relative rounded-3xl bg-[#FBF9F6] p-8 sm:p-10 shadow-[inset_0_1px_4px_rgba(0,0,0,0.01)] border border-[#F2ECDF] dark:border-[#383330]/50 mt-2 mb-2">
                
                {/* Burgundy Accent Line */}
                <div className="absolute left-0 top-10 bottom-10 w-1 rounded-r-full bg-[#4A0E1B]/80"></div>

                {/* Answer Header */}
                <div className="flex items-start justify-between mb-8 pl-4">
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C9A13B] text-lg font-bold text-white shadow-sm">
                      AJ
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-[#8A7E6F] dark:text-[#A89F91] mb-1">👨‍🏫 Professor Answer</div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[17px] font-bold text-[#111]">Prof. Ajesh Joe</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3EA] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1E7B35]">
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      </div>
                      <span className="text-[13px] text-[#8A7E6F] dark:text-[#A89F91]">Department of {doubt.subject}</span>
                    </div>
                  </div>
                  
                  {isProfessorView && (
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-2 text-[#A79A88] hover:bg-white dark:bg-[#22201F] hover:text-[#111] transition-all" title="Edit"><Edit2 size={15} /></button>
                      {onDeleteDoubt && (
                        <button onClick={() => onDeleteDoubt(doubt.id)} className="rounded-lg p-2 text-[#A79A88] hover:bg-[#F4E4E4] hover:text-[#B23B2E] transition-all" title="Delete"><Trash2 size={15} /></button>
                      )}
                    </div>
                  )}
                </div>

                {/* Answer Content */}
                <div className="pl-4 space-y-10">
                  {doubt.replies && doubt.replies.length > 0 ? (
                    doubt.replies.map((reply, index) => (
                      <div key={reply.id} className="relative">
                        
                        <div 
                          className="prose prose-lg max-w-none text-[18px] leading-[1.8] text-[#222] prose-p:my-4 prose-a:text-[#4A0E1B] prose-a:font-semibold prose-strong:text-[#111]"
                          dangerouslySetInnerHTML={{ __html: reply.reply_text || '' }} 
                        />

                        {/* Attachments */}
                        {(reply.image_urls?.length || reply.video_urls?.length || reply.audio_urls?.length || reply.attachment_urls?.length) ? (
                          <div className="mt-10 flex flex-col gap-8">
                            {/* Images */}
                            {reply.image_urls && reply.image_urls.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {reply.image_urls.map((url, i) => (
                                  <div key={i} className="group/img relative overflow-hidden rounded-2xl bg-white dark:bg-[#22201F] shadow-sm border border-[#EAE1D2] dark:border-[#4A433E]">
                                    <ClickableImage
                                      src={url}
                                      alt={`Reply image ${i+1}`}
                                      className="h-[300px] w-full object-cover transition-transform duration-700 group-hover/img:scale-[1.02] cursor-zoom-in"
                                      lightboxImages={reply.image_urls!.map(u => ({src: u}))}
                                      lightboxIndex={i}
                                      onLightboxOpen={openLightbox}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Videos */}
                            {reply.video_urls && reply.video_urls.length > 0 && (
                              <div className="grid grid-cols-1 gap-6">
                                {reply.video_urls.map((url, i) => (
                                  <div key={i} className="relative overflow-hidden rounded-2xl border border-[#EAE1D2] dark:border-[#4A433E] bg-black shadow-sm">
                                    <video src={url} controls className="max-h-[500px] w-full" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Audio */}
                            {reply.audio_urls && reply.audio_urls.length > 0 && (
                              <div className="flex flex-col gap-4">
                                {reply.audio_urls.map((url, i) => (
                                  <div key={i} className="flex items-center rounded-2xl bg-white dark:bg-[#22201F] px-5 py-3 border border-[#EAE1D2] dark:border-[#4A433E] shadow-sm max-w-md">
                                    <audio src={url} controls className="w-full h-10" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Docs */}
                            {reply.attachment_urls && reply.attachment_urls.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {reply.attachment_urls.map((url, i) => (
                                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-4 rounded-2xl border border-[#EAE1D2] dark:border-[#4A433E] bg-white dark:bg-[#22201F] px-5 py-4 transition-all hover:border-[#C9A13B] hover:shadow-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBF9F6] text-[#8A6A16] group-hover:bg-[#F7F3EC] dark:bg-[#1A1817] transition-colors">
                                      <FileText size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold text-[#111]">Reference Document</span>
                                      <span className="text-[11px] font-medium text-[#8A7E6F] dark:text-[#A89F91] uppercase tracking-wider mt-0.5">PDF Download</span>
                                    </div>
                                    <Download size={16} className="ml-auto text-[#A79A88] group-hover:text-[#8A6A16] transition-colors" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : doubt.answerText ? (
                    <div className="text-[18px] leading-[1.8] text-[#222]">
                      {doubt.answerText}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* FOOTER */}
      {/* ───────────────────────────────────────────────────────── */}
      <footer className="mt-6 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCopyLink}
            className="group flex items-center gap-2 text-[13px] font-semibold text-[#8A7E6F] dark:text-[#A89F91] hover:text-[#111] transition-colors"
          >
            <Copy size={14} className="group-hover:text-[#8A6A16] transition-colors" /> 
            {copying ? 'Copied!' : 'Copy Link'}
          </button>
          
          {isProfessorView && onReply && (
            <>
              <span className="text-[#EAE1D2]">|</span>
              <button 
                onClick={() => onReply(doubt.id)}
                className="group flex items-center gap-2 text-[13px] font-semibold text-[#8A7E6F] dark:text-[#A89F91] hover:text-[#4A0E1B] transition-colors"
              >
                <CornerDownRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> 
                Add Note
              </button>
            </>
          )}
        </div>
      </footer>

    </article>
  );
}
