import { ethers } from 'ethers'
import { signer, provider } from '../store/wallet';

export async function connectWallet() {
    if (!window.ethereum) return showToast('Please install Metamask to connect.');
    try {
        const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await ethereumProvider.send("eth_requestAccounts", []);
        provider.set(ethereumProvider)
        signer.set(ethereumProvider.getSigner());
        const network = await ethereumProvider.getNetwork();
        if (!CHAIN_DATA[network.chainId]) showToast('Network not supported.');
    } catch (e) {
        console.error(e);
    }
}