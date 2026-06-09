import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * AnnouncementsSection — fetches and renders visible announcements from Supabase.
 * Used by the Home page.
 */
function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true)
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, description, image_url')
        .eq('is_visible', true)
        .order('display_order', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setAnnouncements(data || [])
      }
      setLoading(false)
    }

    fetchAnnouncements()
  }, [])

  return (
    <section className="announcements-section">
      <h2>Announcements</h2>

      {loading && <p className="loading-message">Loading announcements…</p>}

      {error && (
        <div className="alert alert-error" role="alert">
          Failed to load announcements: {error}
        </div>
      )}

      {!loading && !error && announcements.length === 0 && (
        <p className="empty-message">No announcements at this time.</p>
      )}

      {!loading && !error && announcements.length > 0 && (
        <div className="announcements-grid">
          {announcements.map((item) => (
            <article key={item.id} className="announcement-card">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                />
              )}
              <div className="announcement-card-body">
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default AnnouncementsSection
