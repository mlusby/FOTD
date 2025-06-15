// Freud of the Dark - Main Game Configuration

// Enhanced error handler for better debugging with unminified Phaser
window.addEventListener('error', (event) => {
    console.error('Global error caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error ? event.error.stack : 'No stack available'
    });
    
    // Check for various error patterns that might be related to our issue
    if (event.message && (
        event.message.includes('cut') || 
        event.message.includes('null is not an object') ||
        event.message.includes('Cannot read prop') ||
        event.message.includes('setSize')
    )) {
        console.error('FOUND A RELEVANT ERROR!', {
            message: event.message,
            stack: event.error ? event.error.stack : 'No stack',
            fullEvent: event
        });
        debugger; // This will pause execution in dev tools
    }
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', {
        reason: event.reason,
        promise: event.promise
    });
});

// Scene transition helper with debugging and Phaser-specific fixes
function safeSceneTransition(scene, targetSceneName, method = 'start') {
    try {
        console.log(`[SCENE DEBUG] Attempting ${method} from ${scene.scene.key} to ${targetSceneName}`);
        console.log(`[SCENE DEBUG] Current scene state:`, {
            key: scene.scene.key,
            isActive: scene.scene.isActive(),
            isPaused: scene.scene.isPaused(),
            isSleeping: scene.scene.isSleeping()
        });
        
        // Validate scene manager state
        if (!scene.scene || !scene.scene.manager) {
            console.error('[SCENE DEBUG] Scene or scene manager is null!');
            return false;
        }
        
        // CRITICAL FIX: Clear any pending timers/events and clean up display objects
        // NOTE: Don't clear ALL events as it would kill our own transition timer
        // Instead, be more selective about cleanup
        
        // Fix for the setSize/cut error: Ensure all text objects are properly cleaned up
        if (scene.children) {
            scene.children.list.forEach(child => {
                if (child && child.type === 'Text' && child.destroy) {
                    try {
                        // Force text object cleanup before scene transition
                        if (child.style && child.style.wordWrapCallback) {
                            child.style.wordWrapCallback = null;
                        }
                    } catch (e) {
                        console.warn('[SCENE DEBUG] Text cleanup warning:', e.message);
                    }
                }
            });
        }
        
        // Clear input states before transition to prevent sticky inputs
        globalInput.clearInputStates();
        
        // Execute scene transition immediately to avoid timer conflicts
        try {
            console.log(`[SCENE DEBUG] About to call scene.start(${targetSceneName})`);
            console.log(`[SCENE DEBUG] Scene manager:`, scene.scene.manager);
            console.log(`[SCENE DEBUG] Available scenes:`, Object.keys(scene.scene.manager.scenes));
            
            // Check if target scene exists
            const targetScene = scene.scene.manager.getScene(targetSceneName);
            console.log(`[SCENE DEBUG] Target scene found:`, targetScene ? true : false);
            
            // Call scene.start with detailed error handling
            console.log(`[SCENE DEBUG] Current scene before start:`, scene.scene.key);
            scene.scene.start(targetSceneName);
            console.log(`[SCENE DEBUG] scene.start() call completed`);
            
        } catch (immediateError) {
            console.error(`[SCENE DEBUG] Error during scene.start():`, {
                from: scene.scene.key,
                to: targetSceneName,
                error: immediateError.message,
                stack: immediateError.stack
            });
        }
        
        return true;
        
    } catch (error) {
        console.error(`[SCENE DEBUG] Error during scene transition setup:`, {
            from: scene.scene.key,
            to: targetSceneName,
            method: method,
            error: error.message,
            stack: error.stack
        });
        
        // Emergency fallback
        try {
            console.log('[SCENE DEBUG] Attempting emergency fallback transition');
            scene.scene.start(targetSceneName);
            return true;
        } catch (fallbackError) {
            console.error('[SCENE DEBUG] Emergency fallback failed:', fallbackError);
            return false;
        }
    }
}

// Global input manager to prevent conflicts and track button states
class InputManager {
    constructor() {
        this.lastInputTime = 0;
        this.inputDelay = 150; // Reduced to 150ms for better responsiveness
        this.buttonStates = {};
    }
    
    canAcceptInput() {
        const now = Date.now();
        if (now - this.lastInputTime > this.inputDelay) {
            this.lastInputTime = now;
            return true;
        }
        return false;
    }
    
    // Track button state changes for "justPressed" detection
    wasButtonJustPressed(gamepad, buttonIndex) {
        try {
            if (!gamepad || !gamepad.buttons || !gamepad.buttons[buttonIndex]) {
                return false;
            }
            
            const buttonKey = `${gamepad.id}_${buttonIndex}`;
            const currentPressed = gamepad.buttons[buttonIndex].pressed;
            const previousPressed = this.buttonStates[buttonKey] || false;
            
            this.buttonStates[buttonKey] = currentPressed;
            
            // Return true only if button was just pressed (not held)
            return currentPressed && !previousPressed;
        } catch (error) {
            console.error('[INPUT DEBUG] Error in wasButtonJustPressed:', {
                buttonIndex,
                gamepadId: gamepad ? gamepad.id : 'null',
                error: error.message,
                stack: error.stack
            });
            return false;
        }
    }
    
    // Alternative method using named button properties
    wasNamedButtonJustPressed(gamepad, buttonName) {
        try {
            if (!gamepad || !gamepad[buttonName]) {
                return false;
            }
            
            const buttonKey = `${gamepad.id}_${buttonName}`;
            const currentPressed = gamepad[buttonName].pressed;
            const previousPressed = this.buttonStates[buttonKey] || false;
            
            this.buttonStates[buttonKey] = currentPressed;
            
            return currentPressed && !previousPressed;
        } catch (error) {
            console.error('[INPUT DEBUG] Error in wasNamedButtonJustPressed:', {
                buttonName,
                gamepadId: gamepad ? gamepad.id : 'null',
                error: error.message,
                stack: error.stack
            });
            return false;
        }
    }
    
    // Improved thumbstick detection with deadzone and state tracking
    wasThumbstickJustMoved(gamepad, stickName, direction, threshold = 0.7) {
        if (!gamepad || !gamepad[stickName]) {
            return false;
        }
        
        const stick = gamepad[stickName];
        const stickKey = `${gamepad.id}_${stickName}_${direction}`;
        
        let currentMoved = false;
        if (direction === 'up') {
            currentMoved = stick.y < -threshold;
        } else if (direction === 'down') {
            currentMoved = stick.y > threshold;
        } else if (direction === 'left') {
            currentMoved = stick.x < -threshold;
        } else if (direction === 'right') {
            currentMoved = stick.x > threshold;
        }
        
        const previousMoved = this.buttonStates[stickKey] || false;
        this.buttonStates[stickKey] = currentMoved;
        
        return currentMoved && !previousMoved;
    }
    
    // Clear input states to prevent issues between scenes
    clearInputStates() {
        this.buttonStates = {};
        this.lastInputTime = 0;
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

        // Clear any existing menu buttons to prevent corruption
        this.menuButtons = [];
        
        // Create menu options with safer text creation
        this.menuOptions.forEach((option, index) => {
            try {
                const button = this.add.text(400, 320 + (index * 60), option, {
                    fontSize: '32px',
                    fill: '#95a5a6',
                    fontFamily: 'Arial',
                    // Add explicit text wrapping settings to prevent null data issues
                    wordWrap: { width: 0 }  // Disable word wrapping
                }).setOrigin(0.5);

                button.setInteractive();
                button.on('pointerdown', () => this.selectOption(index));
                
                this.menuButtons.push(button);
            } catch (error) {
                console.error(`[TEXT DEBUG] Error creating menu button ${index}:`, error);
            }
        });

        // Reset selection to ensure it's properly initialized
        this.selectedOption = 0;
        
        // Highlight first option with delayed call to ensure text objects are ready
        this.time.delayedCall(10, () => {
            this.updateSelection();
        });

        // Controller instructions
        this.add.text(400, 550, 'Xbox Controller: D-pad to navigate, A to select', {
            fontSize: '16px',
            fill: '#95a5a6',
            fontFamily: 'Arial',
            wordWrap: { width: 0 }  // Disable word wrapping
        }).setOrigin(0.5);

        // Set up gamepad support with immediate detection
        this.input.gamepad.once('connected', (pad) => {
            console.log('Controller connected:', pad.id);
        });
        
        // Proactively check for already connected controllers
        this.time.delayedCall(100, () => {
            if (this.input.gamepad.total > 0) {
                const pad = this.input.gamepad.getPad(0);
                if (pad) {
                    console.log('Controller already connected:', pad.id);
                }
            }
        });
        
        // Force gamepad detection by accessing navigator.getGamepads()
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            if (gamepads && gamepads.length > 0) {
                console.log('Native gamepad API detected controllers');
            }
        }

        // Set up keyboard controls as backup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    updateSelection() {
        try {
            // Only skip if scene is explicitly destroyed, not just inactive
            if (!this.scene || (this.scene.sys && this.scene.sys.isDestroyed)) {
                return;
            }
            
            console.log('[SELECTION DEBUG] MainMenu updateSelection called, selectedOption:', this.selectedOption, 'menuButtons length:', this.menuButtons.length);
            
            // Check if buttons are corrupted and need rebuilding
            let needsRebuild = false;
            if (this.menuButtons.length === 0 || this.menuButtons.length !== this.menuOptions.length) {
                needsRebuild = true;
                console.log('[CORRUPTION DEBUG] MainMenu buttons missing, rebuilding...');
            } else {
                // Test if first button is corrupted
                try {
                    if (this.menuButtons[0] && this.menuButtons[0].setColor) {
                        this.menuButtons[0].setColor('#95a5a6'); // Test call
                    }
                } catch (testError) {
                    if (testError.message.includes('data.cut')) {
                        needsRebuild = true;
                        console.log('[CORRUPTION DEBUG] MainMenu buttons corrupted, rebuilding...');
                    }
                }
            }
            
            if (needsRebuild) {
                this.rebuildMenuButtons();
                return; // Exit early, let the delayed updateSelection handle highlighting
            }
            
            // Normal highlighting if buttons are healthy
            this.menuButtons.forEach((button, index) => {
                if (button && button.setColor) {
                    const newColor = index === this.selectedOption ? '#3498db' : '#95a5a6';
                    console.log(`[SELECTION DEBUG] MainMenu setting button ${index} to color ${newColor}`);
                    button.setColor(newColor);
                }
            });
        } catch (error) {
            console.error('[TEXT DEBUG] Error in MainMenuScene updateSelection:', error.message);
            // Try to rebuild on any error
            this.rebuildMenuButtons();
        }
    }
    
    rebuildMenuButtons() {
        console.log('[REBUILD DEBUG] Rebuilding MainMenu buttons...');
        
        // Clear corrupted buttons
        this.menuButtons.forEach(button => {
            if (button && button.destroy) {
                try { button.destroy(); } catch (e) {}
            }
        });
        this.menuButtons = [];
        
        // Recreate buttons
        this.menuOptions.forEach((option, index) => {
            const button = this.add.text(400, 320 + (index * 60), option, {
                fontSize: '32px',
                fill: '#95a5a6',
                fontFamily: 'Arial',
                wordWrap: { width: 0 }
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => this.selectOption(index));
            this.menuButtons.push(button);
        });
        
        // Highlight after rebuild
        this.time.delayedCall(10, () => {
            this.updateSelection();
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

        // Controller input with proper justPressed detection
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad) {
                // Check D-pad up (with justPressed logic)
                if (globalInput.wasButtonJustPressed(gamepad, 12) || // D-pad up
                    globalInput.wasNamedButtonJustPressed(gamepad, 'up') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'up')) {
                    console.log('[NAVIGATION DEBUG] MainMenu navigating up, from', this.selectedOption, 'to', Math.max(0, this.selectedOption - 1));
                    this.selectedOption = Math.max(0, this.selectedOption - 1);
                    this.updateSelection();
                }
                
                // Check D-pad down (with justPressed logic)
                if (globalInput.wasButtonJustPressed(gamepad, 13) || // D-pad down
                    globalInput.wasNamedButtonJustPressed(gamepad, 'down') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'down')) {
                    console.log('[NAVIGATION DEBUG] MainMenu navigating down, from', this.selectedOption, 'to', Math.min(this.menuOptions.length - 1, this.selectedOption + 1));
                    this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                    this.updateSelection();
                }
                
                // Check A button with reliable detection
                const aPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'A');
                if (aPressed) {
                    console.log('A button just pressed, calling selectOption');
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

        // Clear any existing menu buttons to prevent corruption
        this.menuButtons = [];

        // Patient folder button with safe text creation
        const folderButton = this.add.text(200, 200, 'Patient Files', {
            fontSize: '24px',
            fill: '#95a5a6',
            fontFamily: 'Arial',
            wordWrap: { width: 0 }  // Disable word wrapping
        }).setOrigin(0.5);

        folderButton.setInteractive();
        folderButton.on('pointerdown', () => this.selectOption(0));
        this.menuButtons.push(folderButton);

        // Start session button with safe text creation
        const sessionButton = this.add.text(600, 200, 'Begin Session', {
            fontSize: '24px',
            fill: '#95a5a6',
            fontFamily: 'Arial',
            wordWrap: { width: 0 }  // Disable word wrapping
        }).setOrigin(0.5);

        sessionButton.setInteractive();
        sessionButton.on('pointerdown', () => this.selectOption(1));
        this.menuButtons.push(sessionButton);

        // Reset selection to ensure it's properly initialized
        this.selectedOption = 0;
        
        // Highlight first option with delayed call
        this.time.delayedCall(10, () => {
            this.updateSelection();
        });

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
        try {
            // Only skip if scene is explicitly destroyed, not just inactive
            if (!this.scene || (this.scene.sys && this.scene.sys.isDestroyed)) {
                return;
            }
            
            console.log('[SELECTION DEBUG] TherapyOffice updateSelection called, selectedOption:', this.selectedOption, 'menuButtons length:', this.menuButtons.length);
            
            // Check if buttons are corrupted and need rebuilding
            let needsRebuild = false;
            if (this.menuButtons.length === 0 || this.menuButtons.length !== this.menuOptions.length) {
                needsRebuild = true;
                console.log('[CORRUPTION DEBUG] TherapyOffice buttons missing, rebuilding...');
            } else {
                // Test if first button is corrupted
                try {
                    if (this.menuButtons[0] && this.menuButtons[0].setColor) {
                        this.menuButtons[0].setColor('#95a5a6'); // Test call
                    }
                } catch (testError) {
                    if (testError.message.includes('data.cut')) {
                        needsRebuild = true;
                        console.log('[CORRUPTION DEBUG] TherapyOffice buttons corrupted, rebuilding...');
                    }
                }
            }
            
            if (needsRebuild) {
                this.rebuildMenuButtons();
                return; // Exit early, let the delayed updateSelection handle highlighting
            }
            
            // Normal highlighting if buttons are healthy
            this.menuButtons.forEach((button, index) => {
                if (button && button.setColor) {
                    const newColor = index === this.selectedOption ? '#3498db' : '#95a5a6';
                    console.log(`[SELECTION DEBUG] TherapyOffice setting button ${index} to color ${newColor}`);
                    button.setColor(newColor);
                }
            });
        } catch (error) {
            console.error('[TEXT DEBUG] Error in TherapyOfficeScene updateSelection:', error.message);
            // Try to rebuild on any error
            this.rebuildMenuButtons();
        }
    }
    
    rebuildMenuButtons() {
        console.log('[REBUILD DEBUG] Rebuilding TherapyOffice buttons...');
        
        // Clear corrupted buttons
        this.menuButtons.forEach(button => {
            if (button && button.destroy) {
                try { button.destroy(); } catch (e) {}
            }
        });
        this.menuButtons = [];
        
        // Recreate buttons at their original positions
        const folderButton = this.add.text(200, 200, 'Patient Files', {
            fontSize: '24px',
            fill: '#95a5a6',
            fontFamily: 'Arial',
            wordWrap: { width: 0 }
        }).setOrigin(0.5);
        folderButton.setInteractive();
        folderButton.on('pointerdown', () => this.selectOption(0));
        this.menuButtons.push(folderButton);
        
        const sessionButton = this.add.text(600, 200, 'Begin Session', {
            fontSize: '24px',
            fill: '#95a5a6',
            fontFamily: 'Arial',
            wordWrap: { width: 0 }
        }).setOrigin(0.5);
        sessionButton.setInteractive();
        sessionButton.on('pointerdown', () => this.selectOption(1));
        this.menuButtons.push(sessionButton);
        
        // Highlight after rebuild
        this.time.delayedCall(10, () => {
            this.updateSelection();
        });
    }

    selectOption(index) {
        if (!globalInput.canAcceptInput()) return;
        
        if (index === 0) {
            console.log('[SCENE DEBUG] TherapyOffice selecting Patient Files');
            safeSceneTransition(this, 'PatientFilesScene');
        } else if (index === 1) {
            console.log('[SCENE DEBUG] TherapyOffice selecting Begin Session');
            safeSceneTransition(this, 'TherapySessionScene');
        }
    }

    goBack() {
        if (!globalInput.canAcceptInput()) return;
        console.log('[SCENE DEBUG] TherapyOfficeScene goBack() called');
        safeSceneTransition(this, 'MainMenuScene');
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

        // Controller input with proper justPressed detection
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad) {
                // Navigation - left/up
                if (globalInput.wasButtonJustPressed(gamepad, 14) || // D-pad left
                    globalInput.wasButtonJustPressed(gamepad, 12) || // D-pad up
                    globalInput.wasNamedButtonJustPressed(gamepad, 'left') ||
                    globalInput.wasNamedButtonJustPressed(gamepad, 'up') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'left') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'up')) {
                    console.log('[NAVIGATION DEBUG] TherapyOffice navigating left/up, from', this.selectedOption, 'to', Math.max(0, this.selectedOption - 1));
                    this.selectedOption = Math.max(0, this.selectedOption - 1);
                    this.updateSelection();
                }
                
                // Navigation - right/down
                if (globalInput.wasButtonJustPressed(gamepad, 15) || // D-pad right
                    globalInput.wasButtonJustPressed(gamepad, 13) || // D-pad down
                    globalInput.wasNamedButtonJustPressed(gamepad, 'right') ||
                    globalInput.wasNamedButtonJustPressed(gamepad, 'down') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'right') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'down')) {
                    console.log('[NAVIGATION DEBUG] TherapyOffice navigating right/down, from', this.selectedOption, 'to', Math.min(this.menuOptions.length - 1, this.selectedOption + 1));
                    this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                    this.updateSelection();
                }
                
                // A button with reliable detection
                const aPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'A');
                if (aPressed) {
                    console.log('A button just pressed in office scene');
                    this.selectOption(this.selectedOption);
                }
                
                // B button with reliable detection and detailed debugging
                const bPressed = globalInput.wasButtonJustPressed(gamepad, 1) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'B');
                if (bPressed) {
                    console.log('[SCENE DEBUG] B button pressed in TherapyOfficeScene');
                    console.log('[SCENE DEBUG] About to call goBack()');
                    console.log('[SCENE DEBUG] Scene state before goBack:', {
                        key: this.scene.key,
                        isActive: this.scene.isActive(),
                        gamepad: gamepad ? gamepad.id : 'null'
                    });
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
        console.log('[SCENE DEBUG] PatientFilesScene goBack() called');
        safeSceneTransition(this, 'TherapyOfficeScene');
    }

    update() {
        // Keyboard controls
        if (this.escKey.justDown) {
            this.goBack();
        }

        // Controller input with proper justPressed detection
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad) {
                // B button with reliable detection and detailed debugging
                const bPressed = globalInput.wasButtonJustPressed(gamepad, 1) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'B');
                if (bPressed) {
                    console.log('[SCENE DEBUG] B button pressed in PatientFilesScene');
                    console.log('[SCENE DEBUG] About to call goBack()');
                    console.log('[SCENE DEBUG] Scene state before goBack:', {
                        key: this.scene.key,
                        isActive: this.scene.isActive(),
                        gamepad: gamepad ? gamepad.id : 'null'
                    });
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
        this.selectedResponse = 0;
        this.responseButtons = [];
        this.awaitingInput = false;
        this.typewriterActive = false;
        this.typewriterTimer = null;
    }

    create() {
        try {
            console.log('[THERAPY SESSION] TherapySessionScene.create() called!');
            console.log('[THERAPY SESSION] Scene key:', this.scene.key);
            console.log('[THERAPY SESSION] This scene is active:', this.scene.isActive());
            
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

        // Dialogue area - moved higher to make room for response buttons
        this.dialogueBox = this.add.rectangle(400, 320, 750, 80, 0x34495e);
        this.dialogueText = this.add.text(75, 320, '', {
            fontSize: '16px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            wordWrap: { width: 650 }
        }).setOrigin(0, 0.5);  // Left-aligned to prevent shifting

        // Start initial dialogue with typewriter effect
        const initialText = 'Zara: "He never understands my need for personal space when I transform..."';
        this.startTypewriterEffect(initialText, () => {
            console.log('[TYPEWRITER DEBUG] Initial dialogue completed, creating response options');
            this.createSimpleResponseOptions();
        });
        
        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        console.log('[THERAPY SESSION] TherapySessionScene.create() completed successfully!');
        
        // Check scene status after a brief delay
        this.time.delayedCall(200, () => {
            console.log('[THERAPY SESSION] Status check after 200ms:');
            console.log('[THERAPY SESSION] Scene active:', this.scene.isActive());
            console.log('[THERAPY SESSION] Scene visible:', this.scene.isVisible());
            console.log('[THERAPY SESSION] This scene key:', this.scene.key);
        });
        
        } catch (createError) {
            console.error('[THERAPY SESSION] Error in TherapySessionScene.create():', {
                message: createError.message,
                stack: createError.stack
            });
            // Fallback to office scene if create fails
            this.time.delayedCall(100, () => {
                this.scene.start('TherapyOfficeScene');
            });
        }
    }

    createSimpleResponseOptions() {
        console.log('[SIMPLE RESPONSE] Creating simple response options');
        
        // Clear previous response buttons
        this.responseButtons.forEach(button => button.destroy());
        this.responseButtons = [];
        
        const responses = [
            "1. Tell me more about your transformation needs, Zara.",
            "2. Finn, how do you feel when Zara transforms?", 
            "3. Let's explore communication strategies for this."
        ];

        responses.forEach((response, index) => {
            const yPos = 380 + (index * 30);
            console.log('[SIMPLE RESPONSE] Creating button', index, 'at Y:', yPos);
            
            // Create simple text without complex styling
            const button = this.add.text(400, yPos, response, {
                fontSize: '16px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => {
                console.log('[SIMPLE RESPONSE] Button', index, 'clicked');
                this.handleResponse(index);
            });
            
            this.responseButtons.push(button);
        });
        
        this.selectedResponse = 0;
        this.awaitingInput = true;
        console.log('[SIMPLE RESPONSE] Simple response options created successfully');
        this.updateResponseSelection();
    }

    createResponseOptions() {
        console.log('[RESPONSE DEBUG] createResponseOptions called');
        
        // Clear previous response buttons
        this.responseButtons.forEach(button => button.destroy());
        this.responseButtons = [];
        
        const responses = [
            "Tell me more about your transformation needs, Zara.",
            "Finn, how do you feel when Zara transforms?",
            "Let's explore communication strategies for this."
        ];

        console.log('[RESPONSE DEBUG] Creating', responses.length, 'response buttons');
        console.log('[RESPONSE DEBUG] Scene dimensions - width:', this.cameras.main.width, 'height:', this.cameras.main.height);
        console.log('[RESPONSE DEBUG] Scene center X:', this.cameras.main.centerX, 'Y:', this.cameras.main.centerY);
        
        responses.forEach((response, index) => {
            const yPos = 380 + (index * 25);
            console.log('[RESPONSE DEBUG] Creating button', index, 'at position X:400, Y:', yPos);
            
            // Create text without problematic style properties first
            const button = this.add.text(400, yPos, `${index + 1}. ${response}`, {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            
            // Apply background styling separately
            button.setBackgroundColor('#000000');
            button.setPadding(12, 8, 12, 8);

            // Comprehensive button debugging
            console.log('[RESPONSE DEBUG] Button', index, 'created with properties:', {
                x: button.x,
                y: button.y,
                width: button.width,
                height: button.height,
                visible: button.visible,
                active: button.active,
                depth: button.depth,
                text: button.text,
                style: button.style
            });

            // Force visibility and depth
            button.setVisible(true);
            button.setActive(true);
            button.setDepth(1000); // Put on top of everything
            
            button.setInteractive();
            button.on('pointerdown', () => {
                console.log('[RESPONSE DEBUG] Button', index, 'clicked!');
                this.handleResponse(index);
            });
            
            this.responseButtons.push(button);
            console.log('[RESPONSE DEBUG] Button', index, 'added to responseButtons array. Array length now:', this.responseButtons.length);
        });
        
        this.selectedResponse = 0;
        this.awaitingInput = true;
        console.log('[RESPONSE DEBUG] Set awaitingInput to true, total buttons created:', this.responseButtons.length);
        
        // Add bright red test rectangles at the same positions to verify rendering
        console.log('[RESPONSE DEBUG] Adding test rectangles for visibility debugging');
        for (let i = 0; i < 3; i++) {
            const testRect = this.add.rectangle(400, 380 + (i * 25), 200, 20, 0xff0000);
            testRect.setDepth(999);
            console.log('[RESPONSE DEBUG] Added test rectangle', i, 'at Y:', 380 + (i * 25));
        }
        
        // Debug the scene's display list
        console.log('[RESPONSE DEBUG] Scene children count:', this.children.list.length);
        console.log('[RESPONSE DEBUG] Last 8 children in scene:', this.children.list.slice(-8).map(child => ({
            type: child.type,
            x: child.x,
            y: child.y,
            visible: child.visible,
            text: child.text || 'no text'
        })));
        
        this.updateResponseSelection();
    }
    
    updateResponseSelection() {
        try {
            // Only skip if scene is explicitly destroyed, not just inactive
            if (!this.scene || (this.scene.sys && this.scene.sys.isDestroyed)) {
                return;
            }
            
            console.log('[SELECTION DEBUG] TherapySession updateResponseSelection called, selectedResponse:', this.selectedResponse, 'responseButtons length:', this.responseButtons.length);
            
            // Check if response buttons are corrupted and need rebuilding
            let needsRebuild = false;
            if (this.responseButtons.length === 0) {
                needsRebuild = true;
                console.log('[CORRUPTION DEBUG] TherapySession response buttons missing, rebuilding...');
            } else {
                // Test if first button is corrupted
                try {
                    if (this.responseButtons[0] && this.responseButtons[0].setColor) {
                        this.responseButtons[0].setColor('#ecf0f1'); // Test call
                    }
                } catch (testError) {
                    if (testError.message.includes('data.cut')) {
                        needsRebuild = true;
                        console.log('[CORRUPTION DEBUG] TherapySession response buttons corrupted, rebuilding...');
                    }
                }
            }
            
            if (needsRebuild) {
                this.rebuildResponseButtons();
                return; // Exit early, let the delayed updateResponseSelection handle highlighting
            }
            
            // Normal highlighting if buttons are healthy
            this.responseButtons.forEach((button, index) => {
                if (button && button.setColor) {
                    const newColor = index === this.selectedResponse ? '#f39c12' : '#ecf0f1';
                    console.log(`[SELECTION DEBUG] TherapySession setting response button ${index} to color ${newColor}`);
                    button.setColor(newColor);
                }
            });
        } catch (error) {
            console.error('[TEXT DEBUG] Error in TherapySessionScene updateResponseSelection:', error.message);
            // Try to rebuild on any error
            this.rebuildResponseButtons();
        }
    }
    
    rebuildResponseButtons() {
        console.log('[REBUILD DEBUG] Rebuilding TherapySession response buttons...');
        
        // Clear corrupted buttons
        this.responseButtons.forEach(button => {
            if (button && button.destroy) {
                try { button.destroy(); } catch (e) {}
            }
        });
        this.responseButtons = [];
        
        // Recreate response buttons
        const responses = [
            "Tell me more about your transformation needs, Zara.",
            "Finn, how do you feel when Zara transforms?",
            "Let's explore communication strategies for this."
        ];

        responses.forEach((response, index) => {
            const button = this.add.text(400, 380 + (index * 25), `${index + 1}. ${response}`, {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            
            button.setBackgroundColor('#000000');
            button.setPadding(12, 8, 12, 8);

            button.setInteractive();
            button.on('pointerdown', () => this.handleResponse(index));
            this.responseButtons.push(button);
        });
        
        // Highlight after rebuild
        this.time.delayedCall(10, () => {
            this.updateResponseSelection();
        });
    }

    handleResponse(responseIndex) {
        this.awaitingInput = false;
        this.typewriterActive = true;
        this.interactionCount++;
        this.interactionText.setText(`Interactions: ${this.interactionCount}/${this.maxInteractions}`);

        // Clear existing response buttons immediately
        this.responseButtons.forEach(button => {
            if (button && button.destroy) {
                button.destroy();
            }
        });
        this.responseButtons = [];

        // Simple response system
        const responses = [
            "Zara: 'When I transform, I need at least 10 feet of space, but Finn always tries to help...'",
            "Finn: 'I just want to make sure she's safe. Dragons are powerful, even when they're careful.'",
            "Both: 'We've never really talked about boundaries during transformation...'"
        ];

        const fullText = responses[responseIndex];
        this.startTypewriterEffect(fullText, () => {
            // Callback when typewriter is complete
            console.log('[TYPEWRITER DEBUG] Typewriter effect completed');
            this.typewriterActive = false;
            
            if (this.interactionCount >= this.maxInteractions) {
                console.log('[TYPEWRITER DEBUG] Max interactions reached, transitioning to review scene');
                this.time.delayedCall(1000, () => {
                    console.log('[SCENE DEBUG] TherapySessionScene completing session, transitioning to review');
                    safeSceneTransition(this, 'SessionReviewScene');
                });
            } else {
                // Show new response options after a brief pause
                console.log('[TYPEWRITER DEBUG] Creating new response options after delay');
                this.time.delayedCall(800, () => {
                    console.log('[TYPEWRITER DEBUG] Delay complete, calling createResponseOptions');
                    this.createResponseOptions();
                });
            }
        });
    }
    
    startTypewriterEffect(fullText, onComplete) {
        console.log('[TYPEWRITER DEBUG] startTypewriterEffect called with text length:', fullText.length);
        console.log('[TYPEWRITER DEBUG] onComplete callback provided:', !!onComplete);
        
        // Clear any existing typewriter timer
        if (this.typewriterTimer) {
            this.typewriterTimer.destroy();
        }
        
        // Start with empty text
        this.dialogueText.setText('');
        console.log('[TYPEWRITER DEBUG] Cleared text, starting typewriter');
        
        let currentIndex = 0;
        const typeSpeed = 30; // milliseconds per character
        
        this.typewriterTimer = this.time.addEvent({
            delay: typeSpeed,
            callback: () => {
                console.log('[TYPEWRITER DEBUG] Timer callback, currentIndex:', currentIndex, 'of', fullText.length);
                if (currentIndex < fullText.length) {
                    // Add next character
                    const displayText = fullText.substring(0, currentIndex + 1);
                    this.dialogueText.setText(displayText);
                    currentIndex++;
                } else {
                    // Typewriter complete
                    console.log('[TYPEWRITER DEBUG] Typewriter timer completed, calling onComplete callback');
                    this.typewriterTimer.destroy();
                    this.typewriterTimer = null;
                    if (onComplete) {
                        console.log('[TYPEWRITER DEBUG] Executing onComplete callback');
                        onComplete();
                    } else {
                        console.log('[TYPEWRITER DEBUG] No onComplete callback provided');
                    }
                }
            },
            repeat: fullText.length // Need one extra callback to trigger completion
        });
        
        console.log('[TYPEWRITER DEBUG] Timer created with', fullText.length, 'repeats');
    }
    
    update() {
        if (!this.awaitingInput || this.typewriterActive) return;
        
        // Keyboard controls with faster response for dialogue
        if (this.cursors.up.justDown) {
            // Use shorter delay for dialogue navigation responsiveness
            const now = Date.now();
            if (now - globalInput.lastInputTime > 50) { // Much shorter delay for dialogue
                globalInput.lastInputTime = now;
                this.selectedResponse = Math.max(0, this.selectedResponse - 1);
                this.updateResponseSelection();
            }
        }
        
        if (this.cursors.down.justDown) {
            // Use shorter delay for dialogue navigation responsiveness
            const now = Date.now();
            if (now - globalInput.lastInputTime > 50) { // Much shorter delay for dialogue
                globalInput.lastInputTime = now;
                this.selectedResponse = Math.min(this.responseButtons.length - 1, this.selectedResponse + 1);
                this.updateResponseSelection();
            }
        }
        
        if (this.enterKey.justDown) {
            this.handleResponse(this.selectedResponse);
        }
        
        // Controller input
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad) {
                // D-pad up with faster response for dialogue navigation
                if (globalInput.wasButtonJustPressed(gamepad, 12) || // D-pad up
                    globalInput.wasNamedButtonJustPressed(gamepad, 'up') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'up')) {
                    // Use shorter delay for more responsive dialogue navigation
                    const now = Date.now();
                    if (now - globalInput.lastInputTime > 50) {
                        globalInput.lastInputTime = now;
                        console.log('[NAVIGATION DEBUG] TherapySession navigating up, from', this.selectedResponse, 'to', Math.max(0, this.selectedResponse - 1));
                        this.selectedResponse = Math.max(0, this.selectedResponse - 1);
                        this.updateResponseSelection();
                    }
                }
                
                // D-pad down with faster response for dialogue navigation
                if (globalInput.wasButtonJustPressed(gamepad, 13) || // D-pad down
                    globalInput.wasNamedButtonJustPressed(gamepad, 'down') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'down')) {
                    // Use shorter delay for more responsive dialogue navigation
                    const now = Date.now();
                    if (now - globalInput.lastInputTime > 50) {
                        globalInput.lastInputTime = now;
                        console.log('[NAVIGATION DEBUG] TherapySession navigating down, from', this.selectedResponse, 'to', Math.min(this.responseButtons.length - 1, this.selectedResponse + 1));
                        this.selectedResponse = Math.min(this.responseButtons.length - 1, this.selectedResponse + 1);
                        this.updateResponseSelection();
                    }
                }
                
                // A button to select response - reliable detection
                const aPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'A');
                if (aPressed) {
                    this.handleResponse(this.selectedResponse);
                }
            }
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
                console.log('[SCENE DEBUG] SessionReviewScene Return to Office clicked');
                safeSceneTransition(this, 'TherapyOfficeScene');
            }
        });
        
        // Set up keyboard controls
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    
    update() {
        // Keyboard controls
        if (this.enterKey.justDown || this.escKey.justDown) {
            if (globalInput.canAcceptInput()) {
                console.log('[SCENE DEBUG] SessionReviewScene keyboard input detected');
                safeSceneTransition(this, 'TherapyOfficeScene');
            }
        }
        
        // Controller input
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad) {
                // A button or B button to return - reliable detection
                const aPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'A');
                const bPressed = globalInput.wasButtonJustPressed(gamepad, 1) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'B');
                if (aPressed || bPressed) {
                    console.log('[SCENE DEBUG] SessionReviewScene controller input detected', {aPressed, bPressed});
                    safeSceneTransition(this, 'TherapyOfficeScene');
                }
            }
        }
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

// Proactive controller detection - start before game loads
function detectControllers() {
    if (navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                console.log('Controller detected early:', gamepads[i].id);
                return true;
            }
        }
    }
    return false;
}

// Start checking for controllers immediately
const controllerCheckInterval = setInterval(() => {
    if (detectControllers()) {
        console.log('Controller found, ready for game');
        clearInterval(controllerCheckInterval);
    }
}, 50); // Check every 50ms

// Clear interval after 5 seconds to avoid infinite checking
setTimeout(() => {
    clearInterval(controllerCheckInterval);
}, 5000);

// Start the game
console.log('Starting Phaser game with config:', config);
const game = new Phaser.Game(config);
console.log('Game created:', game);

// Force controller detection after game loads
game.events.once('ready', () => {
    console.log('Game ready, forcing controller detection...');
    
    // Force the game to check for gamepads repeatedly
    const forceDetection = setInterval(() => {
        if (game.input && game.input.gamepad) {
            // Force Phaser to refresh gamepad list
            game.input.gamepad.refreshPads();
            
            if (game.input.gamepad.total > 0) {
                console.log('Controller detected after game ready:', game.input.gamepad.total);
                clearInterval(forceDetection);
            }
        }
    }, 100);
    
    // Stop trying after 3 seconds
    setTimeout(() => clearInterval(forceDetection), 3000);
});