import * as dotenv from 'dotenv';

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { NETWORKS } from './scripts/constants/networks';
import { NETWORK_CONFIGS, NetworkConfigs } from './scripts/constants/networkConfigs';

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: '0.8.24',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    mocha: {
        timeout: 300000,
    },
    networks: {
        /* Testnet */
        SEPOLIA: NETWORK_CONFIGS.SEPOLIA,
        BASE_GOERLI: NETWORK_CONFIGS.BASE_GOERLI,
        BASE_SEPOLIA: NETWORK_CONFIGS.BASE_SEPOLIA,
        /* Mainnet */
        BASE: NETWORK_CONFIGS.BASE,
    } as NetworkConfigs,
    gasReporter: {
        enabled: false,
        currency: 'USD',
    },
    etherscan: {
        apiKey: {
          /* ETHEREUM */
            sepolia: process.env.ETHEREUM_API_KEY,
          /* BASE */
            baseGoerli: process.env.BASESCAN_API_KEY,
            baseSepolia: process.env.BASESCAN_API_KEY,
            base: process.env.BASESCAN_API_KEY,
        },
        customChains: [
            {
                network: "baseSepolia",
                chainId: 84532,
                urls: {
                    apiURL: "https://api-sepolia.basescan.org/api",
                    browserURL: "https://sepolia.basescan.org"
                }
            }
        ]
    },
};

export default config;
