import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { DashboardHeader, DashboardSidebar } from '../../dashboard'
import { ApiError } from '../../../services/api/client'
import { ROUTES } from '../../../utils/constants'
import { CreatePostEditor } from '../components/CreatePostEditor'
import { CreatePostSettings } from '../components/CreatePostSettings'
import {
  DEFAULT_TAGS,
  POST_STATUS,
  buildCreatePostPayload,
  formatApiError,
  slugifyTitle,
} from '../constants/createPostContent'
import { useCreatePost } from '../hooks/useCreatePost'

export function CreatePost() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { createPost, isSubmitting } = useCreatePost()

  const [title, setTitle] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [contentText, setContentText] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState(DEFAULT_TAGS)
  const [excerpt, setExcerpt] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [coverImage, setCoverImage] = useState(null)
  const [error, setError] = useState('')

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  function handleTitleChange(value) {
    setTitle(value)
    if (!slugTouched) {
      setSlug(slugifyTitle(value))
    }
  }

  function handleSlugChange(value) {
    setSlugTouched(true)
    setSlug(slugifyTitle(value))
  }

  function handleAddTag(tag) {
    if (tags.length >= 5 || tags.includes(tag)) return
    setTags((current) => [...current, tag])
  }

  function handleRemoveTag(tag) {
    setTags((current) => current.filter((item) => item !== tag))
  }

  function validateBeforeSubmit(status) {
    if (!title.trim()) {
      return 'Add a title before continuing.'
    }
    if (!category) {
      return 'Select a category before continuing.'
    }
    if (status === POST_STATUS.PUBLISHED && !contentText.trim()) {
      return 'Add some content before publishing.'
    }
    return ''
  }

  async function submitPost(status) {
    setError('')

    const validationError = validateBeforeSubmit(status)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await createPost(
        buildCreatePostPayload({
          title,
          contentHtml,
          category,
          tags,
          excerpt,
          slug,
          slugTouched,
          status,
          coverImage,
        }),
      )

      navigate(ROUTES.MY_POSTS, {
        replace: true,
        state: {
          postNotice:
            status === POST_STATUS.PUBLISHED
              ? 'Post published successfully.'
              : 'Draft saved successfully.',
        },
      })
    } catch (err) {
      setError(err instanceof ApiError ? formatApiError(err) : 'Unable to create post.')
    }
  }

  return (
    <div className="min-h-screen bg-background-warm font-body-md text-body-md text-text-primary antialiased">
      <DashboardHeader onLogout={handleLogout} />
      <DashboardSidebar onLogout={handleLogout} />

      <div className="pl-0 md:pl-64">
        <main className="min-h-screen bg-background-warm pt-16">
          <div className="mx-auto max-w-6xl p-6 lg:p-12">
            <div className="flex flex-col items-start justify-between gap-4 pb-8 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-container/10 text-primary-container">
                    <span className="material-symbols-outlined text-[16px]">edit_square</span>
                  </span>
                  <h1 className="font-headline-md text-headline-md tracking-tight text-text-primary">
                    Create Post
                  </h1>
                </div>
                <p className="font-body-md text-body-md text-text-muted">
                  Share something worth reading with the Inkly community.
                </p>
              </div>

              <div className="flex w-full items-center gap-3 self-stretch sm:w-auto sm:self-auto">
                <button
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-white px-4 py-2.5 font-label-md text-label-md text-text-primary transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial"
                  disabled={isSubmitting}
                  onClick={() => submitPost(POST_STATUS.DRAFT)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-text-muted">save</span>
                  {isSubmitting ? 'Saving…' : 'Save Draft'}
                </button>
                <button
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-label-md text-label-md text-on-primary transition-colors hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial"
                  disabled={isSubmitting}
                  onClick={() => submitPost(POST_STATUS.PUBLISHED)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  {isSubmitting ? 'Publishing…' : 'Publish'}
                </button>
              </div>
            </div>

            {error ? (
              <div
                className="mb-6 flex items-center gap-2 rounded-lg border border-status-error/20 bg-red-50 px-4 py-3 font-body-sm text-body-sm text-status-error shadow-sm"
                role="alert"
              >
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            ) : null}

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <CreatePostEditor
                onContentChange={setContentHtml}
                onTextChange={setContentText}
                onTitleChange={handleTitleChange}
                title={title}
              />
              <CreatePostSettings
                category={category}
                coverDisabled={isSubmitting}
                coverImage={coverImage}
                excerpt={excerpt}
                onAddTag={handleAddTag}
                onCategoryChange={setCategory}
                onCoverImageChange={setCoverImage}
                onExcerptChange={setExcerpt}
                onRemoveTag={handleRemoveTag}
                onSlugChange={handleSlugChange}
                slug={slug}
                tags={tags}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
