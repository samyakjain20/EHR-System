// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 <0.9.0;

contract PaymentManagement {

    // payment
    struct Payment {
        address sender;
        address reciever;
        uint amount;
        string txHash;
        string date;
    }

    struct ClaimRequest {
        string id;
        address sender;
        address reciever;
        uint amount;
        string status;
        string txHash;
        string date;
    }

    mapping (address => Payment[]) public sendTxAddMapping;
    mapping (address => Payment[]) public recieveTxAddMapping;
    mapping (address => ClaimRequest[]) public sendClaimMapping;
    mapping (address => ClaimRequest[]) public recieveClaimMapping;

    Payment[] public allTx;
    ClaimRequest[] public allClaim;

    function storePayment(address  _reciever, uint _amount, string memory _txHash, string memory _date) external {
        Payment memory payment = Payment({
            sender: msg.sender,
            reciever: _reciever,
            amount: _amount,
            txHash: _txHash,
            date: _date
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

    function storeClaim(string memory _id, address _reciever, uint _amount, string memory _status, string memory _txHash, string memory _date)  external {
        ClaimRequest memory claimRequest = ClaimRequest({
            id: _id,
            sender: msg.sender,
            reciever: _reciever,
            amount: _amount,
            status: _status,
            txHash: _txHash,
            date: _date
        });

        sendClaimMapping[msg.sender].push(claimRequest);
        recieveClaimMapping[claimRequest.reciever].push(claimRequest);
    }

    function getClaimsByStatusRecieve(string memory status) public view returns (ClaimRequest[] memory) {
        ClaimRequest[] storage allClaims = recieveClaimMapping[msg.sender];
        uint count = allClaims.length;
        ClaimRequest[] memory result = new ClaimRequest[](count);
        uint resultCount = 0;

        for (uint i = 0; i < count; i++) {
            if (keccak256(bytes(allClaims[i].status)) == keccak256(bytes(status))) {
                result[resultCount] = allClaims[i];
                resultCount++;
            }
        }

        assembly {
            mstore(result, resultCount)
        }

        return result;
    }

    function getClaimsByStatusSend(string memory status) public view returns (ClaimRequest[] memory) {
        ClaimRequest[] storage allClaims = sendClaimMapping[msg.sender];
        uint count = allClaims.length;
        ClaimRequest[] memory result = new ClaimRequest[](count);
        uint resultCount = 0;

        for (uint i = 0; i < count; i++) {
            if (keccak256(bytes(allClaims[i].status)) == keccak256(bytes(status))) {
                result[resultCount] = allClaims[i];
                resultCount++;
            }
        }

        assembly {
            mstore(result, resultCount)
        }

        return result;
    }

    function updateClaimStatusById(string memory id, string memory newStatus, address _sender) external {
        ClaimRequest[] storage recieveClaims = recieveClaimMapping[msg.sender];
        ClaimRequest[] storage sendClaims = sendClaimMapping[_sender];

        
        for (uint i = 0; i < recieveClaims.length; i++) {
            if (keccak256(bytes(recieveClaims[i].id)) == keccak256(bytes(id))) {
                recieveClaims[i].status = newStatus;
            }
        }

        for (uint i = 0; i < sendClaims.length; i++) {
            if (keccak256(bytes(sendClaims[i].id)) == keccak256(bytes(id))) {
                sendClaims[i].status = newStatus;
            }
        }
    }


}