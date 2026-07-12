import React, { useState } from 'react';
import { useImageViewer } from '../image-viewer';
import { PDFViewer } from '../pdf/PDFViewer';
import { FileText, Download, Play, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Attachment {
  url: string;
  name?: string;
  type?: 'image' | 'pdf' | 'video' | 'audio' | 'unknown';
}

function guessAttachmentType(url: string, name?: string): Attachment['type'] {
  const extension = (name || url).split('.').pop()?.split('?')[0]?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) return 'image';
  if (extension === 'pdf') return 'pdf';
  if (['mp4', 'webm', 'ogg'].includes(extension || '')) return 'video';
  if (['mp3', 'wav', 'm4a'].includes(extension || '')) return 'audio';
  // Fallback check based on url structure (e.g. data URLs)
  if (url.startsWith('data:image/')) return 'image';
  if (url.startsWith('data:application/pdf')) return 'pdf';
  if (url.startsWith('data:video/')) return 'video';
  if (url.startsWith('data:audio/')) return 'audio';
  return 'unknown';
}

export function AttachmentViewer({ attachments, containerClassName = "mt-4" }: { attachments: Attachment[], containerClassName?: string }) {
  const { openViewer } = useImageViewer();
  const navigate = useNavigate();

  if (!attachments || attachments.length === 0) return null;

  // Process attachments
  const processed = attachments.map(att => ({
    ...att,
    type: att.type || guessAttachmentType(att.url, att.name)
  }));

  // Image Gallery Handlers
  const images = processed.filter(a => a.type === 'image');
  const handleImageClick = (url: string) => {
    const startIndex = images.findIndex(img => img.url === url);
    openViewer(
      images.map(img => ({ src: img.url, name: img.name || 'Attached Image' })),
      startIndex >= 0 ? startIndex : 0
    );
  };

  return (
    <div className={`flex flex-wrap gap-4 ${containerClassName}`}>
      {processed.map((att, index) => {
        if (att.type === 'image') {
          return (
            <div
              key={index}
              onClick={() => handleImageClick(att.url)}
              className="group relative inline-block rounded-[16px] overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A2726] p-1 cursor-zoom-in hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm w-[140px] h-[140px]"
            >
              <img
                src={att.url}
                alt={att.name || 'Attachment'}
                className="w-full h-full object-cover rounded-[12px] group-hover:scale-[1.05] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-[16px]" />
            </div>
          );
        }

        if (att.type === 'pdf') {
          return (
            <div key={index} className="flex items-center gap-4 p-4 bg-white dark:bg-[#2A2726] border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all w-fit">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
              <div className="flex-1 pr-4">
                <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 max-w-[200px] truncate">{att.name || 'Document.pdf'}</p>
                <p className="text-[13px] text-gray-500">PDF Document</p>
              </div>
              <button
                onClick={() => navigate(`/viewer/${encodeURIComponent(att.name || 'document')}`, { state: { url: att.url, name: att.name || 'Document.pdf' } })}
                className="px-4 py-2 bg-[#4A0E1B] text-white text-sm font-bold rounded-xl hover:bg-[#7C2532] transition-colors shrink-0"
              >
                Preview
              </button>
            </div>
          );
        }

        if (att.type === 'video') {
          return (
            <div key={index} className="w-full max-w-md rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black">
              <video controls src={att.url} className="w-full h-auto max-h-[300px]" />
            </div>
          );
        }

        if (att.type === 'audio') {
          return (
            <div key={index} className="flex flex-col gap-3 p-4 bg-white dark:bg-[#2A2726] border border-gray-200 dark:border-gray-700 rounded-2xl w-fit max-w-[300px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                  <Music size={20} />
                </div>
                <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">{att.name || 'Audio File'}</p>
              </div>
              <audio controls src={att.url} className="w-full" />
            </div>
          );
        }

        // unknown
        return (
          <div key={index} className="flex items-center gap-4 p-4 bg-white dark:bg-[#2A2726] border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all w-fit">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-xl flex items-center justify-center shrink-0">
              <Download size={24} />
            </div>
            <div className="flex-1 pr-4">
              <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 max-w-[200px] truncate">{att.name || 'File'}</p>
              <p className="text-[13px] text-gray-500">Unknown type</p>
            </div>
            <a
              href={att.url}
              download
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0 flex items-center gap-2"
            >
              Download
            </a>
          </div>
        );
      })}

    </div>
  );
}
