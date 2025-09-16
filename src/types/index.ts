import { z } from 'zod';

// User and Authentication Types
export const UserRoleSchema = z.enum(['AIRCRAFT_OPERATOR', 'OPERATIONS_MANAGER']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: UserRoleSchema,
  createdAt: z.union([z.date(), z.string()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
  updatedAt: z.union([z.date(), z.string()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
});

export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: UserRoleSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Fuel Order Types
export const OrderStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const FuelOrderSchema = z.object({
  id: z.string().uuid(),
  tailNumber: z.string().min(1).max(10),
  airportIcaoCode: z.string().length(4).regex(/^[A-Z]{4}$/, 'ICAO code must be 4 uppercase letters'),
  requestedFuelVolume: z.number().positive('Fuel volume must be greater than 0'),
  deliveryTimeWindowStart: z.date(),
  deliveryTimeWindowEnd: z.date(),
  status: OrderStatusSchema,
  createdBy: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    role: UserRoleSchema,
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  notes: z.string().optional(),
});

export type FuelOrder = z.infer<typeof FuelOrderSchema>;

export const CreateFuelOrderSchema = FuelOrderSchema.omit({
  id: true,
  status: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  deliveryTimeWindowStart: z.date(),
  deliveryTimeWindowEnd: z.date(),
});

export type CreateFuelOrder = z.infer<typeof CreateFuelOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  newStatus: OrderStatusSchema,
});

export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
  errors: z.array(z.string()).optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

// Filter and Pagination Types
export const OrderFiltersSchema = z.object({
  airportIcaoCode: z.string().optional(),
  status: OrderStatusSchema.optional(),
  tailNumber: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

export type OrderFilters = z.infer<typeof OrderFiltersSchema>;

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = z.object({
  data: z.array(FuelOrderSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
