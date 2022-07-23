const path = require('path');
const fs = require('fs');
const solc = require('solc');


const lotteryPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf-8');


let compileInput = {
    language: 'Solidity',
    sources: {
        'lottery.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

module.exports = JSON.parse(solc.compile(JSON.stringify(compileInput))).contracts['lottery.sol'].Lottery;
// module.exports = solc.compile(JSON.stringify(compileInput)).contracts['inbox.sol'];
