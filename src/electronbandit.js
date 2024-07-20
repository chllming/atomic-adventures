// ElectronBandit.js

import Phaser from 'phaser';

export default class ElectronBandit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'electronBandit');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.health = 20;
        this.moveSpeed = 50;
        this.shootCooldown = 2000;
        this.lastShootTime = 0;
        this.aggroRange = 300;
        this.fleeHealth = 5;
    }

    update(time, player) {
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distanceToPlayer <= this.aggroRange) {
            if (this.health > this.fleeHealth) {
                // Move towards the player
                const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
                this.setVelocity(direction.x * this.moveSpeed, direction.y * this.moveSpeed);

                // Shoot at the player if cooldown has passed
                if (time > this.lastShootTime + this.shootCooldown) {
                    this.shoot(player);
                    this.lastShootTime = time;
                }
            } else {
                // Flee from the player when health is low
                const direction = new Phaser.Math.Vector2(this.x - player.x, this.y - player.y).normalize();
                this.setVelocity(direction.x * this.moveSpeed * 1.5, direction.y * this.moveSpeed * 1.5);
            }
        } else {
            // Idle behavior: small random movements
            if (Math.random() < 0.02) {
                const randomDirection = new Phaser.Math.Vector2(Math.random() - 0.5, Math.random() - 0.5).normalize();
                this.setVelocity(randomDirection.x * this.moveSpeed * 0.5, randomDirection.y * this.moveSpeed * 0.5);
            }
        }
    }

    shoot(player) {
        const particle = this.scene.electronParticles.create(this.x, this.y, 'electronParticle');
        const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
        particle.setVelocity(direction.x * 200, direction.y * 200);
        particle.setCollideWorldBounds(true);
        particle.setBounce(1);

        // Destroy the particle after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            particle.destroy();
        });
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Spawn some particle effects
        this.scene.add.particles(this.x, this.y, 'electronParticle', {
            speed: 100,
            lifespan: 800,
            scale: { start: 1, end: 0 },
            quantity: 10
        });

        this.destroy();
    }
}