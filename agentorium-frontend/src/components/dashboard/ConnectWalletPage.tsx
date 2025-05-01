import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DAppConnector, HederaSessionEvent } from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';

const projectId = 'c3345655d13cccffc6cbb3853ad2ec24'; // Replace with your project ID
const metadata = {
    name: 'Agentorium',
    description: 'Agentorium is a decentralized platform for creating and trading AI agents.',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png'],
};

// Initialize Hedera Wallet Connect
let dAppConnector: DAppConnector;

const ConnectWalletPage = () => {
    // Initialize the DApp Connector when the component is mounted
    React.useEffect(() => {
        const initializeWalletConnect = async () => {
            try {
                dAppConnector = new DAppConnector(
                    metadata,
                    LedgerId.TESTNET,
                    projectId,
                    [],
                    [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
                    ['0.0.3'], // Example Hedera chain ID (e.g., Mainnet)
                );
                await dAppConnector.init({ logger: 'error' });
            } catch (error) {
                console.error('Failed to initialize Hedera Wallet Connect', error);
                toast.error('Failed to initialize wallet connection');
            }
        };

        initializeWalletConnect();
    }, []);

    const connectWallet = async () => {
        try {
            const session = await dAppConnector.openModal();
            const sessionAccount = session.namespaces?.hedera?.accounts?.[0];
            const sessionParts = sessionAccount?.split(':');
            const accountId = sessionParts?.pop();

            if (accountId) {
                // Store the account ID in localStorage or use it in your app
                localStorage.setItem('hederaAccountId', accountId);

                // Show success toast
                toast.success(`Wallet connected: ${accountId.substring(0, 6)}...${accountId.substring(accountId.length - 4)}`);

                // You can now refresh the page or redirect to the dashboard
                window.location.reload(); // Or redirect using a router
            }
        } catch (error) {
            console.error('Failed to connect wallet', error);
            toast.error('Failed to connect wallet');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-agentorium-darkgray">
            <div className="text-center text-agentorium-white">
                <h2 className="text-2xl mb-4">Please Connect Your Wallet</h2>
                <Button onClick={connectWallet} className="bg-agentorium-blue hover:bg-agentorium-blue/90">
                    Connect Wallet
                </Button>
            </div>
        </div>
    );
};

export default ConnectWalletPage;
