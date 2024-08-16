// import React from "react";
// import WordGrid from "../src/components/WordGrid";

// const App = () => {
//     // const words = ["HELLO", "WORLD", "REACT", "GRID", "GAME"];
//     const words = ["HELLO", "WORLD", "REACT", "GRID", ];
//     const gridSize = 10;

//     return (
//         <div className="flex flex-col bg-gray-900 min-h-screen">
//             <WordGrid size={gridSize} words={words} />
//         </div>
//     );
// };

// export default App;
import React, { useState, useEffect } from "react";
import WordGrid from "../src/components/WordGrid";

const App = () => {
    const wordSets = [
        [
            "HELLO",
            "WORLD",
            "REACT",
            "GRID",
            "GAME",
            "CODE",
            "JAVASCRIPT",
            "PYTHON",
            "HTML",
            "CSS",
        ],
        [
            "APPLE",
            "ORANGE",
            "BANANA",
            "GRAPE",
            "PEAR",
            "MANGO",
            "PINEAPPLE",
            "KIWI",
            "PEACH",
            "PLUM",
        ],
        [
            "MOUNTAIN",
            "RIVER",
            "OCEAN",
            "FOREST",
            "DESERT",
            "VALLEY",
            "PLATEAU",
            "ISLAND",
            "LAKE",
            "POND",
        ],
        [
            "DOG",
            "CAT",
            "LION",
            "TIGER",
            "ELEPHANT",
            "GIRAFFE",
            "ZEBRA",
            "MONKEY",
            "BEAR",
            "PANDA",
        ],
    ];

    const [words, setWords] = useState([]);

    useEffect(() => {
        // Randomly select a set of words
        const randomSet = wordSets[Math.floor(Math.random() * wordSets.length)];
        setWords(randomSet);
    }, []); // Empty dependency array ensures this only runs once on mount

    const gridSize = 10;

    return (
        <div className="flex flex-col bg-gray-900 min-h-screen">
            {words.length > 0 && <WordGrid size={gridSize} words={words} />}
        </div>
    );
};

export default App;
