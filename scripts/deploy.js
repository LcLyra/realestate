const hre = require("hardhat");

async function main(){
      
        const Casas = await hre.ethers.getContractFactory("Casas");

        const casasInstance = await Casas.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

        await casasInstance.deployed();

        console.log("Deploy contract at: ", casasInstance.address)
}

main() 
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit = 1;
});
