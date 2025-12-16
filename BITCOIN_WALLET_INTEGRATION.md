# Bitcoin 钱包登录集成分析 - 使用 @bitcoindevkit/bdk-wallet-web

## 当前项目状态

当前项目是一个基于 Phaser 的点击游戏，已集成 **@bitcoindevkit/bdk-wallet-web** 用于 Bitcoin 钱包功能。

## 使用的技术栈

- **@bitcoindevkit/bdk-wallet-web**: Bitcoin Dev Kit 的 WebAssembly 版本，用于在浏览器中创建和管理 Bitcoin 钱包
- **Phaser 3**: 游戏引擎
- **Vite**: 构建工具

## BDK Wallet Web 简介

`@bitcoindevkit/bdk-wallet-web` 是一个基于 WebAssembly 的 Bitcoin 钱包库，提供：

- ✅ 完整的钱包功能（创建、导入、同步）
- ✅ Descriptor 支持（支持所有地址类型）
- ✅ UTXO 管理
- ✅ 交易创建和签名
- ✅ 不依赖外部钱包扩展

## 实现架构

### 1. WalletService (`src/services/WalletService.js`)

核心钱包服务，提供以下功能：

- **钱包创建**: 从助记词或 descriptor 创建钱包
- **钱包恢复**: 从保存的状态恢复钱包
- **地址生成**: 生成新的接收地址
- **余额查询**: 获取钱包余额（需要同步）
- **网络管理**: 支持 testnet/mainnet

### 2. WalletConnect 场景 (`src/scenes/WalletConnect.js`)

钱包连接界面，提供：

- **创建新钱包**: 生成新的助记词和钱包
- **导入钱包**: 从助记词或 descriptor 导入

### 3. 集成流程

```
Boot 场景
  ↓
检查钱包连接状态
  ↓
未连接 → WalletConnect 场景
  ↓
已连接 → Preloader → MainMenu
```

## 重要注意事项

### ⚠️ 需要实现的缺失功能

当前实现中，以下功能需要根据 `@bitcoindevkit/bdk-wallet-web` 的实际 API 完善：

1. **从助记词生成 xprv (Extended Private Key)**
   - 需要 `bip39` 库生成 seed
   - 需要 `bip32` 库从 seed 生成 xprv
   - 或使用 BDK 提供的功能（如果支持）

2. **助记词生成**
   - 需要 `bip39` 库生成随机助记词
   - 或使用 BDK 提供的功能

3. **区块链同步**
   - 需要配置 Esplora 客户端
   - 需要实现同步逻辑

### 推荐的额外依赖

为了完整实现钱包功能，可能需要安装：

```bash
npm install bip39 bip32
```

或者查看 `@bitcoindevkit/bdk-wallet-web` 是否提供这些功能。

## 使用方式

### 方式一：使用 Descriptor（推荐用于测试）

如果您已有 descriptor，可以直接使用：

```javascript
import WalletService from './services/WalletService.js';

// 使用 descriptor 创建钱包
await WalletService.createWalletFromDescriptors(
    "wpkh(xprv.../84'/1'/0'/0/*)",  // 外部 descriptor
    "wpkh(xprv.../84'/1'/0'/1/*)"   // 内部 descriptor
);
```

### 方式二：从助记词创建（需要实现）

```javascript
// 需要先实现从助记词到 xprv 的转换
const mnemonic = "word1 word2 ... word12";
const xprv = await generateXprvFromMnemonic(mnemonic);
await WalletService.createWalletFromMnemonic(mnemonic, xprv);
```

## 安全注意事项

1. **私钥安全**
   - ⚠️ 当前实现将助记词保存在 localStorage（仅用于演示）
   - ⚠️ 生产环境**绝对不要**在代码中保存助记词或私钥
   - ✅ 让用户自己保管助记词

2. **网络选择**
   - 默认使用 `testnet`（测试网）
   - 生产环境切换到 `mainnet` 前请充分测试

3. **数据持久化**
   - 使用 `MemoryDatabase` 仅保存在内存中
   - 页面刷新后需要重新创建钱包
   - 可以使用 `wallet.take_staged()` 导出 changeset 进行持久化

## 完整实现步骤

### 步骤 1: 安装依赖

```bash
npm install @bitcoindevkit/bdk-wallet-web
# 如果需要助记词功能
npm install bip39 bip32
```

### 步骤 2: 实现助记词功能

创建 `src/utils/mnemonic.js`:

```javascript
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

export function generateMnemonic() {
    return bip39.generateMnemonic();
}

export async function mnemonicToXprv(mnemonic, network = 'testnet') {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed);
    const networkObj = network === 'testnet' 
        ? { bip32: { public: 0x043587cf, private: 0x04358394 } }
        : { bip32: { public: 0x0488b21e, private: 0x0488ade4 } };
    
    // BIP84: m/84'/coin'/0'
    const coinType = network === 'testnet' ? 1 : 0;
    const account = root.derivePath(`m/84'/${coinType}'/0'`);
    
    return account.toBase58();
}
```

### 步骤 3: 更新 WalletService

在 `WalletService.js` 中使用上述工具函数：

```javascript
import { generateMnemonic, mnemonicToXprv } from '../utils/mnemonic.js';

// 在 createWalletFromMnemonic 中使用
const xprv = await mnemonicToXprv(mnemonic, this.network);
```

### 步骤 4: 配置区块链客户端

```javascript
import { EsploraBlockchain } from '@bitcoindevkit/bdk-wallet-web';

const blockchain = new EsploraBlockchain({
    url: 'https://blockstream.info/testnet/api'
});

await WalletService.sync(blockchain);
```

## 测试建议

1. **使用 Testnet**: 先在测试网测试所有功能
2. **测试钱包创建**: 验证助记词生成和钱包创建
3. **测试钱包恢复**: 验证从助记词恢复钱包
4. **测试地址生成**: 验证地址生成正确
5. **测试同步**: 验证区块链同步功能

## 参考资源

- [BDK 官方文档](https://bitcoindevkit.org/docs/)
- [Book of BDK](https://bookofbdk.com/)
- [npm 包页面](https://www.npmjs.com/package/@bitcoindevkit/bdk-wallet-web)
- [BDK GitHub](https://github.com/bitcoindevkit/bdk)

## 与 Sats Connect 的对比

| 特性 | BDK Wallet Web | Sats Connect |
|------|----------------|--------------|
| 依赖外部扩展 | ❌ 不需要 | ✅ 需要 |
| 私钥管理 | ✅ 完全控制 | ❌ 由扩展管理 |
| 用户体验 | ⚠️ 需要用户输入助记词 | ✅ 一键连接 |
| 功能完整性 | ✅ 完整功能 | ⚠️ 依赖扩展支持 |
| 适用场景 | 自主钱包应用 | 与现有钱包集成 |

## 下一步行动

1. ✅ 已创建 WalletService 基础结构
2. ✅ 已创建 WalletConnect 场景
3. ⏳ 需要实现助记词生成和转换功能
4. ⏳ 需要配置区块链客户端
5. ⏳ 需要实现完整的钱包同步
6. ⏳ 需要添加错误处理和用户提示
7. ⏳ 需要测试所有功能
