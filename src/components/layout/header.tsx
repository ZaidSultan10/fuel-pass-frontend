'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth, useAuthActions } from '@/store/auth.store';
import { Plane, LogOut, User, Settings } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { logout } = useAuthActions();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FuelPass</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </button>
            
            {user.role === 'AIRCRAFT_OPERATOR' && (
              <button
                onClick={() => router.push('/orders/new')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                New Order
              </button>
            )}
            
            {user.role === 'OPERATIONS_MANAGER' && (
              <button
                onClick={() => router.push('/orders')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Manage Orders
              </button>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{getRoleDisplayName(user.role)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/profile')}
                className="hidden md:flex"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
