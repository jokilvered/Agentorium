
import React from 'react';
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { 
  ResponsiveContainer,
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Database, CircleCheck } from "lucide-react";

const mockTVLData = [
  { name: 'Jan', tvl: 120 },
  { name: 'Feb', tvl: 180 },
  { name: 'Mar', tvl: 250 },
  { name: 'Apr', tvl: 310 },
  { name: 'May', tvl: 420 },
  { name: 'Jun', tvl: 490 },
  { name: 'Jul', tvl: 520 },
];

const statisticsData = [
  { 
    name: 'Total Value Locked', 
    value: '$20M', 
    change: '+12.5%',
    description: 'Total funds locked in the platform',
    icon: Database
  },
  { 
    name: 'Active Agents', 
    value: '15,000', 
    change: '+8.3%',
    description: 'AI agents created by users',
    icon: CircleCheck
  },
  { 
    name: 'Daily Transactions', 
    value: '9,876', 
    change: '+15.2%',
    description: 'Transactions processed in 24 hours',
    icon: TrendingUp
  },
  { 
    name: 'Active Users', 
    value: '50,000', 
    change: '+18.7%',
    description: 'Users engaging with the platform',
    icon: Users
  },
];

const chartConfig = {
  tvl: { 
    label: 'TVL', 
    color: '#007BFF' 
  }
};

const Statistics: React.FC = () => {
  return (
    <div id="statistics" className="py-20 relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-agentorium-white">
            Agentorium <span className="text-agentorium-blue">by the Numbers</span>
          </h2>
          <p className="text-agentorium-silver max-w-2xl mx-auto">
            Real-time metrics and analytics from the Agentorium ecosystem
          </p>
        </div>

        {/* Enhanced Statistics Cards with geometric patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statisticsData.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden bg-agentorium-darkgray/60 border-agentorium-silver/10 transition-all duration-300 hover:border-agentorium-cyan/20">
              
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-agentorium-silver text-sm mb-2">{stat.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-agentorium-white">{stat.value}</span>
                      <span className="text-sm text-agentorium-cyan">{stat.change}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-agentorium-blue/10">
                    <stat.icon className="h-5 w-5 text-agentorium-blue" />
                  </div>
                </div>
                <p className="text-xs text-agentorium-lightsilver mt-2">{stat.description}</p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Enhanced Top Agents Table */}
        <div className="bg-agentorium-darkgray/60 rounded-xl p-6 border border-agentorium-silver/10 relative overflow-hidden">
          
          <h3 className="text-lg font-semibold text-agentorium-white mb-4 relative z-10">Top Performing Agents</h3>
          <div className="relative z-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-agentorium-white">Crypto Arbitrage Agent</TableCell>
                  <TableCell>blockchain_visionary</TableCell>
                  <TableCell>$12,480</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">4.8/5</span>
                      <div className="w-16 h-1.5 bg-agentorium-silver/20 rounded-full">
                        <div className="h-full w-[96%] bg-gradient-to-r from-agentorium-blue to-agentorium-cyan rounded-full"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-agentorium-white">Smart Contract Auditor</TableCell>
                  <TableCell>security_expert</TableCell>
                  <TableCell>$8,975</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">5.0/5</span>
                      <div className="w-16 h-1.5 bg-agentorium-silver/20 rounded-full">
                        <div className="h-full w-full bg-gradient-to-r from-agentorium-blue to-agentorium-cyan rounded-full"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-agentorium-white">DeFi Portfolio Manager</TableCell>
                  <TableCell>defi_strategist</TableCell>
                  <TableCell>$7,640</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">4.7/5</span>
                      <div className="w-16 h-1.5 bg-agentorium-silver/20 rounded-full">
                        <div className="h-full w-[94%] bg-gradient-to-r from-agentorium-blue to-agentorium-cyan rounded-full"></div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
