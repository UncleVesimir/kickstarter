import React, { useEffect, useState } from 'react';
import { useRouter  } from 'next/router';
import {Button, Card, Icon, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3  from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import getCampaign from '../../ethereum/getCampaign';

function CampaignPage ( { minimumContribution, balance, numRequests, approversCount, manager}) {
  // const [hideState, setHideState] = useState(true)
  const { asPath } = useRouter();

  const items = [
    {
      header: `${balance}`,
      meta: 'Current Contract Balance in Ether',
    },
    {
      header: `${numRequests}`,
      meta: 'Total number of funding requests in current Campaign',
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
      {/* <Message icon >
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Just one second</Message.Header>
          Your content is being fetched...
        </Message.Content>
      </Message> */}
    <Card.Group items={items} />
    </Layout>
    )
}

export async function getStaticProps( { params } ) {

  const campaign = await getCampaign(params.slug);

  const campaignDetails = await campaign.methods.getSummary().call();

  return {
    props:   { 
        minimumContribution: campaignDetails['0'],
        balance: campaignDetails['1'],
        numRequests: campaignDetails['2'],
        approversCount: campaignDetails['3'],
        manager: campaignDetails['4']
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

