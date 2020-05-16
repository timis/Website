/**
 * @author Thomas Barber
 * 
 * Represents a Powerup. Contains logic for user input and for checking if the user can afford the powerup
 * 
 * @typedef {Powerup}
 */
class Powerup {

	/** @type {Number} Holds the width in pixels of this powerups box */
	width = 150;
	/** @type {Number} Holds the height in pixels of this powerups box */
	height = 75;

	/**
	 * 
	 * @param {Number} x The x-location inside of the "powerup area" of the canvas
	 * @param {Number} y The y-location inside of the "powerup area" of the canvas
	 * @param {Number} numVals The maximum number of levels this powerup has
	 * @param {Function} callback A callback function for when the user wants to buy this powerup
	 * @param {String} name A name to display so the user knows what this powerup does
	 * @param {Number} cost The starting cost of the powerup
	 */
	constructor(x,y,numVals,callback,name,cost){
		this.x = x;
		this.y = y;
		this.numVals = numVals;
		this.currentVal = 1;
		this.callback = callback;
		this.name=name;
		this.originalcost = cost;
		this.cost = cost;
	}

	/**
	 * Resets the cost and current level of this powerup
	 */
	reset(){
		this.cost = this.originalcost;
		this.currentVal = 1;
	}

	/**
	 * Given a user's click position, determines if they clicked on this powerup
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 * 
	 * @returns {Boolean} If the click was within this powerups bounding box
	 */
	isClicked(x,y){
		x = x - config.canvas_size.play_width;
		if(x > this.x && x < this.x + this.width && y > this.y && y < this.y+this.height){
			// console.log(`Powerup ${this.name} clicked`);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Checks if there is still a powerup available and if the user can afford the current cost. 
	 * If they can, will subtract from the user's credits and return true. Otherwise false
	 * 
	 * @returns {Boolean}
	 */
	increaseCount(){
		if(this.currentVal >= this.numVals){
			return false;
		}
		if(playerStats.credits >= this.cost){
			this.currentVal += 1;
			playerStats.credits -= this.cost;
			this.cost *= 2;
			return true;
		}
		return false;
	}

	/**
	 * Displays either a red or green box (based on if the user can afford the powerup), the name of the powerup,
	 * the current level, the max level, and the current cost.
	 * 
	 * @param {CanvasRenderingContext2D} graphics 
	 */
	draw(graphics){
		if(playerStats.credits >= this.cost && this.currentVal < this.numVals){
			graphics.fillStyle = 'green';
		} else {
			graphics.fillStyle = 'red';
		}
		graphics.fillRect(this.x+config.canvas_size.play_width,this.y,this.width,this.height);
		graphics.fillStyle = 'black';
		graphics.fillText(this.name,this.x+config.canvas_size.play_width+15,this.y+15);
		graphics.fillText("Level: " + this.currentVal+"\t\tMax: " + this.numVals,this.x+config.canvas_size.play_width+15,this.y+40);
		graphics.fillText("Level: " + this.currentVal,this.x+config.canvas_size.play_width+15,this.y+40);		
		graphics.fillText("Cost: " + this.cost,this.x+config.canvas_size.play_width+15,this.y+65);
	}
}