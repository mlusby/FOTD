// Freud of the Dark - Main Game Configuration

// Global input manager to prevent conflicts
class InputManager {
    constructor() {
        this.lastInputTime = 0;
        this.inputDelay = 300; // 300ms between inputs
    }
    
    canAcceptInput() {
        const now = Date.now();
        if (now - this.lastInputTime > this.inputDelay) {
            this.lastInputTime = now;
            return true;
        }
        return false;
    }
}

const globalInput = new InputManager();

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.selectedOption = 0;
        this.menuOptions = ['Start Game', 'Dummy Option 1', 'Dummy Option 2'];
        this.menuButtons = [];
    }

    preload() {
        console.log('MainMenuScene preload complete');
    }

    create() {
        console.log('MainMenuScene create started');
        
        // Add background
        this.add.rectangle(400, 300, 800, 600, 0x2c3e50);
        
        // Title
        this.add.text(400, 150, 'Freud of the Dark', {
            fontSize: '48px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(400, 210, 'Therapy for the Fantastical', {
            fontSize: '24px',
            fill: '#bdc3c7',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Create menu options
        this.menuOptions.forEach((option, index) => {
            const button = this.add.text(400, 320 + (index * 60), option, {
                fontSize: '32px',
                fill: '#95a5a6',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => this.selectOption(index));
            
            this.menuButtons.push(button);
        });

        // Highlight first option
        this.updateSelection();

        // Controller instructions
        this.add.text(400, 550, 'Xbox Controller: D-pad to navigate, A to select', {
            fontSize: '16px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Set up gamepad support
        this.input.gamepad.once('connected', (pad) => {
            console.log('Controller connected:', pad.id);
        });

        // Set up keyboard controls as backup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    updateSelection() {
        this.menuButtons.forEach((button, index) => {
            if (index === this.selectedOption) {
                button.setStyle({ fill: '#3498db' });
            } else {
                button.setStyle({ fill: '#95a5a6' });
            }
        });
    }

    selectOption(index) {
        if (!globalInput.canAcceptInput()) return;
        
        console.log('Selected option:', index, this.menuOptions[index]);
        
        if (index === 0) {
            this.scene.start('TherapyOfficeScene');
        } else {
            console.log('Dummy option selected:', this.menuOptions[index]);
        }
    }

    update() {
        // Keyboard controls
        if (this.cursors.up.justDown) {
            if (globalInput.canAcceptInput()) {
                this.selectedOption = Math.max(0, this.selectedOption - 1);
                this.updateSelection();
            }
        }
        
        if (this.cursors.down.justDown) {
            if (globalInput.canAcceptInput()) {
                this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                this.updateSelection();
            }
        }
        
        if (this.enterKey.justDown) {
            this.selectOption(this.selectedOption);
        }

        // Controller input with simple detection
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad && globalInput.canAcceptInput()) {
                // Check D-pad up
                if ((gamepad.buttons && gamepad.buttons[12] && gamepad.buttons[12].pressed) ||
                    (gamepad.up && gamepad.up.pressed) ||
                    (gamepad.leftStick && gamepad.leftStick.y < -0.5)) {
                    this.selectedOption = Math.max(0, this.selectedOption - 1);
                    this.updateSelection();
                }
                
                // Check D-pad down  
                if ((gamepad.buttons && gamepad.buttons[13] && gamepad.buttons[13].pressed) ||
                    (gamepad.down && gamepad.down.pressed) ||
                    (gamepad.leftStick && gamepad.leftStick.y > 0.5)) {
                    this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                    this.updateSelection();
                }
                
                // Check A button - try multiple ways
                if ((gamepad.buttons && gamepad.buttons[0] && gamepad.buttons[0].pressed) ||
                    (gamepad.A && gamepad.A.pressed)) {
                    console.log('A button detected, calling selectOption');
                    this.selectOption(this.selectedOption);
                }
            }
        }
    }
}

class TherapyOfficeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TherapyOfficeScene' });
        this.selectedOption = 0;
        this.menuOptions = ['Patient Files', 'Begin Session'];
        this.menuButtons = [];
    }

    create() {
        // Office background
        this.add.rectangle(400, 300, 800, 600, 0x8b4513);
        
        // Office title
        this.add.text(400, 50, 'Dr. Freud\'s Office', {
            fontSize: '32px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Placeholder for office furniture/decorations
        this.add.rectangle(200, 400, 120, 80, 0x654321); // Desk
        this.add.rectangle(600, 400, 100, 60, 0x2c3e50); // Chair

        // Patient folder button
        const folderButton = this.add.text(200, 200, 'Patient Files', {
            fontSize: '24px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        folderButton.setInteractive();
        folderButton.on('pointerdown', () => this.selectOption(0));
        this.menuButtons.push(folderButton);

        // Start session button
        const sessionButton = this.add.text(600, 200, 'Begin Session', {
            fontSize: '24px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        sessionButton.setInteractive();
        sessionButton.on('pointerdown', () => this.selectOption(1));
        this.menuButtons.push(sessionButton);

        // Highlight first option
        this.updateSelection();

        // Instructions
        this.add.text(400, 550, 'Xbox Controller: D-pad to navigate, A to select, B to go back', {
            fontSize: '16px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    updateSelection() {
        this.menuButtons.forEach((button, index) => {
            if (index === this.selectedOption) {
                button.setStyle({ fill: '#3498db' });
            } else {
                button.setStyle({ fill: '#95a5a6' });
            }
        });
    }

    selectOption(index) {
        if (!globalInput.canAcceptInput()) return;
        
        if (index === 0) {
            this.scene.start('PatientFilesScene');
        } else if (index === 1) {
            this.scene.start('TherapySessionScene');
        }
    }

    goBack() {
        if (!globalInput.canAcceptInput()) return;
        this.scene.start('MainMenuScene');
    }

    update() {
        // Keyboard controls
        if (this.cursors.left.justDown || this.cursors.up.justDown) {
            if (globalInput.canAcceptInput()) {
                this.selectedOption = Math.max(0, this.selectedOption - 1);
                this.updateSelection();
            }
        }
        
        if (this.cursors.right.justDown || this.cursors.down.justDown) {
            if (globalInput.canAcceptInput()) {
                this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                this.updateSelection();
            }
        }
        
        if (this.enterKey.justDown) {
            this.selectOption(this.selectedOption);
        }
        
        if (this.escKey.justDown) {
            this.goBack();
        }

        // Controller input
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad && globalInput.canAcceptInput()) {
                // Navigation
                if ((gamepad.buttons && gamepad.buttons[14] && gamepad.buttons[14].pressed) || // D-pad left
                    (gamepad.buttons && gamepad.buttons[12] && gamepad.buttons[12].pressed) || // D-pad up
                    (gamepad.left && gamepad.left.pressed) ||
                    (gamepad.up && gamepad.up.pressed) ||
                    (gamepad.leftStick && (gamepad.leftStick.x < -0.5 || gamepad.leftStick.y < -0.5))) {
                    this.selectedOption = Math.max(0, this.selectedOption - 1);
                    this.updateSelection();
                }
                
                if ((gamepad.buttons && gamepad.buttons[15] && gamepad.buttons[15].pressed) || // D-pad right
                    (gamepad.buttons && gamepad.buttons[13] && gamepad.buttons[13].pressed) || // D-pad down
                    (gamepad.right && gamepad.right.pressed) ||
                    (gamepad.down && gamepad.down.pressed) ||
                    (gamepad.leftStick && (gamepad.leftStick.x > 0.5 || gamepad.leftStick.y > 0.5))) {
                    this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                    this.updateSelection();
                }
                
                // A button
                if ((gamepad.buttons && gamepad.buttons[0] && gamepad.buttons[0].pressed) ||
                    (gamepad.A && gamepad.A.pressed)) {
                    console.log('A button detected in office scene');
                    this.selectOption(this.selectedOption);
                }
                
                // B button
                if ((gamepad.buttons && gamepad.buttons[1] && gamepad.buttons[1].pressed) ||
                    (gamepad.B && gamepad.B.pressed)) {
                    console.log('B button detected in office scene');
                    this.goBack();
                }
            }
        }
    }
}

class PatientFilesScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PatientFilesScene' });
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x34495e);
        
        // Title
        this.add.text(400, 50, 'Patient Files', {
            fontSize: '32px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Sample patient entry
        this.add.rectangle(400, 200, 700, 100, 0x2c3e50);
        this.add.text(400, 170, 'Zara & Finn (Dragon/Human Couple)', {
            fontSize: '20px',
            fill: '#e74c3c',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Health meters placeholder
        this.add.text(300, 200, 'Individual Health:', {
            fontSize: '14px',
            fill: '#bdc3c7',
            fontFamily: 'Arial'
        });
        this.add.rectangle(450, 200, 200, 10, 0x27ae60); // Health bar

        this.add.text(300, 220, 'Relationship Health:', {
            fontSize: '14px',
            fill: '#bdc3c7',
            fontFamily: 'Arial'
        });
        this.add.rectangle(450, 220, 150, 10, 0xf39c12); // Relationship bar

        // Back button
        const backButton = this.add.text(100, 550, 'Back to Office', {
            fontSize: '20px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        backButton.setInteractive();
        backButton.on('pointerdown', () => this.goBack());

        // Instructions
        this.add.text(400, 550, 'Xbox Controller: B to go back', {
            fontSize: '16px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Set up keyboard controls
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    goBack() {
        if (!globalInput.canAcceptInput()) return;
        this.scene.start('TherapyOfficeScene');
    }

    update() {
        // Keyboard controls
        if (this.escKey.justDown) {
            this.goBack();
        }

        // Controller input
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad && globalInput.canAcceptInput()) {
                // B button
                if ((gamepad.buttons && gamepad.buttons[1] && gamepad.buttons[1].pressed) ||
                    (gamepad.B && gamepad.B.pressed)) {
                    console.log('B button detected in patient files');
                    this.goBack();
                }
            }
        }
    }
}

class TherapySessionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TherapySessionScene' });
        this.interactionCount = 0;
        this.maxInteractions = 6;
    }

    create() {
        // Session room background
        this.add.rectangle(400, 300, 800, 600, 0x2c3e50);
        
        // Title
        this.add.text(400, 50, 'Therapy Session - Zara & Finn', {
            fontSize: '24px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Character placeholders
        this.add.circle(250, 250, 50, 0xe74c3c); // Dragon (red)
        this.add.text(250, 320, 'Zara (Dragon)', {
            fontSize: '16px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.circle(550, 250, 50, 0xf39c12); // Human (orange)
        this.add.text(550, 320, 'Finn (Human)', {
            fontSize: '16px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Interaction counter
        this.interactionText = this.add.text(700, 100, `Interactions: ${this.interactionCount}/${this.maxInteractions}`, {
            fontSize: '16px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Dialogue area
        this.dialogueBox = this.add.rectangle(400, 450, 750, 120, 0x34495e);
        this.dialogueText = this.add.text(400, 450, 'Zara: "He never understands my need for personal space when I transform..."', {
            fontSize: '16px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            wordWrap: { width: 700 }
        }).setOrigin(0.5);

        // Response options
        this.createResponseOptions();
    }

    createResponseOptions() {
        const responses = [
            "Tell me more about your transformation needs, Zara.",
            "Finn, how do you feel when Zara transforms?",
            "Let's explore communication strategies for this."
        ];

        responses.forEach((response, index) => {
            const button = this.add.text(400, 520 + (index * 25), `${index + 1}. ${response}`, {
                fontSize: '14px',
                fill: '#3498db',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => this.handleResponse(index));
        });
    }

    handleResponse(responseIndex) {
        this.interactionCount++;
        this.interactionText.setText(`Interactions: ${this.interactionCount}/${this.maxInteractions}`);

        // Simple response system
        const responses = [
            "Zara: 'When I transform, I need at least 10 feet of space, but Finn always tries to help...'",
            "Finn: 'I just want to make sure she's safe. Dragons are powerful, even when they're careful.'",
            "Both: 'We've never really talked about boundaries during transformation...'"
        ];

        this.dialogueText.setText(responses[responseIndex]);

        if (this.interactionCount >= this.maxInteractions) {
            this.time.delayedCall(2000, () => {
                this.scene.start('SessionReviewScene');
            });
        } else {
            // Clear and recreate response options
            this.time.delayedCall(1500, () => {
                this.createResponseOptions();
            });
        }
    }
}

class SessionReviewScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SessionReviewScene' });
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x2c3e50);
        
        // Title
        this.add.text(400, 50, 'Session Review', {
            fontSize: '32px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Observations
        this.add.text(400, 150, 'Observations:', {
            fontSize: '24px',
            fill: '#e74c3c',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const observations = [
            "• Zara showed defensive body language when discussing transformation",
            "• Finn displayed protective instincts, possibly overprotective",
            "• Both clients avoided eye contact during boundary discussion",
            "• Cultural gap: Dragon transformation needs vs Human safety concerns"
        ];

        observations.forEach((obs, index) => {
            this.add.text(100, 200 + (index * 30), obs, {
                fontSize: '16px',
                fill: '#bdc3c7',
                fontFamily: 'Arial'
            });
        });

        // Progress indicators
        this.add.text(400, 400, 'Session Progress:', {
            fontSize: '20px',
            fill: '#27ae60',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(400, 430, 'Communication breakthrough achieved', {
            fontSize: '16px',
            fill: '#2ecc71',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Back to office
        const backButton = this.add.text(400, 520, 'Return to Office', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            if (globalInput.canAcceptInput()) {
                this.scene.start('TherapyOfficeScene');
            }
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    scene: [MainMenuScene, TherapyOfficeScene, PatientFilesScene, TherapySessionScene, SessionReviewScene],
    input: {
        gamepad: true
    }
};

// Start the game
console.log('Starting Phaser game with config:', config);
const game = new Phaser.Game(config);
console.log('Game created:', game);