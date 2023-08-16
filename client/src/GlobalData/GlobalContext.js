// GlobalContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
const ethers = require("ethers")

const UserContract = createContext();
const FileContract = createContext();
const PaymentContract = createContext();
const MetaAccount = createContext();
const PatientData = createContext();

export function GlobalProvider({ children }) {                             

    const [metaAccount, setMetaAccount] = useState(''); // meta mask account
    const [userMgmtContract, setUserMgmtContract] = useState(null);
    const [fileMgmtContract, setFileMgmtContract] = useState(null);
    const [paymentMgmtContract, setPaymentMgmtContract] = useState(null);
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
                            window.location.replace("http://localhost:3000");
                            window.location.reload();
                        });

                        window.ethereum.on("accountsChanged", () => {
                            window.location.replace("http://localhost:3000");
                        });

                        await provider.send("eth_requestAccounts", []);
                        const signer = provider.getSigner();
                        const address = await signer.getAddress();
                        setMetaAccount(address);
                        console.log(metaAccount);
                        // const fileAbi = require(process.env.REACT_APP_FILE_MGMT_ABI_PATH);
                        // const userAbi = require(process.env.REACT_APP_USER_MGMT_ABI_PATH);
                        const paymentAbi = require(process.env.REACT_APP_PAYMENT_MGMT_ABI_PATH);
                        // let userMgmtContractAddress = process.env.REACT_APP_USER_MGMT_CONTRACT_ADDRESS;
                        // let fileMgmtContractAddress = process.env.REACT_APP_FILE_MGMT_CONTRACT_ADDRESS;
                        let paymentMgmtContractAddress = process.env.REACT_APP_PAYMENT_MGMT_CONTRACT_ADDRESS;
                        const fileAbi = require("../components/landingPage/contracts/FileManagement.json");
                        const userAbi = require("../components/landingPage/contracts/UserManagement.json");
                        let userMgmtContractAddress = "0x5A833f8c34eAe8f9A4b24dBf1a7FFe7F3FD2C848";
                        let fileMgmtContractAddress = "0x06C8F8d9D8d4F0c6D5C910C3AbeDaC48FF4ad51B";

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

                        const paymentMgmtContract = new ethers.Contract(
                            paymentMgmtContractAddress,
                            paymentAbi,
                            signer
                        );

                        setFileMgmtContract(fileMgmtContract);
                        setUserMgmtContract(userMgmtContract);
                        setPaymentMgmtContract(paymentMgmtContract);
                        setProvider(provider);

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
                    <PaymentContract.Provider value={{ paymentMgmtContract, setPaymentMgmtContract }}>
                        <PatientData.Provider value={{ patient, setPatient }}>
                            {children}
                        </PatientData.Provider>
                    </PaymentContract.Provider>
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

export function PaymentContractObj() {
    return useContext(PaymentContract);
}

export function MetaAccountObj() {
    return useContext(MetaAccount);
}