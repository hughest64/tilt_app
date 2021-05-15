import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { SocketContext, useSocket, } from './utils/socket';
import { getUpdatedTiltArray } from './reducers/tiltStatusReducer';
import { NavBar } from './components/NavBar';
import { TiltCard } from './components/TiltCard';
import { FermCalc } from './components/FermCalc';
import { tiltStatusReducer } from './reducers/tiltStatusReducer';
import { Card, Container, Header } from 'semantic-ui-react';

const socketProtocol = window.location.protocol == 'https:' ? 'wss' : 'ws';
const socketUrl = `${socketProtocol}://${window.location.host}/ws/socket/tilt/`;

function App() {
    const newHistory = createBrowserHistory();
    const [connected, socket] = useSocket(socketUrl);
    const [tiltArray, dispatch] = useReducer(tiltStatusReducer, []);
    const [tiltReadings, setTiltreadings] = useState({});
    // not being used right now, but it helps Tilt cards re-render when they need to
    const [lastReadingTime, setLastReadingTime] = useState();

    useEffect(() => {

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'tiltPayload') {
                // unfortunately we are getting strings from the server, not booleans
                const payload = data.message.map((tilt) => {
                    tilt.isActive = tilt.isActive === 'True';
                    return tilt;
                });
                dispatch({ type: 'updateTiltArray', payload });
            }

            if (data.type === 'updateTiltReadings') {
                setTiltreadings(readings => Object.assign(readings, data.message));
                // record the time of the last update
                setLastReadingTime(new Date());
            }

            if (data.type === 'updateActiveState') {
                const newTiltArray = getUpdatedTiltArray(data.message, tiltArray);
                dispatch({
                    type: "updateTiltArray",
                    payload: newTiltArray
                });
            }
        };
    });

    return (
        <SocketContext.Provider value={socket}>
            <NavBar tiltArray={tiltArray} dispatch={dispatch}/>
            <Router history={newHistory}>
                <Switch>
                    <Route path="/tilt/list/" exact>
                        <Container style={{marginTop: "65px" }} textAlign="center">
                            <Header size="huge" >Tilt List</Header>
                            <Card.Group>
                            {tiltArray.map((tilt) => tilt.isActive?
                                <TiltCard
                                    key={tilt.color}
                                    tiltData={tilt}
                                    tiltReadings={tiltReadings[tilt.color]}
                                /> : 
                                null
                            )}
                            </Card.Group>
                        </Container>
                    </Route>
                    <Route path="/calc/" exact>
                        <FermCalc />
                    </Route>
                </Switch>
            </Router>
        </SocketContext.Provider>
    );
}

export default App; 