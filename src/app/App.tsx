import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './providers'
import { router } from './routes/router'

export function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}
