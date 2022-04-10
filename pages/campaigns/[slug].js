import React, { useEffect, useState } from 'react';
import { useRouter  } from 'next/router';
import {Card, Grid} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3  from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import getCampaign from '../../ethereum/getCampaign';
import ContributeForm from '../../components/ContributeForm';

function CampaignPage ( { minimumContribution, balance, numRequests, approversCount, manager, campaignAddress}) {
  // const [hideState, setHideState] = useState(true)

  const items = [
    {
      header: `${web3.utils.fromWei(balance, 'ether')}`,
      meta: 'Current Contract Balance in Ether',
      description: 'Amount of funds this Campaign has left to spend',
    },
    {
      header: `${numRequests}`,
      meta: 'Total number of funding requests in current Campaign',
      description: 'A request tries to with draw Campaign funds from the Campgaign. Request must be approved by confirms before funds can be withdrawn',
    },
    {
      header: `${approversCount}`,
      meta: 'Number of contributers to this Campaign',
    },
    {
      header: `${minimumContribution}`,
      meta: 'Minimum Contribution required to contribute to this Campaign (Wei)',
    },
    {
      header: `${manager}`,
      description: 'The owner of this Ethereum Address can create, approve, and finalize all funding requests on this Campaign ',
      meta: 'Address of Campaign Manager',
      style: {overflowWrap: 'break-word'}
    },
    
  ]
  
  

  return (
    <Layout>
      <Grid>
        <Grid.Column width={10}>
          <Card.Group items={items} />
        </Grid.Column>
        <Grid.Column width={6}>
          <ContributeForm campaignAddress={campaignAddress} />
        </Grid.Column>
      </Grid>
    </Layout>
    )
}

export async function getStaticProps( { params } ) {

  const campaignAddress = params.slug;

  const campaign = await getCampaign(campaignAddress);

  const campaignDetails = await campaign.methods.getSummary().call();

  return {
    props:   { 
        minimumContribution: campaignDetails['0'],
        balance: campaignDetails['1'],
        numRequests: campaignDetails['2'],
        approversCount: campaignDetails['3'],
        manager: campaignDetails['4'],
        campaignAddress: campaignAddress
     } 
  }
}

export async function getStaticPaths() {

  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call()
  
  const campaignSlugs = deployedCampaigns.map((campaignAddress) => {
    return { params: { slug: campaignAddress } }
  })

  return {
    paths: campaignSlugs,
    fallback: true // false or 'blocking'
  };
}

export default CampaignPage

