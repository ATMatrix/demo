# demo
ATmatrix is a long-term project. At every stages, we build demos for POC, validation.
## Install
### Install Etherenum Client
For test, install [testprc](https://github.com/ethereumjs/testrpc "Install
testrpc")
### Install Oraclize Bridge
Install [Oraclize Bridge](https://github.com/oraclize/ethereum-bridge "Oraclize
Bridge")
## Run Demo
### Start Ethereum Client
testrpc --mnemonic "my test example" --accounts 50
### Start Oraclize Bridge
node bridge -H localhost:8545 -a 49 –dev --skip
### Run Demo Dapp
truffle deploy
npm run dev

Run the [Demo](http://localhost:8080 "Demo") in your Browser!
