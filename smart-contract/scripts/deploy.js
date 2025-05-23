const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("NFTCollection");

  // Deploy and wait for it to finish
  const nft = await NFT.deploy();
  await nft.waitForDeployment(); // <-- updated line for newer ethers

  console.log("NFTCollection deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
