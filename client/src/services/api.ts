const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Startup API
export const startupAPI = {
  // Get all startups with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    industry?: string;
    stage?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/api/startups?${queryParams}`);
    return handleResponse(response);
  },

  // Get single startup by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/startups/${id}`);
    return handleResponse(response);
  },

  // Create new startup
  create: async (startupData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/startups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(startupData),
    });
    return handleResponse(response);
  },

  // Update startup
  update: async (id: string, startupData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/startups/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(startupData),
    });
    return handleResponse(response);
  },

  // Delete startup
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/startups/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get startups by founder
  getByFounder: async (founderId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/startups/founder/${founderId}`);
    return handleResponse(response);
  },
};

// Investment API
export const investmentAPI = {
  // Get all investments with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    investorId?: string;
    startupId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/api/investments?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get single investment by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/investments/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create new investment
  create: async (investmentData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/investments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(investmentData),
    });
    return handleResponse(response);
  },

  // Update investment status
  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/investments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(response);
  },

  // Get user's investments
  getMy: async () => {
    const response = await fetch(`${API_BASE_URL}/api/investments/my`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get investment statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/investments/stats`);
    return handleResponse(response);
  },
};

// User API (extending existing auth)
export const userAPI = {
  // Get user profile
  getProfile: async (userId?: string) => {
    const endpoint = userId ? `/api/users/${userId}` : '/auth/me';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

// Export all APIs
export const api = {
  startups: startupAPI,
  investments: investmentAPI,
  users: userAPI,
};

export default api;
