declare global {
  interface Window {
    PaystackPop?: new () => {
      resumeTransaction?: (accessCode: string) => void
      newTransaction?: (options: Record<string, unknown>) => void
    }
  }
}

type StartPaystackPaymentInput = {
  accessCode: string
}

const PAYSTACK_SRC = 'https://js.paystack.co/v2/inline.js'

export async function loadPaystackScript(): Promise<void> {
  if (window.PaystackPop) return

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Paystack script')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src = PAYSTACK_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack script'))
    document.head.appendChild(script)
  })
}

export async function startPaystackPayment(input: StartPaystackPaymentInput): Promise<void> {
  await loadPaystackScript()

  const Paystack = window.PaystackPop
  if (!Paystack) {
    throw new Error('Paystack SDK unavailable')
  }

  const popup = new Paystack()
  if (!popup.resumeTransaction) {
    throw new Error('Paystack popup resumeTransaction unavailable')
  }

  popup.resumeTransaction(input.accessCode)
}
