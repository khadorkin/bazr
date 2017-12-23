pragma solidity ^0.4.17;

import "./Mortal.sol";

// Fund is the primary storage contract for ether originating from users
contract Fund is Mortal {
    // the direction of a deposit (deposit vs withdrawl)
    enum TransactionDirection { Deposit, Withdraw }

    // Deposit is a record kept of a deposit by a particular github user
    struct Transaction {
        string accountName; // references the github account name
        TransactionDirection direction; // wether the user put money into the fund or took it out
        uint amount; // the amount of ether moved by the transaction
        uint time; // the time that the transaction took place
    }

    // the list of Deposits that this fund has recieved
    Transaction[] transactions;

    // invoked when the fund recieves funds
    function deposit(string accountName) public payable {
        // add a record of the transaction
        transactions.push(Transaction({
          accountName: accountName,
          amount: msg.value,
          time: now,
          direction: TransactionDirection.Deposit
        }));
    }
}
