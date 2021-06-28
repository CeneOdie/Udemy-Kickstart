import React from 'react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Table, Button, Message} from 'semantic-ui-react';
import {Router} from '../routes'

const RequestRow = (props) => {
    const {Row, Body, Cell} = Table;
    const {id, address, setMsg} = props;
    const [approving, setApproving] = React.useState(false);
    const [finalizing, setFinalizing] = React.useState(false);
    const finalizable = props.request.approvalCount > props.approvers/2;

    const onApprove = async (e) => {
        setMsg('');
        setApproving(true);
        const campaign = Campaign(address);
               
        try {
            const accs = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(id).send({ from: accs[0]});  
            Router.replaceRoute(`/campaigns/${address}/requests`);  
        } catch (err) {
            setMsg(err.message);
        }
        setApproving(false);

    }

    const onFinalize = async (e) => {
        setMsg('');
        setFinalizing(true);
        const campaign = Campaign(address);
               
        try {
            const accs = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(id).send({ from: accs[0]});  
            Router.replaceRoute(`/campaigns/${address}/requests`); 
        } catch (err) {
            setMsg(err.message);
        }
        setFinalizing(false);
    }

    console.log(props.request.complete);

    return (
        <Row disabled = {props.request.complete} positive = {finalizable && !props.request.complete}>
            <Cell>{id} </Cell>
            <Cell> {props.request.description}</Cell>
            <Cell> {web3.utils.fromWei(props.request.spendAmount, 'ether')}</Cell>
            <Cell>{props.request.recipient}</Cell>
            <Cell> {props.request.approvalCount} / {props.approvers}</Cell>
            <Cell> <Button disabled = {props.request.complete} loading={approving} basic color="green" onClick={onApprove}>Approve</Button></Cell>
            <Cell><Button disabled = {props.request.complete || !finalizable} loading={finalizing} basic color="teal" onClick = {onFinalize}>Finalize</Button></Cell>
        </Row>
    )
}

export default RequestRow
