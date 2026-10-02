export const commonSchemas = {
  Pagination: {
    type: 'object',
    properties: {
      page: { type: 'integer', example: 1 },
      limit: { type: 'integer', example: 10 },
      total: { type: 'integer', example: 50 },
      totalPages: { type: 'integer', example: 5 },
    },
  },
  ErrorItem: {
    type: 'object',
    properties: {
      field: { type: 'string', example: 'password' },
      message: { type: 'string', example: 'Password must include an uppercase letter' },
    },
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Validation failed' },
      errors: {
        type: 'array',
        items: { $ref: '#/components/schemas/ErrorItem' },
      },
    },
  },
  PublicUser: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
      name: { type: 'string', example: 'Debmalya Mazumdar' },
      email: { type: 'string', format: 'email', example: 'debmalya@example.com' },
      role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
      avatar: { type: 'string', example: '' },
    },
  },
}
