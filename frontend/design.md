# Inkly — Frontend Design System

## 1. Purpose

This document is the single source of truth for the visual design of the Inkly MERN blog application.

All public-facing screens must follow this design system:

1. Home / Blog Feed
2. Blog Post Details
3. Login
4. Register

Future authenticated-user and admin screens must extend this same design language rather than introducing a separate visual style.

The goal is a **minimal, professional, premium, clean, and eye-catching** interface that feels like a real production product.

---

# 2. Design Principles

### Core principles

- Minimal rather than decorative.
- Editorial rather than dashboard-heavy for public pages.
- Professional and trustworthy.
- Strong typography and generous whitespace.
- Clear visual hierarchy.
- Content is the primary focus.
- Consistent components across every screen.
- Accessibility and readability are first-class requirements.
- Responsive by default.
- Avoid visual noise.

### Avoid

Do NOT use:

- Excessive gradients
- Neon colors
- Heavy glassmorphism
- Excessive shadows
- Excessive rounded cards
- Random decorative blobs
- Multiple accent colors
- Different visual styles between pages
- Oversized navigation
- Dense dashboard-style layouts on public pages
- Generic template-like UI
- Excessive animations

---

# 3. Brand

## Product name

**Inkly**

Inkly is a modern editorial blogging platform focused on publishing and reading high-quality content.

### Brand personality

- Intelligent
- Modern
- Calm
- Trustworthy
- Editorial
- Approachable
- Premium

The brand should feel closer to a modern editorial/SaaS product than a traditional blogging template.

---

# 4. Color System

Use a restrained palette.

### Primary background

Warm off-white:

```text
#FAFAF8
```

### Surface

White:

```text
#FFFFFF
```

### Primary text

Near-black charcoal:

```text
#171717
```

### Secondary text

Muted charcoal:

```text
#6B6B6B
```

### Borders

Very subtle neutral border:

```text
#E7E5E1
```

### Accent

Use one sophisticated accent consistently.

Recommended accent:

```text
#5B5BD6
```

Use the accent for:

- Primary buttons
- Links
- Active navigation states
- Selected states
- Important interactive elements
- Small brand accents

Do not introduce additional bright accent colors unless required for semantic states.

### Semantic colors

Success:

```text
#2E7D5B
```

Error:

```text
#C94A4A
```

Warning:

```text
#B7791F
```

Semantic colors should only appear when communicating an actual state.

---

# 5. Typography

Use one primary sans-serif family throughout the application.

Preferred:

**Inter**

Acceptable alternatives:

- Geist
- Manrope

Do not mix multiple unrelated font families.

## Type scale

### Display / Hero

```text
48–64px
Font weight: 600–700
Line height: 1.05–1.15
```

### H1

```text
40–52px
Font weight: 650–700
Line height: 1.1–1.2
```

### H2

```text
28–36px
Font weight: 600–700
Line height: 1.2
```

### H3

```text
20–24px
Font weight: 600
Line height: 1.3
```

### Body

```text
16–18px
Font weight: 400
Line height: 1.6
```

### Small / Metadata

```text
13–14px
Font weight: 400–500
Line height: 1.4
```

### Labels

```text
13–14px
Font weight: 500–600
```

Avoid excessive use of bold text.

---

# 6. Layout System

Use a consistent centered content container.

### Desktop

```text
max-width: 1200px
```

### Article reading width

```text
680–760px
```

Article text must not span the entire desktop screen.

### Horizontal padding

Desktop:

```text
32px
```

Tablet:

```text
24px
```

Mobile:

```text
16–20px
```

---

# 7. Spacing System

Use an 8px spacing system.

Preferred spacing values:

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
80px
96px
```

Avoid arbitrary spacing values unless necessary.

Large sections should generally have:

```text
64–96px
```

vertical spacing.

---

# 8. Border Radius

Use moderate, consistent rounding.

### Buttons

```text
8px
```

### Inputs

```text
8px
```

### Cards

```text
12px
```

### Large featured containers

```text
16px
```

Do not use extremely rounded/pill-shaped UI unless it is specifically appropriate, such as tags.

---

# 9. Borders and Shadows

Prefer borders over shadows.

### Standard border

```text
1px solid #E7E5E1
```

### Shadow

Use very subtle shadows only when elevation is necessary.

Avoid:

- Large dark shadows
- Strong floating effects
- Multiple shadow layers

The interface should feel light and refined.

---

# 10. Navigation

The navbar is a **global component** and must be identical across all public-facing screens.

## Desktop structure

```text
┌──────────────────────────────────────────────────────────┐
│ Inkly       Home   Explore              Login  Get Started│
└──────────────────────────────────────────────────────────┘
```

### Left

Brand:

```text
Inkly
```

### Center

Navigation:

```text
Home
Explore
```

### Right

```text
Login
Get Started
```

### Behavior

- Sticky navigation is preferred.
- Use a subtle bottom border.
- Background should remain consistent with the page.
- Do not use a large colored navbar.
- Keep navigation height approximately 64–72px.
- Maintain generous horizontal spacing.

### Mobile

Use:

```text
Inkly                         Menu
```

with a clean mobile navigation drawer/menu.

---

# 11. Buttons

## Primary button

Used for major actions.

Examples:

```text
Get Started
Sign In
Create Account
Publish Post
```

Style:

- Accent background
- White text
- 8px radius
- Medium font weight
- Comfortable horizontal padding
- Subtle hover transition

## Secondary button

Used for supporting actions.

Style:

- Transparent or white background
- Neutral border
- Dark text

## Ghost button

Used for low-priority navigation/actions.

Style:

- No border
- Transparent
- Dark or muted text

All buttons must share the same design language.

---

# 12. Blog Card

The blog card is a reusable component.

It must be used on:

- Home page
- Related posts
- Future search/explore pages

Structure:

```text
┌─────────────────────────────────────┐
│                                     │
│             Image                   │
│                                     │
├─────────────────────────────────────┤
│ CATEGORY                            │
│                                     │
│ Blog post title                     │
│                                     │
│ Short excerpt describing the post   │
│                                     │
│ Author · Date · Reading time        │
└─────────────────────────────────────┘
```

Cards should feel editorial rather than like dashboard widgets.

Avoid excessive card decoration.

---

# 13. Category / Tag

Use small, restrained labels.

Example:

```text
DESIGN
```

or

```text
ENGINEERING
```

Style:

- Small font
- Medium weight
- Accent or muted text
- Optional subtle background
- Small radius

Do not make tags visually dominant.

---

# 14. Author Metadata

Use a consistent author metadata component.

Example:

```text
[Avatar] Debmalya Mazumdar · Sep 30, 2026 · 6 min read
```

Use muted typography.

The author's name may be slightly darker than the date and reading time.

---

# 15. Screen 1 — Home / Blog Feed

The Home page should feel like an editorial publication.

## Structure

```text
Navbar

Hero

Featured Post

Latest Posts

Pagination

Footer
```

## Hero

Example:

```text
Ideas, stories & insights

Thoughts worth reading.

A collection of ideas, engineering stories,
practical lessons and perspectives.
```

The hero should be spacious and confident.

Do not overload the hero with illustrations.

## Featured post

Use a large editorial treatment.

Include:

- Image
- Category
- Large title
- Excerpt
- Author
- Date
- Reading time

This should be the visual focal point of the homepage.

## Latest posts

Use a responsive grid.

Desktop:

```text
3 columns
```

Tablet:

```text
2 columns
```

Mobile:

```text
1 column
```

Reuse the standard Blog Card component.

---

# 16. Screen 2 — Blog Post Details

The post details page is optimized for reading.

## Structure

```text
Navbar

Breadcrumb

Category

Article Title

Description

Author Metadata

Hero Image

Article Content

Related Posts

Comments

Footer
```

## Article header

Large title with strong typography.

Example:

```text
Understanding Modern
React Architecture
```

Below it:

```text
Build scalable React applications by understanding
the architectural decisions behind them.
```

Then:

```text
[Avatar] Debmalya Mazumdar
September 30, 2026 · 6 min read
```

## Article image

Large and visually prominent.

Use consistent image aspect ratios.

## Article content

Use a narrow reading column.

Recommended:

```text
680–760px
```

Body text:

```text
18px
line-height: 1.7
```

Use clear spacing between:

- Paragraphs
- Headings
- Lists
- Quotes
- Code blocks

The reading experience should feel calm and premium.

---

# 17. Comments Section

Comments appear below the article.

Structure:

```text
Comments

[Avatar] User Name
Comment text...

Edit   Delete

--------------------------------

[ Write a comment........................ ]

                         [Post Comment]
```

For unauthenticated users:

```text
Sign in to join the conversation.
```

Use the same typography and border system as the rest of the product.

Do not make comments look like a separate application.

---

# 18. Screen 3 — Login

Authentication pages must share the same design system as the public website.

## Structure

```text
Navbar

        Welcome back

   Sign in to continue to Inkly.

   Email
   [______________________]

   Password
   [______________________]

   Forgot password?

   [ Sign In ]

   ─────── OR ───────

   [ Continue with Google ]

   [ Continue with Facebook ]

   Don't have an account?
   Create one

Footer
```

## Design

The authentication content should be visually focused.

Use:

```text
max-width: 420px
```

Do not make the form unnecessarily wide.

The page may use a subtle background treatment, but it must remain consistent with the global palette.

Do not create a completely different authentication theme.

---

# 19. Screen 4 — Register

Use exactly the same authentication layout as Login.

## Structure

```text
Navbar

        Create your account

   Join Inkly and start publishing.

   Name
   [______________________]

   Email
   [______________________]

   Password
   [______________________]

   Confirm Password
   [______________________]

   [ Create Account ]

   ─────── OR ───────

   [ Continue with Google ]

   [ Continue with Facebook ]

   Already have an account?
   Sign in

Footer
```

Login and Register must feel like two states of the same screen family.

---

# 20. Authentication Buttons

Google and Facebook buttons should use recognizable brand icons but remain visually consistent.

Structure:

```text
[ Google icon ] Continue with Google
[ Facebook icon ] Continue with Facebook
```

Avoid giving each provider an unrelated visual treatment.

---

# 21. Footer

Use one reusable footer component.

Example:

```text
────────────────────────────────────────────

Inkly

Ideas, stories & insights.

Home    Explore    About

© 2026 Inkly. All rights reserved.

────────────────────────────────────────────
```

Keep the footer minimal.

---

# 22. Responsive Design

The application must work on:

- Desktop
- Tablet
- Mobile

## Mobile principles

On mobile:

- Collapse navbar.
- Use one-column post layouts.
- Reduce heading sizes.
- Reduce horizontal padding.
- Preserve generous vertical spacing.
- Keep article text highly readable.
- Forms should use the full available width.
- Buttons should have comfortable touch targets.

Never simply shrink the desktop layout.

Reflow content intentionally.

---

# 23. Interaction Design

Interactions should be subtle.

Use:

- 150–250ms transitions
- Small hover changes
- Clear focus states
- Visible active states

Examples:

Blog card:

```text
Hover → subtle image scale / title color change
```

Button:

```text
Hover → subtle brightness/background change
```

Navigation:

```text
Hover → subtle accent transition
```

Avoid:

- Large animations
- Bouncing elements
- Excessive parallax
- Distracting motion

---

# 24. Accessibility

Follow accessible UI principles.

Requirements:

- Sufficient color contrast.
- Keyboard navigable controls.
- Visible focus states.
- Semantic HTML.
- Proper form labels.
- Accessible button names.
- Images require meaningful alt text.
- Do not rely on color alone to communicate state.
- Minimum comfortable touch target around 44px on mobile.

---

# 25. Loading States

Use simple skeleton loaders or restrained spinners.

Do not create elaborate loading animations.

Example:

```text
┌───────────────────────────────┐
│ █████████████████████         │
│ ███████████                   │
│ ███████████████████           │
│ ███████                       │
└───────────────────────────────┘
```

Loading states must follow the same spacing and border-radius system.

---

# 26. Empty States

Empty states should be simple and informative.

Example:

```text
No posts yet.

There are no published posts to display.

[ Explore Posts ]
```

Avoid large illustrations unless they genuinely improve the experience.

---

# 27. Error States

Errors should be clear and actionable.

Example:

```text
Something went wrong.

We couldn't load this post.

[ Try Again ]
```

Use the semantic error color sparingly.

---

# 28. Component Reuse Rules

The following components must be reusable:

```text
Navbar
Footer
Button
Input
FormField
BlogCard
AuthorMeta
CategoryTag
Pagination
Modal
ConfirmDialog
LoadingState
EmptyState
ErrorState
```

Do not create visually different versions of the same component for different screens unless there is a strong UX reason.

---

# 29. Design Consistency Rules

These rules have highest priority.

### Rule 1

All four public screens must look like the same product.

### Rule 2

Never invent a new color for a single page.

### Rule 3

Never redesign the navbar for a specific page.

### Rule 4

Login and Register must share the same authentication component structure.

### Rule 5

Blog cards must use the same component everywhere.

### Rule 6

Buttons must use the same design system everywhere.

### Rule 7

Spacing must follow the 8px system.

### Rule 8

Typography must remain consistent.

### Rule 9

Do not introduce decorative UI simply to fill empty space.

### Rule 10

Content hierarchy is more important than decoration.

---

# 30. Future Admin / User Screens

The following screens will be added later:

## User

```text
/dashboard
/dashboard/posts
/dashboard/posts/new
/dashboard/posts/:id/edit
/profile
```

## Admin

```text
/admin
/admin/users
/admin/posts
/admin/comments
```

These screens MUST inherit:

- Same typography
- Same colors
- Same buttons
- Same forms
- Same spacing
- Same radius
- Same navigation principles
- Same accessibility standards

The admin area may introduce a sidebar because its information density is higher, but it must still visually belong to Inkly.

---

# 31. AI Generation Instructions

When generating any new screen from this design document:

1. Treat this file as the source of truth.
2. Reuse existing design patterns.
3. Do not invent a new visual language.
4. Prefer existing components over creating new components.
5. Keep layouts simple and intentional.
6. Maintain the same color palette.
7. Maintain the same typography.
8. Maintain the same spacing scale.
9. Maintain the same border-radius scale.
10. Maintain the same navbar and footer.
11. Preserve responsive behavior.
12. Prioritize accessibility.
13. Prioritize content hierarchy.
14. Avoid unnecessary decorative elements.
15. The final result should look like it was designed by one senior product designer.

---

# 32. Visual Quality Target

The final UI should communicate:

> "A modern, premium editorial platform built by a professional product team."

It should NOT communicate:

> "A generic MERN assignment template."

The interface should be minimal enough to feel sophisticated, but distinctive enough to be memorable.
