/* eslint-disable no-use-before-define */
import './style.css';
import Ship from './ship';
import Player from './player';
import { createGameboard, displayControlPanel } from './DOM_handler';

function game() {
    const user = new Player('You');
    const cpu = new Player('AI');

    // Place ships on the boards
    randomlyPlaceShips(user, userShipSet);
    randomlyPlaceShips(cpu, cpuShipSet);
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

const userShipSet = createShipSet();
const cpuShipSet = createShipSet();

createGameboard(10, 10, 'left', 'left-board');
createGameboard(10, 10, 'right', 'right-board');
