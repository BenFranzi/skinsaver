import React, {useState, useEffect} from 'react';
import {Header, Table} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import Axios from 'axios';
import Img from 'react-fix-image-orientation';


const URL = 'https://skinsaver-cap-api.herokuapp.com/api/v1/linker';

const LinkerTable = ({location}) => {
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState(null);

    console.log(location);

    const loadCases = async () => {
        try {
            const res = await Axios.get(URL + location.pathname);
            if (!!res.data.case) {
                setCases(res.data.case);
            }
        } catch (e) {
            console.log('failed to get', e);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCases();
    }, []);

    return (
        <div style={{margin: 10}}>
            {loading ? (<Header>Loading</Header>) : (
                <>
                    {!cases ? (
                        <Header>Not available</Header>
                    ) : (
                        <>
                            <Header as='h2'>
                                Last identified: {cases.captures[0].prediction}
                                <Header.Subheader>
                                    {cases.title}
                                </Header.Subheader>
                            </Header>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Image</Table.HeaderCell>
                                        <Table.HeaderCell>Identified</Table.HeaderCell>
                                        <Table.HeaderCell>Certainty</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {cases.captures.map((item) => {
                                        return (
                                            <Table.Row key={item.id}>
                                                <Table.Cell>
                                                    <Img src={item.url} style={{height: 256, imageOrientation: 'from-image'}}/>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {item.prediction}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {item.certainty  * 100}%
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table>
                        </>
                    )}
                </>
            )}
        </div>
    )
};
export default withRouter(props => <LinkerTable {...props}/>);
