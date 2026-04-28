import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const OWNER_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL ?? 'hardy_patrick@yahoo.ca'

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

const REQUIRED: (keyof OrderPayload)[] = [
  'quantity', 'name', 'address', 'city', 'province', 'postal', 'country', 'email', 'phone',
]

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

  const missing = REQUIRED.filter((k) => !body[k])
  if (missing.length > 0) {
    return Response.json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })
  }

  const order = body as OrderPayload
  const orderNumber = generateOrderNumber()
  const summary = orderSummary(order)

  await resend.emails.send({
    from: 'Sai Oua <orders@saioua.com>',
    to: order.email,
    subject: `Order Confirmation — ${orderNumber}`,
    text: `Thank you for your order!\n\nOrder Number: ${orderNumber}\n\n${summary}\n\nWe will be in touch soon.`,
  })

  await resend.emails.send({
    from: 'Sai Oua <orders@saioua.com>',
    to: OWNER_EMAIL,
    subject: `New Order — ${orderNumber}`,
    text: `A new order has been placed.\n\nOrder Number: ${orderNumber}\n\n${summary}`,
  })

  return Response.json({ success: true, orderNumber })
}
