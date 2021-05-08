import React, { useEffect, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

const getStatusData = (tiltData) => {
    return {
        color: tiltData.isActive? 'green' : 'black',
        basic: !tiltData.isActive,
        empty: true,
        circular: true
     };
};

function TiltMenuItem({ tiltData, onClick }) {
    const tiltColor = tiltData.displayName;
    const activeState = tiltData.isActive;
    const [status, setStatus] = useState(() => getStatusData(tiltData));

     useEffect(() => {
        setStatus(getStatusData(tiltData));
     }, [activeState, tiltData]);

    return (
        <Dropdown.Item onClick={onClick} label={status} text={tiltColor}/>
    );
}

export { TiltMenuItem };