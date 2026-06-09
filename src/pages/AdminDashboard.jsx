import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

/** Uploads a file to the "announcements" bucket and returns its public URL. */
async function uploadFile(file) {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('announcements')
    .upload(fileName, file, { upsert: false })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from('announcements').getPublicUrl(fileName)
  return data.publicUrl
}

/**
 * Deletes a file from the "announcements" bucket given its full public URL.
 * Silently ignores errors (e.g., file already deleted).
 */
async function deleteFileByUrl(publicUrl) {
  if (!publicUrl) return
  try {
    // Extract the file path relative to the bucket from the public URL
    const url = new URL(publicUrl)
    // URL format: .../storage/v1/object/public/<bucket>/<path>
    const parts = url.pathname.split('/storage/v1/object/public/announcements/')
    if (parts.length < 2) return
    const filePath = parts[1]
    await supabase.storage.from('announcements').remove([filePath])
  } catch {
    // Non-critical — continue even if delete fails
  }
}

// ---------------------------------------------------------------------------
// EditModal — inline modal for editing an existing announcement
// ---------------------------------------------------------------------------

function EditModal({ announcement, onClose, onSaved }) {
  const [title, setTitle] = useState(announcement.title)
  const [description, setDescription] = useState(announcement.description || '')
  const [displayOrder, setDisplayOrder] = useState(announcement.display_order)
  const [isVisible, setIsVisible] = useState(announcement.is_visible)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let imageUrl = announcement.image_url

      // If a new image was selected, upload it and delete the old one
      if (imageFile) {
        const newUrl = await uploadFile(imageFile)
        await deleteFileByUrl(announcement.image_url)
        imageUrl = newUrl
      }

      const { error } = await supabase
        .from('announcements')
        .update({
          title,
          description,
          display_order: Number(displayOrder),
          is_visible: isVisible,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', announcement.id)

      if (error) throw error

      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="modal">
        <h2 id="edit-modal-title">Edit Announcement</h2>

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <form onSubmit={handleSave} noValidate>
          <div className="form-group">
            <label htmlFor="edit-title">Title <span aria-hidden="true">*</span></label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-order">Display Order</label>
            <input
              id="edit-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              min={0}
            />
          </div>

          <div className="form-group">
            <div className="checkbox-row">
              <input
                id="edit-visible"
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
              />
              <label htmlFor="edit-visible">Visible</label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-image">Replace Image / File</label>
            {announcement.image_url && (
              <p style={{ fontSize: '0.82rem', color: '#555', marginBottom: '0.4rem' }}>
                Current:{' '}
                <a href={announcement.image_url} target="_blank" rel="noreferrer">
                  View existing file
                </a>
              </p>
            )}
            <input
              id="edit-image"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CreateForm — form to create a new announcement
// ---------------------------------------------------------------------------

function CreateForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      let imageUrl = null

      if (imageFile) {
        imageUrl = await uploadFile(imageFile)
      }

      const { error } = await supabase.from('announcements').insert({
        title,
        description,
        display_order: Number(displayOrder),
        is_visible: isVisible,
        image_url: imageUrl,
      })

      if (error) throw error

      // Reset form
      setTitle('')
      setDescription('')
      setDisplayOrder(0)
      setIsVisible(true)
      setImageFile(null)
      e.target.reset()
      setSuccess(true)
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-section">
      <h2>Create New Announcement</h2>

      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="status">Announcement created successfully.</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="create-title">Title <span aria-hidden="true">*</span></label>
          <input
            id="create-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Announcement title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="create-description">Description</label>
          <textarea
            id="create-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description…"
          />
        </div>

        <div className="form-group">
          <label htmlFor="create-image">Image / File</label>
          <input
            id="create-image"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="create-order">Display Order</label>
          <input
            id="create-order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            min={0}
          />
        </div>

        <div className="form-group">
          <div className="checkbox-row">
            <input
              id="create-visible"
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            <label htmlFor="create-visible">Visible on site</label>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating…' : 'Create Announcement'}
        </button>
      </form>
    </section>
  )
}

// ---------------------------------------------------------------------------
// AnnouncementListItem — a single row in the admin announcements list
// ---------------------------------------------------------------------------

function AnnouncementListItem({ item, onRefresh }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleToggleVisibility() {
    setBusy(true)
    setError(null)
    const { error } = await supabase
      .from('announcements')
      .update({ is_visible: !item.is_visible, updated_at: new Date().toISOString() })
      .eq('id', item.id)
    setBusy(false)
    if (error) setError(error.message)
    else onRefresh()
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return
    setBusy(true)
    setError(null)

    // Delete from DB first, then storage
    const { error } = await supabase.from('announcements').delete().eq('id', item.id)
    if (error) {
      setBusy(false)
      setError(error.message)
      return
    }

    await deleteFileByUrl(item.image_url)
    setBusy(false)
    onRefresh()
  }

  return (
    <>
      <div className="announcement-list-item">
        <div className="announcement-item-info">
          <strong>{item.title}</strong>
          <span>
            <span className={`badge ${item.is_visible ? 'badge-visible' : 'badge-hidden'}`}>
              {item.is_visible ? 'Visible' : 'Hidden'}
            </span>
            Order: {item.display_order}
            {item.image_url && (
              <>
                {' · '}
                <a href={item.image_url} target="_blank" rel="noreferrer">
                  View file
                </a>
              </>
            )}
          </span>
          {error && <div className="alert alert-error" role="alert" style={{ marginTop: '0.4rem' }}>{error}</div>}
        </div>
        <div className="announcement-item-actions">
          <EditButton item={item} onRefresh={onRefresh} />
          <button
            className="btn-sm"
            onClick={handleToggleVisibility}
            disabled={busy}
            title={item.is_visible ? 'Hide announcement' : 'Show announcement'}
          >
            {item.is_visible ? 'Hide' : 'Show'}
          </button>
          <button
            className="btn-sm btn-danger"
            onClick={handleDelete}
            disabled={busy}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}

/** Thin wrapper so each item manages its own edit-modal open state. */
function EditButton({ item, onRefresh }) {
  const [open, setOpen] = useState(false)

  function handleSaved() {
    setOpen(false)
    onRefresh()
  }

  return (
    <>
      <button className="btn-sm" onClick={() => setOpen(true)}>Edit</button>
      {open && (
        <EditModal
          announcement={item}
          onClose={() => setOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// AdminDashboard — main protected page
// ---------------------------------------------------------------------------

/**
 * Admin Dashboard — /admin/dashboard
 * Protected by ProtectedRoute. Lists all announcements and provides CMS controls.
 */
function AdminDashboard() {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState(null)

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)
    setListError(null)
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) setListError(error.message)
    else setAnnouncements(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ---- Create new announcement ---- */}
      <CreateForm onCreated={fetchAnnouncements} />

      {/* ---- Announcement list ---- */}
      <section className="admin-section">
        <h2>All Announcements</h2>

        {loading && <p className="loading-message">Loading…</p>}

        {listError && (
          <div className="alert alert-error" role="alert">
            Failed to load announcements: {listError}
          </div>
        )}

        {!loading && !listError && announcements.length === 0 && (
          <p className="empty-message">No announcements yet. Create one above.</p>
        )}

        {!loading && !listError && announcements.length > 0 && (
          <div className="announcement-list">
            {announcements.map((item) => (
              <AnnouncementListItem
                key={item.id}
                item={item}
                onRefresh={fetchAnnouncements}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard
