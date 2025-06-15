const leftPanel = document.querySelector('.left-container');
const rightPanel = document.querySelector('.right-container');

function createGameboard(x, y, container, id) {
    let parent;
    if (container === 'left') {
        parent = leftPanel;
    } else if (container === 'right') {
        parent = rightPanel;
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
            block.setAttribute('id', `${x},${y}`);
            row.appendChild(block);
        }
        board.appendChild(row);
    }
    parent.appendChild(board);
}

export default createGameboard;
