import React, { useEffect, useRef, useContext } from 'react'
import { useParams } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import { SocketContext } from '../context/Socket'


const Publish = () => {
    const param = useParams()
    const socket = useContext(SocketContext)

    useEffect(() => {
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

                {/* <div>
                    <p>
                        {
                            window.location.href
                        }
                    </p>
                </div> */}

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
                >Copy Link</button>
                <ToastContainer />
            </main>
        </>
    )
}

export default Publish


import { useState } from 'react'

function VotingBox() {
    const [votes, setVotes] = useState({ optionA: 0, optionB: 0 });

    const totalVotes = votes.optionA + votes.optionB;
    const percentageA = totalVotes === 0 ? 0 : (votes.optionA / totalVotes) * 100;
    const percentageB = totalVotes === 0 ? 0 : (votes.optionB / totalVotes) * 100;

    const vote = (option) => {
        setVotes(prev => ({
            ...prev,
            [option]: prev[option] + 1
        }));
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-2xl text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Which do you prefer?</h2>

            <div className="flex justify-between gap-4 mb-6">
                <button
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
                    onClick={() => vote('optionA')}
                >
                    Option A
                </button>
                <button
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition"
                    onClick={() => vote('optionB')}
                >
                    Option B
                </button>
            </div>

            <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600"
                    style={{ width: `${percentageA}%` }}
                ></div>
                <div
                    className="h-full bg-green-600 absolute"
                    style={{ width: `${percentageB}%`, left: `${percentageA}%` }}
                ></div>
            </div>

            <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>Option A: {votes.optionA} ({percentageA.toFixed(0)}%)</span>
                <span>Option B: {votes.optionB} ({percentageB.toFixed(0)}%)</span>
            </div>
        </div>
    )
}
