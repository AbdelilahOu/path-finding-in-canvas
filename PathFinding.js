let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let cw = canvas.width;
let ch = canvas.height;
let size = 10;
let cols = cw / size;
let rows = ch / size;
let AllPixels = new Array(cols);
// Finished evaluation
let Closed = [];
let Opened = [];
let Path = [];
//didnt evaluated
let start = null;
let end = null;
//each cube
function Pixel(x, y) {
  this.x = x * size;
  this.y = y * size;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.IsWall = false;
  this.neighbours = [];
  this.parent = undefined;
  this.draw = function () {
    // context.clearRect(this.x , this.y , size , size)
    context.strokeStyle = "black";
    //Start drwing
    context.beginPath();
    //top wall
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + size, this.y);
    //right wall
    context.moveTo(this.x + size, this.y);
    context.lineTo(this.x + size, this.y + size);
    //buttom wall
    context.moveTo(this.x + size, this.y + size);
    context.lineTo(this.x, this.y + size);
    //left wall
    context.moveTo(this.x, this.y + size);
    context.lineTo(this.x, this.y);
    //show the walls
    context.stroke();
    if (this.IsWall) {
      context.fillStyle = "black";
      context.fillRect(this.x, this.y, size, size);
    }
  };
  this.checkNeighbours = function () {
    //top
    if (this.y / size - 1 >= 0) {
      if (!AllPixels[this.y / size - 1][this.x / size].IsWall) {
        this.neighbours.push(AllPixels[this.y / size - 1][this.x / size]);
      }
    }
    //right
    if (this.x / size + 1 < rows) {
      if (!AllPixels[this.y / size][this.x / size + 1].IsWall) {
        this.neighbours.push(AllPixels[this.y / size][this.x / size + 1]);
      }
    }
    //left
    if (this.x / size - 1 >= 0) {
      if (!AllPixels[this.y / size][this.x / size - 1].IsWall) {
        this.neighbours.push(AllPixels[this.y / size][this.x / size - 1]);
      }
    }
    //bottom
    if (this.y / size + 1 < cols) {
      if (!AllPixels[this.y / size + 1][this.x / size].IsWall) {
        this.neighbours.push(AllPixels[this.y / size + 1][this.x / size]);
      }
    }
    //top left
    if (this.y / size - 1 >= 0 && this.x / size - 1 >= 0) {
      if (!AllPixels[this.y / size - 1][this.x / size - 1].IsWall) {
        if (
          !AllPixels[this.y / size - 1][this.x / size].IsWall &&
          !AllPixels[this.y / size][this.x / size - 1].IsWall
        ) {
          this.neighbours.push(AllPixels[this.y / size - 1][this.x / size - 1]);
        }
      }
    }
    //right top
    if (this.x / size + 1 < rows && this.y / size - 1 >= 0) {
      if (!AllPixels[this.y / size - 1][this.x / size + 1].IsWall) {
        if (
          !AllPixels[this.y / size - 1][this.x / size].IsWall &&
          !AllPixels[this.y / size][this.x / size + 1].IsWall
        ) {
          this.neighbours.push(AllPixels[this.y / size - 1][this.x / size + 1]);
        }
      }
    }
    //bottom right
    if (this.y / size + 1 < cols && this.x / size + 1 < rows) {
      if (!AllPixels[this.y / size + 1][this.x / size + 1].IsWall) {
        if (
          !AllPixels[this.y / size][this.x / size + 1].IsWall &&
          !AllPixels[this.y / size][this.x / size + 1].IsWall
        ) {
          this.neighbours.push(AllPixels[this.y / size + 1][this.x / size + 1]);
        }
      }
    }
    //left buttom
    if (this.y / size + 1 < rows && this.x / size - 1 >= 0) {
      if (!AllPixels[this.y / size + 1][this.x / size - 1].IsWall) {
        if (
          !AllPixels[this.y / size + 1][this.x / size].IsWall &&
          !AllPixels[this.y / size][this.x / size - 1].IsWall
        ) {
          this.neighbours.push(AllPixels[this.y / size + 1][this.x / size - 1]);
        }
      }
    }
  };
}
//////////////////////////MAKE ALL THE CUBES
const MakePixels = () => {
  for (let i = 0; i < cols; i++) {
    AllPixels[i] = new Array(rows);
  }
  for (let j = 0; j < cols; j++) {
    for (let k = 0; k < rows; k++) {
      AllPixels[j][k] = new Pixel(k, j);
    }
  }
  for (let i = 0; i < ch / 2; i++) {
    AllPixels[Math.floor(Math.random() * (ch / size))][
      Math.floor(Math.random() * (cw / size))
    ].IsWall = true;
  }
  for (let j = 0; j < cols; j++) {
    for (let k = 0; k < rows; k++) {
      AllPixels[j][k].checkNeighbours();
    }
  }
};
MakePixels();
///////////////////////////
const MakeTheGrid = () => {
  for (let j = 0; j < AllPixels.length; j++) {
    for (let k = 0; k < AllPixels[j].length; k++) {
      AllPixels[j][k].draw();
    }
  }
};
//////////////////////////
// CALCULATE THE LONGEST LINE IN ATRIANGLE
const heuristic = (curr, end) => {
  let a = end.x - curr.x;
  let b = end.y - curr.y;
  let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  return c;
};
//////////////////////////
const RemovePxel = (arr, ele) => {
  for (let i = arr.length; i >= 0; i--) {
    if (arr[i] == ele) arr.splice(i, 1);
  }
};
/////////////////////////
const TheA_Star = () => {
  if (Opened.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < Opened.length; i++) {
      if (Opened[i].f < Opened[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    let current = Opened[lowestIndex];
    if (Opened[lowestIndex] === end) {
      Path = [];
      let temp = current;
      Path.push(temp);
      while (temp.parent) {
        Path.push(temp);
        temp = temp.parent;
      }
      return;
    }
    RemovePxel(Opened, current);
    Closed.push(current);
    let neighbours = current.neighbours;
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];
      if (neighbour) {
        if (!Closed.includes(neighbour)) {
          let newG = current.g + 1;
          if (Opened.includes(neighbour)) {
            if (newG < neighbour.g) {
              neighbour.g = newG;
            }
          } else {
            neighbour.g = newG;
            Opened.push(neighbour);
          }

          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.parent = current;
        }
      }
    }
  }
};
/////////////////////////
const Update = () => {
  for (let i = 0; i < Closed.length; i++) {
    context.fillStyle = "pink";
    context.fillRect(Closed[i].x, Closed[i].y, size, size);
    Closed[i].draw();
  }
  for (let i = 0; i < Opened.length; i++) {
    context.fillStyle = "lightgreen";
    context.fillRect(Opened[i].x, Opened[i].y, size, size);
    Opened[i].draw();
  }

  for (let i = 0; i < Path.length; i++) {
    context.beginPath();
    context.strokeStyle = "purple";
    context.moveTo(Path[i].x + size / 2, Path[i].y + size / 2);
    context.lineTo(Path[i].parent.x + size / 2, Path[i].parent.y + size / 2);
    context.moveTo(Path[i].x + size / 2, Path[i].y + size / 2);
    context.lineTo(Path[i].parent.x + size / 2, Path[i].parent.y + size / 2);
    context.moveTo(Path[i].x + size / 2, Path[i].y + size / 2);
    context.lineTo(Path[i].parent.x + size / 2, Path[i].parent.y + size / 2);
    context.stroke();
  }
  TheA_Star();
  requestAnimationFrame(Update);
};
MakeTheGrid();
// Choose the points
function getCursorPosition(canvas, event) {
  const rec = canvas.getBoundingClientRect();
  //turn it into a integer
  x = Math.floor(event.clientX - rec.left);
  y = Math.floor(event.clientY - rec.top);
  //get the position of the cube its is in
  x = Math.floor(x / size);
  y = Math.floor(y / size);

  return { x, y };
}
canvas.addEventListener("mousedown", (e) => {
  const { x, y } = getCursorPosition(canvas, e);
  if (!start && !end) {
    start = AllPixels[y][x];
    context.fillStyle = "pink";
    context.fillRect(start.x, start.y, size, size);
    Opened.push(start);
  } else if (!end) {
    end = AllPixels[y][x];
    context.fillStyle = "blue";
    context.fillRect(end.x, end.y, size, size);
    Update();
  }
});
