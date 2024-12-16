import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import {
    generateEmptyGrid,
    placeWordsInGrid,
    fillGridWithRandomLetters,
} from "../logic/GridLogic.js";
import Header from "./Header.jsx";
import { Navigate, useNavigate } from "react-router-dom";

const WordGrid = ({ size, words }) => {
    const [grid, setGrid] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [correctWords, setCorrectWords] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [incorrectCells, setIncorrectCells] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60); // Timer state
    const [isGameOver, setIsGameOver] = useState(false);
    let shuffleTimer;
    const [findWords, setFindWords] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false); // game completion
    const [shuffleInitiated, setShuffleInitiated] = useState(false); // shuffle tracking
    const navigate = useNavigate();
    // const [points, setPoints] = useState(0);

    useEffect(() => {
        let newGrid = generateEmptyGrid(size);
        newGrid = placeWordsInGrid(newGrid, words);
        newGrid = fillGridWithRandomLetters(newGrid);
        setGrid(newGrid);
    }, [size, words]);

    const handleCellClick = (rowIndex, cellIndex) => {
        const cellKey = `${rowIndex}-${cellIndex}`;
        setSelectedCells((prev) =>
            prev.includes(cellKey)
                ? prev.filter((key) => key !== cellKey)
                : [...prev, cellKey]
        );
        if (!shuffleInitiated) {
            startShuffleTimer();
            setShuffleInitiated(true);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTimeLeft) =>
                prevTimeLeft > 0 ? prevTimeLeft - 1 : 0
            );
            // console.log(
            //     `Timer: ${new Date().toISOString()}, timeLeft: ${timeLeft}`
            // );

            if (timeLeft === 0) {
                clearInterval(timer);
                setIsGameOver(true);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [timeLeft]);

    const shuffleBoard = () => {
        setSelectedCells([]); // Reset selected cells
        setCorrectWords([]); // Reset correct words
        setIncorrectCells([]); // Reset incorrect cells
        setSubmitted(false);
        setShuffleInitiated(false);
        setTimeout(() => {
            // Generate and set a new grid after selectedCells is reset
            let newGrid = generateEmptyGrid(size);
            newGrid = placeWordsInGrid(newGrid, words);
            newGrid = fillGridWithRandomLetters(newGrid);
            setGrid(newGrid);
        }, 0); // Delay to allow state to clear before generating new grid
    };

    const restart = () => {
        setSelectedCells([]); // Reset selected cells
        setCorrectWords([]); // Reset correct words
        setIncorrectCells([]); // Reset incorrect cells
        setSubmitted(false);
        setFindWords([]);
        setShuffleInitiated(false);
        // setPoints(0);
        setTimeout(() => {
            // Generate and set a new grid after selectedCells is reset
            let newGrid = generateEmptyGrid(size);
            newGrid = placeWordsInGrid(newGrid, words);
            newGrid = fillGridWithRandomLetters(newGrid);
            setGrid(newGrid);
        }, 0); // Delay to allow state to clear before generating new grid
    };

    const startShuffleTimer = () => {
        clearTimeout(shuffleTimer);
        shuffleTimer = setTimeout(() => {
            shuffleBoard();
            // console.log(`Shuffled`);
        }, 16000);
    };

    const handleRestart = () => {
        // Reset game state
        setTimeLeft(60);
        setIsGameOver(false);
        // other reset logic
        setGameCompleted(false);
        restart();
    };

    const checkWords = () => {
        let foundWords = [];
        let incorrect = [];
        const newFoundWords = new Set(findWords); // found words

        words.forEach((word) => {
            let positions = [];
            let found = false;

            // Iterate over the grid to find all positions of this word
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] === word[0]) {
                        const directions = [
                            { x: 1, y: 0 },
                            { x: 0, y: 1 },
                            { x: 1, y: 1 },
                            { x: -1, y: 1 },
                        ];

                        for (let dir of directions) {
                            let positionsTemp = [];
                            for (let i = 0; i < word.length; i++) {
                                const nx = row + dir.y * i;
                                const ny = col + dir.x * i;
                                if (
                                    nx < 0 ||
                                    nx >= grid.length ||
                                    ny < 0 ||
                                    ny >= grid[row].length ||
                                    grid[nx][ny] !== word[i]
                                ) {
                                    break;
                                }
                                positionsTemp.push(`${nx}-${ny}`);
                            }

                            if (positionsTemp.length === word.length) {
                                positions = positionsTemp;
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found) break;
                }
                if (found) break;
            }

            // Check if the found positions match the selected cells
            if (
                found &&
                positions.every((pos) => selectedCells.includes(pos))
            ) {
                if (!newFoundWords.has(word)) {
                    foundWords.push({ word, positions });
                    newFoundWords.add(word); // Add to the set of found words
                }
            } else if (positions.length > 0) {
                // Only penalize if the word was found but not correctly selected
                incorrect.push(...selectedCells);
            }
        });

        setCorrectWords((prev) => [...prev, ...foundWords]);
        setFindWords((prev) => [...prev, ...foundWords.map((fw) => fw.word)]);
        setSubmitted(true);
        setIncorrectCells(incorrect);
        startShuffleTimer();

        // Check if all words are found
        if (findWords.length === words.length) {
            setGameCompleted(true);
            navigate("/congratulations");
        }

        // console.log(foundWords.length, words.length);
    };

    // if (gameCompleted) {
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 relative text-white">
    //             <Confetti
    //                 width={window.innerWidth}
    //                 height={window.innerHeight}
    //             />
    //             <h1 className="text-3xl font-bold">Congratulations!</h1>
    //             <p className="text-lg mt-4">You found all the words!</p>
    //             <button
    //                 className="mt-4 p-2 bg-blue-600 text-white rounded  hover:bg-blue-100 hover:text-black"
    //                 onClick={handleRestart}
    //             >
    //                 Restart Game
    //             </button>
    //         </div>
    //     ); // Render Congratulations message if game is completed
    // }

    return (
        <>
            <Header />
            {isGameOver ? (
                <div className="flex flex-col bg-gray-900 text-white items-center justify-center h-[550px] sm:flex-col sm:justify-center">
                    <h1 className="text-2xl sm:text-4xl font-bold items-center justify-center">
                        BETTER LUCK NEXT TIME!!
                    </h1>
                    <br />
                    <div>
                        <button
                            className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-100 hover:text-black"
                            onClick={handleRestart}
                        >
                            Restart
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row w-screen mt-[5%] items-center justify-items-center">
                    {/* Word Grid on the left side */}
                    <div className="flex flex-col items-center w-1/2">
                        <div className="inline-block items-start">
                            <div className="text-2xl text-white ">
                                Time Left: {timeLeft}s
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-10 gap-0 sm:grid-cols-10 md:grid-cols-10 lg:grid-cols-10 col-10">
                            {grid.map((row, rowIndex) =>
                                row.map((cell, cellIndex) => {
                                    const cellKey = `${rowIndex}-${cellIndex}`;
                                    const isSelected =
                                        selectedCells.includes(cellKey);
                                    const isWordCorrect = correctWords.some(
                                        (word) =>
                                            word.positions.includes(cellKey)
                                    );
                                    const isIncorrect =
                                        incorrectCells.includes(cellKey) &&
                                        submitted;

                                    return (
                                        <div
                                            key={cellKey}
                                            className={`bg-gray-300 h-6 w-5 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 flex items-center justify-center sm:items-center sm:justify-center border border-black cursor-pointer  ${
                                                isSelected
                                                    ? "bg-blue-800 text-white sm:bg-blue-700"
                                                    : "hover:bg-violet-300"
                                            } ${
                                                isWordCorrect
                                                    ? "bg-green-800 text-white sm:bg-green-700"
                                                    : isIncorrect
                                                    ? "bg-red-800 text-white sm:bg-red-700"
                                                    : ""
                                            } hover:border-blue-500`}
                                            onClick={() =>
                                                handleCellClick(
                                                    rowIndex,
                                                    cellIndex
                                                )
                                            }
                                        >
                                            {cell}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right side for words and timer */}
                    <div className="flex flex-col items-start w-1/2 ">
                        <div className="">
                            <ul className="text-lg list-disc ml-5 text-white space-y-2 grid-cols-3 mt-5 ">
                                {words
                                    .filter((word) => !findWords.includes(word))
                                    .map((word, index) => (
                                        <li className="space-y-5" key={index}>
                                            {word}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className="">
                            <button
                                className="mt-16 p-2 bg-blue-600 text-black rounded  sm:hover:bg-blue-100"
                                onClick={checkWords}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WordGrid;
