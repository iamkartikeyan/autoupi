import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying AutoUpiSettlementToken with account:", deployer.address);

  const AutoUpiTokenFactory = await ethers.getContractFactory("AutoUpiSettlementToken");
  const tokenContract = await AutoUpiTokenFactory.deploy(deployer.address);
  await tokenContract.waitForDeployment();

  const contractAddress = await tokenContract.getAddress();
  console.log("AutoUpiSettlementToken deployed to address:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
