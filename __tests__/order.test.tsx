/**
 * Unit tests for OrderButton and OrderModal (TC-B01–03, TC-M01–09, TC-I01)
 */
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '@/components/LanguageContext'
import OrderButton from '@/components/OrderButton'
import OrderModal from '@/components/OrderModal'
import en from '@/messages/en.json'
import th from '@/messages/th.json'
import lo from '@/messages/lo.json'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

function wrap(ui: React.ReactElement, lang: 'en' | 'th' | 'lo' = 'en') {
  return render(
    <LanguageProvider initialLang={lang}>{ui}</LanguageProvider>
  )
}

// ------------------------------------------------------------------
// TC-I01: i18n completeness
// ------------------------------------------------------------------
describe('TC-I01 i18n completeness', () => {
  const ORDER_KEYS = [
    'order.button', 'order.modal_title', 'order.quantity_label',
    'order.name_label', 'order.address_label', 'order.city_label',
    'order.province_label', 'order.postal_label', 'order.country_label',
    'order.email_label', 'order.phone_label', 'order.submit',
    'order.submitting', 'order.success_title', 'order.success_body',
    'order.error_generic',
  ]

  function resolve(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
      return undefined
    }, obj)
  }

  it.each(ORDER_KEYS)('en.json has key %s', (key) => {
    expect(typeof resolve(en, key)).toBe('string')
  })

  it.each(ORDER_KEYS)('th.json has key %s', (key) => {
    expect(typeof resolve(th, key)).toBe('string')
  })

  it.each(ORDER_KEYS)('lo.json has key %s', (key) => {
    expect(typeof resolve(lo, key)).toBe('string')
  })
})

// ------------------------------------------------------------------
// TC-B01–03: OrderButton
// ------------------------------------------------------------------
describe('OrderButton', () => {
  it('TC-B01 renders with English label', () => {
    const onOpen = jest.fn()
    wrap(<OrderButton onOpen={onOpen} />)
    expect(screen.getByRole('button', { name: en.order.button })).toBeInTheDocument()
  })

  it('TC-B02 calls onOpen when clicked', async () => {
    const user = userEvent.setup()
    const onOpen = jest.fn()
    wrap(<OrderButton onOpen={onOpen} />)
    await user.click(screen.getByRole('button'))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('TC-B03 label matches Thai translation', () => {
    const onOpen = jest.fn()
    wrap(<OrderButton onOpen={onOpen} />, 'th')
    expect(screen.getByRole('button', { name: th.order.button })).toBeInTheDocument()
  })

  it('TC-B03 label matches Lao translation', () => {
    const onOpen = jest.fn()
    wrap(<OrderButton onOpen={onOpen} />, 'lo')
    expect(screen.getByRole('button', { name: lo.order.button })).toBeInTheDocument()
  })
})

// ------------------------------------------------------------------
// TC-M01–09: OrderModal
// ------------------------------------------------------------------
describe('OrderModal', () => {
  it('TC-M01 renders all form fields when open', () => {
    wrap(<OrderModal isOpen onClose={jest.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument() // quantity select
    expect(screen.getByLabelText(en.order.name_label)).toBeInTheDocument()
    expect(screen.getByLabelText(en.order.address_label)).toBeInTheDocument()
    expect(screen.getByLabelText(en.order.city_label)).toBeInTheDocument()
    expect(screen.getByLabelText(en.order.province_label)).toBeInTheDocument()
    expect(screen.getByLabelText(en.order.postal_label)).toBeInTheDocument()
    expect(screen.getByLabelText(en.order.country_label)).toBeInTheDocument()
    expect(screen.getByLabelText(en.order.email_label)).toBeInTheDocument()
    expect(screen.getByLabelText(en.order.phone_label)).toBeInTheDocument()
  })

  it('TC-M02 labels are in Thai', () => {
    wrap(<OrderModal isOpen onClose={jest.fn()} />, 'th')
    expect(screen.getByLabelText(th.order.name_label)).toBeInTheDocument()
    expect(screen.getByLabelText(th.order.email_label)).toBeInTheDocument()
  })

  it('TC-M03 labels are in Lao', () => {
    wrap(<OrderModal isOpen onClose={jest.fn()} />, 'lo')
    expect(screen.getByLabelText(lo.order.name_label)).toBeInTheDocument()
    expect(screen.getByLabelText(lo.order.email_label)).toBeInTheDocument()
  })

  it('TC-M04 empty submit does not call fetch', async () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock
    wrap(<OrderModal isOpen onClose={jest.fn()} />)
    fireEvent.submit(screen.getByRole('button', { name: en.order.submit }).closest('form')!)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('TC-M05 submit button is disabled while submitting', async () => {
    const user = userEvent.setup()
    // fetch that never resolves
    global.fetch = jest.fn(() => new Promise(() => {}))
    wrap(<OrderModal isOpen onClose={jest.fn()} />)

    await user.type(screen.getByLabelText(en.order.name_label), 'Jane Doe')
    await user.type(screen.getByLabelText(en.order.address_label), '123 Main St')
    await user.type(screen.getByLabelText(en.order.city_label), 'Vientiane')
    await user.type(screen.getByLabelText(en.order.province_label), 'Vientiane')
    await user.type(screen.getByLabelText(en.order.postal_label), '01000')
    await user.type(screen.getByLabelText(en.order.country_label), 'Laos')
    await user.type(screen.getByLabelText(en.order.email_label), 'jane@example.com')
    await user.type(screen.getByLabelText(en.order.phone_label), '0201234567')

    await user.click(screen.getByRole('button', { name: en.order.submit }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: en.order.submitting })).toBeDisabled()
    })
  })

  it('TC-M06 shows success state on successful response', async () => {
    const user = userEvent.setup()
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, orderNumber: 'ORD-TEST-ABCD' }),
    } as Response)

    wrap(<OrderModal isOpen onClose={jest.fn()} />)

    await user.type(screen.getByLabelText(en.order.name_label), 'Jane')
    await user.type(screen.getByLabelText(en.order.address_label), '123 St')
    await user.type(screen.getByLabelText(en.order.city_label), 'City')
    await user.type(screen.getByLabelText(en.order.province_label), 'Prov')
    await user.type(screen.getByLabelText(en.order.postal_label), '00000')
    await user.type(screen.getByLabelText(en.order.country_label), 'Laos')
    await user.type(screen.getByLabelText(en.order.email_label), 'jane@example.com')
    await user.type(screen.getByLabelText(en.order.phone_label), '555-1234')
    await user.click(screen.getByRole('button', { name: en.order.submit }))

    await waitFor(() => {
      expect(screen.getByText(en.order.success_title)).toBeInTheDocument()
    })
    expect(screen.getByText(/ORD-TEST-ABCD/)).toBeInTheDocument()
  })

  it('TC-M07 shows error message on failed response', async () => {
    const user = userEvent.setup()
    global.fetch = jest.fn().mockRejectedValue(new Error('network'))

    wrap(<OrderModal isOpen onClose={jest.fn()} />)

    await user.type(screen.getByLabelText(en.order.name_label), 'Jane')
    await user.type(screen.getByLabelText(en.order.address_label), '123 St')
    await user.type(screen.getByLabelText(en.order.city_label), 'City')
    await user.type(screen.getByLabelText(en.order.province_label), 'Prov')
    await user.type(screen.getByLabelText(en.order.postal_label), '00000')
    await user.type(screen.getByLabelText(en.order.country_label), 'Laos')
    await user.type(screen.getByLabelText(en.order.email_label), 'jane@example.com')
    await user.type(screen.getByLabelText(en.order.phone_label), '555-1234')
    await user.click(screen.getByRole('button', { name: en.order.submit }))

    await waitFor(() => {
      expect(screen.getByText(en.order.error_generic)).toBeInTheDocument()
    })
  })

  it('TC-M08 onClose called when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    wrap(<OrderModal isOpen onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('TC-M09 quantity dropdown has options 1–10', () => {
    wrap(<OrderModal isOpen onClose={jest.fn()} />)
    const select = screen.getByRole('combobox')
    const options = within(select).getAllByRole('option')
    expect(options).toHaveLength(10)
    expect(options[0]).toHaveValue('1')
    expect(options[9]).toHaveValue('10')
  })
})
