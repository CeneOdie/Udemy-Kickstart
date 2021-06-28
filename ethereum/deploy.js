const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("Factory");
    const factory = await Factory.deploy();
    console.log("Deployed to: ", factory.address);
    //0x52c9D87B71A92EecF0b0cE6054C2D1216b22B592
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    })