/**
 * @author Thomas Barber
 * 
 * Represents a projectile body. Extends a Body by handling projectile-specific movement and graphics
 * 
 * @typedef Projectile
 */
class Projectile extends Body {

	constructor(x,y,size,strength, numCollisions){
		super();
		this.position.x = x;
		this.position.y = y;
		this.radius = size;
		this.size.height = size*2;
		this.size.width  = size*2;
        this.strength = strength;
        this.health = numCollisions;

	}

	/**
	 * Draws the projectile as a circle centered on the projectile's location.
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = '#000000';
		graphics.beginPath();
		graphics.arc(this.position.x, this.position.y,this.radius/2,0,2*Math.PI);
		graphics.stroke();

	}

	/**
	 * Updates the projectile
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time) {
		if(this.position.y < 0){
			this.remove();
			return;
		}
		this.velocity.x = 0;
		this.velocity.y = -1 * config.projectile.speed;

		// update position
		super.update(delta_time);

	}

}