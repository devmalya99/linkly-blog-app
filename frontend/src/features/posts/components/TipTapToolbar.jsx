function ToolbarButton({ active, onClick, label, icon, children }) {
  return (
    <button
      aria-label={label}
      className={
        icon
          ? `flex h-8 w-8 items-center justify-center rounded transition-colors ${
              active
                ? 'bg-surface-white text-primary-container'
                : 'text-text-muted hover:bg-surface-white hover:text-text-primary'
            }`
          : `rounded px-2.5 py-1.5 font-label-md text-label-md transition-colors ${
              active
                ? 'bg-surface-white text-primary-container'
                : 'text-text-muted hover:bg-surface-white hover:text-text-primary'
            }`
      }
      onClick={onClick}
      type="button"
    >
      {icon ? <span className="material-symbols-outlined text-[18px]">{icon}</span> : children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-border-subtle" />
}

export function TipTapToolbar({ editor }) {
  if (!editor) return null

  function setLink() {
    const previous = editor.getAttributes('link').href
    const url = window.prompt('Enter link URL', previous || 'https://')

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt('Enter image URL', 'https://')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="sticky top-20 z-20 mb-6 flex flex-wrap items-center gap-1 rounded-lg bg-background-warm p-1.5 text-text-primary shadow-sm">
      <div className="flex items-center">
        <ToolbarButton
          active={editor.isActive('heading', { level: 1 })}
          label="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          label="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          label="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
      </div>

      <Divider />

      <div className="flex items-center">
        <ToolbarButton
          active={editor.isActive('bold')}
          icon="format_bold"
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          active={editor.isActive('italic')}
          icon="format_italic"
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          active={editor.isActive('strike')}
          icon="format_strikethrough"
          label="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
      </div>

      <Divider />

      <div className="flex items-center">
        <ToolbarButton
          active={editor.isActive('link')}
          icon="link"
          label="Link"
          onClick={setLink}
        />
        <ToolbarButton
          active={editor.isActive('blockquote')}
          icon="format_quote"
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          active={editor.isActive('code')}
          icon="code"
          label="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
      </div>

      <Divider />

      <div className="flex items-center">
        <ToolbarButton
          active={editor.isActive('bulletList')}
          icon="format_list_bulleted"
          label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          active={editor.isActive('orderedList')}
          icon="format_list_numbered"
          label="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>

      <Divider />

      <ToolbarButton icon="image" label="Image" onClick={addImage} />

      <div className="ml-auto hidden items-center gap-1.5 px-2 text-text-muted md:flex">
        <span className="inline-block h-2 w-2 rounded-full bg-status-success" />
        <span className="font-meta-sm text-meta-sm">Live Auto-save</span>
      </div>
    </div>
  )
}
