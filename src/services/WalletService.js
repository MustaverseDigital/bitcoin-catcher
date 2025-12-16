/**
 * Bitcoin 钱包服务
 * 使用 @bitcoindevkit/bdk-wallet-web 创建和管理 Bitcoin 钱包
 */
import { Wallet } from '@bitcoindevkit/bdk-wallet-web';

// KeychainKind 是类型别名，不是导出，直接使用字符串
const KeychainKind = {
    External: 'external',
    Internal: 'internal'
};

class WalletService {
    constructor() {
        this.wallet = null;
        this.network = 'testnet'; // 或 'bitcoin' (mainnet)
        this.isConnected = false;
        this.currentAddress = null;
        this.mnemonic = null;
    }

    /**
     * 从助记词和 xprv 创建 descriptor
     * 注意：这需要根据实际的 bdk-wallet-web API 实现
     * @param {string} xprv - Extended Private Key
     * @param {boolean} isChange - 是否为找零地址
     * @returns {string} descriptor
     */
    createDescriptor(xprv, isChange = false) {
        // BIP84 路径：m/84'/1'/0'/0/* (外部) 或 m/84'/1'/0'/1/* (内部)
        // testnet 使用 1, mainnet 使用 0
        const coinType = this.network === 'testnet' ? '1' : '0';
        const changeIndex = isChange ? '1' : '0';
        
        // wpkh = Witness Public Key Hash (Native SegWit, P2WPKH)
        // 格式: wpkh(xprv/84'/1'/0'/0/*)
        const derivationPath = `84'/${coinType}'/0'/${changeIndex}/*`;
        return `wpkh(${xprv}/${derivationPath})`;
    }

    /**
     * 从助记词创建钱包
     * @param {string} mnemonic - BIP39 助记词（12或24个单词）
     * @param {string} xprv - Extended Private Key (如果已有)
     * @returns {Promise<{address: string, wallet: Wallet}>}
     */
    async createWalletFromMnemonic(mnemonic, xprv = null) {
        try {
            // 如果提供了 xprv，直接使用；否则需要从助记词生成
            // 注意：实际实现需要根据 bdk-wallet-web 的 API
            if (!xprv) {
                // 这里需要实现从助记词到 xprv 的转换
                // 可能需要使用 bip39 和 bip32 库
                throw new Error('需要提供 xprv 或实现从助记词生成 xprv 的逻辑');
            }

            // 创建 descriptor
            const externalDescriptor = this.createDescriptor(xprv, false);
            const internalDescriptor = this.createDescriptor(xprv, true);

            // 创建钱包 - 使用 Wallet.create() 静态方法
            this.wallet = Wallet.create(
                this.network,
                externalDescriptor,
                internalDescriptor
            );

            // 获取第一个地址 - 使用 next_unused_address 方法
            const addressInfo = this.wallet.next_unused_address(KeychainKind.External);
            
            this.currentAddress = addressInfo.address;
            this.mnemonic = mnemonic;
            this.isConnected = true;

            // 保存到 localStorage（仅保存地址，不保存助记词或私钥）
            localStorage.setItem('btc_wallet_address', this.currentAddress);
            localStorage.setItem('btc_wallet_network', this.network);
            // 注意：生产环境不应该在 localStorage 中保存助记词
            // 这里仅用于演示，实际应该让用户自己保存
            localStorage.setItem('btc_wallet_mnemonic', mnemonic);

            return {
                address: this.currentAddress,
                wallet: this.wallet
            };
        } catch (error) {
            console.error('创建钱包失败:', error);
            throw error;
        }
    }

    /**
     * 使用 descriptor 直接创建钱包（如果已有 descriptor）
     * @param {string} externalDescriptor 
     * @param {string} internalDescriptor 
     * @returns {Promise<{address: string, wallet: Wallet}>}
     */
    async createWalletFromDescriptors(externalDescriptor, internalDescriptor) {
        try {
            // 使用 Wallet.create() 静态方法
            this.wallet = Wallet.create(
                this.network,
                externalDescriptor,
                internalDescriptor
            );

            // 获取第一个地址
            const addressInfo = this.wallet.next_unused_address(KeychainKind.External);
            
            this.currentAddress = addressInfo.address;
            this.isConnected = true;

            localStorage.setItem('btc_wallet_address', this.currentAddress);
            localStorage.setItem('btc_wallet_network', this.network);

            return {
                address: this.currentAddress,
                wallet: this.wallet
            };
        } catch (error) {
            console.error('创建钱包失败:', error);
            throw error;
        }
    }

    /**
     * 从保存的状态恢复钱包
     * @returns {Promise<boolean>}
     */
    async restoreWallet() {
        try {
            const savedAddress = localStorage.getItem('btc_wallet_address');
            const savedMnemonic = localStorage.getItem('btc_wallet_mnemonic');
            const savedNetwork = localStorage.getItem('btc_wallet_network');
            
            if (!savedMnemonic || !savedAddress) {
                return false;
            }

            if (savedNetwork) {
                this.network = savedNetwork;
            }

            // 注意：这里需要从助记词生成 xprv
            // 实际实现需要根据 bdk-wallet-web 的 API
            // 暂时只恢复地址信息
            this.currentAddress = savedAddress;
            this.mnemonic = savedMnemonic;
            this.isConnected = true;

            // 如果需要完整恢复钱包，需要重新创建 wallet 实例
            // 这需要 xprv 或 descriptor
            
            return true;
        } catch (error) {
            console.error('恢复钱包失败:', error);
            return false;
        }
    }

    /**
     * 检查是否已连接钱包
     * @returns {Promise<boolean>}
     */
    async checkConnection() {
        if (this.isConnected && this.currentAddress) {
            return true;
        }

        // 尝试从 localStorage 恢复
        return await this.restoreWallet();
    }

    /**
     * 获取当前连接的地址
     * @returns {string|null}
     */
    getConnectedAddress() {
        return this.currentAddress || localStorage.getItem('btc_wallet_address');
    }

    /**
     * 获取钱包名称（BDK 钱包没有名称概念）
     * @returns {string}
     */
    getWalletName() {
        return 'BDK Wallet';
    }

    /**
     * 获取新地址
     * @param {number} index - 地址索引（可选，默认获取下一个未使用地址）
     * @returns {string}
     */
    getNewAddress(index = null) {
        if (!this.wallet) {
            throw new Error('钱包未初始化');
        }

        let addressInfo;
        if (index !== null) {
            // 使用 peek_address 获取指定索引的地址
            addressInfo = this.wallet.peek_address(KeychainKind.External, index);
        } else {
            // 使用 next_unused_address 获取下一个未使用地址
            addressInfo = this.wallet.next_unused_address(KeychainKind.External);
        }
        
        return addressInfo.address;
    }

    /**
     * 获取钱包余额
     * @returns {Promise<number>}
     */
    async getBalance() {
        if (!this.wallet) {
            throw new Error('钱包未初始化');
        }

        // 需要先同步钱包
        // await this.sync();
        
        // 获取余额 - 需要查看实际 API
        // const balance = this.wallet.getBalance();
        // return balance.total;
        
        throw new Error('需要实现余额获取功能');
    }

    /**
     * 同步钱包（从区块链获取最新状态）
     * @param {Object} blockchain - 区块链客户端（如 EsploraClient）
     * @returns {Promise<void>}
     */
    async sync(blockchain) {
        if (!this.wallet) {
            throw new Error('钱包未初始化');
        }

        if (!blockchain) {
            throw new Error('需要提供区块链客户端');
        }

        // 需要查看实际的同步 API
        // await this.wallet.sync(blockchain);
        throw new Error('需要实现同步功能');
    }

    /**
     * 断开钱包连接
     */
    disconnect() {
        if (this.wallet) {
            // 释放 WASM 资源
            this.wallet.free();
        }
        this.wallet = null;
        this.currentAddress = null;
        this.mnemonic = null;
        this.isConnected = false;
        
        // 清除 localStorage（但保留助记词，让用户选择）
        localStorage.removeItem('btc_wallet_address');
        // localStorage.removeItem('btc_wallet_mnemonic'); // 保留以便恢复
    }

    /**
     * 完全清除钱包数据（包括助记词）
     */
    clearWallet() {
        this.disconnect();
        localStorage.removeItem('btc_wallet_mnemonic');
        localStorage.removeItem('btc_wallet_network');
    }

    /**
     * 获取地址的简短显示格式
     * @param {string} address 
     * @returns {string}
     */
    formatAddress(address) {
        if (!address) return '';
        if (address.length <= 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    /**
     * 设置网络（testnet 或 bitcoin/mainnet）
     * @param {string} network 
     */
    setNetwork(network) {
        const validNetworks = ['bitcoin', 'testnet', 'testnet4', 'signet', 'regtest'];
        if (!validNetworks.includes(network)) {
            throw new Error(`无效的网络类型。有效值: ${validNetworks.join(', ')}`);
        }
        this.network = network;
        localStorage.setItem('btc_wallet_network', network);
    }

    /**
     * 获取当前网络
     * @returns {string}
     */
    getNetwork() {
        return this.network;
    }
}

export default new WalletService();
