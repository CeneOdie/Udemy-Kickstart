import React from 'react';
import Layout from '../../../components/Layout';
import {Form, Button, Message, Input, Grid}  from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import {Link, Router} from '../../../routes';
import web3 from '../../../ethereum/web3';

const newRequest = (props) => {
    const [msg, setMsg] = React.useState('');
    const [working, setWorking] = React.useState(false);
    const [desc, setDesc] = React.useState('');
    const [value, setValue] = React.useState('');
    const [recipient, setRecipient] = React.useState('');

    const handleClick = async (e) => {
        e.preventDefault();
        setMsg('');
        setWorking(true);

        const campaign = Campaign(props.address)

        try {
            const accs = await web3.eth.getAccounts();
            await campaign.methods.createRequest(recipient, desc, web3.utils.toWei(value, 'ether')).send({from: accs[0]});
            Router.pushRoute(`/campaigns/${props.address}/requests`);
        } catch (err) {
            setMsg(err.message);
        }

        setWorking(false);
    }

    return (
        <Layout>
            
            <h3> <Link to={`/campaigns/${props.address}/requests`}><a> <Button size="mini" icon = "angle left"/></a></Link> Create a Request </h3>
            <Grid.Row>
                <Form error={!!msg}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            type="text"
                            value = {desc}
                            onChange = {e => {setDesc(e.target.value)}}
                            />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            type="text"
                            value = {recipient}
                            onChange = {e => {setRecipient(e.target.value)}}
                            />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Input 
                            type="number"
                            label="ether"
                            labelPosition="right"
                            value = {value}
                            onChange = {e => {setValue(e.target.value)}}
                            />
                    </Form.Field>

                    <Button primary loading={working} onClick = {handleClick}>Create Request</Button>
                    <Message error header="Oops!" content={msg}/>
                </Form>
            </Grid.Row>
        </Layout>
    )
}

newRequest.getInitialProps = async(props) => {
    const {address} = props.query;
    return {address};
}

export default newRequest
