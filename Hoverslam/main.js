title = "Hoverslam";

description = `Hold the mouse
button to activate
the jetpack
`;

characters = [
  `
  p  
ppppp
  p
 p p
p   p
`
];

// Game design variable container
const G = {
	WIDTH: 150,
	HEIGHT: 150,

  OBSTACLE_SPEED_MIN: 0.8,
	OBSTACLE_SPEED_MAX: 1.0,

  GRAVITY: 0.4,
  JETPACKSTR: 0.2,

  TIMER: 0,
  WIND: 0,
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
  seed: 1,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "dark"
};

//Typedefs

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * size: number
 * }} Obstacle
 */

/**
 * @type { Obstacle [] }
 */
let obstacles;

//Typedefs

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * size: number
 * }} Obstacle2
 */

/**
 * @type { Obstacle2 [] }
 */
let obstacles2;

/**
 * @typedef {{
 * pos: Vector
 * duration: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

function update() {
  if (!ticks) {
    obstacles = times(8, () => {
      //const posX = rnd(0, G.WIDTH);
      const posX = 0;
      const posY = rnd(20, G.HEIGHT);
      //const size = rnd(1, 4);
      return {
          pos: vec(posX, posY),
          speed: rnd(G.OBSTACLE_SPEED_MIN, G.OBSTACLE_SPEED_MAX),
          size: rnd(1, 4)
      };
    });

    obstacles2 = times(7, () => {
      //const posX = rnd(0, G.WIDTH);
      const posX = G.WIDTH;
      const posY = rnd(20, G.HEIGHT);
      //const size = rnd(1, 4);
      return {
          pos: vec(posX, posY),
          speed: rnd(G.OBSTACLE_SPEED_MIN - 0.2, G.OBSTACLE_SPEED_MAX - 0.2),
          size: rnd(1, 4)
      };
    });

    player = {
      pos: vec(G.WIDTH * 0.5, 10),
      duration: 100
    };
  }

  obstacles.forEach((o) => {
    o.pos.x += o.speed + G.WIND;
    if (o.pos.x > G.WIDTH) o.pos.x = 0;
    color("red");
    box(o.pos, o.size);
  });

  obstacles2.forEach((o2) => {
    o2.pos.x -= o2.speed - G.WIND;
    if (o2.pos.x < 0) o2.pos.x = G.WIDTH;
    color("green");
    box(o2.pos, o2.size);
  });

  //Used to control wind
  G.TIMER++;
  if(G.TIMER > 600){
    G.TIMER = 0;
  }
  else if(G.TIMER > 400){
    G.WIND = 0.3
    text("WIND: -->", 3, 20);
  }
  else if(G.TIMER > 200){
    G.WIND = -0.3
    text("WIND: <--", 3, 20);
  }
  else{
    G.WIND = 0
    text("WIND: NULL", 3, 20);
  }

  color("yellow");
  text("JETPACKFUEL:" + player.duration.toString(), 3, 10);
  //text("WIND:" + G.TIMER.toString(), 3, 20);

  player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT + 20);

  player.pos.x = player.pos.x += G.WIND;

  if((input.isPressed == true) && (player.duration > 0)){

    player.pos.y = player.pos.y -= G.JETPACKSTR;
    player.duration--;
  }
  else{
    player.pos.y = player.pos.y += G.GRAVITY;
    if(player.duration < 100){
      player.duration++;
    }
  }

  color ("blue");
  char("a", player.pos);

  if (player.pos.y > G.HEIGHT){
    player.pos.y = 0;
    addScore(10 * difficulty);
    play("powerUp");
  }

  const isCollidingWithObstacle = char("a", player.pos).isColliding.rect.red;
  const isCollidingWithObstacle2 = char("a", player.pos).isColliding.rect.green;

  if (isCollidingWithObstacle) {
    end();
    play("powerUp");
  }
  if (isCollidingWithObstacle2) {
    end();
    play("powerUp");
  }

}
