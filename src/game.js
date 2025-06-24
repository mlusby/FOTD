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

// Snippet-Based Conversation System Data Management
class ConversationSystem {
    constructor() {
        this.characters = new Map();
        this.relationships = new Map();
        this.snippets = new Map();
        this.playerCategorizations = new Map();
        this.sessionNotes = new Map();
        this.playerData = {
            insightfulnessScore: 0,
            currentSessionId: null
        };
        
        this.initializeGameData();
    }
    
    initializeGameData() {
        // Initialize Zara
        this.characters.set('zara', {
            id: 'zara',
            name: 'Zara',
            currentTier: 1,
            individualAttributes: {
                differentiation: 25,
                enmeshment: 40,
                anxietyManagement: 30,
                projection: 35,
                validationSeeking: 45,
                triangulation: 20,
                boundaryClarity: 15
            },
            tierThresholds: {
                tier2: { differentiation: 40, boundaryClarity: 30 },
                tier3: { differentiation: 60, anxietyManagement: 50, boundaryClarity: 45 }
            },
            doctorPatientRelationship: {
                trust: 50
            }
        });
        
        // Initialize Finn
        this.characters.set('finn', {
            id: 'finn',
            name: 'Finn',
            currentTier: 1,
            individualAttributes: {
                differentiation: 30,
                enmeshment: 35,
                anxietyManagement: 40,
                projection: 30,
                validationSeeking: 25,
                triangulation: 15,
                boundaryClarity: 20
            },
            tierThresholds: {
                tier2: { differentiation: 45, anxietyManagement: 55 },
                tier3: { differentiation: 65, anxietyManagement: 70, boundaryClarity: 40 }
            },
            doctorPatientRelationship: {
                trust: 45
            }
        });
        
        // Initialize relationship
        this.relationships.set('zara_finn', {
            partners: ['zara', 'finn'],
            attributes: {
                trust: 35,
                alliance: 25,
                insightAgreement: 20
            }
        });
        
        // Initialize sample snippets
        this.initializeSampleSnippets();
    }
    
    initializeSampleSnippets() {
        // Load snippets from external data file
        const snippetData = window.ZARA_FINN_SNIPPETS;
        
        if (!snippetData) {
            console.error('[SNIPPETS] ZARA_FINN_SNIPPETS not found on window object!');
            console.log('[SNIPPETS] Available on window:', Object.keys(window).filter(k => k.includes('ZARA')));
            console.log('[SNIPPETS] Falling back to inline snippets for testing');
            this.initializeFallbackSnippets();
            return;
        }
        
        console.log('[SNIPPETS] Loading snippets from external data:', Object.keys(snippetData));
        
        Object.entries(snippetData).forEach(([topicKey, topicData]) => {
            // Convert topic key to display name
            const topicName = topicKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            // Add Zara snippets for this topic
            topicData.zara.forEach(snippet => {
                this.snippets.set(snippet.id, {
                    id: snippet.id,
                    characterId: 'zara',
                    text: snippet.text,
                    characterTierRequirement: snippet.tier,
                    topic: topicName,
                    relationshipRequirements: {
                        trust: snippet.trustRequired
                    },
                    categories: snippet.categories
                });
            });
            
            // Add Finn snippets for this topic
            topicData.finn.forEach(snippet => {
                this.snippets.set(snippet.id, {
                    id: snippet.id,
                    characterId: 'finn',
                    text: snippet.text,
                    characterTierRequirement: snippet.tier,
                    topic: topicName,
                    relationshipRequirements: {
                        trust: snippet.trustRequired
                    },
                    categories: snippet.categories
                });
            });
            
            // Add "no more snippets" for this topic
            this.snippets.set(`zara_no_more_${topicKey}`, {
                id: `zara_no_more_${topicKey}`,
                characterId: 'zara',
                text: topicData.noMore.zara,
                characterTierRequirement: 1,
                topic: topicName,
                isNoMoreSnippet: true,
                relationshipRequirements: {},
                categories: []
            });
            
            this.snippets.set(`finn_no_more_${topicKey}`, {
                id: `finn_no_more_${topicKey}`,
                characterId: 'finn',
                text: topicData.noMore.finn,
                characterTierRequirement: 1,
                topic: topicName,
                isNoMoreSnippet: true,
                relationshipRequirements: {},
                categories: []
            });
        });
        
        console.log('[SNIPPETS] Loaded', this.snippets.size, 'total snippets from external data');
    }
    
    // Fallback method with inline snippets for testing
    initializeFallbackSnippets() {
        console.log('[SNIPPETS] Using fallback inline snippets');
        
        // Basic test snippets
        this.snippets.set('zara_001', {
            id: 'zara_001',
            characterId: 'zara',
            text: 'When I transform, I feel like I lose myself completely.',
            characterTierRequirement: 1,
            topic: 'Transformation Safety',
            relationshipRequirements: { trust: 10 },
            categories: [
                { category: 'Differentiation', polarity: 'negative', score: 3 },
                { category: 'Anxiety Management', polarity: 'negative', score: 2 }
            ]
        });
        
        this.snippets.set('finn_001', {
            id: 'finn_001',
            characterId: 'finn',
            text: 'I just want to make sure she\'s safe when she transforms.',
            characterTierRequirement: 1,
            topic: 'Transformation Safety',
            relationshipRequirements: { trust: 10 },
            categories: [
                { category: 'Anxiety Management', polarity: 'negative', score: 2 },
                { category: 'Boundary Clarity', polarity: 'negative', score: 1 }
            ]
        });
        
        // No more snippets
        this.snippets.set('zara_no_more_transformation_safety', {
            id: 'zara_no_more_transformation_safety',
            characterId: 'zara',
            text: 'I think we\'ve covered my transformation concerns for now.',
            characterTierRequirement: 1,
            topic: 'Transformation Safety',
            isNoMoreSnippet: true,
            relationshipRequirements: {},
            categories: []
        });
        
        this.snippets.set('finn_no_more_transformation_safety', {
            id: 'finn_no_more_transformation_safety',
            characterId: 'finn',
            text: 'I don\'t have more to say about transformation safety right now.',
            characterTierRequirement: 1,
            topic: 'Transformation Safety',
            isNoMoreSnippet: true,
            relationshipRequirements: {},
            categories: []
        });
        
        console.log('[SNIPPETS] Loaded', this.snippets.size, 'fallback snippets');
    }
    
    // Get available topics for current relationship
    getAvailableTopics() {
        const topics = new Set();
        this.snippets.forEach(snippet => {
            if (!snippet.isNoMoreSnippet) {
                topics.add(snippet.topic);
            }
        });
        return Array.from(topics).sort();
    }
    
    // Get available snippets for a character based on current state
    getAvailableSnippets(characterId) {
        const character = this.characters.get(characterId);
        const relationship = this.relationships.get('zara_finn');
        
        if (!character || !relationship) return [];
        
        return Array.from(this.snippets.values())
            .filter(snippet => {
                if (snippet.characterId !== characterId) return false;
                if (snippet.characterTierRequirement > character.currentTier) return false;
                
                // Check relationship requirements
                for (const [attr, required] of Object.entries(snippet.relationshipRequirements || {})) {
                    if (relationship.attributes[attr] < required) return false;
                }
                
                return true;
            });
    }
    
    // Add snippet to current session notes
    addSnippetToSession(snippetId) {
        if (!this.playerData.currentSessionId) {
            this.playerData.currentSessionId = `session_${Date.now()}`;
            this.sessionNotes.set(this.playerData.currentSessionId, { snippets: [] });
        }
        
        const snippet = this.snippets.get(snippetId);
        if (snippet) {
            const sessionData = this.sessionNotes.get(this.playerData.currentSessionId);
            sessionData.snippets.push({
                id: snippetId,
                characterId: snippet.characterId,
                text: snippet.text,
                timestamp: new Date().toISOString(),
                playerCategorization: null
            });
        }
    }
    
    // Categorize a snippet
    categorizeSnippet(snippetId, category, polarity) {
        let categorization = this.playerCategorizations.get(snippetId);
        if (!categorization) {
            categorization = { snippetId, categories: [] };
            this.playerCategorizations.set(snippetId, categorization);
        }
        
        // Check if this category already exists
        const existingIndex = categorization.categories.findIndex(c => c.category === category);
        if (existingIndex >= 0) {
            // Update existing
            categorization.categories[existingIndex].polarity = polarity;
        } else {
            // Add new
            categorization.categories.push({
                category,
                polarity,
                proposed: false,
                successful: null
            });
        }
    }
    
    // Propose insight using categorized snippet
    proposeInsight(snippetId, category, polarity) {
        const snippet = this.snippets.get(snippetId);
        const categorization = this.playerCategorizations.get(snippetId);
        
        if (!snippet || !categorization) return { success: false, reason: 'Missing data' };
        
        const playerCategory = categorization.categories.find(c => c.category === category);
        if (!playerCategory) return { success: false, reason: 'Category not assigned' };
        
        // Check if already successfully proposed
        if (playerCategory.successful === true) {
            return { success: false, reason: 'Already successfully used' };
        }
        
        // Mark as proposed
        playerCategory.proposed = true;
        
        // Check if correct
        const correctCategory = snippet.categories.find(c => c.category === category && c.polarity === polarity);
        if (correctCategory) {
            playerCategory.successful = true;
            this.applyAttributeChange(snippet.characterId, category, correctCategory.score);
            return { success: true, score: correctCategory.score };
        } else {
            playerCategory.successful = false;
            return { success: false, reason: 'Incorrect categorization' };
        }
    }
    
    // Apply attribute changes and check for tier progression
    applyAttributeChange(characterId, attribute, score) {
        const character = this.characters.get(characterId);
        if (!character) return;
        
        // Convert category name to attribute name (lowercase)
        const attributeName = attribute.toLowerCase().replace(/\s+/g, '');
        
        if (character.individualAttributes.hasOwnProperty(attributeName)) {
            character.individualAttributes[attributeName] += score;
            console.log(`[ATTRIBUTE] ${character.name} ${attributeName} increased by ${score} to ${character.individualAttributes[attributeName]}`);
            
            // Check for tier progression
            this.checkTierProgression(characterId);
        }
    }
    
    // Check if character should advance to next tier
    checkTierProgression(characterId) {
        const character = this.characters.get(characterId);
        if (!character) return;
        
        const nextTier = character.currentTier + 1;
        const thresholds = character.tierThresholds[`tier${nextTier}`];
        
        if (thresholds) {
            const meetsRequirements = Object.entries(thresholds).every(([attr, required]) => {
                return character.individualAttributes[attr] >= required;
            });
            
            if (meetsRequirements && character.currentTier < nextTier) {
                character.currentTier = nextTier;
                console.log(`[TIER PROGRESSION] ${character.name} advanced to tier ${nextTier}`);
            }
        }
    }
    
    // Get available snippets for a character and topic, excluding already used ones
    getAvailableSnippetsByTopic(characterId, topicName) {
        const character = this.characters.get(characterId);
        const relationship = this.relationships.get('zara_finn');
        const currentSession = this.sessionNotes.get(this.playerData.currentSessionId);
        
        if (!character || !relationship) return [];
        
        // Get IDs of snippets already used in this session
        const usedSnippetIds = new Set();
        if (currentSession) {
            currentSession.snippets.forEach(s => usedSnippetIds.add(s.id));
        }
        
        return Array.from(this.snippets.values())
            .filter(snippet => {
                if (snippet.characterId !== characterId) return false;
                if (snippet.topic !== topicName) return false;
                if (snippet.isNoMoreSnippet) return false; // Exclude "no more" snippets from normal selection
                if (usedSnippetIds.has(snippet.id)) return false; // Exclude already used snippets
                if (snippet.characterTierRequirement > character.currentTier) return false;
                
                // Check relationship requirements
                for (const [attr, required] of Object.entries(snippet.relationshipRequirements || {})) {
                    if (relationship.attributes[attr] < required) return false;
                }
                
                return true;
            });
    }
    
    // Get "no more snippets available" snippet for a character and topic
    getNoMoreSnippetsSnippet(characterId, topicName) {
        const character = this.characters.get(characterId);
        const relationship = this.relationships.get('zara_finn');
        
        if (!character || !relationship) return null;
        
        const noMoreSnippet = Array.from(this.snippets.values())
            .find(snippet => {
                return snippet.characterId === characterId &&
                       snippet.topic === topicName &&
                       snippet.isNoMoreSnippet === true &&
                       snippet.characterTierRequirement <= character.currentTier;
            });
        
        return noMoreSnippet || null;
    }
    
    // Get current session snippets for notes review
    getCurrentSessionSnippets() {
        const currentSession = this.sessionNotes.get(this.playerData.currentSessionId);
        return currentSession ? currentSession.snippets : [];
    }
}

// Global conversation system instance
const conversationSystem = new ConversationSystem();

// Scene transition helper with debugging and Phaser-specific fixes
function safeSceneTransition(scene, targetSceneName, method = 'start') {
    try {
        
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
            scene.scene.start(targetSceneName);
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
    
    // Improved thumbstick detection with lower threshold and better responsiveness
    wasThumbstickJustMoved(gamepad, stickName, direction, threshold = 0.3) {
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
    
    // Additional method for immediate thumbstick response (bypasses "just moved" requirement)
    isThumbstickActive(gamepad, stickName, direction, threshold = 0.3) {
        if (!gamepad || !gamepad[stickName]) {
            return false;
        }
        
        const stick = gamepad[stickName];
        const now = Date.now();
        
        // Check if enough time has passed since last input to allow new input
        if (now - this.lastInputTime < this.inputDelay) {
            return false;
        }
        
        if (direction === 'up') {
            return stick.y < -threshold;
        } else if (direction === 'down') {
            return stick.y > threshold;
        } else if (direction === 'left') {
            return stick.x < -threshold;
        } else if (direction === 'right') {
            return stick.x > threshold;
        }
        
        return false;
    }
    
    // Clear input states to prevent issues between scenes
    clearInputStates() {
        this.buttonStates = {};
        this.lastInputTime = Date.now() + 300; // Add 300ms delay after scene transitions
    }
}

const globalInput = new InputManager();

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.selectedOption = 0;
        this.menuOptions = ['Start Game', 'Dummy Option 1', 'Dummy Option 2'];
        this.menuButtons = [];
        this.pipeIndicator = null;
    }

    preload() {
        this.load.image('fotd-background', 'assets/images/FOTDbackground.png');
        this.load.image('pipe-icon', 'assets/images/pipeicon.png');
        console.log('MainMenuScene preload complete');
    }

    create() {
        console.log('MainMenuScene create started');
        
        // Add background image
        this.add.image(400, 300, 'fotd-background').setDisplaySize(800, 600);

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

        // Create pipe indicator (simple graphics version of Freud's pipe)
        this.createPipeIndicator();

        // Reset selection to ensure it's properly initialized
        this.selectedOption = 0;
        
        // Highlight first option with delayed call to ensure text objects are ready
        this.time.delayedCall(10, () => {
            this.updateSelection();
        });

        // Button indicators in lower right corner
        this.add.circle(720, 550, 15, 0x4CAF50);
        this.add.text(720, 550, 'A', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(720, 575, 'Select', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
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

    createPipeIndicator() {
        // Create pipe indicator using the image
        this.pipeIndicator = this.add.image(0, 0, 'pipe-icon');
        this.pipeIndicator.setDepth(100); // Ensure it appears above other elements
        // Scale to match text height - MainMenu uses 32px font, so scale accordingly
        this.pipeIndicator.setScale(0.08); // Much smaller to match text height
        
        // Initially hide the pipe
        this.pipeIndicator.setVisible(false);
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
            
            // Position pipe indicator next to selected option
            if (this.pipeIndicator && this.menuButtons[this.selectedOption]) {
                const selectedButton = this.menuButtons[this.selectedOption];
                this.pipeIndicator.setVisible(true);
                // Calculate left edge of text and position pipe 30 pixels before it
                const textLeftEdge = selectedButton.x - (selectedButton.width / 2);
                this.pipeIndicator.setPosition(
                    textLeftEdge - 30, // Fixed 30px gap from text start
                    selectedButton.y
                );
            }
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
        
        // Recreate pipe indicator after rebuild
        if (this.pipeIndicator) {
            this.pipeIndicator.destroy();
        }
        this.createPipeIndicator();
        
        // Highlight after rebuild
        this.time.delayedCall(10, () => {
            this.updateSelection();
        });
    }

    selectOption(index) {
        if (!globalInput.canAcceptInput()) return;
        
        console.log('Selected option:', index, this.menuOptions[index]);
        
        if (index === 0) {
            this.scene.start('LobbyScene');
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
                // Check D-pad up (with improved thumbstick responsiveness)
                if (globalInput.wasButtonJustPressed(gamepad, 12) || // D-pad up
                    globalInput.wasNamedButtonJustPressed(gamepad, 'up') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'up') ||
                    globalInput.isThumbstickActive(gamepad, 'leftStick', 'up')) {
                    if (globalInput.canAcceptInput()) {
                        globalInput.lastInputTime = Date.now();
                        console.log('[NAVIGATION DEBUG] MainMenu navigating up, from', this.selectedOption, 'to', Math.max(0, this.selectedOption - 1));
                        this.selectedOption = Math.max(0, this.selectedOption - 1);
                        this.updateSelection();
                    }
                }
                
                // Check D-pad down (with improved thumbstick responsiveness)
                if (globalInput.wasButtonJustPressed(gamepad, 13) || // D-pad down
                    globalInput.wasNamedButtonJustPressed(gamepad, 'down') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'down') ||
                    globalInput.isThumbstickActive(gamepad, 'leftStick', 'down')) {
                    if (globalInput.canAcceptInput()) {
                        globalInput.lastInputTime = Date.now();
                        console.log('[NAVIGATION DEBUG] MainMenu navigating down, from', this.selectedOption, 'to', Math.min(this.menuOptions.length - 1, this.selectedOption + 1));
                        this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                        this.updateSelection();
                    }
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

class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
        this.player = null;
        this.cursors = null;
        this.walkingRight = false; // Track walking direction
    }

    preload() {
        this.load.image('lobby-background', 'assets/images/LobbyBackground.png');
        
        // Load individual walking frames with cross-origin policy for transparency
        this.load.image('player-walk-left-1', 'assets/images/PlayerWalkLeft1.png');
        this.load.image('player-walk-left-2', 'assets/images/PlayerWalkLeft2.png');
        this.load.image('player-walk-left-3', 'assets/images/PlayerWalkLeft3.png');
        this.load.image('player-walk-left-4', 'assets/images/PlayerWalkLeft4.png');
        
        this.load.image('player-walk-right-1', 'assets/images/PlayerWalkRight1.png');
        this.load.image('player-walk-right-2', 'assets/images/PlayerWalkRight2.png');
        this.load.image('player-walk-right-3', 'assets/images/PlayerWalkRight3.png');
        this.load.image('player-walk-right-4', 'assets/images/PlayerWalkRight4.png');
        
        this.load.image('player-idle', 'assets/images/PlayerIdle.png');
        
        // Debug transparency issues
        this.load.on('filecomplete-image-player-walk-right-2', () => {
            console.log('[DEBUG] PlayerWalkRight2.png loaded successfully');
        });
    }

    create() {
        // Lobby background
        this.add.image(400, 300, 'lobby-background').setDisplaySize(800, 600);
        
        // Title
        this.add.text(400, 50, 'Office Building Lobby', {
            fontSize: '24px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Determine starting position based on how we entered this scene
        const fromOffice = this.scene.settings.data && this.scene.settings.data.fromOffice;
        const startX = fromOffice ? 600 : 100; // Start safely outside office trigger (x=650) when coming from office, otherwise at left side
        
        // Create player character
        this.player = this.add.image(startX, 400, 'player-idle');
        this.player.setDisplaySize(200, 200);
        
        // Force premultiplied alpha off to handle transparency properly
        if (this.player.texture && this.player.texture.source) {
            this.player.texture.source[0].premultipliedAlpha = false;
        }

        // Animation variables for individual frame cycling
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 8; // frames per second
        this.walkingFrames = ['player-walk-left-1', 'player-walk-left-2', 'player-walk-left-3', 'player-walk-left-4'];
        this.rightWalkingFrames = ['player-walk-right-1', 'player-walk-right-2', 'player-walk-right-3', 'player-walk-right-4'];

        // Create office door trigger area on the right side
        this.officeDoor = this.add.rectangle(700, 400, 50, 100, 0x8b4513, 0.3); // Brown transparent door

        // Create contextual button indicators (initially hidden)
        this.aButton = this.add.circle(720, 550, 15, 0x4CAF50);
        this.aButtonText = this.add.text(720, 550, 'A', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.aActionText = this.add.text(720, 575, 'Enter', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Hide A button initially
        this.aButton.setVisible(false);
        this.aButtonText.setVisible(false);
        this.aActionText.setVisible(false);

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
    }

    update() {
        let isMoving = false;
        let velocityX = 0;

        // Keyboard controls
        if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
            velocityX = -150;
            isMoving = true;
            this.walkingRight = false;
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            velocityX = 150;
            isMoving = true;
            this.walkingRight = true;
        }

        // Controller input
        if (this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad) {
                // Left stick or D-pad horizontal movement
                const leftStickX = gamepad.leftStick ? gamepad.leftStick.x : 0;
                const dpadLeft = gamepad.buttons[14] ? gamepad.buttons[14].pressed : false;
                const dpadRight = gamepad.buttons[15] ? gamepad.buttons[15].pressed : false;

                if (Math.abs(leftStickX) > 0.3 || dpadLeft || dpadRight) {
                    if (leftStickX < -0.3 || dpadLeft) {
                        velocityX = -150;
                        isMoving = true;
                        this.walkingRight = false;
                    } else if (leftStickX > 0.3 || dpadRight) {
                        velocityX = 150;
                        isMoving = true;
                        this.walkingRight = true;
                    }
                }
            }
        }

        // Apply movement and keep player within bounds
        if (velocityX !== 0) {
            this.player.x += velocityX * (1/60); // Assuming 60 FPS
            this.player.x = Phaser.Math.Clamp(this.player.x, 50, 750);
        }

        // Handle animations with individual frames
        if (isMoving) {
            // Update animation timer
            this.animationTimer += 1 / 60; // Assuming 60 FPS
            
            if (this.animationTimer >= 1 / this.animationSpeed) {
                this.animationTimer = 0;
                this.animationFrame = (this.animationFrame + 1) % 4; // Cycle through 4 frames
            }
            
            // Set appropriate walking frame based on direction
            if (this.walkingRight) {
                this.player.setTexture(this.rightWalkingFrames[this.animationFrame]);
            } else {
                this.player.setTexture(this.walkingFrames[this.animationFrame]);
            }
            
            // Force transparency handling on texture change
            if (this.player.texture && this.player.texture.source) {
                this.player.texture.source[0].premultipliedAlpha = false;
            }
        } else {
            // Return to idle when not moving
            this.player.setTexture('player-idle');
            this.animationFrame = 0;
            this.animationTimer = 0;
        }

        // Check if player is near the office door (within trigger distance)
        const nearOffice = this.player.x >= 700; // Near the office area
        
        // Show/hide A button based on proximity
        this.aButton.setVisible(nearOffice);
        this.aButtonText.setVisible(nearOffice);
        this.aActionText.setVisible(nearOffice);
        
        // Handle A button press for office entry
        if (nearOffice && this.input.gamepad.total) {
            const gamepad = this.input.gamepad.getPad(0);
            if (gamepad) {
                const aPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'A');
                if (aPressed && globalInput.canAcceptInput()) {
                    console.log('[LOBBY DEBUG] A button pressed near office, transitioning');
                    safeSceneTransition(this, 'TherapyOfficeScene');
                }
            }
        }
    }
}

class TherapyOfficeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TherapyOfficeScene' });
        this.selectedOption = 0;
        this.menuOptions = ['Patient Files', 'Start Session'];
        this.menuButtons = [];
        this.pipeIndicator = null;
    }

    preload() {
        this.load.image('pipe-icon', 'assets/images/pipeicon.png');
        this.load.image('therapist-office', 'assets/images/TherapistOffice.png');
    }

    create() {
        // Office background image
        this.add.image(400, 300, 'therapist-office').setDisplaySize(800, 600);
        
        // Office title
        this.add.text(400, 50, 'Dr. Freud\'s Office', {
            fontSize: '32px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Clear any existing menu buttons to prevent corruption
        this.menuButtons = [];

        // Patient Files label positioned above folders on the left
        const folderButton = this.add.text(200, 250, 'Patient Files', {
            fontSize: '24px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            wordWrap: { width: 0 }  // Disable word wrapping
        }).setOrigin(0.5);

        folderButton.setInteractive();
        folderButton.on('pointerdown', () => this.selectOption(0));
        this.menuButtons.push(folderButton);

        // Start Session label positioned above clipboard on the right
        const sessionButton = this.add.text(600, 250, 'Start Session', {
            fontSize: '24px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            wordWrap: { width: 0 }  // Disable word wrapping
        }).setOrigin(0.5);

        sessionButton.setInteractive();
        sessionButton.on('pointerdown', () => this.selectOption(1));
        this.menuButtons.push(sessionButton);

        // Create pipe indicator
        this.createPipeIndicator();

        // Reset selection to ensure it's properly initialized
        this.selectedOption = 0;
        
        // Highlight first option with delayed call
        this.time.delayedCall(10, () => {
            this.updateSelection();
        });

        // Button indicators in lower right corner
        this.add.circle(700, 550, 15, 0x4CAF50);
        this.add.text(700, 550, 'A', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(700, 575, 'Select', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.circle(750, 550, 15, 0xf44336);
        this.add.text(750, 550, 'B', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(750, 575, 'Back', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    createPipeIndicator() {
        // Create pipe indicator using the image
        this.pipeIndicator = this.add.image(0, 0, 'pipe-icon');
        this.pipeIndicator.setDepth(100); // Ensure it appears above other elements
        // Scale to match text height - TherapyOffice uses 24px font, so scale accordingly
        this.pipeIndicator.setScale(0.06); // Smaller to match 24px text height
        
        // Initially hide the pipe
        this.pipeIndicator.setVisible(false);
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
            
            // Position pipe indicator at fixed distance from text start
            if (this.pipeIndicator && this.menuButtons[this.selectedOption]) {
                const selectedButton = this.menuButtons[this.selectedOption];
                this.pipeIndicator.setVisible(true);
                // Calculate left edge of text and position pipe 30 pixels before it
                const textLeftEdge = selectedButton.x - (selectedButton.width / 2);
                this.pipeIndicator.setPosition(
                    textLeftEdge - 30, // Fixed 30px gap from text start
                    selectedButton.y
                );
            }
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
        
        // Recreate pipe indicator after rebuild
        if (this.pipeIndicator) {
            this.pipeIndicator.destroy();
        }
        this.createPipeIndicator();
        
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
        this.scene.start('LobbyScene', { fromOffice: true });
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
                // Navigation - left/up (with improved thumbstick responsiveness)
                if (globalInput.wasButtonJustPressed(gamepad, 14) || // D-pad left
                    globalInput.wasButtonJustPressed(gamepad, 12) || // D-pad up
                    globalInput.wasNamedButtonJustPressed(gamepad, 'left') ||
                    globalInput.wasNamedButtonJustPressed(gamepad, 'up') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'left') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'up') ||
                    globalInput.isThumbstickActive(gamepad, 'leftStick', 'left') ||
                    globalInput.isThumbstickActive(gamepad, 'leftStick', 'up')) {
                    if (globalInput.canAcceptInput()) {
                        globalInput.lastInputTime = Date.now();
                        console.log('[NAVIGATION DEBUG] TherapyOffice navigating left/up, from', this.selectedOption, 'to', Math.max(0, this.selectedOption - 1));
                        this.selectedOption = Math.max(0, this.selectedOption - 1);
                        this.updateSelection();
                    }
                }
                
                // Navigation - right/down (with improved thumbstick responsiveness)
                if (globalInput.wasButtonJustPressed(gamepad, 15) || // D-pad right
                    globalInput.wasButtonJustPressed(gamepad, 13) || // D-pad down
                    globalInput.wasNamedButtonJustPressed(gamepad, 'right') ||
                    globalInput.wasNamedButtonJustPressed(gamepad, 'down') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'right') ||
                    globalInput.wasThumbstickJustMoved(gamepad, 'leftStick', 'down') ||
                    globalInput.isThumbstickActive(gamepad, 'leftStick', 'right') ||
                    globalInput.isThumbstickActive(gamepad, 'leftStick', 'down')) {
                    if (globalInput.canAcceptInput()) {
                        globalInput.lastInputTime = Date.now();
                        console.log('[NAVIGATION DEBUG] TherapyOffice navigating right/down, from', this.selectedOption, 'to', Math.min(this.menuOptions.length - 1, this.selectedOption + 1));
                        this.selectedOption = Math.min(this.menuOptions.length - 1, this.selectedOption + 1);
                        this.updateSelection();
                    }
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

        // Button indicators in lower right corner
        this.add.circle(750, 550, 15, 0xf44336);
        this.add.text(750, 550, 'B', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(750, 575, 'Back', {
            fontSize: '12px',
            fill: '#ffffff',
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
        this.currentFullText = null;
        this.currentOnComplete = null;
        this.currentOnSkip = null;
        
        // Snippet system properties
        this.currentSnippets = [];
        this.notesOpen = false;
        this.currentSpeaker = 'zara'; // Start with Zara
    }

    preload() {
        this.load.image('couch-background', 'assets/images/CouchBackground.png');
        this.load.image('finn-sitting', 'assets/images/FinnSitting.png');
        this.load.image('zara-sitting', 'assets/images/ZaraSitting.png');
        this.load.image('finn-talking', 'assets/images/FinnTalking.png');
        this.load.image('zara-talking', 'assets/images/ZaraTalking.png');
    }

    create() {
        try {
            // Session room background - couch therapy setting
            this.add.image(400, 300, 'couch-background').setDisplaySize(800, 600);
        
        // Title
        this.add.text(400, 50, 'Therapy Session - Zara & Finn', {
            fontSize: '24px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Character sprites positioned farther apart on the couch (reduced to 80% of 3x size)
        this.zaraSprite = this.add.image(200, 350, 'zara-sitting').setDisplaySize(288, 360); // Zara on far left
        this.finnSprite = this.add.image(600, 350, 'finn-sitting').setDisplaySize(288, 360); // Finn on far right

        // Interaction counter
        this.interactionText = this.add.text(700, 100, `Interactions: ${this.interactionCount}/${this.maxInteractions}`, {
            fontSize: '16px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Initialize dialogue bubble properties (will be created dynamically)
        this.currentDialogueBubble = null;
        this.currentDialogueText = null;

        // Initialize flags properly before starting snippet system
        this.awaitingInput = false;
        this.typewriterActive = false;
        console.log('[SCENE DEBUG] TherapySession create() - initialized flags');
        
        // Start session with interaction options after a small delay to ensure scene is ready
        this.time.delayedCall(100, () => {
            console.log('[SCENE DEBUG] Starting snippet-based session');
            this.createInteractionOptions();
        });
        
        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
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

    showTopicSelection() {
        console.log('[TOPIC DEBUG] Showing topic selection for', this.currentSpeaker);
        
        // Clear previous response buttons and background
        this.responseButtons.forEach(button => button.destroy());
        if (this.optionsBackground) this.optionsBackground.destroy();
        this.responseButtons = [];
        
        // Get available topics from conversation system
        const topics = conversationSystem.getAvailableTopics();

        // Create darker transparent background for better contrast
        const backgroundHeight = Math.max(120, topics.length * 40 + 20);
        this.optionsBackground = this.add.rectangle(400, 480, 600, backgroundHeight, 0x000000, 0.7);

        topics.forEach((topic, index) => {
            const yPos = 450 + (index * 35);
            
            const button = this.add.text(400, yPos, `${index + 1}. ${topic}`, {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => {
                this.selectTopic(index, topic);
            });
            
            this.responseButtons.push(button);
        });
        
        this.selectedResponse = 0;
        this.awaitingInput = true;
        this.updateInteractionSelection();
    }
    
    selectTopic(topicIndex, topicName) {
        console.log('[TOPIC DEBUG] Selected topic:', topicName, 'for speaker:', this.currentSpeaker);
        
        this.awaitingInput = false;
        
        // Clear topic buttons
        this.responseButtons.forEach(button => button.destroy());
        this.responseButtons = [];
        
        // Get available snippets for current speaker and topic
        const availableSnippets = conversationSystem.getAvailableSnippetsByTopic(this.currentSpeaker, topicName);
        console.log('[SNIPPET DEBUG] Available snippets for topic', topicName, ':', availableSnippets.length);
        
        let snippet;
        if (availableSnippets.length === 0) {
            // Get "no more snippets" snippet
            snippet = conversationSystem.getNoMoreSnippetsSnippet(this.currentSpeaker, topicName);
        } else {
            // Select random snippet from available ones
            snippet = availableSnippets[Math.floor(Math.random() * availableSnippets.length)];
        }
        
        if (!snippet) {
            console.log('[SNIPPET DEBUG] No snippet available, showing interaction options');
            this.createInteractionOptions();
            return;
        }
        
        console.log('[SNIPPET DEBUG] Selected snippet:', snippet.id, snippet.text);
        
        // Add to session notes
        conversationSystem.addSnippetToSession(snippet.id);
        
        // Display snippet with typewriter effect
        const speakerName = this.currentSpeaker === 'zara' ? 'Zara' : 'Finn';
        const fullText = `${speakerName}: "${snippet.text}"`;
        
        const normalCallback = () => {
            console.log('[SNIPPET DEBUG] Normal completion - showing interaction options');
            this.time.delayedCall(400, () => {
                this.createInteractionOptions();
            });
        };
        
        const skipCallback = () => {
            console.log('[SNIPPET DEBUG] Skip completion - showing interaction options immediately');
            this.createInteractionOptions();
        };
        
        this.startTypewriterEffect(fullText, normalCallback, skipCallback);
    }
    
    createInteractionOptions() {
        // Clear previous response buttons and background
        this.responseButtons.forEach(button => button.destroy());
        if (this.optionsBackground) this.optionsBackground.destroy();
        this.responseButtons = [];
        
        const options = [
            "Gather More Information",
            "Review Notes", 
            "Propose Insight"
        ];

        // Create darker transparent background for better contrast
        this.optionsBackground = this.add.rectangle(400, 480, 600, 120, 0x000000, 0.7);

        options.forEach((option, index) => {
            const yPos = 450 + (index * 35);
            
            const button = this.add.text(400, yPos, `${index + 1}. ${option}`, {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => {
                this.handleInteraction(index);
            });
            
            this.responseButtons.push(button);
        });
        
        this.selectedResponse = 0;
        this.awaitingInput = true;
        this.updateInteractionSelection();
    }
    
    handleInteraction(optionIndex) {
        console.log('[INTERACTION DEBUG] Selected option:', optionIndex);
        
        this.awaitingInput = false;

        // Clear response buttons
        this.responseButtons.forEach(button => button.destroy());
        this.responseButtons = [];

        switch(optionIndex) {
            case 0: // Gather More Information - counts as interaction
                this.interactionCount++;
                this.interactionText.setText(`Interactions: ${this.interactionCount}/${this.maxInteractions}`);
                this.gatherMoreInformation();
                break;
            case 1: // Review Notes - does NOT count as interaction
                this.openNotesInterface();
                break;
            case 2: // Propose Insight - counts as interaction
                this.interactionCount++;
                this.interactionText.setText(`Interactions: ${this.interactionCount}/${this.maxInteractions}`);
                this.openInsightInterface();
                break;
        }
    }
    
    gatherMoreInformation() {
        if (this.interactionCount >= this.maxInteractions) {
            console.log('[SESSION DEBUG] Session complete, transitioning to review');
            this.time.delayedCall(1000, () => {
                safeSceneTransition(this, 'SessionReviewScene');
            });
            return;
        }
        
        // Switch to other speaker
        this.currentSpeaker = this.currentSpeaker === 'zara' ? 'finn' : 'zara';
        console.log('[SESSION DEBUG] Switched speaker to:', this.currentSpeaker);
        
        // Show topic selection for new speaker
        this.time.delayedCall(500, () => {
            this.showTopicSelection();
        });
    }
    
    switchSpeakerOrEnd() {
        if (this.interactionCount >= this.maxInteractions) {
            console.log('[SESSION DEBUG] Session complete, transitioning to review');
            this.time.delayedCall(1000, () => {
                safeSceneTransition(this, 'SessionReviewScene');
            });
            return;
        }
        
        // Switch to other speaker
        this.currentSpeaker = this.currentSpeaker === 'zara' ? 'finn' : 'zara';
        console.log('[SESSION DEBUG] Switched speaker to:', this.currentSpeaker);
        
        // Deliver next snippet
        this.time.delayedCall(500, () => {
            this.deliverNextSnippet();
        });
    }
    
    openNotesInterface() {
        console.log('[NOTES DEBUG] Opening notes interface');
        
        // Create notes overlay with error handling
        this.notesOverlay = this.add.rectangle(400, 300, 750, 500, 0x2c3e50, 0.95);
        try {
            this.notesOverlay.setStrokeStyle(2, 0xecf0f1);
        } catch (error) {
            console.warn('[NOTES DEBUG] setStrokeStyle failed, using alternative border approach:', error);
            // Alternative: create a border rectangle
            this.notesBorder = this.add.rectangle(400, 300, 754, 504, 0xecf0f1);
            this.notesBorder.setDepth(this.notesOverlay.depth - 1);
        }
        
        // Notes title
        this.notesTitle = this.add.text(400, 80, 'Session Notes', {
            fontSize: '24px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Get current session snippets
        const sessionSnippets = conversationSystem.getCurrentSessionSnippets();
        console.log('[NOTES DEBUG] Displaying', sessionSnippets.length, 'snippets');
        
        // Display snippets
        const notesContent = sessionSnippets.map((snippet, index) => {
            const speakerName = snippet.characterId === 'zara' ? 'Zara' : 'Finn';
            return `${index + 1}. ${speakerName}: "${snippet.text}"`;
        }).join('\n\n');
        
        this.notesText = this.add.text(50, 120, notesContent || 'No snippets recorded yet.', {
            fontSize: '14px',
            fill: '#bdc3c7',
            fontFamily: 'Arial',
            wordWrap: { width: 700 }
        });
        
        // Close button
        this.closeNotesButton = this.add.text(400, 520, 'Close Notes', {
            fontSize: '16px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Button indicators in lower right corner - only show B since both A and B close
        this.add.circle(750, 550, 15, 0xf44336);
        this.add.text(750, 550, 'B', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(750, 575, 'Close', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Set flag to indicate notes are open
        this.notesOpen = true;
        this.awaitingInput = false;
    }
    
    closeNotesInterface() {
        console.log('[NOTES DEBUG] Closing notes interface');
        
        // Remove notes UI elements
        if (this.notesOverlay) this.notesOverlay.destroy();
        if (this.notesBorder) this.notesBorder.destroy();
        if (this.notesTitle) this.notesTitle.destroy();
        if (this.notesText) this.notesText.destroy();
        if (this.closeNotesButton) this.closeNotesButton.destroy();
        
        // Reset flags
        this.notesOpen = false;
        
        // Return to interaction options
        this.createInteractionOptions();
    }
    
    openInsightInterface() {
        console.log('[INSIGHT DEBUG] Opening insight interface (placeholder)');
        // For now, just continue with next snippet
        this.time.delayedCall(1000, () => {
            this.createInteractionOptions();
        });
    }

    updateInteractionSelection() {
        // Highlight selected interaction option
        this.responseButtons.forEach((button, index) => {
            if (button && button.setColor) {
                const newColor = index === this.selectedResponse ? '#f39c12' : '#ecf0f1';
                button.setColor(newColor);
            }
        });
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
                // OLD METHOD REMOVED - rebuildResponseButtons no longer exists
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
            // OLD METHOD REMOVED - rebuildResponseButtons no longer exists
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
            this.updateInteractionSelection();
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
        
        // Normal completion callback (with delay)
        const normalComplete = () => {
            this.typewriterActive = false;
            
            if (this.interactionCount >= this.maxInteractions) {
                this.time.delayedCall(1000, () => {
                    safeSceneTransition(this, 'SessionReviewScene');
                });
            } else {
                // Show new interaction options after a brief pause
                this.time.delayedCall(800, () => {
                    this.createInteractionOptions();
                });
            }
        };
        
        // Skip completion callback (immediate)
        const skipComplete = () => {
            this.typewriterActive = false;
            
            if (this.interactionCount >= this.maxInteractions) {
                // Still use a small delay for scene transition, but much shorter
                this.time.delayedCall(200, () => {
                    safeSceneTransition(this, 'SessionReviewScene');
                });
            } else {
                // Show interaction options immediately when skipped
                this.createInteractionOptions();
            }
        };
        
        this.startTypewriterEffect(fullText, normalComplete, skipComplete);
    }
    
    updateTopicSelection() {
        // Highlight selected topic option
        this.responseButtons.forEach((button, index) => {
            if (button && button.setColor) {
                const newColor = index === this.selectedResponse ? '#f39c12' : '#ecf0f1';
                button.setColor(newColor);
            }
        });
    }
    
    startTypewriterEffect(fullText, onComplete, onSkip) {
        console.log('[TYPEWRITER DEBUG] Starting typewriter effect with text:', fullText.substring(0, 50) + '...');
        
        // Clear any existing typewriter timer
        if (this.typewriterTimer) {
            this.typewriterTimer.destroy();
        }
        
        // Clear previous dialogue bubble
        this.clearDialogueBubble();
        
        // Set typewriter as active for skip detection
        this.typewriterActive = true;
        console.log('[TYPEWRITER DEBUG] Set typewriterActive to true');
        
        // Store full text and completion callbacks for skip functionality
        this.currentFullText = fullText;
        this.currentOnComplete = onComplete;
        this.currentOnSkip = onSkip || onComplete; // Use skip callback if provided, otherwise use normal callback
        
        // Determine speaker and create dialogue bubble
        this.createDialogueBubble(this.currentSpeaker);
        
        // Start with empty text
        this.currentDialogueText.setText('');
        console.log('[TYPEWRITER DEBUG] Created dialogue bubble, starting timer');
        
        let currentIndex = 0;
        const typeSpeed = 30; // milliseconds per character
        
        this.typewriterTimer = this.time.addEvent({
            delay: typeSpeed,
            callback: () => {
                if (currentIndex < fullText.length) {
                    // Add next character
                    const displayText = fullText.substring(0, currentIndex + 1);
                    this.currentDialogueText.setText(displayText);
                    currentIndex++;
                    if (currentIndex === 1) {
                        console.log('[TYPEWRITER DEBUG] First character displayed');
                    }
                } else {
                    // Typewriter complete naturally - use normal callback with delay
                    console.log('[TYPEWRITER DEBUG] Typewriter completed naturally');
                    this.typewriterTimer.destroy();
                    this.typewriterTimer = null;
                    this.typewriterActive = false;
                    this.currentFullText = null;
                    this.currentOnComplete = null;
                    this.currentOnSkip = null;
                    if (onComplete) {
                        console.log('[TYPEWRITER DEBUG] Calling normal completion callback');
                        onComplete();
                    }
                }
            },
            repeat: fullText.length // Need one extra callback to trigger completion
        });
        
        console.log('[TYPEWRITER DEBUG] Timer created with repeat:', fullText.length);
    }
    
    skipTypewriterEffect() {
        console.log('[TYPEWRITER DEBUG] Skip called, typewriterActive:', this.typewriterActive, 'currentFullText exists:', !!this.currentFullText);
        if (this.typewriterActive && this.currentFullText) {
            console.log('[TYPEWRITER DEBUG] Skipping typewriter effect');
            // Stop the typewriter timer
            if (this.typewriterTimer) {
                this.typewriterTimer.destroy();
                this.typewriterTimer = null;
            }
            
            // Display the full text immediately
            this.currentDialogueText.setText(this.currentFullText);
            
            // Mark typewriter as inactive
            this.typewriterActive = false;
            
            // Call the skip callback (immediate) instead of normal callback (delayed)
            if (this.currentOnSkip) {
                const callback = this.currentOnSkip;
                this.currentFullText = null;
                this.currentOnComplete = null;
                this.currentOnSkip = null;
                console.log('[TYPEWRITER DEBUG] Calling skip completion callback');
                // Call immediately without delay
                callback();
            }
        }
    }
    
    createDialogueBubble(speaker) {
        // Clear any existing bubble first
        this.clearDialogueBubble();
        
        // Switch character sprites - talking character gets talking sprite, other gets sitting sprite
        if (speaker === 'zara') {
            this.zaraSprite.setTexture('zara-talking');
            this.finnSprite.setTexture('finn-sitting');
        } else {
            this.finnSprite.setTexture('finn-talking');
            this.zaraSprite.setTexture('zara-sitting');
        }
        
        // Determine position based on speaker
        let bubbleX, bubbleY;
        if (speaker === 'zara') {
            bubbleX = 200;
            bubbleY = 150; // Above Zara
        } else {
            bubbleX = 600;
            bubbleY = 150; // Above Finn
        }
        
        // Create bubble background
        this.currentDialogueBubble = this.add.graphics();
        this.currentDialogueBubble.fillStyle(0xffffff, 0.95);
        this.currentDialogueBubble.lineStyle(2, 0x333333);
        this.currentDialogueBubble.fillRoundedRect(bubbleX - 150, bubbleY - 40, 300, 80, 10);
        this.currentDialogueBubble.strokeRoundedRect(bubbleX - 150, bubbleY - 40, 300, 80, 10);
        
        // Create bubble tail pointing to character
        this.currentDialogueBubble.fillTriangle(
            bubbleX - 10, bubbleY + 40,
            bubbleX + 10, bubbleY + 40,
            bubbleX, bubbleY + 60
        );
        
        // Create text (left-aligned to prevent shifting during typewriter effect)
        this.currentDialogueText = this.add.text(bubbleX - 140, bubbleY - 30, '', {
            fontSize: '16px',
            fill: '#333333',
            fontFamily: 'Arial',
            wordWrap: { width: 280 },
            align: 'left'
        }).setOrigin(0, 0);
    }
    
    clearDialogueBubble() {
        if (this.currentDialogueBubble) {
            this.currentDialogueBubble.destroy();
            this.currentDialogueBubble = null;
        }
        if (this.currentDialogueText) {
            this.currentDialogueText.destroy();
            this.currentDialogueText = null;
        }
        
        // Reset both characters to sitting sprites when dialogue ends
        if (this.zaraSprite) {
            this.zaraSprite.setTexture('zara-sitting');
        }
        if (this.finnSprite) {
            this.finnSprite.setTexture('finn-sitting');
        }
    }
    
    update() {
        // Handle notes interface input
        if (this.notesOpen) {
            // Any key closes notes
            if (this.cursors.up.justDown || this.cursors.down.justDown || 
                this.cursors.left.justDown || this.cursors.right.justDown ||
                this.enterKey.justDown || this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).justDown ||
                this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).justDown) {
                this.closeNotesInterface();
                return;
            }
            
            // Controller input to close notes
            if (this.input.gamepad.total) {
                const gamepad = this.input.gamepad.getPad(0);
                if (gamepad) {
                    const anyButtonPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                           globalInput.wasButtonJustPressed(gamepad, 1) ||
                                           globalInput.wasNamedButtonJustPressed(gamepad, 'A') ||
                                           globalInput.wasNamedButtonJustPressed(gamepad, 'B');
                    if (anyButtonPressed) {
                        this.closeNotesInterface();
                        return;
                    }
                }
            }
            return; // Don't process other input when notes are open
        }
        
        // Check for A button press during typewriter animation to skip
        if (this.typewriterActive) {
            // Controller input for skipping typewriter
            if (this.input.gamepad.total) {
                const gamepad = this.input.gamepad.getPad(0);
                if (gamepad) {
                    // A button to skip dialogue animation
                    const aPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                    globalInput.wasNamedButtonJustPressed(gamepad, 'A');
                    if (aPressed) {
                        this.skipTypewriterEffect();
                        return;
                    }
                }
            }
            
            // Keyboard support for skipping (spacebar or enter)
            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).justDown ||
                this.enterKey.justDown) {
                this.skipTypewriterEffect();
                return;
            }
            
            return; // Don't process other input during typewriter
        }
        
        if (!this.awaitingInput) return;
        
        // Keyboard controls with faster response for dialogue
        if (this.cursors.up.justDown) {
            // Use shorter delay for dialogue navigation responsiveness
            const now = Date.now();
            if (now - globalInput.lastInputTime > 50) { // Much shorter delay for dialogue
                globalInput.lastInputTime = now;
                this.selectedResponse = Math.max(0, this.selectedResponse - 1);
                this.updateInteractionSelection();
            }
        }
        
        if (this.cursors.down.justDown) {
            // Use shorter delay for dialogue navigation responsiveness
            const now = Date.now();
            if (now - globalInput.lastInputTime > 50) { // Much shorter delay for dialogue
                globalInput.lastInputTime = now;
                this.selectedResponse = Math.min(this.responseButtons.length - 1, this.selectedResponse + 1);
                this.updateInteractionSelection();
            }
        }
        
        if (this.enterKey.justDown) {
            if (this.awaitingInput && this.responseButtons[this.selectedResponse]) {
                // Trigger the selected button programmatically
                this.responseButtons[this.selectedResponse].emit('pointerdown');
            }
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
                        this.updateInteractionSelection();
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
                        this.updateInteractionSelection();
                    }
                }
                
                // A button to select response - reliable detection
                const aPressed = globalInput.wasButtonJustPressed(gamepad, 0) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'A');
                if (aPressed) {
                    if (this.awaitingInput && this.responseButtons[this.selectedResponse]) {
                        // Trigger the selected button programmatically
                        this.responseButtons[this.selectedResponse].emit('pointerdown');
                    }
                }
                
                // B button to go back to previous scene - reliable detection
                const bPressed = globalInput.wasButtonJustPressed(gamepad, 1) || 
                                globalInput.wasNamedButtonJustPressed(gamepad, 'B');
                if (bPressed) {
                    console.log('[SCENE DEBUG] B button pressed in TherapySessionScene');
                    safeSceneTransition(this, 'TherapyOfficeScene');
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
        
        // Button indicators in lower right corner - only show B since both A and B return
        this.add.circle(750, 550, 15, 0xf44336);
        this.add.text(750, 550, 'B', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(750, 575, 'Return', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
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
    scene: [MainMenuScene, LobbyScene, TherapyOfficeScene, PatientFilesScene, TherapySessionScene, SessionReviewScene],
    input: {
        gamepad: true
    },
    render: {
        premultipliedAlpha: false,
        transparent: true
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