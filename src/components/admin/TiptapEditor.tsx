'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo
} from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({ value, onChange, placeholder = '내용을 입력하세요...' }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    // Sync content if value changes externally (and editor is empty or verification needed? usually not needed for controlled local state but good for initial load)
    // Actually, setting content in useEditor 'content' prop is usually enough for initial render.
    // Dynamic updates typically require useEffect. But here value is controlled by local state in parent. 
    // If we want fully controlled component potentially, we need useEffect.
    // For now, relying on 'content' prop in useEditor is mostly for initial.
    // Let's add useEffect for external updates if needed, but be careful of loop.
    // Simple version: just rely on initial value.

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL을 입력하세요', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('이미지 URL을 입력하세요');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToggleButton = ({
        isActive,
        onClick,
        children,
        title
    }: {
        isActive: boolean;
        onClick: () => void;
        children: React.ReactNode;
        title: string;
    }) => (
        <Button
            type="button" // Prevent form submission
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={onClick}
            title={title}
            className={cn("h-8 w-8 p-0", isActive && "bg-gray-200 dark:bg-gray-700")}
        >
            {children}
        </Button>
    );

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900">
            {/* Toolbar */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800/50">
                <ToggleButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strike"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToggleButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

                <ToggleButton
                    isActive={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </ToggleButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

                <ToggleButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton
                    isActive={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </ToggleButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />

                <Button type="button" variant="ghost" size="sm" onClick={setLink} title="Link" className={cn("h-8 w-8 p-0", editor.isActive('link') && "bg-gray-200 dark:bg-gray-700")}>
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={addImage} title="Image" className="h-8 w-8 p-0">
                    <ImageIcon className="h-4 w-4" />
                </Button>

                <div className="flex-1" />

                <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo" className="h-8 w-8 p-0">
                    <Undo className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo" className="h-8 w-8 p-0">
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
