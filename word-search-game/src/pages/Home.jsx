import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/app");
    };

    return (
        <>
            <Header />
            <div className="bg-gray-900 min-h-screen grid grid-cols-1 sm:grid-cols-1 gap-4 p-4">
                <div className="flex flex-col justify-center items-start sm:items-center">
                    <h1 className="text-xl font-bold sm:text-5xl text-white">
                        Ready for word search game
                    </h1>
                    
                    <button
                        className="mt-4 p-2 sm:p-2 sm:px-4 bg-blue-600 text-white rounded hover:bg-blue-100 hover:text-black"
                        onClick={handleClick}
                    >
                        Play
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
