import { Link } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { ROUTES } from '../../../utils/constants'
import { COMMENT_COPY } from '../constants/commentsContent'

export function CommentsSignInPrompt() {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-white px-6 py-8 text-center">
      <h3 className="font-title-md text-title-md text-text-primary">{COMMENT_COPY.SIGN_IN_TITLE}</h3>
      <p className="mt-2 font-body-sm text-body-sm text-text-muted">{COMMENT_COPY.SIGN_IN_BODY}</p>
      <Link className="mt-5 inline-flex" to={ROUTES.LOGIN}>
        <Button appearance="compact" type="button">
          {COMMENT_COPY.SIGN_IN_CTA}
        </Button>
      </Link>
    </div>
  )
}
