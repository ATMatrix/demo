/*
*/


pragma solidity ^0.4.0;
import "/Users/liujun/Documents/workspace_block/ethereum-api/usingOraclize.sol";

contract Xiaoi is usingOraclize {
    
    event newAsk(string question);
    event newAskAnswer(string answer);

    function Xiaoi() {
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        newAskAnswer(result);
    }
    
    function ask(string question) payable {
        oraclize_query("URL", question);
    }
    
}

