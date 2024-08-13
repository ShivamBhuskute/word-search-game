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

export { generateEmptyGrid, placeWordsInGrid, fillGridWithRandomLetters };
