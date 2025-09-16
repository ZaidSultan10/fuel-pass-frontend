'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderFiltersFormSchema, type OrderFiltersFormData } from '@/lib/validations';
import { useFuelOrders, useFuelOrderActions, useFuelOrderFilters, useFuelOrderPagination, useFuelOrderFilterActions, useFuelOrderUI } from '@/store/fuel-order.store';
import { useAuth } from '@/store/auth.store';
import { formatDateTime, getStatusColor, getStatusIcon } from '@/lib/utils';
import { Search, Filter, RefreshCw, Plus, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FuelOrder } from '@/types';

export function OrderList() {
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const orders = useFuelOrders();
  const { fetchOrders, refreshOrders } = useFuelOrderActions();
  const filters = useFuelOrderFilters();
  const pagination = useFuelOrderPagination();
  const { setFilters, setPagination, clearFilters } = useFuelOrderFilterActions();
  const { error, isLoading } = useFuelOrderUI();
  console.log('orders === ',orders);

  // Redirect AIRCRAFT_OPERATOR to form only
  useEffect(() => {
    if (user?.role === 'AIRCRAFT_OPERATOR') {
      router.push('/orders/new');
      return;
    }
  }, [user?.role, router]);

  // Show loading for AIRCRAFT_OPERATOR while redirecting
  if (user?.role === 'AIRCRAFT_OPERATOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to order form...</p>
        </div>
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFiltersFormData>({
    resolver: zodResolver(OrderFiltersFormSchema),
    defaultValues: filters,
  });

  const watchedFilters = watch();

  useEffect(() => {
    // Only fetch orders for Operations Manager
    if (user?.role === 'OPERATIONS_MANAGER') {
      fetchOrders(filters, {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    }
  }, [user?.role, fetchOrders, filters, pagination.page, pagination.limit]);

  const onSubmitFilters = (data: OrderFiltersFormData) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );
    setFilters(cleanFilters);
    setPagination({ page: 1 }); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    reset();
    clearFilters();
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ page: newPage });
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

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading orders: {error}</p>
              <Button onClick={refreshOrders} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fuel Orders</h1>
          <p className="text-gray-600">Manage and track fuel orders</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={refreshOrders}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => router.push('/orders/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter orders by specific criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitFilters)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Airport ICAO Code
                  </label>
                  <Input
                    placeholder="e.g., KJFK"
                    {...register('airportIcaoCode')}
                    className="uppercase"
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                      register('airportIcaoCode').onChange(e);
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tail Number
                  </label>
                  <Input
                    placeholder="e.g., N123AB"
                    {...register('tailNumber')}
                    className="uppercase"
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                      register('tailNumber').onChange(e);
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <Input
                    type="date"
                    {...register('dateFrom', { setValueAs: (value) => value ? new Date(value) : undefined })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No orders found</p>
              <Button onClick={() => router.push('/orders/new')} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tail Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Airport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Window
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: FuelOrder) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.tailNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.airportIcaoCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.requestedFuelVolume.toLocaleString()} gal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{formatDateTime(order.deliveryTimeWindowStart)}</div>
                          <div className="text-gray-500">to {formatDateTime(order.deliveryTimeWindowEnd)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusIcon(order.status)} {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
