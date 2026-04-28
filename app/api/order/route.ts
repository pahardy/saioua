import { Resend } from 'resend'

const OWNER_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL ?? 'hardy_patrick@yahoo.ca'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface OrderPayload {
  quantity: number
  name: string
  address: string
  city: string
  province: string
  postal: string
  country: string
  email: string
  phone: string
}

function validateOrder(body: Partial<OrderPayload>): string | null {
  const fields: (keyof OrderPayload)[] = [
    'name', 'address', 'city', 'province', 'postal', 'country', 'email', 'phone',
  ]
  for (const f of fields) {
    if (!body[f] || String(body[f]).trim() === '') return `Missing field: ${f}`
  }
  const qty = Number(body.quantity)
  if (!Number.isInteger(qty) || qty < 1 || qty > 10) return 'quantity must be an integer between 1 and 10'
  if (!EMAIL_RE.test(body.email!)) return 'Invalid email address'
  return null
}

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0')
  return `ORD-${ts}-${rand}`
}

function orderSummary(order: OrderPayload): string {
  return `
Order Summary
-------------
Quantity : ${order.quantity}
Name     : ${order.name}
Address  : ${order.address}, ${order.city}, ${order.province} ${order.postal}, ${order.country}
Email    : ${order.email}
Phone    : ${order.phone}
`.trim()
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<OrderPayload>

  const validationError = validateOrder(body)
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 })
  }

  const order = { ...body, quantity: Number(body.quantity) } as OrderPayload
  const orderNumber = generateOrderNumber()
  const summary = orderSummary(order)

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error: customerError } = await resend.emails.send({
    from: 'Sai Oua <orders@saioua.com>',
    to: order.email,
    subject: `Order Confirmation — ${orderNumber}`,
    text: `Thank you for your order!\n\nOrder Number: ${orderNumber}\n\n${summary}\n\nWe will be in touch soon.`,
  })
  if (customerError) {
    return Response.json({ error: 'Failed to send confirmation email' }, { status: 500 })
  }

  const { error: ownerError } = await resend.emails.send({
    from: 'Sai Oua <orders@saioua.com>',
    to: OWNER_EMAIL,
    subject: `New Order — ${orderNumber}`,
    text: `A new order has been placed.\n\nOrder Number: ${orderNumber}\n\n${summary}`,
  })
  if (ownerError) {
    return Response.json({ error: 'Failed to send owner notification' }, { status: 500 })
  }

  return Response.json({ success: true, orderNumber })
}
