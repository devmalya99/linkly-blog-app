const errorContent = {
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
    },
  },
}

export const sharePaths = {
  '/share/posts/{id}': {
    get: {
      tags: ['Share'],
      summary: 'Get a shared post by id',
      description:
        'Public, unauthenticated endpoint for share links (`/share/posts/:id`). ' +
        'Works for both draft and published posts that are not soft-deleted. ' +
        'Returns a minimal payload (title, content, category, tags, publishedAt, author.name). ' +
        'Does not publish the post or add it to the public feed.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            pattern: '^[a-fA-F\\d]{24}$',
          },
          description: 'MongoDB ObjectId of the post',
        },
      ],
      responses: {
        200: {
          description: 'Shared post fetched',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SharedPostResponse' },
            },
          },
        },
        404: {
          description: 'Post not found or soft-deleted',
          ...errorContent,
        },
        422: {
          description: 'Invalid id',
          ...errorContent,
        },
      },
    },
  },
}
