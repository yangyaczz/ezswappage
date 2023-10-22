import React, { useState, useEffect } from 'react'

import networkConfig from '../data/networkconfig.json'
import { useNetwork, useContractWrite, useWaitForTransaction } from 'wagmi'
import { useFormik } from 'formik';

const Mint = () => {

    const abi721 = [{
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }]
    const abi1155 = [{
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }]

    const svgError = (<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
    const svgSuccess = (<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)

    const [isMounted, setIsMounted] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const { chain } = useNetwork();

    const [alertText, setAlertText] = useState({
        className: '',
        text: '',
        svg: '',
    })

    const handleSelectChange = (event) => {
        setSelectedName(event.target.value);
    };


    const formik = useFormik({
        initialValues: {
            golbalParams: '',
            abi: '',
            args: '',
            svg: '',
        }
    });


    const { data: mintNFTData, write: mintNFT, isLoading: mintNFTLoading } = useContractWrite({
        address: formik.values.golbalParams?.recommendNFT?.find(item => item.name === selectedName)?.address,
        abi: formik.values.abi,
        functionName: 'mint',
        args: formik.values.args,
        onError(error) {
            setAlertText({
                className: 'alert-error',
                text: error.message,
                svg: svgError,
            })
            setShowAlert(true);
        }
    })

    const waitForMintNFTTx = useWaitForTransaction({
        hash: mintNFTData?.hash,
        onSuccess(data) {
            setAlertText({
                className: 'alert-success',
                text: 'mint nft success',
                svg: svgSuccess,
            })
            setShowAlert(true);
        },
        onError(error) {
            setAlertText({
                className: 'alert-error',
                text: error.message,
                svg: svgError,
            })
            setShowAlert(true);
        }
    })


    useEffect(() => {
        setIsMounted(true)
        if (chain) {
            if (chain.id in networkConfig) {
                formik.setFieldValue('golbalParams', networkConfig[chain.id])
            }
        }
    }, [chain])


    useEffect(() => {
        const type = formik.values.golbalParams?.recommendNFT?.find(item => item.name === selectedName)?.type
        let nftabi, args
        if (type === 'ERC721') {
            nftabi = abi721
            args = [10]
        } else if (type === 'ERC1155') {
            nftabi = abi1155
            const id = formik.values.golbalParams?.recommendNFT?.find(item => item.name === selectedName)?.tokenId1155
            args = [id, 10]
        }
        formik.setFieldValue('abi', nftabi)
        formik.setFieldValue('args', args)
    }, [selectedName])

    useEffect(() => {
        let timer;
        if (showAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 1500);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [showAlert]);


    if (!isMounted) {
        return null; //  <Loading /> ??
    }
    return (
        <div className='flex flex-col min-h-screen bg-base-200 items-center justify-center space-y-6 relative'>

            {
                showAlert && (<div className={`alert ${alertText.className} w-1/3 absolute top-0 right-0 m-4 p-2`}>
                    {alertText && alertText.svg}
                    <span>{alertText.text}</span>
                </div>)
            }
            <select
                className="select select-info w-full max-w-xs"
                value={selectedName}
                onChange={handleSelectChange}
            >

                <option disabled value=''>Select NFT</option>
                {formik.values.golbalParams.recommendNFT ===undefined ? null : formik.values.golbalParams?.recommendNFT.map(item =>
                (<option value={item.name} key={item.name}>
                    {item.name}
                </option>)
                )}

            </select>
            {selectedName && <p>click below to mint 10 {selectedName}</p>}
            <button className='btn btn-neutral' onClick={() => mintNFT()}>
                {mintNFTLoading ? ("loading...") : (waitForMintNFTTx.isLoading ? 'waiting for result...' : 'mint nft')}
            </button>
        </div>
    )
}

export default Mint
