import { z } from 'zod';
import { CreateFuelOrderSchema, UpdateOrderStatusSchema, OrderFiltersSchema } from '@/types';

// Enhanced validation schemas with custom error messages
export const FuelOrderFormSchema = z.object({
  tailNumber: z
    .string()
    .min(1, 'Tail number is required')
    .max(10, 'Tail number must be 10 characters or less')
    .regex(/^[A-Z0-9-]+$/, 'Tail number must contain only uppercase letters, numbers, and hyphens'),
  
  airportIcaoCode: z
    .string()
    .length(4, 'ICAO code must be exactly 4 characters')
    .regex(/^[A-Z]{4}$/, 'ICAO code must be 4 uppercase letters'),
  
  requestedFuelVolume: z
    .number({ invalid_type_error: 'Fuel volume must be a number' })
    .positive('Fuel volume must be greater than 0')
    .max(100000, 'Fuel volume cannot exceed 100,000 gallons'),
  
  deliveryTimeWindowStart: z
    .date({ invalid_type_error: 'Start time is required' })
    .min(new Date(), 'Start time cannot be in the past'),
  
  deliveryTimeWindowEnd: z
    .date(),
  
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional(),
});

export const OrderStatusUpdateSchema = z.object({
  newStatus: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], {
    required_error: 'Status is required',
  }),
});

export const OrderFiltersFormSchema = z.object({
  airportIcaoCode: z
    .string()
    .length(4, 'ICAO code must be exactly 4 characters')
    .regex(/^[A-Z]{4}$/, 'ICAO code must be 4 uppercase letters')
    .optional()
    .or(z.literal('')),
  
  status: z
    .enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
    .optional(),
  
  tailNumber: z
    .string()
    .max(10, 'Tail number must be 10 characters or less')
    .optional()
    .or(z.literal('')),
  
  dateFrom: z
    .date()
    .optional(),
  
  dateTo: z
    .date()
    .optional(),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return data.dateTo >= data.dateFrom;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['dateTo'],
  }
);

// Utility functions for validation
export const validateIcaoCode = (code: string): boolean => {
  return /^[A-Z]{4}$/.test(code);
};

export const validateTailNumber = (tailNumber: string): boolean => {
  return /^[A-Z0-9-]+$/.test(tailNumber) && tailNumber.length <= 10;
};

export const validateFuelVolume = (volume: number): boolean => {
  return volume > 0 && volume <= 100000;
};

export const validateDeliveryWindow = (start: Date, end: Date): boolean => {
  const now = new Date();
  
  return start >= now;
};

// Type exports
export type FuelOrderFormData = z.infer<typeof FuelOrderFormSchema>;
export type OrderStatusUpdateData = z.infer<typeof OrderStatusUpdateSchema>;
export type OrderFiltersFormData = z.infer<typeof OrderFiltersFormSchema>;
