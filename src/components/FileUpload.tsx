import React, { useRef } from 'react';
import { UploadCloud, CheckCircle, X, File as FileIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  value?: string | File | null;
  placeholder?: string;
}

export function FileUpload({ onFileSelect, accept = '.pdf', value = null, placeholder = 'Click or drag a file to upload' }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDisplayName = () => {
    if (value instanceof File) return value.name;
    if (typeof value === 'string' && value) return value.split('/').pop()?.split('?')[0] || 'Uploaded File';
    return '';
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="flex items-center justify-between p-3 border border-[#D9C2A2]/30 rounded-xl bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-[#C9A13B]/10 text-[#4A0E1B] dark:text-[#F4E7E5] rounded-lg shrink-0">
              <FileIcon size={20} />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] truncate">
                {getDisplayName()}
              </span>
              <span className="text-xs text-[#4A0E1B] dark:text-[#F4E7E5] font-bold flex items-center gap-1">
                <CheckCircle size={10} className="text-[#C9A13B]" /> Selected
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFileSelect(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            className="p-1 hover:bg-[#D9C2A2]/20 rounded-md text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label 
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="relative flex flex-col items-center justify-center p-6 border border-dashed rounded-xl transition-colors border-[#D9C2A2]/50 hover:border-[#4A0E1B]/50 bg-[#F7F3EC] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817] dark:bg-[#1A1817]/50 cursor-pointer"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            accept={accept} 
            className="hidden" 
          />
          
          <div className="p-3 bg-white dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] dark:bg-[#22201F] shadow-soft-sm rounded-full mb-3 text-[#4A0E1B] dark:text-[#F4E7E5] border border-[#D9C2A2]/20">
            <UploadCloud size={24} />
          </div>
          <span className="text-sm font-medium text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]">
            {placeholder}
          </span>
          <span className="text-xs text-[#22201F] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA] dark:text-[#F6F2EA]/60 mt-1">PDF up to 50MB</span>
        </label>
      )}
    </div>
  );
}
