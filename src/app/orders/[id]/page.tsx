'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { OrderDetail } from '@/components/orders/order-detail';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = React.use(params);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <OrderDetail orderId={id} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
