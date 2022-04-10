import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import { Button, Card, Icon } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import react from 'react';
import Layout from '../components/Layout';



function CampaignIndex ( { campaigns = [] }) {
  const router = useRouter();
  const { isFallback } = router;

  if( isFallback ){
    return <div>Loading...</div>
  }

  function renderCampaigns() {
    return campaigns.map( campaign => {
     return {
        header: campaign,
        description: campaign.description,
        meta: `Campaign Recipient: ${campaign.recipient}`,
        onClick: () => {router.push(`/campaigns/${campaign}`)},
        fluid: true
      }
    })
  }

  function handleClick_navigate(path){
    router.push(path);
  }

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Button floated="right" animated color='orange' onClick = {() => handleClick_navigate('/campaigns/new')}>
        <Button.Content visible>Create Campaign</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow right' />
        </Button.Content>
      </Button>
      <Card.Group items={renderCampaigns()}/>
    </Layout>
  )
  
}

export async function getStaticProps() {

    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { 
      props: { campaigns },
      revalidate: 1
    };
}


export default CampaignIndex;