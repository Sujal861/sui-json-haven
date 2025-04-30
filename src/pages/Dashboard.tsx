
import { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileJson, Users, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useChainData } from '@/hooks/useChainData';
import DashboardChart from '@/components/DashboardChart';

const Dashboard = () => {
  const { isConnected, store, documents } = useChainData();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Mock statistics
  const stats = {
    totalDocuments: documents.length || 0,
    totalSize: `${((documents.length || 0) * 2.5).toFixed(1)} KB`,
    accessCount: 128,
    lastModified: new Date().toISOString()
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor your JSON documents and storage statistics
          </p>
        </div>
        
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Database className="w-16 h-16 text-blue-400 mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet to Access Dashboard</h2>
            <p className="text-gray-400 mb-6 max-w-md text-center">
              Connect your Sui wallet to view your document statistics and storage information.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="glassmorphism">
                <CardContent className="p-6 flex items-center">
                  <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                    <FileJson className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Documents</p>
                    <h3 className="text-2xl font-bold">{stats.totalDocuments}</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism">
                <CardContent className="p-6 flex items-center">
                  <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                    <Database className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Storage Used</p>
                    <h3 className="text-2xl font-bold">{stats.totalSize}</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism">
                <CardContent className="p-6 flex items-center">
                  <div className="bg-green-500/20 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Access Count</p>
                    <h3 className="text-2xl font-bold">{stats.accessCount}</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism">
                <CardContent className="p-6 flex items-center">
                  <div className="bg-amber-500/20 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <h3 className="text-lg font-bold">
                      {new Date(stats.lastModified).toLocaleDateString()}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Activity Chart */}
            <Card className="glassmorphism mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="mr-2 text-blue-400 h-5 w-5" />
                    Document Activity
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={timeRange === 'day' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTimeRange('day')}
                    >
                      Day
                    </Button>
                    <Button 
                      variant={timeRange === 'week' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTimeRange('week')}
                    >
                      Week
                    </Button>
                    <Button 
                      variant={timeRange === 'month' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTimeRange('month')}
                    >
                      Month
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <DashboardChart timeRange={timeRange} />
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Documents */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileJson className="mr-2 text-blue-400 h-5 w-5" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="divide-y divide-gray-800">
                    {documents.slice(0, 5).map(doc => (
                      <div key={doc.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{doc.key}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(doc.lastModified).toLocaleString()}
                          </p>
                        </div>
                        <Button variant="outline" asChild size="sm">
                          <Link to="/">View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No documents yet</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/">Create Document</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
