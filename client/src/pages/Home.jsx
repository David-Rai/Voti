import { useContext, useEffect } from 'react'
import { SocketContext } from '../context/Socket'
import { useForm } from 'react-hook-form'
import React from 'react'
import { useNavigate } from 'react-router'

const App = () => {
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "who is GOAT?",
      option1: "Ronaldo",
      option2: "Pessi",
      duration:1
    }
  })

  //Handling the Socket Connection
  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected to the socket server")
    })

    socket.on("roomId", (roomId) => {
      if (roomId) {
        navigate(`/room/${roomId}`)
      }
    })


  }, [])

  //Handing the Form submission
  const handlePublish = (data) => {
    // console.log(data)
    const { title,duration } = data
    socket.emit("create", { title, options: [data.option1, data.option2] ,duration })
  }

  return (

    <>
    <main className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4">
  <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
    <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">
      Publish New Statement
    </h1>

    <form
      onSubmit={handleSubmit(handlePublish)}
      className="flex flex-col gap-4"
    >
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        {...register("title", {
          required: "Title is required",
        })}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

      {/* Option 1 */}
      <input
        type="text"
        placeholder="Option 1"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        {...register("option1", {
          required: "Option 1 is required",
        })}
      />
      {errors.option1 && <p className="text-red-500 text-sm">{errors.option1.message}</p>}

      {/* Option 2 */}
      <input
        type="text"
        placeholder="Option 2"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        {...register("option2", {
          required: "Option 2 is required",
        })}
      />
      {errors.option2 && <p className="text-red-500 text-sm">{errors.option2.message}</p>}

      {/* Duration */}
      <input
        type="number"
        placeholder="Duration (in hours)"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        {...register("duration", {
          required: "Duration is required",
        })}
      />
      {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}

      <button
        type="submit"
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition duration-300"
      >
        Publish
      </button>
    </form>
  </div>
</main>

    </>
  )
}

export default App