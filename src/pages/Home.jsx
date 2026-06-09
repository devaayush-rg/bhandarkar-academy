import AnnouncementsSection from '../components/AnnouncementsSection'

/**
 * Home page — /
 * Contains institutional hero content and the live Announcements section.
 * TODO: Replace all placeholder content with real institution text.
 */
function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        {/* TODO: Replace with real institution name and tagline */}
        <h1>Welcome to Bhandarkar Academy</h1>
        <p>
          Fostering excellence in education, research, and cultural preservation
          since our founding.
        </p>
      </section>

      <div className="page">
        {/* About snippet */}
        <section>
          <h2>About Us</h2>
          {/* TODO: Replace with real introductory paragraph */}
          <p>
            Bhandarkar Academy is a premier academic institution committed to
            providing quality education across a wide range of disciplines. Our
            faculty of distinguished scholars guides students towards academic
            and professional excellence.
          </p>
          <p>
            {/* TODO: Replace with real mission statement */}
            Our mission is to cultivate an environment of learning, inquiry, and
            innovation that prepares students for the challenges of a dynamic world.
          </p>
        </section>

        {/* Quick stats */}
        <section>
          <h2>At a Glance</h2>
          <ul>
            {/* TODO: Replace with real statistics */}
            <li>Founded: <strong>TODO — Year</strong></li>
            <li>Students: <strong>TODO — Number</strong></li>
            <li>Faculty members: <strong>TODO — Number</strong></li>
            <li>Courses offered: <strong>TODO — Number</strong></li>
          </ul>
        </section>

        {/* Live announcements fetched from Supabase */}
        <AnnouncementsSection />
      </div>
    </>
  )
}

export default Home
