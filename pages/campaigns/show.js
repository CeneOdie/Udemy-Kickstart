import React from 'react';
import Layout from "../../components/Layout";
import Contribute from '../../components/Contribute';
import {Card, Form, Input, Button, Grid} from 'semantic-ui-react';
import {Link, Router} from "../../routes";
import Campaign from "../../ethereum/campaign";
import web3 from '../../ethereum/web3';


const showCampaign = (props) => {

    const [items, setItems] = React.useState([]);

    const renderCards = () => {
        const items = [
            {
                header: props.manager,
                description: "Manager",
                style: {overflowWrap: 'break-word'},
            },
            {
                header: props.contrib,
                description: "Minimum Contribution (wei)",
            },
            {
                header: web3.utils.fromWei(props.balance, 'ether'),
                description: "Balance (ether)",
            },
            {
                header: props.reqs,
                description: "Requests",
            },
            {
                header: props.apps,
                description: "Approvers",
            }

        ];
        setItems(items);
    }
    
    React.useEffect(async () => {
        renderCards();
    }, []);

    return (
        <Layout>
            <h3><Link to="/"><a><Button icon="angle left"/></a></Link>Campaign Details </h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Card.Group items = {items}/>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Contribute address={props.address}/> 
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link to={`/campaigns/${props.address}/requests`}><a><Button primary>View Requests</Button></a></Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Layout>
    )
}

showCampaign.getInitialProps = async (props) => {
    console.log(props.query);
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
        address: props.query.address,
        balance: summary[0], 
        contrib: summary[1], 
        reqs: summary[2], 
        apps: summary[3], 
        manager: summary[4]};
}

export default showCampaign;
