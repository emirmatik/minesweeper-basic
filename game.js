// flow
// setup the board.
// setup mines randomly
// iterate through all cells and calculate the number of mines around ()

const grid = document.querySelector(".grid");
const ROWS = 20;
const COLS = 20;
const MINES = 50;
const CELLS = new Array(ROWS * COLS).fill(0);

let isVisited = [];

const onClick = index => {
    const cellsHtml = grid.children;
    const cell = cellsHtml[index];
    
    if (cell.classList.contains('mine')) {
        [...cellsHtml].forEach(cell => cell.classList.add('visible'));
        cell.style.backgroundColor = 'tomato';
    }
    else if (cell.textContent === '') {
        isVisited = [];
        openAround(index);
    } else {
        cell.classList.add('visible');
    }
}

const openAround = (i) => {
    const cellsHtml = grid.children;
    const row = Math.floor(i / ROWS);
    const col = i % ROWS;

    if (isVisited.includes(i)) return;

    isVisited.push(i);

    cellsHtml[i].classList.add('visible');
    
    const neighbors = [];

    // left
    if (col > 0) neighbors.push({ cell: cellsHtml[i - 1], i: i - 1 });
    // right
    if (col < COLS - 1) neighbors.push({ cell: cellsHtml[i + 1], i: i + 1 });
    // top
    if (row > 0) neighbors.push({ cell: cellsHtml[i - COLS], i: i - COLS });
    // top left
    if (row > 0 && col > 0) neighbors.push({ cell: cellsHtml[i - COLS - 1], i: i - COLS - 1 });
    // top right
    if (row > 0 && col < COLS - 1) neighbors.push({ cell: cellsHtml[i - COLS + 1], i: i - COLS + 1 });
    // bottom
    if (row < ROWS - 1) neighbors.push({ cell: cellsHtml[i + COLS], i: i + COLS });
    // bottom left
    if (row < ROWS - 1 && col > 0) neighbors.push({ cell: cellsHtml[i + COLS - 1], i: i + COLS - 1 });
    // bottom right
    if (row < ROWS - 1 && col < COLS - 1) neighbors.push({ cell: cellsHtml[i + COLS + 1], i: i + COLS + 1 });

    if (!neighbors.some(({ cell }) => cell.classList.contains('mine'))) {
        neighbors.forEach(({ i }) => {
            openAround(i);
        });
    }
}

const setupBoard = () => {
    for (let i = 0; i < CELLS.length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => onClick(i));
        
        grid.appendChild(cell);
    }

    grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
}

const locateMines = () => {
    const cellsHtml = grid.children;
    const prob = MINES / CELLS.length;
    let curMines = 0;

    for (let i = 0; i < CELLS.length; i++) {
        if (curMines === MINES) break;

        const isMine = Math.random() <= prob;

        if (isMine) {
            cellsHtml[i].classList.add('mine');
            curMines++;
        }
    }
}

const numerateCells = () => {
    const cellsHtml = grid.children;
    
    for (let i = 0; i < cellsHtml.length; i++) {
        const cell = cellsHtml[i];
        
        if (!cell.classList.contains('mine')) {
            const row = Math.floor(i / ROWS);
            const col = i % ROWS;
            let minesAround = 0;

            // left
            if (col > 0 && cellsHtml[i - 1].classList.contains('mine')) minesAround++;
            // right
            if (col < COLS - 1 && cellsHtml[i + 1].classList.contains('mine')) minesAround++;
            // top
            if (row > 0 && cellsHtml[i - COLS].classList.contains('mine')) minesAround++;
            // top left
            if (row > 0 && col > 0 && cellsHtml[i - COLS - 1].classList.contains('mine')) minesAround++;
            // top right
            if (row > 0 && col < COLS - 1 && cellsHtml[i - COLS + 1].classList.contains('mine')) minesAround++;
            // bottom
            if (row < ROWS - 1 && cellsHtml[i + COLS].classList.contains('mine')) minesAround++;
            // bottom left
            if (row < ROWS - 1 && col > 0 && cellsHtml[i + COLS - 1].classList.contains('mine')) minesAround++;
            // bottom right
            if (row < ROWS - 1 && col < COLS - 1 && cellsHtml[i + COLS + 1].classList.contains('mine')) minesAround++;
        
            cell.textContent = minesAround > 0
                ? minesAround
                : '';
        }
    }
}

setupBoard();
locateMines();
numerateCells();
