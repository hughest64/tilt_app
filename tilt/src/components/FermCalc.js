import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Container, Divider, Input, Header, List, Statistic } from 'semantic-ui-react';
import { useSessionStorage } from '../utils/useSessionStorage';
import { calcAbv, calcAppAttenuation, brixToSg, sgToBrix } from '../utils/brewCalc';

function FermCalc() {
    const [originalGravity, setOriginalGravity] = useSessionStorage('og', '');
    const [currentGravity, setCurrentGravity] = useSessionStorage('cg', '');
    const [originalBrix, setOriginalBrix] = useSessionStorage('obrix', '');
    const [currentBrix, setCurrentBrix] = useSessionStorage('cbrix', '');
    const [abv, setAbv] = useState('-');
    const [aa, setAttenuation] = useState('-');
    const [isFermenting, setIsFermenting] = useState(true);

    const handleSpecificGravityChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        let newValue;

        if (value.length === 4 && value.indexOf('.') === -1) {
            newValue = Number(value / 1000).toFixed(3);

        } else if (value.length === 3 && value[0] === '9') {
            newValue = Number(value / 1000).toFixed(3);

        } else {
            newValue = value;
        }

        const brix = sgToBrix(newValue);

        if (id === 'og') {
            setOriginalGravity(newValue);
            setOriginalBrix(brix);
        } else {
            setCurrentGravity(newValue);
            // setting current brix from current gravity doesn't make sense due to alcohol presence
            // if we are doing a simple conversion, we should should use the original field
            setCurrentBrix('');
        }   
    };

    const handleBrixChange = e => {
        const id = e.target.id;
        const value = e.target.value;
        let newValue;
        let sg;

        if (value.length === 3 && value.indexOf('.') === -1) {
            newValue = (Number(value) / 10); //.toFixed(1);
        } else if (value.length >= 4 && value.indexOf('.') !== -1) {
            newValue = value.slice(0, 4);
        } else {
            newValue = value;
        }
        
        if (id === 'obrix') {
            sg = brixToSg(newValue, originalBrix, false);
            setOriginalBrix(newValue);
            setOriginalGravity(sg);
        } else {
            sg = brixToSg(newValue, originalBrix, isFermenting);
            setCurrentBrix(newValue);
            setCurrentGravity(sg);
        }
    };

    useEffect(() => {
        // only calculate if we have fully formed sg readings
        if (originalGravity.length === 5 && currentGravity.length === 5) {
            const newAbv = calcAbv(Number(originalGravity), Number(currentGravity));
            const newAa = calcAppAttenuation(Number(originalGravity), Number(currentGravity));
            setAbv(newAbv);
            setAttenuation(newAa);

        } else {
            setAbv('-');
            setAttenuation('-');
        }
    }, [originalGravity, currentGravity]);

    return (
        <Container style={{marginTop: "75px" }} textAlign="center">
            <Card centered>
                <Card.Content textAlign="center">
                    <Card.Header at="h2" >Fermentation Calculator</Card.Header>
                    <Divider />
                    {/* <List floated="left">
                        <List.Item>ABV</List.Item>
                        <List.Item>Apparent Attenuation</List.Item>
                    </List>
                    <List floated="right">
                        <List.Item>{abv}</List.Item>
                        <List.Item>{aa}</List.Item>
                    </List> */}
                    <Statistic size="small">
                        <Statistic.Label content="ABV" />
                        <Statistic.Value content={abv} />
                    </Statistic>
                    <br />
                    <Statistic size="small" style={{marginBottom: "10px"}}>
                        <Statistic.Label content="Attenuation*" />
                        <Statistic.Value content={aa} />
                    </Statistic>
                </Card.Content>
                <Card.Content>
                    <Header size="medium" >Specific Gravity</Header>
                    <Input
                        type="number" step=".001" id="og" name="og" size="large"
                        maxLength="5"
                        value={originalGravity}
                        placeholder="Original"
                        onChange={(e) => handleSpecificGravityChange(e)}
                    />
                    <br />
                    <br />
                    <Input
                        type="number" step=".001" id="cg" name="cg" size="large"
                        maxLength="5"
                        value={currentGravity}
                        placeholder="Current"
                        onChange={(e) => handleSpecificGravityChange(e)}
                    />
                </Card.Content>
                <Card.Content>
                    <Header size="medium" >&deg;Brix</Header>
                    <Input 
                        type="number" id="obrix" step=".1" name="obrix" size="large"
                        value={originalBrix}
                        placeholder="Original"
                        onChange={(e) => handleBrixChange(e)}
                    />
                    <br />
                    <br />
                    <Input
                        type="number" id="cbrix" step=".1" name="cbrix" size="large"
                        value={currentBrix}
                        placeholder="Current**"
                        onChange={(e) => handleBrixChange(e)}
                    />
                    {/* <Checkbox
                        checked={isFermenting}
                        label='Correct for alcohol?'
                        onClick = {() => setIsFermenting(!isFermenting)}
                    /> */}
                </Card.Content>
                <Card.Content textAlign="left" extra>
                    <small>*Apparent Attenuation</small>
                    <br />
                    <small>
                        **The current brix reading is corrected for alcohol content
                         and is only valid when an original brix value is present.
                    </small>
                </Card.Content>
            </Card>
        </Container>
    );
}

export { FermCalc };