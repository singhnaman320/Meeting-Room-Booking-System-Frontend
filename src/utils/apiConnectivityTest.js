import apiService from '../services/apiService';

// Test connectivity with deployed backend
export const testDeployedBackend = async () => {
  const backendUrl = 'https://meeting-room-booking-system-backend.onrender.com';
  
  console.log(`🔍 Testing connectivity to: ${backendUrl}`);
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
    
    // Test 2: Test users endpoint (no auth required)
    console.log('2. Testing database connectivity...');
    const usersResponse = await fetch(`${backendUrl}/api/auth/test-users`);
    const usersData = await usersResponse.json();
    console.log('✅ Database connection:', usersData);
    
    // Test 3: Login test
    console.log('3. Testing authentication...');
    const loginResponse = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Authentication successful');
      
      // Test 4: Authenticated endpoint
      console.log('4. Testing authenticated endpoint...');
      const meResponse = await fetch(`${backendUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log('✅ Authenticated request successful:', meData.name);
      } else {
        console.log('❌ Authenticated request failed:', meResponse.status);
      }
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Authentication failed:', errorData);
    }
    
    return {
      success: true,
      message: 'Backend connectivity test completed successfully'
    };
    
  } catch (error) {
    console.error('❌ Backend connectivity test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test using the configured API service
export const testWithApiService = async () => {
  console.log('🔍 Testing with configured API service...');
  
  try {
    // Test health
    const healthResponse = await apiService.health();
    console.log('✅ Health check via API service:', healthResponse.data);
    
    // Test database
    const usersResponse = await apiService.auth.testUsers();
    console.log('✅ Database via API service:', usersResponse.data.userCount, 'users');
    
    // Test login
    const loginResponse = await apiService.auth.login({
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('✅ Login via API service successful');
    
    // Store token
    localStorage.setItem('token', loginResponse.data.token);
    
    // Test authenticated endpoint
    const meResponse = await apiService.auth.getMe();
    console.log('✅ Get me via API service:', meResponse.data.name);
    
    return {
      success: true,
      message: 'API service test completed successfully'
    };
    
  } catch (error) {
    console.error('❌ API service test failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};
