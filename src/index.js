/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import './style.css';
import Ship from './ship';
import Player from './player';
import {
    createGameboard,
    displayControlPanel,
    updateGameboard,
    getCoordinatesFromId,
} from './DOM_handler';

async function game() {
    window.user = new Player('You');
    window.cpu = new Player('AI');
    window.gameOver = false;
    window.turnTaken = null;
    window.isUsersTurn = true;
    window.winner = 'no one yet';

    createGameboard(10, 10, 'left', 'left-board');
    createGameboard(10, 10, 'right', 'right-board');

    // Place ships on the boards
    randomlyPlaceShips(window.user, userShipSet);
    randomlyPlaceShips(window.cpu, cpuShipSet);

    updateGameboard(window.user);
    updateGameboard(window.cpu, false); // Hide cpu's ships

    // Allowing user to attack
    const blocks = document.querySelectorAll('#right-board .block');
    blocks.forEach((block) => {
        block.addEventListener('click', () => {
            if (window.isUsersTurn) {
                registerStrike(block.id, window.cpu, true);
                updateGameboard(window.cpu);
                if (typeof window.turnTaken === 'function') {
                    window.turnTaken(); // indicates the turn being taken
                }
            }
        });
    });

    await gameLoop();
}

async function gameLoop() {
    while (!window.gameOver) {
        if (window.isUsersTurn) {
            // wait until user takes his turn
            await waitForTurn();
            if (window.cpu.gameboard.allShipsSunk()) {
                window.gameOver = true;
                window.winner = 'user';
                window.isUsersTurn = false; // To prevent user from further attacks after the game has ended
                return;
            }
            window.isUsersTurn = false;
        } else {
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((res) => setTimeout(res, 1000)); // delay cpu's attack
            cpuAttack();
            if (window.user.gameboard.allShipsSunk()) {
                window.gamOver = true;
                window.winner = 'cpu';
                return;
            }
            window.isUsersTurn = true;
        }
    }
}

function waitForTurn() {
    // Halt the game until user has taken his turn
    return new Promise((resolve) => {
        window.turnTaken = resolve;
    });
}

function cpuAttack() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    let attackNotRegistered = true;
    while (attackNotRegistered) {
        try {
            window.user.gameboard.receiveAttack(x, y);
            updateGameboard(window.user);
            attackNotRegistered = false;
        } catch {
            // no actions necessary
        }
    }
}

function createShipSet() {
    // same ships will be used every game
    const ship1 = new Ship(4);
    const ship2 = new Ship(3);
    const ship3 = new Ship(3);
    const ship4 = new Ship(2);
    const ship5 = new Ship(1);
    const ship6 = new Ship(1);
    return [ship1, ship2, ship3, ship4, ship5, ship6];
}

function randomlyPlaceShips(player, shipSet) {
    const placements = ['horizontal', 'vertical'];
    let i = 0;
    while (i <= 5) {
        // Generate random coordinates
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);

        const orientation = placements[Math.floor(Math.random() * 2)];

        try {
            player.gameboard.placeShip(shipSet[i], x, y, orientation);
            i += 1;
        } catch (err) {
            // no actions necessary
        }
    }
}

function registerStrike(id, opponent, isUsersTurn = false) {
    if (isUsersTurn) {
        const coordinates = getCoordinatesFromId(id);
        const x = coordinates[0];
        const y = coordinates[1];
        opponent.gameboard.receiveAttack(x, y);
    }
}

const userShipSet = createShipSet();
const cpuShipSet = createShipSet();
game();
