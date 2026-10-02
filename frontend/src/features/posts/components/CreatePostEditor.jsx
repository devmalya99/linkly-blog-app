import { useEffect } from 'react'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TipTapToolbar } from './TipTapToolbar'
import { countWords, estimateReadMinutes } from '../constants/createPostContent'

export function CreatePostEditor({
  title,
  initialContent = '',
  onTitleChange,
  onContentChange,
  onTextChange,
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary-container underline' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full my-4' },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story…',
      }),
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class:
          'tiptap-editor min-h-[320px] w-full bg-transparent font-body-reading text-body-reading leading-[1.7] text-text-primary focus:outline-none',
      },
    },
    onUpdate: ({ editor: current }) => {
      onContentChange(current.getHTML())
      onTextChange?.(current.getText())
    },
  })

  useEffect(() => {
    if (!editor || !initialContent) return
    if (editor.getHTML() === initialContent) return
    editor.commands.setContent(initialContent, { emitUpdate: false })
    onContentChange(editor.getHTML())
    onTextChange?.(editor.getText())
  }, [editor, initialContent, onContentChange, onTextChange])

  const plainText = editor?.getText() || ''
  const wordCount = countWords(plainText)
  const readMinutes = estimateReadMinutes(wordCount)

  return (
    <div className="flex flex-col rounded-xl bg-surface-white p-6 shadow-sm sm:p-10 lg:col-span-8">
      <div className="mb-6 flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <label
            className="font-label-tag text-label-tag font-semibold tracking-wider text-text-muted uppercase"
            htmlFor="post-title"
          >
            Article Title <span className="text-status-error">*</span>
          </label>
          <span className="font-meta-sm text-meta-sm text-text-muted">{title.length} / 120 chars</span>
        </div>
        <input
          className="w-full border-b border-border-subtle bg-transparent pb-3 text-[28px] leading-[36px] font-bold text-text-primary placeholder:text-outline-variant focus:border-primary-container focus:outline-none"
          id="post-title"
          maxLength={120}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Enter a compelling title..."
          type="text"
          value={title}
        />
      </div>

      <TipTapToolbar editor={editor} />

      <div className="relative w-full flex-1">
        <EditorContent editor={editor} />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-border-subtle pt-6 font-meta-sm text-meta-sm text-text-muted sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-text-primary">{wordCount} words</span>
          <span>·</span>
          <span>{readMinutes} min read time</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 text-primary-container">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Rich text editor
          </span>
        </div>
      </div>
    </div>
  )
}
