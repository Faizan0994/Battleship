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
    showPopup,
    displayRulesButton,
    displayPlayAgainButton,
    hideControlPanel,
} from './DOM_handler';
import Gameboard from './gameboard';
import bg from './assets/bg.mp3';
import win from './assets/win.mp3';

const bgMusic = new Audio(bg);
bgMusic.volume = 0.8;

const winningMusic = new Audio(win);

async function game(userShipSet, cpuShipSet, userGameboard = null) {
    window.user = new Player('user');
    window.cpu = new Player('cpu');
    window.gameOver = false;
    window.turnTaken = null;
    window.isUsersTurn = true;
    window.winner = 'no one yet';
    window.successfulHit = false;

    createGameboard(10, 10, 'left', 'left-board');
    createGameboard(10, 10, 'right', 'right-board');

    hideControlPanel();

    // Place ships on the boards
    if (!userGameboard) {
        randomlyPlaceShips(window.user.gameboard, userShipSet);
    } else {
        window.user.gameboard = userGameboard;
    }
    randomlyPlaceShips(window.cpu.gameboard, cpuShipSet);

    updateGameboard(window.user.gameboard, 'user');
    updateGameboard(window.cpu.gameboard, 'cpu', false); // Hide cpu's ships

    // Allowing user to attack
    const blocks = document.querySelectorAll('#right-board .block');
    blocks.forEach((block) => {
        block.addEventListener('click', () => {
            if (window.isUsersTurn) {
                registerStrike(block.id, window.cpu, true);
                updateGameboard(window.cpu.gameboard, 'cpu');
                if (typeof window.turnTaken === 'function') {
                    window.turnTaken(); // indicates the turn being taken
                }
            }
        });
    });

    await gameLoop();
    handleGameEnding(window.winner);
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
            if (!window.successfulHit) {
                window.isUsersTurn = false;
            }
        } else {
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((res) => setTimeout(res, 1000)); // delay cpu's attack
            cpuAttack();
            if (window.user.gameboard.allShipsSunk()) {
                window.gamOver = true;
                window.winner = 'cpu';
                return;
            }
            if (!window.successfulHit) {
                window.isUsersTurn = true;
            }
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
    let attackNotRegistered = true;
    while (attackNotRegistered) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        try {
            window.user.gameboard.receiveAttack(x, y);
            updateGameboard(window.user.gameboard, 'user');
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

function randomlyPlaceShips(gameboard, shipSet) {
    const placements = ['horizontal', 'vertical'];
    let i = 0;
    while (i <= 5) {
        // Generate random coordinates
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);

        const orientation = placements[Math.floor(Math.random() * 2)];

        try {
            gameboard.placeShip(shipSet[i], x, y, orientation);
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

async function handleGameEnding(winner) {
    if (winner === 'user') {
        bgMusic.pause();
        winningMusic.currentTime = 0;
        winningMusic.play();
        await showPopup('YOU WIN!');
    } else {
        await showPopup('YOU LOSE!');
    }
    displayPlayAgainButton();
    // make play again button functional
    document
        .querySelector('.play-again-button')
        .addEventListener('click', () => {
            winningMusic.pause();
            startNewGame();
        });
}

function startNewGame() {
    const userShipSet = createShipSet();
    const cpuShipSet = createShipSet();
    let gameboard;

    createGameboard(10, 10, 'left', 'left-board');
    createGameboard(10, 10, 'right', 'right-board');
    displayControlPanel();
    displayRulesButton();

    document.querySelector('.randomize').addEventListener('click', () => {
        gameboard = new Gameboard(10, 10);
        randomlyPlaceShips(gameboard, userShipSet);
        updateGameboard(gameboard, 'user');
    });
    document.querySelector('.start-button').addEventListener('click', () => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusic.play();
        showPopup('The Battle Begins', 1500);
        game(userShipSet, cpuShipSet, gameboard);
    });
}

startNewGame();
