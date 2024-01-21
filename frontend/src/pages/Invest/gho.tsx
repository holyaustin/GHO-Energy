/* eslint-disable no-inline-comments */
import "dotenv/config";
const ERC20_ABI = require("@aave/contract-helpers/artifacts/ERC20.json");
const { ethers } = require("ethers");
const { Pool } = require("@aave/contract-helpers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GHO_TOKEN_ADDRESS = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";
const AAVE_V3_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
const RECIPIENT_ADDRESS = "0xa6D6f4556B022c0C7051d62E071c0ACecE5a1228";

async function depositETHAndBorrowGHO() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.public.blastapi.io"
  );
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Aave V3 Pool Address
  const poolAddress = AAVE_V3_POOL_ADDRESS; // Replace with the correct Aave V3 Pool address
  const ghoAddress = GHO_TOKEN_ADDRESS; // Replace with the correct GHO token address

  const pool = new Pool(provider, poolAddress, wallet.address);

  // Step 1: Deposit ETH as Collateral
  const depositAmount = ethers.utils.parseEther("1"); // Amount of ETH to deposit
  const depositTx = await wallet.sendTransaction({
    to: poolAddress,
    value: depositAmount,
  });
  await depositTx.wait();

  // Step 2: Borrow GHO
  const borrowAmount = ethers.utils.parseUnits("50", "ether"); // Amount of GHO to borrow
  const interestRateMode = 2; // Stable (1) or Variable (2) interest rate
  const borrowTx = await pool.borrow(
    ghoAddress,
    borrowAmount,
    interestRateMode,
    0,
    wallet.address
  );
  await borrowTx.wait();

  // Step 3: Send a Transaction with GHO
  const ghoTokenContract = new ethers.Contract(ghoAddress, ERC20_ABI, wallet);
  const recipientAddress = RECIPIENT_ADDRESS; // Address to send GHO to
  const transferTx = await ghoTokenContract.transfer(
    recipientAddress,
    borrowAmount
  );
  await transferTx.wait();
}

export default depositETHAndBorrowGHO;
