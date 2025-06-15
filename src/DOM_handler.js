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

export { createGameboard, displayControlPanel };
