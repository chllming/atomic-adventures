import Phaser from 'phaser';
import MainScene from './MainScene';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',  // This tells Phaser to use our game-container div
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);