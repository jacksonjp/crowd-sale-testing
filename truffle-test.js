JackCoinCrowdsale.deployed().then(function(instance){console.log(instance)});

JackCoinCrowdsale.deployed().then(function(instance) { instance.at(web3.eth.coinbase) ; instance.buyTokens(web3.eth.accounts[1], { gas: 140000, value: 500000000000000000, from: web3.eth.accounts[1] }); });


JackCoinInstance = JackCoin.at('0x588728b2b506a6b70d0b7cbc0799f933aa5cf799');

JackCoinInstance.balanceOf('0xa987F5dC3D872f1c02b98F685F424a47FC0c530c').then(balance => balance.toString(10));
