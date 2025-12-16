# Bitcoin Catcher 🪙

A Bitcoin-themed coin clicker game built with Phaser 3. Connect your Bitcoin wallet to play and compete for the highest score!

![Game Screenshot](https://github.com/user-attachments/assets/242ce592-a275-49e2-878e-514ff4e97693)

[Gameplay Video](https://youtube.com/shorts/aUn__2jXtOs?feature=share)

## Features

- 🎮 **Fun Clicker Game**: Click Bitcoin coins as many times as possible in 10 seconds
- 🔐 **Bitcoin Wallet Integration**: Login with your Bitcoin wallet using [@bitcoindevkit/bdk-wallet-web](https://www.npmjs.com/package/@bitcoindevkit/bdk-wallet-web)
- 💼 **Wallet Management**: Create new wallets or import existing ones
- 📊 **Score Tracking**: Track your high score and compete with yourself
- 🎨 **Beautiful UI**: Modern and responsive game interface

## Bitcoin Wallet Integration

This game uses the Bitcoin Dev Kit (BDK) for wallet functionality:

- **Create Wallet**: Generate a new Bitcoin wallet with mnemonic phrase
- **Import Wallet**: Import existing wallet using BIP39 mnemonic or descriptor
- **Address Management**: Generate and manage Bitcoin addresses
- **Network Support**: Works with Bitcoin testnet and mainnet

### Wallet Features

- ✅ Descriptor-based wallet (supports all address types)
- ✅ BIP39 mnemonic support
- ✅ Native SegWit (P2WPKH) addresses
- ✅ Secure wallet management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bitcoin-catcher
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (usually `http://localhost:5173`)

### Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Game Instructions

1. **Connect Wallet**: When you first launch the game, you'll be prompted to connect or create a Bitcoin wallet
2. **Create or Import**: 
   - Create a new wallet (you'll receive a mnemonic phrase - **save it securely!**)
   - Or import an existing wallet using your mnemonic phrase
3. **Play**: Click the Bitcoin coin as many times as possible within 10 seconds
4. **Compete**: Try to beat your high score!

## Project Structure

```
bitcoin-catcher/
├── src/
│   ├── scenes/
│   │   ├── Boot.js           # Initial boot scene with wallet check
│   │   ├── WalletConnect.js   # Wallet connection/creation scene
│   │   ├── Preloader.js       # Asset loading
│   │   ├── MainMenu.js        # Main menu with wallet info
│   │   ├── ClickerGame.js     # Main game scene
│   │   └── GameOver.js        # Game over scene
│   ├── services/
│   │   └── WalletService.js    # Bitcoin wallet service (BDK)
│   └── main.js                 # Game configuration
├── public/
│   └── assets/                # Game assets
└── package.json
```

## Technology Stack

- **Phaser 3**: Game engine
- **Vite**: Build tool and dev server
- **@bitcoindevkit/bdk-wallet-web**: Bitcoin wallet library
- **JavaScript (ES6+)**: Programming language

## Bitcoin Network

By default, the game uses **Bitcoin testnet** for development and testing. To switch to mainnet:

1. Update `WalletService.js`:
```javascript
this.network = 'mainnet'; // Change from 'testnet'
```

⚠️ **Warning**: Only use mainnet with real Bitcoin after thorough testing!

## Security Notes

- 🔒 **Never share your mnemonic phrase** with anyone
- 🔒 **Never commit private keys or mnemonics** to version control
- 🔒 The current implementation stores mnemonic in localStorage for convenience (development only)
- 🔒 **Production apps should never store mnemonics** - let users manage their own keys

## Development Workflow

![Workflow](https://github.com/user-attachments/assets/d17e62f1-e932-43f8-a2e9-296185d2baf1)

## Screenshots

![Gameplay](https://github.com/user-attachments/assets/e150cff8-d740-4d0e-a992-8c9015d7826e)

![Conclusion](https://github.com/user-attachments/assets/1500ca61-29d9-4ef4-8baf-860a6370e587)

## Documentation

For detailed information about Bitcoin wallet integration, see:
- [Bitcoin Wallet Integration Guide](./BITCOIN_WALLET_INTEGRATION.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

## Resources

- [Bitcoin Dev Kit Documentation](https://bitcoindevkit.org/docs/)
- [BDK Wallet Web npm Package](https://www.npmjs.com/package/@bitcoindevkit/bdk-wallet-web)
- [Phaser 3 Documentation](https://newdocs.phaser.io/)
- [Vite Documentation](https://vitejs.dev/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Acknowledgments

- Built with [Bitcoin Dev Kit](https://bitcoindevkit.org/)
- Game engine: [Phaser](https://phaser.io/)
- Bitcoin community for inspiration

---

**Enjoy playing Bitcoin Catcher! 🎮🪙**
