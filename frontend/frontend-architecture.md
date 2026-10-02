# Inkly Frontend Architecture

## 1. Purpose

This document is the **single source of truth for the Inkly React frontend architecture**.

The project must strictly follow the assignment requirements and the classic MERN architecture.

The frontend is:

- React.js
- Vite
- pnpm
- Ninna UI
- React Router
- Context API
- Functional components
- React Hooks

The backend is a separate application and will be documented in a separate `backend-architecture.md` file.

The frontend must communicate with the backend only through the documented REST API.

---

# 2. Non-Negotiable Architecture Decision

## Classic MERN stack

Use:

```text
MongoDB
Express.js
React.js
Node.js
```

Frontend:

```text
React + Vite
pnpm
Ninna UI 0.6.0
```

## Package manager

The frontend package manager is **pnpm 10.17.1**. This is mandatory.

Do not use npm, Yarn, or Bun to install dependencies or run scripts in `frontend/`.

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm add <package>
```

`frontend/package.json` must keep:

```json
"packageManager": "pnpm@10.17.1"
```

Commit `frontend/pnpm-lock.yaml`. Do not commit `node_modules`.

Future commands and AI assistants must use these pnpm commands.

Backend:

```text
Node.js + Express.js
```

Database:

```text
MongoDB + Mongoose
```

## Do NOT use Next.js

This project intentionally does NOT use:

- Next.js
- Next.js API routes
- Next.js Server Actions
- Next.js Server Components
- Next.js middleware as a replacement for Express middleware
- Server-side business logic inside React

The assignment explicitly requests a MERN application, so the architecture must remain a classic React SPA communicating with an Express REST API.

## UI library

The frontend UI library is **Ninna UI 0.6.0** (https://ninna-ui.dev). Tailwind CSS v4 is configured only through `src/styles/globals.css`. Do not add `tailwind.config.js`.

Do not install another component library. Do not import `@ninna-ui/react-internal` or `@ninna-ui/utils`.

Theme preset: `default`. The document root sets `data-theme="default"`.

---

# 3. Frontend Responsibility

The frontend is responsible for:

- Rendering the UI
- Client-side routing
- Authentication state
- Form handling
- Client-side validation where appropriate
- Calling REST APIs
- Displaying API responses
- Loading states
- Error states
- Role-based UI visibility
- Protected frontend routes
- User interactions
- Accessibility
- Responsive design

The frontend is NOT responsible for:

- Authorizing users
- Enforcing admin permissions
- Generating authoritative security decisions
- Hashing passwords
- Validating JWT signatures
- Managing refresh tokens as business logic
- Generating authoritative slugs
- Performing MongoDB queries
- Implementing business rules that belong to the backend

The backend is always the security authority.

---

# 4. High-Level Architecture

```text
                         Browser
                            │
                            ▼
                   React + Vite SPA
                            │
             ┌──────────────┴──────────────┐
             │                             │
       React Router                   Auth Context
             │                             │
             └──────────────┬──────────────┘
                            │
                            ▼
                       API Client
                         Axios
                            │
                            │ HTTP / HTTPS
                            ▼
                  Express REST API
                            │
                     Backend Layer
                            │
                            ▼
                        MongoDB
```

The React application must never directly connect to MongoDB.

---

# 5. Project Root Structure

Recommended repository:

```text
inkly/
│
├── frontend/
│
├── backend/
│
├── design.md
├── frontend-architecture.md
├── backend-architecture.md
├── README.md
└── .gitignore
```

The frontend and backend are separate applications.

---

# 6. Frontend Folder Structure

Use the following structure as the default architecture:

```text
frontend/
│
├── public/
│   └── ...
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── users/
│   │   └── admin/
│   │
│   ├── pages/
│   │   ├── public/
│   │   ├── user/
│   │   └── admin/
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   ├── UserLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── usePosts.js
│   │   ├── useComments.js
│   │   └── useUsers.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── post.service.js
│   │   ├── comment.service.js
│   │   ├── user.service.js
│   │   └── admin.service.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── post.validator.js
│   │   └── comment.validator.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── ...
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .env.example
├── index.html
├── package.json
├── pnpm-lock.yaml
└── vite.config.js
```

Do not create folders simply because they are common in tutorials.

Every folder must have a clear responsibility.

## Scaffold state

The initial scaffold is a bare Vite + React app plus the directories in the tree above.

`src/main.jsx` and `src/App.jsx` are the only React entry files. `App` renders nothing.

The `.jsx` and `.js` names shown inside those directories are the target layout. They do not exist yet. Add a page, layout, route, context, hook, service, validator, or component only when that feature is being implemented.

---

# 7. Separation of Concerns

The most important frontend architecture rule is:

> Components render. Pages compose. Hooks coordinate. Services communicate with the API. Context owns global state. Routes control navigation. Utilities provide reusable pure functions.

Avoid putting everything into page components.

Bad:

```text
Login.jsx
    ├── axios call
    ├── token handling
    ├── validation
    ├── navigation
    ├── UI
    └── authentication state
```

Preferred:

```text
Login.jsx
      │
      ├── AuthContext
      │
      ├── auth.service.js
      │
      └── auth.validator.js
```

---

# 8. Pages

Pages represent route-level screens.

Pages should compose components and connect them to hooks/context.

Pages should NOT contain large amounts of reusable UI.

Public:

```text
pages/public/
├── Home.jsx
├── PostDetails.jsx
├── Login.jsx
└── Register.jsx
```

User:

```text
pages/user/
├── Dashboard.jsx
├── MyPosts.jsx
├── CreatePost.jsx
└── EditPost.jsx
```

Admin:

```text
pages/admin/
├── Dashboard.jsx
├── Users.jsx
├── Posts.jsx
└── Comments.jsx
```

A page should primarily answer:

> What does this route render?

---

# 9. Layouts

Layouts provide common page structure.

## PublicLayout

Used by:

```text
/
 /posts/:slug
 /login
 /register
```

Contains:

```text
Navbar
Page content
Footer
```

## UserLayout

Used by:

```text
/dashboard
/dashboard/posts
/dashboard/posts/new
/dashboard/posts/:id/edit
```

Contains:

```text
Authenticated Header
User Sidebar
Page content
```

## AdminLayout

Used by:

```text
/admin
/admin/users
/admin/posts
/admin/comments
```

Contains:

```text
Admin Header
Admin Sidebar
Page content
```

Do not duplicate navigation markup inside individual pages.

---

# 10. Components

Components are reusable UI building blocks.

## Common

`src/components/common/` is the shared component location.

It is only for a reusable component that Ninna UI does not provide, plus the shared Inkly button. One component per file.

`Button.jsx` is required. It wraps the Ninna UI button from `@ninna-ui/primitives` and applies the Inkly design. Every button in the app must use this file.

Do not add `Input`, `Select`, `Modal`, `Skeleton`, `EmptyState`, `Pagination`, or `Badge` here. Those already exist in Ninna UI. Import them from their Ninna package.

```text
components/common/
├── Button.jsx
└── (Inkly components that are not in Ninna UI)
```

## Layout

```text
components/layout/
├── Navbar.jsx
├── Footer.jsx
├── UserSidebar.jsx
├── AdminSidebar.jsx
└── UserMenu.jsx
```

## Posts

```text
components/posts/
├── PostCard.jsx
├── PostList.jsx
├── PostForm.jsx
├── PostEditor.jsx
└── PostMeta.jsx
```

## Comments

```text
components/comments/
├── CommentList.jsx
├── CommentItem.jsx
└── CommentForm.jsx
```

## Admin

```text
components/admin/
├── AdminStatCard.jsx
├── AdminTable.jsx
├── AdminTableToolbar.jsx
├── ActionMenu.jsx
└── AdminActivity.jsx
```

---

# 11. Component Rules

## Reuse Ninna UI first

This rule is mandatory for every reusable component.

1. Search Ninna UI for the component.
2. If the component is a button, import `Button` from `src/components/common/Button.jsx`. Do not render a raw `<button>`. Do not import `Button` from `@ninna-ui/primitives` in a page or feature file. The shared file is the only button.
3. For every other component Ninna UI exports, import it from the package in the import map below. Do not wrap it and do not recreate it.
4. If Ninna UI does not export it, check `src/components/common/`.
5. Create a new file in `src/components/common/` only when both checks fail.

`src/components/common/Button.jsx` customizes the Ninna UI button to the Inkly design (`appearance`: `primary`, `secondary`, `compact`, `text`, `chip`, `social`, `soft`, `icon`, `surface`, `page`, `pageActive`, `filter`, `filterActive`, `profile`). Add a new appearance there when a screen needs a different button treatment. Do not style a one-off button in a page.

Domain components such as `PostCard` and `CommentForm` stay in their feature folders (`components/posts`, `components/comments`, `components/layout`, `components/admin`). Build them out of Ninna UI components and the shared `Button`. Do not reimplement a button, input, modal, or other Ninna primitive inside those files.

```jsx
import { Button } from '../../components/common/Button'
import { Input, Field } from '@ninna-ui/forms'
import { VStack } from '@ninna-ui/layout'
import { Modal } from '@ninna-ui/overlays'
```

Import each component from exactly one package. Do not guess the package.

| Need | Import |
|---|---|
| Button | `src/components/common/Button.jsx` (wraps `@ninna-ui/primitives`) |
| Badge, Avatar, Text, Heading, Link, IconButton, Divider | `@ninna-ui/primitives` |
| Alert, Loading, Progress, Skeleton, EmptyState, Status, toast | `@ninna-ui/feedback` |
| Input, Textarea, Select, Checkbox, Switch, RadioGroup, Field, Slider, FileUpload | `@ninna-ui/forms` |
| Box, Stack, HStack, VStack, Flex, Grid, Container, Center, Separator | `@ninna-ui/layout` |
| Modal, Drawer, Popover, Tooltip, DropdownMenu | `@ninna-ui/overlays` |
| Tabs, Accordion, Breadcrumbs, Pagination, Stepper | `@ninna-ui/navigation` |
| Card, Stat, Table, DataTable, Timeline | `@ninna-ui/data-display` |

Inkly pieces that Ninna UI does not ship, such as Navbar, Footer, BlogCard, and AuthorMeta, are composed in the feature folder that owns them. Put a component in `src/components/common/` only when more than one feature needs it and Ninna UI has no equivalent.

A component should have one clear responsibility.

Good:

```text
PostCard
```

renders one post card.

Good:

```text
CommentForm
```

handles the comment form UI and submission coordination.

Avoid:

```text
PostCard
```

that also:

- Fetches users
- Fetches comments
- Handles authentication
- Makes admin decisions
- Performs navigation logic
- Contains API calls

Keep components focused.

---

# 12. Services

Services are responsible for API communication.

Example:

```text
services/
├── api.js
├── auth.service.js
├── post.service.js
├── comment.service.js
├── user.service.js
└── admin.service.js
```

Example responsibilities:

```text
auth.service.js
    register()
    login()
    logout()
    refreshToken()
    getCurrentUser()

post.service.js
    getPosts()
    getPostBySlug()
    createPost()
    updatePost()
    deletePost()

comment.service.js
    getComments()
    createComment()
    updateComment()
    deleteComment()

admin.service.js
    getDashboardStats()
    getUsers()
    updateUser()
    deleteUser()
    getAllPosts()
    getAllComments()
```

Services should not contain UI logic.

Bad:

```javascript
if (response.status === 200) {
    showToast("Success");
    navigate("/dashboard");
}
```

The service should return data.

The page/hook decides what the UI should do.

---

# 13. API Client

Create one centralized API client.

```text
services/api.js
```

Use Axios or another HTTP client.

Example conceptual structure:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

All services should use this client.

Do not create separate Axios instances in every service.

---

# 14. API Response Handling

Assume the backend uses a consistent response structure.

Example:

```json
{
  "success": true,
  "message": "Post fetched successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

The frontend should consume the backend contract consistently.

Do not create arbitrary response formats in different services.

---

# 15. Authentication State

Authentication must be global.

Use:

```text
context/AuthContext.jsx
```

The Auth Context is responsible for:

- Current authenticated user
- Authentication status
- Login
- Logout
- Registration
- Session initialization
- Refresh/session recovery
- Authentication loading state

Example conceptual state:

```text
AuthContext
├── user
├── isAuthenticated
├── isLoading
├── login()
├── register()
├── logout()
└── refreshSession()
```

---

# 16. Authentication Flow

The frontend must support:

```text
Register
Login
Logout
JWT access token
Refresh token
Google OAuth
Facebook OAuth
```

The exact token storage strategy must follow the backend security design.

Do not hard-code secrets.

Never store:

```text
JWT_SECRET
GOOGLE_CLIENT_SECRET
FACEBOOK_CLIENT_SECRET
```

in frontend source code.

---

# 17. Access Token Handling

The API client should attach the access token to protected API requests.

Conceptually:

```text
Request
   ↓
API client
   ↓
Authorization: Bearer <access-token>
   ↓
Express API
```

If the backend returns an authentication-expired response, the client may attempt token refresh according to the backend contract.

Avoid implementing authentication logic separately in every component.

---

# 18. Refresh Token Rule

The refresh token is part of the authentication protocol, not normal application state.

The frontend must follow the backend's secure refresh-token implementation.

Do not expose refresh-token secrets in:

```text
React components
localStorage helpers
URL parameters
console logs
```

The frontend must never assume that hiding the admin UI provides security.

---

# 19. Protected Routes

Create:

```text
routes/ProtectedRoute.jsx
```

It protects authenticated user screens.

Example:

```text
/dashboard
/dashboard/posts
/dashboard/posts/new
/dashboard/posts/:id/edit
```

Conceptually:

```text
ProtectedRoute
      │
      ├── not authenticated → /login
      │
      └── authenticated → render route
```

---

# 20. Admin Routes

Create:

```text
routes/AdminRoute.jsx
```

It protects:

```text
/admin
/admin/users
/admin/posts
/admin/comments
```

Conceptually:

```text
AdminRoute
      │
      ├── not authenticated → /login
      │
      ├── authenticated but not admin → /403
      │
      └── admin → render route
```

This is frontend UX protection only.

The backend MUST independently enforce admin authorization.

---

# 21. RBAC Frontend Rule

The frontend may hide controls based on:

```text
user.role
```

For example:

```text
Admin navigation
Admin buttons
Admin pages
```

But:

> Frontend RBAC is NOT security.

A malicious user can bypass React.

Therefore:

```text
React protection
        +
Express authorization middleware
```

must both exist.

---

# 22. Route Structure

Recommended:

```text
/
├── /
├── /posts/:slug
├── /login
├── /register
│
├── /dashboard
├── /dashboard/posts
├── /dashboard/posts/new
├── /dashboard/posts/:id/edit
│
└── /admin
    ├── /users
    ├── /posts
    └── /comments
```

Optional:

```text
/403
/404
```

---

# 23. Functional Component Rule

Use functional components only.

Preferred:

```javascript
function PostCard() {
  return (...);
}
```

or:

```javascript
const PostCard = () => {
  return (...);
};
```

Do not introduce class components.

---

# 24. React Hooks

Use hooks for state and lifecycle behavior.

Examples:

```text
useState
useEffect
useMemo
useCallback
useContext
useRef
```

Create custom hooks when reusable behavior exists.

Examples:

```text
useAuth()
usePosts()
useComments()
useUsers()
```

Do not create custom hooks merely to wrap one line of code.

---

# 25. Data Fetching

Keep API calls out of presentation components where practical.

Preferred:

```text
Page
  ↓
Custom Hook
  ↓
Service
  ↓
API
```

Example:

```text
MyPosts.jsx
      ↓
usePosts()
      ↓
post.service.js
      ↓
GET /api/v1/posts/my
```

This keeps pages easier to maintain and test.

---

# 26. Forms

Forms should be reusable and validated.

Recommended tools:

```text
React Hook Form
Zod
```

or another lightweight validation solution.

Use client-side validation for good UX.

However:

> Backend validation remains authoritative.

Never assume client validation is sufficient for security or data integrity.

---

# 27. Post Form Reuse

Create one reusable post form/editor.

Use it for:

```text
CreatePost.jsx
EditPost.jsx
```

Example:

```text
PostForm
    ├── Title
    ├── Content
    ├── Excerpt
    ├── Category
    └── Tags
```

Create and Edit should not have duplicate form implementations.

---

# 28. Comments

Comment UI should be reusable.

Components:

```text
CommentList
CommentItem
CommentForm
```

Regular users can:

```text
Create comments
Edit own comments
Delete own comments
```

Admins can manage all comments.

The frontend should display appropriate actions based on user identity/role.

The backend remains the final authority.

---

# 29. Posts

Regular users can:

```text
Create own posts
Edit own posts
Delete own posts
```

Admins can:

```text
View all posts
Edit posts
Delete/manage posts
```

The frontend should provide the correct UI.

The backend must enforce ownership and admin permissions.

---

# 30. Admin Screens

Required:

```text
/admin
/admin/users
/admin/posts
/admin/comments
```

Admin Dashboard must display:

```text
Total Users
Total Posts
Total Comments
```

The frontend retrieves these values from the backend.

Do not calculate global platform statistics from paginated frontend data.

---

# 31. Pagination

Pagination should be server-driven.

Example:

```text
GET /api/v1/posts?page=1&limit=10
```

Backend returns pagination metadata.

Example:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

The frontend renders the pagination controls.

Do not download all records and paginate only in the browser.

---

# 32. Search and Filtering

Search/filter state should be represented cleanly.

Example:

```text
/posts?page=1&search=react
```

or:

```text
/admin/users?page=1&role=user
```

The frontend should send filtering parameters to the backend.

Do not fetch the entire database dataset just to filter it in React.

---

# 33. Soft Delete UI

Posts support soft deletion.

The UI should distinguish:

```text
Published
Draft
Deleted
```

Deleted posts may be shown in admin/user management views depending on backend behavior.

Do not imply permanent deletion if the backend implements soft deletion.

Example:

```text
Delete Post

This post will be removed from public view.
```

---

# 34. Error Handling

The frontend should have consistent handling for:

```text
400
401
403
404
409
422
429
500
```

Examples:

```text
401 → Authentication/session issue
403 → Access denied
404 → Resource not found
429 → Too many requests
500 → Server error
```

Do not duplicate custom error logic in every component.

Centralize common API error handling in the API layer/hooks where appropriate.

---

# 35. Loading States

Every API-driven screen must have a loading state.

Examples:

```text
Home
PostDetails
Dashboard
MyPosts
AdminUsers
AdminPosts
AdminComments
```

Prefer skeletons for content-heavy pages.

Avoid blank screens while data is loading.

---

# 36. Empty States

Every collection should have an intentional empty state.

Examples:

```text
No posts yet.
No comments yet.
No users found.
No search results.
```

Empty states should include useful next actions where appropriate.

---

# 37. Error States

Every API-driven page should handle failure gracefully.

Example:

```text
Unable to load posts.

Something went wrong while retrieving your posts.

[ Try Again ]
```

Do not expose raw server errors or stack traces to users.

---

# 38. Environment Variables

Frontend environment variables must use Vite's public environment variable convention.

Example:

```text
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Never put secrets in frontend `.env`.

Frontend variables are ultimately exposed to the browser.

NEVER store:

```text
JWT_SECRET
DATABASE_URL
MONGO_URI
GOOGLE_CLIENT_SECRET
FACEBOOK_CLIENT_SECRET
```

in the frontend.

Create:

```text
.env.example
```

with only safe configuration values.

---

# 39. Security Principles

The frontend must:

- Avoid exposing secrets
- Avoid logging access tokens
- Avoid logging passwords
- Avoid trusting role information for security
- Handle authentication errors safely
- Avoid rendering unsafe HTML
- Sanitize/secure rich content according to backend contract
- Use HTTPS in production
- Use secure API communication

Never use frontend checks as a substitute for backend authorization.

---

# 40. Performance

Keep the frontend efficient without premature optimization.

Use:

```text
Lazy-loaded routes
Memoization where useful
Pagination
Optimized images
Reusable components
Minimal unnecessary re-renders
```

Do not add memoization everywhere.

Optimize based on actual component behavior.

---

# 41. Route Lazy Loading

Where appropriate, lazy-load major page groups:

```text
Public pages
User pages
Admin pages
```

This is especially useful for the admin panel because regular users do not need to download all admin UI immediately.

---

# 42. Accessibility

Every screen must follow accessible UI principles.

Requirements:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Accessible dialogs
- Sufficient color contrast
- Meaningful alt text
- Error messages associated with fields
- Do not use color alone to communicate state

The UI should remain usable without a mouse.

---

# 43. Design System

The visual design must follow:

```text
design.md
```

That document is the source of truth for:

- Colors
- Typography
- Spacing
- Buttons
- Cards
- Forms
- Navigation
- Tables
- Modals
- Responsive behavior
- Public pages
- User pages
- Admin pages

Do not introduce a separate design system inside the frontend architecture.

---

# 44. Public Screens

Required:

```text
Home
Post Details
Login
Register
```

These should use:

```text
PublicLayout
```

---

# 45. User Screens

Required:

```text
User Dashboard
My Posts
Create Post
Edit Post
```

These should use:

```text
UserLayout
ProtectedRoute
```

---

# 46. Admin Screens

Required:

```text
Admin Dashboard
Manage Users
Manage Posts
Manage Comments
```

These should use:

```text
AdminLayout
ProtectedRoute
AdminRoute
```

---

# 47. Frontend Route Map

```text
PUBLIC
/
├── Home
│
├── /posts/:slug
│   └── Post Details
│
├── /login
│   └── Login
│
└── /register
    └── Register


AUTHENTICATED USER
/dashboard
    └── User Dashboard

/dashboard/posts
    └── My Posts

/dashboard/posts/new
    └── Create Post

/dashboard/posts/:id/edit
    └── Edit Post


ADMIN
/admin
    └── Admin Dashboard

/admin/users
    └── Manage Users

/admin/posts
    └── Manage Posts

/admin/comments
    └── Manage Comments
```

---

# 48. API Boundary

The frontend communicates with the backend through REST APIs.

Example:

```text
React
  ↓
Service
  ↓
Axios
  ↓
HTTP
  ↓
Express API
```

Never:

```text
React
  ↓
MongoDB
```

Never:

```text
React
  ↓
Mongoose
```

Never:

```text
React
  ↓
Node business logic
```

---

# 49. Frontend Does Not Duplicate Backend Architecture

The frontend should NOT create fake versions of backend concepts.

For example, do not create:

```text
frontend/models/
frontend/controllers/
frontend/repositories/
frontend/database/
```

unless there is a specific frontend reason.

The backend owns:

```text
Models
Controllers
Services
Routes
Middleware
Database
```

The frontend owns:

```text
Pages
Components
Layouts
Hooks
Context
Services/API client
Routes
UI state
```

---

# 50. Naming Conventions

Use:

```text
PascalCase
```

for React components:

```text
PostCard.jsx
AdminDashboard.jsx
ProtectedRoute.jsx
```

Use:

```text
camelCase
```

for:

```text
hooks
services
utilities
functions
variables
```

Examples:

```text
useAuth.js
post.service.js
formatDate.js
```

Use descriptive names.

Avoid:

```text
Comp1.jsx
Utils.jsx
Helper.jsx
Stuff.jsx
Common.jsx
```

---

# 51. Avoid Giant Files

Avoid files larger than necessary.

If a page contains:

- Multiple complex UI sections
- Large forms
- Tables
- Modals
- Multiple API operations

extract reusable components/hooks.

For example:

```text
AdminUsers.jsx
```

should not contain the entire table, modal, filter system, pagination and API implementation.

Instead:

```text
AdminUsers.jsx
    ├── UserToolbar
    ├── UserTable
    ├── UserActionMenu
    ├── UserEditModal
    └── Pagination
```

---

# 52. State Management

Do not introduce Redux unless the project actually requires it.

For this assignment:

```text
Context API
+
React state
+
Custom hooks
```

is sufficient.

Use Context for truly global state.

Good candidates:

```text
Authentication
Current user
```

Do not put every piece of application state into Context.

Local state should remain local.

---

# 53. UI State vs Server State

Keep the distinction clear.

UI state:

```text
Modal open/closed
Selected filter
Form input
Sidebar open/closed
```

Server state:

```text
Posts
Comments
Users
Dashboard statistics
```

Use appropriate hooks/services for server data.

Do not create unnecessary global state for server data.

---

# 54. Testing

Frontend testing should focus on important user behavior.

Recommended:

```text
Jest
React Testing Library
```

Test examples:

```text
Login form
Registration form
Protected route
Admin route
Post creation
Post editing
Comment creation
Comment editing/deletion
Admin user management
Admin post management
```

Tests should verify behavior rather than implementation details.

---

# 55. Frontend Requirement Traceability

The architecture must directly support every frontend requirement.

| Requirement | Frontend implementation |
|---|---|
| React | React + Vite |
| Functional components | All UI components |
| React Hooks | Hooks throughout |
| Global auth state | AuthContext |
| Protected routes | ProtectedRoute |
| Admin routes | AdminRoute |
| User dashboard | `/dashboard` |
| My Posts | `/dashboard/posts` |
| Create Post | `/dashboard/posts/new` |
| Edit Post | `/dashboard/posts/:id/edit` |
| Admin dashboard | `/admin` |
| Manage users | `/admin/users` |
| Manage posts | `/admin/posts` |
| Manage comments | `/admin/comments` |
| REST API | API services |
| Pagination | Server-driven pagination |
| Authentication | AuthContext + API client |
| OAuth | Google/Facebook OAuth flow |
| Error handling | Centralized API/error handling |
| Responsive UI | Shared design system |
| Accessibility | Semantic/accessibility standards |

---

# 56. What Must NOT Be Implemented in Frontend

Do not move backend requirements into React.

These belong to the backend:

```text
MongoDB access
Mongoose
Password hashing
bcrypt
JWT signing
JWT verification
Refresh token persistence
RBAC enforcement
Ownership enforcement
Rate limiting
Express middleware
Express Router
Slug authority
Soft-delete persistence
Database indexes
Database population
Business logic
Centralized backend error handling
```

The frontend only consumes the resulting API.

---

# 57. Classic MERN Principle

The final architecture must clearly demonstrate:

```text
React
    ↓
REST API
    ↓
Express
    ↓
Node
    ↓
Mongoose
    ↓
MongoDB
```

Do not blur the boundaries.

---

# 58. Development Order

Implement the frontend in this order:

## Phase 1 — Foundation

```text
pnpm
Vite
React
React Router
Global styles (`src/styles/globals.css`, Ninna UI default theme)
Ninna UI (already integrated; do not add a second design system)
API client
Environment configuration
```

## Phase 2 — Authentication

```text
AuthContext
Login
Register
Logout
ProtectedRoute
AdminRoute
OAuth UI/flow
```

## Phase 3 — Public Blog

```text
Home
Post Details
Comments
Pagination
```

## Phase 4 — User Workspace

```text
Dashboard
My Posts
Create Post
Edit Post
```

## Phase 5 — Admin

```text
Admin Dashboard
Manage Users
Manage Posts
Manage Comments
```

## Phase 6 — Quality

```text
Loading states
Empty states
Error states
Accessibility
Responsive behavior
Tests
Performance
```

---

# 59. AI Development Rules

When an AI coding assistant works on this project, it MUST:

1. Read `design.md`.
2. Read `frontend-architecture.md`.
3. Follow the existing folder structure.
4. Before creating a reusable component, search Ninna UI and import it when it exists. Create a file in `src/components/common/` only when Ninna UI has no matching component. Then reuse that shared file instead of duplicating it.
5. Reuse existing services before creating duplicate API logic.
6. Keep API calls out of presentation components where practical.
7. Use the existing AuthContext for authentication.
8. Use ProtectedRoute/AdminRoute for navigation protection.
9. Never implement backend business logic in React.
10. Never connect React directly to MongoDB.
11. Never introduce Next.js.
12. Never introduce Redux unless explicitly requested.
13. Never introduce another frontend framework.
14. Never create duplicate layouts.
15. Never create duplicate design systems. Ninna UI is the only UI library.
16. Follow the API contract supplied by the backend.
17. Preserve accessibility.
18. Preserve responsive behavior.
19. Keep components focused and reusable.
20. Prefer simple architecture over unnecessary abstraction.
21. Use pnpm 10.17.1 for every frontend install and script. Do not use npm, Yarn, or Bun in `frontend/`.
22. Reuse Ninna UI for every generic UI component. The shared component location is `src/components/common/`, and a new file goes there only after Ninna UI has been checked and has no match.
23. Every button must be `src/components/common/Button.jsx`. Do not use a raw `<button>` or a second button component. Customize the shared button's `appearance` to match the design.

---

# 60. Before Creating New Code

Before creating a new component, hook, service or utility, check:

```text
Is this a reusable UI component?
        │
        ├── Yes → Does Ninna UI export it?
        │            │
        │            ├── Yes → Import it from the package in section 11
        │            │
        │            └── No → Does src/components/common/ already have it?
        │                        │
        │                        ├── Yes → Reuse that file
        │                        │
        │                        └── No → Create one component file in src/components/common/
        │
        └── No → Does this hook, service, or feature component already exist?
                    │
                    ├── Yes → Reuse/extend it
                    │
                    └── No → Create the smallest appropriate abstraction
```

Do not create duplicate:

```text
Button — use src/components/common/Button.jsx
Input
Modal
Pagination
Skeleton
EmptyState
API client
Auth logic
Post form
Comment form
```

---

# 61. Architecture Quality Checklist

Before considering the frontend complete:

### Structure

- [ ] Frontend is separate from backend.
- [ ] React + Vite is used.
- [ ] pnpm 10.17.1 is the frontend package manager, and `pnpm-lock.yaml` is committed.
- [ ] Ninna UI is the UI library. Generic components are imported from it. Every button uses `src/components/common/Button.jsx`.
- [ ] No Next.js.
- [ ] Clear folder structure exists.
- [ ] Pages/components/layouts are separated.
- [ ] API services are separated from UI.

### Authentication

- [ ] Registration works.
- [ ] Login works.
- [ ] Logout works.
- [ ] Auth state is global.
- [ ] Access token flow works.
- [ ] Refresh token flow works according to backend contract.
- [ ] Google login works.
- [ ] Facebook login works.
- [ ] Protected routes work.
- [ ] Admin routes work.

### Blog

- [ ] Home page works.
- [ ] Post details work.
- [ ] Create post works.
- [ ] Edit post works.
- [ ] Delete post works.
- [ ] Pagination works.
- [ ] Slugs are consumed from backend.

### Comments

- [ ] Comments display.
- [ ] Users can comment.
- [ ] Users can edit their own comments.
- [ ] Users can delete their own comments.
- [ ] Admins can manage comments.

### Admin

- [ ] Admin dashboard works.
- [ ] Total users displayed.
- [ ] Total posts displayed.
- [ ] Total comments displayed.
- [ ] User management works.
- [ ] Post management works.
- [ ] Comment management works.

### Quality

- [ ] Loading states exist.
- [ ] Empty states exist.
- [ ] Error states exist.
- [ ] Responsive design works.
- [ ] Accessibility is considered.
- [ ] Components are reusable.
- [ ] No duplicated API logic.
- [ ] No secrets in frontend.
- [ ] Tests cover important flows.

---

# 62. Final Rule

When making an architectural decision, prefer:

```text
Simple
        ↓
Clear
        ↓
Separation of concerns
        ↓
Reusable
        ↓
Maintainable
```

over:

```text
Complex
        ↓
Over-engineered
        ↓
Unnecessary abstraction
        ↓
Hard to understand
```

This is an assessment project.

The goal is not to demonstrate every library available in the React ecosystem.

The goal is to demonstrate a **clean, maintainable React frontend that correctly consumes a classic MERN REST API and satisfies every stated assignment requirement.**

The frontend should remain deliberately boring at the architectural level.

The quality should come from:

- Clear separation of concerns
- Good component design
- Correct authentication flow
- Correct role-based UI
- Good API integration
- Accessibility
- Responsive design
- Maintainability
- Tests

**Classic MERN. Separate frontend/backend. Clean boundaries. No unnecessary technology.**
