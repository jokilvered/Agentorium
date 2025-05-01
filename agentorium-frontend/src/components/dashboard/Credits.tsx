
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coins, Plus, ArrowUp, ArrowDown } from 'lucide-react';

const mockCreditTransactions = [
  { id: 1, type: 'purchase', amount: 5000, value: '$50.00', date: '2025-04-30' },
  { id: 2, type: 'usage', amount: -150, description: 'Agent: SmartBot #121', date: '2025-04-29' },
  { id: 3, type: 'usage', amount: -75, description: 'Agent: AIHelper #56', date: '2025-04-28' },
  { id: 4, type: 'purchase', amount: 2000, value: '$20.00', date: '2025-04-25' },
  { id: 5, type: 'usage', amount: -200, description: 'Agent: AnalyticsGuru #45', date: '2025-04-24' },
];

const Credits = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-agentorium-white">Credits & Top-Up</h1>
        <p className="text-agentorium-silver">Manage your platform credits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardDescription className="text-agentorium-silver flex items-center gap-2">
              <Coins size={16} className="text-agentorium-blue" />
              Credit Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-agentorium-white mb-2">15,000</div>
            <div className="text-agentorium-silver text-sm mb-6">~$150 equivalent</div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-agentorium-silver mb-1">Credit Usage (This Month)</div>
                <div className="w-full bg-agentorium-charcoal h-2 rounded-full">
                  <div className="bg-gradient-to-r from-agentorium-blue to-agentorium-cyan h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-agentorium-silver">
                  <span>425/1,200 credits used</span>
                  <span>35%</span>
                </div>
              </div>
            </div>
            
            <Button className="mt-6 w-full gap-2">
              <Plus className="h-4 w-4" />
              <span>Top Up Credits</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardTitle className="text-agentorium-white text-lg">Transaction History</CardTitle>
            <CardDescription className="text-agentorium-silver">
              Recent credit transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-agentorium-charcoal">
                <TableRow>
                  <TableHead className="text-agentorium-silver">Transaction</TableHead>
                  <TableHead className="text-agentorium-silver">Amount</TableHead>
                  <TableHead className="text-agentorium-silver">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCreditTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-b border-agentorium-silver/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${
                          transaction.type === 'purchase' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-agentorium-silver/20 text-agentorium-silver'
                        }`}>
                          {transaction.type === 'purchase' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-agentorium-white font-medium">
                            {transaction.type === 'purchase' ? 'Credit Purchase' : 'Credit Usage'}
                          </div>
                          <div className="text-xs text-agentorium-silver">
                            {transaction.description || (transaction.value && `Value: ${transaction.value}`)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-500' : 'text-agentorium-silver'
                    }`}>
                      {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                    </TableCell>
                    <TableCell className="text-sm text-agentorium-silver">{transaction.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardTitle className="text-agentorium-white text-lg">Credit Packages</CardTitle>
            <CardDescription className="text-agentorium-silver">
              Choose a credit package to top up your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { credits: 1000, price: '$10', savings: '0%' },
                { credits: 5000, price: '$45', savings: '10%', popular: true },
                { credits: 10000, price: '$85', savings: '15%' },
                { credits: 25000, price: '$200', savings: '20%' }
              ].map((pkg, idx) => (
                <Card key={idx} className={`bg-agentorium-charcoal border-agentorium-silver/10 transition-all duration-300 ${
                  pkg.popular ? 'border-agentorium-blue/50 ring-1 ring-agentorium-blue/30' : ''
                }`}>
                  <CardHeader className="p-4">
                    {pkg.popular && (
                      <div className="text-xs bg-agentorium-blue/20 text-agentorium-blue py-0.5 px-2 rounded-full w-fit mb-2">
                        Most Popular
                      </div>
                    )}
                    <CardTitle className="text-agentorium-white text-lg">{pkg.credits} Credits</CardTitle>
                    <CardDescription className="text-agentorium-silver">
                      {pkg.savings !== '0%' && `Save ${pkg.savings}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold text-agentorium-white mb-4">{pkg.price}</div>
                    <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Credits;
