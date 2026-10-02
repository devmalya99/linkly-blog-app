# Inkly Backend Architecture

> **Single source of truth for the Inkly backend.**
>
> Cursor and all AI coding assistants MUST read and follow this document before creating or modifying backend code.

## 1. Goal

Inkly is a **classic MERN** blog application:

- MongoDB
- Express.js
- React.js
- Node.js

The frontend is a separate React + Vite application. The backend is a separate Node.js + Express REST API.

The backend must implement:

- Registration, login, logout
- JWT access tokens and refresh tokens
- Google OAuth 2.0
- Facebook/Meta OAuth 2.0
- bcrypt password hashing
- Authentication rate limiting
- Admin/User roles and RBAC
- Post CRUD and ownership
- URL-friendly slugs
- Soft deletion
- Comment CRUD and ownership
- Admin user/post/comment management
- Admin dashboard statistics
- Validation
- RESTful, versioned APIs
- Centralized errors
- Activity logging
- Service layer
- Mongoose
- Pagination and indexing
- Jest unit/integration testing
- Optional Socket.io only after core requirements are complete

---

# 2. Non-Negotiable Technology

Use:

```text
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Passport.js
Zod
Jest
Supertest
helmet
cors
express-rate-limit
```

OAuth:

```text
passport-google-oauth20
passport-facebook
```

Do NOT replace Express with:

- Next.js API routes
- Next.js Route Handlers
- Server Actions
- Firebase
- Supabase
- Another backend framework

The assignment is explicitly a classic MERN application.

---

# 3. Architecture

Strict separation of concerns:

```text
HTTP Request
     ↓
Express Router
     ↓
Middleware
     ├── Authentication
     ├── Authorization
     ├── Validation
     ├── Rate Limiting
     └── Activity/Request Logging
     ↓
Controller
     ↓
Service
     ↓
Mongoose Model
     ↓
MongoDB
```

Response:

```text
MongoDB
   ↓
Service
   ↓
Controller
   ↓
Consistent API Response
   ↓
Client
```

## Core rule

> Controllers handle HTTP. Services handle business logic. Models handle persistence. Middleware handles cross-cutting concerns. Routes define endpoints.

---

# 4. Layer Responsibilities

## Routes

Routes only define:

- URL
- HTTP method
- Middleware ordering
- Controller

Routes must contain **no business logic**.

## Middleware

Middleware handles:

- JWT authentication
- RBAC authorization
- Validation
- Rate limiting
- Request/activity logging
- Cross-cutting HTTP concerns

Middleware must be reusable.

## Controllers

Controllers:

1. Read request data.
2. Call a service.
3. Return the HTTP response.
4. Forward errors to the global error handler.

Controllers must NOT:

- Query MongoDB directly
- Hash passwords
- Generate slugs
- Implement complex business rules
- Perform ownership queries
- Contain OAuth business logic

## Services

Services contain business logic.

Examples:

```text
AuthService
UserService
PostService
CommentService
AdminService
```

Services handle:

- Business rules
- User lookup/creation
- Account linking
- Ownership checks
- Post operations
- Comment operations
- Session/token coordination
- Soft deletes
- Dashboard statistics

## Models

Mongoose models define:

- Schema
- Types
- References
- Indexes
- Persistence-level rules
- Timestamps

Models must not contain controller responsibilities.

## Utils

Small reusable helpers only:

```text
generateSlug
hashPassword
comparePassword
signAccessToken
signRefreshToken
sanitizeUser
```

Do not put workflows in utilities.

---

# 5. Folder Structure

```text
backend/
│
├── docs/
│   ├── openapi.js
│   │
│   ├── schemas/
│   │   ├── common.schema.js
│   │   ├── auth.schema.js
│   │   ├── user.schema.js
│   │   ├── post.schema.js
│   │   └── comment.schema.js
│   │
│   └── paths/
│       ├── auth.paths.js
│       ├── user.paths.js
│       ├── post.paths.js
│       ├── comment.paths.js
│       └── admin.paths.js
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   └── passport.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   └── admin.controller.js
│   │
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   ├── rateLimiter.js
│   │   ├── activityLogger.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── RefreshToken.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── ActivityLog.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   └── admin.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── post.service.js
│   │   ├── comment.service.js
│   │   └── admin.service.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── post.validator.js
│   │   └── comment.validator.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── slug.js
│   │   ├── response.js
│   │   └── sanitize.js
│   │
│   ├── constants/
│   │   ├── roles.js
│   │   ├── providers.js
│   │   └── errors.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Do not create folders without a clear responsibility.

---

# 6. Application Bootstrap

`server.js`:

- Connect to MongoDB
- Start HTTP server
- Handle graceful shutdown

`app.js`:

- Create Express app
- Configure security middleware
- Configure parsers
- Configure CORS
- Register routes
- Register 404 handler
- Register global error handler

This separation makes integration testing easier.

---

# 7. Environment Variables

Example:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb://localhost:27017/inkly

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback

FRONTEND_URL=http://localhost:5173
```

Never commit `.env`.

Commit `.env.example`.

Never expose:

```text
MONGO_URI
JWT secrets
OAuth client secrets
```

to the React frontend.

---

# 8. Authentication Architecture

Inkly has three authentication entry points:

```text
Email + Password
Google OAuth 2.0
Facebook/Meta OAuth 2.0
```

All three converge into **one Inkly User identity**:

```text
Email/password ───┐
Google ───────────┤
Facebook ─────────┤
                  ↓
             Inkly User
                  ↓
       Access JWT + Refresh Token
                  ↓
            Protected APIs
```

OAuth authenticates the external identity.

Inkly owns the application user and application session.

---

# 9. User Model

Use **one User model**.

Do NOT create:

```text
GoogleUser
FacebookUser
LocalUser
```

Conceptual fields:

```text
_id
name
email
passwordHash
googleId
facebookId
avatar
role
createdAt
updatedAt
```

Role:

```text
user
admin
```

Provider IDs should have appropriate indexes/uniqueness constraints while allowing missing values.

---

# 10. Account Linking

When Google or Facebook authentication succeeds:

```text
Provider identity
       ↓
Find by provider ID
       ↓
If found → authenticate existing user
       ↓
If not found → find by verified email
       ↓
Existing account → link provider according to policy
       ↓
No account → create user
       ↓
Create Inkly session
```

The canonical application identity is always:

```text
User._id
```

Provider IDs are external identifiers only.

Posts, comments, activity logs and JWT `sub` must reference the Inkly user ID.

---

# 11. OAuth

Use Passport:

```text
passport
passport-google-oauth20
passport-facebook
```

Passport configuration belongs in:

```text
src/config/passport.js
```

Provider-specific configuration must not be scattered through controllers.

OAuth routes:

```text
GET /api/v1/auth/google
GET /api/v1/auth/google/callback

GET /api/v1/auth/facebook
GET /api/v1/auth/facebook/callback
```

The Passport callback must delegate account handling to `AuthService`.

Do not create users directly inside a strategy callback.

---

# 12. Local Authentication

Required:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

Registration:

```text
validate
 ↓
check duplicate email
 ↓
bcrypt hash
 ↓
create user
 ↓
create session/tokens
```

Login:

```text
validate
 ↓
find user
 ↓
bcrypt.compare
 ↓
create session/tokens
```

---

# 13. Password Security

Use bcrypt.

Never store plaintext passwords.

Never return `passwordHash`.

Never log passwords.

Do not accept arbitrary password-related fields through mass assignment.

---

# 14. JWT Architecture

Use:

```text
Access Token
Refresh Token
```

Access token:

- Short-lived
- Used for protected API requests

Refresh token:

- Long-lived
- Used to obtain new access tokens
- Treated as a credential/session

Minimal access JWT example:

```json
{
  "sub": "USER_ID",
  "role": "user"
}
```

Do not put sensitive personal data into JWTs.

---

# 15. Refresh Token Model

Recommended fields:

```text
_id
userId
tokenHash or tokenIdentifier
expiresAt
revokedAt
createdAt
```

Recommended architecture:

```text
Refresh token
      ↓
Secure HttpOnly cookie
      ↓
POST /api/v1/auth/refresh
      ↓
Validate/revoke/rotate
      ↓
New access token
```

Do not store long-lived plaintext refresh tokens unnecessarily.

---

# 16. Authentication Middleware

`middleware/authenticate.js`:

```text
Authorization header
       ↓
Bearer token
       ↓
Verify JWT
       ↓
Extract user ID/role
       ↓
Attach req.user
```

Example:

```javascript
req.user = {
  id,
  role
};
```

It must not contain login/business workflows.

---

# 17. RBAC Middleware

`middleware/authorize.js`:

```text
authorize("admin")
authorize("user", "admin")
```

Rules:

```text
No valid authentication → 401
Authenticated but insufficient role → 403
```

Frontend role checks are only UX protection.

The API must always enforce authorization.

---

# 18. Ownership Authorization

Roles alone are insufficient.

Example:

```text
User A → edit User B's post → 403
User A → delete User B's comment → 403
Admin → manage User B's post → allowed
```

Ownership checks belong in the relevant service because they require resource data.

Example:

```text
authenticate
 ↓
controller
 ↓
PostService.updatePost()
 ↓
find post
 ↓
if admin → allow
else if post.author !== req.user.id → reject
else → update
```

---

# 19. Validation

Use Zod.

Validation schemas belong in:

```text
src/validators/
```

Validate:

- Body
- Params
- Query
- Pagination
- Email
- Password
- IDs
- Post fields
- Comment fields

Flow:

```text
Route
 ↓
authenticate
 ↓
validate(schema)
 ↓
controller
 ↓
service
```

Backend validation is authoritative even if React also validates.

---

# 20. API Versioning

All endpoints must use:

```text
/api/v1
```

Examples:

```text
/api/v1/auth/login
/api/v1/posts
/api/v1/comments
/api/v1/admin/users
```

Do not mix API versions without a documented reason.

---

# 21. REST API

## Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me

GET    /api/v1/auth/google
GET    /api/v1/auth/google/callback

GET    /api/v1/auth/facebook
GET    /api/v1/auth/facebook/callback
```

## Posts

```text
GET    /api/v1/posts
GET    /api/v1/posts/:id
GET    /api/v1/posts/slug/:slug
GET    /api/v1/posts/me
POST   /api/v1/posts
PATCH  /api/v1/posts/:id
DELETE /api/v1/posts/:id
```

## Comments

```text
GET    /api/v1/posts/:postId/comments
POST   /api/v1/posts/:postId/comments
PATCH  /api/v1/comments/:id
DELETE /api/v1/comments/:id
```

## Admin

```text
GET    /api/v1/admin/dashboard

GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id

GET    /api/v1/admin/posts
PATCH  /api/v1/admin/posts/:id
DELETE /api/v1/admin/posts/:id

GET    /api/v1/admin/comments
PATCH  /api/v1/admin/comments/:id
DELETE /api/v1/admin/comments/:id
```

Specific routes such as `/posts/me` must be registered before `/posts/:id` to avoid route ambiguity.

---

# 22. Response Format

Successful response:

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {}
}
```

Collection:

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

Do not create different response shapes for different endpoints without a strong reason.

---

# 23. OpenAPI + Swagger API Documentation

OpenAPI + Swagger UI is the **official API documentation and API contract** for the Inkly backend.

These rules are **NON-NEGOTIABLE**.

They do not replace Express, MongoDB, Mongoose, MVC + Service Layer, JWT, Passport OAuth, Zod, Jest, or Supertest. They document and constrain the classic MERN REST API.

## 23.1 OpenAPI is the official API contract

Every REST API endpoint implemented by the backend MUST have a corresponding OpenAPI definition.

The OpenAPI specification must document:

```text
HTTP method
endpoint/path
summary
description where useful
authentication requirements
required role/permissions
path parameters
query parameters
request body
request body validation/schema
success response
possible error responses
response schema
pagination where applicable
```

No implemented endpoint may exist without a matching OpenAPI definition.

## 23.2 Swagger UI

Integrate Swagger UI into the Express backend.

Expose documentation at:

```text
GET /api-docs
```

Development example:

```text
http://localhost:5000/api-docs
```

Swagger UI must load the project's OpenAPI specification.

## 23.3 OpenAPI specification structure

Use OpenAPI 3.x.

Keep the OpenAPI specification modular and maintainable.

Do NOT create one enormous undocumented JavaScript object inside `server.js` or `app.js`.

Required structure:

```text
backend/
├── docs/
│   ├── openapi.js
│   │
│   ├── schemas/
│   │   ├── common.schema.js
│   │   ├── auth.schema.js
│   │   ├── user.schema.js
│   │   ├── post.schema.js
│   │   └── comment.schema.js
│   │
│   └── paths/
│       ├── auth.paths.js
│       ├── user.paths.js
│       ├── post.paths.js
│       ├── comment.paths.js
│       └── admin.paths.js
│
└── src/
    └── ...
```

OpenAPI/Swagger documentation MUST live only under `docs/`.

Do NOT place OpenAPI definitions, Swagger annotations, or documentation objects inside:

```text
controllers/
routes/
services/
models/
middleware/
validators/
```

This preserves the project's clean separation of concerns:

```text
docs/  → API contract (OpenAPI)
src/   → API implementation (Express MVC + Service Layer)
```

`docs/openapi.js` assembles the modular schemas and paths into the OpenAPI 3.x document.

`docs/schemas/` holds reusable request/response/object schemas (including shared success, collection, error, and pagination shapes in `common.schema.js`).

`docs/paths/` holds endpoint definitions grouped by domain.

`src/` implements routes, middleware, controllers, services, and models. It must not own the API contract.

## 23.4 Documentation must stay synchronized with implementation

Whenever a new API endpoint is created, the developer MUST create/update its OpenAPI documentation in the **same implementation task**.

Example:

Creating:

```text
POST /api/v1/posts
```

must also create/update the corresponding OpenAPI path definition.

Do not consider the endpoint complete until all of the following are appropriately handled:

```text
Route
Middleware
Validation
Controller
Service
Model
Tests
OpenAPI documentation
```

## 23.5 API-first development rule

Before implementing a new API endpoint, define its API contract:

```text
endpoint
request
response
authentication
authorization
errors
```

Then implement the endpoint according to that contract.

The OpenAPI definition is the source of truth for frontend/backend communication.

## 23.6 Reusable OpenAPI schemas

Create reusable OpenAPI schemas for common objects.

Place shared wrappers and cross-cutting shapes in:

```text
docs/schemas/common.schema.js
```

Examples:

```text
User
PublicUser
Post
Comment
Pagination
ApiError
AuthResponse
LoginRequest
RegisterRequest
CreatePostRequest
UpdatePostRequest
CreateCommentRequest
```

Also reuse shared response wrappers such as:

```text
SuccessResponse
CollectionResponse
ErrorResponse
```

Keep domain schemas in their matching files under `docs/schemas/` (`auth`, `user`, `post`, `comment`).

Do not duplicate identical schemas across many endpoints.

Do not define these schemas inside controllers, routes, or services.

## 23.7 Authentication documentation

Document JWT authentication using OpenAPI security schemes.

Define:

```text
BearerAuth
```

for access-token-protected APIs.

Document which endpoints require authentication.

Document which endpoints require:

```text
user
```

or:

```text
admin
```

roles.

Examples:

```text
GET /api/v1/auth/me
→ requires BearerAuth

GET /api/v1/admin/dashboard
→ requires BearerAuth + admin authorization
```

## 23.8 Refresh-token documentation

Document the refresh endpoint:

```text
POST /api/v1/auth/refresh
```

The refresh token is stored in an HttpOnly cookie.

Do NOT document the refresh token as a frontend-readable JSON field.

Document the refresh endpoint as cookie-based authentication/session renewal.

## 23.9 OAuth documentation

Document:

```text
GET /api/v1/auth/google
GET /api/v1/auth/google/callback

GET /api/v1/auth/facebook
GET /api/v1/auth/facebook/callback
```

Clearly explain in the OpenAPI documentation that Google and Facebook authentication ultimately create/authenticate the same Inkly User identity and result in the application's normal authentication/session flow.

OAuth documentation describes redirects and outcomes.

It must not describe Passport strategy internals as business logic inside Swagger.

## 23.10 Standard response schemas

Use the project's standard response structure.

Success:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Collection:

```json
{
  "success": true,
  "message": "...",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

Error:

```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

Document these structures in reusable OpenAPI schemas.

## 23.11 Standard HTTP status codes

OpenAPI documentation must accurately document relevant status codes:

```text
200
201
204
400
401
403
404
409
422
429
500
```

Do not document status codes that the endpoint does not actually return.

## 23.12 Validation alignment

OpenAPI request schemas must remain aligned with backend Zod validation.

Do not create an OpenAPI request schema that contradicts the Zod validator.

If the Zod validation changes, the OpenAPI schema must be updated in the same change.

## 23.13 Pagination documentation

Endpoints supporting pagination must document:

```text
page
limit
```

and their constraints.

Example:

```text
GET /api/v1/posts?page=1&limit=10
```

Document the pagination response.

## 23.14 API versioning

All application APIs must use:

```text
/api/v1
```

Swagger/OpenAPI documentation must reflect this exact versioned API structure.

## 23.15 Swagger security

Swagger UI should be available in development.

For production, follow the project's security policy and do not expose sensitive internal information.

Never expose:

```text
password hashes
JWT secrets
refresh-token secrets
OAuth client secrets
database credentials
internal infrastructure credentials
```

## 23.16 Swagger is documentation, NOT business logic

OpenAPI documentation must never contain:

```text
database queries
business logic
authentication implementation
authorization implementation
```

Swagger only describes the API contract.

## 23.17 Definition of Done for APIs

A backend API is NOT considered complete unless:

```text
Route exists
Validation exists
Authentication/authorization is correct
Controller exists
Service exists
Model interaction is correct
Tests exist where applicable
OpenAPI documentation exists
Swagger UI displays the endpoint correctly
```

## 23.18 Cursor implementation rule

Whenever Cursor or an AI coding assistant is asked to create a new backend API:

FIRST determine:

```text
1. HTTP method
2. endpoint
3. authentication requirement
4. authorization requirement
5. request schema
6. response schema
7. error responses
8. pagination if applicable
```

Then implement:

```text
Route
→ Middleware
→ Controller
→ Service
→ Model
```

AND update:

```text
OpenAPI specification
```

AND tests.

Never create a backend endpoint without updating its OpenAPI documentation.

## 23.19 Swagger verification

After creating or modifying an API endpoint, verify that:

```text
Swagger UI loads
Endpoint appears in the correct tag/category
Request schema is correct
Response schema is correct
Authentication is correctly represented
Parameters are correctly represented
Error responses are documented
```

## 23.20 API tags

Group Swagger endpoints logically:

```text
Authentication
Users
Posts
Comments
Admin
```

Keep the Swagger UI organized and easy to understand.

## 23.21 Documentation quality

Swagger descriptions should be concise and useful.

Avoid descriptions such as:

```text
Gets posts.
```

Prefer:

```text
Returns a paginated list of non-deleted blog posts. Supports pagination and optional filtering.
```

Do not generate meaningless documentation just to satisfy coverage.

## 23.22 No stale documentation

When an endpoint is renamed, removed, or its request/response contract changes:

```text
UPDATE THE OPENAPI DOCUMENTATION IN THE SAME CHANGE.
```

There must not be obsolete endpoints remaining in Swagger.

## 23.23 API contract priority

For frontend/backend coordination:

```text
Requirements
↓
OpenAPI contract
↓
Backend implementation
↓
Frontend integration
```

The React frontend should use the OpenAPI contract when integrating APIs.

---

# 24. Centralized Error Handling

Create:

```text
middleware/errorHandler.js
middleware/notFound.js
```

Flow:

```text
Controller
 ↓
Service throws error
 ↓
next(error)
 ↓
Global error handler
 ↓
Consistent JSON
```

Do not repeat complex error-response logic in every controller.

Never expose:

```text
stack traces
MongoDB internals
password hashes
JWT secrets
OAuth secrets
```

in production responses.

---

# 25. Post Model

Required fields:

```text
_id
title
slug
content
author
isDeleted
deletedAt
createdAt
updatedAt
```

`author` references:

```text
User._id
```

---

# 26. Slug Generation

Backend generates authoritative slugs.

Example:

```text
Title:
How AI Is Changing Web Development

Slug:
how-ai-is-changing-web-development
```

Slug generation belongs in the post service/utilities.

Do not trust a client-provided slug.

Ensure uniqueness.

Possible result:

```text
how-ai-is-changing-web-development
how-ai-is-changing-web-development-2
```

---

# 27. Post CRUD

Create:

```text
POST /api/v1/posts
```

Read:

```text
GET /api/v1/posts
GET /api/v1/posts/:id
GET /api/v1/posts/slug/:slug
```

Update:

```text
PATCH /api/v1/posts/:id
```

Delete:

```text
DELETE /api/v1/posts/:id
```

Delete means **soft delete** for normal post management.

---

# 28. Soft Deletes

Use:

```text
isDeleted
deletedAt
```

Example:

```text
isDeleted: true
deletedAt: <timestamp>
```

Public queries exclude deleted posts.

Admin queries may include them where appropriate.

The service layer must explicitly control inclusion of deleted records.

---

# 29. Post Ownership

Regular users:

```text
Create own posts
Edit own posts
Delete own posts
```

Admins:

```text
Manage all posts
```

Never accept the authoritative `author` from request body.

Derive it from:

```text
req.user.id
```

---

# 30. Comment Model

Fields:

```text
_id
content
author
post
createdAt
updatedAt
```

References:

```text
author → User
post → Post
```

---

# 31. Comment CRUD

```text
GET    /api/v1/posts/:postId/comments
POST   /api/v1/posts/:postId/comments
PATCH  /api/v1/comments/:id
DELETE /api/v1/comments/:id
```

Regular users:

```text
Create comments
Edit own comments
Delete own comments
```

Admins:

```text
Manage all comments
```

---

# 32. MongoDB Population

Populate only what the endpoint actually needs.

For posts, typically:

```text
author.name
author.avatar
```

Never populate:

```text
passwordHash
refresh tokens
private credentials
```

Avoid deep/unnecessary population.

---

# 33. Pagination

All potentially large collections must be paginated.

Example:

```text
GET /api/v1/posts?page=1&limit=10
```

Validate:

```text
page >= 1
1 <= limit <= maximum
```

Use MongoDB pagination:

```text
skip = (page - 1) * limit
```

Never load an entire collection into Node.js just to paginate in memory.

---

# 34. Indexing

Recommended indexes:

User:

```text
email
googleId
facebookId
```

Post:

```text
slug
author
createdAt
isDeleted
```

Comment:

```text
post
author
createdAt
```

Use compound indexes where query patterns justify them.

Do not add indexes randomly.

---

# 35. Query Optimization

Prefer:

```text
MongoDB filtering
+
projection
+
pagination
+
indexes
```

Avoid:

```text
fetch everything
 ↓
filter in Node.js
```

Only populate necessary fields.

---

# 36. Admin Dashboard

Endpoint:

```text
GET /api/v1/admin/dashboard
```

Required statistics:

```text
Total Users
Total Posts
Total Comments
```

Use database count/aggregation operations.

Do not calculate totals by downloading every record.

Protected by:

```text
authenticate
authorize("admin")
```

---

# 37. Admin User Management

Admins can manage users.

```text
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
```

Do not allow public registration to set:

```text
role = admin
```

Server must ignore/reject client role elevation.

An initial admin should be provisioned through controlled backend setup/seed logic.

---

# 38. Admin Post Management

Admins can:

- View all posts
- Edit posts
- Delete/manage posts

Admin APIs must still go through services.

Do not bypass service-layer logic just because the caller is an admin.

---

# 39. Admin Comment Management

Admins can:

- View comments
- Edit comments
- Delete comments

Use:

```text
authenticate
authorize("admin")
```

---

# 40. Activity Logging

The assignment requires logging actions such as:

```text
LOGIN
POST_CREATED
POST_DELETED
```

Recommended `ActivityLog`:

```text
user
action
resourceType
resourceId
metadata
ipAddress
createdAt
```

Example:

```text
user: 123
action: POST_CREATED
resourceType: Post
resourceId: 456
```

Never log:

```text
passwords
password hashes
access tokens
refresh tokens
OAuth secrets
```

Use reusable logging mechanisms rather than duplicating logging code in every controller.

---

# 41. Security Middleware

At application level use:

```text
helmet
cors
express.json
express-rate-limit
```

CORS must use configured frontend origins.

Do not use unrestricted production CORS when credentials are involved.

---

# 42. Rate Limiting

Protect authentication endpoints:

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
```

and relevant OAuth routes as appropriate.

Use `express-rate-limit`.

Use stricter limits for credential endpoints than normal API endpoints.

---

# 43. CORS

Development:

```text
http://localhost:5173
```

Production:

```text
configured frontend domain
```

Use:

```env
FRONTEND_URL=
```

Never blindly trust arbitrary origins.

---

# 44. Mass Assignment Protection

Never do:

```javascript
User.create(req.body)
```

or:

```javascript
User.findByIdAndUpdate(id, req.body)
```

without whitelisting.

Client must not control:

```text
role
author
createdAt
updatedAt
isDeleted
deletedAt
passwordHash
```

Use explicit allowed fields.

---

# 45. Request Query Safety

Validate query parameters.

For example:

```text
page
limit
search
sort
```

Only allow approved sort fields.

Do not pass arbitrary MongoDB operators from user input.

---

# 46. ObjectId Validation

Validate IDs where appropriate.

Invalid IDs should produce clean API errors, not raw Mongoose exceptions.

---

# 47. Logging

Server logs should capture useful metadata:

```text
HTTP method
route
status
duration
request ID if used
```

Never log credentials or tokens.

---

# 48. Graceful Shutdown

Handle:

```text
SIGINT
SIGTERM
```

Flow:

```text
stop accepting requests
 ↓
close MongoDB connection
 ↓
exit
```

Keep implementation straightforward.

---

# 49. Testing

Use:

```text
Jest
Supertest
```

Structure:

```text
tests/
├── unit/
│   ├── services/
│   ├── utils/
│   └── validators/
│
└── integration/
    ├── auth/
    ├── posts/
    ├── comments/
    └── admin/
```

Unit test:

- Services
- Utilities
- Validators
- Business rules

Integration test:

- HTTP endpoints
- Authentication
- Authorization
- CRUD
- Ownership
- Admin flows

---

# 50. Required Test Matrix

At minimum:

```text
Register successfully
Duplicate email
Login successfully
Wrong password
Refresh token
Logout

Unauthenticated protected endpoint → 401
Regular user admin endpoint → 403
Admin admin endpoint → success

User creates post
User edits own post
User deletes own post
User attempts to edit another user's post → 403

User creates comment
User edits own comment
User deletes own comment
User attempts to edit another user's comment → 403

Admin dashboard
Admin user management
Admin post management
Admin comment management
```

OAuth tests should mock provider behavior rather than depend on real Google/Meta accounts.

Test:

```text
Existing provider user
New provider user
Verified email matches existing account
Provider failure
Account linking
```

---

# 51. API Status Codes

Use appropriate status codes:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

Do not return HTTP 200 for every error.

---

# 52. Service Layer Rules

Example `post.service.js` methods:

```text
createPost()
getPosts()
getPostById()
getPostBySlug()
getMyPosts()
updatePost()
softDeletePost()
```

Example `comment.service.js`:

```text
getComments()
createComment()
updateComment()
deleteComment()
```

Example `auth.service.js`:

```text
register()
login()
logout()
refresh()
getCurrentUser()
handleGoogleLogin()
handleFacebookLogin()
```

Services should have clear inputs and outputs.

---

# 53. Controller Rules

Controllers must stay thin.

Conceptually:

```javascript
async function createPost(req, res, next) {
  try {
    const post = await postService.createPost({
      ...req.body,
      authorId: req.user.id
    });

    return sendSuccess(
      res,
      201,
      "Post created successfully",
      post
    );
  } catch (error) {
    next(error);
  }
}
```

Do not put database/business logic into the controller.

---

# 54. Database Access Rule

Controllers must NEVER directly execute:

```javascript
Post.find()
User.find()
Comment.find()
```

Always:

```text
Controller
   ↓
Service
   ↓
Model
```

This is a strict architectural rule.

---

# 55. Authentication vs Authorization

Authentication asks:

> Who are you?

Implemented through:

```text
OAuth
JWT
authenticate middleware
```

Authorization asks:

> Are you allowed to do this?

Implemented through:

```text
authorize middleware
ownership checks
service business rules
```

Keep these concepts separate.

---

# 56. Admin Identity

A public request must never be allowed to elevate itself:

```json
{
  "role": "admin"
}
```

The backend owns role assignment.

Default registration:

```text
role = user
```

Admin promotion must happen through trusted server-side mechanisms.

---

# 57. Soft Delete Rules

Normal user APIs:

```text
exclude deleted records
```

Admin APIs:

```text
may include deleted records where useful
```

Services must explicitly decide whether deleted records are included.

Do not accidentally expose deleted content through normal public endpoints.

---

# 58. Optional Socket.io

Socket.io is bonus functionality.

Do not implement it until:

```text
Authentication
Posts
Comments
Admin
Validation
Errors
Tests
```

are complete.

Socket.io must not replace REST APIs for core CRUD.

---

# 59. Avoid Over-Engineering

Do NOT introduce:

```text
Microservices
Kafka
CQRS
GraphQL
Redis
Complex DI containers
Repository factories everywhere
Event buses
Distributed systems
```

unless explicitly required.

A clean monolithic Express backend is the correct architecture for this assignment.

---

# 60. Repository Layer

A repository layer is optional.

The assignment requires:

```text
controllers
services
models
routes
middleware
```

It does not require repositories.

Default:

```text
Service → Mongoose Model
```

Do not create:

```text
Service → Repository → DAO → Model
```

without a real need.

---

# 61. Requirement Traceability

| Requirement | Backend implementation |
|---|---|
| Node.js | Node runtime |
| Express | Express REST API |
| MongoDB | MongoDB |
| Mongoose | Models |
| Registration | AuthService |
| Login | AuthService |
| Logout | AuthService |
| Access JWT | JWT utility/service |
| Refresh tokens | RefreshToken + AuthService |
| bcrypt | Password utility |
| Google OAuth | Passport Google |
| Facebook OAuth | Passport Facebook |
| Rate limiting | express-rate-limit |
| Roles | User.role |
| RBAC | authorize middleware |
| API-level authorization | Middleware + services |
| Post CRUD | PostController + PostService |
| Slugs | PostService + slug utility |
| Soft delete | Post model/service |
| Comments | CommentController + CommentService |
| Comment ownership | CommentService |
| Admin users | AdminController + AdminService |
| Admin posts | AdminController + PostService |
| Admin comments | AdminController + CommentService |
| Dashboard statistics | AdminService |
| Validation | Zod middleware |
| REST routing | Express Router |
| Versioning | `/api/v1` |
| Central errors | errorHandler |
| Activity logging | ActivityLog + logging |
| Pagination | Service/model queries |
| Indexing | Mongoose indexes |
| Population | Controlled populate |
| Testing | Jest + Supertest |
| OpenAPI contract | `docs/` OpenAPI 3.x specification |
| Swagger UI | `GET /api-docs` |

---

# 62. Cursor / AI Development Rules

Before modifying backend code, Cursor MUST read:

```text
backend-architecture.md
frontend-architecture.md
design.md
```

For backend work, this document is authoritative.

AI MUST:

1. Follow the folder structure.
2. Preserve separation of concerns.
3. Keep controllers thin.
4. Put business logic in services.
5. Keep persistence in models.
6. Use reusable middleware.
7. Keep OAuth provider logic isolated.
8. Use one User model for all authentication methods.
9. Use User._id as the canonical identity.
10. Enforce RBAC at the API level.
11. Enforce ownership server-side.
12. Validate external input.
13. Use centralized error handling.
14. Use consistent responses.
15. Use `/api/v1`.
16. Paginate large collections.
17. Use indexes intentionally.
18. Avoid unnecessary population.
19. Never expose secrets.
20. Never return password hashes.
21. Write tests for important behavior.
22. Reuse existing services/utilities.
23. Avoid duplicate logic.
24. Do not bypass the service layer.
25. Do not introduce Next.js.
26. Do not introduce another backend framework.
27. Do not introduce microservices.
28. Do not modify frontend architecture unless explicitly requested.
29. Every new or modified API endpoint MUST include a corresponding OpenAPI documentation update. Swagger UI must remain synchronized with the actual backend implementation.

---

# 63. Before Creating a New File

Ask:

```text
Does this responsibility already have a home?
```

If yes:

```text
Reuse or extend it.
```

If no:

```text
Create the smallest appropriate abstraction.
```

Avoid files such as:

```text
postService2.js
postHelpers.js
postManager.js
postBusinessLogic.js
```

when `post.service.js` already owns the responsibility.

---

# 64. Definition of Done

A backend feature is complete only when:

```text
Route
 ↓
Middleware
 ↓
Validation
 ↓
Controller
 ↓
Service
 ↓
Model
 ↓
Database
```

is correctly implemented.

Also verify:

- Authentication is enforced where required.
- Authorization is enforced where required.
- Ownership is enforced.
- Input is validated.
- Errors are centralized.
- Responses are consistent.
- Sensitive data is protected.
- Pagination exists where appropriate.
- Database queries are reasonable.
- Tests cover important behavior.
- OpenAPI documentation exists and matches the implementation.
- Swagger UI displays the endpoint correctly.
- No architectural boundary has been violated.

---

# 65. Final Architecture

```text
                         CLIENT
                           │
                        HTTP/HTTPS
                           │
                           ▼
                    ┌──────────────┐
                    │ Express App  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Routes    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Middleware   │
                    │              │
                    │ Auth         │
                    │ RBAC         │
                    │ Validation   │
                    │ Rate Limit   │
                    │ Logging      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Controllers  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Services    │
                    │              │
                    │ Auth         │
                    │ User         │
                    │ Post         │
                    │ Comment      │
                    │ Admin        │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Mongoose     │
                    │ Models       │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   MongoDB    │
                    └──────────────┘


              EXTERNAL AUTHENTICATION
                       │
             ┌─────────┴─────────┐
             │                   │
          Google                Meta
             │                   │
             └─────────┬─────────┘
                       ▼
                 Passport OAuth
                       │
                       ▼
                  AuthService
                       │
                       ▼
                  Inkly User
                       │
                       ▼
             Access + Refresh Tokens
```

## Final Principle

The backend should be:

**Simple + clear + modular + secure + testable + maintainable.**

The evaluator should immediately be able to answer:

```text
Where are the routes?
Where is authentication?
Where is authorization?
Where is validation?
Where is the business logic?
Where are the models?
Where are errors handled?
Where are tests?
Where is the OpenAPI / Swagger documentation?
```

The answer to each must be obvious.

**Classic MERN. Express REST API. MVC + Service Layer. Strict separation of concerns. One application identity. Secure authentication. API-level authorization. OpenAPI contract. Clean and maintainable code.**
