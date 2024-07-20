import Phaser from 'phaser';

export default class Cat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cat');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.maxHealth = 60;
        this.health = this.maxHealth;
        this.lives = 9;
        this.jumpForce = -600;
        this.moveSpeed = 200;
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
        console.log('Cat died!');
    }
}