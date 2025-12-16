import { Scene } from 'phaser';
import WalletService from '../services/WalletService.js';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        const textStyle = { fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        const instructions = [
            'Bitcoin generating!',
            'Please wait...',
        ]

        this.add.text(450, 900, instructions, textStyle).setAlign('center').setOrigin(0.5);
    }

    async create ()
    {
        // A global value to store the highscore in
        this.registry.set('highscore', 0);
        
        // Initialize wallet skipped flag (if not exists)
        if (this.registry.get('walletSkipped') === undefined) {
            this.registry.set('walletSkipped', false);
        }

        // Check wallet connection status
        try {
            const isConnected = await WalletService.checkConnection();
            
            if (isConnected) {
                // Wallet connected, clear skip flag
                this.registry.set('walletSkipped', false);
                // Go directly to preloader
                this.scene.start('Preloader');
            } else {
                // No wallet connected, go to wallet connect scene
                this.scene.start('WalletConnect');
            }
        } catch (error) {
            console.error('Failed to check wallet connection:', error);
            // On error, also go to wallet connect scene
            this.scene.start('WalletConnect');
        }
    }
}
