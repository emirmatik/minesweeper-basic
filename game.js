// flow
// setup the board.
// setup mines randomly
// iterate through all cells and calculate the number of mines around ()

document.addEventListener('contextmenu', event => event.preventDefault());

const grid = document.querySelector(".grid");
const CELLSHTML = grid.children;

const ROWS = 20;
const COLS = 20;
const MINES = 50;
const CELLS = new Array(ROWS * COLS).fill(0).map((cell, cellIndex) => ({
    i: cellIndex,
    value: '',
    neighbors: [],
    isMine: false,
    isFlag: false,
})); 
const COLORS = {
    '': '',
    1: 'green',
    2: 'blue',
    3: '#d38800',
    4: 'purple',
    5: 'brown',
    6: 'pink',
    7: 'yellow',
    8: 'red'
};


let isVisited = [];
let isFirstClick = true;

const onClick = (e, index) => {
    e.preventDefault();
    const cell = CELLS[index];
    const cellHtml = CELLSHTML[index];

    switch(e.button) {
        case 0:
            if (cellHtml.classList.contains('flag')) return;
            
            // left click
            if (cell.isMine) {
                gameOver(cellHtml);
                return;
            } else if (cell.value === '') {
                isVisited = [];
                openAround(index);
            }
            break;
        
        case 1:
            // middle click
            let flagsAround = 0;

            cell.neighbors.forEach(n => n.isFlag ? flagsAround++ : null);

            if (flagsAround !== cell.value) return;

            if(cellHtml.classList.contains('visible') && cell.value !== '') {
                cell.neighbors.forEach(({ isFlag, isMine, value, i }) => {
                    neighborHtml = CELLSHTML[i];
                    
                    if (isFlag && !isMine) {
                        gameOver(neighborHtml);
                        return;
                    } else {
                        if (value === '') {
                            openAround(i);
                        }
                        neighborHtml.classList.add('visible');
                    }
                })
            }
            break;
            
        case 2:
            //right click
            if (cellHtml.classList.contains('visible') && !cell.isFlag) return;
            
            if (cell.isFlag) {
                cell.isFlag = false;
                cellHtml.classList.remove('flag');
                cellHtml.classList.remove('visible');
                cellHtml.textContent = cell.value;
                
                return;
            } else {
                cell.isFlag = true;
                
                cellHtml.classList.add('flag');
                cellHtml.textContent = '';
            }
            break;
    }

    cellHtml.classList.add('visible');
    checkWin();
}

const checkWin = () => {
    const visibleCells = [...CELLSHTML].filter(cell => cell.classList.contains('visible')).length;

    if (visibleCells === ROWS * COLS) {
        // WIN
        grid.style.boxShadow = '1px 1px 1px 3px green';
        [...CELLSHTML].forEach(cell => cell.style.pointerEvents = 'none');
    }
}

const gameOver = cellHtml => {
    [...CELLSHTML].forEach(cell => {
        cell.classList.add('visible');
        cell.style.pointerEvents = 'none';
    });
    cellHtml.style.backgroundColor = 'tomato';
    grid.style.boxShadow = '1px 1px 1px 3px tomato';
}

const openAround = (i) => {
    const { neighbors } = CELLS[i];

    if (isVisited.includes(i)) return;

    isVisited.push(i);

    CELLSHTML[i].classList.add('visible');
    
    if (!neighbors.some(cell => cell.isMine)) {
        neighbors.forEach(({ i }) => {
            openAround(i);
        });
    }
}

const determineNeighbors = () => {
    for(let i = 0; i < CELLS.length; i++) {
        const cell = CELLS[i];
        const row = Math.floor(i / ROWS);
        const col = i % ROWS;

        // left
        if (col > 0) cell.neighbors.push(CELLS[i - 1]);
        // right
        if (col < COLS - 1) cell.neighbors.push(CELLS[i + 1]);
        // top
        if (row > 0 ) cell.neighbors.push(CELLS[i - COLS]);
        // top left
        if (row > 0 && col > 0 ) cell.neighbors.push(CELLS[i - COLS - 1]);
        // top right
        if (row > 0 && col < COLS - 1) cell.neighbors.push(CELLS[i - COLS + 1]);
        // bottom
        if (row < ROWS - 1) cell.neighbors.push(CELLS[i + COLS]);
        // bottom left
        if (row < ROWS - 1 && col > 0) cell.neighbors.push(CELLS[i + COLS - 1]);
        // bottom right
        if (row < ROWS - 1 && col < COLS - 1) cell.neighbors.push(CELLS[i + COLS + 1]);
    }
}

// draw the board and determine neighbors for each cell
const setupBoard = () => {
    for (let i = 0; i < CELLS.length; i++) {
        const cell = document.createElement('div');

        cell.classList.add('cell');
        cell.addEventListener('mousedown', e => {
            if (isFirstClick) {
                locateMines(i);
                numerateCells();

                isFirstClick = false;
            }
            onClick(e, i);
        });
        
        grid.appendChild(cell);
    }

    determineNeighbors();

    grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
}

const locateMines = firstIndex => {
    const prob = MINES / CELLS.length;
    let curMines = 0;

    for (let i = 0; i < CELLS.length; i++) {
        if (curMines === MINES) break;

        const cell = CELLS[i];
        const isMine = firstIndex === i 
            ? false
            : Math.random() <= prob;
        
        if (isMine) {
            cell.isMine = true;
            CELLSHTML[i].classList.add('mine');
            curMines++;
        }
    }
}

const numerateCells = () => {
    for (let i = 0; i < CELLS.length; i++) {
        const cell = CELLS[i];
        const cellHtml = CELLSHTML[i];
        
        if (!cell.isMine) {
            let minesAround = 0;

            // minelari hespala
            cell.neighbors.forEach(neighbor => neighbor.isMine ? minesAround++ : null)

            const value = minesAround > 0
                ? minesAround
                : '';

            CELLS[i].value = value;
            cellHtml.textContent = value; 
            cellHtml.style.color = COLORS[value]; 
        }
    }
}

setupBoard();

