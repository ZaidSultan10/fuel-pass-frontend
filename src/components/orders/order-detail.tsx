'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderStatusUpdateSchema, type OrderStatusUpdateData } from '@/lib/validations';
import { useCurrentOrder, useCurrentOrderActions, useFuelOrderActions, useFuelOrderUI } from '@/store/fuel-order.store';
import { useAuth, useIsOperationsManager } from '@/store/auth.store';
import { formatDateTime, getStatusColor, getStatusIcon, calculateTimeDifference } from '@/lib/utils';
import { ArrowLeft, Edit, Save, X, Plane, MapPin, Fuel, Calendar, Clock, User } from 'lucide-react';

interface OrderDetailProps {
  orderId: string;
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const currentOrder = useCurrentOrder();
  const { setCurrentOrder } = useCurrentOrderActions();
  const { fetchOrderById, updateOrderStatus } = useFuelOrderActions();
  const { isSubmitting, error, setError, clearError } = useFuelOrderUI();
  const isOperationsManager = useIsOperationsManager();

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
    reset,
    formState: { errors },
  } = useForm<OrderStatusUpdateData>({
    resolver: zodResolver(OrderStatusUpdateSchema),
    defaultValues: {
      newStatus: currentOrder?.status || 'PENDING',
    },
  });

  React.useEffect(() => {
    // Only fetch order for Operations Manager
    if (orderId && user?.role === 'OPERATIONS_MANAGER') {
      fetchOrderById(orderId);
    }
  }, [orderId, user?.role, fetchOrderById]);

  React.useEffect(() => {
    if (currentOrder) {
      reset({
        newStatus: currentOrder.status,
      });
    }
  }, [currentOrder, reset]);

  const onSubmitStatusUpdate = async (data: OrderStatusUpdateData) => {
    if (!currentOrder) return;

    clearError();
    try {
      await updateOrderStatus(currentOrder.id, data);
      setIsEditingStatus(false);
      
      // Redirect to dashboard after successful update
      // Add a small delay to allow the toast notification to be displayed
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500); // 1.5 second delay to show the success toast
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingStatus(false);
    reset({
      newStatus: currentOrder?.status || 'PENDING',
    });
    clearError();
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

  if (!currentOrder) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading order details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order {currentOrder.id.slice(0, 8)}...
            </h1>
            <p className="text-gray-600">
              {currentOrder.tailNumber} - {currentOrder.airportIcaoCode}
            </p>
          </div>
        </div>
        
        {isOperationsManager && (
          <div className="flex space-x-2">
            {!isEditingStatus ? (
              <Button
                variant="outline"
                onClick={() => setIsEditingStatus(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmitStatusUpdate)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plane className="h-5 w-5" />
                <span>Order Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Order ID</label>
                  <p className="text-sm font-mono text-gray-900">{currentOrder.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tail Number</label>
                  <p className="text-sm text-gray-900">{currentOrder.tailNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Airport ICAO Code</label>
                  <p className="text-sm text-gray-900">{currentOrder.airportIcaoCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fuel Volume</label>
                  <p className="text-sm text-gray-900">
                    {currentOrder.requestedFuelVolume.toLocaleString()} gallons
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Delivery Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Time</label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(currentOrder.deliveryTimeWindowStart)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Time</label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(currentOrder.deliveryTimeWindowEnd)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-sm text-gray-900">
                    {calculateTimeDifference(
                      currentOrder.deliveryTimeWindowStart,
                      currentOrder.deliveryTimeWindowEnd
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {currentOrder.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {currentOrder.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Status and Actions */}
        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingStatus ? (
                <form onSubmit={handleSubmit(onSubmitStatusUpdate)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      {...register('newStatus')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    {errors.newStatus && (
                      <p className="mt-1 text-xs text-destructive">{errors.newStatus.message}</p>
                    )}
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Badge variant={getStatusBadgeVariant(currentOrder.status)} className="text-lg px-4 py-2">
                      {getStatusIcon(currentOrder.status)} {currentOrder.status}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Created</p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(currentOrder.createdAt)}
                    </p>
                  </div>
                </div>
                
                {currentOrder.updatedAt !== currentOrder.createdAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(currentOrder.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
