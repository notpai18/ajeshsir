import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Code, Code2 } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-4 py-3',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleBold().run();
  };
  
  const toggleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleItalic().run();
  };
  
  const toggleUnderline = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleUnderline().run();
  };
  
  const toggleBulletList = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleBulletList().run();
  };
  
  const toggleOrderedList = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleOrderedList().run();
  };
  
  const toggleCodeBlock = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleCodeBlock().run();
  };

  return (
    <div className={`flex flex-col border border-[#D9C2A2] dark:border-gray-700 rounded-xl overflow-hidden bg-[#F7F3EC] dark:bg-[#1A1817] focus-within:ring-4 focus-within:ring-[#4A0E1B]/10 dark:focus-within:ring-[#4A0E1B]/30 focus-within:border-[#4A0E1B] transition-all ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#D9C2A2]/50 dark:border-gray-700 bg-white/50 dark:bg-[#22201F]/50">
        <button
          type="button"
          onClick={toggleBold}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-[#4A0E1B] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-[#4A0E1B] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-[#4A0E1B] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />
        
        <button
          type="button"
          onClick={toggleBulletList}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-[#4A0E1B] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-[#4A0E1B] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />
        
        <button
          type="button"
          onClick={toggleCodeBlock}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('codeBlock') ? 'bg-[#4A0E1B] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Code Block"
        >
          <Code2 size={16} />
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="relative flex-1 bg-transparent cursor-text text-[#22201F] dark:text-[#F6F2EA]">
        {editor.isEmpty && !editor.isFocused && (
          <div className="absolute top-3 left-4 text-gray-400 dark:text-gray-500 pointer-events-none text-sm whitespace-pre-wrap">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
