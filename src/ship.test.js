const Ship = require('./ship');

let myShip = new Ship(3);

test('Ship should have a length of 3', () => {
    expect(myShip.getLength()).toBe(3);
});

test('Ship should not be sunk initially', () => {
    expect(myShip.isSunk()).toBe(false);
});

test('Ship should be sunk after 3 hits', () => {
    myShip.hit();
    myShip.hit();
    myShip.hit();
    expect(myShip.isSunk()).toBe(true);
});

test('Ship should not be sunk after 2 hits', () => {
    myShip = new Ship(3);
    myShip.hit();
    myShip.hit();
    expect(myShip.isSunk()).toBe(false);
});

test('Ship should have 2 hits after 2 hits', () => {
    myShip = new Ship(3);
    myShip.hit();
    myShip.hit();
    expect(myShip.getHits()).toBe(2);
});
