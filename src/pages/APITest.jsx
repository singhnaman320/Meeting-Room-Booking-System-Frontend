import React, { useState } from 'react';
import { testAllAPIs, quickAPITest } from '../utils/apiTester';
import { testDeployedBackend, testWithApiService } from '../utils/apiConnectivityTest';
import { Play, CheckCircle, XCircle, Clock, Database, Server, Globe } from 'lucide-react';

const APITest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [quickTestResult, setQuickTestResult] = useState(null);
  const [deployedTestResult, setDeployedTestResult] = useState(null);

  const runQuickTest = async () => {
    setIsRunning(true);
    setQuickTestResult(null);
    
    try {
      const result = await quickAPITest();
      setQuickTestResult(result);
    } catch (error) {
      setQuickTestResult({ success: false, error: error.message });
    }
    
    setIsRunning(false);
  };

  const runFullTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await testAllAPIs();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    }
    
    setIsRunning(false);
  };

  const runDeployedTest = async () => {
    setIsRunning(true);
    setDeployedTestResult(null);
    
    try {
      const result = await testWithApiService();
      setDeployedTestResult(result);
    } catch (error) {
      setDeployedTestResult({ success: false, error: error.message });
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Server className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">API Testing Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Deployed Backend Test
              </h2>
              <p className="text-green-700 mb-4">
                Tests connectivity to your deployed backend on Render
              </p>
              <button
                onClick={runDeployedTest}
                disabled={isRunning}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Test Deployed Backend'}
              </button>
              
              {deployedTestResult && (
                <div className={`mt-4 p-4 rounded-md ${deployedTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center">
                    {deployedTestResult.success ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    <span className="font-medium">
                      {deployedTestResult.success ? deployedTestResult.message : `Error: ${deployedTestResult.error}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Quick Test
              </h2>
              <p className="text-blue-700 mb-4">
                Tests essential APIs: health check, database connection, authentication
              </p>
              <button
                onClick={runQuickTest}
                disabled={isRunning}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Quick Test'}
              </button>
              
              {quickTestResult && (
                <div className={`mt-4 p-4 rounded-md ${quickTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center">
                    {quickTestResult.success ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    <span className="font-medium">
                      {quickTestResult.success ? quickTestResult.message : `Error: ${quickTestResult.error}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">Full Test Suite</h2>
              <p className="text-purple-700 mb-4">
                Comprehensive testing of all API endpoints and functionality
              </p>
              <button
                onClick={runFullTest}
                disabled={isRunning}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Full Test'}
              </button>
            </div>
          </div>

          {testResults && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Results</h2>
              
              <div className="space-y-6">
                {/* Health Check */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">Health Check</h3>
                    {getStatusIcon(testResults.health.status)}
                  </div>
                  <div className={`px-3 py-2 rounded-md ${getStatusColor(testResults.health.status)}`}>
                    Status: {testResults.health.status}
                    {testResults.health.error && (
                      <div className="text-sm mt-1">Error: {testResults.health.error}</div>
                    )}
                  </div>
                </div>

                {/* Authentication */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Authentication APIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(testResults.auth).map(([key, result]) => (
                      <div key={key} className={`p-3 rounded-md ${getStatusColor(result.status)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          {getStatusIcon(result.status)}
                        </div>
                        {result.error && (
                          <div className="text-xs mt-1">{result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rooms */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Room APIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(testResults.rooms).map(([key, result]) => (
                      <div key={key} className={`p-3 rounded-md ${getStatusColor(result.status)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          {getStatusIcon(result.status)}
                        </div>
                        {result.error && (
                          <div className="text-xs mt-1">{result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bookings */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Booking APIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(testResults.bookings).map(([key, result]) => (
                      <div key={key} className={`p-3 rounded-md ${getStatusColor(result.status)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          {getStatusIcon(result.status)}
                        </div>
                        {result.error && (
                          <div className="text-xs mt-1">{result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Users */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">User APIs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(testResults.users).map(([key, result]) => (
                      <div key={key} className={`p-3 rounded-md ${getStatusColor(result.status)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          {getStatusIcon(result.status)}
                        </div>
                        {result.error && (
                          <div className="text-xs mt-1">{result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Instructions</h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Make sure the server is running on port 5000</li>
              <li>• Ensure MongoDB is connected (local or Atlas)</li>
              <li>• Run database seeder if no users exist: <code className="bg-yellow-100 px-1 rounded">npm run seed</code></li>
              <li>• Check browser console for detailed error logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITest;
