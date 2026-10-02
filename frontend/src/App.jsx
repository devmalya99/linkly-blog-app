import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './app/providers'
import { AuthProvider } from './features/auth'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
