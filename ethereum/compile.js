const path = require("path");
const solc = require ("solc");
const fs = require("fs-extra");

const fname = 'Campaign.sol'

//Delete Build folder for clean compile

const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath)

//Compile contract

const sourcePath = path.resolve(__dirname, 'contracts', fname);
const source = fs.readFileSync(sourcePath, "utf8");

let compilerInput = {
  language: 'Solidity',
  sources: {
    [fname]:
    {
      content:source
    }
  },
  settings:
  {
    optimizer:
    {
      enabled: true
    },
    outputSelection:
    {
        '*':{
            '*':['*']
        }
    }
  }
}


output = JSON.parse(solc.compile(JSON.stringify(compilerInput))).contracts[fname];

// console.log(output)

fs.ensureDirSync(buildPath);

for (let contract in output){
  fs.outputJSONSync(
    path.resolve(buildPath, contract + '.json'),
    output[contract]
  )
}


// fs.writeFileSync( output.contracts[fname][(fname.substring(0, fname.length - 4))]

// fs.writeFile('contract.json', JSON.stringify(output), ()=> {});

