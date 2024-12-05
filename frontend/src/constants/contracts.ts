export const KOALA_KOLLECT_ADDRESS = '0xAC83417d4FdfE42642F70D97d882aa9e61DFF0ec';
export const KOALA_KOLLECT_ABI = [
  // Events - exactly as defined in KoalaKollectV1Events.sol
  "event RegisteredCreator(address indexed creator)",
  "event CreatedPool(uint256 indexed poolId)",
  "event ClosedPoolBeforeExpiry(uint256 indexed poolId)",
  "event RegisteredKoala(address indexed koala)",
  "event FundedPool(uint256 indexed poolId, address indexed koala, uint256 fundAmount)",
  "event OverfundedPool(uint256 indexed poolId, address indexed koala, uint256 fundAmount)",
  "event SetAuthority(address indexed authority)",

  // View Functions
  "function isRegisteredCreator(address) external view returns (bool)",
  "function isRegisteredKoala(address) external view returns (bool)",
  "function creators(address) external view returns (uint256[] memory poolIds)",
  "function koalas(address) external view returns (uint256[] memory poolIds)",

  // State Changing Functions
  "function registerCreator() external",
  "function registerKoala() external",
  "function createPool() external",
  "function closePoolBeforeExpiry(uint256 poolId) external",
  "function fundPool(uint256 poolId, uint256 fundAmount) external"
]; 