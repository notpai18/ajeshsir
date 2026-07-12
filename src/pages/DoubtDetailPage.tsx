import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, FileText } from 'lucide-react';
import { usePortalData } from '../context/PortalDataContext';
import { useImageViewer } from '../components/image-viewer';
import { DoubtStatusBadge } from '../components/doubts/DoubtStatusBadge';
import { AttachmentViewer } from '../components/ui/AttachmentViewer';
import { formatRelativeTime } from '../lib/formatRelativeTime';
import type { Doubt, DoubtStatus } from '../types';

interface DoubtDetailPageProps {
  userRole: 'student' | 'professor' | null;
}

function deriveStatus(doubt: Doubt): DoubtStatus {
  if (doubt.status) return doubt.status;
  return doubt.isAnswered ? 'answered' : 'submitted';
}

function sanitizeHtml(html: string) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
}

export default function DoubtDetailPage({ userRole }: DoubtDetailPageProps) {
  const { doubtId } = useParams();
  const navigate = useNavigate();
  const { doubts, loading } = usePortalData();
  const { openViewer } = useImageViewer();

  const doubt = useMemo(() => doubts.find(d => d.id === doubtId), [doubts, doubtId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [doubtId]);

  if (!userRole) {
    return <Navigate to="/selection" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F2EA] dark:bg-[#1A1817]">
        <div className="w-12 h-12 border-4 border-[#4A0E1B] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F2EA] dark:bg-[#1A1817] p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#F6F2EA]">Doubt Not Found</h2>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#4A0E1B] text-white rounded-lg font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const status = deriveStatus(doubt);

  // Derive clean title and description from data model
  let displayTitle = doubt.topic || stripHtml(doubt.question) || doubt.subject;
  let displayDescriptionHtml = doubt.question || '';

  // Handle the case where the title was prepended to the question HTML by AskDoubtModal
  if (doubt.topic && doubt.question) {
    const prefix1 = `<strong>${doubt.topic}</strong><br/>`;
    const prefix2 = `<strong>${doubt.topic}</strong>`;
    
    if (doubt.question.startsWith(prefix1)) {
      displayDescriptionHtml = doubt.question.substring(prefix1.length);
      displayTitle = doubt.topic;
    } else if (doubt.question.startsWith(prefix2)) {
      displayDescriptionHtml = doubt.question.substring(prefix2.length);
      displayTitle = doubt.topic;
    }
  }

  const plainTitle = stripHtml(displayTitle).trim();
  const plainDescription = stripHtml(displayDescriptionHtml).trim();

  // If the description is identical to the title (or empty), hide the body
  const hideQuestionBody = plainTitle === plainDescription || !plainDescription;

  // Build replies list with properly mapped authors to find the main professor answer
  const mappedReplies = [
    ...(doubt.answerText ? [{
      id: 'legacy-answer',
      authorName: userRole === 'professor' ? 'You' : 'Professor',
      authorRole: 'professor' as const,
      message: doubt.answerText,
      createdAt: doubt.createdAt,
      imageUrls: [] as string[]
    }] : []),
    ...(doubt.replies || []).map(r => ({
      id: r.id,
      authorName: r.professor_id === 'student' ? doubt.name : (userRole === 'professor' ? 'You' : 'Professor'),
      authorRole: (r.professor_id === 'student' ? 'student' : 'professor') as 'student' | 'professor',
      message: r.reply_text || '',
      imageUrls: r.image_urls || [],
      videoUrls: r.video_urls || [],
      audioUrls: r.audio_urls || [],
      attachmentUrls: r.attachment_urls || [],
      createdAt: r.created_at
    }))
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const mainAnswer = mappedReplies.find(r => r.authorRole === 'professor');
  const attachmentUrl = doubt.attachmentDataUrl || doubt.attachmentUrl;

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1817] pt-12 pb-24 text-[#22201F] dark:text-[#F6F2EA] relative overflow-hidden">
      {/* Background watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 l15 25 l-15 25 l-15 -25 z' stroke='%23000' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      />

      <div className="relative max-w-[950px] mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <div className="mb-6 animate-[fadeIn_0.4s_ease-out_forwards]">
          <button 
            onClick={() => navigate(-1)} 
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white dark:bg-[#2A2726]/50 dark:hover:bg-[#2A2726] shadow-sm hover:shadow transition-all text-[14px] font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-[#F6F2EA]"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Doubts
          </button>
        </div>

        {/* Question Hero Card */}
        <div className="bg-white dark:bg-[#22201F] rounded-[28px] p-[30px] sm:p-[40px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)] mb-10 animate-[fadeInUp_0.5s_ease-out_forwards]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] font-bold uppercase tracking-wider border border-gray-100 dark:border-gray-700">{doubt.subject}</span>
            </div>
            <DoubtStatusBadge status={status} />
          </div>

          <h1 className="text-[32px] sm:text-[42px] font-bold text-gray-900 dark:text-[#F6F2EA] leading-[1.2] tracking-tight mb-6">
            {displayTitle}
          </h1>

          <div className="flex items-center gap-2 text-[14px] text-gray-500 dark:text-gray-400 font-medium">
            <span>Asked by <strong className="text-gray-800 dark:text-gray-200">{doubt.name}</strong></span>
            <span>&middot;</span>
            <span>{formatRelativeTime(doubt.createdAt)}</span>
          </div>

          {/* Question Body and Attachments */}
          {(!hideQuestionBody || attachmentUrl) && (
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              {!hideQuestionBody && (
                <div 
                  className={`text-[18px] text-gray-800 dark:text-gray-300 leading-[1.8] font-serif [&_p]:mb-4 last:[&_p]:mb-0 ${attachmentUrl ? 'mb-8' : ''}`}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayDescriptionHtml) }}
                />
              )}
              
              {/* Attachments */}
              {attachmentUrl && (
                <AttachmentViewer
                  attachments={[{ url: attachmentUrl, name: doubt.attachmentName || 'Attachment' }]}
                  containerClassName="mt-0"
                />
              )}
            </div>
          )}
        </div>

        {/* Professor Answer */}
        {mainAnswer && (
          <div className="animate-[fadeInUp_0.7s_ease-out_forwards]" style={{ animationDelay: '100ms' }}>
            <div className="px-2 sm:px-10 mb-4 flex items-center gap-2">
              <BadgeCheck className="text-green-500" size={24} />
              <h2 className="text-[22px] font-bold text-gray-900 dark:text-[#F6F2EA]">
                Verified Professor Answer
              </h2>
            </div>
            
            <div className="bg-white dark:bg-[#22201F] border border-gray-100 dark:border-gray-800 rounded-[28px] p-[30px] sm:p-[40px] shadow-[0_16px_48px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A0E1B] to-[#7C2532] text-white flex items-center justify-center font-bold text-[18px] shadow-sm shrink-0">
                  P
                </div>
                <div>
                  <div className="text-[16px] font-bold text-gray-900 dark:text-[#F6F2EA]">{mainAnswer.authorName}</div>
                  <div className="text-[13px] text-gray-500 dark:text-gray-400">{formatRelativeTime(mainAnswer.createdAt)}</div>
                </div>
              </div>

              <div 
                className="text-[18px] text-gray-800 dark:text-gray-300 leading-[1.8] font-serif [&_p]:mb-4 last:[&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(mainAnswer.message) }}
              />

              {(mainAnswer.imageUrls?.length > 0 || mainAnswer.videoUrls?.length > 0 || mainAnswer.audioUrls?.length > 0 || mainAnswer.attachmentUrls?.length > 0) && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <AttachmentViewer
                    attachments={[
                      ...(mainAnswer.imageUrls || []).map(url => ({ url, type: 'image' as const })),
                      ...(mainAnswer.videoUrls || []).map(url => ({ url, type: 'video' as const })),
                      ...(mainAnswer.audioUrls || []).map(url => ({ url, type: 'audio' as const })),
                      ...(mainAnswer.attachmentUrls || []).map(url => ({ url }))
                    ]}
                    containerClassName="mt-0"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
