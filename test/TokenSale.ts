import { expect } from "chai";
import { viem } from "hardhat";
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const TEST_RATIO = 10n;
const TEST_PRICE = 5n;
const TEST_NAME = "MyToken";
const TEST_SYMBOL = "MTK";


async function deployFunction(){
    const [ deployer ] = await viem.getWalletClients();
    const paymentTokenContract =  await viem.deployContract("MyToken");
    const tokenSaleContract = await viem.deployContract("TokenSale", [
        TEST_RATIO, 
        TEST_PRICE,
        paymentTokenContract.address,
        deployer.account.address
    ]);
    return { tokenSaleContract }
}

describe("NFT Shop", async () => {
    describe("When the Shop contract is deployed", async () => {
        it("defines the ratio as provided in parameters", async () => {
            const { tokenSaleContract } = await loadFixture(deployFunction);
            const ratio = await tokenSaleContract.read.ratio();
            expect (ratio).eq(TEST_RATIO);
        })
        it("defines the price as provided in parameters", async () => {
            const { tokenSaleContract } = await loadFixture(deployFunction);
            const ratio = await tokenSaleContract.read.price();
            expect (ratio).eq(TEST_PRICE);
        });
        it("uses a valid ERC20 as payment token", async () => {
            const { tokenSaleContract } = await loadFixture(deployFunction);
            const tokenContractAddress = await tokenSaleContract.read.paymentToken();
            const tokenContract = await viem.getContractAt("MyToken", tokenContractAddress);

            const [name, symbol, decimals, totalSupply] = await Promise.all([
                tokenContract.read.name(),
                tokenContract.read.symbol(),
                tokenContract.read.decimals(),
                tokenContract.read.totalSupply(),
            ]);

            expect(name).to.eq(TEST_NAME);
            expect(symbol).to.eq(TEST_SYMBOL);
            expect(decimals).to.eq(18);
            expect(totalSupply).to.eq(0n);
        });
        it("uses a valid ERC721 as NFT collection", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user buys an ERC20 from the Token contract", async () => {
        it("charges the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        })
        it("gives the correct amount of tokens", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user burns an ERC20 at the Shop contract", async () => {
        it("gives the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        })
        it("burns the correct amount of tokens", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user buys an NFT from the Shop contract", async () => {
        it("charges the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        })
        it("gives the correct NFT", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user burns their NFT at the Shop contract", async () => {
        it("gives the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When the owner withdraws from the Shop contract", async () => {
        it("recovers the right amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        })
        it("updates the owner pool account correctly", async () => {
            throw new Error("Not implemented");
        });
    });
});