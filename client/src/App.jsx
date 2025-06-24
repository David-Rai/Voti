import React, { useEffect } from 'react'
import {io} from 'socket.io-client'

const App = () => {

  useEffect(()=>{
   const socket=io("http://localhost:1111")
  },[])

  return (
    <div>App</div>
  )
}

export default App