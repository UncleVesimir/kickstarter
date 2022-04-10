import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Label, Message, Transition } from 'semantic-ui-react';
import getCampaign from '../ethereum/getCampaign';
import web3 from '../ethereum/web3';

function ContributeForm({ campaignAddress }) {
  const [contribution, setContribution] = useState('');
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [message, setMessage] = useState({
    header: "",
    content: "",
    isError: false,
    isSuccess: false
  })
  const [visible, setVisibility] = useState(false);


  async function handleSubmit(event) {
    event.preventDefault();
    setLoadingFlag(true);
    setVisibility(false);
    setMessage({ ...message, isError: false, isSuccess: false });

    console.log(typeof (web3.utils.toWei(contribution, 'ether')))

    try {
      const campaign = await getCampaign(campaignAddress);

      const accounts = await web3.eth.getAccounts();

      console.log(accounts[0])

      await campaign.methods.contribute().send(
        {
          from: accounts[0],
          value: web3.utils.toWei(contribution, 'ether'),
          gas: '1000000'
        });

      setMessage({
        header: "Congrats! You've successfully contributed to the Campaign!",
        content: "You can now approve requests to this Campaign",
        isSuccess: true,
        display: "block"
      });
      setVisibility(true)

      setTimeout(() => { 
        setMessage({ ...message, isSuccess: false });
        setVisibility(false)
       }, 10000)
    }
    catch (err) {
      console.error(err)
      setMessage({
        header: "Oops...",
        content: "It looks like there was an error...",
        isError: true,
      })
      setVisibility(true);
    }
    finally {
      setLoadingFlag(false)
    }

  }

  return (

    <Form onSubmit={handleSubmit} error={message.isError} success={message.isSuccess}>
      <Form.Field>
        <label>Contribute to this Campaign!</label>
        <Input
          labelPosition='right'
          type='number'
          placeholder='Enter your contribution'
          onChange={(e) => {
            if (/-\d*\.*\d*/.test(e.target.value)) { setContribution(0) }
            else { setContribution(e.target.value) || 0 }
          }
          }
          value={contribution}
        >
          <input />
          <Label style={{ borderRadius: '0' }} content="Eth" />
        </Input>
      </Form.Field>
      <Transition.Group>
        { ((visible && message.isSuccess) && 
            <Message attached="bottom" success header={message.header} content={message.content} />)}
        { ((visible && message.isError) && 
            <Message attached="bottom" error header={message.header} content={message.content} />)
        }
      </Transition.Group>
      <Button loading={loadingFlag} labelPosition='right' icon="cloud upload" color='teal' content='Contribute' />
    </Form>
  )

}


export default ContributeForm;