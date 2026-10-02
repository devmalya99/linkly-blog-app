import { ActivityLog } from '../models/ActivityLog.js'

export async function logActivity({
  userId,
  action,
  resourceType,
  resourceId,
  metadata = {},
  ipAddress,
}) {
  await ActivityLog.create({
    user: userId || undefined,
    action,
    resourceType,
    resourceId: resourceId ? String(resourceId) : undefined,
    metadata,
    ipAddress,
  })
}
