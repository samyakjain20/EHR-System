// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 <0.9.0;

contract PaymentManagement {

    // payment
    struct Payment {
        address sender;
        address reciever;
        uint amount;
        string txHash;
    }

    mapping (address => Payment[]) public sendTxAddMapping;
    mapping (address => Payment[]) public recieveTxAddMapping;

    Payment[] public allTx;

    function storePayment(address  _reciever, uint _amount, string memory _txHash) external {
        Payment memory payment = Payment({
            sender: msg.sender,
            reciever: _reciever,
            amount: _amount,
            txHash: _txHash
        });

        sendTxAddMapping[msg.sender].push(payment);
        recieveTxAddMapping[payment.reciever].push(payment);
    }

    function getSendPayment() public view returns (Payment[] memory payments) {
        return sendTxAddMapping[msg.sender];
    }

    function getRecievePayment() public view returns (Payment[] memory payments) {
        return recieveTxAddMapping[msg.sender];
    }
}