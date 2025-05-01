import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Wallet, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAccountId, useWallet } from '@buidlerlabs/hashgraph-react-wallets';
import { useBalance } from '@buidlerlabs/hashgraph-react-wallets';
import { TransferTransaction, AccountId, Hbar, Client } from '@hashgraph/sdk';

const AMM_INITIAL_PRICE = 1000;
const AMM_SLOPE = 0.05;
const CREATOR_ROYALTY_PERCENT = 5;
const PLATFORM_FEE_PERCENT = 2.5;

const BuyAgentModal = ({ isOpen, onClose, agent, onCompletePurchase }) => {
  const { isConnected, signer } = useWallet();
  const accountId = useAccountId();
  const { data: balance } = useBalance();
  const [tokenAmount, setTokenAmount] = useState(1);
  const [ammPrice, setAmmPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [royaltyAmount, setRoyaltyAmount] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [transactionStage, setTransactionStage] = useState<'initial' | 'processing' | 'complete' | 'error'>('initial');
  const [isCopying, setIsCopying] = useState(false);

  // Calculate the AMM price based on the amount
  const calculateAmmPrice = (amount) => {
    const basePrice = AMM_INITIAL_PRICE * Math.pow(1 + AMM_SLOPE, amount);
    return basePrice * (1 + AMM_SLOPE * Math.log(amount + 1));
  };

  useEffect(() => {
    if (isOpen && agent) {
      const price = calculateAmmPrice(tokenAmount);
      setAmmPrice(price);
      const subtotal = price * tokenAmount;
      const royalty = subtotal * (CREATOR_ROYALTY_PERCENT / 100);
      const fee = subtotal * (PLATFORM_FEE_PERCENT / 100);
      setTotalCost(subtotal + fee);
      setRoyaltyAmount(royalty);
      setPlatformFee(fee);
    }
  }, [isOpen, agent, tokenAmount]);

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTokenAmount(value);
    }
  };

  const handleConnectWallet = async () => {
    if (isConnected) {
      toast.error('Wallet already connected');
      return;
    } else {
      toast.success('Wallet connected successfully');
    }
  };

  const handlePurchaseConfirmation = async () => {
    try {
      // Step 1: Create and sign the transaction
      const account = AccountId.fromString(accountId);
      const transaction = new TransferTransaction()
        .addHbarTransfer(account, new Hbar(-totalCost)) // Sending total cost in Hbar
        .addHbarTransfer(agent.creatorId, new Hbar(totalCost)); // Sending to the agent's creator

      // Step 2: Sign and execute the transaction
      const signedTransaction = await transaction.freezeWithSigner(signer as any);
      const result = await signedTransaction.executeWithSigner(signer as any);
      const transactionId = result.transactionId.toString();

      // Step 3: Show success
      toast.success(`Transaction successful! Hash: ${transactionId}`);
      setTransactionStage('complete');
      onCompletePurchase(); // Call onCompletePurchase after success

    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Error occurred during the transaction');
      setTransactionStage('error');
    }
  };

  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-agentorium-darkgray border-agentorium-silver/10 text-agentorium-white">
        <DialogHeader>
          <DialogTitle>
            {transactionStage === 'complete'
              ? "Tokens Purchased!"
              : transactionStage === 'error'
                ? "Transaction Failed"
                : transactionStage === 'processing'
                  ? "Processing Transaction"
                  : "Purchase Agent Tokens"}
          </DialogTitle>
          <DialogDescription className="text-agentorium-silver">
            {transactionStage === 'complete'
              ? "Your agent tokens have been added to your wallet."
              : transactionStage === 'error'
                ? "We couldn't process your transaction. Please try again."
                : transactionStage === 'processing'
                  ? "Please wait while we process your transaction..."
                  : "Purchase tokens for this agent powered by AMM pricing:"}
          </DialogDescription>
        </DialogHeader>

        {transactionStage === 'initial' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-agentorium-charcoal/50 p-4 rounded-md">
              <img
                src={`https://cdn-icons-png.flaticon.com/512/13298/13298257.png`}
                alt={agent.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div>
                <h3 className="font-bold text-agentorium-white">{agent.name}</h3>
                <p className="text-xs text-agentorium-silver mb-1">By {agent.creatorId}</p>
                <div className="flex items-center">
                  <p className="font-medium text-agentorium-cyan">{agent.name}</p>
                  <TrendingUp className="h-3 w-3 text-green-500 ml-2" />
                </div>
              </div>
            </div>

            <div className="bg-agentorium-charcoal/30 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-agentorium-white">Current AMM Price</span>
                <span className="text-sm font-bold text-agentorium-cyan">{ammPrice.toLocaleString()} AGNT per token</span>
              </div>
              <p className="text-xs text-agentorium-silver">
                Token price is determined by an Automated Market Maker (AMM) based on supply and demand
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-agentorium-white">Number of Tokens</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-agentorium-silver/20"
                  onClick={() => tokenAmount > 1 && setTokenAmount(prev => prev - 1)}
                >-</Button>
                <Input
                  type="number"
                  min="1"
                  value={tokenAmount}
                  onChange={handleAmountChange}
                  className="bg-agentorium-charcoal/50 border-agentorium-silver/20 text-center"
                />
                <Button
                  variant="outline"
                  className="border-agentorium-silver/20"
                  onClick={() => setTokenAmount(prev => prev + 1)}
                >+</Button>
              </div>
            </div>

            <div className="pt-4 border-t border-agentorium-silver/10">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-agentorium-silver">Subtotal ({tokenAmount} tokens)</span>
                <span className="text-agentorium-white">{(ammPrice * tokenAmount).toLocaleString()} AGNT</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-agentorium-silver">Creator Royalty ({CREATOR_ROYALTY_PERCENT}%)</span>
                <span className="text-agentorium-white">{royaltyAmount.toLocaleString()} AGNT</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-agentorium-silver">Platform fee ({PLATFORM_FEE_PERCENT}%)</span>
                <span className="text-agentorium-white">{platformFee.toLocaleString()} AGNT</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-agentorium-silver/10">
                <span className="text-agentorium-white">Total</span>
                <span className="text-agentorium-white">{totalCost.toLocaleString()} AGNT</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {false ? (
                <Button
                  onClick={handleConnectWallet}
                  className="w-full bg-agentorium-blue hover:bg-agentorium-blue/90"
                >
                  Connect Wallet
                </Button>
              ) : (
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-agentorium-silver/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePurchaseConfirmation}
                    disabled={false}
                    className="bg-agentorium-blue hover:bg-agentorium-blue/90"
                  >
                    Continue to Purchase
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add other transaction stages (processing, error, etc.) as needed */}
      </DialogContent>
    </Dialog>
  );
};

export default BuyAgentModal;
