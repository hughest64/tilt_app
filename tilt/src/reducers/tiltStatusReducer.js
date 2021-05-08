// TODO: probably kill this function
export const parseTiltArray = (tiltColor, tiltArray) => {
    const updatedTiltArry = tiltArray.map((tilt) => {
        tilt.color === tiltColor ? tilt.isActive = !tilt.isActive : null;
        return tilt;
    });

    return updatedTiltArry;
};

export const getUpdatedTiltArray = (tiltObj, tiltArray) => {
    const updatedTiltArry = tiltArray.map((tilt) => {
        tilt.color === tiltObj.color ? Object.assign(tilt, tiltObj) : null;
        return tilt;
    });

    return updatedTiltArry;
};

export const tiltStatusReducer = (state, action) => {
    if (action.type == 'updateTiltArray') {
        return action.payload;
    };
};