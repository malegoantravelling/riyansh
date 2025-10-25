import nodemailer from 'nodemailer'

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'riyanshamrit106@gmail.com',
      pass: process.env.EMAIL_PASSWORD || '', // Gmail App Password
    },
  })
}

interface OrderEmailData {
  orderId: string
  orderDate: string
  totalAmount: number
  paymentId: string
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: any
  orderItems: Array<{
    product_name: string
    quantity: number
    price: number
  }>
}

export const sendOrderConfirmationEmail = async (data: OrderEmailData) => {
  try {
    const transporter = createTransporter()

    // Format order items for email
    const itemsHtml = data.orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product_name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(
            2
          )}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(
            item.price * item.quantity
          ).toFixed(2)}</td>
        </tr>
      `
      )
      .join('')

    // Format shipping address
    const addressHtml = `
      ${data.shippingAddress.address_line_1}<br>
      ${data.shippingAddress.address_line_2 ? data.shippingAddress.address_line_2 + '<br>' : ''}
      ${data.shippingAddress.street_address}<br>
      ${data.shippingAddress.city}, ${data.shippingAddress.state} ${
      data.shippingAddress.zip_code
    }<br>
      ${data.shippingAddress.phone ? 'Phone: ' + data.shippingAddress.phone : ''}
    `

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8BC34A 0%, #7CB342 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎉 New Order Received!</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">RIYANSH Ayurvedic Center</p>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 22px; border-bottom: 2px solid #8BC34A; padding-bottom: 10px;">Order Details</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Order ID:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">#${data.orderId
                    .substring(0, 8)
                    .toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Order Date:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.orderDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Payment Status:</td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="background-color: #4CAF50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PAID</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 22px; border-bottom: 2px solid #8BC34A; padding-bottom: 10px;">Customer Information</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">${
                    data.customerName
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${data.customerPhone}</td>
                </tr>
              </table>

              <h3 style="margin: 20px 0 10px 0; color: #333; font-size: 16px;">Shipping Address:</h3>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #8BC34A; color: #666; line-height: 1.6;">
                ${addressHtml}
              </div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 22px; border-bottom: 2px solid #8BC34A; padding-bottom: 10px;">Order Items</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 5px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="padding: 12px; text-align: left; color: #666; font-weight: 600; border-bottom: 2px solid #ddd;">Product</th>
                    <th style="padding: 12px; text-align: center; color: #666; font-weight: 600; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #666; font-weight: 600; border-bottom: 2px solid #ddd;">Price</th>
                    <th style="padding: 12px; text-align: right; color: #666; font-weight: 600; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f9f9f9;">
                    <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; color: #333; font-size: 18px;">Total Amount:</td>
                    <td style="padding: 15px; text-align: right; font-weight: bold; color: #8BC34A; font-size: 20px;">₹${data.totalAmount.toFixed(
                      2
                    )}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <!-- Payment Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 22px; border-bottom: 2px solid #8BC34A; padding-bottom: 10px;">Payment Details</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${
                    data.paymentMethod
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Payment ID:</td>
                  <td style="padding: 8px 0; color: #333; font-family: monospace; text-align: right;">${
                    data.paymentId
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #8BC34A; font-weight: bold; font-size: 18px; text-align: right;">₹${data.totalAmount.toFixed(
                    2
                  )}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Required -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Action Required:</p>
                <p style="margin: 10px 0 0 0; color: #856404;">Please process this order and prepare it for shipping. Contact the customer if you need any clarification.</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 30px; text-align: center; border-top: 1px solid #ddd;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">This is an automated notification from your e-commerce system.</p>
              <p style="margin: 0; color: #999; font-size: 12px;">RIYANSH Ayurvedic Center | Mumbai, Maharashtra, India</p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">📧 riyanshamrit106@gmail.com | 📞 +91 9370646279</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Send email to admin
    const adminMailOptions = {
      from: `"RIYANSH E-Commerce" <${process.env.EMAIL_USER || 'riyanshamrit106@gmail.com'}>`,
      to: 'riyanshamrit106@gmail.com',
      subject: `🛒 New Order #${data.orderId
        .substring(0, 8)
        .toUpperCase()} - ₹${data.totalAmount.toFixed(2)}`,
      html: emailHtml,
    }

    await transporter.sendMail(adminMailOptions)
    console.log('✅ Order confirmation email sent to admin')

    return { success: true }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    // Don't throw error - we don't want to fail the order if email fails
    return { success: false, error }
  }
}

export default {
  sendOrderConfirmationEmail,
}
