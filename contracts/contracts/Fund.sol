pragma solidity ^0.4.17;

import "./KillableByServer.sol";

// Fund is the primary storage contract for ether originating from users
contract Fund is KillableByServer {
    // the direction of a deposit (deposit vs withdrawl)
    enum TransactionDirection { Deposit, Withdraw }

    // Deposit is a record kept of a deposit by a particular github user
    struct Transaction {
        address account; // references the github account name
        string projectName; // the name of the project associated with the transaction (nullable)
        TransactionDirection direction; // wether the user put money into the fund or took it out
        uint amount; // the amount of ether moved by the transaction
        uint time; // the time that the transaction took place
    }

    // the list of Deposits that this fund has recieved
    Transaction[] public transaction;
    // we can't use the automatically generated getters because we need the full list
    function numberOfTransactions() public view returns (uint256) {
        return transaction.length;
    }

    // make sure we bubble up the constructors
    function Fund(address _server) KillableByServer(_server) public {}

    // invoked when the fund recieves a deposit
    function () public payable {
        // add a record of the transaction
        transaction.push(Transaction({
          account: msg.sender,
          projectName: "",
          amount: msg.value,
          time: now,
          direction: TransactionDirection.Deposit
        }));
    }

    // invoked by the server to transfer ether from the fund to the recipient
    // after they have provided proof of work
    function transferReward(address recipient, string project, uint amount)
        public
        onlyTrusted
    {
        // transfer the designated amount to the recipient
        recipient.transfer(amount);

        // add a record of the transfer to the transaction history
        transaction.push(Transaction({
          account: recipient,
          projectName: project,
          amount: amount,
          time: now,
          direction: TransactionDirection.Withdraw
        }));
    }
}
