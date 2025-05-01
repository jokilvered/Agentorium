
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// Form schema for validation
const listingSchema = z.object({
  price: z.coerce.number()
    .min(1000, { message: "Price must be at least 1,000 tokens" })
    .max(1000000, { message: "Price cannot exceed 1,000,000 tokens" }),
  royaltyPercent: z.coerce.number()
    .min(0, { message: "Royalty percentage cannot be negative" })
    .max(10, { message: "Royalty percentage cannot exceed 10%" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
});

type FormValues = z.infer<typeof listingSchema>;

interface AgentData {
  id: number;
  name: string;
  type: string;
  status: 'active' | 'listed' | 'idle' | 'sold';
  price: number;
  royaltyPercent: number;
  uses: number;
  created: string;
  image: string;
}

interface ListAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentData | null;
  onListComplete: () => void;
}

const ListAgentModal = ({ isOpen, onClose, agent, onListComplete }: ListAgentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [listingComplete, setListingComplete] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      price: agent?.price || 10000,
      royaltyPercent: agent?.royaltyPercent || 2.5,
      description: '',
    },
  });

  if (!agent) return null;

  const onSubmit = (values: FormValues) => {
    setIsProcessing(true);
    
    // Simulate listing process
    setTimeout(() => {
      setIsProcessing(false);
      setListingComplete(true);
      
      console.log("Listing agent with values:", values);
    }, 1500);
  };

  const handleClose = () => {
    if (listingComplete) {
      onListComplete();
    } else {
      onClose();
    }
    
    // Reset state when closing
    setIsProcessing(false);
    setListingComplete(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-agentorium-darkgray border-agentorium-silver/10 text-agentorium-white">
        <DialogHeader>
          <DialogTitle>{listingComplete ? "Agent Listed!" : "List Agent for Sale"}</DialogTitle>
          <DialogDescription className="text-agentorium-silver">
            {listingComplete 
              ? "Your agent has been listed on the marketplace."
              : "Complete the form to list your agent on the marketplace."}
          </DialogDescription>
        </DialogHeader>
        
        {!listingComplete ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4 bg-agentorium-charcoal/50 p-4 rounded-md">
                <img 
                  src={agent.image} 
                  alt={agent.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-bold text-agentorium-white">{agent.name}</h3>
                  <p className="text-xs text-agentorium-silver">{agent.type}</p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-agentorium-white">Listing Price (AGNT)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min={1000} 
                        max={1000000}
                        className="bg-agentorium-charcoal border-agentorium-silver/20"
                      />
                    </FormControl>
                    <FormDescription className="text-agentorium-silver/70">
                      Set the price in AGNT tokens (minimum 1,000)
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="royaltyPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-agentorium-white">Creator Royalty (%)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min={0} 
                        max={10} 
                        step={0.1}
                        className="bg-agentorium-charcoal border-agentorium-silver/20"
                      />
                    </FormControl>
                    <FormDescription className="text-agentorium-silver/70">
                      Percentage you earn on future sales (0-10%)
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-agentorium-white">Marketplace Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe your agent's capabilities and benefits..."
                        className="bg-agentorium-charcoal border-agentorium-silver/20 min-h-24"
                      />
                    </FormControl>
                    <FormDescription className="text-agentorium-silver/70">
                      <span className={field.value.length > 400 ? "text-amber-400" : ""}>
                        {field.value.length}/500 characters
                      </span>
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2 justify-end pt-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={onClose}
                  disabled={isProcessing}
                  className="border-agentorium-silver/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isProcessing}
                  className="bg-agentorium-blue hover:bg-agentorium-blue/90"
                >
                  {isProcessing ? "Processing..." : "List on Marketplace"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/20 p-3">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-agentorium-white mb-2">
                {agent.name} is now listed
              </h3>
              <p className="text-agentorium-silver text-sm">
                Your agent is now available for purchase in the marketplace.
                You'll receive {form.getValues().royaltyPercent}% royalties from any future sales.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <Button 
                onClick={handleClose}
                className="bg-agentorium-blue hover:bg-agentorium-blue/90"
              >
                View Marketplace
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ListAgentModal;
