// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract Lottery{
    address public manager;
    address[] public players;
    address public winner;
    constructor() {
        manager = msg.sender;
    }
    function joinPool() public payable{
        require(msg.value > 10000 );
        players.push(msg.sender);   
    }
    function genRandom() private view returns (uint){
        uint random = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
        uint remainder = random%players.length;
        return remainder;
    }
    function pickWinner() public payable{
        require(msg.sender == manager);
        uint random = genRandom();
        winner = players[random];
        payable(winner).transfer(address(this).balance);
        players = new address[](0);
    }
    function getPlayers() public view returns (address[] memory){
        return players;
    }
}