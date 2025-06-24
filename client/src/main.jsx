import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import { SocketProvider } from './context/Socket.jsx'

createRoot(document.getElementById('root')).render(
    <SocketProvider>
    <Home />
    </SocketProvider>
)
