import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout'
import {Button, Form, Input, Label, Message } from 'semantic-ui-react'
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3"

function CampaignNew () {
  const router = useRouter();

  const [minimumContribution, setMinimumContribution ] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingFlag, setLoadingFlag] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingFlag(true); setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
      .createCampaign(minimumContribution)
      .send({
        from: accounts[0]
      })
      
      router.push('/')
    }
    catch(err){
      setErrorMessage(err.message);
    }
    finally{
      setLoadingFlag(false);
    }
  }

  return (
    <Layout>
      <h3>Create a New Campaign</h3>
      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>"Minimum Contribution"</label>
          <Input 
            labelPosition='right'
            type='number'
            placeholder='Enter minimum campaign contribution' 
            onChange={(e) => { 
              if(parseInt(e.target.value) < 0){ setMinimumContribution(0)}
              else { setMinimumContribution(parseInt(e.target.value) || "") }
              }
            }
            value={minimumContribution}
          >
            <input />
            <Label style={{borderRadius: '0'}}content="Wei"/>
            <Button loading={loadingFlag} style={{ borderBottomLeftRadius: "0", borderTopLeftRadius: "0"}} labelPosition='right' icon="cloud upload" color='teal' content='Create'/>
          </Input>
        </Form.Field>
        <Message attached="bottom" error header="Oops!" content={errorMessage}/>
      </Form>
    </Layout>
  )
}


export default CampaignNew

