import React from 'react';
import Layout from '../../../components/Layout';
import {Button, Grid, Table, Message} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

const index = (props) => {
    const [msg, setMsg] = React.useState('');
    const {Header, Row, HeaderCell, Body} = Table;

    const renderRows = () => {
        return props.requests.map((request, index) => {
            return <RequestRow 
                id={index}
                request={request}
                key={index}
                address={props.address}
                approvers = {props.approvers}
                setMsg = {setMsg}
            />;
        })
    }

    return (
        <Layout>
            <Link to={`/campaigns/${props.address}/requests/new`}>
                <a>
                    <Button size = "small" primary floated="right">Add Request</Button>
                </a>
            </Link>
            <h3><Link to={`/campaigns/${props.address}`}><a><Button icon="angle left"/></a></Link>Requests</h3>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>
                            ID
                        </HeaderCell>
                        <HeaderCell>
                            Description
                        </HeaderCell>
                        <HeaderCell>
                            Amount (ether)
                        </HeaderCell>
                        <HeaderCell>
                            Recipient
                        </HeaderCell>
                        <HeaderCell>
                            Approval Count
                        </HeaderCell>
                        <HeaderCell>
                            Approve
                        </HeaderCell>
                        <HeaderCell>
                            Finalize
                        </HeaderCell>
                    </Row>

                </Header>

                <Body>
                    {renderRows()}
                </Body>

                <Table.Footer>
                    <Row>
                        <HeaderCell colSpan="7">
                            Found {props.reqs} requests for {props.address}
                        </HeaderCell>

                    </Row>
                </Table.Footer>

            </Table>
            <Message hidden = {!msg} error header="Oops!" content={msg}/>
        </Layout>
    )
}

index.getInitialProps = async(props) => {
    const {address} = props.query;

    const campaign = Campaign(address);
    const reqs = await campaign.methods.getRequestsCount().call();

    const requests = await Promise.all(
        Array(parseInt(reqs)).fill().map((element, index) => {
            return campaign.methods.requests(index).call()
        })
    );

    const approvers = await campaign.methods.approversCount().call();

    return {address, requests, reqs, approvers};
};

export default index
