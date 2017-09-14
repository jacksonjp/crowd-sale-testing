pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
 /**
  * @title SampleCrowdsaleToken
  * @dev Very simple ERC20 Token that can be minted.
  * It is meant to be used in a crowdsale contract.
  */
 contract JackCoin is MintableToken {

   string public constant name = "Jack Coin";
   string public constant symbol = "JCK";
   uint8 public constant decimals = 18;

 }

 /**
  * @title SampleCrowdsale
  * @dev This is an example of a fully fledged crowdsale.
  * The way to add new features to a base crowdsale is by multiple inheritance.
  * In this example we are providing following extensions:
  * CappedCrowdsale - sets a max boundary for raised funds
  * RefundableCrowdsale - set a min goal to be reached and returns funds if it's not met
  *
  * After adding multiple features it's good practice to run integration tests
  * to ensure that subcontracts works together as intended.
  */
 contract JackCoinCrowdsale is Crowdsale {

   function JackCoinCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet)
     Crowdsale(_startTime, _endTime, _rate, _wallet)
   {
   }

   function createTokenContract() internal returns (MintableToken) {
     return new JackCoin();
   }

 }
