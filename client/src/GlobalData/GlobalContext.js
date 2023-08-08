// GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalContext1 = createContext();
const GlobalContext2 = createContext();

export function GlobalProvider({ children }) {
    const [userMgmtContractAddress, setuserMgmtContractAddress] = useState("0xbFC514e76C71B37A8033DCB1ec2C12141051A596");
    const [fileMgmtContractAddress, setfileMgmtContractAddress] = useState("0x0dAFF696d6EEd9FD0f46999DF322Fd8b34277964");

    return (
        <GlobalContext1.Provider value={{ userMgmtContractAddress, setuserMgmtContractAddress }}>
            <GlobalContext2.Provider value={{ fileMgmtContractAddress, setfileMgmtContractAddress }}>
                {children}
            </GlobalContext2.Provider>
        </GlobalContext1.Provider>
    );
}

export function useGlobal1() {
    return useContext(GlobalContext1);
}

export function useGlobal2() {
    return useContext(GlobalContext2);
}