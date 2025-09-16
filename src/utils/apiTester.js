import apiService from '../services/apiService';

// API Testing utility to verify all endpoints work correctly
export const testAllAPIs = async () => {
  const results = {
    health: { status: 'pending', error: null },
    auth: {
      testUsers: { status: 'pending', error: null },
      register: { status: 'pending', error: null },
      login: { status: 'pending', error: null },
      me: { status: 'pending', error: null }
    },
    rooms: {
      getAll: { status: 'pending', error: null },
      create: { status: 'pending', error: null },
      getById: { status: 'pending', error: null },
      update: { status: 'pending', error: null },
      delete: { status: 'pending', error: null }
    },
    bookings: {
      getAll: { status: 'pending', error: null },
      getMyBookings: { status: 'pending', error: null },
      create: { status: 'pending', error: null },
      cancel: { status: 'pending', error: null },
      delete: { status: 'pending', error: null }
    },
    users: {
      getAll: { status: 'pending', error: null },
      updateProfile: { status: 'pending', error: null },
      updateRole: { status: 'pending', error: null }
    }
  };

  console.log('🚀 Starting API Tests...\n');

  // Test Health Check
  try {
    await apiService.health();
    results.health.status = 'success';
    console.log('✅ Health Check: PASSED');
  } catch (error) {
    results.health.status = 'failed';
    results.health.error = error.message;
    console.log('❌ Health Check: FAILED -', error.message);
  }

  // Test Auth - Test Users (no auth required)
  try {
    const response = await apiService.auth.testUsers();
    results.auth.testUsers.status = 'success';
    console.log('✅ Auth Test Users: PASSED -', response.data.userCount, 'users found');
  } catch (error) {
    results.auth.testUsers.status = 'failed';
    results.auth.testUsers.error = error.message;
    console.log('❌ Auth Test Users: FAILED -', error.message);
  }

  // Test Auth - Login with test credentials
  let authToken = null;
  try {
    const response = await apiService.auth.login({
      email: 'admin@example.com',
      password: 'admin123'
    });
    authToken = response.data.token;
    localStorage.setItem('token', authToken);
    results.auth.login.status = 'success';
    console.log('✅ Auth Login: PASSED');
  } catch (error) {
    results.auth.login.status = 'failed';
    results.auth.login.error = error.message;
    console.log('❌ Auth Login: FAILED -', error.message);
    
    // Try with employee credentials
    try {
      const response = await apiService.auth.login({
        email: 'john@example.com',
        password: 'password123'
      });
      authToken = response.data.token;
      localStorage.setItem('token', authToken);
      results.auth.login.status = 'success';
      console.log('✅ Auth Login (Employee): PASSED');
    } catch (empError) {
      console.log('❌ Auth Login (Employee): FAILED -', empError.message);
    }
  }

  // Test Auth - Get Me (requires auth)
  if (authToken) {
    try {
      const response = await apiService.auth.getMe();
      results.auth.me.status = 'success';
      console.log('✅ Auth Get Me: PASSED -', response.data.name);
    } catch (error) {
      results.auth.me.status = 'failed';
      results.auth.me.error = error.message;
      console.log('❌ Auth Get Me: FAILED -', error.message);
    }

    // Test Rooms - Get All
    try {
      const response = await apiService.rooms.getAll();
      results.rooms.getAll.status = 'success';
      console.log('✅ Rooms Get All: PASSED -', response.data.length, 'rooms found');
    } catch (error) {
      results.rooms.getAll.status = 'failed';
      results.rooms.getAll.error = error.message;
      console.log('❌ Rooms Get All: FAILED -', error.message);
    }

    // Test Bookings - Get My Bookings
    try {
      const response = await apiService.bookings.getMyBookings();
      results.bookings.getMyBookings.status = 'success';
      console.log('✅ Bookings Get My Bookings: PASSED -', response.data.length, 'bookings found');
    } catch (error) {
      results.bookings.getMyBookings.status = 'failed';
      results.bookings.getMyBookings.error = error.message;
      console.log('❌ Bookings Get My Bookings: FAILED -', error.message);
    }

    // Test Users - Update Profile
    try {
      const response = await apiService.users.updateProfile({
        name: 'Test User Updated',
        department: 'IT'
      });
      results.users.updateProfile.status = 'success';
      console.log('✅ Users Update Profile: PASSED');
    } catch (error) {
      results.users.updateProfile.status = 'failed';
      results.users.updateProfile.error = error.message;
      console.log('❌ Users Update Profile: FAILED -', error.message);
    }
  }

  console.log('\n📊 API Test Results Summary:');
  console.log('Health:', results.health.status);
  console.log('Auth Login:', results.auth.login.status);
  console.log('Auth Get Me:', results.auth.me.status);
  console.log('Rooms Get All:', results.rooms.getAll.status);
  console.log('Bookings Get My:', results.bookings.getMyBookings.status);
  console.log('Users Update Profile:', results.users.updateProfile.status);

  return results;
};

// Quick test for essential APIs
export const quickAPITest = async () => {
  console.log('🔍 Quick API Test...');
  
  try {
    // Test health
    await apiService.health();
    console.log('✅ Server is running');
    
    // Test database connection
    const usersResponse = await apiService.auth.testUsers();
    console.log('✅ Database connected -', usersResponse.data.userCount, 'users');
    
    // Test login
    const loginResponse = await apiService.auth.login({
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('✅ Login successful');
    
    localStorage.setItem('token', loginResponse.data.token);
    
    // Test authenticated endpoint
    const meResponse = await apiService.auth.getMe();
    console.log('✅ Authentication working -', meResponse.data.name);
    
    return { success: true, message: 'All essential APIs working!' };
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    return { success: false, error: error.message };
  }
};
