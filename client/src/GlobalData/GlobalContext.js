// GlobalContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
const ethers = require("ethers")

const UserContract = createContext();
const FileContract = createContext();
const MetaAccount = createContext();

export function GlobalProvider({ children }) {                             //0xbFC514e76C71B37A8033DCB1ec2C12141051A596
    // const [userMgmtContractAddress, setuserMgmtContractAddress] = useState("0xbFC514e76C71B37A8033DCB1ec2C12141051A596");
    // const [fileMgmtContractAddress, setfileMgmtContractAddress] = useState("0x0dAFF696d6EEd9FD0f46999DF322Fd8b34277964");

    const [metaAccount, setMetaAccount] = useState(''); // meta mask account
    const [userMgmtContract, setUserMgmtContract] = useState(null);
    const [fileMgmtContract, setFileMgmtContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const getAccount = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            if (provider) {
                try {
                    if (metaAccount != '') {
                        setMetaAccount('');
                        console.log("Meta Mask Account Removed", metaAccount);
                    }
                    else {

                        window.ethereum.on("chainChanged", () => {
                            window.location.reload();
                        });

                        window.ethereum.on("accountsChanged", () => {
                            window.location.reload();
                        });

                        await provider.send("eth_requestAccounts", []);
                        const signer = provider.getSigner();
                        const address = await signer.getAddress();
                        setMetaAccount(address);

                        const fileAbi = require("../components/landingPage/contracts/FileManagement.json");
                        const userAbi = require("../components/landingPage/contracts/UserManagement.json");
                        let userMgmtContractAddress = "0xbB4b5FC44c257E6B2708e195Cf6062748e2c36Db";
                        let fileMgmtContractAddress = "0x0dAFF696d6EEd9FD0f46999DF322Fd8b34277964";

                        const userMgmtContract = new ethers.Contract(
                            userMgmtContractAddress,
                            userAbi,
                            signer
                        );

                        const fileMgmtContract = new ethers.Contract(
                            fileMgmtContractAddress,
                            fileAbi,
                            signer
                        );

                        setFileMgmtContract(fileMgmtContract);
                        setUserMgmtContract(userMgmtContract);
                        setProvider(provider);
                        console.log(address);
                        console.log(userMgmtContract);
                        console.log(fileMgmtContract);

                    }
                } catch (err) {
                    if (err.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        // If this happens, the user rejected the connection request.
                        console.log('Please connect to MetaMask.');
                    } else {
                        console.error(err);
                    }
                }
            }
            else {
                console.error("Metamask is not installed");
            }
        };

        getAccount();
    }, []);

    return (
        <MetaAccount.Provider value = {{metaAccount, setMetaAccount}}>
            <UserContract.Provider value={{ userMgmtContract, setUserMgmtContract}}>
                <FileContract.Provider value={{ fileMgmtContract, setFileMgmtContract }}>
                    {children}
                </FileContract.Provider>
            </UserContract.Provider>
        </MetaAccount.Provider>
    );
}

export function UserContractObj() {
    return useContext(UserContract);
}

export function FileContractObj() {
    return useContext(FileContract);
}

export function MetaAccountObj(){
    return useContext(MetaAccount);
}