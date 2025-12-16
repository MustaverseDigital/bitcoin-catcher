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
        //  Get the current highscore from the registry
        const score = this.registry.get('highscore');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        const smallTextStyle = { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', stroke: '#000000', strokeThickness: 4 };

        this.add.image(512, 970, 'background').setScale(2.6);

        const logo = this.add.image(450, -270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 1000,
            duration: 1000,
            ease: 'Bounce'
        });

        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        // 显示钱包信息
        const walletAddress = WalletService.getConnectedAddress();
        const walletName = WalletService.getWalletName();
        
        if (walletAddress) {
            const shortAddress = WalletService.formatAddress(walletAddress);
            const walletInfo = walletName 
                ? `${walletName}: ${shortAddress}`
                : `Bitcoin: ${shortAddress}`;
            
            this.add.text(32, 100, walletInfo, smallTextStyle);
            
            // 断开连接按钮
            const disconnectButton = this.add.rectangle(850, 100, 120, 40, 0xff0000)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    WalletService.disconnect();
                    this.scene.start('WalletConnect');
                });
            
            this.add.text(850, 100, '断开', {
                fontFamily: 'Arial',
                fontSize: 20,
                color: '#ffffff'
            }).setOrigin(0.5);
        }

        const instructions = [
            'How many coins can you',
            'click in 10 seconds?',
            '',
            'Click to Start!'
        ]

        this.add.text(450, 1300, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('ClickerGame');

        });
    }
}

