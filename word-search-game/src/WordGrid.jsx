import React, { useState, useEffect } from "react";
import {
    generateEmptyGrid,
    placeWordsInGrid,
    fillGridWithRandomLetters,
} from "./logic/GridLogic.js";

const WordGrid = ({ size, words }) => {
    const [grid, setGrid] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [correctWords, setCorrectWords] = useState([]);

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
    const [submitted, setSubmitted] = useState(false);

    const checkWords = () => {
        setSubmitted(true);

        let foundWords = [];

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
            }
        });

        setCorrectWords(foundWords);
    };

    return (

        <>
            <div className="grid grid-cols-10 gap-0 border-collapse border border-gray-500">
                {grid.map((row, rowIndex) =>
                    row.map((cell, cellIndex) => {
                        const cellKey = `${rowIndex}-${cellIndex}`;
                        const isSelected = selectedCells.includes(cellKey);
                        const isWordCorrect = correctWords.some((word) =>
                            word.positions.includes(cellKey)
                        );
                        const isIncorrect =
                            !isWordCorrect && isSelected && submitted; // Check if word is incorrect and submitted

                        return (
                            <div
                                key={cellKey}
                                className={`w-8 h-8 flex items-center justify-center border text-lg font-bold cursor-pointer ${
                                    isSelected ? "bg-blue-500 text-white" : ""
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
                <h2 className="text-xl font-semibold">Find these words:</h2>
                <ul className="list-disc ml-5">
                    {words.map((word, index) => (
                        <li
                            key={index}
                            className={`${
                                correctWords.includes(word)
                                    ? "line-through text-green-500"
                                    : ""
                            }`}
                        >
                            {word}
                        </li>
                    ))}
                </ul>
            </div>

            <button
                className="mt-4 p-2 bg-blue-600 text-white rounded"
                onClick={checkWords}
            >
                Submit
            </button>
        </>
    );
};

export default WordGrid;
