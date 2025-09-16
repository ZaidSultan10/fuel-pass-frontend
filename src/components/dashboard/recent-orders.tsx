'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFuelOrders, useFuelOrdersLoading, useFuelOrderActions } from '@/store/fuel-order.store';
import { useAuth } from '@/store/auth.store';
import { formatDateTime, getStatusColor, getStatusIcon } from '@/lib/utils';
import { Eye, Plus } from 'lucide-react';

export function RecentOrders() {
  const router = useRouter();
  const { user } = useAuth();
  const orders = useFuelOrders();
  const isLoading = useFuelOrdersLoading();
  const { fetchOrders } = useFuelOrderActions();

  useEffect(() => {
    // Only fetch orders for Operations Manager
    if (user?.role === 'OPERATIONS_MANAGER') {
      // Fetch recent orders (last 5)
      fetchOrders({}, { 
        page: 1, 
        limit: 5, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
    }
  }, [user?.role, fetchOrders]);

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest fuel orders submitted</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/orders')}
            >
              View All
            </Button>
            <Button
              size="sm"
              onClick={() => router.push('/orders/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No orders found</p>
            <Button onClick={() => router.push('/orders/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Order
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.tailNumber} - {order.airportIcaoCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.requestedFuelVolume.toLocaleString()} gallons
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusIcon(order.status)} {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
