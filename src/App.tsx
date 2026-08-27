import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/Layout'
import { OutlineTitle } from './components/OutlineTitle'

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
        { path: '/', element: <Placeholder text="Chiang Mai" /> },
        { path: '/axis/:dir', element: <Placeholder text="Axis" /> },
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
