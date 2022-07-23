const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const {abi, evm} = require('../compile');

const web3 = new Web3(ganache.provider());
let accounts, lottery;
beforeEach(async  ()=>{
  accounts=  await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
  .deploy({data: evm.bytecode.object})
  .send({from: accounts[0], gas: '1000000'});
});
describe("Lottery contract", ()=>{
    it('deploys a contract', ()=>{
        assert.ok(lottery.options.address);
    });
    it('joins pool', async ()=>{
        await lottery.methods.joinPool().send({from:accounts[1], value: '20000'});
        let player = await lottery.methods.players(0).call();
        assert.equal(player, accounts[1]);      
    });
    it('check ether quantity', async ()=>{
        try {
            await lottery.methods.joinPool().send({from:accounts[1], value: '5000'});
            throw(false);   
        } catch (error) {
            assert.ok(error);
        }
    });
    it("many can join pool", async ()=>{
        await lottery.methods.joinPool().send({from:accounts[1], value: '20000'});
        await lottery.methods.joinPool().send({from:accounts[2], value: '20000'});
        await lottery.methods.joinPool().send({from:accounts[3], value: '20000'});
        let players = await lottery.methods.getPlayers().call();
        assert.equal(3, players.length);
        assert.equal(players[0], accounts[1]);
        assert.equal(players[1], accounts[2]);
        assert.equal(players[2], accounts[3]);
    });
    it("check manager before picking winner", async()=>{
        try {
            await lottery.methods.joinPool().send({from:accounts[1], value: '20000'});
            await lottery.methods.joinPool().send({from:accounts[2], value: '20000'});
            await lottery.methods.pickWinner().send({from:accounts[1]});
            throw(false);  
        } catch (error) {
            assert.ok(error);
        }

    });
    it("transfer money to winner",async  ()=>{
       
        await lottery.methods.joinPool().send({from:accounts[1], value: '20000000000000000000'});
        await lottery.methods.joinPool().send({from:accounts[2], value: '20000000000000000000'});
        let initialBalance = await web3.eth.getBalance(accounts[1]);
        await lottery.methods.pickWinner().send({from:accounts[0]});
        let finalBalance = await web3.eth.getBalance(accounts[1]);
        let players = await lottery.methods.getPlayers().call();
        let dif = finalBalance-initialBalance;
        assert.equal(dif, 40000000000000000000);
        assert.equal(0, players.length);
        



    })

})