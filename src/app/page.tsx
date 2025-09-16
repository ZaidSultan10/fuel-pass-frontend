'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Shield, CheckCircle } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Home page - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard...');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FuelPass</span>
            </div>
            <Button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3">
              <Plane className="h-12 w-12 text-blue-600" />
              <span className="text-4xl font-bold text-gray-900">FuelPass</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Professional Fuel Order Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your aircraft refueling operations with our comprehensive 
            fuel order management system designed for aircraft operators and operations managers.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Plane className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle>Aircraft Operators</CardTitle>
              <CardDescription>
                Submit fuel orders with detailed specifications and delivery windows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Easy order submission</li>
                <li>• Real-time tracking</li>
                <li>• Order history</li>
                <li>• Status notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle>Operations Managers</CardTitle>
              <CardDescription>
                Manage and oversee all fuel orders with comprehensive control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Order management</li>
                <li>• Status updates</li>
                <li>• Analytics dashboard</li>
                <li>• Team coordination</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <CardTitle>Efficient Workflow</CardTitle>
              <CardDescription>
                Streamlined processes for faster and more accurate fuel operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Automated validation</li>
                <li>• Real-time updates</li>
                <li>• Mobile responsive</li>
                <li>• Secure authentication</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription>
                Access the fuel order management system with your credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Button
                  size="lg"
                  onClick={() => {
                    console.log('Navigating to login...');
                    router.push('/login');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  🚀 Sign In to System
                </Button>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-3 font-medium">Demo Accounts:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <strong className="text-blue-800">Aircraft Operator:</strong><br />
                      <span className="text-blue-600">operator@demo.com</span><br />
                      <span className="text-gray-500">password123</span>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <strong className="text-green-800">Operations Manager:</strong><br />
                      <span className="text-green-600">manager@demo.com</span><br />
                      <span className="text-gray-500">password123</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">
                    Click the button above to access the login page
                  </p>
                  <p className="text-xs">
                    Or click here: <button 
                      onClick={() => router.push('/login')}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Go to Login Page
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2024 FuelPass. Professional fuel order management system.</p>
        </footer>
      </div>
    </div>
  );
}
