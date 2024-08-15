import React from "react";
import WordGrid from "../src/components/WordGrid";

const App = () => {
    // const words = ["HELLO", "WORLD", "REACT", "GRID", "GAME"];
    const words = ["HELLO", "WORLD", "REACT", "GRID", "GAME"];
    const gridSize = 10;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Word Search Game</h1>
            <WordGrid size={gridSize} words={words} />
        </div>
    );
};

export default App;
