import React from 'react';
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Form, Button, Input, Message} from 'semantic-ui-react';
import {Router} from '../../routes';

const newcampaign = () => {
    const [msg, setMsg] = React.useState('');
    const [working, setWorking]  = React.useState(false);
    const [minContribute, setMinContribute] = React.useState('');
    const handleCreate = async (e) => {
        e.preventDefault();
        setMsg('');
        setWorking(true);
        try {
            const accs = await web3.eth.getAccounts();
            const tx = await factory.methods.createCampaign(minContribute).send({
                from : accs[0]
            });
            Router.pushRoute('/');
        } catch(err) {
            setMsg(err.message);
        }
        setWorking(false);
    }

    return (
        <Layout>
            <h2>Create a New Campaign</h2>
            <Form error = {!!msg}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                        type = "number" 
                        placeholder = "" 
                        label = "wei" 
                        labelPosition="right" 
                        value = {minContribute}
                        onChange = {e => {setMinContribute(e.target.value)}}></Input>
                </Form.Field>
                <Button loading = {working} primary onClick = {handleCreate}>Create</Button>
            </Form>
            {msg && msg !== '' && <Message error header = "Oops!" content={msg}/>}
        </Layout>
    )
}

export default newcampaign
