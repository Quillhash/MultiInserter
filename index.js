const fs = require('fs');
const solc = require('solc');
const ethjsaccount = require('ethjs-account');
const Config = require('./config.js');
const ethers = require('ethers');

const contractAddress = Config.contractAddress;
const privateKey = Config.privateKey;
const tokenInput = fs.readFileSync('./Contracts/MultiInsert.sol');
const tokenOutput = solc.compile(tokenInput.toString());

const network = Config.networkType;
const PROVIDER = ethers.providers.getDefaultProvider('rinkeby');
const wallet = new ethers.Wallet(privateKey,PROVIDER);
const contractAbi = JSON.parse(tokenOutput.contracts[':MultiInsert'].interface);
const contract = new ethers.Contract(contractAddress,contractAbi,wallet);
const data = require('./Data/address.js');
const senderAddress = ethjsaccount.privateToAccount(privateKey).address;

 const eachRoundAddress = 5;
 const dataLength = data.length;
 const rounds = dataLength / eachRoundAddress;


 async function setClaimers(startRound) {
    let round = startRound;
    let topIndex = eachRoundAddress * round;
    let currentIndex = eachRoundAddress * (round - 1);
    let addresses =[];
    for(let i =  currentIndex; i< topIndex; i++) {
      let address = data[i];
      console.log(address);
      addresses.push(address);
    
    }
    const tx = await contract.setClaimers(addresses);
    console.log(tx);
    await waitForConfirmation(tx.hash);
    let newRound = round +1;
    if(newRound <= rounds ) {
        setClaimers(newRound);
    }
 }

 async function waitForConfirmation(txHash) {
    return new Promise(async (resolve,reject)=>{
        try {
           await PROVIDER.waitForTransaction(txHash);
            console.log("I am done");
            resolve(true);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
 }

  async function calculateNonce(){
    return new Promise(async (resolve,reject)=>{
        try {
          const nonce =  await wallet.getTransactionCount();
            resolve(nonce);

        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
  
}


 async function initiateSettlement() {
   await setClaimers(1);
 }

 initiateSettlement();

