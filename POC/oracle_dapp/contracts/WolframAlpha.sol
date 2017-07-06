/*
   WolframAlpha example

   This contract sends a question request to WolframAlpha
*/


pragma solidity ^0.4.0;
import "lib/oraclize/ethereum-api/oraclizeAPI.sol";

contract WolframAlpha is usingOraclize {

    string public answer;

    event newOraclizeQuery(string description);
    event newWolframAnswer(string answer);

    function WolframAlpha() {
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        //update("temperature in London");
    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        answer = result;
        newWolframAnswer(answer);
        // do something with the question measure..
    }

    function update(string query) payable {
        newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("WolframAlpha", query);
    }
	function query(string question) payable public returns(bool result) {
        newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("WolframAlpha", question);
		return true;
	}

}
