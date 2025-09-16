'use client';

import { useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { FuelOrderService } from '@/services/fuel-order.service';
import { UserService } from '@/services/user.service';
import { AirportService } from '@/services/airport.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ApiTest() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const testApi = async (name: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const testAuth = () => testApi('auth', async () => {
    // Test authentication endpoints
    const response = await fetch('http://localhost:8080/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    return { status: response.status, statusText: response.statusText };
  });

  const testFuelOrders = () => testApi('fuelOrders', async () => {
    const stats = await FuelOrderService.getOrderStatistics();
    return stats;
  });

  const testUsers = () => testApi('users', async () => {
    const users = await UserService.getAllUsers();
    return { count: users.length, users: users.slice(0, 3) }; // Show first 3 users
  });

  const testAirports = () => testApi('airports', async () => {
    const airports = await AirportService.getActiveAirports();
    return { count: airports.length, airports: airports.slice(0, 3) }; // Show first 3 airports
  });

  const testAll = async () => {
    await Promise.all([
      testAuth(),
      testFuelOrders(),
      testUsers(),
      testAirports()
    ]);
  };

  const clearResults = () => {
    setResults({});
    setLoading({});
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={testAll} disabled={Object.values(loading).some(Boolean)}>
          Test All APIs
        </Button>
        <Button onClick={clearResults} variant="outline">
          Clear Results
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Authentication</h3>
          <Button 
            onClick={testAuth} 
            disabled={loading.auth}
            className="w-full mb-2"
          >
            {loading.auth ? 'Testing...' : 'Test Auth'}
          </Button>
          {results.auth && (
            <div className={`text-sm ${results.auth.success ? 'text-green-600' : 'text-red-600'}`}>
              {results.auth.success ? (
                <div>
                  <p>✅ Auth endpoint accessible</p>
                  <p>Status: {results.auth.data.status}</p>
                </div>
              ) : (
                <p>❌ {results.auth.error}</p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Fuel Orders</h3>
          <Button 
            onClick={testFuelOrders} 
            disabled={loading.fuelOrders}
            className="w-full mb-2"
          >
            {loading.fuelOrders ? 'Testing...' : 'Test Fuel Orders'}
          </Button>
          {results.fuelOrders && (
            <div className={`text-sm ${results.fuelOrders.success ? 'text-green-600' : 'text-red-600'}`}>
              {results.fuelOrders.success ? (
                <div>
                  <p>✅ Fuel orders API working</p>
                  <p>Total Orders: {results.fuelOrders.data.totalOrders}</p>
                  <p>Pending: {results.fuelOrders.data.pendingOrders}</p>
                </div>
              ) : (
                <p>❌ {results.fuelOrders.error}</p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Users</h3>
          <Button 
            onClick={testUsers} 
            disabled={loading.users}
            className="w-full mb-2"
          >
            {loading.users ? 'Testing...' : 'Test Users'}
          </Button>
          {results.users && (
            <div className={`text-sm ${results.users.success ? 'text-green-600' : 'text-red-600'}`}>
              {results.users.success ? (
                <div>
                  <p>✅ Users API working</p>
                  <p>Total Users: {results.users.data.count}</p>
                </div>
              ) : (
                <p>❌ {results.users.error}</p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Airports</h3>
          <Button 
            onClick={testAirports} 
            disabled={loading.airports}
            className="w-full mb-2"
          >
            {loading.airports ? 'Testing...' : 'Test Airports'}
          </Button>
          {results.airports && (
            <div className={`text-sm ${results.airports.success ? 'text-green-600' : 'text-red-600'}`}>
              {results.airports.success ? (
                <div>
                  <p>✅ Airports API working</p>
                  <p>Active Airports: {results.airports.data.count}</p>
                </div>
              ) : (
                <p>❌ {results.airports.error}</p>
              )}
            </div>
          )}
        </Card>
      </div>

      {Object.keys(results).length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Raw Results</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(results, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
