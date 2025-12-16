/**
 * 钱包连接场景
 * 使用 BDK 创建或导入 Bitcoin 钱包
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
            fontFamily: 'Arial Black', 
            fontSize: 38, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        };

        const titleStyle = { 
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 8 
        };

        this.add.image(512, 970, 'background').setScale(2.6);

        // 标题
        this.add.text(450, 200, 'Bitcoin 钱包', titleStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // 显示选择界面
        this.showWalletOptions();

        // 错误提示（初始隐藏）
        this.errorText = this.add.text(450, 1400, '', {
            fontFamily: 'Arial',
            fontSize: 28,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setAlign('center')
        .setOrigin(0.5)
        .setVisible(false);

        // 加载提示（初始隐藏）
        this.loadingText = this.add.text(450, 1400, '正在处理...', {
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
            fontSize: 32, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 6 
        };

        // 说明文字
        const instructions = [
            '请选择操作：',
            '',
            '创建新钱包 或 导入现有钱包'
        ];
        this.add.text(450, 400, instructions, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // 创建新钱包按钮
        const createButton = this.add.rectangle(450, 700, 400, 80, 0x00ff00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showCreateWallet())
            .on('pointerover', () => createButton.setFillStyle(0x00cc00))
            .on('pointerout', () => createButton.setFillStyle(0x00ff00));

        this.add.text(450, 700, '创建新钱包', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#000000'
        })
        .setOrigin(0.5);

        // 导入钱包按钮
        const importButton = this.add.rectangle(450, 850, 400, 80, 0x0088ff)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showImportWallet())
            .on('pointerover', () => importButton.setFillStyle(0x0066cc))
            .on('pointerout', () => importButton.setFillStyle(0x0088ff));

        this.add.text(450, 850, '导入现有钱包', {
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

        this.add.text(450, 400, '创建新钱包', {
            fontFamily: 'Arial Black',
            fontSize: 40,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        })
        .setAlign('center')
        .setOrigin(0.5);

        const warning = [
            '⚠️ 重要提示：',
            '',
            '创建钱包后会生成助记词',
            '请妥善保管，丢失将无法恢复！',
            '',
            '点击下方按钮创建钱包'
        ];
        this.add.text(450, 600, warning, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        const createButton = this.add.rectangle(450, 900, 400, 80, 0x00ff00)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleCreateWallet())
            .on('pointerover', () => createButton.setFillStyle(0x00cc00))
            .on('pointerout', () => createButton.setFillStyle(0x00ff00));

        this.add.text(450, 900, '生成新钱包', {
            fontFamily: 'Arial Black',
            fontSize: 32,
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

        this.add.text(450, 400, '导入钱包', {
            fontFamily: 'Arial Black',
            fontSize: 40,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        })
        .setAlign('center')
        .setOrigin(0.5);

        const instructions = [
            '请输入您的 BIP39 助记词',
            '（12 或 24 个单词）',
            '',
            '注意：也可以直接提供 descriptor'
        ];
        this.add.text(450, 550, instructions, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // 输入框背景
        const inputBg = this.add.rectangle(450, 750, 600, 200, 0x333333)
            .setStrokeStyle(2, 0xffffff);

        // 提示：实际应用中需要创建真正的输入框
        // 这里使用文本提示
        this.add.text(450, 750, '点击下方按钮输入助记词\n（实际应用中需要输入框）', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            align: 'center'
        })
        .setOrigin(0.5);

        const importButton = this.add.rectangle(450, 1000, 400, 80, 0x0088ff)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleImportWallet())
            .on('pointerover', () => importButton.setFillStyle(0x0066cc))
            .on('pointerout', () => importButton.setFillStyle(0x0088ff));

        this.add.text(450, 1000, '导入钱包', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff'
        })
        .setOrigin(0.5);
    }

    async handleCreateWallet() {
        this.showLoading(true);

        try {
            // 注意：实际实现需要生成助记词和 xprv
            // 这里使用示例，实际需要根据 bdk-wallet-web API 实现
            const mnemonic = 'example mnemonic phrase here'; // 需要实际生成
            
            // 提示：需要实现从助记词生成 xprv 的逻辑
            // 或者使用 bdk-wallet-web 提供的功能
            throw new Error('需要实现助记词生成和 xprv 创建逻辑');
            
            // const result = await WalletService.createWalletFromMnemonic(mnemonic, xprv);
            // this.showSuccessMessage(result.address, mnemonic);

        } catch (error) {
            console.error('创建钱包错误:', error);
            this.showError(error.message || '创建钱包失败');
        } finally {
            this.showLoading(false);
        }
    }

    async handleImportWallet() {
        this.showLoading(true);

        try {
            // 提示：实际应用中需要从输入框获取助记词
            // 这里使用示例
            const mnemonic = prompt('请输入您的助记词（12 或 24 个单词）:');
            
            if (!mnemonic || mnemonic.trim().length === 0) {
                throw new Error('请输入有效的助记词');
            }

            // 注意：需要实现从助记词生成 xprv 的逻辑
            // 或者直接使用 descriptor
            throw new Error('需要实现从助记词创建钱包的逻辑');
            
            // const result = await WalletService.createWalletFromMnemonic(mnemonic.trim(), xprv);
            // this.showSuccessMessage(result.address);

        } catch (error) {
            console.error('导入钱包错误:', error);
            this.showError(error.message || '导入钱包失败');
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
            '钱包创建成功！',
            '',
            `地址: ${shortAddress}`,
        ];

        if (mnemonic) {
            message.push('', '⚠️ 请保存您的助记词：', mnemonic);
        }

        message.push('', '正在进入游戏...');

        this.add.text(450, 1000, message, textStyle)
            .setAlign('center')
            .setOrigin(0.5);

        // 延迟后进入主菜单
        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenu');
        });
    }

    showError(message) {
        if (this.errorText) {
            this.errorText.setText(`错误: ${message}`);
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

    clearScene() {
        // 清除所有子对象（除了背景和错误/加载提示）
        this.children.list.forEach(child => {
            if (child !== this.errorText && child !== this.loadingText && child.type !== 'Image') {
                child.destroy();
            }
        });
    }
}
