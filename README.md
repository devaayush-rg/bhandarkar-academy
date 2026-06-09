# Bhandarkar Academy — Website

A static academic institution website built with **React + Vite**, **React Router v6**, and **Supabase** (database, storage, and auth), deployed to **GitHub Pages**.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone & Install](#2-clone--install)
3. [Supabase Project Setup](#3-supabase-project-setup)
4. [Create the Database Table](#4-create-the-database-table)
5. [Configure Row Level Security (RLS)](#5-configure-row-level-security-rls)
6. [Create the Storage Bucket](#6-create-the-storage-bucket)
7. [Create the First Admin User](#7-create-the-first-admin-user)
8. [Configure Environment Variables](#8-configure-environment-variables)
9. [Run Locally](#9-run-locally)
10. [Deploy to GitHub Pages](#10-deploy-to-github-pages)
11. [Project Structure](#11-project-structure)
12. [Pages & Routes](#12-pages--routes)
13. [Admin CMS Usage](#13-admin-cms-usage)
14. [Customising Placeholder Content](#14-customising-placeholder-content)

---

## 1. Prerequisites

- **Node.js** v18 or later (includes npm)
- A **Supabase** account — [supabase.com](https://supabase.com)
- A **GitHub** account and repository for hosting

---

## 2. Clone & Install

```bash
git clone https://github.com/<USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>
npm install
```

---

## 3. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose an organisation, give the project a name (e.g. `bhandarkar-academy`), set a strong database password, and select a region close to your users.
4. Wait for the project to finish provisioning (~1–2 minutes).
5. Go to **Project Settings → API** and note:
   - **Project URL** — used as `VITE_SUPABASE_URL`
   - **`anon` public key** — used as `VITE_SUPABASE_ANON_KEY`

---

## 4. Create the Database Table

In your Supabase project, open **SQL Editor** and run:

```sql
create table announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  is_visible boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 5. Configure Row Level Security (RLS)

Still in the SQL Editor, run:

```sql
-- Enable RLS on the table
alter table announcements enable row level security;

-- Public (anon) users can only read visible announcements
create policy "Public can view visible announcements"
  on announcements
  for select
  to anon
  using (is_visible = true);

-- Authenticated users (admins) have full CRUD access
create policy "Authenticated users have full access"
  on announcements
  for all
  to authenticated
  using (true)
  with check (true);
```

---

## 6. Create the Storage Bucket

1. In your Supabase project, go to **Storage**.
2. Click **New bucket**.
3. Name it exactly `announcements`.
4. Check **Public bucket** (so uploaded files can be served via a public URL).
5. Click **Create bucket**.

Next, set storage policies so authenticated users can upload and delete:

In **SQL Editor**, run:

```sql
-- Allow authenticated users to upload files
create policy "Authenticated users can upload"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'announcements');

-- Allow authenticated users to delete files
create policy "Authenticated users can delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'announcements');

-- Allow public (anon) users to read files (needed for public image display)
create policy "Public can read files"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'announcements');
```

---

## 7. Create the First Admin User

Admin accounts are **not** self-registered through the website. Create them manually:

1. In your Supabase project, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter an email and a strong password.
4. Click **Create user**.

Use these credentials to log in at `/#/admin`.

---

## 8. Configure Environment Variables

1. Copy the example file:

   ```bash
   copy .env.example .env
   ```

   (On Mac/Linux: `cp .env.example .env`)

2. Open `.env` and fill in your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

> **Important:** `.env` is listed in `.gitignore` and will **never** be committed to Git. Never commit your secret keys.

---

## 9. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 10. Deploy to GitHub Pages

### 10.1 — Prepare `package.json`

Open `package.json` and update the `homepage` field with your actual GitHub username and repository name:

```json
"homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>"
```

### 10.2 — Prepare `vite.config.js`

Open `vite.config.js` and update the `base` with your repository name:

```js
base: '/<YOUR_REPO_NAME>/',
```

### 10.3 — Initialise Git & Push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
git push -u origin main
```

### 10.4 — Deploy

```bash
npm run deploy
```

This runs `npm run build` first (via `predeploy`), then pushes the `dist/` folder to the `gh-pages` branch using the `gh-pages` package.

### 10.5 — Enable GitHub Pages

1. Go to your repository on GitHub.
2. Click **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set **Branch** to `gh-pages` and folder to `/ (root)`.
5. Click **Save**.

Your site will be live at `https://<USERNAME>.github.io/<REPO_NAME>` within a few minutes.

### 10.6 — Set Environment Variables for Production

The `.env` file is not deployed. Vite inlines environment variables at build time. To deploy with real credentials, either:

**Option A — local build**: Set the real values in your `.env` before running `npm run deploy`.

**Option B — GitHub Actions** (recommended for CI): Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as **Repository Secrets** and use a GitHub Actions workflow to build and deploy.

---

## 11. Project Structure

```
├── index.html
├── vite.config.js
├── package.json
├── .env                    ← your local secrets (gitignored)
├── .env.example            ← template, safe to commit
└── src/
    ├── main.jsx
    ├── App.jsx             ← routes (HashRouter)
    ├── index.css           ← all styles (plain CSS)
    ├── lib/
    │   └── supabaseClient.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── ProtectedRoute.jsx
    │   └── AnnouncementsSection.jsx
    └── pages/
        ├── Home.jsx
        ├── About.jsx
        ├── Courses.jsx
        ├── Contact.jsx
        ├── AdminLogin.jsx
        └── AdminDashboard.jsx
```

---

## 12. Pages & Routes

| Route | Page | Notes |
|---|---|---|
| `/#/` | Home | Hero + static content + live announcements |
| `/#/about` | About | Institution history, vision, leadership |
| `/#/courses` | Courses | Static course cards |
| `/#/contact` | Contact | Address + enquiry form (static shell) |
| `/#/admin` | Admin Login | Supabase email+password auth |
| `/#/admin/dashboard` | Admin Dashboard | Protected CMS — requires login |

> Routes use `#` (hash) because GitHub Pages serves static files and cannot handle server-side routing.

---

## 13. Admin CMS Usage

1. Navigate to `/#/admin` and log in with the admin credentials you created in Step 7.
2. You are taken to the dashboard, which shows all announcements (visible and hidden).
3. **Create**: Fill in the "Create New Announcement" form and click **Create Announcement**. Upload an image or PDF optionally.
4. **Edit**: Click **Edit** on any row to open a modal. Change any field, optionally upload a replacement file, and save.
5. **Toggle visibility**: Click **Hide** or **Show** to flip `is_visible` for that announcement.
6. **Delete**: Click **Delete**, confirm the prompt, and the row + its storage file are removed.
7. **Logout**: Click the **Logout** button in the top-right.

---

## 14. Customising Placeholder Content

Search the codebase for `TODO` comments to find all placeholder text:

```bash
grep -r "TODO" src/
```

Key areas to update:

| File | What to change |
|---|---|
| `src/components/Navbar.jsx` | Institution name in nav brand |
| `src/components/Footer.jsx` | Footer text and copyright |
| `src/pages/Home.jsx` | Hero headline, tagline, about snippet, stats |
| `src/pages/About.jsx` | History, vision, mission, leadership, accreditation |
| `src/pages/Courses.jsx` | `PLACEHOLDER_COURSES` array with real programmes |
| `src/pages/Contact.jsx` | Address, phone, email, office hours |
| `index.html` | Page title and meta description |
| `package.json` | `homepage` URL |
| `vite.config.js` | `base` path |
