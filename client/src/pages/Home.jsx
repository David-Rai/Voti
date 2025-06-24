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
      option2: "Pessi"
    }
  })

  //Handling the Socket Connection
  useEffect(() => {
    socket.on("roomId", (roomId) => {
      if (roomId) {
   navigate("/room")
      }
    })
  }, [])

  //Handing the Form submission
  const handlePublish = (data) => {
    console.log(data)
    const { title } = data
    socket.emit("create", { title, options: [data.option1, data.option2] })
  }

  return (

    <>
      <main className='h-screen w-full bg-slate-100 flex items-center justify-center flex-col'>
        <h1 className='m-4 text-2xl'>Publish new statement</h1>
        <div className="bg-white min-h-[250px] w-[80%] rounded-lg py-4">

          <form onSubmit={handleSubmit(handlePublish)} className='h-full w-full flex items-center justify-center gap-4 flex-col'>
            {/* Title */}
            <input type="text" name="title" placeholder='Title' className='input'
              {...register("title", {
                required: "Title is required"
              })}
            />
            {
              errors.title && <p>{errors.title.message}</p>
            }
            <input type="text" name="option1" placeholder='option 1' className='input'
              {...register("option1", {
                required: "option is required"
              })}

            />
            {
              errors.option1 && <p>{errors.option1.message}</p>
            }
            <input type="text" name="option2" placeholder='option 2' className='input'
              {...register("option2", {
                required: "option is required"
              })}

            />
            {
              errors.option2 && <p>{errors.option2.message}</p>
            }

            <button
              type='submit'
              className='h-[40px] w-[120px] bg-purple-500 rounded-md text-white'>
              Publish
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default App