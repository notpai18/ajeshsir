import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Image as ImageIcon, Camera, FileText, FileAudio, FileVideo,
  ChevronDown, Send, Trash2, Paperclip
} from 'lucide-react';
import type { Doubt, Note, ExamType } from '../../types';
import { uploadDoubtAttachment } from '../../services/doubtsService';
import { RichTextEditor } from '../ui/RichTextEditor';

const EXAMINATIONS = [
  { id: 'jee-main', label: 'JEE Main' },
  { id: 'jee-advanced', label: 'JEE Advanced' },
  { id: 'neet', label: 'NEET' },
  { id: 'net', label: 'CSIR NET' },
  { id: 'msc-entrance', label: 'M.Sc Entrance' }
];

const SUBJECTS = [
  'Physical Chemistry',
  'Organic Chemistry',
  'Inorganic Chemistry',
  'General Queries'
];

interface AskDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  existingDoubts: Doubt[];
  onSubmit: (doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => Promise<void>;
  onOpenThread?: (doubt: Doubt) => void;
  onSuccess?: () => void;
}

interface AttachmentData {
  file: File;
  previewUrl: string;
  type: 'image' | 'pdf' | 'audio' | 'video';
}

export function AskDoubtModal({
  isOpen,
  onClose,
  notes,
  onSubmit,
  onSuccess
}: AskDoubtModalProps) {
  // Form State
  const [exam, setExam] = useState<ExamType | ''>('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [questionHtml, setQuestionHtml] = useState('');
  
  // Attachments State
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicSuggestionsOpen, setTopicSuggestionsOpen] = useState(false);

  // Hidden File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setExam('');
        setSubject('');
        setTopic('');
        setTitle('');
        setQuestionHtml('');
        setAttachments([]);
        setError(null);
      }, 300);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  // Chapter autocomplete
  const chapters = useMemo(() => {
    const filtered = subject
      ? notes.filter(n => n.subject === subject)
      : notes;
    return [...new Set(filtered.map(n => n.chapter))].sort();
  }, [notes, subject]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      let type: AttachmentData['type'] = 'image';
      if (file.type.includes('pdf')) type = 'pdf';
      else if (file.type.includes('audio')) type = 'audio';
      else if (file.type.includes('video')) type = 'video';

      const previewUrl = URL.createObjectURL(file);
      setAttachments(prev => [...prev, { file, previewUrl, type }]);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAtt = [...prev];
      URL.revokeObjectURL(newAtt[index].previewUrl);
      newAtt.splice(index, 1);
      return newAtt;
    });
  };

  const isFormValid = exam && subject && title && (questionHtml.trim().length > 7 || attachments.length > 0);

  const handleSubmit = async () => {
    if (isSubmitting || !isFormValid) return;
    setIsSubmitting(true);
    setError(null);

    try {
      let attachmentUrl: string | undefined;
      let attachmentName: string | undefined;
      let attachmentDataUrl: string | undefined;

      if (attachments.length > 0) {
        const first = attachments[0];
        try {
          const uploaded = await uploadDoubtAttachment(first.file, 'doubt-images');
          attachmentUrl = uploaded.url;
          attachmentName = uploaded.name;
        } catch {
          attachmentDataUrl = first.previewUrl;
          attachmentName = first.file.name;
        }
      }

      await onSubmit({
        name: 'Student', // Auth context integration placeholder
        email: 'student@portal.in',
        subject,
        topic: title, // Use title as topic to fit DB constraints (may be stripped)
        question: `<strong>${title}</strong><br/>${questionHtml}`,
        attachmentName,
        attachmentUrl,
        attachmentDataUrl,
        status: 'submitted',
      });

      setIsSubmitting(false);
      onClose();
      if (onSuccess) onSuccess();
      
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0"
            style={{ 
              background: 'rgba(18, 18, 18, 0.45)', 
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)'
            }}
            onClick={handleClose}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[720px] max-h-[85vh] bg-white dark:bg-[#1A1817] rounded-[28px] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <h3 className="text-[20px] font-bold text-gray-900 dark:text-[#F6F2EA] flex items-center gap-3">
                <span className="text-xl">🎓</span> Ask a Doubt
              </h3>
              <button
                onClick={handleClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Examination <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={exam} onChange={e => setExam(e.target.value as ExamType)} className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A2726] px-4 py-3 text-[14px] font-medium text-gray-900 dark:text-[#F6F2EA] focus:outline-none focus:border-[#4A0E1B] focus:ring-1 focus:ring-[#4A0E1B] transition-all">
                      <option value="" disabled>Select exam...</option>
                      {EXAMINATIONS.map(ex => <option key={ex.id} value={ex.id}>{ex.label}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Subject <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A2726] px-4 py-3 text-[14px] font-medium text-gray-900 dark:text-[#F6F2EA] focus:outline-none focus:border-[#4A0E1B] focus:ring-1 focus:ring-[#4A0E1B] transition-all">
                      <option value="" disabled>Select subject...</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="relative">
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Chapter / Topic <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => { setTopic(e.target.value); setTopicSuggestionsOpen(true); }}
                    onFocus={() => setTopicSuggestionsOpen(true)}
                    onBlur={() => setTimeout(() => setTopicSuggestionsOpen(false), 200)}
                    placeholder="e.g. Chemical Kinetics"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A2726] px-4 py-3 text-[14px] font-medium text-gray-900 dark:text-[#F6F2EA] focus:outline-none focus:border-[#4A0E1B] focus:ring-1 focus:ring-[#4A0E1B] transition-all"
                  />
                  {topicSuggestionsOpen && chapters.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-[#2A2726] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                      {chapters.filter(c => !topic || c.toLowerCase().includes(topic.toLowerCase())).map(c => (
                        <li key={c} onMouseDown={() => { setTopic(c); setTopicSuggestionsOpen(false); }} className="px-4 py-2.5 text-[14px] text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">{c}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Question Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Briefly summarize your doubt"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A2726] px-4 py-3 text-[14px] font-medium text-gray-900 dark:text-[#F6F2EA] focus:outline-none focus:border-[#4A0E1B] focus:ring-1 focus:ring-[#4A0E1B] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">Detailed Description</label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#4A0E1B] focus-within:ring-1 focus-within:ring-[#4A0E1B] transition-all">
                  <RichTextEditor 
                    content={questionHtml} 
                    onChange={setQuestionHtml} 
                    placeholder="Provide details about what you've tried and where you are stuck..."
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300">Attachments</label>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[13px] font-bold text-[#4A0E1B] dark:text-[#D9C2A2] flex items-center gap-1.5 hover:underline"
                  >
                    <Paperclip size={14} /> Add File
                  </button>
                  <input type="file" multiple ref={fileInputRef} className="hidden" onChange={e => handleFileSelect(e.target.files)} />
                </div>
                
                {attachments.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-[#2A2726] border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 pr-2 max-w-[200px]">
                        <div className="shrink-0 text-gray-400">
                          {att.type === 'image' ? <ImageIcon size={16} /> :
                           att.type === 'pdf' ? <FileText size={16} /> :
                           att.type === 'audio' ? <FileAudio size={16} /> :
                           <FileVideo size={16} />}
                        </div>
                        <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300 truncate flex-1">{att.file.name}</span>
                        <button onClick={() => removeAttachment(i)} className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[13px] text-gray-500 italic">No files attached.</div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50 dark:bg-[#1A1817] shrink-0">
              <button 
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !isFormValid}
                className="px-6 py-2.5 rounded-xl bg-[#4A0E1B] text-white text-[14px] font-bold hover:scale-[1.02] hover:bg-[#7C2532] transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_8px_16px_rgba(74,14,27,0.15)] flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Doubt'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

