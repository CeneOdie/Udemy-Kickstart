import React from 'react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import {Button, Card, Icon} from 'semantic-ui-react';
import {Link} from "../routes";

const index = (props) => {    

    const [items, setItems] = React.useState([]);

    const renderCampaigns = async () => {
        const items = await Promise.all(props.campaigns.map(async address => {
            const campaign = Campaign(address);
            const approvers = await campaign.methods.approversCount().call();
            const balance = await web3.utils.fromWei(await web3.eth.getBalance(address), 'ether');
            const reqs = await campaign.methods.getRequestsCount().call();
            
            return {
                header: address,
                meta: <> <Icon name = "user"/> {approvers} <Icon name="file"/> {reqs} <Icon name="ethereum" /> {balance} </>,
                description: <Link to={`/campaigns/${address}`}><a>View Campaign</a></Link>,
                fluid: true
            }
        }));
        setItems(items);
    }
    
    React.useEffect(() => {
        renderCampaigns();
    }, []);

    return (
        <Layout>
            <h3>Open Campaigns</h3>
            <Link to ="/campaigns/new">
                <a>
                    <Button 
                    floated = "right"
                    content="Create Campaign" 
                    icon="add circle" primary/>
                </a>
            </Link>
            <Card.Group items={items}/>
        </Layout>
    )
}

index.getInitialProps = async ({}) => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return {campaigns};
}

export default index
