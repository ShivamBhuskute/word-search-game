import React, { useState, useEffect } from "react";

function generateEmptyGrid(size) {
    return Array(size)
        .fill(null)
        .map(() => Array(size).fill(""));
}

function canPlaceWordAt(grid, word, x, y, dx, dy) {
    for (let i = 0; i < word.length; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (
            nx < 0 ||
            nx >= grid.length ||
            ny < 0 ||
            ny >= grid.length ||
            (grid[ny][nx] !== "" && grid[ny][nx] !== word[i])
        ) {
            return false;
        }
    }
    return true;
}

function placeWordAt(grid, word, x, y, dx, dy) {
    for (let i = 0; i < word.length; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        grid[ny][nx] = word[i];
    }
}

function placeWordsInGrid(grid, words) {
    const directions = [
        { x: 1, y: 0 }, // right
        { x: 0, y: 1 }, // down
        { x: 1, y: 1 }, // diagonal down-right
        { x: -1, y: 1 }, // diagonal down-left
    ];

    words.forEach((word) => {
        let placed = false;

        while (!placed) {
            const direction =
                directions[Math.floor(Math.random() * directions.length)];
            const startX = Math.floor(Math.random() * grid.length);
            const startY = Math.floor(Math.random() * grid.length);

            if (
                canPlaceWordAt(
                    grid,
                    word,
                    startX,
                    startY,
                    direction.x,
                    direction.y
                )
            ) {
                placeWordAt(
                    grid,
                    word,
                    startX,
                    startY,
                    direction.x,
                    direction.y
                );
                placed = true;
            }
        }
    });

    return grid;
}

function fillGridWithRandomLetters(grid) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return grid.map((row) =>
        row.map((cell) =>
            cell === "" ? alphabet[Math.floor(Math.random() * 26)] : cell
        )
    );
}

const WordGrid = ({ size, words }) => {
    const [grid, setGrid] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);

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

    return (
        <div className="grid grid-cols-10 gap-0 border-collapse border border-gray-500">
            {grid.map((row, rowIndex) =>
                row.map((cell, cellIndex) => {
                    const cellKey = `${rowIndex}-${cellIndex}`;
                    const isSelected = selectedCells.includes(cellKey);

                    return (
                        <div
                            key={cellKey}
                            className={`w-8 h-8 flex items-center justify-center border text-lg font-bold cursor-pointer ${
                                isSelected ? "bg-blue-500 text-white" : ""
                            }`}
                            onClick={() => handleCellClick(rowIndex, cellIndex)}
                        >
                            {cell}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default WordGrid;
