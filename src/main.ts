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
