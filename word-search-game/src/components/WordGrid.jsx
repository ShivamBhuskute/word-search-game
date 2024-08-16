import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import {
    generateEmptyGrid,
    placeWordsInGrid,
    fillGridWithRandomLetters,
} from "../logic/GridLogic.js";

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
    const [gameCompleted, setGameCompleted] = useState(false); // New state for game completion
    const [shuffleInitiated, setShuffleInitiated] = useState(false); // Track if shuffle has been initiated
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
        const newFoundWords = new Set(findWords); // Set of already found words
        // const currentFoundWords = new Set(); // Track currently found words to prevent duplicate deductions

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
        }

        // console.log(foundWords.length, words.length);
    };

    if (gameCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 relative text-white">
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
                <h1 className="text-3xl font-bold">Congratulations!</h1>
                <p className="text-lg mt-4">You found all the words!</p>
                <button
                    className="mt-4 p-2 bg-blue-600 text-white rounded"
                    onClick={handleRestart}
                >
                    Restart Game
                </button>
            </div>
        ); // Render Congratulations message if game is completed
    }

    return (
        <>
            <nav className="bg-gray-800 border-gray-200 px-4 lg:px-6 py-2.5 w-full mb-10">
                <h1 className="text-3xl font-bold text-left text-white p-5">
                    <span>&#128269;</span>Word Search
                </h1>
            </nav>
            {isGameOver ? (
                <div className="flex flex-col bg-gray-900 text-white items-center min-h-screen my-44">
                    <h1 className="text-4xl font-bold">
                        BETTER LUCK NEXT TIME!!
                    </h1>
                    <br />
                    <div>
                        <button
                            className="flex flex-col items-center justify-center mt-4 p-2 bg-blue-600 text-white rounded"
                            onClick={handleRestart}
                        >
                            Restart
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row w-full mx-auto ">
                    {/* Word Grid on the left side */}
                    <div className="flex flex-col items-start w-1/2 mx-auto ml-80">
                        <div className="flex flex-row">
                            <div className="text-2xl text-white">
                                Time Left: {timeLeft}s
                            </div>
                        </div>
                        <div
                            className={`bg-blue-200 grid grid-cols-10 gap-0 border-collapse border border-x-black border-y-black  text-black text-lg`}
                            style={{
                                gridTemplateRows: `repeat(${grid.length}, 2.5rem)`,
                            }} // Adjust row height
                        >
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
                                            className={`cell border border-black w-10 h-10 text-center leading-10 cursor-pointer ${
                                                isSelected
                                                    ? "bg-blue-500 text-white"
                                                    : ""
                                            } ${
                                                isWordCorrect
                                                    ? "bg-green-500 text-white"
                                                    : isIncorrect
                                                    ? "bg-red-500 text-white"
                                                    : ""
                                            }`}
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
                    <div className="flex flex-col items-start w-1/2 ml-10 mt-8">
                        <div className="mt-4">
                            <ul className="text-lg list-disc ml-5 text-white space-y-2">
                                {words
                                    .filter((word) => !findWords.includes(word))
                                    .map((word, index) => (
                                        <li className="space-y-5" key={index}>
                                            {word}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className="flex justify-between items-center mb-4"></div>
                        <button
                            className="mt-16 p-2 bg-gray-500 text-black rounded"
                            onClick={checkWords}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default WordGrid;
