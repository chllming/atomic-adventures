import Phaser from 'phaser';

export default class Cat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cat');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.health = 60;
        this.jumpForce = -600;
        this.moveSpeed = 200;
    }

    move(direction) {
        this.setVelocityX(direction * this.moveSpeed);
        if (direction < 0) {
            this.setFlipX(true);
        } else if (direction > 0) {
            this.setFlipX(false);
        }
    }

    jump() {
        if (this.body.touching.down || this.body.blocked.down) {
            this.setVelocityY(this.jumpForce);
        }
    }

    update() {
        // This method can be used for any per-frame updates specific to Cat
        // Currently empty as we're not using animations
    }
}