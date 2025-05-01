import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Coins,
  Award,
  Settings,
  Wallet,
  Bell,
  LogOut
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DAppConnector, HederaChainId, HederaSessionEvent } from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';
import { toast } from 'sonner';

const projectId = 'c3345655d13cccffc6cbb3853ad2ec24';
const metadata = {
  name: 'Agentorium',
  description: 'Agentorium is a decentralized platform for creating and trading AI agents.',
  url: 'https://example.com',
  icons: ['https://example.com/icon.png'],
};

let dAppConnector: DAppConnector;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Initialize Wallet Connect
  useEffect(() => {
    const initializeWalletConnect = async () => {
      dAppConnector = new DAppConnector(
        metadata,
        LedgerId.TESTNET,
        projectId,
        [],
        [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
        [HederaChainId.Mainnet]
      );
      await dAppConnector.init({ logger: 'error' });
    };

    initializeWalletConnect();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      const session = await dAppConnector.openModal();
      const sessionAccount = session.namespaces?.hedera?.accounts?.[0];
      const sessionParts = sessionAccount?.split(':');
      const accountId = sessionParts?.pop();

      if (accountId) {
        setWalletConnected(true);
        setWalletAddress(accountId);
        localStorage.setItem('hederaAccountId', accountId);
        toast.success(`Connected to ${accountId.substring(0, 6)}...${accountId.substring(accountId.length - 4)}`);
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    localStorage.removeItem('hederaAccountId');
    toast.info('Wallet disconnected');
  };

  const isActive = (path: string) => {
    return location.pathname === `/dashboard${path}`;
  };

  return (
    <div className="flex min-h-screen bg-agentorium-darkgray">
      <Sidebar>
        <SidebarRail />
        <SidebarHeader className="flex flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-glow text-agentorium-blue">Agentorium</span>
            </Link>
            <SidebarTrigger />
          </div>
          <div className="mt-4">
            <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-agentorium-silver flex items-center gap-2">
                  <Wallet size={16} />
                  Wallet
                </CardTitle>
                {walletConnected ? (
                  <div className="flex flex-col gap-2">
                    <CardDescription className="text-xs flex items-center">
                      <span className="text-agentorium-white truncate">{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</span>
                    </CardDescription>
                    <Button size="sm" className="w-full" variant="outline" onClick={disconnectWallet}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" className="w-full mt-2" onClick={connectWallet}>
                    Connect Wallet
                  </Button>
                )}
              </CardHeader>
            </Card>
          </div>
        </SidebarHeader>


        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('')} tooltip="Dashboard">
                    <Link to="/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/agents')} tooltip="My AI Agents">
                    <Link to="/dashboard/agents">
                      <Users />
                      <span>My AI Agents</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/marketplace')} tooltip="Buy/Sell">
                    <Link to="/dashboard/marketplace">
                      <ShoppingCart />
                      <span>Buy/Sell</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/royalties')} tooltip="Royalties">
                    <Link to="/dashboard/royalties">
                      <Award />
                      <span>Royalties</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/settings')} tooltip="Settings">
                    <Link to="/dashboard/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-agentorium-darkgray">
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
};

export default DashboardLayout;
