import React, { useContext } from 'react';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { TiltMenuItem } from './TiltMenuItem';
import { getUpdatedTiltArray } from '../reducers/tiltStatusReducer';
import { SocketContext, websocketState } from '../utils/socket';

/**
 * TODO:
 * - add a Modal component for settings, display when settings menu item is clicked
 *   - possibly another drop down for settings with multiple modals
 * - Things to go in settings:
 *   - dispay/hide tilt cards
 *   - user information
 *   - brew app end points? 
 *   - control the tilt reader (subprocess to get status/start/restart/stop the service)
 *
 */

function NavBar({ tiltArray, dispatch }) {
    const socket = useContext(SocketContext);

    const handleTiltItemclick = (tilt) => {
        if (websocketState[socket.readyState] == 'open') {
            
            socket.send(JSON.stringify({
                type: 'updateActiveState',
                message: {
                    color: tilt.color,
                    isActive: !tilt.isActive
                }
            }));
        }

        const updatedTiltArray = getUpdatedTiltArray(
            { color: tilt.color, isactive: !tilt.isActive}, tiltArray
        );
        dispatch({ type: 'updateTiltArray', payload: updatedTiltArray });
    };
    
    return (
        
        <Menu as="nav" inverted fixed="top" size="massive">
            <Menu.Menu>
                <Dropdown item text="Manage Tilts">
                    <Dropdown.Menu >
                    {tiltArray.map(tiltData => 
                        <TiltMenuItem
                            onClick={() => handleTiltItemclick(tiltData)}
                            key={tiltData.color}
                            tiltData={tiltData}
                        />
                    )}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
            <Menu.Item position="right">
                <Icon name="setting"/>
                Settings
            </Menu.Item>
        </Menu>
    );
}

export { NavBar };