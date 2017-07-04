var DieselPrice = artifacts.require("./DieselPrice.sol");
var WolframAlpha = artifacts.require("./WolframAlpha.sol");
var Xiaoi = artifacts.require("./Xiaoi.sol");

module.exports = function(deployer) {
  deployer.deploy(DieselPrice);
  deployer.deploy(WolframAlpha);
  deployer.deploy(Xiaoi);
};
