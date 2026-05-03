import { Outlet, useLocation } from 'react-router-dom'
import appIcon from '../assets/app-icon.png'
import { useFallbackMainButton, useTelegram } from '../lib/telegram'
import { BottomNav } from './BottomNav'
import { ToastViewport } from './ToastViewport'

export function AppLayout() {
  const { isTelegram } = useTelegram()
  const mainButton = useFallbackMainButton()
  const location = useLocation()
  const showBottomNav = !['/checkout'].includes(location.pathname)
    && !location.pathname.startsWith('/payment')
    && !location.pathname.startsWith('/success')

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <Outlet />
      </div>
      <div key={location.pathname} className="route-splash" aria-hidden="true">
        <div className="route-splash__content">
          <img src={appIcon} alt="ChopLink" className="route-splash__icon" />
          <span className="route-splash__label">ChopLink</span>
        </div>
      </div>
      {showBottomNav ? <BottomNav /> : null}
      {!isTelegram && mainButton && mainButton.visible !== false ? (
        <button
          type="button"
          className="main-button-fallback"
          onClick={mainButton.onClick}
          disabled={mainButton.disabled}
          data-testid="fallback-main-button"
        >
          {mainButton.text}
        </button>
      ) : null}
      <ToastViewport />
    </div>
  )
}
