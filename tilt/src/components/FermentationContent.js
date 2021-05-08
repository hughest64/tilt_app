import React, { useEffect, useState } from 'react';
import { Card, List } from 'semantic-ui-react';
import { calcAbv, calcAppAttenuation } from '../utils/brewCalc';

/**
 * TODO:
 * - add edit button to content somewhere?
 */

export function FermentationContent({ sg, fermentationData }) {
    const { name, date, originalGravity } = fermentationData;
    const [abv, setAbv] = useState('-');
    const [aa, setAttenuation] = useState('-');

    useEffect(() => {
        setAbv(calcAbv(Number(originalGravity), Number(sg)));
        setAttenuation(calcAppAttenuation(Number(originalGravity), Number(sg)));
    }, [sg, originalGravity]);


    return (
        <Card.Content textAlign="left">
            <Card.Header textAlign="center">
                {name}
            </Card.Header>
            <List floated="left">
                <List.Item>Brewed On:</List.Item>
                <List.Item>Original Gravity:</List.Item>
                <List.Item>Apparent Attenuation:</List.Item>
                <List.Item>ABV</List.Item>
            </List>
            <List floated="right">
                <List.Item>{date}</List.Item>
                <List.Item>{originalGravity}</List.Item>
                <List.Item>{aa}</List.Item>
                <List.Item>{abv}</List.Item>
            </List>
        </Card.Content>
    );
}