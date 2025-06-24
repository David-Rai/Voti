import React, { useEffect } from 'react'
import { useContext } from 'react'
import { SocketContext } from '../context/Socket'

const App = () => {
const socket=useContext(SocketContext)

  return (
    <div>App</div>
  )
}

export default App