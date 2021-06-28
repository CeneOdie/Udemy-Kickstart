pragma solidity ^0.4.17;

contract Factory {
    
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address campaign = new Campaign(msg.sender, minimum);
        deployedCampaigns.push(campaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    
    struct Vote {
        address voter;
        bool voted;
        bool vote;
    }
    
    struct Request {
        address recipient;
        string description;
        uint spendAmount;
        bool complete;
        mapping (address => bool) approvals;
        uint approvalCount;
        
        // Vote[] votes;
        // uint[3] public votes; //{yesses, nos, not responded}
    }
    
    
    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    

    modifier restricted() {
        require(msg.sender == manager);
        _;
        
    }
    
    modifier forApprovers() {
        require(approvers[msg.sender]);
        _;
    }
    
    function Campaign(address caller, uint minimum) public{
        manager = caller;
        minContribution = minimum;
    }
    
    function contribute() public payable{
        require(msg.value >= minContribution);
        approvers[msg.sender] = true;
        approversCount++;
        
    }
    
    function createRequest(address recipientIn, string desc, uint amount) public restricted {
        
        Request memory newRequest = Request({
            recipient: recipientIn,
            description: desc,
            spendAmount: amount,
            complete: false,
            approvalCount: 0
            
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint requestIndex) public forApprovers {
        
        Request storage request = requests[requestIndex];
        
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        
        require(request.approvalCount > (approversCount/2));
        
        require(request.spendAmount <= this.balance);
        request.recipient.transfer(request.spendAmount);
        
        request.complete = true;
    }
    
    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return (
            this.balance,
            minContribution,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    
}
