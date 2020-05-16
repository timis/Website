/**
 * Represents a basic physics body in the world. It has all of the necessary information to be
 * rendered, checked for collision, updated, and removed.
 * 
 * @typedef Body
 */
class Body {
	position = {x: 0, y: 0};
	velocity = {x: 0, y: 0};
	size = {width: 10, height: 10};
	health = 100;

	/**
	 * Creates a new body with all of the default attributes
	 */
	constructor() {
		// generate and assign the next body id
		this.id = running_id++;
		// add to the entity map
		entities[this.id] = this;
	}

	/**
	 * @type {Object} An object with two properties, width and height. The passed width and height
	 * are equal to half ot the width and height of this body.
	 */
	get half_size() {
		return {
			width: this.size.width / 2,
			height: this.size.height / 2
		};
	}

	/**
	 * @returns {Boolean} true if health is less than or equal to zero, false otherwise.
	 */
	isDead() {
		return this.health <= 0;
	}

	/**
	 * Updates the position of this body using the set velocity.
	 * 
	 * @param {Number} delta_time Seconds since last update
	 */
	update(delta_time) {
		// move body
		this.position.x += delta_time * this.velocity.x;
		this.position.y += delta_time * this.velocity.y;
	}

	/**
	 * This function draws a green line in the direction of the body's velocity. The length of this
	 * line is equal to a tenth of the length of the real velocity
	 * 
	 * @param {CanvasRenderingContext2D} graphics The current graphics context.
	 */
	draw(graphics) {
		graphics.strokeStyle = '#00FF00';
		graphics.beginPath();
		graphics.moveTo(this.position.x, this.position.y);
		graphics.lineTo(this.position.x + this.velocity.x / 10, this.position.y + this.velocity.y / 10);
		graphics.stroke();
	}

	/**
	 * Marks this body to be removed at the end of the update loop
	 */
	remove() {
		queued_entities_for_removal.push(this.id);
	}

	/**
	 * Uses the Axis-Aligned Bounding Box to determine if two bodies are colliding
	 * 
	 * @param {Body} otherBody The other Body to check if we are colliding with
	 * @returns {Boolean} true if the bodies overlap, false if the bodies do NOT overlap
	 */
	collidesWith(otherBody){
		var rect1 = {x: this.position.x-this.half_size.width, y: this.position.y - this.half_size.height, width: this.size.width, height: this.size.height}
		var rect2 = {x: otherBody.position.x-otherBody.half_size.width, y: otherBody.position.y - otherBody.half_size.height, width: otherBody.size.width, height: otherBody.size.height}
		// console.log(rect1,rect2);
		if (rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.y + rect1.height > rect2.y) {
			return true;
			// collision detected!
		}
		return false;
	}

	/**
	 * Removes health from the Body
	 * 
	 * @param {Number} damage 
	 * @returns {Boolean} true if the hit kills this body, false otherwise
	 */
	takeHit(damage){
		this.health -= damage;
		if(this.isDead()){
			this.remove();
			return true;
		}
		return false;
	}
}