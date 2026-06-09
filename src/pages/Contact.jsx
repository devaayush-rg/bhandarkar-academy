/**
 * Contact page — /contact
 * TODO: Replace placeholder contact details with real information.
 * Note: This is a static form — it does NOT send email.
 *       To make it functional, integrate a service like EmailJS, Formspree,
 *       or a Supabase Edge Function.
 */
function Contact() {
  function handleSubmit(e) {
    e.preventDefault()
    // TODO: Implement actual form submission (e.g., EmailJS, Formspree, or Supabase Edge Function)
    alert('Thank you for your message. We will get back to you shortly.')
    e.target.reset()
  }

  return (
    <div className="page">
      <h1>Contact Us</h1>

      {/* TODO: Replace with real address and contact details */}
      <h2>Get in Touch</h2>
      <p>
        <strong>Address:</strong> TODO — Street, City, State, PIN Code, India
      </p>
      <p>
        <strong>Phone:</strong> TODO — +91 XXXXX XXXXX
      </p>
      <p>
        <strong>Email:</strong> TODO — info@bhandarkaracademy.edu.in
      </p>
      <p>
        <strong>Office Hours:</strong> TODO — Mon–Sat, 9:00 AM – 5:00 PM
      </p>

      <h2>Send a Message</h2>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="contact-name">Your Name <span aria-hidden="true">*</span></label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-email">Email Address <span aria-hidden="true">*</span></label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            placeholder="Enquiry subject"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label>
          <textarea
            id="contact-message"
            name="message"
            required
            placeholder="Write your message here…"
            rows={5}
          />
        </div>

        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </div>
  )
}

export default Contact
