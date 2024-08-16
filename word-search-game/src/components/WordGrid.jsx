import React, { useState, useEffect } from "react";
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
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTimeLeft) =>
                prevTimeLeft > 0 ? prevTimeLeft - 1 : 0
            );
            console.log(
                `Timer: ${new Date().toISOString()}, timeLeft: ${timeLeft}`
            );

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
            console.log(`Shuffled`);
        }, 9000);
    };

    const handleRestart = () => {
        // Reset game state
        setTimeLeft(60);
        setIsGameOver(false);
        // other reset logic
        restart();
    };

    const checkWords = () => {
        let foundWords = [];
        let incorrect = [];

        words.forEach((word) => {
            let positions = [];
            let found = false;

            // Iterate over grid to find all positions of this word
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] === word[0]) {
                        // Check in all 4 possible directions
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

            if (
                found &&
                positions.every((pos) => selectedCells.includes(pos))
            ) {
                foundWords.push({ word, positions });
            } else {
                incorrect.push(...selectedCells); // Added incorrect selections
            }
        });

        setCorrectWords((prev) => [...prev, ...foundWords]);
        setFindWords((prev) => [...prev, ...foundWords.map((fw) => fw.word)]);
        setSubmitted(true); // Reset submitted state to allow further selections
        setIncorrectCells(incorrect);
        startShuffleTimer();
    };

    return (
        <>
            {isGameOver ? (
                <>
                    <h1>Better luck next time</h1>
                    <div>
                        <button onClick={handleRestart}>Restart</button>
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-10 gap-0 border-collapse border border-gray-500">
                        {grid.map((row, rowIndex) =>
                            row.map((cell, cellIndex) => {
                                const cellKey = `${rowIndex}-${cellIndex}`;
                                const isSelected =
                                    selectedCells.includes(cellKey);
                                const isWordCorrect = correctWords.some(
                                    (word) => word.positions.includes(cellKey)
                                );

                                const isIncorrect =
                                    incorrectCells.includes(cellKey) &&
                                    submitted;

                                return (
                                    <div
                                        key={cellKey}
                                        className={`cell border border-gray-400 w-10 h-10 inline-block text-center leading-10 cursor-pointer  ${
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
                                            handleCellClick(rowIndex, cellIndex)
                                        }
                                    >
                                        {cell}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">
                            Find these words:
                        </h2>
                        <ul className="list-disc ml-5">
                            {words
                                .filter((word) => !findWords.includes(word))
                                .map((word, index) => (
                                    <li key={index}>{word}</li>
                                ))}
                        </ul>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl">Time Left: {timeLeft}s</div>
                    </div>

                    <button
                        className="mt-4 p-2 bg-blue-600 text-white rounded"
                        onClick={checkWords}
                    >
                        Submit
                    </button>
                </>
            )}
        </>
    );
};

export default WordGrid;
