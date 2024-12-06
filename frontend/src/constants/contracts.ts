export const KOALA_KOLLECT_V1_ADDRESS = process.env.NEXT_PUBLIC_KOALA_KOLLECT_ADDRESS as `0x${string}`;
export const KOALA_KOLLECT_V1_ABI = [
  // Your contract ABI here
  {
    name: "registerCreator",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "isRegisteredCreator",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "isRegisteredKoala",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "registerKoala",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // ... other ABI entries
] as const; 