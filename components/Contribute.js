import React from 'react'
import {Form, Input, Button, Message} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

const Contribute = ({address}) => {
    const [msg, setMsg] = React.useState('');
    const [working, setWorking] = React.useState(false);
    const [contrib, setContrib] = React.useState('');

    // console.log(address);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setWorking(true);
        setMsg('');

        const campaign = Campaign(address);
        try{
            const accs = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({ 
                from: accs[0],
                 value: web3.utils.toWei(contrib, 'ether')
            });
            Router.replaceRoute(`/campaigns/${address}`);
        } catch (err) {
            setMsg(err.message);
        }
        setWorking(false);
    }

    return (
        <Form error = {!!msg}>
            <Form.Field>
                <label>Contribute:</label>
                <Input 
                    type="number"
                    label="ether"
                    labelPosition="right"
                    value = {contrib}
                    onChange = {e => {setContrib(e.target.value)}}
                />
            </Form.Field>
            <Button  onClick = {handleSubmit} loading = {working} primary> Contribute!</Button>
            <Message error header = "Oops!" content = {msg}/>
        </Form>
    )
}


export default Contribute
