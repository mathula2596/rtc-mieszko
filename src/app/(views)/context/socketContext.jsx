"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { CorsRequest } from 'cors';
export const SocketContext = React.createContext();


export const SocketContextProvider = ({children}) => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {

        if(socket==null) {

            const socketIo = io('http://localhost:3005');

            setSocket(socketIo);
            return () => {
                socketIo.disconnect();
            };
           
        }
        

        
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};
