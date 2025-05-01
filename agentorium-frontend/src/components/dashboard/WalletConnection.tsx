import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Check, X, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useAccountId, useWallet } from '@buidlerlabs/hashgraph-react-wallets';
import { HashpackConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import { useBalance } from '@buidlerlabs/hashgraph-react-wallets';

export interface WalletConnectionProps {
  onWalletConnected: (accountId: string, balance: number, tokenBalances: Record<string, number>) => void;
}

const WalletConnection = ({ onWalletConnected }: WalletConnectionProps) => {
  const { isConnected, connect, disconnect } = useWallet(HashpackConnector);
  const accountId = useAccountId();
  const { data: balance } = useBalance();

  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    if (accountId && onWalletConnected) {
      // Notify the parent component about the wallet connection
      onWalletConnected(accountId, balance?.value ?? 0, {}); // Assuming no token balances for now
    }
  }, [accountId, balance, onWalletConnected]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 ${isConnected ? 'border-agentorium-blue text-agentorium-blue' : 'border-agentorium-silver/20'}`}
          onClick={isConnected ? handleDisconnectWallet : handleConnectWallet}
          disabled={isConnecting}
        >
          <Wallet className="h-4 w-4" />
          {isConnected ? formatAddress(accountId) : 'Connect Wallet'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-agentorium-darkgray border-agentorium-silver/10">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-agentorium-white">Wallet Connection</h4>
            {isConnected && (
              <span className="flex items-center text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </span>
            )}
          </div>

          {isConnected ? (
            <div className="space-y-3">
              <div className="bg-agentorium-charcoal/50 p-3 rounded-md">
                <div className="text-xs text-agentorium-silver mb-1">Wallet Address</div>
                <div className="text-sm text-agentorium-white font-mono">{accountId}</div>
              </div>

              <div className="bg-agentorium-charcoal/50 p-3 rounded-md">
                <div className="text-xs text-agentorium-silver mb-1">AGNT Balance</div>
                <div className="text-lg font-bold text-agentorium-white">
                  {balance?.formatted ?? '0 ℏ'}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-agentorium-silver/20"
                onClick={handleDisconnectWallet}
              >
                <X className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-agentorium-silver text-sm">
                Connect your wallet to purchase agent tokens from the marketplace.
              </p>

              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-agentorium-blue hover:bg-agentorium-blue/90"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletConnection;
