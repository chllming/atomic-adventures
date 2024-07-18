import Phaser from 'phaser';

export default class Cat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cat');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.health = 60;
        this.jumpForce = -600; // Higher jump for Cat
        this.moveSpeed = 200; // Faster movement for Cat
    }

    move(direction) {
        this.setVelocityX(direction * this.moveSpeed);
    }

    jump() {
        if (this.body.touching.down || this.body.blocked.down) {
            this.setVelocityY(this.jumpForce);
        }
    }

    // Add Cat-specific attacks here
}