// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";

// const Home = () => {
//     const navigate = useNavigate();

//     const handleClick = () => {
//         navigate("/app");
//     };

//     return (
//         <>
//             <Header />
//             <div className="bg-gray-900 min-h-screen grid grid-row-3 sm:grid-cols-3">
//                 <div className="">
//                     <h1 className="font-bold text-5xl ">
//                         Welcome to the Home Page
//                     </h1>
//                     <p>This is the content of the Home page.</p>
//                     <button
//                         className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-100 hover:text-black"
//                         onClick={handleClick}
//                     >
//                         Play
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Home;
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
            <div className="bg-gray-900 min-h-screen grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                <div className="flex flex-col justify-center items-start min-h-screen">
                    <h1 className="font-bold text-5xl text-white">
                        Welcome to the Home Page
                    </h1>
                    <p className="text-white">
                        This is the content of the Home page.
                    </p>
                    <button
                        className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-100 hover:text-black"
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
