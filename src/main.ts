import "./style.css";

// Rotate options
let isFlipped = false;
const rotate = () => {
  const shipsHolder = document.getElementById("ships")!;
  const ships = [...shipsHolder.children] as HTMLElement[];

  if (!isFlipped) {
    ships.forEach((ship) => ship.classList.add("rotated"));
  } else {
    ships.forEach((ship) => ship.classList.remove("rotated"));
  }
  isFlipped = !isFlipped;
};

document.getElementById("rotate")!.addEventListener("click", rotate);

// Board
const createGrid = (element: HTMLElement) => {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = `cell-${i}`;
    element.append(cell);
  }
};
const playerBoard = document.getElementById("player")!;
createGrid(playerBoard);

const computerBoard = document.getElementById("computer")!;
createGrid(computerBoard);

// Ship Class
class Ship {
  name: string;
  size: number;
  constructor(_name: string, _size: number) {
    this.name = _name;
    this.size = _size;
  }
}

// Enemy Ships
const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const career = new Ship("career", 5);

const allShips = [destroyer, submarine, cruiser, battleship, career];

const addShipToGrid = (ship: Ship) => {
  const cells = Array.from(
    computerBoard.getElementsByClassName("cell")
  ) as HTMLElement[];

  while (true) {
    const horizontal = Math.random() < 0.5;
    const x = horizontal
      ? Math.floor(Math.random() * 10)
      : Math.floor(Math.random() * (10 - ship.size));
    const y = horizontal
      ? Math.floor(Math.random() * (10 - ship.size))
      : Math.floor(Math.random() * 10);

    const spots = new Array(ship.size)
      .fill(-1)
      .map((_, i) => {
        if (horizontal) {
          return x * 10 + y + i;
        } else {
          return x * 10 + y + i * 10;
        }
      })
      .map((i) => cells[i]);

    if (spots.every((spot) => !spot.classList.contains("taken"))) {
      spots.forEach((spot) => spot.classList.add("taken", ship.name));
      break;
    }
  }
};
allShips.forEach((ship) => addShipToGrid(ship));

// Drag Ships
const onDragStart = (e: MouseEvent) => {
  console.log(e.target);
};
const onDragOver = (e: DragEvent) => {
  console.log(e.target);

  e.preventDefault();
};
const onDrop = (e: DragEvent) => {
  console.log(e.target);
};

const myCells = Array.from(
  playerBoard.getElementsByClassName("cell")
) as HTMLElement[];
myCells.forEach((cell) => {
  cell.addEventListener("dragover", onDragOver);
  cell.addEventListener("drop", onDrop);
});

const ships = Array.from(
  document.querySelectorAll("#ships div")
) as HTMLElement[];
ships.forEach((ship) => ship.addEventListener("mousedown", onDragStart));
