import { Router } from 'express'
import { sendContactFormEmail } from '../services/emailService'

const router = Router()

// Contact form submission
router.post('/submit', async (req, res) => {
  try {
    console.log('📝 Contact form submission received')
    console.log('📋 Request body:', req.body)

    const { firstName, lastName, email, subject, message } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      console.log('❌ Validation failed: Missing required fields')
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, and message are required',
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: Invalid email format')
      return res.status(400).json({ error: 'Invalid email format' })
    }

    console.log('✅ Validation passed, sending email...')

    // Send email
    const result = await sendContactFormEmail({
      firstName,
      lastName,
      email,
      subject: subject || 'Contact Form Inquiry',
      message,
    })

    if (result.success) {
      console.log('✅ Contact form processed successfully')
      res.json({
        success: true,
        message: 'Thank you for contacting us! We will respond within 24 hours.',
      })
    } else {
      console.log('❌ Email sending failed:', result.error)
      res.status(500).json({
        error: 'Failed to send email. Please try again later.',
        details: result.error,
      })
    }
  } catch (error: any) {
    console.error('❌ Contact form error:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    })
  }
})

export default router
