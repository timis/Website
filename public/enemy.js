/**
 * @author Thomas Barber
 * 
 * Represents an enemy body. Extends a Body by handling enemy-body specific movement and graphics
 * 
 * A white enemy is the slowest. An orange enemy is 1.5 times faster than a white. A red enemy is 2 times faster than a white
 * 
 * The height of an enemy corresponds with how much health it has left.
 * @typedef Enemy
 */
class Enemy extends Body {

	/**
	 * Initializes a new enemy to have given stats, a random x-position, and a y-position just above the playing field
	 * @param {Object} stats Contains the speed, health, size, and color of the enemy
	 */
	constructor(stats) {
		super();

		this.speed = stats.speed;
		this.maxhealth = stats.health;
		this.health = stats.health;
		// this.size = stats.size;
		this.size = {width: 20,height: 8 * this.health};
		this.color = stats.color;

		this.position.x = Math.floor(10*(Math.random() * Math.floor((config.canvas_size.play_width-12)/10))) + 6;
		this.position.y = -50;
	}

	/**
	 * Draws the enemy as a rectangle centered on the enemy's location.
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = 'black';
		graphics.fillStyle = this.color;
		graphics.beginPath();
		graphics.moveTo(
			this.position.x - this.half_size.width,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x - this.half_size.width,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x + this.half_size.width,
			this.position.y + this.half_size.height
		);
		graphics.lineTo(
			this.position.x + this.half_size.width,
			this.position.y - this.half_size.height
		);
		graphics.lineTo(
			this.position.x - this.half_size.width,
			this.position.y - this.half_size.height
		);
		graphics.fill();
		graphics.stroke();

	}

	/**
	 * Updates the enemy
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time) {
		if(this.position.y > config.canvas_size.play_height){
			this.remove();
			return;
		}

		this.size.height = 8 * this.health;

		this.velocity.x = 0;
		this.velocity.y = this.speed;

		// update position
		super.update(delta_time);
	}

}