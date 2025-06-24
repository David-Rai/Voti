import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import Home from './pages/Home.jsx'
import { SocketProvider } from './context/Socket.jsx'
import Room from './pages/Room.jsx'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

const router = createBrowserRouter([
    {
      path: "/",
      element:<Home />,
    },
    {
        path:"/room/:roomId",
        element:<Room />
    }
  ]);

createRoot(document.getElementById('root')).render(
    <SocketProvider>
       <RouterProvider router={router} />
    </SocketProvider>
)
