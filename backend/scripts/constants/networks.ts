export enum FABRICS {
    TESTNET = 'TESTNET', // beta
    MAINNET = 'MAINNET' // prod
}

export namespace TESTNET {
    export enum NETWORKS {
        SEPOLIA = 'SEPOLIA',
        BASE_GOERLI = 'BASE_GOERLI',
        BASE_SEPOLIA = 'BASE_SEPOLIA',
    }
}

export namespace MAINNET {
    export enum NETWORKS {
        BASE = 'BASE',
    }
}

export type Networks = {
    [fabric in FABRICS]: any;
}

type TESTNET_NETWORKS = TESTNET.NETWORKS.SEPOLIA | TESTNET.NETWORKS.BASE_GOERLI | TESTNET.NETWORKS.BASE_SEPOLIA;
type MAINNET_NETWORKS = MAINNET.NETWORKS.BASE;

export type NETWORKS = TESTNET_NETWORKS | MAINNET_NETWORKS;

export const NETWORKS: Networks = {
    TESTNET: TESTNET.NETWORKS,
    MAINNET: MAINNET.NETWORKS,
};
