import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/Layout'
import { OutlineTitle } from './components/OutlineTitle'
import { AxisPage } from './pages/AxisPage'
import { HomePage } from './pages/HomePage'

function Placeholder({ text }: { text: string }) {
  return (
    <main className="px-6 py-16 md:px-14">
      <OutlineTitle text={text} className="text-5xl md:text-7xl" />
    </main>
  )
}

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/axis/:dir', element: <AxisPage /> },
        { path: '/note/:id', element: <Placeholder text="Note" /> },
        { path: '/graph', element: <Placeholder text="Graph" /> },
      ],
    },
  ],
  { basename: '/chiangmai-kb' },
)

function App() {
  return <RouterProvider router={router} />
}

export default App
