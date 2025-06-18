const leftPanel = document.querySelector('.left-container');
const rightPanel = document.querySelector('.right-container');

function createGameboard(x, y, container, id) {
    let parent;
    let identifier;
    if (container === 'left') {
        parent = leftPanel;
        identifier = 'l';
    } else if (container === 'right') {
        parent = rightPanel;
        identifier = 'r';
    }
    const board = document.createElement('div');
    board.classList.add('board');
    board.setAttribute('id', id);
    for (let i = 0; i < x; i += 1) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < y; j += 1) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.setAttribute('id', `${identifier},${i},${j}`);
            row.appendChild(block);
        }
        board.appendChild(row);
    }
    parent.appendChild(board);
}

function updateGameboard(player, hideShips = false) {
    const backendBoard = player.gameboard.getBoard();
    let identifier;
    if (player.name === 'user') {
        identifier = 'l';
    } else if (player.name === 'cpu') {
        identifier = 'r';
    }
    for (let i = 0; i < player.gameboard.rows; i += 1) {
        for (let j = 0; j < player.gameboard.columns; j += 1) {
            const block = document.getElementById(`${identifier},${i},${j}`);
            if (backendBoard[i][j] === 'hit') {
                block.classList.remove('ship');
                block.classList.add('hit');
            } else if (backendBoard[i][j] === 'miss') {
                block.classList.add('miss');
            } else if (
                typeof backendBoard[i][j] === 'object' &&
                backendBoard[i][j] !== null &&
                !hideShips
            ) {
                block.classList.add('ship');
            }
        }
    }
}

function getCoordinatesFromId(id) {
    const elements = id.split(',');
    const x = parseInt(elements[1], 10);
    const y = parseInt(elements[2], 10);
    return [x, y];
}

function displayControlPanel() {
    const controlPanelParent = document.querySelector('.left-ctrl-panel');

    const title = document.createElement('p');
    title.classList.add('ctrl-panel-title');
    title.textContent = 'Place your ships';
    controlPanelParent.appendChild(title);

    const randomize = document.createElement('button');
    randomize.classList.add('randomize');
    randomize.textContent = 'Randomize';
    controlPanelParent.appendChild(randomize);

    const startButton = document.createElement('button');
    startButton.classList.add('start-button');
    startButton.textContent = 'Start Game';
    controlPanelParent.appendChild(startButton);
}

function showPopup(message, duration = 3000) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.classList.remove('hidden');
    popup.style.opacity = '1';

    return new Promise((resolve) => {
        setTimeout(() => {
            popup.classList.add('hidden');
            resolve(); // allow awaiting
        }, duration);
    });
}

export {
    createGameboard,
    displayControlPanel,
    updateGameboard,
    getCoordinatesFromId,
    showPopup,
};
