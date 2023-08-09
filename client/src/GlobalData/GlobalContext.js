// GlobalContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
const ethers = require("ethers")

const UserContract = createContext();
const FileContract = createContext();
const MetaAccount = createContext();
const PatientData = createContext();

export function GlobalProvider({ children }) {                             

    const [metaAccount, setMetaAccount] = useState(''); // meta mask account
    const [userMgmtContract, setUserMgmtContract] = useState(null);
    const [fileMgmtContract, setFileMgmtContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [patient, setPatient] = useState({
        username: "",
        passwordHash: "",
        name: {
            firstName: "",
            middleName: "",
            lastName: "",
        },
        dob: "",
        mobile: "",
        email: "",
        adharCard: "",
        abhaId: "",
        bloodGroup: "",
        patAddress: {
            building: "",
            city: "",
            taluka: "",
            district: "",
            state: "",
            pincode: "",
        },
        contactPerson: {
            name: {
                firstName: "",
                middleName: "",
                lastName: "",
            },
            mobile: "",
            email: "",
            relation: "",
            conAddress: {
                building: "",
                city: "",
                taluka: "",
                district: "",
                state: "",
                pincode: "",
            },
        },
    });

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
                        console.log(metaAccount);
                        const fileAbi = require("../components/landingPage/contracts/FileManagement.json");
                        const userAbi = require("../components/landingPage/contracts/UserManagement.json");
                        let userMgmtContractAddress = "0x4d3A01c86Dbc34Fe09a822601abcC7e0019659A1";
                        let fileMgmtContractAddress = "0x92307B195d537fb02883cFB82081e3201a911233";

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
        <MetaAccount.Provider value={{ metaAccount, setMetaAccount }}>
            <UserContract.Provider value={{ userMgmtContract, setUserMgmtContract }}>
                <FileContract.Provider value={{ fileMgmtContract, setFileMgmtContract }}>
                    <PatientData.Provider value={{ patient, setPatient }}>
                        {children}
                    </PatientData.Provider>
                </FileContract.Provider>
            </UserContract.Provider>
        </MetaAccount.Provider>
    );
}

export function PatientDataObj() {
    return useContext(PatientData);
}

export function UserContractObj() {
    return useContext(UserContract);
}

export function FileContractObj() {
    return useContext(FileContract);
}

export function MetaAccountObj() {
    return useContext(MetaAccount);
}