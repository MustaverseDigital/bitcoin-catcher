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
        //  A global value to store the highscore in
        this.registry.set('highscore', 0);

        // 检查钱包连接状态
        try {
            const isConnected = await WalletService.checkConnection();
            
            if (isConnected) {
                // 已连接钱包，直接进入预加载
                this.scene.start('Preloader');
            } else {
                // 未连接钱包，进入钱包连接场景
                this.scene.start('WalletConnect');
            }
        } catch (error) {
            console.error('检查钱包连接失败:', error);
            // 出错时也进入钱包连接场景
            this.scene.start('WalletConnect');
        }
    }
}
