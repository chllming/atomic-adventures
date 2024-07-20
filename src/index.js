// index.js or game.js

import Phaser from 'phaser';
import MainScene from './MainScene';
import GameOverScene from './GameOverScene';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainScene, GameOverScene]
};

const game = new Phaser.Game(config);