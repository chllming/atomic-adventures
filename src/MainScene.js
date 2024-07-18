import Phaser from 'phaser';
import Atomo from './atomo';
import Cat from './cat';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('atomo', 'assets/atomo_placeholder.png');
        this.load.image('cat', 'assets/cat_placeholder.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('background', 'assets/background_tile.png');
    }

    create() {
        // Set world bounds (10 screens wide)
        this.physics.world.setBounds(0, 0, this.cameras.main.width * 10, this.cameras.main.height);

        // Create a larger background
        this.background = this.add.tileSprite(0, 0, this.cameras.main.width * 10, this.cameras.main.height, 'background');
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);

        this.platforms = this.physics.add.staticGroup();

        // Create platforms with decreasing size and frequency
        this.createPlatforms();

        this.atomo = new Atomo(this, 100, 450);
        this.cat = new Cat(this, 300, 450);

        this.physics.add.collider(this.atomo, this.platforms);
        this.physics.add.collider(this.cat, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.swapKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.activeCharacter = this.atomo;
        this.cat.setVisible(false);

        this.debugText = this.add.text(16, 16, '', { fontSize: '18px', fill: '#fff' });
        this.debugText.setScrollFactor(0);

        this.cameras.main.setBounds(0, 0, this.cameras.main.width * 10, this.cameras.main.height);
        this.cameras.main.startFollow(this.activeCharacter, true, 0.05, 0.05);

        // Add level progress indicators
        for (let i = 1; i < 10; i++) {
            this.add.text(1024 * i, 50, `Screen ${i+1}`, { fontSize: '32px', fill: '#fff' })
                .setScrollFactor(1)
                .setOrigin(0.5);
        }
    }

    createPlatforms() {
        var screenWidth = this.cameras.main.width;
        var screenHeight = this.cameras.main.height;
    
        // Add just one starting platform
        this.platforms.create(300, 550, 'platform').setScale(1.5).refreshBody();
    
        for (var i = 0; i < 10; i++) {
            var screenStartX = i * screenWidth;
            // Randomize platform count within a range
            var platformCount = Phaser.Math.Between(2, 4);
            var maxScale = Math.max(0.8, 1.3 - (i * 0.05));
            var minScale = Math.max(0.5, 0.7 - (i * 0.02));
    
            var lastX = screenStartX;
            var lastY = screenHeight / 2; // Start from middle height
    
            for (var j = 0; j < platformCount; j++) {
                var x, y, scale, tooClose;
                var attempts = 0;
                do {
                    // Randomize horizontal spacing
                    x = Phaser.Math.Between(lastX + 200, lastX + 450);
                    if (x > screenStartX + screenWidth - 100) {
                        x = screenStartX + screenWidth - 100;
                    }
                    
                    // Randomize vertical position more
                    y = Phaser.Math.Between(screenHeight * 0.1, screenHeight * 0.9);
    
                    // Ensure some vertical distance from the last platform, but allow for more variance
                    y = Phaser.Math.Clamp(y, lastY - 300, lastY + 300);
                    
                    // Randomize scale more
                    scale = Phaser.Math.FloatBetween(minScale * 0.8, maxScale * 1.2);
    
                    // Check if the new platform is too close to existing ones
                    tooClose = this.platforms.getChildren().some(function(platform) {
                        return Phaser.Math.Distance.Between(x, y, platform.x, platform.y) < 200;
                    });
    
                    attempts++;
                } while (tooClose && attempts < 10);
    
                if (!tooClose) {
                    this.platforms.create(x, y, 'platform')
                        .setScale(scale)
                        .refreshBody();
                    lastX = x;
                    lastY = y;
                }
            }
    
            // Randomly add an extra platform with 30% chance
            if (Phaser.Math.FloatBetween(0, 1) < 0.3) {
                var extraX = Phaser.Math.Between(screenStartX, screenStartX + screenWidth - 100);
                var extraY = Phaser.Math.Between(screenHeight * 0.1, screenHeight * 0.9);
                var extraScale = Phaser.Math.FloatBetween(minScale, maxScale);
                this.platforms.create(extraX, extraY, 'platform')
                    .setScale(extraScale)
                    .refreshBody();
            }
    
            // Randomly add a very high or very low platform with 20% chance
            if (Phaser.Math.FloatBetween(0, 1) < 0.2) {
                var extremeY = (Phaser.Math.FloatBetween(0, 1) < 0.5) ? 
                               Phaser.Math.Between(screenHeight * 0.05, screenHeight * 0.15) : 
                               Phaser.Math.Between(screenHeight * 0.85, screenHeight * 0.95);
                var extremeX = Phaser.Math.Between(screenStartX, screenStartX + screenWidth - 100);
                this.platforms.create(extremeX, extremeY, 'platform')
                    .setScale(0.7)
                    .refreshBody();
            }
        }
    
        // Add a few strategic platforms for long jumps with random placement
        for (var i = 3; i < 10; i += Phaser.Math.Between(2, 3)) {
            var x = (i + Phaser.Math.FloatBetween(0.3, 0.7)) * screenWidth;
            var y = Phaser.Math.Between(screenHeight * 0.2, screenHeight * 0.8);
            this.platforms.create(x, y, 'platform')
                .setScale(0.7)
                .refreshBody();
        }
    }

    update() {
        this.handleMovement();
        this.handleJump();
        this.handleSwap();

        this.background.tilePositionX = this.cameras.main.scrollX;

        this.debugText.setText(
            `Active: ${this.activeCharacter === this.atomo ? 'Atomo' : 'Cat'}\n` +
            `X: ${Math.round(this.activeCharacter.x)}, Y: ${Math.round(this.activeCharacter.y)}\n` +
            `Touching Down: ${this.activeCharacter.body.touching.down}\n` +
            `Blocked Down: ${this.activeCharacter.body.blocked.down}\n` +
            `Velocity Y: ${Math.round(this.activeCharacter.body.velocity.y)}\n` +
            `Jump Key: ${this.jumpKey.isDown}`
        );
    }

    handleMovement() {
        if (this.cursors.left.isDown) {
            this.activeCharacter.move(-1);
        } else if (this.cursors.right.isDown) {
            this.activeCharacter.move(1);
        } else {
            this.activeCharacter.setVelocityX(0);
        }
    }

    handleJump() {
        if (this.jumpKey.isDown) {
            this.activeCharacter.jump();
        }
    }

    handleSwap() {
        if (Phaser.Input.Keyboard.JustDown(this.swapKey)) {
            if (this.activeCharacter === this.atomo) {
                this.activeCharacter = this.cat;
                this.atomo.setVisible(false);
                this.cat.setVisible(true);
                this.cat.x = this.atomo.x;
                this.cat.y = this.atomo.y;
                this.cat.setVelocityX(this.atomo.body.velocity.x);
                this.cat.setVelocityY(this.atomo.body.velocity.y);
            } else {
                this.activeCharacter = this.atomo;
                this.cat.setVisible(false);
                this.atomo.setVisible(true);
                this.atomo.x = this.cat.x;
                this.atomo.y = this.cat.y;
                this.atomo.setVelocityX(this.cat.body.velocity.x);
                this.atomo.setVelocityY(this.cat.body.velocity.y);
            }
            this.cameras.main.startFollow(this.activeCharacter, true, 0.05, 0.05);
        }
    }
}