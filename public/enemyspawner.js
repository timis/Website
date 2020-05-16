let timeStep = 30.0;

// @type {Array<Object>} Each object has a speed, health, size, and color for an enemy
let enemyTypes = [
    {speed: 40, health: 1, color:'white'},
    {speed: 60, health: 1, color:"orange"},
    {speed: 80, health: 1, color:'red'}
];

/**
 * @author Thomas Barber
 * 
 * Represents the EnemySpawner. Every 30 seconds enemies are spawned at a faster rate. Every 30 seconds enemies can become stronger. Every 30 seconds enemies become faster
 * 
 * @typedef EnemySpawner
 */
class EnemySpawner {
	constructor(){
		this.enemiesPerSecond = 3;
		this.counter = 0;
		this.elapsedTime = 0;
    }

	/**
	 * If enough time (enough frames) have passed, will spawn a new enemy - the type will be random
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time){
		this.counter += 1;
		this.elapsedTime += delta_time;
		this.enemiesPerSecond = 3 + Math.floor(this.elapsedTime/timeStep);
		this.framesPerSpawn = config.update_rate.fps / this.enemiesPerSecond;

		if(this.counter >= this.framesPerSpawn){
			let modifier = Math.min(5,1 + Math.floor(this.elapsedTime/timeStep));
			this.counter = 0;
            playerStats.enemiesSpawned += 1;
            let rando = Math.floor((Math.random()*enemyTypes.length));//%enemyTypes.length;
            let yeet = Object.assign({},enemyTypes[rando]); //https://stackoverflow.com/questions/40133582/assign-value-not-reference-in-javascript
			yeet.speed *= modifier;
			yeet.health = Math.min(4,Math.ceil(1+Math.random()*Math.floor(this.elapsedTime/timeStep)));
			// yeet.size.height = 8 * yeet.health;
			let temp = new Enemy(yeet);
		}
	}
}