'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { FuelOrderForm } from '@/components/forms/fuel-order-form';

export default function NewOrderPage() {
  return (
    <ProtectedRoute requiredRole="AIRCRAFT_OPERATOR">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <FuelOrderForm />
        </main>
      </div>
    </ProtectedRoute>
  );
}
