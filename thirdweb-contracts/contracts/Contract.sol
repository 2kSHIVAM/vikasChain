

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@thirdweb-dev/contracts/extension/ContractMetadata.sol";

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        uint256 amountWithdrawn;
        string image;
        address[] donators;
        uint256[] donations;
        string[] proofOfWithdrawals;
        bool proofFlag;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        
        require(
            campaign.deadline < block.timestamp,
            "The deadline should be in the future"
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.amountWithdrawn = 0;
        campaign.image = _image;
        numberOfCampaigns++;
        campaign.proofFlag=true;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        campaign.amountCollected += msg.value;
    }
    
    function addProof(uint256 _id, string memory cid) public {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.owner == msg.sender,
            "Only the campaign owner can add a proof"
        );
        
        campaign.proofOfWithdrawals.push(cid);
        campaign.proofFlag = true;
    }

    function withdraw(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.owner == msg.sender,
            "Only the campaign owner can withdraw funds"
        );
        uint256 amountToWithdraw = campaign.amountCollected / 10;
        (bool sent, ) = payable(campaign.owner).call{value: amountToWithdraw}("");
        require(
            sent,
            "Failed to send Ether"
        );
        campaign.amountWithdrawn += amountToWithdraw;
        campaign.amountCollected -= amountToWithdraw;
        campaign.proofFlag = false;
    }
    
    function checkProof(uint256 _id) public view returns (bool) {
        Campaign storage campaign = campaigns[_id];
        return campaign.proofFlag;
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
    
    function getProofWithdrawal(uint256 _id) public view returns (string[] memory) {
    Campaign storage campaign = campaigns[_id];
    return campaign.proofOfWithdrawals;
}

}
