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

const getShipCells = (
  size: number,
  x: number,
  y: number,
  isFlipped: boolean,
  player: string
) => {
  const board = player === "computer" ? computerBoard : playerBoard;

  const cells = Array.from(
    board.getElementsByClassName("cell")
  ) as HTMLElement[];

  const spots = new Array(size)
    .fill(-1)
    .map((_, i) => {
      if (isFlipped) {
        return x * 10 + y + i * 10;
      } else {
        return x * 10 + y + i;
      }
    })
    .map((i) => cells[i]);
  return spots;
};

const addShipToGrid = (ship: Ship) => {
  while (true) {
    const isFlipped = Math.random() < 0.5;
    const y = isFlipped
      ? Math.floor(Math.random() * 10)
      : Math.floor(Math.random() * (10 - ship.size));
    const x = isFlipped
      ? Math.floor(Math.random() * (10 - ship.size))
      : Math.floor(Math.random() * 10);

    const spots = getShipCells(ship.size, x, y, isFlipped, "computer");

    if (spots.every((spot) => !spot.classList.contains("taken"))) {
      spots.forEach((spot) => spot.classList.add("taken", ship.name));
      break;
    }
  }
};
allShips.forEach((ship) => addShipToGrid(ship));

// Drag Ships
const myCells = Array.from(
  playerBoard.getElementsByClassName("cell")
) as HTMLElement[];
const draggableShips = Array.from(
  document.querySelectorAll("#ships div")
) as HTMLElement[];

let draggingShip: string = "";

const checkValidDropTarget = (id: number) => {
  const size = allShips.find((ship) => ship.name === draggingShip)?.size || 0;
  const x = Math.floor(id / 10);
  const y = id - x * 10;

  if (!isFlipped) {
    if (size + y > 10) return false;
    else return true;
  } else {
    if (size + x > 10) return false;
    else return true;
  }
};

const highlightCells = (id: number) => {
  const size = allShips.find((ship) => ship.name === draggingShip)?.size || 0;
  const x = Math.floor(id / 10);
  const y = id - x * 10;
  const validCells = getShipCells(size, x, y, isFlipped, "player");
  validCells.forEach((cell) => {
    cell.classList.add("highlight");
  });
};

const onDragStart = (e: MouseEvent) => {
  draggingShip = (e.target as HTMLElement).classList[0];
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  const targetID = (e.target as HTMLElement).id;
  const id = Number(targetID.split("cell-")[1]);
  const isValidDrop = checkValidDropTarget(id);
  if (isValidDrop) {
    highlightCells(id);
  }
};
const onDragLeave = (e: DragEvent) => {
  e.preventDefault();
  myCells.forEach((cell) => {
    cell.classList.remove("highlight");
  });
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  myCells.forEach((cell) => {
    if (cell.classList.contains("highlight")) {
      cell.classList.remove("highlight");
      cell.classList.add("taken");
      cell.classList.add(draggingShip);
    }
  });
  draggableShips
    .find((ship) => ship.classList.contains(draggingShip))
    ?.remove();
};

myCells.forEach((cell) => {
  cell.addEventListener("dragover", onDragOver);
  cell.addEventListener("dragleave", onDragLeave);
  cell.addEventListener("drop", onDrop);
});

draggableShips.forEach((ship) => {
  ship.addEventListener("dragstart", onDragStart);
});
