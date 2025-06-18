import attack from './assets/attack.mp3';
import hit from './assets/hit.mp3';

const attackSound = new Audio(attack);
const hitSound = new Audio(hit);

class Gameboard {
    constructor(x, y) {
        this.rows = x;
        this.columns = y;
        this.gameboard = this.generateBoard(this.rows, this.columns);
        this.shipsCount = 0;
    }

    // eslint-disable-next-line class-methods-use-this
    generateBoard(r, c) {
        const gameboard = Array.from({ length: r }, () =>
            Array.from({ length: c }, () => null)
        );
        return gameboard;
    }

    getBoard() {
        return this.gameboard;
    }

    placeShip(ship, x, y, orientation) {
        const length = ship.getLength();
        if (orientation === 'horizontal') {
            if (
                !(
                    this.gameboard[x][y] === undefined ||
                    this.gameboard[x][y + length - 1] === undefined
                )
            ) {
                for (let i = 0; i < length; i += 1) {
                    if (
                        typeof this.gameboard[x][y + i] === 'object' &&
                        this.gameboard[x][y + i] !== null
                    ) {
                        throw new Error('Ships cannot overlap');
                    }
                }
                for (let i = 0; i < length; i += 1) {
                    this.gameboard[x][y + i] = ship;
                }
                this.shipsCount += 1;
            } else {
                throw new Error('Ship placement out of bounds');
            }
        } else if (orientation === 'vertical') {
            if (
                !(
                    this.gameboard[x][y] === undefined ||
                    this.gameboard[x + length - 1] === undefined
                )
            ) {
                for (let i = 0; i < length; i += 1) {
                    if (
                        typeof this.gameboard[x + i][y] === 'object' &&
                        this.gameboard[x + i][y] !== null
                    ) {
                        throw new Error('Ships cannot overlap');
                    }
                }
                for (let i = 0; i < length; i += 1) {
                    this.gameboard[x + i][y] = ship;
                }
                this.shipsCount += 1;
            } else {
                throw new Error('Ship placement out of bounds');
            }
        }
    }

    receiveAttack(x, y) {
        if (
            this.gameboard[x] === undefined ||
            this.gameboard[x][y] === undefined
        ) {
            throw new Error('Attack out of bounds');
        } else if (this.gameboard[x][y] === null) {
            this.gameboard[x][y] = 'miss';
            attackSound.pause();
            attackSound.currentTime = 0;
            attackSound.play();
        } else if (typeof this.gameboard[x][y] === 'object') {
            this.gameboard[x][y].hit();
            if (this.gameboard[x][y].isSunk()) {
                this.shipsCount -= 1;
            }
            this.gameboard[x][y] = 'hit';
            hitSound.pause();
            hitSound.currentTime = 0;
            hitSound.play();
        } else {
            throw new Error('Can not hit same spot twice');
        }
    }

    allShipsSunk() {
        if (this.shipsCount === 0) {
            return true;
        }
        return false;
    }

    prettyPrint() {
        this.gameboard.forEach((row) => {
            const rowStr = row
                .map((cell) => {
                    if (typeof cell === 'object' && cell !== null)
                        return '[]'.padEnd(6);
                    return String(cell).padEnd(6);
                })
                .join('');
            // eslint-disable-next-line no-console
            console.log(rowStr);
        });
    }
}

export default Gameboard;
