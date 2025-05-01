import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import MyAgents from '@/components/dashboard/MyAgents';
import Marketplace from '@/components/dashboard/Marketplace';
import Credits from '@/components/dashboard/Credits';
import Royalties from '@/components/dashboard/Royalties';
import Settings from '@/components/dashboard/Settings';
import AgentChatPage from '@/components/dashboard/AgentChatPage';
import ConnectWalletPage from '@/components/dashboard/ConnectWalletPage';

const Dashboard = () => {
  const [walletConnected, setWalletConnected] = useState(false);

  // This would typically come from your wallet connection logic
  useEffect(() => {
    const checkWalletConnection = () => {
      const isConnected = !!localStorage.getItem('hederaAccountId'); // Assuming Hedera Wallet connection
      console.log('Wallet connected:', isConnected);
      setWalletConnected(isConnected);
    };

    console.log('Checking wallet connection...');
    checkWalletConnection();
  }, []);

  return (
    <SidebarProvider>
      <DashboardLayout>
        <Routes>
          {!walletConnected ? (
            <Route path="*" element={<ConnectWalletPage />} />
          ) : (
            <>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/agents" element={<MyAgents />} />
              <Route path="/agents/chat/:id" element={<AgentChatPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/royalties" element={<Royalties />} />
              <Route path="/settings" element={<Settings />} />
            </>
          )}
        </Routes>
      </DashboardLayout>
    </SidebarProvider>
  );
};

export default Dashboard;
