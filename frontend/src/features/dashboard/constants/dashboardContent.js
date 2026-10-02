import { ROUTES } from '../../../utils/constants'

export const DASHBOARD_STATS = [
  {
    id: 'total',
    label: 'Total Posts',
    value: '24',
    icon: 'article',
    meta: { type: 'badge', tone: 'success', text: '3 this month', icon: 'arrow_upward' },
    footer: { type: 'progress', value: 75 },
  },
  {
    id: 'published',
    label: 'Published',
    value: '18',
    icon: 'public',
    iconTone: 'success',
    meta: { type: 'text', text: '75% total ratio' },
    footer: { type: 'text', text: 'Live on Inkly feed.' },
  },
  {
    id: 'drafts',
    label: 'Drafts',
    value: '6',
    icon: 'edit_note',
    iconTone: 'warning',
    meta: { type: 'text', tone: 'warning', text: 'Needs review' },
    footer: { type: 'text', text: 'In progress' },
  },
  {
    id: 'comments',
    label: 'Comments',
    value: '142',
    icon: 'chat_bubble_outline',
    iconTone: 'brand',
    meta: { type: 'badge', tone: 'brand', text: '+12 new' },
    footer: { type: 'text', text: 'Across all articles' },
  },
]

export const RECENT_POSTS = [
  {
    id: '1',
    title: 'Understanding Modern React Architecture',
    status: 'Published',
    date: 'Sep 30, 2026',
    detail: '6 min read',
    detailIcon: 'schedule',
  },
  {
    id: '2',
    title: 'Building Distributed Node.js APIs at Scale',
    status: 'Draft',
    date: 'Sep 28, 2026',
    detail: '1,240 words',
    detailIcon: 'description',
  },
  {
    id: '3',
    title: 'The 8-Pixel Rhythm and Spatial Cohesion in UI',
    status: 'Published',
    date: 'Sep 24, 2026',
    detail: '5 min read',
    detailIcon: 'schedule',
  },
  {
    id: '4',
    title: 'Rethinking Micro-frontends on the Modern Web',
    status: 'Published',
    date: 'Sep 18, 2026',
    detail: '8 min read',
    detailIcon: 'schedule',
  },
  {
    id: '5',
    title: 'Calm Software in an Age of Hyper-Notification',
    status: 'Draft',
    date: 'Sep 12, 2026',
    detail: '450 words',
    detailIcon: 'description',
  },
]

export const RECENT_COMMENTS = [
  {
    id: '1',
    quote:
      'Really useful explanation of server component caching boundaries. Cleared up a lot of misconceptions.',
    author: 'Johnathan Miller',
    initials: 'JM',
    time: '2 hours ago',
    post: 'Understanding Modern React Architecture',
  },
  {
    id: '2',
    quote:
      'Would love to see a follow-up detailing database connection pooling in multi-tenant environments.',
    author: 'Sarah Jenkins',
    initials: 'SJ',
    time: 'Yesterday',
    post: 'Building Distributed Node.js APIs',
  },
  {
    id: '3',
    quote:
      'The spatial grid diagram on 8-pixel rhythm was spot on. Sharing this with our frontend team!',
    author: 'Marcus Thorne',
    initials: 'MT',
    time: '3 days ago',
    post: 'The 8-Pixel Rhythm and Spatial Cohesion',
  },
]

export const WEEKLY_READERS = {
  visitors: '3,842',
  growth: '14.8%',
  bars: [42, 58, 51, 73, 66, 88, 79],
}

export const SIDEBAR_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: ROUTES.DASHBOARD },
  { id: 'posts', label: 'My Posts', icon: 'article', to: ROUTES.MY_POSTS },
  { id: 'create', label: 'Create Post', icon: 'add_circle', to: ROUTES.CREATE_POST },
]

export const ADMIN_SIDEBAR_NAV = [
  { id: 'admin-dashboard', label: 'Admin Dashboard', icon: 'admin_panel_settings', to: ROUTES.ADMIN_DASHBOARD },
  { id: 'admin-posts', label: 'All Posts', icon: 'library_books', to: ROUTES.ADMIN_POSTS },
  { id: 'admin-users', label: 'Manage Users', icon: 'group', to: ROUTES.ADMIN_USERS },
]
