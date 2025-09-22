import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert contact message into database
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: `${firstName} ${lastName}`,
          email,
          subject,
          message,
          read: false,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    try {
      const emailContent = {
        to: "hello@moise2.dev", // Your Gmail address
        from: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }

      // For production, you would integrate with a service like SendGrid, Resend, or Nodemailer
      // This is a placeholder for the email sending logic
      console.log("Email would be sent:", emailContent)

      // You can integrate with services like:
      // - Resend: https://resend.com/
      // - SendGrid: https://sendgrid.com/
      // - Nodemailer with Gmail SMTP
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the request if email fails, as the message is still saved to database
    }

    return NextResponse.json(
      {
        message: "Message sent successfully",
        id: data.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
