import { Tile } from "./tile.js"
import { Queue } from "./queue.js"

const canvas = document.getElementById("canvas")
console.log(canvas.width, canvas.height)
const ctx = canvas.getContext("2d")
canvas.width = canvas.height *
  (canvas.clientWidth / canvas.clientHeight);
function newTile(x, y, color) {
  let tile = new Tile(2, 2, color, ...grid(x, y))
  colormap.set(JSON.stringify([x, y]), color)
  tile.drawTile()
}

function grid(ogX, ogY) {
  let x = ogX * 2;
  let y = ogY * 2;
  return [x, y]
}
let visited = new Set();
let colormap = new Map();
let tileplacerX = 37
let tileplacerY = 37
newTile(tileplacerX, tileplacerY)
let gen = setInterval(genTile, 0.0001)
let genCount = 0
let colorCount = 0
let color = "green"


function genTile() {
  genCount++
  let nextDirection = 1 + Math.floor(Math.random() * 4)
  let createocean = Math.floor(Math.random() * 1000);
  // console.log(nextDirection)
  if (nextDirection === 1 && tileplacerY < 74) {
    ++tileplacerY
    // console.log("north")
  }
  if (nextDirection === 2 && tileplacerY > 0) {
    --tileplacerY
    // console.log("south")
  }
  if (nextDirection === 3 && tileplacerX > 0) {
    --tileplacerX
    // console.log("west")
  }
  if (nextDirection === 4 && tileplacerX < 74) {
    ++tileplacerX
    // console.log("east")
  }
  if (!visited.has(JSON.stringify([tileplacerX, tileplacerY]))) {
    let colors = ["sandybrown", "green", "darkgreen"]
    colorCount++
    if (colorCount > 100) {
      color = colors[Math.floor(Math.random() * 3)]
      colorCount = 0
    }
    newTile(tileplacerX, tileplacerY, color)
    if (createocean < 2) {
      CreateOcean(tileplacerX, tileplacerY, 150)
    }
    let coordinates = JSON.stringify([tileplacerX, tileplacerY])
    visited.add(coordinates)
  }
  if (visited.size > 2500) {
    clearInterval(gen)
    console.log("Done generating image; filling map...")
    fillMap()
  }
}

function fillMap() {
  for (let y = 0; y < 75; y++) {
    let foundFirstVisited = false
    let firstX = 0
    let firstColor = "red"
    for (let x = 0; x < 75; x++) {
      let coordinate = JSON.stringify([x, y])
      // only ocean.. no land yet.
      if (!foundFirstVisited && !visited.has(coordinate)) {
        continue
      }
      // this is the first one
      // or the prev one is also land
      if (!foundFirstVisited ||
        (firstX === x - 1 && visited.has(coordinate))) {
        firstX = x
        firstColor = colormap.get(JSON.stringify([x, y]))
        foundFirstVisited = true
        continue
      }
      // we got a gap !
      // Either first was already found
      if (visited.has(coordinate)) {
        for (let start = firstX; start <= x; start++) {
          newTile(start, y, firstColor)
          let c = JSON.stringify([start, y])
          visited.add(c)
          // Make edges jagged
          if (Math.random() < 0.7) {
            let xy = returnCoordinates(start, y) 
            newTile(...xy, firstColor)
            let c = JSON.stringify(xy)
            visited.add(c)
          }
        }
        firstX = x
        firstColor = colormap.get(JSON.stringify([x, y]))
      }
    }

  }
}

function returnCoordinates(x, y) {
  let prob = Math.floor(Math.random() * 4)
  if (prob === 1) return [x -1, y ]
  if (prob === 2) return [ x + 1, y]
  if (prob === 3) return [ x, y + 1]
  if (prob === 0) return [ x, y - 1]
}

function CreateOcean(centerX, centerY, size) {
  let q = new Queue();
  q.enqueue([centerX, centerY])
  while (size > 0) {
    if (!q.empty()) {
      let xy = q.dequeue()
      newTile(...xy, "blue")
      visited.add(JSON.stringify(xy))
      size--
      for (let i = 0; i < 3; i++) {
        q.enqueue(returnCoordinates(...xy))
      }
    }
  }
}
