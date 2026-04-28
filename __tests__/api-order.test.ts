/**
 * @jest-environment node
 *
 * Unit tests for POST /api/order (TC-A01–07)
 * Resend is mocked so no real emails are sent.
 */

const mockSend = jest.fn()
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}))

import { POST } from '@/app/api/order/route'

const VALID_BODY = {
  quantity: 2,
  name: 'John Doe',
  address: '123 Fake St',
  city: 'Boca Raton',
  province: 'FL',
  postal: '90210',
  country: 'US',
  email: 'fakeassname1933@gmail.com',
  phone: '9058675309',
}

function makeRequest(body: object) {
  return new Request('http://localhost/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockSend.mockReset()
  process.env.RESEND_API_KEY = 're_test_key'
})

afterEach(() => {
  delete process.env.RESEND_API_KEY
})

// TC-A01
it('TC-A01 valid payload returns 200 with orderNumber', async () => {
  mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })
  const res = await POST(makeRequest(VALID_BODY))
  expect(res.status).toBe(200)
  const json = await res.json()
  expect(json.success).toBe(true)
  expect(json.orderNumber).toMatch(/^ORD-[A-Z0-9]+-[A-F0-9]{4}$/)
})

// TC-A02
it('TC-A02 missing email returns 400', async () => {
  const { email: _email, ...body } = VALID_BODY
  const res = await POST(makeRequest(body))
  expect(res.status).toBe(400)
})

// TC-A03
it('TC-A03 missing name returns 400', async () => {
  const { name: _name, ...body } = VALID_BODY
  const res = await POST(makeRequest(body))
  expect(res.status).toBe(400)
})

// TC-A04
it('TC-A04 missing quantity returns 400', async () => {
  const { quantity: _quantity, ...body } = VALID_BODY
  const res = await POST(makeRequest(body))
  expect(res.status).toBe(400)
})

// TC-A04 (extended) — quantity out of range
it('TC-A04 quantity 0 returns 400', async () => {
  const res = await POST(makeRequest({ ...VALID_BODY, quantity: 0 }))
  expect(res.status).toBe(400)
})

it('TC-A04 quantity 11 returns 400', async () => {
  const res = await POST(makeRequest({ ...VALID_BODY, quantity: 11 }))
  expect(res.status).toBe(400)
})

// TC-A04 (extended) — invalid email format
it('TC-A04 malformed email returns 400', async () => {
  const res = await POST(makeRequest({ ...VALID_BODY, email: 'not-an-email' }))
  expect(res.status).toBe(400)
})

// TC-A05 — both emails are sent
it('TC-A05 sends confirmation to customer and notification to owner', async () => {
  mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })
  await POST(makeRequest(VALID_BODY))
  expect(mockSend).toHaveBeenCalledTimes(2)
  expect(mockSend.mock.calls[0][0].to).toBe(VALID_BODY.email)
  expect(mockSend.mock.calls[1][0].to).toBe('hardy_patrick@yahoo.ca')
})

// TC-A06 — Resend error on first send returns 500
it('TC-A06 Resend error on customer email returns 500', async () => {
  mockSend.mockResolvedValue({ data: null, error: { message: 'domain not verified' } })
  const res = await POST(makeRequest(VALID_BODY))
  expect(res.status).toBe(500)
})

// TC-A06 (extended) — missing API key returns 500
it('TC-A06 missing RESEND_API_KEY returns 500', async () => {
  delete process.env.RESEND_API_KEY
  const res = await POST(makeRequest(VALID_BODY))
  expect(res.status).toBe(500)
  const json = await res.json()
  expect(json.error).toMatch(/not configured/i)
})
