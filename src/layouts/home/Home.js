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
      etherBalance: 0
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
