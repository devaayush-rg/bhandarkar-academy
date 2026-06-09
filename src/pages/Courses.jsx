/**
 * Courses page — /courses
 * TODO: Replace placeholder course data with real course information.
 * Consider loading courses from Supabase in the future if the list is dynamic.
 */

// TODO: Replace this array with real course data (or fetch from Supabase)
const PLACEHOLDER_COURSES = [
  {
    id: 1,
    name: 'Bachelor of Arts (B.A.)',
    duration: '3 Years',
    description: 'TODO — Describe the programme, subjects offered, and eligibility.',
  },
  {
    id: 2,
    name: 'Bachelor of Commerce (B.Com)',
    duration: '3 Years',
    description: 'TODO — Describe the programme, subjects offered, and eligibility.',
  },
  {
    id: 3,
    name: 'Bachelor of Science (B.Sc.)',
    duration: '3 Years',
    description: 'TODO — Describe the programme, subjects offered, and eligibility.',
  },
  {
    id: 4,
    name: 'Master of Arts (M.A.)',
    duration: '2 Years',
    description: 'TODO — Describe the programme, subjects offered, and eligibility.',
  },
  {
    id: 5,
    name: 'Diploma in Computer Applications',
    duration: '1 Year',
    description: 'TODO — Describe the programme, subjects offered, and eligibility.',
  },
  {
    id: 6,
    name: 'Certificate Course in TODO',
    duration: 'TODO — Duration',
    description: 'TODO — Describe the programme, subjects offered, and eligibility.',
  },
]

function Courses() {
  return (
    <div className="page">
      <h1>Courses Offered</h1>
      <p>
        {/* TODO: Replace with real intro text */}
        Bhandarkar Academy offers a wide range of undergraduate, postgraduate,
        and certificate programmes across multiple disciplines.
      </p>

      <div className="courses-grid">
        {PLACEHOLDER_COURSES.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.name}</h3>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p>{course.description}</p>
          </div>
        ))}
      </div>

      {/* TODO: Add eligibility criteria, fee structure, admission procedure */}
      <h2>Admission Information</h2>
      <p>
        For admission enquiries, please contact us via the{' '}
        <a href="#/contact">Contact page</a> or visit our office.
      </p>
    </div>
  )
}

export default Courses
