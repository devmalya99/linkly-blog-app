import { useEffect, useState } from 'react'
import { Alert } from '@ninna-ui/feedback'
import { Modal } from '@ninna-ui/overlays'
import { Code, Heading, Text } from '@ninna-ui/primitives'
import { Button } from '../../../components/common/Button'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { buildShareUrl } from '../utils/postShare'

export function SharePostLink({ open, onClose, post }) {
  const { copyState, copy } = useCopyToClipboard()
  const [error, setError] = useState('')
  const shareUrl = buildShareUrl(post.id)

  useEffect(() => {
    if (!open) return
    setError('')
  }, [open])

  async function handleCopy() {
    setError('')
    try {
      await copy(shareUrl)
    } catch {
      setError('Unable to copy the link. Copy it manually instead.')
    }
  }

  return (
    <Modal
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
      open={open}
    >
      <Modal.Content
        centered
        className="border border-border-subtle bg-surface-white"
        closeOnEscape
        closeOnOverlayClick
        description="Anyone with this link can open the post, including drafts — no login required. Publishing still controls whether it appears on the public feed."
        size="md"
      >
        <Modal.Close />
        <Modal.Header>
          <div className="flex items-center gap-2 pr-10">
            <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary-container">
              share
            </span>
            <Heading as="h2" className="font-title-md text-title-md text-text-primary" size="md">
              Share link
            </Heading>
          </div>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-4">
          <Text className="font-body-sm text-body-sm text-text-muted" muted>
            Anyone with this link can open the post, including drafts — no login required. Publishing
            still controls whether it appears on the public feed.
          </Text>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Code className="min-w-0 flex-1 truncate rounded-lg bg-surface-container-low px-3 py-2 font-meta-sm text-meta-sm text-text-primary">
              {shareUrl || '—'}
            </Code>
            <Button
              appearance="primary"
              className="h-auto shrink-0 px-4 py-2.5"
              leftIcon={
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  {copyState === 'copied' ? 'check' : 'content_copy'}
                </span>
              }
              onClick={handleCopy}
              type="button"
            >
              {copyState === 'copied' ? 'Copied' : 'Copy URL'}
            </Button>
          </div>

          {error ? <Alert color="danger" description={error} /> : null}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}
