// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import diesel_artifacts from '../../build/contracts/DieselPrice.json'
import wolfram_artifacts from '../../build/contracts/WolframAlpha.json'
import xiaoi_artifacts from '../../build/contracts/Xiaoi.json'

// DieselPrice is our usable abstraction, which we'll use through the code below.
var DieselPrice = contract(diesel_artifacts);
var WolframAlpha = contract(wolfram_artifacts);
var Xiaoi = contract(xiaoi_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

var answer_element;
var xiaoi_question;
var ask_history ;
window.App = {
  start: function() {
    answer_element = document.getElementById("eng_answer");
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    //MetaCoin.setProvider(web3.currentProvider);
    DieselPrice.setProvider(web3.currentProvider);
    WolframAlpha.setProvider(web3.currentProvider);
    Xiaoi.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      accounts = accs;
      account = accounts[1];
    });

    
    //Set wolfram finish call
      var wolfram;
      WolframAlpha.deployed().then(function(instance) {
        wolfram = instance;
        var event = wolfram.newWolframAnswer();
         event.watch(function(error, result){
            if (!error) {
              console.log(result.args);
              if(result.args.answer == ""){
                answer_element.innerHTML = "Sorry, I can't understand YOUR Question.";
              }else{
              answer_element.innerHTML = "答案:"+result.args.answer;
              }
            }
          });
      });
     ask_history = document.getElementById("ask_history");
      Xiaoi.deployed().then(function(instance) {
        var event = instance.newAskAnswer();
         event.watch(function(error, result){
           var answer;
            if (error || result.args.answer == "") {
              answer = "小i不知道啦！";
              }else{
              answer = eval("'"+result.args.answer+"'");
              }
            document.getElementById("xiaoi_ask").disabled=false;
          document.getElementById("xiaoi_ask").text="对话";
            ask_history.innerHTML =  
              "<br><span class='question'>" + xiaoi_question + "</span>" +
              "<br><span class='answer'>" + answer + "</span>" +
              ask_history.innerHTML;
            })
          });
      DieselPrice.deployed().then(function(instance) {
        var event = instance.newDieselPrice();
         event.watch(function(error, result){
           console.log(result);
           var value;
            if (error || result.args.price == "") {
              value = "小i不知道啦！";
              }else{
              value = result.args.price;
              }
      var json_value = JSON.parse(value);
      var diesel_element = document.getElementById("diesel_price");
      diesel_element.innerHTML = json_value.diesel.valueOf();
      var lpg_element = document.getElementById("lpg_price");
      lpg_element.innerHTML = json_value.lpg.valueOf();
      self.setStatus("价格已更新... ");
            })
          });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },
  refreshPrice: function() {
    var self = this;
    self.setStatus("获取价格中... ");
    var diesel;
    DieselPrice.deployed().then(function(instance) {
      diesel = instance;
      return diesel.update( {from: account,gas: 3000000, value: web3.toWei(1, 'ether')});
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting dieselPrice; see log.");
    });
  },

  engQA: function() {
    var self = this;
    var question = document.getElementById("eng_question").value;
    var wolfram;
    WolframAlpha.deployed().then(function(instance) {
      console.log(question);
      wolfram = instance;
      answer_element.innerHTML = "查询中...";
      return wolfram.query(question, {from: account,gas: 3000000, value: web3.toWei(1, 'ether')});
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting answer; see log.");
    });
  },
  xiaoiAsk: function() {
    var self = this;
    xiaoi_question = document.getElementById("xiaoi_question").value;
    if(xiaoi_question == ""){
      return;
    }
    document.getElementById("xiaoi_ask").disabled=true;
    document.getElementById("xiaoi_ask").text="回答中,请等待...";
    var encoding_question = encodeURI(xiaoi_question)
    Xiaoi.deployed().then(function(instance) {
      console.log(xiaoi_question);
      return instance.ask("json(https://rgfgeptasy.localtunnel.me/xiaoi/ask?question="+encoding_question+").result", 
          {from: account,gas: 3000000, value: web3.toWei(1, 'ether')});
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error ask xiaoi; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
