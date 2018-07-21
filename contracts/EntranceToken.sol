pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract EntranceToken is ERC721Token, Ownable {
  using SafeMath for uint256;

  string public name = "EntranceToken";
  string public symbol = "ENTK";

  struct Token {
    string entranceAt;
    uint256 amountOfDrinkToken;
    uint256 price;
  }

  Token[] stocks;
  uint256[] stockRemainings;

  Token[] tokens;

  mapping(uint256 => Token) tokens;

  address drinkTokenAddress;

  constructor(address _drinkTokenAddress) public {
    ERC721Token(name, symbol);
    drinkTokenAddress = _drinkTokenAddress;
  }

  function createStock(
    string entranceAt,
    uint256 amountOfDrinkToken,
    uint256 price,
    uint256 amount) public onlyOwner {

    require(entranceAt != "");
    require(amountOfDrinkToken >= 0);
    require(price >= 0);
    require(amount > 0);

    Token memory stock = Token(entranceAt, amountOfDrinkToken, price);
    uint256 stockId = stocks.push(stock) - 1;
    stockRemainings.push(amount);
  }

  function buyToken(uint256 stockId) external payable returns (uint256 tokenId) {
    uint256 remainings = stockremainings[stockId];
    require(remainings > 0);

    Stock memory token = stocks[stockId];
    require(msg.value >= token.price);

    tokenId = tokens.push(token) - 1;

    super._mint(msg.sender, tokenId);
  }

  function useToken(uint256 tokenId) public {
    // TODO impl
  }
}
