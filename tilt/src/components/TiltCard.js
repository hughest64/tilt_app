import React from 'react';
import { Card, Divider, Header, Statistic } from 'semantic-ui-react';
import { FermentationContent } from './FermentationContent';
import { TiltCardButtons } from './TiltCardButtons';
/**
 * TODO:
 * - add hover and click states to buttons
 * - add modal components for the buttons
 *   - add recipe 
 *     - form that sets recipe details on the card & adds to db
 *     - must have create new and update existing options on submit
 * 
 *   - connect to brewapp
 *     - form to enter details of brew session and make a rest call
 *     - also saves the data to the local db
 * 
 */

const formatDateString = timestamp => new Date(timestamp).toLocaleString();

function TiltCard({ tiltData, tiltReadings }) {
    const { fermentation, displayName } = tiltData;
    const sg = tiltReadings ? tiltReadings.specificGravity : '-';
    const temp = tiltReadings ? tiltReadings.temperature : '-';
    const timestamp = tiltReadings ? formatDateString(tiltReadings.timestamp) : '-';
    
    return (
        <Card centered>
            <Card.Content  textAlign="center">
                <Card.Header content={displayName}/>
                <Divider />
                {
                    tiltReadings?
                    <>
                    <Statistic size="huge" >
                        <Statistic.Label content="Specific Gravity" />
                        <Statistic.Value content={sg} />
                    </Statistic>
                    <Statistic size="small" style={{marginLeft: "-5px"}}>
                        <Statistic.Label content="Temp" />
                        <Statistic.Value>{temp}&deg;</Statistic.Value>
                    </Statistic>
                    <Statistic.Label style={{marginTop: "10px", marginLeft: "-5px"}}>
                        {timestamp}
                    </Statistic.Label>
                    </> :
                    <Header as='h3' content="Tilt Not Found" />
                }
            </Card.Content>
            {
                fermentation ?
                <FermentationContent sg={sg} fermentationData={fermentation}/> :
                <TiltCardButtons />
            }       
        </Card>
    );
}

export { TiltCard };