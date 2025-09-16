'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { OrderList } from '@/components/orders/order-list';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <OrderList />
        </main>
      </div>
    </ProtectedRoute>
  );
}
