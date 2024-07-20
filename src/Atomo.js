import Phaser from 'phaser';

export default class Atomo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'atomo');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.health = 100;
        this.jumpForce = -500;
        this.moveSpeed = 160;
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
        // This method can be used for any per-frame updates specific to Atomo
        // Currently empty as we're not using animations
    }
}