const hre = require("hardhat");

async function main() {
  const [admin, investor1, investor2, investor3] = await ethers.getSigners();
    const LinkToken = await ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy('1000000000000000000000000');
    await linkToken.deployed();
    console.log("token address "+linkToken.address)

    const tokenPrice = "1000000000000000"; //  in wei = 0.001 ETH
    const referrerPercentage = "10";
    const totalTokensForAirdrop = "90000000000000000000";
    const amtClaimedPerAirdrop = "50000000000000000000";
    const LinkTokenCrowdsale = await ethers.getContractFactory("LinkTokenCrowdsale");
    const linkCrowdSale = await LinkTokenCrowdsale.deploy(
      linkToken.address,
      tokenPrice,
      referrerPercentage,
      totalTokensForAirdrop,
      amtClaimedPerAirdrop
    );
    await linkCrowdSale.deployed();
    console.log("crowdsale address "+linkCrowdSale.address)

    const TokenTimeLock = await ethers.getContractFactory("TokenTimeLock");
    const tokenTimeLock = await TokenTimeLock.deploy(
      linkToken.address,
      31536000,
      linkCrowdSale.address
    );
    await tokenTimeLock.deployed();

    await linkToken.transfer(linkCrowdSale.address, '750000000000000000000000'); // Transfer 75% of total supply to crowdsale
    await linkCrowdSale.setTimeLock(tokenTimeLock.address);
    console.log("TimeLock address "+tokenTimeLock.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
