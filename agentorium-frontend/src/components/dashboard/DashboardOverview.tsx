import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Coins, Users, Award, Clock, Activity, ShoppingCart } from 'lucide-react';

const mockAgentData = [
  { name: 'Agent A', performance: 80, usage: 65, revenue: 1200 },
  { name: 'Agent B', performance: 65, usage: 80, revenue: 900 },
  { name: 'Agent C', performance: 90, usage: 50, revenue: 1500 },
  { name: 'Agent D', performance: 75, usage: 70, revenue: 1100 },
];

const mockActivityData = [
  { day: 'Mon', agents: 4, credits: 120, royalties: 85 },
  { day: 'Tue', agents: 5, credits: 100, royalties: 75 },
  { day: 'Wed', agents: 7, credits: 140, royalties: 90 },
  { day: 'Thu', agents: 3, credits: 80, royalties: 60 },
  { day: 'Fri', agents: 6, credits: 130, royalties: 95 },
  { day: 'Sat', agents: 8, credits: 150, royalties: 110 },
  { day: 'Sun', agents: 5, credits: 110, royalties: 80 },
];

const mockTransactions = [
  { id: 1, type: 'sale', agentName: 'SmartBot #121', amount: 10000, date: '2025-04-30' },
  { id: 2, type: 'purchase', agentName: 'AnalyticsGuru #45', amount: 8500, date: '2025-04-29' },
  { id: 3, type: 'royalty', agentName: 'DataWhiz #78', amount: 250, date: '2025-04-28' },
  { id: 4, type: 'credit', amount: 5000, date: '2025-04-27' },
  { id: 5, type: 'sale', agentName: 'AIHelper #56', amount: 7500, date: '2025-04-26' },
];

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-agentorium-white">Dashboard Overview</h1>
        <p className="text-agentorium-silver">Welcome to your Agentorium dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10 transition-all duration-300 hover:border-agentorium-cyan/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-agentorium-silver flex items-center gap-2">
              <Users size={16} className="text-agentorium-blue" />
              My AI Agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-agentorium-white">12</div>
            <p className="text-xs text-agentorium-silver mt-1">4 active, 2 listed, 6 idle</p>
          </CardContent>
        </Card>
        
        <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10 transition-all duration-300 hover:border-agentorium-cyan/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-agentorium-silver flex items-center gap-2">
              <Coins size={16} className="text-agentorium-blue" />
              Credit Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-agentorium-white">15,000</div>
            <p className="text-xs text-agentorium-silver mt-1">~$150 equivalent</p>
          </CardContent>
        </Card>
        
        <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10 transition-all duration-300 hover:border-agentorium-cyan/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-agentorium-silver flex items-center gap-2">
              <Award size={16} className="text-agentorium-blue" />
              Royalties Earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-agentorium-white">2,540</div>
            <p className="text-xs text-agentorium-silver mt-1">+120 this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10 transition-all duration-300 hover:border-agentorium-cyan/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-agentorium-silver flex items-center gap-2">
              <Activity size={16} className="text-agentorium-blue" />
              Agent Activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-agentorium-white">78%</div>
            <p className="text-xs text-agentorium-silver mt-1">+12% from last week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardTitle className="text-agentorium-white text-lg">Weekly Activity</CardTitle>
            <CardDescription className="text-agentorium-silver">Your platform activity for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="agents">
              <TabsList className="mb-4 bg-agentorium-charcoal">
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="credits">Credits</TabsTrigger>
                <TabsTrigger value="royalties">Royalties</TabsTrigger>
              </TabsList>
              
              <TabsContent value="agents" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                    <XAxis dataKey="day" stroke="#B2B2B2" />
                    <YAxis stroke="#B2B2B2" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#2C2C2C',
                        borderColor: '#444',
                      }}
                      labelStyle={{ color: '#F4F4F4' }}
                    />
                    <Bar dataKey="agents" fill="#007BFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="credits" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                    <XAxis dataKey="day" stroke="#B2B2B2" />
                    <YAxis stroke="#B2B2B2" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#2C2C2C', 
                        borderColor: '#444'
                      }}
                      labelStyle={{ color: '#F4F4F4' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="credits" 
                      stroke="#00FFFF" 
                      strokeWidth={2} 
                      dot={{ fill: '#00FFFF', r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="royalties" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockActivityData}>
                    <defs>
                      <linearGradient id="royaltyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#007BFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                    <XAxis dataKey="day" stroke="#B2B2B2" />
                    <YAxis stroke="#B2B2B2" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#2C2C2C', 
                        borderColor: '#444'
                      }}
                      labelStyle={{ color: '#F4F4F4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="royalties" 
                      stroke="#007BFF" 
                      fill="url(#royaltyGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 bg-agentorium-darkgray/60 border-agentorium-silver/10">
          <CardHeader>
            <CardTitle className="text-agentorium-white text-lg">Recent Transactions</CardTitle>
            <CardDescription className="text-agentorium-silver">Your latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 rounded-md hover:bg-agentorium-charcoal">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full 
                      ${transaction.type === 'sale' ? 'bg-agentorium-blue/20 text-agentorium-blue' : 
                        transaction.type === 'purchase' ? 'bg-agentorium-cyan/20 text-agentorium-cyan' :
                        transaction.type === 'royalty' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                        'bg-green-500/20 text-green-500'}`}
                    >
                      {transaction.type === 'sale' && <Activity size={16} />}
                      {transaction.type === 'purchase' && <ShoppingCart size={16} />}
                      {transaction.type === 'royalty' && <Award size={16} />}
                      {transaction.type === 'credit' && <Coins size={16} />}
                    </div>
                    <div>
                      <p className="text-sm text-agentorium-white">
                        {transaction.type === 'sale' && `Sold ${transaction.agentName}`}
                        {transaction.type === 'purchase' && `Bought ${transaction.agentName}`}
                        {transaction.type === 'royalty' && `Royalty from ${transaction.agentName}`}
                        {transaction.type === 'credit' && 'Credit Top-up'}
                      </p>
                      <p className="text-xs text-agentorium-silver">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-agentorium-white">
                    {transaction.type === 'purchase' ? `-` : '+'}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm text-agentorium-blue hover:underline">View All Transactions</button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Performing Agents */}
      <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
        <CardHeader>
          <CardTitle className="text-agentorium-white text-lg">Top Performing AI Agents</CardTitle>
          <CardDescription className="text-agentorium-silver">Your best AI agents by performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAgentData.map((agent, index) => (
              <Card key={index} className="bg-agentorium-charcoal border-agentorium-silver/10 hover:border-agentorium-blue/30 transition-all duration-300">
                <CardHeader className="p-4">
                  <CardTitle className="text-agentorium-white text-md">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-agentorium-silver">Performance</span>
                      <span className="text-sm text-agentorium-white">{agent.performance}%</span>
                    </div>
                    <div className="w-full bg-agentorium-darkgray rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-agentorium-blue to-agentorium-cyan h-1.5 rounded-full" 
                        style={{ width: `${agent.performance}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 text-xs">
                    <div>
                      <p className="text-agentorium-silver">Usage</p>
                      <p className="text-agentorium-white font-medium">{agent.usage}%</p>
                    </div>
                    <div>
                      <p className="text-agentorium-silver">Revenue</p>
                      <p className="text-agentorium-white font-medium">${agent.revenue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
