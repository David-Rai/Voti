import React, { useEffect, useRef, useContext, useState } from 'react'
import { useNavigate } from 'react-router';
import { useParams } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import { SocketContext } from '../context/Socket'


const Publish = () => {
    const param = useParams()
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const [detail, setDetail] = useState(null)
    const [progress, setProgress] = useState({ total: 0, p1: 50, p2: 50 })

    //Show results
    const handleResult = () => {
        if (detail) {
            let t = detail.votes.v1 + detail.votes.v2
            let lp1 = (detail.votes.v1 / t) * 100
            let lp2 = (detail.votes.v2 / t) * 100
            setProgress({
                ...progress,
                total: t,
                p1: lp1,
                p2: lp2,
            });

        }
    }

    useEffect(() => {
        handleResult()
    }, [detail])

    //**********Handling all the socket connection
    useEffect(() => {

        //Joining the room
        const roomId = param.roomId
        console.log(roomId)
        socket.emit("join-room", roomId)

        //Joined messasges
        socket.on("join-message", (message) => {
            toast.success(`Total voters ${message.count}`)
            // console.log(message)
            setDetail(message)
        })

        //Getting the votes update
        socket.on("vote", (message) => {
            // toast.success(message.count)
            setDetail(message)
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


    //Handling voting
    const handleVote = (vote) => {
        const roomId = param.roomId

        if (vote === "v1") {
            socket.emit("v1", roomId)
            // console.log("voting 1")
            return
        } else {
            socket.emit("v2", roomId)
            // console.log("voting 2")
        }
    }


    //Handling the copy link
    const handleCopy = () => {
        const link = window.location.href
        navigator.clipboard.writeText(link)
        toast.success("Successfully copied")
    }



    return (
        <>
            <main className='h-screen w-full bg-slate-900 flex items-center justify-center flex-col gap-5'>

                {/* <button onClick={() => navigate("/")}
                    className='absolute text-white h-[50px] w-[120px] top-6 left-6
                   bg-green-600 hover:bg-green-700 rounded-xl
                    transition'>Go back
                </button> */}


                {/* <VotingBox /> */}
                <div className="p-5 min-h-[200px] w-[80%] white rounded-md text-white shadow-xs bg-slate-800 flex flex-col justify-center items-center gap-5">
                    <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">{detail && detail.data.title}</h2>

                    <div className="flex w-full gap-5">
                        <button onClick={() => handleVote("v1")} className="flex-1 py-3 bg-blue-500 hover:bg-blue-400 rounded-md transition">
                            {detail && detail.data.options[0]}
                        </button>
                        <button onClick={() => handleVote("v2")} className="flex-1 py-3 bg-pink-500 hover:bg-pink-400 rounded-md transition">
                            {detail && detail.data.options[1]}
                        </button>
                    </div>


                    {/* Votes */}
                    <div className='flex w-full h-[40px] rounded-3xl overflow-hidden'>
                        <span style={{ width: `${progress.p1}%`, backgroundColor: `${progress.p1 > progress.p2 ? "#10B981" : "#6B7280"}` }} className={` h-full flex items-center justify-center`}>{detail && detail.votes.v1}</span>
                        <span style={{ width: `${progress.p2}%`, backgroundColor: `${progress.p1 > progress.p2 ? "#6B7280" : "#10B981"}` }} className={`  h-full flex items-center justify-center`}>{detail && detail.votes.v2}</span>
                    </div>

                </div>

                <button onClick={handleCopy}
                    className='h-[40px] w-[120px] bg-green-500 text-white rounded-md'
                >
                    Copy Link
                </button>
                <ToastContainer />
            </main>
        </>
    )
}

export default Publish

