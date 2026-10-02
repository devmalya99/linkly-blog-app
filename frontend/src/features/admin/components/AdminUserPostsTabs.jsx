import { Button } from '../../../components/common/Button'
import { ADMIN_USER_POSTS_TAB, ADMIN_USER_POSTS_TAB_LABELS } from '../constants/admin.constants'

const TABS = Object.values(ADMIN_USER_POSTS_TAB)

export function AdminUserPostsTabs({ tab, onTabChange }) {
  return (
    <div className="mb-6 inline-flex flex-wrap items-center gap-1 rounded-lg bg-surface-container p-1">
      {TABS.map((tabId) => {
        const isActive = tab === tabId

        return (
          <Button
            appearance={isActive ? 'segmentActive' : 'segment'}
            aria-pressed={isActive}
            key={tabId}
            onClick={() => onTabChange(tabId)}
            type="button"
          >
            {ADMIN_USER_POSTS_TAB_LABELS[tabId]}
          </Button>
        )
      })}
    </div>
  )
}
