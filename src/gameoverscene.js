// GameOverScene.js

import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 400, 'Press SPACE to restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainScene');
        });
    }
}