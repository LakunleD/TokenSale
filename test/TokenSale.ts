import { expect } from "chai";
import { viem } from "hardhat";
import { parseEther } from "viem";
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const TEST_RATIO = 10n;
const TEST_PRICE = 5n;
const TEST_NAME = "MyToken";
const TEST_SYMBOL = "MTK";
const TEST_NFT_NAME = "MyNFT";
const TEST_NFT_SYMBOL = "NFT";
const TEST_BUY_TOKENS_VALUE = parseEther("5");


async function deployFunction(){
    const publicClient = await viem.getPublicClient();
    const [ deployer, acc1, acc2 ] = await viem.getWalletClients();
    const tokenContract =  await viem.deployContract("MyToken");
    const nftContract = await viem.deployContract("MyNFT");
    const tokenSaleContract = await viem.deployContract("TokenSale", [
        TEST_RATIO, 
        TEST_PRICE,
        tokenContract.address,
        nftContract.address
    ]);

    const code = await tokenContract.read.MINTER_ROLE();

    // Giving role
    const roleTx = await tokenContract.write.grantRole([
        code,
        tokenSaleContract.address,
    ]);

    await publicClient.getTransactionReceipt({ hash: roleTx });

    return { 
        publicClient,
        deployer,
        acc1,
        acc2,
        tokenContract,
        nftContract,
        tokenSaleContract
     }
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
            const { tokenSaleContract, acc1, publicClient, tokenContract } = await loadFixture(deployFunction);
            const balanceBefore = await tokenContract.read.balanceOf([acc1.account.address]);

            const buyTokensTx = await tokenSaleContract.write.buyTokens({ 
                value: TEST_BUY_TOKENS_VALUE,
                account: acc1.account,
            });
            await publicClient.getTransactionReceipt({ hash: buyTokensTx });
            const balanceAfter = await tokenContract.read.balanceOf([acc1.account.address]);

        
            const diff = balanceAfter - balanceBefore;
            expect(diff).to.eq((TEST_BUY_TOKENS_VALUE * TEST_RATIO));

        });
    })
    describe("When a user burns an ERC20 at the Shop contract", async () => {
        it("gives the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        })
        it("burns the correct amount of tokens", async () => {
            const { tokenSaleContract, acc1, publicClient, tokenContract } = await loadFixture(deployFunction);

            const buyTokensTx = await tokenSaleContract.write.buyTokens({ 
                value: TEST_BUY_TOKENS_VALUE,
                account: acc1.account,
            });
            await publicClient.getTransactionReceipt({ hash: buyTokensTx });

            const balanceBeforeBurn = await tokenContract.read.balanceOf([acc1.account.address]);

            const approveTokensTx = await tokenContract.write.approve(
                [tokenSaleContract.address, balanceBeforeBurn / 2n],
                {
                    account: acc1.account,
                }
            );
            await publicClient.getTransactionReceipt({ hash: approveTokensTx });

            const burnTokensTx = await tokenSaleContract.write.returnTokens([ 
                balanceBeforeBurn / 2n 
            ], 
            {
                account: acc1.account,
            });
            await publicClient.getTransactionReceipt({ hash: burnTokensTx });

            const balanceAfterBurn = await tokenContract.read.balanceOf([acc1.account.address]);
            const diff = balanceBeforeBurn - balanceAfterBurn;
            expect(diff).to.eq(balanceBeforeBurn / 2n);
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