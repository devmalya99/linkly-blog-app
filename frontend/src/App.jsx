import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './app/providers'
import { AuthProvider } from './features/auth'
import { NotificationsProvider } from './features/notifications'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
            <AppRouter />
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
