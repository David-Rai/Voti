import {createContext} from 'react'
import {io} from 'socket.io-client'
import React from 'react'

export const SocketContext=createContext(null)

export const SocketProvider=({children})=>{
const socket=io("https://voti-1ibw.onrender.com/")

    return (
        <SocketContext.Provider value={socket}>
            {
                children
            }
        </SocketContext.Provider>

    )
}