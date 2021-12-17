/**
 * @author Thomas Barber
 * 
 * Represents an player body. Extends a Body by handling input binding and controller management.
 * 
 * @typedef Player
 */
class Player extends Body {
	// this controller object is updated by the bound input_handler
	controller = {
		move_x: 0,
		move_y: 0,
		action_1: false
	};
	speed = 75;
	input_handler = null;
	shotsPerSecond = 0;
	projectileStrength = 1;
	numShotCollisions = 1;

	/**
	 * Creates a new player with the default attributes.
	 */
	constructor(shotsPerSecond) {
		super();

		// bind the input handler to this object
		this.input_handler = new InputHandler(this);

		// we always want our new players to be at this location
		this.position = {
			x: config.canvas_size.play_width / 2,
			y: config.canvas_size.height - 100
		};
		// initialize some variables that control how often the player can shoot
		this.framesPerShot = config.update_rate.fps / shotsPerSecond;
		this.shotsPerSecond = shotsPerSecond;
		this.counter = 0;
	}

	/**
	 * Draws the player as a triangle centered on the player's location.
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = '#000000';
		graphics.beginPath();
		graphics.moveTo(
			this.position.x,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x + this.half_size.width,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x - this.half_size.width,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x,
			this.position.y - this.half_size.height
		);
		
		graphics.stroke();
		

		// draw velocity lines
		super.draw(graphics);
	}

	/**
	 * Updates the player given the state of the player's controller.
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time) {
		// If the user's shot cooldown is finished, handle shooting logic
		if(this.counter <= 0){
			if(this.controller.action_1){
				this.counter = this.framesPerShot;
				let temp = new Projectile(this.position.x,this.position.y,config.projectile.size,this.projectileStrength,this.numShotCollisions);
			}
		} else {
			this.counter -= 1;
		}
		
		// Check for user movement - update the velocity based on the key presses delivered by the InputHandler
		if(this.controller.move_x == 0){
			if(this.controller.move_y == 0){
				this.velocity.y = 0;
				this.velocity.x = 0;
			} else {
				this.velocity.x = 0;
				this.velocity.y = this.speed * this.controller.move_y;
			}
		} else {
			if(this.controller.move_y == 0){
				this.velocity.y = 0;
				this.velocity.x = this.speed * this.controller.move_x;
			} else {
				this.velocity.x = this.speed / Math.sqrt(2) * this.controller.move_x;
				this.velocity.y = this.speed / Math.sqrt(2) * this.controller.move_y;
			}
		}

		// update position
		super.update(delta_time);

		// clip to screen
		this.position.x = Math.min(Math.max(20, this.position.x), config.canvas_size.play_width-20);
		this.position.y = Math.min(Math.max(20, this.position.y), config.canvas_size.play_height-20);
	}

}
