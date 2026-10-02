export function formatAdminDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function adminStatusLabel(status, isDeleted) {
  if (isDeleted) return 'Deleted'
  if (status === 'published') return 'Published'
  if (status === 'draft') return 'Draft'
  return status || '—'
}

export function adminStatusBadgeClass(status, isDeleted) {
  if (isDeleted) {
    return {
      wrap: 'bg-status-error/10 text-status-error',
      dot: 'bg-status-error',
    }
  }
  if (status === 'published') {
    return {
      wrap: 'bg-status-success/10 text-status-success',
      dot: 'bg-status-success',
    }
  }
  if (status === 'draft') {
    return {
      wrap: 'bg-status-warning/10 text-status-warning',
      dot: 'bg-status-warning',
    }
  }
  return {
    wrap: 'bg-surface-container text-text-muted',
    dot: 'bg-text-muted',
  }
}

export function adminRoleBadgeClass(role) {
  if (role === 'admin') {
    return 'bg-primary-container/15 text-primary-container'
  }
  return 'bg-surface-container text-text-muted'
}

export function adminRoleLabel(role) {
  if (role === 'admin') return 'Admin'
  return 'User'
}

export function buildAdminPostsParams({ page, limit, status, author, deleted }) {
  const params = { page, limit }

  if (status && status !== 'all') {
    params.status = status
  }

  if (author) {
    params.author = author
  }

  if (deleted === 'true' || deleted === 'false') {
    params.deleted = deleted
  }

  return params
}

export function buildAdminUsersParams({ page, limit, search, role, sort }) {
  const params = { page, limit }

  if (search?.trim()) {
    params.search = search.trim()
  }

  if (role && role !== 'all') {
    params.role = role
  }

  if (sort) {
    params.sort = sort
  }

  return params
}

export function buildAdminUserPostsParams({ page, limit, author, tab }) {
  const params = { page, limit, author }

  if (tab === 'deleted') {
    params.deleted = 'true'
    return params
  }

  params.deleted = 'false'

  if (tab === 'published' || tab === 'draft') {
    params.status = tab
  }

  return params
}
