require('dotenv').config()
const fs = require('fs');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const path = require('path');
// const compiledCampaign = require('./build/Campaign.json');
const web3_detailsPath = path.join(__dirname, '../web3_details.json')

const gasLimit = '1000000'

const provider = new HDWalletProvider({
  mnemonic:{
    phrase: process.env.MNEUMONIC
  },
  providerOrUrl: process.env.INFURA_ENDPOINT
});

const web3 = new Web3(provider);

function writeDeployAddressToFile(address){
  let web3_details = JSON.parse(fs.readFileSync(web3_detailsPath, 'utf8'));
  
  web3_details['ADDRESS'] = address;

  fs.writeFileSync(web3_detailsPath, JSON.stringify(web3_details));
}


const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from account: ${accounts[0]}`);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object})
    .send({gas: gasLimit, from: accounts[0]});

    writeDeployAddressToFile(result.options.address)

  console.log(`Contract deloped to:${result.options.address}\n   ...address written to file.`);
  
  
  provider.engine.stop();
};

deploy();