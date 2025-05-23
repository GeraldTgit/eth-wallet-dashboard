const hre = require("hardhat");

async function main() {
  // Use the same address where your contract is deployed
  const contractAddress = "0x4326be87972fc5b98634f8AF0339224A64dbaB08";

  // Get the contract factory and attach to deployed address
  const NFT = await hre.ethers.getContractFactory("NFTCollection");
  const nft = await NFT.attach(contractAddress);

  // Get signer (default is first account from local node)
  const [owner] = await hre.ethers.getSigners();

  // Call the mint function
  const tx = await nft.mintNFT(
    owner.address,
    "https://my-nft-metadata-url.com/token/1"
  );
  await tx.wait();

  console.log(`NFT minted to ${owner.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
