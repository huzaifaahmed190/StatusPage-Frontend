# Dashboard Page — Full Discussion & Planning Doc

---

## 1. What Is The Dashboard?

The Dashboard is the **first page an admin sees after logging in**.
Its entire job is one thing: show you all the status pages you own, and let you create new ones.

Think of it like a "projects list" screen — similar to how Vercel shows all your deployments, or how Notion shows all your workspaces.

---

## 2. Full Page Layout (Visual)

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVBAR                                   │
│  ⚡ StatusPage                              Huzaifa  [Logout]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Your Status Pages                    [+ Create New Page]       │
│   ─────────────────────────────────────────────────────────      │
│                                                                  │
│   ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│   │                 │  │                 │  │               │  │
│   │  My SaaS App    │  │  API Monitor    │  │  Dev Tools    │  │
│   │                 │  │                 │  │               │  │
│   │  /my-saas-app   │  │  /api-monitor   │  │  /dev-tools   │  │
│   │                 │  │                 │  │               │  │
│   │  Created        │  │  Created        │  │  Created      │  │
│   │  Jun 27, 2026   │  │  Jun 28, 2026   │  │  Jun 28, 2026 │  │
│   │                 │  │                 │  │               │  │
│   │ [Manage] [Del]  │  │ [Manage] [Del]  │  │ [Manage][Del] │  │
│   └─────────────────┘  └─────────────────┘  └───────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. The Navbar

The Navbar lives inside `AppLayout.tsx` — not the Dashboard page itself.
It wraps ALL protected pages, so it appears on Dashboard AND Status Page Detail.

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ StatusPage Logo (left)           Huzaifa Ahmed   [Logout]   │
└─────────────────────────────────────────────────────────────────┘
```

**What it contains:**
- Left: App logo + name (same as login page — Activity icon + "StatusPage")
- Right: Logged-in user's name (from Redux `state.auth.user.name`)
- Right: Logout button → calls `POST /auth/logout` → clears Redux → redirects to `/login`

---

## 4. Dashboard Page Sections

### 4.1 Page Header

```
Your Status Pages                           [+ Create New Page]
──────────────────────────────────────────────────────────────
```

- Title on the left: "Your Status Pages"
- Button on the right: "+ Create New Page" (indigo, opens the modal)

---

### 4.2 Status Page Cards (Grid)

Each card represents one status page the user created.

```
┌──────────────────────────┐
│  My SaaS App             │  ← page name  (large, bold)
│                          │
│  🔗 /my-saas-app         │  ← slug       (muted, monospace)
│                          │
│  Created Jun 27, 2026    │  ← created_at (small, muted)
│                          │
│  [Manage]      [Delete]  │  ← actions
└──────────────────────────┘
```

**Card actions:**
- **Manage** → navigates to `/pages/:id` (the Status Page Detail)
- **Delete** → shows a confirmation dialog → calls `DELETE /status-pages/:id`

**Card layout:** responsive grid
- Desktop: 3 cards per row
- Tablet:  2 cards per row
- Mobile:  1 card per row

---

## 5. The Three States of the Dashboard

### State 1 — Loading (fetching from API)

While `GET /status-pages` is in progress, show skeleton cards instead of real content.
Skeleton = grey animated placeholder boxes. Prevents layout jump.

```
┌──────────────────────────┐  ┌──────────────────────────┐
│  ████████████            │  │  ████████████            │
│                          │  │                          │
│  ████████                │  │  ████████                │
│                          │  │                          │
│  ███████████             │  │  ███████████             │
│                          │  │                          │
│  ████████   ████████     │  │  ████████   ████████     │
└──────────────────────────┘  └──────────────────────────┘
```

---

### State 2 — Empty (no status pages yet)

First-time user has no pages. Show a helpful empty state — not a blank screen.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                     📋                                           │
│                                                                  │
│              No status pages yet                                 │
│       Create your first page to get started                      │
│                                                                  │
│                  [+ Create Your First Page]                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### State 3 — Filled (has pages)

The normal state shown above with the cards grid.

---

## 6. The "Create New Page" Modal

When the user clicks "+ Create New Page", a modal dialog slides in over the dashboard.
The dashboard content behind it is dimmed.

```
     ┌────────────────────────────────────────┐
     │  Create New Status Page            ✕   │
     │  ──────────────────────────────────    │
     │                                        │
     │  Page Name                             │
     │  ┌──────────────────────────────────┐  │
     │  │  My SaaS App                     │  │
     │  └──────────────────────────────────┘  │
     │                                        │
     │  Slug  (URL identifier)                │
     │  ┌──────────────────────────────────┐  │
     │  │  my-saas-app                     │  │
     │  └──────────────────────────────────┘  │
     │  ⚠ This cannot be changed after        │
     │    creation. Choose carefully.         │
     │                                        │
     │  Your public URL will be:              │
     │  /status/my-saas-app                   │  ← live preview as user types
     │                                        │
     │  [Cancel]           [Create Page →]    │
     └────────────────────────────────────────┘
```

**Important details:**
- Slug field auto-formats: converts spaces to hyphens, strips uppercase
  e.g. user types "My App" → slug becomes "my-app" automatically
- Live URL preview updates as user types the slug
- Warning about slug being permanent is always visible
- Validation: name required, slug required + only `a-z`, `0-9`, `-`
- On success: modal closes, new card appears in the grid instantly

---

## 7. Delete Confirmation

When user clicks [Delete] on a card, don't delete immediately.
Show a confirmation first — deleting a page also deletes all its components and incidents.

```
     ┌────────────────────────────────────────┐
     │  Delete Status Page                ✕   │
     │  ──────────────────────────────────    │
     │                                        │
     │  Are you sure you want to delete       │
     │  "My SaaS App"?                        │
     │                                        │
     │  This will permanently delete:         │
     │  • All components                      │
     │  • All incidents and their updates     │
     │                                        │
     │  This action cannot be undone.         │
     │                                        │
     │  [Cancel]       [Delete Forever]       │
     │                    (red button)        │
     └────────────────────────────────────────┘
```

---

## 8. Data Flow — How the Dashboard Gets Its Data

```
DashboardPage mounts
      │
      ▼
useEffect fires → dispatch(fetchPages())
      │
      ▼
GET /status-pages   (Axios → backend)
      │
      ▼
Response: [{ id, name, slug, created_at }, ...]
      │
      ▼
dispatch(setPages(data))  →  Redux statusPages.list updated
      │
      ▼
DashboardPage re-renders with the cards
```

---

## 9. Create Page Flow

```
User fills modal form → clicks "Create Page"
      │
      ▼
Zod validates (name required, slug format)
      │
      ▼
POST /status-pages  { name, slug }
      │
      ▼
Response: { id, name, slug, created_at }
      │
      ▼
dispatch(addPage(newPage))  →  new card appears instantly
      │
      ▼
Modal closes  +  success toast "Status page created!"
```

---

## 10. Delete Page Flow

```
User clicks [Delete] → confirmation modal opens
      │
      ▼
User clicks "Delete Forever"
      │
      ▼
DELETE /status-pages/:id
      │
      ▼
dispatch(removePage(id))  →  card disappears instantly
      │
      ▼
success toast "Status page deleted"
```

---

## 11. Files We Will Create/Update

| File | What changes |
|------|-------------|
| `src/layouts/AppLayout.tsx` | Build the real Navbar (logo + user + logout) |
| `src/features/statusPages/DashboardPage.tsx` | The main dashboard page |
| `src/features/statusPages/statusPagesAPI.ts` | API functions: fetchPages, createPage, deletePage |
| `src/components/shared/StatusPageCard.tsx` | Individual card component |

---

## 12. New shadcn Components Needed

We need to install two new shadcn components before building:

```bash
npx shadcn@latest add dialog skeleton
```

- **Dialog** → for the "Create Page" modal and delete confirmation
- **Skeleton** → for the loading state placeholder cards

---

## 13. Redux Slice Actions Used

From `statusPagesSlice.ts` (already written):

| Action | When |
|--------|------|
| `setPages(pages[])` | After `GET /status-pages` returns |
| `addPage(page)` | After `POST /status-pages` succeeds |
| `removePage(id)` | After `DELETE /status-pages/:id` succeeds |
| `setLoading(bool)` | Before/after API calls |
| `setError(msg)` | If an API call fails |

---

## 14. Summary — What The User Experiences

```
Login → redirected to Dashboard
  → spinner briefly (fetching pages)
  → if no pages: empty state with CTA
  → if has pages: grid of cards

Click "+ Create New Page"
  → modal opens
  → fill name + slug (slug auto-formats)
  → see live URL preview
  → submit → new card appears instantly

Click "Manage" on a card
  → goes to /pages/:id (Status Page Detail)

Click "Delete" on a card
  → confirmation modal
  → confirm → card removed
```
