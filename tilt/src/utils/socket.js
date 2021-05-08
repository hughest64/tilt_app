import React, { useEffect, useState } from 'react';

const websocketState = {
    0: 'connecting',
    1: 'open',
    2: 'closing',
    3: 'closed'
};

const SocketContext = React.createContext(null);

let interval;
function useSocket(socketUrl) {
    // console.log(`the url is ${socketUrl}`);
    const [socket, setSocket] = useState(() => new WebSocket(socketUrl));
    const [connected, setConnected] = useState(websocketState[socket.readyState]);
    const [retryCount, setRetryCount] = useState(0);

    const setSockectConnection = () => setSocket(new WebSocket(socketUrl));

    useEffect (() => {
        socket.onopen = () => {
            console.log('open');
            setConnected(websocketState[socket.readyState]);
            clearTimeout(interval);
            setRetryCount(0);
        };
        socket.onclose = () => {
            console.log('closed');
            setConnected(websocketState[socket.readyState]);
            interval = setTimeout(setSockectConnection, 1000);
            setRetryCount(retryCount + 1);
        };
        socket.onerror = (err) => {
            console.error('Socket encountered error: ', err, 'Closing socket');
            socket.close();
        };
    });

    useEffect(() => {
        console.log(`retry count is at ${retryCount}`);
    }, [retryCount]);

    return [connected, socket];
}

export { SocketContext, useSocket, websocketState };