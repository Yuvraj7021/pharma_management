// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Store auth token
let authToken = localStorage.getItem('pharmaflow_token') || null;

// API Helper
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: async (email, password, name, role = 'staff') => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role })
    });
    authToken = data.token;
    localStorage.setItem('pharmaflow_token', data.token);
    return data;
  },

  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    authToken = data.token;
    localStorage.setItem('pharmaflow_token', data.token);
    return data;
  },

  logout: () => {
    authToken = null;
    localStorage.removeItem('pharmaflow_token');
  },

  getProfile: () => apiCall('/auth/me')
};

// Medicines API
export const medicinesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/medicines${query ? '?' + query : ''}`);
  },

  getById: (id) => apiCall(`/medicines/${id}`),

  create: (data) => apiCall('/medicines', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  update: (id, data) => apiCall(`/medicines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  delete: (id) => apiCall(`/medicines/${id}`, { method: 'DELETE' }),

  getExpiring: () => apiCall('/medicines/expiring'),
  getExpired: () => apiCall('/medicines/expired'),
  getLowStock: () => apiCall('/medicines/low-stock')
};

// Patients API
export const patientsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/patients${query ? '?' + query : ''}`);
  },

  getById: (id) => apiCall(`/patients/${id}`),

  create: (data) => apiCall('/patients', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  update: (id, data) => apiCall(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  delete: (id) => apiCall(`/patients/${id}`, { method: 'DELETE' }),

  getPrescriptions: (id) => apiCall(`/patients/${id}/prescriptions`)
};

// Suppliers API
export const suppliersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/suppliers${query ? '?' + query : ''}`);
  },

  getById: (id) => apiCall(`/suppliers/${id}`),

  create: (data) => apiCall('/suppliers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  update: (id, data) => apiCall(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  delete: (id) => apiCall(`/suppliers/${id}`, { method: 'DELETE' }),

  getMedicines: (id) => apiCall(`/suppliers/${id}/medicines`)
};

// Prescriptions API
export const prescriptionsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/prescriptions${query ? '?' + query : ''}`);
  },

  getById: (id) => apiCall(`/prescriptions/${id}`),

  create: (data) => apiCall('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  fulfill: (id) => apiCall(`/prescriptions/${id}/fulfill`, { method: 'POST' })
};

// Alerts API
export const alertsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/alerts${query ? '?' + query : ''}`);
  },

  getUnreadCount: () => apiCall('/alerts/unread'),

  markAsRead: (id) => apiCall(`/alerts/${id}/read`, { method: 'PUT' }),

  markAsResolved: (id) => apiCall(`/alerts/${id}/resolve`, { method: 'PUT' }),

  generate: () => apiCall('/alerts/generate', { method: 'POST' })
};
