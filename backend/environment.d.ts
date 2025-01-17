/* eslint-disable no-var */

import { pre } from './PrimeRuntimeEnvironment';
import { FABRICS } from './scripts/constants/fabrics';
import { MASTER_NETWORKS, SATELLITE_NETWORKS } from './scripts/constants/networks';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PRIVATE_KEY: string;
            PRIVATE_KEY_2: string;

            /* TESTNET */
            SEPOLIA_URL: string;
            BASE_GOERLI_URL: string;
            BASE_SEPOLIA_URL: string;
            /* MAINNET */
            BASE_URL: string;

            /* etherscan */
            ETHEREUM_API_KEY: string
            BASESCAN_API_KEY: string
        }
    }
}

export {};
