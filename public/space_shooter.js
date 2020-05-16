/* 
------------------------------
------- INPUT SECTION -------- 
------------------------------
*/


/**
 * Gets the (x,y) location of a user-click and stores that data inside of a global click-handler object
 * 
 * Method acquired from: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/18053642#18053642
 * (Specifically, patriques answer)
 * 
 * @param {CanvasRenderingContext2D} canvas The canvas the game lives inside
 * @param {Event} event An event that contains info about where the user clicked
 */
function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect()
	const xVal = event.clientX - rect.left
	const yVal = event.clientY - rect.top
	click_handler = {x:xVal,y:yVal};
	console.log(`Click: ${xVal},${yVal}`);
}

/**
 * This class binds key listeners to the window and updates the controller in attached player body.
 * 
 * @typedef InputHandler
 */
class InputHandler {
	key_code_mappings = {
		button: {
			32: {key: 'space', state: 'action_1'}
		},
		axis: {
			68: {key: 'right', state: 'move_x', mod: 1},
			65: {key: 'left', state: 'move_x', mod: -1},
			87: {key: 'up', state: 'move_y', mod: -1},
			83: {key: 'down', state: 'move_y', mod: 1}
		}
	};
	player = null;

	constructor(player) {
		this.player = player;

		// bind event listeners
		window.addEventListener("keydown", (event) => this.keydown(event), false);
		window.addEventListener("keyup", (event) => this.keyup(event), false);

		// Goes hand-in-hand with the getCursorPosition() function
		game_canvas.addEventListener('mousedown', function(e) {
			getCursorPosition(game_canvas, e)
		})
	}

	/**
	 * This is called every time a keydown event is thrown on the window.
	 * 
	 * @param {Object} event The keydown event
	 */
	keydown(event) {
		// ignore event handling if they are holding down the button
		if (event.repeat)
			return;
	
		// check if axis mapping exists
		if (this.key_code_mappings.axis.hasOwnProperty(event.keyCode)) {
			const mapping = this.key_code_mappings.axis[event.keyCode];
			this.player.controller[mapping.state] += mapping.mod;

			//Added to fix the "key getting stuck" issue I was having
			this.player.controller[mapping.state] = Math.min(Math.max(-1, this.player.controller[mapping.state]), 1);
			// console.log(`keydown: input_handler[axis:${mapping.state} state:${this.player.controller[mapping.state]}]`);
		}
	
		// check if button mapping exists
		if (this.key_code_mappings.button.hasOwnProperty(event.keyCode)) {
			const mapping = this.key_code_mappings.button[event.keyCode];
			this.player.controller[mapping.state] = true;
			// console.log(`input_handler[button:${mapping.state} state:${this.player.controller[mapping.state]}]`);
		}
	}

	/**
	 * This is called every time a keyup event is thrown on the window.
	 * 
	 * @param {Object} event The keyup event
	 */
	keyup(event) {
		if (event.repeat)
			return;

		// check if axis mapping exists
		if (this.key_code_mappings.axis.hasOwnProperty(event.keyCode)) {
			const mapping = this.key_code_mappings.axis[event.keyCode];
			this.player.controller[mapping.state] -= mapping.mod;

			//Added to fix the "key getting stuck" issue I was having
			this.player.controller[mapping.state] = Math.min(Math.max(-1, this.player.controller[mapping.state]), 1);
			// console.log(`keyup: input_handler[axis:${mapping.state} state:${this.player.controller[mapping.state]}]`);
		}
	
		// check if button mapping exists
		if (this.key_code_mappings.button.hasOwnProperty(event.keyCode)) {
			const mapping = this.key_code_mappings.button[event.keyCode];
			this.player.controller[mapping.state] = false;
			// console.log(`input_handler[button:${mapping.state} state:${this.player.controller[mapping.state]}]`);
		}
	}
}

/* 
-------------------------------------------
------- POWERUP FUNCTIONS SECTION  -------- 
-------------------------------------------
*/

/**
 * A callback function for increasing the player's shots per second
 */
function increaseShotsPerSecond(){
	player.shotsPerSecond += 1;
	player.framesPerShot = config.update_rate.fps / player.shotsPerSecond;
	// console.log("Increasing shots per second now to ", player.shotsPerSecond);
}

/**
 * A callback function for increasing the player's movement speed
 */
function increaseSpeed(){
	player.speed += 25;
	// console.log("Increasing speed to ", player.speed);
}

/**
 * A callback function for increasing the player's damage per shot
 */
function increaseDamage(){
	player.projectileStrength += 1;
	// console.log("Increasing damage to ", player.projectileStrength);
}

/**
 * A callback function for increasing the player's shot penetration (how many enemies a projectile can damage)
 */
function increasePenetration(){
	player.numShotCollisions += 1;
	// console.log("Increasing num shot collisions to ", player.numShotCollisions);
}

/* 
------------------------------
------ CONFIG SECTION -------- 
------------------------------
*/

const config = {
	graphics: {
		// set to false if you are not using a high resolution monitor
		is_hi_dpi: true
	},
	canvas_size: {
		play_width: 400, // The width of the actual "field" of play
		play_height: 500, // The height of the actual "field" of play
		width: 600,
		height: 600
	},
	update_rate: {
		fps: 60,
		seconds: null
	},
	projectile: {
		size: 8,
		speed: 200
	},
	player: {
		healthLoss: 10,
	}
};

config.update_rate.seconds = 1 / config.update_rate.fps;

// grab the html span
const game_state = document.getElementById('game_state');
const game_wrapper = document.getElementById('game_wrapper');

// grab the html canvas
const game_canvas = document.getElementById('game_canvas');
game_canvas.style.width = `${config.canvas_size.width}px`;
game_canvas.style.height = `${config.canvas_size.height}px`;

const graphics = game_canvas.getContext('2d');

// for monitors with a higher dpi
if (config.graphics.is_hi_dpi) {
	game_canvas.width = 2 * config.canvas_size.width;
	game_canvas.height = 2 * config.canvas_size.height;
	graphics.scale(2, 2);
} else {
	game_canvas.width = config.canvas_size.width;
	game_canvas.height = config.canvas_size.height;
	graphics.scale(1, 1);
}

/**
 * @type {Object} Contains information about how many enemies have been killed, have been spawned, how many seconds the player has been alive, and how many credits the player currently has
 */
var playerStats = {
	enemiesKilled: 0,
	secondsAlive: 0,
	enemiesSpawned: 0,
	credits: 0
};

/* 
------------------------------
------- MAIN SECTION  -------- 
------------------------------
*/

/** @type {Number} last frame time in seconds */
var last_time = null;

/** @type {Number} A counter representing the number of update calls */
var loop_count = 0;

/** @type {Number} A counter that is used to assign bodies a unique identifier */
var running_id = 0;

/** @type {Object<Number, Body>} This is a map of body ids to body instances */
var entities = null;

/** @type {Array<Number>} This is an array of body ids to remove at the end of the update */
var queued_entities_for_removal = null;

/** @type {Player} The active player */
var player = null;

/** @type {EnemySpawner} This handles creation/spawning of enemy entities */
var enemy_spawner = null;

/** @type {CollisionHandler} This handles determining if various bodies are colliding */
var collision_handler = null;

/** @type {Object} Contains an x and a y location if the user has clicked the mouse; otherwise null */
var click_handler = null;

/** @type {Array<Powerup>} Keeps track of all of the possible powerups/upgrades */
var listOfPowerups = [
						new Powerup(25,25,4,increaseShotsPerSecond,"Shots/Second",8),
						new Powerup(25,125,5,increaseSpeed,"Speed",8),
						new Powerup(25,225,5,increaseDamage,"Damage",8),
						new Powerup(25,325,3,increasePenetration,"Shot Penetration",8)
					 ];


/**
 * This function updates the state of the world given a delta time.
 * 
 * @param {Number} delta_time Time since last update in seconds.
 */
function update(delta_time) {

	// If the user has clicked the mouse, determine if they clicked on a powerup
	if(click_handler !== null){
		Object.values(listOfPowerups).forEach(powerup => {
			if(powerup.isClicked(click_handler.x,click_handler.y)){
				//If they did click, buy the powerup
				if(powerup.increaseCount()){
					powerup.callback();
					// console.log("Success: ", powerup.name);
				}
			}
		});
		click_handler = null;
	}

	playerStats.secondsAlive += delta_time;

	// move entities
	Object.values(entities).forEach(entity => {
		entity.update(delta_time);
	});

	// detect and handle collision events
	if (collision_handler != null) {
		collision_handler.update(delta_time);
	}

	// remove enemies
	queued_entities_for_removal.forEach(id => {
		delete entities[id];
	})
	queued_entities_for_removal = [];

	// spawn enemies
	if (enemy_spawner != null) {
		enemy_spawner.update(delta_time);
	}

	// allow the player to restart when dead
	if (player.isDead() && player.controller.action_1) {
		start();
	}
}

/**
 * This function draws the state of the world to the canvas.
 * 
 * @param {CanvasRenderingContext2D} graphics The current graphics context.
 */
function draw(graphics) {
	// default font config
	graphics.font = "10px Arial";
	graphics.textAlign = "left";

	// draw background (this clears the screen for the next frame)
	graphics.fillStyle = '#FFFFFF';
	graphics.fillRect(0, 0, config.canvas_size.play_width, config.canvas_size.play_height);
	graphics.fillStyle = 'black'
	graphics.fillRect(config.canvas_size.play_width,0,200,config.canvas_size.height);
	
	// for loop over every eneity and draw them
	Object.values(entities).forEach(entity => {
		entity.draw(graphics);
	});

	// clear the bottom info portion of the screen
	graphics.fillStyle = 'gray'
	graphics.fillRect(0, config.canvas_size.play_height, config.canvas_size.play_width, 100);

	// basic player stats display
	graphics.font = "16px Arial";
	graphics.fillStyle = 'black';
	graphics.fillText('Enemies Killed: ' + playerStats.enemiesShot,config.canvas_size.play_width - 200, config.canvas_size.height - 75);
	graphics.fillText('Enemies Spawned: ' + playerStats.enemiesSpawned,config.canvas_size.play_width - 200, config.canvas_size.height - 60);
	graphics.fillText('Seconds Alive: ' + Math.floor(playerStats.secondsAlive),config.canvas_size.play_width - 200, config.canvas_size.height - 45);
	graphics.fillText('Score: ' + (Math.floor(30*playerStats.enemiesShot + playerStats.secondsAlive)),config.canvas_size.play_width - 200, config.canvas_size.height - 30);
	graphics.fillText('Credits: ' + playerStats.credits,config.canvas_size.play_width - 200, config.canvas_size.height - 15);
	
	// Display each of the powerup buttons/information
	Object.values(listOfPowerups).forEach(powerup => {
		powerup.draw(graphics);
	});

	// basic health bar display
	graphics.lineWidth = 2;
	graphics.fillRect(20,config.canvas_size.height-40, 100, 20);
	graphics.lineWidth = 0
	graphics.fillStyle = 'red';
	graphics.fillRect(22, config.canvas_size.height-38, Math.floor(96*(player.health / 100)), 16);
	graphics.font = '14px Arial';
	graphics.fillStyle = 'white';
	graphics.textAlign = "center";
	graphics.fillText(player.health + '%',75,config.canvas_size.height-25);
	
	// game over screen
	if (player.isDead()) {
		graphics.font = "30px Arial";
		graphics.fillStyle = 'black';
		graphics.textAlign = "center";
		graphics.fillText('Game Over', config.canvas_size.play_width / 2, config.canvas_size.play_height / 2);

		graphics.font = "12px Arial";
		graphics.textAlign = "center";
		graphics.fillText('press space to restart', config.canvas_size.play_width / 2, 18 + config.canvas_size.play_height / 2);
	}
}

/**
 * This is the main driver of the game. This is called by the window requestAnimationFrame event.
 * This function calls the update and draw methods at static intervals. That means regardless of
 * how much time passed since the last time this function was called by the window the delta time
 * passed to the draw and update functions will be stable.
 * 
 * @param {Number} curr_time Current time in milliseconds
 */
function loop(curr_time) {
	// convert time to seconds
	curr_time /= 1000;

	// edge case on first loop
	if (last_time == null) {
		last_time = curr_time;
	}

	var delta_time = curr_time - last_time;

	// this allows us to make stable steps in our update functions
	while (delta_time > config.update_rate.seconds) {
		if(!player.isDead()){
			update(config.update_rate.seconds);
		} else {
			if (player.controller.action_1) {
				start();
			}
		}
		draw(graphics);

		delta_time -= config.update_rate.seconds;
		last_time = curr_time;
	}

	window.requestAnimationFrame(loop);
}


function start() {
	let enemySpawnRate = 3;
	let shotsPerSecond = 1;
	entities = [];
	queued_entities_for_removal = [];
	player = new Player(shotsPerSecond);

	// Reset the player stats and powerups (only important if a restart happens)
	playerStats.enemiesShot = 0;
	playerStats.enemiesSpawned = 0;
	playerStats.secondsAlive = 0;
	playerStats.credits = 0;
	Object.values(listOfPowerups).forEach(powerup => {
		powerup.reset();
	});
	
	enemy_spawner = new EnemySpawner(enemySpawnRate);
	collision_handler = new CollisionHandler();
	window.requestAnimationFrame(loop);
}

start();