import React from "react";

function Header() {
    return (
        <nav className="bg-gray-800 border-gray-200 px-4 lg:px-6 py-2.5 w-full border-b-2 ">
            <h1 className="text-3xl inline-block font-bold text-left text-white p-5 hover:text-yellow-600">
                <span>&#128269;</span>Word Search
            </h1>
        </nav>
    );
}

export default Header;
