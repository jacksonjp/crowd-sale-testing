import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSContract from '../../../build/contracts/JackCoinCrowdsale.json';
import CoinContract from '../../../build/contracts/JackCoin.json';
import { default as contract } from 'truffle-contract';
var jackSale = contract(CSContract);
var JackCoin = contract(CoinContract);

class Home extends Component {
  constructor() {
    super();
    this.state = {
      amountRaised: 0,
      amountUpdated: false,
      address: '',
      saleEnd: '',
      etherAddress: '',
      etherBalance: 0,
      transactions: []
    };
    this.getTokenBalance = this.getTokenBalance.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ etherAddress: event.target.value });
  }
  amountRaised() {
    if (this.props.web3) {
      var web3 = this.props.web3;
      jackSale.setProvider(web3.currentProvider);
      JackCoin.setProvider(web3.currentProvider);
      var that = this;
      jackSale.deployed().then(function(csIntance) {
        csIntance.weiRaised.call().then(function(wei) {
          var ether = web3.fromWei(wei, 'ether').toString();
          that.setState({
            amountRaised: ether,
            address: csIntance.address
          });
        });
        csIntance.endTime.call().then(function(time) {
          that.setState({
            saleEnd: new Date(time.toString() * 1000).toDateString()
          });
        });
        csIntance.token.call().then(function(address) {
          that.setState({
            tokenAddress: address.toString()
          });
        });
        var events = csIntance.allEvents({ fromBlock: 0, toBlock: 'latest' });
        events.watch(function(error, log) {
          var logs = that.state.transactions;
          logs.push(log);
          that.setState({
            transactions: logs
          });
        });
        events.get(function(error, logs) {});
      });
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.web3 && !this.state.amountUpdated) {
      this.setState({ amountUpdated: true }, function() {
        this.amountRaised();
      });
    }
  }
  getTokenBalance() {
    var that = this;
    var web3 = this.props.web3;
    JackCoin.at(this.state.tokenAddress).then(function(instance) {
      instance.balanceOf(that.state.etherAddress).then(function(balance) {
        var ether = web3.fromWei(balance, 'ether').toString();
        that.setState({
          etherBalance: ether
        });
      });
    });
  }
  render() {
    if (!this.props.web3) return <div>Loading....</div>;
    var web3 = this.props.web3;
    var tsList = this.state.transactions.map(function(ts, key) {
      var purchaser = ts.args;
      var coins = web3.fromWei(purchaser.amount, 'ether').toString();
      return (
        <p key={key}>
          <a style={{ color: 'blue' }}>{purchaser.purchaser}</a> purchased{' '}
          <strong>{coins}</strong> Jack Coin(s)
        </p>
      );
    });
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Sale End Date: {this.state.saleEnd}</h1>
            Ether raised: {this.state.amountRaised}
            <br />
            Please send Ether to this Address: <b>{this.state.address}</b>
            <br />
            <br />
            Type Address to check JackCoin Balance
            <br />
            <br />
            <input
              value={this.state.etherAddress}
              onChange={this.handleChange}
            />
            <button onClick={() => this.getTokenBalance()}>Get Balance</button>
            {this.state.etherBalance ? (
              <div>
                <br />
                You have {this.state.etherBalance} Jack Coin(s)
              </div>
            ) : (
              ''
            )}
            <br />
            <br />
            {this.state.transactions.length ? (
              <div>
                <h2>Transaction History</h2>
                <div>{tsList}</div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </main>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3.web3Instance
  };
};
export default connect(mapStateToProps)(Home);
