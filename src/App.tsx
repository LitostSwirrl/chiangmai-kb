import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/Layout'
import { AxisPage } from './pages/AxisPage'
import { GraphPage } from './pages/GraphPage'
import { HomePage } from './pages/HomePage'
import { NotePage } from './pages/NotePage'

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/axis/:dir', element: <AxisPage /> },
        { path: '/note/:id', element: <NotePage /> },
        { path: '/graph', element: <GraphPage /> },
      ],
    },
  ],
  { basename: '/chiangmai-kb' },
)

function App() {
  return <RouterProvider router={router} />
}

export default App
