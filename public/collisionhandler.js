/**
 * Holds the logic for determining what bodies are colliding
 * 
 * @typedef CollisionHandler
 */
class CollisionHandler {
	constructor(){

	}

	/**
	 * Uses a double for loop through the entity array. Will only check for Projectile-Enemy, Player-Enemy,
	 * and Enemy-Player collisions. 
	 * 
	 * Projectile-Enemy collisions will damage the enemy (and remove them if dead) and possibly remove the projectile (depending on the shot penetration powerup)
	 * Player-Enemy collisions will remove the Enemy
	 * Enemy-Player collisions will damage the Player
	 * 
	 * @param {Number} delta_time Time in seconds since last update call.
	 */
	update(delta_time){
		// console.log(entities);
		Object.values(entities).forEach((entity1) => {
			Object.values(entities).forEach((entity2) => {
				if(entity1 instanceof Player){
					// Player cannot collide with itself nor should it be able to collide with a Projectile
					if(entity2 instanceof Player || entity2 instanceof Projectile){
						return;
					}

					if(entity2 instanceof Enemy){
						// If they collide, remove the Enemy
						if(entity1.collidesWith(entity2)){
							entity2.remove();
						}
					}
				} else if (entity1 instanceof Enemy){
					// An Enemy colliding with another enemy should do nothing; collisions with Projectiles are handled elsewhere
					if(entity2 instanceof Enemy || entity2 instanceof Projectile){
						return;
					}
	
					if(entity2 instanceof Player){
						// If they collide, damage the Player
						if(entity1.collidesWith(entity2)){
							entity2.takeHit(config.player.healthLoss);
						}
					}
				} else if (entity1 instanceof Projectile){
					// Projectile shouldn't be able to collide with another Projectile nor with a Player
					if(entity2 instanceof Player || entity2 instanceof Projectile){
						return;
					}
					// In case of enemies overlapping, check for if this Projectile still has "stopping power/health"
                    if(entity1.isDead()){
                        return;
					}
					
					if(entity2 instanceof Enemy){
						// If they collide, make the Enemy lose an amount of health equal to the damage strength of the Projectile.
						// The Projectile should lose one health-point/"enemy penetration point"
						if(entity1.collidesWith(entity2)){
                            let killed = entity2.takeHit(entity1.strength);
							if(killed){
								playerStats.enemiesShot += 1;
								playerStats.credits += entity2.maxhealth;
                            }
                            entity1.takeHit(1);
						}
					}
				}
			} 
		)});
	}
}