'use client';

import React, { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { useAuth } from '@/store/auth.store';
// import { useFuelOrderStatisticsActions } from '@/store/fuel-order.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, BarChart3, FileText, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  // const { fetchStatistics } = useFuelOrderStatisticsActions();
  const router = useRouter();

  // useEffect(() => {
  //   fetchStatistics();
  // }, []);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'AIRCRAFT_OPERATOR':
        return 'Aircraft Operator';
      case 'OPERATIONS_MANAGER':
        return 'Operations Manager';
      default:
        return role;
    }
  };

  const getQuickActions = () => {
    if (user?.role === 'AIRCRAFT_OPERATOR') {
      return [
        {
          title: 'New Fuel Order',
          description: 'Submit a new fuel order request',
          icon: Plane,
          action: () => router.push('/orders/new'),
          color: 'bg-blue-600 hover:bg-blue-700',
        },
      ];
    } else if (user?.role === 'OPERATIONS_MANAGER') {
      return [
        {
          title: 'Manage Orders',
          description: 'View and update all fuel orders',
          icon: FileText,
          action: () => router.push('/orders'),
          color: 'bg-blue-600 hover:bg-blue-700',
        },
        {
          title: 'Analytics',
          description: 'View order statistics and reports',
          icon: BarChart3,
          action: () => router.push('/analytics'),
          color: 'bg-purple-600 hover:bg-purple-700',
        },
      ];
    }
    return [];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.email}!
            </h1>
            <p className="text-gray-600 mt-2">
              {getRoleDisplayName(user?.role || '')} Dashboard
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getQuickActions().map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${action.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={action.action}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        Go
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Statistics - Only for Operations Manager */}
          {user?.role === 'OPERATIONS_MANAGER' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <DashboardStats />
            </div>
          )}

          {/* Recent Orders - Only for Operations Manager */}
          {user?.role === 'OPERATIONS_MANAGER' && (
            <div className="mb-8">
              <RecentOrders />
            </div>
          )}

          {/* System Status - Only for Operations Manager */}
          {user?.role === 'OPERATIONS_MANAGER' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>System Status</span>
                  </CardTitle>
                  <CardDescription>
                    Current system health and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">API Status</span>
                      <span className="text-sm font-medium text-green-600">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="text-sm font-medium text-green-600">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Sync</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system activities and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="text-gray-900">System initialized successfully</p>
                      <p className="text-gray-500">Just now</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-900">User authentication verified</p>
                      <p className="text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-900">Dashboard loaded</p>
                      <p className="text-gray-500">3 minutes ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
