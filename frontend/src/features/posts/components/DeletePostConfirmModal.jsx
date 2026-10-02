import { Alert } from '@ninna-ui/feedback'
import { Modal } from '@ninna-ui/overlays'
import { Heading, Text } from '@ninna-ui/primitives'
import { Button } from '../../../components/common/Button'
import { DELETE_POST_COPY } from '../constants/deletePostContent'

export function DeletePostConfirmModal({
  open,
  post,
  onClose,
  onConfirm,
  isDeleting = false,
  error = '',
}) {
  const title = post?.title?.trim() || 'Untitled post'

  return (
    <Modal
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isDeleting) onClose()
      }}
      open={open}
    >
      <Modal.Content
        centered
        className="border border-border-subtle bg-surface-white"
        closeOnEscape={!isDeleting}
        closeOnOverlayClick={!isDeleting}
        description={DELETE_POST_COPY.DESCRIPTION}
        size="md"
        title={DELETE_POST_COPY.TITLE}
      >
        <Modal.Header>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-error/10 text-status-error"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </span>
            <Heading as="h2" className="font-title-md text-title-md text-text-primary" size="md">
              {DELETE_POST_COPY.TITLE}
            </Heading>
          </div>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-4">
          <Text className="font-body-sm text-body-sm text-text-muted">{DELETE_POST_COPY.DESCRIPTION}</Text>

          <div className="flex items-start gap-2 rounded-xl bg-surface-container-low px-3.5 py-3">
            <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-[18px] text-text-muted">
              info
            </span>
            <p className="font-body-sm text-body-sm text-text-muted">
              {DELETE_POST_COPY.TARGET_LABEL}{' '}
              <span className="font-medium text-text-primary">{title}</span>
            </p>
          </div>

          {error ? <Alert color="danger" description={error} /> : null}
        </Modal.Body>

        <Modal.Footer className="flex justify-end gap-2">
          <Button
            appearance="soft"
            className="h-auto px-4 py-2.5"
            disabled={isDeleting}
            onClick={onClose}
            type="button"
          >
            {DELETE_POST_COPY.CANCEL}
          </Button>
          <Button
            appearance="primary"
            className="h-auto bg-status-error px-4 py-2.5 hover:bg-red-600"
            disabled={isDeleting}
            leftIcon={
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                delete
              </span>
            }
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? DELETE_POST_COPY.DELETING : DELETE_POST_COPY.CONFIRM}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
