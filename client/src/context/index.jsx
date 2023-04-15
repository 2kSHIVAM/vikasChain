import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
// import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // const { contract } = useContract('0x7A627B71F055384AcEfe2C1FAF3104B4D9FC352C');
  // const { contract } = useContract('0x7De8756f14C5531B186300C682FC15173123Eef1');
  // const { contract } = useContract('0x62DAF51161D4be11C80A2F546ff30468327f4FEA');
  const { contract } = useContract('0x7B433C8e492efefeFeC53ba2f5a5bB7531Fa15eD');

  

  
  
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      amountWithdrawn: ethers.utils.formatEther(campaign.amountWithdrawn.toString()),
      image: campaign.image,
      pId: i
    }));
    console.log(parsedCampaings)
    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const withdraw = async(pId)=>{
    const data= await contract.call('withdraw',pId)
    return data;
  }

  const getWithdrawFlag = async(pId)=>{
    const data = await contract.call('checkProof',pId)
    return data;
  }

  const addProof = async(pId,cid)=>{
    const data = await contract.call('addProof',pId,cid)
    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const getProofOfWork=async(pId)=>{
    const data= await contract.call('getProofWithdrawal',pId);
    console.log(data);
    return data;

  }

  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign, //remaining it publishCampaign to createCampaign
        getCampaigns,
        getUserCampaigns,
        donate,
        withdraw,
        getDonations,
        getWithdrawFlag,
        addProof,
        getProofOfWork
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);