import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { TelegramProvider } from './lib/telegram'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PaymentCallbackPage } from './pages/PaymentCallbackPage'
import { PaymentPage } from './pages/PaymentPage'
import { RestaurantPage } from './pages/RestaurantPage'
import { RestaurantsPage } from './pages/RestaurantsPage'
import { SuccessPage } from './pages/SuccessPage'
import './App.css'

function App() {
  return (
    <TelegramProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/payments/callback" element={<PaymentCallbackPage />} />
                <Route path="/success/:id" element={<SuccessPage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </TelegramProvider>
  )
}

export default App
