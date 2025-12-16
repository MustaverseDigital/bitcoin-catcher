/**
 * Wallet Connection Scene
 * Create or import Bitcoin wallet using BDK
 */
import { Scene } from 'phaser';
import WalletService from '../services/WalletService.js';

export class WalletConnect extends Scene {
    constructor() {
        super('WalletConnect');
        this.errorText = null;
        this.loadingText = null;
        this.mnemonicInput = null;
        this.mode = 'select'; // 'select', 'create', 'import'
    }

    create() {
        const textStyle = { 
            fontFamily: 'Arial', 
            fontSize: 32, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 6 
        };

        const titleStyle = { 
            fontFamily: 'Arial Black', 
            fontSize: 52, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        };

        this.add.image(512, 970, 'background').setScale(2.6);

        // Title
        this.add.text(450, 180, 'Bitcoin Wallet', titleStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // Show wallet options
        this.showWalletOptions();

        // Error message (hidden initially)
        this.errorText = this.add.text(450, 1400, '', {
            fontFamily: 'Arial',
            fontSize: 26,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setAlign('center')
        .setOrigin(0.5)
        .setVisible(false);

        // Loading message (hidden initially)
        this.loadingText = this.add.text(450, 1400, 'Processing...', {
            fontFamily: 'Arial',
            fontSize: 28,
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setAlign('center')
        .setOrigin(0.5)
        .setVisible(false);
    }

    showWalletOptions() {
        const textStyle = { 
            fontFamily: 'Arial', 
            fontSize: 30, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 6 
        };

        // Instructions
        const instructions = [
            'Choose an option:',
            '',
            'Create new wallet or import existing wallet'
        ];
        this.add.text(450, 350, instructions, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // Create new wallet button
        const createButton = this.add.rectangle(450, 650, 420, 90, 0x00ff00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showCreateWallet())
            .on('pointerover', () => createButton.setFillStyle(0x00cc00))
            .on('pointerout', () => createButton.setFillStyle(0x00ff00));

        this.add.text(450, 650, 'Create New Wallet', {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#000000'
        })
        .setOrigin(0.5);

        // Import wallet button
        const importButton = this.add.rectangle(450, 780, 420, 90, 0x0088ff)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showImportWallet())
            .on('pointerover', () => importButton.setFillStyle(0x0066cc))
            .on('pointerout', () => importButton.setFillStyle(0x0088ff));

        this.add.text(450, 780, 'Import Wallet', {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#ffffff'
        })
        .setOrigin(0.5);

        // Skip login button
        const skipButton = this.add.rectangle(450, 920, 420, 90, 0x666666)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleSkipLogin())
            .on('pointerover', () => skipButton.setFillStyle(0x555555))
            .on('pointerout', () => skipButton.setFillStyle(0x666666));

        this.add.text(450, 920, 'Skip & Play as Guest', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff'
        })
        .setOrigin(0.5);
    }

    showCreateWallet() {
        this.clearScene();
        this.mode = 'create';

        const textStyle = { 
            fontFamily: 'Arial', 
            fontSize: 28, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 4 
        };

        const titleStyle = {
            fontFamily: 'Arial Black',
            fontSize: 44,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        };

        this.add.text(450, 350, 'Create New Wallet', titleStyle)
            .setAlign('center')
            .setOrigin(0.5);

        const warning = [
            '⚠️ Important Notice:',
            '',
            'A mnemonic phrase will be generated',
            'Keep it safe - you cannot recover it if lost!',
            '',
            'Click the button below to create wallet'
        ];
        this.add.text(450, 550, warning, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        const createButton = this.add.rectangle(450, 850, 420, 90, 0x00ff00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleCreateWallet())
            .on('pointerover', () => createButton.setFillStyle(0x00cc00))
            .on('pointerout', () => createButton.setFillStyle(0x00ff00));

        this.add.text(450, 850, 'Generate Wallet', {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#000000'
        })
        .setOrigin(0.5);
    }

    showImportWallet() {
        this.clearScene();
        this.mode = 'import';

        const textStyle = { 
            fontFamily: 'Arial', 
            fontSize: 28, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 4 
        };

        const titleStyle = {
            fontFamily: 'Arial Black',
            fontSize: 44,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        };

        this.add.text(450, 350, 'Import Wallet', titleStyle)
            .setAlign('center')
            .setOrigin(0.5);

        const instructions = [
            'Enter your BIP39 mnemonic phrase',
            '(12 or 24 words)',
            '',
            'Note: You can also provide a descriptor'
        ];
        this.add.text(450, 500, instructions, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // Input box background
        const inputBg = this.add.rectangle(450, 700, 650, 180, 0x333333)
            .setStrokeStyle(2, 0xffffff);

        // Placeholder text
        this.add.text(450, 700, 'Click button below to enter mnemonic\n(Input field implementation needed)', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#ffffff',
            align: 'center'
        })
        .setOrigin(0.5);

        const importButton = this.add.rectangle(450, 950, 420, 90, 0x0088ff)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleImportWallet())
            .on('pointerover', () => importButton.setFillStyle(0x0066cc))
            .on('pointerout', () => importButton.setFillStyle(0x0088ff));

        this.add.text(450, 950, 'Import Wallet', {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#ffffff'
        })
        .setOrigin(0.5);
    }

    async handleCreateWallet() {
        this.showLoading(true);

        try {
            // Note: Actual implementation needs to generate mnemonic and xprv
            // This is a placeholder - needs to be implemented according to bdk-wallet-web API
            const mnemonic = 'example mnemonic phrase here'; // Needs actual generation
            
            // Note: Need to implement logic to generate xprv from mnemonic
            // Or use bdk-wallet-web provided functionality
            throw new Error('Mnemonic generation and xprv creation logic needs to be implemented');
            
            // const result = await WalletService.createWalletFromMnemonic(mnemonic, xprv);
            // this.showSuccessMessage(result.address, mnemonic);

        } catch (error) {
            console.error('Create wallet error:', error);
            this.showError(error.message || 'Failed to create wallet');
        } finally {
            this.showLoading(false);
        }
    }

    async handleImportWallet() {
        this.showLoading(true);

        try {
            // Note: Actual implementation needs to get mnemonic from input field
            // This is a placeholder
            const mnemonic = prompt('Enter your mnemonic phrase (12 or 24 words):');
            
            if (!mnemonic || mnemonic.trim().length === 0) {
                throw new Error('Please enter a valid mnemonic phrase');
            }

            // Note: Need to implement logic to create wallet from mnemonic
            // Or use descriptor directly
            throw new Error('Logic to create wallet from mnemonic needs to be implemented');
            
            // const result = await WalletService.createWalletFromMnemonic(mnemonic.trim(), xprv);
            // this.showSuccessMessage(result.address);

        } catch (error) {
            console.error('Import wallet error:', error);
            this.showError(error.message || 'Failed to import wallet');
        } finally {
            this.showLoading(false);
        }
    }

    showSuccessMessage(address, mnemonic = null) {
        const textStyle = { 
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            color: '#00ff00', 
            stroke: '#000000', 
            strokeThickness: 6 
        };

        const shortAddress = WalletService.formatAddress(address);
        const message = [
            'Wallet Created Successfully!',
            '',
            `Address: ${shortAddress}`,
        ];

        if (mnemonic) {
            message.push('', '⚠️ Please save your mnemonic phrase:', mnemonic);
        }

        message.push('', 'Entering game...');

        this.add.text(450, 1000, message, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // Delay before entering main menu
        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenu');
        });
    }

    showError(message) {
        if (this.errorText) {
            this.errorText.setText(`Error: ${message}`);
            this.errorText.setVisible(true);
        }
    }

    showLoading(show) {
        if (this.loadingText) {
            this.loadingText.setVisible(show);
        }
        if (this.errorText) {
            this.errorText.setVisible(false);
        }
    }

    handleSkipLogin() {
        // Mark as skipped
        this.registry.set('walletSkipped', true);
        
        // Clear any existing wallet connection state
        WalletService.disconnect();
        
        // Go directly to preloader scene
        this.scene.start('Preloader');
    }

    clearScene() {
        // Clear all child objects (except background and error/loading messages)
        this.children.list.forEach(child => {
            if (child !== this.errorText && child !== this.loadingText && child.type !== 'Image') {
                child.destroy();
            }
        });
    }
}
