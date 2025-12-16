import { Scene } from 'phaser';
import WalletService from '../services/WalletService.js';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    async create ()
    {
        // Get the current highscore from the registry
        const score = this.registry.get('highscore');

        const textStyle = { 
            fontFamily: 'Arial Black', 
            fontSize: 38, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        };
        
        const smallTextStyle = { 
            fontFamily: 'Arial', 
            fontSize: 22, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 4 
        };

        this.add.image(512, 970, 'background').setScale(2.6);

        const logo = this.add.image(450, -270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 1000,
            duration: 1000,
            ease: 'Bounce'
        });

        // High score display
        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        // Display wallet information
        const walletAddress = WalletService.getConnectedAddress();
        const walletName = WalletService.getWalletName();
        const walletSkipped = this.registry.get('walletSkipped');
        
        if (walletAddress) {
            const shortAddress = WalletService.formatAddress(walletAddress);
            const walletInfo = walletName 
                ? `${walletName}: ${shortAddress}`
                : `Bitcoin: ${shortAddress}`;
            
            this.add.text(32, 100, walletInfo, smallTextStyle);
            
            // Disconnect button
            const disconnectButton = this.add.rectangle(850, 100, 100, 40, 0xff0000)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    WalletService.disconnect();
                    this.registry.set('walletSkipped', false);
                    this.scene.start('WalletConnect');
                })
                .on('pointerover', () => disconnectButton.setFillStyle(0xcc0000))
                .on('pointerout', () => disconnectButton.setFillStyle(0xff0000));
            
            this.add.text(850, 100, 'Disconnect', {
                fontFamily: 'Arial',
                fontSize: 18,
                color: '#ffffff'
            }).setOrigin(0.5);
        } else if (walletSkipped) {
            // Show guest mode message
            this.add.text(32, 100, 'Guest Mode (No Wallet)', {
                fontFamily: 'Arial',
                fontSize: 20,
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 3
            });
            
            // Connect wallet button
            const connectButton = this.add.rectangle(850, 100, 100, 40, 0x0088ff)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.scene.start('WalletConnect');
                })
                .on('pointerover', () => connectButton.setFillStyle(0x0066cc))
                .on('pointerout', () => connectButton.setFillStyle(0x0088ff));
            
            this.add.text(850, 100, 'Connect', {
                fontFamily: 'Arial',
                fontSize: 18,
                color: '#ffffff'
            }).setOrigin(0.5);
        }

        // Game instructions
        const instructions = [
            'How many coins can you',
            'click in 10 seconds?',
            '',
            'Click to Start!'
        ]

        this.add.text(450, 1300, instructions, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('ClickerGame');
        });
    }
}
