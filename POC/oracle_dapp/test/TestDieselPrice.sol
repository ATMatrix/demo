pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DieselPrice.sol";

contract TestMetacoin {

  function testInitialBalanceUsingDeployedContract() {
    DieselPrice diesel = DieselPrice(DeployedAddresses.DieselPrice());
console.log(diesel.DieselPriceUSD);

    uint expected = 10000;

    Assert.equal(diesel.DieselPriceUSD, expected, "Owner should have 10000 DieselPrice initially");
  }

  function testInitialBalanceWithNewDieselPrice() {
    DieselPrice diesel = new DieselPrice();

    uint expected = 10000;

    Assert.equal(diesel.DieselPriceUSD, expected, "Owner should have 10000 DieselPrice initially");
  }

}
