import { FIXED_FEED_TABS, FEED_TABS } from '../constants/feedContent'
import { POST_CATEGORIES } from '../../posts'

export function FeedTabs({ activeTab, activeCategory, onSelectTab }) {
  const categoryTabs = POST_CATEGORIES.map((category) => ({
    id: `category-${category}`,
    label: category,
    tab: FEED_TABS.CATEGORY,
    category,
  }))

  const tabs = [...FIXED_FEED_TABS, ...categoryTabs]

  return (
    <div className="-mx-1 overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-1 border-b border-border-subtle px-1" role="tablist">
        {tabs.map((item) => {
          const isActive =
            item.tab === FEED_TABS.CATEGORY
              ? activeTab === FEED_TABS.CATEGORY && activeCategory === item.category
              : activeTab === item.tab

          return (
            <button
              aria-selected={isActive}
              className={
                isActive
                  ? 'border-b-2 border-text-primary px-3 py-2.5 font-label-md text-label-md font-semibold text-text-primary'
                  : 'border-b-2 border-transparent px-3 py-2.5 font-label-md text-label-md text-text-muted transition-colors hover:text-text-primary'
              }
              key={item.id}
              onClick={() => onSelectTab(item)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
