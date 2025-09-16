import { ApiTest } from '@/components/api/api-test';

export default function ApiTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Integration Test</h1>
        <p className="text-gray-600 mb-8">
          This page tests the integration between the Next.js frontend and Java Spring Boot backend.
          Make sure your backend is running on <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8080</code>.
        </p>
        
        <ApiTest />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Integration Status</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Frontend services configured</li>
            <li>✅ API endpoints defined</li>
            <li>✅ HTTP-only cookie authentication</li>
            <li>✅ Error handling implemented</li>
            <li>✅ TypeScript types aligned</li>
            <li>🔄 Backend connection (test above)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
