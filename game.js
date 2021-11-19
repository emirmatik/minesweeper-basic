// flow
// setup the board.
// setup mines randomly
// iterate through all cells and calculate the number of mines around ()

document.addEventListener('contextmenu', event => event.preventDefault());

const timeHtml = document.querySelector('.time');
const mineCounterHtml = document.querySelector('.mine-counter');
const header = document.querySelector(".header");
const grid = document.querySelector(".grid");
const CELLSHTML = grid.children;

const ROWS = 16;
const COLS = 30;
const MINES = 99;
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
    6: '#e12727',
    7: 'red',
    8: 'brown'
};

let timeInterval = null;
let time = 0;
let isVisited = [];
let mineCounter = null;
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
                for (let j = 0; j < cell.neighbors.length; j++) {
                    const { isFlag, isMine, value, i } = cell.neighbors[j];

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
                }
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
                mineCounterHtml.textContent = --mineCounter;
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
    clearInterval(timeInterval);

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
        // COLS: 30 ROWS: 16
        const row = Math.floor(i / COLS);
        const col = i % COLS;

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

const startTime = () => {
    timeInterval = setInterval(() => {
        time++;
        timeHtml.textContent = time;
    }, 1000);
}

// draw the board and determine neighbors for each cell
const setupBoard = () => {
    for (let i = 0; i < CELLS.length; i++) {
        const cell = document.createElement('div');

        cell.classList.add('cell');
        cell.addEventListener('mousedown', e => {
            if (isFirstClick) {
                // first click
                locateMines(i);
                numerateCells();
                startTime();

                isFirstClick = false;
            }
            onClick(e, i);
        });

        grid.appendChild(cell);
    }

    determineNeighbors();

    grid.style.gridTemplateColumns = `repeat(${COLS}, 24px)`;
    grid.style.gridTemplateRows = `repeat(${ROWS}, 24px)`;
    header.style.width = `${COLS * 24}px`;
}

const locateMines = firstIndex => {
    const prob = MINES / CELLS.length;

    for (let i = 0; i < CELLS.length; i++) {
        if (mineCounter === MINES) break;

        const cell = CELLS[i];
        const isMine = firstIndex === i 
            ? false
            : Math.random() <= prob;
        
        if (isMine) {
            cell.isMine = true;
            CELLSHTML[i].classList.add('mine');
            mineCounter++;
        }
    }

    mineCounterHtml.textContent = mineCounter;
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

