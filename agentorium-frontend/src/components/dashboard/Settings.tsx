
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-agentorium-white">Settings</h1>
        <p className="text-agentorium-silver">Manage your account preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-agentorium-charcoal w-full justify-start mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="m-0 space-y-6">
          <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
            <CardHeader>
              <CardTitle className="text-agentorium-white text-lg">Personal Information</CardTitle>
              <CardDescription className="text-agentorium-silver">
                Update your personal profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-agentorium-silver">Display Name</Label>
                  <Input defaultValue="AI Developer" className="bg-agentorium-charcoal border-agentorium-silver/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-agentorium-silver">Email</Label>
                  <Input defaultValue="user@example.com" disabled className="bg-agentorium-charcoal border-agentorium-silver/10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-agentorium-silver">Creator Bio</Label>
                  <Input className="bg-agentorium-charcoal border-agentorium-silver/10" placeholder="Tell others about yourself" />
                </div>
                <div className="space-y-2">
                  <Label className="text-agentorium-silver">Website</Label>
                  <Input className="bg-agentorium-charcoal border-agentorium-silver/10" placeholder="Your website URL" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
            <CardHeader>
              <CardTitle className="text-agentorium-white text-lg">Account Preferences</CardTitle>
              <CardDescription className="text-agentorium-silver">
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-agentorium-white">Dark Mode</Label>
                  <p className="text-agentorium-silver text-sm">Enable dark mode for the interface</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-agentorium-white">Show Agent Analytics</Label>
                  <p className="text-agentorium-silver text-sm">Show detailed analytics for your agents</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-agentorium-white">Public Profile</Label>
                  <p className="text-agentorium-silver text-sm">Make your creator profile public</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallet" className="m-0 space-y-6">
          <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
            <CardHeader>
              <CardTitle className="text-agentorium-white text-lg">Wallet Settings</CardTitle>
              <CardDescription className="text-agentorium-silver">
                Manage your connected wallets and payment options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-agentorium-silver/10 rounded-md">
                  <div>
                    <p className="text-agentorium-white font-medium">MetaMask</p>
                    <p className="text-agentorium-silver text-sm">0x71C7...976F</p>
                  </div>
                  <Button variant="outline" size="sm">Disconnect</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-agentorium-silver/10 rounded-md">
                  <div>
                    <p className="text-agentorium-white font-medium">Connect Another Wallet</p>
                    <p className="text-agentorium-silver text-sm">Add a new wallet to your account</p>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Label className="text-agentorium-white mb-2 block">Default Wallet for Payments</Label>
                <div className="flex items-center gap-2 p-4 border border-agentorium-blue/20 rounded-md bg-agentorium-blue/5">
                  <div className="flex-1">
                    <p className="text-agentorium-white font-medium">MetaMask</p>
                    <p className="text-agentorium-silver text-sm">0x71C7...976F</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
            <CardHeader>
              <CardTitle className="text-agentorium-white text-lg">Payout Settings</CardTitle>
              <CardDescription className="text-agentorium-silver">
                Configure how you receive payments from royalties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch id="auto-payout" />
                <div>
                  <Label htmlFor="auto-payout" className="text-agentorium-white">Automatic Payouts</Label>
                  <p className="text-agentorium-silver text-sm">Automatically transfer royalties to your wallet</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-agentorium-silver">Minimum Payout Amount</Label>
                <Input className="bg-agentorium-charcoal border-agentorium-silver/10" defaultValue="100" />
                <p className="text-xs text-agentorium-silver">Minimum amount required before automatic payout occurs</p>
              </div>
              
              <Button>Save Payout Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="m-0 space-y-6">
          <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
            <CardHeader>
              <CardTitle className="text-agentorium-white text-lg">Notification Preferences</CardTitle>
              <CardDescription className="text-agentorium-silver">
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-agentorium-white">Agent Sales</Label>
                    <p className="text-agentorium-silver text-sm">Get notified when your agents are sold</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-agentorium-white">Royalty Payments</Label>
                    <p className="text-agentorium-silver text-sm">Get notified when you receive royalties</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-agentorium-white">Credit Usage</Label>
                    <p className="text-agentorium-silver text-sm">Get notified when your credits are low</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-agentorium-white">Marketplace Updates</Label>
                    <p className="text-agentorium-silver text-sm">Get notified about new marketplace features</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="pt-4">
                <Label className="text-agentorium-white mb-2 block">Email Notifications</Label>
                <div className="flex items-center gap-2">
                  <Switch id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications" className="text-agentorium-silver">
                    Send email notifications for important events
                  </Label>
                </div>
              </div>
              
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="m-0 space-y-6">
          <Card className="bg-agentorium-darkgray/60 border-agentorium-silver/10">
            <CardHeader>
              <CardTitle className="text-agentorium-white text-lg">API Keys</CardTitle>
              <CardDescription className="text-agentorium-silver">
                Manage your API keys for programmatic access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border border-agentorium-silver/10 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-agentorium-white font-medium">Production API Key</p>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <Input 
                    value="••••••••••••••••••••••••••••••" 
                    disabled 
                    className="bg-agentorium-charcoal/50 border-agentorium-silver/10 mb-1"
                  />
                  <p className="text-xs text-agentorium-silver">Last used: 2025-04-30 13:25:17</p>
                </div>
                
                <div className="p-4 border border-agentorium-silver/10 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-agentorium-white font-medium">Test API Key</p>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <Input 
                    value="••••••••••••••••••••••••••••••" 
                    disabled 
                    className="bg-agentorium-charcoal/50 border-agentorium-silver/10 mb-1"
                  />
                  <p className="text-xs text-agentorium-silver">Last used: 2025-04-28 09:12:05</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Label className="text-agentorium-white mb-2 block">API Usage Limits</Label>
                <div className="flex items-center justify-between p-2 mb-2 rounded-md bg-agentorium-charcoal">
                  <p className="text-agentorium-silver">Requests this month</p>
                  <p className="text-agentorium-white">1,250 / 5,000</p>
                </div>
                <div className="w-full bg-agentorium-charcoal h-2 rounded-full">
                  <div 
                    className="bg-gradient-to-r from-agentorium-blue to-agentorium-cyan h-2 rounded-full" 
                    style={{ width: '25%' }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline">View API Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
