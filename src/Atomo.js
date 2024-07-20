import Phaser from 'phaser';

export default class Atomo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'atomo');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.lives = 3;
        this.jumpForce = -500;
        this.moveSpeed = 160;
    }

    move(direction) {
        if (this.body) {
            this.body.setVelocityX(direction * this.moveSpeed);
        }
    }

    jump() {
        if (this.body && (this.body.touching.down || this.body.blocked.down)) {
            this.body.setVelocityY(this.jumpForce);
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log('Atomo died!');
    }
}