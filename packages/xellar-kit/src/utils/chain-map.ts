import { ChainId, Network } from '@xellar/sdk';
import { polygonAmoy } from 'viem/chains';

export const chainMap: Record<number, Network> = {
  [ChainId.ETHEREUM]: Network.ETHEREUM,
  [ChainId.POLYGON]: Network.POLYGON,
  [ChainId.BINANCE_SMART_CHAIN]: Network.BINANCE_SMART_CHAIN,
  [ChainId.AVALANCHE]: Network.AVALANCHE,
  [ChainId.FANTOM]: Network.FANTOM,
  [ChainId.ARBITRUM_ONE]: Network.ARBITRUM_ONE,
  [ChainId.OPTIMISM]: Network.OPTIMISM,
  [ChainId.IMMUTABLE]: Network.IMMUTABLE,
  [ChainId.X_LAYER]: Network.OKX_X_LAYER,
  [ChainId.LISK]: Network.LISK,
  [ChainId.BASE]: Network.BASE,
  [ChainId.KAIA]: Network.KAIA,
  [ChainId.SKALE_CALYPSO]: Network.SKALE_CALYPSO,
  [ChainId.SKALE_EUROPA]: Network.SKALE_EUROPA,
  [ChainId.SKALE_NEBULA]: Network.SKALE_NEBULA,
  [ChainId.SKALE_TITAN]: Network.SKALE_TITAN,
  [ChainId.MANTA_PACIFIC]: Network.MANTA_PACIFIC,
  [ChainId.ETHEREUM_HOLESKY]: Network.ETHEREUM_HOLESKY,
  [ChainId.ETHEREUM_SEPOLIA]: Network.ETHEREUM_SEPOLIA,
  [ChainId.BINANCE_SMART_CHAIN_TESTNET]: Network.BINANCE_SMART_CHAIN_TESTNET,
  [ChainId.POLYGON_MUMBAI]: Network.POLYGON_POS_TESTNET,
  [polygonAmoy.id]: 'polygon-pos-amoy-testnet' as Network,
  [ChainId.LISK_SEPOLIA]: Network.LISK_SEPOLIA,
  [ChainId.STORY_TESTNET]: Network.STORY_TESTNET,
  [ChainId.SKALE_CALYPSO_TESTNET]: Network.SKALE_CALYPSO_TESTNET,
  [ChainId.SKALE_EUROPA_TESTNET]: Network.SKALE_EUROPA_TESTNET,
  [ChainId.SKALE_NEBULA_TESTNET]: Network.SKALE_NEBULA_TESTNET,
  [ChainId.SKALE_TITAN_TESTNET]: Network.SKALE_TITAN_TESTNET,
  [ChainId.MANTA_PACIFIC_SEPOLIA]: Network.MANTA_PACIFIC_SEPOLIA
};
