import React, { useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router';
import { useParams } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import { SocketContext } from '../context/Socket'


const Publish = () => {
    const param = useParams()
    const socket = useContext(SocketContext)
    const navigate = useNavigate()

    useEffect(() => {

        //Joining the room
        const roomId = param.roomId
        console.log(roomId)
        socket.emit("join-room", roomId)

        //Joined messasges
        socket.on("join-message",(message)=>{
        toast.success(message.count)
        console.log(message)
        })

        //Handling when the sessions ends
        const handleTimerEnd = () => {
            toast.error("voting ended");
            console.log("timer ended");
        };

        socket.on('timer-ended', handleTimerEnd);

        return () => {
            socket.off('timer-ended', handleTimerEnd); // Cleanup
        };
    }, []);


    //Handling the copy link
    const handleCopy = () => {
        const link = window.location.href
        navigator.clipboard.writeText(link)
        toast.success("Successfully copied")
    }
    return (
        <>
            <main className='h-screen w-full bg-gray-100 flex items-center justify-center flex-col gap-5'>

                <button onClick={() => navigate("/")} className='absolute text-white h-[50px] w-[120px] top-6 left-6  bg-green-600 hover:bg-green-700 rounded-xl transition'>Go back</button>

                {/* <VotingBox /> */}
                <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-2xl text-white shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 text-center">Which do you prefer?</h2>

                    <div className="flex justify-between gap-4">
                        <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition">
                            Option A
                        </button>
                        <button className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition">
                            Option B
                        </button>
                    </div>
                </div>

                <button onClick={handleCopy}
                    className='h-[40px] w-[120px] bg-green-500 text-white rounded-xl'
                >
                    Copy Link
                </button>
                {/* <progress value={0.4} />
                <progress value={1} /> */}
                <ToastContainer />
            </main>
        </>
    )
}

export default Publish

