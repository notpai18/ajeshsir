import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Music, FileText, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadDoubtAttachment } from '../../services/doubtsService';

export type FileType = 'image' | 'video' | 'audio' | 'attachment';

export interface UploadedFile {
  url: string;
  name: string;
  type: FileType;
}

interface MultimediaUploaderProps {
  onUploadComplete: (file: UploadedFile) => void;
  onRemove: (url: string) => void;
  files: UploadedFile[];
}

const MAX_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 250 * 1024 * 1024, // 250MB
  audio: 50 * 1024 * 1024, // 50MB
  attachment: 100 * 1024 * 1024 // 100MB
};

export function MultimediaUploader({ onUploadComplete, onRemove, files }: MultimediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const determineFileType = (file: File): FileType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'attachment';
  };

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setError(null);

    // Only process the first file for simplicity, or we can loop through them
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const type = determineFileType(file);
      
      if (file.size > MAX_SIZES[type]) {
        setError(`${file.name} exceeds the maximum size limit for ${type}s.`);
        continue;
      }

      setIsUploading(true);
      try {
        const { url, name } = await uploadDoubtAttachment(file, `doubts/replies/${type}`);
        onUploadComplete({ url, name, type });
      } catch (err: any) {
        setError(`Failed to upload ${file.name}: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const getIconForType = (type: FileType) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'audio': return <Music className="w-5 h-5 text-yellow-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragging 
            ? 'border-[#4A0E1B] bg-[#4A0E1B]/5' 
            : 'border-gray-200 hover:border-[#D9C2A2] hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#4A0E1B]" />
            <p className="text-sm font-medium">Uploading file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F7F3EC] dark:bg-[#1A1817] flex items-center justify-center mb-2">
              <UploadCloud className="w-6 h-6 text-[#4A0E1B]" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Click or drag files to upload
            </p>
            <p className="text-xs text-gray-500">
              Images (10MB), Video (250MB), Audio (50MB), Docs (100MB)
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group rounded-xl border border-gray-200 overflow-hidden bg-white dark:bg-[#22201F] shadow-sm flex items-center p-2 gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    getIconForType(file.type)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize">{file.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(file.url)}
                  className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
