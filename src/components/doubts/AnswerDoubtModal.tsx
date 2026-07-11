import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Save, AlertCircle, FileText } from 'lucide-react';
import type { Doubt } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { MultimediaUploader, UploadedFile } from './MultimediaUploader';

interface AnswerDoubtModalProps {
  doubt: Doubt;
  onClose: () => void;
  onPublish: (replyData: {
    reply_text: string;
    image_urls: string[];
    video_urls: string[];
    audio_urls: string[];
    attachment_urls: string[];
  }) => Promise<void>;
}

export function AnswerDoubtModal({ doubt, onClose, onPublish }: AnswerDoubtModalProps) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  const handleUploadComplete = (file: UploadedFile) => {
    setFiles((prev) => [...prev, file]);
  };

  const handleRemoveFile = (url: string) => {
    setFiles((prev) => prev.filter((f) => f.url !== url));
  };

  const handleSaveDraft = () => {
    // In a real app, this might save to local storage or backend draft table
    localStorage.setItem(`draft-reply-${doubt.id}`, JSON.stringify({ content, files }));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handlePublish = async () => {
    if (!content.trim() && files.length === 0) {
      setError('Please provide a reply or attach a file before publishing.');
      return;
    }

    try {
      setIsPublishing(true);
      setError(null);
      
      const image_urls = files.filter(f => f.type === 'image').map(f => f.url);
      const video_urls = files.filter(f => f.type === 'video').map(f => f.url);
      const audio_urls = files.filter(f => f.type === 'audio').map(f => f.url);
      const attachment_urls = files.filter(f => f.type === 'attachment').map(f => f.url);

      await onPublish({
        reply_text: content,
        image_urls,
        video_urls,
        audio_urls,
        attachment_urls
      });
      
      // Clean up draft if exists
      localStorage.removeItem(`draft-reply-${doubt.id}`);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish reply');
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 dash-root">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#F7F3EC] dark:bg-[#1A1817] rounded-[24px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#22201F]/20 bg-white dark:bg-[#22201F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4A0E1B]/10 flex items-center justify-center text-[#4A0E1B] font-semibold dash-serif">
              {doubt.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dash-serif">Reply to Doubt</h3>
              <p className="text-sm text-gray-500">{doubt.subject}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Original Question Card */}
          <div className="bg-white dark:bg-[#22201F] rounded-2xl p-5 border border-[#22201F]/20 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Student's Question</h4>
            <p className="text-gray-800 whitespace-pre-wrap">{doubt.question}</p>
            
            {doubt.attachmentUrl && (
              <a 
                href={doubt.attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-[#F7F3EC] dark:bg-[#1A1817] text-[#4A0E1B] text-sm font-medium hover:bg-[#D9C2A2]/30 transition-colors"
              >
                <FileText className="w-4 h-4" />
                {doubt.attachmentName || 'View Attachment'}
              </a>
            )}
          </div>

          {/* Editor Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Your Reply</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Multimedia Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Attachments (Optional)</label>
            <MultimediaUploader
              files={files}
              onUploadComplete={handleUploadComplete}
              onRemove={handleRemoveFile}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[#22201F]/20 bg-white dark:bg-[#22201F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#4A0E1B] bg-[#4A0E1B]/10 hover:bg-[#4A0E1B]/20 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {draftSaved ? 'Saved!' : 'Save Draft'}
            </button>
          </div>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4A0E1B] hover:bg-[#7C2532] shadow-md shadow-[#4A0E1B]/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isPublishing ? 'Publishing...' : 'Publish Reply'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
