//SPDX-License-Identifier: MIT

pragma solidity ^ 0.8.12;


contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public payable {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    uint numRequests;
    mapping( uint => Request) public requests;

    address public manager;
    uint public minimumContribution;
    mapping(address=> bool) public approvers;
    uint public approversCount;

    modifier manager_only() { 
        require(msg.sender == manager);
        _;
    }

    constructor (uint minimum, address contractCreator) {
        manager = contractCreator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        require(!approvers[msg.sender]);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest( string calldata description , uint value, address recipient) 
        public manager_only {

            Request storage r = requests[numRequests++];
            r.description = description;
            r.value = value;
            r.recipient = recipient;
            r.complete =  false;
            r.approvalCount = 0;
            
    }

    function approveRequest(uint index) public payable {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public payable 
        manager_only {
            Request storage request = requests[index];

            require(!request.complete);
            require(request.approvalCount >= (approversCount/2));

            payable(request.recipient).transfer(request.value);
            request.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
                minimumContribution,
                address(this).balance,
                numRequests,
                approversCount,
                manager
        );
    }

    function getRequestCount() public view returns (uint){
        return numRequests;
    }
}