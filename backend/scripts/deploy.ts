import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { KoalaKollectV0__factory } from "../typechain-types";

async function main() {
  console.log("Deploying YourContract...");

  // Get the ContractFactory and Signer
  const [deployer] = await ethers.getSigners();
  const koalaKollectFactory: KoalaKollectV0__factory = await ethers.getContractFactory("KoalaKollectV0") as KoalaKollectV0__factory;

  // Deploy the contract
  const koalaKollectContract = await koalaKollectFactory.deploy();
  const tx = koalaKollectContract.deploymentTransaction();
  if (tx) {
    const receipt = await tx.wait();
    if (receipt) {
      console.log(`TX receipt hash: ${receipt.hash}`);
      console.log(`Contract Address: ${await koalaKollectContract.getAddress()}`);
      console.log(`Deployed by: ${deployer.address}`);
    }
  }

  // Verify the contract on Etherscan
  // Note: This requires setting up your Etherscan API key in the Hardhat config
  // if (process.env.ETHERSCAN_API_KEY) {
  //   console.log("Verifying contract on Etherscan...");
  //   await yourContract.deployTransaction.wait(6);  // wait for 6 block confirmations
  //   await hre.run("verify:verify", {
  //     address: yourContract.address,
  //     constructorArguments: [],  // Add constructor arguments here if your contract has any
  //   });
  //   console.log("Contract verified on Etherscan");
  // }
  return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
