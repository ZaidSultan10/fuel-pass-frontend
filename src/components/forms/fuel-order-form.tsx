'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuelOrderFormSchema, type FuelOrderFormData } from '@/lib/validations';
import { useFuelOrderActions, useFuelOrderUI } from '@/store/fuel-order.store';
import { Plane, Calendar, Fuel, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export function FuelOrderForm() {
  const router = useRouter();
  const { createOrder } = useFuelOrderActions();
  const { isSubmitting } = useFuelOrderUI();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FuelOrderFormData>({
    resolver: zodResolver(FuelOrderFormSchema),
    defaultValues: {
      tailNumber: '',
      airportIcaoCode: '',
      requestedFuelVolume: 0,
      deliveryTimeWindowStart: undefined,
      deliveryTimeWindowEnd: undefined,
      notes: '',
    },
  });

  const watchedStartTime = watch('deliveryTimeWindowStart');

  // Set default dates on client side to avoid hydration issues
  useEffect(() => {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    setValue('deliveryTimeWindowStart', now);
    setValue('deliveryTimeWindowEnd', twoHoursLater);
  }, [setValue]);

  const onSubmit = async (data: FuelOrderFormData) => {
    try {
      await createOrder(data);
      router.push('/dashboard');
    } catch (error) {
      // Error is already handled by the store with toast
      // No need to do anything here
    }
  };

  const handleStartTimeChange = (value: string) => {
    const startTime = new Date(value);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
    
    setValue('deliveryTimeWindowStart', startTime);
    setValue('deliveryTimeWindowEnd', endTime);
  };

  const handleEndTimeChange = (value: string) => {
    const endTime = new Date(value);
    setValue('deliveryTimeWindowEnd', endTime);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-6 w-6 text-blue-600" />
            <span>New Fuel Order</span>
          </CardTitle>
          <CardDescription>
            Submit a request for aircraft refueling at a specific airport
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tail Number */}
            <div>
              <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700 mb-2">
                <Plane className="inline h-4 w-4 mr-1" />
                Tail Number
              </label>
              <Input
                id="tailNumber"
                type="text"
                placeholder="e.g., N123AB"
                error={!!errors.tailNumber}
                helperText={errors.tailNumber?.message}
                {...register('tailNumber')}
                className="uppercase"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register('tailNumber').onChange(e);
                }}
              />
            </div>

            {/* Airport ICAO Code */}
            <div>
              <label htmlFor="airportIcaoCode" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Airport ICAO Code
              </label>
              <Input
                id="airportIcaoCode"
                type="text"
                placeholder="e.g., KJFK"
                maxLength={4}
                error={!!errors.airportIcaoCode}
                helperText={errors.airportIcaoCode?.message}
                {...register('airportIcaoCode')}
                className="uppercase"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register('airportIcaoCode').onChange(e);
                }}
              />
            </div>

            {/* Requested Fuel Volume */}
            <div>
              <label htmlFor="requestedFuelVolume" className="block text-sm font-medium text-gray-700 mb-2">
                <Fuel className="inline h-4 w-4 mr-1" />
                Requested Fuel Volume (Gallons)
              </label>
              <Input
                id="requestedFuelVolume"
                type="number"
                min="1"
                max="100000"
                step="1"
                placeholder="e.g., 5000"
                error={!!errors.requestedFuelVolume}
                helperText={errors.requestedFuelVolume?.message}
                {...register('requestedFuelVolume', { valueAsNumber: true })}
              />
            </div>

            {/* Delivery Time Window */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="inline h-4 w-4 mr-1" />
                Delivery Time Window
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-600 mb-1">
                    Start Time
                  </label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    error={!!errors.deliveryTimeWindowStart}
                    helperText={errors.deliveryTimeWindowStart?.message}
                    value={watchedStartTime ? format(watchedStartTime, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-600 mb-1">
                    End Time
                  </label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    error={!!errors.deliveryTimeWindowEnd}
                    helperText={errors.deliveryTimeWindowEnd?.message}
                    {...register('deliveryTimeWindowEnd', {
                      setValueAs: (value) => new Date(value),
                    })}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any additional information or special requirements..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('notes')}
              />
              {errors.notes && (
                <p className="mt-1 text-xs text-destructive">{errors.notes.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
