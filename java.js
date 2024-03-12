
let viev = {
  displayMessage: function (msg) {
    let messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
};

viev.displayMessage("Потопи 3 корабля (каждый по 3 клетки) с наименьшим количеством выстрелов ;)")

let model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  generateShipLocation: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    let direction = Math.floor(Math.random() * 2);
    let row, col;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    let newShipLocation = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocation.push(row + "" + (col + i));
      } else {
        newShipLocation.push((row + i) + "" + col);
      }
    }
    return newShipLocation;
  },
  collision: function (locations) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = model.ships[i];
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  ships: [
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
  ],
  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        viev.displayHit(guess);
        viev.displayMessage("ПОПАЛ!");
        if (this.isSunk(ship)) {
          viev.displayMessage("Корабль потоплен");
          this.shipsSunk++;
        }
        return true;
      }
    }
    viev.displayMiss(guess);
    viev.displayMessage("Уфф... Мимо, братишка");
    return false;
  },
  isSunk: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
};

let controller = {
  guesses: 0,

  processGuess: function (guess) {
    let location = parseGuess(guess);
    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        viev.displayMessage("Победа! " + `Количество попыток: ${this.guesses}`);
        document.getElementById('guessInput').hidden = true 
      }
    }
  },
};

function parseGuess(guess) {
  const alphabet = ["a", "b", "c", "d", "e", "f", "g"];
  if (guess === null || guess.length !== 2) {
    viev.displayMessage(
      "Улучшай свою целкость, попади в поле..."
    ); 
  } else {
    let firstChar = guess.charAt(0);
    let row = alphabet.indexOf(firstChar);
    let column = guess.charAt(1);

    if (isNaN == row || isNaN == column) {
      viev.displayMessage("Попробуй вводить корректные значения, друг"); 
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      viev.displayMessage("Ты даже в поле не попадаешь, друг"); 
    } else {
      return row + column;
    }
  }
  return null;
}

function init() {
  let fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  let guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocation();
}

function handleFireButton() {
  let guessInput = document.getElementById("guessInput");
  let guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPress(e) {
  let fireButton = document.getElementById("fireButton");
  if (e.keyCode == 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;
