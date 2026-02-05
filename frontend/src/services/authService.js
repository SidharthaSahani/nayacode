// Auth service to handle authentication-related API calls

const API_BASE_URL = 'http://localhost:3002/api';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors specifically
      if (data.errors) {
        throw new Error(Object.values(data.errors).join(', '));
      }
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include' // Include cookies in requests
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get dashboard data (protected route)
export const getDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      credentials: 'include', // Include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard data');
    }

    return data;
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // Call logout endpoint to clear cookie on server
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Clear local storage
  localStorage.removeItem('currentUser');
};