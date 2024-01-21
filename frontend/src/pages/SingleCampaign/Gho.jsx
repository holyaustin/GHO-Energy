export {};
/* eslint-disable no-inline-comments */

import { ghoAbi } from "utils/abis";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {
  Pool,
  InterestRate,
  EthereumTransactionTypeExtended,
} from "@aave/contract-helpers";

const GHO_TOKEN_ADDRESS = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";
const AAVE_V3_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
const RECIPIENT_ADDRESS = "0xa6D6f4556B022c0C7051d62E071c0ACecE5a1228";

async function depositETHAndBorrowGHO() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  // Aave V3 Pool Address
  const poolAddress = AAVE_V3_POOL_ADDRESS; // Replace with the correct Aave V3 Pool address

  const ghoAddress = GHO_TOKEN_ADDRESS; // Replace with the correct GHO token address
  const wethGatewayAddress = "0x387d311e47e80b498169e6fb51d3193167d89F7D"; // WETH Gateway

  const pool = new Pool(provider, {
    POOL: poolAddress,
    WETH_GATEWAY: wethGatewayAddress,
  });

  // Step 1: Deposit ETH as Collateral
  const depositAmount = ethers.utils.parseEther("0.001"); // Amount of ETH to deposit
  const depositTx = await signer.sendTransaction({
    to: poolAddress,
    value: depositAmount,
  });

  // console.log("Depositing ETH as collateral...");
  await depositTx.wait();

  // Step 2: Borrow GHO
  const borrowAmount = ethers.utils.parseUnits("0.0005", "ether"); // Amount of GHO to borrow

  const borrowTx: EthereumTransactionTypeExtended[] = await pool.borrow({
    user: RECIPIENT_ADDRESS,
    reserve: GHO_TOKEN_ADDRESS, // Sepolia GHO market
    amount: "125",
    interestRateMode: InterestRate.Stable,
    //debtTokenAddress: "0x80aa933EfF12213022Fd3d17c2c59C066cBb91c7", // Sepolia GHO market
    //onBehalfOf,
    referralCode: "0",
  });
  // const signer = provider.getSigner();
  const txResponse = await signer.sendTransaction(borrowTx);

  await txResponse.tx();

  // Step 3: Send a Transaction with GHO
  const ghoTokenContract = new ethers.Contract(ghoAddress, ghoAbi, signer);
  const recipientAddress = RECIPIENT_ADDRESS; // Address to send GHO to
  const transferTx = await ghoTokenContract.transfer(
    recipientAddress,
    borrowAmount
  );
  await transferTx.wait();
}

export default depositETHAndBorrowGHO;
