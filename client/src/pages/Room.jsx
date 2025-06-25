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
            <main className="min-h-screen w-full bg-slate-900 flex items-center justify-center flex-col gap-6 px-4 py-8">

                <p className='text-slate-300'>Note : Your can vote infinite times</p>
                <p className='text-slate-300'>current voters {detail && detail.count}</p>
            
                {/* Voting Box */}
                <div className="w-full max-w-xl bg-slate-800 text-white p-6 rounded-xl shadow-md flex flex-col items-center gap-5">
                    <h2 className="text-2xl font-bold text-center text-slate-100">
                        {detail && detail.data.title}
                    </h2>

                    {/* Vote Buttons */}
                    <div className="flex flex-col sm:flex-row w-full gap-4">
                        <button
                            onClick={() => handleVote("v1")}
                            className="flex-1 py-3 bg-blue-500 hover:bg-blue-400 rounded-md transition"
                        >
                            {detail && detail.data.options[0]}
                        </button>
                        <button
                            onClick={() => handleVote("v2")}
                            className="flex-1 py-3 bg-pink-500 hover:bg-pink-400 rounded-md transition"
                        >
                            {detail && detail.data.options[1]}
                        </button>
                    </div>

                    {/* Vote Progress */}
                    <div className="flex w-full h-10 rounded-full overflow-hidden">
                        <span
                            style={{
                                width: `${progress.p1}%`,
                                backgroundColor: progress.p1 > progress.p2 ? "#10B981" : "#6B7280",
                            }}
                            className="h-full flex items-center justify-center text-sm"
                        >
                            {detail && detail.votes.v1}
                        </span>
                        <span
                            style={{
                                width: `${progress.p2}%`,
                                backgroundColor: progress.p2 > progress.p1 ? "#10B981" : "#6B7280",
                            }}
                            className="h-full flex items-center justify-center text-sm"
                        >
                            {detail && detail.votes.v2}
                        </span>
                    </div>
                </div>

                {/* Copy Link Button */}
                <button
                    onClick={handleCopy}
                    className="w-40 h-10 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                    Copy link
                </button>

                {/* Publish your own */}
                <button
                    onClick={() => navigate("/")}
                    className=" w-[160px] h-[40px] bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition duration-300"
                >
                    Publish your own
                </button>

                <ToastContainer />
            </main>

        </>
    )
}

export default Publish

