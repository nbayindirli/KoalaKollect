import { NETWORKS } from "./networks";

export interface NetworkConfig {
    chainId: number;
    url: string;
    accounts: string[];
    nativeDecimals: number;
    allowUnlimitedContractSize?: boolean;
    gas?: number;
    gasPrice?: number;
}

export type NetworkConfigs = {
    [name in NETWORKS]: NetworkConfig;
};

const getAccounts = function () {
    if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY_2) {
        return [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2];
    } else if (process.env.PRIVATE_KEY && !process.env.PRIVATE_KEY_2) {
        return [process.env.PRIVATE_KEY];
    } else if (!process.env.PRIVATE_KEY && process.env.PRIVATE_KEY_2) {
        return [process.env.PRIVATE_KEY_2];
    } else {
        return [''];
    }
};

export const NETWORK_CONFIGS: NetworkConfigs = {
    /* Testnet */
    SEPOLIA: {
      chainId: 11155111,
      gas: 9000000,
      gasPrice: 67000000000,
      url: process.env.SEPOLIA_URL || '',
      accounts: getAccounts(),
      nativeDecimals: 18,
    },
    BASE_GOERLI: {
        chainId: 84531,
        gas: 9000000,
        gasPrice: 67000000000,
        url: process.env.BASE_GOERLI_URL || '',
        accounts: getAccounts(),
        nativeDecimals: 18,
    },
    BASE_SEPOLIA: {
        chainId: 84532,
        gas: 9000000,
        gasPrice: 67000000000,
        url: process.env.BASE_SEPOLIA_URL || '',
        accounts: getAccounts(),
        nativeDecimals: 18,
    },
    /* Mainnet */
    BASE: {
        chainId: 8453,
        url: process.env.BASE_URL || '',
        accounts: getAccounts(),
        nativeDecimals: 18,
    },
};
