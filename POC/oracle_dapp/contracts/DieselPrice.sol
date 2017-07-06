/*
   Diesel Price Peg

   This contract keeps in storage a reference
   to the Diesel Price in USD
*/


pragma solidity ^0.4.0;
import "lib/oraclize/ethereum-api/oraclizeAPI.sol";

contract DieselPrice is usingOraclize {

    uint public DieselPriceUSD;
    uint public lpgPriceUSD;
    string public priceUSD;

    event newOraclizeQuery(string description);
    event newDieselPrice(string price);

    function DieselPrice() {
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        //OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        update(); // first check at contract creation
    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        newDieselPrice(result);
        //DieselPriceUSD = parseInt(result, 2); // let's save it as $ cents
        priceUSD = result;
        //lpgPriceUSD = parseInt(result.lpg, 2); // let's save it as $ cents
        // do something with the USD Diesel price
    }

    function update() payable {
        newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("URL", "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices");
    }

}
