import React from "react";
import Header from "../components/Header";
import Confetti from "react-confetti";

import { useNavigate } from "react-router-dom";

function Congratulations() {
    const navigate = useNavigate();
    const handleSubmitRestart = () => {
        // Reset game state
        navigate("/app");
    };
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center h-[700px] bg-gray-900 relative text-white overflow-hidden">
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
                <h1 className="text-3xl font-bold">Congratulations!</h1>
                <p className="text-lg mt-4">You found all the words!</p>
                <button
                    className="mt-4 p-2 bg-blue-600 text-white rounded  hover:bg-blue-100 hover:text-black"
                    onClick={handleSubmitRestart}
                >
                    Restart Game
                </button>
            </div>
        </>
    );
}

export default Congratulations;
