import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setFallbackMainButton, useTelegram } from '../lib/telegram'

type UseTelegramChromeInput = {
  mainButton?: {
    text: string
    onClick: () => void
    disabled?: boolean
    visible?: boolean
  } | null
  backTo?: string | number | null
}

export function useTelegramChrome(input: UseTelegramChromeInput): void {
  const navigate = useNavigate()
  const { isTelegram, webApp } = useTelegram()

  useEffect(() => {
    if (!isTelegram) {
      setFallbackMainButton(input.mainButton ?? null)
      return () => setFallbackMainButton(null)
    }

    const button = webApp?.MainButton
    const config = input.mainButton
    if (!button || !config || config.visible === false) {
      button?.hide()
      return undefined
    }

    button.setText(config.text)
    if (config.disabled) button.disable()
    else button.enable()
    button.show()
    button.onClick(config.onClick)

    return () => {
      button.offClick(config.onClick)
      button.hide()
    }
  }, [input.mainButton, isTelegram, webApp])

  useEffect(() => {
    if (!isTelegram) return undefined
    const button = webApp?.BackButton

    if (!button || input.backTo === null || input.backTo === undefined) {
      button?.hide()
      return undefined
    }

    const backTarget = input.backTo
    const handler = () => {
      if (typeof backTarget === 'number') navigate(backTarget)
      else if (typeof backTarget === 'string') navigate(backTarget)
    }

    button.show()
    button.onClick(handler)

    return () => {
      button.offClick(handler)
      button.hide()
    }
  }, [input.backTo, isTelegram, navigate, webApp])
}
