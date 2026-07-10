import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Heading1, Heading2, Code 
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[150px] px-4 py-3 text-gray-800',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive: boolean; 
    children: React.ReactNode; 
    title: string 
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
        isActive 
          ? 'bg-[#4A0E1B] text-white' 
          : 'text-gray-600 hover:bg-[#D9C2A2]/30 hover:text-[#4A0E1B]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white dark:bg-[#22201F] dark:bg-[#22201F] shadow-sm focus-within:ring-2 focus-within:ring-[#4A0E1B]/20 focus-within:border-[#4A0E1B] transition-all duration-200">
      <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50/50 p-2 overflow-x-auto">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="prose-content" />
    </div>
  );
}
