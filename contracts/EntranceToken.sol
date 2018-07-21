pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract EntranceToken is ERC721Token {
  string public name = "EntranceToken";
  string public symbol = "ENTK";

  struct Token {
    string entranceAt;
    uint256 amountOfDrinkToken;
    uint256 price;
  }

  mapping(uint256 => Token) stocks;
  mapping(uint256 => uint256) stockRemainings;

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
    // TODO impl
  }

  function buyToken(uint256 stockId) external payable returns (uint256) {
    // TODO impl
  }

  function useToken(uint256 tokenId) public {
    // TODO impl
  }
}
