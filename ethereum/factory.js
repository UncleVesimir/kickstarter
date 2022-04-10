import web3_details from '../web3_details.json'
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

let instance = new web3.eth.Contract(
    CampaignFactory.abi,
    web3_details.ADDRESS
  );

export default instance;