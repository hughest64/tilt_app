import React from 'react';
import { Button, Card } from 'semantic-ui-react';

export function TiltCardButtons() {
    return (
        <Card.Content extra>
            <div className='ui two buttons'>
                <Button basic color='black'>
                    Connect To Brew App
                </Button>
                <Button basic color='black'>
                    Add Fermentation
                </Button>
            </div>
        </Card.Content>
    );
}