addEventListener('keydown', cb)

function cb(e){
  console.log('reanimate')
  animate()
}

let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

canvas.width = 400
canvas.height = 200
let cw = canvas.width
let ch = canvas.height

class Ball {
  constructor(x,y,v,c,r,m){
    this.x = x
    this.y = y
    this.v = v
    this.c = c
    this.r = r
    this.hit = 0
    this.m = m
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.r, 0, Math.PI*2)
    c.strokeStyle = this.c
    c.stroke()
    c.closePath()
  }

  update() {
    this.x += this.v
    this.draw()
  }
}


// m1u1 + m2u2 = m1v1 + m2v2
// u1 + v1 = u2 + v2
let x0 = 0
let v0 = 5
let v1 = -5
// let r0 = 30
let b0
let b1
let c0 = "#00FF00"
let c1 = "#FF0000"
let r0 = 10
let r1 = 5
let m0 = r0**3
let m1 = r1**3
let nhit = 0

function init(){
  b0 = new Ball(0, ch/2, v0, c0, r0, m0)
  b1 = new Ball(cw, ch/2, v1, c1, r1, m1)
}

function p(m0, v0, m1, v1) {
  total_p = m0*v0 + m1*v1
  vf1 = (total_p + m0*(v0-v1)) / (m0 + m1)
  vf0 = v1 + vf1 - v0
  // console.log(total_p,m0*vf0+m1*vf1)
  v0 = vf1
  v1 = vf0
  // console.log(v0)
  // console.log(v1)
  // console.log(vf1)
  // console.log(vf0)   
  
}

function momentumChange(b0, b1){
// update velocities i.e. b.v
  console.log(b0.x,b1.x,b0.v,b1.v)
  let P = b0.m*b0.v + b1.m*b1.v
  let M = b0.m + b1.m
  let A = b0.m*(b0.v-b1.v)
  let B = b1.m*(b1.v-b0.v)
  b0.v = (P + B)/M
  b1.v = (P + A)/M
  // console.log(P,M,A,B)
  let d = b0.x - b1.x
  if(b0.v)
  b0.x += d
  b1.x -= d
  console.log(b0.x,b1.x,b0.v,b1.v)
}

function positionCorrection(b0, b1){
  if(b0.x < b1.x) {
    b0.x -= 30
    b1.x += 30
  } else {
    b0 += 10
    b1 -= 10
  }
}

let animationId
function animate(){
  animationId = requestAnimationFrame(animate)
  c.clearRect(0,0,cw,ch)
  // draw(x0,ch/2)
  // b0 = new Ball(x0, ch/2)
  // x0 += v0
  b0.update()
  b1.update()
  hitwall(b0)
  hitwall(b1)
  let dx = b0.x - b1.x
  let dy = b0.y - b1.y
  let d = Math.hypot(dx, dy)
  // when balls collide

  //plus d
  if (d < b0.r + b1.r && !b0.hit && !b1.hit && b0.x - b1.x < 0) { 
    nhit += 1
    b0.hit = 1
    b1.hit = 1
    // console.log('hit: ', nhit)
    momentumChange(b0,b1)
    positionCorrection(b0,b1)
    cancelAnimationFrame(animationId)
    // b0.x -= 2
    // b0.v = -b0.v
    // b1.x -= 2
    // b1.v = -b1.v
    // collide(b0,b1)
    // p(m0, v0, m1, v1)
  }
  // Ensure one collision only
  // if (d > b0.r + b1.r - b0.x - b1.x){
  //   b0.hit = 0
  //   b1.hit = 0
  //   console.log(b1.x)
  // }

  if (b0.x - b1.x <= 0){
    b0.hit = 0
    b1.hit = 0
    console.log(b1.x)
  }
  // console.log(x0,v0)
}

function hitwall(b){
  if(b.x > cw - r0){
    b.x -= 2
    b.v = -b.v
  }
  if(b.x < 0 + r0){
    b.x += 2
    b.v = -b.v         
  }
}



init()
animate()

