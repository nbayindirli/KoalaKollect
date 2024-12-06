import { ethers } from "hardhat";
import hre from "hardhat";
import { KoalaKollectV1__factory } from "../typechain-types";

async function main() {
  console.log("Deploying YourContract...");

  // Get the ContractFactory and Signer
  const [deployer] = await ethers.getSigners();
//   const koalaKollectFactory: KoalaKollectV0__factory = await ethers.getContractFactory("KoalaKollectV0") as KoalaKollectV0__factory;
  const koalaKollectFactory: KoalaKollectV1__factory = await ethers.getContractFactory("KoalaKollectV1") as KoalaKollectV1__factory;

  // Deploy the contract
  const koalaKollectContract = await koalaKollectFactory.deploy();
  const tx = koalaKollectContract.deploymentTransaction();
  if (tx) {
    const receipt = await tx.wait();
    if (receipt) {
      console.log(`✅ TX receipt hash: ${receipt.hash}`);
      console.log(`✅ Contract Address: ${await koalaKollectContract.getAddress()}`);
      console.log(`✅ Deployed by: ${deployer.address}`);
    }
  }

  const koalaKollectAddress = await koalaKollectContract.getAddress();

  console.log("✅ KoalaKollect deployed to:", koalaKollectAddress);

  // Add delay to let Base Sepolia index the deployment
  console.log("⏳ Waiting for 15 seconds before verification...");
  await new Promise(resolve => setTimeout(resolve, 15000));

  try {
    await hre.run('verify:verify', {
        address: koalaKollectAddress,
        constructorArguments: []
    });
    console.log("✅ Contract verification successful");
  } catch (error) {
    console.log("❌ Contract verification failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
