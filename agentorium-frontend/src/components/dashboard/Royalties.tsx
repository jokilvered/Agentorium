
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Award, Calendar } from 'lucide-react';

const mockRoyaltyData = [
  { month: 'Jan', royalties: 120 },
  { month: 'Feb', royalties: 180 },
  { month: 'Mar', royalties: 250 },
  { month: 'Apr', royalties: 310 },
  { month: 'May', royalties: 420 },
  { month: 'Jun', royalties: 490 },
  { month: 'Jul', royalties: 520 },
];

const mockRoyaltyTransactions = [
  { id: 1, agent: 'SmartBot #121', user: 'user894', amount: 120, date: '2025-04-30' },
  { id: 2, agent: 'DataWhiz #78', user: 'cryptoExpert', amount: 75, date: '2025-04-29' },
  { id: 3, agent: 'AIHelper #56', user: 'aiEnthusiast', amount: 95, date: '2025-04-28' },
  { id: 4, agent: 'AnalyticsGuru #45', user: 'dataScientist', amount: 150, date: '2025-04-27' },
  { id: 5, agent: 'SmartBot #121', user: 'techGuru', amount: 100, date: '2025-04-26' },
];

const Royalties = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-agentorium-white">Royalties</h1>
        <p className="text-agentorium-silver">Track and manage your agent royalties</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardDescription className="text-agentorium-silver flex items-center gap-2">
              <Award size={16} className="text-agentorium-blue" />
              Total Royalties Earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-agentorium-white">2,540</div>
            <p className="text-sm text-agentorium-silver mt-1">$25.40 equivalent</p>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-agentorium-silver">This Month</span>
                <span className="text-xs text-agentorium-blue">+120 (+12.5%)</span>
              </div>
              <div className="w-full h-1.5 bg-agentorium-charcoal rounded-full">
                <div 
                  className="bg-gradient-to-r from-agentorium-blue to-agentorium-cyan h-1.5 rounded-full" 
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardTitle className="text-agentorium-white text-lg">Royalty Trend</CardTitle>
            <CardDescription className="text-agentorium-silver flex items-center gap-2">
              <Calendar size={14} className="text-agentorium-silver" />
              Last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRoyaltyData}>
                  <defs>
                    <linearGradient id="royaltyColorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                  <XAxis dataKey="month" stroke="#B2B2B2" />
                  <YAxis stroke="#B2B2B2" />
                  <Tooltip contentStyle={{ backgroundColor: '#2C2C2C', borderColor: '#444' }} />
                  <Area 
                    type="monotone" 
                    dataKey="royalties" 
                    stroke="#007BFF" 
                    fillOpacity={1} 
                    fill="url(#royaltyColorGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-4 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardTitle className="text-agentorium-white text-lg">Royalty History</CardTitle>
            <CardDescription className="text-agentorium-silver">
              Detailed record of royalty earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4 bg-agentorium-charcoal">
                <TabsTrigger value="all">All Royalties</TabsTrigger>
                <TabsTrigger value="smartbot">SmartBot #121</TabsTrigger>
                <TabsTrigger value="datawhiz">DataWhiz #78</TabsTrigger>
                <TabsTrigger value="other">Other Agents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="m-0">
                <Table>
                  <TableHeader className="bg-agentorium-charcoal">
                    <TableRow>
                      <TableHead className="text-agentorium-silver">Agent</TableHead>
                      <TableHead className="text-agentorium-silver">Used By</TableHead>
                      <TableHead className="text-agentorium-silver">Amount</TableHead>
                      <TableHead className="text-agentorium-silver">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRoyaltyTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-b border-agentorium-silver/10">
                        <TableCell>
                          <div className="font-medium text-agentorium-white">{transaction.agent}</div>
                        </TableCell>
                        <TableCell className="text-agentorium-silver">{transaction.user}</TableCell>
                        <TableCell className="text-agentorium-blue font-medium">
                          +{transaction.amount}
                        </TableCell>
                        <TableCell className="text-agentorium-silver">{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              {/* Similar TabsContent for other tabs, filtered by agent */}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Royalties;
